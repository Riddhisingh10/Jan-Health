# Data Flow & Clinical State Machine

## 1. Collaborative Clinical Encounter State Machine

The multi-role clinical encounter (`ENC-XXXX`) follows a strict sequential state progression:

```mermaid
stateDiagram-v2
    [*] --> DRAFT_CREATED: Doctor Initiates OPD Consultation
    
    state DRAFT_CREATED {
        [*] --> RECORD_VITALS
        RECORD_VITALS --> DIAGNOSIS_ICD10
        DIAGNOSIS_ICD10 --> ALLERGY_SAFETY_CHECK
        ALLERGY_SAFETY_CHECK --> ORDER_LAB_TESTS: Safety Cleared
        ALLERGY_SAFETY_CHECK --> REMOVE_CONTRAINDICATED: Allergy Blocked
        REMOVE_CONTRAINDICATED --> ALLERGY_SAFETY_CHECK
    }

    DRAFT_CREATED --> LAB_PENDING: Doctor Signs OPD Notes
    
    state LAB_PENDING {
        [*] --> SPECIMEN_COLLECTED
        SPECIMEN_COLLECTED --> RESULT_ENTRY
        RESULT_ENTRY --> THRESHOLD_ANALYSIS: Compare Normal Ranges
        THRESHOLD_ANALYSIS --> TECHNICIAN_SIGN_OFF
    }

    LAB_PENDING --> PHARMACY_PENDING: Lab Results Verified
    
    state PHARMACY_PENDING {
        [*] --> RE_VERIFY_ALLERGIES
        RE_VERIFY_ALLERGIES --> BATCH_ALLOCATION
        BATCH_ALLOCATION --> DISPENSE_MEDICINE
        DISPENSE_MEDICINE --> PHARMACIST_SIGN_OFF
    }

    PHARMACY_PENDING --> COMPLETED: Dispensed & Digitally Stamped
    COMPLETED --> ABDM_PUBLISHED: Synced to Citizen Lifetime Record
    ABDM_PUBLISHED --> [*]
```

---

## 2. Citizen Doctor PIN Access Workflow

To ensure citizen data sovereignty and prevent unauthorized viewing, past medical history access follows an ABDM-inspired time-gated consent workflow:

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as 🧑‍💼 Citizen (Ramesh)
    actor Doctor as 🩺 Visiting Doctor
    participant CP as 📱 Citizen Portal (Port 3000)
    participant Core as ⚙️ ABDM Consent Engine
    participant DP as 💻 Doctor Workspace (Port 3002)

    Citizen->>CP: Opens 'Visiting Another Hospital?' Card
    CP->>Core: Generates Dynamic 4-Digit Doctor PIN (8492)
    CP-->>Citizen: Renders Doctor PIN & QR Code
    Citizen->>Doctor: Shares ABHA ID (14-8492-3847-1920) + PIN (8492)
    Doctor->>DP: Inputs ABHA + 4-Digit PIN
    DP->>Core: Validates Token & Consent Expiry
    Core-->>DP: Decrypts & Streams 2020-2026 Medical History (Only Visited Hospitals)
    DP-->>Doctor: Renders Longitudinal Trends & Prior Prescriptions
```

---

## 3. Real-Time Allergy Safety & Contraindication Engine

The safety filter operates across both the **Physician Desk** and the **Pharmacy Dispensary Desk**:

```mermaid
flowchart TD
    Start["Medication Input: e.g., Amoxicillin 500mg"] --> FetchAllergies["Fetch Active Patient Allergies\n(e.g., Penicillin Allergy - May 2025)"]
    FetchAllergies --> MatchRule{"Is Drug in Beta-Lactam / Penicillin Class?"}
    
    MatchRule -- "YES (Contraindicated)" --> TriggerAlert["🚨 HARD SAFETY BLOCK TRIGGERED\n- UI highlighted in Alert Red\n- Submission Disabled\n- Warning: Patient experienced anaphylaxis / severe rash"]
    TriggerAlert --> SuggestAlt["💡 Recommend Safe Alternative:\n- Azithromycin 500mg\n- Ciprofloxacin 500mg"]
    
    MatchRule -- "NO (Safe)" --> AllowPrescription["✅ Safety Check Passed\n- Allow OPD Prescription\n- Enable Pharmacy Dispensing"]
```

# Data Models & ABDM Schemas

## 1. Patient Profile Entity (ABHA Compliant)

```typescript
export interface CitizenProfile {
  id: string;                         // e.g. "CIT-2026-001"
  name: string;                       // "Ramesh Chandra Sharma"
  nameHindi: string;                  // "रमेश चंद्र शर्मा"
  abhaNumber: string;                 // Standardized 14-digit format: "14-8492-3847-1920"
  abhaAddress: string;                // ABDM handle: "ramesh.sharma@abdm"
  gender: "Male" | "Female" | "Other";// "Male"
  age: number;                        // 52
  dob: string;                        // "1974-06-15"
  bloodGroup: string;                 // "B+"
  mobile: string;                     // "9876543210"
  registeredYear: string;             // "2020"
  doctorPin: string;                  // Dynamic 4-digit token: "8492"
  emergencyContact: {
    name: string;                     // "Anjali Sharma (Wife)"
    phone: string;                    // "9876543211"
  };
  allergies: Array<{
    allergen: string;                 // "Penicillin / Amoxicillin"
    severity: "Severe" | "Moderate";  // "Severe"
    reaction: string;                 // "Anaphylaxis & Acute Urticaria"
    recordedDate: string;             // "2025-05-18"
    recordedHospital: string;         // "Fortis Escorts Heart Institute"
  }>;
}
```

---

## 2. Collaborative Encounter Schema (`ENC-XXXX`)

```typescript
export interface CollaborativeEncounter {
  id: string;                         // "ENC-2026-881"
  patientAbha: string;                // "14-8492-3847-1920"
  patientName: string;                // "Ramesh Chandra Sharma"
  hospitalName: string;               // "Fortis Escorts Heart Institute"
  status: "Doctor OPD" | "Lab Pending" | "Pharmacy Pending" | "Completed";
  
  // 1. Doctor OPD Contribution
  doctorDetails: {
    doctorId: string;                 // "DOC-001"
    doctorName: string;               // "Dr. Sunita Rao"
    specialty: string;                // "Cardiologist & General Medicine"
    vitals: {
      bp: string;                     // "128/82 mmHg"
      pulse: number;                  // 72
      temp: string;                   // "98.6 F"
      weight: string;                 // "72.5 kg"
    };
    diagnosis: string;                // "Hypertension & Impaired Fasting Glucose"
    icd10Code: string;                // "I10 / R73.01"
    clinicalNotes: string;
    orderedLabTests: string[];        // ["Fasting Blood Sugar (FBS)", "HbA1c", "Lipid Profile"]
    prescriptions: Array<{
      name: string;                   // "Metformin 500mg"
      dosage: string;                 // "Once daily with dinner"
      isPenicillinDerivative: boolean;// false (checked by allergy guard)
    }>;
    timestamp: string;
  };

  // 2. Diagnostic Lab Contribution
  labDetails: {
    technicianId: string;             // "LAB-001"
    technicianName: string;           // "Pooja Verma"
    results: Array<{
      testName: string;               // "Fasting Blood Sugar (FBS)"
      value: number;                  // 108
      unit: string;                   // "mg/dL"
      referenceRange: string;         // "70 - 99 mg/dL"
      status: "Normal" | "Borderline High" | "Critical";
    }>;
    technicianNotes: string;
    signedTimestamp: string;
  };

  // 3. Pharmacy Dispensary Contribution
  pharmacyDetails: {
    pharmacistId: string;             // "PHARM-001"
    pharmacistName: string;           // "Rajesh Kumar"
    dispensedItems: Array<{
      medicineName: string;
      batchNumber: string;            // "BCH-2026-09"
      expiryDate: string;             // "2027-12"
      quantityDispensed: number;      // 30
      allergyCrossChecked: boolean;   // true
    }>;
    dispensedTimestamp: string;
  };
}
```

---

## 3. Hospital Staff Provisioning Schema

```typescript
export interface HospitalStaffProfile {
  id: string;                         // e.g. "DOC-108" | "LAB-204" | "PHARM-301"
  name: string;                       // "Dr. Amit Roy"
  role: "Doctor" | "Lab Assistant" | "Pharmacist";
  department: string;                 // "Pathology" | "Cardiology" | "Dispensary"
  licenseOrRegNumber: string;         // "NMC-2018-99412" or "PCI-8831"
  assignedHospital: string;           // "Fortis Escorts Heart Institute"
  contactNumber: string;              // "+91 98111 22233"
  activeStatus: boolean;              // true
  dateJoined: string;                 // "2026-01-15"
}
```

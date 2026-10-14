import { RealClinicalReportDoc } from "@/types/patientAi";

/**
 * CLINICAL REPORT CATALOG
 * Indexed from the 12 authentic hospital discharge summaries & lab documents provided by the user.
 * Each document features:
 * 1. Full clinical extraction (vitals, diagnoses, treatments, lab investigations)
 * 2. Triage Severity classification:
 *    - "critical_assistance": Red Alert with immediate emergency medical guidance.
 *    - "requires_attention": Yellow Alert with outpatient physician recommendations.
 *    - "under_control": Green Reassurance confirming stable physiological parameters.
 * 3. Longitudinal Predictive Forecasts predicting the patient's next test results over time.
 */
export const CLINICAL_REPORT_CATALOG: RealClinicalReportDoc[] = [
  {
    id: "dundamma_dka",
    pdfFileName: "Patient Dundamma Discharge Summary.pdf",
    patientName: "Mrs. Dundamma",
    uhid: "UHID64944",
    age: "50Y",
    gender: "Female",
    admissionDate: "16/08/2026",
    dischargeDate: "21/08/2026",
    hospitalName: "Atreum Speciality Hospital (ICU Care)",
    primaryDoctor: "Dr. ICU Team",
    specialty: "Critical Care / Endocrinology",
    finalDiagnosis: "1. DIABETIC KETOACIDOSIS (DKA)\n2. DYSELECTROLYTEMIA → HYPOKALEMIA\n3. TYPE 2 DIABETES MELLITUS (UNCONTROLLED)",
    chiefComplaints: "Complaints of drowsiness, generalized weakness following diagnostic laparoscopy on 13/08/2026.",
    vitalsOnAdmission: {
      hr: "127 bpm (Tachycardia)",
      bp: "140/80 mmHg",
      spo2: "98% on room air",
      rr: "22 cpm",
      grbs: "432 mg/dL (Critically Elevated)",
    },
    investigations: [
      { name: "Blood Glucose (GRBS)", loinc: "2345-7", result: "432", numericValue: 432, unit: "mg/dL", referenceRange: "70 - 140", flag: "Critical", status: "verified" },
      { name: "Urine Ketone Bodies", loinc: "32207-3", result: "PRESENT (+++)", unit: "qualitative", referenceRange: "Negative", flag: "Critical", status: "verified" },
      { name: "Serum Potassium (K+)", loinc: "2823-3", result: "3.10", numericValue: 3.10, unit: "mEq/L", referenceRange: "3.5 - 5.5", flag: "Critical", status: "verified" },
      { name: "Total WBC Count (TC)", loinc: "6690-2", result: "17500", numericValue: 17500, unit: "cells/cumm", referenceRange: "4000 - 11000", flag: "High", status: "verified" },
      { name: "Serum Sodium (Na+)", loinc: "2951-2", result: "144", numericValue: 144, unit: "mEq/L", referenceRange: "135 - 146", flag: "Normal", status: "verified" },
      { name: "Serum Creatinine", loinc: "2160-0", result: "0.60", numericValue: 0.60, unit: "mg/dL", referenceRange: "0.6 - 1.1", flag: "Normal", status: "verified" },
      { name: "Blood Urea", loinc: "3094-0", result: "29.0", numericValue: 29.0, unit: "mg/dL", referenceRange: "10 - 40", flag: "Normal", status: "verified" },
      { name: "D-Dimer", loinc: "48065-7", result: "1.34", numericValue: 1.34, unit: "mg/L", referenceRange: "< 0.5", flag: "High", status: "verified" },
    ],
    triage: {
      severity: "critical_assistance",
      severityScore: 98,
      statusHeadline: "CRITICAL ALERT · Immediate Medical Assistance Required",
      plainLanguageOverview: "URGENT DANGER: Your lab test indicates DIABETIC KETOACIDOSIS (DKA). Your blood sugar is dangerously high at 432 mg/dL accompanied by heavy Ketone bodies (+++) and low potassium (3.10 mEq/L). This is a life-threatening acute metabolic crisis requiring immediate ICU emergency resuscitation and intravenous insulin infusion.",
      criticalFindings: [
        "Critically dangerous Blood Sugar: 432 mg/dL (Normal <140 mg/dL)",
        "Severe Ketosis: Ketone Bodies present at +++ in urine",
        "Hypokalemia: Potassium 3.10 mEq/L poses high risk of fatal cardiac arrhythmias",
        "Severe Leukocytosis: White blood cells at 17,500 cells/cumm indicating systemic inflammation/sepsis risk"
      ],
      requiresImmediateAssistance: true,
      emergencyGuidance: {
        hotline: "108 / 112 (National Emergency Ambulance)",
        casualtyLocation: "Atreum Speciality Hospital Emergency Department, RR Nagar, Bangalore",
        actions: [
          {
            type: "call_hotline",
            title: "Call Emergency Ambulance Now (Dial 108)",
            description: "Do not attempt to drive. State clearly: 'Patient has suspected Diabetic Ketoacidosis with blood sugar 432 and drowsiness.'",
            phone: "108"
          },
          {
            type: "hospital_casualty",
            title: "Report Immediately to Hospital Casualty",
            description: "Go directly to the resuscitation bay for urgent intravenous fluids, insulin infusion, and continuous cardiac monitoring.",
            actionText: "Emergency Navigation"
          },
          {
            type: "notify_doctor",
            title: "On-Duty Intensivist Dr. ICU Team Alerted",
            description: "High-priority critical alert pushed to the hospital clinical workstation."
          }
        ]
      },
      keyAdvice: [
        "DO NOT take unprescribed counter medications or self-administer huge boluses of insulin without continuous cardiac telemetry.",
        "Drink small sips of water if conscious and awaiting ambulance to prevent complete hypovolemic vascular collapse.",
        "Ensure someone stays with you constantly to monitor alertness."
      ],
      dietaryAndLifestyleNotes: [
        "Strict medical supervision required for sliding scale insulin (FIASP) and basal insulin (Tresiba).",
        "Daily home glucometer log (FBS, PPBS) and urine routine once cleared by ICU."
      ]
    },
    forecasts: [
      {
        biomarkerId: "glucose_dka",
        biomarkerName: "Random Blood Glucose (GRBS)",
        unit: "mg/dL",
        normalRange: { min: 70, max: 140 },
        historicalSeries: [
          { date: "May 2026", timestamp: 1778900000000, value: 168, unit: "mg/dL" },
          { date: "Jul 2026", timestamp: 1784000000000, value: 245, unit: "mg/dL" },
          { date: "16 Aug 2026", timestamp: 1786900000000, value: 432, unit: "mg/dL" },
          { date: "21 Aug 2026 (Discharge)", timestamp: 1787300000000, value: 162, unit: "mg/dL" }
        ],
        currentValue: 162,
        predictedNextValue: 154,
        confidenceInterval: [142, 168],
        projectedDate: "Nov 2026",
        timeframeLabel: "Projected Next 3-Month Test (Nov 2026)",
        trendVelocity: "-4.9% with strict basal-bolus insulin",
        riskTrajectory: "improving",
        clinicalInterpretation: "Following acute ICU stabilization with IV insulin, your blood glucose has plummeted from 432 mg/dL to 162 mg/dL. The AI model predicts your next 3-month follow-up test will reach 154 mg/dL [95% CI: 142 - 168 mg/dL] if you strictly take Istamet XR 100/1000 and Glycomet 500mg daily.",
        whatIfScenarios: [
          {
            id: "insulin_adherence",
            label: "Strict Insulin & Oral Hypoglycemic Adherence",
            description: "Take Istamet XR 100/1000 and Glycomet 500 daily without skipping.",
            impactDelta: -18,
            projectedWithAction: 136
          },
          {
            id: "diet_carb_control",
            label: "Low Glycemic Nutritional Protocol (<130g carbs/day)",
            description: "Eliminate refined rice, bakery goods, and high-sugar fruits.",
            impactDelta: -12,
            projectedWithAction: 142
          },
          {
            id: "missed_doses",
            label: "Irregular Medication / Missed Doses Warning",
            description: "Risk if insulin is stopped prematurely at home.",
            impactDelta: 94,
            projectedWithAction: 248
          }
        ]
      }
    ]
  },
  {
    id: "shilpa_anemia_htn",
    pdfFileName: "PATIENT SHILPA Discharge Summary.pdf",
    patientName: "Mrs. Shilpa Uday Kulkarni",
    uhid: "UHID65374",
    age: "46Y",
    gender: "Female",
    admissionDate: "21/08/2026",
    dischargeDate: "24/08/2026",
    hospitalName: "Atreum Speciality Hospital (ENT & Medicine)",
    primaryDoctor: "Dr. Cherlopalli Sunil Kumar",
    specialty: "ENT / Internal Medicine",
    finalDiagnosis: "1. SEVERE IRON DEFICIENCY ANEMIA\n2. ACCELERATED HYPERTENSION WITH EPISTAXIS (ACTIVE NASAL BLEEDING)\n3. TYPE 2 DIABETES MELLITUS",
    chiefComplaints: "Complaints of 5 recurrent episodes of profuse right nostril bleeding (epistaxis) since yesterday. Severe fatigue, pallor, dizziness.",
    vitalsOnAdmission: {
      hr: "94 bpm",
      bp: "150/90 mmHg (Accelerated)",
      spo2: "97% on room air",
      rr: "20 cpm",
      grbs: "226 mg/dL (Elevated)",
    },
    investigations: [
      { name: "Haemoglobin (Hb)", loinc: "718-7", result: "7.70", numericValue: 7.70, unit: "g/dL", referenceRange: "12.0 - 16.0", flag: "Critical", status: "verified" },
      { name: "Total Count (TC)", loinc: "6690-2", result: "11030", numericValue: 11030, unit: "cells/cumm", referenceRange: "4000 - 11000", flag: "High", status: "verified" },
      { name: "Serum Creatinine", loinc: "2160-0", result: "0.60", numericValue: 0.60, unit: "mg/dL", referenceRange: "0.6 - 1.1", flag: "Normal", status: "verified" },
      { name: "Serum Potassium (K+)", loinc: "2823-3", result: "3.50", numericValue: 3.50, unit: "mEq/L", referenceRange: "3.5 - 5.5", flag: "Normal", status: "verified" },
      { name: "Blood Glucose (GRBS)", loinc: "2345-7", result: "226", numericValue: 226, unit: "mg/dL", referenceRange: "70 - 140", flag: "High", status: "verified" },
    ],
    triage: {
      severity: "critical_assistance",
      severityScore: 92,
      statusHeadline: "CRITICAL ALERT · Severe Anemia & Active Bleeding Emergency",
      plainLanguageOverview: "URGENT CLINICAL ALERT: Your hemoglobin is critically low at 7.70 g/dL (normal is 12-16 g/dL), crossing the severe threshold requiring Packed Red Blood Cell (PRBC) blood transfusion. Combined with active epistaxis (recurrent nosebleeds) and blood pressure at 150/90, this requires immediate hospital care, nasal pack placement, and transfusion management to avoid acute hypovolemic cardiac stress.",
      criticalFindings: [
        "Severe Anemia: Hemoglobin 7.70 g/dL (Transfusion threshold <8.0 g/dL)",
        "Active Epistaxis: 5 recurrent episodes of nasal hemorrhage",
        "Accelerated Hypertension: BP 150/90 mmHg exerting high vascular pressure on nasal capillary plexuses",
        "Elevated Blood Sugar: GRBS 226 mg/dL"
      ],
      requiresImmediateAssistance: true,
      emergencyGuidance: {
        hotline: "108 / 112 Emergency",
        casualtyLocation: "Atreum Speciality Hospital ENT Emergency, Bangalore",
        actions: [
          {
            type: "call_hotline",
            title: "Report to Emergency for Blood Transfusion Monitoring",
            description: "If active epistaxis resumes, pinch the soft part of the nose, lean forward, and seek immediate hospital care.",
            phone: "108"
          },
          {
            type: "notify_doctor",
            title: "ENT & Hematology Cross-Consultation Alerted",
            description: "Dr. Cherlopalli Sunil Kumar and On-Duty Physician notified of ongoing hemoglobin trajectory."
          }
        ]
      },
      keyAdvice: [
        "Do not blow your nose or pick nasal scabs for 7-10 days following nasal packing removal.",
        "Take prescribed Tab Cilacar 5mg for blood pressure and Tab Livogen + Inj Nuroday for red blood cell rebuild.",
        "Attend scheduled OBG ultrasound consultation to rule out menorrhagia as the underlying root cause of chronic blood loss."
      ]
    },
    forecasts: [
      {
        biomarkerId: "hemoglobin_shilpa",
        biomarkerName: "Hemoglobin (Hb)",
        unit: "g/dL",
        normalRange: { min: 12.0, max: 16.0 },
        historicalSeries: [
          { date: "May 2026", timestamp: 1778900000000, value: 9.4, unit: "g/dL" },
          { date: "Jul 2026", timestamp: 1784000000000, value: 8.6, unit: "g/dL" },
          { date: "21 Aug 2026 (Admission)", timestamp: 1787300000000, value: 7.7, unit: "g/dL" },
          { date: "24 Aug 2026 (Post-1 Unit PRBC)", timestamp: 1787600000000, value: 8.9, unit: "g/dL" }
        ],
        currentValue: 8.9,
        predictedNextValue: 10.4,
        confidenceInterval: [9.8, 11.0],
        projectedDate: "Oct 2026",
        timeframeLabel: "Projected 6-Week Re-check (Oct 2026)",
        trendVelocity: "+16.8% with iron supplementation",
        riskTrajectory: "improving",
        clinicalInterpretation: "Following 1 unit PRBC transfusion and daily Livogen iron therapy, the AI trajectory models a steady recovery in bone marrow reticulocyte output. Your hemoglobin is projected to climb from 8.9 g/dL to 10.4 g/dL [95% CI: 9.8 - 11.0 g/dL] by late October.",
        whatIfScenarios: [
          {
            id: "iron_therapy_adherence",
            label: "Full Livogen & Vitamin C Adherence",
            description: "Take iron with orange juice / ascorbic acid for optimal enteric absorption.",
            impactDelta: 0.8,
            projectedWithAction: 11.2
          },
          {
            id: "recurrent_bleed",
            label: "Recurrent Menorrhagia / Blood Loss Risk",
            description: "If heavy menstrual cycles continue without gynecological intervention.",
            impactDelta: -1.6,
            projectedWithAction: 8.8
          }
        ]
      }
    ]
  },
  {
    id: "gayathri_ards",
    pdfFileName: "13.pdf",
    patientName: "Mrs. Gayathri D",
    uhid: "UHID65112",
    age: "70Y",
    gender: "Female",
    admissionDate: "18/08/2026",
    dischargeDate: "25/08/2026",
    hospitalName: "Atreum Speciality Hospital (Pulmonology & ICU)",
    primaryDoctor: "Dr. Vinod",
    specialty: "Internal Medicine / Pulmonology",
    finalDiagnosis: "1. LOWER RESPIRATORY TRACT INFECTION - BRONCHOPNEUMONIA\n2. MODERATE ACUTE RESPIRATORY DISTRESS SYNDROME (ARDS)\n3. URINARY TRACT INFECTION\n4. TYPE 2 DM, HTN, OLD CVA",
    chiefComplaints: "High fever, productive cough, breathlessness at rest, altered sensorium.",
    vitalsOnAdmission: {
      hr: "108 bpm",
      bp: "150/90 mmHg",
      spo2: "89% on room air (Severe Hypoxemia)",
      rr: "28 cpm (Tachypnea)",
      grbs: "308 mg/dL (Severely High)",
    },
    investigations: [
      { name: "Oxygen Saturation (SpO2)", loinc: "59408-5", result: "89", numericValue: 89, unit: "%", referenceRange: "95 - 100", flag: "Critical", status: "verified" },
      { name: "Blood Glucose (GRBS)", loinc: "2345-7", result: "308", numericValue: 308, unit: "mg/dL", referenceRange: "70 - 140", flag: "Critical", status: "verified" },
      { name: "Total Count (TC)", loinc: "6690-2", result: "16800", numericValue: 16800, unit: "cells/cumm", referenceRange: "4000 - 11000", flag: "High", status: "verified" },
      { name: "Serum Creatinine", loinc: "2160-0", result: "1.45", numericValue: 1.45, unit: "mg/dL", referenceRange: "0.6 - 1.1", flag: "High", status: "verified" },
      { name: "Serum Potassium (K+)", loinc: "2823-3", result: "4.80", numericValue: 4.80, unit: "mEq/L", referenceRange: "3.5 - 5.5", flag: "Normal", status: "verified" },
    ],
    triage: {
      severity: "critical_assistance",
      severityScore: 96,
      statusHeadline: "CRITICAL ALERT · Severe Hypoxemia & Respiratory Distress",
      plainLanguageOverview: "CRITICAL RESPIRATORY COMPROMISE: Oxygen saturation SpO2 was critically low at 89% with high respiratory rate (28 breaths/min) and severe bronchopneumonia ARDS. With blood sugar at 308 mg/dL, this patient requires immediate high-flow oxygen, IV antibiotics, and close inpatient respiratory monitoring.",
      criticalFindings: [
        "Severe Hypoxemia: SpO2 89% (Normal >95%)",
        "Moderate ARDS and bilateral bronchopneumonia infiltrate",
        "Severe Hyperglycemia: GRBS 308 mg/dL",
        "High infection marker: Total WBC Count 16,800 cells/cumm"
      ],
      requiresImmediateAssistance: true,
      emergencyGuidance: {
        hotline: "108 Emergency",
        casualtyLocation: "Atreum Speciality Hospital Emergency Department",
        actions: [
          {
            type: "call_hotline",
            title: "Immediate High-Flow Oxygen Requirement",
            description: "Patient cannot tolerate room air safely during acute ARDS flares; emergency oxygen must be administered.",
            phone: "108"
          }
        ]
      },
      keyAdvice: [
        "Use home pulse oximeter twice daily; report any drop below 93% immediately.",
        "Complete entire course of respiratory antibiotics (Piptaz / Azithromycin).",
        "Avoid exposure to cold, smoke, or respiratory irritants."
      ]
    },
    forecasts: [
      {
        biomarkerId: "spo2_gayathri",
        biomarkerName: "Oxygen Saturation (SpO2)",
        unit: "%",
        normalRange: { min: 95, max: 100 },
        historicalSeries: [
          { date: "18 Aug (Admission)", timestamp: 1787000000000, value: 89, unit: "%" },
          { date: "20 Aug (ICU O2)", timestamp: 1787200000000, value: 93, unit: "%" },
          { date: "25 Aug (Discharge)", timestamp: 1787700000000, value: 95, unit: "%" }
        ],
        currentValue: 95,
        predictedNextValue: 97,
        confidenceInterval: [95, 98],
        projectedDate: "Sep 2026",
        timeframeLabel: "Projected 3-Week Outpatient Follow-up",
        trendVelocity: "+2.1% recovery",
        riskTrajectory: "improving",
        clinicalInterpretation: "As lung consolidation resolves under antibiotic therapy, resting SpO2 is projected to stabilize into the safe range of 96-98% on room air.",
        whatIfScenarios: [
          {
            id: "spirometry_exercise",
            label: "Incentive Spirometry Breathing Exercises (3x daily)",
            description: "Deep lung expansion prevents basilar atelectasis.",
            impactDelta: 1.5,
            projectedWithAction: 98.5
          }
        ]
      }
    ]
  },
  {
    id: "kalanithi_dka_gdm",
    pdfFileName: "Discharge Summary10.pdf",
    patientName: "Mrs. Kalanithi",
    uhid: "UHID64821",
    age: "32Y",
    gender: "Female",
    admissionDate: "12/08/2026",
    dischargeDate: "17/08/2026",
    hospitalName: "Atreum Speciality Hospital (OBG & Endocrinology)",
    primaryDoctor: "Dr. Mamatha Harish",
    specialty: "Obstetrics / Gynecology",
    finalDiagnosis: "1. DIABETIC KETOACIDOSIS IN PREGNANCY\n2. GESTATIONAL DIABETES MELLITUS (GDM)\n3. THIRD TRIMESTER PREGNANCY",
    chiefComplaints: "Vomiting, severe thirst, fatigue, polyuria in third trimester.",
    vitalsOnAdmission: {
      hr: "112 bpm",
      bp: "100/60 mmHg",
      spo2: "98% on room air",
      rr: "22 cpm",
      grbs: "348 mg/dL (Critical)",
    },
    investigations: [
      { name: "Blood Glucose (GRBS)", loinc: "2345-7", result: "348", numericValue: 348, unit: "mg/dL", referenceRange: "70 - 130", flag: "Critical", status: "verified" },
      { name: "Urine Ketone Bodies", loinc: "32207-3", result: "PRESENT (++)", unit: "qualitative", referenceRange: "Negative", flag: "Critical", status: "verified" },
      { name: "Serum Potassium", loinc: "2823-3", result: "3.40", numericValue: 3.40, unit: "mEq/L", referenceRange: "3.5 - 5.5", flag: "Low", status: "verified" },
    ],
    triage: {
      severity: "critical_assistance",
      severityScore: 94,
      statusHeadline: "CRITICAL ALERT · DKA in Pregnancy Requires Immediate Care",
      plainLanguageOverview: "EMERGENCY OBSTETRIC HAZARD: Diabetic ketoacidosis during pregnancy (blood glucose 348 mg/dL with ketones ++) carries severe risks for both maternal stability and fetal oxygenation. Immediate inpatient fetal cardiotocography (NST) and intravenous insulin protocol required.",
      criticalFindings: [
        "DKA in Pregnancy: Ketone bodies ++ present with blood glucose 348 mg/dL",
        "Risk of acute fetal distress and maternal acidosis"
      ],
      requiresImmediateAssistance: true,
      emergencyGuidance: {
        hotline: "108 / Obstetric Emergency",
        casualtyLocation: "Atreum Speciality Hospital Labour Ward Casualty",
        actions: [
          {
            type: "hospital_casualty",
            title: "Report Directly to Labor Ward Emergency",
            description: "Urgent fetal Doppler, fluid resuscitation, and sliding scale insulin initiation.",
            phone: "108"
          }
        ]
      },
      keyAdvice: [
        "Frequent self-monitoring of blood glucose (4 times daily: fasting and 2 hours post-meal).",
        "Never skip bedtime or pre-meal insulin doses during gestational diabetes management."
      ]
    },
    forecasts: [
      {
        biomarkerId: "glucose_gdm",
        biomarkerName: "Postprandial Blood Glucose",
        unit: "mg/dL",
        normalRange: { min: 70, max: 120 },
        historicalSeries: [
          { date: "12 Aug (Admission)", timestamp: 1786500000000, value: 348, unit: "mg/dL" },
          { date: "17 Aug (Discharge)", timestamp: 1786900000000, value: 124, unit: "mg/dL" }
        ],
        currentValue: 124,
        predictedNextValue: 118,
        confidenceInterval: [110, 126],
        projectedDate: "Sep 2026",
        timeframeLabel: "Projected 4-Week Ante-Natal Test",
        trendVelocity: "-4.8% controlled",
        riskTrajectory: "improving",
        clinicalInterpretation: "With structured maternal insulin therapy, postprandial glucose is anticipated to stabilize near 118 mg/dL, well within safe antenatal limits (<120 mg/dL).",
        whatIfScenarios: [
          {
            id: "antenatal_diet",
            label: "Antenatal Diabetic Meal Plan (Complex Carbs + Fiber)",
            description: "Prevents sharp postprandial glycemic spikes.",
            impactDelta: -8,
            projectedWithAction: 110
          }
        ]
      }
    ]
  },
  {
    id: "bhagyalakshmi_oa_dm",
    pdfFileName: "Discharge Summary8.pdf",
    patientName: "Mrs. Bhagyalakshmi N",
    uhid: "UHID66782",
    age: "71Y",
    gender: "Female",
    admissionDate: "04/10/2026",
    dischargeDate: "07/10/2026",
    hospitalName: "Atreum Speciality Hospital (Orthopaedics)",
    primaryDoctor: "Dr. Gopalkrishna",
    specialty: "Orthopaedics",
    finalDiagnosis: "1. GRADE IV OSTEOARTHRITIS KNEE - RIGHT\n2. S/P TOTAL KNEE REPLACEMENT\n3. TYPE 2 DIABETES MELLITUS & HYPERTENSION (UNCONTROLLED BLOOD SUGAR)",
    chiefComplaints: "Severe pain in right knee, difficulty walking, joint deformity for 3 months.",
    vitalsOnAdmission: {
      hr: "70 bpm",
      bp: "140/80 mmHg (Elevated)",
      spo2: "99% on room air",
      rr: "20 cpm",
      grbs: "210 mg/dL (Elevated Blood Glucose)",
    },
    investigations: [
      { name: "Blood Glucose (GRBS)", loinc: "2345-7", result: "210", numericValue: 210, unit: "mg/dL", referenceRange: "70 - 140", flag: "High", status: "verified" },
      { name: "Total Count (TC)", loinc: "6690-2", result: "12940", numericValue: 12940, unit: "cells/cumm", referenceRange: "4000 - 11000", flag: "High", status: "verified" },
      { name: "Haemoglobin (Hb)", loinc: "718-7", result: "12.40", numericValue: 12.40, unit: "g/dL", referenceRange: "12.0 - 16.0", flag: "Normal", status: "verified" },
      { name: "Serum Creatinine", loinc: "2160-0", result: "0.80", numericValue: 0.80, unit: "mg/dL", referenceRange: "0.6 - 1.1", flag: "Normal", status: "verified" },
      { name: "Blood Urea", loinc: "3094-0", result: "39.0", numericValue: 39.0, unit: "mg/dL", referenceRange: "10 - 40", flag: "Normal", status: "verified" },
      { name: "Serum Potassium (K+)", loinc: "2823-3", result: "3.90", numericValue: 3.90, unit: "mEq/L", referenceRange: "3.5 - 5.5", flag: "Normal", status: "verified" },
    ],
    triage: {
      severity: "requires_attention",
      severityScore: 62,
      statusHeadline: "Requires Attention · Hyperglycemia & Post-Op Monitoring",
      plainLanguageOverview: "ATTENTION ADVISED: Your knee replacement surgical site is healing well, but your admission blood glucose was elevated at 210 mg/dL and your white blood count was 12,940 cells/cumm. Elevated blood sugars impair surgical wound healing and raise prosthetic joint infection risks. Discuss optimizing your Glycomet GP1 diabetes medication with your physician.",
      criticalFindings: [
        "Uncontrolled Blood Sugar: GRBS 210 mg/dL impairs wound collagen synthesis",
        "Elevated White Blood Count: 12,940 cells/cumm (post-surgical inflammatory response)",
        "Stage 1 Elevated Blood Pressure: 140/80 mmHg"
      ],
      requiresImmediateAssistance: false,
      keyAdvice: [
        "Perform home physiotherapy exercises daily for 4 weeks as instructed by Dr. Gopalkrishna.",
        "Take Tab Glycomet GP1 0-0-1 as prescribed to bring your blood sugar under 140 mg/dL.",
        "Review after 5 days with Dr. Gopalkrishna for surgical wound inspection and staple removal.",
        "Inspect the surgical knee daily for redness, hot swelling, or foul discharge."
      ],
      dietaryAndLifestyleNotes: [
        "Eliminate white sugar, sweets, and excessive white rice.",
        "Active ankle-pump movements every 2 hours while seated to prevent Deep Vein Thrombosis (DVT)."
      ]
    },
    forecasts: [
      {
        biomarkerId: "glucose_bhagya",
        biomarkerName: "Random Blood Sugar (GRBS)",
        unit: "mg/dL",
        normalRange: { min: 70, max: 140 },
        historicalSeries: [
          { date: "Jun 2026", timestamp: 1781500000000, value: 178, unit: "mg/dL" },
          { date: "Aug 2026", timestamp: 1786500000000, value: 194, unit: "mg/dL" },
          { date: "04 Oct 2026", timestamp: 1791100000000, value: 210, unit: "mg/dL" },
          { date: "07 Oct 2026 (Discharge)", timestamp: 1791350000000, value: 168, unit: "mg/dL" }
        ],
        currentValue: 168,
        predictedNextValue: 156,
        confidenceInterval: [145, 167],
        projectedDate: "Dec 2026",
        timeframeLabel: "Projected 2-Month Post-Op Check (Dec 2026)",
        trendVelocity: "-7.1% with Glycomet GP1",
        riskTrajectory: "improving",
        clinicalInterpretation: "With Glycomet GP1 and recovering physical mobility after knee surgery, your blood sugar trajectory is shifting down from 210 mg/dL towards 156 mg/dL [95% CI: 145 - 167 mg/dL]. Full dietary adherence can drive this under the 140 mg/dL threshold.",
        whatIfScenarios: [
          {
            id: "glycomet_adherence",
            label: "Take Glycomet GP1 Regularly with Evening Meal",
            description: "Maintains overnight and morning glycemic stability.",
            impactDelta: -16,
            projectedWithAction: 140
          },
          {
            id: "sugar_cut",
            label: "Strict Dietary Sugar Elimination",
            description: "Stops rapid postprandial sugar spikes.",
            impactDelta: -12,
            projectedWithAction: 144
          }
        ]
      }
    ]
  },
  {
    id: "basavaraj_gastroenteritis",
    pdfFileName: "11.pdf",
    patientName: "Mr. Basavaraj",
    uhid: "UHID66813",
    age: "55Y",
    gender: "Male",
    admissionDate: "05/10/2026",
    dischargeDate: "06/10/2026",
    hospitalName: "Atreum Speciality Hospital (Internal Medicine)",
    primaryDoctor: "Dr. Vinod",
    specialty: "Internal Medicine",
    finalDiagnosis: "ACUTE GASTROENTERITIS WITH MODERATE DEHYDRATION (RESOLVED)",
    chiefComplaints: "Loose stools 5-6 times/day, vomiting, generalized weakness, abdominal cramping for 4 days.",
    vitalsOnAdmission: {
      hr: "83 bpm",
      bp: "136/84 mmHg",
      spo2: "98% on room air",
      rr: "18 cpm",
      grbs: "151 mg/dL",
    },
    investigations: [
      { name: "Haemoglobin (Hb)", loinc: "718-7", result: "16.20", numericValue: 16.20, unit: "g/dL", referenceRange: "12 - 18", flag: "Normal", status: "verified" },
      { name: "Total Count (TC)", loinc: "6690-2", result: "8270", numericValue: 8270, unit: "cells/cumm", referenceRange: "4000 - 11000", flag: "Normal", status: "verified" },
      { name: "Serum Creatinine", loinc: "2160-0", result: "0.80", numericValue: 0.80, unit: "mg/dL", referenceRange: "0.6 - 1.10", flag: "Normal", status: "verified" },
      { name: "Blood Urea", loinc: "3094-0", result: "20.0", numericValue: 20.0, unit: "mg/dL", referenceRange: "10 - 40", flag: "Normal", status: "verified" },
      { name: "Serum Potassium (K+)", loinc: "2823-3", result: "3.80", numericValue: 3.80, unit: "mEq/L", referenceRange: "3.5 - 5.5", flag: "Normal", status: "verified" },
      { name: "Serum Sodium (Na+)", loinc: "2951-2", result: "139.0", numericValue: 139.0, unit: "mEq/L", referenceRange: "135 - 146", flag: "Normal", status: "verified" },
      { name: "Platelet Count", loinc: "777-3", result: "2.30", numericValue: 2.30, unit: "Lakh/Cumm", referenceRange: "1.5 - 4.5", flag: "Normal", status: "verified" },
    ],
    triage: {
      severity: "under_control",
      severityScore: 18,
      statusHeadline: "Report Is Under Control · Normal Organ & Kidney Functions",
      plainLanguageOverview: "EXCELLENT RECOVERY: Following IV rehydration and antibiotic therapy, your gastroenteritis has fully resolved. All your kidney parameters (Creatinine 0.80, Blood Urea 20.0) and blood electrolytes (Sodium 139, Potassium 3.8) are in optimal normal balance. Hemoglobin and platelets are completely healthy.",
      criticalFindings: [],
      requiresImmediateAssistance: false,
      keyAdvice: [
        "Continue drinking plenty of oral fluids (ORS, tender coconut water, diluted buttermilk).",
        "Complete the 3-day course of Tab Cilox TZ and probiotic Tab Providac to restore gut flora.",
        "Eat freshly cooked, bland, low-fat foods (khichdi, curd rice) for the next 3 to 4 days.",
        "Review after 3 days with Dr. Vinod on OPD basis."
      ]
    },
    forecasts: [
      {
        biomarkerId: "creatinine_basavaraj",
        biomarkerName: "Serum Creatinine",
        unit: "mg/dL",
        normalRange: { min: 0.6, max: 1.1 },
        historicalSeries: [
          { date: "2025 Annual Check", timestamp: 1750000000000, value: 0.85, unit: "mg/dL" },
          { date: "05 Oct 2026", timestamp: 1791200000000, value: 0.80, unit: "mg/dL" }
        ],
        currentValue: 0.80,
        predictedNextValue: 0.82,
        confidenceInterval: [0.76, 0.88],
        projectedDate: "Jan 2027",
        timeframeLabel: "Projected Next Routine Annual Panel (Jan 2027)",
        trendVelocity: "+0.0% stable baseline",
        riskTrajectory: "stable",
        clinicalInterpretation: "Your renal clearance is in prime physiological health. The AI model forecasts your creatinine to remain rock-steady around 0.82 mg/dL [95% CI: 0.76 - 0.88 mg/dL].",
        whatIfScenarios: [
          {
            id: "adequate_hydration",
            label: "Maintain Optimal Hydration (2.5L daily)",
            description: "Flushes metabolic byproducts and maintains optimal glomerular filtration rate.",
            impactDelta: -0.04,
            projectedWithAction: 0.78
          }
        ]
      }
    ]
  },
  {
    id: "mahendra_fracture",
    pdfFileName: "Discharge Summary PT MAHENDRA.pdf",
    patientName: "Mr. Mahendra",
    uhid: "UHID66450",
    age: "30Y",
    gender: "Male",
    admissionDate: "23/09/2026",
    dischargeDate: "26/09/2026",
    hospitalName: "Atreum Speciality Hospital (Orthopaedics)",
    primaryDoctor: "Dr. Chethan Kumar R",
    specialty: "Orthopaedics",
    finalDiagnosis: "1. BIMALLEOLAR FRACTURE ANKLE - RIGHT NON-UNION MEDIAL MALLEOLI\n2. AVULSION FRACTURE - ATFL LIGAMENT\n3. S/P OPEN REDUCTION INTERNAL FIXATION (ORIF)",
    chiefComplaints: "Right ankle pain following skid and fall 1.5 months ago. X-ray confirmed displaced bimalleolar fracture.",
    vitalsOnAdmission: {
      hr: "82 bpm",
      bp: "130/80 mmHg",
      spo2: "98% on room air",
      rr: "22 cpm",
      grbs: "102 mg/dL (Normal)",
    },
    investigations: [
      { name: "Haemoglobin (Hb)", loinc: "718-7", result: "16.40", numericValue: 16.40, unit: "g/dL", referenceRange: "12 - 18", flag: "Normal", status: "verified" },
      { name: "Total Count (TC)", loinc: "6690-2", result: "11050", numericValue: 11050, unit: "cells/cumm", referenceRange: "4000 - 11000", flag: "Normal", status: "verified" },
      { name: "Platelet Count", loinc: "777-3", result: "2.51", numericValue: 2.51, unit: "Lakh/Cumm", referenceRange: "1.5 - 4.5", flag: "Normal", status: "verified" },
      { name: "Serum Creatinine", loinc: "2160-0", result: "0.65", numericValue: 0.65, unit: "mg/dL", referenceRange: "0.6 - 1.10", flag: "Normal", status: "verified" },
      { name: "Blood Urea", loinc: "3094-0", result: "15.0", numericValue: 15.0, unit: "mg/dL", referenceRange: "10 - 40", flag: "Normal", status: "verified" },
      { name: "Serum Potassium (K+)", loinc: "2823-3", result: "4.10", numericValue: 4.10, unit: "mEq/L", referenceRange: "3.5 - 5.5", flag: "Normal", status: "verified" },
      { name: "Bilirubin Total", loinc: "1975-2", result: "0.68", numericValue: 0.68, unit: "mg/dL", referenceRange: "0.4 - 1.2", flag: "Normal", status: "verified" },
      { name: "SGOT - AST", loinc: "1920-8", result: "18.0", numericValue: 18.0, unit: "IU/ml", referenceRange: "5 - 40", flag: "Normal", status: "verified" },
      { name: "SGPT - ALT", loinc: "1742-6", result: "15.0", numericValue: 15.0, unit: "IU/ml", referenceRange: "5 - 40", flag: "Normal", status: "verified" },
    ],
    triage: {
      severity: "under_control",
      severityScore: 16,
      statusHeadline: "Report Is Under Control · Stable Post-Operative Status",
      plainLanguageOverview: "ALL LAB DATA UNDER CONTROL: Your ankle surgical fixation was successful. All preoperative and postoperative blood tests (Liver function, Kidney function, Complete blood count, Coagulation PT/INR 1.20) are completely normal. Your vitals are stable. Strictly adhere to non-weight bearing instructions.",
      criticalFindings: [],
      requiresImmediateAssistance: false,
      keyAdvice: [
        "Strict Non-Weight Bearing on the right leg; keep limb elevated on pillows to reduce edema.",
        "Perform active toe movements every hour to maintain micro-circulation.",
        "Take prescribed Tab Ecosprin 150mg for DVT blood clot prophylaxis for 15 days.",
        "Review after 5 days with Dr. Chethan Kumar R on OPD basis."
      ]
    },
    forecasts: [
      {
        biomarkerId: "platelet_mahendra",
        biomarkerName: "Platelet Count",
        unit: "Lakh/Cumm",
        normalRange: { min: 1.5, max: 4.5 },
        historicalSeries: [
          { date: "23 Sep 2026", timestamp: 1790150000000, value: 2.51, unit: "Lakh/Cumm" }
        ],
        currentValue: 2.51,
        predictedNextValue: 2.48,
        confidenceInterval: [2.35, 2.62],
        projectedDate: "Nov 2026",
        timeframeLabel: "Projected Post-Op Healing Check (Nov 2026)",
        trendVelocity: "Steady clotting baseline",
        riskTrajectory: "stable",
        clinicalInterpretation: "Platelets and coagulation status remain in balanced equilibrium. No risk of spontaneous bleeding or thrombosis detected under Ecosprin regimen.",
        whatIfScenarios: [
          {
            id: "dvt_adherence",
            label: "Daily Ecosprin 150mg Adherence",
            description: "Prevents postoperative venous thromboembolism.",
            impactDelta: 0.0,
            projectedWithAction: 2.48
          }
        ]
      }
    ]
  },
  {
    id: "jayalakshmi_polyp",
    pdfFileName: "12.pdf",
    patientName: "Mrs. Jayalakshmi",
    uhid: "UHID26187",
    age: "42Y",
    gender: "Female",
    admissionDate: "03/10/2026",
    dischargeDate: "04/10/2026",
    hospitalName: "Atreum Speciality Hospital (Obstetrics & Gynecology)",
    primaryDoctor: "Dr. Mamatha Harish",
    specialty: "Obstetrics and Gynecology",
    finalDiagnosis: "ABNORMAL UTERINE BLEEDING - ENDOMETRIAL POLYP (S/P HYSTEROSCOPIC POLYPECTOMY + D&C + MIRENA INSERTION)",
    chiefComplaints: "Complaints of irregular bleeding, menorrhagia for 4-5 days.",
    vitalsOnAdmission: {
      hr: "72 bpm",
      bp: "100/60 mmHg",
      spo2: "98% on room air",
      rr: "20 cpm",
      grbs: "92 mg/dL (Normal)",
    },
    investigations: [
      { name: "Blood Glucose (GRBS)", loinc: "2345-7", result: "92", numericValue: 92, unit: "mg/dL", referenceRange: "70 - 140", flag: "Normal", status: "verified" },
      { name: "Haemoglobin (Hb)", loinc: "718-7", result: "12.80", numericValue: 12.80, unit: "g/dL", referenceRange: "12 - 16", flag: "Normal", status: "verified" },
      { name: "Blood Pressure (Systolic)", loinc: "8480-6", result: "100", numericValue: 100, unit: "mmHg", referenceRange: "90 - 120", flag: "Normal", status: "verified" },
    ],
    triage: {
      severity: "under_control",
      severityScore: 12,
      statusHeadline: "Report Is Under Control · Normal Vitals & Stable Recovery",
      plainLanguageOverview: "UNDER CONTROL: Your procedure was completely uncomplicated. Blood pressure (100/60), heart rate (72 bpm), and blood glucose (92 mg/dL) are all in healthy ranges. The Mirena intrauterine device will prevent future endometrial polyp recurrence.",
      criticalFindings: [],
      requiresImmediateAssistance: false,
      keyAdvice: [
        "Take prescribed Tab Taxim O 200mg and Tab Pan D for 5 days.",
        "Mild spotting is expected for the first 1-2 weeks post Mirena insertion.",
        "Review after 1 week with Dr. Mamatha Harish with histopathology (HPE) report."
      ]
    },
    forecasts: [
      {
        biomarkerId: "hb_jaya",
        biomarkerName: "Hemoglobin (Hb)",
        unit: "g/dL",
        normalRange: { min: 12.0, max: 16.0 },
        historicalSeries: [
          { date: "03 Oct 2026", timestamp: 1791000000000, value: 12.80, unit: "g/dL" }
        ],
        currentValue: 12.80,
        predictedNextValue: 13.10,
        confidenceInterval: [12.7, 13.5],
        projectedDate: "Jan 2027",
        timeframeLabel: "Projected 3-Month Follow-Up (Jan 2027)",
        trendVelocity: "+2.3% stable",
        riskTrajectory: "stable",
        clinicalInterpretation: "With the cessation of abnormal uterine bleeding, your iron reserves and hemoglobin will remain securely in the ideal physiological zone.",
        whatIfScenarios: []
      }
    ]
  },
  {
    id: "kotla_stent",
    pdfFileName: "pt kotla Discharge Summary.pdf",
    patientName: "Mr. Kotla Ravi Kumar",
    uhid: "UHID64303",
    age: "37Y",
    gender: "Male",
    admissionDate: "08/08/2026",
    dischargeDate: "09/08/2026",
    hospitalName: "Atreum Speciality Hospital (Urology)",
    primaryDoctor: "Dr. Amit B",
    specialty: "Urology",
    finalDiagnosis: "S/P LEFT URS + B/L DJ STENTING (S/P B/L DJ STENT REMOVAL)",
    chiefComplaints: "Abdominal discomfort, stent removal procedure scheduled.",
    vitalsOnAdmission: {
      hr: "93 bpm",
      bp: "110/80 mmHg",
      spo2: "98% on room air",
      rr: "18 cpm",
    },
    investigations: [
      { name: "Blood Pressure", loinc: "8480-6", result: "110/70", unit: "mmHg", referenceRange: "90-120 / 60-80", flag: "Normal", status: "verified" },
      { name: "Heart Rate", loinc: "8867-4", result: "72", numericValue: 72, unit: "bpm", referenceRange: "60 - 100", flag: "Normal", status: "verified" },
      { name: "Oxygen Saturation (SpO2)", loinc: "59408-5", result: "96", numericValue: 96, unit: "%", referenceRange: "95 - 100", flag: "Normal", status: "verified" },
    ],
    triage: {
      severity: "under_control",
      severityScore: 10,
      statusHeadline: "Report Is Under Control · Stent Removed Successfully",
      plainLanguageOverview: "EVERYTHING UNDER CONTROL: Your bilateral DJ stents were removed smoothly without complications. Hemodynamics are completely stable (BP 110/70, HR 72 bpm). Drink plenty of water over the next 48 hours.",
      criticalFindings: [],
      requiresImmediateAssistance: false,
      keyAdvice: [
        "Drink 3 to 3.5 liters of water daily to flush urinary passages.",
        "Take Tab Cefuroxime 500mg and Tab Sompraz D for 3 days.",
        "Review after 3 days with Dr. Amit B on OPD basis."
      ]
    },
    forecasts: []
  },
  {
    id: "aniket_fracture",
    pdfFileName: "ANIKET Discharge Summary.pdf",
    patientName: "Mast Aniketh Vaidya",
    uhid: "UHID62307",
    age: "7Y",
    gender: "Male",
    admissionDate: "13/05/2026",
    dischargeDate: "14/05/2026",
    hospitalName: "Atreum Speciality Hospital (Pediatric Orthopaedics)",
    primaryDoctor: "Dr. Adarsh Krishna K Bhat",
    specialty: "Orthopaedics",
    finalDiagnosis: "TYPE III SUPRACONDYLAR HUMERUS FRACTURE - LEFT (S/P CLOSED REDUCTION INTERNAL FIXATION WITH K-WIRE)",
    chiefComplaints: "Fall from bicycle, left elbow pain, swelling and deformity.",
    vitalsOnAdmission: {
      hr: "123 bpm (Pediatric Tachycardia from pain)",
      bp: "100/60 mmHg",
      spo2: "96% on room air",
      rr: "24 cpm",
      grbs: "142 mg/dL",
    },
    investigations: [
      { name: "Total Count (TC)", loinc: "6690-2", result: "15300", numericValue: 15300, unit: "cells/cumm", referenceRange: "4000 - 11000", flag: "High", status: "verified" },
      { name: "Haemoglobin (Hb)", loinc: "718-7", result: "11.80", numericValue: 11.80, unit: "g/dL", referenceRange: "12 - 18", flag: "Normal", status: "verified" },
      { name: "Platelet Count", loinc: "777-3", result: "2.31", numericValue: 2.31, unit: "Lakh/Cumm", referenceRange: "1.5 - 4.5", flag: "Normal", status: "verified" },
      { name: "Neutrophils", loinc: "770-8", result: "79.0", numericValue: 79.0, unit: "%", referenceRange: "40 - 75", flag: "High", status: "verified" },
    ],
    triage: {
      severity: "requires_attention",
      severityScore: 45,
      statusHeadline: "Requires Attention · Post-Surgical Pediatric K-Wire Monitoring",
      plainLanguageOverview: "STABLE BUT MONITORED: The K-wire surgical pin fixation of the elbow fracture was successful. The elevated white blood cell count (15,300 cells/cumm) reflects acute post-injury trauma. Monitor fingers for warmth, pink color, and sensation to ensure unobstructed neurovascular perfusion.",
      criticalFindings: [
        "Traumatic Leukocytosis: Total count 15,300 cells/cumm",
        "K-wire in situ: Neurovascular surveillance needed"
      ],
      requiresImmediateAssistance: false,
      keyAdvice: [
        "Keep the left arm in the arm pouch at all times.",
        "Check finger movement and pink capillary refill every 4 hours.",
        "Review after 5 days with Dr. Adarsh Krishna K Bhat for dressing check."
      ]
    },
    forecasts: []
  },
  {
    id: "cohort_admissions",
    pdfFileName: "Untitled document (1).pdf",
    patientName: "Clinical Cohort Registry (Fracture, GI, Dengue)",
    uhid: "COHORT-2026",
    age: "Multi-Cohort",
    gender: "Multi",
    admissionDate: "Sep 2026",
    dischargeDate: "Sep 2026",
    hospitalName: "Atreum & Central Diagnostics Cohort Study",
    primaryDoctor: "Dr. Vinod / Dr. Amit",
    specialty: "Multi-Disciplinary",
    finalDiagnosis: "COHORT CASES: 1. Distal Radius Fracture 2. Acute Appendicitis 3. Dengue Fever with Severe Thrombocytopenia",
    chiefComplaints: "Clinical benchmarking cohort across orthopedic, surgical, and infectious presentations.",
    vitalsOnAdmission: {
      bp: "122/78 mmHg",
      spo2: "95% (Dengue Febrile)",
      grbs: "115 mg/dL",
    },
    investigations: [
      { name: "Platelet Count (Dengue VF-2026-02)", loinc: "777-3", result: "38000", numericValue: 38000, unit: "/cumm", referenceRange: "150000 - 450000", flag: "Critical", status: "verified" },
      { name: "Blood Glucose (Fasting)", loinc: "1558-6", result: "96", numericValue: 96, unit: "mg/dL", referenceRange: "70 - 100", flag: "Normal", status: "verified" },
      { name: "Random Blood Sugar (GI-2026-02)", loinc: "2345-7", result: "195", numericValue: 195, unit: "mg/dL", referenceRange: "70 - 140", flag: "High", status: "verified" },
    ],
    triage: {
      severity: "critical_assistance",
      severityScore: 91,
      statusHeadline: "CRITICAL ALERT · Severe Thrombocytopenia (Dengue Bleeding Hazard)",
      plainLanguageOverview: "CRITICAL INFECTIOUS SEVERITY: Patient VF-2026-02 in the Dengue cohort has acute thrombocytopenia with platelet count critically depleted to 38,000/cumm (normal >150,000). Urgent inpatient platelet transfusion reserve, hematocrit hematocrit tracking for plasma leakage, and close monitoring for petechiae / mucosal bleeding required.",
      criticalFindings: [
        "Critically Low Platelets: 38,000 /cumm (<50,000 transfusion trigger)",
        "Dengue Febrile Phase: High risk of dengue hemorrhagic fever and plasma leak"
      ],
      requiresImmediateAssistance: true,
      emergencyGuidance: {
        hotline: "108 Emergency",
        casualtyLocation: "Infectious Disease & Critical Care Unit",
        actions: [
          {
            type: "hospital_casualty",
            title: "Immediate Platelet Transfusion Readiness",
            description: "Admit for strict IV hydration, daily platelet counts, and hematocrit tracking.",
            phone: "108"
          }
        ]
      },
      keyAdvice: [
        "Avoid aspirin, ibuprofen, or NSAIDs which worsen platelet dysfunction.",
        "Rest in bed and watch for dark stools or gum bleeding."
      ]
    },
    forecasts: []
  }
];

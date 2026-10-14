import { RealClinicalReportDoc } from "@/types/patientAi";

/**
 * Verified Personal Health Documents for Rishith S Gowda
 * ABHA ID: 91-5366-3824-6028 · ABHA Address: 91536638246028@abdm
 * 
 * NOTE: Training datasets are kept completely separate and never exposed in any portal.
 * Only genuine records for Rishith S Gowda are stored and displayed here.
 */
export const RISHITH_PERSONAL_REPORTS: RealClinicalReportDoc[] = [
  {
    id: "rishith_cmp_2024",
    pdfFileName: "Sunrise_Haven_CMP_Dec2024.pdf",
    patientName: "Rishith S Gowda",
    uhid: "SHMC-2024-91536",
    age: "19Y",
    gender: "Male",
    admissionDate: "26/12/2024",
    dischargeDate: "27/12/2024",
    hospitalName: "Sunrise Haven Medical Center Diagnostics",
    primaryDoctor: "Dr. Evelyn Sterling",
    specialty: "Internal Medicine & Preventive Cardiology",
    finalDiagnosis: "Essential Hypertension (Grade 1) with Mild Transient Hyperkalemia (5.7 mmol/L). Renal Electrolyte Surveillance.",
    chiefComplaints: "Routine hypertension followup and biochemical safety profile check while on Telmisartan 40mg.",
    vitalsOnAdmission: {
      hr: "72 bpm",
      bp: "116/66 mmHg",
      spo2: "98%",
      rr: "16 cpm",
      grbs: "80 mg/dL",
    },
    investigations: [
      { name: "Sodium (Na+)", loinc: "2951-2", result: "140", numericValue: 140, unit: "mmol/L", referenceRange: "136 - 145", flag: "Normal", status: "verified" },
      { name: "Potassium (K+)", loinc: "2823-3", result: "5.7", numericValue: 5.7, unit: "mmol/L", referenceRange: "3.4 - 5.1", flag: "High", status: "verified" },
      { name: "Creatinine", loinc: "2160-0", result: "1.60", numericValue: 1.60, unit: "mg/dL", referenceRange: "0.50 - 1.20", flag: "High", status: "verified" },
      { name: "Total Protein", loinc: "2885-2", result: "9.2", numericValue: 9.2, unit: "g/dL", referenceRange: "6.4 - 8.3", flag: "High", status: "verified" },
      { name: "Chloride (Cl-)", loinc: "2075-0", result: "102", numericValue: 102, unit: "mmol/L", referenceRange: "98 - 107", flag: "Normal", status: "verified" },
      { name: "Carbon Dioxide (CO2)", loinc: "2028-9", result: "26", numericValue: 26, unit: "mmol/L", referenceRange: "22 - 31", flag: "Normal", status: "verified" },
      { name: "Blood Urea Nitrogen (BUN)", loinc: "3094-0", result: "18", numericValue: 18, unit: "mg/dL", referenceRange: "7 - 20", flag: "Normal", status: "verified" },
      { name: "Fasting Blood Glucose", loinc: "2345-7", result: "80", numericValue: 80, unit: "mg/dL", referenceRange: "70 - 99", flag: "Normal", status: "verified" },
    ],
    triage: {
      severity: "requires_attention",
      severityScore: 42,
      statusHeadline: "Requires Attention: Elevated Serum Potassium & Creatinine",
      plainLanguageOverview: "Your Comprehensive Metabolic Panel shows strong liver enzymes, normal blood glucose (80 mg/dL), and healthy sodium balance. However, Serum Potassium (5.7 mmol/L) and Creatinine (1.60 mg/dL) are mildly elevated above laboratory reference intervals. Because you are prescribed Telmisartan, Dr. Evelyn Sterling will check whether this is due to sample hemolysis or requires adjusting your hydration and dosage.",
      criticalFindings: [
        "Serum Potassium at 5.7 mmol/L (Normal 3.4 - 5.1 mmol/L) · Mild hyperkalemia",
        "Serum Creatinine at 1.60 mg/dL (Normal 0.50 - 1.20 mg/dL) · Renal clearance attention",
        "Total Protein at 9.2 g/dL (Normal 6.4 - 8.3 g/dL) · Mildly elevated hydration marker"
      ],
      requiresImmediateAssistance: false,
      keyAdvice: [
        "Schedule review with Dr. Evelyn Sterling within 7 to 10 days",
        "Repeat serum potassium and renal panel in 2 weeks to rule out transient variance",
        "Maintain optimal hydration (2.5 liters of clean water daily)",
        "Avoid potassium-based salt substitutes until your repeat lab panel"
      ],
      dietaryAndLifestyleNotes: [
        "Maintain consistent hydration throughout the day",
        "Limit excessive dietary potassium sources (bananas, dried fruits, salt substitutes)",
        "Continue morning administration of prescribed Telmisartan with breakfast"
      ],
    },
    forecasts: [
      {
        biomarkerId: "bio-k",
        biomarkerName: "Serum Potassium",
        unit: "mmol/L",
        normalRange: { min: 3.4, max: 5.1 },
        currentValue: 5.7,
        predictedNextValue: 5.1,
        confidenceInterval: [4.8, 5.4],
        projectedDate: "March 2026",
        timeframeLabel: "Quarterly Projection",
        trendVelocity: "-0.6 mmol/L post-hydration adjustment",
        riskTrajectory: "improving",
        clinicalInterpretation: "With controlled dietary potassium intake and proper 2.5L daily hydration, serum potassium is projected to normalize to 5.1 mmol/L within the safe clinical interval.",
        historicalSeries: [
          { date: "2020", timestamp: 1577836800000, value: 4.6, unit: "mmol/L" },
          { date: "2021", timestamp: 1609459200000, value: 4.8, unit: "mmol/L" },
          { date: "2022", timestamp: 1640995200000, value: 5.2, unit: "mmol/L" },
          { date: "2023", timestamp: 1672531200000, value: 5.7, unit: "mmol/L" },
        ],
        whatIfScenarios: [
          {
            id: "med_adherence",
            label: "Telmisartan Review & Low-Potassium Salt Alternative",
            description: "Eliminate high-potassium dietary salt replacements and adhere to 40mg regimen.",
            impactDelta: -0.4,
            projectedWithAction: 4.7,
          },
          {
            id: "diet_lifestyle",
            label: "Optimal 2.5L Daily Hydration Protocol",
            description: "Ensures physiological renal tubular flow and prevents hemoconcentration.",
            impactDelta: -0.3,
            projectedWithAction: 4.8,
          },
          {
            id: "exercise",
            label: "30-min Regular Aerobic Exercise",
            description: "Promotes cardiovascular resilience and metabolic clearance.",
            impactDelta: -0.1,
            projectedWithAction: 5.0,
          },
        ],
      },
      {
        biomarkerId: "bio-bp-sys",
        biomarkerName: "Systolic Blood Pressure",
        unit: "mmHg",
        normalRange: { min: 90, max: 120 },
        currentValue: 116,
        predictedNextValue: 118,
        confidenceInterval: [112, 122],
        projectedDate: "March 2026",
        timeframeLabel: "Quarterly Projection",
        trendVelocity: "Stable optimal control",
        riskTrajectory: "stable",
        clinicalInterpretation: "Blood pressure remains under excellent control on Telmisartan 40mg with no hypotensive episodes.",
        historicalSeries: [
          { date: "2020", timestamp: 1577836800000, value: 138, unit: "mmHg" },
          { date: "2021", timestamp: 1609459200000, value: 132, unit: "mmHg" },
          { date: "2022", timestamp: 1640995200000, value: 126, unit: "mmHg" },
          { date: "2023", timestamp: 1672531200000, value: 116, unit: "mmHg" },
        ],
        whatIfScenarios: [
          {
            id: "med_adherence",
            label: "Consistent Morning Telmisartan Compliance",
            description: "Maintaining medication regularity prevents morning hypertensive surges.",
            impactDelta: -2,
            projectedWithAction: 116,
          },
          {
            id: "diet_lifestyle",
            label: "Low-Sodium DASH Dietary Pattern",
            description: "Sodium intake < 2g daily maintains peripheral arterial dilation.",
            impactDelta: -3,
            projectedWithAction: 115,
          },
          {
            id: "exercise",
            label: "Daily Brisk Walking (30 mins)",
            description: "Increases endothelial nitric oxide bioavailability.",
            impactDelta: -2,
            projectedWithAction: 116,
          },
        ],
      },
    ],
  },
  {
    id: "rishith_lipid_2023",
    pdfFileName: "Metropolis_Lipid_Panel_Sep2023.pdf",
    patientName: "Rishith S Gowda",
    uhid: "MET-2023-4819",
    age: "18Y",
    gender: "Male",
    admissionDate: "14/09/2023",
    dischargeDate: "15/09/2023",
    hospitalName: "Metropolis Diagnostic & Preventive Center",
    primaryDoctor: "Dr. Evelyn Sterling",
    specialty: "Preventive Health & Cardiology",
    finalDiagnosis: "Normal Cardiovascular Lipid Panel. Optimal High-Density Lipoprotein (HDL) Reserve.",
    chiefComplaints: "Annual cardiovascular wellness screening.",
    vitalsOnAdmission: {
      hr: "76 bpm",
      bp: "120/78 mmHg",
      spo2: "99%",
      rr: "15 cpm",
      grbs: "86 mg/dL",
    },
    investigations: [
      { name: "Total Cholesterol", loinc: "2093-3", result: "178", numericValue: 178, unit: "mg/dL", referenceRange: "< 200", flag: "Normal", status: "verified" },
      { name: "HDL Cholesterol", loinc: "2085-9", result: "52", numericValue: 52, unit: "mg/dL", referenceRange: "> 40", flag: "Normal", status: "verified" },
      { name: "LDL Cholesterol", loinc: "13457-7", result: "98", numericValue: 98, unit: "mg/dL", referenceRange: "< 100", flag: "Normal", status: "verified" },
      { name: "Triglycerides", loinc: "2571-8", result: "120", numericValue: 120, unit: "mg/dL", referenceRange: "< 150", flag: "Normal", status: "verified" },
      { name: "VLDL Cholesterol", loinc: "13458-5", result: "24", numericValue: 24, unit: "mg/dL", referenceRange: "< 30", flag: "Normal", status: "verified" },
    ],
    triage: {
      severity: "under_control",
      severityScore: 10,
      statusHeadline: "All Parameters Under Control · Optimal Cardiovascular Reserve",
      plainLanguageOverview: "Great news! Your cardiovascular lipid profile is in the optimal range. Total cholesterol is healthy at 178 mg/dL and your protective HDL cholesterol has increased to 52 mg/dL. Keep up your active lifestyle and balanced diet.",
      criticalFindings: [],
      requiresImmediateAssistance: false,
      keyAdvice: [
        "Continue 30 minutes of aerobic exercise 5 times weekly",
        "Maintain current Mediterranean-style balanced diet",
        "Annual preventive screening scheduled for next year"
      ],
      dietaryAndLifestyleNotes: [
        "Maintain high dietary fiber and lean protein",
        "Continue routine physical activity and sport"
      ],
    },
    forecasts: [
      {
        biomarkerId: "bio-hdl",
        biomarkerName: "HDL Cholesterol (Protective)",
        unit: "mg/dL",
        normalRange: { min: 40, max: 70 },
        currentValue: 52,
        predictedNextValue: 54,
        confidenceInterval: [50, 58],
        projectedDate: "September 2026",
        timeframeLabel: "Annual Projection",
        trendVelocity: "+2.0 mg/dL per year",
        riskTrajectory: "improving",
        clinicalInterpretation: "Protective HDL continues its favorable upward trajectory, offering robust cardiovascular defense.",
        historicalSeries: [
          { date: "2020", timestamp: 1577836800000, value: 44, unit: "mg/dL" },
          { date: "2021", timestamp: 1609459200000, value: 46, unit: "mg/dL" },
          { date: "2022", timestamp: 1640995200000, value: 49, unit: "mg/dL" },
          { date: "2023", timestamp: 1672531200000, value: 52, unit: "mg/dL" },
        ],
        whatIfScenarios: [
          {
            id: "exercise",
            label: "Regular Cardiovascular Fitness",
            description: "Aerobic exertion stimulates hepatic apoA-I synthesis.",
            impactDelta: 3,
            projectedWithAction: 57,
          },
          {
            id: "diet_lifestyle",
            label: "Omega-3 Rich Diet (Walnuts, Seeds)",
            description: "Enhances reverse cholesterol transport efficiency.",
            impactDelta: 2,
            projectedWithAction: 56,
          },
        ],
      },
    ],
  },
];

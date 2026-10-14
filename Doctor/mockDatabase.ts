export interface VitalRecord {
  id: string;
  date: string;
  heartRate: number; // bpm
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number; // mmHg
  bloodSugar: number; // mg/dL
  spo2: number; // %
  temperature: number; // °F
}

export interface BiomarkerMetric {
  id: string;
  name: string;
  category: "Comprehensive Metabolic Panel" | "Lipid Panel" | "TSH with Reflex" | "Complete Blood Count";
  value: number;
  displayValue: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  gaugeMin: number;
  gaugeMax: number;
  status: "normal" | "borderline" | "critical";
  labFlag: "Normal" | "High" | "Low" | "Reflex Negative";
  whatItMeasures: string;
  whyOrdered: string;
  historicalYears: { year: number; value: number }[];
  predictedForecast?: { year: number; projectedValue: number; confidenceLow: number; confidenceHigh: number };
}

export interface UploadedReportItem {
  id: string;
  fileName: string;
  fileType: "pdf" | "jpg" | "png";
  uploadDate: string;
  reportDate: string;
  labName: string;
  category: "Biochemistry" | "Hematology" | "Pathology" | "Endocrinology";
  status: "Processed" | "Flagged For Review" | "Processing";
  isDuplicate: boolean;
  rawExtractedData: {
    testName: string;
    originalPrintedValue: string;
    confirmedValue: string;
    unit: string;
    referenceRange: string;
    isFlaggedUnclear: boolean;
    userCorrection?: { original: string; corrected: string; correctedAt: string };
  }[];
  aiSummary: string;
  suggestedDoctorQuestions: string[];
}

export interface ConnectedHealthSource {
  id: string;
  name: string;
  type: "ABHA National Gateway" | "Apple HealthKit" | "Google Health Connect" | "Metropolis Diagnostics API";
  status: "Active & Synced" | "Consent Pending" | "Disconnected";
  lastSynced: string;
  permissions: string[];
}

export interface FamilyHistoryItem {
  relation: string;
  condition: string;
  ageOfOnset?: number;
  notes: string;
}

export interface Patient {
  id: string;
  abhaId: string;
  abhaAddress?: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  phone: string;
  email: string;
  preferredLanguage: string;
  preferredUnits: "Metric (mg/dL, mmol/L)" | "US Standard";
  accessibilityHighContrast: boolean;
  emergencyContact: { name: string; relation: string; phone: string };
  allergies: string[];
  chronicConditions: string[];
  familyHistory: FamilyHistoryItem[];
  connectedSources: ConnectedHealthSource[];
  qrCodeToken: string;
  vitalsHistory: VitalRecord[];
  uploadedReports: UploadedReportItem[];
  prescriptions: {
    id: string;
    doctorName: string;
    doctorSpecialty: string;
    date: string;
    diagnosis: string;
    medicines: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }[];
    notes: string;
  }[];
  appointments: {
    id: string;
    doctorName: string;
    specialty: string;
    hospital: string;
    date: string;
    time: string;
    type: "In-Person OPD" | "Teleconsultation";
    status: "Upcoming" | "Completed" | "In-Progress" | "Cancelled";
    tokenNumber: string;
    location: string;
  }[];
}

// Initial Rich Biomarkers Data (matching the attached screenshot design)
export const initialBiomarkers: BiomarkerMetric[] = [
  {
    id: "bio-na",
    name: "Sodium",
    category: "Comprehensive Metabolic Panel",
    value: 140,
    displayValue: "140",
    unit: "mmol/L",
    normalMin: 136,
    normalMax: 145,
    gaugeMin: 130,
    gaugeMax: 150,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Major extracellular electrolyte regulating bodily water balance and neuromuscular signaling.",
    whyOrdered: "Assesses hydration, renal electrolyte clearance, and osmotic equilibrium.",
    historicalYears: [
      { year: 2020, value: 138 },
      { year: 2021, value: 139 },
      { year: 2022, value: 141 },
      { year: 2023, value: 140 },
    ],
    predictedForecast: { year: 2024, projectedValue: 140.2, confidenceLow: 138.5, confidenceHigh: 141.8 },
  },
  {
    id: "bio-k",
    name: "Potassium",
    category: "Comprehensive Metabolic Panel",
    value: 5.7,
    displayValue: "5.7",
    unit: "mmol/L",
    normalMin: 3.4,
    normalMax: 5.1,
    gaugeMin: 3.0,
    gaugeMax: 6.0,
    status: "borderline",
    labFlag: "High",
    whatItMeasures: "Vital intracellular cation controlling cardiac electrical rhythm and muscular contractions.",
    whyOrdered: "Monitored due to antihypertensive medication (Telmisartan) and kidney filtration balance.",
    historicalYears: [
      { year: 2020, value: 4.6 },
      { year: 2021, value: 4.8 },
      { year: 2022, value: 5.2 },
      { year: 2023, value: 5.7 },
    ],
    predictedForecast: { year: 2024, projectedValue: 5.4, confidenceLow: 5.1, confidenceHigh: 5.8 },
  },
  {
    id: "bio-cl",
    name: "Chloride",
    category: "Comprehensive Metabolic Panel",
    value: 102,
    displayValue: "102",
    unit: "mmol/L",
    normalMin: 98,
    normalMax: 107,
    gaugeMin: 90,
    gaugeMax: 115,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Works in tandem with sodium to maintain acid-base (pH) equilibrium.",
    whyOrdered: "Routine metabolic screening.",
    historicalYears: [
      { year: 2020, value: 101 },
      { year: 2021, value: 100 },
      { year: 2022, value: 103 },
      { year: 2023, value: 102 },
    ],
  },
  {
    id: "bio-co2",
    name: "Carbon Dioxide",
    category: "Comprehensive Metabolic Panel",
    value: 26,
    displayValue: "26",
    unit: "mmol/L",
    normalMin: 22,
    normalMax: 31,
    gaugeMin: 18,
    gaugeMax: 35,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Measures bicarbonate in blood to check lungs and kidney respiratory acid balance.",
    whyOrdered: "Evaluates metabolic gas exchange and acid-base homeostasis.",
    historicalYears: [
      { year: 2020, value: 27 },
      { year: 2021, value: 25 },
      { year: 2022, value: 26 },
      { year: 2023, value: 26 },
    ],
    predictedForecast: { year: 2024, projectedValue: 26.1, confidenceLow: 24.5, confidenceHigh: 27.5 },
  },
  {
    id: "bio-bun",
    name: "BUN",
    category: "Comprehensive Metabolic Panel",
    value: 18,
    displayValue: "18",
    unit: "mg/dL",
    normalMin: 6,
    normalMax: 23,
    gaugeMin: 4,
    gaugeMax: 30,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Blood Urea Nitrogen formed by protein breakdown in the liver and eliminated by kidneys.",
    whyOrdered: "Assesses renal excretion and dietary protein turnover.",
    historicalYears: [
      { year: 2020, value: 16 },
      { year: 2021, value: 17 },
      { year: 2022, value: 18 },
      { year: 2023, value: 18 },
    ],
  },
  {
    id: "bio-cr",
    name: "Creatinine",
    category: "Comprehensive Metabolic Panel",
    value: 1.6,
    displayValue: "1.6",
    unit: "mg/dL",
    normalMin: 0.50,
    normalMax: 1.20,
    gaugeMin: 0.4,
    gaugeMax: 2.0,
    status: "borderline",
    labFlag: "High",
    whatItMeasures: "Byproduct of muscle metabolism directly filtered by glomerular capillary beds.",
    whyOrdered: "Key biomarker for estimating Glomerular Filtration Rate (eGFR).",
    historicalYears: [
      { year: 2020, value: 0.95 },
      { year: 2021, value: 1.10 },
      { year: 2022, value: 1.30 },
      { year: 2023, value: 1.60 },
    ],
    predictedForecast: { year: 2024, projectedValue: 1.45, confidenceLow: 1.30, confidenceHigh: 1.65 },
  },
  {
    id: "bio-alb",
    name: "Albumin",
    category: "Comprehensive Metabolic Panel",
    value: 4.9,
    displayValue: "4.9",
    unit: "g/dL",
    normalMin: 3.5,
    normalMax: 5.2,
    gaugeMin: 2.5,
    gaugeMax: 6.0,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Primary protein synthesized by the liver maintaining oncotic fluid pressures in vessels.",
    whyOrdered: "Evaluates liver synthetic reserve and systemic nutritional state.",
    historicalYears: [
      { year: 2020, value: 4.6 },
      { year: 2021, value: 4.7 },
      { year: 2022, value: 4.8 },
      { year: 2023, value: 4.9 },
    ],
  },
  {
    id: "bio-tp",
    name: "Total Protein",
    category: "Comprehensive Metabolic Panel",
    value: 9.2,
    displayValue: "9.2",
    unit: "g/dL",
    normalMin: 6.4,
    normalMax: 8.3,
    gaugeMin: 5.0,
    gaugeMax: 10.0,
    status: "borderline",
    labFlag: "High",
    whatItMeasures: "Combined level of albumin and globulin proteins in circulating serum.",
    whyOrdered: "Assesses nutritional sufficiency and immune globulin balance.",
    historicalYears: [
      { year: 2020, value: 7.4 },
      { year: 2021, value: 7.8 },
      { year: 2022, value: 8.4 },
      { year: 2023, value: 9.2 },
    ],
  },
  {
    id: "bio-ca",
    name: "Calcium",
    category: "Comprehensive Metabolic Panel",
    value: 9.7,
    displayValue: "9.7",
    unit: "mg/dL",
    normalMin: 8.8,
    normalMax: 10.7,
    gaugeMin: 7.0,
    gaugeMax: 12.0,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Mineral vital for bone architecture, vascular contraction, and nerve impulse delivery.",
    whyOrdered: "Screening for parathyroid balance and bone metabolic turnover.",
    historicalYears: [
      { year: 2020, value: 9.5 },
      { year: 2021, value: 9.6 },
      { year: 2022, value: 9.8 },
      { year: 2023, value: 9.7 },
    ],
  },
  {
    id: "bio-bili",
    name: "Total Bilirubin",
    category: "Comprehensive Metabolic Panel",
    value: 0.9,
    displayValue: "0.9",
    unit: "mg/dL",
    normalMin: 0.0,
    normalMax: 1.0,
    gaugeMin: 0.0,
    gaugeMax: 2.0,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Yellow-orange breakdown pigment of aging red blood cells processed in bile.",
    whyOrdered: "Monitors hepatic excretory pathway and biliary patency.",
    historicalYears: [
      { year: 2020, value: 0.8 },
      { year: 2021, value: 0.8 },
      { year: 2022, value: 0.9 },
      { year: 2023, value: 0.9 },
    ],
  },
  {
    id: "bio-ast",
    name: "AST",
    category: "Comprehensive Metabolic Panel",
    value: 27,
    displayValue: "27",
    unit: "U/L",
    normalMin: 10,
    normalMax: 50,
    gaugeMin: 5,
    gaugeMax: 70,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Aspartate aminotransferase enzyme found in hepatocytes and cardiac myocytes.",
    whyOrdered: "Detects liver parenchymal irritation or acute cellular injury.",
    historicalYears: [
      { year: 2020, value: 24 },
      { year: 2021, value: 26 },
      { year: 2022, value: 25 },
      { year: 2023, value: 27 },
    ],
  },
  {
    id: "bio-alt",
    name: "ALT",
    category: "Comprehensive Metabolic Panel",
    value: 23,
    displayValue: "23",
    unit: "U/L",
    normalMin: 10,
    normalMax: 50,
    gaugeMin: 5,
    gaugeMax: 70,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Alanine aminotransferase, specific marker for liver cellular integrity.",
    whyOrdered: "Screening for medication-induced hepatic tolerance.",
    historicalYears: [
      { year: 2020, value: 22 },
      { year: 2021, value: 21 },
      { year: 2022, value: 24 },
      { year: 2023, value: 23 },
    ],
  },
  {
    id: "bio-tsh",
    name: "TSH with Reflex to FT4",
    category: "TSH with Reflex",
    value: 2.14,
    displayValue: "2.14",
    unit: "uIU/mL",
    normalMin: 0.45,
    normalMax: 4.5,
    gaugeMin: 0.2,
    gaugeMax: 6.0,
    status: "normal",
    labFlag: "Reflex Negative",
    whatItMeasures: "Pituitary hormone regulating thyroid metabolic synthesis.",
    whyOrdered: "Screening for subclinical hypothyroid or hyperthyroid states.",
    historicalYears: [
      { year: 2020, value: 2.05 },
      { year: 2021, value: 2.10 },
      { year: 2022, value: 2.18 },
      { year: 2023, value: 2.14 },
    ],
  },
  {
    id: "bio-chol",
    name: "Total Cholesterol",
    category: "Lipid Panel",
    value: 178,
    displayValue: "178",
    unit: "mg/dL",
    normalMin: 120,
    normalMax: 200,
    gaugeMin: 100,
    gaugeMax: 260,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Circulating serum total sterol concentration.",
    whyOrdered: "Atherosclerotic cardiovascular risk profiling.",
    historicalYears: [
      { year: 2020, value: 195 },
      { year: 2021, value: 188 },
      { year: 2022, value: 182 },
      { year: 2023, value: 178 },
    ],
  },
  {
    id: "bio-hdl",
    name: "HDL Cholesterol",
    category: "Lipid Panel",
    value: 52,
    displayValue: "52",
    unit: "mg/dL",
    normalMin: 40,
    normalMax: 80,
    gaugeMin: 30,
    gaugeMax: 90,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "High-density lipoprotein (cardioprotective reverse cholesterol carrier).",
    whyOrdered: "Cardiovascular health tracking.",
    historicalYears: [
      { year: 2020, value: 44 },
      { year: 2021, value: 48 },
      { year: 2022, value: 50 },
      { year: 2023, value: 52 },
    ],
  },
  {
    id: "bio-ldl",
    name: "LDL (Calculated)",
    category: "Lipid Panel",
    value: 108,
    displayValue: "108",
    unit: "mg/dL",
    normalMin: 70,
    normalMax: 130,
    gaugeMin: 50,
    gaugeMax: 170,
    status: "normal",
    labFlag: "Normal",
    whatItMeasures: "Low-density atherogenic lipoprotein.",
    whyOrdered: "Target guide for dietary lifestyle adjustments.",
    historicalYears: [
      { year: 2020, value: 128 },
      { year: 2021, value: 118 },
      { year: 2022, value: 112 },
      { year: 2023, value: 108 },
    ],
  },
];

export const initialPatient: Patient = {
  id: "pat-101",
  abhaId: "91-5366-3824-6028",
  abhaAddress: "91536638246028@abdm",
  name: "Rishith S Gowda",
  dateOfBirth: "2007-03-07",
  age: 19,
  gender: "Male",
  bloodGroup: "O- Negative (O-ve)",
  phone: "9019928883",
  email: "rishith.gowda@janhealth.in",
  preferredLanguage: "English (UK / IN)",
  preferredUnits: "Metric (mg/dL, mmol/L)",
  accessibilityHighContrast: false,
  emergencyContact: {
    name: "Suresh Gowda",
    relation: "Father",
    phone: "+91 98450 12345",
  },
  allergies: ["Penicillin", "Peanuts", "Sulfa drugs"],
  chronicConditions: ["Hypertension (Grade 1)", "Mild Allergic Bronchospasm"],
  familyHistory: [
    { relation: "Father", condition: "Essential Hypertension", ageOfOnset: 48, notes: "Managed with ARBs" },
    { relation: "Maternal Grandmother", condition: "Type 2 Diabetes Mellitus", ageOfOnset: 55, notes: "Diet and oral hypoglycemics" },
    { relation: "Mother", condition: "Thyroid Goiter (Benign)", ageOfOnset: 40, notes: "Thyroxine replacement" },
  ],
  connectedSources: [
    {
      id: "cs-1",
      name: "Ayushman Bharat Digital Mission (ABDM)",
      type: "ABHA National Gateway",
      status: "Active & Synced",
      lastSynced: "Today, 08:30 AM",
      permissions: ["View PHR", "Prescriptions", "Diagnostic Reports"],
    },
    {
      id: "cs-2",
      name: "Sunrise Haven Hospital Portal",
      type: "Metropolis Diagnostics API",
      status: "Active & Synced",
      lastSynced: "Yesterday",
      permissions: ["EHR Sync", "Lab Biomarkers"],
    },
    {
      id: "cs-3",
      name: "Apple Health & Vitals Kit",
      type: "Apple HealthKit",
      status: "Active & Synced",
      lastSynced: "10 mins ago",
      permissions: ["Heart Rate", "SpO2", "Blood Pressure"],
    },
  ],
  qrCodeToken: "JAN-HLTH-ABHA-SECURE-91536638246028",
  vitalsHistory: [
    {
      id: "v-1",
      date: "Today, 08:20 AM",
      heartRate: 72,
      bloodPressureSystolic: 116,
      bloodPressureDiastolic: 66,
      bloodSugar: 80,
      spo2: 98,
      temperature: 98.4,
    },
    {
      id: "v-2",
      date: "Yesterday",
      heartRate: 76,
      bloodPressureSystolic: 122,
      bloodPressureDiastolic: 78,
      bloodSugar: 86,
      spo2: 99,
      temperature: 98.6,
    },
  ],
  uploadedReports: [
    {
      id: "rep-2024-cmp",
      fileName: "Sunrise_Haven_CMP_Dec2024.pdf",
      fileType: "pdf",
      uploadDate: "Dec 27, 2024",
      reportDate: "Dec 26, 2024",
      labName: "Sunrise Haven Medical Center Diagnostics",
      category: "Biochemistry",
      status: "Processed",
      isDuplicate: false,
      rawExtractedData: [
        { testName: "Sodium", originalPrintedValue: "140", confirmedValue: "140", unit: "mmol/L", referenceRange: "136 - 145", isFlaggedUnclear: false },
        { testName: "Potassium", originalPrintedValue: "5.7", confirmedValue: "5.7", unit: "mmol/L", referenceRange: "3.4 - 5.1", isFlaggedUnclear: true },
        { testName: "Creatinine", originalPrintedValue: "1.60", confirmedValue: "1.60", unit: "mg/dL", referenceRange: "0.50 - 1.20", isFlaggedUnclear: false },
        { testName: "Total Protein", originalPrintedValue: "9.2", confirmedValue: "9.2", unit: "g/dL", referenceRange: "6.4 - 8.3", isFlaggedUnclear: false },
      ],
      aiSummary: "The Comprehensive Metabolic Panel shows stable liver enzymes and normal sodium/chloride balance. Potassium (5.7 mmol/L) and Creatinine (1.6 mg/dL) are mildly elevated above laboratory reference intervals, which merits review alongside your blood pressure medication.",
      suggestedDoctorQuestions: [
        "Should we repeat the serum potassium test in 2 weeks to rule out transient hemolyzed sample variance?",
        "Does my current blood pressure medication (Telmisartan) contribute to the potassium reading?",
        "Would mild dietary hydration changes or reduced potassium-rich salt substitutes be advisable?",
      ],
    },
    {
      id: "rep-2023-lipid",
      fileName: "Metropolis_Lipid_Panel_Sep2023.pdf",
      fileType: "pdf",
      uploadDate: "Sep 15, 2023",
      reportDate: "Sep 14, 2023",
      labName: "Metropolis Health Center",
      category: "Biochemistry",
      status: "Processed",
      isDuplicate: false,
      rawExtractedData: [
        { testName: "Total Cholesterol", originalPrintedValue: "178", confirmedValue: "178", unit: "mg/dL", referenceRange: "< 200", isFlaggedUnclear: false },
        { testName: "HDL Cholesterol", originalPrintedValue: "52", confirmedValue: "52", unit: "mg/dL", referenceRange: "> 40", isFlaggedUnclear: false },
      ],
      aiSummary: "All lipid profile parameters are within optimal ranges. HDL (protective cholesterol) has increased progressively from 44 to 52 mg/dL over the past 3 years.",
      suggestedDoctorQuestions: [
        "Can we keep the current cardiovascular lifestyle and exercise plan without starting statin therapy?",
      ],
    },
  ],
  prescriptions: [
    {
      id: "rx-901",
      doctorName: "Dr. Evelyn Sterling",
      doctorSpecialty: "Cardiology & Preventive Medicine",
      date: "Dec 27, 2024",
      diagnosis: "Essential Hypertension Maintenance & Renal Electrolyte Surveillance",
      medicines: [
        {
          name: "Telmisartan 40mg",
          dosage: "1 Tablet",
          frequency: "Morning with breakfast",
          duration: "90 Days",
          instructions: "Continue routine morning administration. Maintain low dietary sodium.",
        },
        {
          name: "Hydration Electrolyte Guidance",
          dosage: "2.5 Liters/Day",
          frequency: "Throughout the day",
          duration: "Ongoing",
          instructions: "Avoid excessive potassium-based salt alternatives.",
        },
      ],
      notes: "Follow up for routine repeat BMP in 3 months. Maintain at least 30 minutes of aerobic walking 5 days a week.",
    },
  ],
  appointments: [
    {
      id: "apt-501",
      doctorName: "Dr. Evelyn Sterling",
      specialty: "Cardiology & Internal Medicine",
      hospital: "Sunrise Haven Medical Center",
      location: "432 Serenity Lane, Serenity Springs, CA 90210",
      date: "Friday, December 27, 2024",
      time: "8:20 AM EST",
      type: "In-Person OPD",
      status: "Upcoming",
      tokenNumber: "DEC-27",
    },
    {
      id: "apt-502",
      doctorName: "Dr. Ananya Sharma",
      specialty: "Cardiology & General Medicine",
      hospital: "Jan Aushadhi Central Health Center",
      location: "Indiranagar 100ft Road, Bengaluru",
      date: "Jan 15, 2025",
      time: "10:30 AM",
      type: "Teleconsultation",
      status: "Upcoming",
      tokenNumber: "TELE-04",
    },
  ],
};

export interface DoctorQueueItem {
  id: string;
  patientId: string;
  patientName: string;
  abhaId: string;
  age: number;
  gender: string;
  tokenNumber: string;
  appointmentTime: string;
  chiefComplaint: string;
  triagePriority: "Routine" | "Priority" | "Emergency";
  status: "Waiting" | "In-Consultation" | "Completed";
  breakGlassActive?: boolean;
}

export const initialDoctorQueue: DoctorQueueItem[] = [
  {
    id: "q-1",
    patientId: "pat-101",
    patientName: "Rishith S Gowda",
    abhaId: "91-5366-3824-6028",
    age: 21,
    gender: "Male",
    tokenNumber: "OPD-01",
    appointmentTime: "09:00 AM",
    chiefComplaint: "Routine health assessment, vitals review & biomarker diagnostics",
    triagePriority: "Routine",
    status: "Waiting",
    breakGlassActive: false,
  },
];

export interface PendingEkycItem {
  id: string;
  applicantName: string;
  aadhaarSuffix: string;
  mobile: string;
  timestamp: string;
  status: "Pending OTP" | "Biometric Verified" | "Created";
  generatedAbha?: string;
}

export interface HospitalFacility {
  id: string;
  name: string;
  registryId: string;
  location: string;
  emergencyHotline: string;
  opdFootfallToday: number;
  activeDoctorsCount: number;
  beds: {
    ward: "ICU" | "Emergency Ward" | "General Male" | "General Female" | "Pediatric" | "Post-Op Recovery";
    total: number;
    occupied: number;
    available: number;
  }[];
  pendingEkyc: PendingEkycItem[];
  breakGlassAlerts: {
    id: string;
    doctorName: string;
    patientName: string;
    abhaId: string;
    timestamp: string;
    reason: string;
    acknowledged: boolean;
  }[];
}

export const initialHospital: HospitalFacility = {
  id: "hosp-001",
  name: "Sunrise Haven Regional Medical Center",
  registryId: "HFR-US-CA-90210",
  location: "432 Serenity Lane, Serenity Springs, CA",
  emergencyHotline: "+1 (800) 555-0199",
  opdFootfallToday: 184,
  activeDoctorsCount: 22,
  beds: [
    { ward: "ICU", total: 20, occupied: 16, available: 4 },
    { ward: "Emergency Ward", total: 25, occupied: 19, available: 6 },
    { ward: "General Male", total: 40, occupied: 32, available: 8 },
    { ward: "General Female", total: 40, occupied: 29, available: 11 },
    { ward: "Pediatric", total: 20, occupied: 11, available: 9 },
    { ward: "Post-Op Recovery", total: 15, occupied: 9, available: 6 },
  ],
  pendingEkyc: [
    {
      id: "ekyc-01",
      applicantName: "Rameshwar Prasad",
      aadhaarSuffix: "XXXX-4819",
      mobile: "+91 94821 55190",
      timestamp: "10 mins ago",
      status: "Biometric Verified",
      generatedAbha: "91-8841-0291-3810",
    },
  ],
  breakGlassAlerts: [
    {
      id: "bg-01",
      doctorName: "Dr. Evelyn Sterling",
      patientName: "Arjun Verma",
      abhaId: "91-4821-9923-1049",
      timestamp: "Today 08:15 AM",
      reason: "Complete EHR Exam Reconciliation",
      acknowledged: true,
    },
  ],
};

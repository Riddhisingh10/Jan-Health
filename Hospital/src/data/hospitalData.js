// Mock Data & State Management for Hospital Portal

export const HOSPITAL_FACILITIES = [
  {
    id: "Fortis Escorts",
    name: "Fortis Escorts Heart Institute",
    code: "FEHI-DEL-01",
    type: "Super Speciality",
    location: "Okhla Road, New Delhi",
    color: "#0284c7"
  },
  {
    id: "AIIMS New Delhi",
    name: "AIIMS New Delhi",
    code: "AIIMS-DEL-01",
    type: "Central Govt Institute",
    location: "Ansari Nagar, New Delhi",
    color: "#0f766e"
  },
  {
    id: "Jan Seva Kendra",
    name: "Jan Seva Health Kendra",
    code: "JSHK-DEL-04",
    type: "Primary Health Centre",
    location: "Rohini Sector 11, New Delhi",
    color: "#16a34a"
  },
  {
    id: "Max Healthcare",
    name: "Max Super Speciality Hospital",
    code: "MAX-SAK-02",
    type: "Multi Speciality",
    location: "Saket, New Delhi",
    color: "#7c3aed"
  },
  {
    id: "Apollo Spectra",
    name: "Apollo Spectra Hospital",
    code: "APL-KAI-03",
    type: "Speciality Surgical",
    location: "Kailash Colony, New Delhi",
    color: "#ea580c"
  }
];

export const INITIAL_PATIENTS = [
  {
    id: "PAT-001",
    name: "Ramesh Chandra Sharma",
    nameHindi: "रमेश चंद्र शर्मा",
    abhaNumber: "14-8492-3847-1920",
    abhaAddress: "ramesh.sharma@abdm",
    age: 52,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 98765 43210",
    allergies: ["Penicillin", "Amoxicillin"],
    criticalAllergyWarning: "CRITICAL: Patient experienced severe urticaria & facial hives with Amoxicillin in May 2025. DO NOT PRESCRIBE PENICILLIN DERIVATIVES.",
    chronicConditions: ["Stage-1 Essential Hypertension", "Pre-Diabetes Glycemic State (Fasting 108 mg/dL)"],
    activeMedications: ["Telmisartan 40mg", "Rosuvastatin 10mg", "Vitamin B-Complex + D3"]
  },
  {
    id: "PAT-002",
    name: "Sunita Devi",
    nameHindi: "सुनीता देवी",
    abhaNumber: "14-2201-9981-4412",
    abhaAddress: "sunita.devi@abdm",
    age: 46,
    gender: "Female",
    bloodGroup: "O+",
    phone: "+91 98112 33445",
    allergies: ["Sulfa Drugs"],
    criticalAllergyWarning: "Mild rash with Sulfonamides.",
    chronicConditions: ["Hypothyroidism"],
    activeMedications: ["Thyronorm 50mcg"]
  }
];

export const INITIAL_STAFF = {
  doctors: [
    {
      id: "DOC-001",
      name: "Dr. Saran Mitchell",
      role: "Doctor",
      specialty: "Senior Cardiologist",
      registrationNo: "MCI-39482",
      hospital: "Fortis Escorts Heart Institute",
      department: "Cardiology & Vascular Sciences",
      opdRoom: "OPD-304",
      phone: "+91 98101 22334",
      email: "saran.mitchell@fortis.in",
      avatarBg: "#0284c7"
    },
    {
      id: "DOC-002",
      name: "Dr. Rajesh Sharma",
      role: "Doctor",
      specialty: "Family & General Physician",
      registrationNo: "MCI-18492",
      hospital: "Jan Seva Health Kendra",
      department: "General Medicine & NCD Clinic",
      opdRoom: "Room 12",
      phone: "+91 98711 55667",
      email: "rajesh.sharma@janseva.org",
      avatarBg: "#16a34a"
    },
    {
      id: "DOC-003",
      name: "Dr. Anaya Kapoor",
      role: "Doctor",
      specialty: "Pathology Consultant",
      registrationNo: "MCI-58201",
      hospital: "AIIMS New Delhi",
      department: "Laboratory Medicine & Hematology",
      opdRoom: "Lab Block B-2",
      phone: "+91 98123 77889",
      email: "anaya.kapoor@aiims.edu",
      avatarBg: "#0f766e"
    }
  ],
  labAssistants: [
    {
      id: "LAB-001",
      name: "Sunita Verma",
      role: "Lab Assistant",
      specialty: "Bio-Chemistry & Hematology Technologist",
      accreditationId: "NABL-TECH-8821",
      hospital: "Fortis Escorts Heart Institute",
      labRoom: "Diagnostic Lab Room 201",
      phone: "+91 98221 44556",
      email: "sunita.verma@lab.fortis.in",
      avatarBg: "#7c3aed"
    },
    {
      id: "LAB-002",
      name: "Amit Rawat",
      role: "Lab Assistant",
      specialty: "Radiology & ECG Diagnostics",
      accreditationId: "NABL-TECH-4419",
      hospital: "AIIMS New Delhi",
      labRoom: "Clinical Imaging Wing 1",
      phone: "+91 98332 55667",
      email: "amit.rawat@aiims.edu",
      avatarBg: "#0d9488"
    }
  ],
  pharmacists: [
    {
      id: "PHARM-001",
      name: "Manjit Singh",
      role: "Pharmacist",
      licenseNo: "DL-PHARM-98214",
      hospital: "Fortis Escorts Heart Institute",
      counterLocation: "Central Pharmacy Counter 3",
      phone: "+91 98443 66778",
      email: "manjit.singh@pharmacy.fortis.in",
      avatarBg: "#ea580c"
    },
    {
      id: "PHARM-002",
      name: "Neha Deshmukh",
      role: "Pharmacist",
      licenseNo: "DL-PHARM-67210",
      hospital: "Jan Seva Health Kendra",
      counterLocation: "Dispensary Desk 1",
      phone: "+91 98554 77889",
      email: "neha.deshmukh@janseva.org",
      avatarBg: "#d97706"
    }
  ]
};

// Initial Encounter demonstrating collective data upload for Ramesh Chandra Sharma
export const INITIAL_ENCOUNTERS = [
  {
    encounterId: "ENC-2026-881",
    hospitalId: "Jan Seva Kendra",
    hospitalName: "Jan Seva Health Kendra",
    patientId: "PAT-001",
    patientName: "Ramesh Chandra Sharma",
    patientAbha: "14-8492-3847-1920",
    patientAge: 52,
    patientGender: "Male",
    date: "14 Oct 2026",
    status: "In Progress", // 'Doctor Completed' | 'Lab Pending' | 'Pharmacy Pending' | 'Fully Completed'
    
    // 1. Doctor's Stage
    doctorStage: {
      completed: true,
      completedBy: "Dr. Rajesh Sharma",
      completedAt: "14 Oct 2026, 10:15 AM",
      visitType: "OPD Checkup & Diabetic Assessment",
      vitals: {
        bp: "128/82 mmHg",
        pulse: "72 bpm",
        temperature: "98.4 °F",
        spo2: "99%",
        weight: "72.5 kg"
      },
      symptoms: "Mild lethargy in mornings, regular routine follow-up for Stage-1 Hypertension.",
      diagnosis: "Pre-Diabetic Glycemic State & Controlled Essential Hypertension",
      doctorNotes: "Fasting glucose showed borderline elevation in September. Advised lifestyle management and routine repeat blood profile. Continue Telmisartan 40mg. Avoid penicillin.",
      orderedLabTests: [
        { testName: "Fasting Blood Sugar", status: "Pending Lab Entry", targetRange: "70 – 100 mg/dL" },
        { testName: "HbA1c Glycated Hemoglobin", status: "Pending Lab Entry", targetRange: "< 5.7 %" },
        { testName: "Complete Blood Count (CBC)", status: "Pending Lab Entry", targetRange: "Standard Hematology" }
      ],
      prescriptions: [
        { name: "Telmisartan 40mg", dosage: "1 tab daily morning after breakfast", duration: "90 Days", instructions: "For BP control" },
        { name: "Rosuvastatin 10mg", dosage: "1 tab at bedtime", duration: "90 Days", instructions: "Lipid profile maintenance" },
        { name: "Vitamin B-Complex + D3", dosage: "1 cap daily after lunch", duration: "30 Days", instructions: "Nutritional supplement" }
      ]
    },

    // 2. Lab Assistant's Stage
    labStage: {
      completed: false, // Ready to be uploaded by Lab Assistant!
      completedBy: "",
      completedAt: "",
      labRemarks: "",
      results: [
        { testName: "Fasting Blood Sugar", value: "108", unit: "mg/dL", normalRange: "70 – 100 mg/dL", status: "Borderline High", flag: "high" },
        { testName: "HbA1c Glycated Hemoglobin", value: "6.4", unit: "%", normalRange: "< 5.7 %", status: "Borderline High (Pre-Diabetic)", flag: "high" },
        { testName: "Complete Blood Count (CBC)", value: "14.2", unit: "g/dL Hb", normalRange: "13.5 – 17.5 g/dL", status: "Normal", flag: "normal" }
      ]
    },

    // 3. Pharmacy Stage
    pharmacyStage: {
      completed: false, // Ready to be dispensed by Pharmacist!
      completedBy: "",
      completedAt: "",
      batchNumber: "BATCH-2026-TEL-441",
      allergyCheckPassed: true,
      pharmacistNotes: "",
      dispensedItems: [
        { name: "Telmisartan 40mg", quantity: "90 Tablets", status: "Pending Dispensing" },
        { name: "Rosuvastatin 10mg", quantity: "90 Tablets", status: "Pending Dispensing" },
        { name: "Vitamin B-Complex + D3", quantity: "30 Capsules", status: "Pending Dispensing" }
      ]
    }
  }
];

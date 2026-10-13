// Clean, structured synthetic medical history for Indian Citizens (2020 - 2026) across multiple hospitals

export const CITIZEN_PROFILE = {
  name: "Ramesh Chandra Sharma",
  nameHindi: "रमेश चंद्र शर्मा",
  aadhaarNumber: "5481 9238 4819",
  maskedAadhaar: "XXXX-XXXX-4819",
  healthId: "JH-9821-4402",
  phone: "+91 98765 43210",
  age: 52,
  gender: "Male",
  bloodGroup: "B+",
  city: "New Delhi",
  doctorPin: "8492",
  registeredYear: "2020"
};

export const HOSPITALS_LIST = [
  { id: "all", name: "All Hospitals", count: 11 },
  { id: "AIIMS New Delhi", name: "AIIMS New Delhi", type: "Central Govt Institute", color: "#0f766e" },
  { id: "Fortis Escorts", name: "Fortis Escorts Heart Institute", type: "Super Speciality", color: "#0284c7" },
  { id: "Max Healthcare", name: "Max Super Speciality Hospital", type: "Multi Speciality", color: "#7c3aed" },
  { id: "Apollo Spectra", name: "Apollo Spectra Hospital", type: "Speciality Surgical", color: "#ea580c" },
  { id: "Jan Seva Kendra", name: "Jan Seva Health Kendra", type: "Primary Health Centre", color: "#16a34a" }
];

export const YEARS_LIST = ["All", "2026", "2025", "2024", "2023", "2022", "2021", "2020"];

export const MEDICAL_RECORDS = [
  // --- 2026 Records ---
  {
    id: "REC-2026-01",
    year: "2026",
    type: "Doctor Checkup",
    title: "Cardiology Follow-up & BP Monitoring",
    titleHindi: "हृदय रोग एवं बीपी जांच",
    doctor: "Dr. Saran Mitchell",
    doctorSpecialty: "Senior Cardiologist",
    hospital: "Fortis Escorts Heart Institute",
    date: "14 Oct 2026",
    diagnosis: "Stage-1 Essential Hypertension (Well Controlled)",
    bpReading: "128/82 mmHg",
    doctorNotes: "Resting BP is under normal limits. Regular aerobic walking advised. Continue Telmisartan.",
    medications: [
      { name: "Telmisartan 40mg", dosage: "1 tab daily morning after breakfast", duration: "90 Days" },
      { name: "Rosuvastatin 10mg", dosage: "1 tab daily at bedtime", duration: "90 Days" }
    ],
    verifiedByHospital: true
  },
  {
    id: "REC-2026-02",
    year: "2026",
    type: "Lab Report",
    title: "Complete Blood Count (CBC) with Platelets",
    titleHindi: "रक्त जांच (सीबीसी एवं प्लेटलेट्स)",
    doctor: "Dr. Anaya Kapoor",
    doctorSpecialty: "Pathology Consultant",
    hospital: "AIIMS New Delhi",
    date: "10 Oct 2026",
    diagnosis: "Routine Hematology — Normal Cellular Profile",
    doctorNotes: "Normal cellular counts. Hemoglobin 14.2 g/dL. Platelets 240,000 /mcL.",
    labResults: [
      { test: "Hemoglobin", result: "14.2 g/dL", normalRange: "13.5 - 17.5 g/dL", status: "Normal" },
      { test: "Total WBC Count", result: "6,800 /mcL", normalRange: "4,000 - 11,000 /mcL", status: "Normal" },
      { test: "Platelets", result: "2,40,000 /mcL", normalRange: "1,50,000 - 4,50,000 /mcL", status: "Normal" }
    ],
    verifiedByHospital: true
  },
  {
    id: "REC-2026-03",
    year: "2026",
    type: "Doctor Checkup",
    title: "Diabetic Screening & Glycemic Assessment",
    titleHindi: "डायबिटीज स्क्रीनिंग व परामर्श",
    doctor: "Dr. Rajesh Sharma",
    doctorSpecialty: "Family & General Physician",
    hospital: "Jan Seva Health Kendra",
    date: "22 Sep 2026",
    diagnosis: "Pre-Diabetic Glycemic State",
    doctorNotes: "Fasting blood sugar 108 mg/dL. HbA1c 6.4% (borderline). Advised strict dietary moderation.",
    labResults: [
      { test: "Fasting Blood Sugar", result: "108 mg/dL", normalRange: "70 - 100 mg/dL", status: "Borderline High" },
      { test: "HbA1c", result: "6.4 %", normalRange: "< 5.7 %", status: "Borderline High" }
    ],
    medications: [
      { name: "Vitamin B-Complex + D3", dosage: "1 cap daily after lunch", duration: "30 Days" }
    ],
    verifiedByHospital: true
  },

  // --- 2025 Records ---
  {
    id: "REC-2025-01",
    year: "2025",
    type: "Allergy Alert",
    title: "Penicillin Hypersensitivity Reaction",
    titleHindi: "दवा एलर्जी चेतावनी (पेनिसिलिन)",
    doctor: "Dr. Rajesh Sharma",
    doctorSpecialty: "Emergency Medicine Desk",
    hospital: "Jan Seva Health Kendra",
    date: "12 May 2025",
    diagnosis: "Moderate Cutaneous Urticaria & Facial Rash with Amoxicillin",
    doctorNotes: "CRITICAL: Patient experienced allergic hives after oral Amoxicillin. DO NOT prescribe Penicillin family drugs in any future treatment.",
    medications: [
      { name: "Levocetirizine 5mg", dosage: "1 tab daily for 5 days (Course Completed)", duration: "5 Days" }
    ],
    verifiedByHospital: true
  },
  {
    id: "REC-2025-02",
    year: "2025",
    type: "Doctor Checkup",
    title: "Annual Preventive Health Evaluation & ECG",
    titleHindi: "वार्षिक स्वास्थ्य परीक्षण एवं ईसीजी",
    doctor: "Dr. Vikram Malhotra",
    doctorSpecialty: "Internal Medicine Specialist",
    hospital: "Max Super Speciality Hospital",
    date: "18 Nov 2025",
    diagnosis: "Normal Sinus Rhythm. Mild Hyperlipidemia.",
    doctorNotes: "Resting 12-lead ECG is normal without ischemic ST-T shifts. Recommended maintaining healthy lipid profile.",
    medications: [
      { name: "Atorvastatin 10mg", dosage: "1 tab daily at night", duration: "90 Days" }
    ],
    verifiedByHospital: true
  },

  // --- 2024 Records ---
  {
    id: "REC-2024-01",
    year: "2024",
    type: "Discharge Summary",
    title: "Right Eye Cataract Surgery (Phacoemulsification)",
    titleHindi: "मोतियाबिंद ऑपरेशन डिस्चार्ज समरी",
    doctor: "Dr. James Okonkwo",
    doctorSpecialty: "Senior Eye Surgeon",
    hospital: "Apollo Spectra Hospital",
    date: "18 Jun 2024",
    diagnosis: "Right Eye Senile Immature Cataract",
    doctorNotes: "Uneventful day care cataract extraction with Monofocal foldable IOL implantation. Post-op vision 6/6 with reading glasses.",
    medications: [
      { name: "Moxifloxacin Eye Drops", dosage: "1 drop 4 times daily for 14 days", duration: "14 Days" },
      { name: "Prednisolone Acetate Drops", dosage: "1 drop 3 times daily tapering", duration: "21 Days" }
    ],
    verifiedByHospital: true
  },
  {
    id: "REC-2024-02",
    year: "2024",
    type: "Lab Report",
    title: "Treadmill Stress Test (TMT) & 2D Echo",
    titleHindi: "हृदय टीएमटी एवं इकोकार्डियोग्राफी",
    doctor: "Dr. Saran Mitchell",
    doctorSpecialty: "Cardiology Lab",
    hospital: "Fortis Escorts Heart Institute",
    date: "04 Feb 2024",
    diagnosis: "Negative for Provocable Myocardial Ischemia",
    doctorNotes: "Completed Bruce protocol stage 3. Normal ejection fraction (LVEF 60%). No wall motion abnormalities.",
    verifiedByHospital: true
  },

  // --- 2023 Records ---
  {
    id: "REC-2023-01",
    year: "2023",
    type: "Doctor Checkup",
    title: "Seasonal Febrile Illness & Widal Diagnostic",
    titleHindi: "मौसमी बुखार एवं टाइफाइड जांच",
    doctor: "Dr. Rajesh Sharma",
    doctorSpecialty: "General Physician",
    hospital: "Jan Seva Health Kendra",
    date: "28 Aug 2023",
    diagnosis: "Acute Viral Pyrexia with Dehydration",
    doctorNotes: "Widal test negative. Fever subsided with Paracetamol and oral rehydration. Patient fully recovered in 4 days.",
    medications: [
      { name: "Paracetamol 650mg", dosage: "1 tab SOS if fever > 100 F", duration: "5 Days" },
      { name: "Oral Rehydration Salts (ORS)", dosage: "1 liter daily", duration: "3 Days" }
    ],
    verifiedByHospital: true
  },

  // --- 2022 Records ---
  {
    id: "REC-2022-01",
    year: "2022",
    type: "Doctor Checkup",
    title: "Pulmonary Checkup & Post-Viral Booster Evaluation",
    titleHindi: "फेफड़े जांच एवं पल्मोनरी परामर्श",
    doctor: "Dr. Anaya Kapoor",
    doctorSpecialty: "Respiratory & Chest Clinic",
    hospital: "AIIMS New Delhi",
    date: "15 Jan 2022",
    diagnosis: "Clear Lung Fields. Normal SpO2 (98% on room air).",
    doctorNotes: "Chest examination reveals bilateral vesicular breath sounds. Spirometry within normal parameters. Booster administered.",
    verifiedByHospital: true
  },

  // --- 2021 Records ---
  {
    id: "REC-2021-01",
    year: "2021",
    type: "Doctor Checkup",
    title: "Bilateral Knee Joint Pain Evaluation & X-Ray",
    titleHindi: "घुटनों का दर्द एवं एक्स-रे जांच",
    doctor: "Dr. S. K. Gupta",
    doctorSpecialty: "Senior Orthopedic Consultant",
    hospital: "Max Super Speciality Hospital",
    date: "14 Apr 2021",
    diagnosis: "Early Grade-1 Osteoarthritis of Bilateral Knees",
    doctorNotes: "X-ray shows mild joint space narrowing in medial compartment. Advised quadriceps strengthening exercises and weight management. Avoid squatting.",
    medications: [
      { name: "Glucosamine + Diacerein", dosage: "1 tab daily after breakfast", duration: "60 Days" },
      { name: "Aceclofenac Gel", dosage: "Gentle local application twice daily", duration: "14 Days" }
    ],
    verifiedByHospital: true
  },

  // --- 2020 Records ---
  {
    id: "REC-2020-01",
    year: "2020",
    type: "Doctor Checkup",
    title: "Initial Citizen Registration & Baseline Physical",
    titleHindi: "प्रारंभिक स्वास्थ्य पंजीकरण एवं बेसलाइन जांच",
    doctor: "Dr. Rajesh Sharma",
    doctorSpecialty: "Family Physician",
    hospital: "Jan Seva Health Kendra",
    date: "10 Nov 2020",
    diagnosis: "Baseline Clinical Assessment at Registration",
    doctorNotes: "Baseline health assessment conducted upon Jan Health enrollment. Blood group confirmed B Positive. General vitals stable.",
    verifiedByHospital: true
  }
];

export const HEALTH_HISTORY_METRICS = {
  "Blood Pressure (BP)": {
    unit: "mmHg",
    records: [
      { date: "14 Oct 2026", reading: "128/82 mmHg", hospital: "Fortis Escorts Heart Institute", status: "Normal" },
      { date: "18 Nov 2025", reading: "130/84 mmHg", hospital: "Max Super Speciality Hospital", status: "Pre-hypertension" },
      { date: "04 Feb 2024", reading: "126/80 mmHg", hospital: "AIIMS New Delhi", status: "Normal" }
    ]
  },
  "Blood Sugar": {
    unit: "mg/dL",
    records: [
      { date: "22 Sep 2026", reading: "108 mg/dL (Fasting)", hospital: "Jan Seva Health Kendra", status: "Borderline" },
      { date: "18 Nov 2025", reading: "102 mg/dL (Fasting)", hospital: "Max Super Speciality Hospital", status: "Normal" },
      { date: "28 Aug 2023", reading: "98 mg/dL (Random)", hospital: "Jan Seva Health Kendra", status: "Normal" }
    ]
  },
  "Heart Rate": {
    unit: "bpm",
    records: [
      { date: "14 Oct 2026", reading: "72 bpm", hospital: "Fortis Escorts Heart Institute", status: "Normal" },
      { date: "18 Nov 2025", reading: "76 bpm", hospital: "Max Super Speciality Hospital", status: "Normal" },
      { date: "04 Feb 2024", reading: "70 bpm", hospital: "Fortis Escorts Heart Institute", status: "Normal" }
    ]
  },
  "SpO₂": {
    unit: "%",
    records: [
      { date: "10 Oct 2026", reading: "99%", hospital: "AIIMS New Delhi", status: "Optimal" },
      { date: "28 Aug 2023", reading: "97%", hospital: "Jan Seva Health Kendra", status: "Normal" },
      { date: "15 Jan 2022", reading: "98% on room air", hospital: "AIIMS New Delhi", status: "Normal" }
    ]
  },
  "Body Temperature": {
    unit: "°F",
    records: [
      { date: "10 Oct 2026", reading: "98.4 °F", hospital: "AIIMS New Delhi", status: "Normal" },
      { date: "28 Aug 2023", reading: "101.2 °F", hospital: "Jan Seva Health Kendra", status: "Febrile" },
      { date: "10 Nov 2020", reading: "98.6 °F", hospital: "Jan Seva Health Kendra", status: "Normal" }
    ]
  },
  "Weight": {
    unit: "kg",
    records: [
      { date: "14 Oct 2026", reading: "72.5 kg", hospital: "Fortis Escorts Heart Institute", status: "Stable" },
      { date: "18 Nov 2025", reading: "73.8 kg", hospital: "Max Super Speciality Hospital", status: "Stable" },
      { date: "14 Apr 2021", reading: "75.2 kg", hospital: "Max Super Speciality Hospital", status: "Initial" }
    ]
  },
  "Haemoglobin": {
    unit: "g/dL",
    records: [
      { date: "10 Oct 2026", reading: "14.2 g/dL", hospital: "AIIMS New Delhi", status: "Normal" },
      { date: "18 Nov 2025", reading: "13.9 g/dL", hospital: "Max Super Speciality Hospital", status: "Normal" },
      { date: "10 Nov 2020", reading: "14.0 g/dL", hospital: "Jan Seva Health Kendra", status: "Normal" }
    ]
  }
};


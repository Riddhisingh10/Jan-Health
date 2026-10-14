export interface ConsultationNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  doctorName: string;
  historyOfPresentIllness: string;
  physicalExamination: string;
  clinicalAssessment: string;
  planAndRx: string;
  patientFriendlySummary: string;
  status: "Draft" | "Clinician Approved" | "Saved to EHR";
  aiGeneratedAssisted: boolean;
  reviewedByClinician: boolean;
}

export interface ClinicalAuditLog {
  id: string;
  timestamp: string;
  action: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  details: string;
  scope: string;
}

export interface DoctorReviewAlert {
  id: string;
  patientId: string;
  patientName: string;
  reportName: string;
  timestamp: string;
  flagType: "Critical Lab Value" | "Extraction Verification" | "Drug-Allergy Inconsistency";
  source: "Metropolis Lab Analyzer" | "Sunrise Pathology OCR" | "EMR Allergy Rule";
  testName: string;
  measuredValue: string;
  referenceInterval: string;
  urgency: "Immediate" | "Priority Attention" | "Routine Check";
  isReviewed: boolean;
  actionTaken?: string;
}

export interface AuthorizedPatientRecord {
  id: string;
  name: string;
  abhaId: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  accessGrantedUntil: string;
  accessScope: "Full EHR with Diagnostics" | "Consultation Specific" | "Emergency Break-Glass";
  consentToken: string;
  chiefComplaint: string;
  triagePriority: "Routine" | "Priority" | "Emergency";
  allergies: string[];
  medications: string[];
  chronicConditions: string[];
  lastVisit: string;
  hasNewUnreviewedReports: boolean;
}

export const initialAuthorizedPatients: AuthorizedPatientRecord[] = [
  {
    id: "pat-101",
    name: "Rishith S Gowda",
    abhaId: "91-5366-3824-6028",
    age: 19,
    gender: "Male",
    bloodGroup: "O- Negative (O-ve)",
    phone: "9019928883",
    accessGrantedUntil: "24 Hours (Active)",
    accessScope: "Full EHR with Diagnostics",
    consentToken: "ABDM-CONSENT-2026-RISHITH-S-GOWDA",
    chiefComplaint: "Routine health assessment, vitals review & biomarker diagnostics",
    triagePriority: "Routine",
    allergies: ["Penicillin", "Sulfa drugs"],
    medications: ["Multivitamin & Zinc", "Hydration Guidance 2.5L"],
    chronicConditions: ["Active Wellness Monitoring"],
    lastVisit: "Today, 08:30 AM",
    hasNewUnreviewedReports: true,
  },
];

export const initialReviewAlerts: DoctorReviewAlert[] = [
  {
    id: "alt-01",
    patientId: "pat-101",
    patientName: "Rishith S Gowda",
    reportName: "Sunrise_Haven_CMP_Dec2024.pdf",
    timestamp: "15 mins ago",
    flagType: "Critical Lab Value",
    source: "Metropolis Lab Analyzer",
    testName: "Serum Potassium",
    measuredValue: "5.7 mmol/L",
    referenceInterval: "3.4 - 5.1 mmol/L",
    urgency: "Priority Attention",
    isReviewed: false,
  },
  {
    id: "alt-02",
    patientId: "pat-101",
    patientName: "Rishith S Gowda",
    reportName: "Sunrise_Haven_CMP_Dec2024.pdf",
    timestamp: "18 mins ago",
    flagType: "Extraction Verification",
    source: "Sunrise Pathology OCR",
    testName: "Creatinine eGFR Check",
    measuredValue: "1.60 mg/dL",
    referenceInterval: "0.50 - 1.20 mg/dL",
    urgency: "Priority Attention",
    isReviewed: false,
  },
];

export const initialDoctorAuditLogs: ClinicalAuditLog[] = [
  {
    id: "aud-01",
    timestamp: "Today, 08:18 AM",
    action: "Record Decryption & View",
    patientId: "pat-101",
    patientName: "Rishith S Gowda",
    doctorName: "Dr. Evelyn Sterling",
    details: "Accessed Comprehensive Metabolic Panel & longitudinal trends under token ABDM-CONSENT-2026-RISHITH-S-GOWDA.",
    scope: "Authorized OPD Consultation",
  },
];


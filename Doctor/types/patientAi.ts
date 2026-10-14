export type TriageSeverity = "under_control" | "requires_attention" | "critical_assistance";

export interface ExtractedBiomarker {
  name: string;
  loinc?: string;
  result: string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  flag?: "Normal" | "High" | "Low" | "Critical";
  status: "verified" | "extracted" | "unresolved";
}

export interface EmergencyActionItem {
  type: "call_hotline" | "hospital_casualty" | "notify_doctor" | "medication_warning";
  title: string;
  description: string;
  actionText?: string;
  phone?: string;
}

export interface ClinicalTriageSummary {
  severity: TriageSeverity;
  severityScore: number; // 0 (perfect) to 100 (extreme emergency)
  statusHeadline: string;
  plainLanguageOverview: string;
  criticalFindings: string[];
  requiresImmediateAssistance: boolean;
  emergencyGuidance?: {
    hotline: string;
    casualtyLocation: string;
    actions: EmergencyActionItem[];
  };
  keyAdvice: string[];
  dietaryAndLifestyleNotes?: string[];
}

export interface HistoricalTestPoint {
  date: string;
  timestamp: number;
  value: number;
  unit: string;
  flag?: string;
  sourceReport?: string;
}

export interface PredictiveForecastModel {
  biomarkerId: string;
  biomarkerName: string;
  unit: string;
  normalRange: { min: number; max: number };
  criticalThresholds?: { lowCritical?: number; highCritical?: number };
  historicalSeries: HistoricalTestPoint[];
  currentValue: number;
  predictedNextValue: number;
  confidenceInterval: [number, number]; // [lower95, upper95]
  projectedDate: string;
  timeframeLabel: string;
  trendVelocity: string; // e.g. "+5.2% per quarter"
  riskTrajectory: "improving" | "stable" | "escalating";
  clinicalInterpretation: string;
  whatIfScenarios: {
    id: string;
    label: string;
    description: string;
    impactDelta: number; // e.g. -12 mg/dL
    projectedWithAction: number;
  }[];
}

export interface RealClinicalReportDoc {
  id: string;
  pdfFileName: string;
  patientName: string;
  uhid: string;
  age: string;
  gender: string;
  admissionDate: string;
  dischargeDate: string;
  hospitalName: string;
  primaryDoctor: string;
  specialty: string;
  finalDiagnosis: string;
  chiefComplaints: string;
  vitalsOnAdmission: {
    hr?: string;
    bp?: string;
    spo2?: string;
    rr?: string;
    grbs?: string;
    temp?: string;
  };
  investigations: ExtractedBiomarker[];
  triage: ClinicalTriageSummary;
  forecasts: PredictiveForecastModel[];
}

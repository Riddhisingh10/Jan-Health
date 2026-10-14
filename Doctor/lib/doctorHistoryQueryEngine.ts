import { AuthorizedPatientRecord } from "@/doctorMockData";
import { RISHITH_PERSONAL_REPORTS } from "@/lib/patientPersonalReports";
import { RealClinicalReportDoc, ExtractedBiomarker } from "@/types/patientAi";
import { initialBiomarkers, BiomarkerMetric } from "@/mockDatabase";

export type ClinicalDataCategoryKey =
  | "all"
  | "renal_electrolytes"
  | "blood_pressure"
  | "blood_sugar"
  | "oxygen_respiratory"
  | "medications_allergies"
  | "surgical_history";

export interface ClinicalCategoryMeta {
  key: ClinicalDataCategoryKey;
  label: string;
  iconName: string;
  badge: string;
  description: string;
  suggestedPrompts: string[];
}

export const CLINICAL_DATA_CATEGORIES: ClinicalCategoryMeta[] = [
  {
    key: "all",
    label: "Complete Longitudinal History",
    iconName: "Layers",
    badge: "Holistic Overview",
    description: "Synthesize all lab panels, vitals timeline, verified hospital records, and medications for Rishith S Gowda.",
    suggestedPrompts: [
      "Review full medical history for high-risk findings and drug interactions",
      "Summary of all past hospital admissions, procedures & surgeries",
      "Cross-check vitals and biomarkers across longitudinal timeline",
    ],
  },
  {
    key: "renal_electrolytes",
    label: "Renal Profile & Electrolytes",
    iconName: "FlaskConical",
    badge: "Kidney & Ions",
    description: "Serum Potassium (5.7 mmol/L), Sodium, Creatinine (1.60 mg/dL), BUN, eGFR, and hyperkalemia surveillance.",
    suggestedPrompts: [
      "Evaluate serum potassium elevation (5.7 mmol/L) and Telmisartan interaction",
      "Trace creatinine trajectory from 2020 to present",
      "Review hydration protocol and repeat lab schedule",
    ],
  },
  {
    key: "blood_pressure",
    label: "Blood Pressure & Hemodynamics",
    iconName: "HeartPulse",
    badge: "Cardiovascular",
    description: "Systolic & diastolic blood pressure history, heart rate, Telmisartan 40mg response, and MAP stability.",
    suggestedPrompts: [
      "Trace systolic blood pressure trends over past encounters (116/66 mmHg)",
      "Review Telmisartan response and morning hemodynamic control",
      "Evaluate cardiovascular risk markers and lipid panel",
    ],
  },
  {
    key: "blood_sugar",
    label: "Blood Sugar & Metabolic Balance",
    iconName: "Activity",
    badge: "Endocrine & Glucose",
    description: "Fasting Blood Glucose (80 mg/dL), metabolic stability, and family history risk factors.",
    suggestedPrompts: [
      "Show all blood sugar readings and glucose trajectory",
      "Assess glycemic control and lifestyle recommendations",
      "Review maternal grandmother diabetes risk factor",
    ],
  },
  {
    key: "oxygen_respiratory",
    label: "Oxygen Saturation & Respiratory",
    iconName: "Wind",
    badge: "SpO2 & Pulmonary",
    description: "Pulse oximetry (SpO2 98-99%), mild allergic bronchospasm surveillance, and seasonal triggers.",
    suggestedPrompts: [
      "Check SpO2 oxygen level trends over time",
      "Review allergic bronchospasm triggers and management",
      "Assess pulmonary tolerance during physical activity",
    ],
  },
  {
    key: "medications_allergies",
    label: "Medications & Critical Allergies",
    iconName: "Pill",
    badge: "Pharmacovigilance",
    description: "Current prescriptions (Telmisartan 40mg), hydration, and documented anaphylaxis contraindications (Penicillin, Sulfa, Peanuts).",
    suggestedPrompts: [
      "List all active medications and check for hyperkalemia risks",
      "Verify Penicillin, Sulfa, and Peanut anaphylaxis documentation",
      "Audit e-Rx compatibility against renal function",
    ],
  },
  {
    key: "surgical_history",
    label: "Surgical & Inpatient Procedures",
    iconName: "FileText",
    badge: "Procedural Archives",
    description: "2022 Laparoscopic Appendectomy at Sunrise Haven Medical Center and 2024 Right Ankle Sprain recovery.",
    suggestedPrompts: [
      "Review 2022 laparoscopic appendectomy operative findings and histopathology",
      "Check post-operative recovery course and cosmetic healing",
      "Review 2024 ankle inversion sprain and functional status",
    ],
  },
];

export interface MatchedDataPoint {
  id: string;
  date: string;
  parameter: string;
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  flag: "Normal" | "High" | "Low" | "Critical";
  sourceDocument: string;
  clinicalNote: string;
}

export interface MatchedDischargeDocument {
  docId: string;
  patientName: string;
  pdfFileName: string;
  admissionDate: string;
  dischargeDate: string;
  hospital: string;
  diagnosis: string;
  chiefComplaints: string;
  relevantVitals: { [key: string]: string | undefined };
  keyInvestigations: ExtractedBiomarker[];
  triageSeverity: "under_control" | "requires_attention" | "critical_assistance";
}

export interface HistoricalQueryResult {
  query: string;
  category: ClinicalDataCategoryKey;
  patient: AuthorizedPatientRecord;
  executedAt: string;
  totalRecordsFound: number;
  dataPoints: MatchedDataPoint[];
  dischargeDocs: MatchedDischargeDocument[];
  relevantMedications: string[];
  relevantAllergies: string[];
  timelineChronology: {
    date: string;
    title: string;
    category: string;
    details: string;
    severity: "Normal" | "Attention" | "Critical";
  }[];
}

export interface ComprehensiveClinicalReport {
  id: string;
  generatedAt: string;
  doctorName: string;
  patientName: string;
  patientDetails: string;
  queryTopic: string;
  executiveSummary: string;
  triageSeverity: "under_control" | "requires_attention" | "critical_assistance";
  triageHeadline: string;
  triageRationale: string;
  longitudinalAnalysis: string;
  criticalRedFlags: string[];
  differentialConsiderations: string[];
  actionableRecommendations: string[];
  suggestedRxAdjustments: string[];
  followUpPlan: string;
  formattedPlainText: string;
}

/**
 * Intelligent Retrieval Engine: Gathers clinical data specifically for Rishith S Gowda:
 * 1. Longitudinal Biomarkers & Vitals from Mock Database (2020-2024)
 * 2. Verified Personal Hospital Reports (Sunrise Haven CMP, Metropolis Lipid Panel)
 * 3. Surgical History & Verified Medical Timeline (2018-2026)
 * 4. Active Patient EMR Profile (Medications, Allergies, Chronic Conditions)
 * 
 * NOTE: Training datasets are strictly excluded from patient & doctor portals.
 */
export function queryPatientMedicalHistory(
  patient: AuthorizedPatientRecord,
  query: string,
  category: ClinicalDataCategoryKey
): HistoricalQueryResult {
  const q = query.trim().toLowerCase();
  const cat = category;

  const dataPoints: MatchedDataPoint[] = [];
  const dischargeDocs: MatchedDischargeDocument[] = [];
  const relevantMedications: string[] = [];
  const relevantAllergies: string[] = [];
  const timelineChronology: HistoricalQueryResult["timelineChronology"] = [];

  // 1. MATCH LONGITUDINAL BIOMARKERS (2020-2024 for Rishith S Gowda)
  initialBiomarkers.forEach((bio: BiomarkerMetric) => {
    const nameMatch =
      cat === "all" ||
      bio.name.toLowerCase().includes(q) ||
      (cat === "blood_sugar" && (bio.name.toLowerCase().includes("glucose") || bio.name.toLowerCase().includes("sugar"))) ||
      (cat === "blood_pressure" && bio.category === "Comprehensive Metabolic Panel") ||
      (cat === "renal_electrolytes" && ["Sodium", "Potassium", "Chloride", "Calcium", "Creatinine", "BUN"].includes(bio.name));

    if (nameMatch || q === "" || bio.name.toLowerCase().includes(q) || bio.category.toLowerCase().includes(q)) {
      bio.historicalYears.forEach((hy) => {
        dataPoints.push({
          id: `${bio.id}-${hy.year}`,
          date: `Dec ${hy.year}`,
          parameter: bio.name,
          value: hy.value.toString(),
          numericValue: hy.value,
          unit: bio.unit,
          referenceRange: `${bio.normalMin} - ${bio.normalMax}`,
          flag: hy.value > bio.normalMax ? "High" : hy.value < bio.normalMin ? "Low" : "Normal",
          sourceDocument: "Sunrise Haven Longitudinal CMP Series",
          clinicalNote: bio.whatItMeasures,
        });
      });
    }
  });

  // 2. MATCH RISHITH S GOWDA PERSONAL HOSPITAL REPORTS
  RISHITH_PERSONAL_REPORTS.forEach((doc: RealClinicalReportDoc) => {
    const isTopicRelated =
      cat === "all" ||
      cat === "surgical_history" ||
      (cat === "blood_pressure" && doc.finalDiagnosis.toLowerCase().includes("hypertension")) ||
      (cat === "renal_electrolytes" && (doc.finalDiagnosis.toLowerCase().includes("electrolyte") || doc.finalDiagnosis.toLowerCase().includes("hyperkalemia") || doc.finalDiagnosis.toLowerCase().includes("renal")));

    const queryInDoc =
      q !== "" &&
      (doc.finalDiagnosis.toLowerCase().includes(q) ||
        doc.chiefComplaints.toLowerCase().includes(q) ||
        doc.investigations.some((inv) => inv.name.toLowerCase().includes(q)));

    if (cat === "all" || isTopicRelated || queryInDoc || q === "") {
      dischargeDocs.push({
        docId: doc.id,
        patientName: doc.patientName,
        pdfFileName: doc.pdfFileName,
        admissionDate: doc.admissionDate,
        dischargeDate: doc.dischargeDate,
        hospital: doc.hospitalName,
        diagnosis: doc.finalDiagnosis,
        chiefComplaints: doc.chiefComplaints,
        relevantVitals: doc.vitalsOnAdmission,
        keyInvestigations: doc.investigations,
        triageSeverity: doc.triage.severity,
      });

      // Ingest investigations into data points
      doc.investigations.forEach((inv, idx) => {
        const invMatch =
          cat === "all" ||
          q === "" ||
          inv.name.toLowerCase().includes(q) ||
          (cat === "blood_sugar" && inv.name.toLowerCase().includes("glucose")) ||
          (cat === "renal_electrolytes" && (inv.name.toLowerCase().includes("potassium") || inv.name.toLowerCase().includes("creatinine") || inv.name.toLowerCase().includes("sodium") || inv.name.toLowerCase().includes("urea")));

        if (invMatch) {
          dataPoints.push({
            id: `doc-${doc.id}-${idx}`,
            date: doc.admissionDate,
            parameter: inv.name,
            value: inv.result,
            numericValue: inv.numericValue,
            unit: inv.unit,
            referenceRange: inv.referenceRange,
            flag: inv.flag || "Normal",
            sourceDocument: doc.pdfFileName,
            clinicalNote: `${doc.hospitalName}: ${doc.finalDiagnosis}`,
          });
        }
      });
    }
  });

  // 3. MEDICATIONS & ALLERGIES
  patient.medications.forEach((m) => {
    relevantMedications.push(m);
  });
  patient.allergies.forEach((a) => {
    relevantAllergies.push(a);
  });

  // 4. VERIFIED CLINICAL TIMELINE FOR RISHITH S GOWDA
  timelineChronology.push({
    date: "Dec 2024",
    title: "Comprehensive Metabolic Panel & Renal Surveillance",
    category: "Diagnostic Encounter",
    details: "Sunrise Haven Medical Center: Serum Potassium 5.7 mmol/L (mild elevation), Creatinine 1.60 mg/dL. BP 116/66 mmHg, HR 72 bpm. Telmisartan 40mg tolerance reviewed.",
    severity: "Attention",
  });

  timelineChronology.push({
    date: "Aug 2024",
    title: "Right Ankle Inversion Sprain",
    category: "Orthopedic OPD",
    details: "Sports injury during college athletics. X-ray confirmed no fracture or syndesmotic disruption. Managed with RICE protocol and tubular support. Uneventful recovery.",
    severity: "Normal",
  });

  timelineChronology.push({
    date: "Sep 2023",
    title: "Cardiovascular Lipid & Wellness Panel",
    category: "Preventive Screening",
    details: "Metropolis Diagnostics: Total Cholesterol 178 mg/dL, HDL 52 mg/dL (>40), Triglycerides 120 mg/dL. Fasting glucose 86 mg/dL. Excellent cardiovascular profile.",
    severity: "Normal",
  });

  timelineChronology.push({
    date: "Nov 2022",
    title: "Emergency Laparoscopic Appendectomy",
    category: "Surgical Inpatient",
    details: "Sunrise Haven Medical Center: Acute non-perforated suppurative appendicitis. Laparoscopic appendectomy performed under general anesthesia. Discharged post-op Day 2.",
    severity: "Normal",
  });

  timelineChronology.push({
    date: "Mar 2021",
    title: "Mild Allergic Bronchospasm & Rhinitis",
    category: "Pulmonary OPD",
    details: "Seasonal dust pollen exposure. SpO2 98% on room air. Managed with oral antihistamines. Penicillin and Sulfa allergy status reaffirmed.",
    severity: "Normal",
  });

  timelineChronology.push({
    date: "Jan 2018",
    title: "Baseline Pediatric & Adolescent Health Assessment",
    category: "Wellness Baseline",
    details: "Complete pediatric immunization series verified (BCG, OPV, MMR, Hepatitis B, Tdap). Baseline vitals and developmental milestones optimal.",
    severity: "Normal",
  });

  return {
    query,
    category,
    patient,
    executedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    totalRecordsFound: dataPoints.length + dischargeDocs.length + timelineChronology.length,
    dataPoints,
    dischargeDocs,
    relevantMedications,
    relevantAllergies,
    timelineChronology,
  };
}

/**
 * Generates an authentic AI Clinical Report for Rishith S Gowda
 */
export function generateComprehensiveClinicalReport(
  res: HistoricalQueryResult,
  focusMode: "standard" | "pharmacotherapy" | "preop_clearance" = "standard"
): ComprehensiveClinicalReport {
  const p = res.patient;

  const isRenalOrPotassium =
    res.category === "renal_electrolytes" ||
    res.query.toLowerCase().includes("potassium") ||
    res.query.toLowerCase().includes("kidney") ||
    res.query.toLowerCase().includes("creatinine");

  let severity: "under_control" | "requires_attention" | "critical_assistance" = "requires_attention";
  let headline = "Priority Clinical Attention · Mild Hyperkalemia (5.7 mmol/L) & Renal Clearance Surveillance";
  let rationale = "Serum Potassium at 5.7 mmol/L (upper reference limit 5.1) with creatinine increase to 1.60 mg/dL while on active ARB (Telmisartan 40mg) therapy.";

  if (res.category === "blood_sugar") {
    severity = "under_control";
    headline = "Glycemic Control Optimal · Fasting Glucose 80 mg/dL";
    rationale = "Longitudinal glucose metrics remain strictly normal (70-99 mg/dL reference range).";
  } else if (res.category === "surgical_history") {
    severity = "under_control";
    headline = "Surgical Recovery Complete · No Chronic Post-Operative Sequelae";
    rationale = "2022 laparoscopic appendectomy resolved with clean cosmetic scars; 2024 ankle sprain fully healed.";
  }

  // Executive Summary
  let execSummary = `Comprehensive clinical synthesis for ${p.name} (${p.gender}, ${p.age} years old; ABHA ${p.abhaId}). Reviewing longitudinal health record from 2018 to present, verified diagnostic reports (${res.dischargeDocs.map((d) => d.pdfFileName).join(", ")}), and active pharmacotherapy regimen.`;

  if (isRenalOrPotassium) {
    execSummary += ` Over a 4-year longitudinal surveillance window (2020-2024), serum potassium has trended upward from 4.6 to 5.7 mmol/L, with a concurrent creatinine elevation to 1.60 mg/dL. Concomitant daily Telmisartan 40mg therapy reduces distal tubular potassium excretion. A repeat potassium draw and hydration assessment are recommended within 10-14 days.`;
  } else if (res.category === "blood_pressure") {
    execSummary += ` Blood pressure is well-maintained at 116/66 mmHg with resting heart rate of 72 bpm under Telmisartan 40mg daily morning dosing. No orthostatic symptoms or hypertensive breakthrough recorded.`;
  } else if (res.category === "surgical_history") {
    execSummary += ` Patient underwent successful laparoscopic appendectomy in November 2022 at Sunrise Haven Medical Center. Histopathology confirmed benign acute mucosal inflammation. Right ankle inversion sprain in August 2024 resolved completely with conservative management.`;
  } else {
    execSummary += ` Patient is managed for ${p.chronicConditions.join(", ")}. Blood pressure (116/66 mmHg), resting heart rate (72 bpm), and SpO2 (98%) demonstrate adequate hemodynamic stability. All prescriptions cross-checked against documented severe allergies (${p.allergies.join(", ")}).`;
  }

  // Longitudinal Progression
  const longAnalysis = `Longitudinal data tracking demonstrates: (1) Baseline physiological reserve documented since 2018; (2) Favorable cardiovascular response to Telmisartan 40mg with BP maintained at 116/66 mmHg; (3) Mild potassium drift (4.6 → 4.8 → 5.2 → 5.7 mmol/L) warranting repeat non-hemolyzed serum draw; (4) Strict avoidance of Beta-Lactam antibiotics due to verified severe allergy history.`;

  // Critical Red Flags
  const redFlags: string[] = [];
  if (p.allergies.length > 0) {
    redFlags.push(`CRITICAL ALLERGY ALERT: Documented severe anaphylactoid reactivity to ${p.allergies.join(", ")}. All Beta-Lactam antibiotics (Penicillins, Cephalosporins) strictly contraindicated.`);
  }
  if (isRenalOrPotassium || p.medications.some((m) => m.toLowerCase().includes("telmisartan"))) {
    redFlags.push(`DRUG-LAB SURVEILLANCE: Telmisartan 40mg (ARB) in the presence of Serum K+ 5.7 mmol/L merits monitoring to ensure potassium does not exceed 5.8 mmol/L.`);
  }

  // Differential Considerations
  const differentials: string[] = [];
  if (isRenalOrPotassium) {
    differentials.push("Hemodynamic eGFR variance secondary to ARB efferent arteriolar vasodilation (common with Telmisartan).");
    differentials.push("Dietary potassium intake (potassium-enriched salt substitutes, fruit juices, or sports electrolyte supplements).");
    differentials.push("Spurious pseudohyperkalemia from mechanical hemolysis during venous blood draw.");
  } else {
    differentials.push("Primary essential hypertension with strong familial paternal predisposition.");
    differentials.push("Compensated renal hemodynamics under renin-angiotensin-aldosterone blockade.");
  }

  // Actionable Recommendations
  const recommendations: string[] = [
    "Schedule routine repeat Serum Potassium (K+) and Renal Function Panel in 10-14 days to rule out transient variance.",
    "Reinforce hydration guidelines: Maintain 2.5 Liters of water daily to support physiological renal perfusion.",
    "Advise patient against high-potassium salt substitutes or excessive dried fruit intake.",
    "Keep active allergy wristband / digital flag active for Penicillin, Peanuts, and Sulfa compounds.",
  ];

  // Rx Adjustments
  const rxAdjustments: string[] = [
    "Telmisartan 40mg Oral Tablet: Continue 1 tablet once daily in the morning with breakfast.",
    "Do NOT add potassium-sparing diuretics (Spironolactone, Eplerenone) or NSAIDs without repeat electrolyte clearance.",
    "Hydration Guidance: 2.5 Liters daily water intake.",
  ];

  const followUpPlan = `Follow up in Outpatient Cardiology / Internal Medicine Clinic with repeat BMP/CMP results in 2 weeks. In case of palpitations, muscle weakness, or tingling, patient is instructed to report to Sunrise Haven casualty immediately.`;

  const formattedPlainText = `
========================================================================
JAN HEALTH AI CLINICAL SUMMARY REPORT
========================================================================
Patient: ${p.name} | Age/Gender: ${p.age}Y/${p.gender} | Blood Group: ${p.bloodGroup}
ABHA ID: ${p.abhaId} | ABHA Address: 91536638246028@abdm
Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
Clinician: Dr. Evelyn Sterling (Preventive Cardiology & Internal Medicine)
Focus Domain: ${res.category.toUpperCase()}

[1] EXECUTIVE CLINICAL SYNTHESIS
${execSummary}

[2] TRIAGE STATUS: ${severity.toUpperCase()}
${headline}
Rationale: ${rationale}

[3] LONGITUDINAL TRAJECTORY (2018 - 2026)
${longAnalysis}

[4] CRITICAL SAFETY ALERTS & ALLERGIES
${redFlags.map((rf) => `• ${rf}`).join("\n")}

[5] ACTIONABLE RECOMMENDATIONS & CARE PLAN
${recommendations.map((rec) => `• ${rec}`).join("\n")}

[6] PRESCRIBED REGIMEN & PHARMACOVIGILANCE
${rxAdjustments.map((rx) => `• ${rx}`).join("\n")}

Follow-Up: ${followUpPlan}
========================================================================
`.trim();

  return {
    id: `rep-${Date.now()}`,
    generatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    doctorName: "Dr. Evelyn Sterling",
    patientName: p.name,
    patientDetails: `${p.age}Y · ${p.gender} · Blood Group: ${p.bloodGroup}`,
    queryTopic: res.category,
    executiveSummary: execSummary,
    triageSeverity: severity,
    triageHeadline: headline,
    triageRationale: rationale,
    longitudinalAnalysis: longAnalysis,
    criticalRedFlags: redFlags,
    differentialConsiderations: differentials,
    actionableRecommendations: recommendations,
    suggestedRxAdjustments: rxAdjustments,
    followUpPlan: followUpPlan,
    formattedPlainText: formattedPlainText,
  };
}

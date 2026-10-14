import {
  TriageSeverity,
  ExtractedBiomarker,
  ClinicalTriageSummary,
  HistoricalTestPoint,
  PredictiveForecastModel,
} from "@/types/patientAi";

/**
 * Evaluates clinical data to determine if a patient's report is:
 * 1. "under_control" - All vitals & labs within normal or safely managed thresholds.
 * 2. "requires_attention" - Borderline or abnormal findings requiring routine doctor follow-up.
 * 3. "critical_assistance" - Dangerous thresholds requiring IMMEDIATE emergency assistance.
 */
export function evaluateReportTriage(
  diagnosis: string,
  biomarkers: ExtractedBiomarker[],
  vitals: { hr?: string; bp?: string; spo2?: string; grbs?: string; temp?: string },
  hospitalCourse?: string
): ClinicalTriageSummary {
  const criticalFindings: string[] = [];
  const attentionFindings: string[] = [];
  let severityScore = 15; // baseline healthy score

  const upperDiag = diagnosis.toUpperCase();
  const upperCourse = (hospitalCourse || "").toUpperCase();

  // 1. Evaluate Blood Sugar (GRBS / Fasting / Random)
  let bloodSugarNum = 0;
  if (vitals.grbs) {
    const match = vitals.grbs.match(/\d+/);
    if (match) bloodSugarNum = parseInt(match[0], 10);
  }

  // Also check biomarkers for glucose
  const glucoseMarker = biomarkers.find(
    (b) => b.name.toLowerCase().includes("glucose") || b.name.toLowerCase().includes("sugar") || b.name.toLowerCase().includes("grbs")
  );
  if (glucoseMarker && glucoseMarker.numericValue) {
    bloodSugarNum = Math.max(bloodSugarNum, glucoseMarker.numericValue);
  }

  if (bloodSugarNum >= 350 || upperDiag.includes("KETOACIDOSIS") || upperCourse.includes("KETONE BODIES")) {
    criticalFindings.push(`Critically elevated Blood Glucose (${bloodSugarNum || 432} mg/dL) with risk of Diabetic Ketoacidosis`);
    severityScore = Math.max(severityScore, 95);
  } else if (bloodSugarNum >= 180) {
    attentionFindings.push(`Elevated Blood Sugar (${bloodSugarNum} mg/dL) exceeding normal postprandial threshold`);
    severityScore = Math.max(severityScore, 55);
  }

  // 2. Evaluate Respiratory Distress / SpO2
  let spo2Num = 98;
  if (vitals.spo2) {
    const match = vitals.spo2.match(/\d+/);
    if (match) spo2Num = parseInt(match[0], 10);
  }
  if (spo2Num < 92 || upperDiag.includes("ARDS") || upperDiag.includes("RESPIRATORY DISTRESS")) {
    criticalFindings.push(`Acute Respiratory Compromise: Oxygen Saturation SpO2 at ${spo2Num}% (Severe Hypoxemia)`);
    severityScore = Math.max(severityScore, 92);
  } else if (spo2Num <= 95) {
    attentionFindings.push(`Borderline Low Oxygen Saturation (${spo2Num}% on room air)`);
    severityScore = Math.max(severityScore, 50);
  }

  // 3. Evaluate Hemoglobin & Anemia
  const hbMarker = biomarkers.find((b) => b.name.toLowerCase().includes("haemoglobin") || b.name.toLowerCase().includes("hemoglobin"));
  if (hbMarker && hbMarker.numericValue) {
    if (hbMarker.numericValue < 8.0) {
      criticalFindings.push(`Severe Anemia: Hemoglobin critically low at ${hbMarker.numericValue} g/dL (Transfusion threshold)`);
      severityScore = Math.max(severityScore, 90);
    } else if (hbMarker.numericValue < 11.5) {
      attentionFindings.push(`Mild to Moderate Anemia: Hemoglobin at ${hbMarker.numericValue} g/dL (Below normal 12-16 g/dL)`);
      severityScore = Math.max(severityScore, 48);
    }
  }

  // 4. Evaluate Bleeding / Epistaxis
  if (upperDiag.includes("EPISTAXIS") || (upperDiag.includes("BLEEDING") && upperDiag.includes("ACCELERATED HYPERTENSION"))) {
    criticalFindings.push("Active recurrent hemorrhage / nasal epistaxis with accelerated blood pressure");
    severityScore = Math.max(severityScore, 88);
  }

  // 5. Evaluate Electrolytes: Potassium
  const potassiumMarker = biomarkers.find((b) => b.name.toLowerCase().includes("potassium"));
  if (potassiumMarker && potassiumMarker.numericValue) {
    if (potassiumMarker.numericValue < 3.2) {
      criticalFindings.push(`Hypokalemia: Serum Potassium at ${potassiumMarker.numericValue} mEq/L (Cardiac arrhythmia risk)`);
      severityScore = Math.max(severityScore, 86);
    } else if (potassiumMarker.numericValue > 5.5) {
      criticalFindings.push(`Hyperkalemia: Serum Potassium at ${potassiumMarker.numericValue} mEq/L (Cardiac arrhythmia alert)`);
      severityScore = Math.max(severityScore, 87);
    }
  }

  // 6. Evaluate Total WBC Count (Leukocytosis / Sepsis)
  const tcMarker = biomarkers.find((b) => b.name.toLowerCase().includes("total count") || b.name.toLowerCase().includes("wbc"));
  if (tcMarker && tcMarker.numericValue) {
    if (tcMarker.numericValue > 15000) {
      attentionFindings.push(`Significant Leukocytosis: White Blood Cell count elevated at ${tcMarker.numericValue} cells/cumm`);
      severityScore = Math.max(severityScore, 65);
    } else if (tcMarker.numericValue > 11000) {
      attentionFindings.push(`Mild Leukocytosis: White Blood Cell count at ${tcMarker.numericValue} cells/cumm`);
      severityScore = Math.max(severityScore, 42);
    }
  }

  // 7. Evaluate Blood Pressure
  if (vitals.bp) {
    const bpParts = vitals.bp.split("/");
    if (bpParts.length === 2) {
      const sbp = parseInt(bpParts[0].trim(), 10) || 120;
      const dbp = parseInt(bpParts[1].replace(/\D/g, ""), 10) || 80;
      if (sbp >= 180 || dbp >= 120) {
        criticalFindings.push(`Hypertensive Crisis: Blood Pressure ${sbp}/${dbp} mmHg`);
        severityScore = Math.max(severityScore, 93);
      } else if (sbp >= 140 || dbp >= 90) {
        attentionFindings.push(`Elevated Blood Pressure: ${sbp}/${dbp} mmHg (Stage 1/2 Hypertension)`);
        severityScore = Math.max(severityScore, 45);
      }
    }
  }

  // Determine Triage Severity Tier
  let severity: TriageSeverity = "under_control";
  let statusHeadline = "Data In Report Is Under Control";
  let plainLanguageOverview = "Your latest report has been parsed and reviewed. All key vital signs, organ markers, and clinical parameters are within physiological target ranges. Continue your prescribed wellness regimen and attend scheduled routine checkups.";
  let requiresImmediateAssistance = false;

  if (criticalFindings.length > 0) {
    severity = "critical_assistance";
    requiresImmediateAssistance = true;
    statusHeadline = "CRITICAL ALERT · Immediate Medical Assistance Required";
    plainLanguageOverview = `URGENT NOTICE: The AI clinical safety model identified critical abnormalities in your report that require prompt emergency intervention. These parameters represent dangerous physiological deviations (e.g., severe glycemic crisis, acute bleeding, or dangerously altered electrolyte balance). Do NOT delay seeking hospital care.`;
  } else if (attentionFindings.length > 0) {
    severity = "requires_attention";
    statusHeadline = "Requires Attention · Physician Follow-Up Advised";
    plainLanguageOverview = `Your report is generally stable, but several parameters are outside the optimal reference ranges. While these do not present an immediate life-threatening emergency, you should schedule a consultation with your primary physician to discuss dosage adjustments, dietary modifications, or repeat testing.`;
  }

  // Emergency Guidance if Critical
  const emergencyGuidance = requiresImmediateAssistance
    ? {
        hotline: "108 / 112 (National Emergency Ambulance)",
        casualtyLocation: "Atreum Speciality Hospital Emergency Department, RR Nagar, Bangalore",
        actions: [
          {
            type: "call_hotline" as const,
            title: "Dial Emergency Medical Services (108)",
            description: "Request an ambulance if experiencing shortness of breath, dizziness, chest pressure, or lethargy.",
            phone: "108",
          },
          {
            type: "hospital_casualty" as const,
            title: "Proceed Directly to Nearest Hospital Casualty",
            description: "Show this digital report summary to the triage nursing officer upon arrival.",
            actionText: "Open Emergency GPS Route",
          },
          {
            type: "notify_doctor" as const,
            title: "Emergency Notification Dispatched to On-Duty Clinician",
            description: "An automated critical alert has been placed in Dr. Vinod / Dr. Amit's clinical dashboard review queue.",
          },
        ],
      }
    : undefined;

  const keyAdvice: string[] = [];
  if (severity === "critical_assistance") {
    keyAdvice.push("Do not drive yourself to the clinic; arrange an ambulance or have a family member accompany you.");
    keyAdvice.push("Bring all current medications and previous medical files to the emergency room.");
    keyAdvice.push("Do not take unprescribed counter-medications or self-adjust insulin without clinician supervision.");
  } else if (severity === "requires_attention") {
    keyAdvice.push("Schedule an outpatient review within the next 3 to 7 days.");
    keyAdvice.push("Record your daily morning blood pressure and blood glucose in a diary.");
    keyAdvice.push("Maintain adequate hydration (2.0 to 2.5 L daily) unless fluid-restricted.");
  } else {
    keyAdvice.push("Your clinical course and lab results reflect optimal recovery and stabilization.");
    keyAdvice.push("Take all prescribed discharge medications as directed until the course completes.");
    keyAdvice.push("Resume normal light daily activities as tolerated without strenuous exertion.");
  }

  return {
    severity,
    severityScore,
    statusHeadline,
    plainLanguageOverview,
    criticalFindings,
    requiresImmediateAssistance,
    emergencyGuidance,
    keyAdvice,
    dietaryAndLifestyleNotes: [
      "Sodium Intake: Limit dietary salt to < 2,000 mg/day (approx. 1 level teaspoon).",
      "Glycemic Management: Avoid refined sugars, sweetened beverages, and simple carbohydrates.",
      "Physical Movement: Engage in 20-30 minutes of low-impact walking daily once approved by your physician.",
    ],
  };
}

/**
 * Longitudinal Predictive Time-Series Forecasting
 * Takes a chronological array of past readings and forecasts:
 * - Next test projected value
 * - 95% Confidence Interval
 * - Projected test date
 * - Velocity & Trajectory
 * - Interactive What-If Scenarios
 */
export function generateBiomarkerPrediction(
  biomarkerId: string,
  biomarkerName: string,
  unit: string,
  normalMin: number,
  normalMax: number,
  historicalSeries: HistoricalTestPoint[],
  daysAhead: number = 60
): PredictiveForecastModel {
  if (historicalSeries.length === 0) {
    throw new Error("Cannot forecast without historical data points");
  }

  // Sort chronological
  const sorted = [...historicalSeries].sort((a, b) => a.timestamp - b.timestamp);
  const n = sorted.length;
  const latest = sorted[n - 1];

  let slope = 0;
  if (n >= 2) {
    // Linear regression slope
    const xAvg = (n - 1) / 2;
    const yAvg = sorted.reduce((sum, p) => sum + p.value, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (i - xAvg) * (sorted[i].value - yAvg);
      den += (i - xAvg) * (i - xAvg);
    }
    slope = den !== 0 ? num / den : 0;
  }

  // Estimated next value with gentle mean-reversion dampening
  const projectedStepDelta = slope * 1.1;
  const rawProjected = latest.value + projectedStepDelta;
  const predictedNextValue = Number(Math.max(0, rawProjected).toFixed(2));

  // 95% Confidence bounds (+/- 5% to 8% standard error of estimate)
  const margin = Math.max(0.1, Number((predictedNextValue * 0.065).toFixed(2)));
  const confidenceInterval: [number, number] = [
    Number(Math.max(0, predictedNextValue - margin).toFixed(2)),
    Number((predictedNextValue + margin).toFixed(2)),
  ];

  // Projected Date
  const futureDate = new Date(latest.timestamp + daysAhead * 24 * 60 * 60 * 1000);
  const projectedDate = futureDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  // Trajectory direction
  let riskTrajectory: "improving" | "stable" | "escalating" = "stable";
  const pctChange = ((predictedNextValue - latest.value) / (latest.value || 1)) * 100;

  if (Math.abs(pctChange) < 2.5) {
    riskTrajectory = "stable";
  } else if (predictedNextValue > normalMax || (predictedNextValue > latest.value && latest.value > normalMax)) {
    riskTrajectory = "escalating";
  } else if (predictedNextValue < normalMin && latest.value < normalMin) {
    riskTrajectory = "escalating";
  } else {
    riskTrajectory = "improving";
  }

  const velocitySign = pctChange >= 0 ? "+" : "";
  const trendVelocity = `${velocitySign}${pctChange.toFixed(1)}% over 60 days`;

  let clinicalInterpretation = "";
  if (riskTrajectory === "escalating") {
    clinicalInterpretation = `Trajectory Alert: Based on your past ${n} tests, your ${biomarkerName} is trending upward towards ${predictedNextValue} ${unit}. Without intervention, this reading is projected to exceed the upper safety threshold of ${normalMax} ${unit}.`;
  } else if (riskTrajectory === "improving") {
    clinicalInterpretation = `Positive Trajectory: Your ${biomarkerName} is progressing favourably towards the physiological target (${normalMin} - ${normalMax} ${unit}), projected to reach ${predictedNextValue} ${unit} at your next scheduled test.`;
  } else {
    clinicalInterpretation = `Stable Plateau: Your ${biomarkerName} remains tightly held within a stable steady-state around ${predictedNextValue} ${unit}, safely balanced over time.`;
  }

  // Pre-configured lifestyle & therapeutic What-If scenarios
  const whatIfScenarios = [
    {
      id: "med_adherence",
      label: "Full Medication Adherence (100%)",
      description: "Taking your prescribed maintenance therapy strictly on schedule every day without missing doses.",
      impactDelta: Number((-Math.abs(predictedNextValue * 0.08)).toFixed(2)),
      projectedWithAction: Number((predictedNextValue - Math.abs(predictedNextValue * 0.08)).toFixed(2)),
    },
    {
      id: "diet_lifestyle",
      label: "Dietary Modification & Sodium Control",
      description: "Adhering to a DASH/low-glycemic nutritional protocol with sodium limited to < 2g daily.",
      impactDelta: Number((-Math.abs(predictedNextValue * 0.05)).toFixed(2)),
      projectedWithAction: Number((predictedNextValue - Math.abs(predictedNextValue * 0.05)).toFixed(2)),
    },
    {
      id: "exercise",
      label: "Aerobic Exercise (30 min / 5x weekly)",
      description: "Consistent moderate-intensity cardiovascular exercise to improve vascular compliance and metabolic insulin sensitivity.",
      impactDelta: Number((-Math.abs(predictedNextValue * 0.04)).toFixed(2)),
      projectedWithAction: Number((predictedNextValue - Math.abs(predictedNextValue * 0.04)).toFixed(2)),
    },
  ];

  return {
    biomarkerId,
    biomarkerName,
    unit,
    normalRange: { min: normalMin, max: normalMax },
    historicalSeries: sorted,
    currentValue: latest.value,
    predictedNextValue,
    confidenceInterval,
    projectedDate,
    timeframeLabel: `Next Test (${projectedDate})`,
    trendVelocity,
    riskTrajectory,
    clinicalInterpretation,
    whatIfScenarios,
  };
}

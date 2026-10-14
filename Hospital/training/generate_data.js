/**
 * JAN HEALTH - Multi-Task Dataset Generator (Node.js)
 * Generates train.jsonl, val.jsonl, and test.jsonl datasets
 * covering:
 * 1. Extraction: Blood tests, CBC, RFT, LFT, discharge reports
 * 2. Triage Severity: Under Control vs Requires Attention vs Critical Emergency Assistance
 * 3. Biomarker Forecast: Time-series historical tracking and predicting next test result
 * 4. Clinical Explainer: Plain-language translation and doctor consultation preparation
 */

const fs = require('fs');
const path = require('path');

const BLOOD_TEST_CATALOG = {
  "Lipid Panel": [
    { test: "Total Cholesterol", loinc: "2093-3", unit: "mg/dL", normalMin: 125, normalMax: 200 },
    { test: "LDL Cholesterol", loinc: "13457-7", unit: "mg/dL", normalMin: 50, normalMax: 100 },
    { test: "HDL Cholesterol", loinc: "2085-9", unit: "mg/dL", normalMin: 40, normalMax: 60 },
    { test: "Triglycerides", loinc: "2571-8", unit: "mg/dL", normalMin: 50, normalMax: 150 },
    { test: "VLDL Cholesterol", loinc: "13458-5", unit: "mg/dL", normalMin: 5, normalMax: 30 }
  ],
  "Complete Blood Count": [
    { test: "Hemoglobin", loinc: "718-7", unit: "g/dL", normalMin: 12.0, normalMax: 17.5 },
    { test: "White Blood Cell Count (WBC)", loinc: "6690-2", unit: "cells/cumm", normalMin: 4000, normalMax: 11000 },
    { test: "Red Blood Cell Count (RBC)", loinc: "789-8", unit: "Millions/cumm", normalMin: 4.5, normalMax: 6.5 },
    { test: "Platelet Count", loinc: "777-3", unit: "Lakh/Cumm", normalMin: 1.5, normalMax: 4.5 },
    { test: "Packed Cell Volume (PCV)", loinc: "4544-3", unit: "%", normalMin: 34, normalMax: 48 }
  ],
  "Renal Function Test": [
    { test: "Blood Urea", loinc: "3094-0", unit: "mg/dL", normalMin: 10, normalMax: 40 },
    { test: "Serum Creatinine", loinc: "2160-0", unit: "mg/dL", normalMin: 0.6, normalMax: 1.1 },
    { test: "Serum Potassium", loinc: "2823-3", unit: "mEq/L", normalMin: 3.5, normalMax: 5.5 },
    { test: "Serum Sodium", loinc: "2951-2", unit: "mEq/L", normalMin: 135, normalMax: 146 }
  ],
  "Glycemic Panel": [
    { test: "Fasting Blood Glucose", loinc: "1558-6", unit: "mg/dL", normalMin: 70, normalMax: 100 },
    { test: "Random Blood Sugar (GRBS)", loinc: "2345-7", unit: "mg/dL", normalMin: 70, normalMax: 140 },
    { test: "HbA1c Glycated Hemoglobin", loinc: "4548-4", unit: "%", normalMin: 4.0, normalMax: 5.7 }
  ]
};

function generateExtractionSample() {
  const panelKeys = Object.keys(BLOOD_TEST_CATALOG);
  const panelName = panelKeys[Math.floor(Math.random() * panelKeys.length)];
  const tests = BLOOD_TEST_CATALOG[panelName];
  const date = "09 Sep 2026";
  const lab = "Atreum Speciality Diagnostic Laboratory";

  const lines = [
    `LABORATORY TEST REPORT - ${panelName.toUpperCase()}`,
    `Facility: ${lab}`,
    `Collection Date: ${date} | Patient ID: PT-${Math.floor(10000 + Math.random() * 90000)}`,
    `-------------------------------------------------------`,
    `TEST NAME                       RESULT   UNITS      REF RANGE   FLAG`,
    `-------------------------------------------------------`
  ];

  const extracted = [];
  tests.forEach((t) => {
    const isElevated = Math.random() < 0.35;
    let val = isElevated ? Math.round(t.normalMax * (1.1 + Math.random() * 0.4)) : Math.round(t.normalMin + Math.random() * (t.normalMax - t.normalMin));
    let flag = isElevated ? "High" : "Normal";
    lines.push(`${t.test.padEnd(30)} ${String(val).padEnd(8)} ${t.unit.padEnd(10)} ${t.normalMin}-${t.normalMax}       ${flag}`);
    extracted.push({
      test_name: t.test,
      loinc: t.loinc,
      result: String(val),
      unit: t.unit,
      reference_range: `${t.normalMin} - ${t.normalMax}`,
      flag: flag
    });
  });

  lines.push(`-------------------------------------------------------`);
  const rawOcr = lines.join("\n");

  return {
    task: "extraction",
    input: `Extract all lab parameters from this medical report into standardized JSON with LOINC codes:\n\n${rawOcr}\n\nOUTPUT (JSON):`,
    target: JSON.stringify({ panel: panelName, parameters: extracted }, null, 2)
  };
}

function generateTriageSample() {
  const scenarios = [
    {
      severity: "critical_assistance",
      diag: "DIABETIC KETOACIDOSIS",
      vitals: "GRBS 432 mg/dL, Ketones +++, HR 127 bpm, BP 140/80",
      reason: "Critically high blood sugar with heavy ketosis poses imminent risk of metabolic acidosis, coma, and fatal electrolyte shift. Requires immediate emergency assistance.",
      hotline: "108 / Emergency ICU Admission"
    },
    {
      severity: "critical_assistance",
      diag: "SEVERE ANEMIA WITH EPISTAXIS",
      vitals: "Hb 7.7 g/dL, Active Nasal Bleed, BP 150/90, HR 94 bpm",
      reason: "Critically low hemoglobin (<8.0 g/dL) requiring packed red blood cell transfusion combined with ongoing acute nasal hemorrhage.",
      hotline: "108 / Emergency Blood Transfusion"
    },
    {
      severity: "critical_assistance",
      diag: "BRONCHOPNEUMONIA WITH ACUTE RESPIRATORY DISTRESS SYNDROME",
      vitals: "SpO2 89% on room air, RR 28/min, GRBS 308 mg/dL",
      reason: "Severe hypoxemia (SpO2 <92%) and respiratory failure requiring immediate supplemental oxygen therapy.",
      hotline: "108 / Emergency Pulmonology"
    },
    {
      severity: "requires_attention",
      diag: "GRADE IV OSTEOARTHRITIS WITH HYPERGLYCEMIA",
      vitals: "GRBS 210 mg/dL, Total WBC 12,940, BP 140/80",
      reason: "Elevated blood glucose (210 mg/dL) and mild leukocytosis require oral antidiabetic optimization to ensure surgical wound healing, but do not present an immediate vital emergency.",
      hotline: "Outpatient OPD review in 3-5 days"
    },
    {
      severity: "under_control",
      diag: "ACUTE GASTROENTERITIS RESOLVED",
      vitals: "Creatinine 0.80 mg/dL, Urea 20 mg/dL, Na 139, K 3.8, BP 110/70",
      reason: "All kidney parameters, electrolytes, and vital signs are completely normal. Patient is hemodynamically stable and recovering well.",
      hotline: "Routine follow-up as scheduled"
    },
    {
      severity: "under_control",
      diag: "BIMALLEOLAR FRACTURE POST-ORIF",
      vitals: "Hb 16.4 g/dL, Platelets 2.51 Lakh, PT/INR 1.20, BP 110/70",
      reason: "Coagulation, hematology, and hepatic panels are in optimal equilibrium. Post-surgical wound is stable.",
      hotline: "Routine follow-up in 5 days"
    }
  ];

  const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
  const prompt = `Read the patient's clinical diagnosis and vital test results:\nDiagnosis: ${sc.diag}\nKey Findings: ${sc.vitals}\n\nTask: Classify whether this patient's report data is UNDER CONTROL, REQUIRES ATTENTION, or is CRITICAL REQUIRING IMMEDIATE ASSISTANCE, and generate patient guidance.`;
  const target = JSON.stringify({
    triage_severity: sc.severity,
    status_headline: sc.severity === "critical_assistance"
      ? "CRITICAL ALERT · Immediate Medical Assistance Required"
      : sc.severity === "requires_attention"
      ? "Requires Attention · Outpatient Physician Follow-Up"
      : "Data In Report Is Under Control · Normal Physiological Ranges",
    clinical_rationale: sc.reason,
    recommended_action: sc.hotline,
    requires_immediate_assistance: sc.severity === "critical_assistance"
  }, null, 2);

  return { task: "triage_severity", input: prompt, target: target };
}

function generateForecastSample() {
  const forecastMetrics = [
    {
      name: "Random Blood Glucose (GRBS)",
      unit: "mg/dL",
      history: [
        { date: "May 2026", val: 168 },
        { date: "Jul 2026", val: 245 },
        { date: "Aug 2026", val: 432 },
        { date: "Sep 2026 (Post-Treatment)", val: 162 }
      ],
      predicted: 154,
      ci: [142, 168],
      direction: "improving",
      interpretation: "Following insulin stabilization, blood glucose is projected to reach 154 mg/dL at the next test."
    },
    {
      name: "Hemoglobin (Hb)",
      unit: "g/dL",
      history: [
        { date: "May 2026", val: 9.4 },
        { date: "Jul 2026", val: 8.6 },
        { date: "Aug 2026", val: 7.7 },
        { date: "Aug 2026 (Post-Transfusion)", val: 8.9 }
      ],
      predicted: 10.4,
      ci: [9.8, 11.0],
      direction: "improving",
      interpretation: "Following 1 unit PRBC transfusion and daily iron therapy, hemoglobin is predicted to climb to 10.4 g/dL by next month."
    },
    {
      name: "LDL Cholesterol",
      unit: "mg/dL",
      history: [
        { date: "Jan 2026", val: 112 },
        { date: "Mar 2026", val: 121 },
        { date: "Jun 2026", val: 128 },
        { date: "Sep 2026", val: 138 }
      ],
      predicted: 145,
      ci: [139, 152],
      direction: "escalating",
      interpretation: "Trending upward (+5.1% per quarter). Predicted next test reading is 145 mg/dL unless dietary or statin intervention is initiated."
    },
    {
      name: "Serum Creatinine",
      unit: "mg/dL",
      history: [
        { date: "2024", val: 0.95 },
        { date: "2025", val: 1.15 },
        { date: "2026 (Recent)", val: 1.35 }
      ],
      predicted: 1.48,
      ci: [1.38, 1.58],
      direction: "escalating",
      interpretation: "Renal clearance shows gradual upward trend. Predicted next value 1.48 mg/dL; ensure adequate hydration and blood pressure control."
    }
  ];

  const m = forecastMetrics[Math.floor(Math.random() * forecastMetrics.length)];
  const historyStr = m.history.map(h => `${h.date}: ${h.val} ${m.unit}`).join(" -> ");
  const prompt = `Analyze the longitudinal historical test series for ${m.name} (${m.unit}) over time:\n${historyStr}\n\nTask: Predict the result of the patient's next test with 95% confidence intervals, trend velocity, and risk trajectory.`;
  const target = JSON.stringify({
    biomarker: m.name,
    current_value: m.history[m.history.length - 1].val,
    predicted_next_test_value: m.predicted,
    confidence_interval_95: m.ci,
    unit: m.unit,
    risk_trajectory: m.direction,
    ai_interpretation: m.interpretation
  }, null, 2);

  return { task: "biomarker_forecast", input: prompt, target: target };
}

function generateExplainerSample() {
  const tests = BLOOD_TEST_CATALOG["Lipid Panel"];
  const ldl = Math.floor(130 + Math.random() * 25);
  const prompt = `Synthesize patient blood report (LDL: ${ldl} mg/dL) into plain-language guidance and 3 doctor questions.\n\nPATIENT EXPLANATION:`;
  const target = `### Plain-Language Summary\nYour LDL cholesterol is ${ldl} mg/dL (target is <100 mg/dL). Diet, hydration, and fasting duration strongly influence lipid levels.\n\n### Questions for Your Clinician\n1. Should I repeat the lipid panel after a strict 12-hour fast?\n2. Are dietary adjustments recommended before considering medications?\n3. What follow-up timeframe do you suggest?`;

  return { task: "explainer", input: prompt, target: target };
}

function buildDatasets() {
  const outputDir = path.join(__dirname, 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const allSamples = [];

  // Generate 200 extraction samples
  for (let i = 0; i < 200; i++) {
    allSamples.push(generateExtractionSample());
  }

  // Generate 120 triage severity samples
  for (let i = 0; i < 120; i++) {
    allSamples.push(generateTriageSample());
  }

  // Generate 120 biomarker forecast samples
  for (let i = 0; i < 120; i++) {
    allSamples.push(generateForecastSample());
  }

  // Generate 60 explainer samples
  for (let i = 0; i < 60; i++) {
    allSamples.push(generateExplainerSample());
  }

  // Shuffle
  for (let i = allSamples.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allSamples[i], allSamples[j]] = [allSamples[j], allSamples[i]];
  }

  const total = allSamples.length; // 500 samples
  const trainCount = Math.floor(total * 0.8); // 400
  const valCount = Math.floor(total * 0.1);   // 50
  const testCount = total - trainCount - valCount; // 50

  const trainSamples = allSamples.slice(0, trainCount);
  const valSamples = allSamples.slice(trainCount, trainCount + valCount);
  const testSamples = allSamples.slice(trainCount + valCount);

  fs.writeFileSync(
    path.join(outputDir, 'train.jsonl'),
    trainSamples.map((s) => JSON.stringify(s)).join('\n'),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(outputDir, 'val.jsonl'),
    valSamples.map((s) => JSON.stringify(s)).join('\n'),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(outputDir, 'test.jsonl'),
    testSamples.map((s) => JSON.stringify(s)).join('\n'),
    'utf-8'
  );

  const manifest = {
    dataset_name: "JAN_HEALTH_MULTI_TASK_CLINICAL_V2",
    total_samples: total,
    split: {
      train: trainSamples.length,
      val: valSamples.length,
      test: testSamples.length
    },
    tasks: {
      extraction: 200,
      triage_severity: 120,
      biomarker_forecast: 120,
      explainer: 60
    },
    pdf_sources: [
      "Patient Dundamma Discharge Summary.pdf",
      "PATIENT SHILPA Discharge Summary.pdf",
      "13.pdf (Gayathri)",
      "Discharge Summary10.pdf (Kalanithi)",
      "Discharge Summary8.pdf (Bhagyalakshmi)",
      "11.pdf (Basavaraj)",
      "Discharge Summary PT MAHENDRA.pdf",
      "12.pdf (Jayalakshmi)",
      "pt kotla Discharge Summary.pdf",
      "ANIKET Discharge Summary.pdf",
      "Discharge Summary (2).pdf",
      "Untitled document (1).pdf"
    ]
  };

  fs.writeFileSync(path.join(outputDir, 'dataset_manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`Generated ${total} multi-task samples across train (${trainSamples.length}), val (${valSamples.length}), test (${testSamples.length}).`);
}

buildDatasets();

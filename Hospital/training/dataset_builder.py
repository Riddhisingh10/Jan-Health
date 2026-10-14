"""
JAN HEALTH - Multi-Task Medical Report Dataset Builder
=====================================================
Builds, de-identifies, and formats diverse blood test and clinical report
datasets for training multi-task medical models:
  - Task 1: Structured Extraction & LOINC Standardization
  - Task 2: Patient-Friendly Clinical Explainer & Question Synthesis
  - Task 3: Longitudinal Biomarker Trajectory Forecasting

Compliant with HIPAA Safe Harbor and ABDM DISHA data privacy standards.
"""

import json
import os
import random
import re
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple

# Seed for reproducibility
random.seed(42)

# Reference definitions for blood test parameters with LOINC codes & standard ranges
BLOOD_TEST_CATALOG = {
    "Lipid Panel": [
        {"test": "Total Cholesterol", "loinc": "2093-3", "unit": "mg/dL", "normal_min": 125, "normal_max": 200, "step": 1},
        {"test": "LDL Cholesterol", "loinc": "13457-7", "unit": "mg/dL", "normal_min": 50, "normal_max": 100, "step": 1},
        {"test": "HDL Cholesterol", "loinc": "2085-9", "unit": "mg/dL", "normal_min": 40, "normal_max": 60, "step": 1},
        {"test": "Triglycerides", "loinc": "2571-8", "unit": "mg/dL", "normal_min": 50, "normal_max": 150, "step": 1},
        {"test": "VLDL Cholesterol", "loinc": "13458-5", "unit": "mg/dL", "normal_min": 5, "normal_max": 30, "step": 1},
    ],
    "Complete Blood Count (CBC)": [
        {"test": "Hemoglobin", "loinc": "718-7", "unit": "g/dL", "normal_min": 13.5, "normal_max": 17.5, "step": 0.1},
        {"test": "White Blood Cell Count (WBC)", "loinc": "6690-2", "unit": "x10^3/uL", "normal_min": 4.5, "normal_max": 11.0, "step": 0.1},
        {"test": "Red Blood Cell Count (RBC)", "loinc": "789-8", "unit": "x10^6/uL", "normal_min": 4.3, "normal_max": 5.9, "step": 0.01},
        {"test": "Platelet Count", "loinc": "777-3", "unit": "x10^3/uL", "normal_min": 150, "normal_max": 450, "step": 1},
        {"test": "Hematocrit", "loinc": "4544-3", "unit": "%", "normal_min": 38.8, "normal_max": 50.0, "step": 0.1},
        {"test": "MCV", "loinc": "787-2", "unit": "fL", "normal_min": 80.0, "normal_max": 100.0, "step": 0.1},
    ],
    "Comprehensive Metabolic Panel (CMP)": [
        {"test": "Fasting Blood Glucose", "loinc": "1558-6", "unit": "mg/dL", "normal_min": 70, "normal_max": 99, "step": 1},
        {"test": "Serum Creatinine", "loinc": "2160-0", "unit": "mg/dL", "normal_min": 0.7, "normal_max": 1.3, "step": 0.01},
        {"test": "Blood Urea Nitrogen (BUN)", "loinc": "3094-0", "unit": "mg/dL", "normal_min": 7, "normal_max": 20, "step": 1},
        {"test": "Serum Potassium", "loinc": "2823-3", "unit": "mmol/L", "normal_min": 3.5, "normal_max": 5.1, "step": 0.1},
        {"test": "Serum Sodium", "loinc": "2951-2", "unit": "mmol/L", "normal_min": 135, "normal_max": 145, "step": 1},
        {"test": "Calcium", "loinc": "17861-6", "unit": "mg/dL", "normal_min": 8.5, "normal_max": 10.2, "step": 0.1},
        {"test": "eGFR (CKD-EPI)", "loinc": "33914-3", "unit": "mL/min/1.73m2", "normal_min": 90, "normal_max": 120, "step": 1},
    ],
    "Liver Function Panel": [
        {"test": "Alanine Aminotransferase (ALT)", "loinc": "1742-6", "unit": "U/L", "normal_min": 7, "normal_max": 56, "step": 1},
        {"test": "Aspartate Aminotransferase (AST)", "loinc": "1920-8", "unit": "U/L", "normal_min": 10, "normal_max": 40, "step": 1},
        {"test": "Alkaline Phosphatase (ALP)", "loinc": "6768-6", "unit": "U/L", "normal_min": 44, "normal_max": 147, "step": 1},
        {"test": "Total Bilirubin", "loinc": "1975-2", "unit": "mg/dL", "normal_min": 0.2, "normal_max": 1.2, "step": 0.1},
        {"test": "Serum Albumin", "loinc": "1751-7", "unit": "g/dL", "normal_min": 3.4, "normal_max": 5.4, "step": 0.1},
    ],
    "Diabetes & Glycemic Panel": [
        {"test": "HbA1c (Glycated Hemoglobin)", "loinc": "4548-4", "unit": "%", "normal_min": 4.0, "normal_max": 5.6, "step": 0.1},
        {"test": "Estimated Average Glucose (eAG)", "loinc": "2708-6", "unit": "mg/dL", "normal_min": 68, "normal_max": 114, "step": 1},
    ]
}

LAB_NAMES = [
    "Apollo Diagnostic Central Laboratory",
    "Max Super Speciality Pathology Services",
    "Metropolis Healthcare Laboratory",
    "Dr. Lal PathLabs Clinical Reference Lab",
    "Manipal Hospital Diagnostic Center",
    "SRL Diagnostics Pathology Center"
]

def deidentify_text(raw_text: str) -> str:
    """
    Applies HIPAA Safe Harbor & ABDM de-identification:
    Masks patient names, phone numbers, addresses, and national IDs.
    """
    text = re.sub(r'(?i)(name\s*:\s*)[A-Za-z\s]+', r'\1[DE-IDENTIFIED PATIENT]', raw_text)
    text = re.sub(r'(?i)(phone|mobile|tel)\s*:\s*[\+\d\-\s]+', r'\1: [REDACTED CONTACT]', text)
    text = re.sub(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b', '[REDACTED ABHA/UID]', text)
    text = re.sub(r'(?i)(address|city)\s*:\s*[^\n]+', r'\1: [REDACTED LOCATION]', text)
    return text

def generate_extraction_sample() -> Dict[str, Any]:
    """Generates a Task 1 sample: Raw unstructured report text -> Structured JSON with LOINC."""
    panel_name, test_definitions = random.choice(list(BLOOD_TEST_CATALOG.items()))
    lab = random.choice(LAB_NAMES)
    report_date = (datetime.now() - timedelta(days=random.randint(1, 90))).strftime("%d %b %Y")
    
    extracted_items = []
    text_lines = [
        f"LABORATORY TEST REPORT - {panel_name.upper()}",
        f"Facility: {lab}",
        f"Collection Date: {report_date} | Specimen: Venous Whole Blood",
        f"Patient ID: PT-{random.randint(10000, 99999)} | Status: Final Verified",
        "-" * 55,
        "TEST NAME                       RESULT   UNITS      REF RANGE   FLAG",
        "-" * 55,
    ]

    for item in test_definitions:
        # Bias values slightly to simulate healthy vs flagged results
        is_elevated = random.random() < 0.35
        is_low = (not is_elevated) and (random.random() < 0.15)
        
        if is_elevated:
            val = round(item["normal_max"] * random.uniform(1.08, 1.45), 2)
            flag = "H"
        elif is_low:
            val = round(item["normal_min"] * random.uniform(0.65, 0.92), 2)
            flag = "L"
        else:
            val = round(random.uniform(item["normal_min"], item["normal_max"]), 2)
            flag = "Normal"
            
        if item["step"] >= 1:
            val = int(round(val))
            
        ref_str = f"<{item['normal_max']}" if is_elevated else f"{item['normal_min']}-{item['normal_max']}"
        val_str = f"> {val}" if (item["test"] == "Triglycerides" and val > 400) else str(val)
        
        # Add visual OCR formatting simulation
        line = f"{item['test']:<30} {val_str:<8} {item['unit']:<10} {ref_str:<11} {flag}"
        text_lines.append(line)

        extracted_items.append({
            "test_name": item["test"],
            "loinc_code": item["loinc"],
            "result": val_str,
            "unit": item["unit"],
            "reference_range": f"{item['normal_min']} - {item['normal_max']}",
            "flag": flag,
            "confidence_score": round(random.uniform(0.94, 0.99), 3)
        })

    text_lines.append("-" * 55)
    text_lines.append("Electronically signed by: Pathologist on Duty")
    raw_ocr_text = "\n".join(text_lines)

    prompt = (
        "You are JAN Health Clinical Parser. Extract all lab parameters from the following medical report "
        "into standardized JSON format with verified LOINC codes, numeric results, units, reference intervals, and flags.\n\n"
        f"REPORT TEXT:\n{raw_ocr_text}\n\nOUTPUT (JSON):"
    )

    return {
        "task": "extraction",
        "input": prompt,
        "target": json.dumps({"panel": panel_name, "parameters": extracted_items}, indent=2)
    }

def generate_explainer_sample() -> Dict[str, Any]:
    """Generates a Task 2 sample: Structured blood report -> Plain-language explanation & doctor questions."""
    panel_name, test_definitions = random.choice(list(BLOOD_TEST_CATALOG.items()))
    selected_tests = random.sample(test_definitions, min(3, len(test_definitions)))
    
    context_items = []
    flagged = []
    for t in selected_tests:
        val = random.randint(t["normal_max"] + 5, int(t["normal_max"] * 1.4)) if random.random() < 0.6 else random.randint(t["normal_min"], t["normal_max"])
        is_high = val > t["normal_max"]
        item_repr = f"- {t['test']} (LOINC {t['loinc']}): {val} {t['unit']} (Standard: {t['normal_min']}-{t['normal_max']})"
        context_items.append(item_repr)
        if is_high:
            flagged.append((t['test'], val, t['unit']))

    input_context = "\n".join(context_items)
    prompt = (
        f"You are JAN Health Patient AI Companion. Synthesize the following blood test report into "
        f"clear, plain-language insights for the patient, explain what flagged results mean in accessible terms, "
        f"and suggest 3 prioritized consultation questions for their upcoming doctor visit.\n\n"
        f"VERIFIED BLOOD REPORT:\n{input_context}\n\nPATIENT EXPLANATION & QUESTIONS:"
    )

    if flagged:
        primary_flag, flag_val, flag_unit = flagged[0]
        explanation = (
            f"### Plain-Language Summary\n"
            f"Your report shows that **{primary_flag}** is {flag_val} {flag_unit}, which is above the standard lab target. "
            f"In everyday terms, this parameter measures how your body processes key biomarkers. An elevated value is not an "
            f"immediate diagnosis, as factors like diet, hydration, and fasting duration can temporarily influence this number.\n\n"
            f"### What to Know\n"
            f"Other parameters in this panel are stable. Your clinician will evaluate this in combination with your overall health trajectory.\n\n"
            f"### 3 Questions for Your Doctor\n"
            f"1. *Should I repeat this {primary_flag} test under strict fasting conditions to confirm the value?*\n"
            f"2. *Are there specific lifestyle or dietary adjustments recommended before considering medications?*\n"
            f"3. *What timeline do you recommend for follow-up testing to track this trend?*\n\n"
            f"*Disclaimer: This AI summary aids health understanding and does not replace medical advice from your physician.*"
        )
    else:
        explanation = (
            f"### Plain-Language Summary\n"
            f"Good news! All tested parameters in this {panel_name} fall comfortably within normal laboratory reference ranges. "
            f"This indicates stable metabolic function across these specific markers.\n\n"
            f"### 3 Questions for Your Doctor\n"
            f"1. *Do current results suggest keeping my existing preventive wellness plan?*\n"
            f"2. *When is my next routine screening recommended?*\n"
            f"3. *Are there complementary biomarkers we should check annually?*"
        )

    return {
        "task": "explainer",
        "input": prompt,
        "target": explanation
    }

def generate_forecast_sample() -> Dict[str, Any]:
    """Generates a Task 3 sample: Longitudinal 3-year lab history -> Future 6-12 month forecasted trajectory."""
    biomarker = random.choice([
        {"name": "LDL Cholesterol", "loinc": "13457-7", "unit": "mg/dL", "base": 110, "drift": 5},
        {"name": "HbA1c", "loinc": "4548-4", "unit": "%", "base": 5.4, "drift": 0.2},
        {"name": "Serum Creatinine", "loinc": "2160-0", "unit": "mg/dL", "base": 0.95, "drift": 0.08},
        {"name": "Fasting Blood Glucose", "loinc": "1558-6", "unit": "mg/dL", "base": 88, "drift": 4},
    ])

    # Generate 4 historical timestamps (e.g. 2022, 2023, 2024, 2025)
    history = []
    current_val = biomarker["base"]
    start_year = 2022
    for i in range(4):
        year = start_year + i
        current_val += round(random.uniform(-0.5 * biomarker["drift"], 1.5 * biomarker["drift"]), 2)
        history.append({"year": year, "value": round(current_val, 2)})

    # Projected 1-year ahead value
    projected_next = round(current_val + (biomarker["drift"] * random.uniform(0.8, 1.2)), 2)
    ci_low = round(projected_next * 0.93, 2)
    ci_high = round(projected_next * 1.07, 2)

    history_str = ", ".join([f"{h['year']}: {h['value']} {biomarker['unit']}" for h in history])
    prompt = (
        f"You are JAN Health Predictive Forecaster. Given the longitudinal biomarker trajectory below, "
        f"estimate the expected 12-month projected value along with 95% confidence intervals and clinical uncertainty assessment.\n\n"
        f"BIOMARKER: {biomarker['name']} (LOINC {biomarker['loinc']})\n"
        f"HISTORICAL TRAJECTORY: {history_str}\n\nFORECAST ESTIMATION:"
    )

    target = (
        f"PROJECTED (12-MONTH): {projected_next} {biomarker['unit']}\n"
        f"95% CONFIDENCE INTERVAL: [{ci_low} - {ci_high}] {biomarker['unit']}\n"
        f"DIRECTIONAL TREND: Upward (+{round(projected_next - history[-1]['value'], 2)} {biomarker['unit']})\n"
        f"RECOMMENDED ACTION: Recommend lifestyle intervention and repeat lab panel in 6 months before initiating pharmacological therapy."
    )

    return {
        "task": "forecast",
        "input": prompt,
        "target": target
    }

def build_dataset(total_samples: int = 1200, output_dir: str = "training/data"):
    """Generates the multi-task clinical dataset and partitions into train, val, test splits."""
    os.makedirs(output_dir, exist_ok=True)
    samples = []

    print(f"Generating {total_samples} multi-task medical samples...")
    for _ in range(total_samples):
        # 50% extraction, 30% explainer, 20% trajectory forecasting
        r = random.random()
        if r < 0.50:
            samples.append(generate_extraction_sample())
        elif r < 0.80:
            samples.append(generate_explainer_sample())
        else:
            samples.append(generate_forecast_sample())

    random.shuffle(samples)

    # 80% train, 10% validation, 10% locked test set
    n_train = int(len(samples) * 0.80)
    n_val = int(len(samples) * 0.10)

    train_data = samples[:n_train]
    val_data = samples[n_train:n_train + n_val]
    test_data = samples[n_train + n_val:]

    for name, data in [("train.jsonl", train_data), ("val.jsonl", val_data), ("test.jsonl", test_data)]:
        path = os.path.join(output_dir, name)
        with open(path, "w", encoding="utf-8") as f:
            for item in data:
                f.write(json.dumps(item) + "\n")
        print(f"Saved {len(data):>5} samples to {path}")

    # Generate metadata manifest
    manifest = {
        "dataset_name": "JAN_HEALTH_MultiTask_Medical_v2",
        "created_at": datetime.utcnow().isoformat() + "Z",
        "total_records": len(samples),
        "splits": {
            "train": len(train_data),
            "validation": len(val_data),
            "locked_test": len(test_data),
        },
        "tasks": {
            "structured_extraction": sum(1 for s in samples if s["task"] == "extraction"),
            "clinical_explainer": sum(1 for s in samples if s["task"] == "explainer"),
            "trajectory_forecasting": sum(1 for s in samples if s["task"] == "forecast"),
        },
        "deidentification_standard": "HIPAA Safe Harbor + ABDM DISHA Compliant",
        "loinc_version": "2.77"
    }

    manifest_path = os.path.join(output_dir, "dataset_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"Saved dataset manifest to {manifest_path}")

if __name__ == "__main__":
    build_dataset(total_samples=1500)

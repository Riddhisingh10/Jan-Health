# JAN HEALTH - Multi-Task Clinical Model Training Pipeline

End-to-end framework for training, evaluating, and deploying multi-task clinical AI models specialized on blood tests and laboratory diagnostic reports.

---

## 🔬 Supported Clinical Tasks

1. **Structured Extraction & LOINC Standardization**:
   - Converts unstructured OCR text and scanned PDF/image reports into schema-compliant JSON.
   - Maps laboratory biomarker names to standard **LOINC codes** (e.g. `LOINC 13457-7` for LDL, `LOINC 2093-3` for Total Cholesterol, `LOINC 2571-8` for Triglycerides).
   - Extracts numeric results, units, reference intervals, and flags (`H`, `L`, `Normal`).

2. **Patient-Friendly Clinical Explainer & Consultation Prep**:
   - Synthesizes complex multi-parameter panels into accessible plain-language guidance.
   - Supports dual modes: **Concise** (key highlights) and **Detailed** (in-depth metabolic analysis).
   - Automatically generates prioritized consultation questions for physician visits.
   - Grounded citations linking directly to source report parameters.

3. **Longitudinal Trajectory Forecasting**:
   - Analyzes historical multi-year biomarker trends (3–5 timestamps).
   - Projects 6–12 month future values with **95% Confidence Intervals** and uncertainty bands.

---

## 📁 Repository Structure

```
training/
├── data/
│   ├── train.jsonl             # Multi-task training split (80%)
│   ├── val.jsonl               # Validation split (10%)
│   ├── test.jsonl              # Locked benchmark test set (10%)
│   └── dataset_manifest.json   # Metadata and privacy certification
├── dataset_builder.py          # Python dataset synthesis & de-identification
├── generate_data.js            # Node.js cross-platform dataset generator
├── train_multitask_model.py    # PyTorch + Hugging Face LoRA/QLoRA training script
├── evaluate_benchmark.py       # Locked benchmark evaluation against clinical gold standard
└── requirements.txt            # Training dependencies (torch, transformers, peft)
```

---

## 🚀 Quickstart: Running Training

### 1. Install Dependencies
```bash
pip install -r training/requirements.txt
```

### 2. Generate Training Data
```bash
# Using Python
python training/dataset_builder.py

# Or using Node.js
node training/generate_data.js
```

### 3. Fine-Tune with LoRA / QLoRA
```bash
# Run training on single GPU with QLoRA (4-bit)
python training/train_multitask_model.py \
  --base_model mistralai/BioMistral-7B \
  --epochs 3 \
  --batch_size 4 \
  --grad_accum 4 \
  --learning_rate 2e-4 \
  --output_dir models/jan_health_multitask_v2
```

### 4. Evaluate on Locked Test Set
```bash
python training/evaluate_benchmark.py \
  --model_dir models/jan_health_multitask_v2 \
  --test_file training/data/test.jsonl
```

---

## 🔒 Privacy & De-Identification Compliance
All training data is sanitized according to **HIPAA Safe Harbor** (45 CFR § 164.514) and **ABDM DISHA** requirements:
- Patient Names masked to `[DE-IDENTIFIED PATIENT]` or anonymized synthetic aliases.
- National Identifiers (Aadhaar / ABHA) redacted.
- Contact numbers and physical addresses removed.
- Dates shifted to maintain longitudinal intervals without revealing real timestamps.

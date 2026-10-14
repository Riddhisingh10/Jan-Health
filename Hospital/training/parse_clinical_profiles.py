import os
import json
import fitz
import re

PDF_FILES = [
    "Untitled document (1).pdf",
    "pt kotla Discharge Summary.pdf",
    "PATIENT SHILPA Discharge Summary.pdf",
    "Patient Dundamma Discharge Summary.pdf",
    "Discharge Summary PT MAHENDRA.pdf",
    "13.pdf",
    "12.pdf",
    "11.pdf",
    "Discharge Summary10.pdf",
    "Discharge Summary8.pdf",
    "Discharge Summary (2).pdf",
    "ANIKET Discharge Summary.pdf"
]

base_dir = r"c:\Projects\Jan-Health\Jan-Health"
results = {}

for pdf_name in PDF_FILES:
    full_path = os.path.join(base_dir, pdf_name)
    doc = fitz.open(full_path)
    text = "\n".join([page.get_text() for page in doc])
    
    # Extract Patient Name
    m_name = re.search(r"Patient Name\s*:\s*([^\n\r]+)", text, re.IGNORECASE)
    name = m_name.group(1).strip() if m_name else "Unknown"
    
    # Extract Age/Sex
    m_age = re.search(r"Age/Sex\s*:\s*([^\n\r]+)", text, re.IGNORECASE)
    age_sex = m_age.group(1).strip() if m_age else "Unknown"
    
    # Extract Final Diagnosis
    m_diag = re.search(r"Final Diagnosis\s*:\s*([\s\S]*?)(?=Chief compliant|Chief complaint|Brief History|Past history|$)", text, re.IGNORECASE)
    diag = m_diag.group(1).strip() if m_diag else "Unknown"
    
    # Extract Vitals / Blood Sugar
    m_grbs = re.search(r"(?:GRBS|Blood Sugar[^:]*)\s*:\s*([^\n\r]+)", text, re.IGNORECASE)
    grbs = m_grbs.group(1).strip() if m_grbs else "N/A"
    
    m_bp = re.search(r"BP\s*:\s*([^\n\r]+)", text, re.IGNORECASE)
    bp = m_bp.group(1).strip() if m_bp else "N/A"
    
    m_spo2 = re.search(r"SPO2\s*:\s*([^\n\r]+)", text, re.IGNORECASE)
    spo2 = m_spo2.group(1).strip() if m_spo2 else "N/A"
    
    # Check for Key Labs / Keywords
    has_ketones = "KETONE" in text.upper()
    has_dka = "KETOACIDOSIS" in text.upper()
    has_anemia = "ANEMIA" in text.upper()
    has_bleeding = "BLEEDING" in text.upper() or "EPISTAXIS" in text.upper()
    has_fracture = "FRACTURE" in text.upper()
    
    results[pdf_name] = {
        "name": name,
        "age_sex": age_sex,
        "diagnosis": diag[:200].replace("\n", " "),
        "bp": bp,
        "grbs": grbs,
        "spo2": spo2,
        "has_ketones": has_ketones,
        "has_dka": has_dka,
        "has_anemia": has_anemia,
        "has_bleeding": has_bleeding,
        "has_fracture": has_fracture
    }

print(json.dumps(results, indent=2))
with open(os.path.join(base_dir, "training", "pdf_clinical_profiles.json"), "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

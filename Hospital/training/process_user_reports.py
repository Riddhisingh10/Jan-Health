import os
import glob
import json
import fitz # PyMuPDF
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
extracted_docs = []

for pdf_name in PDF_FILES:
    full_path = os.path.join(base_dir, pdf_name)
    if not os.path.exists(full_path):
        print(f"[MISSING] {pdf_name}")
        continue
    
    doc = fitz.open(full_path)
    pages_text = []
    for page_idx in range(len(doc)):
        pages_text.append(doc[page_idx].get_text())
    full_text = "\n".join(pages_text)
    
    extracted_docs.append({
        "file": pdf_name,
        "page_count": len(doc),
        "text_length": len(full_text),
        "sample_snippet": full_text[:300].replace("\n", " ")
    })
    print(f"Processed {pdf_name}: {len(doc)} pages, {len(full_text)} chars")

with open(os.path.join(base_dir, "training", "pdf_extraction_summary.json"), "w", encoding="utf-8") as f:
    json.dump(extracted_docs, f, indent=2)

print(f"Done. Extracted {len(extracted_docs)} documents.")

"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Edit3,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Save,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthorizedPatientRecord } from "@/doctorMockData";

export const DoctorClinicalSummary: React.FC<{
  patient: AuthorizedPatientRecord;
  onSaveToEhr: (summaryText: string) => void;
}> = ({ patient, onSaveToEhr }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [summaryText, setSummaryText] = useState(
    `21-year-old male Rishith S Gowda (ABHA: 91-5366-3824-6028) presenting for routine health and biomarker surveillance. Longitudinal records reflect well-controlled hemodynamics (current BP 116/66 mmHg, HR 72 bpm). Recent Dec 26, 2024 Comprehensive Metabolic Panel reveals mild hyperkalemia (Potassium 5.7 mmol/L vs normal 3.4-5.1) and Serum Creatinine (1.60 mg/dL). Liver function enzymes (AST 27 U/L, ALT 23 U/L) and lipid panel (Total Cholesterol 178 mg/dL, HDL 52 mg/dL) remain optimal. Documented severe allergy to Penicillin and Sulfa drugs.`
  );
  const [clinicalQuestion, setClinicalQuestion] = useState("");
  const [aiRegenerating, setAiRegenerating] = useState(false);

  const handleRegenerate = () => {
    setAiRegenerating(true);
    setTimeout(() => {
      setAiRegenerating(false);
      if (clinicalQuestion.toLowerCase().includes("kidney") || clinicalQuestion.toLowerCase().includes("potassium")) {
        setSummaryText(
          `FOCUSED RENAL & ELECTROLYTE SUMMARY: Patient Rishith S Gowda (21M, ABHA: 91-5366-3824-6028) has experienced creatinine measurement of 1.60 mg/dL accompanied by serum potassium at 5.7 mmol/L. Recommend repeating BMP in 14 days, verifying hydration status, and assessing estimated GFR.`
        );
      } else {
        setSummaryText(
          `REFINED CLINICAL OVERVIEW: 21-year-old male Rishith S Gowda (ABHA: 91-5366-3824-6028) evaluated for routine cardiovascular and renal surveillance. Blood pressure well-controlled at 116/66 mmHg. Identified high-value findings: Potassium 5.7 mmol/L (Source: Sunrise Haven CMP, p.1), Creatinine 1.60 mg/dL (Source: Sunrise Haven CMP, p.2). No hepatic or cardiac enzyme elevation observed. Severe penicillin/sulfa allergies documented.`
        );
      }
    }, 600);
  };

  const handleApprove = () => {
    setIsApproved(true);
    setIsEditing(false);
    onSaveToEhr(summaryText);
  };

  return (
    <div className="space-y-4">
      <Card className="border-emerald-100 bg-white shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-2 border-b border-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Pre-Consultation AI Clinical Summary & Timeline
                  <Badge variant="brand" className="text-[10px]">
                    AI Assisted · Clinician Directed
                  </Badge>
                </CardTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Scope: Authorized EHR Diagnostic Telemetry (2020 - Dec 2024) · 14 Biomarkers Analyzed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="text-xs h-8 border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit Draft
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="text-xs h-8 bg-slate-800 text-white"
                >
                  Done Editing
                </Button>
              )}

              <Button
                size="sm"
                onClick={handleApprove}
                className={`text-xs h-8 font-semibold shadow-xs ${
                  isApproved
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                {isApproved ? "Approved & Saved" : "Approve for Clinical EHR"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Editable AI Generated Draft Body */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-slate-700">Synthesized Summary Text:</span>
              <span className="text-[11px]">
                Status: {isApproved ? <strong className="text-emerald-700">✓ Clinician Approved</strong> : <span className="text-amber-700 font-medium">Pending Review</span>}
              </span>
            </div>

            {isEditing ? (
              <textarea
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-xl border border-emerald-300 bg-white text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner font-sans"
              />
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs leading-relaxed text-slate-800 font-sans">
                {summaryText}
              </div>
            )}
          </div>

          {/* Key Changes & Linked Evidence Sources (Section C) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                Linked Laboratory Evidence (Audited Sources)
              </span>
              <ul className="space-y-1 text-[11px] text-slate-700 list-disc list-inside">
                <li>
                  <strong>Potassium 5.7 mmol/L:</strong> Sunrise Haven CMP (Dec 26, 2024, Page 1)
                </li>
                <li>
                  <strong>Creatinine 1.60 mg/dL:</strong> Sunrise Haven CMP (Dec 26, 2024, Page 2)
                </li>
                <li>
                  <strong>Blood Pressure 116/66 mmHg:</strong> In-clinic Omron Digital (Dec 27, 2024)
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5 text-amber-950">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Missing Context & Verification Flags
              </span>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>
                  Spot urine albumin-to-creatinine ratio (uACR) is <strong>missing</strong> from records.
                </li>
                <li>
                  Sample hemolyzation grade was unindexed on laboratory transmittal sheet.
                </li>
              </ul>
            </div>
          </div>

          {/* Clinician Query & Refinement Prompt */}
          <div className="pt-2 border-t border-emerald-50 flex flex-col sm:flex-row items-center gap-2 text-xs">
            <input
              type="text"
              value={clinicalQuestion}
              onChange={(e) => setClinicalQuestion(e.target.value)}
              placeholder="Refine summary for a specific question (e.g., Focus on kidney trends & ARB safety)..."
              className="flex-1 px-3 py-2 rounded-xl border border-emerald-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleRegenerate}
              disabled={aiRegenerating}
              className="text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50 shrink-0 font-semibold"
            >
              <RotateCcw className={`w-3.5 h-3.5 mr-1 ${aiRegenerating ? "animate-spin" : ""}`} />
              {aiRegenerating ? "Refining..." : "Refine Summary"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

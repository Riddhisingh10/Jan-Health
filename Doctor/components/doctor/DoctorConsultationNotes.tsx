"use client";

import React, { useState } from "react";
import {
  FileText,
  Save,
  Printer,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Pill,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthorizedPatientRecord, ConsultationNote } from "@/doctorMockData";

export const DoctorConsultationNotes: React.FC<{
  patient: AuthorizedPatientRecord;
  onSaveNote: (note: ConsultationNote) => void;
}> = ({ patient, onSaveNote }) => {
  const [hpi, setHpi] = useState(
    "34-year-old male with established primary hypertension presenting for scheduled 3-month exam. Reports mild fatigue following vigorous cardiovascular workouts. Denies chest pain, orthopnea, paroxysmal nocturnal dyspnea, or lower extremity edema."
  );
  const [exam, setExam] = useState(
    "Well-appearing, alert, in no acute distress. Vitals: BP 116/66 mmHg, HR 72 bpm regular, SpO2 98% room air, BMI 24.2. Chest clear to auscultation bilaterally. S1/S2 normal without murmurs or gallops. Abdomen soft, non-tender. No peripheral edema."
  );
  const [assessment, setAssessment] = useState(
    "1. Essential Hypertension - well controlled on current regimen.\n2. Mild asymptomatic hyperkalemia (5.7 mmol/L) and creatinine elevation (1.60 mg/dL) - likely hemodynamic ARB effect combined with strenuous endurance exercise."
  );
  const [plan, setPlan] = useState(
    "1. Continue Telmisartan 40mg daily without dosage escalation.\n2. Order repeat Basic Metabolic Panel (BMP) in 14 days.\n3. Instruct patient to avoid potassium-based salt substitutes.\n4. Recommend 2.5 L daily oral hydration."
  );
  const [patientFriendlySummary, setPatientFriendlySummary] = useState(
    "Your blood pressure is in great control today at 116/66. Your recent lab showed slightly elevated potassium and kidney markers, which is common with your blood pressure medication. We are keeping your medicine the same and ordering a quick re-check blood test in 2 weeks to make sure everything stays safe."
  );

  const [isSaved, setIsSaved] = useState(false);
  const [autoDrafting, setAutoDrafting] = useState(false);

  const handleGenerateAiDraft = () => {
    setAutoDrafting(true);
    setTimeout(() => {
      setAutoDrafting(false);
      setAssessment(
        "1. Essential Hypertension (I10) - Target BP achieved (< 120/80 mmHg).\n2. Lab finding: Elevated serum potassium (5.7 mmol/L) & Serum Creatinine (1.60 mg/dL) - ARB class effect vs exercise-induced volume shift."
      );
      setPlan(
        "1. Maintain Telmisartan 40mg PO QAM.\n2. Scheduled repeat BMP in 2 weeks at Sunrise Haven Lab.\n3. Dietary counseling: limit potassium chloride substitutes.\n4. Follow-up clinic appointment in 4 weeks."
      );
    }, 500);
  };

  const handleSave = () => {
    const newNote: ConsultationNote = {
      id: `note-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      date: "Today, Dec 27, 2024",
      doctorName: "Dr. Evelyn Sterling, MD",
      historyOfPresentIllness: hpi,
      physicalExamination: exam,
      clinicalAssessment: assessment,
      planAndRx: plan,
      patientFriendlySummary,
      status: "Clinician Approved",
      aiGeneratedAssisted: true,
      reviewedByClinician: true,
    };
    onSaveNote(newNote);
    setIsSaved(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <Card className="border-emerald-100 bg-white shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-2 border-b border-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Clinical Consultation Notes & Documentation (SOAP Structure)
                  <Badge variant="brand" className="text-[10px]">
                    EHR Compliant
                  </Badge>
                </CardTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Patient: {patient.name} ({patient.abhaId}) · Clinician: Dr. Evelyn Sterling
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleGenerateAiDraft}
                disabled={autoDrafting}
                className="text-xs h-8 border-emerald-200 text-emerald-800 hover:bg-emerald-50 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {autoDrafting ? "Synthesizing..." : "Auto-Draft SOAP Note"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
                className="text-xs h-8 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5 mr-1" /> Print Summary
              </Button>

              <Button
                size="sm"
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-bold shadow-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {isSaved ? "Saved to EHR ✓" : "Approve & Save Note"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Section 1: History of Present Illness (HPI) */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              1. Subjective / History of Present Illness (HPI)
            </label>
            <textarea
              value={hpi}
              onChange={(e) => setHpi(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl border border-emerald-200 bg-slate-50/40 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Section 2: Objective Physical Exam & Vitals */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              2. Objective / Physical Examination & Vitals Findings
            </label>
            <textarea
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl border border-emerald-200 bg-slate-50/40 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Section 3: Clinical Assessment */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              3. Clinical Assessment & Diagnostic Reasoning
            </label>
            <textarea
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl border border-emerald-200 bg-slate-50/40 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Section 4: Clinical Plan & Prescriptions */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              4. Treatment Plan, Surveillance & Follow-up Instructions
            </label>
            <textarea
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl border border-emerald-200 bg-slate-50/40 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Section 5: Patient-Friendly Summary Draft */}
          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
            <label className="font-bold text-emerald-950 block mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              Patient-Friendly Consultation Explanation (Shared via Citizen Portal)
            </label>
            <textarea
              value={patientFriendlySummary}
              onChange={(e) => setPatientFriendlySummary(e.target.value)}
              rows={2}
              className="w-full p-2 rounded-lg border border-emerald-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

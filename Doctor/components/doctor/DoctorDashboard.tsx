"use client";

import React, { useState } from "react";
import { useGlobalState } from "@/GlobalStateContext";
import {
  initialAuthorizedPatients,
  initialReviewAlerts,
  initialDoctorAuditLogs,
  AuthorizedPatientRecord,
  DoctorReviewAlert,
  ConsultationNote,
  ClinicalAuditLog,
} from "@/doctorMockData";
import { DoctorWorkspaceHeader } from "./DoctorWorkspaceHeader";
import { DoctorClinicalSummary } from "./DoctorClinicalSummary";
import { DoctorClinicalReasoning } from "./DoctorClinicalReasoning";
import { DoctorConsultationNotes } from "./DoctorConsultationNotes";
import { DoctorReviewQueue } from "./DoctorReviewQueue";
import { DoctorAnalyticsReports } from "./DoctorAnalyticsReports";
import { DoctorClinicalReview } from "./DoctorClinicalReview";
import { DoctorClinicalHistoryAI } from "./DoctorClinicalHistoryAI";
import {
  Stethoscope,
  Users,
  AlertTriangle,
  FileCheck2,
  Plus,
  Send,
  ShieldAlert,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  PhoneCall,
  Activity,
  FileText,
  Lock,
  Unlock,
  X,
  MessageSquare,
  BarChart2,
  Layers,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const DoctorDashboard: React.FC = () => {
  const {
    doctorQueue,
    selectedQueueItem,
    setSelectedQueueItem,
    updateQueueStatus,
    triggerBreakGlass,
    addPrescription,
    patient,
  } = useGlobalState();

  // Doctor Clinical Sub-Navigation Tabs matching PDF Page 3 + AI History Deep Dive
  const [activeTab, setActiveTab] = useState<
    "clinicalReview" | "historyAi" | "chart" | "aiSummary" | "aiReasoning" | "consultNote" | "alerts" | "analytics"
  >("clinicalReview");

  // Authorized Patients Roster
  const [patients, setPatients] = useState<AuthorizedPatientRecord[]>(initialAuthorizedPatients);
  const [activeAuthorizedPatient, setActiveAuthorizedPatient] = useState<AuthorizedPatientRecord>(
    initialAuthorizedPatients[0]
  );
  const [reviewAlerts, setReviewAlerts] = useState<DoctorReviewAlert[]>(initialReviewAlerts);
  const [auditLogs, setAuditLogs] = useState<ClinicalAuditLog[]>(initialDoctorAuditLogs);

  // Modals
  const [showRxModal, setShowRxModal] = useState<boolean>(false);
  const [showBreakGlassModal, setShowBreakGlassModal] = useState<boolean>(false);
  const [breakGlassReason, setBreakGlassReason] = useState<string>(
    "Emergency Triage - Acute presentation requiring immediate EHR record review"
  );

  // e-Rx State
  const [rxDiagnosis, setRxDiagnosis] = useState<string>("Hypertension Stage 1 - Monotherapy Review");
  const [rxMedName, setRxMedName] = useState<string>("Amlodipine 5mg");
  const [rxDosage, setRxDosage] = useState<string>("1 Tab");
  const [rxFrequency, setRxFrequency] = useState<string>("Once daily (Morning)");
  const [rxDuration, setRxDuration] = useState<string>("30 Days");
  const [rxInstructions, setRxInstructions] = useState<string>("Take after breakfast. Avoid grapefruit juice.");
  const [rxNotes, setRxNotes] = useState<string>("Recheck BP in 2 weeks. Follow low sodium DASH diet.");

  const unreviewedAlertsCount = reviewAlerts.filter((a: DoctorReviewAlert) => !a.isReviewed).length;

  const handleReviewAlert = (id: string, action: string) => {
    setReviewAlerts((prev: DoctorReviewAlert[]) =>
      prev.map((a: DoctorReviewAlert) => (a.id === id ? { ...a, isReviewed: true, actionTaken: action } : a))
    );
  };

  const handleRequestAccess = (abhaOrName: string) => {
    const newLog: ClinicalAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: "Just now",
      action: "ABDM Consent Request Dispatched",
      patientId: "req-01",
      patientName: abhaOrName,
      doctorName: "Dr. Evelyn Sterling",
      details: `Dispatched electronic consent artifact to ${abhaOrName} via National Health Gateway.`,
      scope: "OPD Evaluation",
    };
    setAuditLogs((prev: ClinicalAuditLog[]) => [newLog, ...prev]);
    alert(`ABDM consent artifact dispatched to ${abhaOrName}.`);
  };

  const handleSaveConsultNote = (note: ConsultationNote) => {
    const newLog: ClinicalAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: "Just now",
      action: "Consultation Note Signed & Saved",
      patientId: note.patientId,
      patientName: note.patientName,
      doctorName: note.doctorName,
      details: "Approved SOAP note saved to permanent longitudinal EHR repository.",
      scope: "Clinical Record",
    };
    setAuditLogs((prev: ClinicalAuditLog[]) => [newLog, ...prev]);
  };

  const handleCreatePrescription = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPrescription({
      doctorName: "Dr. Evelyn Sterling",
      doctorSpecialty: "Cardiology & Internal Medicine",
      diagnosis: rxDiagnosis,
      medicines: [
        {
          name: rxMedName,
          dosage: rxDosage,
          frequency: rxFrequency,
          duration: rxDuration,
          instructions: rxInstructions,
        },
      ],
      notes: rxNotes,
    });
    setShowRxModal(false);
  };

  const handleConfirmBreakGlass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    triggerBreakGlass(activeAuthorizedPatient.id, breakGlassReason);
    const newLog: ClinicalAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: "Just now",
      action: "🚨 Emergency Break-Glass Override",
      patientId: activeAuthorizedPatient.id,
      patientName: activeAuthorizedPatient.name,
      doctorName: "Dr. Evelyn Sterling",
      details: `Justification logged: ${breakGlassReason}. Audit stream transmitted to Hospital Ethics Committee.`,
      scope: "Emergency Resuscitation",
    };
    setAuditLogs((prev: ClinicalAuditLog[]) => [newLog, ...prev]);
    setShowBreakGlassModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Section A: Doctor Account, Workspace & Patient Scope Banner */}
      <DoctorWorkspaceHeader
        patients={patients}
        activePatient={activeAuthorizedPatient}
        onSelectPatient={(p: AuthorizedPatientRecord) => setActiveAuthorizedPatient(p)}
        onRequestAccess={handleRequestAccess}
        onOpenAiHistory={() => setActiveTab("historyAi")}
      />

      {/* Doctor Portal Secondary Navigation Bar */}
      <div className="bg-white rounded-2xl border border-[#E6EBE8] p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab("clinicalReview")}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "clinicalReview"
                ? "bg-[#0A6640] text-white shadow-xs"
                : "text-[#4A6357] hover:text-[#142B21] hover:bg-[#F2F7F4]"
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Clinical Review (Page 3)</span>
          </button>

          <button
            onClick={() => setActiveTab("historyAi")}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "historyAi"
                ? "bg-[#0A6640] text-white shadow-xs"
                : "text-[#4A6357] hover:text-[#142B21] hover:bg-[#F2F7F4]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI History Query & Report</span>
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 text-emerald-800 font-extrabold">
              NEW
            </span>
          </button>

          <button
            onClick={() => setActiveTab("chart")}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "chart"
                ? "bg-[#0A6640] text-white shadow-xs"
                : "text-[#4A6357] hover:text-[#142B21] hover:bg-[#F2F7F4]"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Patient EHR & OPD Queue</span>
          </button>

          <button
            onClick={() => setActiveTab("aiSummary")}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "aiSummary"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-Consult AI Summary</span>
          </button>

          <button
            onClick={() => setActiveTab("aiReasoning")}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "aiReasoning"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Clinical Reasoning AI</span>
          </button>

          <button
            onClick={() => setActiveTab("consultNote")}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "consultNote"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>SOAP Consultation Notes</span>
          </button>

          <button
            onClick={() => setActiveTab("alerts")}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === "alerts"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Review Queue</span>
            {unreviewedAlertsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ml-1">
                {unreviewedAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "analytics"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Cohort Analytics & Audit</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowRxModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-8 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Write e-Rx
          </Button>
        </div>
      </div>

      {/* Tab 0: Clinical Review (Exact PDF Page 3) */}
      {activeTab === "clinicalReview" && (
        <DoctorClinicalReview onNavigateToHistoryAi={() => setActiveTab("historyAi")} />
      )}

      {/* Tab: Doctor AI Medical History Query & Synthesis */}
      {activeTab === "historyAi" && (
        <DoctorClinicalHistoryAI
          activePatient={activeAuthorizedPatient}
          allPatients={patients}
          onSelectPatient={(p: AuthorizedPatientRecord) => setActiveAuthorizedPatient(p)}
          onSendToSoapNote={(reportText: string) => {
            handleSaveConsultNote({
              id: `note-${Date.now()}`,
              patientId: activeAuthorizedPatient.id,
              patientName: activeAuthorizedPatient.name,
              date: "Today",
              doctorName: "Dr. Evelyn Sterling",
              historyOfPresentIllness: activeAuthorizedPatient.chiefComplaint,
              physicalExamination: "Vitals stable, examined in OPD",
              clinicalAssessment: reportText,
              planAndRx: "Follow-up BMP and electrolyte surveillance in 14 days.",
              patientFriendlySummary: "Comprehensive clinical report shared and documented.",
              status: "Clinician Approved",
              aiGeneratedAssisted: true,
              reviewedByClinician: true,
            });
            setActiveTab("consultNote");
          }}
        />
      )}

      {/* Tab 1: Primary Patient EHR & OPD Queue */}
      {activeTab === "chart" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: OPD Patient Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-slate-900 text-sm">Live Patient OPD Queue</h2>
              </div>
              <Badge variant="outline" className="text-xs">
                {doctorQueue.length} Assigned
              </Badge>
            </div>

            <div className="space-y-2.5">
              {doctorQueue.map((item: any) => {
                const isSelected = activeAuthorizedPatient.id === item.patientId;
                const isEmergency = item.triagePriority === "Emergency";
                const isPriority = item.triagePriority === "Priority";

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      const matched = patients.find((p: AuthorizedPatientRecord) => p.id === item.patientId);
                      if (matched) setActiveAuthorizedPatient(matched);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/80 shadow-sm ring-1 ring-emerald-500/30"
                        : "border-emerald-100 bg-white hover:border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {item.tokenNumber}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        {isEmergency && (
                          <Badge variant="destructive" className="text-[10px] animate-pulse">
                            🚨 Emergency
                          </Badge>
                        )}
                        {isPriority && (
                          <Badge variant="warning" className="text-[10px]">
                            ⚡ Priority
                          </Badge>
                        )}
                        {!isEmergency && !isPriority && (
                          <Badge variant="brand" className="text-[10px]">
                            Routine
                          </Badge>
                        )}
                        <span className="text-[11px] text-slate-600">{item.appointmentTime}</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2">{item.patientName}</h4>
                    <p className="text-xs text-slate-600">
                      {item.gender}, {item.age} yrs · ABHA: {item.abhaId.substring(0, 10)}...
                    </p>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                      "{item.chiefComplaint}"
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-emerald-100/60 flex items-center justify-between">
                      <span
                        className={`text-[11px] font-semibold ${
                          item.status === "In-Consultation"
                            ? "text-emerald-700 font-bold"
                            : item.status === "Completed"
                            ? "text-slate-600"
                            : "text-amber-700"
                        }`}
                      >
                        ● {item.status}
                      </span>

                      <div className="flex items-center space-x-1">
                        {item.status !== "In-Consultation" && item.status !== "Completed" && (
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              updateQueueStatus(item.id, "In-Consultation");
                            }}
                            className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-medium"
                          >
                            Start Call
                          </button>
                        )}
                        {item.status === "In-Consultation" && (
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              updateQueueStatus(item.id, "Completed");
                            }}
                            className="text-[10px] bg-slate-700 hover:bg-slate-800 text-white px-2 py-0.5 rounded font-medium"
                          >
                            Finish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Longitudinal Patient EHR Chart (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Patient Clinical Profile & Actions */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-slate-900">{activeAuthorizedPatient.name}</h2>
                    <Badge variant="brand" className="text-xs">
                      Consent Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeAuthorizedPatient.gender}, {activeAuthorizedPatient.age} yrs · ABHA ID:{" "}
                    <span className="font-mono text-emerald-800 font-semibold">
                      {activeAuthorizedPatient.abhaId}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBreakGlassModal(true)}
                    className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" />
                    Emergency Break-Glass
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("aiSummary")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Review AI Summary
                  </Button>
                </div>
              </div>

              {/* Chief Complaint Callout */}
              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                <div className="flex items-center space-x-1.5 text-amber-900 text-xs font-bold mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Chief Triage Presentation</span>
                </div>
                <p className="text-xs text-amber-950 font-medium">
                  {activeAuthorizedPatient.chiefComplaint}
                </p>
              </div>
            </div>

            {/* Clinical Decision Support & Allergy Guard Strip */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>JAN Clinical Decision Support & Allergy Safety Guard</span>
              </div>
              <div className="space-y-1.5 text-emerald-950">
                <p className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">⚠️ Allergy Alert:</span>
                  Patient has documented hypersensitivity to{" "}
                  <strong>{activeAuthorizedPatient.allergies.join(", ")}</strong>. Beta-lactam and sulfa compounds are contra-indicated.
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">💡 Drug Interaction Note:</span>
                  Active Telmisartan 40mg regimen shows 98% BP control with borderline potassium (5.7 mmol/L).
                </p>
              </div>
            </div>

            {/* Vitals Snapshot & Chronic History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-emerald-100">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Latest Physiological Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-emerald-50">
                    <span className="text-slate-500">Blood Pressure:</span>
                    <strong className="text-slate-900">
                      {patient.vitalsHistory[0]?.bloodPressureSystolic}/
                      {patient.vitalsHistory[0]?.bloodPressureDiastolic} mmHg
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-50">
                    <span className="text-slate-500">Heart Rate:</span>
                    <strong className="text-slate-900">{patient.vitalsHistory[0]?.heartRate} bpm</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-50">
                    <span className="text-slate-500">Blood Sugar:</span>
                    <strong className="text-slate-900">{patient.vitalsHistory[0]?.bloodSugar} mg/dL</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Oxygen (SpO2):</span>
                    <strong className="text-slate-900">{patient.vitalsHistory[0]?.spo2}%</strong>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Active Chronic Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">Comorbidities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeAuthorizedPatient.chronicConditions.map((c: string) => (
                        <span
                          key={c}
                          className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-50">
                    <span className="text-slate-500 block mb-1">Current Medications:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeAuthorizedPatient.medications.map((m: string) => (
                        <span
                          key={m}
                          className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Diagnostic Reports on Record */}
            <Card className="border-emerald-100">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  Verified Diagnostic Reports on Record (Chronological)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="space-y-2">
                  {patient.uploadedReports.map((report: any) => (
                    <div
                      key={report.id}
                      className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{report.fileName}</span>
                          <Badge variant="brand" className="text-[10px]">
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {report.reportDate} · {report.labName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded font-medium">
                          {report.rawExtractedData.length} Biomarkers Tested
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Pre-Consultation AI Summary */}
      {activeTab === "aiSummary" && (
        <DoctorClinicalSummary
          patient={activeAuthorizedPatient}
          onSaveToEhr={(txt: string) => handleSaveConsultNote({
            id: `note-${Date.now()}`,
            patientId: activeAuthorizedPatient.id,
            patientName: activeAuthorizedPatient.name,
            date: "Today",
            doctorName: "Dr. Evelyn Sterling",
            historyOfPresentIllness: activeAuthorizedPatient.chiefComplaint,
            physicalExamination: "Vitals normal",
            clinicalAssessment: txt,
            planAndRx: "Continued surveillance",
            patientFriendlySummary: "Summary shared with patient",
            status: "Clinician Approved",
            aiGeneratedAssisted: true,
            reviewedByClinician: true,
          })}
        />
      )}

      {/* Tab 3: Clinical Reasoning AI */}
      {activeTab === "aiReasoning" && (
        <DoctorClinicalReasoning patient={activeAuthorizedPatient} />
      )}

      {/* Tab 4: SOAP Consultation Notes */}
      {activeTab === "consultNote" && (
        <DoctorConsultationNotes
          patient={activeAuthorizedPatient}
          onSaveNote={handleSaveConsultNote}
        />
      )}

      {/* Tab 5: Review Queue & Critical Result Alerts */}
      {activeTab === "alerts" && (
        <DoctorReviewQueue
          alerts={reviewAlerts}
          onReviewAlert={handleReviewAlert}
          onOpenPatientRecord={(pid: string) => {
            const p = patients.find((x: AuthorizedPatientRecord) => x.id === pid);
            if (p) setActiveAuthorizedPatient(p);
            setActiveTab("chart");
          }}
        />
      )}

      {/* Tab 6: Cohort Analytics & Audit Logs */}
      {activeTab === "analytics" && (
        <DoctorAnalyticsReports
          patients={patients}
          auditLogs={auditLogs}
        />
      )}

      {/* Modal: Write e-Prescription */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                Digital e-Prescription (e-Rx)
              </h3>
              <button
                onClick={() => setShowRxModal(false)}
                className="text-slate-500 hover:text-slate-600 text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Diagnosis</label>
                <input
                  type="text"
                  value={rxDiagnosis}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRxDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={rxMedName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRxMedName(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dosage Form</label>
                  <input
                    type="text"
                    value={rxDosage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRxDosage(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 1 Tablet"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Frequency</label>
                  <input
                    type="text"
                    value={rxFrequency}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRxFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Once Daily"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={rxDuration}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRxDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. 30 Days"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Patient Instructions</label>
                <input
                  type="text"
                  value={rxInstructions}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRxInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doctor Advice / Follow-up</label>
                <textarea
                  value={rxNotes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRxNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRxModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Issue & Digitally Sign e-Rx
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Emergency Break-Glass Override */}
      {showBreakGlassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-rose-200">
            <div className="flex items-center justify-between pb-3 border-rose-100">
              <h3 className="font-bold text-rose-800 text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Emergency Break-Glass Override
              </h3>
              <button
                onClick={() => setShowBreakGlassModal(false)}
                className="text-slate-500 hover:text-slate-600 text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmBreakGlass} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 leading-relaxed">
                <strong>ABDM Legal Notice:</strong> Emergency Break-Glass grants temporary unconsented access to full health records for critical life-saving care. This event is cryptographically timestamped and transmitted to the Hospital Ethics Committee.
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Clinical Justification Reason
                </label>
                <select
                  value={breakGlassReason}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBreakGlassReason(e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="Emergency Triage - Acute presentation requiring immediate EHR record review">
                    Emergency Triage - Acute presentation with altered sensorium
                  </option>
                  <option value="Trauma Resuscitation - Patient incapacitated and unable to grant OTP">
                    Trauma Resuscitation - Incapacitated / No next of kin
                  </option>
                  <option value="Severe Allergic Reaction / Anaphylaxis - Instant allergy check required">
                    Severe Anaphylaxis - Instant allergy history verification
                  </option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBreakGlassModal(false)}
                >
                  Abort
                </Button>
                <Button type="submit" size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-bold">
                  Confirm Break-Glass Override
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

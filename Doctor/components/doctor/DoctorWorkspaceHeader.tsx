"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  ShieldCheck,
  Award,
  Clock,
  Search,
  Users,
  FileText,
  AlertTriangle,
  Lock,
  Unlock,
  Building,
  CheckCircle2,
  Calendar,
  Sparkles,
  PhoneCall,
  History,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthorizedPatientRecord } from "@/doctorMockData";

export const DoctorWorkspaceHeader: React.FC<{
  patients: AuthorizedPatientRecord[];
  activePatient: AuthorizedPatientRecord;
  onSelectPatient: (pat: AuthorizedPatientRecord) => void;
  onRequestAccess: (abhaOrName: string) => void;
  onOpenAiHistory?: () => void;
}> = ({ patients, activePatient, onSelectPatient, onRequestAccess, onOpenAiHistory }) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [requestAbhaInput, setRequestAbhaInput] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abhaId.includes(searchQuery) ||
      p.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestAbhaInput.trim()) {
      onRequestAccess(requestAbhaInput.trim());
      setRequestAbhaInput("");
      setShowRequestModal(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Doctor Workspace Credentials & Session Status Banner */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-700/20 shrink-0">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Dr. Evelyn Sterling, MD, FACC</h1>
              <Badge variant="brand" className="text-xs">
                Verified NMC Clinician
              </Badge>
              <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                ABDM Gateway Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>NMC License: <strong className="font-mono text-emerald-800">NMC-MD-2016-849102</strong></span>
              <span>· Specialization: <strong>Cardiovascular & Internal Medicine</strong></span>
              <span>· Clinic: <strong>Room 204, OPD Wing B</strong></span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setShowRequestModal(true)}
            variant="outline"
            className="text-xs border-emerald-300 text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100 font-semibold"
          >
            <Lock className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Request Patient Access (ABDM)
          </Button>

          <Button
            size="sm"
            onClick={() => setShowSearchModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
          >
            <Search className="w-3.5 h-3.5 mr-1.5" />
            Find Patient ({patients.length})
          </Button>
        </div>
      </div>

      {/* Active Selected Patient Strip */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 font-black flex items-center justify-center border border-emerald-200 shadow-xs">
            {activePatient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-sm">{activePatient.name}</span>
              <Badge
                variant={
                  activePatient.triagePriority === "Emergency"
                    ? "destructive"
                    : activePatient.triagePriority === "Priority"
                    ? "warning"
                    : "brand"
                }
                className="text-[10px]"
              >
                {activePatient.triagePriority}
              </Badge>
              <span className="text-[11px] text-slate-500 font-mono">ABHA: {activePatient.abhaId}</span>
            </div>
            <p className="text-slate-600 mt-0.5">
              {activePatient.gender}, {activePatient.age} yrs · Blood: <strong>{activePatient.bloodGroup}</strong> · Scope: <span className="font-medium text-emerald-800">{activePatient.accessScope}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Consent Valid Until</span>
            <span className="text-xs font-mono font-bold text-emerald-800">{activePatient.accessGrantedUntil}</span>
          </div>

          {onOpenAiHistory && (
            <Button
              size="sm"
              onClick={onOpenAiHistory}
              className="h-8 px-3 text-xs bg-[#E6F4EA] hover:bg-[#D4EDDA] border border-[#A8D5B5] text-[#0A6640] font-bold shadow-xs flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI History Query</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => setShowSearchModal(true)}
            variant="outline"
            className="h-8 px-2.5 text-xs bg-white border-emerald-200 text-slate-700"
          >
            Switch Patient
          </Button>
        </div>
      </div>

      {/* Search Authorized Patients Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-emerald-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Authorized Patient Roster</h3>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by patient name, ABHA ID, or chief complaint..."
                className="w-full pl-9 pr-3 py-2 border border-emerald-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="divide-y divide-emerald-50 overflow-y-auto flex-1 mt-3 space-y-1 pr-1">
              {filtered.map((pat) => (
                <div
                  key={pat.id}
                  onClick={() => {
                    onSelectPatient(pat);
                    setShowSearchModal(false);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs ${
                    pat.id === activePatient.id
                      ? "bg-emerald-50/80 border border-emerald-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{pat.name}</span>
                      <span className="text-[11px] text-slate-500">
                        ({pat.gender}, {pat.age}y)
                      </span>
                      <Badge
                        variant={
                          pat.triagePriority === "Emergency"
                            ? "destructive"
                            : pat.triagePriority === "Priority"
                            ? "warning"
                            : "brand"
                        }
                        className="text-[9px]"
                      >
                        {pat.triagePriority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{pat.abhaId}</p>
                    <p className="text-[11px] text-slate-600 italic mt-0.5 line-clamp-1">
                      "{pat.chiefComplaint}"
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-800 font-medium block">
                      {pat.accessGrantedUntil}
                    </span>
                    <span className="text-[10px] text-slate-400">Last: {pat.lastVisit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Request Patient Access Modal (ABDM Consent) */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                ABDM Digital Record Access Request
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 leading-relaxed">
                Send an encrypted consent artifact to the patient's Ayushman Bharat Health Account (ABHA) app for digital sign-off.
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Patient 14-Digit ABHA ID or Mobile Number
                </label>
                <input
                  type="text"
                  value={requestAbhaInput}
                  onChange={(e) => setRequestAbhaInput(e.target.value)}
                  placeholder="e.g. 91-4821-9923-1049"
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Purpose</label>
                <select className="w-full px-3 py-2 border border-emerald-200 rounded-lg bg-white">
                  <option>OPD Consultation Review & Prescription</option>
                  <option>Diagnostic Laboratory Longitudinal Trend Analysis</option>
                  <option>Pre-Operative Clearance Evaluation</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Dispatch Consent Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

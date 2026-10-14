"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Users,
  TrendingUp,
  FileSpreadsheet,
  Shield,
  Activity,
  Calendar,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthorizedPatientRecord, ClinicalAuditLog } from "@/doctorMockData";

export const DoctorAnalyticsReports: React.FC<{
  patients: AuthorizedPatientRecord[];
  auditLogs: ClinicalAuditLog[];
}> = ({ patients, auditLogs }) => {
  const [selectedCohort, setSelectedCohort] = useState<string>("All Authorized");

  const totalPatients = patients.length;
  const emergencyPatients = patients.filter((p) => p.triagePriority === "Emergency").length;
  const priorityPatients = patients.filter((p) => p.triagePriority === "Priority").length;
  const withUnreviewed = patients.filter((p) => p.hasNewUnreviewedReports).length;

  const handleExportCohortReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Clinical Workload KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card className="border-emerald-100 bg-white">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500">Authorized Patient Load</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalPatients} Patients</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Active ABDM Consent</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500">Pending Lab Reviews</span>
            <div className="text-2xl font-black text-amber-700 mt-1">{withUnreviewed} Actionable</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Awaiting clinician sign-off</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500">Emergency & Priority Triage</span>
            <div className="text-2xl font-black text-rose-700 mt-1">{emergencyPatients + priorityPatients} Acute</div>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">Urgent OPD evaluation</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500">Access Governance</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">100% Audited</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Role-based scope restricted</p>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Insights & Export Card */}
      <Card className="border-emerald-100 bg-white shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-2 border-b border-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Authorized Clinical Cohort Analytics (Privacy Restricted)
              </CardTitle>
              <p className="text-[11px] text-slate-500 mt-0.5">
                De-identified statistical distribution across your assigned panel. Cross-patient bulk disclosure is prevented.
              </p>
            </div>

            <Button
              size="sm"
              onClick={handleExportCohortReport}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Workload Report (PDF)
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
          {/* De-identified Cohort Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
              <span className="font-bold text-emerald-950">Hypertension Sub-Cohort</span>
              <p className="text-slate-600 text-[11px]">75% achieving guideline target BP (&lt; 130/80 mmHg).</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-600 h-full w-[75%]" />
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
              <span className="font-bold text-emerald-950">Electrolyte Surveillance Panel</span>
              <p className="text-slate-600 text-[11px]">2 patients flagged with borderline serum potassium &gt; 5.5 mmol/L.</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full w-[40%]" />
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
              <span className="font-bold text-emerald-950">Consultation Documentation Rate</span>
              <p className="text-slate-600 text-[11px]">100% notes signed within 2 hours of consultation finish.</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-600 h-full w-[100%]" />
              </div>
            </div>
          </div>

          {/* Clinical Access Audit History Log (Section A & I) */}
          <div className="pt-3 border-t border-emerald-50">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-2.5">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              Clinician Record Access Audit History (Cryptographic Log)
            </h4>

            <div className="divide-y divide-emerald-50 border border-emerald-100 rounded-xl overflow-hidden bg-slate-50/40">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="text-slate-500">for</span>
                      <span className="font-bold text-emerald-800">{log.patientName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono block">{log.timestamp}</span>
                    <span className="text-[10px] font-semibold text-emerald-700">{log.scope}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

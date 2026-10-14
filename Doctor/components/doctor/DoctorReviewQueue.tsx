"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileCheck2,
  Search,
  Filter,
  ArrowRight,
  User,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorReviewAlert } from "@/doctorMockData";

export const DoctorReviewQueue: React.FC<{
  alerts: DoctorReviewAlert[];
  onReviewAlert: (id: string, action: string) => void;
  onOpenPatientRecord: (patientId: string) => void;
}> = ({ alerts, onReviewAlert, onOpenPatientRecord }) => {
  const [filterType, setFilterType] = useState<string>("All");

  const filtered = alerts.filter((a) => {
    if (filterType === "All") return true;
    if (filterType === "Unreviewed") return !a.isReviewed;
    return a.flagType === filterType;
  });

  return (
    <div className="space-y-4">
      <Card className="border-emerald-100 bg-white shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-2 border-b border-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Clinical Review Queue & Critical Value Surveillance
                  <Badge variant="destructive" className="text-[10px]">
                    {alerts.filter((a) => !a.isReviewed).length} Action Items
                  </Badge>
                </CardTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Surfaces verified laboratory flags, extraction checks, and drug-allergy contraindication rules
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-xs">
              {(["All", "Unreviewed", "Critical Lab Value", "Extraction Verification"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filterType === tab
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              All alerts in this category have been acknowledged and resolved.
            </div>
          ) : (
            filtered.map((item) => {
              const isUrgent = item.urgency === "Immediate";
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    item.isReviewed
                      ? "bg-slate-50/60 border-slate-200/80 opacity-75"
                      : isUrgent
                      ? "bg-rose-50/70 border-rose-200"
                      : "bg-amber-50/50 border-amber-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.patientName}</span>
                      <Badge
                        variant={isUrgent ? "destructive" : "warning"}
                        className="text-[10px]"
                      >
                        {item.flagType}
                      </Badge>
                      <span className="text-[11px] text-slate-500">· {item.timestamp}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        (Source: {item.source})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-700">
                      <span>
                        Finding: <strong className="text-slate-900">{item.testName}</strong>
                      </span>
                      <span>
                        Measured: <strong className="font-mono text-rose-700">{item.measuredValue}</strong>
                      </span>
                      <span className="text-slate-500">
                        Reference Range: {item.referenceInterval}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500">Report: {item.reportName}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenPatientRecord(item.patientId)}
                      className="text-xs h-7 px-2.5 bg-white border-slate-200 text-slate-700"
                    >
                      <User className="w-3 h-3 mr-1" />
                      Open Chart
                    </Button>

                    {!item.isReviewed ? (
                      <Button
                        size="sm"
                        onClick={() => onReviewAlert(item.id, "Reviewed & Action Initiated")}
                        className="text-xs h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Acknowledge & Sign
                      </Button>
                    ) : (
                      <span className="text-[11px] text-emerald-800 font-bold bg-white px-2 py-1 rounded border border-emerald-200">
                        ✓ Reviewed
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

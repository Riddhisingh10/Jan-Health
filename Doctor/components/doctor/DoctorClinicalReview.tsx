"use client";

import React, { useState } from "react";
import { useGlobalState } from "@/GlobalStateContext";
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReviewRow {
  test: string;
  value: string;
  flag?: string;
  unit: string;
  range: string;
  conf: "High" | "Low";
  status: "Verify" | "Review" | "Verified";
}

export const DoctorClinicalReview: React.FC<{ onNavigateToHistoryAi?: () => void }> = ({
  onNavigateToHistoryAi,
}) => {
  const [activeQueueItem, setActiveQueueItem] = useState("P. Sharma");
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const [tableRows, setTableRows] = useState<ReviewRow[]>([
    {
      test: "LDL",
      value: "138",
      flag: "H",
      unit: "mg/dL",
      range: "<100",
      conf: "High",
      status: "Verify",
    },
    {
      test: "HDL",
      value: "4?",
      flag: "-",
      unit: "mg/dL",
      range: "none",
      conf: "Low",
      status: "Review",
    },
    {
      test: "TG",
      value: ">400",
      flag: "H",
      unit: "mg/dL",
      range: "<150",
      conf: "High",
      status: "Verify",
    },
  ]);

  const [aiOverview, setAiOverview] = useState(
    "Records used: Mar to Oct, 3 reports. LDL up 14% since March. Family history missing, not negative."
  );

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleVerifyRow = (idx: number) => {
    setTableRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, status: "Verified" } : r))
    );
    showNotice(`Clinician verification recorded for ${tableRows[idx].test}.`);
  };

  const patientConfirmedCount = 1;
  const clinicianVerifiedCount = tableRows.filter((r) => r.status === "Verified").length;

  return (
    <div className="space-y-6">
      {/* Header matching PDF Page 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6EBE8]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#142B21] tracking-tight">
            Clinical review
          </h1>
          <p className="text-xs sm:text-sm text-[#4A6357] mt-0.5">
            Verify extracted data, review trends and write notes
          </p>
        </div>
        <div className="text-xs text-[#5C7367]">
          Dr. Rao · Verified · Doctor portal · D2 to D10
        </div>
      </div>

      {statusNotice && (
        <div className="bg-[#E6F4EA] border border-[#A8D5B5] text-[#0A6640] text-xs font-medium px-4 py-2.5 rounded-xl flex items-center justify-between">
          <span>{statusNotice}</span>
          <button onClick={() => setStatusNotice(null)} className="text-[#0A6640] font-bold">
            ×
          </button>
        </div>
      )}

      {/* 3-Column Layout matching PDF Page 3: Review Queue (2.5) | Original vs Extracted (5.5) | AI Patient Overview (4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Review Queue & Access Scope (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Review Queue Card */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <h2 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
              Review Queue
            </h2>

            <div className="space-y-2.5 text-xs">
              {/* Item 1 */}
              <div
                onClick={() => setActiveQueueItem("P. Sharma")}
                className={`p-2 rounded-xl cursor-pointer transition-colors border ${
                  activeQueueItem === "P. Sharma"
                    ? "bg-[#F2F7F4] border-[#A8D5B5]"
                    : "border-transparent hover:bg-[#F9FCFA]"
                }`}
              >
                <div className="font-bold text-[#142B21]">P. Sharma new lipid report</div>
                <div className="text-[11px] text-[#8C5D00] font-semibold mt-0.5">
                  Verify extraction
                </div>
              </div>

              {/* Item 2 */}
              <div
                onClick={() => setActiveQueueItem("A. Khan")}
                className={`p-2 rounded-xl cursor-pointer transition-colors border ${
                  activeQueueItem === "A. Khan"
                    ? "bg-[#F2F7F4] border-[#A8D5B5]"
                    : "border-transparent hover:bg-[#F9FCFA]"
                }`}
              >
                <div className="font-bold text-[#142B21]">A. Khan critical lab flag</div>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[10px] font-bold text-[#9B1C1C] bg-[#FDE8E8] px-1.5 py-0.5 rounded">
                    Lab-flagged critical
                  </span>
                  <span className="text-[10px] text-[#8C5D00] bg-[#FFF8E6] px-1.5 py-0.5 rounded">
                    Unacknowledged
                  </span>
                </div>
              </div>

              {/* Item 3 */}
              <div
                onClick={() => setActiveQueueItem("R. Das")}
                className={`p-2 rounded-xl cursor-pointer transition-colors border ${
                  activeQueueItem === "R. Das"
                    ? "bg-[#F2F7F4] border-[#A8D5B5]"
                    : "border-transparent hover:bg-[#F9FCFA]"
                }`}
              >
                <div className="font-bold text-[#142B21]">R. Das access request</div>
                <div className="text-[11px] text-[#1B57A6] font-semibold mt-0.5">
                  Pending
                </div>
              </div>
            </div>
          </div>

          {/* Access Scope Card */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2 text-xs">
            <h3 className="font-bold text-[#5C7367] uppercase text-[11px] tracking-wider">
              Access Scope
            </h3>
            <p className="font-bold text-[#142B21]">P. Sharma</p>
            <p className="text-[#4A6357]">Scope: 3 reports, history</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#4A6357]">Expires 20 Nov</span>
              <span className="text-[10px] font-bold text-[#0A6640] bg-[#E6F4EA] px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <button
              onClick={() => showNotice("Wider consent request sent via ABDM gateway.")}
              className="text-[11px] font-semibold text-[#0A6640] hover:underline pt-2 block"
            >
              Request wider access
            </button>
          </div>
        </div>

        {/* Center Column: Original vs Extracted & Consultation Note Draft (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: Original vs Extracted */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6EBE8]">
              <div>
                <h2 className="text-xs font-bold text-[#142B21] tracking-wider uppercase">
                  Original vs Extracted · Lipid_scan P1
                </h2>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] font-semibold">
                <span className="text-[#8C5D00] bg-[#FFF8E6] px-2 py-0.5 rounded">
                  Patient-confirmed: {patientConfirmedCount} of 4
                </span>
                <span className="text-[#0A6640] bg-[#E6F4EA] px-2 py-0.5 rounded">
                  Clinician-verified: {clinicianVerifiedCount}
                </span>
              </div>
            </div>

            {/* Source preview box */}
            <div className="bg-[#EBF2EE] border border-[#D1DFD7] rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="w-24 h-9 bg-white border border-[#A8D5B5] rounded flex items-center justify-center font-mono text-[10px] text-[#0A6640] font-bold">
                [TG &gt;400 mg/dL]
              </div>
              <span className="text-[11px] text-[#4A6357]">
                Page 1 scan aligned with laboratory OCR matrix
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E6EBE8] text-[#5C7367] text-[11px]">
                    <th className="py-2 px-1">Test</th>
                    <th className="py-2 px-1">Value</th>
                    <th className="py-2 px-1">Unit (orig / conv.)</th>
                    <th className="py-2 px-1">Range</th>
                    <th className="py-2 px-1">Conf.</th>
                    <th className="py-2 px-1 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F7F4]">
                  {tableRows.map((r, i) => (
                    <tr key={r.test} className="hover:bg-[#F9FCFA]">
                      <td className="py-2.5 px-1 font-semibold text-[#142B21]">{r.test}</td>
                      <td className="py-2.5 px-1 font-mono font-bold text-[#142B21]">
                        {r.value} {r.flag === "H" && <span className="text-[#C53030]">H</span>}
                      </td>
                      <td className="py-2.5 px-1 text-[#4A6357]">{r.unit}</td>
                      <td className="py-2.5 px-1 text-[#4A6357]">{r.range}</td>
                      <td className="py-2.5 px-1">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            r.conf === "High"
                              ? "bg-[#E6F4EA] text-[#0A6640]"
                              : "bg-[#FFF8E6] text-[#8C5D00]"
                          }`}
                        >
                          {r.conf}
                        </span>
                      </td>
                      <td className="py-2.5 px-1 text-right">
                        {r.status === "Verified" ? (
                          <span className="text-[10px] text-[#0A6640] font-bold">✓ Verified</span>
                        ) : (
                          <button
                            onClick={() => handleVerifyRow(i)}
                            className="text-[11px] font-bold text-[#0A6640] hover:bg-[#E6F4EA] px-2 py-0.5 rounded border border-[#A8D5B5]"
                          >
                            {r.status}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions matching PDF Page 3 */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E6EBE8]">
              <Button
                onClick={() => {
                  setTableRows((prev) => prev.map((r) => ({ ...r, status: "Verified" })));
                  showNotice("All records signed and marked as clinician-verified.");
                }}
                className="bg-[#0A6640] hover:bg-[#085233] text-white font-semibold text-xs h-8 px-3 rounded-xl"
              >
                Verify and mark reviewed
              </Button>
              <Button
                variant="outline"
                onClick={() => showNotice("Value correction dialog opened.")}
                className="bg-white border-[#D9E5DE] text-[#142B21] font-semibold text-xs h-8 px-3 rounded-xl hover:bg-[#F2F7F4]"
              >
                Correct value
              </Button>
              <Button
                variant="outline"
                onClick={() => showNotice("Annotation added to permanent clinical chart.")}
                className="bg-white border-[#D9E5DE] text-[#142B21] font-semibold text-xs h-8 px-3 rounded-xl hover:bg-[#F2F7F4]"
              >
                Add annotation
              </Button>
            </div>
          </div>

          {/* Consultation Note · Draft Card */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <h2 className="text-xs font-bold text-[#142B21] tracking-wider uppercase">
              Consultation Note · Draft
            </h2>

            <div className="bg-[#FFF8E6] border border-[#FFE7A8] p-2.5 rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#8C5D00] block">AI draft, not approved</span>
              <p className="text-[#7A5500]">
                Assessment and plan are drafted for your review. Examination findings come only from what you enter.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                onClick={() => showNotice("Consultation note approved and committed to EHR.")}
                className="bg-[#0A6640] hover:bg-[#085233] text-white font-semibold text-xs h-8 px-3 rounded-xl"
              >
                Edit and approve
              </Button>
              <Button
                variant="outline"
                onClick={() => showNotice("Lipid_scan.jpg source report attached to consultation PDF.")}
                className="bg-white border-[#D9E5DE] text-[#142B21] font-semibold text-xs h-8 px-3 rounded-xl hover:bg-[#F2F7F4]"
              >
                Attach source reports
              </Button>
              <Button
                variant="outline"
                onClick={() => showNotice("Clinical encounter note exported.")}
                className="bg-white border-[#D9E5DE] text-[#142B21] font-semibold text-xs h-8 px-3 rounded-xl hover:bg-[#F2F7F4]"
              >
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Patient Overview AI & Trend & Ask The Record (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Patient Overview · AI Card */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <h2 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
              Patient Overview · AI
            </h2>

            <p className="text-xs text-[#2B3F35] leading-relaxed">
              {aiOverview}
            </p>

            {/* Evidence Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-semibold text-[#0A6640] bg-[#E6F4EA] px-2 py-0.5 rounded">
                Source: LDL 09 Sep
              </span>
              <span className="text-[10px] font-semibold text-[#8C5D00] bg-[#FFF8E6] px-2 py-0.5 rounded">
                Unsupported: statin use
              </span>
            </div>

            <div className="flex items-center space-x-3 pt-1 text-xs font-semibold">
              <button
                onClick={() => {
                  setAiOverview("Records re-synthesized across 4 longitudinal reports. Fasting status unverified.");
                  showNotice("AI Overview regenerated with latest filters.");
                }}
                className="text-[#0A6640] hover:underline"
              >
                Regenerate
              </button>
              <span className="text-[#D9E5DE]">·</span>
              <button
                onClick={() => showNotice("Clinician challenge prompt opened.")}
                className="text-[#5C7367] hover:text-[#142B21] hover:underline"
              >
                Challenge answer
              </button>
            </div>
          </div>

          {/* Trend · LDL */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
            <h3 className="font-bold text-[#142B21] text-xs uppercase tracking-wider">
              Trend · LDL
            </h3>
            <div className="h-16 w-full bg-[#F7FAF8] rounded-xl border border-[#E6EBE8] flex items-end p-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 50">
                <rect x="0" y="32" width="200" height="18" fill="#E6F4EA" opacity="0.6" />
                <path
                  d="M 10 35 L 70 30 L 130 22 L 190 10"
                  fill="none"
                  stroke="#0A6640"
                  strokeWidth="2.5"
                />
                <circle cx="10" cy="35" r="3" fill="#0A6640" />
                <circle cx="70" cy="30" r="3" fill="#0A6640" />
                <circle cx="130" cy="22" r="3" fill="#0A6640" />
                <circle cx="190" cy="10" r="4" fill="#0A6640" />
              </svg>
            </div>
            <p className="text-[10px] text-[#5C7367]">
              Lab ranges differ across labs. Observed values only.
            </p>
          </div>

          {/* Ask The Record */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
            <h3 className="font-bold text-[#5C7367] text-xs uppercase tracking-wider">
              Ask The Record
            </h3>
            <p className="text-xs text-[#2B3F35] leading-relaxed">
              Differential considerations, not diagnoses. Evidence: [guideline, year]. Record vs external evidence labeled.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#1B57A6] bg-[#EBF3FE] px-2 py-0.5 rounded">
                AI-generated
              </span>
            </div>
            {onNavigateToHistoryAi && (
              <button
                onClick={onNavigateToHistoryAi}
                className="w-full mt-2 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#E6F4EA] hover:bg-[#D4EDDA] text-[#0A6640] text-xs font-bold border border-[#A8D5B5] transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deep Dive into Medical History with AI →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-[#5C7367] pt-2">
        Sample data for design purposes. Bracketed values are placeholders.
      </div>
    </div>
  );
};

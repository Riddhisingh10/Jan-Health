"use client";

import * as React from "react";
import { useState } from "react";
import { useGlobalState } from "@/GlobalStateContext";
import {
  Activity,
  Users,
  ShieldAlert,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lock,
  Key,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModelTrainingStudio } from "./ModelTrainingStudio";

interface ModelStageItem {
  version: string;
  stage: string;
  canRollback?: boolean;
  canApprove?: boolean;
  canDisable?: boolean;
  status?: string;
}

interface ModelStagesState {
  ocr: ModelStageItem;
  extraction: ModelStageItem;
  explainer: ModelStageItem;
  forecast: ModelStageItem;
}

export const PlatformOperationsAdmin: React.FC = () => {
  const [modelStages, setModelStages] = useState<ModelStagesState>({
    ocr: { version: "v[1.4]", stage: "Production", canRollback: true },
    extraction: { version: "v[2.0]", stage: "Staging", canApprove: true },
    explainer: { version: "v[3]", stage: "Production", canDisable: true },
    forecast: { version: "v[0.1]", stage: "Experimental", status: "Not approved" },
  });

  const [featureFlags, setFeatureFlags] = useState({
    forecasting: false,
    riskModels: false,
    aiExplanations: true,
    aiDisclaimers: true,
  });

  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [showTrainingStudio, setShowTrainingStudio] = useState<boolean>(false);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleDeployModel = (modelName: string, version: string, stage: "Staging" | "Production") => {
    setModelStages((prev: ModelStagesState) => ({
      ...prev,
      extraction: {
        version: version,
        stage: stage,
        canApprove: stage === "Staging",
      },
    }));
    showNotice(`AI Model Registry updated: ${modelName} ${version} deployed to ${stage}.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header matching PDF Page 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6EBE8]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#142B21] tracking-tight">
            Platform operations
          </h1>
          <p className="text-xs sm:text-sm text-[#4A6357] mt-0.5">
            Users, data pipeline, AI quality and audit
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs text-[#5C7367]">
          <button
            onClick={() => setShowTrainingStudio(!showTrainingStudio)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#E6F4EA] hover:bg-[#D4EDDA] text-[#0A6640] font-bold border border-[#A8D5B5] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showTrainingStudio ? "Close Studio" : "Model Training Studio"}</span>
          </button>
          <span>Admin portal · A1 to A15</span>
        </div>
      </div>

      {/* Model Training Studio (Modal / Expanded Section) */}
      {showTrainingStudio && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#A8D5B5] shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
          <ModelTrainingStudio
            onClose={() => setShowTrainingStudio(false)}
            onDeployToRegistry={handleDeployModel}
          />
        </div>
      )}

      {statusNotice && (
        <div className="bg-[#E6F4EA] border border-[#A8D5B5] text-[#0A6640] text-xs font-medium px-4 py-2.5 rounded-xl flex items-center justify-between">
          <span>{statusNotice}</span>
          <button onClick={() => setStatusNotice(null)} className="text-[#0A6640] font-bold">
            ×
          </button>
        </div>
      )}

      {/* Top 5 Metric Stat Cards matching PDF Page 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-2xl border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="text-2xl font-extrabold text-[#142B21] font-mono">[n]</div>
          <div className="text-xs text-[#5C7367] mt-0.5 font-medium">Accounts</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="text-2xl font-extrabold text-[#142B21] font-mono">[n]</div>
          <div className="text-xs text-[#5C7367] mt-0.5 font-medium">Doctors pending</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="text-2xl font-extrabold text-[#C53030] font-mono">[n]</div>
          <div className="text-xs text-[#5C7367] mt-0.5 font-medium">Jobs failed</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="text-2xl font-extrabold text-[#0A6640] font-mono">[x]%</div>
          <div className="text-xs text-[#5C7367] mt-0.5 font-medium">Review rate</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E6EBE8] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="text-2xl font-extrabold text-[#0A6640] font-mono">[x]%</div>
          <div className="text-xs text-[#5C7367] mt-0.5 font-medium">API uptime</div>
        </div>
      </div>

      {/* 3-Column Operations Grid matching PDF Page 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: AI Model Registry & Extraction Quality (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Model Registry Card */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
                AI Model Registry
              </h2>
              <button
                onClick={() => setShowTrainingStudio(true)}
                className="text-xs font-bold text-[#0A6640] hover:text-[#085233] hover:underline flex items-center space-x-1"
              >
                <span>+ Train New Model</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E6EBE8] text-[#5C7367] text-[11px]">
                    <th className="py-2">Model</th>
                    <th className="py-2">Version</th>
                    <th className="py-2">Stage</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F7F4]">
                  {/* OCR */}
                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-2.5 font-semibold text-[#142B21]">OCR</td>
                    <td className="py-2.5 font-mono text-[#5C7367]">{modelStages.ocr.version}</td>
                    <td className="py-2.5">
                      <span className="text-[10px] font-bold text-[#0A6640] bg-[#E6F4EA] px-2 py-0.5 rounded-full">
                        Production
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => showNotice("OCR model rollback queued for deployment approval.")}
                        className="text-[11px] text-[#5C7367] hover:underline"
                      >
                        Roll back
                      </button>
                    </td>
                  </tr>

                  {/* Extraction */}
                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-2.5 font-semibold text-[#142B21]">Extraction</td>
                    <td className="py-2.5 font-mono text-[#5C7367]">{modelStages.extraction.version}</td>
                    <td className="py-2.5">
                      <span className="text-[10px] font-bold text-[#1B57A6] bg-[#EBF3FE] px-2 py-0.5 rounded-full">
                        Staging
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => showNotice("Extraction v2.0 approved for canary deployment.")}
                        className="text-[11px] font-bold text-[#0A6640] hover:underline"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>

                  {/* Explainer prompt */}
                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-2.5 font-semibold text-[#142B21]">Explainer prompt</td>
                    <td className="py-2.5 font-mono text-[#5C7367]">{modelStages.explainer.version}</td>
                    <td className="py-2.5">
                      <span className="text-[10px] font-bold text-[#0A6640] bg-[#E6F4EA] px-2 py-0.5 rounded-full">
                        Production
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => showNotice("Explainer prompt temporarily disabled.")}
                        className="text-[11px] text-[#C53030] hover:underline"
                      >
                        Disable
                      </button>
                    </td>
                  </tr>

                  {/* Forecast */}
                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-2.5 font-semibold text-[#142B21]">Forecast</td>
                    <td className="py-2.5 font-mono text-[#5C7367]">{modelStages.forecast.version}</td>
                    <td className="py-2.5">
                      <span className="text-[10px] font-bold text-[#8C5D00] bg-[#FFF8E6] px-2 py-0.5 rounded-full">
                        Experimental
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="text-[11px] text-[#8C5D00]">Not approved</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Extraction Quality · Locked Test Set */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <h2 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
              Extraction Quality · Locked Test Set
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E6EBE8] text-[#5C7367] text-[11px]">
                    <th className="py-2">Field</th>
                    <th className="py-2">Accuracy</th>
                    <th className="py-2">95% CI</th>
                    <th className="py-2 text-right">n</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F7F4] font-mono text-xs">
                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-2 font-sans font-medium text-[#142B21]">Test name</td>
                    <td className="py-2 text-[#0A6640] font-bold">[x]%</td>
                    <td className="py-2 text-[#5C7367]">[ci]</td>
                    <td className="py-2 text-right text-[#5C7367]">[n]</td>
                  </tr>
                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-2 font-sans font-medium text-[#142B21]">Value</td>
                    <td className="py-2 text-[#0A6640] font-bold">[x]%</td>
                    <td className="py-2 text-[#5C7367]">[ci]</td>
                    <td className="py-2 text-right text-[#5C7367]">[n]</td>
                  </tr>
                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-2 font-sans font-medium text-[#142B21]">Unit</td>
                    <td className="py-2 text-[#0A6640] font-bold">[x]%</td>
                    <td className="py-2 text-[#5C7367]">[ci]</td>
                    <td className="py-2 text-right text-[#5C7367]">[n]</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#5C7367] pt-1">
              <span>Benchmark accuracy is not clinical validity.</span>
              <span className="font-semibold text-[#0A6640] bg-[#E6F4EA] px-2 py-0.5 rounded">
                Drift alert: None
              </span>
            </div>
          </div>
        </div>

        {/* Center Column: Processing Queue & Doctor Verification (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Processing Queue Card */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <h2 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
              Processing Queue
            </h2>

            <p className="text-xs text-[#2B3F35]">
              Queued [n] · Processing [n] · Needs review [n]
            </p>
            <p className="text-xs text-[#7A5500] bg-[#FFF8E6] p-2 rounded-xl border border-[#FFE7A8]">
              Failed: password-protected [n], unreadable [n]
            </p>

            <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
              <span className="text-[10px] font-semibold text-[#0A6640] bg-[#E6F4EA] px-2 py-0.5 rounded">
                Retry eligible
              </span>
              <span className="text-[10px] font-semibold text-[#0A6640] bg-[#E6F4EA] px-2 py-0.5 rounded">
                OCR Healthy
              </span>
              <span className="text-[10px] font-semibold text-[#8C5D00] bg-[#FFF8E6] px-2 py-0.5 rounded">
                Extraction Slow
              </span>
            </div>
          </div>

          {/* Doctor Verification Card */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <h2 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
              Doctor Verification
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#F2F7F4]">
                <div>
                  <div className="font-bold text-[#142B21]">Dr. M. Iyer</div>
                  <span className="text-[10px] font-semibold text-[#8C5D00] bg-[#FFF8E6] px-1.5 py-0.5 rounded">
                    Credentials pending
                  </span>
                </div>
                <button
                  onClick={() => showNotice("Dr. M. Iyer credentials verification modal opened.")}
                  className="text-xs font-bold text-[#0A6640] hover:underline"
                >
                  Review
                </button>
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-bold text-[#142B21]">Dr. S. Nair</div>
                  <span className="text-[10px] font-semibold text-[#0A6640] bg-[#E6F4EA] px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                </div>
                <button
                  onClick={() => showNotice("Dr. S. Nair temporary suspension toggle triggered.")}
                  className="text-xs text-[#C53030] hover:underline"
                >
                  Suspend
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#5C7367] pt-2 border-t border-[#E6EBE8]">
              Admins see metadata only, not report content.
            </div>
          </div>
        </div>

        {/* Right Column: Audit Log, Feature Flags & Incidents (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Audit Log Card */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <h2 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
              Audit Log
            </h2>

            <div className="space-y-2 text-xs">
              <div className="space-y-0.5">
                <div className="text-[#142B21]">Dr. Rao viewed record · 09:10</div>
                <span className="text-[10px] font-bold text-[#0A6640] bg-[#E6F4EA] px-1.5 py-0.5 rounded">
                  Allowed
                </span>
              </div>

              <div className="space-y-0.5 pt-1">
                <div className="text-[#142B21]">Export, bulk · 08:40</div>
                <span className="text-[10px] font-bold text-[#9B1C1C] bg-[#FDE8E8] px-1.5 py-0.5 rounded">
                  Blocked
                </span>
              </div>

              <div className="text-[#5C7367] text-[11px] pt-1">
                Model v2.0 promoted to staging
              </div>
            </div>
          </div>

          {/* Feature Flags Card */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2.5">
            <h2 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
              Feature Flags
            </h2>

            <div className="space-y-1.5 text-xs text-[#2B3F35]">
              <p>Forecasting: <span className="font-semibold text-[#8C5D00]">Off</span> · Risk models: <span className="font-semibold text-[#8C5D00]">Off</span></p>
              <p>AI explanations: <span className="font-semibold text-[#0A6640]">On</span> · AI disclaimers: <span className="font-semibold text-[#0A6640]">edit</span></p>
            </div>

            <p className="text-[11px] text-[#5C7367] pt-1">
              Config changes need approval
            </p>
          </div>

          {/* Incidents Card */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
            <h2 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
              Incidents
            </h2>

            <p className="text-xs text-[#2B3F35] leading-relaxed">
              Safety escalation [n] open · Privacy complaint [n] open
            </p>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-[#5C7367] pt-2">
        Sample data for design purposes. Bracketed values are placeholders.
      </div>
    </div>
  );
};

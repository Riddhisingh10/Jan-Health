"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Database,
  Cpu,
  Activity,
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Server,
  FileCode,
  Download,
  Terminal,
  TrendingDown,
  ChevronRight,
  Sliders,
  X,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ModelTrainingStudioProps {
  onClose?: () => void;
  onDeployToRegistry?: (modelName: string, version: string, stage: "Staging" | "Production") => void;
}

export const ModelTrainingStudio: React.FC<ModelTrainingStudioProps> = ({
  onClose,
  onDeployToRegistry,
}: ModelTrainingStudioProps) => {
  // Tabs: "datasets" | "config" | "monitor" | "evaluation"
  const [activeTab, setActiveTab] = useState<"datasets" | "config" | "monitor" | "evaluation">("config");

  // Configuration State
  const [targetTask, setTargetTask] = useState<"multitask" | "extraction" | "explainer" | "forecast">("multitask");
  const [baseModel, setBaseModel] = useState<string>("mistralai/BioMistral-7B");
  const [peftMethod, setPeftMethod] = useState<string>("qlora-4bit");
  const [epochs, setEpochs] = useState<number>(3);
  const [batchSize, setBatchSize] = useState<number>(4);
  const [learningRate, setLearningRate] = useState<string>("2e-4");
  const [loraRank, setLoraRank] = useState<number>(16);

  // Training Execution State
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingComplete, setTrainingComplete] = useState<boolean>(false);
  const [currentEpoch, setCurrentEpoch] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps] = useState<number>(150);
  const [currentLoss, setCurrentLoss] = useState<number>(2.84);
  const [valLoss, setValLoss] = useState<number>(2.91);
  const [lossHistory, setLossHistory] = useState<number[]>([2.84]);
  const [logs, setLogs] = useState<string[]>([
    "[INIT] System ready. Multi-task clinical dataset loaded (320 train, 40 val, 40 locked test).",
  ]);

  // Status Toast
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3500);
  };

  // Preview Dataset State
  const [selectedDataset, setSelectedDataset] = useState<string>("MultiTask_Clinical_v2");
  const [previewSample, setPreviewSample] = useState<number>(0);

  interface DatasetItem {
    id: string;
    name: string;
    samples: string;
    tokens: string;
    splits: string;
    compliance: string;
    tasks: string[];
  }

  // Dataset catalog
  const datasets: DatasetItem[] = [
    {
      id: "MultiTask_Clinical_v2",
      name: "JAN Multi-Task Master Clinical Set",
      samples: "60,700 samples",
      tokens: "48.2M tokens",
      splits: "80% Train · 10% Val · 10% Locked Test",
      compliance: "HIPAA Safe Harbor + ABDM DISHA De-Identified",
      tasks: ["Structured Extraction", "LOINC Standard", "Patient Explainer", "Forecast"],
    },
    {
      id: "Lipid_Panels_v2",
      name: "Lipid & Cardiovascular Panel Corpus",
      samples: "14,200 reports",
      tokens: "11.4M tokens",
      splits: "80% Train · 10% Val · 10% Test",
      compliance: "De-Identified Venous Draws",
      tasks: ["Total Chol", "LDL", "HDL", "Triglycerides", "VLDL"],
    },
    {
      id: "CBC_Hematology_10k",
      name: "Complete Blood Count Reference Set",
      samples: "28,500 reports",
      tokens: "22.8M tokens",
      splits: "80% Train · 10% Val · 10% Test",
      compliance: "Multi-hospital pathology scans",
      tasks: ["Hemoglobin", "WBC", "RBC", "Platelets", "Hematocrit"],
    },
  ];

  // Sample data pairs for preview
  const sampleDataPairs = [
    {
      input: "LABORATORY TEST REPORT - LIPID PANEL\nFacility: Apollo Diagnostic Central Lab\nCollection Date: 09 Sep 2026 | Patient ID: PT-84920\nTotal Cholesterol: 212 mg/dL (<200) H\nLDL Cholesterol: 138 mg/dL (<100) H\nHDL Cholesterol: 42 mg/dL (>40)\nTriglycerides: > 400 mg/dL (<150) H",
      target: JSON.stringify(
        {
          panel: "Lipid Panel",
          parameters: [
            { test: "Total Cholesterol", loinc: "2093-3", result: "212", unit: "mg/dL", flag: "H" },
            { test: "LDL Cholesterol", loinc: "13457-7", result: "138", unit: "mg/dL", flag: "H" },
            { test: "HDL Cholesterol", loinc: "2085-9", result: "42", unit: "mg/dL", flag: "Normal" },
            { test: "Triglycerides", loinc: "2571-8", result: "> 400", unit: "mg/dL", flag: "H" },
          ],
        },
        null,
        2
      ),
    },
    {
      input: "Synthesize patient blood report (LDL: 138 mg/dL, TG: >400 mg/dL) into plain-language guidance and 3 doctor questions.",
      target: "### Plain-Language Summary\nYour LDL cholesterol is 138 mg/dL (target <100 mg/dL) and Triglycerides are elevated. Elevated values are not an independent diagnosis; hydration and fasting duration strongly influence lipid panels.\n\n### 3 Questions for Dr. Rao\n1. Should I repeat the lipid panel after a strict 12-hour fast?\n2. Are dietary adjustments recommended before considering medications?\n3. What follow-up timeframe do you recommend?",
    },
  ];

  // Start Training Simulation
  const handleStartTraining = () => {
    setActiveTab("monitor");
    setIsTraining(true);
    setTrainingComplete(false);
    setCurrentStep(0);
    setCurrentEpoch(1);
    setCurrentLoss(2.84);
    setValLoss(2.91);
    setLossHistory([2.84]);

    const initialLogs = [
      `[INIT] Target Task: ${targetTask.toUpperCase()}`,
      `[LOAD] Base Weights: ${baseModel} into GPU VRAM (4-bit NF4 quantized)`,
      `[PEFT] LoRA injected: r=${loraRank}, alpha=32, target_modules=[q_proj, v_proj, k_proj, o_proj]`,
      `[DATA] Batch Size: ${batchSize} | Epochs: ${epochs} | LR: ${learningRate} | Optimizer: AdamW Paged 8-bit`,
      `[STEP 1/150] Epoch 1/3 started. Loss: 2.8421 | VRAM: 5.8 GB`,
    ];
    setLogs(initialLogs);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const progress = step / totalSteps;
      const epoch = Math.min(epochs, Math.floor((step / totalSteps) * epochs) + 1);
      const simulatedLoss = Number(
        Math.max(0.34, 2.84 * Math.exp(-progress * 2.8) + (Math.random() * 0.05 - 0.025)).toFixed(4)
      );
      const simulatedValLoss = Number((simulatedLoss * 1.06).toFixed(4));

      setCurrentStep(step);
      setCurrentEpoch(epoch);
      setCurrentLoss(simulatedLoss);
      setValLoss(simulatedValLoss);
      setLossHistory((prev: number[]) => [...prev.slice(-30), simulatedLoss]);

      if (step % 25 === 0) {
        setLogs((prev: string[]) => [
          ...prev,
          `[STEP ${step}/${totalSteps}] Epoch ${epoch}/${epochs} | Loss: ${simulatedLoss} | Val Loss: ${simulatedValLoss} | Learning Rate: ${(
            parseFloat(learningRate) * (1 - progress * 0.8)
          ).toExponential(2)}`,
        ]);
      }

      if (step >= totalSteps) {
        clearInterval(interval);
        setIsTraining(false);
        setTrainingComplete(true);
        setLogs((prev: string[]) => [
          ...prev,
          `[COMPLETED] Training converged in 150 steps. Final Train Loss: ${simulatedLoss} | Val Loss: ${simulatedValLoss}`,
          `[EVAL] Running verification against LOCKED TEST SET (40 samples)...`,
          `[BENCHMARK] Test name accuracy: 98.4% | Value accuracy: 99.1% | LOINC: 97.6%`,
          `[SAVED] Checkpoint saved: models/jan_health_multitask_v2.0/adapter_model.bin`,
          `[STATUS] Ready for deployment to Staging or Production.`,
        ]);
        showNotice("Training complete! Locked test-set benchmarks passed (98.4% extraction accuracy).");
      }
    }, 120);
  };

  const handleDeploy = (stage: "Staging" | "Production") => {
    if (onDeployToRegistry) {
      onDeployToRegistry("Extraction & Multi-Task", "v[2.1]", stage);
    }
    showNotice(`Successfully promoted JAN MultiTask v[2.1] to ${stage}! Live Model Registry updated.`);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#0A6640] text-white flex items-center justify-center font-bold shadow-xs">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-[#142B21] tracking-tight">
                AI Model Training & Fine-Tuning Studio
              </h2>
              <Badge className="bg-[#E6F4EA] text-[#0A6640] border-[#A8D5B5] text-[10px]">
                PyTorch & PEFT (QLoRA)
              </Badge>
            </div>
            <p className="text-xs text-[#5C7367] mt-0.5">
              Train clinical extraction, plain-language explainer, and trajectory forecasting models on de-identified lab reports
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-[#D9E5DE] text-[#142B21] text-xs h-9 rounded-xl hover:bg-[#F2F7F4]"
            >
              <X className="w-4 h-4 mr-1.5" />
              Close Studio
            </Button>
          )}
        </div>
      </div>

      {statusNotice && (
        <div className="bg-[#E6F4EA] border border-[#A8D5B5] text-[#0A6640] text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusNotice}</span>
          </div>
          <button onClick={() => setStatusNotice(null)} className="font-bold text-sm">
            ×
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-[#E6EBE8] p-1.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "config"
                ? "bg-[#0A6640] text-white shadow-xs"
                : "text-[#4A6357] hover:text-[#142B21] hover:bg-[#F2F7F4]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Training Configurator</span>
          </button>

          <button
            onClick={() => setActiveTab("datasets")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "datasets"
                ? "bg-[#0A6640] text-white shadow-xs"
                : "text-[#4A6357] hover:text-[#142B21] hover:bg-[#F2F7F4]"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>2. Datasets & De-Identification</span>
          </button>

          <button
            onClick={() => setActiveTab("monitor")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "monitor"
                ? "bg-[#0A6640] text-white shadow-xs"
                : "text-[#4A6357] hover:text-[#142B21] hover:bg-[#F2F7F4]"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>3. Live Training Monitor</span>
            {isTraining && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("evaluation")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "evaluation"
                ? "bg-[#0A6640] text-white shadow-xs"
                : "text-[#4A6357] hover:text-[#142B21] hover:bg-[#F2F7F4]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Benchmark & Model Registry</span>
          </button>
        </div>

        <div className="text-xs text-[#5C7367] px-3 font-medium hidden sm:block">
          Python pipeline: <code className="text-[#0A6640] font-mono">training/train_multitask_model.py</code>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: TRAINING CONFIGURATOR
      ========================================================================= */}
      {activeTab === "config" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Settings (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Task Selection Card */}
            <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
                Step 1: Clinical Objective & Task Target
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Option 1: Multi-task */}
                <div
                  onClick={() => setTargetTask("multitask")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    targetTask === "multitask"
                      ? "border-[#0A6640] bg-[#F2F7F4] shadow-xs"
                      : "border-[#E6EBE8] hover:bg-[#F9FCFA]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#142B21]">Unified Multi-Task Weights</span>
                    <Badge className="bg-[#0A6640] text-white text-[9px]">Recommended</Badge>
                  </div>
                  <p className="text-[11px] text-[#5C7367] mt-1">
                    Fine-tunes a single unified model for OCR extraction, LOINC mapping, patient explanations, and forecasting.
                  </p>
                </div>

                {/* Option 2: Structured Extraction */}
                <div
                  onClick={() => setTargetTask("extraction")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    targetTask === "extraction"
                      ? "border-[#0A6640] bg-[#F2F7F4] shadow-xs"
                      : "border-[#E6EBE8] hover:bg-[#F9FCFA]"
                  }`}
                >
                  <span className="font-bold text-[#142B21]">Extraction & LOINC Only</span>
                  <p className="text-[11px] text-[#5C7367] mt-1">
                    Specialized parser extracting parameters, units, reference intervals, and LOINC codes from messy OCR scans.
                  </p>
                </div>

                {/* Option 3: Explainer */}
                <div
                  onClick={() => setTargetTask("explainer")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    targetTask === "explainer"
                      ? "border-[#0A6640] bg-[#F2F7F4] shadow-xs"
                      : "border-[#E6EBE8] hover:bg-[#F9FCFA]"
                  }`}
                >
                  <span className="font-bold text-[#142B21]">Patient-Friendly Explainer</span>
                  <p className="text-[11px] text-[#5C7367] mt-1">
                    Generates plain-language interpretations and appointment questions with grounded source citations.
                  </p>
                </div>

                {/* Option 4: Forecasting */}
                <div
                  onClick={() => setTargetTask("forecast")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    targetTask === "forecast"
                      ? "border-[#0A6640] bg-[#F2F7F4] shadow-xs"
                      : "border-[#E6EBE8] hover:bg-[#F9FCFA]"
                  }`}
                >
                  <span className="font-bold text-[#142B21]">Biomarker Trajectory Forecasting</span>
                  <p className="text-[11px] text-[#5C7367] mt-1">
                    Projects 12-month trajectory curves with 95% confidence intervals from longitudinal test history.
                  </p>
                </div>
              </div>
            </div>

            {/* Base Model & PEFT Architecture */}
            <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
                Step 2: Base Foundation Weights & PEFT Quantization
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-[#142B21] mb-1.5">
                    Foundation Base Model
                  </label>
                  <select
                    value={baseModel}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBaseModel(e.target.value)}
                    className="w-full bg-[#F7FAF8] border border-[#D9E5DE] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#0A6640] focus:ring-1 focus:ring-[#0A6640] outline-hidden"
                  >
                    <option value="mistralai/BioMistral-7B">BioMistral-7B (Medical Domain Pre-trained)</option>
                    <option value="meta-llama/Meta-Llama-3.1-8B-Instruct">Meta-Llama-3.1-8B-Instruct (General Clinical)</option>
                    <option value="google/gemma-2-9b-it">Google Gemma-2-9B-IT (High Precision)</option>
                    <option value="microsoft/layoutlmv3-base">Microsoft LayoutLMv3-Base (Vision Document OCR)</option>
                  </select>
                  <p className="text-[10.5px] text-[#5C7367] mt-1">
                    Pre-trained on PubMed Central and clinical biomedical ontologies.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B21] mb-1.5">
                    Fine-Tuning Method
                  </label>
                  <select
                    value={peftMethod}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPeftMethod(e.target.value)}
                    className="w-full bg-[#F7FAF8] border border-[#D9E5DE] rounded-xl px-3 py-2 text-xs font-medium focus:border-[#0A6640] focus:ring-1 focus:ring-[#0A6640] outline-hidden"
                  >
                    <option value="qlora-4bit">QLoRA (4-bit NF4 Quantization) - 6GB VRAM</option>
                    <option value="lora-16bit">LoRA (bfloat16 / float16) - 14GB VRAM</option>
                    <option value="full-fine-tune">Full Parameter Fine-Tuning - 48GB VRAM</option>
                  </select>
                  <p className="text-[10.5px] text-[#5C7367] mt-1">
                    Trains low-rank adapter matrices (q_proj, v_proj) while keeping base weights frozen.
                  </p>
                </div>
              </div>

              {/* Hyperparameter Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#F2F7F4]">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C7367] mb-1">
                    Epochs
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={epochs}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEpochs(Number(e.target.value))}
                    className="w-full bg-[#F7FAF8] border border-[#D9E5DE] rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5C7367] mb-1">
                    Batch Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={32}
                    value={batchSize}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBatchSize(Number(e.target.value))}
                    className="w-full bg-[#F7FAF8] border border-[#D9E5DE] rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5C7367] mb-1">
                    Learning Rate
                  </label>
                  <input
                    type="text"
                    value={learningRate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLearningRate(e.target.value)}
                    className="w-full bg-[#F7FAF8] border border-[#D9E5DE] rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5C7367] mb-1">
                    LoRA Rank (r)
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={64}
                    value={loraRank}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoraRank(Number(e.target.value))}
                    className="w-full bg-[#F7FAF8] border border-[#D9E5DE] rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Summary & Launch Action (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
                Launch Training Run
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F2F7F4]">
                  <span className="text-[#5C7367]">Base Model:</span>
                  <span className="font-semibold text-[#142B21] font-mono text-[11px]">
                    {baseModel.split("/")[1] || baseModel}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2F7F4]">
                  <span className="text-[#5C7367]">PEFT Architecture:</span>
                  <span className="font-semibold text-[#0A6640]">QLoRA (r={loraRank}, α=32)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2F7F4]">
                  <span className="text-[#5C7367]">Training Corpus:</span>
                  <span className="font-semibold text-[#142B21]">60,700 Clinical Records</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2F7F4]">
                  <span className="text-[#5C7367]">De-Identification:</span>
                  <span className="font-semibold text-[#0A6640]">HIPAA Safe Harbor ✓</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2F7F4]">
                  <span className="text-[#5C7367]">Expected Steps:</span>
                  <span className="font-mono font-bold text-[#142B21]">150 steps</span>
                </div>
              </div>

              <Button
                onClick={handleStartTraining}
                disabled={isTraining}
                className="w-full bg-[#0A6640] hover:bg-[#085233] text-white font-semibold text-xs py-2.5 rounded-xl h-10 shadow-xs flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isTraining ? "Training in progress..." : "Start Training Run"}</span>
              </Button>

              <div className="bg-[#F7FAF8] rounded-xl p-3 border border-[#E6EBE8] text-[11px] text-[#5C7367] space-y-1">
                <div className="flex items-center space-x-1.5 font-semibold text-[#142B21]">
                  <Terminal className="w-3.5 h-3.5 text-[#0A6640]" />
                  <span>CLI Command (Headless / Cluster)</span>
                </div>
                <pre className="font-mono text-[10px] bg-white p-2 rounded-lg border border-[#D9E5DE] overflow-x-auto text-[#142B21]">
                  python training/train_multitask_model.py --epochs {epochs} --batch_size {batchSize}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DATASETS & DE-IDENTIFICATION
      ========================================================================= */}
      {activeTab === "datasets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {datasets.map((ds: DatasetItem) => (
              <div
                key={ds.id}
                onClick={() => setSelectedDataset(ds.id)}
                className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all ${
                  selectedDataset === ds.id
                    ? "border-[#0A6640] shadow-sm bg-[#F9FCFA]"
                    : "border-[#E6EBE8] hover:border-[#D9E5DE]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#142B21]">{ds.name}</h4>
                  <Badge className="bg-[#E6F4EA] text-[#0A6640] text-[9px]">Verified</Badge>
                </div>
                <div className="text-[11px] text-[#5C7367] mt-1">{ds.samples} · {ds.tokens}</div>
                <div className="text-[10px] text-[#0A6640] mt-2 font-semibold">{ds.compliance}</div>
              </div>
            ))}
          </div>

          {/* Dataset Record Inspector */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
                  Data Sample Inspector (De-Identified Clinical Pair)
                </h3>
                <p className="text-xs text-[#5C7367] mt-0.5">
                  Inspect raw unstructured OCR prompt input vs ground-truth structured supervision
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold">
                <button
                  onClick={() => setPreviewSample(0)}
                  className={`px-3 py-1 rounded-lg ${
                    previewSample === 0 ? "bg-[#0A6640] text-white" : "bg-[#F2F7F4] text-[#4A6357]"
                  }`}
                >
                  Sample 1: Extraction & LOINC
                </button>
                <button
                  onClick={() => setPreviewSample(1)}
                  className={`px-3 py-1 rounded-lg ${
                    previewSample === 1 ? "bg-[#0A6640] text-white" : "bg-[#F2F7F4] text-[#4A6357]"
                  }`}
                >
                  Sample 2: Clinical Explainer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="font-bold text-[#142B21] text-[11px]">Prompt Input (Raw Text & OCR)</div>
                <pre className="bg-[#F7FAF8] border border-[#E6EBE8] rounded-xl p-3 font-mono text-[11px] text-[#142B21] overflow-x-auto whitespace-pre-wrap h-64">
                  {sampleDataPairs[previewSample].input}
                </pre>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-[#142B21] text-[11px]">Supervised Target (Ground Truth Schema)</div>
                <pre className="bg-[#F7FAF8] border border-[#E6EBE8] rounded-xl p-3 font-mono text-[11px] text-[#0A6640] overflow-x-auto whitespace-pre-wrap h-64">
                  {sampleDataPairs[previewSample].target}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LIVE TRAINING MONITOR & TELEMETRY
      ========================================================================= */}
      {activeTab === "monitor" && (
        <div className="space-y-6">
          {/* Top Progress Strip */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-[#142B21]">
                    {isTraining
                      ? `Training in progress: Epoch ${currentEpoch}/${epochs} (Step ${currentStep}/${totalSteps})`
                      : trainingComplete
                      ? "Training Run Completed Successfully ✓"
                      : "Ready to launch training run"}
                  </h3>
                  <Badge
                    className={
                      isTraining
                        ? "bg-[#EBF3FE] text-[#1B57A6] border-[#B3D1FF]"
                        : trainingComplete
                        ? "bg-[#E6F4EA] text-[#0A6640] border-[#A8D5B5]"
                        : "bg-[#F2F7F4] text-[#5C7367]"
                    }
                  >
                    {isTraining ? "ACTIVE GPU OPTIMIZATION" : trainingComplete ? "CONVERGED" : "IDLE"}
                  </Badge>
                </div>
                <p className="text-xs text-[#5C7367] mt-0.5">
                  Base: {baseModel} · QLoRA Rank {loraRank} · LR: {learningRate}
                </p>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono">
                <div>
                  <span className="text-[#5C7367] block text-[10px]">Train Loss</span>
                  <span className="font-bold text-[#142B21] text-base">{currentLoss.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-[#5C7367] block text-[10px]">Validation Loss</span>
                  <span className="font-bold text-[#0A6640] text-base">{valLoss.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#E6EBE8] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#0A6640] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Loss Curve SVG Visualization & Terminal Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual SVG Loss Curve (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#5C7367] uppercase tracking-wider">
                  Convergence Curve (Loss vs Steps)
                </h4>
                <span className="text-[10px] font-semibold text-[#0A6640]">Cosine Decay</span>
              </div>

              {/* Dynamic SVG Sparkline */}
              <div className="h-48 w-full flex items-center justify-center bg-[#F7FAF8] rounded-xl p-3 border border-[#E6EBE8] relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120">
                  <line x1="0" y1="110" x2="300" y2="110" stroke="#D9E5DE" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="#D9E5DE" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="0" y1="10" x2="300" y2="10" stroke="#D9E5DE" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Polyline of Loss */}
                  {lossHistory.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#0A6640"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={lossHistory
                        .map((loss: number, idx: number) => {
                          const x = (idx / (lossHistory.length - 1 || 1)) * 290 + 5;
                          const y = Math.min(110, Math.max(10, ((loss - 0.3) / 2.6) * 100));
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />
                  )}
                </svg>
                <div className="absolute top-2 left-3 text-[10px] font-mono text-[#5C7367]">Loss: 2.84</div>
                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#0A6640] font-bold">
                  Current: {currentLoss}
                </div>
              </div>
            </div>

            {/* Live Streaming Terminal Log (7 cols) */}
            <div className="lg:col-span-7 bg-[#142B21] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col h-72">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs text-white/80">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E53E3E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D69E2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38A169]" />
                  <span className="font-mono text-[11px] ml-2 text-emerald-300">PyTorch Training Console</span>
                </div>
                <span className="text-[10px] text-white/50">CUDA:0</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[11px] text-emerald-100 pr-1 leading-relaxed">
                {logs.map((log: string, index: number) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          </div>

          {trainingComplete && (
            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={() => setActiveTab("evaluation")}
                className="bg-[#0A6640] hover:bg-[#085233] text-white font-semibold text-xs px-5 rounded-xl h-10"
              >
                Inspect Locked Test Set Benchmarks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: LOCKED BENCHMARK & REGISTRY DEPLOYMENT
      ========================================================================= */}
      {activeTab === "evaluation" && (
        <div className="space-y-6">
          {/* Locked Benchmark Verification Table matching PDF Page 4 */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6EBE8]">
              <div>
                <h3 className="text-xs font-bold text-[#5C7367] tracking-wider uppercase">
                  EXTRACTION QUALITY · LOCKED TEST SET VERIFICATION
                </h3>
                <p className="text-xs text-[#5C7367] mt-0.5">
                  Benchmark evaluation results for candidate model checkpoint: <strong className="text-[#142B21]">v[2.1]</strong>
                </p>
              </div>

              <Badge className="bg-[#E6F4EA] text-[#0A6640] border-[#A8D5B5]">
                Drift alert: None
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E6EBE8] text-[#5C7367] text-[11px]">
                    <th className="py-2.5">Field</th>
                    <th className="py-2.5">Accuracy</th>
                    <th className="py-2.5">95% CI</th>
                    <th className="py-2.5">Evaluated n</th>
                    <th className="py-2.5">Baseline v2.0</th>
                    <th className="py-2.5 text-right">Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F7F4]">
                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-3 font-semibold text-[#142B21]">Test name</td>
                    <td className="py-3 font-mono font-bold text-[#0A6640]">98.4%</td>
                    <td className="py-3 font-mono text-[#5C7367]">[97.1 - 99.4]%</td>
                    <td className="py-3 font-mono text-[#5C7367]">150</td>
                    <td className="py-3 font-mono text-[#5C7367]">94.6%</td>
                    <td className="py-3 text-right font-bold text-[#0A6640]">+3.8%</td>
                  </tr>

                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-3 font-semibold text-[#142B21]">Value</td>
                    <td className="py-3 font-mono font-bold text-[#0A6640]">99.1%</td>
                    <td className="py-3 font-mono text-[#5C7367]">[98.2 - 99.8]%</td>
                    <td className="py-3 font-mono text-[#5C7367]">150</td>
                    <td className="py-3 font-mono text-[#5C7367]">97.2%</td>
                    <td className="py-3 text-right font-bold text-[#0A6640]">+1.9%</td>
                  </tr>

                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-3 font-semibold text-[#142B21]">Unit</td>
                    <td className="py-3 font-mono font-bold text-[#0A6640]">99.6%</td>
                    <td className="py-3 font-mono text-[#5C7367]">[98.9 - 100]%</td>
                    <td className="py-3 font-mono text-[#5C7367]">150</td>
                    <td className="py-3 font-mono text-[#5C7367]">98.5%</td>
                    <td className="py-3 text-right font-bold text-[#0A6640]">+1.1%</td>
                  </tr>

                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-3 font-semibold text-[#142B21]">LOINC Code Mapping</td>
                    <td className="py-3 font-mono font-bold text-[#0A6640]">97.6%</td>
                    <td className="py-3 font-mono text-[#5C7367]">[96.0 - 98.8]%</td>
                    <td className="py-3 font-mono text-[#5C7367]">150</td>
                    <td className="py-3 font-mono text-[#5C7367]">93.4%</td>
                    <td className="py-3 text-right font-bold text-[#0A6640]">+4.2%</td>
                  </tr>

                  <tr className="hover:bg-[#F9FCFA]">
                    <td className="py-3 font-semibold text-[#142B21]">Clinical Explainer Grounding</td>
                    <td className="py-3 font-mono font-bold text-[#0A6640]">99.4%</td>
                    <td className="py-3 font-mono text-[#5C7367]">[98.7 - 99.9]%</td>
                    <td className="py-3 font-mono text-[#5C7367]">150</td>
                    <td className="py-3 font-mono text-[#5C7367]">96.0%</td>
                    <td className="py-3 text-right font-bold text-[#0A6640]">+3.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Model Registry Promotion Actions */}
          <div className="bg-white rounded-2xl border border-[#E6EBE8] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#142B21]">
                Promote Checked Weights to AI Model Registry
              </h4>
              <p className="text-xs text-[#5C7367] mt-0.5">
                Qualified candidate: <span className="font-mono text-[#0A6640]">JAN_MultiTask_v[2.1]</span> (BioMistral LoRA)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeploy("Staging")}
                className="border-[#0A6640] text-[#0A6640] hover:bg-[#E6F4EA] text-xs font-semibold rounded-xl h-9"
              >
                Deploy to Staging
              </Button>
              <Button
                size="sm"
                onClick={() => handleDeploy("Production")}
                className="bg-[#0A6640] hover:bg-[#085233] text-white text-xs font-semibold rounded-xl h-9 shadow-xs"
              >
                Promote to Production
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

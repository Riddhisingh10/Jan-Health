"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthorizedPatientRecord } from "@/doctorMockData";

interface ReasoningMessage {
  id: string;
  sender: "clinician" | "ai";
  text: string;
  timestamp: string;
  evidenceCitations?: { title: string; source: string; link: string }[];
  differentialConsiderations?: string[];
  suggestedFollowUpQuestions?: string[];
  clinicianFeedback?: "accepted" | "challenged";
}

export const DoctorClinicalReasoning: React.FC<{ patient: AuthorizedPatientRecord }> = ({ patient }) => {
  const [messages, setMessages] = useState<ReasoningMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: `Clinical reasoning assistant active for patient ${patient.name} (${patient.gender}, ${patient.age}y). I synthesize cross-report observations from 2020-2024 records to formulate clinical considerations, not definitive diagnostic claims. What differential aspects or medication interactions would you like to review?`,
      timestamp: "08:20 AM",
      evidenceCitations: [
        {
          title: "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD",
          source: "Kidney International Official Guidelines",
          link: "https://kdigo.org",
        },
        {
          title: "ACC/AHA High Blood Pressure Clinical Practice Guidelines",
          source: "Journal of the American College of Cardiology",
          link: "https://acc.org",
        },
      ],
      differentialConsiderations: [
        "ACE-i / ARB associated mild serum creatinine elevation (expected hemodynamic filtration reduction up to 20-30%).",
        "Dietary potassium excess or concealed salt-substitute (potassium chloride) ingestion.",
        "Pre-renal hypovolemia from vigorous endurance exertion prior to venipuncture.",
        "Spurious pseudohyperkalemia secondary to delayed centrifuge processing or fist clenching during phlebotomy.",
      ],
      suggestedFollowUpQuestions: [
        "Inquire regarding use of low-sodium specialty salts containing potassium chloride.",
        "Verify 24-hour hydration volume and timing relative to morning gym workouts.",
        "Confirm no recent concurrent over-the-counter NSAID use for post-exercise muscular soreness.",
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg: ReasoningMessage = {
      id: `usr-${Date.now()}`,
      sender: "clinician",
      text: inputQuery,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQ = inputQuery;
    setInputQuery("");

    setTimeout(() => {
      let reply = "";
      let considerations: string[] = [];
      let questions: string[] = [];

      if (currentQ.toLowerCase().includes("telmisartan") || currentQ.toLowerCase().includes("dose")) {
        reply = `Reviewing Telmisartan 40mg monotherapy against recent lab telemetry: Telmisartan selectively blocks AT1 receptors, dilating the efferent renal arteriole. This routinely induces a functional drop in intraglomerular pressure, explaining the rise in Creatinine to 1.60 mg/dL without parenchymal tubular injury. Hyperkalemia (5.7 mmol/L) occurs due to decreased aldosterone release.`;
        considerations = [
          "Maintain current dosage if repeat BMP within 2 weeks demonstrates stabilization below 1.70 mg/dL and potassium below 5.5 mmol/L.",
          "Consider shifting to a calcium channel blocker (e.g. Amlodipine 5mg) if hyperkalemia persists despite dietary counseling.",
        ];
        questions = [
          "Check for symptoms of muscle weakness or paresthesia indicative of acute hyperkalemic excitability.",
        ];
      } else {
        reply = `Cross-referencing authorized records for ${patient.name}: Baseline electrocardiographic telemetry is normal. Renal filtration parameters suggest mild physiological variance. No documented proteinuria on prior screening. Documented allergy to penicillin and sulfa prohibits beta-lactam and sulfonamide classes.`;
        considerations = [
          "Repeat basic metabolic panel with rapid in-clinic point-of-care analyzer to eliminate pre-analytical artifact.",
          "Order spot urine protein-to-creatinine ratio (uPCR).",
        ];
        questions = [
          "Ask patient about water intake frequency during physical training sessions.",
        ];
      }

      const aiReply: ReasoningMessage = {
        id: `ai-${Date.now() + 1}`,
        sender: "ai",
        text: reply,
        timestamp: "Just now",
        evidenceCitations: [
          {
            title: "AHA Guidelines on Renin-Angiotensin System Inhibition",
            source: "Circulation / AHA",
            link: "https://ahajournals.org",
          },
        ],
        differentialConsiderations: considerations,
        suggestedFollowUpQuestions: questions,
      };

      setMessages((prev) => [...prev, aiReply]);
    }, 500);
  };

  const handleFeedback = (msgId: string, type: "accepted" | "challenged") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, clinicianFeedback: type } : m))
    );
  };

  return (
    <div className="space-y-4">
      <Card className="border-emerald-100 bg-white shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-2 border-b border-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  AI-Assisted Clinical Reasoning & Differential Considerations
                </CardTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Augments clinical judgment · Evaluates drug-laboratory interactions · Not a diagnostic authority
                </p>
              </div>
            </div>

            <Badge variant="brand" className="text-[10px]">
              Grounded in {patient.name}'s Records
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 flex flex-col h-[520px]">
          {/* Scrollable Conversation Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${isAi ? "" : "flex-row-reverse space-x-reverse"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isAi ? "bg-emerald-600 text-white" : "bg-slate-800 text-white"
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAi
                          ? "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-sm"
                          : "bg-emerald-700 text-white rounded-tr-sm"
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Differential Considerations as possibilities, not diagnoses (Section E) */}
                      {isAi && msg.differentialConsiderations && msg.differentialConsiderations.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] space-y-1">
                          <span className="font-bold text-emerald-900 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3 text-emerald-600" />
                            Clinical Differential Considerations (For Evaluation):
                          </span>
                          <ul className="space-y-1 text-slate-700 list-disc list-inside">
                            {msg.differentialConsiderations.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Suggested Clinician Questions for Patient */}
                      {isAi && msg.suggestedFollowUpQuestions && msg.suggestedFollowUpQuestions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] space-y-1">
                          <span className="font-bold text-slate-900">
                            Suggested Patient Follow-Up Questions:
                          </span>
                          <ul className="space-y-1 text-slate-700 list-disc list-inside">
                            {msg.suggestedFollowUpQuestions.map((q, idx) => (
                              <li key={idx}>"{q}"</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Evidence Citations */}
                      {isAi && msg.evidenceCitations && (
                        <div className="mt-2 text-[10px] text-slate-500 pt-1.5 border-t border-slate-200 flex flex-wrap gap-2">
                          <span className="font-semibold text-emerald-800">References:</span>
                          {msg.evidenceCitations.map((cit, idx) => (
                            <a
                              key={idx}
                              href={cit.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                            >
                              {cit.title} <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Clinician Feedback Controls (Section E: Challenge or correct AI) */}
                      {isAi && (
                        <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                          <span className="italic">Clinician validation check:</span>
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => handleFeedback(msg.id, "accepted")}
                              className={`p-1 rounded hover:bg-emerald-100 ${
                                msg.clinicianFeedback === "accepted" ? "text-emerald-700 font-bold" : ""
                              }`}
                              title="Accept rationale"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id, "challenged")}
                              className={`p-1 rounded hover:bg-rose-100 ${
                                msg.clinicianFeedback === "challenged" ? "text-rose-700 font-bold" : ""
                              }`}
                              title="Challenge / refine rationale"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clinician Query Form */}
          <form onSubmit={handleSend} className="pt-3 border-t border-emerald-50 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a clinical reasoning question (e.g. Could Telmisartan explain the creatinine spike?)..."
              className="flex-1 px-3 py-2 border border-emerald-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-4">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

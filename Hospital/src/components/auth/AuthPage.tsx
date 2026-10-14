"use client";

import * as React from "react";
import { useState } from "react";
import { useGlobalState, UserRole } from "@/GlobalStateContext";
import {
  HeartPulse,
  User,
  Stethoscope,
  Building2,
  Lock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  KeyRound,
  IdCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const AuthPage: React.FC = () => {
  const { login, signup } = useGlobalState();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");

  // Form Fields
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [abhaId, setAbhaId] = useState<string>("91-5366-3824-6028");

  // UI State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Role metadata helper
  const roleInfo = {
    patient: {
      label: "Patient / Citizen",
      demoPhone: "1",
      demoPass: "1",
      subtext: "Rishith S Gowda · ABHA: 91-5366-3824-6028",
      icon: User,
      color: "#0A6640",
      bg: "#E6F4EA",
    },
    doctor: {
      label: "Doctor / Clinician",
      demoPhone: "2",
      demoPass: "2",
      subtext: "Dr. Evelyn Sterling, MD · Verified NMC Clinician",
      icon: Stethoscope,
      color: "#1B57A6",
      bg: "#EBF3FE",
    },
    hospital: {
      label: "Hospital Operations",
      demoPhone: "3",
      demoPass: "3",
      subtext: "Atreum Speciality Hospital Admin · Bed & Triage Ops",
      icon: Building2,
      color: "#0D7A4D",
      bg: "#D5E5DC",
    },
  };

  const handleQuickDemoLogin = (r: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    const demoCreds = {
      patient: { p: "1", pass: "1" },
      doctor: { p: "2", pass: "2" },
      hospital: { p: "3", pass: "3" },
    }[r];

    setPhone(demoCreds.p);
    setPassword(demoCreds.pass);
    setSelectedRole(r);

    setTimeout(() => {
      const res = login(demoCreds.p, demoCreds.pass, r);
      setIsLoading(false);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      if (mode === "login") {
        const res = login(phone, password, selectedRole);
        setIsLoading(false);
        if (!res.success && res.error) {
          setErrorMessage(res.error);
        }
      } else {
        const res = signup({
          name: name || (selectedRole === "patient" ? "Rishith S Gowda" : selectedRole === "doctor" ? "Dr. Evelyn Sterling" : "Hospital Admin"),
          phone,
          password,
          role: selectedRole,
          abhaId: selectedRole === "patient" ? (abhaId || "91-5366-3824-6028") : undefined,
        });
        setIsLoading(false);
        if (!res.success && res.error) {
          setErrorMessage(res.error);
        }
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F7F4] via-[#FAFDFB] to-[#E6F4EA] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background Decorative Accent */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#A8D5B5]/25 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0A6640]/10 blur-[120px]" />
      </div>

      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A6640] text-white shadow-lg shadow-[#0A6640]/20 mb-1">
            <HeartPulse className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl font-black text-[#142B21] tracking-tight">JAN HEALTH</h1>
            <Badge variant="brand" className="bg-[#E6F4EA] text-[#0A6640] border-[#A8D5B5] text-[10px]">
              ABDM Verified
            </Badge>
          </div>
          <p className="text-xs text-[#5C7367]">
            Unified National Digital Health Interface & Emergency Triage Gateway
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#D5E5DC] shadow-xl p-6 sm:p-7 space-y-5">
          {/* Sign In / Sign Up Mode Switcher */}
          <div className="flex bg-[#F2F7F4] p-1 rounded-2xl border border-[#E6EBE8]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === "login"
                  ? "bg-white text-[#0A6640] shadow-xs"
                  : "text-[#5C7367] hover:text-[#142B21]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === "signup"
                  ? "bg-white text-[#0A6640] shadow-xs"
                  : "text-[#5C7367] hover:text-[#142B21]"
              }`}
            >
              Create Account (Sign Up)
            </button>
          </div>

          {/* Role Tabs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#5C7367] uppercase tracking-wider block">
              Select Your Access Portal:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["patient", "doctor", "hospital"] as UserRole[]).map((r) => {
                const info = roleInfo[r];
                const Icon = info.icon;
                const isSelected = selectedRole === r;

                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r);
                      setErrorMessage(null);
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all text-center ${
                      isSelected
                        ? "bg-[#E6F4EA] border-[#0A6640] text-[#0A6640] shadow-xs ring-1 ring-[#0A6640]"
                        : "bg-[#FAFDFB] border-[#E6EBE8] text-[#5C7367] hover:border-[#A8D5B5]"
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[11px] font-bold leading-tight">
                      {r === "patient" ? "Patient" : r === "doctor" ? "Doctor" : "Hospital"}
                    </span>
                    <span className="text-[9px] text-[#5C7367] mt-0.5">
                      ({info.demoPhone}, {info.demoPass})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credential Hint Card */}
          <div className="bg-[#FAFDFB] p-3 rounded-2xl border border-[#E6EBE8] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#142B21]">Active Role Profile:</span>
              <span className="text-[11px] font-mono font-bold text-[#0A6640] bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#A8D5B5]">
                Phone: {roleInfo[selectedRole].demoPhone} · Pass: {roleInfo[selectedRole].demoPass}
              </span>
            </div>
            <p className="text-[11px] text-[#5C7367]">{roleInfo[selectedRole].subtext}</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 text-xs p-3 rounded-2xl flex items-start space-x-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142B21]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedRole === "patient" ? "Rishith S Gowda" : selectedRole === "doctor" ? "Dr. Evelyn Sterling" : "Hospital Admin"}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5E5DC] bg-[#FAFDFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A6640] text-[#142B21]"
                />
              </div>
            )}

            {mode === "signup" && selectedRole === "patient" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142B21] flex items-center justify-between">
                  <span>ABHA ID (Ayushman Bharat Health Account)</span>
                  <span className="text-[10px] text-[#0A6640] font-semibold">14-Digit Health ID</span>
                </label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-[#5C7367] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={abhaId}
                    onChange={(e) => setAbhaId(e.target.value)}
                    placeholder="91-5366-3824-6028"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#D5E5DC] bg-[#FAFDFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A6640] text-[#142B21] font-mono"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#142B21] flex items-center justify-between">
                <span>Phone Number</span>
                <span className="text-[10px] text-[#5C7367]">Enter &ldquo;{roleInfo[selectedRole].demoPhone}&rdquo; for {selectedRole}</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#5C7367] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={`Enter phone number (e.g. ${roleInfo[selectedRole].demoPhone})`}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#D5E5DC] bg-[#FAFDFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A6640] text-[#142B21]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#142B21] flex items-center justify-between">
                <span>Password</span>
                <span className="text-[10px] text-[#5C7367]">Enter &ldquo;{roleInfo[selectedRole].demoPass}&rdquo;</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5C7367] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={`Enter password (e.g. ${roleInfo[selectedRole].demoPass})`}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#D5E5DC] bg-[#FAFDFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A6640] text-[#142B21]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#0A6640] hover:bg-[#085233] text-white font-bold text-xs rounded-2xl shadow-md shadow-[#0A6640]/20 flex items-center justify-center space-x-2 transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying ABDM Credentials...</span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? `Sign In as ${roleInfo[selectedRole].label}` : "Complete Registration"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo 1-Click Access Section */}
          <div className="pt-3 border-t border-[#E6EBE8] space-y-2.5">
            <div className="text-[11px] font-bold text-[#5C7367] uppercase tracking-wider text-center">
              Quick 1-Click Demo Login:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("patient")}
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-[#E6F4EA] hover:bg-[#D4EDDA] border border-[#A8D5B5] text-[#0A6640] text-xs font-bold transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Patient (1/1)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("doctor")}
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-[#EBF3FE] hover:bg-[#D9E8FD] border border-[#96BFF4] text-[#1B57A6] text-xs font-bold transition-all"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor (2/2)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("hospital")}
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-[#D5E5DC] hover:bg-[#C2D8CC] border border-[#A8D5B5] text-[#142B21] text-xs font-bold transition-all"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Hospital (3/3)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="text-center text-[11px] text-[#5C7367] space-y-1">
          <div>Patient ABHA Account: <strong className="text-[#142B21]">91-5366-3824-6028</strong> (Rishith S Gowda)</div>
          <div>Compliant with National Health Authority (NHA) & Ayushman Bharat Digital Mission (ABDM).</div>
        </div>
      </div>
    </div>
  );
};

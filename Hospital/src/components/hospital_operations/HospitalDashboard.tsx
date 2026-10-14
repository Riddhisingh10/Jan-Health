"use client";

import React, { useState } from "react";
import { useGlobalState } from "@/GlobalStateContext";
import {
  Building2,
  Bed,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileBadge,
  PhoneCall,
  Activity,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Sparkles,
  Ambulance,
  Syringe,
  Layers,
  X,
  ExternalLink,
} from "lucide-react";
import { PlatformOperationsAdmin } from "./PlatformOperationsAdmin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HospitalDashboard: React.FC = () => {
  const { hospital, adjustBedCount, verifyEkyc } = useGlobalState();
  const [activeTab, setActiveTab] = useState<"operations" | "beds">("operations");
  const [showNewCitizenModal, setShowNewCitizenModal] = useState(false);
  const [newCitizenName, setNewCitizenName] = useState("");
  const [newCitizenMobile, setNewCitizenMobile] = useState("");
  const [newCitizenAadhaar, setNewCitizenAadhaar] = useState("");

  const totalBeds = hospital.beds.reduce((acc: number, b: { total: number }) => acc + b.total, 0);
  const occupiedBeds = hospital.beds.reduce((acc: number, b: { occupied: number }) => acc + b.occupied, 0);
  const occupancyPercentage = Math.round((occupiedBeds / totalBeds) * 100);

  const handleRegisterCitizen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCitizenName) return;
    const newId = `ekyc-${Date.now()}`;
    hospital.pendingEkyc.unshift({
      id: newId,
      applicantName: newCitizenName,
      aadhaarSuffix: `XXXX-${newCitizenAadhaar.slice(-4) || "8812"}`,
      mobile: newCitizenMobile || "+91 98000 00000",
      timestamp: "Just now",
      status: "Biometric Verified",
      generatedAbha: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
        1000 + Math.random() * 9000
      )}-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setShowNewCitizenModal(false);
    setNewCitizenName("");
    setNewCitizenMobile("");
    setNewCitizenAadhaar("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hospital Identity Header */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-emerald-700/20">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">{hospital.name}</h1>
              <Badge variant="brand" className="text-xs">
                NABH Accredited · Level 3 Trauma
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              HFR Registry ID: <span className="font-mono text-emerald-800 font-semibold">{hospital.registryId}</span> · {hospital.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setShowNewCitizenModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Assisted eKYC Desk
          </Button>
          <div className="text-right pl-3 border-l border-emerald-100 hidden sm:block">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Emergency Hotline</span>
            <span className="text-xs font-mono font-bold text-emerald-800">{hospital.emergencyHotline}</span>
          </div>
        </div>
      </div>

      {/* Hospital Sub-Navigation Bar matching PDF Page 4 */}
      <div className="bg-white rounded-2xl border border-[#E6EBE8] p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab("operations")}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "operations"
                ? "bg-[#0A6640] text-white shadow-xs"
                : "text-[#4A6357] hover:text-[#142B21] hover:bg-[#F2F7F4]"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Platform Operations (Page 4)</span>
          </button>

          <button
            onClick={() => setActiveTab("beds")}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "beds"
                ? "bg-[#0A6640] text-white shadow-xs"
                : "text-[#4A6357] hover:text-[#142B21] hover:bg-[#F2F7F4]"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bed Occupancy & Emergency Fleet</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Platform Operations (Exact PDF Page 4) */}
      {activeTab === "operations" && <PlatformOperationsAdmin />}

      {/* Tab 2: Hospital Beds & Emergency Resources */}
      {activeTab === "beds" && (
        <div className="space-y-6">
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-emerald-100 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">OPD Footfall Today</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{hospital.opdFootfallToday}</div>
            <p className="mt-1 text-[11px] text-emerald-700 font-medium">↑ 14% vs yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Bed Occupancy</span>
              <Bed className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{occupancyPercentage}%</div>
            <p className="mt-1 text-[11px] text-slate-500">
              {occupiedBeds} of {totalBeds} beds utilized
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">On-Duty Doctors</span>
              <Activity className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{hospital.activeDoctorsCount}</div>
            <p className="mt-1 text-[11px] text-emerald-700 font-medium">All departments covered</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Break-Glass Overrides</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {hospital.breakGlassAlerts.length} Active
            </div>
            <p className="mt-1 text-[11px] text-rose-600 font-medium">Audit recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Ward & Bed Occupancy Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bed className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-base">Ward & Bed Occupancy Management</h2>
          </div>
          <span className="text-xs text-slate-500">Live admission & discharge control</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospital.beds.map((ward: any) => {
            const pct = Math.round((ward.occupied / ward.total) * 100);
            const isCritical = pct >= 90;

            return (
              <Card key={ward.ward} className="border-emerald-100 bg-white">
                <CardHeader className="p-4 pb-2 border-b-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-900">{ward.ward}</CardTitle>
                    <Badge
                      variant={isCritical ? "destructive" : "brand"}
                      className="text-[10px]"
                    >
                      {ward.available} Available
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-3">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">
                      Occupied: <strong className="text-slate-900">{ward.occupied}</strong> / {ward.total}
                    </span>
                    <span className="font-bold text-slate-800">{pct}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCritical ? "bg-rose-500" : "bg-emerald-600"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Quick Admit / Discharge Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">Quick adjust:</span>
                    <div className="flex items-center space-x-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => adjustBedCount(ward.ward, -1)}
                        disabled={ward.occupied <= 0}
                        className="h-7 px-2 text-xs border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                        title="Discharge 1 patient"
                      >
                        <Minus className="w-3 h-3 mr-1" /> Discharge
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => adjustBedCount(ward.ward, 1)}
                        disabled={ward.occupied >= ward.total}
                        className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        title="Admit 1 patient"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Admit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Assisted eKYC & ABHA Generation Kiosk */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileBadge className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-base">Assisted eKYC & ABHA Registration Queue</h2>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNewCitizenModal(true)}
            className="text-xs border-emerald-300 text-emerald-800 bg-emerald-50/60"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Walk-in Registration
          </Button>
        </div>

        <Card className="border-emerald-100 bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-emerald-50/60 border-b border-emerald-100 text-slate-700 font-semibold">
                    <th className="p-3.5">Applicant Name</th>
                    <th className="p-3.5">Aadhaar Suffix</th>
                    <th className="p-3.5">Mobile</th>
                    <th className="p-3.5">Registered</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50">
                  {hospital.pendingEkyc.map((item: any) => (
                    <tr key={item.id} className="hover:bg-emerald-50/30">
                      <td className="p-3.5 font-bold text-slate-900">{item.applicantName}</td>
                      <td className="p-3.5 font-mono text-slate-600">{item.aadhaarSuffix}</td>
                      <td className="p-3.5 text-slate-600">{item.mobile}</td>
                      <td className="p-3.5 text-slate-500">{item.timestamp}</td>
                      <td className="p-3.5">
                        {item.status === "Created" ? (
                          <div className="flex flex-col">
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ABHA Active
                            </span>
                            <span className="font-mono text-[10px] text-slate-600">
                              {item.generatedAbha}
                            </span>
                          </div>
                        ) : item.status === "Biometric Verified" ? (
                          <Badge variant="brand" className="text-[10px]">
                            Biometric Verified
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px]">
                            Pending OTP
                          </Badge>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {item.status !== "Created" ? (
                          <Button
                            size="sm"
                            onClick={() => verifyEkyc(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-2.5 font-semibold"
                          >
                            Generate ABHA Card
                          </Button>
                        ) : (
                          <span className="text-slate-600 text-[11px] font-medium">✓ Card Issued</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Break-Glass Overrides Audit Trail & Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Emergency Overrides (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="font-bold text-slate-900 text-base">Break-Glass Overrides Audit Log</h2>
          </div>

          <div className="space-y-3">
            {hospital.breakGlassAlerts.map((bg: any) => (
              <div
                key={bg.id}
                className="p-4 bg-white rounded-xl border border-rose-200 shadow-sm text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{bg.doctorName}</span>
                    <span className="text-slate-600">accessed</span>
                    <span className="font-bold text-emerald-800">{bg.patientName}</span>
                  </div>
                  <span className="text-[10px] text-slate-600">{bg.timestamp}</span>
                </div>
                <p className="text-slate-600 italic bg-rose-50/60 p-2 rounded-lg border border-rose-100">
                  "{bg.reason}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                  <span>ABHA: <strong className="font-mono">{bg.abhaId}</strong></span>
                  <span className="text-emerald-700 font-semibold">● Ethics Audit Stream Synced</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Hospital Resources & Fleet (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center space-x-2">
            <Ambulance className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-base">Emergency Fleet & Supplies</h2>
          </div>

          <Card className="border-emerald-100 bg-white">
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center space-x-2.5">
                  <Ambulance className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="font-bold text-slate-900 block">Ambulance Fleet</span>
                    <span className="text-[11px] text-slate-500">ALS & BLS Units</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-800 text-sm">3 Standby</span>
                  <span className="text-[10px] text-slate-600 block">1 Dispatched</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center space-x-2.5">
                  <Syringe className="w-4 h-4 text-teal-700" />
                  <div>
                    <span className="font-bold text-slate-900 block">Central Blood Bank</span>
                    <span className="text-[11px] text-slate-500">Universal Donor O- & O+</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-teal-800 text-sm">18 Units O+</span>
                  <span className="text-[10px] text-emerald-700 block">6 Units O-</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center space-x-2.5">
                  <Activity className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="font-bold text-slate-900 block">Liquid Medical Oxygen (LMO)</span>
                    <span className="text-[11px] text-slate-500">Central Pressure Line</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-800 text-sm">94% Capacity</span>
                  <span className="text-[10px] text-emerald-700 block">Normal Flow</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )}

      {/* Modal: Assisted eKYC Walk-in Desk */}
      {showNewCitizenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-emerald-600" />
                Assisted ABHA Registration Desk
              </h3>
              <button
                onClick={() => setShowNewCitizenModal(false)}
                className="text-slate-500 hover:text-slate-600 text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterCitizen} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Citizen Full Name</label>
                <input
                  type="text"
                  value={newCitizenName}
                  onChange={(e) => setNewCitizenName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Aadhaar Number (12 digits)</label>
                <input
                  type="text"
                  maxLength={12}
                  value={newCitizenAadhaar}
                  onChange={(e) => setNewCitizenAadhaar(e.target.value)}
                  placeholder="XXXX XXXX 4821"
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={newCitizenMobile}
                  onChange={(e) => setNewCitizenMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewCitizenModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Verify Biometric & Queue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

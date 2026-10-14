"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Patient,
  BiomarkerMetric,
  UploadedReportItem,
  DoctorQueueItem,
  HospitalFacility,
  initialPatient,
  initialBiomarkers,
  initialDoctorQueue,
  initialHospital,
  VitalRecord,
} from "./mockDatabase";
import {
  fetchPatientFromSupabase,
  saveVitalToSupabase,
  saveReportToSupabase,
  syncPatientToSupabase,
} from "@/lib/supabaseService";

export type UserRole = "patient" | "doctor" | "hospital";
export type ViewMode = "responsive" | "flutter-mobile";

export interface AuthUser {
  name: string;
  role: UserRole;
  phone: string;
  abhaId?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  evidenceLinks?: { title: string; url: string }[];
  suggestedFollowUps?: string[];
  isClinicalDisclaimer?: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "alert";
}

interface GlobalStateContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  patient: Patient;
  updatePatientProfile: (updates: Partial<Patient>) => void;
  biomarkers: BiomarkerMetric[];
  selectedBiomarkers: string[];
  toggleBiomarkerSelection: (id: string) => void;
  clearBiomarkerSelections: () => void;
  uploadedReports: UploadedReportItem[];
  addUploadedReport: (report: UploadedReportItem) => { success: boolean; duplicate?: boolean };
  correctExtractedValue: (reportId: string, testName: string, newValue: string) => void;
  deleteReport: (reportId: string) => void;
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  addVitalRecord: (record: Omit<VitalRecord, "id" | "date">) => void;
  doctorQueue: DoctorQueueItem[];
  selectedQueueItem: DoctorQueueItem | null;
  setSelectedQueueItem: (item: DoctorQueueItem | null) => void;
  hospital: HospitalFacility;
  adjustBedCount: (ward: string, delta: number) => void;
  verifyEkyc: (ekycId: string) => void;
  triggerBreakGlass: (queueId: string, reason: string) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (query: string) => void;
  updateQueueStatus: (id: string, status: "Waiting" | "In-Consultation" | "Completed") => void;
  addPrescription: (prescription: {
    doctorName: string;
    doctorSpecialty: string;
    diagnosis: string;
    medicines: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }[];
    notes: string;
  }) => void;
  exportRequested: boolean;
  requestDataExport: () => void;
  deletionRequested: boolean;
  requestDataDeletion: () => void;
  activeClinicalDocId: string;
  setActiveClinicalDocId: (id: string) => void;
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (phone: string, password: string, explicitRole?: UserRole) => { success: boolean; error?: string };
  signup: (data: { name: string; phone: string; password: string; role: UserRole; abhaId?: string }) => { success: boolean; error?: string };
  logout: () => void;
  refreshSupabaseData: () => Promise<void>;
  isSupabaseLive: boolean;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("patient");
  const [viewMode, setViewMode] = useState<ViewMode>("responsive");
  const [patient, setPatient] = useState<Patient>(initialPatient);
  const [biomarkers, setBiomarkers] = useState<BiomarkerMetric[]>(initialBiomarkers);
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<string[]>([
    "bio-na",
    "bio-co2",
    "bio-cr",
    "bio-alb",
  ]);
  const [uploadedReports, setUploadedReports] = useState<UploadedReportItem[]>(initialPatient.uploadedReports);
  const [doctorQueue, setDoctorQueue] = useState(initialDoctorQueue);
  const [selectedQueueItem, setSelectedQueueItem] = useState<(typeof initialDoctorQueue)[0] | null>(initialDoctorQueue[0]);
  const [hospital, setHospital] = useState(initialHospital);
  const [exportRequested, setExportRequested] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [activeClinicalDocId, setActiveClinicalDocId] = useState<string>("dundamma_dka");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);

  const refreshSupabaseData = useCallback(async () => {
    try {
      const livePatient = await fetchPatientFromSupabase();
      if (livePatient) {
        setPatient(livePatient);
        if (livePatient.uploadedReports && livePatient.uploadedReports.length > 0) {
          setUploadedReports(livePatient.uploadedReports);
        }
        setIsSupabaseLive(true);
      } else {
        setIsSupabaseLive(false);
      }
    } catch (err) {
      console.warn("JAN HEALTH: Could not connect to Supabase, using local state:", err);
      setIsSupabaseLive(false);
    }
  }, []);

  useEffect(() => {
    refreshSupabaseData();
  }, [refreshSupabaseData]);

  const login = (phone: string, password: string, explicitRole?: UserRole): { success: boolean; error?: string } => {
    const p = phone.trim();
    const pw = password.trim();

    // Patient credentials: 1, 1 or 9019928883
    if (
      ((p === "1" || p === "9019928883") && (pw === "1" || pw === "9019928883")) ||
      (explicitRole === "patient" && (p === "1" || p === "9019928883") && (pw === "1" || pw === "9019928883"))
    ) {
      setRole("patient");
      setIsAuthenticated(true);
      setCurrentUser({
        name: "Rishith S Gowda",
        role: "patient",
        phone: "9019928883",
        abhaId: "91-5366-3824-6028",
      });
      return { success: true };
    }

    // Doctor credentials: 2, 2
    if ((p === "2" && pw === "2") || (explicitRole === "doctor" && p === "2" && pw === "2")) {
      setRole("doctor");
      setIsAuthenticated(true);
      setCurrentUser({
        name: "Dr. Evelyn Sterling, MD",
        role: "doctor",
        phone: "2",
      });
      return { success: true };
    }

    // Hospital credentials: 3, 3
    if ((p === "3" && pw === "3") || (explicitRole === "hospital" && p === "3" && pw === "3")) {
      setRole("hospital");
      setIsAuthenticated(true);
      setCurrentUser({
        name: "Atreum Speciality Hospital Admin",
        role: "hospital",
        phone: "3",
      });
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid credentials. Please enter Phone: 1, Password: 1 for Patient; Phone: 2, Password: 2 for Doctor; or Phone: 3, Password: 3 for Hospital.",
    };
  };

  const signup = (data: { name: string; phone: string; password: string; role: UserRole; abhaId?: string }) => {
    if (!data.phone.trim() || !data.password.trim()) {
      return { success: false, error: "Phone number and password are required." };
    }
    setRole(data.role);
    setIsAuthenticated(true);
    setCurrentUser({
      name: data.name || (data.role === "patient" ? "Rishith S Gowda" : data.role === "doctor" ? "Dr. Evelyn Sterling" : "Atreum Hospital Admin"),
      role: data.role,
      phone: data.phone,
      abhaId: data.abhaId || (data.role === "patient" ? "91-5366-3824-6028" : undefined),
    });
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      title: "Lab Sync Complete",
      message: "Comprehensive Metabolic Panel processed from Sunrise Haven Medical Center.",
      time: "Just now",
      type: "success",
    },
    {
      id: "n-2",
      title: "Upcoming Exam with Dr. Evelyn Sterling",
      message: "Friday Dec 27, 2024 at 8:20 AM EST. Health prep summary is ready.",
      time: "30m ago",
      type: "info",
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "c-1",
      sender: "ai",
      text: "Hello Arjun! I am your JAN Health AI Companion. I have analyzed your recent Comprehensive Metabolic Panel and historical lab tests. How can I help you understand your biomarkers, prepare questions for Dr. Sterling, or review trends?",
      timestamp: "8:25 AM",
      evidenceLinks: [
        { title: "National Kidney Foundation (NKF) - eGFR & Creatinine", url: "https://www.kidney.org" },
        { title: "MedlinePlus - Basic Metabolic Panel (BMP)", url: "https://medlineplus.gov" },
      ],
      suggestedFollowUps: [
        "Why is my potassium flagged at 5.7 mmol/L?",
        "What questions should I ask Dr. Sterling about creatinine?",
        "Compare my cholesterol over the last 3 years.",
      ],
      isClinicalDisclaimer: true,
    },
  ]);

  const toggleBiomarkerSelection = (id: string) => {
    setSelectedBiomarkers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 10) {
        return prev; // capped at 10 components as in screenshot
      }
      return [...prev, id];
    });
  };

  const clearBiomarkerSelections = () => {
    setSelectedBiomarkers([]);
  };

  const updatePatientProfile = (updates: Partial<Patient>) => {
    setPatient((prev) => {
      const updated = { ...prev, ...updates };
      syncPatientToSupabase(updated).catch(() => {});
      return updated;
    });
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Profile Updated",
        message: "Your personal health profile preferences and medical history were saved.",
        time: "Just now",
        type: "success",
      },
      ...prev,
    ]);
  };

  const addUploadedReport = (report: UploadedReportItem) => {
    const isDup = uploadedReports.some(
      (r) => r.fileName.toLowerCase() === report.fileName.toLowerCase() && r.reportDate === report.reportDate
    );
    if (isDup) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "Duplicate Report Detected",
          message: `The report '${report.fileName}' from ${report.reportDate} is already uploaded.`,
          time: "Just now",
          type: "warning",
        },
        ...prev,
      ]);
      return { success: false, duplicate: true };
    }

    setUploadedReports((prev) => [report, ...prev]);
    saveReportToSupabase(report, patient.id || "pat-101").catch((err) => {
      console.warn("JAN HEALTH: Failed to persist report to Supabase:", err);
    });
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Report Successfully Extracted",
        message: `${report.fileName} was processed. ${report.rawExtractedData.length} biomarkers identified.`,
        time: "Just now",
        type: "success",
      },
      ...prev,
    ]);
    return { success: true };
  };

  const correctExtractedValue = (reportId: string, testName: string, newValue: string) => {
    setUploadedReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== reportId) return rep;
        return {
          ...rep,
          rawExtractedData: rep.rawExtractedData.map((d) => {
            if (d.testName !== testName) return d;
            return {
              ...d,
              confirmedValue: newValue,
              isFlaggedUnclear: false,
              userCorrection: {
                original: d.originalPrintedValue,
                corrected: newValue,
                correctedAt: new Date().toLocaleTimeString(),
              },
            };
          }),
        };
      })
    );
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Extracted Value Corrected",
        message: `${testName} confirmed as ${newValue}. Original scan preserved for provenance audit.`,
        time: "Just now",
        type: "info",
      },
      ...prev,
    ]);
  };

  const deleteReport = (reportId: string) => {
    setUploadedReports((prev) => prev.filter((r) => r.id !== reportId));
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Report Deleted",
        message: "The report and associated extracted raw telemetry were purged.",
        time: "Just now",
        type: "info",
      },
      ...prev,
    ]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addVitalRecord = (record: Omit<VitalRecord, "id" | "date">) => {
    const newRecord: VitalRecord = {
      id: `v-${Date.now()}`,
      date: "Today, Just now",
      ...record,
    };
    setPatient((prev) => ({
      ...prev,
      vitalsHistory: [newRecord, ...prev.vitalsHistory],
    }));
    saveVitalToSupabase(newRecord, patient.id || "pat-101").catch((err) => {
      console.warn("JAN HEALTH: Failed to persist vital to Supabase:", err);
    });
  };

  const sendChatMessage = (query: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // Grounded AI medical knowledge responses based on authorized records
    setTimeout(() => {
      let replyText = "";
      let links = [
        { title: "National Institutes of Health (NIH) - Clinical Biomarkers", url: "https://nih.gov" },
        { title: "Mayo Clinic Patient Care - Metabolic Testing", url: "https://mayoclinic.org" },
      ];
      let followUps: string[] = [];

      const q = query.toLowerCase();
      if (q.includes("potassium") || q.includes("5.7")) {
        replyText =
          "Your potassium was measured at 5.7 mmol/L (standard reference range: 3.4 - 5.1 mmol/L). In isolation, an elevated potassium can be caused by minor sample hemolyzation during blood draw, high dietary intake, or medications like your prescribed Telmisartan (which can reduce potassium excretion by the kidneys). Importantly, a single reading is not a diagnosis. Be sure to ask Dr. Sterling if a repeat draw or minor dietary adjustment is recommended.";
        followUps = [
          "What foods have high potassium?",
          "How does Telmisartan affect my kidneys?",
          "Are there any symptoms I should watch for?",
        ];
      } else if (q.includes("creatinine") || q.includes("kidney") || q.includes("1.6")) {
        replyText =
          "Creatinine is a waste product from routine muscle breakdown that healthy kidneys filter out. Your level is 1.60 mg/dL (lab reference range: 0.50 - 1.20 mg/dL). While this represents a progressive increase since 2020 (when it was 0.95 mg/dL), creatinine can temporarily rise due to dehydration, intense resistance training, or blood pressure changes. It is best discussed with Dr. Sterling alongside an estimated GFR calculation.";
        followUps = [
          "Should I drink more water before my next lab?",
          "What is the difference between BUN and Creatinine?",
        ];
      } else if (q.includes("cholesterol") || q.includes("lipid") || q.includes("hdl")) {
        replyText =
          "Your Total Cholesterol is 178 mg/dL (< 200 is optimal) and your HDL ('good cholesterol') has risen from 44 mg/dL in 2020 to 52 mg/dL today. This positive multi-year trajectory reflects good cardioprotective vascular support from your walking routine.";
        followUps = [
          "What is my LDL calculated level?",
          "Do I need any heart medications?",
        ];
      } else {
        replyText =
          "Based on your verified medical records, your vital signs (BP: 116/66 mmHg, HR: 72 bpm, SpO2: 98%) are well-controlled. Your Comprehensive Metabolic Panel shows stable liver enzymes (AST: 27 U/L, ALT: 23 U/L) and normal electrolytes, with only Potassium (5.7 mmol/L) and Creatinine (1.6 mg/dL) flagged for clinical discussion. Remember that laboratory results must always be interpreted in the context of your complete physical examination.";
        followUps = [
          "Generate a pre-appointment summary for my visit.",
          "List my current documented allergies.",
        ];
      }

      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: replyText,
        timestamp: "Just now",
        evidenceLinks: links,
        suggestedFollowUps: followUps,
        isClinicalDisclaimer: true,
      };
      setChatMessages((prev) => [...prev, aiReply]);
    }, 600);
  };

  const requestDataExport = () => {
    setExportRequested(true);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Health Data Export Compiled",
        message: "Your complete longitudinal records, original reports, and provenance hashes were packaged into a FHIR/JSON archive.",
        time: "Just now",
        type: "success",
      },
      ...prev,
    ]);
  };

  const requestDataDeletion = () => {
    setDeletionRequested(true);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Account Deletion Requested",
        message: "Your request has been registered subject to statutory 7-year medical retention compliance laws.",
        time: "Just now",
        type: "warning",
      },
      ...prev,
    ]);
  };

  const adjustBedCount = (ward: string, delta: number) => {
    setHospital((prev) => ({
      ...prev,
      beds: prev.beds.map((b) => {
        if (b.ward === ward) {
          const newOccupied = Math.max(0, Math.min(b.total, b.occupied + delta));
          return { ...b, occupied: newOccupied, available: b.total - newOccupied };
        }
        return b;
      }),
    }));
  };

  const verifyEkyc = (ekycId: string) => {
    const randomAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setHospital((prev) => ({
      ...prev,
      pendingEkyc: prev.pendingEkyc.map((item) =>
        item.id === ekycId ? { ...item, status: "Created" as const, generatedAbha: randomAbha } : item
      ),
    }));
  };

  const triggerBreakGlass = (queueId: string, reason: string) => {
    setDoctorQueue((prev) =>
      prev.map((item) => (item.id === queueId ? { ...item, breakGlassActive: true } : item))
    );
  };

  const updateQueueStatus = (id: string, status: "Waiting" | "In-Consultation" | "Completed") => {
    setDoctorQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const addPrescription = (prescription: {
    doctorName: string;
    doctorSpecialty: string;
    diagnosis: string;
    medicines: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }[];
    notes: string;
  }) => {
    const newRx = {
      id: `rx-${Date.now()}`,
      date: "Today, Just now",
      ...prescription,
    };
    setPatient((prev) => ({
      ...prev,
      prescriptions: [newRx, ...prev.prescriptions],
    }));
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "e-Prescription Issued",
        message: `Dr. ${prescription.doctorName} generated a digital prescription.`,
        time: "Just now",
        type: "success",
      },
      ...prev,
    ]);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        role,
        setRole,
        viewMode,
        setViewMode,
        patient,
        updatePatientProfile,
        biomarkers,
        selectedBiomarkers,
        toggleBiomarkerSelection,
        clearBiomarkerSelections,
        uploadedReports,
        addUploadedReport,
        correctExtractedValue,
        deleteReport,
        notifications,
        dismissNotification,
        addVitalRecord,
        doctorQueue,
        selectedQueueItem,
        setSelectedQueueItem,
        hospital,
        adjustBedCount,
        verifyEkyc,
        triggerBreakGlass,
        updateQueueStatus,
        addPrescription,
        chatMessages,
        sendChatMessage,
        exportRequested,
        requestDataExport,
        deletionRequested,
        requestDataDeletion,
        activeClinicalDocId,
        setActiveClinicalDocId,
        isAuthenticated,
        currentUser,
        login,
        signup,
        logout,
        refreshSupabaseData,
        isSupabaseLive,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

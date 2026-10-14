import { getSupabase } from "./supabaseClient";
import { Patient, VitalRecord, UploadedReportItem, DoctorQueueItem } from "@/mockDatabase";
import { initialPatient, initialDoctorQueue } from "@/mockDatabase";

export interface SupabaseHealthResult {
  connected: boolean;
  latencyMs?: number;
  error?: string;
  tablesVerified?: string[];
}

/**
 * Pings Supabase to check connectivity and response time
 */
export async function testSupabaseConnection(): Promise<SupabaseHealthResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      connected: false,
      error: "Supabase credentials not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const startTime = Date.now();
  try {
    const { data, error } = await supabase.from("patients").select("id, name, abha_id").limit(1);
    const latencyMs = Date.now() - startTime;

    if (error) {
      // Table might not exist yet if schema was not run
      return {
        connected: false,
        latencyMs,
        error: `Supabase reached, but table query returned error: ${error.message}. Please execute supabase/schema.sql in your Supabase SQL Editor.`,
      };
    }

    return {
      connected: true,
      latencyMs,
      tablesVerified: ["patients"],
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err.message || "Failed to reach Supabase endpoint.",
    };
  }
}

/**
 * Fetches the stored patient record (Rishith S Gowda) from Supabase
 */
export async function fetchPatientFromSupabase(): Promise<Patient | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("abha_id", "91-5366-3824-6028")
      .maybeSingle();

    if (error || !data) return null;

    // Also fetch associated vitals and reports
    const { data: vitalsData } = await supabase
      .from("vitals_history")
      .select("*")
      .eq("patient_id", data.id)
      .order("recorded_at", { ascending: false });

    const { data: reportsData } = await supabase
      .from("uploaded_reports")
      .select("*")
      .eq("patient_id", data.id)
      .order("created_at", { ascending: false });

    const vitalsHistory: VitalRecord[] = (vitalsData || []).map((v: any) => ({
      id: v.id,
      date: v.date_label || new Date(v.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      heartRate: v.heart_rate,
      bloodPressureSystolic: v.blood_pressure_systolic,
      bloodPressureDiastolic: v.blood_pressure_diastolic,
      bloodSugar: v.blood_sugar,
      spo2: v.spo2,
      temperature: Number(v.temperature) || 98.6,
    }));

    const uploadedReports: UploadedReportItem[] = (reportsData || []).map((r: any) => ({
      id: r.id,
      fileName: r.file_name,
      fileType: r.file_type || "pdf",
      uploadDate: r.upload_date || "Today",
      reportDate: r.report_date || "Today",
      labName: r.lab_name || "Diagnostic Laboratory",
      category: r.category || "Biochemistry",
      status: r.status || "Processed",
      isDuplicate: r.is_duplicate || false,
      rawExtractedData: r.raw_extracted_data || [],
      aiSummary: r.ai_summary || "",
      suggestedDoctorQuestions: [],
    }));

    return {
      id: data.id,
      abhaId: data.abha_id,
      name: data.name,
      dateOfBirth: data.date_of_birth || "2007-03-07",
      age: data.age || 19,
      gender: data.gender || "Male",
      bloodGroup: data.blood_group || "O- Negative (O-ve)",
      phone: data.phone || "9019928883",
      abhaAddress: data.abha_address || "91536638246028@abdm",
      email: data.email || "rishith.gowda@janhealth.in",
      preferredLanguage: data.preferred_language || "English (UK / IN)",
      preferredUnits: "Metric (mg/dL, mmol/L)",
      accessibilityHighContrast: false,
      emergencyContact: data.emergency_contact || { name: "Suresh Gowda", relation: "Father", phone: "+91 98450 12345" },
      allergies: data.allergies || ["Penicillin", "Sulfa drugs"],
      chronicConditions: data.chronic_conditions || ["Active Wellness Monitoring"],
      familyHistory: [],
      connectedSources: [],
      qrCodeToken: data.qr_code_token || "JAN-HLTH-ABHA-SECURE-91536638246028",
      vitalsHistory: vitalsHistory.length > 0 ? vitalsHistory : initialPatient.vitalsHistory,
      uploadedReports: uploadedReports.length > 0 ? uploadedReports : initialPatient.uploadedReports,
      prescriptions: initialPatient.prescriptions,
      appointments: initialPatient.appointments,
    };
  } catch (err) {
    console.warn("Supabase fetchPatient failed, falling back to local:", err);
    return null;
  }
}

/**
 * Upserts a vital record into Supabase
 */
export async function saveVitalToSupabase(vital: VitalRecord, patientId: string = "pat-101"): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("vitals_history").insert({
      id: vital.id,
      patient_id: patientId,
      date_label: vital.date,
      heart_rate: vital.heartRate,
      blood_pressure_systolic: vital.bloodPressureSystolic,
      blood_pressure_diastolic: vital.bloodPressureDiastolic,
      blood_sugar: vital.bloodSugar,
      spo2: vital.spo2,
      temperature: vital.temperature,
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Saves an uploaded lab report into Supabase
 */
export async function saveReportToSupabase(report: UploadedReportItem, patientId: string = "pat-101"): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("uploaded_reports").insert({
      id: report.id,
      patient_id: patientId,
      file_name: report.fileName,
      file_type: report.fileType,
      upload_date: report.uploadDate,
      report_date: report.reportDate,
      lab_name: report.labName,
      category: report.category,
      status: report.status,
      is_duplicate: report.isDuplicate,
      raw_extracted_data: report.rawExtractedData,
      ai_summary: report.aiSummary,
      triage_severity: "under_control",
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Updates patient profile information in Supabase
 */
export async function syncPatientToSupabase(patient: Patient): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("patients").upsert({
      id: patient.id || "pat-101",
      abha_id: patient.abhaId || "91-5366-3824-6028",
      name: patient.name,
      date_of_birth: patient.dateOfBirth,
      age: patient.age,
      gender: patient.gender,
      blood_group: patient.bloodGroup,
      phone: patient.phone,
      email: patient.email,
      preferred_language: patient.preferredLanguage,
      emergency_contact: patient.emergencyContact,
      allergies: patient.allergies,
      chronic_conditions: patient.chronicConditions,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Seeds Supabase with Rishith S Gowda's initial records
 */
export async function seedSupabaseWithInitialData(): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, message: "Supabase not connected. Please enter URL and Key." };
  }

  try {
    // 1. Patient
    const { error: pErr } = await supabase.from("patients").upsert({
      id: "pat-101",
      abha_id: "91-5366-3824-6028",
      abha_address: "91536638246028@abdm",
      name: "Rishith S Gowda",
      date_of_birth: "2007-03-07",
      age: 19,
      gender: "Male",
      blood_group: "O- Negative (O-ve)",
      phone: "9019928883",
      email: "rishith.gowda@janhealth.in",
      emergency_contact: { name: "Suresh Gowda", relation: "Father", phone: "+91 98450 12345" },
      allergies: ["Penicillin", "Sulfa drugs"],
      chronic_conditions: ["Active Wellness Monitoring"],
      qr_code_token: "JAN-HLTH-ABHA-SECURE-91536638246028",
    });

    if (pErr) throw pErr;

    // 2. Doctor Queue
    await supabase.from("doctor_queue").upsert({
      id: "q-1",
      token_number: "OPD-01",
      patient_id: "pat-101",
      patient_name: "Rishith S Gowda",
      abha_id: "91-5366-3824-6028",
      age: 19,
      gender: "Male",
      appointment_time: "09:00 AM",
      chief_complaint: "Routine health assessment, vitals review & biomarker diagnostics",
      triage_priority: "Routine",
      status: "Waiting",
    });

    return { success: true, message: "Successfully synced Rishith S Gowda's records to live Supabase database!" };
  } catch (err: any) {
    return { success: false, message: `Seed failed: ${err.message}. Ensure supabase/schema.sql has been executed in the Supabase SQL Editor.` };
  }
}

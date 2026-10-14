'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  UserCheck, 
  UserPlus, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Plus, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  Calendar, 
  Activity, 
  FileText, 
  FileCheck, 
  Printer, 
  X,
  Phone,
  Mail,
  Award,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';

import { 
  HOSPITAL_FACILITIES, 
  INITIAL_PATIENTS, 
  INITIAL_STAFF, 
  INITIAL_ENCOUNTERS 
} from '../data/hospitalData';

export default function HospitalDashboardPage() {
  // Facility Selection
  const [selectedHospital, setSelectedHospital] = useState(HOSPITAL_FACILITIES[0]);

  // Active Role / Tab: 'admin' | 'doctor' | 'lab' | 'pharmacy' | 'records'
  const [activeTab, setActiveTab] = useState('admin');

  // Staff Directory State
  const [staff, setStaff] = useState(INITIAL_STAFF);

  // Active Encounter & Patients
  const [encounters, setEncounters] = useState(INITIAL_ENCOUNTERS);
  const [activePatient, setActivePatient] = useState(INITIAL_PATIENTS[0]);

  // Staff Profile Creation Modals
  const [showCreateDoctorModal, setShowCreateDoctorModal] = useState(false);
  const [showCreateLabModal, setShowCreateLabModal] = useState(false);
  const [showCreatePharmModal, setShowCreatePharmModal] = useState(false);

  // New Doctor Form State
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: 'Cardiology Consultant',
    registrationNo: '',
    department: 'Cardiology',
    opdRoom: 'Room 101',
    phone: '',
    email: ''
  });

  // New Lab Assistant Form State
  const [labForm, setLabForm] = useState({
    name: '',
    specialty: 'Biochemistry & Hematology',
    accreditationId: '',
    labRoom: 'Diagnostic Lab 1',
    phone: '',
    email: ''
  });

  // New Pharmacist Form State
  const [pharmForm, setPharmForm] = useState({
    name: '',
    licenseNo: '',
    counterLocation: 'Counter 2',
    phone: '',
    email: ''
  });

  // Doctor Clinical Form State (for Ramesh Chandra Sharma)
  const currentEncounter = encounters[0];
  const [docVitals, setDocVitals] = useState({
    bp: '128/82 mmHg',
    pulse: '72 bpm',
    temperature: '98.4 °F',
    spo2: '99%',
    weight: '72.5 kg'
  });
  const [docDiagnosis, setDocDiagnosis] = useState(currentEncounter.doctorStage.diagnosis);
  const [docNotes, setDocNotes] = useState(currentEncounter.doctorStage.doctorNotes);
  const [prescriptions, setPrescriptions] = useState(currentEncounter.doctorStage.prescriptions);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1 tab daily after breakfast');
  const [newMedDuration, setNewMedDuration] = useState('30 Days');
  const [allergyAlertBlocked, setAllergyAlertBlocked] = useState('');

  // Lab Results Form State
  const [labResults, setLabResults] = useState(currentEncounter.labStage.results);
  const [labRemarks, setLabRemarks] = useState('Specimen analyzed using automated spectrophotometry. High glucose confirmed.');

  // Pharmacy Form State
  const [pharmBatch, setPharmBatch] = useState('BATCH-2026-TEL-441');
  const [pharmNotes, setPharmNotes] = useState('Verified contraindication safety. Patient counseled on regular morning timing.');

  // Notification Banner
  const [notification, setNotification] = useState('');

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Handler: Add New Doctor Profile
  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!doctorForm.name.trim() || !doctorForm.registrationNo.trim()) return;

    const newDoc = {
      id: `DOC-00${staff.doctors.length + 1}`,
      name: doctorForm.name.startsWith('Dr.') ? doctorForm.name : `Dr. ${doctorForm.name}`,
      role: 'Doctor',
      specialty: doctorForm.specialty,
      registrationNo: doctorForm.registrationNo,
      hospital: selectedHospital.name,
      department: doctorForm.department,
      opdRoom: doctorForm.opdRoom,
      phone: doctorForm.phone || '+91 98000 00000',
      email: doctorForm.email || 'doctor@hospital.in',
      avatarBg: '#0284c7'
    };

    setStaff(prev => ({ ...prev, doctors: [...prev.doctors, newDoc] }));
    setShowCreateDoctorModal(false);
    setDoctorForm({ name: '', specialty: 'Cardiology Consultant', registrationNo: '', department: 'Cardiology', opdRoom: 'Room 101', phone: '', email: '' });
    triggerNotification(`Doctor profile for ${newDoc.name} successfully registered in ${selectedHospital.name}!`);
  };

  // Handler: Add New Lab Assistant Profile
  const handleAddLab = (e) => {
    e.preventDefault();
    if (!labForm.name.trim() || !labForm.accreditationId.trim()) return;

    const newLab = {
      id: `LAB-00${staff.labAssistants.length + 1}`,
      name: labForm.name,
      role: 'Lab Assistant',
      specialty: labForm.specialty,
      accreditationId: labForm.accreditationId,
      hospital: selectedHospital.name,
      labRoom: labForm.labRoom,
      phone: labForm.phone || '+91 98000 00000',
      email: labForm.email || 'lab@hospital.in',
      avatarBg: '#7c3aed'
    };

    setStaff(prev => ({ ...prev, labAssistants: [...prev.labAssistants, newLab] }));
    setShowCreateLabModal(false);
    setLabForm({ name: '', specialty: 'Biochemistry & Hematology', accreditationId: '', labRoom: 'Diagnostic Lab 1', phone: '', email: '' });
    triggerNotification(`Lab Assistant profile for ${newLab.name} successfully registered in ${selectedHospital.name}!`);
  };

  // Handler: Add New Pharmacist Profile
  const handleAddPharmacist = (e) => {
    e.preventDefault();
    if (!pharmForm.name.trim() || !pharmForm.licenseNo.trim()) return;

    const newPharm = {
      id: `PHARM-00${staff.pharmacists.length + 1}`,
      name: pharmForm.name,
      role: 'Pharmacist',
      licenseNo: pharmForm.licenseNo,
      hospital: selectedHospital.name,
      counterLocation: pharmForm.counterLocation,
      phone: pharmForm.phone || '+91 98000 00000',
      email: pharmForm.email || 'pharmacy@hospital.in',
      avatarBg: '#ea580c'
    };

    setStaff(prev => ({ ...prev, pharmacists: [...prev.pharmacists, newPharm] }));
    setShowCreatePharmModal(false);
    setPharmForm({ name: '', licenseNo: '', counterLocation: 'Counter 2', phone: '', email: '' });
    triggerNotification(`Pharmacist profile for ${newPharm.name} successfully registered in ${selectedHospital.name}!`);
  };

  // Doctor Stage: Add Medication with Allergy Guard
  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    // Critical Allergy Check for Ramesh Chandra Sharma!
    const lower = newMedName.toLowerCase();
    if (lower.includes('penicillin') || lower.includes('amoxicillin') || lower.includes('augmentin') || lower.includes('ampicillin')) {
      setAllergyAlertBlocked(`⚠️ BLOCKED: Patient ${activePatient.name} has a documented CRITICAL ALLERGY to Penicillin/Amoxicillin (Severe Urticaria in May 2025). This prescription has been blocked for patient safety.`);
      return;
    }

    setAllergyAlertBlocked('');
    const newMed = {
      name: newMedName,
      dosage: newMedDosage,
      duration: newMedDuration,
      instructions: 'As prescribed by doctor'
    };

    setPrescriptions(prev => [...prev, newMed]);
    setNewMedName('');
    triggerNotification(`Medication ${newMed.name} added to prescription.`);
  };

  // Doctor Stage: Submit Consultation
  const handleSaveDoctorStage = () => {
    setEncounters(prev => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        status: updated[0].labStage.completed && updated[0].pharmacyStage.completed ? 'Fully Completed' : 'In Progress',
        doctorStage: {
          ...updated[0].doctorStage,
          completed: true,
          vitals: docVitals,
          diagnosis: docDiagnosis,
          doctorNotes: docNotes,
          prescriptions: prescriptions
        }
      };
      return updated;
    });
    triggerNotification('Doctor consultation details saved and synchronized across departments!');
  };

  // Lab Stage: Update individual test value
  const handleLabValueChange = (index, value) => {
    setLabResults(prev => {
      const copy = [...prev];
      copy[index].value = value;
      // Auto-compute status
      if (copy[index].testName.includes('Sugar')) {
        const num = parseFloat(value);
        copy[index].status = num > 100 ? (num > 125 ? 'High (Diabetic Range)' : 'Borderline High (Pre-Diabetic)') : 'Normal';
        copy[index].flag = num > 100 ? 'high' : 'normal';
      } else if (copy[index].testName.includes('HbA1c')) {
        const num = parseFloat(value);
        copy[index].status = num >= 6.5 ? 'High (Diabetic)' : (num >= 5.7 ? 'Borderline High (Pre-Diabetic)' : 'Normal');
        copy[index].flag = num >= 5.7 ? 'high' : 'normal';
      }
      return copy;
    });
  };

  // Lab Stage: Complete & Verify
  const handleSaveLabStage = () => {
    setEncounters(prev => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        status: updated[0].pharmacyStage.completed ? 'Fully Completed' : 'In Progress',
        labStage: {
          completed: true,
          completedBy: staff.labAssistants[0].name,
          completedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          labRemarks: labRemarks,
          results: labResults
        }
      };
      return updated;
    });
    triggerNotification(`Lab tests verified and uploaded by ${staff.labAssistants[0].name}!`);
  };

  // Pharmacy Stage: Complete & Dispense
  const handleSavePharmacyStage = () => {
    setEncounters(prev => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        status: updated[0].doctorStage.completed && updated[0].labStage.completed ? 'Fully Completed' : 'In Progress',
        pharmacyStage: {
          completed: true,
          completedBy: staff.pharmacists[0].name,
          completedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          batchNumber: pharmBatch,
          allergyCheckPassed: true,
          pharmacistNotes: pharmNotes,
          dispensedItems: prescriptions.map(p => ({
            name: p.name,
            quantity: p.duration.includes('90') ? '90 Tablets' : '30 Units',
            status: 'Dispensed'
          }))
        }
      };
      return updated;
    });
    triggerNotification(`Medications dispensed & batch logged by ${staff.pharmacists[0].name}!`);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Top Hospital Header Bar */}
      <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="hospital-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          
          {/* Facility Brand & Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(15, 118, 110, 0.4)' }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '18px', fontWeight: '800', lineHeight: '1.2' }}>
                  {selectedHospital.name}
                </h1>
                <span style={{ fontSize: '10.5px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                  {selectedHospital.type}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                ABDM Facility ID: <strong style={{ color: '#38bdf8' }}>{selectedHospital.code}</strong> • {selectedHospital.location}
              </div>
            </div>
          </div>

          {/* Quick Hospital Switcher & Citizen Portal Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <SlidersHorizontal size={13} color="#94a3b8" />
              <select
                value={selectedHospital.id}
                onChange={(e) => {
                  const found = HOSPITAL_FACILITIES.find(h => h.id === e.target.value);
                  if (found) setSelectedHospital(found);
                }}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '12px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
              >
                {HOSPITAL_FACILITIES.map(h => (
                  <option key={h.id} value={h.id} style={{ background: '#1e293b', color: '#fff' }}>
                    Switch Facility: {h.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Switch to Citizen Portal */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: 'none',
                background: 'rgba(15, 118, 110, 0.4)',
                border: '1px solid #14b8a6',
                color: '#5eead4',
                padding: '6px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Citizen Portal (Port 3000)</span>
              <ExternalLink size={13} />
            </a>
          </div>

        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="hospital-container" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 24px', scrollbarWidth: 'none' }}>
          
          <button
            onClick={() => setActiveTab('admin')}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'admin' ? '#0f766e' : 'transparent',
              color: activeTab === 'admin' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <Users size={16} />
            <span>Staff Directory & Profiles ({staff.doctors.length + staff.labAssistants.length + staff.pharmacists.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('doctor')}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'doctor' ? '#0284c7' : 'transparent',
              color: activeTab === 'doctor' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <Stethoscope size={16} />
            <span>Doctor OPD Desk</span>
            <span style={{ fontSize: '10px', background: activeTab === 'doctor' ? 'rgba(255,255,255,0.25)' : '#e0f2fe', color: activeTab === 'doctor' ? '#fff' : '#0369a1', padding: '1px 6px', borderRadius: '10px' }}>
              Ramesh
            </span>
          </button>

          <button
            onClick={() => setActiveTab('lab')}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'lab' ? '#7c3aed' : 'transparent',
              color: activeTab === 'lab' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <FlaskConical size={16} />
            <span>Lab Assistant Desk</span>
            <span style={{ fontSize: '10px', background: activeTab === 'lab' ? 'rgba(255,255,255,0.25)' : '#ede9fe', color: activeTab === 'lab' ? '#fff' : '#6d28d9', padding: '1px 6px', borderRadius: '10px' }}>
              3 Tests
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pharmacy')}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'pharmacy' ? '#ea580c' : 'transparent',
              color: activeTab === 'pharmacy' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <Pill size={16} />
            <span>Pharmacy Dispensary Desk</span>
            <span style={{ fontSize: '10px', background: activeTab === 'pharmacy' ? 'rgba(255,255,255,0.25)' : '#ffedd5', color: activeTab === 'pharmacy' ? '#fff' : '#c2410c', padding: '1px 6px', borderRadius: '10px' }}>
              Allergy Check
            </span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              border: 'none',
              background: activeTab === 'records' ? '#0f766e' : 'transparent',
              color: activeTab === 'records' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <FileCheck size={16} />
            <span>Unified Patient Record (ABDM Sync)</span>
          </button>

        </div>
      </div>

      {/* Main Container */}
      <div className="hospital-container" style={{ marginTop: '24px' }}>
        
        {/* Floating Notification Toast */}
        {notification && (
          <div style={{ background: '#0f766e', color: '#ffffff', padding: '12px 18px', borderRadius: '14px', marginBottom: '18px', boxShadow: '0 8px 24px rgba(15, 118, 110, 0.25)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '700', animation: 'fadeIn 0.2s ease' }}>
            <CheckCircle2 size={18} color="#5eead4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Common Patient Encounter Banner (Demonstrating Collaborative upload for the SAME person) */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)', border: '1.5px solid #99f6e4', borderRadius: '20px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0f766e', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>
              R
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', background: '#0f766e', color: '#fff', padding: '2px 8px', borderRadius: '8px' }}>
                  ACTIVE ENCOUNTER
                </span>
                <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
                  {activePatient.name}
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  ({activePatient.age} Y / {activePatient.gender} • Blood Group: {activePatient.bloodGroup})
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#0f766e', marginTop: '2px', fontWeight: '600' }}>
                ABHA: <strong>{activePatient.abhaNumber}</strong> • {activePatient.abhaAddress}
              </div>
            </div>
          </div>

          {/* Critical Allergy Pill and Collaborative Pipeline status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '800', color: '#991b1b' }}>
              <AlertTriangle size={15} color="#dc2626" />
              <span>CRITICAL ALLERGY: PENICILLIN / AMOXICILLIN</span>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700', color: '#334155' }}>
              Collaborative Encounter: <strong>{currentEncounter.encounterId}</strong>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            TAB 1: HOSPITAL ADMIN & STAFF DIRECTORY
            ------------------------------------------------------------- */}
        {activeTab === 'admin' && (
          <div>
            {/* Top Stats Deck */}
            <div className="stats-grid-4" style={{ marginBottom: '24px' }}>
              
              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#0284c7', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Doctors Registered</span>
                  <Stethoscope size={20} />
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>
                  {staff.doctors.length}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Cardiology, Pathology, Family Medicine
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#7c3aed', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Lab Assistants</span>
                  <FlaskConical size={20} />
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>
                  {staff.labAssistants.length}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Biochemistry, Hematology, Imaging
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ea580c', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Pharmacists</span>
                  <Pill size={20} />
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>
                  {staff.pharmacists.length}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Licensed Dispensary Officers
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '18px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#0f766e', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Collective Encounters</span>
                  <Activity size={20} />
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>
                  {encounters.length} Active
                </div>
                <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: '700', marginTop: '4px' }}>
                  ✓ Multi-department pipeline active
                </div>
              </div>

            </div>

            {/* Action Bar: Create Profiles */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '18px 22px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Hospital Clinical Staff Provisioning
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Create verified profiles for Doctors, Lab Assistants, and Pharmacy Staff to collaborate on patient care.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowCreateDoctorModal(true)}
                  className="btn-primary"
                  style={{ padding: '9px 16px', borderRadius: '14px', fontSize: '12.5px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                >
                  <Plus size={15} />
                  <span>+ Create Doctor Profile</span>
                </button>

                <button
                  onClick={() => setShowCreateLabModal(true)}
                  className="btn-primary"
                  style={{ padding: '9px 16px', borderRadius: '14px', fontSize: '12.5px', background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}
                >
                  <Plus size={15} />
                  <span>+ Create Lab Assistant Profile</span>
                </button>

                <button
                  onClick={() => setShowCreatePharmModal(true)}
                  className="btn-primary"
                  style={{ padding: '9px 16px', borderRadius: '14px', fontSize: '12.5px', background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' }}
                >
                  <Plus size={15} />
                  <span>+ Create Pharmacist Profile</span>
                </button>
              </div>
            </div>

            {/* 3 Department Staff Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              
              {/* 1. DOCTORS DIRECTORY */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ background: '#f0f9ff', padding: '14px 18px', borderBottom: '1px solid #bae6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Stethoscope size={18} color="#0284c7" />
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0369a1' }}>
                      Registered Doctors ({staff.doctors.length})
                    </h4>
                  </div>
                  <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                    Consultants
                  </span>
                </div>

                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {staff.doctors.map(doc => (
                    <div key={doc.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-main)' }}>
                          {doc.name}
                        </div>
                        <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '6px', fontWeight: '800' }}>
                          ACTIVE OPD
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '700', marginTop: '2px' }}>
                        {doc.specialty}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Reg: <strong>{doc.registrationNo}</strong> • {doc.department} ({doc.opdRoom})
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. LAB ASSISTANTS DIRECTORY */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ background: '#f5f3ff', padding: '14px 18px', borderBottom: '1px solid #ddd6fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FlaskConical size={18} color="#7c3aed" />
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#6d28d9' }}>
                      Lab Assistants ({staff.labAssistants.length})
                    </h4>
                  </div>
                  <span style={{ fontSize: '11px', background: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                    Diagnostics
                  </span>
                </div>

                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {staff.labAssistants.map(lab => (
                    <div key={lab.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-main)' }}>
                          {lab.name}
                        </div>
                        <span style={{ fontSize: '10px', background: '#f5f3ff', color: '#7c3aed', padding: '2px 6px', borderRadius: '6px', fontWeight: '800', border: '1px solid #ddd6fe' }}>
                          NABL TECH
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#7c3aed', fontWeight: '700', marginTop: '2px' }}>
                        {lab.specialty}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Accreditation: <strong>{lab.accreditationId}</strong> • {lab.labRoom}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. PHARMACISTS DIRECTORY */}
              <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ background: '#fff7ed', padding: '14px 18px', borderBottom: '1px solid #fed7aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Pill size={18} color="#ea580c" />
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#c2410c' }}>
                      Pharmacy Staff ({staff.pharmacists.length})
                    </h4>
                  </div>
                  <span style={{ fontSize: '11px', background: '#ffedd5', color: '#c2410c', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                    Dispensary
                  </span>
                </div>

                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {staff.pharmacists.map(pharm => (
                    <div key={pharm.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-main)' }}>
                          {pharm.name}
                        </div>
                        <span style={{ fontSize: '10px', background: '#fff7ed', color: '#ea580c', padding: '2px 6px', borderRadius: '6px', fontWeight: '800', border: '1px solid #fed7aa' }}>
                          LICENSED
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#ea580c', fontWeight: '700', marginTop: '2px' }}>
                        Registered Pharmacist
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        License: <strong>{pharm.licenseNo}</strong> • {pharm.counterLocation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: DOCTOR OPD DESK
            ------------------------------------------------------------- */}
        {activeTab === 'doctor' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            
            {/* Left: Consultation Form */}
            <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                      Physician OPD Consultation
                    </h3>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Recording clinician: {staff.doctors[0].name} ({staff.doctors[0].specialty})
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: '11.5px', background: '#dcfce7', color: '#166534', fontWeight: '800', padding: '3px 8px', borderRadius: '8px' }}>
                  Encounter Active
                </span>
              </div>

              {/* Vitals Input Row */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                  Patient Vitals Recorded at OPD:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Blood Pressure</span>
                    <input
                      type="text"
                      value={docVitals.bp}
                      onChange={(e) => setDocVitals(v => ({ ...v, bp: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: '700' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Heart Rate</span>
                    <input
                      type="text"
                      value={docVitals.pulse}
                      onChange={(e) => setDocVitals(v => ({ ...v, pulse: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: '700' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Body Weight</span>
                    <input
                      type="text"
                      value={docVitals.weight}
                      onChange={(e) => setDocVitals(v => ({ ...v, weight: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: '700' }}
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Clinical Diagnosis (ICD-10 Assessment):
                </label>
                <input
                  type="text"
                  value={docDiagnosis}
                  onChange={(e) => setDocDiagnosis(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}
                />
              </div>

              {/* Physician Notes */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Clinical Examination & Physician Notes:
                </label>
                <textarea
                  rows={3}
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '12.5px', color: 'var(--text-secondary)' }}
                />
              </div>

              {/* Ordered Lab Tests Section */}
              <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6d28d9', fontWeight: '800', fontSize: '13px' }}>
                    <FlaskConical size={16} />
                    <span>Diagnostic Lab Tests Ordered by Doctor:</span>
                  </div>
                  <span style={{ fontSize: '11px', background: '#ede9fe', color: '#6d28d9', fontWeight: '800', padding: '2px 8px', borderRadius: '8px' }}>
                    Auto-routes to Lab Desk
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentEncounter.doctorStage.orderedLabTests.map((t, idx) => (
                    <div key={idx} style={{ background: '#ffffff', borderRadius: '10px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                      <span style={{ fontWeight: '700' }}>{t.testName}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Target: {t.targetRange}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Doctor Stage Button */}
              <button
                onClick={handleSaveDoctorStage}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', borderRadius: '14px', fontSize: '13px' }}
              >
                <CheckCircle2 size={16} />
                <span>Save & Sign Doctor Clinical Record</span>
              </button>
            </div>

            {/* Right: Electronic Prescriptions & Allergy Safety */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Prescriptions Box */}
              <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: '800', fontSize: '15px' }}>
                    <Pill size={18} />
                    <span>Electronic Prescriptions</span>
                  </div>
                  <span style={{ fontSize: '11px', background: '#ffedd5', color: '#c2410c', padding: '2px 8px', borderRadius: '8px', fontWeight: '700' }}>
                    {prescriptions.length} Meds
                  </span>
                </div>

                {/* Blocked Allergy Alert */}
                {allergyAlertBlocked && (
                  <div style={{ background: '#fee2e2', border: '1.5px solid #dc2626', color: '#991b1b', padding: '10px 14px', borderRadius: '12px', fontSize: '11.5px', marginBottom: '14px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontWeight: '700', lineHeight: '1.35' }}>{allergyAlertBlocked}</span>
                  </div>
                )}

                {/* Add Medicine Form */}
                <form onSubmit={handleAddMedication} style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                    + Prescribe New Medication:
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Medication name (e.g. Metformin 500mg, Telmisartan 40mg)"
                      value={newMedName}
                      onChange={(e) => { setNewMedName(e.target.value); setAllergyAlertBlocked(''); }}
                      style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 1 tab morning)"
                        value={newMedDosage}
                        onChange={(e) => setNewMedDosage(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={newMedDuration}
                        onChange={(e) => setNewMedDuration(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '12px', background: '#0284c7' }}
                    >
                      <Plus size={14} />
                      <span>Add to Patient Prescription</span>
                    </button>
                  </div>
                </form>

                {/* Current Prescriptions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {prescriptions.map((p, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '13px', color: 'var(--text-main)' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {p.dosage} • Course: <strong>{p.duration}</strong>
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', background: '#e0f2fe', color: '#0369a1', fontWeight: '800', padding: '2px 8px', borderRadius: '8px' }}>
                        Active Rx
                      </span>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: LAB ASSISTANT DESK
            ------------------------------------------------------------- */}
        {activeTab === 'lab' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FlaskConical size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
                    Diagnostic Laboratory Desk — Specimen & Test Entry
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Technician in Charge: <strong>{staff.labAssistants[0].name}</strong> ({staff.labAssistants[0].accreditationId})
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ background: currentEncounter.labStage.completed ? '#dcfce7' : '#fef3c7', color: currentEncounter.labStage.completed ? '#166534' : '#92400e', fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '10px' }}>
                  {currentEncounter.labStage.completed ? '✓ Lab Verified & Uploaded' : '● Specimen Received - Pending Entry'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              The following diagnostic tests were ordered by <strong>Dr. Rajesh Sharma</strong> for patient <strong>{activePatient.name}</strong>. Enter test parameters, numerical values, and reference normal ranges below:
            </p>

            {/* Test Values Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--text-muted)', fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Diagnostic Test</th>
                    <th style={{ padding: '12px 16px' }}>Observed Result</th>
                    <th style={{ padding: '12px 16px' }}>Unit</th>
                    <th style={{ padding: '12px 16px' }}>Standard Reference Range</th>
                    <th style={{ padding: '12px 16px' }}>Automated Status</th>
                  </tr>
                </thead>
                <tbody>
                  {labResults.map((r, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {r.testName}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <input
                          type="text"
                          value={r.value}
                          onChange={(e) => handleLabValueChange(idx, e.target.value)}
                          style={{
                            width: '110px',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: '1.5px solid',
                            borderColor: r.flag === 'high' ? '#f87171' : '#cbd5e1',
                            fontWeight: '800',
                            fontSize: '14px',
                            color: r.flag === 'high' ? '#b91c1c' : '#0f172a'
                          }}
                        />
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {r.unit}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {r.normalRange}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: r.flag === 'high' ? '#fee2e2' : '#dcfce7',
                          color: r.flag === 'high' ? '#991b1b' : '#166534'
                        }}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pathologist / Lab Technician Remarks */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                Laboratory Technician Remarks:
              </label>
              <textarea
                rows={2}
                value={labRemarks}
                onChange={(e) => setLabRemarks(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '12.5px' }}
              />
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={handleSaveLabStage}
                className="btn-primary"
                style={{ padding: '12px 24px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', fontSize: '13px' }}
              >
                <CheckCircle2 size={16} />
                <span>Upload & Sign Verified Lab Report</span>
              </button>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 4: PHARMACY DISPENSARY DESK
            ------------------------------------------------------------- */}
        {activeTab === 'pharmacy' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pill size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
                    Hospital Central Pharmacy Dispensary
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Dispensing Pharmacist: <strong>{staff.pharmacists[0].name}</strong> (License: {staff.pharmacists[0].licenseNo})
                  </span>
                </div>
              </div>

              <span style={{ background: currentEncounter.pharmacyStage.completed ? '#dcfce7' : '#ffedd5', color: currentEncounter.pharmacyStage.completed ? '#166534' : '#c2410c', fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '10px' }}>
                {currentEncounter.pharmacyStage.completed ? '✓ Medicines Dispensed & Verified' : '● Prescription Ready for Fulfillment'}
              </span>
            </div>

            {/* Allergy Cross-Verification Box */}
            <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertTriangle size={22} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#991b1b' }}>
                  Automated Pharmacist Safety Check: Drug Allergy Cross-Verification
                </div>
                <p style={{ fontSize: '12px', color: '#7f1d1d', margin: '4px 0 0', lineHeight: '1.4' }}>
                  Patient <strong>{activePatient.name}</strong> has a documented severe reaction to <strong>Penicillin & Amoxicillin</strong>. The prescribed items below have been automatically scanned against the National Formulary contraindication index.
                </p>
                <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: '800', marginTop: '6px' }}>
                  ✓ Safety Clearance: Prescribed Telmisartan 40mg, Rosuvastatin 10mg, and Vitamin B-Complex do not contain beta-lactam penicillin rings. Safe to dispense.
                </div>
              </div>
            </div>

            {/* Prescribed Items Table for Dispensing */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--text-muted)', fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Medication</th>
                    <th style={{ padding: '12px 16px' }}>Doctor's Prescribed Dosage</th>
                    <th style={{ padding: '12px 16px' }}>Duration</th>
                    <th style={{ padding: '12px 16px' }}>Dispense Quantity</th>
                    <th style={{ padding: '12px 16px' }}>Safety Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--text-main)' }}>
                        {m.name}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {m.dosage}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {m.duration}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                        {m.duration.includes('90') ? '90 Tablets' : '30 Units'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '8px' }}>
                          ✓ Cleared
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Batch & Pharmacist Notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Dispensing Batch Number:
                </label>
                <input
                  type="text"
                  value={pharmBatch}
                  onChange={(e) => setPharmBatch(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '12.5px', fontWeight: '700' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Pharmacist Patient Counseling Instructions:
                </label>
                <input
                  type="text"
                  value={pharmNotes}
                  onChange={(e) => setPharmNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '12.5px' }}
                />
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={handleSavePharmacyStage}
                className="btn-primary"
                style={{ padding: '12px 24px', borderRadius: '14px', background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', fontSize: '13px' }}
              >
                <CheckCircle2 size={16} />
                <span>Verify Allergy Clearance & Dispense Medications</span>
              </button>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 5: UNIFIED PATIENT RECORD (COLLECTIVELY UPLOADED)
            ------------------------------------------------------------- */}
        {activeTab === 'records' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
            
            {/* Header with ABDM Certification */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f1f5f9' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={22} color="#0f766e" />
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                    Integrated ABDM Clinical Encounter Record
                  </h3>
                </div>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Collectively generated by Doctor, Lab Assistant, and Pharmacist for <strong>{activePatient.name}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ background: '#dcfce7', color: '#166534', fontWeight: '800', padding: '6px 14px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} />
                  <span>Hospital Digital Signature Verified</span>
                </span>
              </div>
            </div>

            {/* 3 Department Encounter Progression Visualizer */}
            <div className="encounter-steps-grid" style={{ marginBottom: '28px' }}>
              
              {/* Step 1: Doctor */}
              <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '16px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>
                    1. CLINICIAN ASSESSMENT
                  </span>
                  <CheckCircle2 size={16} color="#0284c7" />
                </div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: '#0369a1' }}>
                  {staff.doctors[0].name}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 8px' }}>
                  {currentEncounter.doctorStage.completedAt}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Diagnosis: <strong>{docDiagnosis}</strong>
                </div>
                <div style={{ fontSize: '11.5px', color: '#0369a1', marginTop: '4px', fontWeight: '700' }}>
                  BP: {docVitals.bp} • Weight: {docVitals.weight}
                </div>
              </div>

              {/* Step 2: Lab */}
              <div style={{ background: currentEncounter.labStage.completed ? '#f5f3ff' : '#f8fafc', border: currentEncounter.labStage.completed ? '1.5px solid #ddd6fe' : '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', background: currentEncounter.labStage.completed ? '#7c3aed' : '#94a3b8', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>
                    2. DIAGNOSTIC LAB ENTRY
                  </span>
                  {currentEncounter.labStage.completed ? <CheckCircle2 size={16} color="#7c3aed" /> : <Clock size={16} color="#94a3b8" />}
                </div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: currentEncounter.labStage.completed ? '#6d28d9' : 'var(--text-muted)' }}>
                  {currentEncounter.labStage.completed ? currentEncounter.labStage.completedBy : 'Pending Lab Verification'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 8px' }}>
                  {currentEncounter.labStage.completedAt || 'Awaiting entry'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Fasting Sugar: <strong>{labResults[0].value} mg/dL</strong> ({labResults[0].status})
                </div>
                <div style={{ fontSize: '11.5px', color: '#7c3aed', marginTop: '4px', fontWeight: '700' }}>
                  HbA1c: {labResults[1].value}%
                </div>
              </div>

              {/* Step 3: Pharmacy */}
              <div style={{ background: currentEncounter.pharmacyStage.completed ? '#fff7ed' : '#f8fafc', border: currentEncounter.pharmacyStage.completed ? '1.5px solid #fed7aa' : '1.5px dashed #cbd5e1', borderRadius: '16px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', background: currentEncounter.pharmacyStage.completed ? '#ea580c' : '#94a3b8', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>
                    3. PHARMACY DISPENSING
                  </span>
                  {currentEncounter.pharmacyStage.completed ? <CheckCircle2 size={16} color="#ea580c" /> : <Clock size={16} color="#94a3b8" />}
                </div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: currentEncounter.pharmacyStage.completed ? '#c2410c' : 'var(--text-muted)' }}>
                  {currentEncounter.pharmacyStage.completed ? currentEncounter.pharmacyStage.completedBy : 'Pending Dispensing'}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 8px' }}>
                  {currentEncounter.pharmacyStage.completedAt || 'Awaiting fulfillment'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Batch: <strong>{pharmBatch}</strong>
                </div>
                <div style={{ fontSize: '11.5px', color: '#166534', marginTop: '4px', fontWeight: '700' }}>
                  ✓ Penicillin Allergy Verified Safe
                </div>
              </div>

            </div>

            {/* ABDM Upload Simulation CTA */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Push Encounter Record to National ABDM Registry
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  This encounter will be instantly visible in Ramesh Chandra Sharma's Citizen Portal at <strong>http://localhost:3000</strong>.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => triggerNotification('Clinical encounter verified and published to citizen ABHA account!')}
                  className="btn-primary"
                  style={{ padding: '10px 18px', borderRadius: '12px', fontSize: '12.5px' }}
                >
                  <Activity size={15} />
                  <span>Publish to ABHA Network</span>
                </button>
                <a
                  href="http://localhost:3000"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: '10px 16px', borderRadius: '12px', fontSize: '12.5px', textDecoration: 'none' }}
                >
                  <ExternalLink size={15} />
                  <span>Verify on Citizen Portal</span>
                </a>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* -------------------------------------------------------------
          MODALS FOR CREATING PROFILES
          ------------------------------------------------------------- */}

      {/* Modal 1: Create Doctor Profile */}
      {showCreateDoctorModal && (
        <div className="modal-overlay" onClick={() => setShowCreateDoctorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: '800', fontSize: '16px' }}>
                <Stethoscope size={20} />
                <span>Create Doctor Profile</span>
              </div>
              <button onClick={() => setShowCreateDoctorModal(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>Doctor Full Name (e.g. Dr. Rajesh Sharma)</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Full Name"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm(f => ({ ...f, name: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>Specialty</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Cardiologist"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm(f => ({ ...f, specialty: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>MCI / Medical Council Reg #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MCI-48201"
                    value={doctorForm.registrationNo}
                    onChange={(e) => setDoctorForm(f => ({ ...f, registrationNo: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology OPD"
                    value={doctorForm.department}
                    onChange={(e) => setDoctorForm(f => ({ ...f, department: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>OPD Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 204"
                    value={doctorForm.opdRoom}
                    onChange={(e) => setDoctorForm(f => ({ ...f, opdRoom: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateDoctorModal(false)} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '12.5px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '12.5px', background: '#0284c7' }}>Save Doctor Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create Lab Assistant Profile */}
      {showCreateLabModal && (
        <div className="modal-overlay" onClick={() => setShowCreateLabModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', fontWeight: '800', fontSize: '16px' }}>
                <FlaskConical size={20} />
                <span>Create Lab Assistant Profile</span>
              </div>
              <button onClick={() => setShowCreateLabModal(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddLab} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>Lab Technologist Name</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={labForm.name}
                  onChange={(e) => setLabForm(f => ({ ...f, name: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>Laboratory Specialty</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bio-Chemistry & Pathology"
                    value={labForm.specialty}
                    onChange={(e) => setLabForm(f => ({ ...f, specialty: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>NABL Accreditation ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NABL-TECH-9912"
                    value={labForm.accreditationId}
                    onChange={(e) => setLabForm(f => ({ ...f, accreditationId: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>Lab Station / Room</label>
                <input
                  type="text"
                  placeholder="e.g. Diagnostic Lab Room 201"
                  value={labForm.labRoom}
                  onChange={(e) => setLabForm(f => ({ ...f, labRoom: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateLabModal(false)} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '12.5px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '12.5px', background: '#7c3aed' }}>Save Lab Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Create Pharmacist Profile */}
      {showCreatePharmModal && (
        <div className="modal-overlay" onClick={() => setShowCreatePharmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontWeight: '800', fontSize: '16px' }}>
                <Pill size={20} />
                <span>Create Pharmacist Profile</span>
              </div>
              <button onClick={() => setShowCreatePharmModal(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddPharmacist} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>Pharmacist Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={pharmForm.name}
                  onChange={(e) => setPharmForm(f => ({ ...f, name: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>Drug License Registration #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL-PHARM-88291"
                    value={pharmForm.licenseNo}
                    onChange={(e) => setPharmForm(f => ({ ...f, licenseNo: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '4px' }}>Dispensary Counter</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Counter 3"
                    value={pharmForm.counterLocation}
                    onChange={(e) => setPharmForm(f => ({ ...f, counterLocation: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreatePharmModal(false)} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '12.5px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '12.5px', background: '#ea580c' }}>Save Pharmacist Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

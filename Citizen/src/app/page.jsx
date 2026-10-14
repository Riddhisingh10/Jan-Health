'use client';

import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  Building2, 
  User, 
  Calendar, 
  Pill, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Share2, 
  QrCode, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  Printer, 
  Languages, 
  Clock, 
  Filter, 
  Hospital,
  MapPin,
  Menu,
  X
} from 'lucide-react';

import { 
  CITIZEN_PROFILE, 
  MEDICAL_RECORDS, 
  YEARS_LIST,
  HEALTH_HISTORY_METRICS 
} from '../data/mockData';

import { RecordDetailModal } from '../components/RecordDetailModal';
import { DoctorAccessModal } from '../components/DoctorAccessModal';
import { AIChatbot } from '../components/AIChatbot';

export default function CitizensDashboardPage() {
  // Citizen session
  const [user, setUser] = useState(CITIZEN_PROFILE);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'

  // Structured Filters: Year & Hospital (Only Visited Hospitals)
  const [selectedYear, setSelectedYear] = useState('All'); // 'All' | '2026' | '2025' | ...
  const [selectedHospital, setSelectedHospital] = useState('All'); // 'All' | exact hospital name
  const [viewGrouping, setViewGrouping] = useState('hospital'); // 'hospital' | 'timeline'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Sidebar
  const [activeRecord, setActiveRecord] = useState(null);
  const [showDoctorPinModal, setShowDoctorPinModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVital, setSelectedVital] = useState('Blood Pressure (BP)');

  // Dynamically extract ONLY the hospitals this patient has visited for the selected year
  const visitedHospitalsForSelectedYear = useMemo(() => {
    const baseRecords = selectedYear === 'All' 
      ? MEDICAL_RECORDS 
      : MEDICAL_RECORDS.filter(r => r.year === selectedYear);

    const map = {};
    baseRecords.forEach(r => {
      if (!map[r.hospital]) {
        map[r.hospital] = {
          name: r.hospital,
          count: 0,
          years: new Set()
        };
      }
      map[r.hospital].count += 1;
      map[r.hospital].years.add(r.year);
    });

    return Object.values(map);
  }, [selectedYear]);

  // Handle year change and reset selected hospital if not visited in that year
  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (selectedHospital !== 'All') {
      const isVisitedInNewYear = MEDICAL_RECORDS.some(
        r => (year === 'All' || r.year === year) && r.hospital === selectedHospital
      );
      if (!isVisitedInNewYear) {
        setSelectedHospital('All');
      }
    }
  };

  // Filtered records based on Year, Hospital, and Search
  const filteredRecords = useMemo(() => {
    return MEDICAL_RECORDS.filter(record => {
      const matchesYear = selectedYear === 'All' || record.year === selectedYear;
      const matchesHospital = selectedHospital === 'All' || record.hospital === selectedHospital;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        record.title.toLowerCase().includes(q) ||
        record.doctor.toLowerCase().includes(q) ||
        record.hospital.toLowerCase().includes(q) ||
        record.diagnosis.toLowerCase().includes(q) ||
        record.year.includes(q)
      );
      return matchesYear && matchesHospital && matchesSearch;
    });
  }, [selectedYear, selectedHospital, searchQuery]);

  // Group filtered records by Hospital
  const recordsByHospital = useMemo(() => {
    const map = {};
    filteredRecords.forEach(rec => {
      if (!map[rec.hospital]) {
        map[rec.hospital] = [];
      }
      map[rec.hospital].push(rec);
    });
    return map;
  }, [filteredRecords]);

  // Counts for each year (to display in year badges)
  const countByYear = useMemo(() => {
    const counts = { All: MEDICAL_RECORDS.length };
    YEARS_LIST.forEach(y => {
      if (y !== 'All') {
        counts[y] = MEDICAL_RECORDS.filter(r => r.year === y).length;
      }
    });
    return counts;
  }, []);

  // Total visits in currently selected timeframe
  const totalVisitsInTimeframe = useMemo(() => {
    return selectedYear === 'All' 
      ? MEDICAL_RECORDS.length 
      : MEDICAL_RECORDS.filter(r => r.year === selectedYear).length;
  }, [selectedYear]);



  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '70px' }}>
      
      {/* Top Calming Teal Navigation Header */}
      <header style={{ background: 'linear-gradient(135deg, #0d5c58 0%, #0f766e 60%, #14b8a6 100%)', color: '#ffffff', padding: '24px 20px 32px', borderBottomLeftRadius: '28px', borderBottomRightRadius: '28px', boxShadow: '0 8px 24px rgba(15, 118, 110, 0.15)' }}>
        <div className="portal-desktop-container">
          
          {/* Top Bar with Brand & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                <Activity size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '19px', fontWeight: '800', lineHeight: '1.1' }}>
                  Jan Health
                </h1>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)' }}>
                  {language === 'hi' ? 'नागरिक स्वास्थ्य पोर्टल (2020 - 2026)' : 'Citizens Health Records (2020 – 2026)'}
                </span>
              </div>
            </div>

            {/* Health History Sidebar Trigger, Hospital Switcher, Language & Logout Controls */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="http://localhost:3001"
                target="_self"
                rel="noreferrer"
                title="Go to Hospital Clinical Dashboard (Port 3001)"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  border: '1.5px solid rgba(56, 189, 248, 0.4)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <Hospital size={14} color="#38bdf8" />
                <span style={{ color: '#38bdf8' }}>Hospital Dashboard (3001)</span>
                <span style={{ fontSize: '11px', opacity: 0.8 }}>↗</span>
              </a>

              <button
                onClick={() => setSidebarOpen(true)}
                title="Open Health History Sidebar"
                style={{ background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.35)', color: '#fff', padding: '6px 14px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Menu size={14} />
                <span>Health History</span>
              </button>
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button
                onClick={() => { setSelectedYear('All'); setSelectedHospital('All'); setSearchQuery(''); }}
                title="Reset Filters"
                style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Citizen Profile Card (Responsive Desktop Grid & Mobile Stack) */}
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', borderRadius: '22px', padding: '18px 22px', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <div className="header-profile-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#ffffff', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexShrink: 0 }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', lineHeight: '1.2' }}>
                    {language === 'hi' && user.nameHindi ? user.nameHindi : user.name}
                  </h2>
                  <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.95)', marginTop: '2px' }}>
                    ABHA: <strong>{user.abhaNumber || '14-8492-3847-1920'}</strong> • <span style={{ opacity: 0.9 }}>{user.age || 52} Y / {user.gender || 'Male'} • Blood: {user.bloodGroup || 'B+'}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)' }}>
                    {user.abhaAddress || 'ramesh.sharma@abdm'} • Registered Since {user.registeredYear}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#166534', fontSize: '11.5px', fontWeight: '800', padding: '4px 10px', borderRadius: '14px' }}>
                  <CheckCircle2 size={13} />
                  ABHA Active
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.2)', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.25)' }}>
                  <FileText size={12} />
                  {MEDICAL_RECORDS.length} Records
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.2)', color: '#ffffff', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.25)' }}>
                  <Building2 size={12} />
                  5 Visited Hospitals
                </span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area: Responsive Desktop & Phone Container */}
      <main className="portal-desktop-container" style={{ marginTop: '-20px' }}>

        {/* HERO DECK: 2 Columns on Desktop, 1 Column on Mobile */}
        <div className="portal-hero-deck">
          {/* Card 1: Doctor PIN Hero Card */}
          <section style={{ background: '#ffffff', borderRadius: '24px', padding: '20px', boxShadow: '0 8px 24px rgba(15, 118, 110, 0.1)', border: '1.5px solid #ccfbf1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-teal)', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'var(--primary-teal-surface)', padding: '3px 8px', borderRadius: '10px' }}>
                    {language === 'hi' ? 'दूसरे अस्पताल में डॉक्टर को दिखाएं' : 'Visiting Another Hospital?'}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
                    {language === 'hi' ? 'किसी भी नए डॉक्टर को अपने विज़िट किए गए अस्पतालों की हिस्ट्री दें' : 'Give Doctor Access to Past Medical History'}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                    {language === 'hi'
                      ? 'नए अस्पताल का डॉक्टर आपका ABHA नंबर व 4-अंकीय PIN डालकर आपके सभी विज़िट किए गए अस्पतालों के 2020-2026 के रिकॉर्ड देख सकता है।'
                      : 'Doctors at AIIMS, Fortis, Max, or Jan Seva enter your ABHA & PIN to review your complete records.'}
                  </p>
                </div>

                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-teal-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-teal)', flexShrink: 0 }}>
                  <QrCode size={26} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 14px', borderRadius: '16px', border: '1px dashed #cbd5e1', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {language === 'hi' ? 'डॉक्टर एक्सेस पिन:' : 'Doctor Access PIN:'}
                </span>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-teal-darker)', letterSpacing: '3px' }}>
                  {user.doctorPin || '8492'}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={() => setShowDoctorPinModal(true)}
                style={{ padding: '9px 16px', borderRadius: '18px', fontSize: '12.5px' }}
              >
                <Share2 size={14} />
                <span>{language === 'hi' ? 'पिन / QR कोड खोलें' : 'Show PIN / QR Code'}</span>
              </button>
            </div>
          </section>

          {/* Card 2: Live Vitals Snapshot Card */}
          <section style={{ background: '#ffffff', borderRadius: '24px', padding: '20px', boxShadow: '0 8px 24px rgba(15, 118, 110, 0.1)', border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#dcfce7', padding: '3px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Activity size={12} />
                  <span>{language === 'hi' ? 'सक्रिय वाइटल्स सारांश' : 'Live Vitals Snapshot'}</span>
                </span>
                <button
                  onClick={() => setSidebarOpen(true)}
                  style={{ border: 'none', background: 'transparent', color: 'var(--primary-teal)', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <span>{language === 'hi' ? 'विस्तृत इतिहास' : 'View Full History'}</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                {language === 'hi' ? 'रोगी के प्रमुख स्वास्थ्य संकेतक (2020-2026)' : 'Key Biometric Indicators & Trends'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.4' }}>
                {language === 'hi'
                  ? 'अस्पतालों से सत्यापित नवीनतम टेस्ट व वाइटल रीडिंग्स।'
                  : 'Verified hospital readings across Fortis, Max, AIIMS & Jan Seva Kendra.'}
              </p>

              {/* 4 Vitals Tiles Grid */}
              <div className="vitals-snapshot-grid" style={{ marginTop: '14px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>Blood Pressure</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-teal-darker)', marginTop: '2px' }}>128/82</div>
                  <div style={{ fontSize: '9.5px', color: '#166534', fontWeight: '700', marginTop: '2px' }}>✓ Controlled</div>
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '14px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '10.5px', color: '#991b1b', fontWeight: '700' }}>Blood Sugar</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#b91c1c', marginTop: '2px' }}>108 mg/dL</div>
                  <div style={{ fontSize: '9.5px', color: '#b91c1c', fontWeight: '700', marginTop: '2px' }}>▲ Pre-Diabetic</div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '700' }}>Heart Rate</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-teal-darker)', marginTop: '2px' }}>72 bpm</div>
                  <div style={{ fontSize: '9.5px', color: '#166534', fontWeight: '700', marginTop: '2px' }}>✓ Optimal</div>
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: '700' }}>Weight</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#166534', marginTop: '2px' }}>72.5 kg</div>
                  <div style={{ fontSize: '9.5px', color: '#166534', fontWeight: '700', marginTop: '2px' }}>📉 -2.7 kg Loss</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} color="var(--primary-teal)" />
                <span>Verified clinical laboratory data</span>
              </span>
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ background: 'var(--primary-teal-surface)', color: 'var(--primary-teal-darker)', border: '1px solid #99f6e4', padding: '6px 12px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
              >
                {language === 'hi' ? 'सभी 7 वाइटल्स देखें' : 'View All 7 Vitals'}
              </button>
            </div>
          </section>
        </div>

        {/* STRUCTURED CONTROLS: Yearly Filter & Visited Hospitals */}
        <section style={{ background: '#ffffff', borderRadius: '20px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
          
          {/* Header Row: Filters Title & View Mode Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
              <Filter size={16} color="var(--primary-teal)" />
              <span>{language === 'hi' ? 'रिकॉर्ड व्यवस्थापन' : 'Structured Filters'}</span>
            </div>

            {/* View Mode Toggle: Hospital-Wise vs Timeline */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '16px', padding: '3px', gap: '2px' }}>
              <button
                onClick={() => setViewGrouping('hospital')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: viewGrouping === 'hospital' ? '#ffffff' : 'transparent',
                  color: viewGrouping === 'hospital' ? 'var(--primary-teal)' : 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: viewGrouping === 'hospital' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Hospital size={12} />
                <span>{language === 'hi' ? 'अस्पताल अनुसार' : 'By Hospital'}</span>
              </button>
              <button
                onClick={() => setViewGrouping('timeline')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: viewGrouping === 'timeline' ? '#ffffff' : 'transparent',
                  color: viewGrouping === 'timeline' ? 'var(--primary-teal)' : 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: viewGrouping === 'timeline' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Clock size={12} />
                <span>{language === 'hi' ? 'वर्ष अनुसार' : 'Timeline'}</span>
              </button>
            </div>
          </div>

          {/* 1. YEAR SELECTOR (From 2020 to 2026) */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {language === 'hi' ? 'वर्ष चुनें (Year-wise):' : 'Select Year (2020 – 2026):'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--primary-teal)', fontWeight: '700' }}>
                {selectedYear === 'All' ? 'All (2020-2026)' : `Year ${selectedYear}`}
              </span>
            </div>

            {/* Horizontal Year Chips Strip */}
            <div className="filter-chips-scroll">
              {YEARS_LIST.map(yr => {
                const isSelected = selectedYear === yr;
                const count = countByYear[yr] || 0;

                return (
                  <button
                    key={yr}
                    onClick={() => handleYearChange(yr)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid',
                      borderColor: isSelected ? 'var(--primary-teal)' : '#e2e8f0',
                      background: isSelected ? 'var(--primary-teal)' : '#f8fafc',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      flexShrink: 0,
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <span>{yr === 'All' ? (language === 'hi' ? 'सभी वर्ष' : 'All Years') : yr}</span>
                    <span style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)'
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. HOSPITALS THEY HAVE VISITED ONLY (Dynamically derived from actual records) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                {language === 'hi' 
                  ? `विज़िट किए गए अस्पताल (${visitedHospitalsForSelectedYear.length}):` 
                  : `Hospitals Visited Only (${visitedHospitalsForSelectedYear.length}):`}
              </span>
              {selectedHospital !== 'All' && (
                <button
                  onClick={() => setSelectedHospital('All')}
                  style={{ border: 'none', background: 'transparent', color: 'var(--primary-teal)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Show All Visited
                </button>
              )}
            </div>

            {/* Hospital Chips - ONLY THE HOSPITALS THE PATIENT ACTUALLY VISITED */}
            <div className="filter-chips-scroll">
              {/* All Visited Hospitals Button */}
              <button
                onClick={() => setSelectedHospital('All')}
                style={{
                  padding: '7px 12px',
                  borderRadius: '14px',
                  border: '1.5px solid',
                  borderColor: selectedHospital === 'All' ? 'var(--primary-teal-darker)' : '#e2e8f0',
                  background: selectedHospital === 'All' ? 'var(--primary-teal-surface)' : '#ffffff',
                  color: selectedHospital === 'All' ? 'var(--primary-teal-darker)' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>{language === 'hi' ? 'सभी विज़िट किए गए अस्पताल' : 'All Visited Hospitals'}</span>
                <span style={{ fontSize: '10px', background: selectedHospital === 'All' ? 'var(--primary-teal)' : '#e2e8f0', color: selectedHospital === 'All' ? '#fff' : 'var(--text-muted)', padding: '1px 6px', borderRadius: '8px' }}>
                  {totalVisitsInTimeframe}
                </span>
              </button>

              {/* Dynamic list: Only hospitals visited in this timeframe */}
              {visitedHospitalsForSelectedYear.map(hosp => {
                const isSelected = selectedHospital === hosp.name;

                return (
                  <button
                    key={hosp.name}
                    onClick={() => setSelectedHospital(hosp.name)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '14px',
                      border: '1.5px solid',
                      borderColor: isSelected ? 'var(--primary-teal)' : '#e2e8f0',
                      background: isSelected ? 'var(--primary-teal)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Building2 size={12} color={isSelected ? '#ffffff' : 'var(--primary-teal)'} />
                    <span>{hosp.name}</span>
                    <span style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)'
                    }}>
                      {hosp.count} {hosp.count === 1 ? 'visit' : 'visits'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', marginTop: '14px' }}>
            <input
              type="text"
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'डॉक्टर, बीमारी, दवा या जांच खोजें...' : 'Search by doctor, diagnosis or medicine...'}
              style={{ paddingLeft: '38px', borderRadius: '14px', background: '#f8fafc', marginBottom: 0, fontSize: '13px' }}
            />
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '12px', border: 'none', background: '#e2e8f0', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px' }}
              >
                ✕
              </button>
            )}
          </div>

        </section>

        {/* RESULTS HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
              {language === 'hi' ? 'विज़िट किए गए अस्पतालों के रिकॉर्ड' : 'Visited Hospital Records'}
            </h2>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Showing {filteredRecords.length} records 
              {selectedYear !== 'All' ? ` for Year ${selectedYear}` : ' (2020–2026)'}
              {selectedHospital !== 'All' ? ` • ${selectedHospital}` : ''}
            </span>
          </div>

          {(selectedYear !== 'All' || selectedHospital !== 'All' || searchQuery) && (
            <button
              onClick={() => { setSelectedYear('All'); setSelectedHospital('All'); setSearchQuery(''); }}
              style={{ border: 'none', background: '#f1f5f9', color: 'var(--primary-teal)', fontSize: '11px', fontWeight: '700', padding: '5px 12px', borderRadius: '12px', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* VIEW 1: GROUPED BY VISITED HOSPITAL */}
        {viewGrouping === 'hospital' ? (
          Object.keys(recordsByHospital).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.entries(recordsByHospital).map(([hospitalName, hospitalRecords]) => (
                <div 
                  key={hospitalName}
                  style={{
                    background: '#ffffff',
                    borderRadius: '22px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Hospital Card Header */}
                  <div style={{ background: '#f8fafc', padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-teal-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-teal)' }}>
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-main)' }}>
                          {hospitalName}
                        </h3>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          {hospitalRecords.length} visit record{hospitalRecords.length > 1 ? 's' : ''} on file
                        </span>
                      </div>
                    </div>

                    <span style={{ fontSize: '11.5px', fontWeight: '700', background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} />
                      Visited Facility
                    </span>
                  </div>

                  {/* List of records uploaded by this hospital (Responsive 2-column grid on desktop, 1-column on mobile) */}
                  <div className="records-responsive-grid" style={{ padding: '16px' }}>
                    {hospitalRecords.map(rec => (
                      <div
                        key={rec.id}
                        onClick={() => setActiveRecord(rec)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '16px',
                          padding: '14px 16px',
                          cursor: 'pointer',
                          transition: 'var(--transition-smooth)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '800',
                              padding: '2px 7px',
                              borderRadius: '8px',
                              background: rec.type === 'Allergy Alert' ? '#fee2e2' : rec.type === 'Lab Report' ? '#e0f2fe' : '#f0fdf4',
                              color: rec.type === 'Allergy Alert' ? '#b91c1c' : rec.type === 'Lab Report' ? '#0369a1' : '#15803d',
                            }}>
                              {rec.type}
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-teal)', background: '#f0fdfa', padding: '2px 7px', borderRadius: '6px' }}>
                              Year {rec.year}
                            </span>
                          </div>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
                            {rec.date}
                          </span>
                        </div>

                        <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.3' }}>
                          {language === 'hi' && rec.titleHindi ? rec.titleHindi : rec.title}
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Doctor: <strong>{rec.doctor}</strong> ({rec.doctorSpecialty})
                        </div>

                        <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', fontSize: '11.5px', color: 'var(--text-secondary)', borderLeft: '3px solid var(--primary-teal)' }}>
                          <strong>Diagnosis:</strong> {rec.diagnosis}
                        </div>

                        {rec.medications && (
                          <div style={{ fontSize: '11.5px', color: 'var(--primary-teal-darker)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Pill size={13} color="var(--primary-teal)" />
                            <span>Prescribed: {rec.medications.map(m => m.name.split(' ')[0]).join(', ')}</span>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
                          <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary-teal)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                            <span>View Full Report</span>
                            <ChevronRight size={14} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-box">
              <Building2 size={32} color="var(--primary-teal)" style={{ margin: '0 auto 8px' }} />
              <div className="empty-state-title">No Visited Hospital Records Match Your Filter</div>
              <p className="empty-state-sub">Try selecting another year (like 2026, 2025 or All Years) or resetting filters.</p>
              <button
                className="btn-secondary"
                onClick={() => { setSelectedYear('All'); setSelectedHospital('All'); setSearchQuery(''); }}
                style={{ padding: '8px 16px', borderRadius: '16px', fontSize: '12px' }}
              >
                Reset Filters
              </button>
            </div>
          )
        ) : (
          /* VIEW 2: CHRONOLOGICAL TIMELINE (YEAR WISE) (Responsive 2-column grid on desktop, 1-column on mobile) */
          filteredRecords.length > 0 ? (
            <div className="records-responsive-grid">
              {filteredRecords.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => setActiveRecord(rec)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '18px',
                    padding: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        background: rec.type === 'Allergy Alert' ? '#fee2e2' : rec.type === 'Lab Report' ? '#e0f2fe' : '#dcfce7',
                        color: rec.type === 'Allergy Alert' ? '#b91c1c' : rec.type === 'Lab Report' ? '#0369a1' : '#15803d',
                      }}>
                        {rec.type}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-teal-darker)', background: '#ccfbf1', padding: '2px 8px', borderRadius: '8px' }}>
                        {rec.year}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {rec.date}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.3' }}>
                    {language === 'hi' && rec.titleHindi ? rec.titleHindi : rec.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: '6px 0 10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                      <Building2 size={13} color="var(--primary-teal)" />
                      <span style={{ fontWeight: '600' }}>{rec.hospital}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={13} color="var(--primary-teal)" />
                      <span>{rec.doctor} ({rec.doctorSpecialty})</span>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '12px', borderLeft: '3px solid var(--primary-teal)', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <strong>Diagnosis:</strong> {rec.diagnosis}
                  </div>

                  {rec.medications && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--primary-teal-darker)', fontWeight: '600', marginBottom: '8px' }}>
                      <Pill size={14} color="var(--primary-teal)" />
                      <span>Medicines: {rec.medications.map(m => m.name.split(' ')[0]).join(', ')}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                      Hospital Uploaded • Year {rec.year}
                    </span>
                    <span style={{ fontWeight: '700', color: 'var(--primary-teal)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <span>View Report</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-box">
              <Calendar size={32} color="var(--primary-teal)" style={{ margin: '0 auto 8px' }} />
              <div className="empty-state-title">No Records Found for {selectedYear}</div>
              <p className="empty-state-sub">Select another year or click reset to view all visited hospital records.</p>
              <button
                className="btn-secondary"
                onClick={() => { setSelectedYear('All'); setSelectedHospital('All'); setSearchQuery(''); }}
                style={{ padding: '8px 16px', borderRadius: '16px', fontSize: '12px' }}
              >
                Reset Filters
              </button>
            </div>
          )
        )}

      </main>

      {/* Record Details Modal */}
      {activeRecord && (
        <RecordDetailModal 
          record={activeRecord} 
          onClose={() => setActiveRecord(null)}
          onShowDoctorPin={() => {
            setActiveRecord(null);
            setShowDoctorPinModal(true);
          }}
          language={language}
        />
      )}

      {/* Doctor Access PIN Modal for Hospital Visits */}
      {showDoctorPinModal && (
        <DoctorAccessModal 
          user={user} 
          onClose={() => setShowDoctorPinModal(false)}
          language={language}
        />
      )}

      {/* Floating Left Edge Button for Quick Sidebar Access */}
      <button
        onClick={() => setSidebarOpen(true)}
        title="Open Health History Sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 40,
          background: 'var(--primary-teal-darker)',
          color: '#ffffff',
          border: 'none',
          borderTopRightRadius: '14px',
          borderBottomRightRadius: '14px',
          padding: '12px 6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: '700'
        }}
      >
        <Activity size={15} />
        <span style={{ writingMode: 'vertical-rl', letterSpacing: '1px' }}>
          Health History
        </span>
      </button>

      {/* HEALTH HISTORY SIDEBAR DRAWER */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(4, 47, 46, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-start',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '100%',
              background: '#ffffff',
              boxShadow: '6px 0 30px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 20px',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Top Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-teal-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-teal)' }}>
                  <Activity size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.2' }}>
                    Health History
                  </h2>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {language === 'hi' ? 'स्वास्थ्य इतिहास' : 'Patient Vital Metrics'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                title="Close sidebar"
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.4' }}>
              Select a vital measurement below to view your verified readings across hospitals.
            </p>

            {/* Health History Dropdown in the sidebar */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                {language === 'hi' ? 'माप / श्रेणी चुनें (Health History):' : 'Select Health History Vital:'}
              </label>
              <select
                className="form-input"
                value={selectedVital}
                onChange={(e) => setSelectedVital(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid var(--primary-teal)',
                  background: 'var(--primary-teal-surface)',
                  color: 'var(--primary-teal-darker)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginBottom: 0
                }}
              >
                <option value="Blood Pressure (BP)">Blood Pressure (BP)</option>
                <option value="Blood Sugar">Blood Sugar</option>
                <option value="Heart Rate">Heart Rate</option>
                <option value="SpO₂">SpO₂</option>
                <option value="Body Temperature">Body Temperature</option>
                <option value="Weight">Weight</option>
                <option value="Haemoglobin">Haemoglobin</option>
              </select>
            </div>

            {/* Corresponding Health History View: exactly 3 mock records, latest first */}
            <div>
              {/* Normal Data Reference Box */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px 14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {language === 'hi' ? 'सामान्य मानक स्तर (Normal Target)' : 'Standard Normal Range'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '8px' }}>
                    {HEALTH_HISTORY_METRICS[selectedVital]?.normalRange}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                  {HEALTH_HISTORY_METRICS[selectedVital]?.normalDescription}
                </p>
              </div>

              {/* Records Section Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
                  {selectedVital} Records
                </span>
                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--primary-teal-darker)', background: '#ccfbf1', padding: '2px 8px', borderRadius: '8px' }}>
                  3 Records (Latest First)
                </span>
              </div>

              {/* 3 Records with Variance (How much more or less than normal) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {HEALTH_HISTORY_METRICS[selectedVital]?.records.map((rec, index) => {
                  const isHigher = rec.varianceType === 'higher';

                  return (
                    <div
                      key={index}
                      style={{
                        background: index === 0 ? 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)' : '#ffffff',
                        border: index === 0 ? '1.5px solid var(--primary-teal-light)' : '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '14px',
                        boxShadow: index === 0 ? '0 4px 12px rgba(15, 118, 110, 0.08)' : '0 2px 6px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          background: index === 0 ? '#dcfce7' : '#f1f5f9',
                          color: index === 0 ? '#166534' : 'var(--text-muted)'
                        }}>
                          {index === 0 ? '● Latest Record' : `Record #${index + 1}`}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {rec.date}
                        </span>
                      </div>

                      {/* Main Reading & Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '2px' }}>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-teal-darker)' }}>
                          {rec.reading}
                        </div>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          background: isHigher ? '#fef3c7' : '#dcfce7',
                          color: isHigher ? '#92400e' : '#166534'
                        }}>
                          {rec.status}
                        </span>
                      </div>

                      {/* Variance Comparison Box: How much more or less numbers */}
                      <div style={{
                        background: isHigher ? '#fffbeb' : '#f0fdf4',
                        border: '1px solid',
                        borderColor: isHigher ? '#fde68a' : '#bbf7d0',
                        borderRadius: '10px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        color: isHigher ? '#92400e' : '#166534',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}>
                        <div style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{isHigher ? '▲ Difference:' : '✓ Variance:'}</span>
                          <span>{rec.variance}</span>
                        </div>
                        <div style={{ fontSize: '10.5px', color: isHigher ? '#b45309' : '#15803d' }}>
                          {rec.varianceLabel}
                        </div>
                      </div>

                      {/* Hospital Location */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        <Building2 size={13} color="var(--primary-teal)" />
                        <span style={{ fontWeight: '600' }}>{rec.hospital}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Verification Notice */}
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f5f9', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--primary-teal)" />
              <span>Verified clinical records from connected hospital labs.</span>
            </div>
          </aside>
        </div>
      )}

      {/* Floating Circular AI Chatbot with Trend Analysis & Doctor Alerts */}
      <AIChatbot 
        user={user}
        medicalRecords={MEDICAL_RECORDS}
        healthMetrics={HEALTH_HISTORY_METRICS}
        language={language}
        onOpenDoctorModal={() => setShowDoctorPinModal(true)}
        onViewRecord={(record) => setActiveRecord(record)}
      />

    </div>
  );
}

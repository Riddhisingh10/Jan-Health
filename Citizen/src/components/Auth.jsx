'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  CreditCard,
  User,
  Phone,
  Sparkles
} from 'lucide-react';
import { CITIZEN_PROFILE } from '../data/mockData';

export function Auth({ onLoginSuccess, language, setLanguage }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  
  // Registration / Login Inputs (ABHA - Ayushman Bharat Health Account)
  const [abhaNumber, setAbhaNumber] = useState('14-8492-3847-1920');
  const [name, setName] = useState('Ramesh Chandra Sharma');
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Format 14-digit ABHA Number (XX-XXXX-XXXX-XXXX)
  const handleAbhaChange = (e) => {
    let val = e.target.value;
    // Allow ABHA address with @abdm or format digits
    if (val.includes('@')) {
      setAbhaNumber(val.toLowerCase());
    } else {
      let raw = val.replace(/\D/g, '').slice(0, 14);
      let formatted = '';
      if (raw.length > 0) formatted += raw.slice(0, 2);
      if (raw.length > 2) formatted += '-' + raw.slice(2, 6);
      if (raw.length > 6) formatted += '-' + raw.slice(6, 10);
      if (raw.length > 10) formatted += '-' + raw.slice(10, 14);
      setAbhaNumber(formatted || raw);
    }
    setError('');
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const clean = abhaNumber.trim();
    if (!clean || clean.length < 5) {
      setError(language === 'hi' ? 'कृपया सही 14-अंकीय आभा (ABHA) नंबर या ABHA पता दर्ज करें' : 'Please enter a valid 14-digit ABHA Number or ABHA Address (@abdm)');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setError(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name');
      return;
    }

    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError(language === 'hi' ? 'गलत OTP! प्रोटोटाइप डेमो के लिए 123456 दर्ज करें' : 'Incorrect OTP! For prototype demo, use 123456');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userProfile = {
        ...CITIZEN_PROFILE,
        name: mode === 'register' ? name : CITIZEN_PROFILE.name,
        abhaNumber: abhaNumber.includes('@') ? CITIZEN_PROFILE.abhaNumber : abhaNumber,
        abhaAddress: abhaNumber.includes('@') ? abhaNumber : `${name.toLowerCase().replace(/\s+/g, '.')}@abdm`
      };
      onLoginSuccess(userProfile);
    }, 600);
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '440px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      {/* Brand Header & Language Switch */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Activity size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-teal-darker)', lineHeight: '1.1' }}>
              Jan Health
            </h1>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
              {language === 'hi' ? 'आयुष्मान भारत डिजिटल हेल्थ मिशन' : 'Ayushman Bharat Digital Health Portal'}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          style={{ border: '1px solid var(--border-subtle)', background: '#fff', padding: '5px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', color: 'var(--primary-teal)' }}
        >
          {language === 'en' ? 'हिन्दी (Hindi)' : 'English'}
        </button>
      </div>

      {/* Main Auth Card */}
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px 20px', boxShadow: '0 12px 36px rgba(15, 118, 110, 0.1)', border: '1px solid rgba(15, 118, 110, 0.15)' }}>
        
        {/* Toggle Login vs Register */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f1f5f9', padding: '4px', borderRadius: '16px', marginBottom: '20px' }}>
          <button
            onClick={() => { setMode('login'); setStep('input'); setError(''); }}
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? 'var(--primary-teal)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            {language === 'hi' ? 'ABHA से लॉगिन' : 'Log In via ABHA'}
          </button>
          <button
            onClick={() => { setMode('register'); setStep('input'); setError(''); }}
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              background: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? 'var(--primary-teal)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            {language === 'hi' ? 'नया ABHA खाता' : 'Create ABHA'}
          </button>
        </div>

        {/* ABDM Ayushman Bharat Banner */}
        <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '12px', padding: '10px 12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--primary-teal-darker)' }}>
          <Sparkles size={16} color="var(--primary-teal)" flexShrink={0} />
          <span>
            {language === 'hi' 
              ? 'आयुष्मान भारत हेल्थ अकाउंट (ABHA) आधारित लॉगिन। डेमो OTP: 123456' 
              : 'Ayushman Bharat Health Account (ABHA) Login. Demo Mock OTP: 123456'}
          </span>
        </div>

        {step === 'input' ? (
          <form onSubmit={handleSendOtp}>
            {mode === 'register' && (
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">
                  {language === 'hi' ? 'नागरिक का पूरा नाम' : 'Citizen Full Legal Name'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Sharma"
                    required
                    style={{ paddingLeft: '38px', marginBottom: 0 }}
                  />
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label className="form-label">
                {language === 'hi' ? '14-अंकीय ABHA नंबर या ABHA पता (@abdm)' : '14-Digit ABHA Number or ABHA Address (@abdm)'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={abhaNumber}
                  onChange={handleAbhaChange}
                  placeholder="e.g. 14-8492-3847-1920 or ramesh@abdm"
                  required
                  style={{ paddingLeft: '38px', marginBottom: 0, letterSpacing: '0.5px', fontWeight: '700' }}
                />
                <CreditCard size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                {language === 'hi' ? 'आयुष्मान भारत स्वास्थ्य खाता (ABHA) संख्या' : 'Ayushman Bharat Health Account (ABDM compliant)'}
              </span>
            </div>

            {mode === 'register' && (
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">
                  {language === 'hi' ? 'ABHA से जुड़ा मोबाइल नंबर' : 'Mobile Linked with ABHA'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    className="form-input"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9876543210"
                    required
                    style={{ paddingLeft: '38px', marginBottom: 0 }}
                  />
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '14px', borderRadius: '24px', fontSize: '14px', marginTop: '6px' }}
              disabled={loading}
            >
              {loading ? (
                <span>Sending ABHA OTP...</span>
              ) : (
                <>
                  <span>{language === 'hi' ? 'ABHA OTP प्राप्त करें' : 'Get ABHA Verification OTP'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Entry */
          <form onSubmit={handleVerifyOtp}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {language === 'hi' ? 'सत्यापन कोड ABHA पंजीकृत मोबाइल पर भेजा गया:' : 'Verification OTP sent to mobile linked with ABHA:'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-teal-darker)', marginTop: '2px' }}>
                {abhaNumber}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ textAlign: 'center' }}>
                {language === 'hi' ? '6-अंकीय ABHA OTP दर्ज करें (मॉक: 123456)' : 'Enter 6-Digit ABHA OTP (Mock: 123456)'}
              </label>
              <input
                type="text"
                className="form-input"
                value={otp}
                onChange={(e) => { setOtp(e.target.value.slice(0, 6)); setError(''); }}
                maxLength={6}
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '6px', fontWeight: '800', color: 'var(--primary-teal)' }}
                required
              />
            </div>

            {error && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '14px', borderRadius: '24px', fontSize: '14px' }}
              disabled={loading}
            >
              {loading ? (
                <span>Verifying ABHA...</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>{language === 'hi' ? 'सत्यापित करें एवं मेडिकल रिकॉर्ड खोलें' : 'Verify & Open Medical Records'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('input'); setError(''); }}
              style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', marginTop: '12px', cursor: 'pointer' }}
            >
              {language === 'hi' ? 'ABHA नंबर बदलें' : 'Change ABHA Number'}
            </button>
          </form>
        )}

      </div>

      {/* Trust & Privacy Notice */}
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <ShieldCheck size={16} color="var(--primary-teal)" />
        <span>
          {language === 'hi' 
            ? 'आयुष्मान भारत डिजिटल मिशन (ABDM) द्वारा सुरक्षित एवं प्रमाणित।' 
            : 'Compliant with Ayushman Bharat Digital Mission (ABDM).'}
        </span>
      </div>

    </div>
  );
}

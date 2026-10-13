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
  
  // Registration / Login Inputs
  const [aadhaar, setAadhaar] = useState('5481 9238 4819');
  const [name, setName] = useState('Ramesh Chandra Sharma');
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Format Aadhaar with spaces
  const handleAadhaarChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    let formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaar(formatted);
    setError('');
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const rawAadhaar = aadhaar.replace(/\s/g, '');
    if (rawAadhaar.length < 12) {
      setError(language === 'hi' ? 'कृपया पूरा 12 अंकों का आधार नंबर दर्ज करें' : 'Please enter valid 12-digit Aadhaar number');
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
      setError(language === 'hi' ? 'गलत OTP! डेमो के लिए 123456 दर्ज करें' : 'Incorrect OTP! For prototype demo, use 123456');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const rawAadhaar = aadhaar.replace(/\s/g, '');
      const userProfile = {
        ...CITIZEN_PROFILE,
        name: mode === 'register' ? name : CITIZEN_PROFILE.name,
        aadhaarNumber: aadhaar,
        maskedAadhaar: `XXXX-XXXX-${rawAadhaar.slice(-4)}`
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
              {language === 'hi' ? 'नागरिक स्वास्थ्य पोर्टल' : 'Citizens Medical Records'}
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
            {language === 'hi' ? 'आधार से लॉगिन' : 'Log In'}
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
            {language === 'hi' ? 'नया खाता बनाएं' : 'New Account'}
          </button>
        </div>

        {/* Demo Hint Banner */}
        <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '12px', padding: '10px 12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--primary-teal-darker)' }}>
          <Sparkles size={16} color="var(--primary-teal)" flexShrink={0} />
          <span>
            {language === 'hi' 
              ? 'मॉक डेमो: आधार नंबर और OTP (123456) पहले से भरा है।' 
              : 'Demo Mode: Aadhaar and Mock OTP (123456) are pre-filled.'}
          </span>
        </div>

        {step === 'input' ? (
          <form onSubmit={handleSendOtp}>
            {mode === 'register' && (
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">
                  {language === 'hi' ? 'नागरिक का पूरा नाम (Full Name)' : 'Citizen Full Name'}
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
                {language === 'hi' ? '12-अंकों का आधार नंबर' : '12-Digit Aadhaar Number'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={aadhaar}
                  onChange={handleAadhaarChange}
                  placeholder="XXXX XXXX XXXX"
                  required
                  style={{ paddingLeft: '38px', marginBottom: 0, letterSpacing: '1px', fontWeight: '700' }}
                />
                <CreditCard size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {mode === 'register' && (
              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">
                  {language === 'hi' ? 'मोबाइल नंबर (OTP हेतु)' : 'Mobile Number (For Verification)'}
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
                <span>Sending OTP...</span>
              ) : (
                <>
                  <span>{language === 'hi' ? 'OTP प्राप्त करें' : 'Get Verification OTP'}</span>
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
                {language === 'hi' ? 'सत्यापन कोड आधार से जुड़े मोबाइल पर भेजा गया:' : 'Verification OTP sent to mobile for Aadhaar:'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-teal-darker)', marginTop: '2px' }}>
                {aadhaar}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ textAlign: 'center' }}>
                {language === 'hi' ? '6-अंकीय OTP दर्ज करें (मॉक: 123456)' : 'Enter 6-Digit OTP (Mock: 123456)'}
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
                <span>Verifying...</span>
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
              {language === 'hi' ? 'आधार नंबर बदलें' : 'Change Aadhaar Number'}
            </button>
          </form>
        )}

      </div>

      {/* Trust & Privacy Notice */}
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <ShieldCheck size={16} color="var(--primary-teal)" />
        <span>
          {language === 'hi' 
            ? 'आपके मेडिकल रिकॉर्ड पूर्णतः सुरक्षित एवं गोपनीय हैं।' 
            : 'Your medical records are private and encrypted.'}
        </span>
      </div>

    </div>
  );
}

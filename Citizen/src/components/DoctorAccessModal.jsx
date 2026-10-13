'use client';

import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  Building2, 
  Stethoscope 
} from 'lucide-react';

export function DoctorAccessModal({ user, onClose, language }) {
  const [copied, setCopied] = useState(false);
  const [pin, setPin] = useState(user.doctorPin || '8492');

  const handleCopy = () => {
    navigator.clipboard.writeText(`Patient Health ID: ${user.healthId}, Doctor Access PIN: ${pin}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(newPin);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', textAlign: 'center' }}>
        <div className="modal-drag-handle"></div>

        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-teal-darker)', fontWeight: '800', fontSize: '15px' }}>
            <Stethoscope size={18} color="var(--primary-teal)" />
            <span>{language === 'hi' ? 'डॉक्टर / अस्पताल एक्सेस पिन' : 'Doctor Hospital Access'}</span>
          </div>
          <button 
            onClick={onClose}
            style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '13px' }}
          >
            ✕
          </button>
        </div>

        {/* Info Box */}
        <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '16px', padding: '12px 14px', marginBottom: '18px', textAlign: 'left' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-teal-darker)' }}>
            {language === 'hi' ? 'दूसरे अस्पताल में डॉक्टर को कैसे दिखाएं?' : 'Visiting a new hospital or doctor?'}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
            {language === 'hi'
              ? 'नए अस्पताल के डॉक्टर को यह पिन दिखाएं। डॉक्टर अपने कंप्यूटर में आपका हेल्थ आईडी और यह पिन डालकर आपके सभी पिछले चेकअप व रिपोर्ट देख सकेंगे।'
              : 'Show this 4-digit PIN or QR code to the doctor at the clinic. The doctor will enter it on their portal to view your complete medical history and assess your treatment.'}
          </p>
        </div>

        {/* Big PIN Display */}
        <div style={{ background: '#ffffff', border: '2px dashed var(--primary-teal)', borderRadius: '20px', padding: '20px 16px', marginBottom: '16px', boxShadow: '0 4px 16px rgba(15, 118, 110, 0.08)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {language === 'hi' ? '4-अंकीय डॉक्टर एक्सेस पिन' : '4-Digit Doctor Access PIN'}
          </div>
          
          <div style={{ fontSize: '38px', fontWeight: '800', color: 'var(--primary-teal-darker)', letterSpacing: '6px', margin: '6px 0 10px' }}>
            {pin}
          </div>

          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
            Health ID: <span style={{ color: 'var(--primary-teal)' }}>{user.healthId}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Aadhaar Ref: {user.maskedAadhaar}
          </div>

          <div style={{ margin: '16px auto 8px', display: 'inline-flex', padding: '10px', background: '#f8fafc', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
            <QrCode size={110} color="var(--primary-teal)" />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-secondary" 
            style={{ flex: 1, padding: '12px', borderRadius: '20px' }}
            onClick={handleCopy}
          >
            {copied ? <Check size={16} color="#166534" /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy ID & PIN'}</span>
          </button>

          <button 
            className="btn-secondary" 
            style={{ flex: 1, padding: '12px', borderRadius: '20px' }}
            onClick={handleRegenerate}
            title="Generate fresh PIN after your hospital visit"
          >
            <RefreshCw size={15} />
            <span>New PIN</span>
          </button>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <ShieldCheck size={13} color="var(--primary-teal)" />
          <span>Expires after consultation or can be refreshed anytime.</span>
        </div>

      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { 
  Building2, 
  Calendar, 
  User, 
  Pill, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  ChevronLeft,
  Share2
} from 'lucide-react';

export function RecordDetailModal({ record, onClose, onShowDoctorPin, language }) {
  if (!record) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-drag-handle"></div>

        {/* Header Actions */}
        <div className="modal-header-nav">
          <button className="modal-back-btn" onClick={onClose}>
            <ChevronLeft size={16} />
            <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => window.print()}
              title="Print record"
              style={{ border: '1px solid var(--border-subtle)', background: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Printer size={16} />
            </button>
            <button 
              onClick={onShowDoctorPin}
              title="Show Doctor PIN"
              style={{ border: '1px solid var(--border-subtle)', background: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary-teal)' }}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Record Type Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="record-category-badge badge-lab" style={{ background: 'var(--primary-teal-surface)', color: 'var(--primary-teal-darker)' }}>
            {record.type}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} />
            Hospital Verified
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.3', marginBottom: '14px' }}>
          {language === 'hi' && record.titleHindi ? record.titleHindi : record.title}
        </h2>

        {/* Hospital & Doctor Details */}
        <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <Building2 size={16} color="var(--primary-teal)" flexShrink={0} />
            <div>
              <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{record.hospital}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Date: {record.date}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
            <User size={16} color="var(--primary-teal)" flexShrink={0} />
            <div>
              <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{record.doctor}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{record.doctorSpecialty}</span>
            </div>
          </div>
        </div>

        {/* Diagnosis / Finding */}
        <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '14px', padding: '12px 14px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-teal-darker)', textTransform: 'uppercase' }}>
            {language === 'hi' ? 'डॉक्टर का निदान (Diagnosis)' : "Doctor's Clinical Diagnosis"}
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
            {record.diagnosis}
          </div>
          {record.bpReading && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Resting BP: <strong>{record.bpReading}</strong> • Pulse: <strong>{record.pulse}</strong>
            </div>
          )}
        </div>

        {/* Prescribed Medications */}
        {record.medications && record.medications.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Pill size={16} color="var(--primary-teal)" />
              <span>{language === 'hi' ? 'निर्धारित दवाइयां (Prescribed Medicines)' : 'Prescribed Medications'}</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {record.medications.map((med, idx) => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-teal-darker)' }}>{med.name}</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px' }}>{med.duration}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {med.dosage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lab Results Table */}
        {record.labResults && record.labResults.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} color="var(--primary-teal)" />
              <span>{language === 'hi' ? 'लैब रिपोर्ट परिणाम' : 'Laboratory Test Results'}</span>
            </h3>
            <table className="clinical-data-table">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Observed Result</th>
                  <th>Normal Range</th>
                </tr>
              </thead>
              <tbody>
                {record.labResults.map((lr, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600' }}>{lr.test}</td>
                    <td style={{ fontWeight: '700', color: lr.status.includes('Borderline') ? '#b45309' : 'var(--primary-teal-dark)' }}>
                      {lr.result}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{lr.normalRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Doctor's Advice / Notes for Future Hospitals */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
            {language === 'hi' ? 'डॉक्टर की सलाह एवं आगामी अस्पताल हेतु निर्देश:' : "Doctor's Notes & Advice for Next Hospital:"}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '12px', lineHeight: '1.5' }}>
            {record.doctorNotes}
          </p>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px', marginTop: '18px' }}>
          <button 
            className="btn-secondary"
            onClick={() => window.print()}
            style={{ borderRadius: '20px', padding: '12px' }}
          >
            <Printer size={15} />
            <span>{language === 'hi' ? 'प्रिंट / सेव PDF' : 'Print / Save PDF'}</span>
          </button>
          <button 
            className="btn-primary"
            onClick={onShowDoctorPin}
            style={{ borderRadius: '20px', padding: '12px' }}
          >
            <Share2 size={15} />
            <span>{language === 'hi' ? 'डॉक्टर को दिखाएं' : 'Show to Next Doctor'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

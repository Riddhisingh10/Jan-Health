'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  HeartPulse, 
  Stethoscope, 
  Pill, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

// Helper to format text with **bold** into clean React elements without raw asterisks
function FormattedText({ text, isAi }) {
  if (!text) return null;

  // Split lines
  const lines = text.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} style={{ height: '4px' }} />;
        }

        // Section header
        if (trimmed.startsWith('### ')) {
          return (
            <div 
              key={lIdx} 
              style={{ 
                fontWeight: '800', 
                fontSize: '13px', 
                color: isAi ? 'var(--primary-teal-darker)' : '#ffffff', 
                marginTop: lIdx === 0 ? 0 : '8px', 
                marginBottom: '2px' 
              }}
            >
              {trimmed.replace('### ', '')}
            </div>
          );
        }

        // Callout warning
        if (trimmed.startsWith('🚨 ') || trimmed.startsWith('⚠️ ')) {
          return (
            <div 
              key={lIdx} 
              style={{ 
                background: isAi ? '#fef2f2' : 'rgba(255, 255, 255, 0.2)', 
                borderLeft: isAi ? '3px solid #dc2626' : '3px solid #ffffff', 
                color: isAi ? '#991b1b' : '#ffffff', 
                padding: '6px 10px', 
                borderRadius: '8px', 
                fontWeight: '700', 
                fontSize: '12px',
                margin: '4px 0'
              }}
            >
              {renderBoldSegments(trimmed)}
            </div>
          );
        }

        // Bullet point
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          return (
            <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12.5px', marginLeft: '4px' }}>
              <span style={{ color: isAi ? 'var(--primary-teal)' : '#ffffff', fontWeight: 'bold' }}>•</span>
              <span style={{ flex: 1 }}>{renderBoldSegments(trimmed.replace(/^[-•]\s*/, ''))}</span>
            </div>
          );
        }

        // Numbered list item
        const numberedMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
        if (numberedMatch) {
          return (
            <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12.5px', marginLeft: '4px' }}>
              <span style={{ color: isAi ? 'var(--primary-teal)' : '#ffffff', fontWeight: '800', fontSize: '11px', minWidth: '16px' }}>
                {numberedMatch[1]}.
              </span>
              <span style={{ flex: 1 }}>{renderBoldSegments(numberedMatch[2])}</span>
            </div>
          );
        }

        return (
          <p key={lIdx} style={{ margin: 0, fontSize: '12.5px', lineHeight: '1.45' }}>
            {renderBoldSegments(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Helper to convert **text** into <strong>text</strong>
function renderBoldSegments(text) {
  if (!text) return text;
  const parts = text.split(/(\*\*[^*]+?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} style={{ fontWeight: '800' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function AIChatbot({ 
  user, 
  medicalRecords = [], 
  healthMetrics = {}, 
  language = 'en', 
  onOpenDoctorModal, 
  onViewRecord 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Initialize greeting on first load or language change
  useEffect(() => {
    const isHi = language === 'hi';
    const initialGreeting = isHi ? {
      id: 'welcome-hi',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `नमस्ते ${user?.name || 'रमेश जी'}! मैं आपका **आरोग्य AI स्वास्थ्य सहायक** हूँ।\n\nमैंने आपके 2020-2026 के सभी **11 मेडिकल रिकॉर्ड्स** का विश्लेषण किया है।\n\n🚨 **डॉक्टर अलर्ट: प्री-डायबिटीज स्क्रीनिंग जरूरी**\nआपका फास्टिंग ब्लड शुगर पिछले 3 सालों में **98 से बढ़कर 108 mg/dL** (HbA1c 6.4%) हो गया है। अगले 2-3 हफ्तों में **डॉ. राजेश शर्मा** (पारिवारिक चिकित्सक) को दिखाने की सलाह दी जाती है।\n\n- **ब्लड प्रेशर:** 128/82 mmHg (टेल्मिसर्टन 40mg से सामान्य नियंत्रित)\n- **सुरक्षा चेतावनी:** पेनिसिलिन / अमोक्सिसिलिन से गंभीर एलर्जी\n- **वजन ट्रेंड:** 75.2 kg से घटकर 72.5 kg (-2.7 kg सुधार)\n\nआप नीचे दिए गए विकल्पों में से चुन सकते हैं या कुछ भी पूछ सकते हैं:`,
      quickActions: [
        { label: '🩺 डॉक्टर को कब दिखाएं?', query: 'मुझे डॉक्टर से कब मिलना चाहिए?' },
        { label: '📈 शुगर और HbA1c ट्रेंड', query: 'मेरा ब्लड शुगर ट्रेंड समझाएं' },
        { label: '💓 ब्लड प्रेशर व दिल की स्थिति', query: 'मेरा ब्लड प्रेशर कैसा है?' },
        { label: '⚠️ एलर्जी व चालू दवाएं', query: 'मेरी कौन सी दवा एलर्जी है?' }
      ]
    } : {
      id: 'welcome-en',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello ${user?.name?.split(' ')[0] || 'Ramesh'}! I'm your **Aarogya AI Health Assistant**.\n\nI've analyzed your medical history (2020–2026) across AIIMS, Fortis, Max, and Jan Seva Kendra.\n\n🚨 **Doctor Alert: Pre-Diabetes Review Recommended**\nYour fasting blood sugar has risen steadily from **98 → 102 → 108 mg/dL** (HbA1c 6.4%). You should consult **Dr. Rajesh Sharma** (Family Physician) within 2–3 weeks for follow-up testing.\n\n- **Blood Pressure:** 128/82 mmHg (Well controlled on Telmisartan 40mg)\n- **Critical Allergy:** Severe reaction to Penicillin / Amoxicillin\n- **Weight Trend:** Down from 75.2 kg to 72.5 kg (-2.7 kg positive progress)\n\nAsk me anything about your records, or pick a topic below:`,
      quickActions: [
        { label: '🩺 When to see a doctor?', query: 'When should I see a doctor based on my trends?' },
        { label: '📈 Blood Sugar Trend', query: 'Analyze my blood sugar and pre-diabetes trend' },
        { label: '💓 BP & Heart History', query: 'Review my blood pressure and heart history' },
        { label: '⚠️ Allergy & Active Meds', query: 'What are my active medications and allergy warnings?' }
      ]
    };

    setMessages([initialGreeting]);
  }, [language, user]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAIResponse(query, language);
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  const generateAIResponse = (query, lang) => {
    const q = query.toLowerCase();
    const isHi = lang === 'hi' || /[\u0900-\u097F]/.test(query);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Doctor consultation advice
    if (q.includes('doctor') || q.includes('alert') || q.includes('checkup') || q.includes('डॉक्टर') || q.includes('परामर्श') || q.includes('when')) {
      if (isHi) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: time,
          text: `### 🩺 डॉक्टर परामर्श एवं अलर्ट विश्लेषण:\n\n1. **प्राथमिकता (2-3 हफ्तों में):** जन सेवा केंद्र में **डॉ. राजेश शर्मा** से मिलें। आपका फास्टिंग शुगर **108 mg/dL** व HbA1c **6.4%** आया है। फास्टिंग टेस्ट दोबारा कराएं।\n2. **कार्डियोलॉजी रूटीन (3 महीने बाद):** फोर्टिस एस्कॉर्ट्स में **डॉ. सरन मिशेल** के अनुसार आपका बीपी **128/82 mmHg** सामान्य रूप से नियंत्रित है।\n3. **सुरक्षा नियम:** किसी भी नए डॉक्टर को अपना **डॉक्टर पिन (8492)** दिखाएं ताकि वे आपकी **पेनिसिलिन एलर्जी** देख सकें।`,
          hasDoctorCTA: true,
          quickActions: [
            { label: '🔑 डॉक्टर एक्सेस पिन शेयर करें', action: 'open_pin' },
            { label: '📊 2026 शुगर रिपोर्ट देखें', action: 'view_sugar_record' }
          ]
        };
      }
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: time,
        text: `### 🩺 Doctor Consultation Advice:\n\n1. **High Priority (Within 2–3 weeks):** Consult **Dr. Rajesh Sharma** at Jan Seva Kendra. Your fasting blood glucose rose to **108 mg/dL** with HbA1c at **6.4%** (Pre-diabetic threshold).\n2. **Routine Cardiology (In ~3 months):** Dr. Saran Mitchell at Fortis confirmed BP is stable at **128/82 mmHg** on Telmisartan.\n3. **Safety Notice:** Show your **4-digit Doctor Access PIN** at clinics so they are alerted to your severe **Penicillin allergy**.`,
        hasDoctorCTA: true,
        quickActions: [
          { label: '🔑 Generate Doctor Access PIN', action: 'open_pin' },
          { label: '📄 View Sep 2026 Sugar Report', action: 'view_sugar_record' }
        ]
      };
    }

    // Blood Sugar / Diabetes
    if (q.includes('sugar') || q.includes('diabetes') || q.includes('hba1c') || q.includes('glucose') || q.includes('शुगर') || q.includes('मधुमेह')) {
      if (isHi) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: time,
          text: `### 📈 ब्लड शुगर एवं HbA1c प्रोग्रेशन (2023 - 2026):\n\n- **2023 (जन सेवा):** 98 mg/dL (सामान्य)\n- **2025 (मैक्स हॉस्पिटल):** 102 mg/dL (हल्का बढ़ा)\n- **2026 (जन सेवा):** **108 mg/dL** (फास्टिंग) | **HbA1c: 6.4%**\n\n**निष्कर्ष:** आप प्री-डायबिटीज श्रेणी में हैं। मीठा व मैदे का सेवन सीमित करें, रोजाना 30 मिनट तेज चलें और डॉ. राजेश शर्मा से फॉलो-अप लें।`,
          quickActions: [
            { label: '🩺 डॉक्टर सलाह देखें', query: 'मुझे डॉक्टर से कब मिलना चाहिए?' },
            { label: '🥗 प्री-डायबिटीज आहार', query: 'प्री-डायबिटीज के लिए क्या खाना चाहिए?' }
          ]
        };
      }
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: time,
        text: `### 📈 Blood Sugar & HbA1c Progression:\n\n- **Aug 2023:** 98 mg/dL *(Optimal)*\n- **Nov 2025:** 102 mg/dL *(Slightly Elevated)*\n- **Sep 2026:** **108 mg/dL** *(Borderline High)* | **HbA1c: 6.4%**\n\n**Assessment:** An upward climb of +10 mg/dL over 3 years places you in the Pre-Diabetes bracket (Normal is 70–99 mg/dL).\n\n**Next Steps:** Reduce refined carbs, walk 30 mins daily, and repeat fasting blood sugar test within 3 weeks.`,
        quickActions: [
          { label: '🩺 When should I see doctor?', query: 'When should I see a doctor based on my trends?' },
          { label: '🥗 Diet for Pre-Diabetes', query: 'What diet is recommended for pre-diabetes?' }
        ]
      };
    }

    // Blood Pressure & Cardiology
    if (q.includes('pressure') || q.includes('bp') || q.includes('heart') || q.includes('cardio') || q.includes('बीपी') || q.includes('हृदय')) {
      if (isHi) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: time,
          text: `### 💓 ब्लड प्रेशर और हृदय स्वास्थ्य:\n\n- **14 अक्टूबर 2026 (फोर्टिस):** 128/82 mmHg *(नियंत्रित)*\n- **18 नवम्बर 2025 (मैक्स):** 130/84 mmHg\n- **04 फरवरी 2024 (फोर्टिस):** 126/80 mmHg | TMT व 2D Echo सामान्य\n\n**सक्रिय दवाएं:** Telmisartan 40mg (सुबह) + Rosuvastatin 10mg (रात)।\nबीपी सामान्य सीमा में है। यदि सिस्टोलिक 140 से ऊपर जाए तो डॉक्टर से संपर्क करें।`,
          quickActions: [
            { label: '💊 सक्रिय दवाएं देखें', query: 'मेरी सक्रिय दवाएं कौन सी हैं?' }
          ]
        };
      }
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: time,
        text: `### 💓 Blood Pressure & Heart Health Trends:\n\n- **Oct 2026:** 128/82 mmHg *(Well Controlled)*\n- **Nov 2025:** 130/84 mmHg\n- **Feb 2024:** 126/80 mmHg | TMT Stress Test Negative | LVEF 60%\n\n**Active Medications:** Telmisartan 40mg (morning) + Rosuvastatin 10mg (bedtime).\nYour cardiovascular profile is stable. Continue daily walking and low-salt diet.`,
        quickActions: [
          { label: '💊 Check Active Meds', query: 'What are my active medications and allergy warnings?' }
        ]
      };
    }

    // Allergy & Meds
    if (q.includes('allergy') || q.includes('medicine') || q.includes('medication') || q.includes('penicillin') || q.includes('एलर्जी') || q.includes('दवा')) {
      if (isHi) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: time,
          text: `### ⚠️ गंभीर एलर्जी एवं दवाएं:\n\n🚨 **पेनिसिलिन से गंभीर एलर्जी (मई 2025):**\n- अमोक्सिसिलिन से चेहरे पर सूजन और पित्ती हुई थी। पेनिसिलिन परिवार की कोई दवा न लें।\n\n### 💊 चालू दवाएं (2026):\n1. **Telmisartan 40mg:** 1 गोली सुबह नाश्ते के बाद (बीपी)\n2. **Rosuvastatin 10mg:** 1 गोली रात को सोते समय (कोलेस्ट्रॉल)\n3. **Vitamin B-Complex + D3:** 1 कैप्सूल दोपहर को`,
          quickActions: [
            { label: '🔑 डॉक्टर एक्सेस पिन', action: 'open_pin' }
          ]
        };
      }
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: time,
        text: `### ⚠️ Critical Allergy & Medication Warning:\n\n🚨 **DOCUMENTED DRUG ALLERGY — PENICILLIN**\n- **Event:** May 2025 at Jan Seva Kendra. Severe hives & facial rash with Amoxicillin.\n- **Warning:** Strictly avoid Amoxicillin, Ampicillin, or Penicillin antibiotics.\n\n### 💊 Current Prescriptions (Oct 2026):\n1. **Telmisartan 40mg:** 1 tab morning after breakfast *(BP)*\n2. **Rosuvastatin 10mg:** 1 tab daily at bedtime *(Lipids)*\n3. **Vitamin B-Complex + D3:** 1 capsule daily after lunch`,
        quickActions: [
          { label: '🔑 Share PIN with Doctor', action: 'open_pin' }
        ]
      };
    }

    // General fallback
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      timestamp: time,
      text: isHi
        ? `आपके 11 स्वास्थ्य रिकॉर्ड्स के आधार पर:\n- **अलर्ट:** फास्टिंग शुगर 108 mg/dL (डॉ. राजेश शर्मा से परामर्श लें)\n- **बीपी:** 128/82 mmHg (सामान्य)\n- **सुरक्षा:** पेनिसिलिन से परहेज रखें`
        : `Based on your medical records:\n- **Alert:** Fasting blood sugar 108 mg/dL (Schedule checkup with Dr. Rajesh Sharma)\n- **Blood Pressure:** 128/82 mmHg (Well controlled)\n- **Safety Alert:** Severe Penicillin allergy on file`,
      quickActions: [
        { label: isHi ? '🩺 डॉक्टर सलाह' : '🩺 Doctor Advice', query: isHi ? 'मुझे डॉक्टर से कब मिलना चाहिए?' : 'When should I see a doctor based on my trends?' },
        { label: isHi ? '📈 शुगर रिपोर्ट' : '📈 Sugar Trend', query: isHi ? 'मेरा ब्लड शुगर ट्रेंड समझाएं' : 'Analyze my blood sugar and pre-diabetes trend' }
      ]
    };
  };

  const handleActionClick = (action) => {
    if (action === 'open_pin') {
      if (onOpenDoctorModal) onOpenDoctorModal();
    } else if (action === 'view_sugar_record') {
      const sugarRec = medicalRecords.find(r => r.id === 'REC-2026-03');
      if (sugarRec && onViewRecord) onViewRecord(sugarRec);
    }
  };

  return (
    <>
      {/* 1. FLOATING CIRCLE BUTTON IN CORNER (SHOWN WHEN CHAT IS CLOSED) */}
      {!isOpen && (
        <div className="ai-chatbot-trigger-wrapper">
          {/* Subtle click prompt badge */}
          <div 
            onClick={() => setIsOpen(true)}
            style={{
              background: '#ffffff',
              border: '1px solid #99f6e4',
              borderRadius: '20px',
              padding: '6px 12px',
              boxShadow: '0 4px 16px rgba(15, 118, 110, 0.15)',
              fontSize: '11.5px',
              fontWeight: '700',
              color: 'var(--primary-teal-darker)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />
            <span>{language === 'hi' ? 'आरोग्य AI: 1 डॉक्टर अलर्ट' : 'Aarogya AI • 1 Alert'}</span>
          </div>

          {/* Circular Button */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            title={language === 'hi' ? 'आरोग्य AI सहायक' : 'Aarogya AI Health Assistant'}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              border: '2px solid #ffffff',
              boxShadow: '0 8px 24px rgba(15, 118, 110, 0.35)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              color: '#ffffff',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Bot size={26} strokeWidth={2.2} />
            
            {/* Red Alert Dot */}
            <span 
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff'
              }}
            >
              1
            </span>
          </button>
        </div>
      )}

      {/* 2. CHATBOT WINDOW (REPLACES THE BUTTON IN CORNER WHEN OPEN) */}
      {isOpen && (
        <div className="ai-chatbot-window">
          {/* Header */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #0d5c58 0%, #0f766e 100%)',
              color: '#ffffff',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Bot size={18} color="#ffffff" />
                <span 
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '1.5px solid #ffffff'
                  }} 
                />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', lineHeight: '1.2' }}>
                  {language === 'hi' ? 'आरोग्य AI स्वास्थ्य सहायक' : 'Aarogya AI Assistant'}
                </div>
                <div style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.85)' }}>
                  {language === 'hi' ? 'ट्रेंड विश्लेषण व डॉक्टर अलर्ट' : 'Trend Analysis & Doctor Alerts'}
                </div>
              </div>
            </div>

            {/* Header Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              title="Close"
              style={{
                border: 'none',
                background: 'rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
            >
              <X size={16} />
            </button>
          </div>

          {/* Compact Top Alert Bar */}
          <div 
            onClick={() => setShowAlertDetails(!showAlertDetails)}
            style={{
              background: '#fef2f2',
              borderBottom: '1px solid #fee2e2',
              padding: '7px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '700',
              color: '#991b1b',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <AlertTriangle size={13} color="#dc2626" />
              <span>
                {language === 'hi' 
                  ? '1 अलर्ट: फास्टिंग ब्लड शुगर वृद्धि (+10 mg/dL)' 
                  : '1 Alert: Fasting Blood Sugar (+10 mg/dL rise)'}
              </span>
            </div>
            {showAlertDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>

          {/* Collapsible Alert Card */}
          {showAlertDetails && (
            <div style={{ background: '#fff5f5', padding: '10px 14px', borderBottom: '1px solid #fed7d7', fontSize: '11px', color: '#7f1d1d' }}>
              <p style={{ margin: '0 0 6px', lineHeight: '1.4' }}>
                {language === 'hi'
                  ? 'आपका फास्टिंग शुगर 98 से बढ़कर 108 mg/dL हो गया है। डॉ. राजेश शर्मा को दिखाने की सलाह दी जाती है।'
                  : 'Fasting glucose climbed from 98 → 108 mg/dL. In-person review with Dr. Rajesh Sharma recommended.'}
              </p>
              <button
                onClick={() => {
                  if (onOpenDoctorModal) onOpenDoctorModal();
                }}
                style={{
                  background: '#0f766e',
                  color: '#ffffff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '10.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Stethoscope size={11} />
                <span>{language === 'hi' ? 'डॉक्टर पिन शेयर करें' : 'Share Doctor Access PIN'}</span>
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div 
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#f8fafc'
            }}
          >
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <div 
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAi ? 'flex-start' : 'flex-end',
                    maxWidth: '100%'
                  }}
                >
                  {/* Sender & Timestamp */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span style={{ fontWeight: '700', color: isAi ? 'var(--primary-teal)' : 'inherit' }}>
                      {isAi ? 'Aarogya AI' : (user?.name?.split(' ')[0] || 'You')}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Bubble */}
                  <div 
                    style={{
                      background: isAi ? '#ffffff' : 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
                      color: isAi ? 'var(--text-main)' : '#ffffff',
                      padding: '10px 12px',
                      borderRadius: '14px',
                      borderTopLeftRadius: isAi ? '2px' : '14px',
                      borderTopRightRadius: isAi ? '14px' : '2px',
                      border: isAi ? '1px solid #e2e8f0' : 'none',
                      boxShadow: isAi ? '0 1px 4px rgba(0,0,0,0.04)' : '0 2px 8px rgba(15,118,110,0.2)',
                      fontSize: '12.5px',
                      maxWidth: '92%'
                    }}
                  >
                    <FormattedText text={msg.text} isAi={isAi} />

                    {/* In-message Doctor CTA button */}
                    {msg.hasDoctorCTA && (
                      <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                        <button
                          onClick={() => {
                            if (onOpenDoctorModal) onOpenDoctorModal();
                          }}
                          style={{
                            background: '#0f766e',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '5px 10px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Stethoscope size={12} />
                          <span>{language === 'hi' ? 'डॉक्टर पिन शेयर करें' : 'Share Doctor Access PIN'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Suggestion Chips */}
                  {isAi && msg.quickActions && msg.quickActions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px', maxWidth: '92%' }}>
                      {msg.quickActions.map((qa, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => {
                            if (qa.action) {
                              handleActionClick(qa.action);
                            } else if (qa.query) {
                              handleSendMessage(qa.query);
                            }
                          }}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #99f6e4',
                            color: 'var(--primary-teal-darker)',
                            borderRadius: '12px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                          }}
                        >
                          <span>{qa.label}</span>
                          <ArrowRight size={10} color="var(--primary-teal)" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '12px', width: 'fit-content' }}>
                <Bot size={13} color="var(--primary-teal)" />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {language === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing...'}
                </span>
                <span className="typing-dots">
                  <span>•</span><span>•</span><span>•</span>
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '10px 12px' }}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={language === 'hi' ? 'शुगर, बीपी या डॉक्टर के बारे में पूछें...' : 'Ask about trends, sugar, BP...'}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '14px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  fontSize: '12px',
                  color: 'var(--text-main)',
                  background: '#f8fafc'
                }}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: inputMessage.trim() && !isTyping ? 'var(--primary-teal)' : '#cbd5e1',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputMessage.trim() && !isTyping ? 'pointer' : 'default'
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

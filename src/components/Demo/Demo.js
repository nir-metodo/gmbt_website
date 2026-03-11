'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import './Demo.css';

const PhoneInputWithModal = dynamic(
  () => import('@/components/shared/PhoneInput/PhoneInputWithModal'),
  { ssr: false }
);

const API_BASE = 'https://gambot.azurewebsites.net';

const BOT_TYPES = [
  { value: 'lead_generation', label: 'ניהול לידים' },
  { value: 'scheduled_appointment', label: 'תיאום פגישות' },
  { value: 'customer_service', label: 'שירות לקוחות' },
  { value: 'technical_support', label: 'תמיכה טכנית' },
  { value: 'common_qa', label: 'שאלות ותשובות' },
  { value: 'price_quote', label: 'הצעות מחיר' },
  { value: 'other', label: 'אחר' },
];

const LANGUAGES = [
  { value: 'he', label: 'עברית' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
];

const GOAL_MODES = [
  { value: 'guide_towards', label: 'הנח את השיחה לעבר המטרות' },
  { value: 'sequential', label: 'מטרות לפי סדר' },
  { value: 'any_sufficient', label: 'כל מטרה מספיקה' },
  { value: 'all_required', label: 'כל המטרות נדרשות' },
];

const DEMO_MEDIA_TYPES = [
  { value: 'image', label: 'תמונה', icon: '🖼️', placeholder: 'https://example.com/image.jpg' },
  { value: 'video', label: 'וידאו', icon: '🎥', placeholder: 'https://example.com/video.mp4' },
  { value: 'document', label: 'מסמך', icon: '📄', placeholder: 'https://example.com/file.pdf' },
  { value: 'link', label: 'קישור', icon: '🔗', placeholder: 'https://example.com/page' },
];

const normalizeUrl = (input) => {
  if (!input || !input.trim()) return null;
  let url = input.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('.')) return null;
    if (parsed.hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(parsed.hostname)) return null;
    return parsed.href;
  } catch {
    return null;
  }
};

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [websiteUrl, setWebsiteUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');
  const progressIntervalRef = useRef(null);

  const [qnaPairs, setQnaPairs] = useState([]);
  const [knowledgeBaseContent, setKnowledgeBaseContent] = useState('');
  const [knowledgeBaseFileName, setKnowledgeBaseFileName] = useState('');
  const [showAllQna, setShowAllQna] = useState(false);
  const [expandedQna, setExpandedQna] = useState({});

  const [botConfig, setBotConfig] = useState({
    botDisplayName: '',
    botType: 'lead_generation',
    language: 'he',
    botInstructions: '',
    botRestrictions: '',
    serviceTypes: [{ name: '', price: '', description: '' }],
    goalsCompletionMode: 'guide_towards',
    conversationGoals: [{ title: '', description: '' }],
  });

  const [aiSendableMessages, setAiSendableMessages] = useState([]);
  const [aiSendableMedia, setAiSendableMedia] = useState([]);
  const [aiSendableLocation, setAiSendableLocation] = useState({ enabled: false, source: 'custom', custom: { address: '' }, whenToUse: '' });
  const [showCommunicationTools, setShowCommunicationTools] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [demoResult, setDemoResult] = useState(null);

  useEffect(() => {
    return () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); };
  }, []);

  const handleScan = async () => {
    const normalized = normalizeUrl(websiteUrl);
    if (!normalized) { setError('יש להזין כתובת אתר תקינה (לדוגמה: www.example.com)'); return; }
    setWebsiteUrl(normalized);
    setError('');
    setIsScanning(true);
    setScanProgress(0);
    setScanStatus('מתחבר לאתר...');

    progressIntervalRef.current = setInterval(() => {
      setScanProgress(prev => {
        if (prev < 10) { setScanStatus('מתחבר לאתר...'); return prev + 0.4; }
        else if (prev < 25) { setScanStatus('מחפש sitemap ודפים באתר...'); return prev + 0.2; }
        else if (prev < 45) { setScanStatus('סורק דפים באתר...'); return prev + 0.15; }
        else if (prev < 60) { setScanStatus('מחלץ תוכן מהדפים...'); return prev + 0.1; }
        else if (prev < 75) { setScanStatus('AI מנתח את המידע...'); return prev + 0.08; }
        else if (prev < 88) { setScanStatus('יוצר שאלות ותשובות...'); return prev + 0.05; }
        else if (prev < 95) { setScanStatus('בונה פרופיל לעסק...'); return prev + 0.02; }
        return prev;
      });
    }, 1000);

    try {
      const res = await fetch(`${API_BASE}/api/Demo/scan-website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl: normalized }),
      });
      const data = await res.json();
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;

      if (data?.success) {
        setScanProgress(100);
        setScanStatus('הסריקה הושלמה!');
        setScanResult(data.data);
        if (data.data.qnaPairs?.length > 0) {
          setQnaPairs(data.data.qnaPairs.map(qa => ({ question: qa.question || qa.Question || '', answer: qa.answer || qa.Answer || '' })));
        }
        if (data.data.knowledgeBaseContent) {
          setKnowledgeBaseContent(data.data.knowledgeBaseContent);
          setKnowledgeBaseFileName(data.data.knowledgeBaseFileName || `${normalized.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_')}_knowledge_base.txt`);
        } else if (data.data.knowledgeBaseFileBase64) {
          try { setKnowledgeBaseContent(atob(data.data.knowledgeBaseFileBase64)); setKnowledgeBaseFileName(data.data.knowledgeBaseFileName || 'knowledge_base.txt'); } catch { }
        }
        if (data.data.businessInfo) {
          const biz = data.data.businessInfo;
          setBotConfig(prev => ({ ...prev, botDisplayName: biz.BusinessName || biz.businessName || '', botInstructions: biz.Description || biz.description || '' }));
        }
        setTimeout(() => { setIsScanning(false); setCurrentStep(2); }, 1200);
      } else {
        setIsScanning(false);
        setScanProgress(0);
        setError(data?.error || 'שגיאה בסריקת האתר');
      }
    } catch {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
      setIsScanning(false);
      setScanProgress(0);
      setError('שגיאה בחיבור לשרת. נסו שוב.');
    }
  };

  const updateQna = (index, field, value) => setQnaPairs(prev => prev.map((qa, i) => i === index ? { ...qa, [field]: value } : qa));
  const removeQna = (index) => setQnaPairs(prev => prev.filter((_, i) => i !== index));
  const addQna = () => setQnaPairs(prev => [...prev, { question: '', answer: '' }]);
  const toggleQnaExpand = (index) => setExpandedQna(prev => ({ ...prev, [index]: !prev[index] }));

  const handleDownloadKB = () => {
    if (!knowledgeBaseContent) return;
    const blob = new Blob([knowledgeBaseContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = knowledgeBaseFileName || 'knowledge_base.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const updateConfig = (key, value) => setBotConfig(prev => ({ ...prev, [key]: value }));
  const updateServiceType = (index, field, value) => { const u = [...botConfig.serviceTypes]; u[index] = { ...u[index], [field]: value }; updateConfig('serviceTypes', u); };
  const addServiceType = () => updateConfig('serviceTypes', [...botConfig.serviceTypes, { name: '', price: '', description: '' }]);
  const removeServiceType = (index) => { if (botConfig.serviceTypes.length <= 1) return; updateConfig('serviceTypes', botConfig.serviceTypes.filter((_, i) => i !== index)); };
  const updateGoal = (index, field, value) => { const u = [...botConfig.conversationGoals]; u[index] = { ...u[index], [field]: value }; updateConfig('conversationGoals', u); };
  const addGoal = () => updateConfig('conversationGoals', [...botConfig.conversationGoals, { title: '', description: '' }]);
  const removeGoal = (index) => { if (botConfig.conversationGoals.length <= 1) return; updateConfig('conversationGoals', botConfig.conversationGoals.filter((_, i) => i !== index)); };

  const addRegularMessage = () => setAiSendableMessages(prev => [...prev, { id: Date.now().toString(), name: '', message: '', whenToUse: '' }]);
  const removeRegularMessage = (id) => setAiSendableMessages(prev => prev.filter(m => m.id !== id));
  const updateRegularMessage = (id, field, value) => setAiSendableMessages(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));

  const addMedia = (type) => setAiSendableMedia(prev => [...prev, { id: Date.now().toString(), type, name: '', url: '', caption: '', whenToUse: '' }]);
  const removeMedia = (id) => setAiSendableMedia(prev => prev.filter(m => m.id !== id));
  const updateMedia = (id, field, value) => setAiSendableMedia(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));

  const [mediaUploading, setMediaUploading] = useState({});
  const handleMediaFileUpload = async (mediaId, file, mediaType) => {
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/quicktime'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']
    };
    const types = allowedTypes[mediaType] || [];
    if (types.length && !types.includes(file.type)) { setError(`סוג קובץ לא נתמך`); return; }
    setMediaUploading(prev => ({ ...prev, [mediaId]: true }));
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/api/Demo/upload-media`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data?.success && data?.url) {
        updateMedia(mediaId, 'url', data.url);
        if (!aiSendableMedia.find(m => m.id === mediaId)?.name) updateMedia(mediaId, 'name', file.name.replace(/\.[^/.]+$/, ''));
      } else { setError(data?.error || 'שגיאה בהעלאת הקובץ'); }
    } catch { setError('שגיאה בהעלאת הקובץ. נסו שוב.'); }
    setMediaUploading(prev => ({ ...prev, [mediaId]: false }));
  };

  const handleConfigNext = () => {
    if (!botConfig.botDisplayName.trim()) { setError('יש להזין שם לבוט'); return; }
    setError('');
    setCurrentStep(4);
  };

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) { setError('יש להזין מספר טלפון'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/Demo/send-verification`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phoneNumber, name: userName || 'Demo User' }) });
      const data = await res.json();
      if (data?.success) { setCodeSent(true); } else { setError(data?.error || 'שגיאה בשליחת קוד אימות'); }
    } catch { setError('שגיאה בחיבור לשרת. נסו שוב.'); }
    setLoading(false);
  };

  const handleVerifyAndCreate = async () => {
    if (!verificationCode.trim()) { setError('יש להזין את קוד האימות'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/Demo/verify-and-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber, verificationCode, name: userName || 'Demo User',
          companyName: botConfig.botDisplayName, businessDescription: botConfig.botInstructions,
          language: botConfig.language, websiteUrl,
          qnaPairs: qnaPairs.filter(qa => qa.question.trim() && qa.answer.trim()),
          knowledgeBaseContent: knowledgeBaseContent || scanResult?.knowledgeBaseContent || '',
          setup: { botDisplayName: botConfig.botDisplayName, botType: botConfig.botType, botInstructions: botConfig.botInstructions, botRestrictions: botConfig.botRestrictions, timezone: 'Asia/Jerusalem' },
          aiCommunicationTools: { aiSendableTemplates: [], aiSendableMessages: aiSendableMessages.filter(m => m.message.trim()), aiSendableMedia: aiSendableMedia.filter(m => m.url.trim()), aiSendableLocation: aiSendableLocation.enabled ? aiSendableLocation : { enabled: false } },
          pricing: { serviceTypes: botConfig.serviceTypes.filter(s => s.name.trim()) },
          goals: { goalsCompletionMode: botConfig.goalsCompletionMode, conversationGoals: botConfig.conversationGoals.filter(g => g.title.trim()) },
        })
      });
      const data = await res.json();
      if (data?.success) { setDemoResult(data.data); setCurrentStep(5); } else { setError(data?.error || 'שגיאה ביצירת הדמו'); }
    } catch { setError('שגיאה בחיבור לשרת. נסו שוב.'); }
    setLoading(false);
  };

  const renderStepIndicators = () => (
    <div className="demo-steps-overview">
      {[{ num: 1, label: 'סריקת אתר' }, { num: 2, label: 'תוצאות סריקה' }, { num: 3, label: 'הגדרת הבוט' }, { num: 4, label: 'אימות טלפון' }, { num: 5, label: 'הפעלה!' }].map((step, i, arr) => (
        <span key={step.num} style={{ display: 'contents' }}>
          <div className="demo-step-indicator">
            <div className={`demo-step-circle ${currentStep === step.num ? 'active' : ''} ${currentStep > step.num ? 'completed' : ''}`}>
              {currentStep > step.num ? '✓' : step.num}
            </div>
            <span className="demo-step-label">{step.label}</span>
          </div>
          {i < arr.length - 1 && <div className={`demo-step-connector ${currentStep > step.num ? 'completed' : ''}`}></div>}
        </span>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="demo-step-content">
      <h2 className="demo-step-title">סרקו את האתר שלכם</h2>
      <p className="demo-step-description">נסרוק את האתר ונבנה פרופיל AI בסיסי לעסק שלכם</p>
      <div className="demo-input-group">
        <input type="url" className="demo-input" placeholder="https://www.example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} dir="ltr" disabled={loading} />
        <button className="demo-btn primary" onClick={handleScan} disabled={loading}>{loading ? <span className="demo-spinner"></span> : 'סרוק אתר'}</button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const displayedQna = showAllQna ? qnaPairs : qnaPairs.slice(0, 5);
    return (
      <div className="demo-step-content">
        <h2 className="demo-step-title">תוצאות הסריקה</h2>
        <p className="demo-step-description">בדקו ועדכנו את המידע שנאסף מהאתר שלכם</p>
        <div className="demo-scan-summary">
          <div className="demo-scan-summary-icon">✅</div>
          <div className="demo-scan-summary-text">
            <strong>הסריקה הושלמה בהצלחה!</strong>
            <span>נמצאו {qnaPairs.length} שאלות ותשובות {scanResult?.pagesScanned ? `מ-${scanResult.pagesScanned} דפים` : ''}</span>
          </div>
        </div>
        {scanResult?.businessInfo && (
          <div className="demo-result-section demo-result-business">
            <div className="demo-result-section-header"><span className="demo-result-section-icon">🏢</span><h3>פרטי העסק שזוהו</h3></div>
            <div className="demo-result-business-grid">
              {scanResult.businessInfo.businessName && <div className="demo-result-business-item"><span className="demo-result-label">שם העסק</span><span className="demo-result-value">{scanResult.businessInfo.businessName}</span></div>}
              {scanResult.businessInfo.businessType && <div className="demo-result-business-item"><span className="demo-result-label">סוג העסק</span><span className="demo-result-value">{scanResult.businessInfo.businessType}</span></div>}
              {scanResult.businessInfo.description && <div className="demo-result-business-item full"><span className="demo-result-label">תיאור</span><span className="demo-result-value">{scanResult.businessInfo.description.substring(0, 300)}{scanResult.businessInfo.description.length > 300 ? '...' : ''}</span></div>}
            </div>
          </div>
        )}
        <div className="demo-result-section demo-result-qna">
          <div className="demo-result-section-header"><span className="demo-result-section-icon">💬</span><h3>שאלות ותשובות ({qnaPairs.length})</h3><button className="demo-btn secondary small" onClick={addQna}>+ הוספת שאלה</button></div>
          {qnaPairs.length === 0 ? (
            <div className="demo-result-empty"><span>📝</span><p>לא נמצאו שאלות ותשובות. הוסיפו ידנית או נסו לסרוק אתר אחר.</p></div>
          ) : (
            <div className="demo-qna-list">
              {displayedQna.map((qa, index) => (
                <div key={index} className="demo-qna-card">
                  <div className="demo-qna-card-header" onClick={() => toggleQnaExpand(index)}>
                    <div className="demo-qna-card-num">{index + 1}</div>
                    <div className="demo-qna-card-question">{qa.question || 'שאלה ריקה'}</div>
                    <div className="demo-qna-card-actions">
                      <button className="demo-btn-icon remove" onClick={(e) => { e.stopPropagation(); removeQna(index); }} title="מחק">✕</button>
                      <span className="demo-qna-expand-icon">{expandedQna[index] ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {expandedQna[index] && (
                    <div className="demo-qna-card-body">
                      <div className="demo-field"><label>שאלה</label><input type="text" className="demo-input" value={qa.question} onChange={(e) => updateQna(index, 'question', e.target.value)} placeholder="הזינו שאלה..." /></div>
                      <div className="demo-field"><label>תשובה</label><textarea className="demo-textarea" value={qa.answer} onChange={(e) => updateQna(index, 'answer', e.target.value)} placeholder="הזינו תשובה..." rows={3} /></div>
                    </div>
                  )}
                </div>
              ))}
              {qnaPairs.length > 5 && <button className="demo-btn secondary" onClick={() => setShowAllQna(!showAllQna)} style={{ width: '100%', marginTop: '8px' }}>{showAllQna ? `הסתר (הצג 5 ראשונות)` : `הצג את כל ${qnaPairs.length} השאלות`}</button>}
            </div>
          )}
        </div>
        {knowledgeBaseContent && (
          <div className="demo-result-section demo-result-kb">
            <div className="demo-result-section-header"><span className="demo-result-section-icon">📄</span><h3>קובץ מידע (Knowledge Base)</h3><button className="demo-btn secondary small" onClick={handleDownloadKB}>⬇ הורדה</button></div>
            <div className="demo-kb-preview"><div className="demo-kb-filename">{knowledgeBaseFileName}</div><pre className="demo-kb-content">{knowledgeBaseContent.substring(0, 1000)}{knowledgeBaseContent.length > 1000 ? '\n\n... (עוד תוכן)' : ''}</pre></div>
          </div>
        )}
        <div className="demo-actions"><button className="demo-btn secondary" onClick={() => setCurrentStep(1)}>חזרה</button><button className="demo-btn primary" onClick={() => { setError(''); setCurrentStep(3); }}>המשך להגדרת הבוט</button></div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="demo-step-content">
      <h2 className="demo-step-title">הגדירו את הבוט</h2>
      <p className="demo-step-description">התאימו את הבוט לעסק שלכם</p>
      <div className="demo-config-section">
        <h3 className="demo-section-title">⚙️ הגדרות בסיסיות</h3>
        <div className="demo-field"><label>שם הבוט</label><input type="text" className="demo-input" value={botConfig.botDisplayName} onChange={(e) => updateConfig('botDisplayName', e.target.value)} placeholder="שם העסק או הבוט" /></div>
        <div className="demo-field-row">
          <div className="demo-field"><label>סוג הבוט</label><select className="demo-select" value={botConfig.botType} onChange={(e) => updateConfig('botType', e.target.value)}>{BOT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
          <div className="demo-field"><label>שפה</label><select className="demo-select" value={botConfig.language} onChange={(e) => updateConfig('language', e.target.value)}>{LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}</select></div>
        </div>
      </div>
      <div className="demo-config-section">
        <h3 className="demo-section-title">📝 הנחיות לבוט</h3>
        <p className="demo-section-description">תארו את העסק, השירותים, וכיצד הבוט צריך להתנהג.</p>
        <div className="demo-field"><textarea className="demo-textarea" value={botConfig.botInstructions} onChange={(e) => updateConfig('botInstructions', e.target.value)} placeholder="לדוגמה: אנחנו חברת טכנולוגיה שמספקת שירותי פיתוח אפליקציות..." rows={5} /></div>
      </div>
      <div className="demo-config-section">
        <h3 className="demo-section-title">🚫 הגבלות</h3>
        <div className="demo-field"><textarea className="demo-textarea" value={botConfig.botRestrictions} onChange={(e) => updateConfig('botRestrictions', e.target.value)} placeholder="לדוגמה: אל תציין מתחרים, אל תספק מחירים מדויקים..." rows={4} /></div>
      </div>
      <div className="demo-config-section">
        <h3 className="demo-section-title">💰 מחירון שירותים</h3>
        {botConfig.serviceTypes.map((service, i) => (
          <div key={i} className="demo-list-item">
            <input type="text" className="demo-input small" placeholder="שם שירות" value={service.name} onChange={(e) => updateServiceType(i, 'name', e.target.value)} />
            <input type="text" className="demo-input small" placeholder="מחיר" value={service.price} onChange={(e) => updateServiceType(i, 'price', e.target.value)} dir="ltr" />
            <input type="text" className="demo-input small" placeholder="תיאור (אופציונלי)" value={service.description} onChange={(e) => updateServiceType(i, 'description', e.target.value)} />
            {botConfig.serviceTypes.length > 1 && <button className="demo-btn-icon remove" onClick={() => removeServiceType(i)}>✕</button>}
          </div>
        ))}
        <button className="demo-btn secondary small" onClick={addServiceType}>+ הוספת שירות</button>
      </div>

      <div className="demo-config-section demo-comm-tools-section">
        <div className="demo-comm-tools-header" onClick={() => setShowCommunicationTools(prev => !prev)}>
          <h3 className="demo-section-title" style={{ margin: 0 }}>💬 כלי תקשורת AI</h3>
          <span className="demo-comm-toggle">{showCommunicationTools ? '▲ סגור' : '▼ הרחב'}</span>
        </div>
        <p className="demo-section-description">הגדירו הודעות, מדיה ומיקום שהבוט ישלח אוטומטית בהתאם להקשר השיחה.</p>

        {showCommunicationTools && (
          <div className="demo-comm-tools-content">

            {/* הודעות טקסט */}
            <div className="demo-comm-subsection demo-comm-messages">
              <div className="demo-comm-subsection-header">
                <h4>✉️ הודעות טקסט</h4>
                <button className="demo-btn secondary small" onClick={addRegularMessage}>+ הוספת הודעה</button>
              </div>
              <p className="demo-comm-hint">הגדירו הודעות מוכנות שהבוט ישלח כשנדרש — לדוגמה: הצעת מחיר, אישור פגישה וכו׳.</p>
              {aiSendableMessages.length === 0 ? (
                <p className="demo-comm-empty">אין הודעות עדיין. לחצו על "הוספת הודעה" כדי להוסיף.</p>
              ) : (
                <div className="demo-comm-items">
                  {aiSendableMessages.map((msg) => (
                    <div key={msg.id} className="demo-comm-card">
                      <div className="demo-comm-card-header">
                        <span className="demo-comm-card-title">{msg.name || 'הודעה ללא שם'}</span>
                        <button className="demo-btn-icon remove" onClick={() => removeRegularMessage(msg.id)}>✕</button>
                      </div>
                      <div className="demo-field">
                        <label>שם ההודעה</label>
                        <input type="text" className="demo-input" placeholder="לדוגמה: אישור פגישה" value={msg.name} onChange={(e) => updateRegularMessage(msg.id, 'name', e.target.value)} />
                      </div>
                      <div className="demo-field">
                        <label>תוכן ההודעה</label>
                        <textarea className="demo-textarea" rows={3} placeholder="תוכן ההודעה שהבוט ישלח..." value={msg.message} onChange={(e) => updateRegularMessage(msg.id, 'message', e.target.value)} />
                      </div>
                      <div className="demo-field demo-comm-ai-instructions">
                        <label>מתי לשלוח?</label>
                        <textarea className="demo-textarea" rows={2} placeholder="הנחיה לבוט — לדוגמה: שלח כאשר הלקוח מבקש אישור פגישה" value={msg.whenToUse} onChange={(e) => updateRegularMessage(msg.id, 'whenToUse', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* מדיה */}
            <div className="demo-comm-subsection demo-comm-media">
              <div className="demo-comm-subsection-header">
                <h4>🖼️ מדיה (תמונות, וידאו, מסמכים, קישורים)</h4>
                <div className="demo-comm-media-buttons">
                  {DEMO_MEDIA_TYPES.map(mt => (
                    <button key={mt.value} className={`demo-btn secondary small demo-media-btn-${mt.value}`} onClick={() => addMedia(mt.value)}>{mt.icon} {mt.label}</button>
                  ))}
                </div>
              </div>
              <p className="demo-comm-hint">הוסיפו קבצי מדיה או קישורים שהבוט ישלח לפי הצורך בשיחה.</p>
              {aiSendableMedia.length === 0 ? (
                <p className="demo-comm-empty">אין מדיה עדיין. בחרו סוג מדיה להוספה.</p>
              ) : (
                <div className="demo-comm-items">
                  {aiSendableMedia.map((media) => {
                    const mediaType = DEMO_MEDIA_TYPES.find(t => t.value === media.type);
                    return (
                      <div key={media.id} className="demo-comm-card">
                        <div className="demo-comm-card-header">
                          <span className="demo-comm-card-title">{mediaType?.icon} {media.name || mediaType?.label || media.type}</span>
                          <button className="demo-btn-icon remove" onClick={() => removeMedia(media.id)}>✕</button>
                        </div>
                        <div className="demo-field demo-comm-field-full">
                          <label>שם</label>
                          <input type="text" className="demo-input" placeholder="שם לקובץ / קישור" value={media.name} onChange={(e) => updateMedia(media.id, 'name', e.target.value)} />
                        </div>
                        <div className="demo-field demo-comm-field-full">
                          <label>כתובת URL</label>
                          <input type="url" className="demo-input" dir="ltr" placeholder={mediaType?.placeholder || 'https://...'} value={media.url} onChange={(e) => updateMedia(media.id, 'url', e.target.value)} />
                        </div>
                        {media.type !== 'link' && (
                          <div className="demo-comm-upload-row">
                            <span className="demo-comm-upload-label">או העלו קובץ:</span>
                            <label className="demo-btn secondary small demo-upload-btn">
                              {mediaUploading[media.id] ? <span className="demo-spinner"></span> : '⬆ העלאה'}
                              <input type="file" onChange={(e) => { if (e.target.files?.[0]) handleMediaFileUpload(media.id, e.target.files[0], media.type); e.target.value = ''; }} />
                            </label>
                          </div>
                        )}
                        {media.type !== 'link' && (
                          <div className="demo-field">
                            <label>כיתוב (אופציונלי)</label>
                            <input type="text" className="demo-input" placeholder="תיאור קצר למדיה..." value={media.caption} onChange={(e) => updateMedia(media.id, 'caption', e.target.value)} />
                          </div>
                        )}
                        <div className="demo-field demo-comm-ai-instructions">
                          <label>מתי לשלוח?</label>
                          <textarea className="demo-textarea" rows={2} placeholder="הנחיה לבוט — לדוגמה: שלח כאשר הלקוח מבקש מידע על המוצר" value={media.whenToUse} onChange={(e) => updateMedia(media.id, 'whenToUse', e.target.value)} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* מיקום */}
            <div className="demo-comm-subsection demo-comm-location">
              <div className="demo-comm-subsection-header">
                <label className="demo-checkbox-label">
                  <input type="checkbox" checked={aiSendableLocation.enabled} onChange={(e) => setAiSendableLocation(prev => ({ ...prev, enabled: e.target.checked }))} />
                  <h4>📍 שיתוף מיקום</h4>
                </label>
              </div>
              <p className="demo-comm-hint">אפשרו לבוט לשתף את מיקום העסק כשלקוח שואל איפה אתם נמצאים.</p>
              {aiSendableLocation.enabled && (
                <div className="demo-comm-location-fields">
                  <div className="demo-field">
                    <label>כתובת העסק</label>
                    <input type="text" className="demo-input" placeholder="לדוגמה: רחוב הרצל 1, תל אביב" value={aiSendableLocation.custom.address} onChange={(e) => setAiSendableLocation(prev => ({ ...prev, custom: { ...prev.custom, address: e.target.value } }))} />
                  </div>
                  <div className="demo-field demo-comm-ai-instructions">
                    <label>מתי לשתף?</label>
                    <textarea className="demo-textarea" rows={2} placeholder="הנחיה לבוט — לדוגמה: שתף מיקום כאשר לקוח שואל איפה הסניף" value={aiSendableLocation.whenToUse} onChange={(e) => setAiSendableLocation(prev => ({ ...prev, whenToUse: e.target.value }))} />
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      <div className="demo-actions"><button className="demo-btn secondary" onClick={() => setCurrentStep(2)}>חזרה</button><button className="demo-btn primary" onClick={handleConfigNext}>המשך לאימות</button></div>
    </div>
  );

  const renderStep4 = () => (
    <div className="demo-step-content">
      <h2 className="demo-step-title">אימות מספר טלפון</h2>
      <p className="demo-step-description">הזינו את מספר הטלפון שאליו תרצו לקבל את הבוט בוואטסאפ</p>
      <div className="demo-field"><label>שם (אופציונלי)</label><input type="text" className="demo-input" placeholder="השם שלכם" value={userName} onChange={(e) => setUserName(e.target.value)} disabled={codeSent && loading} /></div>
      <div className="demo-field">
        <label>מספר טלפון</label>
        <div className="demo-input-group">
          <div className="demo-phone-input-wrapper">
            <PhoneInputWithModal country="il" value={phoneNumber} onChange={(val) => setPhoneNumber(val || '')} disabled={codeSent} />
          </div>
          {!codeSent && <button className="demo-btn primary" onClick={handleSendCode} disabled={loading}>{loading ? <span className="demo-spinner"></span> : 'שלח קוד'}</button>}
        </div>
        <p className="demo-phone-hint">בחרו מדינה והזינו את המספר</p>
      </div>
      {codeSent && (
        <div className="demo-verification-section">
          <div className="demo-code-sent-msg">קוד אימות נשלח ל-{phoneNumber} בוואטסאפ</div>
          <div className="demo-field">
            <label>קוד אימות</label>
            <div className="demo-input-group">
              <input type="text" className="demo-input code-input" placeholder="000000" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} dir="ltr" maxLength={6} disabled={loading} />
              <button className="demo-btn primary" onClick={handleVerifyAndCreate} disabled={loading || verificationCode.length < 6}>{loading ? <span className="demo-spinner"></span> : 'אמת וצור דמו'}</button>
            </div>
          </div>
          <button className="demo-btn-link" onClick={() => { setCodeSent(false); setVerificationCode(''); }}>שלח קוד חדש</button>
        </div>
      )}
      <div className="demo-actions"><button className="demo-btn secondary" onClick={() => { setCurrentStep(3); setCodeSent(false); setVerificationCode(''); setError(''); }}>חזרה</button></div>
    </div>
  );

  const GAMBOT_WHATSAPP_NUMBER = '97233824014';
  const renderStep5 = () => {
    const prefilledMsg = encodeURIComponent(`היי, אני רוצה לבדוק את הבוט של ${botConfig.botDisplayName || 'העסק שלי'} 🤖`);
    return (
      <div className="demo-step-content demo-success">
        <div className="demo-success-icon">🎉</div>
        <h2 className="demo-step-title">הבוט שלכם מוכן!</h2>
        <p className="demo-step-description">שלחו הודעה בוואטסאפ למספר של Gambot והבוט שלכם יענה</p>
        <div className="demo-success-details">
          <div className="demo-success-item"><span className="demo-success-label">שם הבוט:</span><span>{botConfig.botDisplayName}</span></div>
          <div className="demo-success-item"><span className="demo-success-label">מספר טלפון:</span><span dir="ltr">{GAMBOT_WHATSAPP_NUMBER}</span></div>
          <div className="demo-success-item"><span className="demo-success-label">שאלות ותשובות:</span><span>{qnaPairs.length}</span></div>
        </div>
        <p className="demo-success-note">שלחו הודעה מהמספר שאימתתם ({phoneNumber}) למספר {GAMBOT_WHATSAPP_NUMBER} כדי להתחיל שיחה עם הבוט שלכם!</p>
        <a href={`https://wa.me/${GAMBOT_WHATSAPP_NUMBER}?text=${prefilledMsg}`} target="_blank" rel="noopener noreferrer" className="demo-btn primary large">פתחו וואטסאפ ונסו עכשיו</a>
      </div>
    );
  };

  return (
    <div className="demo-page-container">
      <div className="demo-content-card">
        <div className="demo-header-section">
          <h1 className="demo-title">נסו דמו</h1>
          <p className="demo-subtitle">בנו בוט AI לעסק שלכם תוך דקות - בלי ליצור חשבון</p>
        </div>
        {renderStepIndicators()}
        {error && <div className="demo-error">{error}</div>}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>

      {isScanning && (
        <div className="demo-scan-overlay">
          <div className="demo-scan-modal">
            <div className="demo-scan-globe"><span className="demo-scan-globe-icon">🌐</span></div>
            <h3 className="demo-scan-title">סורקים את האתר שלכם</h3>
            <p className="demo-scan-status">{scanStatus}</p>
            <div className="demo-scan-progress-track"><div className="demo-scan-progress-bar" style={{ width: `${scanProgress}%` }} /></div>
            <p className="demo-scan-url">{websiteUrl}</p>
            <button className="demo-btn secondary" onClick={() => { if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; } setIsScanning(false); setScanProgress(0); setScanStatus(''); }}>ביטול</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Demo;

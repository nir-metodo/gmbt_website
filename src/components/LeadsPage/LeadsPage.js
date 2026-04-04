'use client';
import { useState } from 'react';
import styles from '../CrmPage/CrmPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('היי גמבוט 👋 אני רוצה לשמוע על מערכת ניהול הלידים שלכם');

function trackWAClick() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: 'leads-page' });
    window.gtag('event', 'conversion', { send_to: 'AW-18018385768/tTojCPDWio0cEOj-6o9D', value: 1.0, currency: 'ILS' });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

const SOURCES = [
  { icon: '📘', name: 'Facebook CTWA', desc: 'לחיצה על מודעה → שיחת וואטסאפ → ליד נוצר אוטומטית' },
  { icon: '📋', name: 'Facebook Forms', desc: 'טופס לידים בפייסבוק → ישירות ל-CRM, בלי ידני' },
  { icon: '🌐', name: 'דפי נחיתה', desc: 'Webhook פשוט מכל דף נחיתה — Wix, Webflow, מותאם אישית' },
  { icon: '💬', name: 'וואטסאפ', desc: 'כל פנייה ישירה בוואטסאפ הופכת לליד אוטומטי' },
  { icon: '🔗', name: 'API / Zapier', desc: 'חיבור לכל מערכת — Make, Zapier, API פרטי' },
];

const PIPELINE = [
  { name: 'ליד חדש', color: '#6b7280', count: 8, leads: [
    { name: 'דוד כהן', value: '₪14,000', source: 'FB Ads', hot: true },
    { name: 'רחל לוי', value: '₪8,500', source: 'Landing Page', hot: false },
  ]},
  { name: 'יצרנו קשר', color: '#2563eb', count: 5, leads: [
    { name: 'יוסי מזרחי', value: '₪22,000', source: 'WhatsApp', hot: true },
  ]},
  { name: 'הצעת מחיר', color: '#d97706', count: 3, leads: [
    { name: 'מיכל ברק', value: '₪35,000', source: 'FB Forms', hot: true },
  ]},
  { name: 'נסגר ✓', color: '#25D366', count: 12, leads: [
    { name: 'נועם כץ', value: '₪29,000', source: 'CTWA', hot: false },
  ]},
];

const FEATURES = [
  { icon: '⚡', title: 'ליד חדש → וואטסאפ תוך שניות', desc: 'ברגע שליד נכנס ממכל מקור, הבוט שולח הודעת וואטסאפ אוטומטית בשמו של הנציג', color: '#25D366' },
  { icon: '📊', title: 'קנבן פייפליין ויזואלי', desc: 'גרור לידים בין שלבים, ראה ערך כל שלב, סנן לפי נציג, מקור, תגית ותאריך', color: '#2563eb' },
  { icon: '🎯', title: 'תיוג וסגמנטציה', desc: 'תגיות חכמות, שדות דינמיים לכל סוג ליד — ניתן לסנן ולשלוח קמפיין ממוקד', color: '#7c3aed' },
  { icon: '✅', title: 'משימות ותזכורות', desc: 'צרו משימה על ליד, הגדירו אחראי ותאריך — קבלו התראה בוואטסאפ בזמן', color: '#ef4444' },
  { icon: '📄', title: 'הצעות מחיר בלחיצה', desc: 'שלחו הצעת מחיר ישירות מכרטיסיית הליד בוואטסאפ — הלקוח חותם דיגיטלית', color: '#d97706' },
  { icon: '📈', title: 'דוחות המרה לפי מקור', desc: 'כמה לידים מכל מקור הפכו ללקוחות? מה זמן הטיפול הממוצע? הכל גרפי', color: '#059669' },
  { icon: '👥', title: 'ניהול נציגים ו-SLA', desc: 'חלוקת לידים אוטומטית לנציגים, מעקב זמן תגובה, SLA ודוחות ביצועים', color: '#0891b2' },
  { icon: '🤖', title: 'בוט AI לניהול לידים', desc: 'הבוט מנהל שיחת מכירה, סורג לידים ומעביר לנציג רק לידים חמים', color: '#8b5cf6' },
];

const FLOW_STEPS = [
  { icon: '📥', title: 'ליד נכנס', desc: 'מכל מקור — מודעה, דף נחיתה, וואטסאפ, פייסבוק' },
  { icon: '⚡', title: 'תגובה אוטומטית', desc: 'הבוט שולח הודעת וואטסאפ תוך שניות — "קיבלנו את פנייתך!"' },
  { icon: '🎯', title: 'סיווג חכם', desc: 'AI מסווג את הליד לפי עניין, תקציב ומיידיות' },
  { icon: '👤', title: 'הקצאה לנציג', desc: 'הליד עובר לנציג הנכון אוטומטית — עם כל הפרטים' },
  { icon: '💬', title: 'המשך בוואטסאפ', desc: 'הנציג מנהל את כל השיחה מתוך ממשק גמבוט' },
  { icon: '🏆', title: 'סגירת עסקה', desc: 'שלח הצעת מחיר, קבל חתימה, הפוך לעסקה מנוצחת' },
];

const FAQ = [
  { q: 'איך לידים מדפי נחיתה נכנסים למערכת?', a: 'מטמיעים Webhook פשוט בדף הנחיתה. כל שליחת טופס שולחת את נתוני הליד ישירות לגמבוט — בלי ידני, בלי מעכבים.' },
  { q: 'כמה זמן לוקח עד שהליד מקבל הודעה?', a: 'שניות ספורות. ברגע שהליד נכנס, הבוט שולח הודעת וואטסאפ אוטומטית. מהירות תגובה = שיעור המרה גבוה יותר.' },
  { q: 'אפשר לחלק לידים בין כמה נציגים?', a: 'כן! ניתן לחלק לפי תור שוויוני, לפי אזור, לפי סוג ליד, לפי עומס נציג — ומרכז הבקרה מראה את כל הפעילות.' },
  { q: 'האם יש חיבור לפייסבוק לידים?', a: 'כן — הן לטפסי לידים רגילים והן ל-CTWA (Click to WhatsApp Ads). כל ליד מסונכרן אוטומטית ללא צורך בייצוא ידני.' },
  { q: 'מה ההבדל מ-Excel?', a: 'Excel סטטי, לא שולח הודעות, לא מתעדכן אוטומטית ולא מאפשר שיתוף פעולה בזמן אמת. גמבוט חי, ממוחשב ומחובר לוואטסאפ.' },
];

const STATS = [
  { value: '3x', label: 'גידול בשיעור ההמרה', sub: 'בממוצע אצל לקוחות גמבוט' },
  { value: '<30s', label: 'זמן תגובה לליד חדש', sub: 'הודעה אוטומטית ראשונה' },
  { value: '500+', label: 'עסקים פעילים', sub: 'מנהלים לידים בגמבוט' },
  { value: '0', label: 'לידים שאובדים', sub: 'כשיש מעקב אוטומטי' },
];

export default function LeadsPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setStatus('loading');
    try {
      await sendLeadWebhook({ ...formData, source: 'lead-management-page' });
      await sendThankYouEmail({ name: formData.name, email: '' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>🎯 מערכת ניהול לידים</div>
          <h1 className={styles.heroTitle}>
            כל ליד — <span className={styles.heroHighlight}>תגובה אוטומטית בוואטסאפ</span>
            <br />תוך שניות
          </h1>
          <p className={styles.heroDesc}>
            מפייסבוק, דפי נחיתה, ווב-פורמים ישירות לוואטסאפ. גמבוט מנהל את כל הפייפליין — מליד ראשון ועד סגירת עסקה — ללא ידני, ללא אובדן לידים.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.ctaPrimary} onClick={() => window.location.href = 'https://gambot.co.il/OnboardingProcess'}>
              🚀 ניסיון חינם 30 יום
            </button>
            <button className={styles.ctaSecondary} onClick={trackWAClick}>
              💬 הדגמה בוואטסאפ
            </button>
          </div>
          <p className={styles.ctaSub}>ללא כרטיס אשראי · הגדרה תוך 10 דקות · בעברית מלאה</p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '40px 0', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div className={styles.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', textAlign: 'center' }}>
            {STATS.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#25D366', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', margin: '6px 0 4px' }}>{s.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD SOURCES */}
      <section className={styles.integrations}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>📥 לידים מכל מקום — אוטומטית</h2>
          <p className={styles.sectionDesc}>לא צריך לייצא Excel. לא צריך להעתיק ידנית. הכל זורם ישירות לגמבוט.</p>
          <div className={styles.intGrid}>
            {SOURCES.map((s, i) => (
              <div key={i} className={styles.intCard}>
                <div className={styles.intIcon}>{s.icon}</div>
                <strong>{s.name}</strong>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp auto-response spotlight */}
          <div className={styles.ctwaSpotlight}>
            <div className={styles.ctwaLeft}>
              <span className={styles.ctwaBadge}>⚡ תגובה אוטומטית</span>
              <h3>ליד נכנס → וואטסאפ תוך שניות</h3>
              <p>
                כל ליד שנכנס מכל מקור מקבל הודעת וואטסאפ אישית תוך שניות ספורות — בשמו שלו, בשם העסק שלכם. מחקרים מראים שתגובה תוך דקה מגדילה את ההמרה פי 7.
              </p>
              <ul className={styles.ctwaList}>
                <li>✅ הודעת פתיחה מותאמת אישית לסוג הליד</li>
                <li>✅ בוט AI שממשיך את השיחה 24/7</li>
                <li>✅ העברה לנציג כשהליד "חם"</li>
                <li>✅ תזכורת אוטומטית אם אין מענה</li>
              </ul>
            </div>
            <div className={styles.ctwaFlow}>
              {[
                ['ליד ממלא טופס', ''],
                ['גמבוט מקבל', ''],
                ['וואטסאפ נשלח', ''],
                ['ליד מגיב ✓', ''],
              ].map(([label], i, arr) => (
                <div key={i} className={styles.ctwaFlowStep}>
                  <span>{label}</span>
                  {i < arr.length - 1 && <span className={styles.ctwaArrow}>▼</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PIPELINE VISUAL */}
      <section className={styles.productDemo}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>📊 פייפליין לידים ויזואלי</h2>
          <p className={styles.sectionDesc}>גרור ושחרר בין שלבים · ראה ערך כל שלב · סנן לפי כל קריטריון</p>
          <div className={styles.kanbanWrap}>
            <div className={styles.kanban}>
              {PIPELINE.map((col, ci) => (
                <div key={ci} className={styles.kanbanCol}>
                  <div className={styles.kanbanColHeader} style={{ borderTopColor: col.color, color: col.color }}>
                    {col.name}
                    <span className={styles.kanbanCount}>{col.count}</span>
                  </div>
                  {col.leads.map((lead, li) => (
                    <div key={li} className={styles.kanbanCard}>
                      <div className={styles.kanbanCardName}>
                        {lead.name}
                        {lead.hot && <span style={{ marginRight: 6, fontSize: '0.7rem', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: 8, fontWeight: 700 }}>חם 🔥</span>}
                      </div>
                      <div className={styles.kanbanCardMeta}>
                        <span className={styles.kanbanValue}>{lead.value}</span>
                        <span className={styles.kanbanSource}>{lead.source}</span>
                      </div>
                      <div className={styles.kanbanCardActions}>💬 📋 ✅</div>
                    </div>
                  ))}
                  <button className={styles.kanbanAdd}>+ הוסף ליד</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>⚡ מה קורה כשליד נכנס?</h2>
          <p className={styles.sectionDesc}>תהליך אוטומטי מלא — מהרגע שהלקוח הפוטנציאלי משאיר פרטים ועד לסגירה</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginTop: '40px' }}>
            {FLOW_STEPS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '24px 16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
                <div style={{ width: '24px', height: '24px', background: '#25D366', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, margin: '0 auto 12px', position: 'absolute', top: '12px', right: '12px' }}>{i + 1}</div>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{step.icon}</div>
                <h3 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 800 }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features} style={{ background: '#f8fafc' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🌟 כל מה שצריך לניהול לידים מקצועי</h2>
          <p className={styles.sectionDesc}>מערכת שלמה — לא עוד חיבורים בין כלים שונים</p>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard} style={{ '--accent': f.color }}>
                <div className={styles.featureIcon} style={{ background: f.color + '15' }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MID CTA */}
      <section className={styles.midCta}>
        <div className={styles.container}>
          <div className={styles.midCtaInner}>
            <div>
              <h3>🔥 מפסיקים לאבד לידים היום</h3>
              <p>הצטרפו ל-500+ עסקים שמנהלים לידים חכם יותר עם גמבוט</p>
            </div>
            <button className={styles.midCtaBtn} onClick={() => window.location.href = 'https://gambot.co.il/OnboardingProcess'}>
              התחילו ניסיון חינם
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>❓ שאלות נפוצות</h2>
          <div className={styles.faqList}>
            {FAQ.map((f, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}>
                <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <span className={styles.faqArrow}>{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && <p className={styles.faqA}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>🚀 התחילו לנהל לידים חכם יותר</h2>
          <p className={styles.ctaDesc}>ניסיון חינם 30 יום · ללא כרטיס אשראי · הגדרה תוך 10 דקות</p>
          {status === 'success' ? (
            <div style={{ color: '#4ade80', fontSize: '1.1rem', fontWeight: 700 }}>✅ קיבלנו! נחזור אליכם בוואטסאפ בקרוב</div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.miniForm}>
              <input className={styles.miniInput} placeholder="שם מלא" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
              <input className={styles.miniInput} placeholder="טלפון" type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} required />
              <button className={styles.miniSubmit} type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'שולח...' : '🚀 קבלו גישה חינמית'}
              </button>
            </form>
          )}
          <div className={styles.ctaOr}>
            <span>──────</span>
            <span>או</span>
            <span>──────</span>
          </div>
          <button className={styles.ctaWaBtn} onClick={trackWAClick}>💬 שלחו לנו וואטסאפ</button>
          <p className={styles.privacy}>לא נשתמש בפרטים שלכם לשום דבר מלבד יצירת קשר</p>
        </div>
      </section>
    </div>
  );
}

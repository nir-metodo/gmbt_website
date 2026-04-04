'use client';
import { useState } from 'react';
import styles from '../CrmPage/CrmPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('היי גמבוט 👋 אני רוצה לחבר את דפי הנחיתה שלי לוואטסאפ');

function trackWAClick() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: 'landing-pages-page' });
    window.gtag('event', 'conversion', { send_to: 'AW-18018385768/tTojCPDWio0cEOj-6o9D', value: 1.0, currency: 'ILS' });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

const PLATFORMS = [
  { icon: '🔵', name: 'Wix', desc: 'הוסיפו Webhook ב-Wix Automations — כל שליחת טופס נכנסת לגמבוט' },
  { icon: '🟣', name: 'Webflow', desc: 'חיבור ישיר דרך Webflow Forms webhook או Zapier' },
  { icon: '🌐', name: 'WordPress', desc: 'Contact Form 7, Elementor, WPForms — webhook פשוט לגמבוט' },
  { icon: '🟡', name: 'Unbounce', desc: 'Unbounce webhooks → גמבוט → וואטסאפ תוך שניות' },
  { icon: '🔗', name: 'API מותאם', desc: 'דף נחיתה מותאם אישית? POST request ישיר לגמבוט API' },
  { icon: '⚡', name: 'Zapier / Make', desc: 'חיבור לכל פלטפורמה דרך Zapier, Make או n8n' },
];

const FEATURES = [
  {
    icon: '⚡', title: 'תגובה מיידית בוואטסאפ', color: '#25D366',
    desc: 'ברגע שמישהו ממלא טופס בדף הנחיתה, הוא מקבל הודעת וואטסאפ תוך שניות — "תודה! נחזור אליכם בקרוב" — עם שם אישי ומותאם לנושא הטופס.',
  },
  {
    icon: '🤖', title: 'בוט AI שממשיך את השיחה', color: '#8b5cf6',
    desc: 'הבוט לא רק "מאשר קבלה" — הוא ממשיך לשאול שאלות, מסנן רצינות, ומעביר לנציג רק לידים שמוכנים לקנות.',
  },
  {
    icon: '📊', title: 'כל ליד נכנס לCRM', color: '#2563eb',
    desc: 'שם, טלפון, אימייל, מה רצה — הכל נשמר אוטומטית בכרטיסיית ליד עם מקור, תאריך ושלב בפייפליין.',
  },
  {
    icon: '🎯', title: 'ניתוב לנציג הנכון', color: '#d97706',
    desc: 'לפי סוג הטופס, אזור גיאוגרפי, סוג מוצר או כל שדה אחר — הליד מגיע לנציג הנכון אוטומטית.',
  },
  {
    icon: '📅', title: 'קביעת פגישה אוטומטית', color: '#059669',
    desc: 'הבוט יכול לקבוע פגישה ישירות ב-Google Calendar — הלקוח בוחר זמן, קבלה נשלחת בוואטסאפ.',
  },
  {
    icon: '📈', title: 'דוחות המרה לפי דף', color: '#ef4444',
    desc: 'כמה לידים הגיעו מכל דף נחיתה? מה שיעור ההמרה? כמה הפכו לעסקאות? הכל בדוח אחד.',
  },
  {
    icon: '🔁', title: 'קמפיינים מעקב', color: '#0891b2',
    desc: 'ליד לא ענה? גמבוט שולח תזכורת אוטומטית בוואטסאפ אחרי 24 שעות, ואחרי 3 ימים — ללא מאמץ.',
  },
  {
    icon: '🏷️', title: 'תיוג לפי מקור', color: '#7c3aed',
    desc: 'כל ליד מתויג אוטומטית לפי הדף שממנו הגיע — אפשר לסנן, לשלוח קמפיין ממוקד, ולדעת מה עובד.',
  },
];

const CONVERSATION_MOCK = [
  { side: 'out', text: '👋 שלום דוד! קיבלנו את פנייתך לגבי ביטוח רכב. אני יעל מ-ABC ביטוח.', time: '14:02' },
  { side: 'in', text: 'אה כן, מחפש הצעת מחיר', time: '14:02' },
  { side: 'out', text: 'מצוין! כמה שאלות קצרות ואביא לך הצעה מיידית 😊\nשנת הרכב שלך?', time: '14:03' },
  { side: 'in', text: '2021', time: '14:03' },
  { side: 'out', text: 'תודה! ויצרן הרכב?', time: '14:03' },
  { side: 'in', text: 'טויוטה קורולה', time: '14:04' },
  { side: 'out', text: '✅ מעביר אותך לסוכן שלנו עם כל הפרטים — יחזור אליך תוך 10 דקות!', time: '14:04' },
];

const BEFORE_AFTER = [
  {
    before: 'ליד ממלא טופס ← שום דבר קורה',
    after: 'ליד ממלא טופס ← וואטסאפ תוך שניות',
  },
  {
    before: 'לידים נאספים ב-Excel ← מאחרים לטפל',
    after: 'לידים נכנסים ל-CRM ← נציג מקבל התראה מיידית',
  },
  {
    before: 'מעקב ידני ← שכחות ואובדן לידים',
    after: 'מעקב אוטומטי ← אפס לידים אובדים',
  },
  {
    before: 'אין נראות ← לא יודעים מה עובד',
    after: 'דוחות לפי דף ← יודעים מה מביא ROI',
  },
];

const FAQ = [
  { q: 'האם צריך לשנות את דף הנחיתה שלי?', a: 'לא. רק מוסיפים Webhook URL אחד בהגדרות הטופס. התהליך לוקח 5 דקות בכל פלטפורמה מוכרת.' },
  { q: 'מה קורה אם הלקוח לא בוואטסאפ?', a: 'גמבוט שומר את הליד ב-CRM בכל מקרה. אפשר לשלוח גם SMS כ-fallback, ולמייל אם יש.' },
  { q: 'האם הבוט יכול לנהל שיחה בעברית מלאה?', a: 'כן! הבוט פועל בעברית מלאה, מבין הקשר שיחה ומשיב באופן טבעי. ניתן לתכנת תגובות ספציפיות או להשתמש ב-AI.' },
  { q: 'כמה דפי נחיתה אפשר לחבר?', a: 'כמה שרוצים. כל דף מקבל Webhook URL ייעודי, ולידים מתויגים לפי מקור. אין מגבלה על כמות הדפים.' },
  { q: 'מה עם GDPR ופרטיות?', a: 'גמבוט עומד בדרישות GDPR ופרטיות ישראל. כל הנתונים מוצפנים ומאוחסנים בשרתים מאובטחים.' },
];

export default function LandingPagesPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setStatus('loading');
    try {
      await sendLeadWebhook({ ...formData, source: 'landing-pages-page' });
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
          <div className={styles.badge}>🌐 דפי נחיתה + וואטסאפ</div>
          <h1 className={styles.heroTitle}>
            כל ליד מדף הנחיתה —
            <br /><span className={styles.heroHighlight}>וואטסאפ אוטומטי תוך שניות</span>
          </h1>
          <p className={styles.heroDesc}>
            חברו כל דף נחיתה לגמבוט בלחיצה. כל שליחת טופס מופיעה ב-CRM ושולחת הודעת וואטסאפ אישית תוך שניות — ללא קוד, ללא Excel, ללא אובדן לידים.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.ctaPrimary} onClick={() => window.location.href = 'https://gambot.co.il/OnboardingProcess'}>
              🚀 ניסיון חינם 30 יום
            </button>
            <button className={styles.ctaSecondary} onClick={trackWAClick}>
              💬 הדגמה בוואטסאפ
            </button>
          </div>
          <p className={styles.ctaSub}>ללא כרטיס אשראי · חיבור תוך 5 דקות · Wix, Webflow, WordPress ועוד</p>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>לפני ואחרי גמבוט</h2>
          <p className={styles.sectionDesc}>הבדל שמורגש מהיום הראשון</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '36px' }}>
            {BEFORE_AFTER.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <div style={{ background: '#fff5f5', padding: '16px', fontSize: '0.85rem', color: '#991b1b', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#dc2626', marginBottom: '6px' }}>❌ לפני</div>
                  {row.before}
                </div>
                <div style={{ background: '#f0fdf4', padding: '16px', fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#16a34a', marginBottom: '6px' }}>✅ אחרי</div>
                  {row.after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className={styles.integrations} style={{ background: '#f8fafc' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🔗 עובד עם כל פלטפורמת דפי נחיתה</h2>
          <p className={styles.sectionDesc}>Webhook פשוט — חיבור ב-5 דקות, ללא קוד</p>
          <div className={styles.intGrid}>
            {PLATFORMS.map((p, i) => (
              <div key={i} className={styles.intCard}>
                <div className={styles.intIcon}>{p.icon}</div>
                <strong>{p.name}</strong>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONVERSATION MOCK */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className={styles.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', background: '#f0fdf4', color: '#16a34a', padding: '5px 14px', borderRadius: '20px', fontSize: '0.82rem', marginBottom: '16px', fontWeight: 700 }}>💬 שיחה אמיתית</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 14px' }}>הליד ממלא טופס → הבוט מתחיל לעבוד מיד</h2>
              <p style={{ color: '#64748b', lineHeight: 1.7, margin: '0 0 20px' }}>בוט גמבוט לא רק שולח "תודה" — הוא מנהל שיחת מכירה אמיתית, אוסף פרטים, מסנן לידים ומעביר לנציג רק מי שמוכן לקנות.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['שאלות סיווג אוטומטיות', 'שמירת כל הפרטים ב-CRM', 'העברה לנציג בזמן הנכון', 'תזכורות אוטומטיות לאי-מענה'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: '#25D366', fontWeight: 900 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ background: '#f0fdf4', borderRadius: '20px', padding: '20px', maxWidth: '340px', margin: '0 auto', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #dcfce7', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '36px', height: '36px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem' }}>🤖</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>ABC ביטוח — Bot</div>
                    <div style={{ fontSize: '0.72rem', color: '#16a34a' }}>● מחובר</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {CONVERSATION_MOCK.map((msg, i) => (
                    <div key={i} style={{
                      alignSelf: msg.side === 'out' ? 'flex-end' : 'flex-start',
                      background: msg.side === 'out' ? '#dcf8c6' : '#fff',
                      border: msg.side === 'in' ? '1px solid #e2e8f0' : 'none',
                      borderRadius: msg.side === 'out' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      padding: '8px 12px',
                      maxWidth: '85%',
                      fontSize: '0.78rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line',
                    }}>
                      {msg.text}
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '3px', textAlign: 'left' }}>{msg.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features} style={{ background: '#f8fafc' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🌟 כל מה שמקבלים כשמחברים דפי נחיתה לגמבוט</h2>
          <p className={styles.sectionDesc}>לא רק Webhook — מערכת שלמה לניהול ה-leads</p>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard} style={{ '--accent': f.color }}>
                <div className={styles.featureIcon} style={{ background: f.color + '15' }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
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
          <h2 className={styles.ctaTitle}>🌐 חברו את דפי הנחיתה שלכם לוואטסאפ</h2>
          <p className={styles.ctaDesc}>5 דקות הגדרה · ניסיון חינם 30 יום · ללא כרטיס אשראי</p>
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
            <span>──────</span><span>או</span><span>──────</span>
          </div>
          <button className={styles.ctaWaBtn} onClick={trackWAClick}>💬 שלחו לנו וואטסאפ</button>
          <p className={styles.privacy}>לא נשתמש בפרטים שלכם לשום דבר מלבד יצירת קשר</p>
        </div>
      </section>
    </div>
  );
}

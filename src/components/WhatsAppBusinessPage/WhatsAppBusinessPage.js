'use client';
import { useState } from 'react';
import styles from './WhatsAppBusinessPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('היי גמבוט 👋 אני רוצה לשמוע על מערכת הוואטסאפ לעסקים');

function trackWAClick(location = 'button') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: location });
    window.gtag('event', 'conversion', {
      send_to: 'AW-18018385768/tTojCPDWio0cEOj-6o9D',
      value: 1.0,
      currency: 'ILS',
    });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

const PAINS = [
  { icon: '😤', title: 'אין סדר בשיחות', desc: 'מלא שיחות פתוחות, לא יודעים מי טיפל, מה הסטטוס, מה הלאה' },
  { icon: '📱', title: 'כולם על אותו מספר', desc: 'הנציגים מתחלפים, לקוחות מבלבלים, אין מעקב ואין אחריות' },
  { icon: '🔀', title: 'בלאגן של מידע', desc: 'לידים פה, חשבוניות שם, משימות בוואטסאפ — שום דבר לא מסונכרן' },
  { icon: '🌙', title: 'פניות נופלות', desc: 'לקוח כתב בלילה, נפל בין הכיסאות, עזב למתחרה — ולא ידעתם' },
];

const MODULES = [
  {
    id: 'inbox',
    icon: '💬',
    title: 'תיבת הודעות משותפת',
    color: '#128C7E',
    features: [
      'כל נציג מחובר עם המשתמש האישי שלו',
      'כל הודעה מתועדת עם שם הנציג והשעה',
      'הגדרת בעלים לכל שיחה — תמיד ידוע מי אחראי',
      'סטטוס שיחה: פתוח / בטיפול / ממתין / סגור',
      'העברת שיחה בין נציגים תוך שניות',
      'הערות פנימיות שהלקוח לא רואה',
    ],
  },
  {
    id: 'routing',
    icon: '🎯',
    title: 'ניתוב וסינון חכם',
    color: '#128C7E',
    features: [
      'כל נציג רואה רק את התחום שלו',
      'מכירות ראה לידים חדשים בלבד',
      'חשבונות ראה פניות תשלום בלבד',
      'שירות לקוחות ראה תקלות ובקשות',
      'תור עבודה אישי לכל נציג',
      'כללי ניתוב אוטומטי לפי מילות מפתח',
    ],
  },
  {
    id: 'crm',
    icon: '📊',
    title: 'CRM מובנה',
    color: '#2563eb',
    features: [
      'כל לקוח עם קאונטר שיחות, הסטוריה מלאה',
      'לידים עם שלבים ופייפליין',
      'פניות (Cases) עם SLA ועדיפות',
      'משימות עם תאריך יעד ואחראי',
      'שדות דינמיים לפי סוג לקוח/עסק',
      'ציר זמן מלא לכל קשר',
    ],
  },
  {
    id: 'quotes',
    icon: '📄',
    title: 'הצעות מחיר ותהליך מכירה',
    color: '#d97706',
    features: [
      'יצירת הצעת מחיר ישירות מהשיחה',
      'חיבור ליד → הצעת מחיר → עסקה',
      'שליחת הצעה בוואטסאפ תוך שניות',
      'חתימה דיגיטלית על ההצעה',
      'מעקב: נצפתה / אושרה / נדחתה',
      'דוחות ביצועי מכירות לפי נציג',
    ],
  },
  {
    id: 'reports',
    icon: '📈',
    title: 'דוחות מתקדמים',
    color: '#7c3aed',
    features: [
      'זמן מענה ממוצע לפי נציג וצוות',
      'ניתוח שיחות: כמות, משך, סגירה',
      'ביצועי לידים לפי מקור וסטטוס',
      'ניתוח פניות ו-SLA',
      'עומס עבודה לפי נציג',
      'ייצוא לאקסל / Google Sheets',
    ],
  },
];

const WORKFLOW = [
  { icon: '📩', step: '01', title: 'לקוח כותב', desc: 'מגיע לתיבה המשותפת עם כל ההיסטוריה' },
  { icon: '🎯', step: '02', title: 'מנותב אוטומטית', desc: 'לנציג הנכון לפי תחום, כישורים או תור' },
  { icon: '👤', step: '03', title: 'נציג טוען', desc: 'מטפל, עונה, רושם הערות — הכל מתועד' },
  { icon: '📋', step: '04', title: 'נוצר ליד/פנייה', desc: 'תוך כפתור אחד, עם כל מידע השיחה' },
  { icon: '📄', step: '05', title: 'הצעת מחיר', desc: 'נשלחת ישירות מהמערכת לוואטסאפ' },
  { icon: '✅', step: '06', title: 'עסקה נסגרת', desc: 'מופיעה בדוחות בזמן אמת' },
];

const FAQS = [
  {
    q: 'האם כל נציג מחובר עם החשבון שלו?',
    a: 'כן. כל נציג נכנס למערכת עם שם משתמש וסיסמה שלו. כל הודעה שהוא שולח מתועדת על שמו — הלקוח לא רואה את ההבדל, אבל המנהל יודע בדיוק מי כתב מה ומתי.',
  },
  {
    q: 'האם ניתן לקבוע שנציג מכירות לא יראה שיחות שירות?',
    a: 'בדיוק. מגדירים לכל נציג הרשאות תצוגה — הוא רואה רק את תחום העבודה שלו. איש מכירות רואה לידים, שירות לקוחות רואה פניות, ומנהל רואה הכל.',
  },
  {
    q: 'מה ההבדל בין "ליד" ל"פנייה" במערכת?',
    a: 'ליד (Lead) הוא לקוח פוטנציאלי בתהליך מכירה — עם שלבים, ערך עסקה וסגירה. פנייה (Case) היא בקשת שירות/תמיכה — עם SLA, עדיפות וזמן פתרון. שתי הישויות מחוברות לאותו לקוח.',
  },
  {
    q: 'איך מתבצע תהליך הצעת המחיר?',
    a: 'מהשיחה בוואטסאפ, לוחצים "צור הצעת מחיר", מוסיפים פריטים ומחירים, שולחים ישירות ללקוח בוואטסאפ. הלקוח יכול לאשר/לדחות ואפילו לחתום דיגיטלית — הכל מתועד בתיק הלקוח.',
  },
  {
    q: 'האם יש חיבור לוואטסאפ הרגיל שלנו?',
    a: 'המערכת עובדת עם WhatsApp Business API (WABA) — מספר עסקי רשמי שמאפשר ריבוי נציגים, אוטומציה ואינטגרציות. אנחנו מסייעים בתהליך הרישום.',
  },
  {
    q: 'כמה נציגים ניתן לחבר?',
    a: 'אין מגבלה טכנית. החבילות מתומחרות לפי כמות נציגים — ניתן להתחיל עם 2-3 ולהרחיב בכל עת.',
  },
];

function ModuleCard({ mod, isActive, onClick }) {
  return (
    <div
      className={`${styles.moduleCard} ${isActive ? styles.moduleCardActive : ''}`}
      onClick={onClick}
      style={isActive ? { borderColor: mod.color, background: `${mod.color}08` } : {}}
    >
      <div className={styles.moduleCardHeader}>
        <span className={styles.moduleIcon}>{mod.icon}</span>
        <h3 className={styles.moduleTitle}>{mod.title}</h3>
        <span className={styles.moduleArrow}>{isActive ? '▲' : '▼'}</span>
      </div>
      {isActive && (
        <ul className={styles.moduleFeatures}>
          {mod.features.map((f, i) => (
            <li key={i} style={{ color: mod.color === '#fff' ? '#fff' : 'inherit' }}>
              <span style={{ color: mod.color }}>✓</span> {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqOpen : ''}`}>
      <button className={styles.faqQ} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className={styles.faqArrow}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <p className={styles.faqA}>{a}</p>}
    </div>
  );
}

function MiniLeadForm({ source = 'whatsapp-business-page' }) {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone) return;
    setStatus('loading');
    try {
      await Promise.allSettled([
        fetch('https://prod-00.northeurope.logic.azure.com:443/workflows/24826d9f1f30448cb12884561d7bcc2b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RMrmjA9SPjryV5VE5iP8elY_V6tFdxhMgjs-zQI8FPQ', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source, ClientId: 'R9f6r4oe5PSCLr6CnYRQ' }),
        }),
        sendLeadWebhook({ name: form.name, phone: form.phone, source }),
        sendThankYouEmail({ name: form.name, email: '', source }),
      ]);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead', { event_category: 'lead_form', event_label: source });
        window.gtag('event', 'conversion', { send_to: 'AW-18018385768/zoGcCMK4-IwcEOj-6o9D', value: 1.0, currency: 'ILS' });
      }
      window.location.href = '/תודה';
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className={styles.miniForm} onSubmit={handleSubmit} dir="rtl">
      <input type="text" placeholder="שם מלא *" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className={styles.miniInput} required />
      <input type="tel" placeholder="מספר טלפון *" value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        className={styles.miniInput} dir="ltr" required />
      <button type="submit" className={styles.miniSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? '⏳ שולח...' : '🚀 קבלו הדגמה חינמית'}
      </button>
      {status === 'error' && (
        <p className={styles.formError}>שגיאה — <a href={`https://wa.me/${WA_NUMBER}`}>שלחו וואטסאפ</a></p>
      )}
    </form>
  );
}

export default function WhatsAppBusinessPage() {
  const [activeModule, setActiveModule] = useState('inbox');

  return (
    <div className={styles.page} dir="rtl">

      {/* Header */}
      <header className={styles.header}>
        <img src="/new_logo.png" alt="Gambot" className={styles.logo} />
        <div className={styles.headerRight}>
          <span className={styles.headerBadge}>🏆 שותף Meta רשמי</span>
          <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noreferrer"
            className={styles.headerWa}
            onClick={(e) => { e.preventDefault(); trackWAClick('header'); }}>
            💬 דברו איתנו
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>💬 ריבוי נציגים · CRM מובנה · דוחות מתקדמים</div>
          <h1 className={styles.heroTitle}>
            ניהול כל שיחות הוואטסאפ<br />
            <span className={styles.heroHighlight}>במקום אחד — עם סדר מלא</span>
          </h1>
          <p className={styles.heroDesc}>
            כל נציג עם חשבון משלו, כל שיחה עם בעלים וסטטוס, כל ליד וכל פנייה מחוברים —
            מ<strong>תיבת הוואטסאפ</strong> ועד <strong>חתימה על הצעת מחיר</strong> — הכל במקום אחד
          </p>
          <div className={styles.heroActions}>
            <button className={styles.ctaPrimary} onClick={() => trackWAClick('hero_primary')}>
              🚀 קבלו הדגמה חינמית
            </button>
            <button className={styles.ctaSecondary} onClick={() => trackWAClick('hero_secondary')}>
              💬 שאלו אותנו בוואטסאפ
            </button>
          </div>
          <p className={styles.ctaSub}>⚡ ניסיון חינם · ללא כרטיס אשראי · חיבור תוך ימים</p>

          {/* Hero visual — inbox mockup */}
          <div className={styles.heroMockup}>
            <div className={styles.mockupSidebar}>
              <div className={styles.mockupSidebarTitle}>📥 תיבת נכנסות</div>
              {[
                { name: 'דוד כהן', msg: 'מה המחיר לחבילה...', status: 'פתוח', agent: 'יוסי', color: '#ef4444' },
                { name: 'רחל לוי', msg: 'רוצה לקבוע פגישה', status: 'בטיפול', agent: 'מיכל', color: '#f59e0b' },
                { name: 'מוסי אבו', msg: 'תודה על השירות!', status: 'סגור', agent: 'יוסי', color: '#10b981' },
                { name: 'שרה גולד', msg: 'יש בעיה עם ה...', status: 'ממתין', agent: '—', color: '#6b7280' },
              ].map((row, i) => (
                <div key={i} className={styles.mockupRow}>
                  <div className={styles.mockupAvatar}>{row.name[0]}</div>
                  <div className={styles.mockupRowInfo}>
                    <span className={styles.mockupName}>{row.name}</span>
                    <span className={styles.mockupMsg}>{row.msg}</span>
                  </div>
                  <div className={styles.mockupRowMeta}>
                    <span className={styles.mockupStatus} style={{ color: row.color, borderColor: row.color }}>{row.status}</span>
                    <span className={styles.mockupAgent}>{row.agent}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.mockupChat}>
              <div className={styles.mockupChatHeader}>
                <strong>דוד כהן</strong>
                <span className={styles.mockupChatStatus}>🟡 בטיפול · יוסי</span>
              </div>
              <div className={styles.mockupMessages}>
                <div className={styles.mockupMsgIn}>מה המחיר לחבילה הבסיסית?</div>
                <div className={styles.mockupMsgOut}>
                  <span className={styles.mockupAgent2}>יוסי מ.</span>
                  החבילה הבסיסית מתחילה מ-XXX ₪/חודש, כוללת עד 5 נציגים 📋
                </div>
                <div className={styles.mockupNote}>📝 הערה פנימית: לקוח VIP — תן מחיר מיוחד</div>
                <div className={styles.mockupMsgIn}>אשמח לשמוע יותר פרטים</div>
              </div>
              <div className={styles.mockupActions}>
                <button className={styles.mockupActionBtn} style={{ background: '#2563eb' }}>+ צור ליד</button>
                <button className={styles.mockupActionBtn} style={{ background: '#d97706' }}>📄 הצעת מחיר</button>
                <button className={styles.mockupActionBtn} style={{ background: '#128C7E' }}>✅ סגור</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN → SOLUTION */}
      <section className={styles.pains}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>😩 הבעיה עם וואטסאפ ביזנס הרגיל</h2>
          <div className={styles.painsGrid}>
            {PAINS.map((p, i) => (
              <div key={i} className={styles.painCard}>
                <span className={styles.painIcon}>{p.icon}</span>
                <strong>{p.title}</strong>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.painBridge}>
            <div className={styles.painBridgeInner}>
              <strong>📌 גמבוט פותר את כל זה — עם מערכת מדויקת שכל שיחה, ליד ועסקה נמצאים במקום אחד</strong>
            </div>
          </div>
        </div>
      </section>

      {/* MODULES ACCORDION */}
      <section className={styles.modules}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🧩 כל מה שיש במערכת</h2>
          <p className={styles.sectionDesc}>לחצו על כל מודול לפרטים</p>
          <div className={styles.modulesGrid}>
            {MODULES.map(mod => (
              <ModuleCard
                key={mod.id}
                mod={mod}
                isActive={activeModule === mod.id}
                onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className={styles.workflow}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>⚡ מה נראה כמו תהליך עבודה מלא</h2>
          <p className={styles.sectionDesc}>מהודעה ראשונה ועד עסקה סגורה — בתוך מערכת אחת</p>
          <div className={styles.workflowGrid}>
            {WORKFLOW.map((w, i) => (
              <div key={i} className={styles.workflowStep}>
                <div className={styles.workflowIcon}>{w.icon}</div>
                <div className={styles.workflowNum}>{w.step}</div>
                <strong>{w.title}</strong>
                <p>{w.desc}</p>
                {i < WORKFLOW.length - 1 && <div className={styles.workflowArrow}>←</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MID CTA */}
      <section className={styles.midCta}>
        <div className={styles.container}>
          <div className={styles.midCtaInner}>
            <div className={styles.midCtaText}>
              <h3>💡 רוצים לראות את המערכת בפעולה?</h3>
              <p>הדגמה חיה של 20 דקות — נראה לכם בדיוק איך זה ייראה בעסק שלכם</p>
            </div>
            <button className={styles.midCtaBtn} onClick={() => trackWAClick('mid_cta')}>
              📞 הזמינו הדגמה עכשיו
            </button>
          </div>
        </div>
      </section>

      {/* REPORTS */}
      <section className={styles.reports}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>📊 דוחות שגורמים לכם לקבל החלטות טובות</h2>
          <div className={styles.reportsGrid}>
            {[
              { icon: '⏱️', title: 'זמני מענה', desc: 'כמה מהר כל נציג עונה — לפי שעה, יום, שבוע' },
              { icon: '👥', title: 'עומס נציגים', desc: 'מי עמוס מדי, מי פנוי — לחלוקת עבודה נכונה' },
              { icon: '🏆', title: 'ביצועי מכירות', desc: 'לידים, הצעות מחיר, עסקאות שנסגרו — לפי נציג' },
              { icon: '📋', title: 'ניתוח פניות', desc: 'כמות, נושאים, זמן פתרון, עמידה ב-SLA' },
              { icon: '📈', title: 'מגמות שיחות', desc: 'שעות עומס, ימים עמוסים, עונתיות' },
              { icon: '💰', title: 'דוח הכנסות', desc: 'הצעות שהתקבלו, סכומים, המרות לפי מקור' },
            ].map((r, i) => (
              <div key={i} className={styles.reportCard}>
                <div className={styles.reportIcon}>{r.icon}</div>
                <strong>{r.title}</strong>
                <p>{r.desc}</p>
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
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>🚀 מוכנים להפסיק לאבד שיחות?</h2>
          <p className={styles.ctaDesc}>
            השאירו פרטים — תוך 24 שעות נציג ייצור קשר להדגמה חיה
          </p>
          <MiniLeadForm source="whatsapp-business-page" />
          <div className={styles.ctaOr}>
            <span>או</span>
            <button className={styles.ctaWaBtn} onClick={() => trackWAClick('cta_bottom')}>
              💬 שלחו לנו וואטסאפ
            </button>
          </div>
          <p className={styles.privacy}>🔒 ניסיון חינם · ללא התחייבות · פרטיכם לא יועברו לצד שלישי</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Gambot · שותף Meta רשמי · <a href="/privacy">מדיניות פרטיות</a></p>
      </footer>
    </div>
  );
}

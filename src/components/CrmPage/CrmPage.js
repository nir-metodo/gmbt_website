'use client';
import { useState } from 'react';
import styles from './CrmPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('היי גמבוט 👋 אני רוצה לשמוע על ה-CRM שלכם');

function trackWAClick(location = 'button') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: location });
    window.gtag('event', 'conversion', { send_to: 'AW-18018385768/tTojCPDWio0cEOj-6o9D', value: 1.0, currency: 'ILS' });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

const INTEGRATIONS = [
  { icon: '📘', name: 'Facebook CTWA', desc: 'לחיצה על מודעה → שיחת וואטסאפ → ליד נוצר אוטומטית' },
  { icon: '📋', name: 'Facebook Forms', desc: 'מלא טופס לידים בפייסבוק → מיד מופיע ב-CRM' },
  { icon: '🌐', name: 'דפי נחיתה', desc: 'הטמעת קוד פשוט — כל ליד מדף הנחיתה נכנס ישירות' },
  { icon: '💬', name: 'וואטסאפ', desc: 'ליד שפנה בוואטסאפ → נוצר קשר ופותחת שיחה אוטומטית' },
  { icon: '🔗', name: 'Webhook / API', desc: 'חיבור לכל מערכת — Zapier, Make, API פרטי' },
];

const KANBAN_STAGES = [
  { name: 'ליד חדש', color: '#6b7280', leads: [
    { name: 'דוד כהן', value: '₪12,000', source: 'FB Ads' },
    { name: 'רחל לוי', value: '₪8,500', source: 'Landing Page' },
  ]},
  { name: 'יצרנו קשר', color: '#2563eb', leads: [
    { name: 'יוסי מזרחי', value: '₪22,000', source: 'WhatsApp' },
  ]},
  { name: 'הצעת מחיר', color: '#d97706', leads: [
    { name: 'מיכל ברק', value: '₪35,000', source: 'FB Forms' },
    { name: 'אבי גל', value: '₪15,000', source: 'CTWA' },
  ]},
  { name: 'משא ומתן', color: '#7c3aed', leads: [
    { name: 'שרה גולד', value: '₪48,000', source: 'Landing Page' },
  ]},
  { name: 'נסגר ✓', color: '#25D366', leads: [
    { name: 'נועם כץ', value: '₪29,000', source: 'WhatsApp' },
  ]},
];

const FEATURES = [
  {
    icon: '📊',
    title: 'קנבן לידים ויזואלי',
    desc: 'גרור ושחרר בין שלבים, צבעים, ערכים, מקורות — מבט ציפור על כל הפייפליין',
    color: '#2563eb',
  },
  {
    icon: '🔗',
    title: 'חיבורים מכל מקום',
    desc: 'Facebook CTWA, Forms, דפי נחיתה, וואטסאפ, API — כל ליד נכנס אוטומטית',
    color: '#1877f2',
  },
  {
    icon: '🎨',
    title: 'שדות דינמיים',
    desc: 'הוסיפו שדות מותאמים לסוג העסק — תאריך, רשימה, טקסט, מספר, קובץ',
    color: '#7c3aed',
  },
  {
    icon: '💬',
    title: 'וואטסאפ מתוך הליד',
    desc: 'שלחו הודעה ישירות מכרטיסיית הליד — כל ההיסטוריה בתוך המערכת',
    color: '#25D366',
  },
  {
    icon: '✅',
    title: 'משימות עם התראות',
    desc: 'צרו משימה לליד, הגדירו תאריך ואחראי — קבלו התראה בוואטסאפ/מייל בזמן',
    color: '#ef4444',
  },
  {
    icon: '📄',
    title: 'הצעות מחיר + חתימה',
    desc: 'בנו הצעת מחיר תוך דקות, שלחו בוואטסאפ, הלקוח חותם דיגיטלית — הכל מתועד',
    color: '#d97706',
  },
  {
    icon: '📋',
    title: 'פניות (Cases)',
    desc: 'ניהול בקשות שירות עם SLA, עדיפות ואחראי — מחוברות לאותו לקוח',
    color: '#0891b2',
  },
  {
    icon: '📈',
    title: 'דוחות מתקדמים',
    desc: 'המרות לפי מקור, ביצועי נציג, זמני טיפול, ערך פייפליין — הכל גרפי וניתן לייצוא',
    color: '#059669',
  },
];

const LEAD_CARD = {
  name: 'מיכל ברק',
  phone: '050-1234567',
  source: 'Facebook CTWA',
  stage: 'הצעת מחיר',
  value: '₪35,000',
  owner: 'יוסי מ.',
  tags: ['VIP', 'חם'],
  fields: [
    { label: 'גודל עסק', value: '15-50 עובדים' },
    { label: 'תחום', value: 'ייעוץ עסקי' },
    { label: 'תקציב', value: '30-40K ₪' },
  ],
  tasks: [
    { done: true, text: 'שיחת היכרות ראשונית' },
    { done: false, text: 'שלח הצעת מחיר — עד 25/3', urgent: true },
    { done: false, text: 'מעקב אחרי ההצעה' },
  ],
  messages: [
    { side: 'out', text: 'שלום מיכל! אשמח לשלוח לך הצעת מחיר' },
    { side: 'in', text: 'בטח, תודה! מחכה' },
  ],
};

const REPORTS = [
  { icon: '📊', title: 'המרות לפי מקור', desc: 'כמה לידים הגיעו מ-CTWA, Forms, דפי נחיתה — ואיזה מקור ממיר הכי טוב' },
  { icon: '👤', title: 'ביצועי נציג', desc: 'כמה לידים כל נציג טיפל, סגר, ממוצע זמן לסגירה' },
  { icon: '💰', title: 'ערך פייפליין', desc: 'כמה כסף יש בכל שלב ומה הסיכוי לסגור — תחזית הכנסות' },
  { icon: '⏱️', title: 'זמני טיפול', desc: 'כמה זמן ליד ממתין בכל שלב — מזהה צווארי בקבוק' },
  { icon: '📋', title: 'דוח פניות', desc: 'כמות, SLA, נושאים חוזרים — לשיפור השירות' },
  { icon: '📑', title: 'הצעות מחיר', desc: 'נשלחו / נצפו / אושרו — אחוז המרה מהצעה לעסקה' },
];

const FAQS = [
  {
    q: 'איך לידים מפייסבוק נכנסים אוטומטית?',
    a: 'מחברים את דף הפייסבוק שלכם פעם אחת. מאותו רגע — כל ליד מ-Facebook Lead Forms או מ-Click to WhatsApp Ads מופיע ב-CRM תוך שניות, עם כל הפרטים שמילא. ללא העתקות ידניות.',
  },
  {
    q: 'מה זה CTWA ואיך זה עובד?',
    a: 'CTWA — Click to WhatsApp Ads. מודעה בפייסבוק/אינסטגרם שבלחיצה פותחת שיחת וואטסאפ. הבוט שלנו מקבל את הליד, שואל שאלות, ומעביר ל-CRM כליד מוכשר עם כל המידע.',
  },
  {
    q: 'האם ניתן להוסיף שדות מותאמים לסוג העסק?',
    a: 'כן — שדות דינמיים. מוסיפים שדות כמו "תקציב", "גודל עסק", "תחום", "תאריך אירוע" — כל שדה שרלוונטי לכם. אפשר גם ליצור סקשנים ולארגן לפי קבוצות.',
  },
  {
    q: 'איך שולחים הצעת מחיר?',
    a: 'מתוך כרטיסיית הליד, לוחצים "הצעת מחיר" — בוחרים פריטים, מחירים, הנחות. ההצעה נשלחת ישירות לוואטסאפ של הלקוח. הלקוח לוחץ "אישור" וחותם דיגיטלית — הכל מתועד בתיק הלקוח.',
  },
  {
    q: 'איך עובדות ההתראות על משימות?',
    a: 'כשיוצרים משימה מגדירים תאריך ואחראי. ב-X שעות לפני — הנציג מקבל התראה בוואטסאפ ו/או במייל. אפשר גם הגדרת תזכורת חוזרת אם המשימה לא טופלה.',
  },
  {
    q: 'האם יש אפשרות לייצוא נתונים?',
    a: 'כן — ייצוא לאקסל/CSV מכל רשימה ודוח. אפשר גם חיבור ל-Google Sheets לסנכרון חי.',
  },
];

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

function MiniLeadForm({ source = 'crm-landing-page' }) {
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

export default function CrmPage() {
  const [activeTab, setActiveTab] = useState('kanban');

  return (
    <div className={styles.page} dir="rtl">

      {/* Header */}
      <header className={styles.header}>
        <img src="/new_logo.png" alt="Gambot" className={styles.logo} />
        <div className={styles.headerRight}>
          <span className={styles.headerBadge}>🏆 CRM + WhatsApp + דוחות</span>
          <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noreferrer"
            className={styles.headerWa}
            onClick={(e) => { e.preventDefault(); trackWAClick('header'); }}>
            💬 הדגמה חינמית
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>🚀 CRM חכם · וואטסאפ · לידים · משימות · הצעות מחיר</div>
          <h1 className={styles.heroTitle}>
            כל הלידים, המשימות והעסקאות<br />
            <span className={styles.heroHighlight}>במקום אחד — בלי לאבד כלום</span>
          </h1>
          <p className={styles.heroDesc}>
            לידים מפייסבוק, CTWA ודפי נחיתה נכנסים אוטומטית.
            קנבן יפה, שדות מותאמים, התכתבות בוואטסאפ מהכרטיסייה,
            משימות עם התראות, והצעות מחיר עם חתימה דיגיטלית.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.ctaPrimary} onClick={() => trackWAClick('hero_primary')}>
              🚀 קבלו הדגמה חינמית
            </button>
            <button className={styles.ctaSecondary} onClick={() => trackWAClick('hero_secondary')}>
              💬 שאלו בוואטסאפ
            </button>
          </div>
          <p className={styles.ctaSub}>⚡ ניסיון חינם חודש · ללא כרטיס אשראי · חיבור תוך ימים</p>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className={styles.integrations}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🔗 הלידים מגיעים מכל מקום — אוטומטית</h2>
          <p className={styles.sectionDesc}>חיבור פעם אחת — אחר כך הכל נכנס לבד</p>
          <div className={styles.intGrid}>
            {INTEGRATIONS.map((int, i) => (
              <div key={i} className={styles.intCard}>
                <div className={styles.intIcon}>{int.icon}</div>
                <strong>{int.name}</strong>
                <p>{int.desc}</p>
              </div>
            ))}
          </div>
          {/* Facebook CTWA spotlight */}
          <div className={styles.ctwaSpotlight}>
            <div className={styles.ctwaLeft}>
              <div className={styles.ctwaBadge}>📘 Facebook CTWA</div>
              <h3>לחיצה על מודעה → ליד חם ב-CRM</h3>
              <p>מודעת פייסבוק/אינסטגרם → הלקוח לוחץ → נפתחת שיחת וואטסאפ → הבוט אוסף פרטים → ליד מלא נכנס ל-CRM — ב-60 שניות, אוטומטית, ללא נציג.</p>
              <ul className={styles.ctwaList}>
                <li>✓ עלות רכישת ליד נמוכה בהרבה ממודעות טפסים</li>
                <li>✓ הליד כבר בשיחה — חם מאוד</li>
                <li>✓ הבוט מסנן ומדרג לפני שנציג נוגע</li>
              </ul>
            </div>
            <div className={styles.ctwaRight}>
              <div className={styles.ctwaFlow}>
                {['📱 מודעה בפייסבוק', '💬 פותח וואטסאפ', '🤖 בוט אוסף פרטים', '📊 ליד ב-CRM', '👤 נציג מטפל'].map((step, i) => (
                  <div key={i} className={styles.ctwaFlowStep}>
                    <span>{step}</span>
                    {i < 4 && <span className={styles.ctwaArrow}>↓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KANBAN + LEAD CARD TABS */}
      <section className={styles.productDemo}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🎯 ניהול לידים שנראה כמו שצריך</h2>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === 'kanban' ? styles.tabActive : ''}`} onClick={() => setActiveTab('kanban')}>
              📊 קנבן לידים
            </button>
            <button className={`${styles.tab} ${activeTab === 'card' ? styles.tabActive : ''}`} onClick={() => setActiveTab('card')}>
              🗂️ כרטיסיית ליד
            </button>
          </div>

          {activeTab === 'kanban' && (
            <div className={styles.kanbanWrap}>
              <div className={styles.kanban}>
                {KANBAN_STAGES.map((stage, si) => (
                  <div key={si} className={styles.kanbanCol}>
                    <div className={styles.kanbanColHeader} style={{ borderTopColor: stage.color }}>
                      <span style={{ color: stage.color }}>●</span>
                      <span>{stage.name}</span>
                      <span className={styles.kanbanCount}>{stage.leads.length}</span>
                    </div>
                    {stage.leads.map((lead, li) => (
                      <div key={li} className={styles.kanbanCard}>
                        <div className={styles.kanbanCardName}>{lead.name}</div>
                        <div className={styles.kanbanCardMeta}>
                          <span className={styles.kanbanValue}>{lead.value}</span>
                          <span className={styles.kanbanSource}>{lead.source}</span>
                        </div>
                        <div className={styles.kanbanCardActions}>
                          <span>💬</span><span>✅</span><span>📄</span>
                        </div>
                      </div>
                    ))}
                    <button className={styles.kanbanAdd}>+ הוסף ליד</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className={styles.leadCardWrap}>
              <div className={styles.leadCard}>
                {/* Header */}
                <div className={styles.lcHeader}>
                  <div className={styles.lcAvatar}>{LEAD_CARD.name[0]}</div>
                  <div className={styles.lcInfo}>
                    <h3>{LEAD_CARD.name}</h3>
                    <p>{LEAD_CARD.phone} · {LEAD_CARD.source}</p>
                  </div>
                  <div className={styles.lcTags}>
                    {LEAD_CARD.tags.map((t, i) => (
                      <span key={i} className={styles.lcTag}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.lcMeta}>
                  <span>📌 {LEAD_CARD.stage}</span>
                  <span>💰 {LEAD_CARD.value}</span>
                  <span>👤 {LEAD_CARD.owner}</span>
                </div>

                <div className={styles.lcBody}>
                  {/* Dynamic fields */}
                  <div className={styles.lcSection}>
                    <div className={styles.lcSectionTitle}>🎨 שדות מותאמים</div>
                    {LEAD_CARD.fields.map((f, i) => (
                      <div key={i} className={styles.lcField}>
                        <span className={styles.lcFieldLabel}>{f.label}</span>
                        <span className={styles.lcFieldValue}>{f.value}</span>
                      </div>
                    ))}
                    <button className={styles.lcAddField}>+ הוסף שדה</button>
                  </div>

                  {/* Tasks */}
                  <div className={styles.lcSection}>
                    <div className={styles.lcSectionTitle}>✅ משימות</div>
                    {LEAD_CARD.tasks.map((t, i) => (
                      <div key={i} className={`${styles.lcTask} ${t.urgent ? styles.lcTaskUrgent : ''}`}>
                        <span className={t.done ? styles.lcTaskDone : styles.lcTaskTodo}>
                          {t.done ? '✅' : '⬜'}
                        </span>
                        <span className={t.done ? styles.lcTaskTextDone : ''}>{t.text}</span>
                        {t.urgent && <span className={styles.lcUrgentTag}>🔔 דחוף</span>}
                      </div>
                    ))}
                    <button className={styles.lcAddField}>+ משימה חדשה</button>
                  </div>

                  {/* WhatsApp chat */}
                  <div className={styles.lcSection}>
                    <div className={styles.lcSectionTitle}>💬 וואטסאפ מהכרטיסייה</div>
                    <div className={styles.lcChat}>
                      {LEAD_CARD.messages.map((m, i) => (
                        <div key={i} className={m.side === 'out' ? styles.lcMsgOut : styles.lcMsgIn}>
                          {m.text}
                        </div>
                      ))}
                    </div>
                    <div className={styles.lcChatInput}>
                      <span className={styles.lcChatPlaceholder}>כתבו הודעה...</span>
                      <button className={styles.lcChatSend}>שלח 💬</button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.lcActions}>
                  <button className={styles.lcActionBtn} style={{ background: '#d97706' }}>📄 הצעת מחיר</button>
                  <button className={styles.lcActionBtn} style={{ background: '#2563eb' }}>📋 פנייה חדשה</button>
                  <button className={styles.lcActionBtn} style={{ background: '#25D366' }}>💬 שלח הודעה</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>✅ כל מה שיש ב-CRM</h2>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard} style={{ '--accent': f.color }}>
                <div className={styles.featureIcon} style={{ background: `${f.color}15`, color: f.color }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTES + ESIGN */}
      <section className={styles.quotes}>
        <div className={styles.container}>
          <div className={styles.quotesInner}>
            <div className={styles.quotesText}>
              <div className={styles.quotesBadge}>📄 הצעות מחיר + חתימה דיגיטלית</div>
              <h2>מהשיחה — להצעה — לסגירה</h2>
              <p>בנו הצעת מחיר תוך דקות ישירות מכרטיסיית הליד. שלחו בוואטסאפ תוך לחיצה אחת. הלקוח מאשר וחותם דיגיטלית — ללא הדפסה, ללא PDF. הכל מתועד אוטומטית בתיק הלקוח.</p>
              <ul className={styles.quotesList}>
                <li>✓ בניית הצעה עם פריטים, כמויות, הנחות ומע"מ</li>
                <li>✓ שליחה ישירה לוואטסאפ של הלקוח</li>
                <li>✓ מעקב: נצפתה / אושרה / נדחתה</li>
                <li>✓ חתימה דיגיטלית חוקית מהפלאפון</li>
                <li>✓ PDF אוטומטי לאחר אישור</li>
              </ul>
              <button className={styles.quotesBtn} onClick={() => trackWAClick('quotes')}>
                💬 ראו איך זה עובד
              </button>
            </div>
            <div className={styles.quotesMockup}>
              <div className={styles.quoteMock}>
                <div className={styles.quoteMockHeader}>📄 הצעת מחיר #142</div>
                <div className={styles.quoteMockClient}>לכבוד: מיכל ברק</div>
                <table className={styles.quoteMockTable}>
                  <thead>
                    <tr><th>פריט</th><th>כמות</th><th>מחיר</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>חבילת CRM שנתית</td><td>1</td><td>₪24,000</td></tr>
                    <tr><td>הגדרה ואינטגרציות</td><td>1</td><td>₪4,000</td></tr>
                    <tr><td>הדרכת צוות</td><td>2</td><td>₪2,000</td></tr>
                  </tbody>
                </table>
                <div className={styles.quoteMockTotal}>
                  <span>סה"כ לפני מע"מ:</span><strong>₪30,000</strong>
                </div>
                <div className={styles.quoteMockSign}>
                  <button className={styles.quoteMockBtn}>✍️ חתימה דיגיטלית</button>
                  <button className={styles.quoteMockBtnSec}>❌ דחה</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REPORTS */}
      <section className={styles.reports}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>📈 דוחות שעוזרים לקבל החלטות</h2>
          <div className={styles.reportsGrid}>
            {REPORTS.map((r, i) => (
              <div key={i} className={styles.reportCard}>
                <div className={styles.reportIcon}>{r.icon}</div>
                <strong>{r.title}</strong>
                <p>{r.desc}</p>
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
              <h3>💡 רוצים לראות את ה-CRM בפעולה?</h3>
              <p>הדגמה של 20 דקות — נראה לכם את כל המערכת על הנתונים שלכם</p>
            </div>
            <button className={styles.midCtaBtn} onClick={() => trackWAClick('mid_cta')}>
              📞 הזמינו הדגמה
            </button>
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
          <h2 className={styles.ctaTitle}>🚀 מוכנים להפסיק לנהל לידים באקסל?</h2>
          <p className={styles.ctaDesc}>השאירו פרטים — תוך 24 שעות נדגים לכם את המערכת</p>
          <MiniLeadForm source="crm-landing-page" />
          <div className={styles.ctaOr}>
            <span>או</span>
            <button className={styles.ctaWaBtn} onClick={() => trackWAClick('cta_bottom')}>
              💬 שלחו לנו וואטסאפ
            </button>
          </div>
          <p className={styles.privacy}>🔒 ניסיון חינם חודש · ללא כרטיס אשראי · ללא התחייבות</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Gambot · שותף Meta רשמי · <a href="/privacy">מדיניות פרטיות</a></p>
      </footer>
    </div>
  );
}

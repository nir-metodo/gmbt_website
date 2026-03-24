'use client';
import { useState } from 'react';
import styles from './BotTypesPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('היי גמבוט 👋 אני רוצה לשמוע על הבוטים שלכם');

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

const BOT_TYPES = [
  {
    id: 'rule',
    icon: '🤖',
    name: 'בוט חכם',
    subtitle: 'מבוסס תסריטים',
    color: '#128C7E',
    tag: 'הכי פופולרי',
    tagColor: '#128C7E',
    desc: 'עונה על שאלות נפוצות, מנתב שיחות, קובע תורים — הכל לפי תסריט שאתם מגדירים. ידוע, צפוי, אמין.',
    pros: [
      'הגדרה מהירה — 3-5 ימים',
      'עלות נמוכה',
      'תגובות עקביות ומדויקות',
      'מתאים לתהליכים קבועים',
      'קל לעדכון ושינוי',
    ],
    bestFor: 'עסקים עם שאלות חוזרות ותהליך ברור: מכוני יופי, קליניקות, שירות לקוחות',
    example: [
      { side: 'in', text: 'מה שעות הפעילות שלכם?' },
      { side: 'out', text: 'שלום! אנחנו פתוחים א׳-ה׳ 9:00–19:00 ושישי 9:00–14:00 😊 רוצה לקבוע תור?' },
      { side: 'in', text: 'כן בבקשה' },
      { side: 'out', text: 'מעולה! לחצ/י כאן לבחירת תאריך ושעה: 📅 [קישור לתיאום]' },
    ],
  },
  {
    id: 'ai',
    icon: '🧠',
    name: 'בוט AI',
    subtitle: 'מבוסס בינה מלאכותית',
    color: '#6c35de',
    tag: 'הכי חכם',
    tagColor: '#6c35de',
    desc: 'לומד מהמידע שלכם, מבין שאלות פתוחות, עונה בטבעיות ומכוון תמיד ליעדים שהגדרתם.',
    pros: [
      'מבין שאלות פתוחות ומורכבות',
      'לומד מקובץ שאלות-תשובות שאתם מעלים',
      'שולח תמונות מוצר / סרטוני הסבר / לינקים',
      'מתחבר למקורות מידע חיצוניים',
      'מכוון ליעד (מכירה, הרשמה, תור)',
    ],
    bestFor: 'עסקים עם מגוון מוצרים/שירותים, הרבה שאלות לא צפויות, צורך בהסבר מעמיק',
    example: [
      { side: 'in', text: 'איזה קרם מתאים לעור שמן ורגיש?' },
      { side: 'out', text: 'שאלה מצוינת! לעור שמן-רגיש אני ממליץ על ה-HydraBalance שלנו — ג\'ל קל במיוחד, ללא בישומים. הנה תמונה 👇' },
      { side: 'out', text: '🖼️ [תמונת המוצר]  |  📹 [סרטון הסבר]  |  🛒 [לרכישה]' },
    ],
  },
  {
    id: 'hybrid',
    icon: '⚡',
    name: 'בוט משולב',
    subtitle: 'חכם + מדויק',
    color: '#d97706',
    tag: 'מומלץ לעסקים גדלים',
    tagColor: '#d97706',
    desc: 'מה שחוזר — הבוט החכם עונה מיד. מה שמורכב — ה-AI נכנס לפעולה. הכי טוב משני העולמות.',
    pros: [
      'מהיר ועקבי לשאלות שגרתיות',
      'גמיש וחכם לשאלות מורכבות',
      'חיסכון בעלות ה-AI',
      'מכסה 100% מהמקרים',
      'מתפתח עם העסק',
    ],
    bestFor: 'עסקים שצומחים, יש להם גם תהליכים קבועים וגם מוצרים/שירותים מגוונים',
    example: [
      { side: 'in', text: 'מה ההבדל בין החבילה הבסיסית לפרמיום?' },
      { side: 'out', text: 'שאלה מצוינת! הבסיסית כוללת X, Y, Z. הפרמיום מוסיפה A ו-B. לרוב העסקים בגודל שלכם אני ממליץ על הפרמיום כי...' },
      { side: 'in', text: 'מה שעות התמיכה?' },
      { side: 'out', text: 'תמיכה טכנית: א׳-ה׳ 8:00–18:00 📞 לדברים דחופים — 0800-XXX-XXX' },
    ],
  },
];

const AI_CAPABILITIES = [
  {
    icon: '📚',
    title: 'לומד מהמידע שלכם',
    desc: 'מעלים קובץ שאלות ותשובות נפוצות, קטלוג מוצרים, מדריכי שימוש — ה-AI סופג הכל ועונה לפיו.',
  },
  {
    icon: '🖼️',
    title: 'שולח מדיה חכמה',
    desc: 'תמונות מוצר, סרטוני הסבר, PDF, קישורים לדפי מוצר — בדיוק כשהלקוח צריך אותם, לא לפני ולא אחרי.',
  },
  {
    icon: '🔗',
    title: 'מתחבר למקורות חיצוניים',
    desc: 'מלאי בזמן אמת, מחירים מהמערכת שלכם, סטטוס הזמנה, לוח תורים — ה-AI שולף ועונה ישירות.',
  },
  {
    icon: '🎯',
    title: 'מכוון ליעד שלכם',
    desc: 'הגדרתם שהמטרה היא מכירה? הרשמה לניוזלטר? תיאום פגישה? הבוט מוביל כל שיחה לשם בטבעיות.',
  },
  {
    icon: '🧩',
    title: 'מבין הקשר שיחה',
    desc: 'זוכר מה נאמר לפני שני מסרים, לא מבקש לחזור על מידע, מנהל שיחה כמו אדם אמיתי.',
  },
  {
    icon: '📊',
    title: 'לומד ומשתפר',
    desc: 'ככל שיותר לקוחות מדברים עמו, הבוט מזהה פערי מידע ומציין לכם מה להוסיף לבסיס הידע.',
  },
];

const FAQS = [
  {
    q: 'איך ה-AI יודע מה לענות על המוצרים שלי?',
    a: 'אתם מעלים לנו קובץ (Excel, Word, PDF) עם שאלות ותשובות נפוצות, תיאורי מוצרים, מדיניות החברה — ה-AI "לומד" אותו ועונה על בסיסו. אם שאלה לא מכוסה, הוא מעביר לנציג.',
  },
  {
    q: 'האם הבוט שולח תמונות וסרטונים אוטומטית?',
    a: 'כן. אתם מגדירים מה לשלוח לפי נושא — למשל "מי ששואל על מוצר X, שלח את תמונה Y ולינק Z". הבוט מבין מתי רלוונטי ושולח בדיוק בזמן הנכון.',
  },
  {
    q: 'מה זה "מקורות חיצוניים"?',
    a: 'הבוט יכול להתחבר ל-API של המערכות שלכם — מלאי, CRM, יומן תורים, מחירון — ולשלוף מידע חי. לקוח ששואל "יש מלאי של מוצר X?" מקבל תשובה בזמן אמת.',
  },
  {
    q: 'מה ההבדל בין בוט חכם ל-AI?',
    a: 'בוט חכם עובד לפי תסריטים: "אם לקוח שולח X, ענה Y". זה מושלם לשאלות חוזרות וידועות מראש. AI מבין שאלות פתוחות ועונה בצורה טבעית — אבל עולה קצת יותר. הבוט המשולב משלב את שניהם.',
  },
  {
    q: 'כמה זמן לוקח להגדיר בוט AI?',
    a: 'בסיסי — שבוע. מלא עם חיבורים חיצוניים — 2-3 שבועות. אנחנו מלווים אתכם בכל שלב.',
  },
];

function BotCard({ bot, isSelected, onSelect }) {
  return (
    <div
      className={`${styles.botCard} ${isSelected ? styles.botCardSelected : ''}`}
      onClick={() => onSelect(bot.id)}
      style={isSelected ? { borderColor: bot.color, boxShadow: `0 0 0 3px ${bot.color}22` } : {}}
    >
      {bot.tag && (
        <div className={styles.botTag} style={{ background: bot.color }}>{bot.tag}</div>
      )}
      <div className={styles.botCardIcon}>{bot.icon}</div>
      <h3 className={styles.botCardName}>{bot.name}</h3>
      <p className={styles.botCardSubtitle}>{bot.subtitle}</p>
      <p className={styles.botCardDesc}>{bot.desc}</p>
      <ul className={styles.botPros}>
        {bot.pros.map((p, i) => (
          <li key={i}><span style={{ color: bot.color }}>✓</span> {p}</li>
        ))}
      </ul>
      <div className={styles.botBestFor}>
        <strong>מתאים ל:</strong> {bot.bestFor}
      </div>
    </div>
  );
}

function ChatDemo({ messages, color }) {
  return (
    <div className={styles.chatDemo}>
      <div className={styles.chatHeader} style={{ background: color }}>
        <span>💬 דוגמת שיחה</span>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((m, i) => (
          <div key={i} className={m.side === 'in' ? styles.bubbleIn : styles.bubbleOut}
            style={m.side === 'out' ? { background: `${color}18`, borderColor: `${color}30` } : {}}>
            {m.text}
          </div>
        ))}
      </div>
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

function MiniLeadForm({ source = 'bot-types-page' }) {
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
        {status === 'loading' ? '⏳ שולח...' : '🚀 קבלו ייעוץ חינמי'}
      </button>
      {status === 'error' && (
        <p className={styles.formError}>שגיאה — <a href={`https://wa.me/${WA_NUMBER}`}>שלחו וואטסאפ</a></p>
      )}
    </form>
  );
}

export default function BotTypesPage() {
  const [selectedBot, setSelectedBot] = useState('hybrid');
  const selected = BOT_TYPES.find(b => b.id === selectedBot);

  return (
    <div className={styles.page} dir="rtl">

      {/* Header */}
      <header className={styles.header}>
        <img src="/new_logo.png" alt="Gambot" className={styles.logo} />
        <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noreferrer"
          className={styles.headerWa}
          onClick={(e) => { e.preventDefault(); trackWAClick('header'); }}>
          💬 דברו איתנו
        </a>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>🏆 שותף Meta רשמי · עשרות לקוחות בישראל</div>
          <h1 className={styles.heroTitle}>
            איזה בוט וואטסאפ<br />
            <span className={styles.heroHighlight}>מתאים לעסק שלכם?</span>
          </h1>
          <p className={styles.heroDesc}>
            שלושה סוגי בוטים, כל אחד לצורך אחר — בחרו את שמתאים לכם, או שאנחנו נעזור לבחור
          </p>
          <button className={styles.ctaHero} onClick={() => trackWAClick('hero')}>
            💬 עזרו לי לבחור — דברו איתי
          </button>
          <p className={styles.ctaSub}>⚡ ייעוץ חינמי · ללא התחייבות · תוך 24 שעות</p>
        </div>
      </section>

      {/* BOT TYPES COMPARISON */}
      <section className={styles.botTypes}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🤖 שלושת סוגי הבוטים</h2>
          <p className={styles.sectionDesc}>לחצו על כל בוט לראות דוגמת שיחה אמיתית</p>
          <div className={styles.botCardsGrid}>
            {BOT_TYPES.map(bot => (
              <BotCard key={bot.id} bot={bot} isSelected={selectedBot === bot.id} onSelect={setSelectedBot} />
            ))}
          </div>

          {/* Live chat demo */}
          {selected && (
            <div className={styles.demoSection}>
              <h3 className={styles.demoTitle}>
                {selected.icon} {selected.name} — דוגמת שיחה
              </h3>
              <ChatDemo messages={selected.example} color={selected.color} />
            </div>
          )}
        </div>
      </section>

      {/* AI CAPABILITIES DEEP DIVE */}
      <section className={styles.aiSection}>
        <div className={styles.container}>
          <div className={styles.aiBadge}>🧠 בינה מלאכותית</div>
          <h2 className={styles.sectionTitle}>מה הבוט ה-AI מסוגל לעשות?</h2>
          <p className={styles.sectionDesc}>
            לא עוד תשובות רובוטיות — AI שמבין את העסק שלכם ועונה כמו נציג מנוסה
          </p>
          <div className={styles.aiGrid}>
            {AI_CAPABILITIES.map((cap, i) => (
              <div key={i} className={styles.aiCard}>
                <div className={styles.aiIcon}>{cap.icon}</div>
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>

          {/* AI flow diagram */}
          <div className={styles.aiFlow}>
            <div className={styles.aiFlowStep}>
              <div className={styles.aiFlowIcon}>📄</div>
              <strong>אתם מעלים</strong>
              <p>שאלות ותשובות, קטלוג, מדיניות</p>
            </div>
            <div className={styles.aiFlowArrow}>←</div>
            <div className={styles.aiFlowStep}>
              <div className={styles.aiFlowIcon}>🧠</div>
              <strong>ה-AI לומד</strong>
              <p>מבין, מסווג ומכין תשובות</p>
            </div>
            <div className={styles.aiFlowArrow}>←</div>
            <div className={styles.aiFlowStep}>
              <div className={styles.aiFlowIcon}>💬</div>
              <strong>לקוח שואל</strong>
              <p>כל שאלה, בכל שפה</p>
            </div>
            <div className={styles.aiFlowArrow}>←</div>
            <div className={styles.aiFlowStep}>
              <div className={styles.aiFlowIcon}>✅</div>
              <strong>ה-AI עונה</strong>
              <p>תשובה + מדיה + מכוון לפעולה</p>
            </div>
          </div>
        </div>
      </section>

      {/* HYBRID EXPLAINER */}
      <section className={styles.hybridSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>⚡ הכוח של הבוט המשולב</h2>
          <div className={styles.hybridGrid}>
            <div className={styles.hybridCard}>
              <div className={styles.hybridCardHeader} style={{ background: '#128C7E' }}>
                🤖 בוט חכם (תסריטים)
              </div>
              <ul className={styles.hybridList}>
                <li>✓ שאלות חוזרות ידועות</li>
                <li>✓ שעות פעילות, מחיר, כתובת</li>
                <li>✓ קביעת תורים</li>
                <li>✓ תפריט שירות לקוחות</li>
                <li>✓ תגובה מיידית ועקבית</li>
              </ul>
            </div>
            <div className={styles.hybridPlus}>+</div>
            <div className={styles.hybridCard}>
              <div className={styles.hybridCardHeader} style={{ background: '#6c35de' }}>
                🧠 בוט AI
              </div>
              <ul className={styles.hybridList}>
                <li>✓ שאלות מורכבות ופתוחות</li>
                <li>✓ המלצות מותאמות אישית</li>
                <li>✓ שליחת מדיה חכמה</li>
                <li>✓ מידע חי ממקורות חיצוניים</li>
                <li>✓ הובלה לרכישה/הרשמה</li>
              </ul>
            </div>
            <div className={styles.hybridEquals}>=</div>
            <div className={`${styles.hybridCard} ${styles.hybridResult}`}>
              <div className={styles.hybridCardHeader} style={{ background: '#d97706' }}>
                ⚡ כיסוי מלא של 100% המקרים
              </div>
              <ul className={styles.hybridList}>
                <li>🏆 מהיר כמו תסריט לשאלות שגרתיות</li>
                <li>🏆 חכם כמו AI לשאלות מורכבות</li>
                <li>🏆 חסכוני — AI רק כשצריך</li>
                <li>🏆 מתפתח עם העסק</li>
                <li>🏆 לא נופל שום שיחה</li>
              </ul>
            </div>
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
          <h2 className={styles.ctaTitle}>לא בטוחים איזה בוט מתאים לכם?</h2>
          <p className={styles.ctaDesc}>השאירו פרטים — נבין יחד תוך 15 דקות איזה פתרון מתאים לעסק שלכם</p>
          <MiniLeadForm source="bot-types-page" />
          <div className={styles.ctaOr}>
            <span>או</span>
            <button className={styles.ctaWaBtn} onClick={() => trackWAClick('cta_bottom')}>
              💬 שאלו אותנו עכשיו בוואטסאפ
            </button>
          </div>
          <p className={styles.privacy}>🔒 ייעוץ חינמי · ללא התחייבות · פרטיכם לא יועברו לצד שלישי</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Gambot · שותף Meta רשמי · <a href="/privacy">מדיניות פרטיות</a></p>
      </footer>
    </div>
  );
}

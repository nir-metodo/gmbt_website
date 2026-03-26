'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './AiBotPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('היי גמבוט 👋 אני רוצה לשמוע על הבוט AI');

const STATS = [
  { num: '24/7', label: 'זמין תמיד' },
  { num: '<5 שנ׳', label: 'זמן תגובה ממוצע' },
  { num: '98%', label: 'שביעות רצון לקוחות' },
  { num: '3 ימים', label: 'זמן הטמעה ממוצע' },
];

const FLOW_STEPS = [
  {
    icon: '💬',
    label: '',
    title: 'לקוח פותח שיחה בוואטסאפ',
    desc: 'הבוט הקלאסי מקבל את פניו ומנחה לתפריט ראשי',
  },
  {
    icon: '❓',
    label: '',
    title: 'לקוח בוחר "יש לי שאלה" — או שולח הודעה חופשית',
    desc: 'הבוט מזהה שהשאלה דורשת מענה חכם ומפעיל את Gambot AI',
  },
  {
    icon: '🧠',
    label: 'ai',
    title: 'Gambot AI נכנס לפעולה כ"עובד דיגיטלי"',
    desc: 'מגובש עם הידע של העסק שלכם — עונה בשפה טבעית, שואל שאלות, ומבין הקשר. לא ChatGPT גנרי — AI שמכיר את הפרויקטים, השירותים והמחירים שלכם.',
  },
  {
    icon: '📋',
    label: '',
    title: 'AI מחלץ מידע ומעדכן את ה-CRM',
    desc: 'שם, טלפון, תאריך רצוי, סוג שירות — הכל מועבר אוטומטית לכרטיס הלקוח במערכת',
  },
  {
    icon: '👤',
    label: 'human',
    title: 'לא מצליח? מעביר לנציג אנושי בשניות',
    desc: 'כשהשאלה חורגת מהידע שהוגדר — AI מסביר ומעביר לנציג עם כל ההיסטוריה של השיחה',
  },
];

const AI_CAPS = [
  {
    icon: '🗣️',
    title: 'שפה טבעית מלאה',
    desc: 'עונה לכל שאלה פתוחה בעברית שוטפת — לא תפריט, לא כפתורים. כמו נציג אמיתי.',
  },
  {
    icon: '📚',
    title: 'מאומן על ידע העסק שלך',
    desc: 'אתם מגדירים מה הוא יודע — שירותים, מחירים, FAQ, תנאים. לא AI גנרי — AI שלכם.',
  },
  {
    icon: '🔍',
    title: 'חילוץ נתונים חכם',
    desc: 'בזמן השיחה מחלץ שם, טלפון, תאריך, סוג שירות — ושולח ישירות ל-CRM.',
  },
  {
    icon: '🎯',
    title: 'שואל שאלות כמו נציג',
    desc: 'קובע מה לשאול ומתי — שאלות ניפוי, שאלות מוביל ושאלות סגירה — בהתאם להקשר.',
  },
  {
    icon: '⚡',
    title: 'מפעיל פעולות אוטומטיות',
    desc: 'אחרי השיחה — מעדכן סטטוס ליד, שולח אישור, פותח תיק בCRM. הכל ללא מגע יד.',
  },
  {
    icon: '🔄',
    title: 'משתלב עם הבוט הקלאסי',
    desc: 'לא חייבים לבחור. הבוט הקלאסי מנהל את הניתוב, ה-AI נכנס כשדרוש מענה חכם.',
  },
];

const BOT_TYPES = [
  {
    icon: '🤖',
    title: 'בוט קלאסי',
    subtitle: 'שליטה מלאה',
    desc: 'תפריטים, כפתורים, נתיבים קבועים. מושלם לשירות עם תהליך ברור וקצר.',
    tags: ['מהיר להגדרה', 'שליטה מלאה', 'חסכוני'],
  },
  {
    icon: '🧠',
    title: 'בוט AI',
    subtitle: 'שפה חופשית',
    desc: 'עונה לכל שאלה בשפה טבעית. מרגיש כמו נציג אמיתי — 24/7 ללא עייפות.',
    tags: ['שפה טבעית', 'עונה לכל שאלה', 'חכם'],
  },
  {
    icon: '⚡',
    title: 'בוט משולב',
    subtitle: 'הטוב משני העולמות',
    desc: 'בוט קלאסי מנתב ומסנן — AI עונה לשאלות חופשיות. הפתרון הכי חזק לעסקים שרוצים הכל.',
    tags: ['AI + לוגיקה', 'פולואפ אוטומטי', 'מקסימום המרות'],
    highlight: true,
  },
];

const WHY_GAMBOT_AI = [
  {
    icon: '🎓',
    title: 'לא ChatGPT — AI עסקי מותאם אישית',
    desc: 'ChatGPT לא מכיר את העסק שלכם. Gambot AI מאומן על השירותים, המחירים והנהלים שלכם — ועונה רק על מה שאתם מאשרים.',
  },
  {
    icon: '🔗',
    title: 'מחובר ל-CRM — יודע מי הלקוח',
    desc: 'כשלקוח חוזר, ה-AI רואה את כל ההיסטוריה. יודע מה קנה, מה שאל, מה הסטטוס. מגיב בהתאם.',
  },
  {
    icon: '🛡️',
    title: 'גבולות ברורים — לא מתפרע',
    desc: 'הגדרתם מה הוא יכול ומה לא. כשנושא חורג — הוא מסביר ומעביר לנציג. ללא הפתעות.',
  },
  {
    icon: '📊',
    title: 'דוחות מלאים על כל שיחת AI',
    desc: 'רואים בדיוק מה שאלו, מה ענה, כמה שיחות הועברו לנציג ומה האחוז הצלחה — נתונים לשיפור מתמיד.',
  },
];

const FAQS = [
  {
    q: 'האם הבוט AI יודע על העסק שלי?',
    a: 'כן. אנחנו מאמנים את ה-AI עם המידע שאתם מספקים — שירותים, מחירים, FAQ, נהלים. הוא עונה רק על מה שהגדרתם, ולא מה שהוא "חושב" שהוא יודע.',
  },
  {
    q: 'מה קורה כשה-AI לא יכול לענות?',
    a: 'הוא מסביר בנימוס ומעביר את השיחה לנציג אנושי — עם כל ההיסטוריה של השיחה. הנציג ממשיך בדיוק מאיפה ה-AI הפסיק.',
  },
  {
    q: 'האם אפשר לשלב AI עם בוט קלאסי?',
    a: 'בהחלט — זה הפתרון המומלץ שלנו. הבוט הקלאסי מנתב ומסנן, ה-AI נכנס לשאלות פתוחות. הטוב משני העולמות.',
  },
  {
    q: 'כמה זמן לוקח להגדיר?',
    a: 'בממוצע 3-5 ימי עסקים. אנחנו מלווים אתכם בכל שלב — הקמת WABA, אימון ה-AI, הגדרת הבוט וגו׳ לייב.',
  },
  {
    q: 'האם ה-AI מדבר עברית טוב?',
    a: 'כן. Gambot AI מותאם לעברית, מבין ניבים ישראליים ועונה בשפה טבעית ומקצועית. לקוחות לא שמים לב שזה AI.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button className={styles.faqQ} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className={`${styles.faqChevron} ${open ? styles.open : ''}`}>▼</span>
      </button>
      {open && <div className={styles.faqA}>{a}</div>}
    </div>
  );
}

export default function AiBotPage() {
  const [form, setForm] = useState({ name: '', phone: '', businessName: '', botType: 'בוט AI' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'he';
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitting(true);
    try {
      await sendLeadWebhook({
        name: form.name,
        phone: form.phone,
        businessName: form.businessName,
        message: `בוט AI — ${form.botType}`,
        source: 'קמפיין-בוט-ai-לעסקים-hero',
      });
      await sendThankYouEmail({ name: form.name, phone: form.phone });
      setSuccess(true);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', { send_to: 'AW-18018385768/ai-bot-lead' });
      }
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <Image src="/apple-touch-icon.png" alt="Gambot" width={36} height={36} className={styles.logo} />
        <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className={styles.headerWa}>
          💬 דברו איתנו עכשיו
        </a>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>🧠 Gambot AI — בוט שעובד כמו עובד אמיתי</div>
        <h1 className={styles.heroTitle}>
          הבוט שמרגיש<br /><span>כמו נציג אמיתי</span><br />גם בשעה 2 בלילה
        </h1>
        <p className={styles.heroSub}>
          לא עוד תפריטים מוגבלים. Gambot AI עונה בשפה טבעית לכל שאלה,
          מאומן על ידע העסק שלך — ומעביר לנציג רק כשצריך.
        </p>
        <div className={styles.heroActions}>
          <a href="#form" className={styles.heroCta}>🚀 התחל בחינם</a>
          <a href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer" className={styles.heroCtaWa}>
            💬 שאל שאלה בוואטסאפ
          </a>
        </div>
      </section>

      {/* STATS */}
      <div className={styles.stats}>
        {STATS.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <div className={styles.statNum}>{s.num}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>איך <span>Gambot AI</span> עובד בפועל?</h2>
          <p className={styles.sectionSub}>
            לא AI עצמאי — AI שמשתלב בצורה חכמה בתוך הבוט שלכם
          </p>
          <div className={styles.flowSteps}>
            {FLOW_STEPS.map((step, i) => (
              <div key={i} className={styles.flowStep}>
                <div className={`${styles.flowBubble} ${step.label ? styles[step.label] : ''}`}>
                  {step.icon}
                </div>
                <div className={styles.flowContent}>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI CAPABILITIES */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>מה <span>Gambot AI</span> יכול לעשות?</h2>
          <p className={styles.sectionSub}>הרבה יותר מ-"עונה על שאלות"</p>
          <div className={styles.capsGrid}>
            {AI_CAPS.map((cap, i) => (
              <div key={i} className={styles.capCard}>
                <div className={styles.capIcon}>{cap.icon}</div>
                <h4>{cap.title}</h4>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOT TYPES */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>בחרו את <span>הפתרון הנכון</span> לעסק שלכם</h2>
          <p className={styles.sectionSub}>שלושה מסלולים — כולם מגובים ב-Gambot AI</p>
          <div className={styles.botTypesGrid}>
            {BOT_TYPES.map((bot, i) => (
              <div key={i} className={`${styles.botCard} ${bot.highlight ? styles.highlight : ''}`}>
                {bot.highlight && <span className={styles.popularBadge}>⭐ הכי פופולרי</span>}
                <div className={styles.botIcon}>{bot.icon}</div>
                <h3>{bot.title}</h3>
                <p className={styles.botSubtitle}>{bot.subtitle}</p>
                <p className={styles.botDesc}>{bot.desc}</p>
                <div className={styles.botTags}>
                  {bot.tags.map((t, j) => <span key={j} className={styles.botTag}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY GAMBOT AI */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>למה <span>Gambot AI</span> ולא ChatGPT סתם?</h2>
          <p className={styles.sectionSub}>ההבדל הוא הפרטים</p>
          <div className={styles.whyGrid}>
            {WHY_GAMBOT_AI.map((item, i) => (
              <div key={i} className={styles.whyCard}>
                <div className={styles.whyIcon}>{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className={styles.formSection} id="form">
        <h2 className={styles.formTitle}>רוצים <span>Gambot AI</span> בעסק שלכם?</h2>
        <p className={styles.formSub}>השאירו פרטים ונחזור אליכם תוך שעה</p>
        <div className={styles.form}>
          {success ? (
            <div className={styles.formSuccess}>
              ✅ קיבלנו! נחזור אליכם תוך שעה בוואטסאפ.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>שם מלא *</label>
                <input className={styles.formInput} name="name" placeholder="ישראל ישראלי" value={form.name} onChange={handleChange} required />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>מספר טלפון *</label>
                <input className={styles.formInput} name="phone" type="tel" placeholder="050-0000000" value={form.phone} onChange={handleChange} required />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>שם העסק</label>
                <input className={styles.formInput} name="businessName" placeholder="שם העסק שלכם" value={form.businessName} onChange={handleChange} />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>איזה בוט מעניין אתכם?</label>
                <select className={styles.formInput} name="botType" value={form.botType} onChange={handleChange}>
                  <option value="בוט AI">בוט AI — שפה טבעית</option>
                  <option value="בוט משולב">בוט משולב — AI + לוגיקה</option>
                  <option value="בוט קלאסי">בוט קלאסי — תפריטים</option>
                  <option value="לא בטוח">עדיין לא בטוח — תמליצו</option>
                </select>
              </div>
              <button type="submit" className={styles.formSubmit} disabled={submitting}>
                {submitting ? '⏳ שולח...' : '🚀 אני רוצה לנסות Gambot AI'}
              </button>
              <p className={styles.formTrust}>ניסיון חינם · ללא כרטיס אשראי · תגובה תוך שעה</p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>שאלות <span>נפוצות</span></h2>
          <div className={styles.faqList}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* FOOTER BAR */}
      <div className={styles.footerBar}>
        © 2025 Gambot · פלטפורמת WhatsApp Business API המובילה בישראל ·
        <a href="/privacy/">פרטיות</a> ·
        <a href="/TermOfUse/">תנאי שימוש</a>
      </div>
    </div>
  );
}

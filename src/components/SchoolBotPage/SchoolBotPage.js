'use client';
import { useEffect, useState } from 'react';
import styles from '../InsuranceAgentsPage/InsuranceAgentsPage.module.css';
import axiosInstance from '@/components/OnBoard/axiosInstance';
import { Chat, FaqItem, MiniLeadForm } from '../InsuranceAgentsPage/InsuranceAgentsPage';
import { SCHOOL_TABS } from './schoolFlows';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('היי, אשמח לראות איך בוט וואטסאפ לבית ספר עובד');

function trackWAClick(location = 'button') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: `schools_${location}` });
  }
  // Meta Pixel (dataset "SELF SERVE", initialised in app/layout.js): a WhatsApp click is a contact conversion.
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', { content_name: `schools_${location}` });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

/* ───────────── content ───────────── */

const PAINS = [
  { icon: '📱', title: 'הודעות למורים בכל שעה', desc: 'הורים כותבים למורה בנייר הפרטי, בערב ובסוף השבוע. הזמן שנועד להוראה הולך למענה.' },
  { icon: '🔁', title: 'אותה שאלה שוב ושוב', desc: 'מתי המבחן? איפה הטופס? עד מתי מגישים? התשובות קיימות, אבל אף אחד לא מוצא אותן.' },
  { icon: '📄', title: 'טפסים ואישורים בנייר', desc: 'אישורי טיול, הצהרות בריאות והסכמות. רודפים אחרי חתימות ומאבדים ניירות בילקוט.' },
];

const STEPS = [
  { icon: '📲', title: 'ההורה כותב לבית הספר', desc: 'בוואטסאפ, מהמספר הרשמי של בית הספר. בלי אפליקציה חדשה ובלי הרשמה.' },
  { icon: '👆', title: 'בוחר נושא בתפריט', desc: 'לו״ז, מבחנים, טפסים, שאלות נפוצות או פנייה לצוות.' },
  { icon: '✅', title: 'מקבל תשובה, קישור או טופס', desc: 'מיד, גם בערב ובסוף השבוע. טפסים נחתמים דיגיטלית מהנייד.' },
  { icon: '🙋', title: 'מה שדורש אדם מגיע לצוות', desc: 'פנייה מסודרת למורה או למזכירות, עם משימה ותזכורת. לא הודעה אבודה בצ׳אט.' },
];

const CAPABILITIES = [
  { icon: '🗓️', title: 'מערכת שעות, חופשות ואירועים', desc: 'קישור ללוח אירועים, חופשות משרד החינוך ולוח צלצולים, תמיד מעודכן במקום אחד.' },
  { icon: '📝', title: 'לוח מבחנים', desc: 'ההורה בודק לבד מתי המבחן, בלי לשאול את המחנכת.' },
  { icon: '✍️', title: 'טפסים וחתימות דיגיטליות', desc: 'הצהרת בריאות, ויתור סודיות, הגנת פרטיות, אישורי טיולים. חותמים מהנייד ומקבלים עותק חתום.' },
  { icon: '❓', title: 'שאלות נפוצות', desc: 'קוד לבוש, מועד ב׳, שיפור ציון, תחבורה, בריאות וחירום. תשובה קבועה ואחידה מבית הספר.' },
  { icon: '👩‍🏫', title: 'פנייה לצוות החינוכי', desc: 'טופס מסודר שמגיע למורה או למחנכת הנכונים, עם משימה ותזכורת, ובסוף בדיקה אם הפנייה טופלה.' },
  { icon: '🚨', title: 'פנייה דחופה ובקשת שחרור', desc: 'פנייה דחופה מסומנת ועוברת ישר לצוות. בקשת שחרור לתלמיד נשלחת למזכירות.' },
  { icon: '📣', title: 'הודעות לכל ההורים', desc: 'עדכון על אירוע, שינוי בלו״ז או טיול. הודעה אחת לכולם, דרך המספר של בית הספר.' },
  { icon: '📥', title: 'תיבה משותפת לצוות', desc: 'כל השיחות במקום אחד ולא בניידים הפרטיים. אפשר לשייך שיחה לאיש צוות ולראות מה פתוח.' },
];

const BENEFITS = [
  { icon: '⏱️', title: 'המורים מתפנים להוראה', desc: 'שאלות שגרתיות נענות אוטומטית, והצוות מטפל רק במה שדורש שיחה אמיתית.' },
  { icon: '🕒', title: 'מענה גם אחרי שעות הלימודים', desc: 'הורה שואל בשמונה בערב ומקבל תשובה. לא צריך לחכות למחר.' },
  { icon: '📌', title: 'סדר ושקיפות', desc: 'כל פנייה נרשמת, משויכת ונסגרת. אפשר לראות מה ממתין לטיפול ומה כבר טופל.' },
  { icon: '🔒', title: 'פחות מידע בניידים הפרטיים', desc: 'השיחות עם ההורים נשמרות במערכת של בית הספר, ולא בטלפון האישי של כל מורה.' },
  { icon: '🧠', title: 'מבין תשובות חופשיות', desc: 'כשצריך פרטים, ה-AI בודק שההורה ענה לעניין ומבקש שוב בנימוס אם לא.' },
  { icon: '✅', title: 'מספר רשמי ותבניות מאושרות', desc: 'ההודעות יוצאות דרך WhatsApp Business API הרשמי, עם תבניות שמאושרות על ידי Meta.' },
];

const FAQS = [
  {
    q: 'האם זה מחליף את המורים והמזכירות?',
    a: 'לא. הבוט עונה על מה שחוזר על עצמו ומעביר לצוות כל מה שדורש אדם. ההורה תמיד יכול להגיע לנציג, והשיחה מגיעה אליו עם כל ההקשר.',
  },
  {
    q: 'ההורים צריכים להתקין משהו?',
    a: 'לא. הכול בוואטסאפ שכבר מותקן אצלם. הם כותבים למספר של בית הספר ומקבלים תפריט.',
  },
  {
    q: 'אנחנו יכולים לעדכן תשובות וקישורים בעצמנו?',
    a: 'כן. התפריט, השאלות הנפוצות והקישורים נבנים בעורך הבוטים של גמבוט ואפשר לעדכן אותם. אנחנו מכינים איתכם את הגרסה הראשונה לפי הנהלים של בית הספר.',
  },
  {
    q: 'מה קורה כשהורה כותב משהו שהבוט לא מכיר?',
    a: 'ההודעה מועברת לצוות בתיבה המשותפת, והשיחה נשארת פתוחה. אפשר גם להגדיר ל-AI לענות לפי המידע שבית הספר מספק.',
  },
  {
    q: 'איך עובדת החתימה הדיגיטלית?',
    a: 'ההורה מקבל קישור לטופס בוואטסאפ, ממלא וחותם מהנייד. המסמך החתום נשמר עם תאריך ושעה, משויך להורה, ונשלח אליו גם למייל. לשאלות לגבי תוקף משפטי של סוגי טפסים מסוימים מומלץ להתייעץ עם היועץ המשפטי של הרשות.',
  },
  {
    q: 'מה לגבי פרטיות המידע?',
    a: 'הגישה למערכת מוגבלת למשתמשים שבית הספר מגדיר. אפשר לבקש מאיתנו פרטים על אבטחת המידע ועל תנאי עיבוד הנתונים לפני שמתחילים.',
  },
  {
    q: 'הודעות לכל ההורים צריכות אישור של וואטסאפ?',
    a: 'כן. הודעה שבית הספר יוזם נשלחת כתבנית שמאושרת על ידי Meta. אנחנו מכינים איתכם את התבניות ומגישים אותן לאישור. הורה שכותב ראשון מקבל מענה ישיר.',
  },
];

export default function SchoolBotPage() {
  const [tabId, setTabId] = useState(SCHOOL_TABS[0].id);
  const tab = SCHOOL_TABS.find((t) => t.id === tabId);

  // Record paid-campaign visitors (utm_* / fbclid / gclid) into the root "CampaignLeads" collection, like the
  // other landing pages: once per browser session, and only when campaign markers are present.
  useEffect(() => {
    try {
      if (sessionStorage.getItem('gambot_landing_tracked')) return;
      const params = new URLSearchParams(window.location.search);
      const get = (k) => params.get(k) || '';
      if (!['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'].some((k) => get(k))) return;
      sessionStorage.setItem('gambot_landing_tracked', '1');
      axiosInstance.post('/api/Webhooks/TrackLandingLead', {
        utm_source: get('utm_source'),
        utm_medium: get('utm_medium'),
        utm_campaign: get('utm_campaign'),
        utm_content: get('utm_content'),
        utm_term: get('utm_term'),
        fbclid: get('fbclid'),
        gclid: get('gclid'),
        landingPage: decodeURIComponent(window.location.pathname),
        fullUrl: window.location.href,
        referrer: document.referrer || '',
        userAgent: navigator.userAgent || '',
        language: navigator.language || '',
      }).catch(() => { });
    } catch { }
  }, []);

  return (
    <div className={styles.page} dir="rtl">
      <header className={styles.header}>
        <img src="/new_logo.png" alt="Gambot" className={styles.logo} />
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
          target="_blank"
          rel="noreferrer"
          className={styles.headerWa}
          onClick={(e) => {
            e.preventDefault();
            trackWAClick('header');
          }}
        >
          💬 דברו איתנו
        </a>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>🎒 לבתי ספר ולצוותי חינוך</div>
          <h1 className={styles.heroTitle}>
            ההורים מקבלים תשובה מיד,
            <br />
            <span className={styles.heroHighlight}>והמורים חוזרים ללמד</span>
          </h1>
          <p className={styles.heroDesc}>
            מערכת שעות, מבחנים, טפסים, אישורים, חתימות דיגיטליות ופניות לצוות. הכול בוואטסאפ של בית הספר, כדי שהתקשורת בין הורים למורים תהיה פשוטה ומסודרת.
          </p>
          <div className={styles.heroCtas}>
            <a href="#demo" className={styles.ctaHero}>
              נסו את הבוט כמו הורה
            </a>
            <button type="button" className={styles.ctaGhost} onClick={() => trackWAClick('hero')}>
              💬 דברו איתי בוואטסאפ
            </button>
          </div>
          <p className={styles.ctaSub}>שיחה אמיתית שאפשר ללחוץ בה: תפריט ראשי, טפסים וחתימה, ופנייה לצוות החינוכי</p>
        </div>
      </section>

      {/* PAINS */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>כמה זמן מורים משקיעים במענה להורים?</h2>
          <p className={styles.sectionDesc}>
            רוב הפניות חוזרות על עצמן, ומגיעות לנייד הפרטי של המורה. אפשר לסדר את זה.
          </p>
          <div className={styles.benefitGrid}>
            {PAINS.map((p) => (
              <div key={p.title} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className={styles.how}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>איך זה עובד</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={s.title} className={styles.stepCard}>
                <div className={styles.stepNum}>{i + 1}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className={styles.demoSection}>
        <div className={styles.container}>
          <div className={styles.sectionTag}>דוגמה חיה</div>
          <h2 className={styles.sectionTitle}>תנו לבוט לדבר איתכם כמו הורה</h2>
          <p className={styles.sectionDesc}>
            זו שיחה כפי שהורה רואה אותה בוואטסאפ. לחצו על הכפתורים וראו מה קורה בכל מסלול. הנוסח, התשובות והקישורים כאן הם דוגמה, וכל בית ספר מגדיר את שלו.
          </p>

          <div className={styles.tabs} role="tablist">
            {SCHOOL_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === tabId}
                className={`${styles.tab} ${t.id === tabId ? styles.tabActive : ''}`}
                onClick={() => setTabId(t.id)}
              >
                <span className={styles.tabIcon}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.demoGrid}>
            <div className={styles.demoLeft}>
              <p className={styles.tabBlurb}>{tab.blurb}</p>
              {tab.steps.map((s, i) => (
                <div key={s.title}>
                  <h3 className={styles.miniTitle}>{i + 1}. {s.title}</h3>
                  <p className={styles.miniDesc}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div className={styles.demoRight}>
              <Chat
                key={tab.id}
                title="בית הספר שלך"
                start={tab.start}
                opening={tab.opening}
                vars={tab.vars}
                avatar="🎒"
                subtitle="חשבון רשמי של בית הספר"
                varHint="משתנה אישי לכל הורה"
                showAgentCard
                agentCard={tab.agentCard}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className={styles.generalSection}>
        <div className={styles.container}>
          <div className={styles.sectionTagAlt}>מה בפנים</div>
          <h2 className={styles.sectionTitle}>כל מה שהורים שואלים, במקום אחד</h2>
          <div className={styles.benefitGrid}>
            {CAPABILITIES.map((c) => (
              <div key={c.title} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARENTS vs STAFF */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>כולם מרוויחים</h2>
          <div className={styles.compare}>
            <div className={styles.compareCard}>
              <h4>ההורים</h4>
              <ul>
                <li>תשובה מיד, גם בערב ובסוף השבוע</li>
                <li>חתימה על טפסים מהנייד, בלי ניירות</li>
                <li>מספר אחד של בית הספר לכל דבר</li>
              </ul>
            </div>
            <div className={`${styles.compareCard} ${styles.compareCardAlt}`}>
              <h4>המורים והצוות</h4>
              <ul>
                <li>פחות הודעות פרטיות בנייד האישי</li>
                <li>פניות מסודרות עם משימה ותזכורת</li>
                <li>זמן פנוי להוראה ולחינוך</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className={styles.how}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>למה בתי ספר בוחרים בזה</h2>
          <div className={styles.benefitGrid}>
            {BENEFITS.map((b) => (
              <div key={b.title} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>שאלות נפוצות</h2>
          <div className={styles.faqList}>
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>רוצים לראות את זה עם הנהלים של בית הספר שלכם?</h2>
          <p className={styles.ctaDesc}>השאירו פרטים ונחזור אליכם עם דוגמה לתפריט, לשאלות הנפוצות ולטפסים של בית הספר.</p>
          <MiniLeadForm source="schools-page" buttonText="רוצה לראות דוגמה לבית הספר שלי" waNumber={WA_NUMBER} />
          <div className={styles.ctaOr}>
            <span>או</span>
            <button type="button" className={styles.ctaWaBtn} onClick={() => trackWAClick('cta_bottom')}>
              💬 שאלו אותנו עכשיו בוואטסאפ
            </button>
          </div>
          <p className={styles.privacy}>ייעוץ ללא התחייבות · פרטיכם לא יועברו לצד שלישי</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()} Gambot · שותף Meta רשמי · <a href="/privacy">מדיניות פרטיות</a>
        </p>
      </footer>
    </div>
  );
}

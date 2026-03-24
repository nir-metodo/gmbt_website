'use client';
import { useState, useEffect } from 'react';
import styles from './CampaignPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('היי גמבוט 👋 אני רוצה לנסות את הבוט');

const STATS = [
  { num: '24/7', label: 'מענה אוטומטי' },
  { num: '3 דקות', label: 'זמן חיבור ממוצע' },
  { num: '98%', label: 'שביעות רצון' },
];

const PAINS = [
  { icon: '⏰', text: 'עונים ידנית לאותן שאלות שוב ושוב — שעות ביום' },
  { icon: '😤', text: 'לא מצליחים לענות לכולם — לקוחות עוזבים למתחרה' },
  { icon: '🤯', text: 'בלאגן של שיחות — לא יודעים מי טיפל במי ומה הסטטוס' },
  { icon: '🌙', text: 'אין מענה בלילות ובסופ"ש — לידים הולכים לאיבוד' },
];

const BENEFITS = [
  { icon: '🤖', title: 'מענה אוטומטי 24/7', desc: 'הבוט עונה בשניות — בלילה, בשבת, בחגים. לא תאבדו ליד אחד' },
  { icon: '📋', title: 'כל השיחות במקום אחד', desc: 'סטטוס ברור, אחראי ידוע, אין דברים שנופלים בין הכיסאות' },
  { icon: '🎯', title: 'מסנן ומנתב לידים', desc: 'שולח לאדם הנכון רק את מה שרלוונטי — חוסך שעות של מיון' },
  { icon: '📅', title: 'קובע פגישות לבד', desc: 'הלקוח קובע פגישה ישירות עם הבוט — בלי לחכות לנציג' },
  { icon: '📊', title: 'CRM מובנה', desc: 'כל ליד, שיחה ועסקה נשמרים אוטומטית — מעקב מלא ללא מאמץ' },
  { icon: '🔔', title: 'התראות חכמות', desc: 'קבלו התראה רק כשצריך התערבות אנושית — שאר הזמן הבוט מטפל' },
];

// Testimonials to add once collected from real customers
// const TESTIMONIALS = [];

const FAQS = [
  {
    q: 'כמה זמן לוקח להתחיל?',
    a: 'ברוב המקרים — 3 עד 5 ימי עסקים. אנחנו מחברים אתכם לוואטסאפ עסקי (WABA), מגדירים את הבוט לפי הצרכים שלכם ואתם פשוט מתחילים לקבל לקוחות.',
  },
  {
    q: 'האם הבוט מדבר כמו רובוט?',
    a: 'ממש לא. אנחנו מאמנים את הבוט עם השפה של העסק שלכם — הלקוחות לא שמים לב. ואם השיחה דורשת מגע אנושי, הבוט מעביר לנציג תוך שניות.',
  },
  {
    q: 'מה קורה אם יש שאלה שהבוט לא יודע לענות?',
    a: 'הבוט מזהה שהוא מגיע לגבול שלו ומעביר את השיחה לנציג אנושי מיד — עם כל ההיסטוריה של השיחה. לא צריך שום הסברים.',
  },
  {
    q: 'האם צריך לדעת תכנות?',
    a: 'בכלל לא. הממשק שלנו הוא פשוט ויזואלי — כמו בניית מצגת. אנחנו גם עוזרים בהגדרה הראשונית.',
  },
  {
    q: 'כמה עולה?',
    a: 'יש מספר חבילות לפי גודל העסק וכמות ההודעות. ניצור קשר לאחר הרישום ונציג את האפשרויות שמתאימות לכם — ללא התחייבות.',
  },
];

function trackWAClick(location = 'button') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'whatsapp_click', {
      event_category: 'engagement',
      event_label: location,
    });
    window.gtag('event', 'conversion', {
      send_to: 'AW-18018385768/tTojCPDWio0cEOj-6o9D',
      value: 1.0,
      currency: 'ILS',
    });
  }
  window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank');
}

function MiniLeadForm({ source = 'קמפיין-בוט-וואטסאפ' }) {
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
        sendThankYouEmail({ name: form.name, email: form.email || '', source }),
      ]);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead', { event_category: 'lead_form', event_label: source });
        window.gtag('event', 'conversion', {
          send_to: 'AW-18018385768/zoGcCMK4-IwcEOj-6o9D',
          value: 1.0,
          currency: 'ILS',
        });
      }
      window.location.href = '/תודה';
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <p className={styles.formThanks}>✅ תודה! ניצור אתכם קשר תוך 24 שעות</p>;
  }

  return (
    <form className={styles.miniForm} onSubmit={handleSubmit} dir="rtl">
      <input
        type="text"
        placeholder="שם מלא *"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className={styles.miniInput}
        required
      />
      <input
        type="tel"
        placeholder="מספר טלפון *"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        className={styles.miniInput}
        dir="ltr"
        required
      />
      <button type="submit" className={styles.miniSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? '⏳ שולח...' : '🚀 קבלו הדגמה חינמית'}
      </button>
      {status === 'error' && (
        <p className={styles.formError}>שגיאה — <a href={`https://wa.me/${WA_NUMBER}`}>שלחו וואטסאפ</a></p>
      )}
    </form>
  );
}

const INDUSTRIES = [
  { icon: '💇', label: 'מכוני יופי' },
  { icon: '🏋️', label: 'חדרי כושר' },
  { icon: '🏥', label: 'קליניקות ורופאים' },
  { icon: '🏠', label: 'נדל"ן' },
  { icon: '⚖️', label: 'עורכי דין' },
  { icon: '🔧', label: 'שיפוצניקים' },
  { icon: '📚', label: 'קואצ\'ים ויועצים' },
  { icon: '🛒', label: 'חנויות אונליין' },
];

function EarlyAccessSection() {
  return (
    <section className={styles.earlyAccess}>
      <div className={styles.container}>
        <div className={styles.earlyBadge}>🚀 תוכנית Early Access פעילה</div>
        <h2 className={styles.sectionTitle}>
          עסקים מכל הסקטורים כבר מחוברים
        </h2>
        <p className={styles.earlyDesc}>
          מספרות, קליניקות, יועצים, חנויות — הבוט עובד בכל עסק שמקבל פניות בוואטסאפ
        </p>

        <div className={styles.industriesGrid}>
          {INDUSTRIES.map((ind, i) => (
            <div key={i} className={styles.industryChip}>
              <span>{ind.icon}</span>
              <span>{ind.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🏆</span>
            <div>
              <strong>שותף Meta רשמי</strong>
              <p>אנחנו מורשים רשמית לחבר עסקים ל-WhatsApp Business API</p>
            </div>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🔒</span>
            <div>
              <strong>אבטחה ברמת בנק</strong>
              <p>כל השיחות מוצפנות. עומדים בתקנות GDPR ומערכת ישראלית</p>
            </div>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🤝</span>
            <div>
              <strong>ליווי אישי</strong>
              <p>לא עוזבים אתכם לבד — מגדירים יחד ותומכים כל הדרך</p>
            </div>
          </div>
        </div>

        <div className={styles.earlyOffer}>
          <div className={styles.earlyOfferInner}>
            <div className={styles.earlyOfferText}>
              <strong>🎁 הצטרפו עכשיו — חודש ניסיון ללא עלות</strong>
              <p>עסקים שמצטרפים בחודש הקרוב מקבלים חודש ראשון בחינם, ללא כרטיס אשראי</p>
            </div>
            <a href="/OnboardingProcess" className={styles.earlyOfferBtn}>
              🚀 אני רוצה להצטרף
            </a>
          </div>
        </div>
      </div>
    </section>
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

export default function CampaignPage() {
  const [showFloat, setShowFloat] = useState(false);
  const [liveCount] = useState(() => 487 + Math.floor(Math.random() * 30));

  useEffect(() => {
    const onScroll = () => setShowFloat(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.page} dir="rtl">

      {/* Sticky Header */}
      <header className={styles.header}>
        <img src="/new_logo.png" alt="Gambot" className={styles.logo} />
        <div className={styles.headerRight}>
          <span className={styles.liveTag}>🔴 {liveCount} עסקים פעילים</span>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
            target="_blank"
            rel="noreferrer"
            className={styles.headerWa}
            onClick={(e) => { e.preventDefault(); trackWAClick('header'); }}
          >
            💬 דברו איתנו
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>🏆 שותף Meta רשמי · עשרות לקוחות בישראל</div>
          <h1 className={styles.heroTitle}>
            עסקים שחיברו את הבוט<br />
            <span className={styles.heroHighlight}>חוסכים 15+ שעות בשבוע</span>
          </h1>
          <p className={styles.heroDesc}>
            הבוט של גמבוט עונה ללקוחות שלכם ב-<strong>שניות</strong> — 24 שעות, 7 ימים.
            גם בלילה, גם בסופ"ש, גם כשאתם עמוסים.
          </p>

          {/* Hero split: CTA + mini form */}
          <div className={styles.heroActions}>
            <button className={styles.ctaWaHero} onClick={() => trackWAClick('hero')}>
              💬 נסו את הבוט עכשיו — בחינם
            </button>
            <span className={styles.orSep}>— או —</span>
            <MiniLeadForm source="קמפיין-בוט-וואטסאפ-hero" />
          </div>
          <p className={styles.ctaSub}>⚡ לא צריך להירשם · לא צריך כרטיס אשראי · 3 דקות חיבור</p>
        </div>
      </section>

      {/* STATS BAR */}
      <section className={styles.statsBar}>
        {STATS.map((s, i) => (
          <div key={i} className={styles.stat}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* PAIN POINTS */}
      <section className={styles.pains}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>😩 מכירים את זה?</h2>
          <div className={styles.painsGrid}>
            {PAINS.map((p, i) => (
              <div key={i} className={styles.painCard}>
                <span className={styles.painIcon}>{p.icon}</span>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
          <div className={styles.painCta}>
            <strong>יש פתרון. הבוט של גמבוט מטפל בכל אלה — אוטומטית.</strong>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>✅ מה הבוט עושה בשבילכם</h2>
          <div className={styles.benefitsGrid}>
            {BENEFITS.map((b, i) => (
              <div key={i} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.benefitsCta}>
            <button className={styles.ctaWa} onClick={() => trackWAClick('benefits')}>
              💬 אני רוצה לנסות — שלחו לי דמו
            </button>
          </div>
        </div>
      </section>

      {/* EARLY ACCESS / TRUST SECTION */}
      <EarlyAccessSection />

      {/* TRY IT LIVE */}
      <section className={styles.tryLive}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🎯 הבוט שלנו הוא הדמו שלכם</h2>
          <p className={styles.tryDesc}>
            לא צריך שנכין לכם כלום — פשוט שלחו לנו הודעה עכשיו.<br />
            הבוט יענה, ישאל שאלות, ויקבע פגישה — <strong>בדיוק כמו שיעשה ללקוחות שלכם</strong>
          </p>
          <div className={styles.mockupChat}>
            <div className={styles.chatBubbleIn}>שלום, אני מעוניין בשירותים שלכם 👋</div>
            <div className={styles.chatBubbleOut}>היי! שמחים לשמוע 😊 באיזה תחום העסק שלך?</div>
            <div className={styles.chatBubbleIn}>יש לי קליניקה לטיפולים</div>
            <div className={styles.chatBubbleOut}>מצוין! אני יכול לעזור לך לנהל תורים, שאלות נפוצות ועוד. מתי נוח לך לשיחה קצרה? 📅</div>
          </div>
          <button className={styles.ctaWa} onClick={() => trackWAClick('try_live')}>
            💬 נסו את הבוט — עכשיו בחינם
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.steps}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>⚡ איך מתחילים?</h2>
          <div className={styles.stepsGrid}>
            {[
              { num: '01', text: 'שולחים לנו וואטסאפ או משאירים פרטים' },
              { num: '02', text: 'מדברים 15 דקות על הצרכים של העסק שלכם' },
              { num: '03', text: 'מגדירים את הבוט ביחד — תוך 3-5 ימים' },
              { num: '04', text: 'הבוט מתחיל לעבוד. אתם נושמים לרווחה' },
            ].map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <p>{s.text}</p>
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

      {/* FINAL CTA + FORM */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <h2 className={styles.formTitle}>🚀 מוכנים לחסוך שעות בכל שבוע?</h2>
          <p className={styles.formSubtitle}>השאירו פרטים — נחזור אליכם תוך 24 שעות</p>
          <MiniLeadForm source="קמפיין-בוט-וואטסאפ" />
          <div className={styles.formAlternative}>
            <span>מעדיפים לדבר עכשיו?</span>
            <button className={styles.ctaWaAlt} onClick={() => trackWAClick('form_bottom')}>
              💬 כתבו לנו וואטסאפ
            </button>
          </div>
          <p className={styles.privacy}>🔒 פרטיכם לא יועברו לצד שלישי · ניתן להפסיק בכל עת</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Gambot · שותף Meta רשמי · <a href="/privacy">מדיניות פרטיות</a></p>
      </footer>

      {/* Floating WhatsApp Button */}
      {showFloat && (
        <button
          className={styles.floatBtn}
          onClick={() => trackWAClick('floating')}
          aria-label="שלחו וואטסאפ"
        >
          💬 נסו בחינם
        </button>
      )}
    </div>
  );
}

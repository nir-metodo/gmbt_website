'use client';
import { useState } from 'react';
import styles from './WhatsAppMarketingPage.module.css';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';

const WA_NUMBER = '97233768997';
const WA_MSG = encodeURIComponent('היי גמבוט 👋 אני רוצה לשמוע על שיווק בוואטסאפ');

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

const COMPARISON = [
  {
    channel: '📧 אימייל',
    open: '18-22%',
    click: '2-3%',
    response: 'שעות-ימים',
    color: '#ef4444',
    bad: true,
  },
  {
    channel: '📱 SMS',
    open: '45-50%',
    click: '4-6%',
    response: 'שעות',
    color: '#f59e0b',
    bad: false,
  },
  {
    channel: '💬 וואטסאפ',
    open: '85-98%',
    click: '25-40%',
    response: 'דקות',
    color: '#25D366',
    bad: false,
    highlight: true,
  },
];

const USE_CASES = [
  {
    icon: '🔄',
    title: 'לידים ישנים שהתקררו',
    desc: 'יש לכם רשימה של מתעניינים שלא סגרו? שלחו קמפיין ממוקד — הבוט מחמם אותם מחדש ומעביר לנציג רק את החמים.',
    tag: 'Retargeting',
    tagColor: '#7c3aed',
  },
  {
    icon: '👥',
    title: 'לקוחות קיימים',
    desc: 'עדכון מוצר, מבצע בלעדי, הזמנה לאירוע — שלחו לרשימה שלכם. אחוז פתיחה של 95%+ מבטיח שהמסר יגיע.',
    tag: 'Retention',
    tagColor: '#0d7a4e',
  },
  {
    icon: '🎯',
    title: 'קמפיין מכירות ממוקד',
    desc: 'פילוח לפי תחום עניין, היסטוריית רכישה, אזור — כל אחד מקבל מסר שרלוונטי לו ספציפית.',
    tag: 'Segmentation',
    tagColor: '#2563eb',
  },
  {
    icon: '📅',
    title: 'תזכורות ועדכונים',
    desc: 'תזכורת לפגישה, חידוש מנוי, תאריך תפוגה — אוטומטי, בזמן הנכון, בערוץ שהלקוח בטוח פותח.',
    tag: 'Automation',
    tagColor: '#d97706',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '📋',
    title: 'מעלים רשימה',
    desc: 'רשימת מספרי טלפון — מה-CRM, מהאתר, מהאקסל. אנחנו מסדרים ומנקים.',
  },
  {
    step: '02',
    icon: '✍️',
    title: 'בונים את ההודעה',
    desc: 'טקסט + תמונה/וידאו/קובץ + כפתורי תגובה. אפשר לפלח — כל קבוצה מקבלת גרסה שלה.',
  },
  {
    step: '03',
    icon: '🚀',
    title: 'שולחים בלחיצה',
    desc: 'מיידי או מתוזמן. הפלטפורמה שלנו שולחת בצורה חוקית דרך WhatsApp Business API.',
  },
  {
    step: '04',
    icon: '🤖',
    title: 'הבוט מטפל בתגובות',
    desc: 'מי שענה "מעוניין" — הבוט שואל שאלות נוספות ומחמם. מי שחם — עובר לנציג.',
  },
  {
    step: '05',
    icon: '📊',
    title: 'דוחות בזמן אמת',
    desc: 'כמה נשלחו, כמה נפתחו, כמה ענו, כמה הפכו ללידים חמים — הכל מדיד.',
  },
];

const BOT_FUNNEL = [
  { icon: '📩', label: 'קיבל הודעה', count: '1,000', color: '#6b7280' },
  { icon: '👁️', label: 'פתח (95%)', count: '950', color: '#2563eb' },
  { icon: '💬', label: 'הגיב (30%)', count: '285', color: '#d97706' },
  { icon: '🔥', label: 'ליד חם (40% מהמגיבים)', count: '114', color: '#ef4444' },
  { icon: '✅', label: 'עסקה', count: '20-30', color: '#25D366' },
];

const FEATURES = [
  { icon: '🎨', title: 'תבניות עשירות', desc: 'טקסט, תמונה, וידאו, PDF, כפתורים — מסר שנראה מקצועי ומושך' },
  { icon: '🔀', title: 'פילוח מתקדם', desc: 'שלחו לקבוצות שונות מסרים שונים לפי נתוני הלקוח' },
  { icon: '⏰', title: 'תזמון אוטומטי', desc: 'קבעו מראש — שעה, יום, אוטומציה לפי תאריך לידה / תפוגה' },
  { icon: '🤖', title: 'בוט מחמם לידים', desc: 'מי שמגיב — הבוט ממשיך את השיחה ומסנן לפי רמת עניין' },
  { icon: '📊', title: 'Analytics מלא', desc: 'נשלח / נמסר / נפתח / נענה / הומר — כל מדד בזמן אמת' },
  { icon: '✅', title: 'חוקי לחלוטין', desc: 'שליחה דרך WhatsApp Business API — אין סיכון חסימה, אין spam' },
];

const FAQS = [
  {
    q: 'האם זה חוקי לשלוח הודעות שיווקיות בוואטסאפ?',
    a: 'כן — בתנאים. שליחה דרך WhatsApp Business API עם תבנית מאושרת Meta מותרת לחלוטין. אנחנו מטפלים בכל אישורי התבניות. שים לב: שליחה ללקוחות שפנו אליכם ב-24 שעות האחרונות חינמית ופתוחה; לאחרים — דרך תבניות מאושרות.',
  },
  {
    q: 'מה ההבדל בין שיווק בוואטסאפ ל-SMS?',
    a: 'וואטסאפ: אחוז פתיחה 85-98%, אינטרקטיבי (כפתורים, תמונות, וידאו, קבצים), הלקוח יכול לענות ולקיים שיחה. SMS: אחוז פתיחה ~50%, טקסט בלבד, חד-כיווני. גם עלות הוואטסאפ נמוכה יותר להודעה.',
  },
  {
    q: 'האם אפשר לשלוח לרשימת אנשי קשר קיימת?',
    a: 'כן. מעלים את הרשימה (Excel / CSV), אנחנו מנקים ומוודאים שהמספרים פעילים בוואטסאפ, ושולחים. מומלץ לשלוח לאנשים שנתנו הסכמה — גם מבחינה חוקית וגם כי התוצאות הרבה יותר טובות.',
  },
  {
    q: 'מה קורה עם מי שעונה להודעה?',
    a: 'זה הכוח האמיתי. מי שעונה — הבוט ממשיך את השיחה, שואל שאלות סינון, ומדרג לפי חום. מי שחם מאוד — מועבר לנציג מכירות עם כל ההיסטוריה. מי שלא — נכנס לרצף אוטומציה לחימום עתידי.',
  },
  {
    q: 'כמה עולה להודעה?',
    a: 'מחיר ההודעה נקבע על ידי Meta לפי מדינה — בישראל מדובר בסנטים בודדים להודעה (תלוי בסוג השיחה). נוסף על כך עלות השירות שלנו לפי חבילה. ניצור קשר עם הצעה מותאמת לכמות ולתדירות שלכם.',
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

function MiniLeadForm({ source = 'whatsapp-marketing-page' }) {
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

export default function WhatsAppMarketingPage() {
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
          <div className={styles.badge}>💬 WhatsApp Marketing · שיווק שמגיע לכולם</div>
          <h1 className={styles.heroTitle}>
            98% מהלקוחות שלכם<br />
            <span className={styles.heroHighlight}>פותחים וואטסאפ — כל יום</span>
          </h1>
          <p className={styles.heroDesc}>
            שלחו מסרים שיווקיים, מבצעים ועדכונים ישירות לוואטסאפ של הלקוחות —
            עם <strong>אחוז פתיחה של 95%+</strong>, תגובות בדקות, ובוט שהופך מתעניינים ללידים חמים
          </p>
          <div className={styles.heroActions}>
            <button className={styles.ctaPrimary} onClick={() => trackWAClick('hero_primary')}>
              🚀 קבלו הדגמה חינמית
            </button>
            <button className={styles.ctaSecondary} onClick={() => trackWAClick('hero_secondary')}>
              💬 שאלו אותנו בוואטסאפ
            </button>
          </div>
          <p className={styles.ctaSub}>⚡ ניסיון חינם · ללא כרטיס אשראי · שליחה חוקית דרך Meta</p>

          {/* Message preview mockup */}
          <div className={styles.heroMockup}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneBar}>
                <div className={styles.phoneAvatar}>🏢</div>
                <div>
                  <div className={styles.phoneName}>גמבוט — העסק שלכם</div>
                  <div className={styles.phoneOnline}>✓ מאומת</div>
                </div>
              </div>
              <div className={styles.phoneMessages}>
                <div className={styles.phoneMsgOut}>
                  <div className={styles.phoneMsgHeader}>🎁 מבצע בלעדי — 48 שעות בלבד</div>
                  <div className={styles.phoneMsgImg}>🖼️ [תמונת המוצר]</div>
                  <div className={styles.phoneMsgText}>
                    שלום דני! 👋<br />
                    כלקוח VIP מגיע לך <strong>20% הנחה</strong> על כל הקולקציה החדשה.<br />
                    ההנחה תקפה עד מחר בחצות.
                  </div>
                  <div className={styles.phoneMsgBtns}>
                    <span className={styles.phoneMsgBtn}>🛒 לרכישה בהנחה</span>
                    <span className={styles.phoneMsgBtn}>📞 דברו איתי</span>
                  </div>
                </div>
                <div className={styles.phoneMsgIn}>
                  <span>מעוניין! מה כולל המבצע?</span>
                </div>
                <div className={styles.phoneBotReply}>
                  🤖 <em>הבוט עונה ומחמם את הליד...</em>
                </div>
              </div>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}><span className={styles.heroStatNum}>95%</span><span>אחוז פתיחה</span></div>
              <div className={styles.heroStat}><span className={styles.heroStatNum}>8 דק׳</span><span>זמן תגובה ממוצע</span></div>
              <div className={styles.heroStat}><span className={styles.heroStatNum}>3×</span><span>יותר המרות מאימייל</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className={styles.comparison}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>📊 למה וואטסאפ מנצח אימייל ו-SMS?</h2>
          <div className={styles.compTable}>
            <div className={styles.compHeader}>
              <div className={styles.compCol}>ערוץ</div>
              <div className={styles.compCol}>אחוז פתיחה</div>
              <div className={styles.compCol}>אחוז קליק</div>
              <div className={styles.compCol}>זמן תגובה</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} className={`${styles.compRow} ${row.highlight ? styles.compRowHighlight : ''}`}>
                <div className={styles.compCol} style={{ fontWeight: 700 }}>{row.channel}</div>
                <div className={styles.compCol}>
                  <span className={styles.compNum} style={{ color: row.color }}>{row.open}</span>
                </div>
                <div className={styles.compCol}>
                  <span className={styles.compNum} style={{ color: row.color }}>{row.click}</span>
                </div>
                <div className={styles.compCol}>
                  <span className={styles.compNum} style={{ color: row.color }}>{row.response}</span>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.compNote}>* נתונים ממוצעים מהתעשייה · וואטסאפ Business API</p>
        </div>
      </section>

      {/* USE CASES */}
      <section className={styles.useCases}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🎯 מתי משתמשים בזה?</h2>
          <div className={styles.useCasesGrid}>
            {USE_CASES.map((uc, i) => (
              <div key={i} className={styles.useCaseCard}>
                <div className={styles.useCaseTop}>
                  <span className={styles.useCaseIcon}>{uc.icon}</span>
                  <span className={styles.useCaseTag} style={{ background: uc.tagColor }}>{uc.tag}</span>
                </div>
                <h3>{uc.title}</h3>
                <p>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOT FUNNEL */}
      <section className={styles.funnel}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🤖 הבוט הופך תגובות ללידים חמים</h2>
          <p className={styles.sectionDesc}>מ-1,000 נמענים — הנה מה שקורה בממוצע</p>
          <div className={styles.funnelSteps}>
            {BOT_FUNNEL.map((step, i) => (
              <div key={i} className={styles.funnelStep}>
                <div className={styles.funnelIcon}>{step.icon}</div>
                <div className={styles.funnelBar}>
                  <div
                    className={styles.funnelFill}
                    style={{
                      width: `${100 - i * 18}%`,
                      background: step.color,
                    }}
                  />
                </div>
                <div className={styles.funnelInfo}>
                  <span className={styles.funnelCount} style={{ color: step.color }}>{step.count}</span>
                  <span className={styles.funnelLabel}>{step.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.funnelNote}>
            🔥 הבוט מטפל אוטומטית בשלבים 2-4 — הנציג מקבל רק לידים חמים מוכנים לסגירה
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>⚡ איך זה עובד בפועל?</h2>
          <div className={styles.stepsGrid}>
            {HOW_IT_WORKS.map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepTop}>
                  <span className={styles.stepIcon}>{s.icon}</span>
                  <span className={styles.stepNum}>{s.step}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>✅ מה כלול בפלטפורמה</h2>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
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
            <div className={styles.midCtaText}>
              <h3>💡 יש לכם רשימת לקוחות או לידים ישנים?</h3>
              <p>הראו לנו — נבנה יחד קמפיין ראשון ונראה לכם את הפוטנציאל</p>
            </div>
            <button className={styles.midCtaBtn} onClick={() => trackWAClick('mid_cta')}>
              📞 קבלו ייעוץ חינמי
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
          <h2 className={styles.ctaTitle}>🚀 מוכנים לשלוח את הקמפיין הראשון?</h2>
          <p className={styles.ctaDesc}>השאירו פרטים — נחזור אליכם תוך 24 שעות עם הצעה מותאמת</p>
          <MiniLeadForm source="whatsapp-marketing-page" />
          <div className={styles.ctaOr}>
            <span>או</span>
            <button className={styles.ctaWaBtn} onClick={() => trackWAClick('cta_bottom')}>
              💬 שלחו לנו וואטסאפ
            </button>
          </div>
          <p className={styles.privacy}>🔒 ללא התחייבות · שליחה חוקית דרך Meta · פרטיכם לא יועברו לצד שלישי</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Gambot · שותף Meta רשמי · <a href="/privacy">מדיניות פרטיות</a></p>
      </footer>
    </div>
  );
}

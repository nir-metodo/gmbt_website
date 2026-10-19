import Link from 'next/link';
import { OTB_TIERS, OTB_MIN_ORDER, OTB_VAT, OTB_MAX_MESSAGES, OTB_MIN_LEAD_HOURS } from '@/lib/oneTimeBroadcastPricing';
import './OneTimeBroadcastLanding.css';

export const OTB_LANDING_URL = 'https://gambot.co.il/%D7%93%D7%99%D7%95%D7%95%D7%A8-%D7%97%D7%93-%D7%A4%D7%A2%D7%9E%D7%99/';
const ORDER_URL = 'https://gambot.co.il/one-time-broadcast/';
const BLOG_PATH = '/blog/49/%D7%93%D7%99%D7%95%D7%95%D7%A8-%D7%97%D7%93-%D7%A4%D7%A2%D7%9E%D7%99-%D7%91%D7%95%D7%95%D7%90%D7%98%D7%A1%D7%90%D7%A4-%D7%91%D7%9C%D7%99-%D7%9E%D7%A1%D7%A4%D7%A8-%D7%95%D7%91%D7%9C%D7%99-%D7%90%D7%99%D7%9E%D7%95%D7%AA-%D7%9E%D7%95%D7%9C-%D7%9E%D7%98%D7%90-%D7%94%D7%A9%D7%A7%D7%A0%D7%95-%D7%A4%D7%AA%D7%A8%D7%95%D7%9F/';

const fmt = (n) => `₪${Number(n).toLocaleString('he-IL', { maximumFractionDigits: 2 })}`;
const rangeLabel = (t) => `${t.from.toLocaleString('he-IL')}–${t.to.toLocaleString('he-IL')}`;

// Graduated pricing — identical to the order wizard (single source: lib/oneTimeBroadcastPricing).
function priceFor(count) {
  let left = count;
  let prev = 0;
  let total = 0;
  for (const t of OTB_TIERS) {
    const inTier = Math.min(left, t.to - prev);
    if (inTier > 0) total += inTier * t.price;
    left -= inTier;
    prev = t.to;
    if (left <= 0) break;
  }
  return Math.max(total, OTB_MIN_ORDER);
}

const EXAMPLES = [100, 500, 1000, 2000, 5000, 10000].map((n) => {
  const net = priceFor(n);
  return { n, net, gross: net * (1 + OTB_VAT) };
});

const USE_CASES = [
  { icon: '👥', title: 'הזמנה להצטרף לקבוצת וואטסאפ', text: 'יש לכם קבוצה או קהילה חדשה? שלחו לרשימה אחת הודעה עם כפתור הצטרפות — וכל מי שמעוניין נכנס בלחיצה.' },
  { icon: '📢', title: 'ערוץ עדכונים וקהילה', text: 'הזמינו את הקהל להצטרף לערוץ עדכונים או למועדון חדש, בלי להקים תשתית דיוור קבועה.' },
  { icon: '🎉', title: 'אירוע, מפגש או הרצאה', text: 'הזמנה חד־פעמית לאירוע, יום פתוח או פתיחה חגיגית — עם כפתור הרשמה וקישור.' },
  { icon: '🏷️', title: 'מבצע לזמן מוגבל', text: 'מבצע שמסתיים בעוד כמה ימים? הודעה אחת ללקוחות, עם קוד קופון וקישור לרכישה.' },
  { icon: '📍', title: 'מעבר מספר או כתובת', text: '“עברנו לוואטסאפ חדש” או “עברנו לסניף חדש” — עדכון אחד לכל הרשימה.' },
  { icon: '📝', title: 'סקר קצר או בקשה', text: 'סקר חד־פעמי, בקשת תרומה, התנדבות או רשימת המתנה.' },
];

const STEPS = [
  { name: 'מעלים אקסל', text: 'מעלים קובץ אקסל עם מספרי הטלפון (ושדות אישיים כמו שם, אם רוצים). המערכת בודקת את המספרים ומסננת מספרים לא תקינים, קוויים וכפילויות.' },
  { name: 'כותבים הודעה', text: 'כותבים את ההודעה עם שדות אישיים מהקובץ, מוסיפים כפתור (קישור, חיוג או תשובה מהירה) — או בוחרים תבנית מוכנה מהספרייה, למשל “הזמנה להצטרף לקבוצת וואטסאפ”.' },
  { name: 'משלמים', text: 'מחשבון מציג את המחיר המדויק לפני התשלום. משלמים בכרטיס אשראי באתר מאובטח, ומקבלים חשבונית.' },
  { name: 'מתזמנים', text: `בוחרים תאריך ושעה לשליחה (לפחות ${OTB_MIN_LEAD_HOURS} שעות קדימה, כדי שיהיה זמן לאישור התבנית ב־Meta). מקבלים מייל כשהתבנית אושרה, מייל כשהדיוור הסתיים, ובערך יום אחרי — דוח תוצאות.` },
];

const COMPARE = [
  { k: 'צריך מספר טלפון ייעודי לוואטסאפ', a: 'לא', b: 'כן', c: 'לא (אבל רק אנשי קשר ששמרו אתכם)' },
  { k: 'צריך אימות עסק מול Meta', a: 'לא', b: 'כן', c: 'לא' },
  { k: 'צריך לפתוח חשבון WhatsApp Business API', a: 'לא', b: 'כן', c: 'לא' },
  { k: 'מנוי חודשי', a: 'לא — משלמים פעם אחת', b: 'בדרך כלל כן', c: 'לא' },
  { k: 'שליחה לאנשים שלא שמרו את המספר שלכם', a: 'כן (למי שנתן הסכמה)', b: 'כן (למי שנתן הסכמה)', c: 'לא' },
  { k: 'מגבלת נמענים', a: `עד ${OTB_MAX_MESSAGES.toLocaleString('he-IL')} הודעות להזמנה`, b: 'לפי רמת האימות', c: 'עד 256 בכל רשימה' },
  { k: 'כפתורי קישור והודעה אישית לכל נמען', a: 'כן', b: 'כן', c: 'לא' },
  { k: 'דוח תוצאות', a: 'כן, במייל', b: 'תלוי בפלטפורמה', c: 'מוגבל' },
];

const FAQ = [
  { q: 'איך שולחים הודעת וואטסאפ חד־פעמית לרשימה בלי להקים מערכת דיוור?', a: `משתמשים בשירות דיוור חד־פעמי מוכן כמו זה של Gambot: מעלים אקסל עם מספרי טלפון, כותבים הודעה, משלמים ומתזמנים. אין צורך במספר וואטסאפ עסקי, באימות מול Meta או במנוי. ההודעות נשלחות מהמספר המאומת של Gambot, והמחיר כולל את עלויות WhatsApp.` },
  { q: 'אפשר לשלוח הזמנה להצטרף לקבוצת וואטסאפ לרשימת אנשים?', a: 'כן. זה אחד השימושים הנפוצים. כותבים הודעה קצרה עם כפתור קישור שמוביל להזמנה לקבוצה (או לערוץ), ושולחים אותה לכל הרשימה. הנמענים נכנסים בלחיצה. יש תבנית מוכנה בספרייה.' },
  { q: 'צריך מספר טלפון ייעודי או אימות עסק מול Meta?', a: 'לא. הדיוור נשלח דרך חשבון WhatsApp Business API המאומת של Gambot, ולכן לא צריך להקים מספר, לעבור אימות עסק או לפתוח חשבון משלכם.' },
  { q: 'כמה זה עולה?', a: `התמחור מדורג: ${OTB_TIERS.map((t) => `${rangeLabel(t)} הודעות — ${fmt(t.price)} להודעה`).join('; ')}. מינימום הזמנה ${fmt(OTB_MIN_ORDER)}. כל המחירים לפני מע״מ (${Math.round(OTB_VAT * 100)}%), כוללים את עלויות WhatsApp/Meta, ומתייחסים לנמענים בישראל — ביעדים אחרים התעריף של Meta עשוי להיות גבוה יותר והמחשבון יציג זאת.` },
  { q: 'מתי ההודעות נשלחות — אפשר מיד?', a: `ההזמנה נעשית תוך דקות ואין צורך בהקמה מוקדמת. השליחה עצמה מתוזמנת לפחות ${OTB_MIN_LEAD_HOURS} שעות קדימה, כי כל תבנית הודעה עוברת אישור של Meta (בדרך כלל עד 24 שעות). מקבלים מייל ברגע שהתבנית אושרה.` },
  { q: 'מה קורה אם Meta דוחה את ההודעה?', a: 'אם התבנית נדחית, חוזרים אליכם לתיקון ללא עלות נוספת, והדיוור מתוזמן מחדש.' },
  { q: 'מה הנמענים רואים? ולאן מגיעות התשובות?', a: 'ההודעה נשלחת מהמספר של Gambot, ובתחתיתה מופיעה אוטומטית השורה “נשלח על ידי גמבוט עבור [שם העסק שלכם]”. תשובות של נמענים לא מגיעות אליכם, ולכן כדאי להוסיף כפתור אתר או חיוג שמפנה אליכם ישירות.' },
  { q: 'איזה דוחות מקבלים?', a: 'מקבלים מייל כשהתבנית אושרה, מייל כשהדיוור הסתיים, ובערך יום אחרי השליחה דוח תוצאות: כמה הודעות נשלחו, נמסרו ונקראו, כמה לחצו על כפתורים וקישורים, ומה ענו.' },
  { q: 'האם מותר לשלוח לכל רשימה?', a: 'רק לאנשים שנתנו הסכמה לקבל מכם הודעות. בעת ההזמנה מאשרים שיש לכם הסכמה כזו, ושהאחריות על התוכן ועל הרשימה היא שלכם. נמענים יכולים לבקש להסיר את עצמם. הודעות שיווקיות ללא הסכמה אסורות בחוק ובמדיניות של Meta.' },
  { q: 'מה אם יש לי יותר מ־10,000 נמענים, או שאני צריך ליווי?', a: 'לכמות גדולה או לליווי מלא יש את שירות הדיוור המנוהל של Gambot, ולדיוורים קבועים אפשר לפתוח מערכת דיוור מלאה עם ניסיון חינם.' },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'דיוור חד־פעמי בוואטסאפ — Gambot',
    alternateName: 'One-time WhatsApp broadcast',
    serviceType: 'WhatsApp one-time broadcast',
    description: `שירות דיוור חד־פעמי בוואטסאפ, בלי מספר ייעודי, בלי אימות עסק מול Meta ובלי מנוי. מעלים אקסל, כותבים הודעה, משלמים ומתזמנים. מחיר מ־${fmt(OTB_MIN_ORDER)} לפני מע״מ.`,
    url: OTB_LANDING_URL,
    areaServed: ['IL', 'Worldwide'],
    inLanguage: 'he',
    provider: { '@type': 'Organization', name: 'Gambot', url: 'https://gambot.co.il' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'ILS',
      lowPrice: OTB_MIN_ORDER,
      highPrice: Math.round(priceFor(OTB_MAX_MESSAGES)),
      offerCount: OTB_TIERS.length,
      url: ORDER_URL,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'איך שולחים דיוור וואטסאפ חד־פעמי עם Gambot',
    totalTime: 'PT10M',
    step: STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text, url: `${OTB_LANDING_URL}#steps` })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Gambot', item: 'https://gambot.co.il/' },
      { '@type': 'ListItem', position: 2, name: 'דיוור חד־פעמי בוואטסאפ', item: OTB_LANDING_URL },
    ],
  },
];

export default function OneTimeBroadcastLanding() {
  return (
    <main className="otbl" dir="rtl" lang="he">
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="otbl-hero">
        <div className="otbl-wrap">
          <span className="otbl-badge">⚡ בלי מספר · בלי אימות מול Meta · בלי מנוי</span>
          <h1>דיוור חד־פעמי בוואטסאפ — בלי להקים כלום</h1>
          <p className="otbl-lead">
            צריכים לשלוח הודעה אחת לרשימה — הזמנה לקבוצת וואטסאפ, אירוע, מבצע או עדכון? מעלים אקסל, כותבים הודעה, משלמים ומתזמנים.
            מתחילים ממחיר של {fmt(OTB_MIN_ORDER)} לפני מע״מ, בלי מספר ייעודי ובלי אימות עסק מול Meta.
          </p>
          <div className="otbl-cta-row">
            <Link href="/one-time-broadcast/" className="otbl-btn primary">להזמנת דיוור חד־פעמי</Link>
            <a href="#pricing" className="otbl-btn ghost">מחירון</a>
          </div>
          <ul className="otbl-facts">
            <li><b>{fmt(OTB_TIERS[0].price)}</b> להודעה (עד {OTB_TIERS[0].to.toLocaleString('he-IL')})</li>
            <li><b>עד {OTB_MAX_MESSAGES.toLocaleString('he-IL')}</b> הודעות להזמנה</li>
            <li><b>דוח תוצאות</b> במייל</li>
          </ul>
        </div>
      </section>

      <section className="otbl-section" id="what">
        <div className="otbl-wrap otbl-narrow">
          <h2>מהו דיוור חד־פעמי בוואטסאפ?</h2>
          <p className="otbl-answer">
            דיוור חד־פעמי בוואטסאפ הוא שליחה של הודעה אחת לרשימת נמענים, בלי להקים מערכת דיוור קבועה. בשירות של Gambot אין צורך במספר וואטסאפ עסקי,
            באימות עסק מול Meta או במנוי: ההודעות נשלחות דרך חשבון WhatsApp Business API המאומת של Gambot, והמחיר כולל את עלויות WhatsApp.
          </p>
          <p>
            זה מתאים למי שצריך לשלוח הודעה פעם אחת או מדי פעם — למשל להזמין אנשים להצטרף לקבוצת וואטסאפ — ולא רוצה לחכות לאימות, להקים מספר או לשלם דמי מנוי.
            מי שמדוור באופן קבוע יכול לעבור ל<Link href="/מערכת-דיוור-וואטסאפ/">מערכת דיוור מלאה</Link> של Gambot.
          </p>
        </div>
      </section>

      <section className="otbl-section alt" id="use-cases">
        <div className="otbl-wrap">
          <h2>למה משתמשים בדיוור חד־פעמי</h2>
          <div className="otbl-grid">
            {USE_CASES.map((u) => (
              <article key={u.title} className="otbl-card">
                <div className="otbl-ico" aria-hidden="true">{u.icon}</div>
                <h3>{u.title}</h3>
                <p>{u.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="otbl-section" id="steps">
        <div className="otbl-wrap otbl-narrow">
          <h2>איך זה עובד — 4 צעדים</h2>
          <ol className="otbl-steps">
            {STEPS.map((s) => (
              <li key={s.name}><b>{s.name}.</b> {s.text}</li>
            ))}
          </ol>
          <div className="otbl-cta-row">
            <Link href="/one-time-broadcast/" className="otbl-btn primary">מתחילים הזמנה</Link>
          </div>
        </div>
      </section>

      <section className="otbl-section alt" id="compare">
        <div className="otbl-wrap">
          <h2>דיוור חד־פעמי מול חלופות</h2>
          <div className="otbl-table-wrap">
            <table className="otbl-table">
              <thead>
                <tr>
                  <th scope="col"> </th>
                  <th scope="col" className="hl">דיוור חד־פעמי של Gambot</th>
                  <th scope="col">הקמת WhatsApp Business API עצמאית</th>
                  <th scope="col">רשימת תפוצה באפליקציית Business</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.k}>
                    <th scope="row">{r.k}</th>
                    <td className="hl">{r.a}</td>
                    <td>{r.b}</td>
                    <td>{r.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="otbl-section" id="pricing">
        <div className="otbl-wrap otbl-narrow">
          <h2>כמה עולה דיוור חד־פעמי?</h2>
          <p className="otbl-answer">
            המחיר מדורג לפי כמות ההודעות, מתחיל ב־{fmt(OTB_TIERS[0].price)} להודעה לפני מע״מ, ומינימום ההזמנה הוא {fmt(OTB_MIN_ORDER)}. המחיר כולל את עלויות WhatsApp/Meta ללא תשלום נוסף.
          </p>
          <div className="otbl-table-wrap">
            <table className="otbl-table">
              <thead>
                <tr><th scope="col">טווח הודעות</th><th scope="col">מחיר להודעה (לפני מע״מ)</th></tr>
              </thead>
              <tbody>
                {OTB_TIERS.map((t) => (
                  <tr key={t.to}><td>{rangeLabel(t)}</td><td>{fmt(t.price)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>דוגמאות</h3>
          <div className="otbl-table-wrap">
            <table className="otbl-table">
              <thead>
                <tr><th scope="col">מספר נמענים</th><th scope="col">לפני מע״מ</th><th scope="col">כולל מע״מ ({Math.round(OTB_VAT * 100)}%)</th></tr>
              </thead>
              <tbody>
                {EXAMPLES.map((e) => (
                  <tr key={e.n}><td>{e.n.toLocaleString('he-IL')}</td><td>{fmt(e.net)}</td><td>{fmt(e.gross)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="otbl-note">
            כל טווח מחויב במחירו. המחירים מתייחסים לנמענים בישראל; ביעדים אחרים תעריף Meta גבוה יותר, והמחשבון בהזמנה מציג את המחיר המדויק לפני התשלום.
            שולחים ומשלמים רק על מספרי נייד תקינים. לכמות של מעל {OTB_MAX_MESSAGES.toLocaleString('he-IL')} הודעות — <Link href="/PriceList/ManagedBroadcast/">שירות הדיוור המנוהל</Link>.
          </p>
        </div>
      </section>

      <section className="otbl-section alt" id="good-to-know">
        <div className="otbl-wrap otbl-narrow">
          <h2>חשוב לדעת לפני שמזמינים</h2>
          <ul className="otbl-list">
            <li><b>שולח ההודעה הוא Gambot.</b> ההודעה יוצאת מהמספר של Gambot ובתחתיתה כתוב “נשלח על ידי גמבוט עבור [שם העסק שלכם]”. תשובות של נמענים לא מגיעות אליכם — הוסיפו כפתור אתר או חיוג.</li>
            <li><b>תזמון מראש.</b> השליחה מתוזמנת לפחות {OTB_MIN_LEAD_HOURS} שעות קדימה, בגלל אישור התבנית של Meta.</li>
            <li><b>רק למי שהסכים.</b> שולחים רק לאנשים שנתנו הסכמה לקבל מכם הודעות, והאחריות על התוכן והרשימה היא שלכם.</li>
            <li><b>מספרי נייד בלבד.</b> מספרים קוויים, לא תקינים וכפילויות לא נשלחים ולא מחויבים.</li>
          </ul>
        </div>
      </section>

      <section className="otbl-section" id="faq">
        <div className="otbl-wrap otbl-narrow">
          <h2>שאלות נפוצות</h2>
          {FAQ.map((f) => (
            <details key={f.q} className="otbl-faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="otbl-section alt" id="more">
        <div className="otbl-wrap otbl-narrow">
          <h2>קראו עוד</h2>
          <ul className="otbl-list">
            <li><Link href={BLOG_PATH}>למה בנינו דיוור חד־פעמי: בלי מספר ובלי אימות מול Meta</Link></li>
            <li><Link href="/דיוור-בוואטסאפ/">דיוור בוואטסאפ — המדריך המלא</Link></li>
            <li><Link href="/מערכת-דיוור-וואטסאפ/">מערכת דיוור וואטסאפ לדיוורים קבועים</Link></li>
            <li><Link href="/PriceList/ManagedBroadcast/">שירות דיוור מנוהל</Link></li>
          </ul>
        </div>
      </section>

      <section className="otbl-final">
        <div className="otbl-wrap">
          <h2>מוכנים לשלוח?</h2>
          <p>מעלים אקסל, כותבים הודעה, ומתזמנים. התחלה ב־{fmt(OTB_MIN_ORDER)} לפני מע״מ.</p>
          <Link href="/one-time-broadcast/" className="otbl-btn primary">להזמנת דיוור חד־פעמי</Link>
          <p className="otbl-updated">עודכן לאחרונה: 17 באוקטובר 2026</p>
        </div>
      </section>
    </main>
  );
}

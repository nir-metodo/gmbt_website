import Link from 'next/link';
import styles from '../page.module.css';
import LeadForm from '@/components/LeadForm/LeadForm';

export const metadata = {
  title: 'WhatsApp CRM | ניהול לידים, משימות ופניות | גמבוט',
  description: 'גמבוט CRM — ניהול לידים, הצעות מחיר, משימות ופניות ישירות מתוך וואטסאפ. כל מידע הלקוח במקום אחד. מסנני תצוגה מותאמים אישית.',
  keywords: 'WhatsApp CRM, ניהול לידים וואטסאפ, CRM לוואטסאפ, ניהול פניות, ניהול משימות, הצעות מחיר',
  alternates: { canonical: 'https://gambot.co.il/וואטסאפ-crm/' },
  openGraph: {
    title: 'WhatsApp CRM | ניהול לידים, משימות ופניות | גמבוט',
    description: 'ניהול לידים, הצעות מחיר, משימות ופניות ישירות מוואטסאפ',
    url: 'https://gambot.co.il/וואטסאפ-crm/',
    locale: 'he_IL',
    type: 'website',
  },
};

const FEATURES = [
  {
    icon: '🎯',
    title: 'ניהול לידים',
    desc: 'עקוב אחר כל ליד מהרגע שהגיע ועד סגירת עסקה. סטטוסים, תגיות, מסנני תצוגה והיסטוריית שיחות — הכל במקום אחד.',
  },
  {
    icon: '📋',
    title: 'הצעות מחיר',
    desc: 'צור ושלח הצעות מחיר ישירות מוואטסאפ. עקוב אחר הצעות פתוחות, מאושרות ודחויות. מסנני הצגה לפי איש מכירות.',
  },
  {
    icon: '✅',
    title: 'ניהול משימות',
    desc: 'הגדר משימות לצוות, קבע תזכורות ובצע מעקב אחר ביצוע. שייך משימות לשיחות ולאנשי קשר ספציפיים.',
  },
  {
    icon: '📞',
    title: 'ניהול פניות',
    desc: 'כל פנייה נכנסת מנותבת ומנוהלת אוטומטית. הגדר עדיפויות, זמני תגובה ותיאום בין נציגים.',
  },
  {
    icon: '👥',
    title: 'ניהול אנשי קשר',
    desc: 'בנה פרופיל מלא לכל לקוח: פרטי קשר, היסטוריית שיחות, תגיות מותאמות אישית ומאפיינים עסקיים.',
  },
  {
    icon: '📊',
    title: 'דוחות ואנליטיקה',
    desc: 'מעקב אחר ביצועי הצוות, זמן תגובה, שיעורי המרה וצמיחת לקוחות — בזמן אמת.',
  },
];

const WORKFLOW = [
  { step: '01', title: 'ליד נכנס', desc: 'לקוח שולח הודעה → נוצר ליד אוטומטי עם כל פרטי הקשר' },
  { step: '02', title: 'ניתוב אוטומטי', desc: 'הבוט מסנן ומדרג — ליד חם מועבר לנציג הנכון' },
  { step: '03', title: 'ניהול בCRM', desc: 'הנציג רואה הכל: שיחות, הצעות, משימות — בממשק אחד' },
  { step: '04', title: 'סגירת עסקה', desc: 'שלח הצעת מחיר, קבל אישור וסגור עסקה — דרך וואטסאפ' },
];

const CRM_FEATURES_LIST = [
  'תצוגות מותאמות אישית (Saved Views)',
  'מסנני לידים לפי איש מכירות, סטטוס, תאריך',
  'הצעות מחיר עם מעקב סטטוס',
  'משימות עם תאריך יעד ותזכורות',
  'היסטוריית שיחות מלאה',
  'תגיות ופילוחי לקוחות',
  'הרשאות גישה לפי משתמש',
  'יצוא נתונים לאקסל',
  'אינטגרציה עם Google Sheets',
  'אינטגרציה עם מערכות CRM חיצוניות',
  'דוחות ביצועי צוות',
  'ממשק עברי מלא',
];

const FAQ = [
  {
    q: 'האם גמבוט CRM מתאים לעסקים קטנים?',
    a: 'כן! גמבוט CRM מתוכנן לעסקים בכל הגדלים — מעצמאי בודד ועד ארגון עם עשרות נציגים. ניתן להתאים הרשאות ותצוגות לכל גודל עסק.',
  },
  {
    q: 'האם ה-CRM מחובר לוואטסאפ?',
    a: 'כן! ה-CRM בנוי ישירות בתוך מערכת גמבוט. כל שיחת וואטסאפ מקושרת אוטומטית ללקוח, לליד ולהיסטוריה. אין צורך לעבור בין מערכות.',
  },
  {
    q: 'האם ניתן לנהל כמה נציגים?',
    a: 'כן! כל חבילה כוללת מספר משתמשים. ניתן להגדיר הרשאות שונות — נציג רואה רק את הלידים שלו, מנהל רואה הכל.',
  },
  {
    q: 'מה ההבדל בין לידים לפניות?',
    a: 'לידים הם לקוחות פוטנציאלים שנמצאים בתהליך מכירה. פניות הן בקשות שירות או שאלות מלקוחות קיימים. גמבוט מנהל את שניהם בנפרד.',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'גמבוט WhatsApp CRM',
      applicationCategory: 'BusinessApplication',
      description: 'מערכת CRM לניהול לידים, הצעות מחיר, משימות ופניות דרך WhatsApp',
      url: 'https://gambot.co.il/וואטסאפ-crm/',
      offers: { '@type': 'Offer', price: '143', priceCurrency: 'ILS' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function WhatsAppCRMPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>🗂️ WhatsApp CRM</div>
          <h1 className={styles.heroTitle}>
            נהל לידים, פניות ומכירות <span className={styles.highlight}>ישירות מוואטסאפ</span>
          </h1>
          <p className={styles.heroDesc}>
            כל מידע הלקוח במקום אחד — לידים, הצעות מחיר, משימות, פניות והיסטוריית שיחות. CRM שבנוי בתוך וואטסאפ, לא לצידו.
          </p>
          <div className={styles.heroCta}>
            <a href="https://gambot.co.il/OnboardingProcess" className={styles.btnPrimary}>
              🚀 התחילו ניסיון חינם — חודש
            </a>
            <a href="https://wa.me/97233768997?text=היי, אני מעוניין ב-CRM של גמבוט" className={styles.btnSecondary} target="_blank" rel="noopener noreferrer">
              📞 הזמינו הדגמה
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🌟 מה כולל WhatsApp CRM של גמבוט</h2>
          <p className={styles.sectionDesc}>כלים מקצועיים לניהול מכירות ושירות — הכל בתוך ממשק אחד</p>
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

      {/* Features List */}
      <section className={`${styles.section} ${styles.bgLight}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>✅ כל יכולות ה-CRM</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', maxWidth: '900px', margin: '0 auto' }}>
            {CRM_FEATURES_LIST.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', fontSize: '0.95rem', color: '#2d3748' }}>
                <span style={{ color: '#25D366', fontSize: '1.1rem' }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>⚡ איך עובד התהליך?</h2>
          <div className={styles.stepsGrid}>
            {WORKFLOW.map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum}>{s.step}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${styles.section} ${styles.bgLight}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>❓ שאלות נפוצות</h2>
          <div className={styles.faqGrid}>
            {FAQ.map((f, i) => (
              <div key={i} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{f.q}</h3>
                <p className={styles.faqA}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>🚀 מוכנים לנהל מכירות חכם יותר?</h2>
          <p>הצטרפו ל-500+ עסקים שכבר מנהלים את הלקוחות שלהם דרך גמבוט CRM.</p>
          <LeadForm source="whatsapp-crm" />
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/PriceList/" className={styles.btnSecondary}>צפו במחירים</Link>
            <Link href="/בוט-לידים-וואטסאפ/" className={styles.btnSecondary}>בוט לידים AI</Link>
          </div>
        </div>
      </section>
    </>
  );
}

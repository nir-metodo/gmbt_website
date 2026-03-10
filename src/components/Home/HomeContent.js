'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LeadForm from '@/components/LeadForm/LeadForm';
import styles from '@/app/page.module.css';

const DATA = {
  he: {
    badge: '🏆 שותף מטא רשמי לישראל',
    heroTitle: ['מערכת ', 'WhatsApp API', ' מובילה בישראל'],
    heroDesc: 'בוט AI, אוטומציה, קמפיינים ושירות לקוחות 24/7 — הכל ללא קוד, עם ממשק עברי מלא ותמיכה ישראלית',
    ctaPrimary: '🚀 התחילו ניסיון חינם — חודש',
    ctaSecondary: '📞 הזמינו הדגמה',
    stats: [
      { value: '95%', label: 'אחוזי פתיחה להודעות' },
      { value: '24/7', label: 'מענה אוטומטי ללקוחות' },
      { value: '80%', label: 'חיסכון בזמן שירות' },
      { value: '#1', label: 'WhatsApp API בישראל' },
    ],
    solutionsTitle: '🌟 הפתרונות שלנו',
    solutionsDesc: 'כל מה שצריך כדי לנהל, לשווק ולמכור דרך WhatsApp — במקום אחד',
    solutions: [
      { href: '/בוט-וואטסאפ', icon: '🤖', title: 'בוט לוואטסאפ', desc: 'Workflow Designer חזותי — בנו בוטים מורכבים ללא קוד' },
      { href: '/בוט-לידים-וואטסאפ', icon: '🎯', title: 'בוט לידים AI', desc: 'הסמכת לידים אוטומטית, שליחת הצעות ועדכון CRM' },
      { href: '/שיווק-בוואטסאפ', icon: '📈', title: 'שיווק בוואטסאפ', desc: 'קמפיינים שיווקיים עם אחוזי פתיחה של 95%' },
      { href: '/אוטומציה-בוואטסאפ', icon: '⚙️', title: 'אוטומציה', desc: 'תהליכים עסקיים אוטומטיים עם API, CRM ו-Google Sheets' },
      { href: '/וואטסאפ-crm', icon: '🗂️', title: 'WhatsApp CRM', desc: 'ניהול לידים, משימות, פניות, הצעות מחיר וקשרי לקוחות' },
      { href: '/צאטבוט-וואטסאפ', icon: '💬', title: 'צ׳אטבוט AI', desc: 'שירות לקוחות 24/7 — מענה מיידי בכל שעה' },
      { href: '/דיוור-בוואטסאפ', icon: '📨', title: 'דיוור המוני', desc: 'שלחו ניוזלטר וקמפיינים לאלפי לקוחות בלחיצה' },
      { href: '/זימון-תורים-וואטסאפ', icon: '📅', title: 'זימון תורים', desc: 'לוח שנה חכם, אישורים ותזכורות אוטומטיות' },
      { href: '/בוט-שירות-לקוחות-וואטסאפ', icon: '🎧', title: 'שירות לקוחות', desc: 'ניתוב חכם, CSAT גבוה ו-80% אוטומטי' },
      { href: '/הצעות-מחיר', icon: '💰', title: 'הצעות מחיר', desc: 'יצרו ושלחו הצעות מחיר מקצועיות ישירות בוואטסאפ' },
      { href: '/חתימה-דיגיטלית', icon: '✍️', title: 'חתימה דיגיטלית', desc: 'חתימה על מסמכים ישירות בוואטסאפ — מהירה וחוקית' },
      { href: '/ניהול-מדיה', icon: '🗄️', title: 'ניהול מדיה', desc: 'ארגון ושיתוף קבצים כמו Google Drive — ישירות בוואטסאפ' },
    ],
    whyTitle: '💡 למה גמבוט?',
    features: [
      { icon: '🎨', title: 'ללא קוד — גרור ושחרר', desc: 'בנו בוטים ואוטומציות מורכבות עם ממשק ויזואלי אינטואיטיבי' },
      { icon: '🤖', title: 'AI מתקדם', desc: 'AI Trigger, Gambot Agent, ניתוח כוונות ותשובות חכמות' },
      { icon: '🔗', title: 'אינטגרציות', desc: 'CRM, Google Sheets, API, Slack, HubSpot ועוד 50+ חיבורים' },
      { icon: '📊', title: 'דוחות Real-Time', desc: 'מעקב אחר ביצועים, המרות והתנהגות לקוחות בזמן אמת' },
      { icon: '🇮🇱', title: 'ישראלי 100%', desc: 'ממשק בעברית, תמיכה טכנית בעברית ועמידה בתנאי Meta' },
      { icon: '🛡️', title: 'אמין ובטוח', desc: 'שותף מטא רשמי | Uptime 99.9% | הצפנה מלאה' },
    ],
    stepsTitle: '⚡ איך מתחילים?',
    steps: [
      { step: '01', title: 'נרשמים', desc: 'פותחים חשבון בחינם — 5 דקות וזה מוכן' },
      { step: '02', title: 'מחברים מספר', desc: 'מחברים את המספר העסקי ומאמתים עם Meta' },
      { step: '03', title: 'בונים בוט', desc: 'גוררים ושוחררים בממשק הוויזואלי — ללא קוד' },
      { step: '04', title: 'מתחילים להרוויח', desc: 'הבוט עובד 24/7 ואתם רואים תוצאות' },
    ],
    faqTitle: '❓ שאלות נפוצות',
    faq: [
      { q: 'מה זה WhatsApp Business API?', a: 'WhatsApp Business API הוא הגרסה העסקית של WhatsApp שמאפשרת שליחת הודעות אוטומטיות, ניהול שיחות עם אלפי לקוחות ובניית בוטים — עם אישור רשמי של Meta.' },
      { q: 'האם גמבוט שותף רשמי של Meta?', a: 'כן! גמבוט הוא Business Solution Provider (BSP) מורשה של Meta לישראל — מה שמבטיח גישה לכל היכולות ועמידה בתנאי השירות.' },
      { q: 'האם ניתן לנסות בחינם?', a: 'כן! יש ניסיון חינם של חודש שלם ללא כרטיס אשראי. יוצרים חשבון תוך 5 דקות.' },
      { q: 'כמה עולה השירות?', a: 'התוכניות מתחילות מ-₪115/חודש. מחיר סופי תלוי בפיצ׳רים ובנפח ההודעות. דברו איתנו להצעה אישית.' },
      { q: 'כמה זמן לוקח להקים את המערכת?', a: 'יצירת חשבון — 5 דקות. בוט מלא ואוטומציות — יום עד שבוע. אנחנו מלווים לאורך כל הדרך.' },
      { q: 'האם יש תמיכה בעברית?', a: 'כן! כל הממשק בעברית, תמיכה טכנית בעברית ומדריכים מפורטים.' },
    ],
    ourFeaturesTitle: '🛠️ הפיצ׳רים שלנו',
    ourFeaturesDesc: 'כל הכלים שצריכים לנהל את הלקוחות, המכירות והשירות — ישירות מוואטסאפ',
    ourFeatures: [
      { icon: '👥', title: 'CRM ניהול אנשי קשר', desc: 'ניהול מלא של לקוחות: תגיות, שדות מותאמים, ציר זמן ותיעוד כל אינטראקציה כולל קבצי מדיה.' },
      { icon: '📋', title: 'ניהול תבניות WhatsApp', desc: 'יצירת תבניות עם משתנים, תמונות, וידאו, מיקומים וכפתורים אינטראקטיביים — בהתאם לתנאי Meta.' },
      { icon: '📝', title: 'WhatsApp Flows', desc: 'טפסים דינמיים ומסכים אינטראקטיביים שזורמים בתוך הוואטסאפ, כולל שליחה ל-API חיצוני.' },
      { icon: '🤖', title: 'בוטים ואוטומציות', desc: 'בנו בוטים שמגיבים אוטומטית לפי טריגרים, שולחים נתונים ל-CRM ומבצעים פעולות דינמיות.' },
      { icon: '🛒', title: 'קטלוג ומכירה בוואטסאפ', desc: 'חנות דיגיטלית בשיחה — קטלוג מוצרים, בחירת פריטים וסל קניות ישירות בוואטסאפ.' },
      { icon: '🧠', title: 'AI מבוסס מאגר ידע', desc: 'מודל בינה מלאכותית שלומד מהתוכן שלכם ומשיב על שאלות לקוחות בצורה מדויקת.' },
      { icon: '💬', title: 'מרכז שיחות רב-נציגים', desc: 'ניהול שיחות עם לקוחות דרך מספר נציגים במקביל, עם סטטוסים, הערות פנימיות וניתוב חכם.' },
      { icon: '📢', title: 'קמפיינים ודיוור', desc: 'שליחת הודעות מותאמות אישית לאלפי לקוחות לפי פילטרים ותזמון אוטומטי.' },
      { icon: '✅', title: 'ניהול משימות', desc: 'משימות עם שיוך לנציג, תאריך יעד, סטטוסים דינמיים ותזכורות אוטומטיות.' },
      { icon: '📊', title: 'לידים והצעות מחיר', desc: 'ניהול לידים מלא, יצירת הצעות מחיר, מעקב אחר סטטוס וסגירת עסקות דרך וואטסאפ.' },
      { icon: '✍️', title: 'חתימה דיגיטלית', desc: 'שלחו מסמכים לחתימה דיגיטלית ישירות דרך וואטסאפ או אימייל — מאובטח וחוקי.' },
      { icon: '📅', title: 'זימון תורים', desc: 'לוח שנה חכם, אישורים ותזכורות אוטומטיות — ישירות דרך שיחת וואטסאפ.' },
    ],
    integrationsTitle: '🔗 חיבורים ואינטגרציות',
    integrationsDesc: 'גמבוט מתחבר לכל הכלים שאתם כבר משתמשים בהם',
    ctaSectionTitle: '🚀 מוכנים להתחיל?',
    ctaSectionDesc: 'הצטרפו לעסקים ברחבי ישראל שכבר מנהלים את הלקוחות שלהם דרך גמבוט. ניסיון חינם חודש ללא כרטיס אשראי.',
  },
  en: {
    badge: '🏆 Official Meta Partner in Israel',
    heroTitle: ['Leading ', 'WhatsApp API', ' Platform in Israel'],
    heroDesc: 'AI Bot, Automation, Campaigns & 24/7 Customer Service — all without code, with full Hebrew UI and Israeli support',
    ctaPrimary: '🚀 Start Free Trial — 1 Month',
    ctaSecondary: '📞 Book a Demo',
    stats: [
      { value: '95%', label: 'Message Open Rate' },
      { value: '24/7', label: 'Automated Customer Support' },
      { value: '80%', label: 'Time Saved on Service' },
      { value: '#1', label: 'WhatsApp API in Israel' },
    ],
    solutionsTitle: '🌟 Our Solutions',
    solutionsDesc: 'Everything you need to manage, market, and sell via WhatsApp — in one place',
    solutions: [
      { href: '/בוט-וואטסאפ', icon: '🤖', title: 'WhatsApp Bot', desc: 'Visual Workflow Designer — build complex bots without code' },
      { href: '/בוט-לידים-וואטסאפ', icon: '🎯', title: 'AI Lead Bot', desc: 'Automatic lead qualification, sending proposals and CRM updates' },
      { href: '/שיווק-בוואטסאפ', icon: '📈', title: 'WhatsApp Marketing', desc: 'Marketing campaigns with 95% open rates' },
      { href: '/אוטומציה-בוואטסאפ', icon: '⚙️', title: 'Automation', desc: 'Automated business processes with API, CRM and Google Sheets' },
      { href: '/וואטסאפ-crm', icon: '🗂️', title: 'WhatsApp CRM', desc: 'Manage leads, tasks, inquiries, quotes and customer relations' },
      { href: '/צאטבוט-וואטסאפ', icon: '💬', title: 'AI Chatbot', desc: '24/7 Customer service — instant response at any hour' },
      { href: '/דיוור-בוואטסאפ', icon: '📨', title: 'Mass Messaging', desc: 'Send newsletters and campaigns to thousands of customers with one click' },
      { href: '/הצעות-מחיר', icon: '💰', title: 'Price Quotes', desc: 'Create and send professional price quotes directly via WhatsApp' },
      { href: '/חתימה-דיגיטלית', icon: '✍️', title: 'Digital Signature', desc: 'Sign documents directly in WhatsApp — fast and legally valid' },
      { href: '/ניהול-מדיה', icon: '🗄️', title: 'Media Management', desc: 'Organize and share files like Google Drive — directly in WhatsApp' },
      { href: '/זימון-תורים-וואטסאפ', icon: '📅', title: 'Appointment Scheduling', desc: 'Smart calendar, automatic confirmations and reminders' },
      { href: '/בוט-שירות-לקוחות-וואטסאפ', icon: '🎧', title: 'Customer Service', desc: 'Smart routing, high CSAT and 80% automated' },
    ],
    whyTitle: '💡 Why Gambot?',
    features: [
      { icon: '🎨', title: 'No Code — Drag & Drop', desc: 'Build complex bots and automations with an intuitive visual interface' },
      { icon: '🤖', title: 'Advanced AI', desc: 'AI Trigger, Gambot Agent, intent analysis and smart responses' },
      { icon: '🔗', title: 'Integrations', desc: 'CRM, Google Sheets, API, Slack, HubSpot and 50+ connections' },
      { icon: '📊', title: 'Real-Time Reports', desc: 'Track performance, conversions and customer behavior in real time' },
      { icon: '🇮🇱', title: '100% Israeli', desc: 'Hebrew UI, Hebrew technical support and Meta-compliant' },
      { icon: '🛡️', title: 'Reliable & Secure', desc: 'Official Meta Partner | 99.9% Uptime | Full Encryption' },
    ],
    stepsTitle: '⚡ How to Get Started?',
    steps: [
      { step: '01', title: 'Sign Up', desc: 'Open a free account — ready in 5 minutes' },
      { step: '02', title: 'Connect Number', desc: 'Connect your business number and verify with Meta' },
      { step: '03', title: 'Build a Bot', desc: 'Drag and drop in the visual interface — no code' },
      { step: '04', title: 'Start Winning', desc: 'The bot works 24/7 and you see results' },
    ],
    faqTitle: '❓ Frequently Asked Questions',
    faq: [
      { q: 'What is WhatsApp Business API?', a: 'WhatsApp Business API is the business version of WhatsApp that enables automated messaging, managing conversations with thousands of customers and building bots — with official Meta approval.' },
      { q: 'Is Gambot an official Meta partner?', a: 'Yes! Gambot is an authorized Business Solution Provider (BSP) by Meta in Israel — ensuring access to all capabilities and compliance with terms of service.' },
      { q: 'Can I try for free?', a: 'Yes! There is a full one-month free trial with no credit card required. Create an account in 5 minutes.' },
      { q: 'How much does the service cost?', a: 'Plans start from ₪115/month. Final price depends on features and message volume. Talk to us for a personal quote.' },
      { q: 'How long does setup take?', a: 'Account creation — 5 minutes. Full bot and automations — one day to one week. We guide you every step of the way.' },
      { q: 'Is there Hebrew support?', a: 'Yes! The entire interface is in Hebrew, technical support in Hebrew and detailed guides.' },
    ],
    ourFeaturesTitle: '🛠️ Our Features',
    ourFeaturesDesc: 'All the tools needed to manage customers, sales and service — directly from WhatsApp',
    ourFeatures: [
      { icon: '👥', title: 'Contact CRM', desc: 'Full customer management: tags, custom fields, timeline and documentation of every interaction including media files.' },
      { icon: '📋', title: 'WhatsApp Templates', desc: 'Create templates with variables, images, video, locations and interactive buttons — in compliance with Meta terms.' },
      { icon: '📝', title: 'WhatsApp Flows', desc: 'Dynamic forms and interactive screens flowing inside WhatsApp, including sending to external API.' },
      { icon: '🤖', title: 'Bots & Automations', desc: 'Build bots that respond automatically based on triggers, send data to CRM and perform dynamic actions.' },
      { icon: '🛒', title: 'Catalog & WhatsApp Sales', desc: 'Digital store in conversation — product catalog, item selection and shopping cart directly in WhatsApp.' },
      { icon: '🧠', title: 'Knowledge-Based AI', desc: 'AI model that learns from your content and answers customer questions accurately.' },
      { icon: '💬', title: 'Multi-Agent Chat Center', desc: 'Manage customer conversations across multiple agents in parallel, with statuses, internal notes and smart routing.' },
      { icon: '📢', title: 'Campaigns & Broadcasts', desc: 'Send personalized messages to thousands of customers based on filters and automatic scheduling.' },
      { icon: '✅', title: 'Task Management', desc: 'Tasks with agent assignment, due dates, dynamic statuses and automatic reminders.' },
      { icon: '📊', title: 'Leads & Quotes', desc: 'Full lead management, creating price quotes, tracking status and closing deals via WhatsApp.' },
      { icon: '✍️', title: 'Digital Signature', desc: 'Send documents for digital signature directly via WhatsApp or email — secure and legally valid.' },
      { icon: '📅', title: 'Appointment Booking', desc: 'Smart calendar, automatic confirmations and reminders — directly via WhatsApp conversation.' },
    ],
    integrationsTitle: '🔗 Connections & Integrations',
    integrationsDesc: 'Gambot connects to all the tools you already use',
    ctaSectionTitle: '🚀 Ready to Start?',
    ctaSectionDesc: 'Join businesses across Israel already managing their customers through Gambot. 1-month free trial, no credit card required.',
  },
};

const INTEGRATIONS = [
  { name: 'Salesforce', img: 'Salesforce.png' },
  { name: 'Monday', img: 'mondaynew.png' },
  { name: 'Power Automate', img: 'PowerAutomate.png' },
  { name: 'Make', img: 'make.jpg' },
  { name: 'Zapier', img: 'zapier.png' },
  { name: 'Office 365', img: 'office-new.jpg' },
  { name: 'Dynamics 365', img: 'Dynamics365.png' },
  { name: 'Azure', img: 'azure.jpg' },
  { name: 'SQL', img: 'sql.jpg' },
  { name: 'OpenAI', img: 'openai-icon.png' },
  { name: 'Google Sheets', img: 'google-sheets-logo.png' },
  { name: 'Google Cloud', img: 'google-cloud-icon.png' },
  { name: 'Shopify', img: 'shopify-logo.png' },
  { name: 'Meta', img: 'Meta.png' },
  { name: 'HubSpot', img: 'HubSpot-Logo.png' },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://gambot.co.il/#organization',
      name: 'גמבוט',
      url: 'https://gambot.co.il',
      logo: { '@type': 'ImageObject', url: 'https://gambot.co.il/apple-touch-icon.png' },
      sameAs: ['https://www.facebook.com/gambot', 'https://www.linkedin.com/company/gambot'],
      contactPoint: { '@type': 'ContactPoint', telephone: '+97233768997', contactType: 'sales', availableLanguage: 'Hebrew' },
      address: { '@type': 'PostalAddress', addressCountry: 'IL', addressLocality: 'Tel Aviv' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://gambot.co.il/#website',
      url: 'https://gambot.co.il',
      name: 'גמבוט | WhatsApp API ישראל',
      inLanguage: 'he',
      publisher: { '@id': 'https://gambot.co.il/#organization' },
    },
  ],
};

export default function HomeContent() {
  const { currentLanguage } = useLanguage();
  const d = DATA[currentLanguage] || DATA.he;
  const isHe = currentLanguage === 'he';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>{d.badge}</div>
          <h1 className={styles.heroTitle}>
            {d.heroTitle[0]}<span className={styles.highlight}>{d.heroTitle[1]}</span>{d.heroTitle[2]}
          </h1>
          <p className={styles.heroDesc}>{d.heroDesc}</p>
          <div className={styles.heroCta}>
            <a href="https://gambot.co.il/OnboardingProcess" className={styles.btnPrimary} target="_blank" rel="noopener noreferrer">
              {d.ctaPrimary}
            </a>
            <a href="https://wa.me/97233768997?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%2F%D7%AA%20%D7%91%D7%94%D7%93%D7%92%D7%9E%D7%94%20%F0%9F%9A%80" className={styles.btnSecondary} target="_blank" rel="noopener noreferrer">
              {d.ctaSecondary}
            </a>
          </div>
          <div className={styles.heroStats}>
            {d.stats.map((s, i) => (
              <div key={i} className={styles.stat}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{d.solutionsTitle}</h2>
          <p className={styles.sectionDesc}>{d.solutionsDesc}</p>
          <div className={styles.solutionsGrid}>
            {d.solutions.map((s, i) => (
              <Link key={i} href={s.href} className={styles.solutionCard}>
                <span className={styles.solutionIcon}>{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className={styles.arrow}>{isHe ? '←' : '→'}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`${styles.section} ${styles.bgLight}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{d.whyTitle}</h2>
          <div className={styles.featuresGrid}>
            {d.features.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{d.stepsTitle}</h2>
          <div className={styles.stepsGrid}>
            {d.steps.map((s, i) => (
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
          <h2 className={styles.sectionTitle}>{d.faqTitle}</h2>
          <div className={styles.faqGrid}>
            {d.faq.map((f, i) => (
              <div key={i} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{f.q}</h3>
                <p className={styles.faqA}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Features */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{d.ourFeaturesTitle}</h2>
          <p className={styles.sectionDesc}>{d.ourFeaturesDesc}</p>
          <div className={styles.featuresGrid}>
            {d.ourFeatures.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className={`${styles.section} ${styles.bgLight}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{d.integrationsTitle}</h2>
          <p className={styles.sectionDesc}>{d.integrationsDesc}</p>
          <div className={styles.integrationsGrid}>
            {INTEGRATIONS.map((item, i) => (
              <div key={i} className={styles.integrationCard}>
                <img src={`/integrations/${item.img}`} alt={item.name} loading="lazy" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>{d.ctaSectionTitle}</h2>
          <p>{d.ctaSectionDesc}</p>
          <LeadForm source="homepage" />
        </div>
      </section>
    </>
  );
}

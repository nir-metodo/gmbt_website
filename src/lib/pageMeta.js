/**
 * Centralized SEO metadata for all public pages.
 * Each key maps to a page route.
 */
export const PAGE_META = {
  home: {
    title: 'גמבוט | מערכת WhatsApp API מובילה בישראל | בוט AI, אוטומציה, קמפיינים',
    description: 'גמבוט - שותף מטא רשמי בישראל. בוט AI לוואטסאפ, אוטומציה חכמה, קמפיינים ודיוור המוני. הכל ללא קוד. ניסיון חינם עכשיו.',
    keywords: 'WhatsApp API ישראל, בוט וואטסאפ, אוטומציה וואטסאפ, שיווק בוואטסאפ, בוט AI, מערכת וואטסאפ עסקי, Gambot, גמבוט',
    canonical: 'https://gambot.co.il/',
    og: { title: 'גמבוט | מערכת WhatsApp API מובילה בישראל', description: 'שותף מטא רשמי. בוט AI, אוטומציה, קמפיינים ושירות לקוחות 24/7.' },
  },
  whatsappBot: {
    title: 'בוט לוואטסאפ | Gambot - בנו בוט ללא קוד | ישראל 2026',
    description: 'בוט לוואטסאפ מתקדם ללא קוד - Workflow Designer חזותי, AI Trigger, אינטגרציות ושירות לקוחות 24/7. מובילים בישראל. התחילו בחינם.',
    keywords: 'בוט לוואטסאפ, בוט וואטסאפ ישראל, WhatsApp bot, אוטומציה וואטסאפ, workflow designer, בוט ללא קוד, Gambot',
    canonical: 'https://gambot.co.il/בוט-וואטסאפ/',
    hreflang: { he: 'https://gambot.co.il/בוט-וואטסאפ/', en: 'https://gambot.co.il/bot-whatsapp/' },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Gambot - בוט לוואטסאפ',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '199', priceCurrency: 'ILS' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '327' },
      description: 'פלטפורמה ישראלית לבניית בוט לוואטסאפ ללא קוד עם Workflow Designer מתקדם',
    },
  },
  whatsappBusiness: {
    title: 'וואטסאפ עסקי | WhatsApp Business API ישראל | גמבוט 2026',
    description: 'וואטסאפ עסקי לעסק שלך - WhatsApp Business API רשמי. ניהול לקוחות, קמפיינים, בוטים ואוטומציה. שותף מטא רשמי בישראל.',
    keywords: 'וואטסאפ עסקי, WhatsApp Business, WhatsApp Business API ישראל, מערכת וואטסאפ עסקי, WhatsApp CRM',
    canonical: 'https://gambot.co.il/וואטסאפ-עסקי/',
    hreflang: { he: 'https://gambot.co.il/וואטסאפ-עסקי/', en: 'https://gambot.co.il/whatsapp-business/' },
  },
  whatsappMarketing: {
    title: 'שיווק בוואטסאפ | קמפיינים שיווקיים | גמבוט ישראל 2026',
    description: 'שיווק בוואטסאפ עם אחוזי פתיחה של 95%! שלחו קמפיינים ממוקדים, דיוור המוני וסגמנטציה חכמה. ניסיון חינם.',
    keywords: 'שיווק בוואטסאפ, קמפיינים וואטסאפ, דיוור בוואטסאפ, WhatsApp marketing ישראל, שיווק דיגיטלי',
    canonical: 'https://gambot.co.il/שיווק-בוואטסאפ/',
    hreflang: { he: 'https://gambot.co.il/שיווק-בוואטסאפ/', en: 'https://gambot.co.il/whatsapp-marketing/' },
  },
  whatsappAutomation: {
    title: 'אוטומציה בוואטסאפ | Botomation - מערכת אוטומציה חכמה | גמבוט',
    description: 'אוטומציה בוואטסאפ מתקדמת ללא קוד. בנו תהליכים עסקיים אוטומטיים, אינטגרציות עם CRM, API ו-Google Sheets. 24/7.',
    keywords: 'אוטומציה בוואטסאפ, WhatsApp automation, botomation, אוטומציה עסקית, workflow וואטסאפ, ישראל',
    canonical: 'https://gambot.co.il/אוטומציה-בוואטסאפ/',
    hreflang: { he: 'https://gambot.co.il/אוטומציה-בוואטסאפ/', en: 'https://gambot.co.il/whatsapp-automation/' },
  },
  whatsappChatbot: {
    title: 'צ׳אטבוט וואטסאפ | AI Chatbot לעסקים | גמבוט ישראל 2026',
    description: 'צ׳אטבוט לוואטסאפ מבוסס AI - מענה אוטומטי 24/7, ניהול לידים, שירות לקוחות חכם ואינטגרציות. ללא קוד. ניסיון חינם.',
    keywords: 'צאטבוט וואטסאפ, chatbot WhatsApp, בוט שיחה, AI chatbot ישראל, מענה אוטומטי וואטסאפ',
    canonical: 'https://gambot.co.il/צאטבוט-וואטסאפ/',
    hreflang: { he: 'https://gambot.co.il/צאטבוט-וואטסאפ/', en: 'https://gambot.co.il/whatsapp-chatbot/' },
  },
  whatsappNewsletter: {
    title: 'דיוור בוואטסאפ | ניוזלטר וואטסאפ לעסקים | גמבוט 2026',
    description: 'דיוור בוואטסאפ עם אחוזי פתיחה של 95%! שלחו ניוזלטר, עדכונים ומבצעים ישירות לוואטסאפ של הלקוחות. פשוט ויעיל.',
    keywords: 'דיוור בוואטסאפ, ניוזלטר וואטסאפ, WhatsApp newsletter, שליחה המונית וואטסאפ, bulk messaging',
    canonical: 'https://gambot.co.il/דיוור-בוואטסאפ/',
  },
  whatsappCampaigns: {
    title: 'קמפיינים בוואטסאפ | ניהול קמפיינים שיווקיים | גמבוט 2026',
    description: 'קמפיינים בוואטסאפ עם סגמנטציה חכמה, תזמון אוטומטי ודוחות ביצועים. הגדילו מכירות עם אחוזי המרה גבוהים.',
    keywords: 'קמפיינים בוואטסאפ, WhatsApp campaigns, שיווק וואטסאפ, קמפיין SMS וואטסאפ, שליחת הודעות המוניות',
    canonical: 'https://gambot.co.il/קמפיינים-בוואטסאפ/',
  },
  whatsappAiBot: {
    title: 'בוט AI לוואטסאפ | Gambot AI | שיחות חכמות, מדיה, סריקת אתר | 2026',
    description: 'בוט AI לוואטסאפ שמנהל שיחות טבעיות, שולח תמונות, סורק את האתר שלכם, מתאם פגישות ומשיג מטרות — ללא קוד. הגדרה תוך 5 דקות.',
    keywords: 'בוט AI וואטסאפ, gambot ai, chatbot ai וואטסאפ, בוט חכם וואטסאפ, שיחות AI, סריקת אתר, תיאום ביומן',
    canonical: 'https://gambot.co.il/בוט-ai-וואטסאפ/',
    hreflang: { he: 'https://gambot.co.il/בוט-ai-וואטסאפ/' },
  },
  aiLeadBot: {
    title: 'בוט לידים AI לוואטסאפ | קביעת פגישות + סיכום AI | גמבוט 2026',
    description: 'בוט לידים AI לוואטסאפ — מנהל שיחת מכירה, קובע פגישה ביומן ושולח סיכום AI עם פרטי הלקוח. אוטומטי לחלוטין, 24/7.',
    keywords: 'בוט לידים וואטסאפ, AI lead bot, ניהול לידים, קביעת פגישות אוטומטית, סיכום AI, WhatsApp CRM',
    canonical: 'https://gambot.co.il/בוט-לידים-וואטסאפ/',
    hreflang: { he: 'https://gambot.co.il/בוט-לידים-וואטסאפ/' },
  },
  whatsappAppointment: {
    title: 'זימון תורים וואטסאפ | הזמנות אוטומטיות | גמבוט ישראל 2026',
    description: 'זימון תורים אוטומטי בוואטסאפ - לוח שנה חכם, אישורים ותזכורות אוטומטיות. מושלם לקליניקות, ספרים ועסקי שירות.',
    keywords: 'זימון תורים וואטסאפ, הזמנות אוטומטיות, WhatsApp appointment, לוח שנה חכם, תזכורות אוטומטיות',
    canonical: 'https://gambot.co.il/זימון-תורים-וואטסאפ/',
  },
  customerServiceBot: {
    title: 'בוט שירות לקוחות וואטסאפ | שירות 24/7 אוטומטי | גמבוט 2026',
    description: 'בוט שירות לקוחות לוואטסאפ - מענה מיידי 24/7, ניתוב שיחות חכם והעברה לנציג אנושי בעת הצורך. שפרו CSAT.',
    keywords: 'בוט שירות לקוחות וואטסאפ, customer service bot, WhatsApp support, שירות לקוחות אוטומטי',
    canonical: 'https://gambot.co.il/בוט-שירות-לקוחות-וואטסאפ/',
  },
  salesBot: {
    title: 'בוט מכירות וואטסאפ | AI Sales Bot | גמבוט ישראל 2026',
    description: 'בוט מכירות AI לוואטסאפ - ניהול תהליך מכירה מלא, הצגת מוצרים, קבלת הזמנות ועיבוד תשלומים אוטומטית.',
    keywords: 'בוט מכירות וואטסאפ, sales bot WhatsApp, AI מכירות, e-commerce וואטסאפ, הזמנות אוטומטיות',
    canonical: 'https://gambot.co.il/בוט-מכירות-וואטסאפ/',
  },
  mediaManagement: {
    title: 'דוחות שיווק וואטסאפ | ניתוח לידים וקמפיינים אוטומטי | גמבוט 2026',
    description: 'דוחות שיווק שבועיים/חודשיים אוטומטיים לוואטסאפ. ניתוח לידים, ביצועי קמפיינים, ROI ונציגים — הכל בדוח אחד. ניסיון חינם.',
    keywords: 'דוחות שיווק וואטסאפ, WhatsApp marketing reports, ניתוח לידים, דוח לידים, ROI וואטסאפ, marketing analytics WhatsApp',
    canonical: 'https://gambot.co.il/ניהול-מדיה/',
    hreflang: { he: 'https://gambot.co.il/ניהול-מדיה/' },
  },
  marketingSystem: {
    title: 'מערכת התכתבות וואטסאפ | ניהול שיחות ונציגים | גמבוט 2026',
    description: 'מערכת התכתבות מרכזית לוואטסאפ — תיבת דואר משותפת, הקצאה לנציגים, תיוגים ומעקב. כל השיחות במקום אחד. ניסיון חינם.',
    keywords: 'מערכת התכתבות וואטסאפ, WhatsApp inbox, ניהול שיחות וואטסאפ, shared inbox, WhatsApp helpdesk, תיבת דואר נכנס וואטסאפ',
    canonical: 'https://gambot.co.il/מערכת-שיווק-בוואטסאפ/',
    hreflang: { he: 'https://gambot.co.il/מערכת-שיווק-בוואטסאפ/' },
  },
  pricing: {
    title: 'מחירי WhatsApp API | תוכניות ומחירים | גמבוט ישראל 2026',
    description: 'מחירי WhatsApp API ישראל - תוכניות גמישות החל מ-₪199/חודש. כולל הגדרה, תמיכה ו-API מטא רשמי. נסו בחינם.',
    keywords: 'מחיר WhatsApp API ישראל, תמחור וואטסאפ עסקי, WhatsApp Business pricing, עלות API וואטסאפ',
    canonical: 'https://gambot.co.il/PriceList/',
  },
  blog: {
    title: 'בלוג וואטסאפ עסקי | מדריכים וטיפים | גמבוט ישראל',
    description: 'מדריכים, טיפים ועדכונים על WhatsApp Business API - כיצד להגדיל מכירות, לשפר שירות לקוחות ולנצל אוטומציה.',
    keywords: 'בלוג וואטסאפ, WhatsApp blog, מדריך WhatsApp API, טיפים וואטסאפ עסקי',
    canonical: 'https://gambot.co.il/blog/',
  },
  contact: {
    title: 'צור קשר | גמבוט - WhatsApp API ישראל',
    description: 'צור קשר עם גמבוט - שותף מטא רשמי. קבלו הדגמה חינמית, ייעוץ מקצועי ותמיכה בעברית. נשמח לעזור!',
    keywords: 'צור קשר גמבוט, WhatsApp API ייעוץ, הדגמה חינמית, תמיכה וואטסאפ',
    canonical: 'https://gambot.co.il/ContactUs/',
  },
  guide: {
    title: 'מדריך למשתמש | גמבוט - WhatsApp API',
    description: 'מדריכים מפורטים לשימוש בגמבוט - פתיחת חשבון, יצירת תבניות, ניהול קמפיינים, בוטים ואוטומציה. בעברית.',
    keywords: 'מדריך גמבוט, how to WhatsApp API, מדריך וואטסאפ עסקי, tutorials',
    canonical: 'https://gambot.co.il/guide/',
  },
};

/**
 * Build Next.js metadata object for a page
 */
export function buildMetadata(pageKey, overrides = {}) {
  const meta = PAGE_META[pageKey] || {};
  const title = overrides.title || meta.title || PAGE_META.home.title;
  const description = overrides.description || meta.description || PAGE_META.home.description;
  const canonical = overrides.canonical || meta.canonical || 'https://gambot.co.il';
  const keywords = overrides.keywords || meta.keywords || '';

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: meta.hreflang || {},
    },
    openGraph: {
      title: meta.og?.title || title,
      description: meta.og?.description || description,
      url: canonical,
      siteName: 'גמבוט | WhatsApp API ישראל',
      locale: 'he_IL',
      type: 'website',
      images: [{ url: 'https://gambot.co.il/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://gambot.co.il/og-image.jpg'],
    },
    ...overrides,
  };
}

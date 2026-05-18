/**
 * Centralized SEO metadata for all public pages.
 * Each key maps to a page route.
 */
export const PAGE_META = {
  home: {
    title: 'גמבוט | מערכת WhatsApp API מובילה בישראל | אוטומציה, קמפיינים, CRM',
    description: 'גמבוט - שותף מטא רשמי בישראל. אוטומציה חכמה בוואטסאפ, קמפיינים, CRM ודיוור המוני. הכל ללא קוד. ניסיון חינם עכשיו.',
    keywords: 'WhatsApp API ישראל, בוט וואטסאפ, אוטומציה וואטסאפ, שיווק בוואטסאפ, מערכת וואטסאפ עסקי, Gambot, גמבוט',
    canonical: 'https://gambot.co.il/',
    og: { title: 'גמבוט | מערכת WhatsApp API מובילה בישראל', description: 'שותף מטא רשמי. אוטומציה, קמפיינים, CRM ושירות לקוחות 24/7.' },
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
      offers: { '@type': 'Offer', price: '179', priceCurrency: 'ILS', priceValidUntil: '2026-12-31' },
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
    title: 'בוט AI לוואטסאפ | Gambot AI Agent | שיחות חכמות 24/7 | ישראל 2026',
    description: 'בוט AI לוואטסאפ מבוסס GPT-4 — מנהל שיחות טבעיות, שולח תמונות, סורק את האתר שלכם, מתאם פגישות ביומן ומשיג מטרות. הגדרה תוך 5 דקות, ללא קוד.',
    keywords: 'בוט AI לוואטסאפ, בוט AI וואטסאפ, chatbot AI וואטסאפ, gambot AI, סוכן AI וואטסאפ, GPT וואטסאפ, בוט חכם לעסקים',
    canonical: 'https://gambot.co.il/בוט-ai-וואטסאפ/',
    hreflang: { he: 'https://gambot.co.il/בוט-ai-וואטסאפ/' },
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'Gambot AI Agent — בוט AI לוואטסאפ',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          inLanguage: 'he',
          url: 'https://gambot.co.il/בוט-ai-וואטסאפ/',
          offers: { '@type': 'Offer', price: '287', priceCurrency: 'ILS', priceValidUntil: '2026-12-31' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '214', bestRating: '5' },
          description: 'בוט AI לוואטסאפ מבוסס GPT-4 שמנהל שיחות טבעיות, סורק אתרים, מתאם פגישות ומשיג מטרות עסקיות אוטומטית.',
          featureList: 'שיחות AI טבעיות, סריקת אתר אוטומטית, קביעת פגישות, שליחת מדיה, זיכרון שיחה, העברה לנציג',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'מה זה בוט AI לוואטסאפ?', acceptedAnswer: { '@type': 'Answer', text: 'בוט AI לוואטסאפ הוא סוכן וירטואלי מבוסס בינה מלאכותית (GPT-4) שמנהל שיחות טבעיות עם לקוחות בוואטסאפ, 24/7, ללא התערבות אנושית.' } },
            { '@type': 'Question', name: 'כמה עולה בוט AI לוואטסאפ?', acceptedAnswer: { '@type': 'Answer', text: 'Gambot AI כלול בחבילת Pro החל מ-359 ₪ לחודש. ניתן להתחיל ניסיון חינם של חודש ללא כרטיס אשראי.' } },
            { '@type': 'Question', name: 'כמה זמן לוקח להגדיר בוט AI לוואטסאפ?', acceptedAnswer: { '@type': 'Answer', text: 'הגדרה בסיסית אורכת 5 דקות — מחברים את הוואטסאפ, לוחצים סרוק אתר וה-AI מוכן. הגדרות מתקדמות לוקחות כשעה.' } },
            { '@type': 'Question', name: 'האם בוט AI יכול לקבוע פגישות?', acceptedAnswer: { '@type': 'Answer', text: 'כן, Gambot AI קובע פגישות ישירות ב-Google Calendar ו-Outlook, ושולח סיכום AI עם פרטי הלקוח לאחר כל שיחה.' } },
          ],
        },
      ],
    },
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
  leadsManagement: {
    title: 'מערכת ניהול לידים | וואטסאפ אוטומטי לכל ליד | גמבוט 2026',
    description: 'מערכת ניהול לידים עם וואטסאפ אוטומטי — כל ליד מקבל תגובה תוך שניות. חיבור מפייסבוק, דפי נחיתה, CTWA ו-API. קנבן פייפליין, משימות, הצעות מחיר ודוחות. ניסיון חינם 30 יום.',
    keywords: 'מערכת ניהול לידים, ניהול לידים, ניהול לידים ישראל, lead management, לידים וואטסאפ, CRM לידים, ניהול לידים אוטומטי, פייפליין לידים, ניהול לידים מדף נחיתה, ניהול לידים פייסבוק',
    canonical: 'https://gambot.co.il/ניהול-לידים/',
    hreflang: { he: 'https://gambot.co.il/ניהול-לידים/' },
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://gambot.co.il/#leads-software',
          name: 'Gambot — מערכת ניהול לידים',
          applicationCategory: 'BusinessApplication',
          applicationSubCategory: 'CRM',
          operatingSystem: 'Web, iOS, Android',
          url: 'https://gambot.co.il/ניהול-לידים/',
          inLanguage: 'he',
          description: 'מערכת ניהול לידים עם תגובה אוטומטית בוואטסאפ — לידים מכל מקור, קנבן ויזואלי, AI לסיווג לידים ודוחות המרה.',
          featureList: 'תגובה אוטומטית בוואטסאפ, קנבן פייפליין, ניהול משימות, הצעות מחיר, דוחות המרה, בוט AI לניהול לידים',
          offers: { '@type': 'Offer', price: '179', priceCurrency: 'ILS', priceValidUntil: '2026-12-31' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '47', bestRating: '5' },
          author: { '@id': 'https://gambot.co.il/#organization' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'מה זה מערכת ניהול לידים?', acceptedAnswer: { '@type': 'Answer', text: 'מערכת ניהול לידים היא כלי שמרכז את כל הלידים הנכנסים ממקורות שונים (פייסבוק, דפי נחיתה, וואטסאפ), שולח תגובה אוטומטית, ומנהל את תהליך המכירה ב-CRM עד לסגירת עסקה.' } },
            { '@type': 'Question', name: 'כמה עולה מערכת ניהול לידים?', acceptedAnswer: { '@type': 'Answer', text: 'גמבוט מתחיל מ-₪179 לחודש עם ניסיון חינם 30 יום ללא כרטיס אשראי.' } },
            { '@type': 'Question', name: 'האם גמבוט שולח וואטסאפ אוטומטי לכל ליד?', acceptedAnswer: { '@type': 'Answer', text: 'כן. ברגע שליד נכנס מכל מקור (פייסבוק, דף נחיתה, CTWA), גמבוט שולח הודעת וואטסאפ אישית תוך שניות.' } },
          ],
        },
      ],
    },
  },
  landingPages: {
    title: 'דפי נחיתה לוואטסאפ | כל ליד → הודעה אוטומטית | גמבוט 2026',
    description: 'חברו כל דף נחיתה לגמבוט — כל שליחת טופס שולחת הודעת וואטסאפ אישית תוך שניות ונכנסת ל-CRM. עובד עם Wix, Webflow, WordPress ועוד. ניסיון חינם 30 יום.',
    keywords: 'דפי נחיתה לידים, דף נחיתה וואטסאפ, ניהול לידים מדפי נחיתה, landing page webhook, לידים מדף נחיתה, Wix לידים וואטסאפ, Webflow לידים, וואטסאפ אוטומטי מדף נחיתה',
    canonical: 'https://gambot.co.il/דפי-נחיתה-לידים/',
    hreflang: { he: 'https://gambot.co.il/דפי-נחיתה-לידים/' },
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://gambot.co.il/#landing-pages-software',
          name: 'Gambot — חיבור דפי נחיתה לוואטסאפ',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: 'https://gambot.co.il/דפי-נחיתה-לידים/',
          inLanguage: 'he',
          description: 'חיבור דפי נחיתה (Wix, Webflow, WordPress) לגמבוט — כל ליד נכנס ל-CRM ומקבל תגובה אוטומטית בוואטסאפ תוך שניות.',
          offers: { '@type': 'Offer', price: '179', priceCurrency: 'ILS', priceValidUntil: '2026-12-31' },
          author: { '@id': 'https://gambot.co.il/#organization' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'איך מחברים דף נחיתה לוואטסאפ?', acceptedAnswer: { '@type': 'Answer', text: 'מוסיפים Webhook URL אחד בהגדרות הטופס בדף הנחיתה (Wix, Webflow, WordPress וכד\'). כל שליחה נכנסת לגמבוט ושולחת הודעת וואטסאפ אוטומטית תוך שניות.' } },
            { '@type': 'Question', name: 'האם עובד עם Wix?', acceptedAnswer: { '@type': 'Answer', text: 'כן. מחברים דרך Wix Automations → Webhook עם ה-URL של גמבוט. הגדרה של 5 דקות.' } },
            { '@type': 'Question', name: 'כמה זמן לוקח להגדיר?', acceptedAnswer: { '@type': 'Answer', text: 'חיבור בסיסי לוקח 5-10 דקות. אפשר לחבר כמה דפי נחיתה שרוצים, כל אחד עם Webhook ייעודי.' } },
          ],
        },
      ],
    },
  },
  crmHe: {
    title: 'CRM לעסקים | ניהול לידים · לקוחות · וואטסאפ | גמבוט 2026',
    description: 'מערכת CRM חכמה לעסקים — לידים מפייסבוק CTWA ודפי נחיתה, קנבן ויזואלי, ניהול לקוחות, התכתבות בוואטסאפ, משימות, הצעות מחיר עם חתימה דיגיטלית ודוחות. ניסיון חינם 30 יום.',
    keywords: 'CRM לעסקים, מערכת CRM ישראל, ניהול לידים, ניהול לקוחות, WhatsApp CRM, CRM וואטסאפ, גמבוט CRM, CRM קטן ובינוני, מערכת ניהול לקוחות, CRM עברית',
    canonical: 'https://gambot.co.il/crm-לעסקים/',
    hreflang: { he: 'https://gambot.co.il/crm-לעסקים/', en: 'https://gambot.co.il/crm-for-business/' },
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://gambot.co.il/#crm-software',
          name: 'Gambot CRM',
          alternateName: 'גמבוט CRM',
          applicationCategory: 'BusinessApplication',
          applicationSubCategory: 'CRM',
          operatingSystem: 'Web, iOS, Android',
          url: 'https://gambot.co.il/crm-לעסקים/',
          inLanguage: 'he',
          description: 'מערכת CRM לניהול לקוחות ולידים עם ממשק וואטסאפ מובנה, קנבן ויזואלי, אוטומציות, חשבוניות ובוט AI.',
          featureList: 'ניהול לידים, קנבן ויזואלי, שדות דינמיים, CRM וואטסאפ, אוטומציות, משימות, הצעות מחיר, דוחות, בוט AI',
          offers: { '@type': 'Offer', price: '179', priceCurrency: 'ILS', priceValidUntil: '2026-12-31', description: 'החל מ-₪179 לחודש. ניסיון חינם 30 יום ללא כרטיס אשראי.' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '47', bestRating: '5' },
          author: { '@id': 'https://gambot.co.il/#organization' },
          publisher: { '@id': 'https://gambot.co.il/#organization' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'מה זה CRM?', acceptedAnswer: { '@type': 'Answer', text: 'CRM (Customer Relationship Management) הוא מערכת לניהול לקוחות ולידים. גמבוט מציעה CRM מובנה עם ממשק וואטסאפ, קנבן ויזואלי, אוטומציות ובוט AI — הכל במקום אחד.' } },
            { '@type': 'Question', name: 'כמה עולה מערכת CRM?', acceptedAnswer: { '@type': 'Answer', text: 'גמבוט CRM מתחיל מ-₪179 לחודש עם ניסיון חינם 30 יום ללא כרטיס אשראי. אין עלויות הטמעה ואין חוזה מחייב.' } },
            { '@type': 'Question', name: 'האם גמבוט מתחבר לפייסבוק לידים?', acceptedAnswer: { '@type': 'Answer', text: 'כן, גמבוט מתחבר לפייסבוק CTWA (Click-to-WhatsApp), טפסי לידים בפייסבוק ודפי נחיתה. כל ליד נכנס אוטומטית ל-CRM ומקבל הודעת וואטסאפ אוטומטית.' } },
            { '@type': 'Question', name: 'מה ההבדל בין גמבוט CRM לבין CRM רגיל?', acceptedAnswer: { '@type': 'Answer', text: 'גמבוט CRM בנוי סביב וואטסאפ — כל שיחה, ליד ולקוח מנוהלים מתוך ממשק הוואטסאפ. זה מאפשר תקשורת מהירה, אוטומציות ובוט AI ישירות מה-CRM, ללא כלים נוספים.' } },
          ],
        },
      ],
    },
  },
  crmEn: {
    title: 'CRM for Business | Leads · WhatsApp · AI Bot | Gambot 2026',
    description: 'Smart CRM for businesses — leads from Facebook CTWA & landing pages, visual kanban, WhatsApp messaging, task management, digital-signature quotes, and advanced reports. 30-day free trial.',
    keywords: 'CRM for business, WhatsApp CRM, CRM Israel, lead management, customer management, Gambot CRM, small business CRM, CRM software',
    canonical: 'https://gambot.co.il/crm-for-business/',
    hreflang: { he: 'https://gambot.co.il/crm-לעסקים/', en: 'https://gambot.co.il/crm-for-business/' },
  },
  pricing: {
    title: 'מחירי WhatsApp API | תוכניות ומחירים | גמבוט ישראל 2026',
    description: 'מחירי WhatsApp API ישראל - תוכניות גמישות החל מ-₪179/חודש. כולל הגדרה, תמיכה ו-API מטא רשמי. נסו בחינם.',
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
  multiNumber: {
    title: 'ניהול כמה מספרי וואטסאפ | גמבוט - שליטה בכל המספרים ממקום אחד',
    description: 'חברו מספר מספרי וואטסאפ לחשבון אחד. נהלו צ\'אטים, קמפיינים, בוטים, לידים ודוחות ממקום אחד — עם פילטור לפי מספר ושליטה מלאה.',
    keywords: 'ניהול כמה מספרי וואטסאפ, מספרים מרובים וואטסאפ, WhatsApp multi number, ניהול מספרים במקביל, Gambot',
    canonical: 'https://gambot.co.il/multi-number-whatsapp/',
    og: { title: 'ניהול כמה מספרי וואטסאפ | גמבוט', description: 'כל המספרים. מקום אחד. שליטה מלאה — צ\'אטים, קמפיינים, בוטים ודוחות.' },
  },
  taskManagement: {
    title: 'ניהול משימות בוואטסאפ | צרו, שייכו ועקבו אחר משימות | גמבוט 2026',
    description: 'ניהול משימות בוואטסאפ — צרו משימות מתוך שיחות, שייכו לנציגים, הגדירו דדליינים ותזכורות. משולב עם CRM, לידים ופניות. ניסיון חינם.',
    keywords: 'ניהול משימות בוואטסאפ, משימות וואטסאפ, task management WhatsApp, ניהול משימות לעסקים, משימות CRM, ניהול צוות וואטסאפ',
    canonical: 'https://gambot.co.il/ניהול-משימות/',
    hreflang: { he: 'https://gambot.co.il/ניהול-משימות/' },
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'Gambot — ניהול משימות בוואטסאפ',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          inLanguage: 'he',
          url: 'https://gambot.co.il/ניהול-משימות/',
          offers: { '@type': 'Offer', price: '179', priceCurrency: 'ILS', priceValidUntil: '2026-12-31' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '156', bestRating: '5' },
          description: 'ניהול משימות ישירות מוואטסאפ — יצירה, שיוך לנציגים, דדליינים, תזכורות ואינטגרציה עם CRM.',
          featureList: 'יצירת משימות מהשיחה, שיוך לנציגים, תזכורות, סטטוסים דינמיים, חיבור ל-CRM, דוחות ביצועים',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'איך יוצרים משימה מתוך שיחת וואטסאפ?', acceptedAnswer: { '@type': 'Answer', text: 'בממשק השיחה לוחצים "צור משימה" — המשימה נוצרת ומשויכת אוטומטית לאיש הקשר ולנציג.' } },
            { '@type': 'Question', name: 'האם יש תזכורות אוטומטיות למשימות?', acceptedAnswer: { '@type': 'Answer', text: 'כן! המערכת שולחת תזכורות בוואטסאפ או בממשק לפני תאריך היעד של כל משימה.' } },
            { '@type': 'Question', name: 'האם ניתן ליצור משימות אוטומטיות?', acceptedAnswer: { '@type': 'Answer', text: 'כן! ניתן להגדיר אוטומציה שיוצרת משימה אוטומטית בעקבות אירוע — ליד חדש, הודעה מלקוח ועוד.' } },
          ],
        },
      ],
    },
  },
  digitalInvoices: {
    title: 'חשבוניות דיגיטליות בוואטסאפ | מאושר רשות המסים | גמבוט 2026',
    description: 'חשבוניות דיגיטליות מאושרות רשות המסים — הפקת חשבוניות מס, קבלות וחשבוניות עסקה ישירות מגמבוט. שליחה בוואטסאפ, חיבור ל-CRM והצעות מחיר.',
    keywords: 'חשבוניות דיגיטליות, חשבוניות בוואטסאפ, מאושר רשות המסים, חשבונית מס דיגיטלית, חשבונית אונליין, הפקת חשבוניות, חשבוניות לעסקים',
    canonical: 'https://gambot.co.il/חשבוניות-דיגיטליות/',
    hreflang: { he: 'https://gambot.co.il/חשבוניות-דיגיטליות/' },
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'Gambot — חשבוניות דיגיטליות מאושרות רשות המסים',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          inLanguage: 'he',
          url: 'https://gambot.co.il/חשבוניות-דיגיטליות/',
          offers: { '@type': 'Offer', price: '179', priceCurrency: 'ILS', priceValidUntil: '2026-12-31' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '189', bestRating: '5' },
          description: 'מערכת חשבוניות דיגיטליות מאושרת רשות המסים — הפקה ושליחה בוואטסאפ, מחוברת ל-CRM, הצעות מחיר ומעקב תשלומים.',
          featureList: 'חשבוניות מאושרות רשות המסים, שליחה בוואטסאפ, המרת הצעות מחיר, מעקב תשלומים, דוחות כספיים, מספור אוטומטי',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'האם החשבוניות מאושרות רשות המסים?', acceptedAnswer: { '@type': 'Answer', text: 'כן! המערכת מאושרת לפי דרישות רשות המסים בישראל, כולל מספור רציף, חתימה דיגיטלית ודיווח.' } },
            { '@type': 'Question', name: 'האם ניתן לשלוח חשבונית בוואטסאפ?', acceptedAnswer: { '@type': 'Answer', text: 'כן! החשבונית נשלחת כ-PDF ישירות לוואטסאפ של הלקוח בלחיצה אחת.' } },
            { '@type': 'Question', name: 'האם ניתן להמיר הצעת מחיר לחשבונית?', acceptedAnswer: { '@type': 'Answer', text: 'כן! ברגע שהלקוח מאשר הצעת מחיר, ניתן להפיק חשבונית בלחיצה אחת עם כל הפרטים.' } },
          ],
        },
      ],
    },
  },
  employeeTimeTracking: {
    title: 'דיווח שעות עובדים בוואטסאפ | כניסה/יציאה בהודעה | גמבוט 2026',
    description: 'דיווח שעות עובדים בוואטסאפ — כניסה/יציאה בהודעה, הפסקות, שעות נוספות, דוחות חודשיים וחיבור למערכת שכר. ללא אפליקציה נוספת.',
    keywords: 'דיווח שעות עובדים, דיווח שעות בוואטסאפ, שעון נוכחות וואטסאפ, מעקב שעות עובדים, דיווח נוכחות, שעות נוספות, דיווח שעות לעסקים',
    canonical: 'https://gambot.co.il/דיווח-שעות-עובדים/',
    hreflang: { he: 'https://gambot.co.il/דיווח-שעות-עובדים/' },
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'Gambot — דיווח שעות עובדים בוואטסאפ',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          inLanguage: 'he',
          url: 'https://gambot.co.il/דיווח-שעות-עובדים/',
          offers: { '@type': 'Offer', price: '179', priceCurrency: 'ILS', priceValidUntil: '2026-12-31' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', ratingCount: '132', bestRating: '5' },
          description: 'דיווח שעות עובדים בוואטסאפ — כניסה/יציאה בהודעה, חישוב שעות נוספות, דוחות חודשיים וייצוא לשכר.',
          featureList: 'כניסה/יציאה בוואטסאפ, הפסקות, שעות נוספות, דוחות חודשיים, תזכורות דיווח, ייצוא לשכר',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'איך העובד מדווח שעות?', acceptedAnswer: { '@type': 'Answer', text: 'העובד שולח הודעה בוואטסאפ — "כניסה", "יציאה", "הפסקה" — והמערכת רושמת אוטומטית עם שעה מדויקת ומיקום.' } },
            { '@type': 'Question', name: 'האם המערכת מחשבת שעות נוספות?', acceptedAnswer: { '@type': 'Answer', text: 'כן — חישוב אוטומטי של שעות נוספות (125%, 150%) לפי חוק שעות עבודה ומנוחה בישראל.' } },
            { '@type': 'Question', name: 'האם ניתן לייצא דוח שעות לאקסל?', acceptedAnswer: { '@type': 'Answer', text: 'כן! בסוף כל חודש מופק דוח שעות מפורט לכל עובד — ניתן להוריד כ-Excel או PDF, או לחבר ישירות למערכת שכר.' } },
          ],
        },
      ],
    },
  },
  telephonyWhatsApp: {
    title: 'טלפוניה + וואטסאפ | שיחות, הקלטות וסיכום AI | גמבוט 2026',
    description: 'טלפוניה משולבת וואטסאפ — שיחות מהדפדפן, הקלטות, סיכום AI. שיחה לא נענתה? הודעת וואטסאפ אוטומטית. הכל מחובר ל-CRM.',
    keywords: 'טלפוניה וואטסאפ, טלפוניה + וואטסאפ, מערכת טלפון וואטסאפ, שיחות מהדפדפן, הקלטת שיחות, סיכום AI שיחה, VoIP וואטסאפ, טלפוניה לעסקים',
    canonical: 'https://gambot.co.il/טלפוניה-וואטסאפ/',
    hreflang: { he: 'https://gambot.co.il/טלפוניה-וואטסאפ/' },
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'Gambot — טלפוניה + וואטסאפ',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          inLanguage: 'he',
          url: 'https://gambot.co.il/טלפוניה-וואטסאפ/',
          offers: { '@type': 'Offer', price: '179', priceCurrency: 'ILS', priceValidUntil: '2026-12-31' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '97', bestRating: '5' },
          description: 'מערכת טלפוניה משולבת וואטסאפ — שיחות מהדפדפן, הקלטות, סיכום AI, שיחה לא נענתה → הודעת וואטסאפ אוטומטית.',
          featureList: 'שיחות מהדפדפן, הקלטת שיחות, סיכום AI, שיחה לא נענתה → וואטסאפ, ניתוב שיחות, שיוך CRM',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'מה קורה כשלקוח מתקשר ולא עונים?', acceptedAnswer: { '@type': 'Answer', text: 'המערכת שולחת אוטומטית הודעת וואטסאפ ללקוח עם הצעה לעזרה, כך שאף ליד לא הולך לאיבוד.' } },
            { '@type': 'Question', name: 'האם כל השיחות מוקלטות?', acceptedAnswer: { '@type': 'Answer', text: 'כן! כל שיחה מוקלטת אוטומטית ונשמרת בענן, משויכת לאיש הקשר ב-CRM.' } },
            { '@type': 'Question', name: 'מה זה סיכום AI לשיחה?', acceptedAnswer: { '@type': 'Answer', text: 'לאחר כל שיחה, AI מנתח את ההקלטה ומייצר סיכום: נושא השיחה, מה סוכם, מה הצעד הבא — נשמר אוטומטית ב-CRM.' } },
          ],
        },
      ],
    },
  },
  about: {
    title: 'אודות גמבוט | ניר סגס מייסד ומנכ״ל | About Gambot',
    description: 'גמבוט (Gambot) — פלטפורמת WhatsApp Business API המובילה בישראל. הוקמה על ידי ניר סגס (Nir Segas). שותף מטא רשמי. אוטומציה, בוטים מבוססי AI, CRM ושיווק בוואטסאפ.',
    keywords: 'גמבוט, Gambot, אודות גמבוט, ניר סגס, Nir Segas, מייסד גמבוט, WhatsApp API ישראל, Gambot founder, Gambot CEO, WhatsApp Business API',
    canonical: 'https://gambot.co.il/about/',
    hreflang: { he: 'https://gambot.co.il/about/', en: 'https://gambot.co.il/about/' },
    og: {
      title: 'אודות גמבוט | ניר סגס — מייסד ומנכ״ל',
      description: 'גמבוט — פלטפורמת WhatsApp Business API המובילה בישראל. הוקמה על ידי ניר סגס. שותף מטא רשמי.',
    },
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

import {
  SIGNUP, DOCS, MCP, AI_AGENTS, DEVELOPERS, HOME, CRUMB_DEV, ctaCreate,
} from './_common';

export const data = {
  pageKey: 'whatsapp-api-vs-meta-cloud-api',
  schemaType: 'article',
  seo: {
    title: 'WhatsApp Business API: Gambot vs Building on Meta Cloud API Directly | Gambot',
    description:
      'Should you build on Meta\u2019s WhatsApp Cloud API yourself, or use a ready platform? A factual comparison of DIY Meta Cloud API vs Gambot\u2019s managed WhatsApp Business API + MCP: Business verification, number registration, templates, webhooks, media, messaging tiers, compliance, campaigns and AI-agent support.',
    keywords:
      'WhatsApp Cloud API vs BSP, build on WhatsApp Cloud API, Meta WhatsApp API directly, WhatsApp Business Solution Provider, WhatsApp API infrastructure, Gambot vs Meta Cloud API, managed WhatsApp Business API, WhatsApp API for AI agents vs Meta',
    canonical: 'https://gambot.co.il/whatsapp-api-vs-meta-cloud-api/',
    ogTitle: 'Gambot vs Building on Meta\u2019s WhatsApp Cloud API Directly',
    ogDescription: 'A factual comparison: what you build and maintain on the raw Meta Cloud API vs what a ready WhatsApp Business API platform (with MCP for AI agents) gives you out of the box.',
  },
  breadcrumbs: [HOME, CRUMB_DEV, { name: 'Gambot vs Meta Cloud API', item: 'https://gambot.co.il/whatsapp-api-vs-meta-cloud-api/' }],
  hero: {
    badge: 'Explainer · Build vs Buy',
    h1: 'WhatsApp Business API: Gambot vs Building on Meta\u2019s Cloud API Directly',
    subhead:
      'Both run on the <strong style="color:#e9edef">same official WhatsApp Business (Cloud) API</strong> from Meta. The question is how much of the surrounding infrastructure <strong style="color:#e9edef">you build and maintain</strong> versus get ready-made. This is a factual build-vs-buy comparison.',
    primary: ctaCreate,
    secondary: { label: 'WhatsApp API for AI agents', href: AI_AGENTS, event: 'mcp_cta_click' },
    chips: ['Meta Cloud API', 'BSP platform', 'MCP', 'AI agents', 'Production'],
  },
  blocks: [
    {
      type: 'prose',
      title: 'Same Meta API underneath — very different amount of work',
      paragraphs: [
        'Meta\u2019s <strong style="color:#e9edef">WhatsApp Cloud API</strong> is the official, low-level HTTP API for sending and receiving WhatsApp. It is powerful, but it is a <em>building block</em>, not a product: you still have to handle Business verification, phone-number registration, template lifecycle, webhook infrastructure, media handling, messaging-tier limits, retries, opt-out/consent and error handling yourself.',
        'Gambot is an <strong style="color:#e9edef">official Meta Business Solution Provider (BSP)</strong> that runs on the exact same Cloud API and gives you all of that infrastructure ready-made \u2014 plus campaigns, CRM, bots, analytics and, crucially for AI, an <a href="' + MCP + '" style="color:#25D366">MCP server</a> and a <a href="' + DEVELOPERS + '" style="color:#25D366">clean REST API</a> with structured, machine-readable states. You keep the official API; you skip months of plumbing.',
      ],
    },
    {
      type: 'table',
      title: 'DIY Meta Cloud API vs Gambot (managed)',
      columns: ['What you need', 'Build on Meta Cloud API yourself', 'Gambot (ready infrastructure)'],
      rows: [
        ['Get started', 'Create a Meta app, pass App Review, set up Business Manager & WABA', 'Sign up and connect WhatsApp \u2014 guided onboarding, live in ~24\u201348h'],
        ['Business verification', 'You handle Meta Business verification yourself', 'Guided by Gambot, including the green-badge process'],
        ['Phone number', 'Register/migrate & manage the number via API calls', 'Connect or migrate a number from the dashboard (Coexistence supported)'],
        ['Message templates', 'Create & submit via API, track approval, version them', 'Visual template editor with approval status built in'],
        ['Webhooks', 'Host a public HTTPS endpoint, verify, dedupe, retry, scale it', 'Managed inbound events; optional forwarding to your endpoint'],
        ['Media', 'Upload/download & host media, manage ids and expiry', 'Handled for you in messages, templates and campaigns'],
        ['24h window logic', 'Track each conversation\u2019s window; decide free-text vs template', 'Enforced for you; API returns CONVERSATION_WINDOW_CLOSED + canSendTemplate'],
        ['Messaging tiers & limits', 'Track tiers, throttle, handle 131xxx errors yourself', 'Limits handled; campaigns respect tiers, structured limit errors'],
        ['Broadcasts / campaigns', 'Build your own queueing, segmentation, opt-out, reporting', 'Native campaigns: audiences, scheduling, consent, per-recipient results'],
        ['Automation / bots', 'Build a bot engine and state machine from scratch', 'Keyword auto-replies, menu bots, AI bots \u2014 no code or via API/MCP'],
        ['CRM & compliance', 'Store contacts, consent, opt-out, spam handling yourself', 'Built-in CRM, consent/opt-out and spam handling enforced on sends'],
        ['Analytics', 'Aggregate and store your own metrics', 'Messages, conversations, leads, cases and campaign results out of the box'],
        ['AI agents', 'Agents get raw Graph API errors \u2014 brittle to reason about', 'MCP + structured states with recommended next actions'],
        ['API version upkeep', 'You migrate as Meta bumps Graph API versions', 'Gambot tracks and absorbs Meta API changes'],
      ],
    },
    {
      type: 'cards',
      title: 'What the ready infrastructure saves you',
      cards: [
        { icon: '\u23F1\uFE0F', title: 'Time to market', text: 'Days instead of months \u2014 no App Review, webhook servers or template plumbing to build first.' },
        { icon: '\uD83D\uDEE0\uFE0F', title: 'No infra to run', text: 'No webhook endpoints, media hosting, retry queues or tier tracking to operate and monitor.' },
        { icon: '\uD83D\uDEE1\uFE0F', title: 'Compliance built in', text: '24h window, opt-out/consent and spam handling are enforced on every send.' },
        { icon: '\uD83E\uDD16', title: 'Agent-ready', text: 'MCP + machine-readable states mean AI agents recover intelligently instead of parsing raw Meta errors.' },
        { icon: '\uD83D\uDD01', title: 'Future-proof', text: 'Gambot absorbs Meta Graph API version changes so your integration keeps working.' },
        { icon: '\uD83D\uDCE6', title: 'More than messaging', text: 'Campaigns, CRM, bots and analytics on top of the API \u2014 not just a send endpoint.' },
      ],
    },
    {
      type: 'prose',
      title: 'When building directly on Meta still makes sense',
      paragraphs: [
        'Direct Cloud API can fit a team that wants to own every layer, has engineers to build and operate webhook/media/queue infrastructure, and does not need campaigns, CRM, bots or AI tooling on top. It is a legitimate low-level choice.',
        'For almost everyone else \u2014 and for <strong style="color:#e9edef">any AI agent</strong> that should reason about WhatsApp rather than manage HTTP plumbing \u2014 a ready platform is faster, safer and cheaper. You still run on the official API; Gambot just removes the undifferentiated heavy lifting.',
      ],
    },
    {
      type: 'bullets',
      title: 'Why this matters for AI agents specifically',
      bullets: [
        'On the raw Cloud API an agent receives <strong style="color:#e9edef">Graph API errors</strong> (e.g. code 131047 / 131026) it has to interpret. Gambot returns normalized states like <code>CONVERSATION_WINDOW_CLOSED</code> with <code>canSendTemplate: true</code>.',
        'Through <a href="' + MCP + '" style="color:#25D366">MCP</a>, those states become <strong style="color:#e9edef">recommended next actions</strong>, so the agent picks the correct step (e.g. send an approved template) instead of failing.',
        'The agent gets the <strong style="color:#e9edef">whole workflow</strong> \u2014 templates, contacts, campaigns, scheduling, analytics \u2014 as safe tools, not a single low-level send call. See <a href="' + AI_AGENTS + '" style="color:#25D366">WhatsApp API for AI agents</a>.',
      ],
    },
    {
      type: 'cta',
      title: 'Skip the plumbing \u2014 keep the official API',
      text: 'Create a free account, connect WhatsApp, and build on a production-grade WhatsApp Business API with MCP for AI agents \u2014 without building Meta\u2019s infrastructure yourself.',
      primary: ctaCreate,
      secondary: { label: 'Read the API docs', href: DOCS, event: 'developer_docs_click' },
    },
  ],
  faq: [
    { q: 'Can I just use Meta\u2019s WhatsApp Cloud API directly instead of Gambot?', a: 'Yes \u2014 the Cloud API is open to businesses. But you then build and operate everything around it: Meta app review and Business verification, phone-number registration, template submission and approval tracking, a public webhook endpoint with retries and dedupe, media hosting, messaging-tier and rate-limit handling, opt-out/consent, and error handling. Gambot runs on the same official API and provides all of that ready-made.' },
    { q: 'Is Gambot official, or a workaround?', a: 'Official. Gambot is a Meta Business Solution Provider (BSP) and runs on the authorized WhatsApp Business (Cloud) API \u2014 not an unofficial or WhatsApp Web workaround.' },
    { q: 'Do I still own my WhatsApp number and WABA?', a: 'Yes. You connect your own WhatsApp Business number/WABA; you can migrate an existing number, and Coexistence lets a bot run on a number you still use manually.' },
    { q: 'What does Gambot add on top of the Meta Cloud API?', a: 'Guided onboarding and verification, a visual template editor, managed webhooks, media handling, 24-hour-window enforcement, messaging-tier handling, native campaigns with consent and per-recipient results, CRM, bots/automation, analytics, a REST API, and an MCP server that exposes it all to AI agents with structured states and next-action guidance.' },
    { q: 'Which is better for AI agents \u2014 direct Cloud API or Gambot?', a: 'Gambot. Raw Cloud API returns low-level Graph errors an agent must interpret; Gambot returns machine-readable states (e.g. CONVERSATION_WINDOW_CLOSED with canSendTemplate) and, via MCP, recommended next actions \u2014 so the agent reasons and recovers instead of parsing brittle errors.' },
    { q: 'Will I be locked in or lose access to Meta features?', a: 'You run on the official Cloud API the whole time, so you keep access to WhatsApp Business features and your own WABA. Gambot adds a layer on top; it does not replace Meta.' },
  ],
  he: {
    hero: {
      badge: 'הסבר · לבנות מול לקנות',
      h1: 'WhatsApp Business API: גמבוט מול בנייה ישירה על Cloud API של Meta',
      subhead:
        'שניהם פועלים על <strong style="color:#e9edef">אותו WhatsApp Business (Cloud) API רשמי</strong> של Meta. השאלה היא כמה מהתשתית שמסביב <strong style="color:#e9edef">אתם בונים ומתחזקים</strong> לעומת מקבלים מוכן. זו השוואת "לבנות מול לקנות" עובדתית.',
      primary: { label: 'צור חשבון חינם →' },
      secondary: { label: 'WhatsApp API לסוכני AI' },
      chips: ['Meta Cloud API', 'פלטפורמת BSP', 'MCP', 'סוכני AI', 'ייצור'],
    },
    blocks: [
      {
        title: 'אותו API של Meta בבסיס — כמות עבודה שונה לגמרי',
        paragraphs: [
          'ה־<strong style="color:#e9edef">WhatsApp Cloud API</strong> של Meta הוא ה־API הרשמי והנמוך־רמה לשליחה וקבלה של וואטסאפ. הוא חזק, אבל הוא <em>אבן בניין</em>, לא מוצר: עדיין עליכם לטפל באימות עסקי, רישום מספר טלפון, מחזור חיי תבניות, תשתית webhooks, טיפול במדיה, מגבלות מדרגות מסרים, ניסיונות חוזרים, הסרה/הסכמה וטיפול בשגיאות בעצמכם.',
          'גמבוט היא <strong style="color:#e9edef">ספקית פתרונות עסקיים רשמית (BSP) של Meta</strong> שפועלת על אותו Cloud API בדיוק ונותנת לכם את כל התשתית הזו מוכנה — בתוספת קמפיינים, CRM, בוטים, אנליטיקס, וחשוב מכל ל־AI: <a href="' + MCP + '" style="color:#25D366">שרת MCP</a> ו־<a href="' + DEVELOPERS + '" style="color:#25D366">REST API נקי</a> עם מצבים מובנים וקריאים למכונה. אתם שומרים על ה־API הרשמי; חוסכים חודשים של אינסטלציה.',
        ],
      },
      {
        title: 'Cloud API של Meta בעצמכם מול גמבוט (מנוהל)',
        columns: ['מה צריך', 'לבנות על Meta Cloud API בעצמכם', 'גמבוט (תשתית מוכנה)'],
        rows: [
          ['להתחיל', 'יצירת אפליקציית Meta, מעבר App Review, הקמת Business Manager ו־WABA', 'הרשמה וחיבור וואטסאפ — הצטרפות מודרכת, עולה לאוויר תוך 24–48 שעות'],
          ['אימות עסקי', 'אתם מטפלים באימות העסקי מול Meta בעצמכם', 'מודרך על ידי גמבוט, כולל תהליך התג הירוק'],
          ['מספר טלפון', 'רישום/העברה וניהול המספר דרך קריאות API', 'חיבור או העברת מספר מהלוח בקרה (Coexistence נתמך)'],
          ['תבניות הודעה', 'יצירה והגשה דרך API, מעקב אישור, ניהול גרסאות', 'עורך תבניות ויזואלי עם סטטוס אישור מובנה'],
          ['Webhooks', 'אחסון נקודת קצה HTTPS ציבורית, אימות, מניעת כפילויות, ניסיונות חוזרים וסקיילינג', 'אירועים נכנסים מנוהלים; העברה אופציונלית לנקודת הקצה שלכם'],
          ['מדיה', 'העלאה/הורדה ואחסון מדיה, ניהול מזהים ותפוגה', 'מטופל עבורכם בהודעות, תבניות וקמפיינים'],
          ['לוגיקת חלון 24 שעות', 'מעקב אחר חלון כל שיחה; החלטה בין טקסט חופשי לתבנית', 'נאכף עבורכם; ה־API מחזיר CONVERSATION_WINDOW_CLOSED + canSendTemplate'],
          ['מדרגות ומגבלות מסרים', 'מעקב מדרגות, ויסות, טיפול בשגיאות 131xxx בעצמכם', 'מגבלות מטופלות; קמפיינים מכבדים מדרגות, שגיאות מגבלה מובנות'],
          ['דיוורים / קמפיינים', 'בניית תור, פילוח, הסרה ודיווח משלכם', 'קמפיינים מובנים: קהלים, תזמון, הסכמה, תוצאות לכל נמען'],
          ['אוטומציה / בוטים', 'בניית מנוע בוט ומכונת מצבים מאפס', 'מענים לפי מילת מפתח, בוטי תפריט, בוטי AI — ללא קוד או דרך API/MCP'],
          ['CRM וציות', 'אחסון אנשי קשר, הסכמה, הסרה וטיפול בספאם בעצמכם', 'CRM מובנה, הסכמה/הסרה וטיפול בספאם נאכפים בשליחה'],
          ['אנליטיקס', 'צבירה ואחסון מדדים משלכם', 'הודעות, שיחות, לידים, פניות ותוצאות קמפיינים מהקופסה'],
          ['סוכני AI', 'סוכנים מקבלים שגיאות Graph API גולמיות — שביר להיסק', 'MCP + מצבים מובנים עם צעדי המשך מומלצים'],
          ['תחזוקת גרסת API', 'אתם מהגרים כש־Meta מעדכנת גרסאות Graph API', 'גמבוט עוקבת וסופגת שינויי API של Meta'],
        ],
      },
      {
        title: 'מה התשתית המוכנה חוסכת לכם',
        cards: [
          { icon: '\u23F1\uFE0F', title: 'זמן לשוק', text: 'ימים במקום חודשים — בלי App Review, שרתי webhook או אינסטלציית תבניות לבנות קודם.' },
          { icon: '\uD83D\uDEE0\uFE0F', title: 'אין תשתית להפעיל', text: 'אין נקודות קצה webhook, אחסון מדיה, תורי ניסיונות חוזרים או מעקב מדרגות להפעיל ולנטר.' },
          { icon: '\uD83D\uDEE1\uFE0F', title: 'ציות מובנה', text: 'חלון 24 שעות, הסרה/הסכמה וטיפול בספאם נאכפים בכל שליחה.' },
          { icon: '\uD83E\uDD16', title: 'מוכן לסוכנים', text: 'MCP + מצבים קריאים למכונה — סוכני AI מתאוששים בחוכמה במקום לנתח שגיאות Meta גולמיות.' },
          { icon: '\uD83D\uDD01', title: 'עמיד לעתיד', text: 'גמבוט סופגת שינויי גרסה של Graph API כך שהאינטגרציה שלכם ממשיכה לעבוד.' },
          { icon: '\uD83D\uDCE6', title: 'יותר ממסרים', text: 'קמפיינים, CRM, בוטים ואנליטיקס מעל ה־API — לא רק נקודת שליחה.' },
        ],
      },
      {
        title: 'מתי בנייה ישירה על Meta עדיין הגיונית',
        paragraphs: [
          'Cloud API ישיר יכול להתאים לצוות שרוצה לבעלות כל שכבה, יש לו מהנדסים לבנות ולהפעיל תשתית webhook/מדיה/תור, ואינו זקוק לקמפיינים, CRM, בוטים או כלי AI מעל. זו בחירה נמוכת־רמה לגיטימית.',
          'כמעט לכל השאר — ובמיוחד ל<strong style="color:#e9edef">כל סוכן AI</strong> שאמור להסיק על וואטסאפ במקום לנהל אינסטלציית HTTP — פלטפורמה מוכנה מהירה, בטוחה וזולה יותר. אתם עדיין פועלים על ה־API הרשמי; גמבוט פשוט מסירה את העבודה הכבדה והלא־מבדלת.',
        ],
      },
      {
        title: 'למה זה חשוב לסוכני AI במיוחד',
        bullets: [
          'על ה־Cloud API הגולמי סוכן מקבל <strong style="color:#e9edef">שגיאות Graph API</strong> (למשל קוד 131047 / 131026) שעליו לפרש. גמבוט מחזירה מצבים מנורמלים כמו <code>CONVERSATION_WINDOW_CLOSED</code> עם <code>canSendTemplate: true</code>.',
          'דרך <a href="' + MCP + '" style="color:#25D366">MCP</a>, המצבים הללו הופכים ל<strong style="color:#e9edef">צעדי המשך מומלצים</strong>, כך שהסוכן בוחר את הצעד הנכון (למשל שליחת תבנית מאושרת) במקום להיכשל.',
          'הסוכן מקבל את <strong style="color:#e9edef">כל תהליך העבודה</strong> — תבניות, אנשי קשר, קמפיינים, תזמון, אנליטיקס — ככלים בטוחים, לא קריאת שליחה נמוכת־רמה בודדת. ראו <a href="' + AI_AGENTS + '" style="color:#25D366">WhatsApp API לסוכני AI</a>.',
        ],
      },
      {
        title: 'דלגו על האינסטלציה — שמרו על ה־API הרשמי',
        text: 'צרו חשבון חינם, חברו וואטסאפ, ובנו על WhatsApp Business API בדרגת ייצור עם MCP לסוכני AI — בלי לבנות את התשתית של Meta בעצמכם.',
        primary: { label: 'צור חשבון חינם →' },
        secondary: { label: 'קרא את תיעוד ה־API' },
      },
    ],
    faq: [
      { q: 'האם אפשר פשוט להשתמש ב־Cloud API של Meta ישירות במקום גמבוט?', a: 'כן — ה־Cloud API פתוח לעסקים. אבל אז אתם בונים ומפעילים את כל מה שסביבו: App Review ואימות עסקי מול Meta, רישום מספר, הגשת תבניות ומעקב אישור, נקודת קצה webhook ציבורית עם ניסיונות חוזרים ומניעת כפילויות, אחסון מדיה, טיפול במדרגות ומגבלות קצב, הסרה/הסכמה וטיפול בשגיאות. גמבוט פועלת על אותו API רשמי ומספקת את כל זה מוכן.' },
      { q: 'האם גמבוט רשמית או עקיפה?', a: 'רשמית. גמבוט היא ספקית פתרונות עסקיים (BSP) של Meta ופועלת על ה־WhatsApp Business (Cloud) API המורשה — לא עקיפה לא רשמית ולא WhatsApp Web.' },
      { q: 'האם אני עדיין בעל המספר וה־WABA שלי?', a: 'כן. אתם מחברים מספר/WABA עסקי משלכם; אפשר להעביר מספר קיים, ו־Coexistence מאפשר לבוט לפעול על מספר שאתם עדיין משתמשים בו ידנית.' },
      { q: 'מה גמבוט מוסיפה מעל ה־Cloud API של Meta?', a: 'הצטרפות ואימות מודרכים, עורך תבניות ויזואלי, webhooks מנוהלים, טיפול במדיה, אכיפת חלון 24 שעות, טיפול במדרגות מסרים, קמפיינים מובנים עם הסכמה ותוצאות לכל נמען, CRM, בוטים/אוטומציה, אנליטיקס, REST API, ושרת MCP שחושף את הכל לסוכני AI עם מצבים מובנים והנחיית צעד הבא.' },
      { q: 'מה עדיף לסוכני AI — Cloud API ישיר או גמבוט?', a: 'גמבוט. Cloud API גולמי מחזיר שגיאות Graph נמוכות־רמה שעל הסוכן לפרש; גמבוט מחזירה מצבים קריאים למכונה (למשל CONVERSATION_WINDOW_CLOSED עם canSendTemplate) ודרך MCP צעדי המשך מומלצים — כך שהסוכן מסיק ומתאושש במקום לנתח שגיאות שבירות.' },
      { q: 'האם אינעל או אאבד גישה לתכונות Meta?', a: 'אתם פועלים על ה־Cloud API הרשמי כל הזמן, כך שאתם שומרים על גישה לתכונות WhatsApp Business ול־WABA שלכם. גמבוט מוסיפה שכבה מעל; היא לא מחליפה את Meta.' },
    ],
  },
};

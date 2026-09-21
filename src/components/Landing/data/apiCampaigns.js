import {
  SIGNUP, DOCS, MCP, DEVELOPERS, API_BASE, HOME, ctaCreate, ctaDocs,
} from './_common';

export const data = {
  pageKey: 'whatsapp-api-campaigns',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp Campaign API \u2014 Send WhatsApp Campaigns Programmatically | Gambot',
    appName: 'Gambot WhatsApp Campaign API',
    description:
      'Launch WhatsApp broadcast campaigns via API or MCP: target tags, lists, CRM segments or a spreadsheet, personalize template variables per recipient, and get delivery results \u2014 with opt-out and consent handled automatically.',
    keywords:
      'WhatsApp campaign API, WhatsApp broadcast API, send WhatsApp campaign programmatically, WhatsApp bulk campaign, WhatsApp template campaign API, WhatsApp marketing API',
    canonical: 'https://gambot.co.il/whatsapp-api/campaigns/',
    ogTitle: 'WhatsApp Campaign API',
    ogDescription: 'Launch personalized WhatsApp campaigns via API/MCP with automatic opt-out & consent and delivery results.',
  },
  breadcrumbs: [HOME, { name: 'WhatsApp API', item: DEVELOPERS }, { name: 'Campaigns', item: 'https://gambot.co.il/whatsapp-api/campaigns/' }],
  hero: {
    badge: 'REST API + MCP · WhatsApp Business API',
    h1: 'WhatsApp Campaign API',
    subhead:
      'Launch WhatsApp <strong style="color:#e9edef">broadcast campaigns</strong> from your code or an AI agent \u2014 target tags, lists, CRM segments or a spreadsheet, personalize per recipient, and read delivery results.',
    primary: ctaCreate,
    secondary: ctaDocs,
    chips: ['Tags & segments', 'Template variables', 'Opt-out & consent', 'Delivery results'],
  },
  blocks: [
    {
      type: 'bullets',
      title: 'What you can do',
      bullets: [
        '<strong style="color:#e9edef">Create & run</strong> campaigns via <code>POST ' + '/campaigns</code> and <code>/campaigns/{id}/run</code>, or send ad-hoc with <code>/campaigns/send</code>.',
        '<strong style="color:#e9edef">Target</strong> tags, lists, CRM segments, or an explicit phone list \u2014 the audience is built for you.',
        '<strong style="color:#e9edef">Personalize</strong> approved template variables per recipient.',
        '<strong style="color:#e9edef">Stay compliant</strong> \u2014 opted-out and spam-flagged contacts are excluded automatically; recipients can opt out by replying.',
        '<strong style="color:#e9edef">Read results</strong> with <code>/campaigns/{id}/results</code> \u2014 per-recipient message id and status.',
      ],
    },
    {
      type: 'code',
      title: 'Ad-hoc template broadcast',
      intro: 'Base URL: ' + API_BASE + '. Prefer templates for cold audiences (they deliver outside the 24h window).',
      code: `POST ${API_BASE}/campaigns/send
Authorization: Bearer gmbt_your_token

{
  "messageType": "Template",
  "templateId": "promo_launch_0626",
  "keys": ["VIP"],                // target the "VIP" tag
  "dryRun": true                  // preview audience & counts first
}`,
    },
    {
      type: 'prose',
      title: 'Regular vs template broadcasts',
      paragraphs: [
        'A <strong style="color:#e9edef">regular</strong> (free-text) broadcast only reaches recipients whose 24-hour window is open and silently skips the rest \u2014 so it is wrong for a cold audience. Gambot makes this explicit: for AI agents, a regular broadcast returns a confirmation-required state with the count of recipients who would be missed, and recommends a template instead.',
        'An <strong style="color:#e9edef">approved template</strong> broadcast can initiate conversations outside the window, so it is the right tool for announcements, promotions and reminders.',
      ],
    },
    {
      type: 'prompts',
      title: 'With an AI agent (MCP)',
      prompts: [
        { user: 'Send the promo_launch template to everyone tagged VIP.' },
        { user: 'Preview how many contacts a regular broadcast would actually reach.' },
        { user: 'How did the launch campaign perform?' },
      ],
      note: 'Via the Gambot MCP server, campaigns run through the same API \u2014 see the WhatsApp MCP page.',
    },
    {
      type: 'cta',
      title: 'Run your first campaign',
      text: 'Create a free account, connect WhatsApp, and launch a personalized campaign via API or MCP.',
      primary: ctaCreate,
      secondary: { label: 'WhatsApp MCP setup', href: MCP, event: 'mcp_cta_click' },
    },
  ],
  faq: [
    { q: 'How do I send a WhatsApp campaign via API?', a: 'Create a campaign and run it (POST /campaigns then /campaigns/{id}/run) or send ad-hoc with POST /campaigns/send, targeting tags, lists, CRM segments or a phone list. Use dryRun to preview the audience first.' },
    { q: 'Are opt-outs and consent handled?', a: 'Yes. Broadcasts automatically exclude opted-out and spam-flagged contacts, and recipients can opt out by replying; responses echo consent/opt-out details.' },
    { q: 'Can I personalize templates per recipient?', a: 'Yes \u2014 map values to the template variables for each recipient (including from a spreadsheet).' },
    { q: 'Should I loop send-text to reach many people?', a: 'No. Use campaigns for bulk sends \u2014 they handle throughput, per-recipient variables, consent and reporting. The API and MCP guide you to campaigns for large audiences.' },
  ],
  he: {
    hero: {
      badge: 'REST API + MCP · WhatsApp Business API',
      h1: 'WhatsApp Campaign API — קמפיינים',
      subhead:
        'השיקו <strong style="color:#e9edef">קמפייני דיוור</strong> בוואטסאפ מהקוד שלכם או מסוכן AI — כוונו לתגיות, רשימות, פלחי CRM או גיליון, התאימו אישית לכל נמען, וקראו תוצאות מסירה.',
      primary: { label: 'צור חשבון חינם →' },
      secondary: { label: 'קרא את תיעוד ה־API' },
      chips: ['תגיות ופלחים', 'משתני תבנית', 'הסרה והסכמה', 'תוצאות מסירה'],
    },
    blocks: [
      {
        title: 'מה אפשר לעשות',
        bullets: [
          '<strong style="color:#e9edef">יצירה והרצה</strong> של קמפיינים דרך <code>POST /campaigns</code> ו־<code>/campaigns/{id}/run</code>, או שליחה חד־פעמית עם <code>/campaigns/send</code>.',
          '<strong style="color:#e9edef">כיוון</strong> לתגיות, רשימות, פלחי CRM, או רשימת מספרים מפורשת — הקהל נבנה עבורכם.',
          '<strong style="color:#e9edef">התאמה אישית</strong> של משתני תבנית מאושרת לכל נמען.',
          '<strong style="color:#e9edef">שמירה על ציות</strong> — אנשי קשר שביקשו הסרה או סומנו כספאם מוחרגים אוטומטית; נמענים יכולים להסיר עצמם בתגובה.',
          '<strong style="color:#e9edef">קריאת תוצאות</strong> עם <code>/campaigns/{id}/results</code> — מזהה הודעה וסטטוס לכל נמען.',
        ],
      },
      {
        title: 'דיוור תבנית חד־פעמי',
        intro: 'כתובת בסיס: ' + API_BASE + '. העדיפו תבניות לקהלים קרים (הן נמסרות מחוץ לחלון 24 השעות).',
      },
      {
        title: 'דיוור רגיל מול דיוור תבנית',
        paragraphs: [
          'דיוור <strong style="color:#e9edef">רגיל</strong> (טקסט חופשי) מגיע רק לנמענים שחלון 24 השעות שלהם פתוח ומדלג בשקט על השאר — ולכן שגוי לקהל קר. גמבוט מבהירה זאת: לסוכני AI, דיוור רגיל מחזיר מצב הדורש אישור עם ספירת הנמענים שיוחמצו, וממליץ על תבנית במקום.',
          'דיוור <strong style="color:#e9edef">תבנית מאושרת</strong> יכול לפתוח שיחות מחוץ לחלון, ולכן הוא הכלי הנכון להכרזות, מבצעים ותזכורות.',
        ],
      },
      {
        title: 'עם סוכן AI (MCP)',
        prompts: [
          { user: 'שלח את תבנית promo_launch לכל מי שמתויג VIP.' },
          { user: 'הצג לכמה אנשי קשר דיוור רגיל באמת יגיע.' },
          { user: 'איך הצליח קמפיין ההשקה?' },
        ],
        note: 'דרך שרת ה־MCP של גמבוט, קמפיינים רצים דרך אותו API — ראו את דף ה־WhatsApp MCP.',
      },
      {
        title: 'הריצו את הקמפיין הראשון שלכם',
        text: 'צרו חשבון חינם, חברו וואטסאפ, והשיקו קמפיין מותאם אישית דרך API או MCP.',
        primary: { label: 'צור חשבון חינם →' },
        secondary: { label: 'הגדרת WhatsApp MCP' },
      },
    ],
    faq: [
      { q: 'איך שולחים קמפיין וואטסאפ דרך API?', a: 'צרו קמפיין והריצו אותו (POST /campaigns ואז /campaigns/{id}/run) או שלחו חד־פעמית עם POST /campaigns/send, בכיוון לתגיות, רשימות, פלחי CRM או רשימת מספרים. השתמשו ב־dryRun לתצוגה מקדימה של הקהל.' },
      { q: 'האם הסרות והסכמה מטופלות?', a: 'כן. דיוורים מחריגים אוטומטית אנשי קשר שביקשו הסרה וסומנו כספאם, ונמענים יכולים להסיר עצמם בתגובה; התגובות מחזירות פרטי הסכמה/הסרה.' },
      { q: 'האם אפשר להתאים תבניות לכל נמען?', a: 'כן — מפו ערכים למשתני התבנית לכל נמען (כולל מגיליון נתונים).' },
      { q: 'האם כדאי ללולאה על send-text כדי להגיע לרבים?', a: 'לא. השתמשו בקמפיינים לשליחות המוניות — הם מטפלים בתפוקה, משתנים לכל נמען, הסכמה ודיווח. ה־API וה־MCP מנחים אתכם לקמפיינים לקהלים גדולים.' },
    ],
  },
};

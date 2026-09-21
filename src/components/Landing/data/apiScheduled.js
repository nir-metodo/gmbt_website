import {
  SIGNUP, DOCS, MCP, DEVELOPERS, API_BASE, HOME, ctaCreate, ctaDocs,
} from './_common';

export const data = {
  pageKey: 'whatsapp-api-scheduled-messages',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp Scheduled Messages API \u2014 Schedule & Recurring WhatsApp | Gambot',
    appName: 'Gambot WhatsApp Scheduled Messages API',
    description:
      'Schedule WhatsApp messages and campaigns \u2014 one-time or recurring \u2014 via API or MCP. Gambot runs them automatically at the scheduled time, with clear timezone semantics and delivery results.',
    keywords:
      'WhatsApp scheduled messages API, schedule WhatsApp message, recurring WhatsApp API, WhatsApp reminder API, WhatsApp scheduler, schedule WhatsApp campaign',
    canonical: 'https://gambot.co.il/whatsapp-api/scheduled-messages/',
    ogTitle: 'WhatsApp Scheduled Messages API',
    ogDescription: 'Schedule one-time or recurring WhatsApp campaigns via API/MCP; Gambot runs them automatically.',
  },
  breadcrumbs: [HOME, { name: 'WhatsApp API', item: DEVELOPERS }, { name: 'Scheduled Messages', item: 'https://gambot.co.il/whatsapp-api/scheduled-messages/' }],
  hero: {
    badge: 'REST API + MCP · WhatsApp Business API',
    h1: 'WhatsApp Scheduled Messages API',
    subhead:
      'Schedule WhatsApp sends \u2014 <strong style="color:#e9edef">one-time or recurring</strong> \u2014 from your code or an AI agent. Gambot runs them automatically at the scheduled time, so you don\u2019t maintain a cron of your own.',
    primary: ctaCreate,
    secondary: ctaDocs,
    chips: ['One-time', 'Recurring', 'Auto-run', 'Timezone-aware'],
  },
  blocks: [
    {
      type: 'bullets',
      title: 'How scheduling works',
      bullets: [
        'Any scheduled send \u2014 one-time or recurring \u2014 is a <strong style="color:#e9edef">campaign</strong> with a scheduled trigger; Gambot\u2019s scheduler runs it at <code>runAt</code>.',
        'Create it with <code>POST ' + '/campaigns</code> (campaignTrigger = Scheduled, scheduleType = once or repeated).',
        'List upcoming runs with <code>GET /campaigns/scheduled</code>; read outcomes with <code>/campaigns/{id}/results</code>.',
        'A template does <strong style="color:#e9edef">not</strong> need to be approved when you schedule \u2014 create it now (PENDING) and it only needs Meta approval before <code>runAt</code>. The create response includes a non-blocking template-status warning.',
      ],
    },
    {
      type: 'code',
      title: 'Schedule a recurring campaign',
      intro: 'Base URL: ' + API_BASE + '.',
      code: `POST ${API_BASE}/campaigns
Authorization: Bearer gmbt_your_token

{
  "name": "Weekly tips",
  "campaignTrigger": "Scheduled",
  "scheduleType": "repeated",
  "messageType": "Template",
  "templateId": "weekly_tips_0626",
  "keys": ["newsletter"]
}`,
    },
    {
      type: 'prose',
      title: 'Time periods & timezone',
      paragraphs: [
        'Scheduling and analytics use clear <code>from</code> / <code>to</code> semantics. When you ask an agent for \u201ctoday\u201d, \u201cyesterday\u201d, \u201cthis week\u201d or \u201clast 30 days\u201d, those resolve to explicit date ranges rather than leaving the agent to guess. Day boundaries follow the account\u2019s configured business timezone so \u201ctoday\u201d means what your team expects.',
      ],
    },
    {
      type: 'prompts',
      title: 'With an AI agent (MCP)',
      prompts: [
        { user: 'Schedule this WhatsApp campaign for tomorrow at 10 AM.' },
        { user: 'Send the weekly_tips template to the newsletter tag every Monday morning.' },
        { user: 'What campaigns are scheduled to run this week?' },
      ],
    },
    {
      type: 'cta',
      title: 'Schedule your first send',
      text: 'Create a free account, connect WhatsApp, and schedule a one-time or recurring campaign.',
      primary: ctaCreate,
      secondary: { label: 'WhatsApp MCP setup', href: MCP, event: 'mcp_cta_click' },
    },
  ],
  faq: [
    { q: 'How do I schedule a WhatsApp message via API?', a: 'Create a campaign with a Scheduled trigger (scheduleType once or repeated) via POST /campaigns; Gambot\u2019s scheduler runs it automatically at runAt. List upcoming runs with GET /campaigns/scheduled.' },
    { q: 'Can the template be pending approval when I schedule?', a: 'Yes. You can schedule with a PENDING template; it only needs Meta approval before the scheduled run time. The create response returns a non-blocking template-status warning.' },
    { q: 'Which timezone is used for \u201ctoday\u201d and scheduling?', a: 'Date ranges resolve to explicit from/to values, and day boundaries follow the account\u2019s configured business timezone so agents never have to guess.' },
    { q: 'Do I need my own scheduler / cron?', a: 'No \u2014 Gambot runs scheduled and recurring campaigns for you.' },
  ],
  he: {
    hero: {
      badge: 'REST API + MCP · WhatsApp Business API',
      h1: 'WhatsApp Scheduled Messages API — הודעות מתוזמנות',
      subhead:
        'תזמנו שליחות וואטסאפ — <strong style="color:#e9edef">חד־פעמיות או חוזרות</strong> — מהקוד שלכם או מסוכן AI. גמבוט מריצה אותן אוטומטית בזמן המתוזמן, כך שאינכם מתחזקים cron משלכם.',
      primary: { label: 'צור חשבון חינם →' },
      secondary: { label: 'קרא את תיעוד ה־API' },
      chips: ['חד־פעמי', 'חוזר', 'הרצה אוטומטית', 'מודע לאזור זמן'],
    },
    blocks: [
      {
        title: 'איך התזמון עובד',
        bullets: [
          'כל שליחה מתוזמנת — חד־פעמית או חוזרת — היא <strong style="color:#e9edef">קמפיין</strong> עם טריגר מתוזמן; המתזמן של גמבוט מריץ אותו ב־<code>runAt</code>.',
          'צרו אותו עם <code>POST /campaigns</code> (campaignTrigger = Scheduled, scheduleType = once או repeated).',
          'הציגו הרצות עתידיות עם <code>GET /campaigns/scheduled</code>; קראו תוצאות עם <code>/campaigns/{id}/results</code>.',
          'תבנית <strong style="color:#e9edef">אינה</strong> חייבת להיות מאושרת בעת התזמון — צרו אותה עכשיו (PENDING) והיא זקוקה לאישור Meta רק לפני <code>runAt</code>. תגובת היצירה כוללת אזהרת סטטוס־תבנית שאינה חוסמת.',
        ],
      },
      {
        title: 'תזמון קמפיין חוזר',
        intro: 'כתובת בסיס: ' + API_BASE + '.',
      },
      {
        title: 'טווחי זמן ואזור זמן',
        paragraphs: [
          'תזמון ואנליטיקס משתמשים בסמנטיקה ברורה של <code>from</code> / <code>to</code>. כשאתם מבקשים מסוכן "היום", "אתמול", "השבוע" או "30 הימים האחרונים", אלו נפתרים לטווחי תאריכים מפורשים במקום להשאיר לסוכן לנחש. גבולות היום עוקבים אחר אזור הזמן העסקי המוגדר בחשבון, כך ש"היום" משמעו מה שהצוות שלכם מצפה.',
        ],
      },
      {
        title: 'עם סוכן AI (MCP)',
        prompts: [
          { user: 'תזמן את קמפיין הוואטסאפ הזה למחר ב־10:00.' },
          { user: 'שלח את תבנית weekly_tips לתגית newsletter בכל יום שני בבוקר.' },
          { user: 'אילו קמפיינים מתוזמנים לרוץ השבוע?' },
        ],
      },
      {
        title: 'תזמנו את השליחה הראשונה שלכם',
        text: 'צרו חשבון חינם, חברו וואטסאפ, ותזמנו קמפיין חד־פעמי או חוזר.',
        primary: { label: 'צור חשבון חינם →' },
        secondary: { label: 'הגדרת WhatsApp MCP' },
      },
    ],
    faq: [
      { q: 'איך מתזמנים הודעת וואטסאפ דרך API?', a: 'צרו קמפיין עם טריגר Scheduled (scheduleType once או repeated) דרך POST /campaigns; המתזמן של גמבוט מריץ אותו אוטומטית ב־runAt. הציגו הרצות עתידיות עם GET /campaigns/scheduled.' },
      { q: 'האם התבנית יכולה להיות בהמתנה לאישור בעת התזמון?', a: 'כן. אפשר לתזמן עם תבנית PENDING; היא זקוקה לאישור Meta רק לפני זמן ההרצה המתוזמן. תגובת היצירה מחזירה אזהרת סטטוס־תבנית שאינה חוסמת.' },
      { q: 'באיזה אזור זמן משתמשים ל"היום" ולתזמון?', a: 'טווחי תאריכים נפתרים לערכי from/to מפורשים, וגבולות היום עוקבים אחר אזור הזמן העסקי המוגדר בחשבון כך שסוכנים לעולם לא צריכים לנחש.' },
      { q: 'האם צריך מתזמן / cron משלי?', a: 'לא — גמבוט מריצה עבורכם קמפיינים מתוזמנים וחוזרים.' },
    ],
  },
};

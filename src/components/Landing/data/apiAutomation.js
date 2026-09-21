import {
  SIGNUP, DOCS, MCP, DEVELOPERS, API_BASE, HOME, ctaCreate, ctaDocs,
} from './_common';

export const data = {
  pageKey: 'whatsapp-api-automation',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp Automation API \u2014 Auto-replies, Menus & Bots | Gambot',
    appName: 'Gambot WhatsApp Automation API',
    description:
      'Build WhatsApp automations programmatically: keyword auto-replies, template-button flows and menu bots via API or MCP. Wire WhatsApp into your app\u2019s logic on the official WhatsApp Business API.',
    keywords:
      'WhatsApp automation API, WhatsApp bot API, WhatsApp auto-reply API, WhatsApp keyword bot, WhatsApp menu bot API, WhatsApp workflow automation',
    canonical: 'https://gambot.co.il/whatsapp-api/automation/',
    ogTitle: 'WhatsApp Automation API',
    ogDescription: 'Create keyword auto-replies, template-button flows and menu bots via API/MCP.',
  },
  breadcrumbs: [HOME, { name: 'WhatsApp API', item: DEVELOPERS }, { name: 'Automation', item: 'https://gambot.co.il/whatsapp-api/automation/' }],
  hero: {
    badge: 'REST API + MCP · WhatsApp Business API',
    h1: 'WhatsApp Automation API',
    subhead:
      'Create WhatsApp <strong style="color:#e9edef">auto-replies, menu bots and template-button flows</strong> from your code or an AI agent \u2014 and combine them with campaigns, scheduling and CRM.',
    primary: ctaCreate,
    secondary: ctaDocs,
    chips: ['Keyword auto-reply', 'Menu bots', 'Template buttons', 'CRM triggers'],
  },
  blocks: [
    {
      type: 'cards',
      title: 'Automations you can create',
      cards: [
        { icon: '\uD83D\uDD11', title: 'Keyword auto-reply', text: 'Reply automatically when a message matches keywords \u2014 POST /bots/keyword-reply.' },
        { icon: '\uD83D\uDD18', title: 'Template-button reply', text: 'Respond to a template\u2019s quick-reply buttons \u2014 POST /bots/template-button-reply.' },
        { icon: '\uD83D\uDCCB', title: 'Menu bot', text: 'An opening template plus numbered options that route the conversation \u2014 POST /bots/menu.' },
        { icon: '\u2699\uFE0F', title: 'Full bot flows', text: 'Manage advanced multi-step flows \u2014 GET/POST /bots, /bots/{id}/status.' },
      ],
    },
    {
      type: 'code',
      title: 'Create a keyword auto-reply',
      intro: 'Base URL: ' + API_BASE + '.',
      code: `POST ${API_BASE}/bots/keyword-reply
Authorization: Bearer gmbt_your_token

{
  "name": "Pricing keyword",
  "keywords": ["price", "pricing", "cost"],
  "replyTemplateName": "pricing_info_0626"
}`,
    },
    {
      type: 'bullets',
      title: 'Automation, end to end',
      bullets: [
        'Trigger campaigns and scheduled sends alongside automations for full lifecycle messaging.',
        'Update contact tags, status and category from your logic to segment future broadcasts.',
        'Escalate to a human: flag conversations by owner, status or SLA when a person is needed.',
        'Do it in natural language via <a href="' + MCP + '" style="color:#25D366">the WhatsApp MCP server</a>, or in code via REST.',
      ],
    },
    {
      type: 'prompts',
      title: 'With an AI agent (MCP)',
      prompts: [
        { user: 'Create a keyword auto-reply that answers \u201cprice\u201d with the pricing template.' },
        { user: 'Set up a menu bot: 1) Sales, 2) Support, 3) Billing.' },
        { user: 'Pause the after-hours auto-reply bot.' },
      ],
    },
    {
      type: 'cta',
      title: 'Automate WhatsApp',
      text: 'Create a free account, connect WhatsApp, and build your first automation via API or MCP.',
      primary: ctaCreate,
      secondary: { label: 'WhatsApp MCP setup', href: MCP, event: 'mcp_cta_click' },
    },
  ],
  faq: [
    { q: 'What WhatsApp automations can I create via API?', a: 'Keyword auto-replies (POST /bots/keyword-reply), template-button replies (POST /bots/template-button-reply), menu bots (POST /bots/menu), and advanced multi-step bot flows (GET/POST /bots).' },
    { q: 'Can I enable/disable a bot programmatically?', a: 'Yes \u2014 use POST /bots/{id}/status to change a bot\u2019s status.' },
    { q: 'Can an AI agent build automations for me?', a: 'Yes. Through the Gambot MCP server, an agent can create keyword auto-replies, menu bots and template-button flows in natural language.' },
    { q: 'Is this the official WhatsApp API?', a: 'Yes \u2014 Gambot runs on the authorized WhatsApp Business (Cloud) API as an official Meta Business Solution Provider.' },
  ],
  he: {
    hero: {
      badge: 'REST API + MCP · WhatsApp Business API',
      h1: 'WhatsApp Automation API — אוטומציה',
      subhead:
        'צרו <strong style="color:#e9edef">מענים אוטומטיים, בוטי תפריט ותהליכי כפתורי תבנית</strong> בוואטסאפ מהקוד שלכם או מסוכן AI — ושלבו אותם עם קמפיינים, תזמון ו־CRM.',
      primary: { label: 'צור חשבון חינם →' },
      secondary: { label: 'קרא את תיעוד ה־API' },
      chips: ['מענה לפי מילת מפתח', 'בוטי תפריט', 'כפתורי תבנית', 'טריגרים מ־CRM'],
    },
    blocks: [
      {
        title: 'אוטומציות שאפשר ליצור',
        cards: [
          { icon: '\uD83D\uDD11', title: 'מענה לפי מילת מפתח', text: 'מענה אוטומטי כשהודעה תואמת מילות מפתח — POST /bots/keyword-reply.' },
          { icon: '\uD83D\uDD18', title: 'מענה לכפתור תבנית', text: 'תגובה לכפתורי מענה מהיר של תבנית — POST /bots/template-button-reply.' },
          { icon: '\uD83D\uDCCB', title: 'בוט תפריט', text: 'תבנית פתיחה בתוספת אפשרויות ממוספרות שמנתבות את השיחה — POST /bots/menu.' },
          { icon: '\u2699\uFE0F', title: 'תהליכי בוט מלאים', text: 'ניהול תהליכים מתקדמים רבי־שלבים — GET/POST /bots, /bots/{id}/status.' },
        ],
      },
      {
        title: 'יצירת מענה לפי מילת מפתח',
        intro: 'כתובת בסיס: ' + API_BASE + '.',
      },
      {
        title: 'אוטומציה מקצה לקצה',
        bullets: [
          'הפעילו קמפיינים ושליחות מתוזמנות לצד אוטומציות למסרים לאורך כל מחזור החיים.',
          'עדכנו תגיות, סטטוס וקטגוריה של אנשי קשר מהלוגיקה שלכם כדי לפלח דיוורים עתידיים.',
          'הסלימו לאדם: סמנו שיחות לפי בעלים, סטטוס או SLA כשנדרש אדם.',
          'עשו זאת בשפה טבעית דרך <a href="' + MCP + '" style="color:#25D366">שרת ה־WhatsApp MCP</a>, או בקוד דרך REST.',
        ],
      },
      {
        title: 'עם סוכן AI (MCP)',
        prompts: [
          { user: 'צור מענה לפי מילת מפתח שעונה ל"מחיר" עם תבנית התמחור.' },
          { user: 'הקם בוט תפריט: 1) מכירות, 2) תמיכה, 3) חיובים.' },
          { user: 'השהה את בוט המענה שמחוץ לשעות הפעילות.' },
        ],
      },
      {
        title: 'הפכו את וואטסאפ לאוטומטי',
        text: 'צרו חשבון חינם, חברו וואטסאפ, ובנו את האוטומציה הראשונה שלכם דרך API או MCP.',
        primary: { label: 'צור חשבון חינם →' },
        secondary: { label: 'הגדרת WhatsApp MCP' },
      },
    ],
    faq: [
      { q: 'אילו אוטומציות וואטסאפ אפשר ליצור דרך API?', a: 'מענים לפי מילת מפתח (POST /bots/keyword-reply), מענים לכפתורי תבנית (POST /bots/template-button-reply), בוטי תפריט (POST /bots/menu), ותהליכי בוט מתקדמים רבי־שלבים (GET/POST /bots).' },
      { q: 'האם אפשר להפעיל/להשבית בוט תכנותית?', a: 'כן — השתמשו ב־POST /bots/{id}/status כדי לשנות את סטטוס הבוט.' },
      { q: 'האם סוכן AI יכול לבנות עבורי אוטומציות?', a: 'כן. דרך שרת ה־MCP של גמבוט, סוכן יכול ליצור מענים לפי מילת מפתח, בוטי תפריט ותהליכי כפתורי תבנית בשפה טבעית.' },
      { q: 'האם זה ה־WhatsApp API הרשמי?', a: 'כן — גמבוט פועלת על ה־WhatsApp Business (Cloud) API המורשה כספקית פתרונות עסקיים רשמית של Meta.' },
    ],
  },
};

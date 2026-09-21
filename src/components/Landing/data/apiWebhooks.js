import {
  SIGNUP, DOCS, MCP, DEVELOPERS, API_BASE, HOME, ctaCreate, ctaDocs,
} from './_common';

export const data = {
  pageKey: 'whatsapp-api-webhooks',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp Webhooks \u2014 Real-time Inbound WhatsApp Events | Gambot',
    appName: 'Gambot WhatsApp Webhooks',
    description:
      'Receive real-time WhatsApp events at your endpoint: inbound messages and updates forwarded by Gambot. Configure a webhook, verify the payload, and react in your app \u2014 no Meta Graph plumbing required.',
    keywords:
      'WhatsApp webhooks, WhatsApp inbound webhook, WhatsApp API webhook, receive WhatsApp messages webhook, WhatsApp event forwarding, WhatsApp real-time API',
    canonical: 'https://gambot.co.il/whatsapp-api/webhooks/',
    ogTitle: 'WhatsApp Webhooks',
    ogDescription: 'Get inbound WhatsApp events forwarded to your endpoint in real time \u2014 configure a webhook and react.',
  },
  breadcrumbs: [HOME, { name: 'WhatsApp API', item: DEVELOPERS }, { name: 'Webhooks', item: 'https://gambot.co.il/whatsapp-api/webhooks/' }],
  hero: {
    badge: 'REST API · WhatsApp Business API',
    h1: 'WhatsApp Webhooks',
    subhead:
      'React to WhatsApp in real time. Gambot <strong style="color:#e9edef">forwards inbound WhatsApp events</strong> to your endpoint so your app or agent can respond \u2014 without you wiring up Meta Graph webhooks yourself.',
    primary: ctaCreate,
    secondary: ctaDocs,
    chips: ['Inbound messages', 'Real-time', 'JSON payload', 'Your endpoint'],
  },
  blocks: [
    {
      type: 'bullets',
      title: 'How it works',
      bullets: [
        'Configure your webhook endpoint in Gambot\u2019s webhook settings.',
        'Gambot forwards inbound WhatsApp events (e.g. incoming messages) to your URL as JSON, fire-and-forget.',
        'Your service processes the event \u2014 create a lead, trigger an agent, update a record \u2014 and can reply via the REST API.',
        'Pair webhooks with the <a href="' + DOCS + '" style="color:#25D366">messaging & conversation endpoints</a> to build a full inbound \u2192 action loop.',
      ],
    },
    {
      type: 'code',
      title: 'React to an inbound message',
      intro: 'When an event arrives at your endpoint, reply via the API (base URL: ' + API_BASE + ').',
      code: `# 1) Gambot POSTs an inbound event to your webhook URL (JSON body).
# 2) Your service reacts and can reply within the 24h window:

POST ${API_BASE}/messages/send-text
Authorization: Bearer gmbt_your_token

{ "to": "972501234567", "text": "Thanks! We\u2019ll get right back to you." }`,
    },
    {
      type: 'prose',
      title: 'Reliable, secure, in your control',
      paragraphs: [
        'Because Gambot manages the underlying Meta webhook subscription, you get a clean, stable payload at a single endpoint \u2014 no verification handshakes or Graph subscription management on your side. Configure, and start receiving events.',
        'See the Webhooks section of the <a href="' + DOCS + '" style="color:#25D366">developer docs</a> for the exact payload format, headers and delivery semantics.',
      ],
    },
    {
      type: 'cta',
      title: 'Start receiving WhatsApp events',
      text: 'Create a free account, connect WhatsApp, and point a webhook at your endpoint.',
      primary: ctaCreate,
      secondary: { label: 'Webhook docs', href: DOCS, event: 'developer_docs_click' },
    },
  ],
  faq: [
    { q: 'How do I receive inbound WhatsApp messages?', a: 'Configure a webhook endpoint in Gambot; inbound WhatsApp events are forwarded to your URL as JSON in real time. You then react and can reply via the REST API.' },
    { q: 'Do I need to manage Meta Graph webhooks?', a: 'No. Gambot manages the underlying Meta subscription and forwards a clean payload to your endpoint \u2014 no verification handshake on your side.' },
    { q: 'Can I reply automatically to inbound messages?', a: 'Yes \u2014 from your webhook handler, call the messaging endpoints (send-text within the 24h window, or a template) to respond, or trigger an AI agent via MCP.' },
    { q: 'Where is the payload format documented?', a: 'In the Webhooks section of the developer docs at gambot.co.il/developers/.' },
  ],
  he: {
    hero: {
      badge: 'REST API · WhatsApp Business API',
      h1: 'WhatsApp Webhooks — וובהוקים',
      subhead:
        'הגיבו לוואטסאפ בזמן אמת. גמבוט <strong style="color:#e9edef">מעבירה אירועי וואטסאפ נכנסים</strong> לנקודת הקצה שלכם כדי שהאפליקציה או הסוכן שלכם יגיבו — בלי שתחברו webhooks של Meta Graph בעצמכם.',
      primary: { label: 'צור חשבון חינם →' },
      secondary: { label: 'קרא את תיעוד ה־API' },
      chips: ['הודעות נכנסות', 'זמן אמת', 'מטען JSON', 'נקודת הקצה שלכם'],
    },
    blocks: [
      {
        title: 'איך זה עובד',
        bullets: [
          'הגדירו את נקודת קצה ה־webhook שלכם בהגדרות ה־webhook של גמבוט.',
          'גמבוט מעבירה אירועי וואטסאפ נכנסים (למשל הודעות נכנסות) לכתובת שלכם כ־JSON, בשיטת fire-and-forget.',
          'השירות שלכם מעבד את האירוע — יוצר ליד, מפעיל סוכן, מעדכן רשומה — ויכול להשיב דרך ה־REST API.',
          'שלבו webhooks עם <a href="' + DOCS + '" style="color:#25D366">נקודות הקצה של מסרים ושיחות</a> כדי לבנות לולאת נכנס ← פעולה מלאה.',
        ],
      },
      {
        title: 'הגיבו להודעה נכנסת',
        intro: 'כשאירוע מגיע לנקודת הקצה שלכם, השיבו דרך ה־API (כתובת בסיס: ' + API_BASE + ').',
      },
      {
        title: 'אמין, מאובטח, בשליטתכם',
        paragraphs: [
          'מכיוון שגמבוט מנהלת את מנוי ה־webhook הבסיסי של Meta, אתם מקבלים מטען נקי ויציב בנקודת קצה אחת — בלי לחיצות יד לאימות או ניהול מנוי Graph מצדכם. הגדירו, והתחילו לקבל אירועים.',
          'ראו את מקטע ה־Webhooks ב<a href="' + DOCS + '" style="color:#25D366">תיעוד למפתחים</a> לפורמט המטען המדויק, הכותרות וסמנטיקת המסירה.',
        ],
      },
      {
        title: 'התחילו לקבל אירועי וואטסאפ',
        text: 'צרו חשבון חינם, חברו וואטסאפ, וכוונו webhook לנקודת הקצה שלכם.',
        primary: { label: 'צור חשבון חינם →' },
        secondary: { label: 'תיעוד Webhook' },
      },
    ],
    faq: [
      { q: 'איך מקבלים הודעות וואטסאפ נכנסות?', a: 'הגדירו נקודת קצה webhook בגמבוט; אירועי וואטסאפ נכנסים מועברים לכתובת שלכם כ־JSON בזמן אמת. אז אתם מגיבים ויכולים להשיב דרך ה־REST API.' },
      { q: 'האם צריך לנהל webhooks של Meta Graph?', a: 'לא. גמבוט מנהלת את המנוי הבסיסי של Meta ומעבירה מטען נקי לנקודת הקצה שלכם — בלי לחיצת יד לאימות מצדכם.' },
      { q: 'האם אפשר להשיב אוטומטית להודעות נכנסות?', a: 'כן — מתוך מטפל ה־webhook שלכם, קראו לנקודות הקצה של המסרים (send-text בתוך חלון 24 השעות, או תבנית) כדי להגיב, או הפעילו סוכן AI דרך MCP.' },
      { q: 'איפה מתועד פורמט המטען?', a: 'במקטע ה־Webhooks בתיעוד למפתחים בכתובת gambot.co.il/developers/.' },
    ],
  },
};

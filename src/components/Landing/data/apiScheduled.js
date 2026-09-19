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
};

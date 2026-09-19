import {
  SIGNUP, DOCS, MCP, DEVELOPERS, API_BASE, HOME, ctaCreate, ctaDocs,
} from './_common';

export const data = {
  pageKey: 'whatsapp-api-bulk-messaging',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp Bulk Messaging API \u2014 Send at Scale, Compliantly | Gambot',
    appName: 'Gambot WhatsApp Bulk Messaging API',
    description:
      'Send WhatsApp at scale the right way via API or MCP: use campaigns (not send loops), personalize templates per recipient, respect Meta messaging limits, and exclude opted-out contacts automatically.',
    keywords:
      'WhatsApp bulk messaging API, WhatsApp bulk send API, send WhatsApp at scale, WhatsApp mass messaging, WhatsApp broadcast API, WhatsApp bulk template API',
    canonical: 'https://gambot.co.il/whatsapp-api/bulk-messaging/',
    ogTitle: 'WhatsApp Bulk Messaging API',
    ogDescription: 'Send WhatsApp at scale with campaigns \u2014 personalized, compliant, and within Meta limits.',
  },
  breadcrumbs: [HOME, { name: 'WhatsApp API', item: DEVELOPERS }, { name: 'Bulk Messaging', item: 'https://gambot.co.il/whatsapp-api/bulk-messaging/' }],
  hero: {
    badge: 'REST API + MCP · WhatsApp Business API',
    h1: 'WhatsApp Bulk Messaging API',
    subhead:
      'Send WhatsApp <strong style="color:#e9edef">at scale, the right way</strong>. Use campaigns (never a send loop), personalize templates per recipient, respect Meta\u2019s messaging limits, and exclude opted-out contacts automatically.',
    primary: ctaCreate,
    secondary: ctaDocs,
    chips: ['Campaigns', 'From spreadsheet', 'Messaging limits', 'Opt-out safe'],
  },
  blocks: [
    {
      type: 'prose',
      title: 'Don\u2019t loop \u2014 use a campaign',
      paragraphs: [
        'Sending many individual messages by looping a single-send endpoint is the wrong approach: it ignores throughput limits, consent, per-recipient personalization and reporting. Gambot\u2019s API and MCP are explicit about this \u2014 when a large audience is detected, you\u2019re guided to use a <strong style="color:#e9edef">campaign</strong> instead.',
        'Campaigns build the audience (tags, lists, CRM segments or a spreadsheet), personalize the approved template per recipient, and return per-recipient delivery results \u2014 all within Meta\u2019s rules.',
      ],
    },
    {
      type: 'code',
      title: 'Bulk send from a list',
      intro: 'Base URL: ' + API_BASE + '. Use dryRun to preview the audience and counts first.',
      code: `POST ${API_BASE}/campaigns/send
Authorization: Bearer gmbt_your_token

{
  "messageType": "Template",
  "templateId": "shipping_update_0626",
  "phones": ["972501111111", "972502222222", "972503333333"],
  "dryRun": true
}`,
    },
    {
      type: 'bullets',
      title: 'Built-in guardrails',
      bullets: [
        '<strong style="color:#e9edef">Meta messaging limits</strong> \u2014 responses surface your daily tier; oversized audiences are flagged (with suggested blocks) rather than silently failing.',
        '<strong style="color:#e9edef">Consent & opt-out</strong> \u2014 opted-out and spam-flagged contacts are excluded automatically.',
        '<strong style="color:#e9edef">Window awareness</strong> \u2014 a regular (free-text) bulk send only reaches open-window recipients; templates are recommended for cold audiences.',
        '<strong style="color:#e9edef">Rate limiting</strong> \u2014 when limits are hit, the API returns a machine-readable state so agents back off instead of hammering retries.',
      ],
    },
    {
      type: 'prompts',
      title: 'With an AI agent (MCP)',
      prompts: [
        { user: 'Message everyone in this spreadsheet with the shipping_update template.' },
        { user: 'How many of these 5,000 numbers would a regular broadcast actually reach?' },
        { user: 'Message everyone in the \u201clapsed\u201d segment tomorrow.' },
      ],
      note: 'For large audiences, the agent is guided to campaigns automatically \u2014 it won\u2019t loop single sends.',
    },
    {
      type: 'cta',
      title: 'Send WhatsApp at scale',
      text: 'Create a free account, connect WhatsApp, and run a compliant bulk campaign via API or MCP.',
      primary: ctaCreate,
      secondary: { label: 'WhatsApp MCP setup', href: MCP, event: 'mcp_cta_click' },
    },
  ],
  faq: [
    { q: 'What\u2019s the right way to send WhatsApp in bulk?', a: 'Use campaigns (POST /campaigns then run, or POST /campaigns/send) \u2014 not a loop over single-send endpoints. Campaigns handle throughput, per-recipient template variables, consent and reporting.' },
    { q: 'Are Meta messaging limits respected?', a: 'Yes. Campaign responses surface your daily messaging tier and flag oversized audiences (with suggested daily blocks) instead of silently failing.' },
    { q: 'Are opted-out contacts excluded?', a: 'Yes \u2014 opted-out and spam-flagged contacts are automatically excluded, and recipients can opt out by replying.' },
    { q: 'What happens if I hit a rate limit?', a: 'The API returns a machine-readable RATE_LIMITED / messaging-limit state so clients and AI agents back off and retry later rather than looping.' },
  ],
};

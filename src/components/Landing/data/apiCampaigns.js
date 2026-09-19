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
};

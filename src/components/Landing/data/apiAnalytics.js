import {
  SIGNUP, DOCS, MCP, DEVELOPERS, API_BASE, AI_AGENTS, HOME, ctaCreate, ctaDocs,
} from './_common';

export const data = {
  pageKey: 'whatsapp-api-analytics',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp Analytics API \u2014 Understand Your WhatsApp Operation | Gambot',
    appName: 'Gambot WhatsApp Analytics API',
    description:
      'Query your WhatsApp operation via API or MCP: messages received/sent, conversations waiting for a reply, leads, cases, tasks and campaign performance \u2014 with clear time-period and timezone semantics for AI agents.',
    keywords:
      'WhatsApp analytics API, WhatsApp reporting API, WhatsApp metrics API, WhatsApp conversation analytics, WhatsApp campaign analytics, AI-readable WhatsApp analytics',
    canonical: 'https://gambot.co.il/whatsapp-api/analytics/',
    ogTitle: 'WhatsApp Analytics API',
    ogDescription: 'Query messages, conversations, leads, cases and campaign performance via API/MCP \u2014 built for AI interpretation.',
  },
  breadcrumbs: [HOME, { name: 'WhatsApp API', item: DEVELOPERS }, { name: 'Analytics', item: 'https://gambot.co.il/whatsapp-api/analytics/' }],
  hero: {
    badge: 'REST API + MCP · WhatsApp Business API',
    h1: 'WhatsApp Analytics API',
    subhead:
      'The difference between an AI that can <strong style="color:#e9edef">send</strong> WhatsApp and one that can <strong style="color:#e9edef">understand</strong> it. Query your messaging, conversations, campaigns and CRM \u2014 built to be read by AI agents.',
    primary: ctaCreate,
    secondary: ctaDocs,
    chips: ['Messages', 'Conversations', 'Leads & cases', 'Campaign results'],
  },
  blocks: [
    {
      type: 'bullets',
      title: 'Questions you can actually answer',
      intro: 'Each maps to a real Gambot analytics endpoint / metric \u2014 nothing fabricated.',
      bullets: [
        '\u201cHow many messages did we receive / send today?\u201d \u2014 <code>GET ' + '/analytics/summary</code>, <code>/analytics/messages</code>.',
        '\u201cHow many conversations are waiting for a response?\u201d \u2014 <code>GET /conversations/sla</code>.',
        '\u201cHow many new leads / how is the pipeline?\u201d \u2014 <code>GET /analytics/leads</code>.',
        '\u201cWhat happened in customer service today?\u201d \u2014 <code>GET /analytics/cases</code> (+ SLA).',
        '\u201cWhat were the most common customer questions?\u201d \u2014 <code>GET /analytics/transcript</code> (read the actual content, then summarize).',
        '\u201cHow did the campaign perform?\u201d \u2014 <code>GET /campaigns/{id}/results</code>.',
      ],
    },
    {
      type: 'code',
      title: 'AI-readable analytics shape',
      intro: 'Responses are structured so an agent doesn\u2019t have to reconstruct anything. Base URL: ' + API_BASE + '.',
      code: `GET ${API_BASE}/analytics/summary?period=today

{
  "period": { "from": "2026-09-19", "to": "2026-09-19", "period": "today" },
  "messages": { "incoming": 184, "outgoing": 231 },
  "conversations": { "active": 63, "waitingForReply": 12 }
  /* Shape is illustrative; exact fields come from your account\u2019s data. */
}`,
    },
    {
      type: 'prose',
      title: 'Clear time periods & timezone',
      paragraphs: [
        'Agents ask for \u201ctoday\u201d, \u201cyesterday\u201d, \u201cthis week\u201d or \u201clast 30 days\u201d. The analytics endpoints accept a <code>period</code> shortcut or explicit <code>from</code>/<code>to</code> dates and always return the resolved range, so the agent knows exactly what it measured. Day boundaries follow the account\u2019s business timezone \u2014 no guessing which \u201ctoday\u201d is meant.',
        'Sensitive data is never auto-exposed: analytics respect the API key\u2019s scopes, and message content is only available through the explicit transcript endpoint (which requires the appropriate scope).',
      ],
    },
    {
      type: 'prompts',
      title: 'With an AI agent (MCP)',
      prompts: [
        { user: 'How many WhatsApp messages did we receive today?', agent: '147 received; 32 new leads; 11 waiting for a reply. (Illustrative \u2014 real values come from your analytics endpoints.)' },
        { user: 'Which customers are still waiting for a reply?' },
        { user: 'Summarize today\u2019s customer service conversations.' },
      ],
      note: 'Example numbers are illustrative, not Gambot statistics.',
    },
    {
      type: 'cta',
      title: 'Give your AI real WhatsApp understanding',
      text: 'Create a free account, connect WhatsApp, and let agents query your operation \u2014 not just send messages.',
      primary: ctaCreate,
      secondary: { label: 'WhatsApp API for AI agents', href: AI_AGENTS, event: 'developer_docs_click' },
    },
  ],
  faq: [
    { q: 'What WhatsApp metrics can I query via API?', a: 'Message volume (received/sent), conversations waiting for a reply (SLA), new contacts, leads pipeline, cases/tickets, tasks, CTWA ad performance, bot runs, and campaign results \u2014 each via a dedicated analytics endpoint.' },
    { q: 'How are time periods handled?', a: 'Use a period shortcut (today, yesterday, week, month, 30d, all) or explicit from/to dates; the response returns the resolved range. Day boundaries follow the account\u2019s business timezone.' },
    { q: 'Can an AI read the actual conversation content?', a: 'Yes, through the transcript endpoint (with the appropriate scope) \u2014 useful for qualitative questions like \u201cwhat did customers ask about today?\u201d. Content access respects the API key\u2019s scopes.' },
    { q: 'Are the example numbers real Gambot statistics?', a: 'No \u2014 example figures on this page are illustrative. Real values are computed from your own account\u2019s data.' },
  ],
};

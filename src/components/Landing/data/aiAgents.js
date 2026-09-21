import {
  SIGNUP, DOCS, MCP, DEVELOPERS, HOME, CRUMB_DEV,
  ctaCreate, ctaMcp,
} from './_common';

export const data = {
  pageKey: 'whatsapp-api-for-ai-agents',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp Business API for AI Agents | Gambot',
    appName: 'Gambot WhatsApp Business API for AI Agents',
    description:
      'Let AI agents send, receive, schedule, automate and analyze WhatsApp through the official WhatsApp Business API — via MCP or REST API. Structured, machine-readable states so agents recover intelligently and never guess.',
    keywords:
      'WhatsApp API for AI agents, WhatsApp Business API for AI, AI WhatsApp API, WhatsApp MCP for agents, agentic WhatsApp, WhatsApp API automation, WhatsApp for ChatGPT Claude Gemini',
    canonical: 'https://gambot.co.il/whatsapp-api-for-ai-agents/',
    ogTitle: 'WhatsApp Business API for AI Agents',
    ogDescription:
      'Send, receive, schedule, automate and analyze WhatsApp from any AI agent through MCP or REST API — with structured states agents can reason about.',
  },
  breadcrumbs: [HOME, CRUMB_DEV, { name: 'WhatsApp API for AI Agents', item: 'https://gambot.co.il/whatsapp-api-for-ai-agents/' }],
  hero: {
    badge: 'MCP + REST API · Official WhatsApp Business API',
    h1: 'WhatsApp Business API for AI Agents',
    subhead:
      'Let AI agents <strong style="color:#e9edef">send, receive, schedule, automate and analyze</strong> WhatsApp communication through <strong style="color:#e9edef">MCP</strong> or <strong style="color:#e9edef">REST API</strong> — on the official, Meta-approved WhatsApp Business API.',
    primary: ctaCreate,
    secondary: { label: 'WhatsApp MCP setup', href: MCP, event: 'mcp_cta_click' },
    chips: ['ChatGPT', 'Claude', 'Gemini', 'Cursor', 'Any MCP client', 'REST'],
  },
  blocks: [
    {
      type: 'prose',
      title: 'More than sending messages',
      paragraphs: [
        'There is a difference between an AI that can <strong style="color:#e9edef">send</strong> a WhatsApp message and an AI that can <strong style="color:#e9edef">understand and operate</strong> your WhatsApp channel. Gambot exposes the whole business workflow around WhatsApp — messaging, templates, contacts, conversations, campaigns, scheduling, automations and analytics — not just a single send endpoint.',
        'Business facts and state (is the 24-hour window open? is a template required? which contact matched?) come back from the API as <strong style="color:#e9edef">structured, machine-readable</strong> fields. The <a href="' + MCP + '" style="color:#25D366">Gambot MCP server</a> turns those states into next-action guidance, so an agent recovers intelligently instead of failing on a raw error.',
      ],
    },
    {
      type: 'prompts',
      title: 'Real agent workflows',
      intro: 'Ask in natural language; the agent uses the safest appropriate Gambot workflow.',
      prompts: [
        {
          user: 'How many WhatsApp messages did we receive today?',
          agent: '147 messages were received today. 32 were new leads. 11 conversations are waiting for a response. (Illustrative example — real numbers come from your analytics endpoints.)',
        },
        { user: "Send a follow-up to every lead that hasn't replied in 48 hours." },
        { user: 'Schedule this WhatsApp campaign for tomorrow at 10 AM.' },
        { user: "Summarize today's customer service conversations." },
        { user: 'Which conversations need human attention?' },
        { user: 'How did yesterday\u2019s campaign perform?' },
      ],
      note: 'Example figures above are illustrative, not Gambot statistics. Real values are computed from your own account\u2019s data.',
    },
    {
      type: 'cards',
      title: 'Capabilities exposed to agents',
      cards: [
        { icon: '\u2709\uFE0F', title: 'Send', text: 'Free-text (inside the 24h window) and approved templates to one recipient — via messages/send-text & send-template.' },
        { icon: '\uD83D\uDCE5', title: 'Receive', text: 'List conversations, read message history, and inbound webhooks for real-time events.' },
        { icon: '\u23F0', title: 'Schedule', text: 'One-time or recurring campaigns that run automatically at the scheduled time.' },
        { icon: '\uD83D\uDCE3', title: 'Campaign', text: 'Broadcasts to tags, lists, CRM segments or spreadsheets, with opt-out & consent handled for you.' },
        { icon: '\uD83D\uDCCA', title: 'Analyze', text: 'Message volume, conversations waiting for reply, leads, cases, tasks and campaign results.' },
        { icon: '\uD83E\uDD16', title: 'Automate', text: 'Keyword auto-replies, menu bots and template-button flows created programmatically.' },
        { icon: '\uD83D\uDEDF', title: 'Customer service', text: 'Conversation status, SLA (who is waiting and for how long), notes and case management.' },
        { icon: '\uD83D\uDE4B', title: 'Human handoff', text: 'Flag conversations that need a person and route by owner, status or category.' },
      ],
    },
    {
      type: 'prose',
      title: 'Your AI agent understands WhatsApp rules',
      paragraphs: [
        'When an agent tries to send a free-form message and the 24-hour customer-service window is closed, Gambot does not just return a generic Meta error. It returns a normalized state: <code>code: CONVERSATION_WINDOW_CLOSED</code> with <code>data: { canSendFreeText: false, canSendTemplate: true }</code>.',
        'Through MCP, that becomes an actionable recommendation — use an approved template to (re)open the conversation — so the agent picks the correct next step automatically. The same pattern applies to missing template variables, ambiguous or missing contacts, invalid phone numbers, rate limits and confirmation-required broadcasts.',
      ],
    },
    {
      type: 'bullets',
      title: 'Two ways to connect',
      bullets: [
        '<strong style="color:#e9edef">MCP (Model Context Protocol)</strong> — the fastest path for AI clients. <a href="' + MCP + '" style="color:#25D366">Add the Gambot MCP server</a> to ChatGPT, Claude, Gemini or Cursor and the agent gets WhatsApp tools instantly.',
        '<strong style="color:#e9edef">REST API</strong> — build your own agent or backend against <a href="' + DEVELOPERS + '" style="color:#25D366">the WhatsApp Business API for developers</a>. Same business logic, machine-readable states and error codes.',
        'Wondering whether to build on Meta\u2019s Cloud API yourself? See <a href="https://gambot.co.il/whatsapp-api-vs-meta-cloud-api/" style="color:#25D366">Gambot vs building on Meta\u2019s Cloud API directly</a> \u2014 same official API, none of the infrastructure to build.',
      ],
    },
    {
      type: 'cta',
      title: 'Build with Gambot',
      text: 'Create a free account, connect WhatsApp, and give your AI agent a real WhatsApp Business API to operate.',
      primary: ctaCreate,
      secondary: { label: 'Read the API docs', href: DOCS, event: 'developer_docs_click' },
    },
  ],
  faq: [
    { q: 'Can an AI agent both send and understand WhatsApp activity?', a: 'Yes. Beyond sending messages and templates, agents can read conversations, query analytics (messages received/sent, conversations waiting for a reply, leads, campaign results) and manage CRM data — so they can reason about the operation, not just push messages.' },
    { q: 'How do agents recover from errors like a closed 24-hour window?', a: 'The API returns a machine-readable code (e.g. CONVERSATION_WINDOW_CLOSED) plus state flags (canSendFreeText, canSendTemplate). The Gambot MCP layer converts this into a recommended next action — for example, send an approved template — so the agent recovers without guessing.' },
    { q: 'Will an agent message the wrong person if a name is ambiguous?', a: 'No. Gambot returns structured results for lookups and does not silently pick a recipient when there is ambiguity; the agent is guided to disambiguate first.' },
    { q: 'Is this the official WhatsApp Business API?', a: 'Yes. Gambot is an official Meta Business Solution Provider, so agents operate on the authorized WhatsApp Business (Cloud) API.' },
    { q: 'Which AI clients are supported?', a: 'Any MCP-compatible client — including ChatGPT, Claude, Gemini and Cursor — plus any custom agent or backend via the REST API.' },
  ],
  he: {
    hero: {
      badge: 'MCP + REST API · WhatsApp Business API \u05e8\u05e9\u05de\u05d9',
      h1: 'WhatsApp Business API \u05dc\u05e1\u05d5\u05db\u05e0\u05d9 AI',
      subhead:
        '\u05ea\u05e0\u05d5 \u05dc\u05e1\u05d5\u05db\u05e0\u05d9 AI <strong style="color:#e9edef">\u05dc\u05e9\u05dc\u05d5\u05d7, \u05dc\u05e7\u05d1\u05dc, \u05dc\u05ea\u05d6\u05de\u05df, \u05dc\u05d1\u05e6\u05e2 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05d6\u05e6\u05d9\u05d4 \u05d5\u05dc\u05e0\u05ea\u05d7</strong> \u05ea\u05e7\u05e9\u05d5\u05e8\u05ea \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05d3\u05e8\u05da <strong style="color:#e9edef">MCP</strong> \u05d0\u05d5 <strong style="color:#e9edef">REST API</strong> \u2014 \u05e2\u05dc \u05d4\u2011WhatsApp Business API \u05d4\u05e8\u05e9\u05de\u05d9 \u05d5\u05d4\u05de\u05d0\u05d5\u05e9\u05e8 \u05e2\u05dc \u05d9\u05d3\u05d9 Meta.',
      primary: { label: '\u05e6\u05d5\u05e8 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd \u2192' },
      secondary: { label: '\u05d4\u05d2\u05d3\u05e8\u05ea WhatsApp MCP' },
      chips: ['ChatGPT', 'Claude', 'Gemini', 'Cursor', '\u05db\u05dc \u05dc\u05e7\u05d5\u05d7 MCP', 'REST'],
    },
    blocks: [
      {
        title: '\u05d9\u05d5\u05ea\u05e8 \u05de\u05e9\u05dc\u05d9\u05d7\u05ea \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea',
        paragraphs: [
          '\u05d9\u05e9 \u05d4\u05d1\u05d3\u05dc \u05d1\u05d9\u05df AI \u05e9\u05d9\u05db\u05d5\u05dc <strong style="color:#e9edef">\u05dc\u05e9\u05dc\u05d5\u05d7</strong> \u05d4\u05d5\u05d3\u05e2\u05ea \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05dc\u05d1\u05d9\u05df AI \u05e9\u05d9\u05db\u05d5\u05dc <strong style="color:#e9edef">\u05dc\u05d4\u05d1\u05d9\u05df \u05d5\u05dc\u05ea\u05e4\u05e2\u05dc</strong> \u05d0\u05ea \u05e2\u05e8\u05d5\u05e5 \u05d4\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05e9\u05dc\u05db\u05dd. \u05d2\u05de\u05d1\u05d5\u05d8 \u05d7\u05d5\u05e9\u05e4\u05ea \u05d0\u05ea \u05db\u05dc \u05ea\u05d4\u05dc\u05d9\u05da \u05d4\u05e2\u05d1\u05d5\u05d3\u05d4 \u05d4\u05e2\u05e1\u05e7\u05d9 \u05e1\u05d1\u05d9\u05d1 \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u2014 \u05de\u05e1\u05e8\u05d9\u05dd, \u05ea\u05d1\u05e0\u05d9\u05d5\u05ea, \u05d0\u05e0\u05e9\u05d9 \u05e7\u05e9\u05e8, \u05e9\u05d9\u05d7\u05d5\u05ea, \u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd, \u05ea\u05d6\u05de\u05d5\u05df, \u05d0\u05d5\u05d8\u05d5\u05de\u05e6\u05d9\u05d5\u05ea \u05d5\u05d0\u05e0\u05dc\u05d9\u05d8\u05d9\u05e7\u05e1 \u2014 \u05dc\u05d0 \u05e8\u05e7 \u05e0\u05e7\u05d5\u05d3\u05ea \u05e9\u05dc\u05d9\u05d7\u05d4 \u05d0\u05d7\u05ea.',
          '\u05e2\u05d5\u05d1\u05d3\u05d5\u05ea \u05d5\u05de\u05e6\u05d1\u05d9\u05dd \u05e2\u05e1\u05e7\u05d9\u05d9\u05dd (\u05d4\u05d0\u05dd \u05d7\u05dc\u05d5\u05df 24 \u05d4\u05e9\u05e2\u05d5\u05ea \u05e4\u05ea\u05d5\u05d7? \u05d4\u05d0\u05dd \u05e0\u05d3\u05e8\u05e9\u05ea \u05ea\u05d1\u05e0\u05d9\u05ea? \u05d0\u05d9\u05d6\u05d4 \u05d0\u05d9\u05e9 \u05e7\u05e9\u05e8 \u05d4\u05ea\u05d0\u05d9\u05dd?) \u05d7\u05d5\u05d6\u05e8\u05d9\u05dd \u05de\u05d4\u2011API \u05db\u05e9\u05d3\u05d5\u05ea <strong style="color:#e9edef">\u05de\u05d5\u05d1\u05e0\u05d9\u05dd \u05d5\u05e7\u05e8\u05d9\u05d0\u05d9\u05dd \u05dc\u05de\u05db\u05d5\u05e0\u05d4</strong>. <a href="' + MCP + '" style="color:#25D366">\u05e9\u05e8\u05ea \u05d4\u2011MCP \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8</a> \u05d4\u05d5\u05e4\u05da \u05d0\u05ea \u05d4\u05de\u05e6\u05d1\u05d9\u05dd \u05d4\u05dc\u05dc\u05d5 \u05dc\u05d4\u05e0\u05d7\u05d9\u05d4 \u05dc\u05e6\u05e2\u05d3 \u05d4\u05d1\u05d0, \u05db\u05da \u05e9\u05d4\u05e1\u05d5\u05db\u05df \u05de\u05ea\u05d0\u05d5\u05e9\u05e9 \u05d1\u05d7\u05d5\u05db\u05de\u05d4 \u05d1\u05de\u05e7\u05d5\u05dd \u05dc\u05d4\u05d9\u05db\u05e9\u05dc \u05e2\u05dc \u05e9\u05d2\u05d9\u05d0\u05d4 \u05d2\u05d5\u05dc\u05de\u05d9\u05ea.',
        ],
      },
      {
        title: '\u05ea\u05d4\u05dc\u05d9\u05db\u05d9 \u05e2\u05d1\u05d5\u05d3\u05d4 \u05d0\u05de\u05d9\u05ea\u05d9\u05d9\u05dd \u05dc\u05e1\u05d5\u05db\u05df',
        intro: '\u05d1\u05e7\u05e9\u05d5 \u05d1\u05e9\u05e4\u05d4 \u05d8\u05d1\u05e2\u05d9\u05ea; \u05d4\u05e1\u05d5\u05db\u05df \u05d1\u05d5\u05d7\u05e8 \u05d0\u05ea \u05ea\u05d4\u05dc\u05d9\u05da \u05d4\u05e2\u05d1\u05d5\u05d3\u05d4 \u05d4\u05d1\u05d8\u05d5\u05d7 \u05d5\u05d4\u05de\u05ea\u05d0\u05d9\u05dd \u05d1\u05d9\u05d5\u05ea\u05e8 \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8.',
        prompts: [
          {
            user: '\u05db\u05de\u05d4 \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05e7\u05d9\u05d1\u05dc\u05e0\u05d5 \u05d4\u05d9\u05d5\u05dd?',
            agent: '\u05d4\u05ea\u05e7\u05d1\u05dc\u05d5 \u05d4\u05d9\u05d5\u05dd 147 \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea. 32 \u05d4\u05d9\u05d5 \u05dc\u05d9\u05d3\u05d9\u05dd \u05d7\u05d3\u05e9\u05d9\u05dd. 11 \u05e9\u05d9\u05d7\u05d5\u05ea \u05de\u05de\u05ea\u05d9\u05e0\u05d5\u05ea \u05dc\u05de\u05e2\u05e0\u05d4. (\u05d3\u05d5\u05d2\u05de\u05d4 \u05dc\u05d4\u05de\u05d7\u05e9\u05d4 \u2014 \u05de\u05e1\u05e4\u05e8\u05d9\u05dd \u05d0\u05de\u05d9\u05ea\u05d9\u05d9\u05dd \u05de\u05d2\u05d9\u05e2\u05d9\u05dd \u05de\u05e0\u05e7\u05d5\u05d3\u05d5\u05ea \u05d4\u05e7\u05e6\u05d4 \u05e9\u05dc \u05d4\u05d0\u05e0\u05dc\u05d9\u05d8\u05d9\u05e7\u05e1 \u05e9\u05dc\u05db\u05dd.)',
          },
          { user: '\u05e9\u05dc\u05d7 \u05de\u05e2\u05e7\u05d1 \u05dc\u05db\u05dc \u05dc\u05d9\u05d3 \u05e9\u05dc\u05d0 \u05d4\u05d2\u05d9\u05d1 \u05db\u05d1\u05e8 48 \u05e9\u05e2\u05d5\u05ea.' },
          { user: '\u05ea\u05d6\u05de\u05df \u05d0\u05ea \u05e7\u05de\u05e4\u05d9\u05d9\u05df \u05d4\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05d4\u05d6\u05d4 \u05dc\u05de\u05d7\u05e8 \u05d1\u201110:00.' },
          { user: '\u05e1\u05db\u05dd \u05d0\u05ea \u05e9\u05d9\u05d7\u05d5\u05ea \u05e9\u05d9\u05e8\u05d5\u05ea \u05d4\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea \u05e9\u05dc \u05d4\u05d9\u05d5\u05dd.' },
          { user: '\u05d0\u05d9\u05dc\u05d5 \u05e9\u05d9\u05d7\u05d5\u05ea \u05d3\u05d5\u05e8\u05e9\u05d5\u05ea \u05d4\u05ea\u05e2\u05e8\u05d1\u05d5\u05ea \u05d0\u05e0\u05d5\u05e9\u05d9\u05ea?' },
          { user: '\u05d0\u05d9\u05da \u05d4\u05e6\u05dc\u05d9\u05d7 \u05d4\u05e7\u05de\u05e4\u05d9\u05d9\u05df \u05e9\u05dc \u05d0\u05ea\u05de\u05d5\u05dc?' },
        ],
        note: '\u05d4\u05de\u05e1\u05e4\u05e8\u05d9\u05dd \u05dc\u05de\u05e2\u05dc\u05d4 \u05d4\u05dd \u05dc\u05d4\u05de\u05d7\u05e9\u05d4 \u05d1\u05dc\u05d1\u05d3, \u05dc\u05d0 \u05e0\u05ea\u05d5\u05e0\u05d9 \u05d2\u05de\u05d1\u05d5\u05d8. \u05e2\u05e8\u05db\u05d9\u05dd \u05d0\u05de\u05d9\u05ea\u05d9\u05d9\u05dd \u05de\u05d7\u05d5\u05e9\u05d1\u05d9\u05dd \u05de\u05e0\u05ea\u05d5\u05e0\u05d9 \u05d4\u05d7\u05e9\u05d1\u05d5\u05df \u05e9\u05dc\u05db\u05dd.',
      },
      {
        title: '\u05d9\u05db\u05d5\u05dc\u05d5\u05ea \u05d4\u05e0\u05d7\u05e9\u05e4\u05d5\u05ea \u05dc\u05e1\u05d5\u05db\u05e0\u05d9\u05dd',
        cards: [
          { icon: '\u2709\uFE0F', title: '\u05e9\u05dc\u05d9\u05d7\u05d4', text: '\u05d8\u05e7\u05e1\u05d8 \u05d7\u05d5\u05e4\u05e9\u05d9 (\u05d1\u05ea\u05d5\u05da \u05d7\u05dc\u05d5\u05df 24 \u05d4\u05e9\u05e2\u05d5\u05ea) \u05d5\u05ea\u05d1\u05e0\u05d9\u05d5\u05ea \u05de\u05d0\u05d5\u05e9\u05e8\u05d5\u05ea \u05dc\u05e0\u05de\u05e2\u05df \u05d0\u05d7\u05d3 \u2014 \u05d3\u05e8\u05da messages/send-text \u05d5\u2011send-template.' },
          { icon: '\uD83D\uDCE5', title: '\u05e7\u05d1\u05dc\u05d4', text: '\u05d4\u05e6\u05d2\u05ea \u05e9\u05d9\u05d7\u05d5\u05ea, \u05e7\u05e8\u05d9\u05d0\u05ea \u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d9\u05ea \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea, \u05d5\u2011webhooks \u05e0\u05db\u05e0\u05e1\u05d9\u05dd \u05dc\u05d0\u05d9\u05e8\u05d5\u05e2\u05d9\u05dd \u05d1\u05d6\u05de\u05df \u05d0\u05de\u05ea.' },
          { icon: '\u23F0', title: '\u05ea\u05d6\u05de\u05d5\u05df', text: '\u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd \u05d7\u05d3\u2011\u05e4\u05e2\u05de\u05d9\u05d9\u05dd \u05d0\u05d5 \u05d7\u05d5\u05d6\u05e8\u05d9\u05dd \u05e9\u05e8\u05e6\u05d9\u05dd \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea \u05d1\u05d6\u05de\u05df \u05d4\u05de\u05ea\u05d5\u05d6\u05de\u05df.' },
          { icon: '\uD83D\uDCE3', title: '\u05e7\u05de\u05e4\u05d9\u05d9\u05df', text: '\u05d3\u05d9\u05d5\u05d5\u05e8\u05d9\u05dd \u05dc\u05ea\u05d2\u05d9\u05d5\u05ea, \u05e8\u05e9\u05d9\u05de\u05d5\u05ea, \u05e4\u05dc\u05d7\u05d9 CRM \u05d0\u05d5 \u05d2\u05d9\u05dc\u05d9\u05d5\u05e0\u05d5\u05ea, \u05e2\u05dd \u05d8\u05d9\u05e4\u05d5\u05dc \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9 \u05d1\u05d4\u05e1\u05e8\u05d4 \u05d5\u05d4\u05e1\u05db\u05de\u05d4.' },
          { icon: '\uD83D\uDCCA', title: '\u05e0\u05d9\u05ea\u05d5\u05d7', text: '\u05e0\u05e4\u05d7 \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea, \u05e9\u05d9\u05d7\u05d5\u05ea \u05d4\u05de\u05de\u05ea\u05d9\u05e0\u05d5\u05ea \u05dc\u05de\u05e2\u05e0\u05d4, \u05dc\u05d9\u05d3\u05d9\u05dd, \u05e4\u05e0\u05d9\u05d5\u05ea, \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05d5\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd.' },
          { icon: '\uD83E\uDD16', title: '\u05d0\u05d5\u05d8\u05d5\u05de\u05e6\u05d9\u05d4', text: '\u05de\u05e2\u05e0\u05d9\u05dd \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05d9\u05dd \u05dc\u05e4\u05d9 \u05de\u05d9\u05dc\u05ea \u05de\u05e4\u05ea\u05d7, \u05d1\u05d5\u05d8\u05d9 \u05ea\u05e4\u05e8\u05d9\u05d8 \u05d5\u05ea\u05d4\u05dc\u05d9\u05db\u05d9 \u05db\u05e4\u05ea\u05d5\u05e8\u05d9 \u05ea\u05d1\u05e0\u05d9\u05ea \u05e9\u05e0\u05d5\u05e6\u05e8\u05d9\u05dd \u05ea\u05db\u05e0\u05d5\u05ea\u05d9\u05ea.' },
          { icon: '\uD83D\uDEDF', title: '\u05e9\u05d9\u05e8\u05d5\u05ea \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea', text: '\u05e1\u05d8\u05d8\u05d5\u05e1 \u05e9\u05d9\u05d7\u05d4, SLA (\u05de\u05d9 \u05de\u05de\u05ea\u05d9\u05df \u05d5\u05db\u05de\u05d4 \u05d6\u05de\u05df), \u05d4\u05e2\u05e8\u05d5\u05ea \u05d5\u05e0\u05d9\u05d4\u05d5\u05dc \u05e4\u05e0\u05d9\u05d5\u05ea.' },
          { icon: '\uD83D\uDE4B', title: '\u05d4\u05e2\u05d1\u05e8\u05d4 \u05dc\u05d0\u05d3\u05dd', text: '\u05e1\u05d9\u05de\u05d5\u05df \u05e9\u05d9\u05d7\u05d5\u05ea \u05e9\u05d3\u05d5\u05e8\u05e9\u05d5\u05ea \u05d0\u05d3\u05dd \u05d5\u05e0\u05d9\u05ea\u05d5\u05d1 \u05dc\u05e4\u05d9 \u05d1\u05e2\u05dc\u05d9\u05dd, \u05e1\u05d8\u05d8\u05d5\u05e1 \u05d0\u05d5 \u05e7\u05d8\u05d2\u05d5\u05e8\u05d9\u05d4.' },
        ],
      },
      {
        title: '\u05d4\u05e1\u05d5\u05db\u05df \u05e9\u05dc\u05db\u05dd \u05de\u05d1\u05d9\u05df \u05d0\u05ea \u05db\u05dc\u05dc\u05d9 \u05d4\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4',
        paragraphs: [
          '\u05db\u05e9\u05e1\u05d5\u05db\u05df \u05de\u05e0\u05e1\u05d4 \u05dc\u05e9\u05dc\u05d5\u05d7 \u05d4\u05d5\u05d3\u05e2\u05d4 \u05d7\u05d5\u05e4\u05e9\u05d9\u05ea \u05d5\u05d7\u05dc\u05d5\u05df 24 \u05d4\u05e9\u05e2\u05d5\u05ea \u05e9\u05dc \u05e9\u05d9\u05e8\u05d5\u05ea \u05d4\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea \u05e1\u05d2\u05d5\u05e8, \u05d2\u05de\u05d1\u05d5\u05d8 \u05dc\u05d0 \u05de\u05d7\u05d6\u05d9\u05e8\u05d4 \u05e8\u05e7 \u05e9\u05d2\u05d9\u05d0\u05ea Meta \u05d2\u05e0\u05e8\u05d9\u05ea. \u05d4\u05d9\u05d0 \u05de\u05d7\u05d6\u05d9\u05e8\u05d4 \u05de\u05e6\u05d1 \u05de\u05e0\u05d5\u05e8\u05de\u05dc: <code>code: CONVERSATION_WINDOW_CLOSED</code> \u05e2\u05dd <code>data: { canSendFreeText: false, canSendTemplate: true }</code>.',
          '\u05d3\u05e8\u05da MCP \u05d6\u05d4 \u05d4\u05d5\u05e4\u05da \u05dc\u05d4\u05de\u05dc\u05e6\u05d4 \u05d1\u05e8\u05d5\u05e8\u05d4 \u2014 \u05d4\u05e9\u05ea\u05de\u05e9\u05d5 \u05d1\u05ea\u05d1\u05e0\u05d9\u05ea \u05de\u05d0\u05d5\u05e9\u05e8\u05ea \u05db\u05d3\u05d9 \u05dc\u05e4\u05ea\u05d5\u05d7 \u05de\u05d7\u05d3\u05e9 \u05d0\u05ea \u05d4\u05e9\u05d9\u05d7\u05d4 \u2014 \u05db\u05da \u05e9\u05d4\u05e1\u05d5\u05db\u05df \u05d1\u05d5\u05d7\u05e8 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea \u05d0\u05ea \u05d4\u05e6\u05e2\u05d3 \u05d4\u05e0\u05db\u05d5\u05df. \u05d0\u05d5\u05ea\u05d4 \u05ea\u05d1\u05e0\u05d9\u05ea \u05d7\u05dc\u05d4 \u05e2\u05dc \u05de\u05e9\u05ea\u05e0\u05d9 \u05ea\u05d1\u05e0\u05d9\u05ea \u05d7\u05e1\u05e8\u05d9\u05dd, \u05d0\u05e0\u05e9\u05d9 \u05e7\u05e9\u05e8 \u05dc\u05d0 \u05d7\u05d3\u2011\u05de\u05e9\u05de\u05e2\u05d9\u05d9\u05dd \u05d0\u05d5 \u05d7\u05e1\u05e8\u05d9\u05dd, \u05de\u05e1\u05e4\u05e8\u05d9\u05dd \u05dc\u05d0 \u05ea\u05e7\u05d9\u05e0\u05d9\u05dd, \u05de\u05d2\u05d1\u05dc\u05d5\u05ea \u05e7\u05e6\u05d1 \u05d5\u05d3\u05d9\u05d5\u05d5\u05e8\u05d9\u05dd \u05d4\u05d3\u05d5\u05e8\u05e9\u05d9\u05dd \u05d0\u05d9\u05e9\u05d5\u05e8.',
        ],
      },
      {
        title: '\u05e9\u05ea\u05d9 \u05d3\u05e8\u05db\u05d9\u05dd \u05dc\u05d4\u05ea\u05d7\u05d1\u05e8',
        bullets: [
          '<strong style="color:#e9edef">MCP (Model Context Protocol)</strong> \u2014 \u05d4\u05d3\u05e8\u05da \u05d4\u05de\u05d4\u05d9\u05e8\u05d4 \u05dc\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea AI. <a href="' + MCP + '" style="color:#25D366">\u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05d0\u05ea \u05e9\u05e8\u05ea \u05d4\u2011MCP \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8</a> \u05dc\u2011ChatGPT, Claude, Gemini \u05d0\u05d5 Cursor \u05d5\u05d4\u05e1\u05d5\u05db\u05df \u05de\u05e7\u05d1\u05dc \u05db\u05dc\u05d9 \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05de\u05d9\u05d3.',
          '<strong style="color:#e9edef">REST API</strong> \u2014 \u05d1\u05e0\u05d5 \u05e1\u05d5\u05db\u05df \u05d0\u05d5 \u05e9\u05e8\u05ea \u05de\u05e9\u05dc\u05db\u05dd \u05de\u05d5\u05dc <a href="' + DEVELOPERS + '" style="color:#25D366">\u05d4\u2011WhatsApp Business API \u05dc\u05de\u05e4\u05ea\u05d7\u05d9\u05dd</a>. \u05d0\u05d5\u05ea\u05d4 \u05dc\u05d5\u05d2\u05d9\u05e7\u05d4 \u05e2\u05e1\u05e7\u05d9\u05ea, \u05de\u05e6\u05d1\u05d9\u05dd \u05e7\u05e8\u05d9\u05d0\u05d9\u05dd \u05dc\u05de\u05db\u05d5\u05e0\u05d4 \u05d5\u05e7\u05d5\u05d3\u05d9 \u05e9\u05d2\u05d9\u05d0\u05d4.',
          '\u05de\u05ea\u05dc\u05d1\u05d8\u05d9\u05dd \u05d0\u05dd \u05dc\u05d1\u05e0\u05d5\u05ea \u05e2\u05dc Cloud API \u05e9\u05dc Meta \u05d1\u05e2\u05e6\u05de\u05db\u05dd? \u05e8\u05d0\u05d5 <a href="https://gambot.co.il/whatsapp-api-vs-meta-cloud-api/" style="color:#25D366">\u05d2\u05de\u05d1\u05d5\u05d8 \u05de\u05d5\u05dc \u05d1\u05e0\u05d9\u05d9\u05d4 \u05d9\u05e9\u05d9\u05e8\u05d4 \u05e2\u05dc Cloud API \u05e9\u05dc Meta</a> \u2014 \u05d0\u05d5\u05ea\u05d5 API \u05e8\u05e9\u05de\u05d9, \u05d1\u05dc\u05d9 \u05db\u05dc \u05d4\u05ea\u05e9\u05ea\u05d9\u05ea \u05dc\u05d1\u05e0\u05d5\u05ea.',
        ],
      },
      {
        title: '\u05d1\u05e0\u05d5 \u05e2\u05dd \u05d2\u05de\u05d1\u05d5\u05d8',
        text: '\u05e6\u05e8\u05d5 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd, \u05d7\u05d1\u05e8\u05d5 \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4, \u05d5\u05ea\u05e0\u05d5 \u05dc\u05e1\u05d5\u05db\u05df \u05d4\u2011AI \u05e9\u05dc\u05db\u05dd WhatsApp Business API \u05d0\u05de\u05d9\u05ea\u05d9 \u05dc\u05ea\u05e4\u05e2\u05dc.',
        primary: { label: '\u05e6\u05d5\u05e8 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd \u2192' },
        secondary: { label: '\u05e7\u05e8\u05d0 \u05d0\u05ea \u05ea\u05d9\u05e2\u05d5\u05d3 \u05d4\u2011API' },
      },
    ],
    faq: [
      { q: '\u05d4\u05d0\u05dd \u05e1\u05d5\u05db\u05df AI \u05d9\u05db\u05d5\u05dc \u05d2\u05dd \u05dc\u05e9\u05dc\u05d5\u05d7 \u05d5\u05d2\u05dd \u05dc\u05d4\u05d1\u05d9\u05df \u05e4\u05e2\u05d9\u05dc\u05d5\u05ea \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4?', a: '\u05db\u05df. \u05de\u05e2\u05d1\u05e8 \u05dc\u05e9\u05dc\u05d9\u05d7\u05ea \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea \u05d5\u05ea\u05d1\u05e0\u05d9\u05d5\u05ea, \u05e1\u05d5\u05db\u05e0\u05d9\u05dd \u05d9\u05db\u05d5\u05dc\u05d9\u05dd \u05dc\u05e7\u05e8\u05d5\u05d0 \u05e9\u05d9\u05d7\u05d5\u05ea, \u05dc\u05ea\u05e9\u05d0\u05dc \u05d0\u05e0\u05dc\u05d9\u05d8\u05d9\u05e7\u05e1 (\u05d4\u05d5\u05d3\u05e2\u05d5\u05ea \u05e9\u05d4\u05ea\u05e7\u05d1\u05dc\u05d5/\u05e0\u05e9\u05dc\u05d7\u05d5, \u05e9\u05d9\u05d7\u05d5\u05ea \u05d4\u05de\u05de\u05ea\u05d9\u05e0\u05d5\u05ea \u05dc\u05de\u05e2\u05e0\u05d4, \u05dc\u05d9\u05d3\u05d9\u05dd, \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd) \u05d5\u05dc\u05e0\u05d4\u05dc \u05e0\u05ea\u05d5\u05e0\u05d9 CRM \u2014 \u05db\u05da \u05e9\u05d4\u05dd \u05d9\u05db\u05d5\u05dc\u05d9\u05dd \u05dc\u05d4\u05e1\u05d9\u05e7 \u05e2\u05dc \u05d4\u05ea\u05e4\u05e2\u05d5\u05dc, \u05dc\u05d0 \u05e8\u05e7 \u05dc\u05d3\u05d7\u05d5\u05e3 \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea.' },
      { q: '\u05d0\u05d9\u05da \u05e1\u05d5\u05db\u05e0\u05d9\u05dd \u05de\u05ea\u05d0\u05d5\u05e9\u05e9\u05d9\u05dd \u05de\u05e9\u05d2\u05d9\u05d0\u05d5\u05ea \u05db\u05de\u05d5 \u05d7\u05dc\u05d5\u05df 24 \u05e9\u05e2\u05d5\u05ea \u05e1\u05d2\u05d5\u05e8?', a: '\u05d4\u2011API \u05de\u05d7\u05d6\u05d9\u05e8 code \u05e7\u05e8\u05d9\u05d0 \u05dc\u05de\u05db\u05d5\u05e0\u05d4 (\u05dc\u05de\u05e9\u05dc CONVERSATION_WINDOW_CLOSED) \u05d1\u05ea\u05d5\u05e1\u05e4\u05ea \u05d3\u05d2\u05dc\u05d9 \u05de\u05e6\u05d1 (canSendFreeText, canSendTemplate). \u05e9\u05db\u05d1\u05ea \u05d4\u2011MCP \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8 \u05de\u05de\u05d9\u05e8\u05d4 \u05d0\u05ea \u05d6\u05d4 \u05dc\u05e6\u05e2\u05d3 \u05d4\u05d1\u05d0 \u05d4\u05de\u05d5\u05de\u05dc\u05e5 \u2014 \u05dc\u05de\u05e9\u05dc \u05e9\u05dc\u05d9\u05d7\u05ea \u05ea\u05d1\u05e0\u05d9\u05ea \u05de\u05d0\u05d5\u05e9\u05e8\u05ea \u2014 \u05db\u05da \u05e9\u05d4\u05e1\u05d5\u05db\u05df \u05de\u05ea\u05d0\u05d5\u05e9\u05e9 \u05d1\u05dc\u05d9 \u05dc\u05e0\u05d7\u05e9.' },
      { q: '\u05d4\u05d0\u05dd \u05e1\u05d5\u05db\u05df \u05d9\u05e9\u05dc\u05d7 \u05dc\u05d0\u05d3\u05dd \u05d4\u05dc\u05d0 \u05e0\u05db\u05d5\u05df \u05d0\u05dd \u05d4\u05e9\u05dd \u05dc\u05d0 \u05d7\u05d3\u2011\u05de\u05e9\u05de\u05e2\u05d9?', a: '\u05dc\u05d0. \u05d2\u05de\u05d1\u05d5\u05d8 \u05de\u05d7\u05d6\u05d9\u05e8\u05d4 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05d5\u05d1\u05e0\u05d5\u05ea \u05dc\u05d7\u05d9\u05e4\u05d5\u05e9\u05d9\u05dd \u05d5\u05d0\u05d9\u05e0\u05d4 \u05d1\u05d5\u05d7\u05e8\u05ea \u05e0\u05de\u05e2\u05df \u05d1\u05e9\u05e7\u05d8 \u05db\u05e9\u05d9\u05e9 \u05d0\u05d9\u2011\u05d1\u05d4\u05d9\u05e8\u05d5\u05ea; \u05d4\u05e1\u05d5\u05db\u05df \u05de\u05d5\u05e0\u05d7\u05d4 \u05dc\u05d1\u05e8\u05e8 \u05ea\u05d7\u05d9\u05dc\u05d4.' },
      { q: '\u05d4\u05d0\u05dd \u05d6\u05d4 \u05d4\u2011WhatsApp Business API \u05d4\u05e8\u05e9\u05de\u05d9?', a: '\u05db\u05df. \u05d2\u05de\u05d1\u05d5\u05d8 \u05d4\u05d9\u05d0 \u05e1\u05e4\u05e7\u05d9\u05ea \u05e4\u05ea\u05e8\u05d5\u05e0\u05d5\u05ea \u05e2\u05e1\u05e7\u05d9\u05d9\u05dd \u05e8\u05e9\u05de\u05d9\u05ea \u05e9\u05dc Meta, \u05db\u05da \u05e9\u05e1\u05d5\u05db\u05e0\u05d9\u05dd \u05e4\u05d5\u05e2\u05dc\u05d9\u05dd \u05e2\u05dc \u05d4\u2011WhatsApp Business (Cloud) API \u05d4\u05de\u05d5\u05e8\u05e9\u05d4.' },
      { q: '\u05d0\u05d9\u05dc\u05d5 \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea AI \u05e0\u05ea\u05de\u05db\u05d9\u05dd?', a: '\u05db\u05dc \u05dc\u05e7\u05d5\u05d7 \u05ea\u05d5\u05d0\u05dd MCP \u2014 \u05db\u05d5\u05dc\u05dc ChatGPT, Claude, Gemini \u05d5\u2011Cursor \u2014 \u05d5\u05db\u05df \u05db\u05dc \u05e1\u05d5\u05db\u05df \u05d0\u05d5 \u05e9\u05e8\u05ea \u05de\u05d5\u05ea\u05d0\u05dd \u05d3\u05e8\u05da \u05d4\u2011REST API.' },
    ],
  },
};

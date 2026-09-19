import {
  SIGNUP, DOCS, MCP, AI_AGENTS, HOME, CRUMB_MCP, ctaCreate,
} from './_common';

export const data = {
  pageKey: 'whatsapp-mcp-vs-whatsapp-web',
  schemaType: 'article',
  seo: {
    title: 'WhatsApp MCP: Business API vs WhatsApp Web Automation | Gambot',
    description:
      'A factual comparison of two ways to let software and AI agents use WhatsApp: the official WhatsApp Business API (via MCP) versus WhatsApp Web automation. Authentication, sessions, webhooks, templates, scalability and production use.',
    keywords:
      'WhatsApp MCP vs WhatsApp Web, WhatsApp Business API vs WhatsApp Web, WhatsApp Web automation, official WhatsApp API, WhatsApp MCP server, WhatsApp automation architecture',
    canonical: 'https://gambot.co.il/whatsapp-mcp-vs-whatsapp-web/',
    ogTitle: 'WhatsApp MCP: Business API vs WhatsApp Web Automation',
    ogDescription: 'Authentication, sessions, webhooks, templates, scalability and production use \u2014 compared factually.',
  },
  breadcrumbs: [HOME, CRUMB_MCP, { name: 'MCP vs WhatsApp Web', item: 'https://gambot.co.il/whatsapp-mcp-vs-whatsapp-web/' }],
  hero: {
    badge: 'Explainer · Architecture',
    h1: 'WhatsApp MCP: Business API vs WhatsApp Web Automation',
    subhead:
      'Two very different ways to let software and AI agents use WhatsApp. This is a <strong style="color:#e9edef">factual, architectural</strong> comparison \u2014 not a takedown \u2014 so you can choose what fits production.',
    primary: ctaCreate,
    secondary: { label: 'WhatsApp MCP overview', href: MCP, event: 'mcp_cta_click' },
    chips: ['Business API', 'Web automation', 'MCP', 'Production'],
  },
  blocks: [
    {
      type: 'prose',
      title: 'The two approaches',
      paragraphs: [
        '<strong style="color:#e9edef">Official WhatsApp Business API (Cloud API)</strong> is Meta\u2019s sanctioned interface for businesses to send and receive WhatsApp at scale. Gambot builds on it and exposes it to AI agents through the <a href="' + MCP + '" style="color:#25D366">Model Context Protocol (MCP)</a> and a REST API.',
        '<strong style="color:#e9edef">WhatsApp Web automation</strong> drives the consumer WhatsApp Web/app surface programmatically (e.g. by scripting a browser session). It can be quick to start but was not designed as a business messaging backend.',
      ],
    },
    {
      type: 'table',
      title: 'Side-by-side',
      columns: ['Dimension', 'Official Business API (Gambot + MCP)', 'WhatsApp Web automation'],
      rows: [
        ['Authentication', 'Business tokens on the official Cloud API; managed by Gambot', 'Tied to a logged-in phone/session'],
        ['Sessions', 'Server-side, stable, no phone tethering', 'Depends on an active linked session'],
        ['Webhooks', 'First-class inbound event delivery', 'Typically polling/scraping the web client'],
        ['Templates', 'Approved templates initiate conversations outside the 24h window', 'No template system; free-text only'],
        ['Business messaging', 'Designed for it (24h window, opt-out, consent)', 'Consumer surface, not a business backend'],
        ['Automation', 'Auto-replies, menu bots, campaigns via API/MCP', 'Custom scripting you build and maintain'],
        ['Scalability', 'Built for volume with Meta messaging tiers', 'Constrained by a single client session'],
        ['Campaigns', 'Native campaigns with results & limits', 'Roll-your-own, no native limits handling'],
        ['AI agents', 'Structured states + MCP next-action guidance', 'Raw UI automation, brittle for agents'],
        ['Production use', 'Supported, official, auditable', 'Fragile; risks around unofficial access'],
      ],
    },
    {
      type: 'prose',
      title: 'Why it matters for AI agents',
      paragraphs: [
        'AI agents need predictable, machine-readable signals. On the official API, Gambot returns states like <code>CONVERSATION_WINDOW_CLOSED</code> with flags (<code>canSendTemplate: true</code>), and the MCP layer turns those into a recommended next action. Agents recover intelligently instead of failing on brittle UI automation.',
        'For anything customer-facing or at scale \u2014 campaigns, reminders, notifications, support \u2014 the official Business API is the production-grade path. See <a href="' + AI_AGENTS + '" style="color:#25D366">WhatsApp API for AI agents</a> for how agents operate it safely.',
        'Already decided on the official API? The next question is build-vs-buy: <a href="https://gambot.co.il/whatsapp-api-vs-meta-cloud-api/" style="color:#25D366">Gambot vs building on Meta\u2019s Cloud API directly</a> compares running on Gambot\u2019s ready infrastructure against wiring the raw Meta Cloud API yourself.',
      ],
    },
    {
      type: 'cta',
      title: 'Use the official WhatsApp Business API',
      text: 'Create a free account, connect WhatsApp, and give your software or AI agent a production-grade WhatsApp API.',
      primary: ctaCreate,
      secondary: { label: 'Read the API docs', href: DOCS, event: 'developer_docs_click' },
    },
  ],
  faq: [
    { q: 'What is the difference between WhatsApp MCP and WhatsApp Web automation?', a: 'WhatsApp MCP (via Gambot) runs on the official WhatsApp Business/Cloud API with business tokens, webhooks, approved templates, campaigns and messaging tiers. WhatsApp Web automation scripts the consumer web client and depends on a linked session \u2014 it lacks templates, native limits and first-class webhooks, and is fragile in production.' },
    { q: 'Can I message customers outside the 24-hour window?', a: 'On the official Business API you use approved templates to initiate conversations outside the 24h window. Free-text is only allowed inside the window.' },
    { q: 'Is WhatsApp Web automation allowed for businesses?', a: 'It uses the consumer surface in ways it was not designed for and can be fragile and risky. For business messaging at scale, the official WhatsApp Business API is the sanctioned, production-grade option.' },
    { q: 'Why is the official API better for AI agents?', a: 'It returns structured, machine-readable states and, via MCP, recommended next actions \u2014 so agents can reason and recover, rather than driving brittle UI automation.' },
  ],
};

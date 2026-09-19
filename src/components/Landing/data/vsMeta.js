import {
  SIGNUP, DOCS, MCP, AI_AGENTS, DEVELOPERS, HOME, CRUMB_DEV, ctaCreate,
} from './_common';

export const data = {
  pageKey: 'whatsapp-api-vs-meta-cloud-api',
  schemaType: 'article',
  seo: {
    title: 'WhatsApp Business API: Gambot vs Building on Meta Cloud API Directly | Gambot',
    description:
      'Should you build on Meta\u2019s WhatsApp Cloud API yourself, or use a ready platform? A factual comparison of DIY Meta Cloud API vs Gambot\u2019s managed WhatsApp Business API + MCP: Business verification, number registration, templates, webhooks, media, messaging tiers, compliance, campaigns and AI-agent support.',
    keywords:
      'WhatsApp Cloud API vs BSP, build on WhatsApp Cloud API, Meta WhatsApp API directly, WhatsApp Business Solution Provider, WhatsApp API infrastructure, Gambot vs Meta Cloud API, managed WhatsApp Business API, WhatsApp API for AI agents vs Meta',
    canonical: 'https://gambot.co.il/whatsapp-api-vs-meta-cloud-api/',
    ogTitle: 'Gambot vs Building on Meta\u2019s WhatsApp Cloud API Directly',
    ogDescription: 'A factual comparison: what you build and maintain on the raw Meta Cloud API vs what a ready WhatsApp Business API platform (with MCP for AI agents) gives you out of the box.',
  },
  breadcrumbs: [HOME, CRUMB_DEV, { name: 'Gambot vs Meta Cloud API', item: 'https://gambot.co.il/whatsapp-api-vs-meta-cloud-api/' }],
  hero: {
    badge: 'Explainer · Build vs Buy',
    h1: 'WhatsApp Business API: Gambot vs Building on Meta\u2019s Cloud API Directly',
    subhead:
      'Both run on the <strong style="color:#e9edef">same official WhatsApp Business (Cloud) API</strong> from Meta. The question is how much of the surrounding infrastructure <strong style="color:#e9edef">you build and maintain</strong> versus get ready-made. This is a factual build-vs-buy comparison.',
    primary: ctaCreate,
    secondary: { label: 'WhatsApp API for AI agents', href: AI_AGENTS, event: 'mcp_cta_click' },
    chips: ['Meta Cloud API', 'BSP platform', 'MCP', 'AI agents', 'Production'],
  },
  blocks: [
    {
      type: 'prose',
      title: 'Same Meta API underneath — very different amount of work',
      paragraphs: [
        'Meta\u2019s <strong style="color:#e9edef">WhatsApp Cloud API</strong> is the official, low-level HTTP API for sending and receiving WhatsApp. It is powerful, but it is a <em>building block</em>, not a product: you still have to handle Business verification, phone-number registration, template lifecycle, webhook infrastructure, media handling, messaging-tier limits, retries, opt-out/consent and error handling yourself.',
        'Gambot is an <strong style="color:#e9edef">official Meta Business Solution Provider (BSP)</strong> that runs on the exact same Cloud API and gives you all of that infrastructure ready-made \u2014 plus campaigns, CRM, bots, analytics and, crucially for AI, an <a href="' + MCP + '" style="color:#25D366">MCP server</a> and a <a href="' + DEVELOPERS + '" style="color:#25D366">clean REST API</a> with structured, machine-readable states. You keep the official API; you skip months of plumbing.',
      ],
    },
    {
      type: 'table',
      title: 'DIY Meta Cloud API vs Gambot (managed)',
      columns: ['What you need', 'Build on Meta Cloud API yourself', 'Gambot (ready infrastructure)'],
      rows: [
        ['Get started', 'Create a Meta app, pass App Review, set up Business Manager & WABA', 'Sign up and connect WhatsApp \u2014 guided onboarding, live in ~24\u201348h'],
        ['Business verification', 'You handle Meta Business verification yourself', 'Guided by Gambot, including the green-badge process'],
        ['Phone number', 'Register/migrate & manage the number via API calls', 'Connect or migrate a number from the dashboard (Coexistence supported)'],
        ['Message templates', 'Create & submit via API, track approval, version them', 'Visual template editor with approval status built in'],
        ['Webhooks', 'Host a public HTTPS endpoint, verify, dedupe, retry, scale it', 'Managed inbound events; optional forwarding to your endpoint'],
        ['Media', 'Upload/download & host media, manage ids and expiry', 'Handled for you in messages, templates and campaigns'],
        ['24h window logic', 'Track each conversation\u2019s window; decide free-text vs template', 'Enforced for you; API returns CONVERSATION_WINDOW_CLOSED + canSendTemplate'],
        ['Messaging tiers & limits', 'Track tiers, throttle, handle 131xxx errors yourself', 'Limits handled; campaigns respect tiers, structured limit errors'],
        ['Broadcasts / campaigns', 'Build your own queueing, segmentation, opt-out, reporting', 'Native campaigns: audiences, scheduling, consent, per-recipient results'],
        ['Automation / bots', 'Build a bot engine and state machine from scratch', 'Keyword auto-replies, menu bots, AI bots \u2014 no code or via API/MCP'],
        ['CRM & compliance', 'Store contacts, consent, opt-out, spam handling yourself', 'Built-in CRM, consent/opt-out and spam handling enforced on sends'],
        ['Analytics', 'Aggregate and store your own metrics', 'Messages, conversations, leads, cases and campaign results out of the box'],
        ['AI agents', 'Agents get raw Graph API errors \u2014 brittle to reason about', 'MCP + structured states with recommended next actions'],
        ['API version upkeep', 'You migrate as Meta bumps Graph API versions', 'Gambot tracks and absorbs Meta API changes'],
      ],
    },
    {
      type: 'cards',
      title: 'What the ready infrastructure saves you',
      cards: [
        { icon: '\u23F1\uFE0F', title: 'Time to market', text: 'Days instead of months \u2014 no App Review, webhook servers or template plumbing to build first.' },
        { icon: '\uD83D\uDEE0\uFE0F', title: 'No infra to run', text: 'No webhook endpoints, media hosting, retry queues or tier tracking to operate and monitor.' },
        { icon: '\uD83D\uDEE1\uFE0F', title: 'Compliance built in', text: '24h window, opt-out/consent and spam handling are enforced on every send.' },
        { icon: '\uD83E\uDD16', title: 'Agent-ready', text: 'MCP + machine-readable states mean AI agents recover intelligently instead of parsing raw Meta errors.' },
        { icon: '\uD83D\uDD01', title: 'Future-proof', text: 'Gambot absorbs Meta Graph API version changes so your integration keeps working.' },
        { icon: '\uD83D\uDCE6', title: 'More than messaging', text: 'Campaigns, CRM, bots and analytics on top of the API \u2014 not just a send endpoint.' },
      ],
    },
    {
      type: 'prose',
      title: 'When building directly on Meta still makes sense',
      paragraphs: [
        'Direct Cloud API can fit a team that wants to own every layer, has engineers to build and operate webhook/media/queue infrastructure, and does not need campaigns, CRM, bots or AI tooling on top. It is a legitimate low-level choice.',
        'For almost everyone else \u2014 and for <strong style="color:#e9edef">any AI agent</strong> that should reason about WhatsApp rather than manage HTTP plumbing \u2014 a ready platform is faster, safer and cheaper. You still run on the official API; Gambot just removes the undifferentiated heavy lifting.',
      ],
    },
    {
      type: 'bullets',
      title: 'Why this matters for AI agents specifically',
      bullets: [
        'On the raw Cloud API an agent receives <strong style="color:#e9edef">Graph API errors</strong> (e.g. code 131047 / 131026) it has to interpret. Gambot returns normalized states like <code>CONVERSATION_WINDOW_CLOSED</code> with <code>canSendTemplate: true</code>.',
        'Through <a href="' + MCP + '" style="color:#25D366">MCP</a>, those states become <strong style="color:#e9edef">recommended next actions</strong>, so the agent picks the correct step (e.g. send an approved template) instead of failing.',
        'The agent gets the <strong style="color:#e9edef">whole workflow</strong> \u2014 templates, contacts, campaigns, scheduling, analytics \u2014 as safe tools, not a single low-level send call. See <a href="' + AI_AGENTS + '" style="color:#25D366">WhatsApp API for AI agents</a>.',
      ],
    },
    {
      type: 'cta',
      title: 'Skip the plumbing \u2014 keep the official API',
      text: 'Create a free account, connect WhatsApp, and build on a production-grade WhatsApp Business API with MCP for AI agents \u2014 without building Meta\u2019s infrastructure yourself.',
      primary: ctaCreate,
      secondary: { label: 'Read the API docs', href: DOCS, event: 'developer_docs_click' },
    },
  ],
  faq: [
    { q: 'Can I just use Meta\u2019s WhatsApp Cloud API directly instead of Gambot?', a: 'Yes \u2014 the Cloud API is open to businesses. But you then build and operate everything around it: Meta app review and Business verification, phone-number registration, template submission and approval tracking, a public webhook endpoint with retries and dedupe, media hosting, messaging-tier and rate-limit handling, opt-out/consent, and error handling. Gambot runs on the same official API and provides all of that ready-made.' },
    { q: 'Is Gambot official, or a workaround?', a: 'Official. Gambot is a Meta Business Solution Provider (BSP) and runs on the authorized WhatsApp Business (Cloud) API \u2014 not an unofficial or WhatsApp Web workaround.' },
    { q: 'Do I still own my WhatsApp number and WABA?', a: 'Yes. You connect your own WhatsApp Business number/WABA; you can migrate an existing number, and Coexistence lets a bot run on a number you still use manually.' },
    { q: 'What does Gambot add on top of the Meta Cloud API?', a: 'Guided onboarding and verification, a visual template editor, managed webhooks, media handling, 24-hour-window enforcement, messaging-tier handling, native campaigns with consent and per-recipient results, CRM, bots/automation, analytics, a REST API, and an MCP server that exposes it all to AI agents with structured states and next-action guidance.' },
    { q: 'Which is better for AI agents \u2014 direct Cloud API or Gambot?', a: 'Gambot. Raw Cloud API returns low-level Graph errors an agent must interpret; Gambot returns machine-readable states (e.g. CONVERSATION_WINDOW_CLOSED with canSendTemplate) and, via MCP, recommended next actions \u2014 so the agent reasons and recovers instead of parsing brittle errors.' },
    { q: 'Will I be locked in or lose access to Meta features?', a: 'You run on the official Cloud API the whole time, so you keep access to WhatsApp Business features and your own WABA. Gambot adds a layer on top; it does not replace Meta.' },
  ],
};

import {
  SIGNUP, DOCS, MCP, GITHUB, NPM, HOSTED_MCP, MCP_STDIO_CONFIG, HOME,
  ctaCreate, ctaDocs,
} from './_common';

const link = (href, text) => `<a href="${href}" style="color:#25D366">${text}</a>`;
const strong = (t) => `<strong style="color:#e9edef">${t}</strong>`;
const utm = (path, source, medium) => `https://gambot.co.il${path}?utm_source=${source}&utm_medium=${medium}`;

const SEND_EXAMPLE = `# 1) Is free text allowed right now? (24-hour customer-service window)
curl -s https://api.gambot.co.il/api/v1/conversations/12025550123/window \\
  -H "Authorization: Bearer $GAMBOT_TOKEN"

# 2a) Window open -> free text
curl -s -X POST https://api.gambot.co.il/api/v1/messages/send-text \\
  -H "Authorization: Bearer $GAMBOT_TOKEN" -H "Content-Type: application/json" \\
  -d '{"to":"12025550123","text":"Your order has shipped."}'

# 2b) Window closed -> approved template
curl -s -X POST https://api.gambot.co.il/api/v1/messages/send-template \\
  -H "Authorization: Bearer $GAMBOT_TOKEN" -H "Content-Type: application/json" \\
  -d '{"to":"12025550123","templateId":"order_update_0626","variables":["Dana","#1234"]}'

# 3) Did it arrive?
curl -s "https://api.gambot.co.il/api/v1/messages/<messageId>/status?phone=12025550123" \\
  -H "Authorization: Bearer $GAMBOT_TOKEN"`;

const related = (here) => ({
  type: 'bullets',
  title: 'Related',
  bullets: [
    link('https://gambot.co.il/whatsapp-mcp/', 'WhatsApp MCP') + ' \u2014 give an AI agent the official WhatsApp API (local npx or hosted OAuth).',
    link('https://gambot.co.il/whatsapp-api-for-ai-agents/', 'WhatsApp API for AI agents') + ' \u00B7 ' + link('https://gambot.co.il/whatsapp-api-for-developers/', 'WhatsApp API for developers'),
    here !== 'cloud' ? link('https://gambot.co.il/whatsapp-cloud-api/', 'WhatsApp Cloud API explained') : link('https://gambot.co.il/whatsapp-business-api/', 'WhatsApp Business API explained'),
    link('https://gambot.co.il/whatsapp-api-vs-meta-cloud-api/', 'Gambot vs building on Meta\u2019s Cloud API directly') + ' \u00B7 ' + link('https://gambot.co.il/whatsapp-mcp-vs-whatsapp-web/', 'Official API vs WhatsApp Web automation'),
    link('https://gambot.co.il/whatsapp-mcp/agent-skill/', 'Gambot Agent Skill') + ' \u00B7 ' + link(DOCS + '?lang=en', 'REST API docs') + ' \u00B7 ' + link(GITHUB, 'GitHub') + ' \u00B7 ' + link(NPM, 'npm'),
  ],
});

/* ----------------------------------------------------------------------------------------------- */
export const businessApi = {
  pageKey: 'whatsapp-business-api',
  schemaType: 'article',
  seo: {
    title: 'WhatsApp Business API \u2014 the official API, explained for developers and AI agents | Gambot',
    appName: 'Gambot WhatsApp Business API',
    description: 'What the official WhatsApp Business API is, how it differs from the WhatsApp Business app and WhatsApp Web automation, and how to get access through Gambot (a Meta Business Solution Provider) with REST or MCP.',
    keywords: 'WhatsApp Business API, official WhatsApp Business API, WhatsApp Business API for developers, WhatsApp Business API provider, WhatsApp Business Platform, WhatsApp API for AI agents',
    canonical: 'https://gambot.co.il/whatsapp-business-api/',
    ogTitle: 'WhatsApp Business API \u2014 the official API, explained',
    ogDescription: 'The official WhatsApp Business API for apps and AI agents: what it is, what it is not, and how to get started with REST or MCP.',
  },
  breadcrumbs: [HOME, { name: 'WhatsApp Business API', item: 'https://gambot.co.il/whatsapp-business-api/' }],
  hero: {
    badge: 'Official API \u00B7 REST + MCP',
    h1: 'The official WhatsApp Business API, for apps and AI agents',
    subhead: 'Send and receive WhatsApp messages from your product with Meta\u2019s sanctioned business API \u2014 through ' + strong('Gambot, a Meta Business Solution Provider') + '. No QR codes, no linked personal sessions.',
    primary: { label: 'Create free account \u2192', href: utm('/OnboardingProcess/', 'whatsapp-business-api', 'landing'), event: 'create_account_click', eventParams: { page: 'whatsapp-business-api' } },
    secondary: { label: 'Connect an AI agent (MCP)', href: utm('/whatsapp-mcp/', 'whatsapp-business-api', 'landing'), event: 'mcp_cta_click' },
    chips: ['Official API', 'Meta BSP', 'REST', 'MCP', 'Webhooks', 'Templates'],
  },
  blocks: [
    { type: 'prose', title: 'What the WhatsApp Business API is', paragraphs: [
      'The WhatsApp Business API (officially the WhatsApp Business Platform) is how a company connects software to WhatsApp: your backend sends messages, and receives customer messages and delivery updates through webhooks. It is built for business use \u2014 approved message templates, customer opt-in, quality ratings and messaging limits \u2014 and runs on a verified business account.',
      'You can reach it directly through Meta, or through a Business Solution Provider (BSP) such as Gambot, which operates the infrastructure around it so you integrate against one simple API.',
    ] },
    { type: 'table', title: 'Business API vs the Business app vs WhatsApp Web automation', columns: ['', 'WhatsApp Business API', 'WhatsApp Business app', 'WhatsApp Web / QR automation'], rows: [
      ['Built for', 'Software integrations, many agents, automation', 'A small business answering from one phone', 'Scripts that drive a personal session'],
      ['How it connects', 'HTTPS API + webhooks', 'A phone app', 'A QR code scanned from a phone'],
      ['Official channel', 'Yes: Meta-provided, via Meta or a BSP', 'Yes (the app itself)', 'No supported business channel'],
      ['Templates and opt-in rules', 'Required and enforced', 'Not applicable', 'Not enforced, easy to violate'],
      ['Production reliability', 'Designed for it', 'Manual', 'Sessions drop; accounts can be blocked'],
    ] },
    { type: 'steps', title: 'Get access with Gambot', steps: [
      { title: '1. Create the account', text: 'In the browser, or let an AI agent do it through the MCP server (no API key needed).' },
      { title: '2. Connect WhatsApp with Meta', text: 'A one-time Meta Embedded Signup in the browser links your business number. This step must be done by a person.' },
      { title: '3. Get your token', text: 'Copy the API token from Settings \u2192 General into an environment variable, or sign in with OAuth on the hosted MCP.' },
      { title: '4. Send the first message', text: 'Check the 24-hour window, send text or an approved template, and confirm delivery.' },
    ] },
    { type: 'code', title: 'Send a message (REST)', intro: 'Base URL https://api.gambot.co.il/api/v1. Phone numbers are digits with country code, no plus sign.', code: SEND_EXAMPLE },
    { type: 'bullets', title: 'What you get', bullets: [
      'Free-text messages inside the 24-hour window and approved templates anywhere.',
      'Webhooks for incoming messages, delivery status and template approvals \u2014 no Meta Graph subscription to manage.',
      'Machine-readable errors (<code>code</code>, <code>can_recover</code>, <code>required_tool</code>) so agents recover instead of guessing.',
      'An MCP server and an open Agent Skill so AI coding agents can do the integration for you.',
      'CRM, campaigns and bots on the same account when you outgrow single sends.',
    ] },
    { type: 'bullets', title: 'Next steps', bullets: [
      link(MCP, 'Connect an AI agent with the Gambot MCP server') + ' \u2014 Claude Code, Cursor, Codex, Gemini CLI, VS Code and more.',
      link(DOCS + '?lang=en', 'Read the REST API reference') + ' \u2014 auth, scopes, endpoints and error codes.',
      link(SIGNUP, 'Create a Gambot account') + ' and connect your WhatsApp number.',
    ] },
    related('business'),
    { type: 'cta', title: 'Start with the official WhatsApp Business API', text: 'Create the account, connect with Meta, and send your first message today.', primary: ctaCreate, secondary: ctaDocs },
  ],
  faq: [
    { q: 'What is the WhatsApp Business API?', a: 'It is the official way for companies to send and receive WhatsApp messages from software. Your system calls an HTTPS API to send messages and receives customer messages and delivery updates through webhooks, on a verified business account with approved templates.' },
    { q: 'Is Gambot the official WhatsApp Business API?', a: 'Gambot is a Meta Business Solution Provider. Messages go through Meta\u2019s WhatsApp Business (Cloud) API, not through WhatsApp Web or a QR-code session.' },
    { q: 'How is it different from the WhatsApp Business app?', a: 'The app is used by a person on a phone. The API is for software: it supports automation, multiple agents, webhooks and templates, and is the channel to use for production integrations.' },
    { q: 'How do I get access?', a: 'Create a Gambot account, connect your WhatsApp number with Meta in the browser (Embedded Signup), then use the REST API or MCP server with your token.' },
    { q: 'Can an AI agent set it up for me?', a: 'Yes, except the Meta connection step. An agent using the Gambot MCP server can create the account, give you the Meta link, verify the connection and send the first message.' },
  ],
};

/* ----------------------------------------------------------------------------------------------- */
export const cloudApi = {
  pageKey: 'whatsapp-cloud-api',
  schemaType: 'article',
  seo: {
    title: 'WhatsApp Cloud API \u2014 what Meta hosts, what you still build, and where Gambot fits | Gambot',
    appName: 'Gambot WhatsApp Cloud API',
    description: 'A practical guide to the WhatsApp Cloud API: the building blocks (app, WABA, phone number, tokens, webhooks, templates), what you must build around them, and how Gambot exposes the same Cloud API through a simpler REST and MCP interface.',
    keywords: 'WhatsApp Cloud API, WhatsApp Cloud API tutorial, WhatsApp Cloud API webhook, WhatsApp Cloud API without Meta complexity, WhatsApp Cloud API MCP, WhatsApp Cloud API provider',
    canonical: 'https://gambot.co.il/whatsapp-cloud-api/',
    ogTitle: 'WhatsApp Cloud API \u2014 building blocks and where Gambot fits',
    ogDescription: 'What the WhatsApp Cloud API gives you, what you still have to build, and a simpler REST/MCP interface to the same API.',
  },
  breadcrumbs: [HOME, { name: 'WhatsApp Cloud API', item: 'https://gambot.co.il/whatsapp-cloud-api/' }],
  hero: {
    badge: 'Cloud API \u00B7 REST + MCP',
    h1: 'WhatsApp Cloud API: building blocks, and a simpler way in',
    subhead: 'The Cloud API is Meta\u2019s hosted WhatsApp Business API. ' + strong('Gambot is a Business Solution Provider that exposes the same API') + ' through a smaller REST surface and an MCP server for AI agents.',
    primary: { label: 'Create free account \u2192', href: utm('/OnboardingProcess/', 'whatsapp-cloud-api', 'landing'), event: 'create_account_click', eventParams: { page: 'whatsapp-cloud-api' } },
    secondary: { label: 'Connect an AI agent (MCP)', href: utm('/whatsapp-mcp/', 'whatsapp-cloud-api', 'landing'), event: 'mcp_cta_click' },
    chips: ['Cloud API', 'Webhooks', 'Templates', 'MCP', 'No QR'],
  },
  blocks: [
    { type: 'prose', title: 'What the Cloud API is', paragraphs: [
      'The WhatsApp Cloud API is the version of the WhatsApp Business API that Meta hosts for you. You do not run servers for WhatsApp itself: you send messages by calling Meta\u2019s Graph API (a <code>POST</code> to the <code>/messages</code> edge of a phone number id) and Meta calls your webhook for incoming messages and status updates.',
    ] },
    { type: 'table', title: 'The building blocks', columns: ['Piece', 'What it is', 'Who handles it with Gambot'], rows: [
      ['Meta app and business portfolio', 'A developer app, plus a business (optionally verified for higher limits)', 'Gambot\u2019s provider setup; you complete Embedded Signup once'],
      ['WhatsApp Business Account and phone number', 'The WABA and a registered business number', 'Created and linked during Embedded Signup'],
      ['Access token', 'Credential to call the API', 'You use one Gambot token or OAuth; Meta tokens are managed for you'],
      ['Webhook endpoint', 'Public HTTPS endpoint with verification and signature checks, retries and de-duplication', 'Gambot receives from Meta and forwards a simple envelope to your URL'],
      ['Message templates', 'Submit, track approval, version', 'API and MCP tools with status; naming and category guidance'],
      ['24-hour window', 'Text only after a recent customer message, otherwise a template', 'Checked by an endpoint; errors tell agents to send a template'],
      ['Limits and errors', 'Messaging tiers, rate limits, numeric Graph error codes', 'Structured error codes and recommended next actions'],
    ] },
    { type: 'bullets', title: 'When to use the Cloud API directly', bullets: [
      'You have engineers who want full control of every Graph API call and you accept operating webhooks, token management and template workflows yourself.',
      'You need a Meta feature that a provider layer does not yet expose.',
    ] },
    { type: 'bullets', title: 'When Gambot fits better', bullets: [
      'You want to ship WhatsApp messaging quickly without learning Meta\u2019s app review and webhook details first.',
      'You want an AI agent to do the integration (MCP server and Agent Skill) with clear next steps and structured errors.',
      'You also need CRM, campaigns, bots and a shared inbox on the same number.',
    ] },
    { type: 'code', title: 'The same job through Gambot', intro: 'Gambot sends through the Cloud API for you. No Graph version, phone number id or app token in your code.', code: SEND_EXAMPLE },
    { type: 'code', title: 'Connect an AI agent', intro: 'Local, starts in onboarding mode when no token is set:', code: MCP_STDIO_CONFIG },
    { type: 'bullets', title: 'Next steps', bullets: [
      link(MCP, 'WhatsApp MCP') + ' \u2014 hosted OAuth endpoint ' + `<code>${HOSTED_MCP}</code>` + ' or <code>npx -y gambot-mcp</code>.',
      link('https://gambot.co.il/whatsapp-api-vs-meta-cloud-api/', 'Detailed comparison: Gambot vs building on the Cloud API yourself') + '.',
      link(SIGNUP, 'Create a Gambot account') + ' and connect your number.',
    ] },
    related('cloud'),
    { type: 'cta', title: 'Use the Cloud API without the plumbing', text: 'Same official API, a smaller interface, and an MCP server your agents already understand.', primary: ctaCreate, secondary: ctaDocs },
  ],
  faq: [
    { q: 'What is the WhatsApp Cloud API?', a: 'It is Meta\u2019s hosted WhatsApp Business API. You send messages by calling Meta\u2019s Graph API and receive customer messages and delivery updates through a webhook you provide.' },
    { q: 'Is the Cloud API the same as the WhatsApp Business API?', a: 'The Cloud API is the Meta-hosted way to use the WhatsApp Business API; it replaced the older on-premises version for new integrations.' },
    { q: 'Does Gambot use the Cloud API?', a: 'Yes. Gambot is a Meta Business Solution Provider; its REST API and MCP server send through the WhatsApp Business (Cloud) API.' },
    { q: 'Do I still need a Meta developer app?', a: 'Not for your own code. You connect your business number to Gambot once via Meta Embedded Signup in the browser; after that you call the Gambot API with a Gambot token.' },
    { q: 'Is this WhatsApp Web automation?', a: 'No. There is no QR code or linked personal session.' },
  ],
};

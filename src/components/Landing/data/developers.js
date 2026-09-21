import {
  SIGNUP, DOCS, MCP, AI_AGENTS, API_BASE, HOME, CRUMB_DEV,
  ctaCreate, ctaDocs,
} from './_common';

export const data = {
  pageKey: 'whatsapp-api-for-developers',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp Business API for Developers | Gambot',
    appName: 'Gambot WhatsApp Business API for Developers',
    description:
      'Add WhatsApp to your application without building the WhatsApp infrastructure yourself. A clean REST API (and MCP) on the official WhatsApp Business API: messaging, templates, contacts, campaigns, scheduling, webhooks and analytics.',
    keywords:
      'WhatsApp API for developers, WhatsApp Business API, WhatsApp API integration, WhatsApp REST API, WhatsApp Cloud API, WhatsApp webhooks, WhatsApp API automation, send WhatsApp from code',
    canonical: 'https://gambot.co.il/whatsapp-api-for-developers/',
    ogTitle: 'WhatsApp Business API for Developers',
    ogDescription:
      'Add WhatsApp to your app with a clean REST API + MCP on the official WhatsApp Business API. Messaging, templates, campaigns, webhooks, analytics.',
  },
  breadcrumbs: [HOME, CRUMB_DEV, { name: 'WhatsApp API for Developers', item: 'https://gambot.co.il/whatsapp-api-for-developers/' }],
  hero: {
    badge: 'REST API + MCP · Official WhatsApp Business API',
    h1: 'WhatsApp Business API for Developers',
    subhead:
      'Add WhatsApp to your application <strong style="color:#e9edef">without building the entire WhatsApp infrastructure yourself</strong>. One clean REST API on the official WhatsApp Business API — messaging, templates, contacts, campaigns, scheduling, webhooks and analytics.',
    primary: ctaCreate,
    secondary: ctaDocs,
    chips: ['REST', 'MCP', 'Webhooks', 'Templates', 'Campaigns', 'Analytics'],
  },
  blocks: [
    {
      type: 'code',
      title: 'Architecture',
      intro: 'Your application talks to Gambot; Gambot talks to WhatsApp. You never touch Meta Graph plumbing, tokens or template submission flows directly.',
      code: `Your Application
      |
      v
Gambot REST API / MCP        base: ${API_BASE}
      |
      v
WhatsApp Business API (Cloud API, official Meta)`,
    },
    {
      type: 'code',
      title: 'Send a message in one request',
      intro: 'Authenticate with your organization Gambot token (gmbt_…). Every response uses a consistent { success, message, data } envelope; errors add a machine-readable code.',
      code: `curl -X POST ${API_BASE}/messages/send-text \\
  -H "Authorization: Bearer gmbt_your_token" \\
  -H "Content-Type: application/json" \\
  -d '{ "to": "972501234567", "text": "Hello from my app \uD83D\uDC4B" }'

# 200 OK
# { "success": true, "data": { "messageId": "wamid...", "to": "972501234567" } }`,
    },
    {
      type: 'cards',
      title: 'What the API covers',
      intro: 'Real, supported capabilities — no invented endpoints.',
      cards: [
        { icon: '\u2709\uFE0F', title: 'Messaging', text: 'send-text, send-template, delivery status, conversations & message history.' },
        { icon: '\uD83D\uDCC4', title: 'Templates', text: 'List, read, inspect variables, create (submitted to Meta) and upload media.' },
        { icon: '\uD83D\uDC65', title: 'Contacts & CRM', text: 'Contacts, tags, consent, leads, cases, tasks and notes with custom fields.' },
        { icon: '\uD83D\uDCE3', title: 'Campaigns', text: 'Create, schedule, run and read results; opt-out and consent handled automatically.' },
        { icon: '\uD83D\uDD17', title: 'Webhooks', text: 'Forward inbound WhatsApp events to your endpoint for real-time processing.' },
        { icon: '\uD83D\uDCCA', title: 'Analytics', text: 'Message volume, conversations waiting for reply, leads, cases, tasks, campaign performance.' },
      ],
    },
    {
      type: 'bullets',
      title: 'Built for integration',
      bullets: [
        '<strong style="color:#e9edef">Token auth with scopes</strong> — pass <code>Authorization: Bearer gmbt_…</code>; keys can be limited to specific scopes.',
        '<strong style="color:#e9edef">Machine-readable errors</strong> — every error returns a stable <code>code</code> (e.g. <code>CONVERSATION_WINDOW_CLOSED</code>, <code>MISSING_TEMPLATE_VARIABLES</code>) so you branch on codes, not prose.',
        '<strong style="color:#e9edef">Global phone handling</strong> — E.164 with per-account country defaults; multi-number orgs pick a sender with <code>from</code>.',
        '<strong style="color:#e9edef">AI-friendly responses</strong> — ISO-8601 timestamps and pruned empty fields keep payloads clean for both code and LLMs.',
        'Prefer natural language? The same API is available to AI agents via <a href="' + MCP + '" style="color:#25D366">the WhatsApp MCP server</a> and <a href="' + AI_AGENTS + '" style="color:#25D366">WhatsApp API for AI agents</a>.',
      ],
    },
    {
      type: 'cta',
      title: 'Start building',
      text: 'Create a free account, grab your Gambot token from Settings \u2192 General, and make your first API call in minutes.',
      primary: ctaCreate,
      secondary: { label: 'Full API reference \u2192', href: DOCS, event: 'developer_docs_click' },
    },
  ],
  faq: [
    { q: 'What is the API base URL and how do I authenticate?', a: 'The base URL is https://api.gambot.co.il/api/v1. Authenticate with your organization Gambot token (gmbt_…) via Authorization: Bearer, the X-Api-Key header, or an api_key query parameter. Tokens can be scoped.' },
    { q: 'Do I need my own Meta / WhatsApp Business API account?', a: 'No. Gambot is an official Meta Business Solution Provider and manages the WhatsApp Business (Cloud) API for you — including template submission and number provisioning during onboarding.' },
    { q: 'How are errors structured?', a: 'Responses use { success, message, data }. Errors also include a stable machine-readable code (e.g. CONVERSATION_WINDOW_CLOSED, MISSING_TEMPLATE_VARIABLES, INVALID_PHONE_NUMBER) and, where useful, a data object with state flags to help you recover.' },
    { q: 'Can I receive inbound messages?', a: 'Yes — configure a webhook to forward inbound WhatsApp events to your endpoint, and read history with the conversations endpoints.' },
    { q: 'Is there an MCP option for AI agents?', a: 'Yes. The Gambot MCP server exposes the same functionality as AI-friendly tools for ChatGPT, Claude, Gemini and Cursor. See the WhatsApp MCP page.' },
  ],
  he: {
    hero: {
      badge: 'REST API + MCP · WhatsApp Business API \u05e8\u05e9\u05de\u05d9',
      h1: 'WhatsApp Business API \u05dc\u05de\u05e4\u05ea\u05d7\u05d9\u05dd',
      subhead:
        '\u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05dc\u05d0\u05e4\u05dc\u05d9\u05e7\u05e6\u05d9\u05d4 \u05e9\u05dc\u05db\u05dd <strong style="color:#e9edef">\u05d1\u05dc\u05d9 \u05dc\u05d1\u05e0\u05d5\u05ea \u05d0\u05ea \u05db\u05dc \u05ea\u05e9\u05ea\u05d9\u05ea \u05d4\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05d1\u05e2\u05e6\u05de\u05db\u05dd</strong>. REST API \u05e0\u05e7\u05d9 \u05d0\u05d7\u05d3 \u05e2\u05dc \u05d4\u2011WhatsApp Business API \u05d4\u05e8\u05e9\u05de\u05d9 \u2014 \u05de\u05e1\u05e8\u05d9\u05dd, \u05ea\u05d1\u05e0\u05d9\u05d5\u05ea, \u05d0\u05e0\u05e9\u05d9 \u05e7\u05e9\u05e8, \u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd, \u05ea\u05d6\u05de\u05d5\u05df, webhooks \u05d5\u05d0\u05e0\u05dc\u05d9\u05d8\u05d9\u05e7\u05e1.',
      primary: { label: '\u05e6\u05d5\u05e8 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd \u2192' },
      secondary: { label: '\u05e7\u05e8\u05d0 \u05d0\u05ea \u05ea\u05d9\u05e2\u05d5\u05d3 \u05d4\u2011API' },
      chips: ['REST', 'MCP', 'Webhooks', '\u05ea\u05d1\u05e0\u05d9\u05d5\u05ea', '\u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd', '\u05d0\u05e0\u05dc\u05d9\u05d8\u05d9\u05e7\u05e1'],
    },
    blocks: [
      {
        title: '\u05d0\u05e8\u05db\u05d9\u05d8\u05e7\u05d8\u05d5\u05e8\u05d4',
        intro: '\u05d4\u05d0\u05e4\u05dc\u05d9\u05e7\u05e6\u05d9\u05d4 \u05e9\u05dc\u05db\u05dd \u05de\u05d3\u05d1\u05e8\u05ea \u05e2\u05dd \u05d2\u05de\u05d1\u05d5\u05d8; \u05d2\u05de\u05d1\u05d5\u05d8 \u05de\u05d3\u05d1\u05e8\u05ea \u05e2\u05dd \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4. \u05d0\u05ea\u05dd \u05dc\u05e2\u05d5\u05dc\u05dd \u05dc\u05d0 \u05e0\u05d5\u05d2\u05e2\u05d9\u05dd \u05d9\u05e9\u05d9\u05e8\u05d5\u05ea \u05d1\u05ea\u05e9\u05ea\u05d9\u05ea \u05d4\u2011Graph \u05e9\u05dc Meta, \u05d1\u05d8\u05d5\u05e7\u05e0\u05d9\u05dd \u05d0\u05d5 \u05d1\u05ea\u05d4\u05dc\u05d9\u05db\u05d9 \u05d4\u05d2\u05e9\u05ea \u05ea\u05d1\u05e0\u05d9\u05d5\u05ea.',
      },
      {
        title: '\u05e9\u05dc\u05d9\u05d7\u05ea \u05d4\u05d5\u05d3\u05e2\u05d4 \u05d1\u05d1\u05e7\u05e9\u05d4 \u05d0\u05d7\u05ea',
        intro: '\u05d4\u05ea\u05d0\u05de\u05ea\u05d5 \u05e2\u05dd \u05d8\u05d5\u05e7\u05df \u05d4\u05d0\u05e8\u05d2\u05d5\u05df \u05e9\u05dc\u05db\u05dd \u05d1\u05d2\u05de\u05d1\u05d5\u05d8 (gmbt_\u2026). \u05db\u05dc \u05ea\u05d2\u05d5\u05d1\u05d4 \u05de\u05e9\u05ea\u05de\u05e9\u05ea \u05d1\u05de\u05e2\u05d8\u05e4\u05d4 \u05d0\u05d7\u05d9\u05d3\u05d4 { success, message, data }; \u05e9\u05d2\u05d9\u05d0\u05d5\u05ea \u05de\u05d5\u05e1\u05d9\u05e4\u05d5\u05ea code \u05e7\u05e8\u05d9\u05d0 \u05dc\u05de\u05db\u05d5\u05e0\u05d4.',
      },
      {
        title: '\u05de\u05d4 \u05d4\u2011API \u05de\u05db\u05e1\u05d4',
        intro: '\u05d9\u05db\u05d5\u05dc\u05d5\u05ea \u05d0\u05de\u05d9\u05ea\u05d9\u05d5\u05ea \u05d5\u05e0\u05ea\u05de\u05db\u05d5\u05ea \u2014 \u05d1\u05dc\u05d9 \u05e0\u05e7\u05d5\u05d3\u05d5\u05ea \u05e7\u05e6\u05d4 \u05de\u05d5\u05de\u05e6\u05d0\u05d5\u05ea.',
        cards: [
          { icon: '\u2709\uFE0F', title: '\u05de\u05e1\u05e8\u05d9\u05dd', text: 'send-text, send-template, \u05e1\u05d8\u05d8\u05d5\u05e1 \u05de\u05e1\u05d9\u05e8\u05d4, \u05e9\u05d9\u05d7\u05d5\u05ea \u05d5\u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d9\u05ea \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea.' },
          { icon: '\uD83D\uDCC4', title: '\u05ea\u05d1\u05e0\u05d9\u05d5\u05ea', text: '\u05d4\u05e6\u05d2\u05d4, \u05e7\u05e8\u05d9\u05d0\u05d4, \u05d1\u05d3\u05d9\u05e7\u05ea \u05de\u05e9\u05ea\u05e0\u05d9\u05dd, \u05d9\u05e6\u05d9\u05e8\u05d4 (\u05d4\u05d2\u05e9\u05d4 \u05dc\u2011Meta) \u05d5\u05d4\u05e2\u05dc\u05d0\u05ea \u05de\u05d3\u05d9\u05d4.' },
          { icon: '\uD83D\uDC65', title: '\u05d0\u05e0\u05e9\u05d9 \u05e7\u05e9\u05e8 \u05d5\u2011CRM', text: '\u05d0\u05e0\u05e9\u05d9 \u05e7\u05e9\u05e8, \u05ea\u05d2\u05d9\u05d5\u05ea, \u05d4\u05e1\u05db\u05de\u05d4, \u05dc\u05d9\u05d3\u05d9\u05dd, \u05e4\u05e0\u05d9\u05d5\u05ea, \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05d5\u05d4\u05e2\u05e8\u05d5\u05ea \u05e2\u05dd \u05e9\u05d3\u05d5\u05ea \u05de\u05d5\u05ea\u05d0\u05de\u05d9\u05dd.' },
          { icon: '\uD83D\uDCE3', title: '\u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd', text: '\u05d9\u05e6\u05d9\u05e8\u05d4, \u05ea\u05d6\u05de\u05d5\u05df, \u05d4\u05e8\u05e6\u05d4 \u05d5\u05e7\u05e8\u05d9\u05d0\u05ea \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea; \u05d4\u05e1\u05e8\u05d4 \u05d5\u05d4\u05e1\u05db\u05de\u05d4 \u05de\u05d8\u05d5\u05e4\u05dc\u05d9\u05dd \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea.' },
          { icon: '\uD83D\uDD17', title: 'Webhooks', text: '\u05d4\u05e2\u05d1\u05e8\u05ea \u05d0\u05d9\u05e8\u05d5\u05e2\u05d9 \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05e0\u05db\u05e0\u05e1\u05d9\u05dd \u05dc\u05e0\u05e7\u05d5\u05d3\u05ea \u05d4\u05e7\u05e6\u05d4 \u05e9\u05dc\u05db\u05dd \u05dc\u05e2\u05d9\u05d1\u05d5\u05d3 \u05d1\u05d6\u05de\u05df \u05d0\u05de\u05ea.' },
          { icon: '\uD83D\uDCCA', title: '\u05d0\u05e0\u05dc\u05d9\u05d8\u05d9\u05e7\u05e1', text: '\u05e0\u05e4\u05d7 \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea, \u05e9\u05d9\u05d7\u05d5\u05ea \u05d4\u05de\u05de\u05ea\u05d9\u05e0\u05d5\u05ea \u05dc\u05de\u05e2\u05e0\u05d4, \u05dc\u05d9\u05d3\u05d9\u05dd, \u05e4\u05e0\u05d9\u05d5\u05ea, \u05de\u05e9\u05d9\u05de\u05d5\u05ea \u05d5\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9 \u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd.' },
        ],
      },
      {
        title: '\u05e0\u05d1\u05e0\u05d4 \u05dc\u05d0\u05d9\u05e0\u05d8\u05d2\u05e8\u05e6\u05d9\u05d4',
        bullets: [
          '<strong style="color:#e9edef">\u05d0\u05d9\u05de\u05d5\u05ea \u05d8\u05d5\u05e7\u05df \u05e2\u05dd \u05d4\u05e8\u05e9\u05d0\u05d5\u05ea</strong> \u2014 \u05d4\u05e2\u05d1\u05d9\u05e8\u05d5 <code>Authorization: Bearer gmbt_\u2026</code>; \u05de\u05e4\u05ea\u05d7\u05d5\u05ea \u05e0\u05d9\u05ea\u05e0\u05d5\u05ea \u05dc\u05d4\u05d2\u05d1\u05dc\u05d4 \u05dc\u05d4\u05e8\u05e9\u05d0\u05d5\u05ea \u05e1\u05e4\u05e6\u05d9\u05e4\u05d9\u05d5\u05ea.',
          '<strong style="color:#e9edef">\u05e9\u05d2\u05d9\u05d0\u05d5\u05ea \u05e7\u05e8\u05d9\u05d0\u05d5\u05ea \u05dc\u05de\u05db\u05d5\u05e0\u05d4</strong> \u2014 \u05db\u05dc \u05e9\u05d2\u05d9\u05d0\u05d4 \u05de\u05d7\u05d6\u05d9\u05e8\u05d4 <code>code</code> \u05d9\u05e6\u05d9\u05d1 (\u05dc\u05de\u05e9\u05dc <code>CONVERSATION_WINDOW_CLOSED</code>, <code>MISSING_TEMPLATE_VARIABLES</code>) \u05db\u05da \u05e9\u05ea\u05e1\u05ea\u05e2\u05e4\u05d5 \u05dc\u05e4\u05d9 \u05e7\u05d5\u05d3\u05d9\u05dd \u05d5\u05dc\u05d0 \u05dc\u05e4\u05d9 \u05d8\u05e7\u05e1\u05d8.',
          '<strong style="color:#e9edef">\u05d8\u05d9\u05e4\u05d5\u05dc \u05d2\u05dc\u05d5\u05d1\u05dc\u05d9 \u05d1\u05de\u05e1\u05e4\u05e8\u05d9\u05dd</strong> \u2014 E.164 \u05e2\u05dd \u05d1\u05e8\u05d9\u05e8\u05d5\u05ea \u05de\u05d3\u05d9\u05e0\u05d4 \u05dc\u05e4\u05d9 \u05d7\u05e9\u05d1\u05d5\u05df; \u05d0\u05e8\u05d2\u05d5\u05e0\u05d9\u05dd \u05e8\u05d1\u2011\u05de\u05e1\u05e4\u05e8\u05d9\u05dd \u05d1\u05d5\u05d7\u05e8\u05d9\u05dd \u05e9\u05d5\u05dc\u05d7 \u05e2\u05dd <code>from</code>.',
          '<strong style="color:#e9edef">\u05ea\u05d2\u05d5\u05d1\u05d5\u05ea \u05d9\u05d3\u05d9\u05d3\u05d5\u05ea\u05d9\u05d5\u05ea \u05dc\u2011AI</strong> \u2014 \u05d7\u05d5\u05ea\u05de\u05d5\u05ea \u05d6\u05de\u05df \u05d1\u2011ISO-8601 \u05d5\u05d4\u05e1\u05e8\u05ea \u05e9\u05d3\u05d5\u05ea \u05e8\u05d9\u05e7\u05d9\u05dd \u05e9\u05d5\u05de\u05e8\u05d5\u05ea \u05e2\u05dc payload \u05e0\u05e7\u05d9 \u05dc\u05e7\u05d5\u05d3 \u05d5\u05dc\u2011LLM \u05db\u05d0\u05d7\u05d3.',
          '\u05de\u05e2\u05d3\u05d9\u05e4\u05d9\u05dd \u05e9\u05e4\u05d4 \u05d8\u05d1\u05e2\u05d9\u05ea? \u05d0\u05d5\u05ea\u05d5 API \u05d6\u05de\u05d9\u05df \u05dc\u05e1\u05d5\u05db\u05e0\u05d9 AI \u05d3\u05e8\u05da <a href="' + MCP + '" style="color:#25D366">\u05e9\u05e8\u05ea \u05d4\u2011WhatsApp MCP</a> \u05d5\u2011<a href="' + AI_AGENTS + '" style="color:#25D366">WhatsApp API \u05dc\u05e1\u05d5\u05db\u05e0\u05d9 AI</a>.',
        ],
      },
      {
        title: '\u05d4\u05ea\u05d7\u05d9\u05dc\u05d5 \u05dc\u05d1\u05e0\u05d5\u05ea',
        text: '\u05e6\u05e8\u05d5 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd, \u05e7\u05d1\u05dc\u05d5 \u05d0\u05ea \u05d4\u05d8\u05d5\u05e7\u05df \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8 \u05de\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u2190 \u05db\u05dc\u05dc\u05d9, \u05d5\u05d1\u05e6\u05e2\u05d5 \u05d0\u05ea \u05e7\u05e8\u05d9\u05d0\u05ea \u05d4\u2011API \u05d4\u05e8\u05d0\u05e9\u05d5\u05e0\u05d4 \u05ea\u05d5\u05da \u05d3\u05e7\u05d5\u05ea.',
        primary: { label: '\u05e6\u05d5\u05e8 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd \u2192' },
        secondary: { label: '\u05e8\u05e4\u05e8\u05e0\u05e1 API \u05de\u05dc\u05d0 \u2192' },
      },
    ],
    faq: [
      { q: '\u05de\u05d4\u05d9 \u05db\u05ea\u05d5\u05d1\u05ea \u05d4\u05d1\u05e1\u05d9\u05e1 \u05e9\u05dc \u05d4\u2011API \u05d5\u05d0\u05d9\u05da \u05de\u05ea\u05d0\u05de\u05ea\u05d9\u05dd?', a: '\u05db\u05ea\u05d5\u05d1\u05ea \u05d4\u05d1\u05e1\u05d9\u05e1 \u05d4\u05d9\u05d0 https://api.gambot.co.il/api/v1. \u05d4\u05ea\u05d0\u05de\u05ea\u05d5 \u05e2\u05dd \u05d8\u05d5\u05e7\u05df \u05d4\u05d0\u05e8\u05d2\u05d5\u05df \u05e9\u05dc\u05db\u05dd \u05d1\u05d2\u05de\u05d1\u05d5\u05d8 (gmbt_\u2026) \u05d3\u05e8\u05da Authorization: Bearer, \u05db\u05d5\u05ea\u05e8\u05ea X-Api-Key, \u05d0\u05d5 \u05e4\u05e8\u05de\u05d8\u05e8 api_key \u05d1\u05e9\u05d0\u05d9\u05dc\u05ea\u05d4. \u05e0\u05d9\u05ea\u05df \u05dc\u05d4\u05d2\u05d1\u05d9\u05dc \u05d8\u05d5\u05e7\u05e0\u05d9\u05dd \u05dc\u05d4\u05e8\u05e9\u05d0\u05d5\u05ea.' },
      { q: '\u05d4\u05d0\u05dd \u05e6\u05e8\u05d9\u05da \u05d7\u05e9\u05d1\u05d5\u05df Meta / WhatsApp Business API \u05de\u05e9\u05dc\u05d9?', a: '\u05dc\u05d0. \u05d2\u05de\u05d1\u05d5\u05d8 \u05d4\u05d9\u05d0 \u05e1\u05e4\u05e7\u05d9\u05ea \u05e4\u05ea\u05e8\u05d5\u05e0\u05d5\u05ea \u05e2\u05e1\u05e7\u05d9\u05d9\u05dd \u05e8\u05e9\u05de\u05d9\u05ea \u05e9\u05dc Meta \u05d5\u05de\u05e0\u05d4\u05dc\u05ea \u05e2\u05d1\u05d5\u05e8\u05db\u05dd \u05d0\u05ea \u05d4\u2011WhatsApp Business (Cloud) API \u2014 \u05db\u05d5\u05dc\u05dc \u05d4\u05d2\u05e9\u05ea \u05ea\u05d1\u05e0\u05d9\u05d5\u05ea \u05d5\u05d4\u05e7\u05e6\u05d0\u05ea \u05de\u05e1\u05e4\u05e8\u05d9\u05dd \u05d1\u05de\u05d4\u05dc\u05da \u05d4\u05d4\u05e6\u05d8\u05e8\u05e4\u05d5\u05ea.' },
      { q: '\u05d0\u05d9\u05da \u05de\u05d1\u05e0\u05d4 \u05d4\u05e9\u05d2\u05d9\u05d0\u05d5\u05ea?', a: '\u05d4\u05ea\u05d2\u05d5\u05d1\u05d5\u05ea \u05de\u05e9\u05ea\u05de\u05e9\u05d5\u05ea \u05d1\u2011{ success, message, data }. \u05e9\u05d2\u05d9\u05d0\u05d5\u05ea \u05db\u05d5\u05dc\u05dc\u05d5\u05ea \u05d2\u05dd code \u05d9\u05e6\u05d9\u05d1 \u05d5\u05e7\u05e8\u05d9\u05d0 \u05dc\u05de\u05db\u05d5\u05e0\u05d4 (\u05dc\u05de\u05e9\u05dc CONVERSATION_WINDOW_CLOSED, MISSING_TEMPLATE_VARIABLES, INVALID_PHONE_NUMBER) \u05d5\u05d1\u05de\u05e7\u05e8\u05d4 \u05d4\u05e6\u05d5\u05e8\u05da \u05d2\u05dd \u05d0\u05d5\u05d1\u05d9\u05d9\u05e7\u05d8 data \u05e2\u05dd \u05d3\u05d2\u05dc\u05d9 \u05de\u05e6\u05d1 \u05e9\u05e2\u05d5\u05d6\u05e8\u05d9\u05dd \u05dc\u05d4\u05ea\u05d0\u05d5\u05e9\u05e9.' },
      { q: '\u05d4\u05d0\u05dd \u05d0\u05e4\u05e9\u05e8 \u05dc\u05e7\u05d1\u05dc \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea \u05e0\u05db\u05e0\u05e1\u05d5\u05ea?', a: '\u05db\u05df \u2014 \u05d4\u05d2\u05d3\u05d9\u05e8\u05d5 webhook \u05e9\u05d9\u05e2\u05d1\u05d9\u05e8 \u05d0\u05d9\u05e8\u05d5\u05e2\u05d9 \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05e0\u05db\u05e0\u05e1\u05d9\u05dd \u05dc\u05e0\u05e7\u05d5\u05d3\u05ea \u05d4\u05e7\u05e6\u05d4 \u05e9\u05dc\u05db\u05dd, \u05d5\u05e7\u05d9\u05e8\u05d0\u05d5 \u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d4 \u05e2\u05dd \u05e0\u05e7\u05d5\u05d3\u05d5\u05ea \u05d4\u05e7\u05e6\u05d4 \u05e9\u05dc \u05d4\u05e9\u05d9\u05d7\u05d5\u05ea.' },
      { q: '\u05d4\u05d0\u05dd \u05d9\u05e9 \u05d0\u05e4\u05e9\u05e8\u05d5\u05ea MCP \u05dc\u05e1\u05d5\u05db\u05e0\u05d9 AI?', a: '\u05db\u05df. \u05e9\u05e8\u05ea \u05d4\u2011MCP \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8 \u05d7\u05d5\u05e9\u05e3 \u05d0\u05ea \u05d0\u05d5\u05ea\u05d4 \u05e4\u05d5\u05e0\u05e7\u05e6\u05d9\u05d5\u05e0\u05dc\u05d9\u05d5\u05ea \u05db\u05db\u05dc\u05d9\u05dd \u05d9\u05d3\u05d9\u05d3\u05d5\u05ea\u05d9\u05d9\u05dd \u05dc\u2011AI \u05e2\u05d1\u05d5\u05e8 ChatGPT, Claude, Gemini \u05d5\u2011Cursor. \u05e8\u05d0\u05d5 \u05d0\u05ea \u05d3\u05e3 \u05d4\u2011WhatsApp MCP.' },
    ],
  },
};

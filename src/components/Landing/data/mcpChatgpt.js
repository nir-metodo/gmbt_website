import {
  SIGNUP, DOCS, MCP, GITHUB, HOSTED_MCP, HOME, CRUMB_MCP,
  ctaCreate,
} from './_common';

export const data = {
  pageKey: 'whatsapp-mcp-chatgpt',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp MCP for ChatGPT \u2014 Send WhatsApp from ChatGPT | Gambot',
    appName: 'Gambot WhatsApp MCP for ChatGPT',
    description:
      'Connect WhatsApp to ChatGPT with the Gambot MCP server. Add the hosted Gambot connector (Streamable HTTP + OAuth) so ChatGPT can send WhatsApp messages, templates and campaigns on the official WhatsApp Business API.',
    keywords:
      'WhatsApp MCP ChatGPT, connect WhatsApp to ChatGPT, ChatGPT WhatsApp MCP, ChatGPT WhatsApp connector, WhatsApp API ChatGPT, gambot-mcp ChatGPT',
    canonical: 'https://gambot.co.il/whatsapp-mcp/chatgpt/',
    ogTitle: 'WhatsApp MCP for ChatGPT',
    ogDescription: 'Add the hosted Gambot WhatsApp MCP connector to ChatGPT and send WhatsApp from your chats.',
  },
  breadcrumbs: [HOME, CRUMB_MCP, { name: 'ChatGPT', item: 'https://gambot.co.il/whatsapp-mcp/chatgpt/' }],
  hero: {
    badge: 'Model Context Protocol · ChatGPT',
    h1: 'WhatsApp MCP for ChatGPT',
    subhead:
      'Give <strong style="color:#e9edef">ChatGPT</strong> a real WhatsApp Business API. Add the hosted Gambot MCP connector, authorize with your token, and ask ChatGPT to send WhatsApp messages, templates and campaigns.',
    primary: ctaCreate,
    secondary: { label: 'WhatsApp MCP overview', href: MCP, event: 'mcp_cta_click' },
    chips: ['Remote connector', 'Streamable HTTP', 'OAuth', 'Hosted \u2014 no install'],
  },
  blocks: [
    {
      type: 'bullets',
      title: 'What this enables',
      bullets: [
        'Ask ChatGPT to send a WhatsApp free-text message (inside the 24h window) or an approved template.',
        'Create, schedule and run WhatsApp campaigns; read delivery status and results.',
        'Analyze activity \u2014 messages received/sent, conversations waiting for a reply, leads, campaign performance.',
        'ChatGPT gets structured states and recommended next actions, so it recovers correctly instead of failing on raw errors.',
      ],
    },
    {
      type: 'bullets',
      title: 'Requirements',
      bullets: [
        'A Gambot account with WhatsApp connected (<a href="' + SIGNUP + '" style="color:#25D366">create one free</a>).',
        'Your Gambot token (<code>gmbt_\u2026</code>) from Gambot \u2192 <strong style="color:#e9edef">Settings \u2192 General</strong>.',
        'A ChatGPT plan/mode that supports custom MCP connectors (remote MCP servers).',
      ],
    },
    {
      type: 'steps',
      title: 'Setup',
      steps: [
        { title: 'Open connectors', text: 'In ChatGPT, go to the connectors / MCP settings and choose to add a custom connector (remote MCP server).' },
        { title: 'Add the hosted URL', text: 'Paste the Gambot MCP URL below as the server endpoint.' },
        { title: 'Authorize', text: 'Complete the OAuth consent using your Gambot token \u2014 nothing to install locally.' },
        { title: 'Use it', text: 'Start a chat, confirm the gambot tools are enabled, and ask ChatGPT to send a WhatsApp message.' },
      ],
    },
    {
      type: 'code',
      title: 'Hosted MCP URL',
      code: HOSTED_MCP,
    },
    {
      type: 'prompts',
      title: 'Example prompts',
      prompts: [
        { user: 'Send a WhatsApp order confirmation template to this customer.' },
        { user: 'How many WhatsApp messages did we receive today, and how many were new leads?' },
        { user: 'Follow up with leads that haven\u2019t replied in 48 hours.' },
        { user: 'How did yesterday\u2019s campaign perform?' },
      ],
    },
    {
      type: 'bullets',
      title: 'Troubleshooting',
      bullets: [
        '<strong style="color:#e9edef">No custom connector option?</strong> Custom MCP connectors require a supported ChatGPT plan/mode; check your account\u2019s connector settings.',
        '<strong style="color:#e9edef">AUTHENTICATION_REQUIRED?</strong> Re-run the OAuth consent and verify the gmbt_ token from Settings \u2192 General.',
        '<strong style="color:#e9edef">CONVERSATION_WINDOW_CLOSED?</strong> Expected when the 24h window is closed \u2014 ChatGPT should send an approved template instead.',
        '<strong style="color:#e9edef">Connection fails?</strong> Confirm the hosted URL is exactly ' + HOSTED_MCP + '.',
      ],
    },
    {
      type: 'bullets',
      title: 'Related',
      bullets: [
        '<a href="' + MCP + '" style="color:#25D366">WhatsApp MCP overview</a> \u2014 the full server, tools and local option.',
        '<a href="https://gambot.co.il/whatsapp-mcp/claude/" style="color:#25D366">Claude</a>, <a href="https://gambot.co.il/whatsapp-mcp/cursor/" style="color:#25D366">Cursor</a> and <a href="https://gambot.co.il/whatsapp-mcp/gemini/" style="color:#25D366">Gemini</a> setup guides.',
        '<a href="' + DOCS + '" style="color:#25D366">API docs</a> and <a href="' + GITHUB + '" style="color:#25D366">gambot-mcp on GitHub</a>.',
      ],
    },
    {
      type: 'cta',
      title: 'Connect WhatsApp to ChatGPT',
      text: 'Create a free Gambot account, grab your token, and add the hosted connector in minutes.',
      primary: ctaCreate,
      secondary: { label: 'Read the API docs', href: DOCS, event: 'developer_docs_click' },
    },
  ],
  faq: [
    { q: 'How does ChatGPT connect to WhatsApp?', a: 'Through the hosted Gambot MCP server (Streamable HTTP). Add it as a custom connector in ChatGPT and authorize with OAuth using your Gambot token; ChatGPT then gets WhatsApp tools.' },
    { q: 'Do I need to install anything?', a: 'No. The hosted option requires no local install \u2014 just add the URL (' + HOSTED_MCP + ') and authenticate.' },
    { q: 'Which ChatGPT plans support this?', a: 'Any ChatGPT experience that supports custom MCP connectors / remote MCP servers. Check your account\u2019s connector settings.' },
    { q: 'Is it the official WhatsApp API?', a: 'Yes \u2014 Gambot is an official Meta Business Solution Provider running on the authorized WhatsApp Business (Cloud) API.' },
  ],
  he: {
    hero: {
      badge: 'Model Context Protocol · ChatGPT',
      h1: 'WhatsApp MCP \u05dc\u2011ChatGPT',
      subhead:
        '\u05ea\u05e0\u05d5 \u05dc\u2011<strong style="color:#e9edef">ChatGPT</strong> \u05d2\u05d9\u05e9\u05d4 \u05dc\u2011WhatsApp Business API \u05d0\u05de\u05d9\u05ea\u05d9. \u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05d0\u05ea \u05de\u05d7\u05d1\u05e8 \u05d4\u2011MCP \u05d4\u05de\u05ea\u05d0\u05e8\u05d7 \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8, \u05d0\u05e9\u05e8\u05d5 \u05e2\u05dd \u05d4\u05d8\u05d5\u05e7\u05df, \u05d5\u05d1\u05e7\u05e9\u05d5 \u05de\u2011ChatGPT \u05dc\u05e9\u05dc\u05d5\u05d7 \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea, \u05ea\u05d1\u05e0\u05d9\u05d5\u05ea \u05d5\u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd \u05d1\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4.',
      primary: { label: '\u05e6\u05d5\u05e8 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd \u2192' },
      secondary: { label: '\u05e1\u05e7\u05d9\u05e8\u05ea WhatsApp MCP' },
      chips: ['\u05de\u05d7\u05d1\u05e8 \u05de\u05e8\u05d5\u05d7\u05e7', 'Streamable HTTP', 'OAuth', '\u05de\u05ea\u05d0\u05e8\u05d7 \u2014 \u05dc\u05dc\u05d0 \u05d4\u05ea\u05e7\u05e0\u05d4'],
    },
    blocks: [
      {
        title: '\u05de\u05d4 \u05d6\u05d4 \u05de\u05d0\u05e4\u05e9\u05e8',
        bullets: [
          '\u05dc\u05d1\u05e7\u05e9 \u05de\u2011ChatGPT \u05dc\u05e9\u05dc\u05d5\u05d7 \u05d4\u05d5\u05d3\u05e2\u05ea \u05d8\u05e7\u05e1\u05d8 \u05d7\u05d5\u05e4\u05e9\u05d9 \u05d1\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 (\u05d1\u05ea\u05d5\u05da \u05d7\u05dc\u05d5\u05df 24 \u05d4\u05e9\u05e2\u05d5\u05ea) \u05d0\u05d5 \u05ea\u05d1\u05e0\u05d9\u05ea \u05de\u05d0\u05d5\u05e9\u05e8\u05ea.',
          '\u05dc\u05d9\u05e6\u05d5\u05e8, \u05dc\u05ea\u05d6\u05de\u05df \u05d5\u05dc\u05d4\u05e8\u05d9\u05e5 \u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd \u05d1\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4; \u05dc\u05e7\u05e8\u05d5\u05d0 \u05e1\u05d8\u05d8\u05d5\u05e1 \u05de\u05e1\u05d9\u05e8\u05d4 \u05d5\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea.',
          '\u05dc\u05e0\u05ea\u05d7 \u05e4\u05e2\u05d9\u05dc\u05d5\u05ea \u2014 \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea \u05e9\u05d4\u05ea\u05e7\u05d1\u05dc\u05d5/\u05e0\u05e9\u05dc\u05d7\u05d5, \u05e9\u05d9\u05d7\u05d5\u05ea \u05e9\u05de\u05de\u05ea\u05d9\u05e0\u05d5\u05ea \u05dc\u05de\u05e2\u05e0\u05d4, \u05dc\u05d9\u05d3\u05d9\u05dd \u05d5\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9 \u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd.',
          'ChatGPT \u05de\u05e7\u05d1\u05dc \u05de\u05e6\u05d1\u05d9\u05dd \u05de\u05d5\u05d1\u05e0\u05d9\u05dd \u05d5\u05e6\u05e2\u05d3\u05d9\u05dd \u05de\u05d5\u05de\u05dc\u05e6\u05d9\u05dd, \u05db\u05da \u05e9\u05d4\u05d5\u05d0 \u05de\u05ea\u05d0\u05d5\u05e9\u05e9 \u05e0\u05db\u05d5\u05df \u05d1\u05de\u05e7\u05d5\u05dd \u05dc\u05d4\u05d9\u05db\u05e9\u05dc \u05e2\u05dc \u05e9\u05d2\u05d9\u05d0\u05d5\u05ea \u05d2\u05d5\u05dc\u05de\u05d9\u05d5\u05ea.',
        ],
      },
      {
        title: '\u05d3\u05e8\u05d9\u05e9\u05d5\u05ea',
        bullets: [
          '\u05d7\u05e9\u05d1\u05d5\u05df \u05d2\u05de\u05d1\u05d5\u05d8 \u05e2\u05dd \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05de\u05d7\u05d5\u05d1\u05e8 (<a href="' + SIGNUP + '" style="color:#25D366">\u05e6\u05e8\u05d5 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd</a>).',
          '\u05d4\u05d8\u05d5\u05e7\u05df \u05e9\u05dc\u05db\u05dd \u05d1\u05d2\u05de\u05d1\u05d5\u05d8 (<code>gmbt_\u2026</code>) \u05de\u05ea\u05d5\u05da \u05d2\u05de\u05d1\u05d5\u05d8 \u2190 <strong style="color:#e9edef">\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u2190 \u05db\u05dc\u05dc\u05d9</strong>.',
          '\u05ea\u05d5\u05db\u05e0\u05d9\u05ea/\u05de\u05e6\u05d1 \u05d1\u2011ChatGPT \u05e9\u05ea\u05d5\u05de\u05da \u05d1\u05de\u05d7\u05d1\u05e8\u05d9 MCP \u05de\u05d5\u05ea\u05d0\u05de\u05d9\u05dd \u05d0\u05d9\u05e9\u05d9\u05ea (\u05e9\u05e8\u05ea\u05d9 MCP \u05de\u05e8\u05d5\u05d7\u05e7\u05d9\u05dd).',
        ],
      },
      {
        title: '\u05d4\u05ea\u05e7\u05e0\u05d4',
        steps: [
          { title: '\u05e4\u05ea\u05d7\u05d5 \u05d0\u05ea \u05d4\u05de\u05d7\u05d1\u05e8\u05d9\u05dd', text: '\u05d1\u2011ChatGPT, \u05e2\u05d1\u05e8\u05d5 \u05dc\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05d4\u05de\u05d7\u05d1\u05e8\u05d9\u05dd / MCP \u05d5\u05d1\u05d7\u05e8\u05d5 \u05dc\u05d4\u05d5\u05e1\u05d9\u05e3 \u05de\u05d7\u05d1\u05e8 \u05de\u05d5\u05ea\u05d0\u05dd \u05d0\u05d9\u05e9\u05d9\u05ea (\u05e9\u05e8\u05ea MCP \u05de\u05e8\u05d5\u05d7\u05e7).' },
          { title: '\u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05d0\u05ea \u05d4\u2011URL \u05d4\u05de\u05ea\u05d0\u05e8\u05d7', text: '\u05d4\u05d3\u05d1\u05d9\u05e7\u05d5 \u05d0\u05ea \u05db\u05ea\u05d5\u05d1\u05ea \u05d4\u2011MCP \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8 \u05e9\u05dc\u05de\u05d8\u05d4 \u05db\u05e0\u05e7\u05d5\u05d3\u05ea \u05d4\u05e7\u05e6\u05d4 \u05e9\u05dc \u05d4\u05e9\u05e8\u05ea.' },
          { title: '\u05d0\u05e9\u05e8\u05d5', text: '\u05d4\u05e9\u05dc\u05d9\u05de\u05d5 \u05d0\u05ea \u05d4\u05e1\u05db\u05de\u05ea \u05d4\u2011OAuth \u05e2\u05dd \u05d4\u05d8\u05d5\u05e7\u05df \u05e9\u05dc\u05db\u05dd \u2014 \u05d0\u05d9\u05df \u05de\u05d4 \u05dc\u05d4\u05ea\u05e7\u05d9\u05df \u05de\u05e7\u05d5\u05de\u05d9\u05ea.' },
          { title: '\u05d4\u05e9\u05ea\u05de\u05e9\u05d5', text: '\u05e4\u05ea\u05d7\u05d5 \u05e6\u05f3\u05d0\u05d8, \u05d5\u05d3\u05d0\u05d5 \u05e9\u05db\u05dc\u05d9 gambot \u05de\u05d5\u05e4\u05e2\u05dc\u05d9\u05dd, \u05d5\u05d1\u05e7\u05e9\u05d5 \u05de\u2011ChatGPT \u05dc\u05e9\u05dc\u05d5\u05d7 \u05d4\u05d5\u05d3\u05e2\u05ea \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4.' },
        ],
      },
      { title: '\u05db\u05ea\u05d5\u05d1\u05ea MCP \u05de\u05ea\u05d0\u05e8\u05d7\u05ea' },
      {
        title: '\u05d3\u05d5\u05d2\u05de\u05d0\u05d5\u05ea \u05dc\u05d1\u05e7\u05e9\u05d5\u05ea',
        prompts: [
          { user: '\u05e9\u05dc\u05d7 \u05dc\u05dc\u05e7\u05d5\u05d7 \u05d4\u05d6\u05d4 \u05ea\u05d1\u05e0\u05d9\u05ea \u05d0\u05d9\u05e9\u05d5\u05e8 \u05d4\u05d6\u05de\u05e0\u05d4 \u05d1\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4.' },
          { user: '\u05db\u05de\u05d4 \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05e7\u05d9\u05d1\u05dc\u05e0\u05d5 \u05d4\u05d9\u05d5\u05dd, \u05d5\u05db\u05de\u05d4 \u05de\u05d4\u05dd \u05dc\u05d9\u05d3\u05d9\u05dd \u05d7\u05d3\u05e9\u05d9\u05dd?' },
          { user: '\u05e2\u05e9\u05d4 \u05de\u05e2\u05e7\u05d1 \u05de\u05d5\u05dc \u05dc\u05d9\u05d3\u05d9\u05dd \u05e9\u05dc\u05d0 \u05d4\u05d2\u05d9\u05d1\u05d5 \u05db\u05d1\u05e8 48 \u05e9\u05e2\u05d5\u05ea.' },
          { user: '\u05d0\u05d9\u05da \u05d4\u05e6\u05dc\u05d9\u05d7 \u05d4\u05e7\u05de\u05e4\u05d9\u05d9\u05df \u05e9\u05dc \u05d0\u05ea\u05de\u05d5\u05dc?' },
        ],
      },
      {
        title: '\u05e4\u05ea\u05e8\u05d5\u05df \u05ea\u05e7\u05dc\u05d5\u05ea',
        bullets: [
          '<strong style="color:#e9edef">\u05d0\u05d9\u05df \u05d0\u05e4\u05e9\u05e8\u05d5\u05ea \u05dc\u05de\u05d7\u05d1\u05e8 \u05de\u05d5\u05ea\u05d0\u05dd?</strong> \u05de\u05d7\u05d1\u05e8\u05d9 MCP \u05de\u05d5\u05ea\u05d0\u05de\u05d9\u05dd \u05d3\u05d5\u05e8\u05e9\u05d9\u05dd \u05ea\u05d5\u05db\u05e0\u05d9\u05ea/\u05de\u05e6\u05d1 \u05e0\u05ea\u05de\u05da \u05d1\u2011ChatGPT; \u05d1\u05d3\u05e7\u05d5 \u05d0\u05ea \u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05d4\u05de\u05d7\u05d1\u05e8\u05d9\u05dd \u05d1\u05d7\u05e9\u05d1\u05d5\u05df \u05e9\u05dc\u05db\u05dd.',
          '<strong style="color:#e9edef">AUTHENTICATION_REQUIRED?</strong> \u05d4\u05e8\u05d9\u05e6\u05d5 \u05de\u05d7\u05d3\u05e9 \u05d0\u05ea \u05d4\u05e1\u05db\u05de\u05ea \u05d4\u2011OAuth \u05d5\u05d5\u05d3\u05d0\u05d5 \u05d0\u05ea \u05d4\u05d8\u05d5\u05e7\u05df gmbt_ \u05de\u05ea\u05d5\u05da \u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u2190 \u05db\u05dc\u05dc\u05d9.',
          '<strong style="color:#e9edef">CONVERSATION_WINDOW_CLOSED?</strong> \u05e6\u05e4\u05d5\u05d9 \u05db\u05e9\u05d7\u05dc\u05d5\u05df 24 \u05d4\u05e9\u05e2\u05d5\u05ea \u05e1\u05d2\u05d5\u05e8 \u2014 ChatGPT \u05d0\u05de\u05d5\u05e8 \u05dc\u05e9\u05dc\u05d5\u05d7 \u05ea\u05d1\u05e0\u05d9\u05ea \u05de\u05d0\u05d5\u05e9\u05e8\u05ea \u05d1\u05de\u05e7\u05d5\u05dd.',
          '<strong style="color:#e9edef">\u05d4\u05d7\u05d9\u05d1\u05d5\u05e8 \u05e0\u05db\u05e9\u05dc?</strong> \u05d5\u05d3\u05d0\u05d5 \u05e9\u05d4\u2011URL \u05d4\u05de\u05ea\u05d0\u05e8\u05d7 \u05d4\u05d5\u05d0 \u05d1\u05d3\u05d9\u05d5\u05e7 ' + HOSTED_MCP + '.',
        ],
      },
      {
        title: '\u05e7\u05d9\u05e9\u05d5\u05e8\u05d9\u05dd \u05e0\u05d5\u05e1\u05e4\u05d9\u05dd',
        bullets: [
          '<a href="' + MCP + '" style="color:#25D366">\u05e1\u05e7\u05d9\u05e8\u05ea WhatsApp MCP</a> \u2014 \u05d4\u05e9\u05e8\u05ea \u05d4\u05de\u05dc\u05d0, \u05d4\u05db\u05dc\u05d9\u05dd \u05d5\u05d4\u05d0\u05e4\u05e9\u05e8\u05d5\u05ea \u05d4\u05de\u05e7\u05d5\u05de\u05d9\u05ea.',
          '\u05de\u05d3\u05e8\u05d9\u05db\u05d9 \u05d4\u05d2\u05d3\u05e8\u05d4 \u05dc\u2011<a href="https://gambot.co.il/whatsapp-mcp/claude/" style="color:#25D366">Claude</a>, <a href="https://gambot.co.il/whatsapp-mcp/cursor/" style="color:#25D366">Cursor</a> \u05d5\u2011<a href="https://gambot.co.il/whatsapp-mcp/gemini/" style="color:#25D366">Gemini</a>.',
          '<a href="' + DOCS + '" style="color:#25D366">\u05ea\u05d9\u05e2\u05d5\u05d3 API</a> \u05d5\u2011<a href="' + GITHUB + '" style="color:#25D366">gambot-mcp \u05d1\u2011GitHub</a>.',
        ],
      },
      {
        title: '\u05d7\u05d1\u05e8\u05d5 \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05dc\u2011ChatGPT',
        text: '\u05e6\u05e8\u05d5 \u05d7\u05e9\u05d1\u05d5\u05df \u05d2\u05de\u05d1\u05d5\u05d8 \u05d7\u05d9\u05e0\u05dd, \u05e7\u05d1\u05dc\u05d5 \u05d0\u05ea \u05d4\u05d8\u05d5\u05e7\u05df, \u05d5\u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05d0\u05ea \u05d4\u05de\u05d7\u05d1\u05e8 \u05d4\u05de\u05ea\u05d0\u05e8\u05d7 \u05ea\u05d5\u05da \u05d3\u05e7\u05d5\u05ea.',
        primary: { label: '\u05e6\u05d5\u05e8 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd \u2192' },
        secondary: { label: '\u05e7\u05e8\u05d0 \u05d0\u05ea \u05ea\u05d9\u05e2\u05d5\u05d3 \u05d4\u2011API' },
      },
    ],
    faq: [
      { q: '\u05d0\u05d9\u05da ChatGPT \u05de\u05ea\u05d7\u05d1\u05e8 \u05dc\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4?', a: '\u05d3\u05e8\u05da \u05e9\u05e8\u05ea \u05d4\u2011MCP \u05d4\u05de\u05ea\u05d0\u05e8\u05d7 \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8 (Streamable HTTP). \u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05d0\u05d5\u05ea\u05d5 \u05db\u05de\u05d7\u05d1\u05e8 \u05de\u05d5\u05ea\u05d0\u05dd \u05d1\u2011ChatGPT \u05d5\u05d0\u05e9\u05e8\u05d5 \u05d1\u2011OAuth \u05e2\u05dd \u05d4\u05d8\u05d5\u05e7\u05df \u05e9\u05dc\u05db\u05dd; ChatGPT \u05de\u05e7\u05d1\u05dc \u05d0\u05d6 \u05db\u05dc\u05d9 \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4.' },
      { q: '\u05d4\u05d0\u05dd \u05e6\u05e8\u05d9\u05da \u05dc\u05d4\u05ea\u05e7\u05d9\u05df \u05de\u05e9\u05d4\u05d5?', a: '\u05dc\u05d0. \u05d4\u05d0\u05e4\u05e9\u05e8\u05d5\u05ea \u05d4\u05de\u05ea\u05d0\u05e8\u05d7\u05ea \u05dc\u05d0 \u05d3\u05d5\u05e8\u05e9\u05ea \u05d4\u05ea\u05e7\u05e0\u05d4 \u05de\u05e7\u05d5\u05de\u05d9\u05ea \u2014 \u05e8\u05e7 \u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05d0\u05ea \u05d4\u2011URL (' + HOSTED_MCP + ') \u05d5\u05d4\u05ea\u05d0\u05de\u05ea\u05d5.' },
      { q: '\u05d0\u05d9\u05dc\u05d5 \u05ea\u05d5\u05db\u05e0\u05d9\u05d5\u05ea ChatGPT \u05ea\u05d5\u05de\u05db\u05d5\u05ea \u05d1\u05d6\u05d4?', a: '\u05db\u05dc \u05d7\u05d5\u05d5\u05d9\u05d9\u05ea ChatGPT \u05e9\u05ea\u05d5\u05de\u05db\u05ea \u05d1\u05de\u05d7\u05d1\u05e8\u05d9 MCP \u05de\u05d5\u05ea\u05d0\u05de\u05d9\u05dd / \u05e9\u05e8\u05ea\u05d9 MCP \u05de\u05e8\u05d5\u05d7\u05e7\u05d9\u05dd. \u05d1\u05d3\u05e7\u05d5 \u05d0\u05ea \u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05d4\u05de\u05d7\u05d1\u05e8\u05d9\u05dd \u05d1\u05d7\u05e9\u05d1\u05d5\u05df \u05e9\u05dc\u05db\u05dd.' },
      { q: '\u05d4\u05d0\u05dd \u05d6\u05d4 \u05d4\u2011WhatsApp API \u05d4\u05e8\u05e9\u05de\u05d9?', a: '\u05db\u05df \u2014 \u05d2\u05de\u05d1\u05d5\u05d8 \u05d4\u05d9\u05d0 \u05e1\u05e4\u05e7\u05d9\u05ea \u05e4\u05ea\u05e8\u05d5\u05e0\u05d5\u05ea \u05e2\u05e1\u05e7\u05d9\u05d9\u05dd \u05e8\u05e9\u05de\u05d9\u05ea \u05e9\u05dc Meta, \u05d4\u05e4\u05d5\u05e2\u05dc\u05ea \u05e2\u05dc WhatsApp Business (Cloud) API \u05d4\u05de\u05d5\u05e8\u05e9\u05d4.' },
    ],
  },
};

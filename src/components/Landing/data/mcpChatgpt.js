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
};

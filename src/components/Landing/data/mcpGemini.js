import {
  SIGNUP, DOCS, MCP, GITHUB, HOME, CRUMB_MCP,
  ctaCreate,
} from './_common';

const GEMINI_CONFIG = `{
  "mcpServers": {
    "gambot": {
      "command": "npx",
      "args": ["-y", "gambot-mcp"],
      "env": {
        "GAMBOT_TOKEN": "gmbt_your_token_here"
      }
    }
  }
}`;

export const data = {
  pageKey: 'whatsapp-mcp-gemini',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp MCP for Gemini \u2014 Send WhatsApp from Gemini | Gambot',
    appName: 'Gambot WhatsApp MCP for Gemini',
    description:
      'Connect WhatsApp to Gemini with the Gambot MCP server. Add it to the Gemini CLI settings (stdio, npx) and let Gemini send WhatsApp messages, templates and campaigns on the official WhatsApp Business API.',
    keywords:
      'WhatsApp MCP Gemini, connect WhatsApp to Gemini, Gemini WhatsApp MCP, Gemini CLI MCP WhatsApp, WhatsApp API Gemini, gambot-mcp Gemini',
    canonical: 'https://gambot.co.il/whatsapp-mcp/gemini/',
    ogTitle: 'WhatsApp MCP for Gemini',
    ogDescription: 'Add the Gambot WhatsApp MCP server to the Gemini CLI and send WhatsApp.',
  },
  breadcrumbs: [HOME, CRUMB_MCP, { name: 'Gemini', item: 'https://gambot.co.il/whatsapp-mcp/gemini/' }],
  hero: {
    badge: 'Model Context Protocol · Gemini',
    h1: 'WhatsApp MCP for Gemini',
    subhead:
      'Give <strong style="color:#e9edef">Gemini</strong> a real WhatsApp Business API. Register the Gambot MCP server in your Gemini CLI settings, add your token, and ask Gemini to send WhatsApp messages, templates and campaigns.',
    primary: ctaCreate,
    secondary: { label: 'WhatsApp MCP overview', href: MCP, event: 'mcp_cta_click' },
    chips: ['Gemini CLI', 'settings.json', 'npx gambot-mcp', 'stdio'],
  },
  blocks: [
    {
      type: 'bullets',
      title: 'What this enables',
      bullets: [
        'Ask Gemini to send a WhatsApp free-text message (inside the 24h window) or an approved template.',
        'Create, schedule and run WhatsApp campaigns; read delivery status and results.',
        'Query analytics and manage contacts, leads, cases and tasks from the command line.',
        'Gemini receives structured states and next-action guidance, so it recovers correctly (e.g. template when the window is closed).',
      ],
    },
    {
      type: 'bullets',
      title: 'Requirements',
      bullets: [
        'A Gambot account with WhatsApp connected (<a href="' + SIGNUP + '" style="color:#25D366">create one free</a>).',
        'Your Gambot token (<code>gmbt_\u2026</code>) from Gambot \u2192 <strong style="color:#e9edef">Settings \u2192 General</strong>.',
        'The Gemini CLI (or a Gemini client that supports MCP servers) and Node.js 18+.',
      ],
    },
    {
      type: 'steps',
      title: 'Setup',
      steps: [
        { title: 'Open Gemini settings', text: 'Edit your Gemini CLI settings file (e.g. ~/.gemini/settings.json) that holds the mcpServers map.' },
        { title: 'Register the gambot server', text: 'Add the block below, using command npx and args ["-y","gambot-mcp"].' },
        { title: 'Authenticate', text: 'Set GAMBOT_TOKEN to your gmbt_ token; the organization resolves automatically.' },
        { title: 'Use it', text: 'Start Gemini, confirm the gambot tools are discovered, and ask it to send a WhatsApp message.' },
      ],
    },
    {
      type: 'code',
      title: 'Configuration (Gemini settings.json \u2192 mcpServers)',
      code: GEMINI_CONFIG,
    },
    {
      type: 'prompts',
      title: 'Example prompts',
      prompts: [
        { user: 'Send the appointment_reminder template to +972 50-123-4567.' },
        { user: 'List conversations waiting for a reply and summarize them.' },
        { user: 'Schedule a WhatsApp campaign to the \u201cnewsletter\u201d tag for Monday 09:00.' },
        { user: 'What were the most common customer questions today?' },
      ],
    },
    {
      type: 'bullets',
      title: 'Troubleshooting',
      bullets: [
        '<strong style="color:#e9edef">Server not detected?</strong> Confirm the mcpServers block is valid JSON and restart the Gemini CLI.',
        '<strong style="color:#e9edef">AUTHENTICATION_REQUIRED?</strong> Re-copy the gmbt_ token from Settings \u2192 General.',
        '<strong style="color:#e9edef">CONVERSATION_WINDOW_CLOSED?</strong> Expected when the 24h window is closed \u2014 Gemini should send an approved template instead.',
        '<strong style="color:#e9edef">npx not found?</strong> Ensure Node.js 18+ is installed and on PATH.',
      ],
    },
    {
      type: 'bullets',
      title: 'Related',
      bullets: [
        '<a href="' + MCP + '" style="color:#25D366">WhatsApp MCP overview</a> \u2014 the full server, tools and hosted option.',
        '<a href="https://gambot.co.il/whatsapp-mcp/claude/" style="color:#25D366">Claude</a>, <a href="https://gambot.co.il/whatsapp-mcp/chatgpt/" style="color:#25D366">ChatGPT</a> and <a href="https://gambot.co.il/whatsapp-mcp/cursor/" style="color:#25D366">Cursor</a> setup guides.',
        '<a href="' + DOCS + '" style="color:#25D366">API docs</a> and <a href="' + GITHUB + '" style="color:#25D366">gambot-mcp on GitHub</a>.',
      ],
    },
    {
      type: 'cta',
      title: 'Connect WhatsApp to Gemini',
      text: 'Create a free Gambot account, grab your token, and register the MCP server in your Gemini settings.',
      primary: ctaCreate,
      secondary: { label: 'Read the API docs', href: DOCS, event: 'developer_docs_click' },
    },
  ],
  faq: [
    { q: 'How do I add the Gambot WhatsApp MCP server to Gemini?', a: 'Add a gambot entry to the mcpServers map in your Gemini CLI settings (settings.json), with command npx, args ["-y","gambot-mcp"], and your GAMBOT_TOKEN in env, then restart Gemini.' },
    { q: 'Where do I get my Gambot token?', a: 'In Gambot, go to Settings \u2192 General and copy your organization token (starts with gmbt_).' },
    { q: 'Does it need a build step?', a: 'No. Gemini runs the server on demand with npx -y gambot-mcp; you only need Node.js 18+.' },
    { q: 'Is it the official WhatsApp API?', a: 'Yes \u2014 Gambot is an official Meta Business Solution Provider running on the authorized WhatsApp Business (Cloud) API.' },
  ],
  he: {
    hero: {
      badge: 'Model Context Protocol · Gemini',
      h1: 'WhatsApp MCP ל\u2011Gemini',
      subhead:
        '\u05ea\u05e0\u05d5 \u05dc\u2011<strong style="color:#e9edef">Gemini</strong> \u05d2\u05d9\u05e9\u05d4 \u05dc\u2011WhatsApp Business API \u05d0\u05de\u05d9\u05ea\u05d9. \u05e8\u05e9\u05de\u05d5 \u05d0\u05ea \u05e9\u05e8\u05ea \u05d4\u2011MCP \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8 \u05d1\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05d4\u2011Gemini CLI, \u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05d0\u05ea \u05d4\u05d8\u05d5\u05e7\u05df, \u05d5\u05d1\u05e7\u05e9\u05d5 \u05de\u2011Gemini \u05dc\u05e9\u05dc\u05d5\u05d7 \u05d4\u05d5\u05d3\u05e2\u05d5\u05ea, \u05ea\u05d1\u05e0\u05d9\u05d5\u05ea \u05d5\u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd \u05d1\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4.',
      primary: { label: '\u05e6\u05d5\u05e8 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd \u2192' },
      secondary: { label: '\u05e1\u05e7\u05d9\u05e8\u05ea WhatsApp MCP' },
      chips: ['Gemini CLI', 'settings.json', 'npx gambot-mcp', 'stdio'],
    },
    blocks: [
      {
        title: '\u05de\u05d4 \u05d6\u05d4 \u05de\u05d0\u05e4\u05e9\u05e8',
        bullets: [
          '\u05dc\u05d1\u05e7\u05e9 \u05de\u2011Gemini \u05dc\u05e9\u05dc\u05d5\u05d7 \u05d4\u05d5\u05d3\u05e2\u05ea \u05d8\u05e7\u05e1\u05d8 \u05d7\u05d5\u05e4\u05e9\u05d9 \u05d1\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 (\u05d1\u05ea\u05d5\u05da \u05d7\u05dc\u05d5\u05df 24 \u05d4\u05e9\u05e2\u05d5\u05ea) \u05d0\u05d5 \u05ea\u05d1\u05e0\u05d9\u05ea \u05de\u05d0\u05d5\u05e9\u05e8\u05ea.',
          '\u05dc\u05d9\u05e6\u05d5\u05e8, \u05dc\u05ea\u05d6\u05de\u05df \u05d5\u05dc\u05d4\u05e8\u05d9\u05e5 \u05e7\u05de\u05e4\u05d9\u05d9\u05e0\u05d9\u05dd \u05d1\u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4; \u05dc\u05e7\u05e8\u05d5\u05d0 \u05e1\u05d8\u05d8\u05d5\u05e1 \u05de\u05e1\u05d9\u05e8\u05d4 \u05d5\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea.',
          '\u05dc\u05ea\u05e9\u05d0\u05dc \u05d0\u05e0\u05dc\u05d9\u05d8\u05d9\u05e7\u05e1 \u05d5\u05dc\u05e0\u05d4\u05dc \u05d0\u05e0\u05e9\u05d9 \u05e7\u05e9\u05e8, \u05dc\u05d9\u05d3\u05d9\u05dd, \u05e4\u05e0\u05d9\u05d5\u05ea \u05d5\u05de\u05e9\u05d9\u05de\u05d5\u05ea \u2014 \u05d4\u05db\u05d5\u05dc \u05de\u05e9\u05d5\u05e8\u05ea \u05d4\u05e4\u05e7\u05d5\u05d3\u05d4.',
          'Gemini \u05de\u05e7\u05d1\u05dc \u05de\u05e6\u05d1\u05d9\u05dd \u05de\u05d5\u05d1\u05e0\u05d9\u05dd \u05d5\u05d4\u05e0\u05d7\u05d9\u05d4 \u05dc\u05e6\u05e2\u05d3 \u05d4\u05d1\u05d0, \u05db\u05da \u05e9\u05d4\u05d5\u05d0 \u05de\u05ea\u05d0\u05d5\u05e9\u05e9 \u05e0\u05db\u05d5\u05df (\u05dc\u05de\u05e9\u05dc \u05e9\u05dc\u05d9\u05d7\u05ea \u05ea\u05d1\u05e0\u05d9\u05ea \u05db\u05e9\u05d4\u05d7\u05dc\u05d5\u05df \u05e1\u05d2\u05d5\u05e8).',
        ],
      },
      {
        title: '\u05d3\u05e8\u05d9\u05e9\u05d5\u05ea',
        bullets: [
          '\u05d7\u05e9\u05d1\u05d5\u05df \u05d2\u05de\u05d1\u05d5\u05d8 \u05e2\u05dd \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05de\u05d7\u05d5\u05d1\u05e8 (<a href="' + SIGNUP + '" style="color:#25D366">\u05e6\u05e8\u05d5 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd</a>).',
          '\u05d4\u05d8\u05d5\u05e7\u05df \u05e9\u05dc\u05db\u05dd \u05d1\u05d2\u05de\u05d1\u05d5\u05d8 (<code>gmbt_\u2026</code>) \u05de\u05ea\u05d5\u05da \u05d2\u05de\u05d1\u05d5\u05d8 \u2190 <strong style="color:#e9edef">\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u2190 \u05db\u05dc\u05dc\u05d9</strong>.',
          '\u05d4\u2011Gemini CLI (\u05d0\u05d5 \u05dc\u05e7\u05d5\u05d7 Gemini \u05e9\u05ea\u05d5\u05de\u05da \u05d1\u05e9\u05e8\u05ea\u05d9 MCP) \u05d5\u2011Node.js 18+.',
        ],
      },
      {
        title: '\u05d4\u05ea\u05e7\u05e0\u05d4',
        steps: [
          { title: '\u05e4\u05ea\u05d7\u05d5 \u05d0\u05ea \u05d4\u05d2\u05d3\u05e8\u05d5\u05ea Gemini', text: '\u05e2\u05e8\u05db\u05d5 \u05d0\u05ea \u05e7\u05d5\u05d1\u05e5 \u05d4\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05e9\u05dc \u05d4\u2011Gemini CLI (\u05dc\u05de\u05e9\u05dc ~/.gemini/settings.json) \u05e9\u05de\u05db\u05d9\u05dc \u05d0\u05ea \u05de\u05e4\u05ea \u05d4\u2011mcpServers.' },
          { title: '\u05e8\u05e9\u05de\u05d5 \u05d0\u05ea \u05e9\u05e8\u05ea gambot', text: '\u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05d0\u05ea \u05d4\u05d1\u05dc\u05d5\u05e7 \u05e9\u05dc\u05de\u05d8\u05d4, \u05e2\u05dd \u05d4\u05e4\u05e7\u05d5\u05d3\u05d4 npx \u05d5\u05d4\u05d0\u05e8\u05d2\u05d5\u05de\u05e0\u05d8\u05d9\u05dd ["-y","gambot-mcp"].' },
          { title: '\u05d0\u05d9\u05de\u05d5\u05ea', text: '\u05d4\u05d2\u05d3\u05d9\u05e8\u05d5 \u05d0\u05ea GAMBOT_TOKEN \u05dc\u05d8\u05d5\u05e7\u05df \u05d4\u2011gmbt_ \u05e9\u05dc\u05db\u05dd; \u05d4\u05d0\u05e8\u05d2\u05d5\u05df \u05de\u05d6\u05d5\u05d4\u05d4 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea.' },
          { title: '\u05d4\u05e9\u05ea\u05de\u05e9\u05d5', text: '\u05d4\u05e4\u05e2\u05d9\u05dc\u05d5 \u05d0\u05ea Gemini, \u05d5\u05d3\u05d0\u05d5 \u05e9\u05db\u05dc\u05d9 gambot \u05d6\u05d5\u05d4\u05d5, \u05d5\u05d1\u05e7\u05e9\u05d5 \u05dc\u05e9\u05dc\u05d5\u05d7 \u05d4\u05d5\u05d3\u05e2\u05ea \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4.' },
        ],
      },
      { title: '\u05ea\u05e6\u05d5\u05e8\u05d4 (Gemini settings.json \u2190 mcpServers)' },
      {
        title: '\u05d3\u05d5\u05d2\u05de\u05d0\u05d5\u05ea \u05dc\u05d1\u05e7\u05e9\u05d5\u05ea',
        prompts: [
          { user: '\u05e9\u05dc\u05d7 \u05d0\u05ea \u05d4\u05ea\u05d1\u05e0\u05d9\u05ea appointment_reminder \u05dc\u2011\u200e+972 50-123-4567.' },
          { user: '\u05d4\u05e6\u05d2 \u05e9\u05d9\u05d7\u05d5\u05ea \u05e9\u05de\u05de\u05ea\u05d9\u05e0\u05d5\u05ea \u05dc\u05de\u05e2\u05e0\u05d4 \u05d5\u05e1\u05db\u05dd \u05d0\u05d5\u05ea\u05df.' },
          { user: '\u05ea\u05d6\u05de\u05df \u05e7\u05de\u05e4\u05d9\u05d9\u05df \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05dc\u05ea\u05d2\u05d9\u05ea \u201cnewsletter\u201d \u05dc\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9 09:00.' },
          { user: '\u05de\u05d4 \u05d4\u05d9\u05d5 \u05d4\u05e9\u05d0\u05dc\u05d5\u05ea \u05d4\u05e0\u05e4\u05d5\u05e6\u05d5\u05ea \u05e9\u05dc \u05d4\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea \u05d4\u05d9\u05d5\u05dd?' },
        ],
      },
      {
        title: '\u05e4\u05ea\u05e8\u05d5\u05df \u05ea\u05e7\u05dc\u05d5\u05ea',
        bullets: [
          '<strong style="color:#e9edef">\u05d4\u05e9\u05e8\u05ea \u05dc\u05d0 \u05d6\u05d5\u05d4\u05d4?</strong> \u05d5\u05d3\u05d0\u05d5 \u05e9\u05d1\u05dc\u05d5\u05e7 \u05d4\u2011mcpServers \u05d4\u05d5\u05d0 JSON \u05ea\u05e7\u05d9\u05df \u05d5\u05d4\u05e4\u05e2\u05d9\u05dc\u05d5 \u05de\u05d7\u05d3\u05e9 \u05d0\u05ea \u05d4\u2011Gemini CLI.',
          '<strong style="color:#e9edef">AUTHENTICATION_REQUIRED?</strong> \u05d4\u05e2\u05ea\u05d9\u05e7\u05d5 \u05de\u05d7\u05d3\u05e9 \u05d0\u05ea \u05d4\u05d8\u05d5\u05e7\u05df gmbt_ \u05de\u05ea\u05d5\u05da \u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u2190 \u05db\u05dc\u05dc\u05d9.',
          '<strong style="color:#e9edef">CONVERSATION_WINDOW_CLOSED?</strong> \u05e6\u05e4\u05d5\u05d9 \u05db\u05e9\u05d7\u05dc\u05d5\u05df 24 \u05d4\u05e9\u05e2\u05d5\u05ea \u05e1\u05d2\u05d5\u05e8 \u2014 Gemini \u05d0\u05de\u05d5\u05e8 \u05dc\u05e9\u05dc\u05d5\u05d7 \u05ea\u05d1\u05e0\u05d9\u05ea \u05de\u05d0\u05d5\u05e9\u05e8\u05ea \u05d1\u05de\u05e7\u05d5\u05dd.',
          '<strong style="color:#e9edef">npx \u05dc\u05d0 \u05e0\u05de\u05e6\u05d0?</strong> \u05d5\u05d3\u05d0\u05d5 \u05e9\u2011Node.js 18+ \u05de\u05d5\u05ea\u05e7\u05df \u05d5\u05e0\u05de\u05e6\u05d0 \u05d1\u2011PATH.',
        ],
      },
      {
        title: '\u05e7\u05d9\u05e9\u05d5\u05e8\u05d9\u05dd \u05e0\u05d5\u05e1\u05e4\u05d9\u05dd',
        bullets: [
          '<a href="' + MCP + '" style="color:#25D366">\u05e1\u05e7\u05d9\u05e8\u05ea WhatsApp MCP</a> \u2014 \u05d4\u05e9\u05e8\u05ea \u05d4\u05de\u05dc\u05d0, \u05d4\u05db\u05dc\u05d9\u05dd \u05d5\u05d4\u05d0\u05e4\u05e9\u05e8\u05d5\u05ea \u05d4\u05de\u05ea\u05d0\u05e8\u05d7\u05ea.',
          '\u05de\u05d3\u05e8\u05d9\u05db\u05d9 \u05d4\u05d2\u05d3\u05e8\u05d4 \u05dc\u2011<a href="https://gambot.co.il/whatsapp-mcp/claude/" style="color:#25D366">Claude</a>, <a href="https://gambot.co.il/whatsapp-mcp/chatgpt/" style="color:#25D366">ChatGPT</a> \u05d5\u2011<a href="https://gambot.co.il/whatsapp-mcp/cursor/" style="color:#25D366">Cursor</a>.',
          '<a href="' + DOCS + '" style="color:#25D366">\u05ea\u05d9\u05e2\u05d5\u05d3 API</a> \u05d5\u2011<a href="' + GITHUB + '" style="color:#25D366">gambot-mcp \u05d1\u2011GitHub</a>.',
        ],
      },
      {
        title: '\u05d7\u05d1\u05e8\u05d5 \u05d5\u05d5\u05d0\u05d8\u05e1\u05d0\u05e4 \u05dc\u2011Gemini',
        text: '\u05e6\u05e8\u05d5 \u05d7\u05e9\u05d1\u05d5\u05df \u05d2\u05de\u05d1\u05d5\u05d8 \u05d7\u05d9\u05e0\u05dd, \u05e7\u05d1\u05dc\u05d5 \u05d0\u05ea \u05d4\u05d8\u05d5\u05e7\u05df, \u05d5\u05e8\u05e9\u05de\u05d5 \u05d0\u05ea \u05e9\u05e8\u05ea \u05d4\u2011MCP \u05d1\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05d4\u2011Gemini \u05e9\u05dc\u05db\u05dd.',
        primary: { label: '\u05e6\u05d5\u05e8 \u05d7\u05e9\u05d1\u05d5\u05df \u05d7\u05d9\u05e0\u05dd \u2192' },
        secondary: { label: '\u05e7\u05e8\u05d0 \u05d0\u05ea \u05ea\u05d9\u05e2\u05d5\u05d3 \u05d4\u2011API' },
      },
    ],
    faq: [
      { q: '\u05d0\u05d9\u05da \u05de\u05d5\u05e1\u05d9\u05e4\u05d9\u05dd \u05d0\u05ea \u05e9\u05e8\u05ea \u05d4\u2011WhatsApp MCP \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8 \u05dc\u2011Gemini?', a: '\u05d4\u05d5\u05e1\u05d9\u05e4\u05d5 \u05e8\u05e9\u05d5\u05de\u05ea gambot \u05dc\u05de\u05e4\u05ea \u05d4\u2011mcpServers \u05d1\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05d4\u2011Gemini CLI (settings.json), \u05e2\u05dd \u05d4\u05e4\u05e7\u05d5\u05d3\u05d4 npx, \u05d4\u05d0\u05e8\u05d2\u05d5\u05de\u05e0\u05d8\u05d9\u05dd ["-y","gambot-mcp"] \u05d5\u05d4\u2011GAMBOT_TOKEN \u05e9\u05dc\u05db\u05dd \u05d1\u2011env, \u05d5\u05d0\u05d6 \u05d4\u05e4\u05e2\u05d9\u05dc\u05d5 \u05de\u05d7\u05d3\u05e9 \u05d0\u05ea Gemini.' },
      { q: '\u05de\u05d0\u05d9\u05e4\u05d4 \u05de\u05e9\u05d9\u05d2\u05d9\u05dd \u05d0\u05ea \u05d4\u05d8\u05d5\u05e7\u05df \u05e9\u05dc \u05d2\u05de\u05d1\u05d5\u05d8?', a: '\u05d1\u05d2\u05de\u05d1\u05d5\u05d8, \u05e2\u05d1\u05e8\u05d5 \u05dc\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u2190 \u05db\u05dc\u05dc\u05d9 \u05d5\u05d4\u05e2\u05ea\u05d9\u05e7\u05d5 \u05d0\u05ea \u05d8\u05d5\u05e7\u05df \u05d4\u05d0\u05e8\u05d2\u05d5\u05df (\u05de\u05ea\u05d7\u05d9\u05dc \u05d1\u2011gmbt_).' },
      { q: '\u05d4\u05d0\u05dd \u05e6\u05e8\u05d9\u05da \u05e9\u05dc\u05d1 build?', a: '\u05dc\u05d0. Gemini \u05de\u05e8\u05d9\u05e5 \u05d0\u05ea \u05d4\u05e9\u05e8\u05ea \u05dc\u05e4\u05d9 \u05d3\u05e8\u05d9\u05e9\u05d4 \u05e2\u05dd npx -y gambot-mcp; \u05e6\u05e8\u05d9\u05da \u05e8\u05e7 Node.js 18+.' },
      { q: '\u05d4\u05d0\u05dd \u05d6\u05d4 \u05d4\u2011WhatsApp API \u05d4\u05e8\u05e9\u05de\u05d9?', a: '\u05db\u05df \u2014 \u05d2\u05de\u05d1\u05d5\u05d8 \u05d4\u05d9\u05d0 \u05e1\u05e4\u05e7\u05d9\u05ea \u05e4\u05ea\u05e8\u05d5\u05e0\u05d5\u05ea \u05e2\u05e1\u05e7\u05d9\u05d9\u05dd \u05e8\u05e9\u05de\u05d9\u05ea \u05e9\u05dc Meta, \u05d4\u05e4\u05d5\u05e2\u05dc\u05ea \u05e2\u05dc WhatsApp Business (Cloud) API \u05d4\u05de\u05d5\u05e8\u05e9\u05d4.' },
    ],
  },
};

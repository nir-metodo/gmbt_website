import {
  SIGNUP, DOCS, MCP, GITHUB, HOSTED_MCP, MCP_STDIO_CONFIG, HOME, CRUMB_MCP,
  ctaCreate,
} from './_common';

const CLAUDE_DESKTOP_CONFIG = MCP_STDIO_CONFIG;

export const data = {
  pageKey: 'whatsapp-mcp-claude',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp MCP for Claude \u2014 Send WhatsApp from Claude | Gambot',
    appName: 'Gambot WhatsApp MCP for Claude',
    description:
      'Connect WhatsApp to Claude with the Gambot MCP server. Use Claude Desktop (local, npx) or a Claude remote connector (hosted URL + OAuth) to send WhatsApp messages, templates and campaigns on the official WhatsApp Business API.',
    keywords:
      'WhatsApp MCP Claude, connect WhatsApp to Claude, Claude WhatsApp MCP, Claude Desktop WhatsApp, Claude MCP connector WhatsApp, gambot-mcp Claude',
    canonical: 'https://gambot.co.il/whatsapp-mcp/claude/',
    ogTitle: 'WhatsApp MCP for Claude',
    ogDescription: 'Add the Gambot WhatsApp MCP server to Claude Desktop or as a remote connector.',
  },
  breadcrumbs: [HOME, CRUMB_MCP, { name: 'Claude', item: 'https://gambot.co.il/whatsapp-mcp/claude/' }],
  hero: {
    badge: 'Model Context Protocol · Claude',
    h1: 'WhatsApp MCP for Claude',
    subhead:
      'Give <strong style="color:#e9edef">Claude</strong> a real WhatsApp Business API. Run it locally in Claude Desktop, or add the hosted Gambot connector \u2014 then ask Claude to send WhatsApp messages, templates and campaigns.',
    primary: ctaCreate,
    secondary: { label: 'WhatsApp MCP overview', href: MCP, event: 'mcp_cta_click' },
    chips: ['Claude Desktop', 'Remote connector', 'npx gambot-mcp', 'OAuth'],
  },
  blocks: [
    {
      type: 'bullets',
      title: 'What this enables',
      bullets: [
        'Ask Claude to send a WhatsApp free-text message (inside the 24h window) or an approved template.',
        'Create, schedule and run WhatsApp campaigns; read results and delivery status.',
        'Summarize today\u2019s conversations, find who is waiting for a reply, and manage contacts, leads, cases and tasks.',
        'Claude receives structured states and recommended next actions, so it recovers cleanly (e.g. switch to a template when the window is closed).',
      ],
    },
    {
      type: 'bullets',
      title: 'Requirements',
      bullets: [
        'A Gambot account with WhatsApp connected (<a href="' + SIGNUP + '" style="color:#25D366">create one free</a>).',
        'Your Gambot token (<code>gmbt_\u2026</code>) from Gambot \u2192 <strong style="color:#e9edef">Settings \u2192 General</strong>.',
        'For Claude Desktop: Node.js 18+ (the server runs on demand with <code>npx</code>).',
      ],
    },
    {
      type: 'steps',
      title: 'Option A \u2014 Claude Desktop (local)',
      steps: [
        { title: 'Open the config', text: 'Edit claude_desktop_config.json (Claude Desktop \u2192 Settings \u2192 Developer \u2192 Edit Config).' },
        { title: 'Add the gambot server', text: 'Paste the config below and set GAMBOT_TOKEN to your gmbt_ token.' },
        { title: 'Restart Claude', text: 'Quit and reopen Claude Desktop; the gambot tools appear in the tools menu.' },
      ],
    },
    {
      type: 'code',
      title: 'Configuration (claude_desktop_config.json)',
      code: CLAUDE_DESKTOP_CONFIG,
    },
    {
      type: 'steps',
      title: 'Option B \u2014 Remote connector (hosted)',
      intro: 'In Claude clients that support custom connectors / remote MCP servers.',
      steps: [
        { title: 'Add a custom connector', text: 'Point it at the hosted Gambot MCP URL (below).' },
        { title: 'Authenticate', text: 'Complete the OAuth consent with your Gambot token \u2014 no local install needed.' },
        { title: 'Use it', text: 'Ask Claude to send WhatsApp; it uses the same tools as the local option.' },
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
        { user: 'Message my open leads with the promo_may template.' },
        { user: 'Summarize today\u2019s customer service conversations.' },
        { user: 'Which chats have been waiting longest for a reply?' },
        { user: 'Schedule a campaign to the \u201cVIP\u201d tag for tomorrow 10:00.' },
      ],
    },
    {
      type: 'bullets',
      title: 'Troubleshooting',
      bullets: [
        '<strong style="color:#e9edef">Tools missing in Desktop?</strong> Fully quit and relaunch Claude after editing the config; verify JSON is valid.',
        '<strong style="color:#e9edef">AUTHENTICATION_REQUIRED?</strong> Re-copy the gmbt_ token from Settings \u2192 General.',
        '<strong style="color:#e9edef">CONVERSATION_WINDOW_CLOSED?</strong> Expected when the 24h window is closed \u2014 Claude should send an approved template instead.',
        '<strong style="color:#e9edef">Connector auth loops?</strong> Re-run the OAuth consent and confirm the token belongs to the right organization.',
      ],
    },
    {
      type: 'bullets',
      title: 'Related',
      bullets: [
        '<a href="' + MCP + '" style="color:#25D366">WhatsApp MCP overview</a> \u2014 the full server, tools and hosted option.',
        '<a href="https://gambot.co.il/whatsapp-mcp/cursor/" style="color:#25D366">Cursor</a>, <a href="https://gambot.co.il/whatsapp-mcp/chatgpt/" style="color:#25D366">ChatGPT</a> and <a href="https://gambot.co.il/whatsapp-mcp/gemini/" style="color:#25D366">Gemini</a> setup guides.',
        '<a href="' + DOCS + '" style="color:#25D366">API docs</a> and <a href="' + GITHUB + '" style="color:#25D366">gambot-mcp on GitHub</a>.',
      ],
    },
    {
      type: 'cta',
      title: 'Connect WhatsApp to Claude',
      text: 'Create a free Gambot account, grab your token, and connect Claude in minutes.',
      primary: ctaCreate,
      secondary: { label: 'Read the API docs', href: DOCS, event: 'developer_docs_click' },
    },
  ],
  faq: [
    { q: 'Can I use WhatsApp with Claude Desktop and Claude.ai?', a: 'Yes. Claude Desktop runs the server locally via npx (claude_desktop_config.json). In Claude clients that support custom connectors / remote MCP, you can instead add the hosted Gambot MCP URL and authenticate with OAuth.' },
    { q: 'Where do I get my Gambot token?', a: 'In Gambot, go to Settings \u2192 General and copy your organization token (starts with gmbt_).' },
    { q: 'Do I need to host anything for the remote connector?', a: 'No \u2014 Gambot hosts the MCP server at ' + HOSTED_MCP + '. You just authenticate with your token.' },
    { q: 'Is it the official WhatsApp API?', a: 'Yes \u2014 Gambot is an official Meta Business Solution Provider running on the authorized WhatsApp Business (Cloud) API.' },
  ],
};

import {
  SIGNUP, DOCS, MCP, GITHUB, MCP_STDIO_CONFIG, HOME, CRUMB_MCP,
  ctaCreate,
} from './_common';

const CURSOR_DEEPLINK =
  'cursor://anysphere.cursor-deeplink/mcp/install?name=gambot&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImdhbWJvdC1tY3AiXSwiZW52Ijp7IkdBTUJPVF9UT0tFTiI6IiJ9fQ==';

export const data = {
  pageKey: 'whatsapp-mcp-cursor',
  schemaType: 'software',
  seo: {
    title: 'WhatsApp MCP for Cursor \u2014 Send WhatsApp from Cursor | Gambot',
    appName: 'Gambot WhatsApp MCP for Cursor',
    description:
      'Connect WhatsApp to Cursor with the Gambot MCP server. Add it to .cursor/mcp.json (or one-click install), paste your Gambot token, and let Cursor send WhatsApp messages, templates, campaigns and manage CRM via the official WhatsApp Business API.',
    keywords:
      'WhatsApp MCP Cursor, Cursor WhatsApp MCP, Cursor MCP server WhatsApp, connect WhatsApp to Cursor, WhatsApp API Cursor, gambot-mcp Cursor',
    canonical: 'https://gambot.co.il/whatsapp-mcp/cursor/',
    ogTitle: 'WhatsApp MCP for Cursor',
    ogDescription: 'Add the Gambot WhatsApp MCP server to Cursor and send WhatsApp from your editor.',
  },
  breadcrumbs: [HOME, CRUMB_MCP, { name: 'Cursor', item: 'https://gambot.co.il/whatsapp-mcp/cursor/' }],
  hero: {
    badge: 'Model Context Protocol · Cursor',
    h1: 'WhatsApp MCP for Cursor',
    subhead:
      'Give <strong style="color:#e9edef">Cursor</strong> a real WhatsApp Business API. Add the Gambot MCP server, paste your token, and send WhatsApp messages, templates and campaigns straight from the editor.',
    primary: { label: '\u2795 Add to Cursor (one click)', href: CURSOR_DEEPLINK, event: 'mcp_setup_started', eventParams: { client: 'cursor' } },
    secondary: ctaCreate,
    chips: ['npx gambot-mcp', 'stdio', '.cursor/mcp.json', 'One-click install'],
  },
  blocks: [
    {
      type: 'bullets',
      title: 'What this enables',
      bullets: [
        'Ask Cursor in natural language to send a WhatsApp message or approved template to a contact.',
        'Kick off, schedule or read WhatsApp campaigns and their results without leaving your editor.',
        'Query analytics and manage contacts, leads, cases and tasks while you build.',
        'Great for wiring WhatsApp into a project: test sends, verify templates, and inspect delivery status inline.',
      ],
    },
    {
      type: 'bullets',
      title: 'Requirements',
      bullets: [
        'A Gambot account with WhatsApp connected (<a href="' + SIGNUP + '" style="color:#25D366">create one free</a>).',
        'Your Gambot token (<code>gmbt_\u2026</code>) from Gambot \u2192 <strong style="color:#e9edef">Settings \u2192 General</strong>.',
        'Node.js 18+ available on your machine (Cursor runs the server on demand with <code>npx</code>).',
      ],
    },
    {
      type: 'steps',
      title: 'Setup',
      steps: [
        { title: 'One-click install', text: 'Use the \u201cAdd to Cursor\u201d button above, then paste your Gambot token into the server\u2019s env. Or configure manually (next step).' },
        { title: 'Or edit .cursor/mcp.json', text: 'Add the config below to your project\u2019s .cursor/mcp.json (or the global one) and restart Cursor.' },
        { title: 'Authenticate', text: 'Set GAMBOT_TOKEN to your gmbt_ token. The organization is resolved automatically from the token.' },
        { title: 'Use it', text: 'Open the chat, confirm the gambot tools are available, and ask it to send a WhatsApp message.' },
      ],
    },
    {
      type: 'code',
      title: 'Configuration (.cursor/mcp.json)',
      code: MCP_STDIO_CONFIG,
    },
    {
      type: 'prompts',
      title: 'Example prompts',
      prompts: [
        { user: 'Send a WhatsApp to +972 50-123-4567 saying the build is deployed.' },
        { user: 'List my approved WhatsApp templates and their variables.' },
        { user: 'Send the order_update template to this customer with their order number.' },
        { user: 'How many WhatsApp messages did we receive today?' },
        { user: 'Which conversations are still waiting for a reply?' },
      ],
    },
    {
      type: 'bullets',
      title: 'Troubleshooting',
      bullets: [
        '<strong style="color:#e9edef">Tools not showing?</strong> Fully restart Cursor after editing mcp.json and check the MCP panel for the \u201cgambot\u201d server status.',
        '<strong style="color:#e9edef">Auth errors (AUTHENTICATION_REQUIRED)?</strong> Re-check the gmbt_ token in the env; it must be an organization token from Settings \u2192 General.',
        '<strong style="color:#e9edef">Free text rejected (CONVERSATION_WINDOW_CLOSED)?</strong> The 24-hour window is closed \u2014 the agent should send an approved template instead. This is expected WhatsApp behavior.',
        '<strong style="color:#e9edef">npx blocked?</strong> Ensure Node.js 18+ is installed and on PATH.',
      ],
    },
    {
      type: 'bullets',
      title: 'Related',
      bullets: [
        '<a href="' + MCP + '" style="color:#25D366">WhatsApp MCP overview</a> \u2014 the full server, tools and hosted option.',
        '<a href="https://gambot.co.il/whatsapp-mcp/claude/" style="color:#25D366">Claude</a>, <a href="https://gambot.co.il/whatsapp-mcp/chatgpt/" style="color:#25D366">ChatGPT</a> and <a href="https://gambot.co.il/whatsapp-mcp/gemini/" style="color:#25D366">Gemini</a> setup guides.',
        '<a href="' + DOCS + '" style="color:#25D366">API docs</a> \u2014 REST reference, auth, scopes and error codes.',
        '<a href="' + GITHUB + '" style="color:#25D366">gambot-mcp on GitHub</a>.',
      ],
    },
    {
      type: 'cta',
      title: 'Connect WhatsApp to Cursor',
      text: 'Create a free Gambot account, grab your token, and add the MCP server in under a minute.',
      primary: ctaCreate,
      secondary: { label: 'WhatsApp MCP overview', href: MCP, event: 'mcp_cta_click' },
    },
  ],
  faq: [
    { q: 'How do I add the Gambot WhatsApp MCP server to Cursor?', a: 'Use the one-click \u201cAdd to Cursor\u201d button, or add the gambot server block to .cursor/mcp.json with command npx, args ["-y","gambot-mcp"], and your GAMBOT_TOKEN in env, then restart Cursor.' },
    { q: 'Where do I get my Gambot token?', a: 'In Gambot, go to Settings \u2192 General and copy your organization token (starts with gmbt_).' },
    { q: 'Does it need a build step?', a: 'No. Cursor runs the server on demand with npx -y gambot-mcp; you only need Node.js 18+.' },
    { q: 'Is it the official WhatsApp API?', a: 'Yes \u2014 Gambot is an official Meta Business Solution Provider, so it runs on the authorized WhatsApp Business (Cloud) API.' },
  ],
};

import {
  SIGNUP, DOCS, MCP, GITHUB, NPM, HOSTED_MCP, MCP_STDIO_CONFIG, HOME, CRUMB_MCP,
  ctaCreate,
} from './_common';

/**
 * Setup guides for AI coding platforms. Each answers one question:
 *   "How do I add the official WhatsApp API to my application using <platform>?"
 *
 * Only documented, real capabilities are claimed. Where a platform's MCP support is build-time only
 * (Lovable, Base44) the guide says so and shows the REST path for the running app instead.
 */

const SKILL_URL = 'https://github.com/gambot-ai/gambot-mcp/tree/main/skills/gambot-whatsapp';
const link = (href, text) => `<a href="${href}" style="color:#25D366">${text}</a>`;
const strong = (t) => `<strong style="color:#e9edef">${t}</strong>`;
const utm = (path, source, medium = 'mcp_client') => `https://gambot.co.il${path}?utm_source=${source}&utm_medium=${medium}`;

const NO_ACCOUNT_BULLET =
  'No Gambot account yet? Connect the server <em>without</em> a token and ask your agent to \u201Cset up WhatsApp with Gambot\u201D. It creates a free-trial account for you (no API key needed) and hands you one link to connect your WhatsApp number to Meta in the browser \u2014 that single step must be done by a person. Prefer the browser? ' +
  link(SIGNUP, 'Create an account') + '.';

const TOKEN_BULLET =
  'After WhatsApp is connected, copy your API token (<code>gmbt_\u2026</code>) from ' + strong('Settings \u2192 General') +
  ' into an environment variable \u2014 never into the chat. Where the client supports it, sign in with OAuth on the hosted server instead and there is no token to copy.';

const COMMON_PROMPTS = [
  { user: 'Set up WhatsApp for my app with Gambot and send a test message to my own number.' },
  { user: 'Is the 24-hour window open for this customer, or do I need a template?' },
  { user: 'List my approved WhatsApp templates and send the order_update template to this number.' },
  { user: 'Register a webhook so my backend receives incoming WhatsApp messages, then send a test event.' },
];

const COMMON_TROUBLE = [
  strong('Tools not showing?') + ' Restart the client after editing its MCP config, then check its MCP/tools panel for \u201Cgambot\u201D.',
  strong('AUTHENTICATION_REQUIRED?') + ' The token is missing or invalid. Copy a fresh one from Settings \u2192 General.',
  strong('CONVERSATION_WINDOW_CLOSED?') + ' The 24-hour window is closed \u2014 send an approved template instead. This is WhatsApp behavior, and the error tells the agent exactly that (<code>template_required: true</code>).',
  strong('Is the WhatsApp number connected?') + ' Ask the agent to run <code>gambot_setup_whatsapp_integration</code>; it reports the exact state and the next step.',
];

const related = (current) => ({
  type: 'bullets',
  title: 'Related',
  bullets: [
    link(MCP, 'WhatsApp MCP overview') + ' \u2014 the full server, tools and hosted option.',
    'Other clients: ' + [
      ['claude', 'Claude Desktop'], ['claude-code', 'Claude Code'], ['cursor', 'Cursor'], ['codex', 'OpenAI Codex'],
      ['gemini', 'Gemini CLI'], ['chatgpt', 'ChatGPT'], ['vscode-copilot', 'VS Code / Copilot'], ['windsurf', 'Windsurf'],
      ['replit', 'Replit'], ['lovable', 'Lovable'], ['base44', 'Base44'],
    ].filter(([s]) => s !== current).map(([s, n]) => link(`https://gambot.co.il/whatsapp-mcp/${s}/`, n)).join(', ') + '.',
    link('https://gambot.co.il/whatsapp-mcp/agent-skill/', 'Gambot Agent Skill') + ' \u2014 teach any compatible agent the whole WhatsApp integration path.',
    link('https://gambot.co.il/whatsapp-mcp-vs-whatsapp-web/', 'Official API vs WhatsApp Web automation') + ' \u2014 why production should use the official API.',
    link(DOCS + '?lang=en', 'REST API docs') + ' \u00B7 ' + link(GITHUB, 'gambot-mcp on GitHub') + ' \u00B7 ' + link(NPM, 'npm'),
  ],
});

const base = ({ key, slug, platform, h1, title, description, keywords, badge, subhead, primary, chips, ogDescription }) => ({
  pageKey: `whatsapp-mcp-${key}`,
  schemaType: 'software',
  seo: {
    title,
    appName: `Gambot WhatsApp MCP for ${platform}`,
    description,
    keywords,
    canonical: `https://gambot.co.il/whatsapp-mcp/${slug}/`,
    ogTitle: h1,
    ogDescription: ogDescription || description,
  },
  breadcrumbs: [HOME, CRUMB_MCP, { name: platform, item: `https://gambot.co.il/whatsapp-mcp/${slug}/` }],
  hero: { badge, h1, subhead, primary, secondary: ctaCreate, chips },
});

/* ----------------------------------------------------------------------------------------------- */
export const claudeCode = {
  ...base({
    key: 'claude-code', slug: 'claude-code', platform: 'Claude Code',
    h1: 'Add the official WhatsApp API to your app with Claude Code',
    title: 'WhatsApp MCP for Claude Code \u2014 Official WhatsApp Business API | Gambot',
    description: 'Add the official WhatsApp Business API to your application using Claude Code. One command installs the Gambot MCP server; Claude Code can then create the account, send messages and templates, set up webhooks and verify delivery.',
    keywords: 'Claude Code WhatsApp, WhatsApp MCP Claude Code, claude mcp add whatsapp, add WhatsApp API with Claude Code, official WhatsApp Business API Claude Code',
    badge: 'Model Context Protocol \u00B7 Claude Code',
    subhead: 'Give ' + strong('Claude Code') + ' the official WhatsApp Business API. One command, then ask it to add WhatsApp to your app \u2014 account, Meta onboarding hand-off, first message, templates and webhooks.',
    primary: { label: 'Create a free account \u2192', href: utm('/OnboardingProcess/', 'claude'), event: 'create_account_click', eventParams: { client: 'claude-code' } },
    chips: ['claude mcp add', 'stdio or hosted', 'OAuth', 'Agent Skill'],
  }),
  blocks: [
    { type: 'bullets', title: 'What you can ask Claude Code to do', bullets: [
      'Add WhatsApp messaging to the app you are building \u2014 Claude Code writes the server-side code and tests it against your real WhatsApp number.',
      'Create the Gambot account, hand you the Meta connection link, and verify when it is connected.',
      'Send a test message, choose text vs. template based on the 24-hour window, and confirm delivery status.',
      'Register a webhook for incoming messages and status updates and test that your endpoint receives them.',
    ] },
    { type: 'bullets', title: 'Requirements', bullets: [NO_ACCOUNT_BULLET, TOKEN_BULLET, 'Node.js 18+ for the local (npx) server. The hosted server needs no local install.'] },
    { type: 'steps', title: 'Setup', steps: [
      { title: 'Add the server', text: 'Run one command (below). Local uses npx; hosted uses OAuth and needs no Node.' },
      { title: 'Authenticate (hosted only)', text: 'In Claude Code run /mcp, select gambot, and sign in. Local servers use the GAMBOT_TOKEN environment variable instead.' },
      { title: 'Optional: install the Skill', text: 'npx skills add gambot-ai/gambot-mcp --skill gambot-whatsapp \u2014 Claude Code then knows when and how to use Gambot for WhatsApp work.' },
      { title: 'Ask', text: '\u201CAdd the official WhatsApp API to this app using Gambot.\u201D' },
    ] },
    { type: 'code', title: 'Install (local, stdio)', code: '# starts in onboarding mode if GAMBOT_TOKEN is not set\nclaude mcp add gambot -- npx -y gambot-mcp\n\n# with an existing account (token from an environment variable)\nclaude mcp add gambot -e GAMBOT_TOKEN=$GAMBOT_TOKEN -- npx -y gambot-mcp' },
    { type: 'code', title: 'Install (hosted, OAuth)', code: `claude mcp add --transport http gambot ${HOSTED_MCP}\n# then in Claude Code:  /mcp  \u2192  gambot  \u2192  Authenticate` },
    { type: 'prompts', title: 'Example prompts', prompts: COMMON_PROMPTS },
    { type: 'bullets', title: 'Troubleshooting', bullets: COMMON_TROUBLE },
    related('claude-code'),
    { type: 'cta', title: 'Add WhatsApp to your app', text: 'Install the server, let Claude Code create the account, connect your number with Meta, and send the first message.', primary: ctaCreate, secondary: { label: 'WhatsApp MCP overview', href: MCP, event: 'mcp_cta_click' } },
  ],
  faq: [
    { q: 'How do I add the official WhatsApp API to my application using Claude Code?', a: 'Run claude mcp add gambot -- npx -y gambot-mcp (or add the hosted server https://gambot-mcp.azurewebsites.net/mcp with --transport http), then ask Claude Code to set up WhatsApp with Gambot. It creates the account, gives you the Meta connection link, and sends a verified test message. Gambot is a Meta Business Solution Provider, so this is the official WhatsApp Business API, not WhatsApp Web automation.' },
    { q: 'Do I need an API key before I start?', a: 'No. Without GAMBOT_TOKEN the server runs in onboarding mode and can create a Gambot account itself. The token appears after WhatsApp is connected (Settings \u2192 General), or you sign in with OAuth on the hosted server.' },
    { q: 'Can Claude Code connect my WhatsApp number to Meta by itself?', a: 'No. Meta requires the business owner to authorize the connection in a browser (Embedded Signup). Claude Code gives you the link and verifies the result afterwards.' },
    { q: 'Where should the token go?', a: 'In an environment variable or secret manager. Do not paste it into the chat or commit it.' },
  ],
};

/* ----------------------------------------------------------------------------------------------- */
export const codex = {
  ...base({
    key: 'codex', slug: 'codex', platform: 'OpenAI Codex',
    h1: 'Add the official WhatsApp API to your app with OpenAI Codex',
    title: 'WhatsApp MCP for OpenAI Codex \u2014 Official WhatsApp Business API | Gambot',
    description: 'Use the Gambot MCP server in OpenAI Codex (CLI or IDE) to add the official WhatsApp Business API to your application: create the account, send messages and templates, receive webhooks and verify delivery.',
    keywords: 'OpenAI Codex WhatsApp, Codex MCP WhatsApp, codex config.toml mcp_servers whatsapp, add WhatsApp API with Codex, official WhatsApp Business API Codex',
    badge: 'Model Context Protocol \u00B7 OpenAI Codex',
    subhead: 'Give ' + strong('OpenAI Codex') + ' the official WhatsApp Business API through one MCP entry in config.toml.',
    primary: { label: 'Create a free account \u2192', href: utm('/OnboardingProcess/', 'codex'), event: 'create_account_click', eventParams: { client: 'codex' } },
    chips: ['config.toml', 'npx gambot-mcp', 'stdio', 'Agent Skill'],
  }),
  blocks: [
    { type: 'bullets', title: 'What you can ask Codex to do', bullets: [
      'Add WhatsApp notifications or two-way messaging to your codebase and test with a real message.',
      'Create the Gambot account and guide you through the one browser step with Meta.',
      'Pick text vs. template from the 24-hour window, send, and confirm delivery.',
      'Register and test a webhook for incoming messages.',
    ] },
    { type: 'bullets', title: 'Requirements', bullets: [NO_ACCOUNT_BULLET, TOKEN_BULLET, 'Node.js 18+ (Codex starts the server with npx).'] },
    { type: 'steps', title: 'Setup', steps: [
      { title: 'Add to config.toml', text: 'Put the block below in ~/.codex/config.toml (Codex CLI and IDE extension share it), or use: codex mcp add gambot -- npx -y gambot-mcp.' },
      { title: 'Provide the token (optional at first)', text: 'Leave GAMBOT_TOKEN out to start in onboarding mode; add it once WhatsApp is connected. Keep it in your shell environment rather than the file where possible.' },
      { title: 'Restart and check', text: 'Restart Codex and confirm the gambot tools are listed.' },
      { title: 'Ask', text: '\u201CUse Gambot to add the official WhatsApp API to this project.\u201D' },
    ] },
    { type: 'code', title: '~/.codex/config.toml', code: '[mcp_servers.gambot]\ncommand = "npx"\nargs = ["-y", "gambot-mcp"]\n# After WhatsApp is connected, add your token (from Settings \u2192 General):\n# env = { GAMBOT_TOKEN = "gmbt_your_token_here" }' },
    { type: 'prompts', title: 'Example prompts', prompts: COMMON_PROMPTS },
    { type: 'bullets', title: 'Troubleshooting', bullets: [
      ...COMMON_TROUBLE,
      'Codex versions differ in how they support remote (HTTP/OAuth) MCP servers. If yours does not, use the local npx server above; the hosted URL is ' + `<code>${HOSTED_MCP}</code>` + ' for clients that support Streamable HTTP with OAuth.',
    ] },
    related('codex'),
    { type: 'cta', title: 'Add WhatsApp to your app', text: 'One config entry, one account, one browser step with Meta \u2014 then your first WhatsApp message.', primary: ctaCreate, secondary: { label: 'WhatsApp MCP overview', href: MCP, event: 'mcp_cta_click' } },
  ],
  faq: [
    { q: 'How do I add the official WhatsApp API to my application using OpenAI Codex?', a: 'Add a [mcp_servers.gambot] entry with command "npx" and args ["-y", "gambot-mcp"] to ~/.codex/config.toml (or run codex mcp add gambot -- npx -y gambot-mcp), restart Codex, and ask it to set up WhatsApp with Gambot. Gambot is a Meta Business Solution Provider, so it is the official WhatsApp Business API.' },
    { q: 'Does Codex need a token to start?', a: 'No. Without GAMBOT_TOKEN the server runs in onboarding mode and can create the account. Add the token after WhatsApp is connected.' },
    { q: 'Is this WhatsApp Web automation?', a: 'No. There is no QR code or linked-device session. Messages go through Meta\u2019s WhatsApp Business (Cloud) API.' },
  ],
};

/* ----------------------------------------------------------------------------------------------- */
export const vscodeCopilot = {
  ...base({
    key: 'vscode-copilot', slug: 'vscode-copilot', platform: 'VS Code / GitHub Copilot',
    h1: 'Add the official WhatsApp API to your app with VS Code and GitHub Copilot',
    title: 'WhatsApp MCP for VS Code & GitHub Copilot \u2014 Official WhatsApp API | Gambot',
    description: 'Connect the Gambot MCP server to VS Code (GitHub Copilot agent mode) to add the official WhatsApp Business API to your application: create the account, send messages and templates, set up webhooks and check delivery.',
    keywords: 'VS Code WhatsApp MCP, GitHub Copilot WhatsApp, .vscode/mcp.json WhatsApp, Copilot agent mode MCP WhatsApp, add WhatsApp API VS Code',
    badge: 'Model Context Protocol \u00B7 VS Code',
    subhead: 'Use ' + strong('GitHub Copilot agent mode in VS Code') + ' with the Gambot MCP server to wire the official WhatsApp Business API into your project.',
    primary: { label: 'Create a free account \u2192', href: utm('/OnboardingProcess/', 'github', 'copilot'), event: 'create_account_click', eventParams: { client: 'vscode' } },
    chips: ['.vscode/mcp.json', 'Copilot agent mode', 'hosted + OAuth', 'stdio'],
  }),
  blocks: [
    { type: 'bullets', title: 'What you can ask Copilot to do', bullets: [
      'Create a Gambot account and walk you through connecting WhatsApp with Meta.',
      'Generate and test the server-side code that sends WhatsApp messages and templates.',
      'Receive incoming messages through a webhook and verify the endpoint.',
      'Explain and recover from errors using Gambot\u2019s machine-readable error fields.',
    ] },
    { type: 'bullets', title: 'Requirements', bullets: [
      'A VS Code version with MCP support and Copilot agent mode enabled for your account/organization (MCP availability can be controlled by your admin).',
      NO_ACCOUNT_BULLET, TOKEN_BULLET,
    ] },
    { type: 'steps', title: 'Setup', steps: [
      { title: 'Create .vscode/mcp.json', text: 'Use the hosted server (OAuth, no secret in the file) or the local npx server.' },
      { title: 'Start the server', text: 'Open the file in VS Code and use the Start action above the server entry, or the MCP: List Servers command. Sign in when prompted (hosted).' },
      { title: 'Open Copilot chat in Agent mode', text: 'Pick Agent mode and confirm the gambot tools are enabled in the tools picker.' },
      { title: 'Ask', text: '\u201CAdd the official WhatsApp API to this app using Gambot.\u201D' },
    ] },
    { type: 'code', title: '.vscode/mcp.json (hosted, OAuth)', code: `{\n  "servers": {\n    "gambot": {\n      "type": "http",\n      "url": "${HOSTED_MCP}"\n    }\n  }\n}` },
    { type: 'code', title: '.vscode/mcp.json (local, token from a prompt so it is never stored in the file)', code: '{\n  "inputs": [\n    { "id": "gambot_token", "type": "promptString", "description": "Gambot API token (optional at first)", "password": true }\n  ],\n  "servers": {\n    "gambot": {\n      "type": "stdio",\n      "command": "npx",\n      "args": ["-y", "gambot-mcp"],\n      "env": { "GAMBOT_TOKEN": "${input:gambot_token}" }\n    }\n  }\n}' },
    { type: 'prompts', title: 'Example prompts', prompts: COMMON_PROMPTS },
    { type: 'bullets', title: 'Troubleshooting', bullets: COMMON_TROUBLE },
    related('vscode-copilot'),
    { type: 'cta', title: 'Add WhatsApp to your app', text: 'Create the account, connect your number with Meta, and send your first WhatsApp message from VS Code.', primary: ctaCreate, secondary: { label: 'WhatsApp MCP overview', href: MCP, event: 'mcp_cta_click' } },
  ],
  faq: [
    { q: 'How do I add the official WhatsApp API to my application using VS Code and GitHub Copilot?', a: 'Create .vscode/mcp.json with a "gambot" server (type "http" and the URL https://gambot-mcp.azurewebsites.net/mcp for OAuth, or stdio with npx -y gambot-mcp), start it, switch Copilot chat to Agent mode, and ask it to set up WhatsApp with Gambot.' },
    { q: 'Where do I keep the token?', a: 'Use OAuth on the hosted server, or the promptString input shown above so the token is never written to the file.' },
    { q: 'Is this the official WhatsApp API?', a: 'Yes. Gambot is a Meta Business Solution Provider; messages go through the WhatsApp Business (Cloud) API, not WhatsApp Web automation.' },
  ],
};

/* ----------------------------------------------------------------------------------------------- */
export const windsurf = {
  ...base({
    key: 'windsurf', slug: 'windsurf', platform: 'Windsurf',
    h1: 'Add the official WhatsApp API to your app with Windsurf',
    title: 'WhatsApp MCP for Windsurf \u2014 Official WhatsApp Business API | Gambot',
    description: 'Connect the Gambot MCP server to Windsurf (Cascade) to add the official WhatsApp Business API to your application: create the account, send messages and templates, set up webhooks and verify delivery.',
    keywords: 'Windsurf WhatsApp MCP, Cascade MCP WhatsApp, mcp_config.json WhatsApp, add WhatsApp API Windsurf',
    badge: 'Model Context Protocol \u00B7 Windsurf',
    subhead: 'Give ' + strong('Windsurf Cascade') + ' the official WhatsApp Business API with one MCP server entry.',
    primary: { label: 'Create a free account \u2192', href: utm('/OnboardingProcess/', 'windsurf'), event: 'create_account_click', eventParams: { client: 'windsurf' } },
    chips: ['mcp_config.json', 'npx gambot-mcp', 'Cascade', 'stdio'],
  }),
  blocks: [
    { type: 'bullets', title: 'What you can ask Cascade to do', bullets: [
      'Set up WhatsApp for your project end to end, including the Meta connection hand-off.',
      'Send test messages and templates and verify delivery.',
      'Add a webhook endpoint for incoming messages to your codebase and test it.',
    ] },
    { type: 'bullets', title: 'Requirements', bullets: [NO_ACCOUNT_BULLET, TOKEN_BULLET, 'Node.js 18+ (Windsurf starts the server with npx).'] },
    { type: 'steps', title: 'Setup', steps: [
      { title: 'Open the MCP config', text: 'In Windsurf, open Cascade\u2019s MCP settings (the MCPs / plugins area), or edit ~/.codeium/windsurf/mcp_config.json directly.' },
      { title: 'Add the server', text: 'Paste the JSON below into the mcpServers object and save.' },
      { title: 'Refresh', text: 'Refresh the MCP list in Cascade and confirm the gambot tools appear.' },
      { title: 'Ask', text: '\u201CUse Gambot to add the official WhatsApp API to this project.\u201D' },
    ] },
    { type: 'code', title: '~/.codeium/windsurf/mcp_config.json', code: MCP_STDIO_CONFIG },
    { type: 'prompts', title: 'Example prompts', prompts: COMMON_PROMPTS },
    { type: 'bullets', title: 'Troubleshooting', bullets: [
      ...COMMON_TROUBLE,
      'Windsurf limits the total number of enabled tools across servers. If gambot tools are missing, disable servers you do not need.',
    ] },
    related('windsurf'),
    { type: 'cta', title: 'Add WhatsApp to your app', text: 'One config entry, one account, then your first WhatsApp message from Windsurf.', primary: ctaCreate, secondary: { label: 'WhatsApp MCP overview', href: MCP, event: 'mcp_cta_click' } },
  ],
  faq: [
    { q: 'How do I add the official WhatsApp API to my application using Windsurf?', a: 'Add the gambot server (command npx, args ["-y","gambot-mcp"]) to ~/.codeium/windsurf/mcp_config.json, refresh the MCP list in Cascade, and ask it to set up WhatsApp with Gambot.' },
    { q: 'Do I need a token first?', a: 'No. Without GAMBOT_TOKEN the server runs in onboarding mode and can create your Gambot account. Add the token after WhatsApp is connected.' },
    { q: 'Is it the official WhatsApp Business API?', a: 'Yes. Gambot is a Meta Business Solution Provider; there is no QR code or WhatsApp Web session.' },
  ],
};

/* ----------------------------------------------------------------------------------------------- */
export const replit = {
  ...base({
    key: 'replit', slug: 'replit', platform: 'Replit',
    h1: 'Add the official WhatsApp API to your Replit app',
    title: 'WhatsApp API for Replit \u2014 Official WhatsApp Business API + MCP | Gambot',
    description: 'Add the official WhatsApp Business API to an app built on Replit. Connect the hosted Gambot MCP server to Replit Agent for setup and testing, and call the REST API from your app\u2019s backend with a Replit Secret.',
    keywords: 'Replit WhatsApp API, Replit Agent MCP WhatsApp, add WhatsApp to Replit app, WhatsApp Business API Replit',
    badge: 'MCP + REST \u00B7 Replit',
    subhead: 'Two parts: ' + strong('Replit Agent') + ' uses the Gambot MCP server while it builds, and ' + strong('your running app') + ' calls the REST API with a Replit Secret.',
    primary: { label: 'Create a free account \u2192', href: utm('/OnboardingProcess/', 'replit', 'platform'), event: 'create_account_click', eventParams: { client: 'replit' } },
    chips: ['Replit Agent MCP', 'hosted + OAuth', 'REST + Secrets', 'webhooks'],
  }),
  blocks: [
    { type: 'prose', title: 'How it fits together', paragraphs: [
      'Replit Agent can connect to remote MCP servers by URL, so it can create your Gambot account, check the WhatsApp connection and send test messages while it builds. Your deployed app is separate: it should call the Gambot REST API from server code, with the token stored as a Replit Secret.',
    ] },
    { type: 'bullets', title: 'Requirements', bullets: [NO_ACCOUNT_BULLET, TOKEN_BULLET, 'A Replit plan that includes Agent with MCP servers.'] },
    { type: 'steps', title: 'Setup', steps: [
      { title: 'Add the MCP server to Agent', text: 'On replit.com/integrations, open MCP Servers for Replit Agent, click + Add MCP server, name it Gambot, paste the URL below and click Test & save. Complete the OAuth sign-in if prompted.' },
      { title: 'Let Agent set up WhatsApp', text: 'Ask: \u201CSet up the official WhatsApp API for this app using Gambot.\u201D Agent creates the account and gives you the Meta connection link.' },
      { title: 'Store the token as a Secret', text: 'Add GAMBOT_TOKEN in the Secrets tool. Server code reads it from the environment; it is never sent to the browser.' },
      { title: 'Call the REST API from your backend', text: 'Use the snippet below, or ask Agent to add send and webhook routes.' },
    ] },
    { type: 'code', title: 'MCP server URL for Replit Agent', code: HOSTED_MCP },
    { type: 'code', title: 'Backend route (Node/Express) using a Replit Secret', code: "import express from 'express';\nconst app = express();\napp.use(express.json());\n\napp.post('/api/whatsapp/send', async (req, res) => {\n  const { to, text } = req.body;\n  const r = await fetch('https://api.gambot.co.il/api/v1/messages/send-text', {\n    method: 'POST',\n    headers: {\n      Authorization: `Bearer ${process.env.GAMBOT_TOKEN}`, // Replit Secret\n      'Content-Type': 'application/json',\n    },\n    body: JSON.stringify({ to, text }),\n  });\n  res.status(r.status).json(await r.json());\n});\n\napp.listen(3000);" },
    { type: 'prompts', title: 'Example prompts', prompts: [
      { user: 'Use the Gambot MCP server to set up WhatsApp for this app and tell me what I need to do in the browser.' },
      { user: 'Add a /api/whatsapp/send route that uses the GAMBOT_TOKEN secret and checks the 24-hour window first.' },
      { user: 'Add a webhook endpoint that receives incoming WhatsApp messages and register it with Gambot.' },
    ] },
    { type: 'bullets', title: 'Troubleshooting', bullets: [
      ...COMMON_TROUBLE,
      'Webhooks need a public HTTPS URL: use your deployed Replit URL (or the dev URL while testing) when registering the webhook.',
    ] },
    related('replit'),
    { type: 'cta', title: 'Add WhatsApp to your Replit app', text: 'Connect the MCP server, finish the Meta step, store the token as a Secret, and send your first message.', primary: ctaCreate, secondary: { label: 'REST API docs', href: DOCS + '?lang=en', event: 'developer_docs_click' } },
  ],
  faq: [
    { q: 'How do I add the official WhatsApp API to my application using Replit?', a: 'Add the Gambot MCP server (https://gambot-mcp.azurewebsites.net/mcp) to Replit Agent under MCP Servers, let Agent create your Gambot account and give you the Meta connection link, store your API token as a Replit Secret named GAMBOT_TOKEN, and call https://api.gambot.co.il/api/v1/messages/send-text from your backend.' },
    { q: 'Does my deployed app use the MCP server?', a: 'No. MCP is for the agent that builds the app. The running app calls the REST API from server code.' },
    { q: 'Where do I keep the token?', a: 'In Replit Secrets. Do not put it in client-side code or commit it.' },
  ],
};

/* ----------------------------------------------------------------------------------------------- */
export const lovable = {
  ...base({
    key: 'lovable', slug: 'lovable', platform: 'Lovable',
    h1: 'Add the official WhatsApp API to your Lovable app',
    title: 'WhatsApp API for Lovable \u2014 Official WhatsApp Business API | Gambot',
    description: 'Add the official WhatsApp Business API to an app built with Lovable. Connect the Gambot MCP server as a chat connector for setup and testing, and send messages from a backend function with your token stored as a secret.',
    keywords: 'Lovable WhatsApp, Lovable MCP WhatsApp, add WhatsApp to Lovable app, WhatsApp Business API Lovable, Lovable custom MCP connector',
    badge: 'MCP + REST \u00B7 Lovable',
    subhead: 'Use Lovable\u2019s custom MCP connector to set up and test WhatsApp ' + strong('while you build') + '; your running app sends messages through a backend function with the token as a secret.', 
    primary: { label: 'Create a free account \u2192', href: utm('/OnboardingProcess/', 'lovable', 'platform'), event: 'create_account_click', eventParams: { client: 'lovable' } },
    chips: ['custom MCP connector', 'OAuth', 'backend function', 'secrets'],
  }),
  blocks: [
    { type: 'prose', title: 'How it fits together', paragraphs: [
      'In Lovable, a custom MCP server is a personal <em>chat connector</em>: it gives Lovable live context and tools while you build. It is not part of the app you publish, and published-app users do not get it. So the setup has two parts: use the MCP connector to create the account and test WhatsApp, then have your app call the Gambot REST API from backend code with the token stored as a secret.',
    ] },
    { type: 'bullets', title: 'Requirements', bullets: [NO_ACCOUNT_BULLET, TOKEN_BULLET, 'Never put the token in front-end code: the browser would expose it. Keep it in a backend function secret.'] },
    { type: 'steps', title: 'Setup', steps: [
      { title: 'Add the custom MCP connector', text: 'In Lovable open Connectors, scroll to the bottom of the All view and choose the Custom MCP card. Name it Gambot, paste the URL below, keep OAuth selected and click Add & authorize.' },
      { title: 'Set up WhatsApp in chat', text: 'Ask: \u201CUse Gambot to set up the official WhatsApp API.\u201D It creates the account and gives you the Meta connection link to open in a browser.' },
      { title: 'Store the token as a secret', text: 'Ask Lovable to add a backend function for sending WhatsApp messages and to store GAMBOT_TOKEN as a secret for it.' },
      { title: 'Wire the UI', text: 'The front end calls your backend function; the function calls Gambot. Ask Lovable to check the 24-hour window and fall back to a template.' },
    ] },
    { type: 'code', title: 'MCP server URL for the Lovable connector', code: HOSTED_MCP },
    { type: 'code', title: 'What the backend function should call', code: "POST https://api.gambot.co.il/api/v1/messages/send-text\nAuthorization: Bearer <GAMBOT_TOKEN from the function secret>\nContent-Type: application/json\n\n{ \"to\": \"12025550123\", \"text\": \"Your booking is confirmed.\" }\n\n# Outside the 24-hour window use /messages/send-template with an approved templateId." },
    { type: 'prompts', title: 'Example prompts', prompts: [
      { user: 'Use the Gambot connector to set up WhatsApp for this app and tell me what I need to do in the browser.' },
      { user: 'Add a backend function that sends a WhatsApp message through the Gambot REST API using a GAMBOT_TOKEN secret. Never expose the token to the browser.' },
      { user: 'When a customer submits the booking form, send them a WhatsApp confirmation; use a template if the 24-hour window is closed.' },
    ] },
    { type: 'bullets', title: 'Troubleshooting', bullets: [
      ...COMMON_TROUBLE,
      'The connector does not appear in a published app by design \u2014 chat connectors only help while building. Use the backend function for the running app.',
      'Some workspaces restrict custom MCP connectors; ask a workspace admin if the Custom MCP card is missing.',
    ] },
    related('lovable'),
    { type: 'cta', title: 'Add WhatsApp to your Lovable app', text: 'Connect the MCP server, finish the Meta step, then let your backend send the first message.', primary: ctaCreate, secondary: { label: 'REST API docs', href: DOCS + '?lang=en', event: 'developer_docs_click' } },
  ],
  faq: [
    { q: 'How do I add the official WhatsApp API to my application using Lovable?', a: 'Add the Gambot MCP server (https://gambot-mcp.azurewebsites.net/mcp) as a custom MCP connector so Lovable can set up your account and test WhatsApp, then have your app send messages from a backend function that calls https://api.gambot.co.il/api/v1/messages/send-text with the API token stored as a secret.' },
    { q: 'Does the MCP connector work inside my published app?', a: 'No. Lovable chat connectors give context while you build and are not available to published-app users. Use the REST API from backend code in the running app.' },
    { q: 'Is this the official WhatsApp Business API?', a: 'Yes. Gambot is a Meta Business Solution Provider; there is no WhatsApp Web session or QR code.' },
  ],
};

/* ----------------------------------------------------------------------------------------------- */
export const base44 = {
  ...base({
    key: 'base44', slug: 'base44', platform: 'Base44',
    h1: 'Add the official WhatsApp API to your Base44 app',
    title: 'WhatsApp API for Base44 \u2014 Official WhatsApp Business API | Gambot',
    description: 'Add the official WhatsApp Business API to an app built on Base44. Use the Gambot MCP connection in the builder chat for setup, and send messages from a Base44 backend function with your token stored as a secret.',
    keywords: 'Base44 WhatsApp, Base44 MCP WhatsApp, add WhatsApp to Base44 app, Base44 backend function WhatsApp API',
    badge: 'MCP + REST \u00B7 Base44',
    subhead: 'Base44 MCP connections help ' + strong('while you build') + '; your running app sends messages through a backend function with the token as a secret.',
    primary: { label: 'Create a free account \u2192', href: utm('/OnboardingProcess/', 'base44', 'platform'), event: 'create_account_click', eventParams: { client: 'base44' } },
    chips: ['MCP connections', 'backend functions', 'secrets', 'webhooks'],
  }),
  blocks: [
    { type: 'prose', title: 'How it fits together', paragraphs: [
      'Base44 lets you add custom MCP servers to your account so the builder chat can use external tools while you build. Those MCP connections are not available to your running app (flows, automations or backend functions). For the live app, call the Gambot REST API from a Base44 backend function and keep the token in the app\u2019s secrets.',
    ] },
    { type: 'bullets', title: 'Requirements', bullets: [NO_ACCOUNT_BULLET, TOKEN_BULLET, 'MCP connections require a Base44 plan that includes them (Builder or higher at the time of writing).'] },
    { type: 'steps', title: 'Setup', steps: [
      { title: 'Add the MCP connection', text: 'In Account Settings \u2192 MCP Connections add a server named Gambot with the URL below and choose OAuth.' },
      { title: 'Set up WhatsApp in the builder chat', text: 'Ask: \u201CUse the Gambot MCP to set up the official WhatsApp API.\u201D It creates the account and returns the Meta connection link.' },
      { title: 'Store the token', text: 'Save GAMBOT_TOKEN as an app secret (dashboard, or the Base44 CLI: base44 secrets set GAMBOT_TOKEN=\u2026).' },
      { title: 'Add a backend function', text: 'Create the function below (base44/functions/send-whatsapp/entry.ts) and call it from your UI through the Base44 SDK.' },
    ] },
    { type: 'code', title: 'MCP server URL for Base44', code: HOSTED_MCP },
    { type: 'code', title: 'Backend function: base44/functions/send-whatsapp/entry.ts', code: "import { secrets } from \"base44:runtime\";\n\nexport default async function (req: Request): Promise<Response> {\n  const { to, text } = await req.json();\n  const res = await fetch(\"https://api.gambot.co.il/api/v1/messages/send-text\", {\n    method: \"POST\",\n    headers: {\n      Authorization: `Bearer ${secrets.get(\"GAMBOT_TOKEN\")}`, // read inside the handler\n      \"Content-Type\": \"application/json\",\n    },\n    body: JSON.stringify({ to, text }),\n  });\n  return new Response(await res.text(), {\n    status: res.status,\n    headers: { \"Content-Type\": \"application/json\" },\n  });\n}" },
    { type: 'prompts', title: 'Example prompts', prompts: [
      { user: 'Use the Gambot MCP to set up WhatsApp for this app and tell me what I must do in the browser.' },
      { user: 'Create a backend function that sends a WhatsApp message through Gambot using the GAMBOT_TOKEN secret.' },
      { user: 'Add a second function that receives Gambot webhook events for incoming WhatsApp messages and stores them.' },
    ] },
    { type: 'bullets', title: 'Troubleshooting', bullets: [
      ...COMMON_TROUBLE,
      'If the function returns 401, the secret is missing or wrong: read it with secrets.get() inside the handler (not at module load) and re-check the value.',
      'Incoming messages: every Base44 backend function has its own HTTP endpoint, which you can register as the Gambot webhook URL.',
    ] },
    related('base44'),
    { type: 'cta', title: 'Add WhatsApp to your Base44 app', text: 'Connect the MCP server, finish the Meta step, and send the first message from a backend function.', primary: ctaCreate, secondary: { label: 'REST API docs', href: DOCS + '?lang=en', event: 'developer_docs_click' } },
  ],
  faq: [
    { q: 'How do I add the official WhatsApp API to my application using Base44?', a: 'Add the Gambot MCP server (https://gambot-mcp.azurewebsites.net/mcp) under Account Settings \u2192 MCP Connections so the builder chat can set up your account, store your Gambot API token as an app secret, and add a backend function that calls https://api.gambot.co.il/api/v1/messages/send-text with that secret.' },
    { q: 'Can my running Base44 app call the MCP server?', a: 'No. Base44 MCP connections are only for the builder chat. The running app calls the REST API from a backend function.' },
    { q: 'How do I receive WhatsApp messages in Base44?', a: 'Create a backend function (each has its own HTTP endpoint) and register its URL with Gambot using POST /webhooks/forward or the gambot_register_webhook tool.' },
  ],
};

/* ----------------------------------------------------------------------------------------------- */
export const agentSkill = {
  ...base({
    key: 'agent-skill', slug: 'agent-skill', platform: 'Agent Skill',
    h1: 'Gambot Agent Skill \u2014 teach your coding agent the official WhatsApp API',
    title: 'Gambot WhatsApp Agent Skill \u2014 Official WhatsApp Business API for AI agents | Gambot',
    description: 'An open Agent Skill that teaches AI coding agents how to add the official WhatsApp Business API with Gambot: account, Meta onboarding, authentication, first message, templates, webhooks and error recovery.',
    keywords: 'WhatsApp Agent Skill, SKILL.md WhatsApp, Claude Code skill WhatsApp, Codex skill WhatsApp, npx skills add WhatsApp, official WhatsApp API skill',
    badge: 'Agent Skills \u00B7 open standard',
    subhead: 'Install one skill and your agent knows ' + strong('when to use the official WhatsApp API, how to onboard, and how to recover from errors') + ' \u2014 without you explaining it each time.',
    primary: { label: 'View the skill on GitHub', href: SKILL_URL, event: 'github_click', eventParams: { target: 'agent_skill' } },
    chips: ['SKILL.md', 'npx skills add', 'progressive disclosure', 'MIT'],
  }),
  blocks: [
    { type: 'bullets', title: 'What the skill teaches', bullets: [
      'When Gambot is the right choice \u2014 and why unofficial WhatsApp Web / QR-session libraries are not for production.',
      'Account creation, the browser-only Meta onboarding step, and how credentials are handled (OAuth first, never in chat).',
      'Connecting the local or hosted MCP server, or calling the REST API directly.',
      'Sending a first test message, the 24-hour window, templates, webhooks and delivery status.',
      'A verification checklist and structured error recovery (<code>error_code</code>, <code>can_recover</code>, <code>required_tool</code>, <code>template_required</code>).',
    ] },
    { type: 'steps', title: 'Install', steps: [
      { title: 'Install the skill', text: 'Run the command below in your project (or globally). It copies skills/gambot-whatsapp into the folder your agent reads skills from.' },
      { title: 'Add the MCP server (recommended)', text: 'The skill works with the MCP server or with plain REST. With MCP the agent can act directly; see the client guides.' },
      { title: 'Ask naturally', text: '\u201CAdd the official WhatsApp API to this app.\u201D The agent loads the skill when the task matches its description.' },
    ] },
    { type: 'code', title: 'Install', code: 'npx skills add gambot-ai/gambot-mcp --skill gambot-whatsapp\n\n# or copy the folder manually:\n# https://github.com/gambot-ai/gambot-mcp/tree/main/skills/gambot-whatsapp' },
    { type: 'table', title: 'Skill contents', columns: ['File', 'Purpose'], rows: [
      ['<code>SKILL.md</code>', 'When to use Gambot, the workflow, the rules that prevent most failures, and the verification checklist'],
      ['<code>references/authentication.md</code>', 'OAuth vs token, secret handling'],
      ['<code>references/onboarding.md</code>', 'Account creation and the Meta connection hand-off'],
      ['<code>references/mcp.md</code>', 'Local and hosted MCP setup per client; tool map'],
      ['<code>references/rest-api.md</code>', 'Endpoints, envelope, curl examples'],
      ['<code>references/messages.md</code>, <code>templates.md</code>', 'First message, 24-hour window, templates'],
      ['<code>references/webhooks.md</code>', 'Registering and verifying webhooks'],
      ['<code>references/errors.md</code>, <code>examples.md</code>', 'Error recovery and Node/Python/Next.js/Laravel examples'],
    ] },
    { type: 'bullets', title: 'Compatibility', bullets: [
      'Agent Skills are an open format. Compatible agents (such as Claude Code, OpenAI Codex, Cursor, Gemini CLI and VS Code with GitHub Copilot) can load a skill folder; check your client\u2019s documentation for the exact skills directory and whether your version supports skills.',
      'The skill is plain Markdown. If your agent does not support skills, paste the relevant reference file into its instructions, or use the MCP server directly.',
    ] },
    related('agent-skill'),
    { type: 'cta', title: 'Give your agent the official WhatsApp API', text: 'Install the skill, add the MCP server, and let your agent do the integration.', primary: ctaCreate, secondary: { label: 'WhatsApp MCP overview', href: MCP, event: 'mcp_cta_click' } },
  ],
  faq: [
    { q: 'What is the Gambot Agent Skill?', a: 'A SKILL.md package that teaches AI coding agents how to add the official WhatsApp Business API with Gambot: when to use it, onboarding, authentication, sending the first message, templates, webhooks and error recovery.' },
    { q: 'How do I install it?', a: 'Run npx skills add gambot-ai/gambot-mcp --skill gambot-whatsapp, or copy the skills/gambot-whatsapp folder from the gambot-mcp repository into your agent\u2019s skills directory.' },
    { q: 'Does the skill need the MCP server?', a: 'No. The skill teaches both the MCP and REST paths. The MCP server lets the agent act directly instead of writing code.' },
    { q: 'Does it include any secrets?', a: 'No. It never contains tokens and instructs agents not to ask for tokens in chat.' },
  ],
};

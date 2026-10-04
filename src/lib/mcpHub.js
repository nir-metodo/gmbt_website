/**
 * Single source of truth for the English /whatsapp-mcp/ hub page copy that is ALSO emitted as
 * structured data (FAQPage JSON-LD), so the schema can never drift from what is visible on the page.
 * Facts here mirror the real product: gambot-mcp on npm / GitHub, the token-less onboarding mode of
 * the MCP server, and the public self-serve onboarding endpoints of the Gambot API.
 */

export const MCP_INSTALL_CMD = 'npx -y gambot-mcp';

export const MCP_FAQ_EN = [
  {
    q: 'What is the Gambot WhatsApp MCP server?',
    a: 'Gambot is a WhatsApp Business MCP server for AI agents. It exposes the official WhatsApp Business API as MCP tools, so Claude, ChatGPT, Cursor, Gemini and other MCP clients can send WhatsApp messages and approved templates, run campaigns, and manage contacts, leads, cases, tasks, quotes and invoices.',
  },
  {
    q: 'How is Gambot different from other WhatsApp MCP servers?',
    a: 'Most WhatsApp MCP servers automate WhatsApp Web: a QR-code session on a personal number, with no templates, no webhooks and a risk of the number being blocked. Gambot uses the official WhatsApp Business API, so it supports approved message templates, 24-hour-window rules, opt-out and consent handling, and production use on a business number.',
  },
  {
    q: 'Do I need a Gambot account before I start?',
    a: 'No. Run "npx -y gambot-mcp" without a token and the server starts in onboarding mode: your AI agent can check for an existing account, create a free-trial account, and give you a secure link to connect your WhatsApp number in the browser (Meta Embedded Signup). Once WhatsApp is connected, you get your API token and set GAMBOT_TOKEN to unlock the full tool set. No sales call is needed.',
  },
  {
    q: 'How do I connect Claude, ChatGPT or Cursor?',
    a: 'Add the server to your MCP client with the command "npx -y gambot-mcp" (Claude Desktop, Cursor, Gemini CLI), or use the hosted remote connector with OAuth (ChatGPT and Claude custom connectors). Setting GAMBOT_TOKEN is optional at first: without it the agent walks you through account creation.',
  },
  {
    q: 'Is this the official WhatsApp API?',
    a: 'Yes. Gambot is an official Meta Business Solution Provider and the MCP server runs on the authorized WhatsApp Business (Cloud) API. There are no QR-code sessions and no unofficial libraries.',
  },
  {
    q: 'What can an AI agent do through Gambot?',
    a: 'Send WhatsApp text and approved templates, list conversations and messages, create and schedule campaigns, manage contacts, leads, cases and tasks, create quotes, invoices and e-signatures, and read analytics. The API returns machine-readable states (for example, a closed 24-hour window) with a recommended next action, so the agent recovers instead of guessing.',
  },
  {
    q: 'Where can I find the code and package?',
    a: 'The MCP server is open source (MIT) on GitHub at github.com/gambot-ai/gambot-mcp and is published on npm as gambot-mcp. API documentation is at gambot.co.il/developers/.',
  },
];

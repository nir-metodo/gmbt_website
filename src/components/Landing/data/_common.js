/** Shared, REAL Gambot resources + CTA definitions for the developer/MCP/AI-agent landing pages. */
export const SIGNUP = 'https://gambot.co.il/OnboardingProcess/';
export const DOCS = 'https://gambot.co.il/developers/';
export const MCP = 'https://gambot.co.il/whatsapp-mcp/';
export const AI_AGENTS = 'https://gambot.co.il/whatsapp-api-for-ai-agents/';
export const DEVELOPERS = 'https://gambot.co.il/whatsapp-api-for-developers/';
export const GITHUB = 'https://github.com/gambot-ai/gambot-mcp';
export const NPM = 'https://www.npmjs.com/package/gambot-mcp';
export const API_BASE = 'https://api.gambot.co.il/api/v1';
export const HOSTED_MCP = 'https://gambot-mcp.azurewebsites.net/mcp';

export const ctaCreate = { label: 'Create free account →', href: SIGNUP, event: 'create_account_click' };
export const ctaDocs = { label: 'Read the API docs', href: DOCS, event: 'developer_docs_click' };
export const ctaMcp = { label: 'WhatsApp MCP setup', href: MCP, event: 'mcp_cta_click' };
export const ctaGithub = { label: 'View on GitHub', href: GITHUB, event: 'github_click' };

export const HOME = { name: 'Gambot', item: 'https://gambot.co.il/' };
export const CRUMB_DEV = { name: 'Developers', item: DOCS };
export const CRUMB_MCP = { name: 'WhatsApp MCP', item: MCP };

/** Standard local (stdio) MCP client config used by Cursor / Claude Desktop / Gemini CLI. */
export const MCP_STDIO_CONFIG = `{
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

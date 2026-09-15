/**
 * English SEO landing page for the Gambot WhatsApp MCP server.
 * Target intent: "WhatsApp MCP", "connect WhatsApp to Claude/ChatGPT/Gemini",
 * "WhatsApp API for AI agents", "authorized/official WhatsApp API".
 * Self-contained (server component, no hooks) for best SSR/SEO. Nav/footer come from SiteChrome.
 */

const GREEN = '#25D366';
const DARK = '#0b141a';
const CARD = '#131f27';
const BORDER = '#22323d';
const TEXT = '#e9edef';
const MUTED = '#8fa3ad';

const cursorConfig = `{
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

// One-click install deeplink for Cursor (config = base64 of the server block).
const CURSOR_DEEPLINK = 'cursor://anysphere.cursor-deeplink/mcp/install?name=gambot&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImdhbWJvdC1tY3AiXSwiZW52Ijp7IkdBTUJPVF9UT0tFTiI6IiJ9fQ==';

const TOOL_GROUPS = [
  { title: 'Messaging', items: ['Send WhatsApp text', 'Send approved templates', 'List conversations & messages'] },
  { title: 'Campaigns', items: ['Create manual / scheduled / recurring', 'Mail-merge blast from a spreadsheet', 'Built-in opt-out & consent'] },
  { title: 'CRM', items: ['Contacts & leads', 'Cases & tasks', 'Dynamic custom fields'] },
  { title: 'Sales & docs', items: ['Quotes, invoices, orders', 'Web forms & submissions', 'Document templates & e-signatures'] },
  { title: 'Templates', items: ['Create text / media templates', 'Body variables, buttons, footer', 'Upload template media'] },
  { title: 'Onboarding', items: ['Create trial / paid accounts', 'Buy a number by country', 'Add a payment method'] },
];

const FAQ = [
  { q: 'What is the WhatsApp MCP server?', a: 'A Model Context Protocol (MCP) server for the Gambot WhatsApp Business API. It exposes WhatsApp actions as tools so AI agents like Claude, ChatGPT, Gemini and Cursor can send WhatsApp messages and templates, run campaigns and manage CRM data directly.' },
  { q: 'How do I connect WhatsApp to Claude or ChatGPT?', a: 'Add the Gambot MCP server to your client config with the command "npx -y gambot-mcp" and your Gambot token as GAMBOT_TOKEN. The AI agent can then send WhatsApp through Gambot.' },
  { q: 'Is it an official / authorized WhatsApp API?', a: 'Yes. Gambot is an official Meta Business Solution Provider, so the server runs on the authorized WhatsApp Business (Cloud) API — not an unofficial workaround.' },
  { q: 'How do I install it?', a: 'No build needed — MCP clients run it on demand with "npx -y gambot-mcp". Provide GAMBOT_TOKEN (a gmbt_… token from Gambot Settings → General). It is also published to the MCP Registry and Smithery.' },
  { q: 'Which AI tools are supported?', a: 'Any MCP-compatible client, including Claude Desktop, Cursor, and other assistants that support the Model Context Protocol.' },
];

export default function WhatsAppMcpContent() {
  return (
    <main style={{ background: DARK, color: TEXT, fontFamily: 'Rubik, "Open Sans", system-ui, sans-serif', direction: 'ltr' }}>
      <style>{`
        .wm-wrap { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
        .wm-btn { display:inline-block; padding:14px 26px; border-radius:10px; font-weight:600; text-decoration:none; transition:transform .15s ease, opacity .15s ease; }
        .wm-btn:hover { transform: translateY(-2px); }
        .wm-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px; }
        .wm-pre { background:#0f1a21; border:1px solid ${BORDER}; border-radius:12px; padding:18px 20px; overflow:auto; font-family:"SF Mono",Menlo,Consolas,monospace; font-size:13.5px; line-height:1.6; color:#cfe9d8; }
        .wm-h2 { font-size:30px; font-weight:700; margin:0 0 10px; }
        .wm-card { background:${CARD}; border:1px solid ${BORDER}; border-radius:14px; padding:22px; }
        .wm-badge { border:1px solid ${BORDER}; border-radius:999px; padding:8px 16px; color:${TEXT}; font-weight:500; font-size:14px; background:#0f1a21; }
        @media (max-width:600px){ .wm-h1{ font-size:34px !important; } .wm-h2{ font-size:24px !important; } }
      `}</style>

      {/* Hero */}
      <section style={{ padding: '72px 0 48px', textAlign: 'center' }}>
        <div className="wm-wrap">
          <div style={{ display: 'inline-block', background: 'rgba(37,211,102,0.12)', color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 600, marginBottom: 22 }}>
            Model Context Protocol · Official WhatsApp Business API
          </div>
          <h1 className="wm-h1" style={{ fontSize: 52, lineHeight: 1.1, fontWeight: 800, margin: '0 0 18px' }}>
            WhatsApp MCP Server
          </h1>
          <p style={{ fontSize: 20, color: MUTED, maxWidth: 720, margin: '0 auto 14px', lineHeight: 1.6 }}>
            Connect <strong style={{ color: TEXT }}>WhatsApp</strong> to <strong style={{ color: TEXT }}>Claude, ChatGPT, Gemini and Cursor</strong>.
            Let your AI agent send WhatsApp messages &amp; templates, run campaigns and manage your CRM — through the
            authorized, Meta-approved WhatsApp Business API.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            <a className="wm-btn" href="https://gambot.co.il/OnboardingProcess/" style={{ background: GREEN, color: '#04220f' }}>Get your Gambot token →</a>
            <a className="wm-btn" href="https://gambot.co.il/developers/" style={{ background: 'transparent', color: TEXT, border: `1px solid ${BORDER}` }}>Read the API docs</a>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 34 }}>
            {['Claude', 'ChatGPT', 'Gemini', 'Cursor', 'Any MCP client'].map((n) => (
              <span key={n} className="wm-badge">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Install */}
      <section style={{ padding: '28px 0' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">Install in 30 seconds</h2>
          <p style={{ color: MUTED, marginBottom: 18, fontSize: 16 }}>
            No clone, no build. Add this to your MCP client config (Cursor <code>.cursor/mcp.json</code> or Claude Desktop
            <code> claude_desktop_config.json</code>) and restart it:
          </p>
          <pre className="wm-pre">{cursorConfig}</pre>
          <div style={{ marginTop: 16 }}>
            <a className="wm-btn" href={CURSOR_DEEPLINK} style={{ background: GREEN, color: '#04220f' }}>➕ Add to Cursor (one click)</a>
            <span style={{ display: 'block', marginTop: 8, fontSize: 13, color: MUTED }}>After adding, paste your Gambot token into the server&apos;s env.</span>
          </div>
          <p style={{ color: MUTED, marginTop: 14, fontSize: 15 }}>
            Get your <strong style={{ color: TEXT }}>Gambot token</strong> (<code>gmbt_…</code>) from Gambot
            → <strong style={{ color: TEXT }}>Settings → General</strong>. Optional: set <code>GAMBOT_API_BASE</code> to override the API URL.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '40px 0' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">How it works</h2>
          <div className="wm-grid" style={{ marginTop: 18 }}>
            {[
              { n: '1', t: 'Add the MCP server', d: 'Point your AI client at gambot-mcp with your token. The organization is resolved automatically from the token.' },
              { n: '2', t: 'The agent gets WhatsApp tools', d: 'Messages, templates, campaigns, contacts, leads, quotes, invoices, forms, e-signatures and more become callable tools.' },
              { n: '3', t: 'It acts on WhatsApp', d: 'Ask in natural language — "message these 200 leads with the promo template" — and the agent does it via the official API.' },
            ].map((s) => (
              <div key={s.n} className="wm-card">
                <div style={{ width: 38, height: 38, borderRadius: 10, background: GREEN, color: '#04220f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, marginBottom: 12 }}>{s.n}</div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{s.t}</h3>
                <p style={{ color: MUTED, margin: 0, lineHeight: 1.6, fontSize: 15 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section style={{ padding: '40px 0' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">Everything your agent can do</h2>
          <p style={{ color: MUTED, marginBottom: 18, fontSize: 16 }}>60+ tools across the full Gambot WhatsApp Business API.</p>
          <div className="wm-grid">
            {TOOL_GROUPS.map((g) => (
              <div key={g.title} className="wm-card">
                <h3 style={{ margin: '0 0 12px', fontSize: 17, color: GREEN }}>{g.title}</h3>
                <ul style={{ margin: 0, paddingLeft: 18, color: MUTED, lineHeight: 1.9, fontSize: 15 }}>
                  {g.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why authorized */}
      <section style={{ padding: '40px 0' }}>
        <div className="wm-wrap">
          <div className="wm-card" style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.10), rgba(37,211,102,0.02))' }}>
            <h2 className="wm-h2" style={{ marginBottom: 12 }}>Authorized WhatsApp API — not a workaround</h2>
            <p style={{ color: MUTED, margin: 0, lineHeight: 1.7, fontSize: 16 }}>
              Gambot is an <strong style={{ color: TEXT }}>official Meta Business Solution Provider</strong>. The MCP server runs on the
              approved WhatsApp Business (Cloud) API, so your number stays compliant — with message templates, opt-out handling and
              consent built in. No QR-code hacks, no ban risk from unofficial libraries.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '40px 0 20px' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">Frequently asked questions</h2>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map((f) => (
              <details key={f.q} className="wm-card" style={{ cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, fontSize: 17, listStyle: 'none' }}>{f.q}</summary>
                <p style={{ color: MUTED, margin: '12px 0 0', lineHeight: 1.7, fontSize: 15 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '30px 0 80px', textAlign: 'center' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">Give your AI agent a WhatsApp number</h2>
          <p style={{ color: MUTED, margin: '0 auto 24px', maxWidth: 620, fontSize: 17, lineHeight: 1.6 }}>
            Start free, connect your number, and let Claude, ChatGPT or Gemini run WhatsApp for you.
          </p>
          <a className="wm-btn" href="https://gambot.co.il/OnboardingProcess/" style={{ background: GREEN, color: '#04220f', fontSize: 17 }}>Create a free account →</a>
        </div>
      </section>
    </main>
  );
}

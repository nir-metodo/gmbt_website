'use client';
/**
 * Bilingual SEO landing page for the Gambot WhatsApp MCP server.
 * Target intent: "WhatsApp MCP", "connect WhatsApp to Claude/ChatGPT/Gemini",
 * "WhatsApp API for AI agents", "authorized/official WhatsApp API".
 * Follows the site-wide language switch (LanguageContext): Hebrew (RTL) by default for the
 * Israeli audience, English (LTR) when toggled. Nav/footer come from SiteChrome.
 */
import { useLanguage } from '@/contexts/LanguageContext';

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

const CONTENT = {
  en: {
    heroBadge: 'Model Context Protocol · Official WhatsApp Business API',
    heroH1: 'WhatsApp MCP Server',
    heroSub: (
      <>
        Connect <strong style={{ color: TEXT }}>WhatsApp</strong> to <strong style={{ color: TEXT }}>Claude, ChatGPT, Gemini and Cursor</strong>.
        Let your AI agent send WhatsApp messages &amp; templates, run campaigns and manage your CRM — through the
        authorized, Meta-approved WhatsApp Business API.
      </>
    ),
    heroPrimary: 'Get your Gambot token →',
    heroSecondary: 'Read the API docs',
    heroChips: ['Claude', 'ChatGPT', 'Gemini', 'Cursor', 'Any MCP client'],
    installH2: 'Install in 30 seconds',
    installIntro: (
      <>
        No clone, no build. Add this to your MCP client config (Cursor <code>.cursor/mcp.json</code> or Claude Desktop
        <code> claude_desktop_config.json</code>) and restart it:
      </>
    ),
    installBtn: '➕ Add to Cursor (one click)',
    installBtnNote: "After adding, paste your Gambot token into the server's env.",
    installToken: (
      <>
        Get your <strong style={{ color: TEXT }}>Gambot token</strong> (<code>gmbt_…</code>) from Gambot
        → <strong style={{ color: TEXT }}>Settings → General</strong>. Optional: set <code>GAMBOT_API_BASE</code> to override the API URL.
      </>
    ),
    howH2: 'How it works',
    howSteps: [
      { n: '1', t: 'Add the MCP server', d: 'Point your AI client at gambot-mcp with your token. The organization is resolved automatically from the token.' },
      { n: '2', t: 'The agent gets WhatsApp tools', d: 'Messages, templates, campaigns, contacts, leads, quotes, invoices, forms, e-signatures and more become callable tools.' },
      { n: '3', t: 'It acts on WhatsApp', d: 'Ask in natural language — "message these 200 leads with the promo template" — and the agent does it via the official API.' },
    ],
    toolsH2: 'Everything your agent can do',
    toolsIntro: '114 tools across the full Gambot WhatsApp Business API.',
    toolGroups: [
  { title: 'Messaging', items: ['Send WhatsApp text', 'Send approved templates', 'List conversations & messages'] },
  { title: 'Campaigns', items: ['Create manual / scheduled / recurring', 'Mail-merge blast from a spreadsheet', 'Built-in opt-out & consent'] },
  { title: 'CRM', items: ['Contacts & leads', 'Cases & tasks', 'Dynamic custom fields'] },
  { title: 'Sales & docs', items: ['Quotes, invoices, orders', 'Web forms & submissions', 'Document templates & e-signatures'] },
  { title: 'Templates', items: ['Create text / media templates', 'Body variables, buttons, footer', 'Upload template media'] },
  { title: 'Onboarding', items: ['Create trial / paid accounts', 'Buy a number by country', 'Add a payment method'] },
    ],
    authH2: 'Authorized WhatsApp API — not a workaround',
    authText: (
      <>
        Gambot is an <strong style={{ color: TEXT }}>official Meta Business Solution Provider</strong>. The MCP server runs on the
        approved WhatsApp Business (Cloud) API, so your number stays compliant — with message templates, opt-out handling and
        consent built in. No QR-code hacks, no ban risk from unofficial libraries.
      </>
    ),
    setupH2: 'Set up your AI client',
    setupIntro: 'Step-by-step guides for each MCP client, plus developer resources.',
    setupCards: [
      { t: 'WhatsApp MCP for ChatGPT', d: 'Hosted connector (Streamable HTTP + OAuth).', href: 'https://gambot.co.il/whatsapp-mcp/chatgpt/' },
      { t: 'WhatsApp MCP for Claude', d: 'Claude Desktop (npx) or remote connector.', href: 'https://gambot.co.il/whatsapp-mcp/claude/' },
      { t: 'WhatsApp MCP for Cursor', d: 'One-click install or .cursor/mcp.json.', href: 'https://gambot.co.il/whatsapp-mcp/cursor/' },
      { t: 'WhatsApp MCP for Gemini', d: 'Register in the Gemini CLI settings.', href: 'https://gambot.co.il/whatsapp-mcp/gemini/' },
      { t: 'WhatsApp API for AI Agents', d: 'Send, receive, schedule, automate & analyze.', href: 'https://gambot.co.il/whatsapp-api-for-ai-agents/' },
      { t: 'WhatsApp API for Developers', d: 'REST API on the official WhatsApp Business API.', href: 'https://gambot.co.il/whatsapp-api-for-developers/' },
      { t: 'MCP vs WhatsApp Web', d: 'Business API vs Web automation, compared.', href: 'https://gambot.co.il/whatsapp-mcp-vs-whatsapp-web/' },
      { t: 'API documentation', d: 'Auth, scopes, endpoints & error codes.', href: 'https://gambot.co.il/developers/' },
    ],
    faqH2: 'Frequently asked questions',
    faq: [
  { q: 'What is the WhatsApp MCP server?', a: 'A Model Context Protocol (MCP) server for the Gambot WhatsApp Business API. It exposes WhatsApp actions as tools so AI agents like Claude, ChatGPT, Gemini and Cursor can send WhatsApp messages and templates, run campaigns and manage CRM data directly.' },
  { q: 'How do I connect WhatsApp to Claude or ChatGPT?', a: 'Add the Gambot MCP server to your client config with the command "npx -y gambot-mcp" and your Gambot token as GAMBOT_TOKEN. The AI agent can then send WhatsApp through Gambot.' },
  { q: 'Is it an official / authorized WhatsApp API?', a: 'Yes. Gambot is an official Meta Business Solution Provider, so the server runs on the authorized WhatsApp Business (Cloud) API — not an unofficial workaround.' },
  { q: 'How do I install it?', a: 'No build needed — MCP clients run it on demand with "npx -y gambot-mcp". Provide GAMBOT_TOKEN (a gmbt_… token from Gambot Settings → General). It is also published to the MCP Registry and Smithery.' },
  { q: 'Which AI tools are supported?', a: 'Any MCP-compatible client, including Claude Desktop, Cursor, and other assistants that support the Model Context Protocol.' },
    ],
    ctaH2: 'Give your AI agent a WhatsApp number',
    ctaText: 'Start free, connect your number, and let Claude, ChatGPT or Gemini run WhatsApp for you.',
    ctaBtn: 'Create a free account →',
  },
  he: {
    heroBadge: 'Model Context Protocol · WhatsApp Business API רשמי',
    heroH1: 'שרת WhatsApp MCP',
    heroSub: (
      <>
        חברו את <strong style={{ color: TEXT }}>וואטסאפ</strong> ל־<strong style={{ color: TEXT }}>Claude, ChatGPT, Gemini ו־Cursor</strong>.
        תנו לסוכן ה־AI שלכם לשלוח הודעות ותבניות בוואטסאפ, להריץ קמפיינים ולנהל את ה־CRM — דרך
        ה־WhatsApp Business API המורשה והמאושר על ידי Meta.
      </>
    ),
    heroPrimary: 'קבלו את הטוקן של גמבוט →',
    heroSecondary: 'קרא את תיעוד ה־API',
    heroChips: ['Claude', 'ChatGPT', 'Gemini', 'Cursor', 'כל לקוח MCP'],
    installH2: 'התקנה ב־30 שניות',
    installIntro: (
      <>
        בלי שכפול ובלי build. הוסיפו את זה לתצורת לקוח ה־MCP שלכם (Cursor <code>.cursor/mcp.json</code> או Claude Desktop
        <code> claude_desktop_config.json</code>) והפעילו מחדש:
      </>
    ),
    installBtn: '➕ הוסף ל־Cursor (בלחיצה אחת)',
    installBtnNote: 'לאחר ההוספה, הדביקו את הטוקן של גמבוט ל־env של השרת.',
    installToken: (
      <>
        קבלו את <strong style={{ color: TEXT }}>הטוקן של גמבוט</strong> (<code>gmbt_…</code>) מתוך גמבוט
        ← <strong style={{ color: TEXT }}>הגדרות ← כללי</strong>. אופציונלי: הגדירו <code>GAMBOT_API_BASE</code> כדי לעקוף את כתובת ה־API.
      </>
    ),
    howH2: 'איך זה עובד',
    howSteps: [
      { n: '1', t: 'הוסיפו את שרת ה־MCP', d: 'כוונו את לקוח ה־AI שלכם ל־gambot-mcp עם הטוקן שלכם. הארגון מזוהה אוטומטית מהטוקן.' },
      { n: '2', t: 'הסוכן מקבל כלי וואטסאפ', d: 'הודעות, תבניות, קמפיינים, אנשי קשר, לידים, הצעות מחיר, חשבוניות, טפסים, חתימות דיגיטליות ועוד — הופכים לכלים ניתנים לקריאה.' },
      { n: '3', t: 'הוא פועל בוואטסאפ', d: 'בקשו בשפה טבעית — "שלח ל־200 הלידים האלה את תבנית המבצע" — והסוכן עושה זאת דרך ה־API הרשמי.' },
    ],
    toolsH2: 'כל מה שהסוכן שלכם יכול לעשות',
    toolsIntro: '114 כלים על פני כל ה־WhatsApp Business API של גמבוט.',
    toolGroups: [
      { title: 'מסרים', items: ['שליחת טקסט בוואטסאפ', 'שליחת תבניות מאושרות', 'הצגת שיחות והודעות'] },
      { title: 'קמפיינים', items: ['יצירה ידנית / מתוזמנת / חוזרת', 'דיוור ממוזג מגיליון נתונים', 'הסרה והסכמה מובנים'] },
      { title: 'CRM', items: ['אנשי קשר ולידים', 'פניות ומשימות', 'שדות מותאמים דינמיים'] },
      { title: 'מכירות ומסמכים', items: ['הצעות מחיר, חשבוניות, הזמנות', 'טפסי אינטרנט ושליחות', 'תבניות מסמכים וחתימות דיגיטליות'] },
      { title: 'תבניות', items: ['יצירת תבניות טקסט / מדיה', 'משתני גוף, כפתורים, פוטר', 'העלאת מדיה לתבנית'] },
      { title: 'הצטרפות', items: ['יצירת חשבונות טרייל / בתשלום', 'רכישת מספר לפי מדינה', 'הוספת אמצעי תשלום'] },
    ],
    authH2: 'WhatsApp API מורשה — לא עקיפה',
    authText: (
      <>
        גמבוט היא <strong style={{ color: TEXT }}>ספקית פתרונות עסקיים רשמית של Meta</strong>. שרת ה־MCP פועל על
        ה־WhatsApp Business (Cloud) API המאושר, כך שהמספר שלכם נשאר תואם — עם תבניות הודעה, טיפול בהסרה
        והסכמה מובנים. בלי טריקים של QR ובלי סיכון חסימה מספריות לא רשמיות.
      </>
    ),
    setupH2: 'הגדירו את לקוח ה־AI שלכם',
    setupIntro: 'מדריכים שלב־אחר־שלב לכל לקוח MCP, בתוספת משאבים למפתחים.',
    setupCards: [
      { t: 'WhatsApp MCP ל־ChatGPT', d: 'מחבר מתארח (Streamable HTTP + OAuth).', href: 'https://gambot.co.il/whatsapp-mcp/chatgpt/' },
      { t: 'WhatsApp MCP ל־Claude', d: 'Claude Desktop (npx) או מחבר מרוחק.', href: 'https://gambot.co.il/whatsapp-mcp/claude/' },
      { t: 'WhatsApp MCP ל־Cursor', d: 'התקנה בלחיצה אחת או .cursor/mcp.json.', href: 'https://gambot.co.il/whatsapp-mcp/cursor/' },
      { t: 'WhatsApp MCP ל־Gemini', d: 'רישום בהגדרות ה־Gemini CLI.', href: 'https://gambot.co.il/whatsapp-mcp/gemini/' },
      { t: 'WhatsApp API לסוכני AI', d: 'שליחה, קבלה, תזמון, אוטומציה וניתוח.', href: 'https://gambot.co.il/whatsapp-api-for-ai-agents/' },
      { t: 'WhatsApp API למפתחים', d: 'REST API על ה־WhatsApp Business API הרשמי.', href: 'https://gambot.co.il/whatsapp-api-for-developers/' },
      { t: 'MCP מול WhatsApp Web', d: 'Business API מול אוטומציית Web, בהשוואה.', href: 'https://gambot.co.il/whatsapp-mcp-vs-whatsapp-web/' },
      { t: 'תיעוד API', d: 'אימות, הרשאות, נקודות קצה וקודי שגיאה.', href: 'https://gambot.co.il/developers/' },
    ],
    faqH2: 'שאלות נפוצות',
    faq: [
      { q: 'מהו שרת ה־WhatsApp MCP?', a: 'שרת Model Context Protocol (MCP) ל־WhatsApp Business API של גמבוט. הוא חושף פעולות וואטסאפ ככלים, כך שסוכני AI כמו Claude, ChatGPT, Gemini ו־Cursor יכולים לשלוח הודעות ותבניות בוואטסאפ, להריץ קמפיינים ולנהל נתוני CRM ישירות.' },
      { q: 'איך מחברים וואטסאפ ל־Claude או ChatGPT?', a: 'הוסיפו את שרת ה־MCP של גמבוט לתצורת הלקוח עם הפקודה "npx -y gambot-mcp" והטוקן של גמבוט כ־GAMBOT_TOKEN. סוכן ה־AI יכול אז לשלוח וואטסאפ דרך גמבוט.' },
      { q: 'האם זה WhatsApp API רשמי / מורשה?', a: 'כן. גמבוט היא ספקית פתרונות עסקיים רשמית של Meta, ולכן השרת פועל על ה־WhatsApp Business (Cloud) API המורשה — לא עקיפה לא רשמית.' },
      { q: 'איך מתקינים אותו?', a: 'לא צריך build — לקוחות MCP מריצים אותו לפי דרישה עם "npx -y gambot-mcp". ספקו GAMBOT_TOKEN (טוקן gmbt_… מהגדרות גמבוט ← כללי). הוא גם פורסם ל־MCP Registry ול־Smithery.' },
      { q: 'אילו כלי AI נתמכים?', a: 'כל לקוח תואם MCP, כולל Claude Desktop, Cursor ועוזרים נוספים שתומכים ב־Model Context Protocol.' },
    ],
    ctaH2: 'תנו לסוכן ה־AI שלכם מספר וואטסאפ',
    ctaText: 'התחילו חינם, חברו את המספר שלכם, ותנו ל־Claude, ChatGPT או Gemini לנהל עבורכם את הוואטסאפ.',
    ctaBtn: 'צור חשבון חינם →',
  },
};

export default function WhatsAppMcpContent() {
  const { currentLanguage } = useLanguage();
  const isHe = currentLanguage === 'he';
  const c = isHe ? CONTENT.he : CONTENT.en;
  const listPad = isHe ? { paddingRight: 18, paddingLeft: 0 } : { paddingLeft: 18 };
  return (
    <main dir={isHe ? 'rtl' : 'ltr'} style={{ background: DARK, color: TEXT, fontFamily: 'Rubik, "Open Sans", system-ui, sans-serif', direction: isHe ? 'rtl' : 'ltr' }}>
      <style>{`
        .wm-wrap { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
        .wm-btn { display:inline-block; padding:14px 26px; border-radius:10px; font-weight:600; text-decoration:none; transition:transform .15s ease, opacity .15s ease; }
        .wm-btn:hover { transform: translateY(-2px); }
        .wm-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px; }
        .wm-pre { background:#0f1a21; border:1px solid ${BORDER}; border-radius:12px; padding:18px 20px; overflow:auto; font-family:"SF Mono",Menlo,Consolas,monospace; font-size:13.5px; line-height:1.6; color:#cfe9d8; direction:ltr; text-align:left; }
        .wm-h2 { font-size:30px; font-weight:700; margin:0 0 10px; }
        .wm-card { background:${CARD}; border:1px solid ${BORDER}; border-radius:14px; padding:22px; }
        .wm-badge { border:1px solid ${BORDER}; border-radius:999px; padding:8px 16px; color:${TEXT}; font-weight:500; font-size:14px; background:#0f1a21; }
        @media (max-width:600px){ .wm-h1{ font-size:34px !important; } .wm-h2{ font-size:24px !important; } }
      `}</style>

      {/* Hero */}
      <section style={{ padding: '72px 0 48px', textAlign: 'center' }}>
        <div className="wm-wrap">
          <div style={{ display: 'inline-block', background: 'rgba(37,211,102,0.12)', color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 600, marginBottom: 22 }}>
            {c.heroBadge}
          </div>
          <h1 className="wm-h1" style={{ fontSize: 52, lineHeight: 1.1, fontWeight: 800, margin: '0 0 18px' }}>
            {c.heroH1}
          </h1>
          <p style={{ fontSize: 20, color: MUTED, maxWidth: 720, margin: '0 auto 14px', lineHeight: 1.6 }}>
            {c.heroSub}
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            <a className="wm-btn" href="https://gambot.co.il/OnboardingProcess/" style={{ background: GREEN, color: '#04220f' }}>{c.heroPrimary}</a>
            <a className="wm-btn" href="https://gambot.co.il/developers/" style={{ background: 'transparent', color: TEXT, border: `1px solid ${BORDER}` }}>{c.heroSecondary}</a>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 34 }}>
            {c.heroChips.map((n) => (
              <span key={n} className="wm-badge">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Install */}
      <section style={{ padding: '28px 0' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">{c.installH2}</h2>
          <p style={{ color: MUTED, marginBottom: 18, fontSize: 16 }}>
            {c.installIntro}
          </p>
          <pre className="wm-pre">{cursorConfig}</pre>
          <div style={{ marginTop: 16 }}>
            <a className="wm-btn" href={CURSOR_DEEPLINK} style={{ background: GREEN, color: '#04220f' }}>{c.installBtn}</a>
            <span style={{ display: 'block', marginTop: 8, fontSize: 13, color: MUTED }}>{c.installBtnNote}</span>
          </div>
          <p style={{ color: MUTED, marginTop: 14, fontSize: 15 }}>
            {c.installToken}
          </p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '40px 0' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">{c.howH2}</h2>
          <div className="wm-grid" style={{ marginTop: 18 }}>
            {c.howSteps.map((s) => (
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
          <h2 className="wm-h2">{c.toolsH2}</h2>
          <p style={{ color: MUTED, marginBottom: 18, fontSize: 16 }}>{c.toolsIntro}</p>
          <div className="wm-grid">
            {c.toolGroups.map((g) => (
              <div key={g.title} className="wm-card">
                <h3 style={{ margin: '0 0 12px', fontSize: 17, color: GREEN }}>{g.title}</h3>
                <ul style={{ margin: 0, ...listPad, color: MUTED, lineHeight: 1.9, fontSize: 15 }}>
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
            <h2 className="wm-h2" style={{ marginBottom: 12 }}>{c.authH2}</h2>
            <p style={{ color: MUTED, margin: 0, lineHeight: 1.7, fontSize: 16 }}>
              {c.authText}
            </p>
          </div>
        </div>
      </section>

      {/* Client setup guides + related (internal linking) */}
      <section style={{ padding: '40px 0' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">{c.setupH2}</h2>
          <p style={{ color: MUTED, marginBottom: 18, fontSize: 16 }}>{c.setupIntro}</p>
          <div className="wm-grid">
            {c.setupCards.map((card) => (
              <a key={card.href} className="wm-card" href={card.href} style={{ textDecoration: 'none', color: TEXT, display: 'block' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 17, color: GREEN }}>{card.t}</h3>
                <p style={{ color: MUTED, margin: 0, lineHeight: 1.6, fontSize: 15 }}>{card.d}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '40px 0 20px' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">{c.faqH2}</h2>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {c.faq.map((f) => (
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
          <h2 className="wm-h2">{c.ctaH2}</h2>
          <p style={{ color: MUTED, margin: '0 auto 24px', maxWidth: 620, fontSize: 17, lineHeight: 1.6 }}>
            {c.ctaText}
          </p>
          <a className="wm-btn" href="https://gambot.co.il/OnboardingProcess/" style={{ background: GREEN, color: '#04220f', fontSize: 17 }}>{c.ctaBtn}</a>
        </div>
      </section>
    </main>
  );
}

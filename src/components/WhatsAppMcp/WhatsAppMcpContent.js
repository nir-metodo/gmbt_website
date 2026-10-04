'use client';
/**
 * Bilingual landing page for "Gambot — WhatsApp Business MCP for AI Agents".
 *
 * Audience: developers / AI agents abroad (English, server-rendered in English via ClientLayout) plus
 * the Hebrew toggle for Israeli visitors. The page answers four questions fast —
 *   What is Gambot? Why should an AI agent use it? Why is it different from a normal WhatsApp MCP?
 *   How do I connect?
 * — and walks through the self-service onboarding: Discover → Install MCP → Create account →
 * Connect WhatsApp → First action (no sales call).
 *
 * The FAQ copy lives in `@/lib/mcpHub` and is reused for the FAQPage JSON-LD, so schema and visible
 * text cannot drift. Links/buttons fire the funnel events defined in `@/lib/track`.
 */
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent } from '@/lib/track';
import TrackedLink from '@/components/Landing/TrackedLink';
import PageViewTracker from '@/components/Landing/PageViewTracker';
import { MCP_FAQ_EN, MCP_INSTALL_CMD } from '@/lib/mcpHub';

const GREEN = '#25D366';
const DARK = '#0b141a';
const CARD = '#131f27';
const BORDER = '#22323d';
const TEXT = '#e9edef';
const MUTED = '#8fa3ad';

const GITHUB = 'https://github.com/gambot-ai/gambot-mcp';
const NPM = 'https://www.npmjs.com/package/gambot-mcp';
const SIGNUP = 'https://gambot.co.il/OnboardingProcess/';
const DOCS = 'https://gambot.co.il/developers/';

const tokenConfig = `{
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

const noTokenConfig = `{
  "mcpServers": {
    "gambot": {
      "command": "npx",
      "args": ["-y", "gambot-mcp"]
    }
  }
}`;

// One-click install deeplink for Cursor (config = base64 of the server block).
const CURSOR_DEEPLINK = 'cursor://anysphere.cursor-deeplink/mcp/install?name=gambot&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImdhbWJvdC1tY3AiXSwiZW52Ijp7IkdBTUJPVF9UT0tFTiI6IiJ9fQ==';

const CONTENT = {
  en: {
    heroBadge: 'Model Context Protocol · Official WhatsApp Business API',
    heroH1: 'Gambot — WhatsApp Business MCP for AI Agents',
    heroSub: (
      <>
        Connect <strong style={{ color: TEXT }}>Claude, ChatGPT, Cursor</strong> and other AI agents to the{' '}
        <strong style={{ color: TEXT }}>official WhatsApp Business API</strong>. Send messages and approved templates, run
        campaigns and manage your CRM — from a single MCP server.
      </>
    ),
    heroOfficial: 'Gambot uses the official WhatsApp Business API — not WhatsApp Web, no QR-code sessions.',
    heroPrimary: 'Connect Your AI Agent',
    heroSecondary: 'Read the API docs',
    heroChips: ['Claude', 'ChatGPT', 'Cursor', 'Gemini', 'Any MCP client'],
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
    installHint: 'Run it in any MCP client — no account or token needed to start.',
    answersH2: 'The short version',
    answers: [
      {
        q: 'What is Gambot?',
        a: 'A WhatsApp Business platform with a built-in MCP server. It turns the official WhatsApp Business API — messaging, templates, campaigns, CRM, quotes, invoices — into tools an AI agent can call.',
      },
      {
        q: 'Why should an AI agent use it?',
        a: 'It returns machine-readable states (for example a closed 24-hour window with the recommended next step), enforces opt-out and consent, and lets the agent create its own account — so it can finish the job instead of guessing.',
      },
      {
        q: 'Why is it different from a normal WhatsApp MCP?',
        a: 'Most WhatsApp MCP servers automate WhatsApp Web on a personal number: QR sessions, no templates, no webhooks, a risk of being blocked. Gambot runs on the official WhatsApp Business API, built for production use on a business number.',
      },
      {
        q: 'How do I connect?',
        a: 'Add the server with npx -y gambot-mcp. With no token it starts in onboarding mode: your agent creates a free-trial account and gives you a link to connect your WhatsApp number. Then it can send its first message.',
      },
    ],
    connectH2: 'Connect your AI agent',
    connectIntro: 'Self-service from the first command to the first WhatsApp message. No sales call, no manual setup by us.',
    flowSteps: [
      { n: '1', t: 'Discover', d: 'You found Gambot — the WhatsApp Business MCP built on the official API.' },
      { n: '2', t: 'Install the MCP', d: 'Add npx -y gambot-mcp to Claude, Cursor, Gemini CLI — or use the hosted connector for ChatGPT.' },
      { n: '3', t: 'Create an account', d: 'With no token, the agent checks your organization name and creates a free-trial account for you.' },
      { n: '4', t: 'Connect WhatsApp', d: 'The agent gives you a secure link. You connect your WhatsApp Business number with Meta in the browser, once.' },
      { n: '5', t: 'First action', d: 'Set GAMBOT_TOKEN, restart the client and ask: "Send a WhatsApp message to +1…". Done.' },
    ],
    pathAH3: 'New to Gambot? Start with no token',
    pathAText: 'Add this to your MCP client config (Cursor .cursor/mcp.json, Claude Desktop claude_desktop_config.json, Gemini CLI settings) and restart it. Ask your agent: "Set me up with Gambot for WhatsApp."',
    pathBH3: 'Already have a Gambot token?',
    pathBText: (
      <>
        Add it as <code>GAMBOT_TOKEN</code> (<code>gmbt_…</code> from Settings → General) to unlock the full tool set. Prefer a
        remote connector? Use the hosted MCP server (Streamable HTTP + OAuth) — see the{' '}
        <a href="https://gambot.co.il/whatsapp-mcp/chatgpt/" style={{ color: GREEN }}>ChatGPT</a> and{' '}
        <a href="https://gambot.co.il/whatsapp-mcp/claude/" style={{ color: GREEN }}>Claude</a> guides.
      </>
    ),
    installBtn: 'Add to Cursor (one click)',
    installBtnNote: 'Cursor opens with the Gambot server pre-filled. No token needed to start.',
    compareH2: 'Gambot vs. a WhatsApp Web MCP',
    compareIntro: 'Same idea — very different foundations.',
    compareCols: ['', 'Gambot', 'WhatsApp Web–based MCP'],
    compareRows: [
      ['WhatsApp connection', 'Official WhatsApp Business API', 'Automates WhatsApp Web (unofficial)'],
      ['Sign-in', 'Meta Embedded Signup, API token / OAuth', 'QR-code session on a phone'],
      ['Message templates', 'Approved templates, 24-hour-window rules', 'Not supported'],
      ['Opt-out & consent', 'Built in', 'Left to you'],
      ['Number safety', 'Business number, platform-compliant', 'Risk of the number being blocked'],
      ['Agent onboarding', 'Self-serve through MCP tools', 'Manual setup'],
    ],
    compareLink: 'Read the full comparison →',
    toolsH2: 'Everything your agent can do',
    toolsIntro: '140+ tools across the full Gambot WhatsApp Business API.',
    toolGroups: [
      { title: 'Messaging', items: ['Send WhatsApp text', 'Send approved templates', 'List conversations & messages'] },
      { title: 'Campaigns', items: ['Create manual / scheduled / recurring', 'Mail-merge blast from a spreadsheet', 'Built-in opt-out & consent'] },
      { title: 'CRM', items: ['Contacts & leads', 'Cases & tasks', 'Dynamic custom fields'] },
      { title: 'Sales & docs', items: ['Quotes, invoices, orders', 'Web forms & submissions', 'Document templates & e-signatures'] },
      { title: 'Templates', items: ['Create text / media templates', 'Body variables, buttons, footer', 'Upload template media'] },
      { title: 'Onboarding', items: ['Create trial / paid accounts', 'Buy a number by country', 'Add a payment method'] },
    ],
    trustH2: 'Open source, official API',
    trustText: (
      <>
        Gambot is an <strong style={{ color: TEXT }}>official Meta Business Solution Provider</strong>. The MCP server is open
        source (MIT), published on npm as <code>gambot-mcp</code> and listed in the MCP Registry. Your number stays compliant —
        with message templates, opt-out handling and consent built in.
      </>
    ),
    githubLabel: 'View on GitHub',
    npmLabel: 'View on npm',
    setupH2: 'Set up your AI client',
    setupIntro: 'Step-by-step guides for each MCP client, plus developer resources.',
    setupCards: [
      { t: 'WhatsApp MCP for ChatGPT', d: 'Hosted connector (Streamable HTTP + OAuth).', href: 'https://gambot.co.il/whatsapp-mcp/chatgpt/' },
      { t: 'WhatsApp MCP for Claude', d: 'Claude Desktop (npx) or remote connector.', href: 'https://gambot.co.il/whatsapp-mcp/claude/' },
      { t: 'WhatsApp MCP for Cursor', d: 'One-click install or .cursor/mcp.json.', href: 'https://gambot.co.il/whatsapp-mcp/cursor/' },
      { t: 'WhatsApp MCP for Gemini', d: 'Register in the Gemini CLI settings.', href: 'https://gambot.co.il/whatsapp-mcp/gemini/' },
      { t: 'WhatsApp MCP for Claude Code', d: 'One claude mcp add command, local or hosted.', href: 'https://gambot.co.il/whatsapp-mcp/claude-code/' },
      { t: 'WhatsApp MCP for OpenAI Codex', d: 'One entry in ~/.codex/config.toml.', href: 'https://gambot.co.il/whatsapp-mcp/codex/' },
      { t: 'WhatsApp MCP for VS Code & Copilot', d: '.vscode/mcp.json with Copilot agent mode.', href: 'https://gambot.co.il/whatsapp-mcp/vscode-copilot/' },
      { t: 'WhatsApp MCP for Windsurf', d: 'Add to Cascade\u2019s mcp_config.json.', href: 'https://gambot.co.il/whatsapp-mcp/windsurf/' },
      { t: 'WhatsApp API for Replit', d: 'Agent MCP for setup, REST + Secrets in the app.', href: 'https://gambot.co.il/whatsapp-mcp/replit/' },
      { t: 'WhatsApp API for Lovable', d: 'Custom MCP connector + backend function.', href: 'https://gambot.co.il/whatsapp-mcp/lovable/' },
      { t: 'WhatsApp API for Base44', d: 'MCP connection + backend function with secrets.', href: 'https://gambot.co.il/whatsapp-mcp/base44/' },
      { t: 'Gambot Agent Skill', d: 'Teach any compatible agent the whole integration.', href: 'https://gambot.co.il/whatsapp-mcp/agent-skill/' },
      { t: 'WhatsApp Business API explained', d: 'The official API vs the app vs Web automation.', href: 'https://gambot.co.il/whatsapp-business-api/' },
      { t: 'WhatsApp Cloud API explained', d: 'Building blocks and where Gambot fits.', href: 'https://gambot.co.il/whatsapp-cloud-api/' },
      { t: 'WhatsApp API for AI Agents', d: 'Send, receive, schedule, automate & analyze.', href: 'https://gambot.co.il/whatsapp-api-for-ai-agents/' },
      { t: 'WhatsApp API for Developers', d: 'REST API on the official WhatsApp Business API.', href: 'https://gambot.co.il/whatsapp-api-for-developers/' },
      { t: 'MCP vs WhatsApp Web', d: 'Business API vs Web automation, compared.', href: 'https://gambot.co.il/whatsapp-mcp-vs-whatsapp-web/' },
      { t: 'API documentation', d: 'Auth, scopes, endpoints & error codes.', href: DOCS },
    ],
    faqH2: 'Frequently asked questions',
    faq: MCP_FAQ_EN,
    ctaH2: 'Give your AI agent a WhatsApp number',
    ctaText: 'Run one command, let your agent create the account, connect your number — and send the first WhatsApp message.',
    ctaBtn: 'Connect Your AI Agent',
    ctaAlt: 'Prefer the web? Create an account in the browser →',
  },
  he: {
    heroBadge: 'Model Context Protocol · WhatsApp Business API רשמי',
    heroH1: 'Gambot — שרת WhatsApp Business MCP לסוכני AI',
    heroSub: (
      <>
        חברו את <strong style={{ color: TEXT }}>Claude, ChatGPT, Cursor</strong> וסוכני AI נוספים ל־
        <strong style={{ color: TEXT }}>WhatsApp Business API הרשמי</strong>. שלחו הודעות ותבניות מאושרות, הריצו קמפיינים
        ונהלו את ה־CRM — משרת MCP אחד.
      </>
    ),
    heroOfficial: 'גמבוט משתמשת ב־WhatsApp Business API הרשמי — לא ב־WhatsApp Web, בלי סשן QR.',
    heroPrimary: 'חברו את סוכן ה־AI שלכם',
    heroSecondary: 'קרא את תיעוד ה־API',
    heroChips: ['Claude', 'ChatGPT', 'Cursor', 'Gemini', 'כל לקוח MCP'],
    copyLabel: 'העתק',
    copiedLabel: 'הועתק',
    installHint: 'הריצו בכל לקוח MCP — אין צורך בחשבון או בטוקן כדי להתחיל.',
    answersH2: 'בקצרה',
    answers: [
      {
        q: 'מהי גמבוט?',
        a: 'פלטפורמת WhatsApp Business עם שרת MCP מובנה. היא הופכת את ה־WhatsApp Business API הרשמי — הודעות, תבניות, קמפיינים, CRM, הצעות מחיר וחשבוניות — לכלים שסוכן AI יכול להפעיל.',
      },
      {
        q: 'למה סוכן AI צריך להשתמש בה?',
        a: 'היא מחזירה מצבים קריאים למכונה (למשל חלון 24 שעות סגור עם הצעד המומלץ הבא), אוכפת הסרה והסכמה, ומאפשרת לסוכן ליצור חשבון בעצמו — כך שהוא משלים את המשימה במקום לנחש.',
      },
      {
        q: 'במה זה שונה מ־WhatsApp MCP רגיל?',
        a: 'רוב שרתי ה־WhatsApp MCP מבצעים אוטומציה של WhatsApp Web על מספר אישי: סשן QR, בלי תבניות, בלי webhooks וסיכון לחסימה. גמבוט פועלת על ה־WhatsApp Business API הרשמי, שנבנה לשימוש עסקי בייצור.',
      },
      {
        q: 'איך מתחברים?',
        a: 'מוסיפים את השרת עם npx -y gambot-mcp. בלי טוקן הוא עולה במצב הצטרפות: הסוכן יוצר חשבון ניסיון ונותן לכם קישור לחיבור מספר הוואטסאפ. אחר כך הוא יכול לשלוח את ההודעה הראשונה.',
      },
    ],
    connectH2: 'חברו את סוכן ה־AI שלכם',
    connectIntro: 'שירות עצמי מהפקודה הראשונה ועד הודעת הוואטסאפ הראשונה. בלי שיחת מכירה ובלי הקמה ידנית מצידנו.',
    flowSteps: [
      { n: '1', t: 'גילוי', d: 'מצאתם את גמבוט — ה־WhatsApp Business MCP שנבנה על ה־API הרשמי.' },
      { n: '2', t: 'התקנת ה־MCP', d: 'הוסיפו npx -y gambot-mcp ל־Claude, Cursor, Gemini CLI — או השתמשו במחבר המתארח ל־ChatGPT.' },
      { n: '3', t: 'יצירת חשבון', d: 'בלי טוקן, הסוכן בודק את שם הארגון ויוצר עבורכם חשבון ניסיון.' },
      { n: '4', t: 'חיבור וואטסאפ', d: 'הסוכן נותן קישור מאובטח. אתם מחברים את מספר ה־WhatsApp Business מול Meta בדפדפן, פעם אחת.' },
      { n: '5', t: 'פעולה ראשונה', d: 'הגדירו GAMBOT_TOKEN, הפעילו מחדש את הלקוח ובקשו: "שלח הודעת וואטסאפ אל +972…". זהו.' },
    ],
    pathAH3: 'חדשים בגמבוט? התחילו בלי טוקן',
    pathAText: 'הוסיפו את זה לתצורת לקוח ה־MCP (Cursor ‏.cursor/mcp.json, ‏Claude Desktop ‏claude_desktop_config.json, הגדרות Gemini CLI) והפעילו מחדש. בקשו מהסוכן: "תקים לי את גמבוט לוואטסאפ."',
    pathBH3: 'כבר יש לכם טוקן של גמבוט?',
    pathBText: (
      <>
        הוסיפו אותו כ־<code>GAMBOT_TOKEN</code> (‏<code>gmbt_…</code> מהגדרות ← כללי) כדי לפתוח את כל סט הכלים. מעדיפים מחבר
        מרוחק? השתמשו בשרת ה־MCP המתארח (Streamable HTTP + OAuth) — ראו את המדריכים ל־
        <a href="https://gambot.co.il/whatsapp-mcp/chatgpt/" style={{ color: GREEN }}>ChatGPT</a> ול־
        <a href="https://gambot.co.il/whatsapp-mcp/claude/" style={{ color: GREEN }}>Claude</a>.
      </>
    ),
    installBtn: 'הוסף ל־Cursor (בלחיצה אחת)',
    installBtnNote: 'Cursor ייפתח עם שרת גמבוט מוגדר מראש. אין צורך בטוקן כדי להתחיל.',
    compareH2: 'גמבוט מול MCP מבוסס WhatsApp Web',
    compareIntro: 'אותו רעיון — יסודות שונים מאוד.',
    compareCols: ['', 'גמבוט', 'MCP מבוסס WhatsApp Web'],
    compareRows: [
      ['חיבור לוואטסאפ', 'WhatsApp Business API רשמי', 'אוטומציה של WhatsApp Web (לא רשמי)'],
      ['התחברות', 'Meta Embedded Signup, טוקן API / OAuth', 'סשן QR בטלפון'],
      ['תבניות הודעה', 'תבניות מאושרות, כללי חלון 24 שעות', 'לא נתמך'],
      ['הסרה והסכמה', 'מובנה', 'באחריותכם'],
      ['בטיחות המספר', 'מספר עסקי, תואם מדיניות', 'סיכון לחסימת המספר'],
      ['הצטרפות סוכן', 'שירות עצמי דרך כלי MCP', 'הקמה ידנית'],
    ],
    compareLink: 'להשוואה המלאה ←',
    toolsH2: 'כל מה שהסוכן שלכם יכול לעשות',
    toolsIntro: 'מעל 140 כלים על פני כל ה־WhatsApp Business API של גמבוט.',
    toolGroups: [
      { title: 'מסרים', items: ['שליחת טקסט בוואטסאפ', 'שליחת תבניות מאושרות', 'הצגת שיחות והודעות'] },
      { title: 'קמפיינים', items: ['יצירה ידנית / מתוזמנת / חוזרת', 'דיוור ממוזג מגיליון נתונים', 'הסרה והסכמה מובנים'] },
      { title: 'CRM', items: ['אנשי קשר ולידים', 'פניות ומשימות', 'שדות מותאמים דינמיים'] },
      { title: 'מכירות ומסמכים', items: ['הצעות מחיר, חשבוניות, הזמנות', 'טפסי אינטרנט ושליחות', 'תבניות מסמכים וחתימות דיגיטליות'] },
      { title: 'תבניות', items: ['יצירת תבניות טקסט / מדיה', 'משתני גוף, כפתורים, פוטר', 'העלאת מדיה לתבנית'] },
      { title: 'הצטרפות', items: ['יצירת חשבונות טרייל / בתשלום', 'רכישת מספר לפי מדינה', 'הוספת אמצעי תשלום'] },
    ],
    trustH2: 'קוד פתוח, API רשמי',
    trustText: (
      <>
        גמבוט היא <strong style={{ color: TEXT }}>ספקית פתרונות עסקיים רשמית של Meta</strong>. שרת ה־MCP הוא קוד פתוח
        (MIT), מפורסם ב־npm בשם <code>gambot-mcp</code> ורשום ב־MCP Registry. המספר שלכם נשאר תואם — עם תבניות הודעה,
        טיפול בהסרה והסכמה מובנים.
      </>
    ),
    githubLabel: 'צפייה ב־GitHub',
    npmLabel: 'צפייה ב־npm',
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
      { t: 'תיעוד API', d: 'אימות, הרשאות, נקודות קצה וקודי שגיאה.', href: DOCS },
    ],
    faqH2: 'שאלות נפוצות',
    faq: [
      { q: 'מהו שרת ה־WhatsApp MCP של גמבוט?', a: 'גמבוט היא שרת WhatsApp Business MCP לסוכני AI. הוא חושף את ה־WhatsApp Business API הרשמי ככלי MCP, כך ש־Claude, ChatGPT, Cursor, Gemini ולקוחות MCP נוספים יכולים לשלוח הודעות ותבניות, להריץ קמפיינים ולנהל אנשי קשר, לידים, פניות, משימות, הצעות מחיר וחשבוניות.' },
      { q: 'במה גמבוט שונה משרתי WhatsApp MCP אחרים?', a: 'רוב שרתי ה־WhatsApp MCP מבצעים אוטומציה של WhatsApp Web: סשן QR על מספר אישי, בלי תבניות ובלי webhooks, עם סיכון לחסימת המספר. גמבוט משתמשת ב־WhatsApp Business API הרשמי ולכן תומכת בתבניות מאושרות, כללי חלון 24 שעות, טיפול בהסרה והסכמה ושימוש עסקי בייצור.' },
      { q: 'האם צריך חשבון גמבוט לפני שמתחילים?', a: 'לא. הריצו "npx -y gambot-mcp" בלי טוקן והשרת עולה במצב הצטרפות: סוכן ה־AI בודק אם קיים חשבון, יוצר חשבון ניסיון חינם ונותן קישור מאובטח לחיבור מספר הוואטסאפ בדפדפן (Meta Embedded Signup). לאחר החיבור מקבלים טוקן API ומגדירים GAMBOT_TOKEN לפתיחת כל הכלים. לא צריך שיחת מכירה.' },
      { q: 'איך מחברים את Claude, ChatGPT או Cursor?', a: 'מוסיפים את השרת ללקוח ה־MCP עם הפקודה "npx -y gambot-mcp" (Claude Desktop, Cursor, Gemini CLI), או משתמשים במחבר המתארח עם OAuth (מחברים מותאמים של ChatGPT ו־Claude). אין חובה להגדיר GAMBOT_TOKEN בהתחלה: בלעדיו הסוכן מוביל אתכם ביצירת החשבון.' },
      { q: 'האם זה WhatsApp API רשמי?', a: 'כן. גמבוט היא ספקית פתרונות עסקיים רשמית של Meta ושרת ה־MCP פועל על ה־WhatsApp Business (Cloud) API המורשה. בלי סשנים של QR ובלי ספריות לא רשמיות.' },
      { q: 'מה סוכן AI יכול לעשות דרך גמבוט?', a: 'לשלוח טקסט ותבניות מאושרות, להציג שיחות והודעות, ליצור ולתזמן קמפיינים, לנהל אנשי קשר, לידים, פניות ומשימות, ליצור הצעות מחיר, חשבוניות וחתימות דיגיטליות ולקרוא אנליטיקה. ה־API מחזיר מצבים קריאים למכונה (למשל חלון 24 שעות סגור) עם צעד מומלץ, כך שהסוכן מתאושש במקום לנחש.' },
      { q: 'איפה אפשר למצוא את הקוד והחבילה?', a: 'שרת ה־MCP הוא קוד פתוח (MIT) ב־GitHub בכתובת github.com/gambot-ai/gambot-mcp ומפורסם ב־npm בשם gambot-mcp. תיעוד ה־API זמין ב־gambot.co.il/developers/.' },
    ],
    ctaH2: 'תנו לסוכן ה־AI שלכם מספר וואטסאפ',
    ctaText: 'הריצו פקודה אחת, תנו לסוכן ליצור את החשבון, חברו את המספר — ושלחו את הודעת הוואטסאפ הראשונה.',
    ctaBtn: 'חברו את סוכן ה־AI שלכם',
    ctaAlt: 'מעדיפים דפדפן? צרו חשבון באתר ←',
  },
};

function InstallCommand({ location, copyLabel, copiedLabel }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    trackEvent('mcp_install_copy', { location });
    try {
      await navigator.clipboard.writeText(MCP_INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable; the command is still selectable text */
    }
  };
  return (
    <div className="wm-cmd" dir="ltr">
      <code>{MCP_INSTALL_CMD}</code>
      <button type="button" onClick={onCopy} aria-label={`${copyLabel} ${MCP_INSTALL_CMD}`}>
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

export default function WhatsAppMcpContent() {
  const { currentLanguage } = useLanguage();
  const isHe = currentLanguage === 'he';
  const c = isHe ? CONTENT.he : CONTENT.en;
  const listPad = isHe ? { paddingRight: 18, paddingLeft: 0 } : { paddingLeft: 18 };
  const cell = { padding: '12px 14px', borderBottom: `1px solid ${BORDER}`, textAlign: isHe ? 'right' : 'left', fontSize: 15, lineHeight: 1.5 };
  return (
    <main
      lang={isHe ? 'he' : 'en'}
      dir={isHe ? 'rtl' : 'ltr'}
      style={{ background: DARK, color: TEXT, fontFamily: 'Rubik, "Open Sans", system-ui, sans-serif', direction: isHe ? 'rtl' : 'ltr' }}
    >
      <PageViewTracker page="whatsapp_mcp" />
      <style>{`
        .wm-wrap { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
        .wm-btn { display:inline-block; padding:14px 26px; border-radius:10px; font-weight:600; text-decoration:none; transition:transform .15s ease, opacity .15s ease; }
        .wm-btn:hover { transform: translateY(-2px); }
        .wm-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px; }
        .wm-pre { background:#0f1a21; border:1px solid ${BORDER}; border-radius:12px; padding:18px 20px; overflow:auto; font-family:"SF Mono",Menlo,Consolas,monospace; font-size:13.5px; line-height:1.6; color:#cfe9d8; direction:ltr; text-align:left; margin:0; }
        .wm-h2 { font-size:30px; font-weight:700; margin:0 0 10px; }
        .wm-card { background:${CARD}; border:1px solid ${BORDER}; border-radius:14px; padding:22px; }
        .wm-badge { border:1px solid ${BORDER}; border-radius:999px; padding:8px 16px; color:${TEXT}; font-weight:500; font-size:14px; background:#0f1a21; }
        .wm-cmd { display:inline-flex; align-items:center; gap:14px; background:#0f1a21; border:1px solid ${GREEN}; border-radius:12px; padding:12px 14px 12px 20px; font-family:"SF Mono",Menlo,Consolas,monospace; font-size:20px; color:#cfe9d8; max-width:100%; }
        .wm-cmd code { white-space:nowrap; overflow:auto; }
        .wm-cmd button { background:${GREEN}; color:#04220f; border:0; border-radius:8px; padding:8px 14px; font-weight:700; font-size:14px; cursor:pointer; font-family:inherit; }
        .wm-table { width:100%; border-collapse:collapse; background:${CARD}; border:1px solid ${BORDER}; border-radius:14px; overflow:hidden; }
        .wm-table th { color:${MUTED}; font-weight:600; font-size:13px; text-transform:uppercase; letter-spacing:.04em; }
        .wm-scroll { overflow-x:auto; }
        @media (max-width:600px){ .wm-h1{ font-size:32px !important; } .wm-h2{ font-size:24px !important; } .wm-cmd{ font-size:16px; } }
      `}</style>

      {/* Hero: positioning + the four answers' headline + primary CTA + the install command */}
      <section style={{ padding: '72px 0 40px', textAlign: 'center' }}>
        <div className="wm-wrap">
          <div style={{ display: 'inline-block', background: 'rgba(37,211,102,0.12)', color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 999, padding: '6px 16px', fontSize: 13, fontWeight: 600, marginBottom: 22 }}>
            {c.heroBadge}
          </div>
          <h1 className="wm-h1" style={{ fontSize: 46, lineHeight: 1.15, fontWeight: 800, margin: '0 0 18px' }}>
            {c.heroH1}
          </h1>
          <p style={{ fontSize: 20, color: MUTED, maxWidth: 760, margin: '0 auto 12px', lineHeight: 1.6 }}>
            {c.heroSub}
          </p>
          <p style={{ fontSize: 16, color: GREEN, maxWidth: 760, margin: '0 auto', fontWeight: 600 }}>
            {c.heroOfficial}
          </p>
          <div style={{ marginTop: 28 }}>
            <InstallCommand location="hero" copyLabel={c.copyLabel} copiedLabel={c.copiedLabel} />
            <div style={{ color: MUTED, fontSize: 14, marginTop: 10 }}>{c.installHint}</div>
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 26 }}>
            <TrackedLink className="wm-btn" href="#connect" event="mcp_connect_agent_click" eventParams={{ location: 'hero' }} style={{ background: GREEN, color: '#04220f' }}>{c.heroPrimary}</TrackedLink>
            <TrackedLink className="wm-btn" href={DOCS} event="developer_docs_click" eventParams={{ location: 'hero' }} style={{ background: 'transparent', color: TEXT, border: `1px solid ${BORDER}` }}>{c.heroSecondary}</TrackedLink>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 30 }}>
            {c.heroChips.map((n) => (
              <span key={n} className="wm-badge">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* The four questions, answered up front */}
      <section style={{ padding: '24px 0 16px' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">{c.answersH2}</h2>
          <div className="wm-grid" style={{ marginTop: 16 }}>
            {c.answers.map((a) => (
              <div key={a.q} className="wm-card">
                <h3 style={{ margin: '0 0 8px', fontSize: 18, color: GREEN }}>{a.q}</h3>
                <p style={{ color: MUTED, margin: 0, lineHeight: 1.65, fontSize: 15 }}>{a.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect: self-service onboarding flow + the two config paths */}
      <section id="connect" style={{ padding: '40px 0', scrollMarginTop: 80 }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">{c.connectH2}</h2>
          <p style={{ color: MUTED, marginBottom: 18, fontSize: 16 }}>{c.connectIntro}</p>
          <div className="wm-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))' }}>
            {c.flowSteps.map((s) => (
              <div key={s.n} className="wm-card" style={{ padding: 18 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: GREEN, color: '#04220f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, marginBottom: 10 }}>{s.n}</div>
                <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>{s.t}</h3>
                <p style={{ color: MUTED, margin: 0, lineHeight: 1.55, fontSize: 14 }}>{s.d}</p>
              </div>
            ))}
          </div>

          <div className="wm-grid" style={{ marginTop: 26, gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: 19 }}>{c.pathAH3}</h3>
              <p style={{ color: MUTED, margin: '0 0 12px', fontSize: 15, lineHeight: 1.6 }}>{c.pathAText}</p>
              <pre className="wm-pre">{noTokenConfig}</pre>
              <div style={{ marginTop: 14 }}>
                <TrackedLink className="wm-btn" href={CURSOR_DEEPLINK} event="mcp_cursor_install_click" eventParams={{ location: 'connect' }} style={{ background: GREEN, color: '#04220f' }}>{c.installBtn}</TrackedLink>
                <span style={{ display: 'block', marginTop: 8, fontSize: 13, color: MUTED }}>{c.installBtnNote}</span>
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: 19 }}>{c.pathBH3}</h3>
              <p style={{ color: MUTED, margin: '0 0 12px', fontSize: 15, lineHeight: 1.6 }}>{c.pathBText}</p>
              <pre className="wm-pre">{tokenConfig}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison with WhatsApp Web MCPs */}
      <section style={{ padding: '40px 0' }}>
        <div className="wm-wrap">
          <h2 className="wm-h2">{c.compareH2}</h2>
          <p style={{ color: MUTED, marginBottom: 16, fontSize: 16 }}>{c.compareIntro}</p>
          <div className="wm-scroll">
            <table className="wm-table">
              <thead>
                <tr>
                  {c.compareCols.map((h, i) => (
                    <th key={i} scope="col" style={{ ...cell, color: i === 1 ? GREEN : MUTED }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.compareRows.map((r) => (
                  <tr key={r[0]}>
                    <th scope="row" style={{ ...cell, color: TEXT, fontSize: 15, textTransform: 'none', letterSpacing: 0 }}>{r[0]}</th>
                    <td style={{ ...cell, color: TEXT }}>{r[1]}</td>
                    <td style={{ ...cell, color: MUTED }}>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 14 }}>
            <TrackedLink href="https://gambot.co.il/whatsapp-mcp-vs-whatsapp-web/" event="mcp_cta_click" eventParams={{ target: 'compare' }} style={{ color: GREEN, fontWeight: 600 }}>{c.compareLink}</TrackedLink>
          </p>
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

      {/* Trust: official API + open source + resources */}
      <section style={{ padding: '40px 0' }}>
        <div className="wm-wrap">
          <div className="wm-card" style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.10), rgba(37,211,102,0.02))' }}>
            <h2 className="wm-h2" style={{ marginBottom: 12 }}>{c.trustH2}</h2>
            <p style={{ color: MUTED, margin: '0 0 16px', lineHeight: 1.7, fontSize: 16 }}>
              {c.trustText}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <TrackedLink className="wm-btn" href={GITHUB} event="github_click" eventParams={{ location: 'trust' }} style={{ background: 'transparent', color: TEXT, border: `1px solid ${BORDER}`, padding: '10px 18px' }}>{c.githubLabel}</TrackedLink>
              <TrackedLink className="wm-btn" href={NPM} event="npm_click" eventParams={{ location: 'trust' }} style={{ background: 'transparent', color: TEXT, border: `1px solid ${BORDER}`, padding: '10px 18px' }}>{c.npmLabel}</TrackedLink>
            </div>
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
              <TrackedLink key={card.href} className="wm-card" href={card.href} event="mcp_cta_click" eventParams={{ target: card.href }} style={{ textDecoration: 'none', color: TEXT, display: 'block' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 17, color: GREEN }}>{card.t}</h3>
                <p style={{ color: MUTED, margin: 0, lineHeight: 1.6, fontSize: 15 }}>{card.d}</p>
              </TrackedLink>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ (English copy is shared with the FAQPage JSON-LD) */}
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
          <p style={{ color: MUTED, margin: '0 auto 22px', maxWidth: 620, fontSize: 17, lineHeight: 1.6 }}>
            {c.ctaText}
          </p>
          <InstallCommand location="footer" copyLabel={c.copyLabel} copiedLabel={c.copiedLabel} />
          <div style={{ marginTop: 22 }}>
            <TrackedLink className="wm-btn" href="#connect" event="mcp_connect_agent_click" eventParams={{ location: 'footer' }} style={{ background: GREEN, color: '#04220f', fontSize: 17 }}>{c.ctaBtn}</TrackedLink>
          </div>
          <p style={{ marginTop: 16 }}>
            <TrackedLink href={SIGNUP} event="create_account_click" eventParams={{ location: 'whatsapp_mcp_footer' }} style={{ color: GREEN, fontSize: 15 }}>{c.ctaAlt}</TrackedLink>
          </p>
        </div>
      </section>
    </main>
  );
}

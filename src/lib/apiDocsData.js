// Structured, bilingual reference for the Gambot public REST API (api/v1).
// Consumed by the Developer Guide page (/developers). Each endpoint mirrors a real backend route.

export const API_BASE = 'https://api.gambot.co.il/api/v1';
export const API_BASE_FALLBACK = 'https://gambot.azurewebsites.net/api/v1';
// Hosted (online) MCP endpoint — Streamable HTTP. Used by web-based AI tools that can't run a local process
// (ChatGPT, Claude, Gemini, Base44, Lovable, n8n, Make, …). Verified live: Azure Web App "gambot-mcp"
// (Gambot_Resource_Group), Node 22, `node dist/http.js`. Auth: OAuth 2.0 (PKCE + DCR) or Bearer gmbt_ token.
// Discovery: /.well-known/oauth-protected-resource/mcp and /.well-known/oauth-authorization-server. 112 tools.
export const MCP_REMOTE_URL = 'https://gambot-mcp.azurewebsites.net/mcp';

// -- Intro / auth / conventions ----------------------------------------------------------
export const API_INTRO = {
  baseUrl: {
    he: 'כתובת הבסיס של ה-API',
    en: 'API base URL',
  },
  auth: {
    title: { he: 'אימות', en: 'Authentication' },
    body: {
      he: `כל בקשה מאומתת באמצעות <strong>ה-Gambot Token</strong> של הארגון (מתחיל ב-<code>gmbt_</code>) — אותו טוקן המשמש גם ל-Webhooks. שלחו אותו באחת משלוש דרכים:`,
      en: `Every request is authenticated with your organization's <strong>Gambot Token</strong> (starts with <code>gmbt_</code>) — the same token used for Webhooks. Send it in one of three ways:`,
    },
    methods: {
      he: [
        'כותרת <code>Authorization: Bearer gmbt_...</code> (מומלץ)',
        'כותרת <code>X-Api-Key: gmbt_...</code>',
        'פרמטר Query <code>?api_key=gmbt_...</code> (רק כשאין ברירה, למשל Zapier)',
      ],
      en: [
        'Header <code>Authorization: Bearer gmbt_...</code> (recommended)',
        'Header <code>X-Api-Key: gmbt_...</code>',
        'Query param <code>?api_key=gmbt_...</code> (only when unavoidable, e.g. Zapier)',
      ],
    },
    where: {
      he: 'מצאו את הטוקן בפאנל הניהול תחת <strong>הגדרות → כללי</strong>. ה-API מופעל כברירת מחדל — אין צורך בהגדרה נוספת.',
      en: 'Find your token in the admin panel under <strong>Settings → General</strong>. The API is enabled by default — no extra setup required.',
    },
    security: {
      he: 'שמרו על הטוקן בסוד (כמו סיסמה). דלף? החליפו אותו בלחיצה אחת מההגדרות.',
      en: 'Keep the token secret (like a password). Leaked? Rotate it in one click from Settings.',
    },
  },
  envelope: {
    title: { he: 'מעטפת התגובה', en: 'Response envelope' },
    body: {
      he: 'כל התגובות מוחזרות במעטפת אחידה:',
      en: 'All responses are returned in a consistent envelope:',
    },
    example: `{
  "success": true,
  "message": "?",
  "data": { }
}`,
  },
  errors: {
    title: { he: 'שגיאות', en: 'Errors' },
    rows: [
      { code: '401', key: 'missing_api_key / invalid_api_key', he: 'טוקן חסר או שגוי', en: 'Token missing or invalid' },
      { code: '403', key: 'api_disabled', he: 'ה-API מושבת עבור ארגון זה', en: 'API is disabled for this organization' },
      { code: '403', key: 'insufficient_scope', he: 'לטוקן חסרה ההרשאה הנדרשת', en: 'The token lacks the required scope' },
      { code: '400', key: 'missing_fields', he: 'חסרים שדות חובה', en: 'Required fields are missing' },
      { code: '404', key: 'not_found', he: 'המשאב לא נמצא', en: 'Resource not found' },
      { code: '502', key: 'send_failed', he: 'השליחה נכשלה (בעיה בצד WhatsApp)', en: 'Send failed (WhatsApp-side issue)' },
    ],
  },
};

// Helper: build a curl snippet with the standard auth header.
const curl = (method, path, body) => {
  let s = `curl -X ${method} "${API_BASE}${path}" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`;
  if (body) {
    s += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${body}'`;
  }
  return s;
};

// -- API sections (grouped by entity) ----------------------------------------------------
export const API_SECTIONS = [
  {
    id: 'messages',
    title: { he: 'הודעות WhatsApp', en: 'WhatsApp Messages' },
    description: {
      he: 'שליחת הודעות טקסט חופשי ותבניות ללקוחות.',
      en: 'Send free-text messages and templates to customers.',
    },
    endpoints: [
      {
        method: 'POST',
        path: '/messages/send-text',
        scope: 'messages:send',
        summary: {
          he: 'שליחת הודעת טקסט חופשי. מותרת רק בתוך חלון 24 השעות (מאז ההודעה האחרונה של הלקוח); מחוצה לו, שלחו תבנית.',
          en: 'Send a free-text message. Only allowed inside the 24-hour window (since the customer\'s last message); outside it, send a template.',
        },
        params: [
          { name: 'to', in: 'body', type: 'string', required: true, desc: { he: 'הנמען בפורמט בינלאומי (9725...). מקבל גם phoneNumber.', en: 'Recipient in international format (9725...). phoneNumber also accepted.' } },
          { name: 'text', in: 'body', type: 'string', required: true, desc: { he: 'גוף ההודעה.', en: 'Message body.' } },
          { name: 'from', in: 'body', type: 'string', required: false, desc: { he: 'ארגונים מרובי-מספרים: מאיזה מספר לשלוח — מספר תצוגה או phoneNumberId (ראו GET /numbers). ברירת מחדל: המספר הראשי.', en: 'Multi-number orgs: which number to send FROM — a display number or phoneNumberId (see GET /numbers). Defaults to the primary number.' } },
        ],
        request: `{
  "to": "972501234567",
  "text": "שלום! תודה שפנית אלינו"
}`,
        curl: curl('POST', '/messages/send-text', `{ "to": "972501234567", "text": "Hello!" }`),
        response: `{
  "success": true,
  "message": "Message sent",
  "data": { "messageId": "wamid.HBg?" }
}`,
      },
      {
        method: 'POST',
        path: '/messages/send-template',
        scope: 'messages:send',
        summary: {
          he: 'שליחת תבנית מאושרת עם משתנים. יכולה לפתוח שיחה גם מחוץ לחלון 24 השעות.',
          en: 'Send an approved template with variables. Can initiate a conversation even outside the 24-hour window.',
        },
        params: [
          { name: 'to', in: 'body', type: 'string', required: true, desc: { he: 'הנמען. מקבל גם phoneNumber.', en: 'Recipient. phoneNumber also accepted.' } },
          { name: 'templateId', in: 'body', type: 'string', required: true, desc: { he: 'מזהה התבנית.', en: 'Template id.' } },
          { name: 'variables', in: 'body', type: 'string[]', required: false, desc: { he: 'משתני ה-Body לפי הסדר. לחלופין templateVariableQuery.', en: 'Body variables in order. Or use templateVariableQuery.' } },
          { name: 'from', in: 'body', type: 'string', required: false, desc: { he: 'ארגונים מרובי-מספרים: מאיזה מספר לשלוח — מספר תצוגה או phoneNumberId (ראו GET /numbers). ברירת מחדל: המספר הראשי.', en: 'Multi-number orgs: which number to send FROM — a display number or phoneNumberId (see GET /numbers). Defaults to the primary number.' } },
        ],
        request: `{
  "to": "972501234567",
  "templateId": "welcome_new_customer_0626",
  "variables": ["דנה", "הזמנה #1234"]
}`,
        curl: curl('POST', '/messages/send-template', `{ "to": "972501234567", "templateId": "welcome_0626", "variables": ["Dana"] }`),
        response: `{
  "success": true,
  "message": "Template sent",
  "data": { "messageId": "wamid.HBg?" }
}`,
      },
    ],
  },
  {
    id: 'conversations',
    title: { he: 'שיחות', en: 'Conversations' },
    description: {
      he: 'הצגת שיחות, קריאת היסטוריית הודעות ומספרי השולח של הארגון.',
      en: 'List conversations, read message history and the org\'s sender numbers.',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/numbers',
        scope: 'conversations:read',
        summary: {
          he: 'מספרי ה-WhatsApp המחוברים לשליחה (מספרי השולח) של הארגון. השתמשו ב-phoneNumberId או במספר התצוגה בתור "from" בשליחות, או כ-fromNumberId בקמפיינים. רלוונטי לארגונים מרובי-מספרים.',
          en: 'The org\'s connected WhatsApp SENDER numbers. Use the phoneNumberId or display number as "from" on sends, or as fromNumberId on campaigns. Relevant for multi-number orgs.',
        },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/numbers" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "count": 2,
    "items": [
      { "phoneNumberId": "1299669023229774", "displayNumber": "+972 50-397-1731", "isPrimary": true, "status": "CONNECTED" },
      { "phoneNumberId": "1288077087725822", "displayNumber": "+972 55-968-9759", "isPrimary": false, "status": "CONNECTED" }
    ]
  }
}`,
      },
      {
        method: 'GET',
        path: '/conversations',
        scope: 'conversations:read',
        summary: {
          he: 'הצגת שיחות (אנשי קשר) לפי ההודעה האחרונה.',
          en: 'List conversations (contacts) ordered by most recent message.',
        },
        params: [
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 50 (מקסימום 200).', en: 'Default 50 (max 200).' } },
          { name: 'search', in: 'query', type: 'string', required: false, desc: { he: 'חיפוש חופשי.', en: 'Free-text search.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/conversations?pageSize=50&search=דנה" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "pageNumber": 1,
    "pageSize": 50,
    "count": 2,
    "items": [ { "phoneNumber": "972501234567", "name": "דנה", "lastMessage": "?" } ]
  }
}`,
      },
      {
        method: 'GET',
        path: '/conversations/{phone}/messages',
        scope: 'conversations:read',
        summary: {
          he: 'היסטוריית ההודעות של שיחה אחת (עימוד לפי מזהה הודעה).',
          en: 'Message history for a single conversation (paginated by message id).',
        },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: 'מספר הטלפון של הלקוח.', en: 'Customer phone number.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 50 (מקסימום 200).', en: 'Default 50 (max 200).' } },
          { name: 'before', in: 'query', type: 'string', required: false, desc: { he: 'שליפת הודעות לפני messageId זה.', en: 'Fetch messages before this messageId.' } },
          { name: 'after', in: 'query', type: 'string', required: false, desc: { he: 'שליפת הודעות אחרי messageId זה.', en: 'Fetch messages after this messageId.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/conversations/972501234567/messages?pageSize=50" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": { "messages": [ { "id": "?", "text": "?", "direction": "in", "time": "?" } ] }
}`,
      },
      {
        method: 'GET',
        path: '/conversations/{phone}/window',
        scope: 'conversations:read',
        summary: {
          he: 'האם חלון 24 השעות של שירות הלקוחות ב-WhatsApp פתוח עבור איש קשר זה? אם windowOpen=false חובה לשלוח תבנית מאושרת (טקסט חופשי נדחה). מחזיר המלצה ידידותית ל-AI.',
          en: 'Is the 24-hour WhatsApp customer-service window OPEN for this contact? If windowOpen=false you must send an approved template (free text is rejected). Returns an AI-friendly recommendation.',
        },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: 'מספר הטלפון של הלקוח.', en: 'Customer phone number.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/conversations/972501234567/window" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "phone": "972501234567",
    "windowOpen": false,
    "canSendFreeText": false,
    "requiresTemplate": true,
    "reason": "The 24-hour customer-service window is CLOSED (the contact has not messaged in the last 24h).",
    "recommendation": "Free text will be rejected. Send an approved template.",
    "defaultTemplateId": null
  }
}`,
      },
      {
        method: 'GET',
        path: '/conversations/sla',
        scope: 'conversations:read',
        summary: {
          he: 'שיחות לפי SLA של זמן-תגובה: מי ממתין למענה וכמה זמן. השעון מתחיל בהודעה הנכנסת האחרונה ונעצר בכל מענה (אנושי או בוט). level=open (ברירת מחדל: warn+breach), all, ok, warn, breach.',
          en: 'Conversations by message-response SLA: who is waiting for a reply and for how long. The clock starts at the last inbound message and stops on any reply (human or bot). level=open (default: warn+breach), all, ok, warn, breach.',
        },
        params: [
          { name: 'level', in: 'query', type: 'string', required: false, desc: { he: 'open (ברירת מחדל) | all | ok | warn | breach', en: 'open (default) | all | ok | warn | breach' } },
          { name: 'pageNumber', in: 'query', type: 'number', required: false, desc: { he: 'מספר עמוד.', en: 'Page number.' } },
          { name: 'pageSize', in: 'query', type: 'number', required: false, desc: { he: 'גודל עמוד (עד 200).', en: 'Page size (max 200).' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/conversations/sla?level=open" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "level": "open",
    "config": { "warnMinutes": 180, "breachMinutes": 720, "statuses": ["Open","In Process"], "businessHoursEnabled": true },
    "count": 1, "total": 1,
    "items": [
      { "phone": "972501234567", "name": "Dana", "lastMessageTime": "2026-09-15T08:00:00Z",
        "lastConversationStatus": "Open", "waitingMinutes": 240, "level": "warn", "ownerId": "", "ownerName": "" }
    ]
  }
}`,
      },
      {
        method: 'GET',
        path: '/conversations/{phone}/sla',
        scope: 'conversations:read',
        summary: {
          he: 'SLA של זמן-תגובה לשיחה אחת: האם הלקוח ממתין, כמה דקות, והרמה (ok/warn/breach).',
          en: 'Message-response SLA for one conversation: is the customer waiting, for how many minutes, and the level (ok/warn/breach).',
        },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: 'מספר הטלפון של הלקוח.', en: 'Customer phone number.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/conversations/972501234567/sla" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "phone": "972501234567", "name": "Dana", "lastMessageDirection": "inbound",
    "lastMessageTime": "2026-09-15T08:00:00Z", "lastConversationStatus": "Open",
    "waiting": true, "waitingMinutes": 240, "level": "warn",
    "config": { "warnMinutes": 180, "breachMinutes": 720, "businessHoursEnabled": true }
  }
}`,
      },
    ],
  },
  {
    id: 'templates',
    title: { he: 'תבניות', en: 'Templates' },
    description: {
      he: 'ניהול תבניות WhatsApp — רשימה, פרטים, משתנים ויצירה. יצירת תבנית תומכת ב-Header של טקסט או מדיה (תמונה/וידאו/מסמך), Body עם משתני {{1}}, Footer וכפתורים (Quick Reply / URL / טלפון). ראו דוגמאות מלאות למטה.',
      en: 'Manage WhatsApp templates — list, details, variables and creation. Template creation supports a text or media (image/video/document) Header, a Body with {{1}} variables, a Footer and Buttons (Quick Reply / URL / Phone). See full examples below.',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/templates',
        scope: 'templates:read',
        summary: { he: 'כל התבניות של הארגון.', en: 'All templates for the organization.' },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/templates" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": [ { "id": "?", "name": "welcome_0626", "language": "he", "status": "APPROVED" } ]
}`,
      },
      {
        method: 'GET',
        path: '/templates/{templateId}',
        scope: 'templates:read',
        summary: { he: 'תבנית בודדת כולל סטטוס האישור של Meta.', en: 'A single template incl. Meta approval status.' },
        params: [
          { name: 'templateId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה התבנית.', en: 'Template id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/templates/welcome_0626" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": { "id": "?", "name": "welcome_0626", "status": "APPROVED", "components": [ ? ] }
}`,
      },
      {
        method: 'GET',
        path: '/templates/{templateId}/variables',
        scope: 'templates:read',
        summary: { he: 'המשתנים הדינמיים של התבנית.', en: 'The template\'s dynamic variables.' },
        params: [
          { name: 'templateId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה התבנית.', en: 'Template id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/templates/welcome_0626/variables" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": [ { "key": "dynamic_var1", "label": "שם" } ]
}`,
      },
      {
        method: 'POST',
        path: '/templates',
        scope: 'templates:write',
        summary: {
          he: 'יצירת תבנית חדשה (נשלחת ל-Meta לאישור). תומכת ב-Header טקסט/מדיה, Body עם משתנים, Footer וכפתורים. שמות חייבים להיות באנגלית, lowercase_with_underscores.',
          en: 'Create a new template (submitted to Meta for approval). Supports text/media Header, Body with variables, Footer and Buttons. Names must be English, lowercase_with_underscores.',
        },
        params: [
          { name: 'name', in: 'body', type: 'string', required: true, desc: { he: 'שם התבנית (אנגלית, קווים תחתונים).', en: 'Template name (English, underscores).' } },
          { name: 'language', in: 'body', type: 'string', required: true, desc: { he: 'קוד שפה, למשל he / en.', en: 'Language code, e.g. he / en.' } },
          { name: 'category', in: 'body', type: 'string', required: true, desc: { he: 'MARKETING / UTILITY / AUTHENTICATION.', en: 'MARKETING / UTILITY / AUTHENTICATION.' } },
          { name: 'components', in: 'body', type: 'object[]', required: true, desc: { he: 'רכיבי התבנית: HEADER (TEXT או IMAGE/VIDEO/DOCUMENT), BODY, FOOTER, BUTTONS. ראו דוגמאות למטה.', en: 'Template components: HEADER (TEXT or IMAGE/VIDEO/DOCUMENT), BODY, FOOTER, BUTTONS. See examples below.' } },
          { name: 'headerMediaUrl', in: 'body', type: 'string', required: false, desc: { he: 'קיצור: כתובת URL ציבורית של מדיה. Gambot מעלה אותה ל-Meta ומזריק את ה-header_handle לרכיב ה-HEADER אוטומטית.', en: 'Shortcut: a public media URL. Gambot uploads it to Meta and injects the header_handle into the HEADER component automatically.' } },
          { name: 'headerFormat', in: 'body', type: 'string', required: false, desc: { he: 'פורמט ל-headerMediaUrl: IMAGE / VIDEO / DOCUMENT (ברירת מחדל IMAGE).', en: 'Format for headerMediaUrl: IMAGE / VIDEO / DOCUMENT (default IMAGE).' } },
          { name: 'gmbtMediaId', in: 'body', type: 'string', required: false, desc: { he: 'מזהה מדיה של Gambot (לתצוגה מקדימה). לרוב מיותר בעת שימוש ב-headerMediaUrl.', en: 'Gambot media id (for preview). Usually unnecessary when using headerMediaUrl.' } },
        ],
        request: `{
  "name": "order_confirmation_0626",
  "language": "he",
  "category": "UTILITY",
  "components": [
    { "type": "HEADER", "format": "TEXT", "text": "הזמנה {{1}}", "example": { "header_text": ["1234"] } },
    { "type": "BODY", "text": "שלום {{1}}, הזמנה {{2}} התקבלה בהצלחה!", "example": { "body_text": [["דנה", "1234"]] } },
    { "type": "FOOTER", "text": "Gambot — שירות לקוחות" },
    { "type": "BUTTONS", "buttons": [
      { "type": "QUICK_REPLY", "text": "פרטי ההזמנה" },
      { "type": "URL", "text": "מעבר לאתר", "url": "https://shop.co.il/orders/{{1}}", "example": ["1234"] },
      { "type": "PHONE_NUMBER", "text": "התקשרו אלינו", "phone_number": "+972500000000" }
    ] }
  ]
}`,
        curl: curl('POST', '/templates', `{ "name": "order_confirmation_0626", "language": "he", "category": "UTILITY", "components": [ { "type": "BODY", "text": "שלום {{1}}" } ] }`),
        response: `{
  "success": true,
  "message": "Template created",
  "data": { "id": "?", "status": "PENDING" }
}`,
        examples: [
          {
            label: { he: '1) טקסט בלבד (Body + משתנה)', en: '1) Text only (Body + variable)' },
            code: curl('POST', '/templates', `{
  "name": "welcome_new_customer_0626",
  "language": "he",
  "category": "MARKETING",
  "components": [
    { "type": "BODY", "text": "ברוך הבא {{1}}! שמחים שהצטרפת אלינו", "example": { "body_text": [["דנה"]] } }
  ]
}`),
          },
          {
            label: { he: '2) Header טקסט + Footer', en: '2) Text header + Footer' },
            code: curl('POST', '/templates', `{
  "name": "appointment_reminder_0626",
  "language": "he",
  "category": "UTILITY",
  "components": [
    { "type": "HEADER", "format": "TEXT", "text": "תזכורת לתור" },
    { "type": "BODY", "text": "היי {{1}}, יש לך תור ב-{{2}}.", "example": { "body_text": [["דנה", "10:00"]] } },
    { "type": "FOOTER", "text": "ניתן לבטל עד 24 שעות מראש" }
  ]
}`),
          },
          {
            label: { he: '3) Header תמונה — קיצור headerMediaUrl (קריאה בודדת)', en: '3) Image header — headerMediaUrl shortcut (single call)' },
            code: curl('POST', '/templates', `{
  "name": "promo_summer_sale_0626",
  "language": "he",
  "category": "MARKETING",
  "headerMediaUrl": "https://cdn.example.com/summer.jpg",
  "headerFormat": "IMAGE",
  "components": [
    { "type": "BODY", "text": "מבצע קיץ! עד 50% הנחה על {{1}} עכשיו.", "example": { "body_text": [["הכול"]] } },
    { "type": "FOOTER", "text": "בתוקף עד סוף החודש" },
    { "type": "BUTTONS", "buttons": [ { "type": "URL", "text": "למבצע", "url": "https://shop.co.il" } ] }
  ]
}`),
          },
          {
            label: { he: '4) Header תמונה — עם header_handle שהועלה מראש (ראו POST /templates/media)', en: '4) Image header — with a pre-uploaded header_handle (see POST /templates/media)' },
            code: curl('POST', '/templates', `{
  "name": "receipt_document_0626",
  "language": "he",
  "category": "UTILITY",
  "components": [
    { "type": "HEADER", "format": "DOCUMENT", "example": { "header_handle": ["4::aW1hZ2Uv...<handle-from-upload>"] } },
    { "type": "BODY", "text": "מצורפת הקבלה עבור הזמנה {{1}}.", "example": { "body_text": [["1234"]] } }
  ]
}`),
          },
          {
            label: { he: '5) Header וידאו', en: '5) Video header' },
            code: curl('POST', '/templates', `{
  "name": "product_demo_0626",
  "language": "he",
  "category": "MARKETING",
  "headerMediaUrl": "https://cdn.example.com/demo.mp4",
  "headerFormat": "VIDEO",
  "components": [
    { "type": "BODY", "text": "צפו בהדגמה של {{1}}", "example": { "body_text": [["המוצר החדש"]] } }
  ]
}`),
          },
          {
            label: { he: '6) כפתורים — Quick Reply + URL דינמי + טלפון', en: '6) Buttons — Quick Reply + dynamic URL + phone' },
            code: curl('POST', '/templates', `{
  "name": "order_shipped_0626",
  "language": "he",
  "category": "UTILITY",
  "components": [
    { "type": "BODY", "text": "הזמנתך {{1}} נשלחה!", "example": { "body_text": [["1234"]] } },
    { "type": "BUTTONS", "buttons": [
      { "type": "QUICK_REPLY", "text": "קיבלתי, תודה" },
      { "type": "URL", "text": "מעקב משלוח", "url": "https://track.co.il/{{1}}", "example": ["1234"] },
      { "type": "PHONE_NUMBER", "text": "התקשרו אלינו", "phone_number": "+972500000000" }
    ] }
  ]
}`),
          },
          {
            label: { he: '7) MCP — הכלי gambot_create_template (מדיה, כפתורים ו-Footer)', en: '7) MCP — gambot_create_template tool (media + buttons + footer)' },
            code: `// MCP tool call — gambot_create_template
{
  "name": "promo_summer_sale_0626",
  "language": "he",
  "category": "MARKETING",
  "headerMediaUrl": "https://cdn.example.com/summer.jpg",
  "headerFormat": "IMAGE",
  "components": [
    { "type": "BODY", "text": "מבצע קיץ! עד 50% הנחה.", "example": { "body_text": [["הכול"]] } },
    { "type": "FOOTER", "text": "בתוקף עד סוף החודש" },
    { "type": "BUTTONS", "buttons": [ { "type": "QUICK_REPLY", "text": "אני רוצה!" } ] }
  ]
}`,
          },
        ],
      },
      {
        method: 'POST',
        path: '/templates/media',
        scope: 'templates:write',
        summary: {
          he: 'העלאת מדיה (תמונה/וידאו/מסמך) מכתובת URL ציבורית ל-Meta וקבלת header_handle לשימוש חוזר עבור רכיב HEADER של תבנית.',
          en: 'Upload media (image/video/document) from a public URL to Meta and get a reusable header_handle for a template HEADER component.',
        },
        params: [
          { name: 'url', in: 'body', type: 'string', required: true, desc: { he: 'כתובת URL ציבורית של המדיה.', en: 'Public URL of the media.' } },
          { name: 'type', in: 'body', type: 'string', required: false, desc: { he: 'סוג MIME (למשל image/png, video/mp4, application/pdf).', en: 'MIME type (e.g. image/png, video/mp4, application/pdf).' } },
        ],
        request: `{
  "url": "https://cdn.example.com/summer.jpg",
  "type": "image/jpeg"
}`,
        curl: curl('POST', '/templates/media', `{ "url": "https://cdn.example.com/summer.jpg", "type": "image/jpeg" }`),
        response: `{
  "success": true,
  "message": "Media uploaded",
  "data": {
    "headerHandle": "4::aW1hZ2Uv...",
    "gmbtMediaId": "?",
    "mediaId": "?",
    "mediaUrl": "https://cdn.example.com/summer.jpg"
  }
}`,
        examples: [
          {
            label: { he: 'MCP — הכלי gambot_upload_template_media', en: 'MCP — gambot_upload_template_media tool' },
            code: `// MCP tool call — gambot_upload_template_media
{ "url": "https://cdn.example.com/summer.jpg", "type": "image/jpeg" }
// → returns { headerHandle } to place in a HEADER component's example.header_handle`,
          },
        ],
      },
    ],
  },
  {
    id: 'contacts',
    title: { he: 'אנשי קשר', en: 'Contacts' },
    description: {
      he: 'יצירה, שליפה ועדכון של אנשי קשר, כולל שדות בסיס ושדות דינמיים (Custom Fields).',
      en: 'Create, fetch and update contacts, including base and dynamic (custom) fields.',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/contacts/fields',
        scope: 'contacts:read',
        summary: {
          he: 'הגדרות השדות של איש קשר (בסיס + דינמיים). באנשי קשר, הערכים הדינמיים נשמרים כמפתחות ברמה העליונה — שלחו אותם תחת customFields.',
          en: 'Contact field definitions (base + dynamic). For contacts, dynamic values are stored as top-level keys — send them under customFields.',
        },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/contacts/fields" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": { "count": 8, "fields": [
    { "Name": "name", "Type": "text", "Label": "שם", "Options": null },
    { "Name": "city", "Type": "select", "Label": "עיר", "Options": ["תל אביב", "חיפה"] }
  ] }
}`,
      },
      {
        method: 'GET',
        path: '/contacts/ctwa',
        scope: 'contacts:read',
        summary: {
          he: 'אנשי קשר שנוצרו ממודעת Click-to-WhatsApp (CTWA) — כל אחד מועשר במידע על המודעה שממנה הגיע.',
          en: 'Contacts created from a Click-to-WhatsApp (CTWA) ad — each enriched with the originating ad info.',
        },
        params: [
          { name: 'adId', in: 'query', type: 'string', required: false, desc: { he: 'רק אנשי קשר מהמודעה הזו (referralSourceId).', en: 'Only contacts from this ad (referralSourceId).' } },
          { name: 'sourceType', in: 'query', type: 'string', required: false, desc: { he: 'מקור ההפניה: ad או post.', en: 'Referral origin: ad or post.' } },
          { name: 'dateFrom', in: 'query', type: 'string', required: false, desc: { he: 'תאריך התחלה yyyy-MM-dd (לפי תאריך יצירת איש הקשר).', en: 'Start date yyyy-MM-dd (on contact creation date).' } },
          { name: 'dateTo', in: 'query', type: 'string', required: false, desc: { he: 'תאריך סיום yyyy-MM-dd (כולל).', en: 'End date yyyy-MM-dd (inclusive).' } },
          { name: 'pageNumber', in: 'query', type: 'integer', required: false, desc: { he: 'מספר עמוד (ברירת מחדל 1).', en: 'Page number (default 1).' } },
          { name: 'pageSize', in: 'query', type: 'integer', required: false, desc: { he: 'גודל עמוד 1–200 (ברירת מחדל 30).', en: 'Page size 1–200 (default 30).' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/contacts/ctwa?sourceType=ad&pageSize=20" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": { "pageNumber": 1, "pageSize": 20, "count": 1, "total": 1, "items": [
    {
      "phoneNumber": "972501234567",
      "name": "דנה כהן",
      "email": "",
      "ownerId": "?", "ownerName": "?",
      "createdOn": "2026-09-14 10:22:11",
      "keys": ["Leads", "Referral-ad"],
      "ctwa": {
        "adId": "120200000000000",
        "sourceType": "ad",
        "headline": "מבצע קיץ 50% הנחה",
        "body": "?",
        "sourceUrl": "https://fb.me/?",
        "platform": "facebook",
        "ctwaClid": "ARA?"
      }
    }
  ] }
}`,
      },
      {
        method: 'POST',
        path: '/contacts',
        scope: 'contacts:write',
        summary: { he: 'יצירת איש קשר (מחזיר את הקיים אם הטלפון מוכר). כולל שדות דינמיים תחת customFields.', en: 'Create a contact (returns the existing one if the phone is known). Includes dynamic fields under customFields.' },
        params: [
          { name: 'phoneNumber', in: 'body', type: 'string', required: true, desc: { he: 'מספר הטלפון. מקבל גם to.', en: 'Phone number. to also accepted.' } },
          { name: 'name', in: 'body', type: 'string', required: false, desc: { he: 'שם.', en: 'Name.' } },
          { name: 'email', in: 'body', type: 'string', required: false, desc: { he: 'אימייל.', en: 'Email.' } },
          { name: 'keys', in: 'body', type: 'string[]', required: false, desc: { he: 'תגיות/רשימות (ברירת מחדל Leads).', en: 'Tags/lists (default Leads).' } },
          { name: 'customFields', in: 'body', type: 'object', required: false, desc: { he: 'שדות דינמיים (נכתבים כמפתחות ברמה העליונה). ראו GET /contacts/fields.', en: 'Dynamic fields (written as top-level keys). See GET /contacts/fields.' } },
        ],
        request: `{
  "phoneNumber": "972501234567",
  "name": "דנה כהן",
  "email": "dana@example.com",
  "keys": ["Leads", "VIP"],
  "customFields": { "city": "תל אביב", "birthday": "1990-05-01" }
}`,
        curl: curl('POST', '/contacts', `{ "phoneNumber": "972501234567", "name": "Dana", "customFields": { "city": "תל אביב" } }`),
        response: `{ "success": true, "message": "Contact created", "data": { "id": "?" } }`,
      },
      {
        method: 'GET',
        path: '/contacts/{phone}',
        scope: 'contacts:read',
        summary: { he: 'שליפת איש קשר לפי מספר טלפון.', en: 'Fetch a contact by phone number.' },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: 'מספר הטלפון.', en: 'Phone number.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/contacts/972501234567" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "phoneNumber": "972501234567", "name": "Dana", "consent": true, "isSpam": false } }`,
      },
      {
        method: 'PATCH',
        path: '/contacts/{phone}',
        scope: 'contacts:write',
        summary: { he: 'עדכון איש קשר — רק השדות שנשלחו, כולל שדות דינמיים תחת customFields, וכן consent/isSpam. מקבל גם POST.', en: 'Update a contact — only provided fields, incl. dynamic fields under customFields, plus consent/isSpam. POST also accepted.' },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: 'מספר הטלפון.', en: 'Phone number.' } },
          { name: 'name', in: 'body', type: 'string', required: false, desc: { he: 'שם.', en: 'Name.' } },
          { name: 'email', in: 'body', type: 'string', required: false, desc: { he: 'אימייל.', en: 'Email.' } },
          { name: 'keys', in: 'body', type: 'string[]', required: false, desc: { he: 'תגיות/רשימות.', en: 'Tags/lists.' } },
          { name: 'consent', in: 'body', type: 'boolean', required: false, desc: { he: 'הסכמה לדיוור: true=הסכמה, false=הסרה (מוחרג מדיוורים).', en: 'Marketing consent: true=opt-in, false=opt-out (excluded from broadcasts).' } },
          { name: 'isSpam', in: 'body', type: 'boolean', required: false, desc: { he: 'סימון כספאם (מוחרג מדיוורים).', en: 'Mark as spam (excluded from broadcasts).' } },
          { name: 'customFields', in: 'body', type: 'object', required: false, desc: { he: 'שדות דינמיים.', en: 'Dynamic fields.' } },
        ],
        request: `{ "name": "Dana Cohen", "customFields": { "city": "חיפה" } }`,
        curl: curl('PATCH', '/contacts/972501234567', `{ "name": "Dana Cohen", "customFields": { "city": "חיפה" } }`),
        response: `{ "success": true, "message": "Contact updated" }`,
      },
      {
        method: 'POST',
        path: '/contacts/{phone}/consent',
        scope: 'contacts:write',
        summary: { he: 'קביעת הסכמה לדיוור. consent=false מסיר את איש הקשר מכל הדיוורים העתידיים (הסרה מרשימת התפוצה).', en: 'Set marketing consent. consent=false opts the contact out of all future broadcasts (unsubscribe).' },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: 'מספר הטלפון.', en: 'Phone number.' } },
          { name: 'consent', in: 'body', type: 'boolean', required: true, desc: { he: 'true=הסכמה לדיוור, false=הסרה / הוסר מהתפוצה.', en: 'true=opt-in, false=opt-out / unsubscribed.' } },
          { name: 'source', in: 'body', type: 'string', required: false, desc: { he: 'הערת תיעוד חופשית על מקור ההסכמה/ההסרה.', en: 'Free-text audit note on where consent/opt-out came from.' } },
        ],
        request: `{ "consent": false, "source": "phone call" }`,
        curl: curl('POST', '/contacts/972501234567/consent', `{ "consent": false, "source": "phone call" }`),
        response: `{ "success": true, "data": { "phoneNumber": "972501234567", "consent": false, "mailable": false }, "message": "Contact opted out — excluded from future broadcasts." }`,
      },
      {
        method: 'POST',
        path: '/contacts/{phone}/spam',
        scope: 'contacts:write',
        summary: { he: 'סימון/ביטול סימון של איש קשר כספאם. סימון כספאם גם מסיר אותו מהתפוצה (consent=false).', en: 'Mark/unmark a contact as spam. Marking as spam also opts them out (consent=false).' },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: 'מספר הטלפון.', en: 'Phone number.' } },
          { name: 'isSpam', in: 'body', type: 'boolean', required: true, desc: { he: 'true=סמן כספאם, false=נקה את הסימון.', en: 'true=mark as spam, false=clear the flag.' } },
        ],
        request: `{ "isSpam": true }`,
        curl: curl('POST', '/contacts/972501234567/spam', `{ "isSpam": true }`),
        response: `{ "success": true, "data": { "phoneNumber": "972501234567", "isSpam": true }, "message": "Contact marked as spam and excluded from broadcasts." }`,
      },
      {
        method: 'GET',
        path: '/contacts/tags',
        scope: 'contacts:read',
        summary: { he: 'תגיות אנשי הקשר של הארגון (keys) — התוויות שאיש קשר יכול לשאת ושקמפיינים מכוונים אליהן.', en: "The organization's contact tags (keys) — the labels a contact can carry and that campaigns target." },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/contacts/tags" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 3, "tags": ["Leads", "Customers", "VIP"] } }`,
      },
      {
        method: 'GET',
        path: '/contacts/categories',
        scope: 'contacts:read',
        summary: { he: 'קטגוריות השיחה של הארגון. לאיש קשר יש לכל היותר קטגוריה אחת (בניגוד לתגיות).', en: "The org's conversation categories. A contact has at most one category (unlike tags)." },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/contacts/categories" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 2, "categories": ["מכירות", "תמיכה"] } }`,
      },
      {
        method: 'POST',
        path: '/contacts/{phone}/tags',
        scope: 'contacts:write',
        summary: { he: 'הוספה/הסרה של תגיות לאיש קשר אחד — ממוזג עם התגיות הקיימות (ללא החלפה עיוורת). להחלפה מלאה השתמשו ב-PATCH עם keys.', en: 'Add/remove tags on one contact — merges with existing tags (no blind replace). For a full overwrite use PATCH with keys.' },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: 'מספר הטלפון.', en: 'Phone number.' } },
          { name: 'add', in: 'body', type: 'string[]', required: false, desc: { he: 'תגיות להוספה (נוצרות אוטומטית אם חדשות).', en: 'Tags to add (auto-created if new).' } },
          { name: 'remove', in: 'body', type: 'string[]', required: false, desc: { he: 'תגיות להסרה.', en: 'Tags to remove.' } },
        ],
        request: `{ "add": ["VIP"], "remove": ["Cold"] }`,
        curl: curl('POST', '/contacts/972501234567/tags', `{ "add": ["VIP"], "remove": ["Cold"] }`),
        response: `{ "success": true, "data": { "phoneNumber": "972501234567", "keys": ["Leads", "VIP"] }, "message": "Tags updated." }`,
      },
      {
        method: 'POST',
        path: '/contacts/tags/bulk',
        scope: 'contacts:write',
        summary: { he: 'הוספה/הסרה של תגיות למספר אנשי קשר בבת אחת. בחרו את הקהל לפי phones ו/או fromTag (כל מי שמחזיק כרגע בתגית זו).', en: 'Add/remove tags across many contacts at once. Select the audience by phones and/or fromTag (everyone who currently has that tag).' },
        params: [
          { name: 'phones', in: 'body', type: 'string[]', required: false, desc: { he: 'רשימת מספרי טלפון מפורשת.', en: 'Explicit list of phone numbers.' } },
          { name: 'fromTag', in: 'body', type: 'string', required: false, desc: { he: 'החל על כל איש קשר שמחזיק כרגע בתגית זו.', en: 'Apply to every contact that currently has this tag.' } },
          { name: 'add', in: 'body', type: 'string[]', required: false, desc: { he: 'תגיות להוספה.', en: 'Tags to add.' } },
          { name: 'remove', in: 'body', type: 'string[]', required: false, desc: { he: 'תגיות להסרה.', en: 'Tags to remove.' } },
        ],
        request: `{ "fromTag": "Leads", "add": ["Q1-Campaign"] }`,
        curl: curl('POST', '/contacts/tags/bulk', `{ "fromTag": "Leads", "add": ["Q1-Campaign"] }`),
        response: `{ "success": true, "data": { "requested": 120, "updated": 120, "notFound": [] }, "message": "Tags updated on 120 contact(s)." }`,
      },
      {
        method: 'POST',
        path: '/contacts/{phone}/status',
        scope: 'contacts:write',
        summary: { he: 'קביעת סטטוס השיחה של איש הקשר (Open / In Process / Closed) — אותו שדה שתיבת הצ׳אט מסננת לפיו.', en: 'Set the contact conversation status (Open / In Process / Closed) — the same field the chat inbox filters on.' },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: 'מספר הטלפון.', en: 'Phone number.' } },
          { name: 'status', in: 'body', type: 'string', required: true, desc: { he: 'Open | In Process | Closed.', en: 'Open | In Process | Closed.' } },
        ],
        request: `{ "status": "Closed" }`,
        curl: curl('POST', '/contacts/972501234567/status', `{ "status": "Closed" }`),
        response: `{ "success": true, "data": { "phoneNumber": "972501234567", "status": "Closed" }, "message": "Conversation status updated." }`,
      },
      {
        method: 'POST',
        path: '/contacts/{phone}/category',
        scope: 'contacts:write',
        summary: { he: 'קביעת קטגוריית השיחה (תווית אחת). מחרוזת ריקה מנקה אותה. ראו GET /contacts/categories.', en: 'Set the conversation category (a single label). Empty string clears it. See GET /contacts/categories.' },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: 'מספר הטלפון.', en: 'Phone number.' } },
          { name: 'category', in: 'body', type: 'string', required: true, desc: { he: 'תווית הקטגוריה (ריק מנקה).', en: 'Category label (empty clears).' } },
        ],
        request: `{ "category": "מכירות" }`,
        curl: curl('POST', '/contacts/972501234567/category', `{ "category": "מכירות" }`),
        response: `{ "success": true, "data": { "phoneNumber": "972501234567", "category": "מכירות" }, "message": "Conversation category updated." }`,
      },
    ],
  },
  {
    id: 'leads',
    title: { he: 'לידים', en: 'Leads' },
    description: {
      he: 'יצירה, שליפה, הצגה ועדכון של לידים — כולל כל שדות הבסיס והשדות הדינמיים (customFields).',
      en: 'Create, fetch, list and update leads — including all base fields and dynamic fields (customFields).',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/leads/fields',
        scope: 'leads:read',
        summary: {
          he: 'הגדרות השדות של ליד — baseFields + customFields. בלידים, הערכים הדינמיים נשמרים במפת customFields מקוננת.',
          en: 'Lead field definitions — baseFields + customFields. For leads, dynamic values are stored in a nested customFields map.',
        },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/leads/fields" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "baseFields": ["title", "contactPhone", "value", "priority", "source", "status", "stageId", "..."],
    "customFields": [ { "key": "budget", "label": "תקציב", "type": "number" }, { "key": "region", "label": "אזור", "type": "select", "options": ["צפון", "דרום"] } ]
  }
}`,
      },
      {
        method: 'GET',
        path: '/leads',
        scope: 'leads:read',
        summary: { he: 'הצגת לידים (עם עימוד וחיפוש).', en: 'List leads (paginated + search).' },
        params: [
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 50 (מקסימום 200).', en: 'Default 50 (max 200).' } },
          { name: 'search', in: 'query', type: 'string', required: false, desc: { he: 'חיפוש חופשי.', en: 'Free-text search.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/leads?pageSize=50" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "total": 12, "count": 12, "items": [ { "id": "?", "title": "?" } ] } }`,
      },
      {
        method: 'GET',
        path: '/leads/{leadId}',
        scope: 'leads:read',
        summary: { he: 'שליפת ליד בודד לפי מזהה.', en: 'Fetch a single lead by id.' },
        params: [
          { name: 'leadId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הליד.', en: 'Lead id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/leads/LEAD_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "LEAD_ID", "title": "?", "status": "?" } }`,
      },
      {
        method: 'POST',
        path: '/leads',
        scope: 'leads:write',
        summary: { he: 'יצירת ליד CRM (איש קשר נוצר אם חסר, שליחת תבנית אופציונלית). מקבל את כל שדות הבסיס + customFields.', en: 'Create a CRM lead (contact created if missing, optional template send). Accepts all base fields + customFields.' },
        params: [
          { name: 'lead', in: 'body', type: 'object', required: true, desc: { he: 'אובייקט הליד: PhoneNumber (חובה), Name, Email, וכל שדה בסיס (title, value, priority, source, status, stageId, companyName…) + customFields.', en: 'Lead object: PhoneNumber (required), Name, Email, and any base field (title, value, priority, source, status, stageId, companyName…) + customFields.' } },
          { name: 'templateMessageData', in: 'body', type: 'object', required: false, desc: { he: 'תבנית לשליחה מיידית לליד.', en: 'Template to send immediately to the lead.' } },
        ],
        request: `{
  "lead": {
    "PhoneNumber": "972501234567",
    "Name": "דנה כהן",
    "Email": "dana@example.com",
    "title": "פנייה מהאתר",
    "value": "2500",
    "currency": "ILS",
    "priority": "high",
    "source": "website",
    "companyName": "Acme",
    "customFields": { "budget": "5000", "region": "צפון" }
  }
}`,
        curl: curl('POST', '/leads', `{ "lead": { "PhoneNumber": "972501234567", "Name": "Dana", "title": "Website lead", "customFields": { "budget": "5000" } } }`),
        response: `{ "success": true, "message": "Lead created successfully.", "data": { "leadId": "?" } }`,
      },
      {
        method: 'PATCH',
        path: '/leads/{leadId}',
        scope: 'leads:write',
        summary: { he: 'עדכון ליד — כל שדה בסיס + customFields (ממוזג עם הקיים). מקבל גם POST.', en: 'Update a lead — any base field + customFields (merged with existing). POST also accepted.' },
        params: [
          { name: 'leadId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הליד.', en: 'Lead id.' } },
          { name: 'title', in: 'body', type: 'string', required: false, desc: { he: 'כותרת.', en: 'Title.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'סטטוס.', en: 'Status.' } },
          { name: 'stageId', in: 'body', type: 'string', required: false, desc: { he: 'שלב בצינור.', en: 'Pipeline stage.' } },
          { name: 'value', in: 'body', type: 'string', required: false, desc: { he: 'ערך העסקה.', en: 'Deal value.' } },
          { name: 'tags', in: 'body', type: 'string[]', required: false, desc: { he: 'תגיות.', en: 'Tags.' } },
          { name: 'customFields', in: 'body', type: 'object', required: false, desc: { he: 'שדות דינמיים (ממוזגים עם הקיימים).', en: 'Dynamic fields (merged with existing).' } },
        ],
        request: `{ "status": "in_progress", "value": "1500", "customFields": { "region": "דרום" } }`,
        curl: curl('PATCH', '/leads/LEAD_ID', `{ "status": "in_progress", "customFields": { "region": "דרום" } }`),
        response: `{ "success": true, "message": "Lead updated" }`,
      },
    ],
  },
  {
    id: 'cases',
    title: { he: 'פניות', en: 'Cases' },
    description: {
      he: 'יצירה, שליפה, הצגה ועדכון של פניות (Tickets) — כולל שדות בסיס ושדות דינמיים (customFields).',
      en: 'Create, fetch, list and update cases (tickets) — including base and dynamic fields (customFields).',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/cases/fields',
        scope: 'cases:read',
        summary: {
          he: 'הגדרות השדות של פנייה — baseFields + customFields. בפניות, הערכים הדינמיים נשמרים במפת customFields מקוננת.',
          en: 'Case field definitions — baseFields + customFields. For cases, dynamic values are stored in a nested customFields map.',
        },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/cases/fields" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "baseFields": ["subject", "description", "contactPhone", "category", "priority", "statusId", "stageId", "..."],
    "customFields": [ { "key": "orderNumber", "label": "מספר הזמנה", "type": "text" } ]
  }
}`,
      },
      {
        method: 'GET',
        path: '/cases',
        scope: 'cases:read',
        summary: { he: 'הצגת פניות (עם עימוד וחיפוש).', en: 'List cases (paginated + search).' },
        params: [
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 50 (מקסימום 200).', en: 'Default 50 (max 200).' } },
          { name: 'search', in: 'query', type: 'string', required: false, desc: { he: 'חיפוש חופשי.', en: 'Free-text search.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/cases?pageSize=50" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "total": 5, "count": 5, "items": [ { "id": "?", "subject": "?" } ] } }`,
      },
      {
        method: 'GET',
        path: '/cases/{caseId}',
        scope: 'cases:read',
        summary: { he: 'שליפת פנייה בודדת לפי מזהה.', en: 'Fetch a single case by id.' },
        params: [
          { name: 'caseId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הפנייה.', en: 'Case id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/cases/CASE_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "CASE_ID", "subject": "?", "statusId": "?" } }`,
      },
      {
        method: 'GET',
        path: '/cases/sla',
        scope: 'cases:read',
        summary: {
          he: 'פניות לפי SLA לכל שלב: אילו פניות חרגו מיעד הזמן של השלב או בסיכון. status=open (ברירת מחדל: breached+at_risk), all, breached, at_risk, ok, none, resolved. מודע לשעות העבודה כשמוגדר.',
          en: 'Cases by per-stage SLA: which cases breached the stage time target or are at risk. status=open (default: breached+at_risk), all, breached, at_risk, ok, none, resolved. Business-hours-aware when configured.',
        },
        params: [
          { name: 'status', in: 'query', type: 'string', required: false, desc: { he: 'open (ברירת מחדל) | all | breached | at_risk | ok | none | resolved', en: 'open (default) | all | breached | at_risk | ok | none | resolved' } },
          { name: 'pageNumber', in: 'query', type: 'number', required: false, desc: { he: 'מספר עמוד.', en: 'Page number.' } },
          { name: 'pageSize', in: 'query', type: 'number', required: false, desc: { he: 'גודל עמוד (עד 200).', en: 'Page size (max 200).' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/cases/sla?status=open" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "status": "open",
    "config": { "businessHoursEnabled": true, "stages": [ { "stageId": "new", "stageName": "New", "hours": 1, "unit": "days", "enabled": true } ] },
    "count": 1, "total": 1,
    "items": [
      { "caseId": "CASE_ID", "subject": "Order issue", "contactPhone": "972501234567", "priority": "high",
        "stageId": "new", "stageName": "New", "stageEnteredAt": "2026-09-13T08:00:00Z", "stageDueAt": "2026-09-14T08:00:00Z",
        "slaHours": 1, "slaUnit": "days", "minutesInStage": 2880, "minutesRemaining": -1440, "breached": true, "status": "breached" }
    ]
  }
}`,
      },
      {
        method: 'POST',
        path: '/cases',
        scope: 'cases:write',
        summary: { he: 'יצירת פנייה חדשה. כולל category ושדות דינמיים תחת customFields.', en: 'Create a new case. Includes category and dynamic fields under customFields.' },
        params: [
          { name: 'subject', in: 'body', type: 'string', required: true, desc: { he: 'נושא הפנייה.', en: 'Case subject.' } },
          { name: 'description', in: 'body', type: 'string', required: false, desc: { he: 'תיאור.', en: 'Description.' } },
          { name: 'contactPhone', in: 'body', type: 'string', required: false, desc: { he: 'קישור לאיש קשר.', en: 'Link to a contact.' } },
          { name: 'priority', in: 'body', type: 'string', required: false, desc: { he: 'עדיפות.', en: 'Priority.' } },
          { name: 'category', in: 'body', type: 'string', required: false, desc: { he: 'קטגוריה.', en: 'Category.' } },
          { name: 'customFields', in: 'body', type: 'object', required: false, desc: { he: 'שדות דינמיים. ראו GET /cases/fields.', en: 'Dynamic fields. See GET /cases/fields.' } },
        ],
        request: `{ "subject": "בעיה בהזמנה", "contactPhone": "972501234567", "priority": "high", "category": "billing", "customFields": { "orderNumber": "1234" } }`,
        curl: curl('POST', '/cases', `{ "subject": "Order issue", "contactPhone": "972501234567", "customFields": { "orderNumber": "1234" } }`),
        response: `{ "success": true, "message": "Case created", "data": { "id": "?" } }`,
      },
      {
        method: 'PATCH',
        path: '/cases/{caseId}',
        scope: 'cases:write',
        summary: { he: 'עדכון פנייה — שדות בסיס + customFields (ממוזג עם הקיים). מקבל גם POST.', en: 'Update a case — base fields + customFields (merged with existing). POST also accepted.' },
        params: [
          { name: 'caseId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הפנייה.', en: 'Case id.' } },
          { name: 'statusId', in: 'body', type: 'string', required: false, desc: { he: 'סטטוס.', en: 'Status.' } },
          { name: 'priority', in: 'body', type: 'string', required: false, desc: { he: 'עדיפות.', en: 'Priority.' } },
          { name: 'category', in: 'body', type: 'string', required: false, desc: { he: 'קטגוריה.', en: 'Category.' } },
          { name: 'customFields', in: 'body', type: 'object', required: false, desc: { he: 'שדות דינמיים (ממוזגים עם הקיימים).', en: 'Dynamic fields (merged with existing).' } },
        ],
        request: `{ "statusId": "closed", "customFields": { "resolution": "refunded" } }`,
        curl: curl('PATCH', '/cases/CASE_ID', `{ "statusId": "closed", "customFields": { "resolution": "refunded" } }`),
        response: `{ "success": true, "message": "Case updated" }`,
      },
    ],
  },
  {
    id: 'tasks',
    title: { he: 'משימות', en: 'Tasks' },
    description: {
      he: 'יצירה, הצגה, שליפה ועדכון של משימות (עם קישור אופציונלי לאיש קשר).',
      en: 'Create, list, fetch and update tasks (optionally linked to a contact).',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/tasks',
        scope: 'tasks:read',
        summary: { he: 'הצגת המשימות של הארגון.', en: 'List the organization\'s tasks.' },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/tasks" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 3, "items": [ { "id": "?", "title": "?" } ] } }`,
      },
      {
        method: 'GET',
        path: '/tasks/{taskId}',
        scope: 'tasks:read',
        summary: { he: 'שליפת משימה בודדת לפי מזהה.', en: 'Fetch a single task by id.' },
        params: [
          { name: 'taskId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה המשימה.', en: 'Task id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/tasks/TASK_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "TASK_ID", "title": "?", "status": "open" } }`,
      },
      {
        method: 'PATCH',
        path: '/tasks/{taskId}',
        scope: 'tasks:write',
        summary: { he: 'עדכון משימה — רק השדות שנשלחו. מקבל גם POST.', en: 'Update a task — only provided fields. POST also accepted.' },
        params: [
          { name: 'taskId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה המשימה.', en: 'Task id.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'סטטוס (open/done…).', en: 'Status (open/done…).' } },
          { name: 'priority', in: 'body', type: 'string', required: false, desc: { he: 'עדיפות.', en: 'Priority.' } },
          { name: 'dueDate', in: 'body', type: 'string', required: false, desc: { he: 'תאריך יעד.', en: 'Due date.' } },
        ],
        request: `{ "status": "done" }`,
        curl: curl('PATCH', '/tasks/TASK_ID', `{ "status": "done" }`),
        response: `{ "success": true, "message": "Task updated" }`,
      },
      {
        method: 'POST',
        path: '/tasks',
        scope: 'tasks:write',
        summary: { he: 'יצירת משימה חדשה.', en: 'Create a new task.' },
        params: [
          { name: 'title', in: 'body', type: 'string', required: true, desc: { he: 'כותרת המשימה.', en: 'Task title.' } },
          { name: 'description', in: 'body', type: 'string', required: false, desc: { he: 'תיאור.', en: 'Description.' } },
          { name: 'dueDate', in: 'body', type: 'string', required: false, desc: { he: 'תאריך יעד.', en: 'Due date.' } },
          { name: 'priority', in: 'body', type: 'string', required: false, desc: { he: 'עדיפות (low/medium/high).', en: 'Priority (low/medium/high).' } },
          { name: 'contactPhone', in: 'body', type: 'string', required: false, desc: { he: 'קישור לאיש קשר.', en: 'Link to a contact.' } },
        ],
        request: `{ "title": "להתקשר לדנה", "dueDate": "2026-09-20", "priority": "high", "contactPhone": "972501234567" }`,
        curl: curl('POST', '/tasks', `{ "title": "Call Dana", "priority": "high" }`),
        response: `{ "success": true, "message": "Task created", "data": { "id": "?" } }`,
      },
    ],
  },
  {
    id: 'notes',
    title: { he: 'הערות', en: 'Notes' },
    description: {
      he: 'קריאת ההערות שנכתבו ידנית ומפוזרות ברחבי המערכת — על אנשי קשר (מהצ׳אט/ציר הזמן), לידים ופניות. זהו אותו מקור נתונים כמו "מרכז ההערות" שבמערכת. סננו לפי מקור, טווח תאריכים, כותב או חיפוש חופשי, ושלפו את ההערות של רשומה בודדת.',
      en: 'Read the human-written notes scattered across the app — on contacts (from the chat/timeline), leads and cases (פניות). This is the same data source as the in-app "Notes Hub". Filter by source, date range, author or free-text search, and fetch the notes of a single record.',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/notes',
        scope: 'notes:read',
        summary: {
          he: 'הצגה/חיפוש הערות מכל המקורות (אנשי קשר, לידים, פניות). ברירת מחדל: 30 הימים האחרונים.',
          en: 'List/search notes across all sources (contacts, leads, cases). Defaults to the last 30 days.',
        },
        params: [
          { name: 'source', in: 'query', type: 'string', required: false, desc: { he: 'סינון לפי מקור: contact | lead | case (השמיטו לכולם).', en: 'Filter by source: contact | lead | case (omit for all).' } },
          { name: 'dateFrom', in: 'query', type: 'string', required: false, desc: { he: 'תאריך התחלה yyyy-MM-dd.', en: 'Start date yyyy-MM-dd.' } },
          { name: 'dateTo', in: 'query', type: 'string', required: false, desc: { he: 'תאריך סיום yyyy-MM-dd (כולל).', en: 'End date yyyy-MM-dd (inclusive).' } },
          { name: 'userId', in: 'query', type: 'string', required: false, desc: { he: 'רק הערות שנכתבו על ידי משתמש זה (uID).', en: 'Only notes written by this user (uID).' } },
          { name: 'search', in: 'query', type: 'string', required: false, desc: { he: 'התאמת טקסט חופשי בתוך גוף ההערה.', en: 'Free-text match inside the note body.' } },
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 30 (מקסימום 200).', en: 'Default 30 (max 200).' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/notes?source=lead&search=budget&pageSize=30" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "pageNumber": 1, "pageSize": 30, "count": 2, "total": 2,
    "items": [
      { "id": "?", "note": "Customer asked for a discount", "entityType": "lead", "entityId": "LEAD_ID", "contactId": "972501234567", "contactName": "Dana", "entityName": "Website lead", "createdOn": "2026-09-14T10:20:00Z", "createdById": "?", "createdByName": "Agent" }
    ]
  }
}`,
      },
      {
        method: 'GET',
        path: '/notes/{entityType}/{entityId}',
        scope: 'notes:read',
        summary: {
          he: 'הערות עבור רשומה בודדת. entityType: contact | lead | case. עבור contact העבירו מספר טלפון כ-entityId.',
          en: 'Notes for a single record. entityType: contact | lead | case. For contact pass a phone number as entityId.',
        },
        params: [
          { name: 'entityType', in: 'path', type: 'string', required: true, desc: { he: 'contact | lead | case.', en: 'contact | lead | case.' } },
          { name: 'entityId', in: 'path', type: 'string', required: true, desc: { he: 'טלפון (עבור contact) או מזהה הליד/הפנייה.', en: 'Phone (for contact) or the lead/case id.' } },
          { name: 'limit', in: 'query', type: 'int', required: false, desc: { he: 'מקסימום הערות (ברירת מחדל 50, מקסימום 500).', en: 'Max notes (default 50, max 500).' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/notes/lead/LEAD_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "entityType": "lead", "entityId": "LEAD_ID", "count": 1, "items": [ { "id": "?", "note": "Follow up next week", "createdOn": "2026-09-14T10:20:00Z", "createdByName": "Agent" } ] } }`,
      },
    ],
  },
  {
    id: 'campaigns',
    title: { he: 'קמפיינים', en: 'Campaigns' },
    description: {
      he: 'קמפיינים לדיוור WhatsApp — יצירת כל סוג (הרצה ידנית או מתוזמן חד-פעמי/חוזר), הצגה, שליפה, עדכון, מחיקה, קריאת תוצאות, הרצה, שליחה אד-הוק ללא שמירה, ובדיקה לנמען בודד. קהל: רשימת טלפונים, Excel/CSV, או סינון CRM. משתני תבנית לכל נמען נשלחים כ-<code>variables: { "var1": ?, "var2": ? }</code> לפי סדר ה-placeholders בתבנית ({{1}}=var1). כך סוכן AI יכול לקחת קובץ Excel, למפות עמודה→משתנה, ולשלוח לכולם (MCP: <code>gambot_send_campaign_from_excel</code>).<br/><strong>ציות מובנה:</strong> כל ארגון מגיע עם תהליך הסרה פעיל — נמען שמשיב <code>הסר</code>/<code>הסרה</code>/<code>stop</code>/<code>unsubscribe</code> מסומן <code>consent=false</code> ומוחרג אוטומטית מדיוורים עתידיים. תגובות היצירה/הרצה/שליחה/בדיקה מחזירות זאת תחת <code>optOut</code> (<code>enabled=true</code> כברירת מחדל). אשרו הסכמה לדיוור באמצעות <code>consentConfirmed</code> (ברירת מחדל true), המוחזר תחת <code>consent</code>.<br/><strong>אימייל תוצאות:</strong> קמפיינים שנוצרים דרך ה-API/MCP שולחים אוטומטית סיכום תוצאות הרצה למחרת (<code>sendResultsSummary=true</code>, <code>sendResultsAfterDays=1</code>) עם ניתוח AI של התגובות (<code>aiAnalysisEnabled=true</code>) — ניתן לעקוף או להשבית כל אחד. עבור קמפיינים <strong>חוזרים</strong>, הרצה שנופלת בשבת/חג ישראלי מדולגת כברירת מחדל (<code>holidayHandling="skip"</code>; גם <code>before</code>/<code>after</code>/<code>send</code>).',
      en: 'WhatsApp broadcast campaigns — create any type (manual run or scheduled one-time/recurring), list, get, update, delete, read results, run, ad-hoc send without saving, and single-recipient test. Audience: phone list, Excel/CSV, or CRM filter. Per-recipient template variables are sent as <code>variables: { "var1": ?, "var2": ? }</code> in template placeholder order ({{1}}=var1). This lets an AI agent take an Excel, map column→variable, and blast everyone (MCP: <code>gambot_send_campaign_from_excel</code>).<br/><strong>Built-in compliance:</strong> every org ships with an ACTIVE opt-out flow — a recipient who replies <code>הסר</code>/<code>הסרה</code>/<code>stop</code>/<code>unsubscribe</code> is marked <code>consent=false</code> and auto-excluded from future broadcasts. Create/run/send/test responses echo this under <code>optOut</code> (<code>enabled=true</code> by default). Assert consent-to-mail via <code>consentConfirmed</code> (defaults to true), echoed back under <code>consent</code>.<br/><strong>Results email:</strong> campaigns created via the API/MCP automatically email a run-results summary the next day (<code>sendResultsSummary=true</code>, <code>sendResultsAfterDays=1</code>) with an AI analysis of the replies (<code>aiAnalysisEnabled=true</code>) — override or disable any. For <strong>recurring</strong> campaigns, a run that lands on Shabbat/an Israeli holiday is skipped by default (<code>holidayHandling="skip"</code>; also <code>before</code>/<code>after</code>/<code>send</code>).',
    },
    endpoints: [
      {
        method: 'GET', path: '/campaigns', scope: 'campaigns:read',
        summary: { he: 'הצגת כל הקמפיינים של הארגון.', en: 'List all campaigns for the organization.' },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/campaigns" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 5, "items": [ { "campaingId": "?", "campaignName": "?", "campaignTrigger": "Manually", "messageType": "Template" } ] } }`,
      },
      {
        method: 'GET', path: '/campaigns/scheduled', scope: 'campaigns:read',
        summary: { he: 'קמפיינים מתוזמנים הממתינים להרצה.', en: 'Scheduled campaigns waiting to run.' },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/campaigns/scheduled" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 2, "items": [ { "campaignId": "?", "runAt": "2026-07-01T06:00:00Z", "status": "waiting" } ] } }`,
      },
      {
        method: 'GET', path: '/campaigns/{campaignId}', scope: 'campaigns:read',
        summary: { he: 'קמפיין בודד לפי מזהה.', en: 'A single campaign by id.' },
        params: [{ name: 'campaignId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הקמפיין.', en: 'Campaign id.' } }],
        request: null,
        curl: `curl "${API_BASE}/campaigns/CAMPAIGN_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "campaingId": "CAMPAIGN_ID", "campaignName": "?", "messageType": "Template", "wabaTemplateId": "?" } }`,
      },
      {
        method: 'GET', path: '/campaigns/{campaignId}/results', scope: 'campaigns:read',
        summary: { he: 'תוצאות/דוח הרצה (נשלחו/נמסרו/נקראו/תגובות/הקלקות).', en: 'Run results/report (sent/delivered/read/replies/clicks).' },
        params: [{ name: 'campaignId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הקמפיין.', en: 'Campaign id.' } }],
        request: null,
        curl: `curl "${API_BASE}/campaigns/CAMPAIGN_ID/results" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 1, "results": [ { "CampaignResultsId": "?", "Status": "Sent All", "CampaignResultSummary": { "TotalContactsNumber": "120", "NumberOfSentMessage": "120", "NumberOfReadMessage": "88" } } ] } }`,
      },
      {
        method: 'POST', path: '/campaigns', scope: 'campaigns:write',
        summary: {
          he: 'יצירת קמפיין — ידני או מתוזמן (חד-פעמי/חוזר). קהל: Excel, סינון CRM או רשימה. ראו דוגמאות מלאות למטה.',
          en: 'Create a campaign — manual or scheduled (one-time/recurring). Audience: Excel, CRM filter or a list. See full examples below.',
        },
        params: [
          { name: 'campaignName', in: 'body', type: 'string', required: true, desc: { he: 'שם הקמפיין.', en: 'Campaign name.' } },
          { name: 'messageType', in: 'body', type: 'string', required: true, desc: { he: 'Template (תבנית) או regular (טקסט חופשי).', en: 'Template or regular (free text).' } },
          { name: 'wabaTemplateId', in: 'body', type: 'string', required: false, desc: { he: 'מזהה תבנית (חובה כאשר messageType=Template).', en: 'Template id (required when messageType=Template).' } },
          { name: 'message', in: 'body', type: 'string', required: false, desc: { he: 'טקסט ההודעה (כאשר regular).', en: 'Message text (when regular).' } },
          { name: 'campaignTrigger', in: 'body', type: 'string', required: false, desc: { he: 'Manually (ברירת מחדל) או Scheduled.', en: 'Manually (default) or Scheduled.' } },
          { name: 'scheduleType', in: 'body', type: 'string', required: false, desc: { he: 'once (חד-פעמי) או repeated (חוזר).', en: 'once or repeated.' } },
          { name: 'runAt', in: 'body', type: 'string', required: false, desc: { he: 'תאריך ושעת הרצה, למשל 2026-07-01T09:00:00.', en: 'Run datetime, e.g. 2026-07-01T09:00:00.' } },
          { name: 'timezone', in: 'body', type: 'string', required: false, desc: { he: 'אזור זמן IANA, למשל Asia/Jerusalem.', en: 'IANA timezone, e.g. Asia/Jerusalem.' } },
          { name: 'interval', in: 'body', type: 'string', required: false, desc: { he: 'Second/Minute/Hour/Day/Week/Month/Year (חוזר).', en: 'Second/Minute/Hour/Day/Week/Month/Year (recurring).' } },
          { name: 'intervalNumber', in: 'body', type: 'int', required: false, desc: { he: 'כל N מרווחים.', en: 'Every N intervals.' } },
          { name: 'endCondition', in: 'body', type: 'object', required: false, desc: { he: '{ type: none|until|count, value }.', en: '{ type: none|until|count, value }.' } },
          { name: 'recipientSource', in: 'body', type: 'string', required: false, desc: { he: 'למשל "Excel".', en: 'e.g. "Excel".' } },
          { name: 'ExcelData', in: 'body', type: 'object', required: false, desc: { he: '{ recipients: [{ phone, variables, rowData }] }.', en: '{ recipients: [{ phone, variables, rowData }] }.' } },
          { name: 'ContactFilters', in: 'body', type: 'object', required: false, desc: { he: 'פלח CRM: { filters:[…], logic:"AND|OR" }.', en: 'CRM segment: { filters:[…], logic:"AND|OR" }.' } },
          { name: 'templateVariableQuery', in: 'body', type: 'object[]', required: false, desc: { he: 'ממפה משתני תבנית לעמודות/שדות.', en: 'Maps template variables to columns/fields.' } },
          { name: 'fromNumberId', in: 'body', type: 'string', required: false, desc: { he: 'שולח לארגונים מרובי-מספרים — phoneNumberId או מספר תצוגה (ראו GET /numbers). ברירת מחדל: המספר הראשי.', en: 'Sender for multi-number orgs — a phoneNumberId or display number (see GET /numbers). Defaults to the primary number.' } },
          { name: 'sendResultsSummary', in: 'body', type: 'bool', required: false, desc: { he: 'שליחת סיכום תוצאות הרצה במייל אחרי כל הרצה. ברירת מחדל דרך ה-API/MCP: true. שלחו false להשבתה.', en: 'Email a run-results summary after each run. Default via API/MCP: true. Send false to disable.' } },
          { name: 'sendResultsAfterDays', in: 'body', type: 'int', required: false, desc: { he: 'כמה ימים אחרי ההרצה לשלוח את הסיכום במייל. ברירת מחדל: 1 (למחרת). טווח 1–60.', en: 'How many days after the run to email the summary. Default: 1 (next day). Range 1–60.' } },
          { name: 'resultsEmailTo', in: 'body', type: 'string', required: false, desc: { he: 'נמען הסיכום. ברירת מחדל: אימייל הארגון.', en: 'Summary recipient. Defaults to the org email.' } },
          { name: 'aiAnalysisEnabled', in: 'body', type: 'bool', required: false, desc: { he: 'ניתוח AI של התגובות (מענים, אוטומטי מול מתעניין, ROI) בתוך הסיכום. ברירת מחדל: true.', en: 'AI analysis of replies (responses, automatic vs. interested, ROI) inside the summary. Default: true.' } },
          { name: 'holidayHandling', in: 'body', type: 'string', required: false, desc: { he: 'לקמפיינים חוזרים — כאשר הרצה נופלת בשבת/חג ישראלי: skip (ברירת מחדל דרך ה-API/MCP) | before | after | send.', en: 'For recurring campaigns — when a run lands on Shabbat/Israeli holiday: skip (API/MCP default) | before | after | send.' } },
        ],
        request: `{
  "campaignName": "promo_summer_0626",
  "campaignTrigger": "Manually",
  "messageType": "Template",
  "wabaTemplateId": "promo_summer_sale_0626",
  "recipientSource": "Excel",
  "ExcelData": {
    "recipients": [
      { "phone": "972501234567", "variables": { "var1": "דנה" } },
      { "phone": "972507654321", "variables": { "var1": "יוסי" } }
    ]
  }
}`,
        curl: curl('POST', '/campaigns', `{ "campaignName": "promo_0626", "messageType": "Template", "wabaTemplateId": "promo_summer_sale_0626", "recipientSource": "Excel", "ExcelData": { "recipients": [ { "phone": "972501234567", "variables": { "var1": "דנה" } } ] } }`),
        response: `{ "success": true, "message": "Create Campaign successfully", "data": { "campaignId": "?" } }`,
        examples: [
          {
            label: { he: '1) ידני + קהל מסינון CRM', en: '1) Manual + audience from a CRM filter' },
            code: curl('POST', '/campaigns', `{
  "campaignName": "vip_reactivation_0626",
  "campaignTrigger": "Manually",
  "messageType": "Template",
  "wabaTemplateId": "welcome_new_customer_0626",
  "ContactFilters": {
    "logic": "AND",
    "filters": [
      { "filterType": "group", "operator": "equals", "value": "VIP" }
    ]
  }
}`),
          },
          {
            label: { he: '2) מתוזמן חד-פעמי (once)', en: '2) Scheduled one-time (once)' },
            code: curl('POST', '/campaigns', `{
  "campaignName": "holiday_greeting_0626",
  "campaignTrigger": "Scheduled",
  "scheduleType": "once",
  "runAt": "2026-09-20T09:00:00",
  "timezone": "Asia/Jerusalem",
  "messageType": "Template",
  "wabaTemplateId": "appointment_reminder_0626",
  "recipientSource": "Excel",
  "ExcelData": { "recipients": [ { "phone": "972501234567" } ] }
}`),
          },
          {
            label: { he: '3) מתוזמן חוזר (repeated) — שבועי עד תאריך', en: '3) Scheduled recurring (repeated) — weekly until a date' },
            code: curl('POST', '/campaigns', `{
  "campaignName": "weekly_newsletter_0626",
  "campaignTrigger": "Scheduled",
  "scheduleType": "repeated",
  "interval": "Week",
  "intervalNumber": 1,
  "runAt": "2026-07-06T08:00:00",
  "timezone": "Asia/Jerusalem",
  "endCondition": { "type": "until", "value": "2026-12-31T00:00:00" },
  "messageType": "regular",
  "message": "עדכון שבועי מאיתנו",
  "recipientSource": "Excel",
  "ExcelData": { "recipients": [ { "phone": "972501234567" } ] }
}`),
          },
          {
            label: { he: '4) חוזר לפי מספר הרצות (count)', en: '4) Recurring by number of runs (count)' },
            code: curl('POST', '/campaigns', `{
  "campaignName": "daily_tip_0626",
  "campaignTrigger": "Scheduled",
  "scheduleType": "repeated",
  "interval": "Day",
  "intervalNumber": 1,
  "runAt": "2026-07-01T07:00:00",
  "timezone": "Asia/Jerusalem",
  "endCondition": { "type": "count", "value": "7" },
  "messageType": "regular",
  "message": "הטיפ היומי שלכם",
  "ContactFilters": { "logic": "AND", "filters": [ { "filterType": "group", "operator": "equals", "value": "Leads" } ] }
}`),
          },
        ],
      },
      {
        method: 'PATCH', path: '/campaigns/{campaignId}', scope: 'campaigns:write',
        summary: { he: 'עדכון קמפיין (שלחו את אובייקט הקמפיין המלא). מקבל גם POST.', en: 'Update a campaign (send the full campaign object). POST also accepted.' },
        params: [{ name: 'campaignId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הקמפיין.', en: 'Campaign id.' } }],
        request: `{ "campaignName": "promo_summer_0626_v2", "messageType": "Template", "wabaTemplateId": "promo_summer_sale_0626" }`,
        curl: curl('PATCH', '/campaigns/CAMPAIGN_ID', `{ "campaignName": "promo_summer_0626_v2" }`),
        response: `{ "success": true, "message": "Update Campaign successfully" }`,
      },
      {
        method: 'DELETE', path: '/campaigns/{campaignId}', scope: 'campaigns:write',
        summary: { he: 'מחיקת קמפיין.', en: 'Delete a campaign.' },
        params: [{ name: 'campaignId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הקמפיין.', en: 'Campaign id.' } }],
        request: null,
        curl: `curl -X DELETE "${API_BASE}/campaigns/CAMPAIGN_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "message": "Campaign deleted" }`,
      },
      {
        method: 'POST', path: '/campaigns/{campaignId}/run', scope: 'campaigns:run',
        summary: { he: 'הרצת קמפיין קיים (שמור) עכשיו — מזהה את הנמענים ומבצע.', en: 'Run an existing (saved) campaign now — resolves recipients and executes.' },
        params: [{ name: 'campaignId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הקמפיין.', en: 'Campaign id.' } }],
        request: null,
        curl: curl('POST', '/campaigns/CAMPAIGN_ID/run', null),
        response: `{
  "success": true,
  "message": "Campaign run started.",
  "data": { "campaignResultsId": "?", "campaignId": "?", "status": "In Process", "summary": { "TotalContactsNumber": "120" } }
}`,
      },
      {
        method: 'POST', path: '/campaigns/send', scope: 'campaigns:run',
        summary: {
          he: 'הרצת קמפיין אד-הוק ללא שמירה. ספקו קהל (רשימת טלפונים / excel / סינון) והודעה (תבנית או טקסט).',
          en: 'Run an ad-hoc campaign without saving. Provide an audience (phone list / excel / filter) and a message (template or text).',
        },
        params: [
          { name: 'messageType', in: 'body', type: 'string', required: true, desc: { he: 'Template או regular.', en: 'Template or regular.' } },
          { name: 'templateId', in: 'body', type: 'string', required: false, desc: { he: 'מזהה תבנית (כאשר Template).', en: 'Template id (when Template).' } },
          { name: 'message', in: 'body', type: 'string', required: false, desc: { he: 'טקסט (כאשר regular).', en: 'Text (when regular).' } },
          { name: 'recipientPhoneNumbers', in: 'body', type: 'string[]', required: false, desc: { he: 'רשימת טלפונים מפורשת.', en: 'Explicit phone list.' } },
          { name: 'excelRecipients', in: 'body', type: 'object[]', required: false, desc: { he: '[{ phone, variables, rowData }].', en: '[{ phone, variables, rowData }].' } },
          { name: 'keys', in: 'body', type: 'string[]', required: false, desc: { he: 'קהל לפי תגיות/רשימות: שליחה לכל איש קשר המתויג באחת מאלה (למשל ["לקוחות חדשים"]). הדרך הפשוטה ל"שליחה לתגית X". מקבל גם tags.', en: 'Audience by tags/lists: send to every contact tagged with ANY of these (e.g. ["לקוחות חדשים"]). The simple way to do "send to tag X". "tags" also accepted.' } },
          { name: 'filters', in: 'body', type: 'object', required: false, desc: { he: 'פלח CRM מתקדם — מתורגם למספרי טלפון. { logic, filters:[...] }. פריט תגית: { filterType:"group", operator:"equals", groupValue:["VIP"] }.', en: 'Advanced CRM segment — resolved to phone numbers. { logic, filters:[...] }. Tag item: { filterType:"group", operator:"equals", groupValue:["VIP"] }.' } },
          { name: 'consentConfirmed', in: 'body', type: 'bool', required: false, desc: { he: 'אישור הסכמה לדיוור לקהל זה. ברירת מחדל true. נמענים תמיד יכולים להסיר עצמם (ראו optOut בתגובה).', en: 'Assert consent to mail this audience. Defaults to true. Recipients can always opt out (see optOut in the response).' } },
          { name: 'dryRun', in: 'body', type: 'bool', required: false, desc: { he: 'תצוגה מקדימה בלבד — לא שולח. מחזיר את גודל הקהל, ולדיוור regular כמה נמענים עם חלון 24 שעות סגור (לא יקבלו אותו) בתוספת המלצה.', en: 'Preview only — does not send. Returns the audience size, and for a regular broadcast how many recipients have a CLOSED 24h window (won\'t receive it) plus a recommendation.' } },
          { name: 'confirmRegular', in: 'body', type: 'bool', required: false, desc: { he: 'נדרש כדי לשלוח בפועל דיוור "regular" (טקסט חופשי) דרך ה-MCP. בלעדיו השליחה נחסמת ומחזירה regular_window_confirmation_required עם מספר החלונות הסגורים — הציגו זאת למשתמש והמליצו על תבנית, ואז שלחו שוב עם confirmRegular=true. מתעלמים ממנו כאשר messageType=Template.', en: 'Required to actually SEND a "regular" free-text broadcast via MCP. Without it the send is blocked and returns regular_window_confirmation_required with the closed-window count — surface it to the user and recommend a template, then re-send with confirmRegular=true. Ignored for messageType=Template.' } },
          { name: 'fromNumberId', in: 'body', type: 'string', required: false, desc: { he: 'שולח — phoneNumberId או מספר תצוגה (ראו GET /numbers). ברירת מחדל: המספר הראשי.', en: 'Sender — a phoneNumberId or display number (see GET /numbers). Defaults to the primary number.' } },
        ],
        request: `{
  "messageType": "Template",
  "templateId": "promo_summer_sale_0626",
  "consentConfirmed": true,
  "excelRecipients": [
    { "phone": "972501234567", "variables": { "var1": "דנה" } },
    { "phone": "972507654321", "variables": { "var1": "יוסי" } }
  ]
}`,
        curl: curl('POST', '/campaigns/send', `{ "messageType": "Template", "templateId": "promo_summer_sale_0626", "recipientPhoneNumbers": ["972501234567","972507654321"] }`),
        response: `{
  "success": true,
  "message": "Campaign send started.",
  "data": {
    "result": { "campaignResultsId": "?", "status": "In Process" },
    "consent": { "confirmed": true, "source": "api" },
    "optOut": {
      "enabled": true,
      "keywords": ["הסר", "הסרה", "stop", "unsubscribe"],
      "confirmationMessage": "הוסרת בהצלחה מרשימת התפוצה\\nלא תקבל/י עוד הודעות שיווקיות",
      "howItWorks": "Any recipient who replies with an opt-out keyword is marked consent=false and is automatically excluded from all future broadcasts."
    }
  }
}`,
        examples: [
          {
            label: { he: 'שליחה לתגית (הדרך הפשוטה)', en: 'Send to a tag (the simple way)' },
            code: curl('POST', '/campaigns/send', `{
  "messageType": "Template",
  "templateId": "promo_summer_sale_0626",
  "keys": ["לקוחות חדשים"]
}`),
          },
          {
            label: { he: 'אד-הוק לפי סינון CRM', en: 'Ad-hoc by CRM filter' },
            code: curl('POST', '/campaigns/send', `{
  "messageType": "regular",
  "message": "מבצע חדש רק עבורכם!",
  "filters": { "logic": "OR", "filters": [ { "filterType": "group", "operator": "equals", "groupValue": ["VIP"] } ] }
}`),
          },
        ],
      },
      {
        method: 'POST', path: '/campaigns/test', scope: 'campaigns:run',
        summary: {
          he: 'בדיקת קמפיין — שליחה לנמען בודד (תבנית או טקסט). מצוין לפני דיוור מלא.',
          en: 'Test a campaign — send to a single recipient (template or text). Great before a full broadcast.',
        },
        params: [
          { name: 'to', in: 'body', type: 'string', required: true, desc: { he: 'טלפון נמען הבדיקה.', en: 'Test recipient phone.' } },
          { name: 'messageType', in: 'body', type: 'string', required: false, desc: { he: 'ברירת מחדל Template אם templateId מוגדר.', en: 'Defaults to Template if templateId is set.' } },
          { name: 'templateId', in: 'body', type: 'string', required: false, desc: { he: 'מזהה תבנית.', en: 'Template id.' } },
          { name: 'message', in: 'body', type: 'string', required: false, desc: { he: 'טקסט (כאשר regular).', en: 'Text (when regular).' } },
          { name: 'variables', in: 'body', type: 'object', required: false, desc: { he: 'משתני תבנית, למשל { "var1": "דנה" }.', en: 'Template variables, e.g. { "var1": "Dana" }.' } },
          { name: 'fromNumberId', in: 'body', type: 'string', required: false, desc: { he: 'שולח — phoneNumberId או מספר תצוגה (ראו GET /numbers). ברירת מחדל: המספר הראשי.', en: 'Sender — a phoneNumberId or display number (see GET /numbers). Defaults to the primary number.' } },
        ],
        request: `{
  "to": "972501234567",
  "messageType": "Template",
  "templateId": "promo_summer_sale_0626",
  "variables": { "var1": "דנה" }
}`,
        curl: curl('POST', '/campaigns/test', `{ "to": "972501234567", "templateId": "promo_summer_sale_0626", "variables": { "var1": "דנה" } }`),
        response: `{ "success": true, "message": "Test send started.", "data": { "campaignResultsId": "?", "status": "In Process" } }`,
      },
    ],
  },
  {
    id: 'quotes',
    title: { he: 'הצעות מחיר', en: 'Quotes' },
    description: { he: 'יצירה, הצגה, שליפה ועדכון של הצעות מחיר.', en: 'Create, list, fetch and update price quotes.' },
    endpoints: [
      {
        method: 'GET', path: '/quotes', scope: 'quotes:read',
        summary: { he: 'הצגת הצעות מחיר (עם עימוד וסינון סטטוס).', en: 'List quotes (paginated + status filter).' },
        params: [
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 50.', en: 'Default 50.' } },
          { name: 'search', in: 'query', type: 'string', required: false, desc: { he: 'חיפוש.', en: 'Search.' } },
          { name: 'status', in: 'query', type: 'string', required: false, desc: { he: 'draft/sent/accepted…', en: 'draft/sent/accepted…' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/quotes?pageSize=50" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "total": 8, "items": [ { "id": "?", "quoteNumber": "Q-001", "total": 1500 } ] } }`,
      },
      {
        method: 'GET', path: '/quotes/{quoteId}', scope: 'quotes:read',
        summary: { he: 'שליפת הצעת מחיר בודדת.', en: 'Fetch a single quote.' },
        params: [{ name: 'quoteId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הצעת המחיר.', en: 'Quote id.' } }],
        request: null,
        curl: `curl "${API_BASE}/quotes/QUOTE_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "QUOTE_ID", "items": [ ? ], "total": 1500 } }`,
      },
      {
        method: 'POST', path: '/quotes', scope: 'quotes:write',
        summary: { he: 'יצירת הצעת מחיר. הגוף = שדות ההצעה (או תחת quoteData).', en: 'Create a quote. Body = quote fields (or under quoteData).' },
        params: [
          { name: 'title', in: 'body', type: 'string', required: false, desc: { he: 'כותרת.', en: 'Title.' } },
          { name: 'contactPhone', in: 'body', type: 'string', required: false, desc: { he: 'טלפון הלקוח.', en: 'Customer phone.' } },
          { name: 'items', in: 'body', type: 'object[]', required: false, desc: { he: 'שורות פריטים.', en: 'Line items.' } },
          { name: 'total', in: 'body', type: 'number', required: false, desc: { he: 'סה"כ.', en: 'Total.' } },
          { name: 'currency', in: 'body', type: 'string', required: false, desc: { he: 'מטבע.', en: 'Currency.' } },
        ],
        request: `{
  "title": "הצעת מחיר לייעוץ",
  "contactPhone": "972501234567",
  "currency": "ILS",
  "items": [ { "name": "ייעוץ", "quantity": 2, "price": 750 } ],
  "total": 1500
}`,
        curl: curl('POST', '/quotes', `{ "title": "Consulting", "total": 1500 }`),
        response: `{ "success": true, "message": "Quote created", "data": { "id": "?" } }`,
      },
      {
        method: 'PATCH', path: '/quotes/{quoteId}', scope: 'quotes:write',
        summary: { he: 'עדכון שדות הצעת מחיר (חלקי). מקבל גם POST.', en: 'Update quote fields (partial). POST also accepted.' },
        params: [
          { name: 'quoteId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הצעת המחיר.', en: 'Quote id.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'סטטוס.', en: 'Status.' } },
        ],
        request: `{ "status": "sent" }`,
        curl: curl('PATCH', '/quotes/QUOTE_ID', `{ "status": "sent" }`),
        response: `{ "success": true, "message": "Quote updated" }`,
      },
    ],
  },
  {
    id: 'invoices',
    title: { he: 'חשבוניות', en: 'Invoices' },
    description: { he: 'יצירה, הצגה, שליפה, עדכון והפקה (issue) של חשבוניות.', en: 'Create, list, fetch, update and issue invoices.' },
    endpoints: [
      {
        method: 'GET', path: '/invoices', scope: 'invoices:read',
        summary: { he: 'הצגת חשבוניות (עם עימוד וסינון סטטוס/סוג).', en: 'List invoices (paginated + status/type filters).' },
        params: [
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 50.', en: 'Default 50.' } },
          { name: 'status', in: 'query', type: 'string', required: false, desc: { he: 'draft/issued…', en: 'draft/issued…' } },
          { name: 'type', in: 'query', type: 'string', required: false, desc: { he: 'tax_invoice/receipt…', en: 'tax_invoice/receipt…' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/invoices?pageSize=50" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "total": 20, "items": [ { "id": "?", "documentNumber": "?", "total": 1755 } ] } }`,
      },
      {
        method: 'GET', path: '/invoices/{invoiceId}', scope: 'invoices:read',
        summary: { he: 'שליפת חשבונית בודדת.', en: 'Fetch a single invoice.' },
        params: [{ name: 'invoiceId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה החשבונית.', en: 'Invoice id.' } }],
        request: null,
        curl: `curl "${API_BASE}/invoices/INVOICE_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "INVOICE_ID", "status": "draft", "total": 1755 } }`,
      },
      {
        method: 'POST', path: '/invoices', scope: 'invoices:write',
        summary: { he: 'יצירת טיוטת חשבונית. הגוף = שדות החשבונית (או תחת invoiceData).', en: 'Create an invoice draft. Body = invoice fields (or under invoiceData).' },
        params: [
          { name: 'type', in: 'body', type: 'string', required: false, desc: { he: 'tax_invoice / receipt / combined…', en: 'tax_invoice / receipt / combined…' } },
          { name: 'contactPhone', in: 'body', type: 'string', required: false, desc: { he: 'טלפון הלקוח.', en: 'Customer phone.' } },
          { name: 'items', in: 'body', type: 'object[]', required: false, desc: { he: 'שורות פריטים.', en: 'Line items.' } },
          { name: 'total', in: 'body', type: 'number', required: false, desc: { he: 'סה"כ.', en: 'Total.' } },
        ],
        request: `{
  "type": "tax_invoice",
  "contactPhone": "972501234567",
  "items": [ { "name": "שירות", "quantity": 1, "price": 1500 } ],
  "vatRate": 17,
  "total": 1755
}`,
        curl: curl('POST', '/invoices', `{ "type": "tax_invoice", "total": 1755 }`),
        response: `{ "success": true, "message": "Invoice created", "data": { "id": "?" } }`,
      },
      {
        method: 'PATCH', path: '/invoices/{invoiceId}', scope: 'invoices:write',
        summary: { he: 'עדכון חשבונית (חסום לאחר הפקה/נעילה). מקבל גם POST.', en: 'Update an invoice (blocked once issued/locked). POST also accepted.' },
        params: [{ name: 'invoiceId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה החשבונית.', en: 'Invoice id.' } }],
        request: `{ "notes": "תודה!" }`,
        curl: curl('PATCH', '/invoices/INVOICE_ID', `{ "notes": "Thanks!" }`),
        response: `{ "success": true, "message": "Invoice updated" }`,
      },
      {
        method: 'POST', path: '/invoices/{invoiceId}/issue', scope: 'invoices:write',
        summary: { he: 'הפקת חשבונית — נועלת אותה ומקצה את מספר המסמך הרשמי.', en: 'Issue an invoice — locks it and assigns the official document number.' },
        params: [{ name: 'invoiceId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה החשבונית.', en: 'Invoice id.' } }],
        request: null,
        curl: curl('POST', '/invoices/INVOICE_ID/issue', null),
        response: `{ "success": true, "message": "Invoice issued", "data": { "documentNumber": "2026-0001" } }`,
      },
    ],
  },
  {
    id: 'orders',
    title: { he: 'הזמנות', en: 'Orders' },
    description: { he: 'יצירה, הצגה, שליפה ועדכון של הזמנות חנות.', en: 'Create, list, fetch and update store orders.' },
    endpoints: [
      {
        method: 'GET', path: '/orders', scope: 'orders:read',
        summary: { he: 'הצגת הזמנות (סינון לפי סטטוס/חנות/טווח תאריכים).', en: 'List orders (filter by status/store/date range).' },
        params: [
          { name: 'status', in: 'query', type: 'string', required: false, desc: { he: 'סטטוס.', en: 'Status.' } },
          { name: 'storeId', in: 'query', type: 'string', required: false, desc: { he: 'מזהה החנות.', en: 'Store id.' } },
          { name: 'dateFrom', in: 'query', type: 'string', required: false, desc: { he: 'מתאריך.', en: 'From date.' } },
          { name: 'dateTo', in: 'query', type: 'string', required: false, desc: { he: 'עד תאריך.', en: 'To date.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/orders?status=new" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 4, "items": [ { "id": "?", "orderNumber": "1001", "total": 299 } ] } }`,
      },
      {
        method: 'GET', path: '/orders/{orderId}', scope: 'orders:read',
        summary: { he: 'שליפת הזמנה בודדת.', en: 'Fetch a single order.' },
        params: [{ name: 'orderId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה ההזמנה.', en: 'Order id.' } }],
        request: null,
        curl: `curl "${API_BASE}/orders/ORDER_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "ORDER_ID", "status": "new", "items": [ ? ] } }`,
      },
      {
        method: 'POST', path: '/orders', scope: 'orders:write',
        summary: { he: 'יצירת הזמנה. הגוף = שדות ההזמנה.', en: 'Create an order. Body = order fields.' },
        params: [
          { name: 'customerName', in: 'body', type: 'string', required: false, desc: { he: 'שם הלקוח.', en: 'Customer name.' } },
          { name: 'customerPhone', in: 'body', type: 'string', required: false, desc: { he: 'טלפון הלקוח.', en: 'Customer phone.' } },
          { name: 'items', in: 'body', type: 'object[]', required: false, desc: { he: 'פריטים.', en: 'Items.' } },
          { name: 'total', in: 'body', type: 'number', required: false, desc: { he: 'סה"כ.', en: 'Total.' } },
        ],
        request: `{
  "customerName": "דנה",
  "customerPhone": "972501234567",
  "items": [ { "name": "חולצה", "quantity": 2, "price": 99 } ],
  "total": 198,
  "status": "new"
}`,
        curl: curl('POST', '/orders', `{ "customerPhone": "972501234567", "total": 198 }`),
        response: `{ "success": true, "message": "Order created", "data": { "orderId": "?" } }`,
      },
      {
        method: 'PATCH', path: '/orders/{orderId}', scope: 'orders:write',
        summary: { he: 'עדכון הזמנה (merge). מקבל גם POST.', en: 'Update an order (merge). POST also accepted.' },
        params: [{ name: 'orderId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה ההזמנה.', en: 'Order id.' } }],
        request: `{ "status": "shipped", "trackingNumber": "IL123" }`,
        curl: curl('PATCH', '/orders/ORDER_ID', `{ "status": "shipped" }`),
        response: `{ "success": true, "message": "Order updated" }`,
      },
    ],
  },
  {
    id: 'signatures',
    title: { he: 'חתימה אלקטרונית', en: 'E-Signature' },
    description: { he: 'קריאה בלבד — מסמכי חתימה, תוצאות החתימה שלהם, ושליפת קישור/י החתימה להפצה. יצירה מתבצעת בממשק Gambot.', en: 'Read-only — signature documents, their signing results, and fetching the signing link(s) to distribute. Creation is done in the Gambot UI.' },
    endpoints: [
      {
        method: 'GET', path: '/signatures', scope: 'signatures:read',
        summary: { he: 'הצגת מסמכי חתימה (החדשים ראשונים).', en: 'List signature documents (newest first).' },
        params: [{ name: 'limit', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 100.', en: 'Default 100.' } }],
        request: null,
        curl: `curl "${API_BASE}/signatures?limit=100" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 12, "items": [ { "id": "?", "documentName": "?", "status": "?" } ] } }`,
      },
      {
        method: 'GET', path: '/signatures/{documentId}', scope: 'signatures:read',
        summary: { he: 'מסמך חתימה בודד כולל תוצאות החתימה (Signatures).', en: 'A single signature document incl. signing results (Signatures).' },
        params: [{ name: 'documentId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה המסמך.', en: 'Document id.' } }],
        request: null,
        curl: `curl "${API_BASE}/signatures/DOC_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "DOC_ID", "Signatures": [ { "signerName": "?", "signedAt": "?" } ] } }`,
      },
      {
        method: 'GET', path: '/signatures/{documentId}/link', scope: 'signatures:read',
        summary: { he: 'קישור/י החתימה להפצה לחותמים (קישור אחד לכל חותם).', en: 'The signing link(s) to distribute to signers (one link per signer).' },
        params: [{ name: 'documentId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה מסמך החתימה.', en: 'Signature document id.' } }],
        request: null,
        curl: `curl "${API_BASE}/signatures/DOC_ID/link" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "documentId": "DOC_ID", "fillOnly": false, "url": "https://gambot.co.il/ORG/esignature/DOC_ID/sign/TOKEN?lang=he", "signers": [ { "name": "דנה", "role": "signer1", "url": "https://gambot.co.il/ORG/esignature/DOC_ID/sign/TOKEN?lang=he" } ] } }`,
        notes: { he: 'קישורי החתימה קיימים לאחר שבקשת החתימה נשלחה. אם למסמך אין עדיין טוקן — מוחזרת שגיאת no_link.', en: 'Signing links exist once the signature request has been sent. If the document has no token yet, a no_link error is returned.' },
      },
    ],
  },
  {
    id: 'forms',
    title: { he: 'טפסים', en: 'Web Forms' },
    description: { he: 'הגדרות טפסים, הגשות (תוצאות) והקישור הציבורי להפצה. יצירת טפסים מתבצעת בממשק Gambot.', en: 'Form definitions, submissions (results) and the public link to distribute. Form creation is done in the Gambot UI.' },
    endpoints: [
      {
        method: 'GET', path: '/forms', scope: 'forms:read',
        summary: { he: 'הצגת טפסי ווב.', en: 'List web forms.' },
        params: [{ name: 'limit', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 200.', en: 'Default 200.' } }],
        request: null,
        curl: `curl "${API_BASE}/forms" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 3, "items": [ { "id": "?", "title": "טופס יצירת קשר" } ] } }`,
      },
      {
        method: 'GET', path: '/forms/{formId}', scope: 'forms:read',
        summary: { he: 'הגדרת טופס בודד.', en: 'A single form definition.' },
        params: [{ name: 'formId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הטופס.', en: 'Form id.' } }],
        request: null,
        curl: `curl "${API_BASE}/forms/FORM_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "FORM_ID", "title": "?", "fields": [ ? ] } }`,
      },
      {
        method: 'GET', path: '/forms/{formId}/link', scope: 'forms:read',
        summary: { he: 'הקישור הציבורי הקבוע של הטופס — להפצה ללקוחות (WhatsApp/אימייל/SMS/QR).', en: 'The stable public link for the form — to distribute to customers (WhatsApp/email/SMS/QR).' },
        params: [{ name: 'formId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הטופס.', en: 'Form id.' } }],
        request: null,
        curl: `curl "${API_BASE}/forms/FORM_ID/link" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "formId": "FORM_ID", "slug": "יצירת-קשר", "url": "https://gambot.co.il/forms/ORG/יצירת-קשר" } }`,
        notes: { he: 'קישור קבוע לשימוש חוזר — כל הגשה נכנסת להגשות של הטופס.', en: 'A stable, reusable link — every submission lands in the form\'s submissions.' },
      },
      {
        method: 'GET', path: '/forms/{formId}/submissions', scope: 'forms:read',
        summary: { he: 'הגשות (תוצאות) של טופס.', en: 'Submissions (results) for a form.' },
        params: [
          { name: 'formId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הטופס.', en: 'Form id.' } },
          { name: 'limit', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 500.', en: 'Default 500.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/forms/FORM_ID/submissions" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 40, "items": [ { "id": "?", "data": { ? } } ] } }`,
      },
    ],
  },
  {
    id: 'documents',
    title: { he: 'תבניות מסמכים', en: 'Document Templates' },
    description: { he: 'תבניות מסמכים, הגשות מילוי (תוצאות), ויצירת קישור מילוי להפצה ללקוח.', en: 'Document templates, fill submissions (results), and generating a distributable fill link for a customer.' },
    endpoints: [
      {
        method: 'GET', path: '/documents', scope: 'documents:read',
        summary: { he: 'הצגת תבניות מסמכים.', en: 'List document templates.' },
        params: [{ name: 'limit', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 200.', en: 'Default 200.' } }],
        request: null,
        curl: `curl "${API_BASE}/documents" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 5, "items": [ { "id": "?", "name": "חוזה" } ] } }`,
      },
      {
        method: 'GET', path: '/documents/{templateId}', scope: 'documents:read',
        summary: { he: 'תבנית מסמך בודדת.', en: 'A single document template.' },
        params: [{ name: 'templateId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה התבנית.', en: 'Template id.' } }],
        request: null,
        curl: `curl "${API_BASE}/documents/TEMPLATE_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "TEMPLATE_ID", "name": "?" } }`,
      },
      {
        method: 'GET', path: '/documents/{templateId}/submissions', scope: 'documents:read',
        summary: { he: 'הגשות מילוי שנוצרו מהתבנית (fill-only).', en: 'Fill submissions generated from the template (fill-only).' },
        params: [
          { name: 'templateId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה התבנית.', en: 'Template id.' } },
          { name: 'limit', in: 'query', type: 'int', required: false, desc: { he: 'ברירת מחדל 500.', en: 'Default 500.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/documents/TEMPLATE_ID/submissions" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 7, "items": [ { "id": "?", "Signatures": [ ? ] } ] } }`,
      },
      {
        method: 'POST', path: '/documents/{templateId}/link', scope: 'documents:read',
        summary: { he: 'יצירת קישור מילוי להפצה ללקוח מתבנית מסמך.', en: 'Generate a distributable fill link for a customer from a document template.' },
        params: [
          { name: 'templateId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה התבנית.', en: 'Template id.' } },
          { name: 'contactPhone', in: 'body', type: 'string', required: false, desc: { he: 'טלפון איש הקשר — למילוי מראש של משתני התבנית.', en: 'Contact phone — to pre-fill template variables.' } },
          { name: 'leadId', in: 'body', type: 'string', required: false, desc: { he: 'מזהה ליד — למילוי מראש של המשתנים.', en: 'Lead id — to pre-fill variables.' } },
          { name: 'documentName', in: 'body', type: 'string', required: false, desc: { he: 'שם למסמך שנוצר (ברירת מחדל: שם התבנית).', en: 'Name for the created document (default: template name).' } },
          { name: 'language', in: 'body', type: 'string', required: false, desc: { he: 'שפה (he/en/…). ברירת מחדל he.', en: 'Language (he/en/…). Default he.' } },
          { name: 'expiresInDays', in: 'body', type: 'int', required: false, desc: { he: 'תוקף הקישור בימים (ברירת מחדל 30).', en: 'Link validity in days (default 30).' } },
          { name: 'variables', in: 'body', type: 'object', required: false, desc: { he: 'ערכים ידניים למשתני התבנית: { "key": "value" }.', en: 'Manual values for template variables: { "key": "value" }.' } },
        ],
        request: `{
  "contactPhone": "+972501234567",
  "documentName": "חוזה שירות - דנה כהן",
  "language": "he",
  "variables": { "amount": "1,200 ₪", "startDate": "01/07/2026" }
}`,
        curl: curl('POST', '/documents/TEMPLATE_ID/link', { contactPhone: '+972501234567', documentName: 'חוזה שירות', variables: { amount: '1,200 ₪' } }),
        response: `{ "success": true, "message": "Distributable fill link created from the template.", "data": { "url": "https://gambot.co.il/ORG/form/NEW_DOC_ID/TOKEN?lang=he", "documentId": "NEW_DOC_ID", "templateId": "TEMPLATE_ID" } }`,
        notes: { he: 'לתבנית מסמך אין קישור סטטי יחיד — כל לקוח ממלא עותק משלו, ולכן קריאה זו יוצרת מופע מילוי חדש ומחזירה את כתובת ה-/form/ שלו. זהו POST כי הוא יוצר מסמך.', en: 'A document template has no single static link — each customer fills their own copy, so this call creates a new fill instance and returns its /form/ URL. It is a POST because it creates a document.' },
      },
    ],
  },
  {
    id: 'users',
    title: { he: 'משתמשים', en: 'Users' },
    description: { he: 'ניהול משתמשי הארגון (חברי צוות) — הוספה, הצגה, שליפה, עדכון והשבתה.', en: 'Manage organization users (team members) — add, list, fetch, update and disable.' },
    endpoints: [
      {
        method: 'GET', path: '/users', scope: 'users:read',
        summary: { he: 'הצגת משתמשי הארגון (ללא בוטים מערכתיים).', en: 'List organization users (excluding system bots).' },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/users" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 4, "items": [ { "uID": "?", "FullName": "?", "SecurityRole": "Admin" } ] } }`,
      },
      {
        method: 'GET', path: '/users/{userId}', scope: 'users:read',
        summary: { he: 'שליפת משתמש בודד.', en: 'Fetch a single user.' },
        params: [{ name: 'userId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה המשתמש.', en: 'User id.' } }],
        request: null,
        curl: `curl "${API_BASE}/users/USER_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "uID": "USER_ID", "FullName": "?", "Status": "active" } }`,
      },
      {
        method: 'POST', path: '/users', scope: 'users:write',
        summary: { he: 'יצירה/הזמנה של משתמש — מקים את החשבון ושולח אימייל + WhatsApp.', en: 'Create/invite a user — provisions the account and sends email + WhatsApp.' },
        params: [
          { name: 'email', in: 'body', type: 'string', required: true, desc: { he: 'כתובת אימייל.', en: 'Email address.' } },
          { name: 'fullName', in: 'body', type: 'string', required: false, desc: { he: 'שם מלא (או firstName+lastName).', en: 'Full name (or firstName+lastName).' } },
          { name: 'phoneNumber', in: 'body', type: 'string', required: false, desc: { he: 'טלפון.', en: 'Phone.' } },
          { name: 'securityRole', in: 'body', type: 'string', required: false, desc: { he: 'Admin/StoreManager/StoreAgent/Chat/Basic/Custom.', en: 'Admin/StoreManager/StoreAgent/Chat/Basic/Custom.' } },
          { name: 'language', in: 'body', type: 'string', required: false, desc: { he: 'שפה.', en: 'Language.' } },
        ],
        request: `{
  "email": "agent@example.com",
  "fullName": "ישראל ישראלי",
  "phoneNumber": "972501234567",
  "securityRole": "StoreAgent"
}`,
        curl: curl('POST', '/users', `{ "email": "agent@example.com", "fullName": "Agent" }`),
        response: `{ "success": true, "message": "User created", "data": { "email": "agent@example.com" } }`,
      },
      {
        method: 'PATCH', path: '/users/{userId}', scope: 'users:write',
        summary: { he: 'עדכון משתמש — רק השדות שנשלחו. מקבל גם POST.', en: 'Update a user — only provided fields. POST also accepted.' },
        params: [
          { name: 'userId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה המשתמש.', en: 'User id.' } },
          { name: 'securityRole', in: 'body', type: 'string', required: false, desc: { he: 'תפקיד אבטחה.', en: 'Security role.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active/inactive.', en: 'active/inactive.' } },
        ],
        request: `{ "securityRole": "StoreManager" }`,
        curl: curl('PATCH', '/users/USER_ID', `{ "securityRole": "StoreManager" }`),
        response: `{ "success": true, "message": "User updated" }`,
      },
      {
        method: 'POST', path: '/users/{userId}/disable', scope: 'users:write',
        summary: { he: 'השבתת משתמש (status=inactive).', en: 'Disable a user (status=inactive).' },
        params: [{ name: 'userId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה המשתמש.', en: 'User id.' } }],
        request: null,
        curl: curl('POST', '/users/USER_ID/disable', null),
        response: `{ "success": true, "message": "User inactive" }`,
      },
      {
        method: 'POST', path: '/users/{userId}/enable', scope: 'users:write',
        summary: { he: 'הפעלת משתמש (status=active).', en: 'Enable a user (status=active).' },
        params: [{ name: 'userId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה המשתמש.', en: 'User id.' } }],
        request: null,
        curl: curl('POST', '/users/USER_ID/enable', null),
        response: `{ "success": true, "message": "User active" }`,
      },
      {
        method: 'DELETE', path: '/users/{userId}', scope: 'users:write',
        summary: { he: 'מחיקת משתמש לצמיתות (אימות + פרופיל).', en: 'Permanently delete a user (auth + profile).' },
        params: [{ name: 'userId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה המשתמש.', en: 'User id.' } }],
        request: null,
        curl: `curl -X DELETE "${API_BASE}/users/USER_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "message": "User deleted" }`,
      },
    ],
  },
  {
    id: 'bots',
    title: { he: 'בוטים ואוטומציות', en: 'Bots & Automations' },
    description: {
      he: 'יצירה וניהול של בוטים ואוטומציות צ׳אט ל-WhatsApp ("botomations") — בדיוק כמו בונה הבוטים שבמערכת (הם נשמרים לאותו runtime ומתנהגים זהה). שתי דרכים ליצור בוט: <strong>בונים ברמה גבוהה</strong> (keyword-reply, template-button-reply, menu) שמרכיבים עבורכם את סכימת הצעדים הנכונה, או <strong>POST של אובייקט הבוט המלא</strong> (name, status, steps[]) לשליטה מלאה. בוט הוא רשימת Steps — צעד 1 הוא הטריגר, השאר הם פעולות. Placeholders כמו <code>{{Step_1_PhoneNumber}}</code> ו-<code>{{Step_1_Message}}</code> נושאים את מספר הטלפון וטקסט ההודעה של איש הקשר המפעיל אל צעדים מאוחרים יותר.',
      en: 'Create and manage WhatsApp bots & chat automations ("botomations") — exactly like the in-app Bot Builder (they save to the same runtime and behave identically). Two ways to create a bot: <strong>high-level builders</strong> (keyword-reply, template-button-reply, menu) that assemble the correct step schema for you, or <strong>POST the full bot object</strong> (name, status, steps[]) for full control. A bot is a list of Steps — step 1 is the trigger, the rest are actions. Placeholders like <code>{{Step_1_PhoneNumber}}</code> and <code>{{Step_1_Message}}</code> carry the triggering contact\'s phone number and message text into later steps.',
    },
    endpoints: [
      {
        method: 'GET', path: '/bots', scope: 'bots:read',
        summary: { he: 'הצגת בוטים/אוטומציות (עם סיכום לכל בוט). ?botsOnly=true מחזיר רק בוטים ויזואליים.', en: 'List bots/automations (with a summary per bot). ?botsOnly=true returns only visual bots.' },
        params: [
          { name: 'botsOnly', in: 'query', type: 'bool', required: false, desc: { he: 'רק בוטים ויזואליים (isBot). ברירת מחדל false.', en: 'Only visual bots (isBot). Default false.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/bots?botsOnly=false" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 1, "items": [ { "id": "abc123", "name": "Greeting bot", "status": "active", "isBot": false, "isPrimaryFlow": false, "stepCount": 2, "trigger": "IncomingMessage" } ] } }`,
      },
      {
        method: 'GET', path: '/bots/{botId}', scope: 'bots:read',
        summary: { he: 'בוט בודד עם הגדרת הצעדים המלאה שלו.', en: 'A single bot with its full step definition.' },
        params: [
          { name: 'botId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הבוט.', en: 'Bot id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/bots/BOT_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "abc123", "name": "Greeting bot", "status": "active", "steps": [ { "StepId": "Step_1", "type": "trigger", "action": "IncomingMessage", "config": { "messageType": "regular" } } ] } }`,
      },
      {
        method: 'POST', path: '/bots/keyword-reply', scope: 'bots:write',
        summary: { he: 'בונה ברמה גבוהה: מענה אוטומטי להודעה נכנסת — לפי מילת מפתח אחת או יותר, או לכל הודעה.', en: 'High-level builder: auto-reply to an incoming message — by one or more keywords, or to any message.' },
        params: [
          { name: 'name', in: 'body', type: 'string', required: true, desc: { he: 'שם הבוט.', en: 'Bot name.' } },
          { name: 'keywords', in: 'body', type: 'string[]', required: false, desc: { he: 'מילות מפתח שמפעילות את הבוט (מותאמות ב-OR). חובה אלא אם anyMessage=true.', en: 'Keywords that trigger the bot (OR-matched). Required unless anyMessage=true.' } },
          { name: 'matchType', in: 'body', type: 'string', required: false, desc: { he: 'equals|contains (ברירת מחדל equals).', en: 'equals|contains (default equals).' } },
          { name: 'anyMessage', in: 'body', type: 'bool', required: false, desc: { he: 'מענה לכל הודעה נכנסת, תוך התעלמות ממילות מפתח.', en: 'Reply to ANY incoming message, ignoring keywords.' } },
          { name: 'replyTemplateName', in: 'body', type: 'string', required: false, desc: { he: 'שם התבנית למענה. או replyText.', en: 'Template name to reply with. Or replyText.' } },
          { name: 'replyText', in: 'body', type: 'string', required: false, desc: { he: 'מענה טקסט חופשי (עובד בתוך חלון 24 השעות).', en: 'Free-text reply (works inside the 24h window).' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active|inactive (ברירת מחדל active).', en: 'active|inactive (default active).' } },
        ],
        request: `{
  "name": "Greeting bot",
  "keywords": ["hi", "hello"],
  "matchType": "equals",
  "replyText": "Hi! How can we help?",
  "status": "active"
}`,
        curl: curl('POST', '/bots/keyword-reply', `{ "name": "Greeting bot", "keywords": ["hi","hello"], "replyText": "Hi! How can we help?" }`),
        response: `{ "success": true, "message": "Bot created.", "data": { "botId": "abc123", "name": "Greeting bot", "status": "active" } }`,
        notes: { he: 'ספקו replyTemplateName או replyText. מחוץ לחלון 24 השעות חובה להשיב בתבנית מאושרת.', en: 'Provide replyTemplateName or replyText. Outside the 24h window you must reply with an approved template.' },
        examples: [
          { label: { he: 'קריאת כלי MCP', en: 'MCP tool call' }, code: `gambot_create_keyword_autoreply({\n  name: "Greeting bot",\n  keywords: ["hi", "hello"],\n  replyText: "Hi! How can we help?"\n})` },
        ],
      },
      {
        method: 'POST', path: '/bots/template-button-reply', scope: 'bots:write',
        summary: { he: 'בונה ברמה גבוהה: מענה אוטומטי כשאיש קשר לוחץ על כפתור בתבנית ששלחתם. כל כפתור מנתב למענה משלו.', en: 'High-level builder: auto-reply when a contact taps a button on a template you sent. Each button routes to its own reply.' },
        params: [
          { name: 'name', in: 'body', type: 'string', required: true, desc: { he: 'שם הבוט.', en: 'Bot name.' } },
          { name: 'templateName', in: 'body', type: 'string', required: true, desc: { he: 'התבנית שכפתוריה מפעילים את הבוט.', en: 'Template whose buttons trigger the bot.' } },
          { name: 'buttons', in: 'body', type: 'object[]', required: true, desc: { he: '[{ button (הכותרת שלו), replyTemplateName?, replyText? }]. כפתור ללא מענה מזוהה אך לא שולח דבר.', en: '[{ button (its title), replyTemplateName?, replyText? }]. A button with no reply is matched but sends nothing.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active|inactive (ברירת מחדל active).', en: 'active|inactive (default active).' } },
        ],
        request: `{
  "name": "Support router",
  "templateName": "welcome_gambot_0926",
  "buttons": [
    { "button": "Sales", "replyText": "A sales rep will contact you shortly." },
    { "button": "Support", "replyTemplateName": "support_hours" }
  ]
}`,
        curl: curl('POST', '/bots/template-button-reply', `{ "name": "Support router", "templateName": "welcome_gambot_0926", "buttons": [ { "button": "Sales", "replyText": "A sales rep will contact you shortly." } ] }`),
        response: `{ "success": true, "message": "Bot created.", "data": { "botId": "def456", "name": "Support router", "status": "active" } }`,
      },
      {
        method: 'POST', path: '/bots/menu', scope: 'bots:write',
        summary: { he: 'בונה ברמה גבוהה: בוט תפריט — תבנית פתיחה עם כפתורים שכל אחד מנתב למענה. אותו מבנה שבונה הבוטים פורס בתור "הבוט הראשי".', en: 'High-level builder: a menu bot — an opening template with buttons that each route to a reply. Same shape the Bot Builder deploys as the "main bot".' },
        params: [
          { name: 'name', in: 'body', type: 'string', required: true, desc: { he: 'שם הבוט.', en: 'Bot name.' } },
          { name: 'openingTemplateName', in: 'body', type: 'string', required: true, desc: { he: 'תבנית הפתיחה עם הכפתורים.', en: 'Opening template with the buttons.' } },
          { name: 'options', in: 'body', type: 'object[]', required: true, desc: { he: '[{ button, replyTemplateName?, replyText? }] — אפשרות אחת לכל כפתור.', en: '[{ button, replyTemplateName?, replyText? }] — one option per button.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active|inactive (ברירת מחדל active).', en: 'active|inactive (default active).' } },
        ],
        request: `{
  "name": "Main menu",
  "openingTemplateName": "welcome_gambot_0926",
  "options": [
    { "button": "Prices", "replyTemplateName": "price_list" },
    { "button": "Book", "replyText": "Great! Reply with your preferred date." }
  ]
}`,
        curl: curl('POST', '/bots/menu', `{ "name": "Main menu", "openingTemplateName": "welcome_gambot_0926", "options": [ { "button": "Prices", "replyTemplateName": "price_list" } ] }`),
        response: `{ "success": true, "message": "Bot created.", "data": { "botId": "ghi789", "name": "Main menu", "status": "active" } }`,
        examples: [
          { label: { he: 'קריאת כלי MCP', en: 'MCP tool call' }, code: `gambot_create_menu_bot({\n  name: "Main menu",\n  openingTemplateName: "welcome_gambot_0926",\n  options: [\n    { button: "Prices", replyTemplateName: "price_list" },\n    { button: "Book", replyText: "Great! Reply with your preferred date." }\n  ]\n})` },
        ],
      },
      {
        method: 'POST', path: '/bots', scope: 'bots:write',
        summary: { he: 'יצירת בוט מאובייקט botomation מלא (שליטה מלאה). העדיפו את הבונים ברמה גבוהה אלא אם דרושים צעדים מותאמים.', en: 'Create a bot from a full botomation object (full control). Prefer the high-level builders unless you need custom steps.' },
        params: [
          { name: 'name', in: 'body', type: 'string', required: true, desc: { he: 'שם הבוט.', en: 'Bot name.' } },
          { name: 'steps', in: 'body', type: 'object[]', required: true, desc: { he: 'רשימת הצעדים. צעד 1 = טריגר. כל צעד: { StepId, type: "trigger|action", action: "IncomingMessage|SendMessage|switchCase|…", config }.', en: 'Steps list. Step 1 = trigger. Each step: { StepId, type: "trigger|action", action: "IncomingMessage|SendMessage|switchCase|…", config }.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active|inactive (ברירת מחדל active).', en: 'active|inactive (default active).' } },
          { name: 'isBot', in: 'body', type: 'bool', required: false, desc: { he: 'קבעו true לבוט ויזואלי.', en: 'Set true for a visual bot.' } },
        ],
        request: `{
  "name": "Custom flow",
  "status": "active",
  "steps": [
    { "StepId": "Step_1", "type": "trigger", "action": "IncomingMessage",
      "config": { "messageType": "regular", "triggerMode": "conditions",
        "conditionGroups": [ { "logicOperator": "AND", "conditions": [ { "operator": "equals", "value": "start", "field": "message" } ] } ] } },
    { "StepId": "Step_2", "type": "action", "action": "SendMessage",
      "config": { "messageType": "regular", "phoneNumber": "{{Step_1_PhoneNumber}}", "messageContent": "Welcome!" } }
  ]
}`,
        curl: curl('POST', '/bots', `{ "name": "Custom flow", "status": "active", "steps": [ { "StepId": "Step_1", "type": "trigger", "action": "IncomingMessage", "config": { "messageType": "regular" } }, { "StepId": "Step_2", "type": "action", "action": "SendMessage", "config": { "messageType": "regular", "phoneNumber": "{{Step_1_PhoneNumber}}", "messageContent": "Welcome!" } } ] }`),
        response: `{ "success": true, "message": "Bot created.", "data": { "botId": "jkl012", "name": "Custom flow", "status": "active" } }`,
        notes: { he: 'name ו-steps[] הם חובה. ניתן לעטוף את האובייקט תחת "bot" או "botomationData". צעדים ללא StepId מושלמים אוטומטית.', en: 'name and steps[] are required. You may wrap the object under "bot" or "botomationData". Steps missing a StepId are auto-filled.' },
      },
      {
        method: 'POST', path: '/bots/{botId}/status', scope: 'bots:write',
        summary: { he: 'הפעלה או השבתה של בוט.', en: 'Activate or deactivate a bot.' },
        params: [
          { name: 'botId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הבוט.', en: 'Bot id.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active|inactive. לחלופין active:true|false.', en: 'active|inactive. Or active:true|false.' } },
        ],
        request: `{ "status": "inactive" }`,
        curl: curl('POST', '/bots/BOT_ID/status', `{ "status": "inactive" }`),
        response: `{ "success": true, "message": "Bot updated.", "data": { "botId": "abc123", "status": "inactive" } }`,
      },
      {
        method: 'PATCH', path: '/bots/{botId}', scope: 'bots:write',
        summary: { he: 'עדכון בוט (שלחו את אובייקט הבוט המלא). POST לאותה כתובת מתקבל גם כן.', en: 'Update a bot (send the full bot object). POST to the same path is also accepted.' },
        params: [
          { name: 'botId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הבוט.', en: 'Bot id.' } },
        ],
        request: `{ "name": "Greeting bot (v2)", "status": "active", "steps": [ /* full steps[] */ ] }`,
        curl: `curl -X PATCH "${API_BASE}/bots/BOT_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "name": "Greeting bot (v2)", "status": "active", "steps": [] }'`,
        response: `{ "success": true, "message": "Bot updated.", "data": { "botId": "abc123" } }`,
      },
      {
        method: 'DELETE', path: '/bots/{botId}', scope: 'bots:write',
        summary: { he: 'מחיקת בוט.', en: 'Delete a bot.' },
        params: [
          { name: 'botId', in: 'path', type: 'string', required: true, desc: { he: 'מזהה הבוט.', en: 'Bot id.' } },
        ],
        request: null,
        curl: `curl -X DELETE "${API_BASE}/bots/BOT_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "message": "Bot deleted.", "data": { "botId": "abc123" } }`,
      },
    ],
  },
  {
    id: 'onboarding',
    title: { he: 'הצטרפות (Onboarding)', en: 'Onboarding' },
    description: {
      he: 'הקמת חשבון חדש (ארגון + משתמש ראשון) — ניסיון חינם או ישירות בתשלום עם כרטיס שמור. השתמשו במספר בדיקה של Meta, מספר WhatsApp Business קיים (coexistence), מספר משלכם (BYO), או קנו מספר/SIM מאיתנו לפי מדינה (Twilio). גלובלי: שלחו companyInfo.timezone (IANA) ו-companyInfo.country (ISO-3166) — הם מניעים את התזמון (קמפיינים, תזכורות, שעות עבודה) ואת הלוקאל. אף אחד מהם לא מכשיל את ההצטרפות: timezone חסר/לא תקין נגזר מ-country, אחרת ברירת המחדל היא Asia/Jerusalem. סוכן AI שמחזיק בכרטיס הלקוח יכול להוסיף אמצעי תשלום ישירות. חלונית ה-Meta היא שלב בדפדפן, ולכן מוחזר קישור מתארח והקוד מוחלף דרך ה-API.',
      en: 'Provision a new account (organization + first user) — either a free trial or straight-to-paid with a card on file. Use a Meta test number, an existing WhatsApp Business number (coexistence), your own number (BYO), or buy a number/SIM from us by country (Twilio). Global: send companyInfo.timezone (IANA) and companyInfo.country (ISO-3166) — they drive scheduling (campaigns, reminders, business hours) and locale. Neither hard-fails onboarding: a missing/invalid timezone is derived from country, else defaults to Asia/Jerusalem. An AI agent holding the customer\'s card can add a payment method directly. The Meta popup is a browser step, so a hosted link is returned and the code is exchanged via the API.',
    },
    endpoints: [
      {
        method: 'POST', path: '/onboarding/check-organization', scope: 'onboarding:read',
        summary: { he: 'בדיקה האם כבר קיים ארגון עבור חברה + ח.פ/ע.מ, והאם ניתן להמשיך הצטרפות שלא הושלמה.', en: 'Check whether an org already exists for a company + tax id, and whether an incomplete onboarding can be resumed.' },
        params: [
          { name: 'companyName', in: 'body', type: 'string', required: true, desc: { he: 'שם החברה.', en: 'Company name.' } },
          { name: 'companyIdNumber', in: 'body', type: 'string', required: true, desc: { he: 'ח.פ/ע.מ (9 ספרות).', en: 'Company/tax id (9 digits).' } },
        ],
        request: `{ "companyName": "כהן ובניו", "companyIdNumber": "514999999" }`,
        curl: curl('POST', '/onboarding/check-organization', { companyName: 'Cohen & Sons', companyIdNumber: '514999999' }),
        response: `{ "success": true, "data": { "sanitizedOrgName": "?", "nameExists": false, "countByCompanyId": 0, "existingIncomplete": false, "resumeUrl": null } }`,
      },
      {
        method: 'POST', path: '/onboarding/organization-name', scope: 'onboarding:read',
        summary: { he: 'יצירת שם ארגון ייחודי מהשם + ח.פ/ע.מ (מוסיף סיומת אם תפוס).', en: 'Generate a unique organization name from the name + tax id (adds a suffix if taken).' },
        params: [
          { name: 'companyName', in: 'body', type: 'string', required: true, desc: { he: 'שם החברה.', en: 'Company name.' } },
          { name: 'companyIdNumber', in: 'body', type: 'string', required: true, desc: { he: 'ח.פ/ע.מ.', en: 'Company/tax id.' } },
        ],
        request: `{ "companyName": "כהן ובניו", "companyIdNumber": "514999999" }`,
        curl: curl('POST', '/onboarding/organization-name', { companyName: 'Cohen & Sons', companyIdNumber: '514999999' }),
        response: `{ "success": true, "data": { "organizationName": "cohen-sons-514999999" } }`,
      },
      {
        method: 'POST', path: '/onboarding/available-numbers', scope: 'onboarding:read',
        summary: { he: 'הצגת מספרי טלפון הזמינים לרכישה עבור מדינה (Twilio) — בחרו אחד לרכישה כ-SIM של החשבון.', en: 'List phone numbers available to buy for a country (Twilio) — pick one to purchase as the account SIM.' },
        params: [
          { name: 'countryCode', in: 'body', type: 'string', required: true, desc: { he: 'קוד מדינה ISO-3166 alpha-2 (למשל US, GB, IL).', en: 'ISO-3166 alpha-2 country code (e.g. US, GB, IL).' } },
          { name: 'numberType', in: 'body', type: 'string', required: false, desc: { he: 'local/mobile/tollfree/national (ברירת מחדל local).', en: 'local/mobile/tollfree/national (default local).' } },
        ],
        request: `{ "countryCode": "US", "numberType": "local" }`,
        curl: curl('POST', '/onboarding/available-numbers', { countryCode: 'US', numberType: 'local' }),
        response: `{ "success": true, "data": { "countryCode": "US", "numberType": "local", "count": 2, "numbers": [ { "phoneNumber": "+1201555....", "friendlyName": "(201) 555-....", "locality": "Jersey City", "region": "NJ", "capabilities": { "voice": true, "sms": true, "mms": true } } ] } }`,
        notes: { he: 'העבירו את ה-phoneNumber שנבחר ל-create-trial/create-paid כ-simInfo.selectedSimNumber עם simInfo.purchaseInTwilio=true.', en: 'Pass the chosen phoneNumber to create-trial/create-paid as simInfo.selectedSimNumber with simInfo.purchaseInTwilio=true.' },
      },
      {
        method: 'POST', path: '/onboarding/create-trial', scope: 'onboarding:write',
        summary: { he: 'יצירת ארגון בניסיון חינם + משתמש ראשון (ללא כרטיס). פרטי ההתחברות נשלחים באימייל וב-WhatsApp.', en: 'Create a FREE-TRIAL organization + first user (no card). Login credentials are emailed & WhatsApp\'d.' },
        params: [
          { name: 'useFreeNumber', in: 'body', type: 'bool', required: false, desc: { he: 'מספר הבדיקה החינמי של Meta (לבדיקות בלבד).', en: 'Meta\'s free TEST number (testing only).' } },
          { name: 'useCoexisting', in: 'body', type: 'bool', required: false, desc: { he: 'מספר WhatsApp Business קיים (simInfo.simNumberEntered).', en: 'Existing WhatsApp Business number (simInfo.simNumberEntered).' } },
          { name: 'plan', in: 'body', type: 'string', required: false, desc: { he: 'Basic/Premium/Enterprise.', en: 'Basic/Premium/Enterprise.' } },
          { name: 'currency', in: 'body', type: 'string', required: false, desc: { he: 'ILS/USD/EUR/GBP.', en: 'ILS/USD/EUR/GBP.' } },
          { name: 'companyInfo', in: 'body', type: 'object', required: true, desc: { he: '{ organizationName (חובה), timezone (IANA, מומלץ; נגזר מ-country אם הושמט), country (ISO-3166), companyName, idNumber, companyUrl, companyPhoneNumber }.', en: '{ organizationName (required), timezone (IANA, recommended; derived from country if omitted), country (ISO-3166), companyName, idNumber, companyUrl, companyPhoneNumber }.' } },
          { name: 'contactInfo', in: 'body', type: 'object', required: false, desc: { he: '{ contactFullName, contactEmail, contactPhoneNumber }.', en: '{ contactFullName, contactEmail, contactPhoneNumber }.' } },
          { name: 'simInfo', in: 'body', type: 'object', required: false, desc: { he: '{ hasSim, simNumberEntered, selectedSimNumber, purchaseInTwilio }. לרכישת מספר מאיתנו: purchaseInTwilio=true + selectedSimNumber.', en: '{ hasSim, simNumberEntered, selectedSimNumber, purchaseInTwilio }. To buy a number from us: purchaseInTwilio=true + selectedSimNumber.' } },
        ],
        request: `{
  "plan": "Basic",
  "currency": "USD",
  "companyInfo": { "organizationName": "acme-inc-123", "companyName": "Acme Inc", "idNumber": "123456789", "timezone": "America/New_York", "country": "US" },
  "contactInfo": { "contactFullName": "John Doe", "contactEmail": "john@acme.com", "contactPhoneNumber": "12015550100" },
  "simInfo": { "hasSim": false, "purchaseInTwilio": true, "selectedSimNumber": "+12015550123" }
}`,
        curl: curl('POST', '/onboarding/create-trial', { plan: 'Basic', currency: 'USD', companyInfo: { organizationName: 'acme-inc-123', companyName: 'Acme Inc', idNumber: '123456789', timezone: 'America/New_York', country: 'US' }, contactInfo: { contactFullName: 'John Doe', contactEmail: 'john@acme.com', contactPhoneNumber: '12015550100' }, simInfo: { hasSim: false, purchaseInTwilio: true, selectedSimNumber: '+12015550123' } }),
        response: `{ "success": true, "message": "Trial account created successfully.", "data": { "organizationName": "acme-inc-123", "accountType": "twilio_purchase", "country": "US", "timeZone": "America/New_York", "purchasedNumber": "+12015550123", "billing": "trial", "wabaConnectUrl": "https://gambot.co.il/complete-waba/acme-inc-123" } }`,
        notes: { he: 'companyInfo.timezone (IANA) מומלץ — אם חסר/לא תקין הוא נגזר מ-country, אחרת ברירת המחדל היא Asia/Jerusalem (לעולם לא מכשיל את ההצטרפות). אפשרויות מספר: useFreeNumber → useCoexisting → מספר משלכם (simInfo.simNumberEntered) → רכישה מאיתנו (purchaseInTwilio=true + selectedSimNumber מ-available-numbers).', en: 'companyInfo.timezone (IANA) is recommended — if missing/invalid it is derived from country, else defaults to Asia/Jerusalem (never hard-fails onboarding). Number options: useFreeNumber → useCoexisting → BYO (simInfo.simNumberEntered) → buy from us (purchaseInTwilio=true + selectedSimNumber from available-numbers).' },
      },
      {
        method: 'POST', path: '/onboarding/create-paid', scope: 'onboarding:write',
        summary: { he: 'יצירת חשבון ישירות בתשלום (ללא חודש ניסיון). כרטיס הוא חובה — הטוקן שלו נשמר והחיוב מתחיל מיד.', en: 'Create a straight-to-paid account (no trial month). A card is mandatory — its token is saved and billing starts immediately.' },
        params: [
          { name: 'card', in: 'body', type: 'object', required: true, desc: { he: 'חובה. { cardNumber, expirationDate ("MM/YY"), cvv?, holderId? }. הכרטיס נשלח רק לספק הסליקה תואם-PCI ואינו נשמר.', en: 'REQUIRED. { cardNumber, expirationDate ("MM/YY"), cvv?, holderId? }. The card is sent only to the PCI clearing provider and never stored.' } },
          { name: 'companyInfo', in: 'body', type: 'object', required: true, desc: { he: '{ organizationName (חובה), timezone (IANA, מומלץ; נגזר מ-country אם הושמט), country (ISO-3166), … }.', en: '{ organizationName (required), timezone (IANA, recommended; derived from country if omitted), country (ISO-3166), … }.' } },
          { name: 'plan', in: 'body', type: 'string', required: false, desc: { he: 'Basic/Premium/Enterprise.', en: 'Basic/Premium/Enterprise.' } },
          { name: 'simInfo', in: 'body', type: 'object', required: false, desc: { he: 'כמו ב-create-trial.', en: 'Same as create-trial.' } },
        ],
        request: `{
  "plan": "Premium",
  "currency": "USD",
  "useCoexisting": true,
  "companyInfo": { "organizationName": "acme-inc-123", "companyName": "Acme Inc", "idNumber": "123456789", "timezone": "America/New_York", "country": "US" },
  "contactInfo": { "contactFullName": "John Doe", "contactEmail": "john@acme.com", "contactPhoneNumber": "12015550100" },
  "simInfo": { "hasSim": true, "simNumberEntered": "12015550100" },
  "card": { "cardNumber": "4580000000000000", "expirationDate": "05/28", "cvv": "123" }
}`,
        curl: curl('POST', '/onboarding/create-paid', { plan: 'Premium', currency: 'USD', useCoexisting: true, companyInfo: { organizationName: 'acme-inc-123', companyName: 'Acme Inc', idNumber: '123456789', timezone: 'America/New_York', country: 'US' }, contactInfo: { contactFullName: 'John Doe', contactEmail: 'john@acme.com', contactPhoneNumber: '12015550100' }, simInfo: { hasSim: true, simNumberEntered: '12015550100' }, card: { cardNumber: '4580000000000000', expirationDate: '05/28', cvv: '123' } }),
        response: `{ "success": true, "message": "Paid account created successfully.", "data": { "organizationName": "acme-inc-123", "accountType": "coexisting", "billing": "paid", "wabaConnectUrl": "https://gambot.co.il/complete-waba/acme-inc-123" } }`,
        notes: { he: 'אם החשבון נוצר אך שמירת הכרטיס נכשלה — נסו שוב עם /onboarding/add-payment-method.', en: 'If the account is created but the card fails to save, retry with /onboarding/add-payment-method.' },
      },
      {
        method: 'POST', path: '/onboarding/add-payment-method', scope: 'billing:write',
        summary: { he: 'אימות כרטיס מול ספק הסליקה (Tranzila) ושמירת הטוקן שלו בארגון — סוכן AI עם כרטיס הלקוח מוסיף אמצעי תשלום ללא הדף המתארח.', en: 'Verify a card with the clearing provider (Tranzila) and save its token to the org — an AI agent with the customer\'s card adds a payment method without the hosted page.' },
        params: [
          { name: 'organizationName', in: 'body', type: 'string', required: true, desc: { he: 'שם הארגון.', en: 'Organization name.' } },
          { name: 'card', in: 'body', type: 'object', required: true, desc: { he: 'חובה. { cardNumber, expirationDate ("MM/YY"), cvv?, holderId? }.', en: 'REQUIRED. { cardNumber, expirationDate ("MM/YY"), cvv?, holderId? }.' } },
          { name: 'plan', in: 'body', type: 'string', required: false, desc: { he: 'תוכנית (לקוד המוצר).', en: 'Plan (for the product code).' } },
        ],
        request: `{ "organizationName": "acme-inc-123", "plan": "Premium", "card": { "cardNumber": "4580000000000000", "expirationDate": "05/28", "cvv": "123" } }`,
        curl: curl('POST', '/onboarding/add-payment-method', { organizationName: 'acme-inc-123', plan: 'Premium', card: { cardNumber: '4580000000000000', expirationDate: '05/28', cvv: '123' } }),
        response: `{ "success": true, "message": "Payment method saved. The card token is on file for this organization.", "data": { "organizationName": "acme-inc-123" } }`,
        notes: { he: 'הכרטיס נשלח רק לספק הסליקה תואם-PCI; Gambot שומר טוקן בלבד (4 ספרות אחרונות + תוקף). לחלופין מתארחת השתמשו ב-/onboarding/payment-link.', en: 'The card is sent only to the PCI-compliant clearing provider; Gambot stores a token only (last 4 + expiry). For a hosted alternative use /onboarding/payment-link.' },
      },
      {
        method: 'POST', path: '/onboarding/payment-link', scope: 'onboarding:read',
        summary: { he: 'בניית קישור תשלום מתארח מאובטח (Tranzila) להוספת כרטיס עבור ארגון. ה-API לעולם אינו מטפל בנתוני הכרטיס.', en: 'Build a secure hosted payment link (Tranzila) to add a card for an organization. The API never handles card data.' },
        params: [
          { name: 'organizationName', in: 'body', type: 'string', required: true, desc: { he: 'שם הארגון.', en: 'Organization name.' } },
          { name: 'plan', in: 'body', type: 'string', required: false, desc: { he: 'תוכנית.', en: 'Plan.' } },
          { name: 'price', in: 'body', type: 'string', required: false, desc: { he: 'מחיר.', en: 'Price.' } },
          { name: 'paymentCycle', in: 'body', type: 'string', required: false, desc: { he: 'monthly/yearly.', en: 'monthly/yearly.' } },
          { name: 'currency', in: 'body', type: 'string', required: false, desc: { he: 'מטבע.', en: 'Currency.' } },
          { name: 'contactEmail', in: 'body', type: 'string', required: false, desc: { he: 'אימייל ליצירת קשר.', en: 'Contact email.' } },
        ],
        request: `{ "organizationName": "cohen-sons-514999999", "plan": "Basic", "price": "179", "paymentCycle": "monthly", "currency": "ILS", "contactEmail": "dana@example.com" }`,
        curl: curl('POST', '/onboarding/payment-link', { organizationName: 'cohen-sons-514999999', plan: 'Basic', price: '179', paymentCycle: 'monthly', currency: 'ILS' }),
        response: `{ "success": true, "message": "Secure hosted payment link.", "data": { "url": "https://gambot.co.il/addpayment?organizationName=cohen-sons-514999999&plan=Basic&price=179&paymentCycle=monthly&currency=ILS" } }`,
        notes: { he: 'שתפו את הקישור עם הלקוח כדי להזין כרטיס בדף המאובטח; טוקן הכרטיס נשמר אוטומטית בהצלחה.', en: 'Share the link with the customer to enter a card on the secure page; the card token is saved automatically on success.' },
      },
      {
        method: 'GET', path: '/onboarding/waba/connect-link', scope: 'onboarding:read',
        summary: { he: 'קבלת כתובת הדף המתארח להשלמת Meta Embedded Signup (חיבור WhatsApp).', en: 'Get the hosted page URL to complete Meta Embedded Signup (connect WhatsApp).' },
        params: [{ name: 'organization', in: 'query', type: 'string', required: true, desc: { he: 'שם הארגון.', en: 'Organization name.' } }],
        request: null,
        curl: `curl "${API_BASE}/onboarding/waba/connect-link?organization=cohen-sons-514999999" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "url": "https://gambot.co.il/complete-waba/cohen-sons-514999999" } }`,
      },
      {
        method: 'POST', path: '/onboarding/waba/exchange-token', scope: 'waba:write',
        summary: { he: 'השלמת Meta Embedded Signup ע"י החלפת ה-code מחלונית הפייסבוק — רושמת את ה-WABA, ה-webhooks והטלפון.', en: 'Complete Meta Embedded Signup by exchanging the code from the Facebook popup — registers the WABA, webhooks and phone.' },
        params: [
          { name: 'code', in: 'body', type: 'string', required: true, desc: { he: 'קוד ההרשאה מחלונית Meta Embedded Signup.', en: 'Authorization code from the Meta Embedded Signup popup.' } },
          { name: 'organization', in: 'body', type: 'string', required: true, desc: { he: 'שם הארגון.', en: 'Organization name.' } },
          { name: 'isCoexisting', in: 'body', type: 'bool', required: false, desc: { he: 'חיבור coexistence.', en: 'Coexistence connection.' } },
          { name: 'coexistingPhoneNumber', in: 'body', type: 'string', required: false, desc: { he: 'מספר קיים (coexistence).', en: 'Existing number (coexistence).' } },
        ],
        request: `{ "code": "AQD...", "organization": "cohen-sons-514999999", "isCoexisting": true, "coexistingPhoneNumber": "972501234567" }`,
        curl: curl('POST', '/onboarding/waba/exchange-token', { code: 'AQD...', organization: 'cohen-sons-514999999' }),
        response: `{ "success": true, "message": "WhatsApp (WABA) connected successfully.", "data": { "organization": "cohen-sons-514999999", "message": "Business token updated successfully for organization." } }`,
        notes: { he: 'ה-code מתקבל מחלונית Meta Embedded Signup (שלב בדפדפן, למשל בדף connect-link). ה-API אינו יכול להנפיק אותו בעצמו.', en: 'The code is obtained from the Meta Embedded Signup popup (a browser step, e.g. on the connect-link page). The API cannot mint it on its own.' },
      },
    ],
  },
];

// Flat scope list for the "permissions" reference.
export const API_SCOPES = [
  { scope: 'messages:send', he: 'שליחת הודעות ותבניות', en: 'Send messages and templates' },
  { scope: 'conversations:read', he: 'קריאת שיחות והודעות', en: 'Read conversations and messages' },
  { scope: 'templates:read', he: 'קריאת תבניות', en: 'Read templates' },
  { scope: 'templates:write', he: 'יצירת תבניות', en: 'Create templates' },
  { scope: 'contacts:read', he: 'קריאת אנשי קשר', en: 'Read contacts' },
  { scope: 'contacts:write', he: 'יצירה/עדכון אנשי קשר', en: 'Create/update contacts' },
  { scope: 'leads:read', he: 'קריאת לידים', en: 'Read leads' },
  { scope: 'leads:write', he: 'יצירה/עדכון לידים', en: 'Create/update leads' },
  { scope: 'cases:read', he: 'קריאת פניות', en: 'Read cases' },
  { scope: 'cases:write', he: 'יצירה/עדכון פניות', en: 'Create/update cases' },
  { scope: 'tasks:read', he: 'קריאת משימות', en: 'Read tasks' },
  { scope: 'tasks:write', he: 'יצירה/עדכון משימות', en: 'Create/update tasks' },
  { scope: 'notes:read', he: 'קריאת הערות', en: 'Read notes' },
  { scope: 'quotes:read', he: 'קריאת הצעות מחיר', en: 'Read quotes' },
  { scope: 'quotes:write', he: 'יצירה/עדכון הצעות מחיר', en: 'Create/update quotes' },
  { scope: 'invoices:read', he: 'קריאת חשבוניות', en: 'Read invoices' },
  { scope: 'invoices:write', he: 'יצירה/עדכון/הפקת חשבוניות', en: 'Create/update/issue invoices' },
  { scope: 'orders:read', he: 'קריאת הזמנות', en: 'Read orders' },
  { scope: 'orders:write', he: 'יצירה/עדכון הזמנות', en: 'Create/update orders' },
  { scope: 'signatures:read', he: 'קריאת מסמכי חתימה', en: 'Read signature documents' },
  { scope: 'forms:read', he: 'קריאת טפסים והגשות', en: 'Read forms and submissions' },
  { scope: 'documents:read', he: 'קריאת תבניות מסמכים והגשות', en: 'Read document templates and submissions' },
  { scope: 'users:read', he: 'קריאת משתמשים', en: 'Read users' },
  { scope: 'users:write', he: 'יצירה/עדכון/מחיקת משתמשים', en: 'Create/update/delete users' },
  { scope: 'campaigns:read', he: 'קריאת קמפיינים ותוצאות', en: 'Read campaigns and results' },
  { scope: 'campaigns:write', he: 'יצירה/עדכון/מחיקת קמפיינים', en: 'Create/update/delete campaigns' },
  { scope: 'campaigns:run', he: 'הרצת קמפיינים (כולל בדיקה)', en: 'Run campaigns (incl. test)' },
  { scope: 'bots:read', he: 'קריאת בוטים ואוטומציות', en: 'Read bots and automations' },
  { scope: 'bots:write', he: 'יצירה/עדכון/מחיקה/החלפת מצב בוטים', en: 'Create/update/delete/toggle bots' },
  { scope: 'onboarding:read', he: 'בדיקת ארגון + חיפוש מספרים + קישורי הצטרפות/תשלום', en: 'Check organization + search numbers + onboarding/payment links' },
  { scope: 'onboarding:write', he: 'יצירת חשבון (ניסיון או תשלום)', en: 'Create an account (trial or paid)' },
  { scope: 'billing:write', he: 'הוספת אמצעי תשלום (כרטיס שמור)', en: 'Add a payment method (card on file)' },
  { scope: 'waba:write', he: 'חיבור WhatsApp (Meta Embedded Signup)', en: 'Connect WhatsApp (Meta Embedded Signup)' },
];

// Inbound message forwarding (webhook-out) — configured in the Gambot UI, not via the API.
export const API_INBOUND = {
  title: { he: 'העברת אירועים (Webhook)', en: 'Event Forwarding (Webhook)' },
  intro: {
    he: 'ניתן להגדיר ש-Gambot יעביר <strong>כל אירוע ש-Meta שולחת</strong> (הודעות נכנסות, סטטוסי הודעות, עדכוני תבניות ועוד) אל השרת שלכם. אנחנו <strong>עוטפים</strong> את הנתונים במעטפת JSON קטנה שמוסיפה <code>type</code> בשורש (סוג האירוע) ושומרת את ה-payload המקורי של Meta תחת <code>meta_obj</code> — כך שהצד שלכם יודע מיד מה קרה ללא ניתוח עמוק.',
    en: 'You can have Gambot forward <strong>every event Meta sends</strong> (incoming messages, message statuses, template updates and more) to your own server. We <strong>wrap</strong> the data in a small JSON envelope that adds a root <code>type</code> (the event kind) and keeps Meta\'s original payload under <code>meta_obj</code> — so your side instantly knows what happened without deep parsing.',
  },
  howTitle: { he: 'איך מפעילים', en: 'Enable it' },
  how: {
    he: 'בפאנל הניהול: <strong>הגדרות → כללי → העברת אירועים (Webhook)</strong>. סמנו את התיבה, הזינו כתובת URL (חובה), אופציונלית כותרת <code>Authorization</code>, ובחרו אילו אירועים להעביר. <strong>כברירת מחדל כל האירועים פעילים.</strong>',
    en: 'In the admin panel: <strong>Settings → General → Event Forwarding (Webhook)</strong>. Tick the checkbox, enter a URL (required), optionally an <code>Authorization</code> header, and choose which events to forward. <strong>By default all events are ON.</strong>',
  },
  requestTitle: { he: 'מה מקבלים', en: 'What you receive' },
  request: {
    he: 'עבור כל אירוע אנחנו שולחים <code>POST</code> אל ה-URL שלכם עם המעטפת (הנתונים המקוריים של Meta תחת <code>meta_obj</code>) והכותרות. ערכי ה-<code>type</code> הם: <code>incoming_message</code> (הודעה נכנסת), <code>message_status</code> (נשלח/נמסר/נקרא/נכשל), <code>template_status_update</code> (שינוי/אישור תבנית), <code>template_category_update</code>, <code>template_quality_update</code>, ואחר.',
    en: 'For each event we send a <code>POST</code> to your URL with the envelope (Meta\'s original data under <code>meta_obj</code>) and the headers. The <code>type</code> values are: <code>incoming_message</code>, <code>message_status</code> (sent/delivered/read/failed), <code>template_status_update</code> (template change/approval), <code>template_category_update</code>, <code>template_quality_update</code>, and other.',
  },
  headers: [
    { key: 'Authorization', he: 'הערך שהגדרתם (אם קיים).', en: 'The value you configured (if any).' },
    { key: 'X-Gambot-Organization', he: 'שם הארגון שלכם.', en: 'Your organization name.' },
    { key: 'X-Gambot-Event', he: 'סוג האירוע (תואם ל-type בשורש), למשל incoming_message.', en: 'The event type (matches root type), e.g. incoming_message.' },
  ],
  payloadNote: { he: 'גוף לדוגמה (מעטפת העוטפת את ה-payload של Meta):', en: 'Sample body (envelope wrapping Meta\'s payload):' },
  payload: `{
  "type": "incoming_message",
  "types": ["incoming_message"],
  "event": "incoming_message",
  "organization": "your-org",
  "receivedAt": "2026-01-01T12:00:00.000Z",
  "meta_obj": {
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "<WABA_ID>",
      "changes": [{
        "field": "messages",
        "value": {
          "metadata": { "display_phone_number": "9725...", "phone_number_id": "..." },
          "contacts": [{ "profile": { "name": "דנה" }, "wa_id": "972501234567" }],
          "messages": [{
            "from": "972501234567",
            "id": "wamid.HBg...",
            "timestamp": "1757600000",
            "type": "text",
            "text": { "body": "שלום, אשמח לקבל פרטים" }
          }]
        }
      }]
    }]
  }
}`,
  tip: {
    he: 'טיפ: החזירו <code>200 OK</code> מהר ועבדו אסינכרונית. ההעברה היא fire-and-forget (ללא ניסיון חוזר). Meta בדרך כלל שולחת סוג אירוע אחד לכל webhook — אם כיביתם את הסוג הזה, הוא פשוט לא יועבר.',
    en: 'Tip: return <code>200 OK</code> fast and process asynchronously. Forwarding is fire-and-forget (no retry). Meta usually sends one event type per webhook — if you turned that type off, it simply won\'t be forwarded.',
  },
};

// MCP (Model Context Protocol) server section — connect AI agents (Cursor, Claude…) to Gambot.
export const API_MCP = {
  title: { he: 'שרת MCP', en: 'MCP Server' },
  intro: {
    he: 'שרת ה-<strong>Gambot MCP</strong> חושף את כל ה-API ככלים (tools) עבור סוכני AI כמו <strong>Cursor, Claude, ChatGPT ו-Gemini</strong> — שליחת הודעות, ניהול לידים, חשבוניות, משתמשים ועוד — הכול דרך שפה טבעית. הוא עוטף את אותו <code>api/v1</code> ומאמת עם ה-Gambot Token שלכם. למדו עוד בעמוד <a href="/whatsapp-mcp/">WhatsApp MCP</a>.',
    en: 'The <strong>Gambot MCP</strong> server exposes the entire API as tools for AI agents like <strong>Cursor, Claude, ChatGPT and Gemini</strong> — send messages, manage leads, invoices, users and more — all through natural language. It wraps the same <code>api/v1</code> and authenticates with your Gambot Token. Learn more on the <a href="/whatsapp-mcp/">WhatsApp MCP page</a>.',
  },
  installTitle: { he: 'התקנה מקומית (Desktop — Cursor / Claude Desktop)', en: 'Local install (Desktop — Cursor / Claude Desktop)' },
  install: `# No install or build needed — your MCP client runs it on demand:
npx -y gambot-mcp`,
  configTitle: { he: 'חיבור ל-Cursor / Claude Desktop', en: 'Connect to Cursor / Claude Desktop' },
  configNote: {
    he: 'הוסיפו ל-<code>.cursor/mcp.json</code> (או <code>claude_desktop_config.json</code>) והפעילו מחדש:',
    en: 'Add to <code>.cursor/mcp.json</code> (or <code>claude_desktop_config.json</code>) and restart:',
  },
  config: `{
  "mcpServers": {
    "gambot": {
      "command": "npx",
      "args": ["-y", "gambot-mcp"],
      "env": { "GAMBOT_TOKEN": "gmbt_your_token_here" }
    }
  }
}`,
  // One-click install deeplink for Cursor (config = base64 of the server block).
  cursorDeeplink: 'cursor://anysphere.cursor-deeplink/mcp/install?name=gambot&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImdhbWJvdC1tY3AiXSwiZW52Ijp7IkdBTUJPVF9UT0tFTiI6IiJ9fQ==',
  cursorButton: { he: '➕ הוספה ל-Cursor (בלחיצה אחת)', en: '➕ Add to Cursor (one click)' },
  cursorButtonNote: {
    he: 'לאחר ההוספה, הדביקו את ה-Gambot Token שלכם ב-env של השרת.',
    en: 'After adding, paste your Gambot Token into the server\'s env.',
  },

  // -- Online / hosted MCP (Streamable HTTP) — one generic flow for every AI tool --
  remoteTitle: { he: 'MCP מקוון (מתארח) — לכל כלי AI', en: 'Online (hosted) MCP — for any AI tool' },
  remoteIntro: {
    he: 'כלים מבוססי-ענן שלא יכולים להריץ תהליך מקומי (<strong>ChatGPT, Claude, Gemini, Base44, Lovable, n8n, Make</strong> ועוד) מתחברים לאותו שרת MCP דרך <strong>כתובת URL מתארחת</strong> (Streamable HTTP) במקום <code>npx</code> — וחושפים את כל <strong>112 הכלים</strong>. השלבים זהים בכל מקום; רק היכן שמדביקים את ה-URL ואיך מאמתים משתנה.',
    en: 'Cloud-based tools that can\'t run a local process (<strong>ChatGPT, Claude, Gemini, Base44, Lovable, n8n, Make</strong> and more) connect to the same MCP server through a <strong>hosted URL</strong> (Streamable HTTP) instead of <code>npx</code> — exposing all <strong>112 tools</strong>. The steps are identical everywhere; only where you paste the URL and how you authenticate changes.',
  },
  remoteUrlLabel: { he: 'כתובת השרת (Server URL)', en: 'Server URL' },
  remoteUrl: MCP_REMOTE_URL,
  remoteAuthTitle: { he: 'אימות — שתי אפשרויות', en: 'Authentication — two options' },
  remoteAuthNote: {
    he: 'השרת תומך בשתי דרכים להתחבר; בחרו את זו שהכלי שלכם מציע:<br/>' +
        '<strong>1) OAuth 2.0 (הכי קל)</strong> — הדביקו רק את ה-Server URL והכלי יפתח מסך התחברות (OAuth → PKCE → רישום לקוח דינמי). אידיאלי למחברי ChatGPT/Claude וכל כלי שמציע "Add custom connector" עם URL בלבד — ללא העתקת טוקן ידנית.<br/>' +
        '<strong>2) Bearer Token</strong> — כותרת HTTP <code>Authorization: Bearer gmbt_your_token_here</code> (או הדביקו את ה-Gambot Token בשדה ה-API Key / Token). כך או כך הארגון מזוהה אוטומטית מהזהות שלכם.',
    en: 'The server supports two ways to connect; pick whichever your tool offers:<br/>' +
        '<strong>1) OAuth 2.0 (easiest)</strong> — paste only the Server URL and the tool launches a sign-in screen (OAuth → PKCE → Dynamic Client Registration). Ideal for ChatGPT/Claude connectors and any tool that offers "Add custom connector" with just a URL — no manual token copying.<br/>' +
        '<strong>2) Bearer Token</strong> — HTTP header <code>Authorization: Bearer gmbt_your_token_here</code> (or paste the Gambot Token into the API Key / Token field). Either way the organization is resolved automatically from your identity.',
  },
  remoteManifestNote: {
    he: 'גילוי אוטומטי (Manifest): כלים תומכי-OAuth קוראים את המטא-דאטה מ-<code>/.well-known/oauth-protected-resource/mcp</code> ו-<code>/.well-known/oauth-authorization-server</code>. בריאות השרת: <code>/health</code>.',
    en: 'Auto-discovery (Manifest): OAuth-capable tools read the metadata from <code>/.well-known/oauth-protected-resource/mcp</code> and <code>/.well-known/oauth-authorization-server</code>. Server health: <code>/health</code>.',
  },
  remoteStepsTitle: { he: 'שלבים כלליים (עובדים בכל כלי)', en: 'Generic steps (work in every tool)' },
  remoteSteps: {
    he: [
      'בכלי שלכם, פתחו היכן שמוסיפים שרתי/מחברי MCP (בדרך כלל: Settings → Connectors / Integrations / MCP Servers).',
      'בחרו סוג שרת <strong>Remote / URL / HTTP</strong> (לא Local/Command).',
      'הדביקו את ה-Server URL שלמעלה.',
      'אמתו: אם הכלי מציע <strong>OAuth / Sign in</strong> — פשוט התחברו (ללא טוקן). אחרת הוסיפו כותרת <code>Authorization: Bearer gmbt_...</code> או הדביקו את הטוקן בשדה ה-Token/API Key.',
      'שמרו והפעילו. הכלי מגלה אוטומטית את כל 112 הכלים והארגון מזוהה מהזהות שלכם.',
    ],
    en: [
      'In your tool, open where MCP servers/connectors are added (usually: Settings → Connectors / Integrations / MCP Servers).',
      'Choose a <strong>Remote / URL / HTTP</strong> server type (not Local/Command).',
      'Paste the Server URL above.',
      'Authenticate: if the tool offers <strong>OAuth / Sign in</strong> — just sign in (no token). Otherwise add an <code>Authorization: Bearer gmbt_...</code> header or paste the token into the Token/API Key field.',
      'Save and enable. The tool auto-discovers all 112 tools and the organization is resolved from your identity.',
    ],
  },
  remoteConfigTitle: { he: 'לכלים שמשתמשים בקובץ תצורה (JSON)', en: 'For tools that use a config file (JSON)' },
  remoteConfigNote: {
    he: 'כלים שתומכים בשרת MCP מרוחק דרך JSON (למשל Cursor, VS Code, Windsurf) — השתמשו בבלוק הזה:',
    en: 'Tools that support a remote MCP server via JSON (e.g. Cursor, VS Code, Windsurf) — use this block:',
  },
  remoteConfig: `{
  "mcpServers": {
    "gambot": {
      "url": "${MCP_REMOTE_URL}",
      "headers": { "Authorization": "Bearer gmbt_your_token_here" }
    }
  }
}`,
  remoteTip: {
    he: 'טיפ: אם כלי מבקש רק "URL" ללא אפשרות כותרות, בדרך כלל ניתן לצרף את הטוקן כפרמטר query — <code>' + MCP_REMOTE_URL + '?token=gmbt_your_token_here</code>. העדיפו את כותרת ה-<code>Authorization</code> כשאפשר.',
    en: 'Tip: if a tool only asks for a "URL" with no headers option, you can usually append the token as a query param — <code>' + MCP_REMOTE_URL + '?token=gmbt_your_token_here</code>. Prefer the <code>Authorization</code> header whenever possible.',
  },

  toolsNote: {
    he: 'לאחר החיבור, הסוכן יכול לקרוא לכלים כמו <code>gambot_send_text</code>, <code>gambot_create_lead</code>, <code>gambot_issue_invoice</code>, <code>gambot_create_user</code> ועוד (112 כלים). לתבניות עם מדיה, כפתורים ו-Footer: <code>gambot_create_template</code> (העבירו <code>headerMediaUrl</code>) ו-<code>gambot_upload_template_media</code>. <strong>בניית בוטים בשיחה</strong>: <code>gambot_create_keyword_autoreply</code>, <code>gambot_create_template_button_autoreply</code>, <code>gambot_create_menu_bot</code>, וכן <code>gambot_create_bot</code>/<code>gambot_list_bots</code>/<code>gambot_get_bot</code>/<code>gambot_set_bot_status</code>/<code>gambot_delete_bot</code> — ראו את סעיף <a href="#bots">בוטים ואוטומציות</a>.',
    en: 'Once connected, the agent can call tools like <code>gambot_send_text</code>, <code>gambot_create_lead</code>, <code>gambot_issue_invoice</code>, <code>gambot_create_user</code> and more (112 tools). For templates with media, buttons and footer: <code>gambot_create_template</code> (pass <code>headerMediaUrl</code>) and <code>gambot_upload_template_media</code>. <strong>Build bots by chatting</strong>: <code>gambot_create_keyword_autoreply</code>, <code>gambot_create_template_button_autoreply</code>, <code>gambot_create_menu_bot</code>, plus <code>gambot_create_bot</code>/<code>gambot_list_bots</code>/<code>gambot_get_bot</code>/<code>gambot_set_bot_status</code>/<code>gambot_delete_bot</code> — see the <a href="#bots">Bots &amp; Automations</a> section.',
  },
};

export const DEV_GUIDE_TX = {
  he: {
    badge: '🚀 למפתחים',
    title: 'מדריך למפתחים — Gambot API',
    sub: 'ה-API הרשמי של Gambot לשליחת הודעות, ניהול תבניות, אנשי קשר, לידים ועוד.',
    onThisPage: 'בעמוד זה',
    baseUrlLabel: 'כתובת בסיס',
    scopeLabel: 'הרשאה',
    requestBody: 'גוף הבקשה',
    exampleRequest: 'בקשה לדוגמה',
    exampleResponse: 'תגובה לדוגמה',
    moreExamples: 'דוגמאות נוספות',
    params: 'פרמטרים',
    name: 'שם',
    type: 'סוג',
    required: 'חובה',
    location: 'מיקום',
    description: 'תיאור',
    yes: 'כן',
    no: 'לא',
    copy: 'העתק',
    copied: 'הועתק!',
    scopesTitle: 'הרשאות (Scopes)',
    scopesIntro: 'ברירת מחדל: הטוקן מורשה לכל הפעולות. ניתן לצמצם הרשאות בהגדרות.',
    ctaTitle: '🚀 מוכנים להתחיל?',
    ctaBody: 'קחו את ה-Gambot Token שלכם מההגדרות ושלחו את הבקשה הראשונה שלכם.',
    ctaBtn: 'פתחו חשבון חינם',
  },
  en: {
    badge: '🚀 Developers',
    title: 'Developer Guide — Gambot API',
    sub: 'The official Gambot API for sending messages, managing templates, contacts, leads and more.',
    onThisPage: 'On this page',
    baseUrlLabel: 'Base URL',
    scopeLabel: 'Scope',
    requestBody: 'Request body',
    exampleRequest: 'Example request',
    exampleResponse: 'Example response',
    moreExamples: 'More examples',
    params: 'Parameters',
    name: 'Name',
    type: 'Type',
    required: 'Required',
    location: 'In',
    description: 'Description',
    yes: 'Yes',
    no: 'No',
    copy: 'Copy',
    copied: 'Copied!',
    scopesTitle: 'Permissions (Scopes)',
    scopesIntro: 'Default: the token is allowed for all operations. You can narrow permissions in Settings.',
    ctaTitle: '🚀 Ready to start?',
    ctaBody: 'Grab your Gambot Token from Settings and send your first request.',
    ctaBtn: 'Create a free account',
  },
};

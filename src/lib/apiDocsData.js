// Structured, bilingual reference for the Gambot public REST API (api/v1).
// Consumed by the Developer Guide page (/developers). Each endpoint mirrors a real backend route.

export const API_BASE = 'https://api.gambot.co.il/api/v1';
export const API_BASE_FALLBACK = 'https://gambot.azurewebsites.net/api/v1';
// Hosted (online) MCP endpoint — Streamable HTTP. Used by web-based AI tools that can't run a local process
// (ChatGPT, Claude, Gemini, Base44, Lovable, n8n, Make, …). Verified live: Azure Web App "gambot-mcp"
// (Gambot_Resource_Group), Node 22, `node dist/http.js`. Auth: OAuth 2.0 (PKCE + DCR) or Bearer gmbt_ token.
// Discovery: /.well-known/oauth-protected-resource/mcp and /.well-known/oauth-authorization-server. 98 tools.
export const MCP_REMOTE_URL = 'https://gambot-mcp.azurewebsites.net/mcp';

// -- Intro / auth / conventions ----------------------------------------------------------
export const API_INTRO = {
  baseUrl: {
    he: '????? ????? ?? ?-API',
    en: 'API base URL',
  },
  auth: {
    title: { he: '?????', en: 'Authentication' },
    body: {
      he: `?? ???? ?????? ??????? <strong>?-Gambot Token</strong> ?? ?????? (????? ?-<code>gmbt_</code>). ??? ???? ???? ????? ?? ?-Webhooks. ?????? ???? ???? ????? ??????:`,
      en: `Every request is authenticated with your organization's <strong>Gambot Token</strong> (starts with <code>gmbt_</code>) — the same token used for Webhooks. Send it in one of three ways:`,
    },
    methods: {
      he: [
        '????? <code>Authorization: Bearer gmbt_...</code> (?????)',
        '????? <code>X-Api-Key: gmbt_...</code>',
        '????? ?-URL <code>?api_key=gmbt_...</code> (?? ????? ?????, ???? Zapier)',
      ],
      en: [
        'Header <code>Authorization: Bearer gmbt_...</code> (recommended)',
        'Header <code>X-Api-Key: gmbt_...</code>',
        'Query param <code>?api_key=gmbt_...</code> (only when unavoidable, e.g. Zapier)',
      ],
    },
    where: {
      he: '?? ????? ?????? ????? ?????? ??? <strong>?????? ? ????</strong>. ?-API ???? ?????? ???? — ??? ???? ?????? ?????.',
      en: 'Find your token in the admin panel under <strong>Settings ? General</strong>. The API is enabled by default — no extra setup required.',
    },
    security: {
      he: '???? ?? ????? ???? (??? ?????). ???? ???? ????? ???? ?????? ???????.',
      en: 'Keep the token secret (like a password). Leaked? Rotate it in one click from Settings.',
    },
  },
  envelope: {
    title: { he: '???? ??????', en: 'Response envelope' },
    body: {
      he: '?? ??????? ??????? ?????? ?????:',
      en: 'All responses are returned in a consistent envelope:',
    },
    example: `{
  "success": true,
  "message": "…",
  "data": { }
}`,
  },
  errors: {
    title: { he: '??????', en: 'Errors' },
    rows: [
      { code: '401', key: 'missing_api_key / invalid_api_key', he: '???? ??? ?? ????', en: 'Token missing or invalid' },
      { code: '403', key: 'api_disabled', he: '?-API ???? ?????? ??', en: 'API is disabled for this organization' },
      { code: '403', key: 'insufficient_scope', he: '????? ??? ????? ??????', en: 'The token lacks the required scope' },
      { code: '400', key: 'missing_fields', he: '???? ???? ????? ?????', en: 'Required fields are missing' },
      { code: '404', key: 'not_found', he: '????? ?? ????', en: 'Resource not found' },
      { code: '502', key: 'send_failed', he: '?????? ????? (???? ??? WhatsApp)', en: 'Send failed (WhatsApp-side issue)' },
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
    title: { he: '?????? WhatsApp', en: 'WhatsApp Messages' },
    description: {
      he: '????? ?????? ???? ????? ??????? ???????.',
      en: 'Send free-text messages and templates to customers.',
    },
    endpoints: [
      {
        method: 'POST',
        path: '/messages/send-text',
        scope: 'messages:send',
        summary: {
          he: '????? ????? ???? ?????. ???? ?? ???? ???? 24 ????? (??? ?????? ??????? ?? ?????); ????? ?? ?? ????? ?????.',
          en: 'Send a free-text message. Only allowed inside the 24-hour window (since the customer\'s last message); outside it, send a template.',
        },
        params: [
          { name: 'to', in: 'body', type: 'string', required: true, desc: { he: '???? ????? ?????? ???????? (9725...). ???? ?? phoneNumber.', en: 'Recipient in international format (9725...). phoneNumber also accepted.' } },
          { name: 'text', in: 'body', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Message body.' } },
          { name: 'from', in: 'body', type: 'string', required: false, desc: { he: '?????? ?? ??? ??????: ????? ???? ????? — ???? ????? ?? phoneNumberId (??? GET /numbers). ????? ????: ????? ?????.', en: 'Multi-number orgs: which number to send FROM — a display number or phoneNumberId (see GET /numbers). Defaults to the primary number.' } },
        ],
        request: `{
  "to": "972501234567",
  "text": "????! ???? ????? ????? ??"
}`,
        curl: curl('POST', '/messages/send-text', `{ "to": "972501234567", "text": "Hello!" }`),
        response: `{
  "success": true,
  "message": "Message sent",
  "data": { "messageId": "wamid.HBg…" }
}`,
      },
      {
        method: 'POST',
        path: '/messages/send-template',
        scope: 'messages:send',
        summary: {
          he: '????? ????? ?????? ?? ??????. ???? ????? ???? ???? ?? ???? ????? 24 ?????.',
          en: 'Send an approved template with variables. Can initiate a conversation even outside the 24-hour window.',
        },
        params: [
          { name: 'to', in: 'body', type: 'string', required: true, desc: { he: '???? ?????. ???? ?? phoneNumber.', en: 'Recipient. phoneNumber also accepted.' } },
          { name: 'templateId', in: 'body', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Template id.' } },
          { name: 'variables', in: 'body', type: 'string[]', required: false, desc: { he: '????? ?-Body ??? ???. ??????? templateVariableQuery.', en: 'Body variables in order. Or use templateVariableQuery.' } },
          { name: 'from', in: 'body', type: 'string', required: false, desc: { he: '?????? ?? ??? ??????: ????? ???? ????? — ???? ????? ?? phoneNumberId (??? GET /numbers). ????? ????: ????? ?????.', en: 'Multi-number orgs: which number to send FROM — a display number or phoneNumberId (see GET /numbers). Defaults to the primary number.' } },
        ],
        request: `{
  "to": "972501234567",
  "templateId": "welcome_new_customer_0626",
  "variables": ["???", "????? #1234"]
}`,
        curl: curl('POST', '/messages/send-template', `{ "to": "972501234567", "templateId": "welcome_0626", "variables": ["Dana"] }`),
        response: `{
  "success": true,
  "message": "Template sent",
  "data": { "messageId": "wamid.HBg…" }
}`,
      },
    ],
  },
  {
    id: 'conversations',
    title: { he: '?????', en: 'Conversations' },
    description: {
      he: '????? ?????, ????????? ?????? ?????? ?????? ?? ??????.',
      en: 'List conversations, read message history and the org\'s sender numbers.',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/numbers',
        scope: 'conversations:read',
        summary: {
          he: '????? ?-WhatsApp ???????? ?????? (????? ??????). ?????? ?-phoneNumberId ?? ????? ?????? ???? "from" ??????, ?? ?-fromNumberId ???????. ??????? ?????? ?? ??? ??????.',
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
          he: '????? ????? (???? ???) ??? ?????? ???????.',
          en: 'List conversations (contacts) ordered by most recent message.',
        },
        params: [
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 50 (??????? 200).', en: 'Default 50 (max 200).' } },
          { name: 'search', in: 'query', type: 'string', required: false, desc: { he: '????? ?????.', en: 'Free-text search.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/conversations?pageSize=50&search=???" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "pageNumber": 1,
    "pageSize": 50,
    "count": 2,
    "items": [ { "phoneNumber": "972501234567", "name": "???", "lastMessage": "…" } ]
  }
}`,
      },
      {
        method: 'GET',
        path: '/conversations/{phone}/messages',
        scope: 'conversations:read',
        summary: {
          he: '????????? ?????? ?? ???? ????? (?????? ??? ???? ?????).',
          en: 'Message history for a single conversation (paginated by message id).',
        },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: '???? ?????.', en: 'Customer phone number.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 50 (??????? 200).', en: 'Default 50 (max 200).' } },
          { name: 'before', in: 'query', type: 'string', required: false, desc: { he: '??? ?????? ???? messageId ??.', en: 'Fetch messages before this messageId.' } },
          { name: 'after', in: 'query', type: 'string', required: false, desc: { he: '??? ?????? ???? messageId ??.', en: 'Fetch messages after this messageId.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/conversations/972501234567/messages?pageSize=50" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": { "messages": [ { "id": "…", "text": "…", "direction": "in", "time": "…" } ] }
}`,
      },
    ],
  },
  {
    id: 'templates',
    title: { he: '??????', en: 'Templates' },
    description: {
      he: '????? ?????? WhatsApp — ?????, ?????, ?????? ??????. ????? ?????? ????? ?-Header ???? ?? ???? (?????/?????/????), Body ?? ?????? {{1}}, Footer ???????? (Quick Reply / URL / ?????). ??? ??????? ????? ????.',
      en: 'Manage WhatsApp templates — list, details, variables and creation. Template creation supports a text or media (image/video/document) Header, a Body with {{1}} variables, a Footer and Buttons (Quick Reply / URL / Phone). See full examples below.',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/templates',
        scope: 'templates:read',
        summary: { he: '?? ??????? ?? ??????.', en: 'All templates for the organization.' },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/templates" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": [ { "id": "…", "name": "welcome_0626", "language": "he", "status": "APPROVED" } ]
}`,
      },
      {
        method: 'GET',
        path: '/templates/{templateId}',
        scope: 'templates:read',
        summary: { he: '????? ????? ???? ????? ?????? ?? Meta.', en: 'A single template incl. Meta approval status.' },
        params: [
          { name: 'templateId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Template id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/templates/welcome_0626" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": { "id": "…", "name": "welcome_0626", "status": "APPROVED", "components": [ … ] }
}`,
      },
      {
        method: 'GET',
        path: '/templates/{templateId}/variables',
        scope: 'templates:read',
        summary: { he: '??????? ???????? ?? ??????.', en: 'The template\'s dynamic variables.' },
        params: [
          { name: 'templateId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Template id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/templates/welcome_0626/variables" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": [ { "key": "dynamic_var1", "label": "??" } ]
}`,
      },
      {
        method: 'POST',
        path: '/templates',
        scope: 'templates:write',
        summary: {
          he: '????? ????? ???? (????? ?-Meta ??????). ???? ?-Header ????/????, Body ?? ??????, Footer ????????. ???? ?????? ????? ???????, lowercase_with_underscores.',
          en: 'Create a new template (submitted to Meta for approval). Supports text/media Header, Body with variables, Footer and Buttons. Names must be English, lowercase_with_underscores.',
        },
        params: [
          { name: 'name', in: 'body', type: 'string', required: true, desc: { he: '?? ?????? (??????, ?? ?????).', en: 'Template name (English, underscores).' } },
          { name: 'language', in: 'body', type: 'string', required: true, desc: { he: '??? ???, ???? he / en.', en: 'Language code, e.g. he / en.' } },
          { name: 'category', in: 'body', type: 'string', required: true, desc: { he: 'MARKETING / UTILITY / AUTHENTICATION.', en: 'MARKETING / UTILITY / AUTHENTICATION.' } },
          { name: 'components', in: 'body', type: 'object[]', required: true, desc: { he: '????? ??????: HEADER (TEXT ?? IMAGE/VIDEO/DOCUMENT), BODY, FOOTER, BUTTONS. ??? ??????? ????.', en: 'Template components: HEADER (TEXT or IMAGE/VIDEO/DOCUMENT), BODY, FOOTER, BUTTONS. See examples below.' } },
          { name: 'headerMediaUrl', in: 'body', type: 'string', required: false, desc: { he: '?????: ????? URL ??????? ?? ????. Gambot ???? ???? ?-Meta ?????? ?? ?-header_handle ????? ?-HEADER ????????.', en: 'Shortcut: a public media URL. Gambot uploads it to Meta and injects the header_handle into the HEADER component automatically.' } },
          { name: 'headerFormat', in: 'body', type: 'string', required: false, desc: { he: '????? ?-headerMediaUrl: IMAGE / VIDEO / DOCUMENT (????? ???? IMAGE).', en: 'Format for headerMediaUrl: IMAGE / VIDEO / DOCUMENT (default IMAGE).' } },
          { name: 'gmbtMediaId', in: 'body', type: 'string', required: false, desc: { he: '???? ???? ?? Gambot (?????? ??????). ???? ????? ????????? ?-headerMediaUrl.', en: 'Gambot media id (for preview). Usually unnecessary when using headerMediaUrl.' } },
        ],
        request: `{
  "name": "order_confirmation_0626",
  "language": "he",
  "category": "UTILITY",
  "components": [
    { "type": "HEADER", "format": "TEXT", "text": "????? {{1}}", "example": { "header_text": ["1234"] } },
    { "type": "BODY", "text": "???? {{1}}, ?????? {{2}} ?????? ??????!", "example": { "body_text": [["???", "1234"]] } },
    { "type": "FOOTER", "text": "Gambot • ????? ??????" },
    { "type": "BUTTONS", "buttons": [
      { "type": "QUICK_REPLY", "text": "???? ?????" },
      { "type": "URL", "text": "????? ????", "url": "https://shop.co.il/orders/{{1}}", "example": ["1234"] },
      { "type": "PHONE_NUMBER", "text": "?????? ?????", "phone_number": "+972500000000" }
    ] }
  ]
}`,
        curl: curl('POST', '/templates', `{ "name": "order_confirmation_0626", "language": "he", "category": "UTILITY", "components": [ { "type": "BODY", "text": "…{{1}}" } ] }`),
        response: `{
  "success": true,
  "message": "Template created",
  "data": { "id": "…", "status": "PENDING" }
}`,
        examples: [
          {
            label: { he: '1) ???? ???? (Body + ?????)', en: '1) Text only (Body + variable)' },
            code: curl('POST', '/templates', `{
  "name": "welcome_new_customer_0626",
  "language": "he",
  "category": "MARKETING",
  "components": [
    { "type": "BODY", "text": "???? {{1}}! ???? ?????? ??", "example": { "body_text": [["???"]] } }
  ]
}`),
          },
          {
            label: { he: '2) Header ???? + Footer', en: '2) Text header + Footer' },
            code: curl('POST', '/templates', `{
  "name": "appointment_reminder_0626",
  "language": "he",
  "category": "UTILITY",
  "components": [
    { "type": "HEADER", "format": "TEXT", "text": "?????? ????" },
    { "type": "BODY", "text": "??? {{1}}, ?? ?? ??? ?-{{2}}.", "example": { "body_text": [["???", "10:00"]] } },
    { "type": "FOOTER", "text": "???? ???? ?? 24 ???? ????" }
  ]
}`),
          },
          {
            label: { he: '3) Header ????? — ????? headerMediaUrl (?????? ???)', en: '3) Image header — headerMediaUrl shortcut (single call)' },
            code: curl('POST', '/templates', `{
  "name": "promo_summer_sale_0626",
  "language": "he",
  "category": "MARKETING",
  "headerMediaUrl": "https://cdn.example.com/summer.jpg",
  "headerFormat": "IMAGE",
  "components": [
    { "type": "BODY", "text": "???? ???! ?? 50% ???? ?-{{1}} ????.", "example": { "body_text": [["????"]] } },
    { "type": "FOOTER", "text": "????? ?? ??? ?????" },
    { "type": "BUTTONS", "buttons": [ { "type": "URL", "text": "?????", "url": "https://shop.co.il" } ] }
  ]
}`),
          },
          {
            label: { he: '4) Header ????? — ?? header_handle ?????? ???? (??? POST /templates/media)', en: '4) Image header — with a pre-uploaded header_handle (see POST /templates/media)' },
            code: curl('POST', '/templates', `{
  "name": "receipt_document_0626",
  "language": "he",
  "category": "UTILITY",
  "components": [
    { "type": "HEADER", "format": "DOCUMENT", "example": { "header_handle": ["4::aW1hZ2Uv...<handle-from-upload>"] } },
    { "type": "BODY", "text": "?????? ??????? ???? ????? {{1}}.", "example": { "body_text": [["1234"]] } }
  ]
}`),
          },
          {
            label: { he: '5) Header ?????', en: '5) Video header' },
            code: curl('POST', '/templates', `{
  "name": "product_demo_0626",
  "language": "he",
  "category": "MARKETING",
  "headerMediaUrl": "https://cdn.example.com/demo.mp4",
  "headerFormat": "VIDEO",
  "components": [
    { "type": "BODY", "text": "??? ?????? ?? {{1}} ??", "example": { "body_text": [["????? ????"]] } }
  ]
}`),
          },
          {
            label: { he: '6) ??????? — Quick Reply + URL ????? + ?????', en: '6) Buttons — Quick Reply + dynamic URL + phone' },
            code: curl('POST', '/templates', `{
  "name": "order_shipped_0626",
  "language": "he",
  "category": "UTILITY",
  "components": [
    { "type": "BODY", "text": "?????? {{1}} ?????! ??", "example": { "body_text": [["1234"]] } },
    { "type": "BUTTONS", "buttons": [
      { "type": "QUICK_REPLY", "text": "??????, ????" },
      { "type": "URL", "text": "???? ?????", "url": "https://track.co.il/{{1}}", "example": ["1234"] },
      { "type": "PHONE_NUMBER", "text": "?????? ?????", "phone_number": "+972500000000" }
    ] }
  ]
}`),
          },
          {
            label: { he: '7) MCP — ??? gambot_create_template (?? ????, ??????? ?-Footer)', en: '7) MCP — gambot_create_template tool (media + buttons + footer)' },
            code: `// MCP tool call — gambot_create_template
{
  "name": "promo_summer_sale_0626",
  "language": "he",
  "category": "MARKETING",
  "headerMediaUrl": "https://cdn.example.com/summer.jpg",
  "headerFormat": "IMAGE",
  "components": [
    { "type": "BODY", "text": "???? ???! ?? 50% ????.", "example": { "body_text": [["????"]] } },
    { "type": "FOOTER", "text": "????? ?? ??? ?????" },
    { "type": "BUTTONS", "buttons": [ { "type": "QUICK_REPLY", "text": "??? ????!" } ] }
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
          he: '????? ???? (?????/?????/????) ?????? URL ??????? ?-Meta, ????? header_handle ?????? ???? ????? HEADER ?? ?????.',
          en: 'Upload media (image/video/document) from a public URL to Meta and get a reusable header_handle for a template HEADER component.',
        },
        params: [
          { name: 'url', in: 'body', type: 'string', required: true, desc: { he: '????? URL ??????? ?? ?????.', en: 'Public URL of the media.' } },
          { name: 'type', in: 'body', type: 'string', required: false, desc: { he: '??? MIME (???? image/png, video/mp4, application/pdf).', en: 'MIME type (e.g. image/png, video/mp4, application/pdf).' } },
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
    "gmbtMediaId": "…",
    "mediaId": "…",
    "mediaUrl": "https://cdn.example.com/summer.jpg"
  }
}`,
        examples: [
          {
            label: { he: 'MCP — ??? gambot_upload_template_media', en: 'MCP — gambot_upload_template_media tool' },
            code: `// MCP tool call — gambot_upload_template_media
{ "url": "https://cdn.example.com/summer.jpg", "type": "image/jpeg" }
// ? returns { headerHandle } to place in a HEADER component's example.header_handle`,
          },
        ],
      },
    ],
  },
  {
    id: 'contacts',
    title: { he: '???? ???', en: 'Contacts' },
    description: {
      he: '?????, ????? ?????? ?? ???? ???, ???? ???? ???? ????? ??????? (Custom Fields).',
      en: 'Create, fetch and update contacts, including base and dynamic (custom) fields.',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/contacts/fields',
        scope: 'contacts:read',
        summary: {
          he: '?????? ????? ?? ???? ??? (???? + ???????). ????? ??? ?????? ???????? ?????? ??????? ???? ????? — ?????? ???? ??? customFields.',
          en: 'Contact field definitions (base + dynamic). For contacts, dynamic values are stored as top-level keys — send them under customFields.',
        },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/contacts/fields" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": { "count": 8, "fields": [
    { "Name": "name", "Type": "text", "Label": "??", "Options": null },
    { "Name": "city", "Type": "select", "Label": "???", "Options": ["?? ????", "????"] }
  ] }
}`,
      },
      {
        method: 'GET',
        path: '/contacts/ctwa',
        scope: 'contacts:read',
        summary: {
          he: '???? ??? ?????? ?????? Click-to-WhatsApp (CTWA) — ?? ??? ?? ???? ?????? ????? ????.',
          en: 'Contacts created from a Click-to-WhatsApp (CTWA) ad — each enriched with the originating ad info.',
        },
        params: [
          { name: 'adId', in: 'query', type: 'string', required: false, desc: { he: '????? ?????? ??? (referralSourceId).', en: 'Only contacts from this ad (referralSourceId).' } },
          { name: 'sourceType', in: 'query', type: 'string', required: false, desc: { he: '???? ??????: ad ?? post.', en: 'Referral origin: ad or post.' } },
          { name: 'dateFrom', in: 'query', type: 'string', required: false, desc: { he: '????? ????? yyyy-MM-dd (??? ????? ????? ??? ????).', en: 'Start date yyyy-MM-dd (on contact creation date).' } },
          { name: 'dateTo', in: 'query', type: 'string', required: false, desc: { he: '????? ???? yyyy-MM-dd (????).', en: 'End date yyyy-MM-dd (inclusive).' } },
          { name: 'pageNumber', in: 'query', type: 'integer', required: false, desc: { he: '???? ???? (????? ???? 1).', en: 'Page number (default 1).' } },
          { name: 'pageSize', in: 'query', type: 'integer', required: false, desc: { he: '???? ???? 1–200 (????? ???? 30).', en: 'Page size 1–200 (default 30).' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/contacts/ctwa?sourceType=ad&pageSize=20" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": { "pageNumber": 1, "pageSize": 20, "count": 1, "total": 1, "items": [
    {
      "phoneNumber": "972501234567",
      "name": "??? ???",
      "email": "",
      "ownerId": "…", "ownerName": "…",
      "createdOn": "2026-09-14 10:22:11",
      "keys": ["Leads", "Referral-ad"],
      "ctwa": {
        "adId": "120200000000000",
        "sourceType": "ad",
        "headline": "???? ??? 50% ????",
        "body": "…",
        "sourceUrl": "https://fb.me/…",
        "platform": "facebook",
        "ctwaClid": "ARA…"
      }
    }
  ] }
}`,
      },
      {
        method: 'POST',
        path: '/contacts',
        scope: 'contacts:write',
        summary: { he: '????? ??? ??? (?? ???? — ????? ?????). ???? ???? ??????? ??? customFields.', en: 'Create a contact (returns the existing one if the phone is known). Includes dynamic fields under customFields.' },
        params: [
          { name: 'phoneNumber', in: 'body', type: 'string', required: true, desc: { he: '???? ??????. ???? ?? to.', en: 'Phone number. to also accepted.' } },
          { name: 'name', in: 'body', type: 'string', required: false, desc: { he: '??.', en: 'Name.' } },
          { name: 'email', in: 'body', type: 'string', required: false, desc: { he: '??????.', en: 'Email.' } },
          { name: 'keys', in: 'body', type: 'string[]', required: false, desc: { he: '?????/?????? (????? ???? Leads).', en: 'Tags/lists (default Leads).' } },
          { name: 'customFields', in: 'body', type: 'object', required: false, desc: { he: '???? ??????? (?????? ??????? ???? ?????). ??? GET /contacts/fields.', en: 'Dynamic fields (written as top-level keys). See GET /contacts/fields.' } },
        ],
        request: `{
  "phoneNumber": "972501234567",
  "name": "??? ???",
  "email": "dana@example.com",
  "keys": ["Leads", "VIP"],
  "customFields": { "city": "?? ????", "birthday": "1990-05-01" }
}`,
        curl: curl('POST', '/contacts', `{ "phoneNumber": "972501234567", "name": "Dana", "customFields": { "city": "?? ????" } }`),
        response: `{ "success": true, "message": "Contact created", "data": { "id": "…" } }`,
      },
      {
        method: 'GET',
        path: '/contacts/{phone}',
        scope: 'contacts:read',
        summary: { he: '????? ??? ??? ??? ???? ?????.', en: 'Fetch a contact by phone number.' },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Phone number.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/contacts/972501234567" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "phoneNumber": "972501234567", "name": "??? ???" } }`,
      },
      {
        method: 'PATCH',
        path: '/contacts/{phone}',
        scope: 'contacts:write',
        summary: { he: '????? ??? ??? — ?? ????? ??????. ???? ???? ??????? ??? customFields. ???? ?? POST.', en: 'Update a contact — only provided fields, incl. dynamic fields under customFields. POST also accepted.' },
        params: [
          { name: 'phone', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Phone number.' } },
          { name: 'name', in: 'body', type: 'string', required: false, desc: { he: '??.', en: 'Name.' } },
          { name: 'email', in: 'body', type: 'string', required: false, desc: { he: '??????.', en: 'Email.' } },
          { name: 'keys', in: 'body', type: 'string[]', required: false, desc: { he: '?????/??????.', en: 'Tags/lists.' } },
          { name: 'customFields', in: 'body', type: 'object', required: false, desc: { he: '???? ???????.', en: 'Dynamic fields.' } },
        ],
        request: `{ "name": "??? ???", "keys": ["Customers"], "customFields": { "city": "????" } }`,
        curl: curl('PATCH', '/contacts/972501234567', `{ "name": "Dana Cohen", "customFields": { "city": "????" } }`),
        response: `{ "success": true, "message": "Contact updated" }`,
      },
    ],
  },
  {
    id: 'leads',
    title: { he: '?????', en: 'Leads' },
    description: {
      he: '?????, ?????, ????? ?????? ?? ????? — ???? ?? ???? ????? ????? ??????? (customFields).',
      en: 'Create, fetch, list and update leads — including all base fields and dynamic fields (customFields).',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/leads/fields',
        scope: 'leads:read',
        summary: {
          he: '?????? ???? ???? — ???? (baseFields) + ??????? (customFields). ?????? ?????? ???????? ?????? ???? ?????? ??? customFields.',
          en: 'Lead field definitions — baseFields + customFields. For leads, dynamic values are stored in a nested customFields map.',
        },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/leads/fields" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "baseFields": ["title", "contactPhone", "value", "priority", "source", "status", "stageId", "..."],
    "customFields": [ { "key": "budget", "label": "?????", "type": "number" }, { "key": "region", "label": "????", "type": "select", "options": ["????", "????"] } ]
  }
}`,
      },
      {
        method: 'GET',
        path: '/leads',
        scope: 'leads:read',
        summary: { he: '????? ????? (?? ????? ??????).', en: 'List leads (paginated + search).' },
        params: [
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 50 (???? 200).', en: 'Default 50 (max 200).' } },
          { name: 'search', in: 'query', type: 'string', required: false, desc: { he: '????? ?????.', en: 'Free-text search.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/leads?pageSize=50" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "total": 12, "count": 12, "items": [ { "id": "…", "title": "…" } ] } }`,
      },
      {
        method: 'GET',
        path: '/leads/{leadId}',
        scope: 'leads:read',
        summary: { he: '????? ??? ???? ??? ????.', en: 'Fetch a single lead by id.' },
        params: [
          { name: 'leadId', in: 'path', type: 'string', required: true, desc: { he: '???? ????.', en: 'Lead id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/leads/LEAD_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "LEAD_ID", "title": "…", "status": "…" } }`,
      },
      {
        method: 'POST',
        path: '/leads',
        scope: 'leads:write',
        summary: { he: '????? ??? CRM (??? ??? ???? ?? ???, ????? ????? ?????). ???? ?? ?? ???? ????? + customFields.', en: 'Create a CRM lead (contact created if missing, optional template send). Accepts all base fields + customFields.' },
        params: [
          { name: 'lead', in: 'body', type: 'object', required: true, desc: { he: '??????? ????: PhoneNumber (????), Name, Email, ??? ??? ???? (title, value, priority, source, status, stageId, companyName…) + customFields.', en: 'Lead object: PhoneNumber (required), Name, Email, and any base field (title, value, priority, source, status, stageId, companyName…) + customFields.' } },
          { name: 'templateMessageData', in: 'body', type: 'object', required: false, desc: { he: '????? ?????? ?????? ????.', en: 'Template to send immediately to the lead.' } },
        ],
        request: `{
  "lead": {
    "PhoneNumber": "972501234567",
    "Name": "??? ???",
    "Email": "dana@example.com",
    "title": "????? ?????",
    "value": "2500",
    "currency": "ILS",
    "priority": "high",
    "source": "website",
    "companyName": "Acme",
    "customFields": { "budget": "5000", "region": "????" }
  }
}`,
        curl: curl('POST', '/leads', `{ "lead": { "PhoneNumber": "972501234567", "Name": "Dana", "title": "Website lead", "customFields": { "budget": "5000" } } }`),
        response: `{ "success": true, "message": "Lead created successfully.", "data": { "leadId": "…" } }`,
      },
      {
        method: 'PATCH',
        path: '/leads/{leadId}',
        scope: 'leads:write',
        summary: { he: '????? ??? — ?? ??? ???? + customFields (????? ?? ?????). ???? ?? POST.', en: 'Update a lead — any base field + customFields (merged with existing). POST also accepted.' },
        params: [
          { name: 'leadId', in: 'path', type: 'string', required: true, desc: { he: '???? ????.', en: 'Lead id.' } },
          { name: 'title', in: 'body', type: 'string', required: false, desc: { he: '?????.', en: 'Title.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: '?????.', en: 'Status.' } },
          { name: 'stageId', in: 'body', type: 'string', required: false, desc: { he: '??? ?????????.', en: 'Pipeline stage.' } },
          { name: 'value', in: 'body', type: 'string', required: false, desc: { he: '??? ?????.', en: 'Deal value.' } },
          { name: 'tags', in: 'body', type: 'string[]', required: false, desc: { he: '?????.', en: 'Tags.' } },
          { name: 'customFields', in: 'body', type: 'object', required: false, desc: { he: '???? ??????? (??????? ?? ???????).', en: 'Dynamic fields (merged with existing).' } },
        ],
        request: `{ "status": "in_progress", "value": "1500", "customFields": { "region": "????" } }`,
        curl: curl('PATCH', '/leads/LEAD_ID', `{ "status": "in_progress", "customFields": { "region": "????" } }`),
        response: `{ "success": true, "message": "Lead updated" }`,
      },
    ],
  },
  {
    id: 'cases',
    title: { he: '?????', en: 'Cases' },
    description: {
      he: '?????, ?????, ????? ?????? ?? ????? (Tickets) — ???? ???? ???? ????? ??????? (customFields).',
      en: 'Create, fetch, list and update cases (tickets) — including base and dynamic fields (customFields).',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/cases/fields',
        scope: 'cases:read',
        summary: {
          he: '?????? ???? ?????? — ???? (baseFields) + ??????? (customFields). ?????? ?????? ???????? ?????? ???? ?????? customFields.',
          en: 'Case field definitions — baseFields + customFields. For cases, dynamic values are stored in a nested customFields map.',
        },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/cases/fields" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "baseFields": ["subject", "description", "contactPhone", "category", "priority", "statusId", "stageId", "..."],
    "customFields": [ { "key": "orderNumber", "label": "???? ?????", "type": "text" } ]
  }
}`,
      },
      {
        method: 'GET',
        path: '/cases',
        scope: 'cases:read',
        summary: { he: '????? ????? (?? ????? ??????).', en: 'List cases (paginated + search).' },
        params: [
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 50 (???? 200).', en: 'Default 50 (max 200).' } },
          { name: 'search', in: 'query', type: 'string', required: false, desc: { he: '????? ?????.', en: 'Free-text search.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/cases?pageSize=50" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "total": 5, "count": 5, "items": [ { "id": "…", "subject": "…" } ] } }`,
      },
      {
        method: 'GET',
        path: '/cases/{caseId}',
        scope: 'cases:read',
        summary: { he: '????? ????? ????? ??? ????.', en: 'Fetch a single case by id.' },
        params: [
          { name: 'caseId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Case id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/cases/CASE_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "CASE_ID", "subject": "…", "statusId": "…" } }`,
      },
      {
        method: 'POST',
        path: '/cases',
        scope: 'cases:write',
        summary: { he: '????? ????? ????. ???? category ????? ??????? ??? customFields.', en: 'Create a new case. Includes category and dynamic fields under customFields.' },
        params: [
          { name: 'subject', in: 'body', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Case subject.' } },
          { name: 'description', in: 'body', type: 'string', required: false, desc: { he: '?????.', en: 'Description.' } },
          { name: 'contactPhone', in: 'body', type: 'string', required: false, desc: { he: '????? ???? ???.', en: 'Link to a contact.' } },
          { name: 'priority', in: 'body', type: 'string', required: false, desc: { he: '??????.', en: 'Priority.' } },
          { name: 'category', in: 'body', type: 'string', required: false, desc: { he: '???????.', en: 'Category.' } },
          { name: 'customFields', in: 'body', type: 'object', required: false, desc: { he: '???? ???????. ??? GET /cases/fields.', en: 'Dynamic fields. See GET /cases/fields.' } },
        ],
        request: `{ "subject": "???? ??????", "contactPhone": "972501234567", "priority": "high", "category": "billing", "customFields": { "orderNumber": "1234" } }`,
        curl: curl('POST', '/cases', `{ "subject": "Order issue", "contactPhone": "972501234567", "customFields": { "orderNumber": "1234" } }`),
        response: `{ "success": true, "message": "Case created", "data": { "id": "…" } }`,
      },
      {
        method: 'PATCH',
        path: '/cases/{caseId}',
        scope: 'cases:write',
        summary: { he: '????? ????? — ???? ???? + customFields (????? ?? ?????). ???? ?? POST.', en: 'Update a case — base fields + customFields (merged with existing). POST also accepted.' },
        params: [
          { name: 'caseId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Case id.' } },
          { name: 'statusId', in: 'body', type: 'string', required: false, desc: { he: '?????.', en: 'Status.' } },
          { name: 'priority', in: 'body', type: 'string', required: false, desc: { he: '??????.', en: 'Priority.' } },
          { name: 'category', in: 'body', type: 'string', required: false, desc: { he: '???????.', en: 'Category.' } },
          { name: 'customFields', in: 'body', type: 'object', required: false, desc: { he: '???? ??????? (??????? ?? ???????).', en: 'Dynamic fields (merged with existing).' } },
        ],
        request: `{ "statusId": "closed", "customFields": { "resolution": "refunded" } }`,
        curl: curl('PATCH', '/cases/CASE_ID', `{ "statusId": "closed", "customFields": { "resolution": "refunded" } }`),
        response: `{ "success": true, "message": "Case updated" }`,
      },
    ],
  },
  {
    id: 'tasks',
    title: { he: '??????', en: 'Tasks' },
    description: {
      he: '?????, ?????, ????? ?????? ?? ?????? (?? ????? ????????? ???? ???).',
      en: 'Create, list, fetch and update tasks (optionally linked to a contact).',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/tasks',
        scope: 'tasks:read',
        summary: { he: '????? ??????? ?? ??????.', en: 'List the organization\'s tasks.' },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/tasks" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 3, "items": [ { "id": "…", "title": "…" } ] } }`,
      },
      {
        method: 'GET',
        path: '/tasks/{taskId}',
        scope: 'tasks:read',
        summary: { he: '????? ????? ????? ??? ????.', en: 'Fetch a single task by id.' },
        params: [
          { name: 'taskId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Task id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/tasks/TASK_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "TASK_ID", "title": "…", "status": "open" } }`,
      },
      {
        method: 'PATCH',
        path: '/tasks/{taskId}',
        scope: 'tasks:write',
        summary: { he: '????? ????? — ?? ????? ??????. ???? ?? POST.', en: 'Update a task — only provided fields. POST also accepted.' },
        params: [
          { name: 'taskId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Task id.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: '????? (open/done…).', en: 'Status (open/done…).' } },
          { name: 'priority', in: 'body', type: 'string', required: false, desc: { he: '??????.', en: 'Priority.' } },
          { name: 'dueDate', in: 'body', type: 'string', required: false, desc: { he: '????? ???.', en: 'Due date.' } },
        ],
        request: `{ "status": "done" }`,
        curl: curl('PATCH', '/tasks/TASK_ID', `{ "status": "done" }`),
        response: `{ "success": true, "message": "Task updated" }`,
      },
      {
        method: 'POST',
        path: '/tasks',
        scope: 'tasks:write',
        summary: { he: '????? ????? ????.', en: 'Create a new task.' },
        params: [
          { name: 'title', in: 'body', type: 'string', required: true, desc: { he: '????? ??????.', en: 'Task title.' } },
          { name: 'description', in: 'body', type: 'string', required: false, desc: { he: '?????.', en: 'Description.' } },
          { name: 'dueDate', in: 'body', type: 'string', required: false, desc: { he: '????? ???.', en: 'Due date.' } },
          { name: 'priority', in: 'body', type: 'string', required: false, desc: { he: '?????? (low/medium/high).', en: 'Priority (low/medium/high).' } },
          { name: 'contactPhone', in: 'body', type: 'string', required: false, desc: { he: '????? ???? ???.', en: 'Link to a contact.' } },
        ],
        request: `{ "title": "????? ????", "dueDate": "2026-09-20", "priority": "high", "contactPhone": "972501234567" }`,
        curl: curl('POST', '/tasks', `{ "title": "Call Dana", "priority": "high" }`),
        response: `{ "success": true, "message": "Task created", "data": { "id": "…" } }`,
      },
    ],
  },
  {
    id: 'notes',
    title: { he: '?????', en: 'Notes' },
    description: {
      he: '????? ?????? (????? ?????? ?????) ???????? ??? ?????? — ?? ???? ??? (???? ?????/??? ????), ????? ??????. ??? ???? ???? ?????? ?? "???? ??????" ?????????. ???? ???? ??? ????, ???? ???????, ???? ?? ????? ?????, ??? ????? ?? ?????? ?? ????? ?????.',
      en: 'Read the human-written notes scattered across the app — on contacts (from the chat/timeline), leads and cases (?????). This is the same data source as the in-app "Notes Hub". Filter by source, date range, author or free-text search, and fetch the notes of a single record.',
    },
    endpoints: [
      {
        method: 'GET',
        path: '/notes',
        scope: 'notes:read',
        summary: {
          he: '?????/????? ????? ??? ??????? (???? ???, ?????, ?????). ????? ????: 30 ????? ????????.',
          en: 'List/search notes across all sources (contacts, leads, cases). Defaults to the last 30 days.',
        },
        params: [
          { name: 'source', in: 'query', type: 'string', required: false, desc: { he: '????? ????: contact | lead | case (???? ????).', en: 'Filter by source: contact | lead | case (omit for all).' } },
          { name: 'dateFrom', in: 'query', type: 'string', required: false, desc: { he: '????? ????? yyyy-MM-dd.', en: 'Start date yyyy-MM-dd.' } },
          { name: 'dateTo', in: 'query', type: 'string', required: false, desc: { he: '????? ???? yyyy-MM-dd (????).', en: 'End date yyyy-MM-dd (inclusive).' } },
          { name: 'userId', in: 'query', type: 'string', required: false, desc: { he: '?? ????? ?????? ?"? ????? ?? (uID).', en: 'Only notes written by this user (uID).' } },
          { name: 'search', in: 'query', type: 'string', required: false, desc: { he: '????? ????? ???? ?????.', en: 'Free-text match inside the note body.' } },
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 30 (???? 200).', en: 'Default 30 (max 200).' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/notes?source=lead&search=budget&pageSize=30" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{
  "success": true,
  "data": {
    "pageNumber": 1, "pageSize": 30, "count": 2, "total": 2,
    "items": [
      { "id": "…", "note": "Customer asked for a discount", "entityType": "lead", "entityId": "LEAD_ID", "contactId": "972501234567", "contactName": "Dana", "entityName": "Website lead", "createdOn": "2026-09-14T10:20:00Z", "createdById": "…", "createdByName": "Agent" }
    ]
  }
}`,
      },
      {
        method: 'GET',
        path: '/notes/{entityType}/{entityId}',
        scope: 'notes:read',
        summary: {
          he: '????? ?? ????? ?????. entityType: contact | lead | case. ???? contact ?? ?????? ???? ????? ?-entityId.',
          en: 'Notes for a single record. entityType: contact | lead | case. For contact pass a phone number as entityId.',
        },
        params: [
          { name: 'entityType', in: 'path', type: 'string', required: true, desc: { he: 'contact | lead | case.', en: 'contact | lead | case.' } },
          { name: 'entityId', in: 'path', type: 'string', required: true, desc: { he: '????? (?-contact) ?? ???? ????/??????.', en: 'Phone (for contact) or the lead/case id.' } },
          { name: 'limit', in: 'query', type: 'int', required: false, desc: { he: '???? ????? (????? ???? 50, ???? 500).', en: 'Max notes (default 50, max 500).' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/notes/lead/LEAD_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "entityType": "lead", "entityId": "LEAD_ID", "count": 1, "items": [ { "id": "…", "note": "Follow up next week", "createdOn": "2026-09-14T10:20:00Z", "createdByName": "Agent" } ] } }`,
      },
    ],
  },
  {
    id: 'campaigns',
    title: { he: '????????', en: 'Campaigns' },
    description: {
      he: '???????? ?????? WhatsApp — ????? ??? ?????? (???? ????? ?? ?????? ??-????/????), ?????, ?????, ????? ??????, ????? ??????, ????, ???? ??-??? ??? ?????, ?????? ????? ????. ??? ????: ????? ???????, ????/CSV, ?? ????? CRM. ????? ?????? ??? ???? ?????? ?-<code>variables: { "var1": …, "var2": … }</code> ??? ??? ?-placeholders ?????? ({{1}}=var1). ?? ???? AI ???? ???? ????, ????? ???????????, ????? ????? (?-MCP: <code>gambot_send_campaign_from_excel</code>).<br/><strong>???? ?????:</strong> ??? ????? ???? ???????? ?????? ???? ?????? ???? — ???? ????? <code>???</code>/<code>?????</code>/<code>stop</code>/<code>unsubscribe</code> ????? ?-<code>consent=false</code> ?????? ???????? ???????? ???????. ??????? ?? ?????/????/?????/????? ??????? ??? ??? <code>optOut</code> (<code>enabled=true</code> ?????? ????). ?????? ????? ?????? ?? <code>consentConfirmed</code> (????? ???? true) ???? ?????? ??? <code>consent</code>.<br/><strong>????? ?????? ?????:</strong> ???????? ??????? ??? ?-API/MCP ?????? ???????? ????? ?????? ????? ????? (<code>sendResultsSummary=true</code>, <code>sendResultsAfterDays=1</code>) ???? ????? AI ?? ??????? (<code>aiAnalysisEnabled=true</code>) — ???? ????? ?? ?????. ??????? <strong>????</strong>, ???? ?????? ?? ???/?? ?????? ?????? ?????? ???? (<code>holidayHandling="skip"</code>; ???? ?? <code>before</code>/<code>after</code>/<code>send</code>).',
      en: 'WhatsApp broadcast campaigns — create any type (manual run or scheduled one-time/recurring), list, get, update, delete, read results, run, ad-hoc send without saving, and single-recipient test. Audience: phone list, Excel/CSV, or CRM filter. Per-recipient template variables are sent as <code>variables: { "var1": …, "var2": … }</code> in template placeholder order ({{1}}=var1). This lets an AI agent take an Excel, map column?variable, and blast everyone (MCP: <code>gambot_send_campaign_from_excel</code>).<br/><strong>Built-in compliance:</strong> every org ships with an ACTIVE opt-out flow — a recipient who replies <code>???</code>/<code>?????</code>/<code>stop</code>/<code>unsubscribe</code> is marked <code>consent=false</code> and auto-excluded from future broadcasts. Create/run/send/test responses echo this under <code>optOut</code> (<code>enabled=true</code> by default). Assert consent-to-mail via <code>consentConfirmed</code> (defaults to true), echoed back under <code>consent</code>.<br/><strong>Results email:</strong> campaigns created via the API/MCP automatically email a run-results summary the next day (<code>sendResultsSummary=true</code>, <code>sendResultsAfterDays=1</code>) with an AI analysis of the replies (<code>aiAnalysisEnabled=true</code>) — override or disable any. For <strong>recurring</strong> campaigns, a run that lands on Shabbat/an Israeli holiday is skipped by default (<code>holidayHandling="skip"</code>; also <code>before</code>/<code>after</code>/<code>send</code>).',
    },
    endpoints: [
      {
        method: 'GET', path: '/campaigns', scope: 'campaigns:read',
        summary: { he: '????? ?? ????????? ?? ??????.', en: 'List all campaigns for the organization.' },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/campaigns" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 5, "items": [ { "campaingId": "…", "campaignName": "…", "campaignTrigger": "Manually", "messageType": "Template" } ] } }`,
      },
      {
        method: 'GET', path: '/campaigns/scheduled', scope: 'campaigns:read',
        summary: { he: '???????? ???????? ???????? ?????.', en: 'Scheduled campaigns waiting to run.' },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/campaigns/scheduled" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 2, "items": [ { "campaignId": "…", "runAt": "2026-07-01T06:00:00Z", "status": "waiting" } ] } }`,
      },
      {
        method: 'GET', path: '/campaigns/{campaignId}', scope: 'campaigns:read',
        summary: { he: '?????? ???? ??? ????.', en: 'A single campaign by id.' },
        params: [{ name: 'campaignId', in: 'path', type: 'string', required: true, desc: { he: '???? ???????.', en: 'Campaign id.' } }],
        request: null,
        curl: `curl "${API_BASE}/campaigns/CAMPAIGN_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "campaingId": "CAMPAIGN_ID", "campaignName": "…", "messageType": "Template", "wabaTemplateId": "…" } }`,
      },
      {
        method: 'GET', path: '/campaigns/{campaignId}/results', scope: 'campaigns:read',
        summary: { he: '??????/??? ???? ?? ??????? (????/????/????/??????/??????).', en: 'Run results/report (sent/delivered/read/replies/clicks).' },
        params: [{ name: 'campaignId', in: 'path', type: 'string', required: true, desc: { he: '???? ???????.', en: 'Campaign id.' } }],
        request: null,
        curl: `curl "${API_BASE}/campaigns/CAMPAIGN_ID/results" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 1, "results": [ { "CampaignResultsId": "…", "Status": "Sent All", "CampaignResultSummary": { "TotalContactsNumber": "120", "NumberOfSentMessage": "120", "NumberOfReadMessage": "88" } } ] } }`,
      },
      {
        method: 'POST', path: '/campaigns', scope: 'campaigns:write',
        summary: {
          he: '????? ?????? — ???? ?? ?????? (??-????/????). ???: ????, ????? CRM ?? ?????. ??? ??????? ????? ????.',
          en: 'Create a campaign — manual or scheduled (one-time/recurring). Audience: Excel, CRM filter or a list. See full examples below.',
        },
        params: [
          { name: 'campaignName', in: 'body', type: 'string', required: true, desc: { he: '?? ???????.', en: 'Campaign name.' } },
          { name: 'messageType', in: 'body', type: 'string', required: true, desc: { he: 'Template (?????) ?? regular (???? ?????).', en: 'Template or regular (free text).' } },
          { name: 'wabaTemplateId', in: 'body', type: 'string', required: false, desc: { he: '???? ????? (???? ??-messageType=Template).', en: 'Template id (required when messageType=Template).' } },
          { name: 'message', in: 'body', type: 'string', required: false, desc: { he: '???? ?????? (??-regular).', en: 'Message text (when regular).' } },
          { name: 'campaignTrigger', in: 'body', type: 'string', required: false, desc: { he: 'Manually (????? ????) ?? Scheduled.', en: 'Manually (default) or Scheduled.' } },
          { name: 'scheduleType', in: 'body', type: 'string', required: false, desc: { he: 'once (??-????) ?? repeated (????).', en: 'once or repeated.' } },
          { name: 'runAt', in: 'body', type: 'string', required: false, desc: { he: '???? ????, ???? 2026-07-01T09:00:00.', en: 'Run datetime, e.g. 2026-07-01T09:00:00.' } },
          { name: 'timezone', in: 'body', type: 'string', required: false, desc: { he: '???? ??? IANA, ???? Asia/Jerusalem.', en: 'IANA timezone, e.g. Asia/Jerusalem.' } },
          { name: 'interval', in: 'body', type: 'string', required: false, desc: { he: 'Second/Minute/Hour/Day/Week/Month/Year (?????).', en: 'Second/Minute/Hour/Day/Week/Month/Year (recurring).' } },
          { name: 'intervalNumber', in: 'body', type: 'int', required: false, desc: { he: '?? N ?????? ???.', en: 'Every N intervals.' } },
          { name: 'endCondition', in: 'body', type: 'object', required: false, desc: { he: '{ type: none|until|count, value }.', en: '{ type: none|until|count, value }.' } },
          { name: 'recipientSource', in: 'body', type: 'string', required: false, desc: { he: '???? "Excel".', en: 'e.g. "Excel".' } },
          { name: 'ExcelData', in: 'body', type: 'object', required: false, desc: { he: '{ recipients: [{ phone, variables, rowData }] }.', en: '{ recipients: [{ phone, variables, rowData }] }.' } },
          { name: 'ContactFilters', in: 'body', type: 'object', required: false, desc: { he: '????? CRM: { filters:[…], logic:"AND|OR" }.', en: 'CRM segment: { filters:[…], logic:"AND|OR" }.' } },
          { name: 'templateVariableQuery', in: 'body', type: 'object[]', required: false, desc: { he: '????? ????? ?????? ???????/????.', en: 'Maps template variables to columns/fields.' } },
          { name: 'fromNumberId', in: 'body', type: 'string', required: false, desc: { he: '???? ????? ?????? ?????-?????? — phoneNumberId ?? ???? ????? (??? GET /numbers). ????? ????: ????? ?????.', en: 'Sender for multi-number orgs — a phoneNumberId or display number (see GET /numbers). Defaults to the primary number.' } },
          { name: 'sendResultsSummary', in: 'body', type: 'bool', required: false, desc: { he: '????? ????? ?????? ????? ???? ?????. ????? ???? ??? ?-API/MCP: true. ???? false ??????.', en: 'Email a run-results summary after each run. Default via API/MCP: true. Send false to disable.' } },
          { name: 'sendResultsAfterDays', in: 'body', type: 'int', required: false, desc: { he: '??? ???? ???? ????? ????? ?? ??????. ????? ????: 1 (?????). ???? 1–60.', en: 'How many days after the run to email the summary. Default: 1 (next day). Range 1–60.' } },
          { name: 'resultsEmailTo', in: 'body', type: 'string', required: false, desc: { he: '???? ??????. ????? ????: ???? ??????.', en: 'Summary recipient. Defaults to the org email.' } },
          { name: 'aiAnalysisEnabled', in: 'body', type: 'bool', required: false, desc: { he: '????? AI ?? ??????? (??? ???, ??????? ??? ???????, ROI) ???? ??????. ????? ????: true.', en: 'AI analysis of replies (responses, automatic vs. interested, ROI) inside the summary. Default: true.' } },
          { name: 'holidayHandling', in: 'body', type: 'string', required: false, desc: { he: '??????? ???? — ?? ????? ??????? ????? ?? ???/?? ??????: skip (????? ???? ?-API/MCP) | before | after | send.', en: 'For recurring campaigns — when a run lands on Shabbat/Israeli holiday: skip (API/MCP default) | before | after | send.' } },
        ],
        request: `{
  "campaignName": "promo_summer_0626",
  "campaignTrigger": "Manually",
  "messageType": "Template",
  "wabaTemplateId": "promo_summer_sale_0626",
  "recipientSource": "Excel",
  "ExcelData": {
    "recipients": [
      { "phone": "972501234567", "variables": { "var1": "???" } },
      { "phone": "972507654321", "variables": { "var1": "????" } }
    ]
  }
}`,
        curl: curl('POST', '/campaigns', `{ "campaignName": "promo_0626", "messageType": "Template", "wabaTemplateId": "promo_summer_sale_0626", "recipientSource": "Excel", "ExcelData": { "recipients": [ { "phone": "972501234567", "variables": { "var1": "???" } } ] } }`),
        response: `{ "success": true, "message": "Create Campaign successfully", "data": { "campaignId": "…" } }`,
        examples: [
          {
            label: { he: '1) ???? + ??? ?????? CRM (??? ????/?????)', en: '1) Manual + audience from a CRM filter' },
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
            label: { he: '2) ?????? ??-???? (once)', en: '2) Scheduled one-time (once)' },
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
            label: { he: '3) ?????? ???? (repeated) — ?? ???? ?? ?????', en: '3) Scheduled recurring (repeated) — weekly until a date' },
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
  "message": "?????? ?????? ???? ??",
  "recipientSource": "Excel",
  "ExcelData": { "recipients": [ { "phone": "972501234567" } ] }
}`),
          },
          {
            label: { he: '4) ???? ??? ???? ????? (count)', en: '4) Recurring by number of runs (count)' },
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
  "message": "??? ???? ?",
  "ContactFilters": { "logic": "AND", "filters": [ { "filterType": "group", "operator": "equals", "value": "Leads" } ] }
}`),
          },
        ],
      },
      {
        method: 'PATCH', path: '/campaigns/{campaignId}', scope: 'campaigns:write',
        summary: { he: '????? ?????? (?????? ?? ??????? ??????? ????). ???? ?? POST.', en: 'Update a campaign (send the full campaign object). POST also accepted.' },
        params: [{ name: 'campaignId', in: 'path', type: 'string', required: true, desc: { he: '???? ???????.', en: 'Campaign id.' } }],
        request: `{ "campaignName": "promo_summer_0626_v2", "messageType": "Template", "wabaTemplateId": "promo_summer_sale_0626" }`,
        curl: curl('PATCH', '/campaigns/CAMPAIGN_ID', `{ "campaignName": "promo_summer_0626_v2" }`),
        response: `{ "success": true, "message": "Update Campaign successfully" }`,
      },
      {
        method: 'DELETE', path: '/campaigns/{campaignId}', scope: 'campaigns:write',
        summary: { he: '????? ??????.', en: 'Delete a campaign.' },
        params: [{ name: 'campaignId', in: 'path', type: 'string', required: true, desc: { he: '???? ???????.', en: 'Campaign id.' } }],
        request: null,
        curl: `curl -X DELETE "${API_BASE}/campaigns/CAMPAIGN_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "message": "Campaign deleted" }`,
      },
      {
        method: 'POST', path: '/campaigns/{campaignId}/run', scope: 'campaigns:run',
        summary: { he: '???? ?????? ???? (????) ????? — ???? ?????? ?????.', en: 'Run an existing (saved) campaign now — resolves recipients and executes.' },
        params: [{ name: 'campaignId', in: 'path', type: 'string', required: true, desc: { he: '???? ???????.', en: 'Campaign id.' } }],
        request: null,
        curl: curl('POST', '/campaigns/CAMPAIGN_ID/run', null),
        response: `{
  "success": true,
  "message": "Campaign run started.",
  "data": { "campaignResultsId": "…", "campaignId": "…", "status": "In Process", "summary": { "TotalContactsNumber": "120" } }
}`,
      },
      {
        method: 'POST', path: '/campaigns/send', scope: 'campaigns:run',
        summary: {
          he: '???? ?????? ??-??? ??? ????? ????. ?????? ??? (????? ??????? / ???? / ?????) ?????? (????? ?? ????).',
          en: 'Run an ad-hoc campaign without saving. Provide an audience (phone list / excel / filter) and a message (template or text).',
        },
        params: [
          { name: 'messageType', in: 'body', type: 'string', required: true, desc: { he: 'Template ?? regular.', en: 'Template or regular.' } },
          { name: 'templateId', in: 'body', type: 'string', required: false, desc: { he: '???? ????? (??-Template).', en: 'Template id (when Template).' } },
          { name: 'message', in: 'body', type: 'string', required: false, desc: { he: '???? (??-regular).', en: 'Text (when regular).' } },
          { name: 'recipientPhoneNumbers', in: 'body', type: 'string[]', required: false, desc: { he: '????? ??????? ??????.', en: 'Explicit phone list.' } },
          { name: 'excelRecipients', in: 'body', type: 'object[]', required: false, desc: { he: '[{ phone, variables, rowData }].', en: '[{ phone, variables, rowData }].' } },
          { name: 'filters', in: 'body', type: 'object', required: false, desc: { he: '????? CRM ? ?????? ?????? ???????.', en: 'CRM segment ? resolved to phone numbers.' } },
          { name: 'consentConfirmed', in: 'body', type: 'bool', required: false, desc: { he: '????? ????? ?????? ???? ???. ????? ???? true. ?????? ???? ?????? ????? ?? ???? (??? optOut ??????).', en: 'Assert consent to mail this audience. Defaults to true. Recipients can always opt out (see optOut in the response).' } },
          { name: 'fromNumberId', in: 'body', type: 'string', required: false, desc: { he: '???? ????? — phoneNumberId ?? ???? ????? (??? GET /numbers). ????? ????: ????? ?????.', en: 'Sender — a phoneNumberId or display number (see GET /numbers). Defaults to the primary number.' } },
        ],
        request: `{
  "messageType": "Template",
  "templateId": "promo_summer_sale_0626",
  "consentConfirmed": true,
  "excelRecipients": [
    { "phone": "972501234567", "variables": { "var1": "???" } },
    { "phone": "972507654321", "variables": { "var1": "????" } }
  ]
}`,
        curl: curl('POST', '/campaigns/send', `{ "messageType": "Template", "templateId": "promo_summer_sale_0626", "recipientPhoneNumbers": ["972501234567","972507654321"] }`),
        response: `{
  "success": true,
  "message": "Campaign send started.",
  "data": {
    "result": { "campaignResultsId": "…", "status": "In Process" },
    "consent": { "confirmed": true, "source": "api" },
    "optOut": {
      "enabled": true,
      "keywords": ["???", "?????", "stop", "unsubscribe"],
      "confirmationMessage": "????? ?????? ??????\\n????? ???? ?????? ??????",
      "howItWorks": "Any recipient who replies with an opt-out keyword is marked consent=false and is automatically excluded from all future broadcasts."
    }
  }
}`,
        examples: [
          {
            label: { he: '??-??? ??? ????? CRM', en: 'Ad-hoc by CRM filter' },
            code: curl('POST', '/campaigns/send', `{
  "messageType": "regular",
  "message": "???? ??? ????? ????! ??",
  "filters": { "logic": "AND", "filters": [ { "filterType": "group", "operator": "equals", "value": "VIP" } ] }
}`),
          },
        ],
      },
      {
        method: 'POST', path: '/campaigns/test', scope: 'campaigns:run',
        summary: {
          he: '????? ?????? — ????? ????? ???? (????? ?? ????). ????? ?????? ???? ????? ???.',
          en: 'Test a campaign — send to a single recipient (template or text). Great before a full broadcast.',
        },
        params: [
          { name: 'to', in: 'body', type: 'string', required: true, desc: { he: '???? ????? ??????.', en: 'Test recipient phone.' } },
          { name: 'messageType', in: 'body', type: 'string', required: false, desc: { he: '????? ???? Template ?? ?? templateId.', en: 'Defaults to Template if templateId is set.' } },
          { name: 'templateId', in: 'body', type: 'string', required: false, desc: { he: '???? ?????.', en: 'Template id.' } },
          { name: 'message', in: 'body', type: 'string', required: false, desc: { he: '???? (??-regular).', en: 'Text (when regular).' } },
          { name: 'variables', in: 'body', type: 'object', required: false, desc: { he: '????? ??????, ???? { "var1": "???" }.', en: 'Template variables, e.g. { "var1": "Dana" }.' } },
          { name: 'fromNumberId', in: 'body', type: 'string', required: false, desc: { he: '???? ????? — phoneNumberId ?? ???? ????? (??? GET /numbers). ????? ????: ????? ?????.', en: 'Sender — a phoneNumberId or display number (see GET /numbers). Defaults to the primary number.' } },
        ],
        request: `{
  "to": "972501234567",
  "messageType": "Template",
  "templateId": "promo_summer_sale_0626",
  "variables": { "var1": "???" }
}`,
        curl: curl('POST', '/campaigns/test', `{ "to": "972501234567", "templateId": "promo_summer_sale_0626", "variables": { "var1": "???" } }`),
        response: `{ "success": true, "message": "Test send started.", "data": { "campaignResultsId": "…", "status": "In Process" } }`,
      },
    ],
  },
  {
    id: 'quotes',
    title: { he: '????? ????', en: 'Quotes' },
    description: { he: '?????, ?????, ????? ?????? ?? ????? ????.', en: 'Create, list, fetch and update price quotes.' },
    endpoints: [
      {
        method: 'GET', path: '/quotes', scope: 'quotes:read',
        summary: { he: '????? ????? ???? (????? + ????? ?????).', en: 'List quotes (paginated + status filter).' },
        params: [
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 50.', en: 'Default 50.' } },
          { name: 'search', in: 'query', type: 'string', required: false, desc: { he: '?????.', en: 'Search.' } },
          { name: 'status', in: 'query', type: 'string', required: false, desc: { he: 'draft/sent/accepted…', en: 'draft/sent/accepted…' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/quotes?pageSize=50" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "total": 8, "items": [ { "id": "…", "quoteNumber": "Q-001", "total": 1500 } ] } }`,
      },
      {
        method: 'GET', path: '/quotes/{quoteId}', scope: 'quotes:read',
        summary: { he: '????? ???? ???? ?????.', en: 'Fetch a single quote.' },
        params: [{ name: 'quoteId', in: 'path', type: 'string', required: true, desc: { he: '???? ?????.', en: 'Quote id.' } }],
        request: null,
        curl: `curl "${API_BASE}/quotes/QUOTE_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "QUOTE_ID", "items": [ … ], "total": 1500 } }`,
      },
      {
        method: 'POST', path: '/quotes', scope: 'quotes:write',
        summary: { he: '????? ???? ????. ??? ????? = ???? ????? (?? ??? quoteData).', en: 'Create a quote. Body = quote fields (or under quoteData).' },
        params: [
          { name: 'title', in: 'body', type: 'string', required: false, desc: { he: '?????.', en: 'Title.' } },
          { name: 'contactPhone', in: 'body', type: 'string', required: false, desc: { he: '????? ?????.', en: 'Customer phone.' } },
          { name: 'items', in: 'body', type: 'object[]', required: false, desc: { he: '????? ?????.', en: 'Line items.' } },
          { name: 'total', in: 'body', type: 'number', required: false, desc: { he: '??"?.', en: 'Total.' } },
          { name: 'currency', in: 'body', type: 'string', required: false, desc: { he: '????.', en: 'Currency.' } },
        ],
        request: `{
  "title": "???? ??????? ?????",
  "contactPhone": "972501234567",
  "currency": "ILS",
  "items": [ { "name": "?????", "quantity": 2, "price": 750 } ],
  "total": 1500
}`,
        curl: curl('POST', '/quotes', `{ "title": "Consulting", "total": 1500 }`),
        response: `{ "success": true, "message": "Quote created", "data": { "id": "…" } }`,
      },
      {
        method: 'PATCH', path: '/quotes/{quoteId}', scope: 'quotes:write',
        summary: { he: '????? ???? ???? (partial). ???? ?? POST.', en: 'Update quote fields (partial). POST also accepted.' },
        params: [
          { name: 'quoteId', in: 'path', type: 'string', required: true, desc: { he: '???? ?????.', en: 'Quote id.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: '?????.', en: 'Status.' } },
        ],
        request: `{ "status": "sent" }`,
        curl: curl('PATCH', '/quotes/QUOTE_ID', `{ "status": "sent" }`),
        response: `{ "success": true, "message": "Quote updated" }`,
      },
    ],
  },
  {
    id: 'invoices',
    title: { he: '????????', en: 'Invoices' },
    description: { he: '?????, ?????, ?????, ????? ????? (issue) ?? ????????.', en: 'Create, list, fetch, update and issue invoices.' },
    endpoints: [
      {
        method: 'GET', path: '/invoices', scope: 'invoices:read',
        summary: { he: '????? ???????? (????? + ????? ?????/???).', en: 'List invoices (paginated + status/type filters).' },
        params: [
          { name: 'pageNumber', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 1.', en: 'Default 1.' } },
          { name: 'pageSize', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 50.', en: 'Default 50.' } },
          { name: 'status', in: 'query', type: 'string', required: false, desc: { he: 'draft/issued…', en: 'draft/issued…' } },
          { name: 'type', in: 'query', type: 'string', required: false, desc: { he: 'tax_invoice/receipt…', en: 'tax_invoice/receipt…' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/invoices?pageSize=50" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "total": 20, "items": [ { "id": "…", "documentNumber": "…", "total": 1755 } ] } }`,
      },
      {
        method: 'GET', path: '/invoices/{invoiceId}', scope: 'invoices:read',
        summary: { he: '????? ??????? ?????.', en: 'Fetch a single invoice.' },
        params: [{ name: 'invoiceId', in: 'path', type: 'string', required: true, desc: { he: '???? ????????.', en: 'Invoice id.' } }],
        request: null,
        curl: `curl "${API_BASE}/invoices/INVOICE_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "INVOICE_ID", "status": "draft", "total": 1755 } }`,
      },
      {
        method: 'POST', path: '/invoices', scope: 'invoices:write',
        summary: { he: '????? ????? ???????. ??? = ???? ???????? (?? ??? invoiceData).', en: 'Create an invoice draft. Body = invoice fields (or under invoiceData).' },
        params: [
          { name: 'type', in: 'body', type: 'string', required: false, desc: { he: 'tax_invoice / receipt / combined…', en: 'tax_invoice / receipt / combined…' } },
          { name: 'contactPhone', in: 'body', type: 'string', required: false, desc: { he: '????? ?????.', en: 'Customer phone.' } },
          { name: 'items', in: 'body', type: 'object[]', required: false, desc: { he: '?????.', en: 'Line items.' } },
          { name: 'total', in: 'body', type: 'number', required: false, desc: { he: '??"?.', en: 'Total.' } },
        ],
        request: `{
  "type": "tax_invoice",
  "contactPhone": "972501234567",
  "items": [ { "name": "????", "quantity": 1, "price": 1500 } ],
  "vatRate": 17,
  "total": 1755
}`,
        curl: curl('POST', '/invoices', `{ "type": "tax_invoice", "total": 1755 }`),
        response: `{ "success": true, "message": "Invoice created", "data": { "id": "…" } }`,
      },
      {
        method: 'PATCH', path: '/invoices/{invoiceId}', scope: 'invoices:write',
        summary: { he: '????? ??????? (???? ???? ????/?????). ???? ?? POST.', en: 'Update an invoice (blocked once issued/locked). POST also accepted.' },
        params: [{ name: 'invoiceId', in: 'path', type: 'string', required: true, desc: { he: '???? ????????.', en: 'Invoice id.' } }],
        request: `{ "notes": "????!" }`,
        curl: curl('PATCH', '/invoices/INVOICE_ID', `{ "notes": "Thanks!" }`),
        response: `{ "success": true, "message": "Invoice updated" }`,
      },
      {
        method: 'POST', path: '/invoices/{invoiceId}/issue', scope: 'invoices:write',
        summary: { he: '???? ??????? — ????? ?????? ???? ???? ????.', en: 'Issue an invoice — locks it and assigns the official document number.' },
        params: [{ name: 'invoiceId', in: 'path', type: 'string', required: true, desc: { he: '???? ????????.', en: 'Invoice id.' } }],
        request: null,
        curl: curl('POST', '/invoices/INVOICE_ID/issue', null),
        response: `{ "success": true, "message": "Invoice issued", "data": { "documentNumber": "2026-0001" } }`,
      },
    ],
  },
  {
    id: 'orders',
    title: { he: '??????', en: 'Orders' },
    description: { he: '?????, ?????, ????? ?????? ?? ?????? ????.', en: 'Create, list, fetch and update store orders.' },
    endpoints: [
      {
        method: 'GET', path: '/orders', scope: 'orders:read',
        summary: { he: '????? ?????? (????? ?????/????/???? ???????).', en: 'List orders (filter by status/store/date range).' },
        params: [
          { name: 'status', in: 'query', type: 'string', required: false, desc: { he: '?????.', en: 'Status.' } },
          { name: 'storeId', in: 'query', type: 'string', required: false, desc: { he: '???? ????.', en: 'Store id.' } },
          { name: 'dateFrom', in: 'query', type: 'string', required: false, desc: { he: '??????.', en: 'From date.' } },
          { name: 'dateTo', in: 'query', type: 'string', required: false, desc: { he: '?? ?????.', en: 'To date.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/orders?status=new" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 4, "items": [ { "id": "…", "orderNumber": "1001", "total": 299 } ] } }`,
      },
      {
        method: 'GET', path: '/orders/{orderId}', scope: 'orders:read',
        summary: { he: '????? ????? ?????.', en: 'Fetch a single order.' },
        params: [{ name: 'orderId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Order id.' } }],
        request: null,
        curl: `curl "${API_BASE}/orders/ORDER_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "ORDER_ID", "status": "new", "items": [ … ] } }`,
      },
      {
        method: 'POST', path: '/orders', scope: 'orders:write',
        summary: { he: '????? ?????. ??? = ???? ??????.', en: 'Create an order. Body = order fields.' },
        params: [
          { name: 'customerName', in: 'body', type: 'string', required: false, desc: { he: '?? ?????.', en: 'Customer name.' } },
          { name: 'customerPhone', in: 'body', type: 'string', required: false, desc: { he: '????? ?????.', en: 'Customer phone.' } },
          { name: 'items', in: 'body', type: 'object[]', required: false, desc: { he: '??????.', en: 'Items.' } },
          { name: 'total', in: 'body', type: 'number', required: false, desc: { he: '??"?.', en: 'Total.' } },
        ],
        request: `{
  "customerName": "???",
  "customerPhone": "972501234567",
  "items": [ { "name": "?????", "quantity": 2, "price": 99 } ],
  "total": 198,
  "status": "new"
}`,
        curl: curl('POST', '/orders', `{ "customerPhone": "972501234567", "total": 198 }`),
        response: `{ "success": true, "message": "Order created", "data": { "orderId": "…" } }`,
      },
      {
        method: 'PATCH', path: '/orders/{orderId}', scope: 'orders:write',
        summary: { he: '????? ????? (merge). ???? ?? POST.', en: 'Update an order (merge). POST also accepted.' },
        params: [{ name: 'orderId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Order id.' } }],
        request: `{ "status": "shipped", "trackingNumber": "IL123" }`,
        curl: curl('PATCH', '/orders/ORDER_ID', `{ "status": "shipped" }`),
        response: `{ "success": true, "message": "Order updated" }`,
      },
    ],
  },
  {
    id: 'signatures',
    title: { he: '????? ????????', en: 'E-Signature' },
    description: { he: '????? ???? — ????? ????? ??????? ??????, ????? ?????/? ?????? ?????. ????? ????? ????? ?????.', en: 'Read-only — signature documents, their signing results, and fetching the signing link(s) to distribute. Creation is done in the Gambot UI.' },
    endpoints: [
      {
        method: 'GET', path: '/signatures', scope: 'signatures:read',
        summary: { he: '????? ????? ????? (????? ????).', en: 'List signature documents (newest first).' },
        params: [{ name: 'limit', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 100.', en: 'Default 100.' } }],
        request: null,
        curl: `curl "${API_BASE}/signatures?limit=100" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 12, "items": [ { "id": "…", "documentName": "…", "status": "…" } ] } }`,
      },
      {
        method: 'GET', path: '/signatures/{documentId}', scope: 'signatures:read',
        summary: { he: '???? ????? ???? ???? ?????? ?????? (Signatures).', en: 'A single signature document incl. signing results (Signatures).' },
        params: [{ name: 'documentId', in: 'path', type: 'string', required: true, desc: { he: '???? ?????.', en: 'Document id.' } }],
        request: null,
        curl: `curl "${API_BASE}/signatures/DOC_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "DOC_ID", "Signatures": [ { "signerName": "…", "signedAt": "…" } ] } }`,
      },
      {
        method: 'GET', path: '/signatures/{documentId}/link', scope: 'signatures:read',
        summary: { he: '?????/? ?????? ????? ??????? (????? ???? ??? ????).', en: 'The signing link(s) to distribute to signers (one link per signer).' },
        params: [{ name: 'documentId', in: 'path', type: 'string', required: true, desc: { he: '???? ???? ??????.', en: 'Signature document id.' } }],
        request: null,
        curl: `curl "${API_BASE}/signatures/DOC_ID/link" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "documentId": "DOC_ID", "fillOnly": false, "url": "https://gambot.co.il/ORG/esignature/DOC_ID/sign/TOKEN?lang=he", "signers": [ { "name": "???", "role": "signer1", "url": "https://gambot.co.il/ORG/esignature/DOC_ID/sign/TOKEN?lang=he" } ] } }`,
        notes: { he: '???????? ?????? ?????? ?????? ????. ?? ????? ??? ??? ???? ????? — ????? ????? no_link.', en: 'Signing links exist once the signature request has been sent. If the document has no token yet, a no_link error is returned.' },
      },
    ],
  },
  {
    id: 'forms',
    title: { he: '???? ???', en: 'Web Forms' },
    description: { he: '?????? ?????, ?????? (submissions) ??????? ??????? ?????. ????? ????? ????? ????? ?????.', en: 'Form definitions, submissions (results) and the public link to distribute. Form creation is done in the Gambot UI.' },
    endpoints: [
      {
        method: 'GET', path: '/forms', scope: 'forms:read',
        summary: { he: '????? ???? ???.', en: 'List web forms.' },
        params: [{ name: 'limit', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 200.', en: 'Default 200.' } }],
        request: null,
        curl: `curl "${API_BASE}/forms" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 3, "items": [ { "id": "…", "title": "??? ???" } ] } }`,
      },
      {
        method: 'GET', path: '/forms/{formId}', scope: 'forms:read',
        summary: { he: '????? ???? ????.', en: 'A single form definition.' },
        params: [{ name: 'formId', in: 'path', type: 'string', required: true, desc: { he: '???? ?????.', en: 'Form id.' } }],
        request: null,
        curl: `curl "${API_BASE}/forms/FORM_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "FORM_ID", "title": "…", "fields": [ … ] } }`,
      },
      {
        method: 'GET', path: '/forms/{formId}/link', scope: 'forms:read',
        summary: { he: '?????? ??????? ????? ?? ????? — ????? ??????? (WhatsApp/????/SMS/QR).', en: 'The stable public link for the form — to distribute to customers (WhatsApp/email/SMS/QR).' },
        params: [{ name: 'formId', in: 'path', type: 'string', required: true, desc: { he: '???? ?????.', en: 'Form id.' } }],
        request: null,
        curl: `curl "${API_BASE}/forms/FORM_ID/link" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "formId": "FORM_ID", "slug": "???-???", "url": "https://gambot.co.il/forms/ORG/???-???" } }`,
        notes: { he: '????? ???? ????? ?????? ???? — ?? ????? ????? ?-submissions ?? ?????.', en: 'A stable, reusable link — every submission lands in the form’s submissions.' },
      },
      {
        method: 'GET', path: '/forms/{formId}/submissions', scope: 'forms:read',
        summary: { he: '?????? (submissions) ?? ????.', en: 'Submissions (results) for a form.' },
        params: [
          { name: 'formId', in: 'path', type: 'string', required: true, desc: { he: '???? ?????.', en: 'Form id.' } },
          { name: 'limit', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 500.', en: 'Default 500.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/forms/FORM_ID/submissions" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 40, "items": [ { "id": "…", "data": { … } } ] } }`,
      },
    ],
  },
  {
    id: 'documents',
    title: { he: '?????? ??????', en: 'Document Templates' },
    description: { he: '?????? ??????, ?????? ????? (submissions) ?????? ????? ????? ????? ?????.', en: 'Document templates, fill submissions (results), and generating a distributable fill link for a customer.' },
    endpoints: [
      {
        method: 'GET', path: '/documents', scope: 'documents:read',
        summary: { he: '????? ?????? ??????.', en: 'List document templates.' },
        params: [{ name: 'limit', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 200.', en: 'Default 200.' } }],
        request: null,
        curl: `curl "${API_BASE}/documents" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 5, "items": [ { "id": "…", "name": "????" } ] } }`,
      },
      {
        method: 'GET', path: '/documents/{templateId}', scope: 'documents:read',
        summary: { he: '????? ???? ?????.', en: 'A single document template.' },
        params: [{ name: 'templateId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Template id.' } }],
        request: null,
        curl: `curl "${API_BASE}/documents/TEMPLATE_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "TEMPLATE_ID", "name": "…" } }`,
      },
      {
        method: 'GET', path: '/documents/{templateId}/submissions', scope: 'documents:read',
        summary: { he: '?????? ????? ?????? ??????? (fill-only).', en: 'Fill submissions generated from the template (fill-only).' },
        params: [
          { name: 'templateId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Template id.' } },
          { name: 'limit', in: 'query', type: 'int', required: false, desc: { he: '????? ???? 500.', en: 'Default 500.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/documents/TEMPLATE_ID/submissions" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 7, "items": [ { "id": "…", "Signatures": [ … ] } ] } }`,
      },
      {
        method: 'POST', path: '/documents/{templateId}/link', scope: 'documents:read',
        summary: { he: '????? ????? ????? ????? ????? ???? ????? ????.', en: 'Generate a distributable fill link for a customer from a document template.' },
        params: [
          { name: 'templateId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'Template id.' } },
          { name: 'contactPhone', in: 'body', type: 'string', required: false, desc: { he: '????? ??? ???? — ?????? ????? ?? ????? ??????.', en: 'Contact phone — to pre-fill template variables.' } },
          { name: 'leadId', in: 'body', type: 'string', required: false, desc: { he: '???? ??? — ?????? ????? ?? ??????.', en: 'Lead id — to pre-fill variables.' } },
          { name: 'documentName', in: 'body', type: 'string', required: false, desc: { he: '?? ????? ??????? (????? ????: ?? ??????).', en: 'Name for the created document (default: template name).' } },
          { name: 'language', in: 'body', type: 'string', required: false, desc: { he: '??? (he/en/…). ????? ???? he.', en: 'Language (he/en/…). Default he.' } },
          { name: 'expiresInDays', in: 'body', type: 'int', required: false, desc: { he: '???? ?????? ????? (????? ???? 30).', en: 'Link validity in days (default 30).' } },
          { name: 'variables', in: 'body', type: 'object', required: false, desc: { he: '????? ?????? ?????? ??????: { "key": "value" }.', en: 'Manual values for template variables: { "key": "value" }.' } },
        ],
        request: `{
  "contactPhone": "+972501234567",
  "documentName": "???? ????? - ??? ???",
  "language": "he",
  "variables": { "amount": "1,200 ?", "startDate": "01/07/2026" }
}`,
        curl: curl('POST', '/documents/TEMPLATE_ID/link', { contactPhone: '+972501234567', documentName: '???? ?????', variables: { amount: '1,200 ?' } }),
        response: `{ "success": true, "message": "Distributable fill link created from the template.", "data": { "url": "https://gambot.co.il/ORG/form/NEW_DOC_ID/TOKEN?lang=he", "documentId": "NEW_DOC_ID", "templateId": "TEMPLATE_ID" } }`,
        notes: { he: '?????? ???? ??? ????? ???? ???? — ?? ???? ???? ???? ????, ??? ?????? ????? ???? ????? ??? ??????? ?? ????? ?-/form/ ???. ???? POST ?? ?????? ????? ????.', en: 'A document template has no single static link — each customer fills their own copy, so this call creates a new fill instance and returns its /form/ URL. It is a POST because it creates a document.' },
      },
    ],
  },
  {
    id: 'users',
    title: { he: '???????', en: 'Users' },
    description: { he: '????? ?????? ?????? (???? ????) — ?????, ?????, ?????, ????? ??????.', en: 'Manage organization users (team members) — add, list, fetch, update and disable.' },
    endpoints: [
      {
        method: 'GET', path: '/users', scope: 'users:read',
        summary: { he: '????? ?????? ?????? (??? ????? ????????).', en: 'List organization users (excluding system bots).' },
        params: [],
        request: null,
        curl: `curl "${API_BASE}/users" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 4, "items": [ { "uID": "…", "FullName": "…", "SecurityRole": "Admin" } ] } }`,
      },
      {
        method: 'GET', path: '/users/{userId}', scope: 'users:read',
        summary: { he: '????? ????? ????.', en: 'Fetch a single user.' },
        params: [{ name: 'userId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'User id.' } }],
        request: null,
        curl: `curl "${API_BASE}/users/USER_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "uID": "USER_ID", "FullName": "…", "Status": "active" } }`,
      },
      {
        method: 'POST', path: '/users', scope: 'users:write',
        summary: { he: '?????/????? ????? — ???? ????? ????? ???? + ???????.', en: 'Create/invite a user — provisions the account and sends email + WhatsApp.' },
        params: [
          { name: 'email', in: 'body', type: 'string', required: true, desc: { he: '????? ??????.', en: 'Email address.' } },
          { name: 'fullName', in: 'body', type: 'string', required: false, desc: { he: '?? ??? (?? firstName+lastName).', en: 'Full name (or firstName+lastName).' } },
          { name: 'phoneNumber', in: 'body', type: 'string', required: false, desc: { he: '?????.', en: 'Phone.' } },
          { name: 'securityRole', in: 'body', type: 'string', required: false, desc: { he: 'Admin/StoreManager/StoreAgent/Chat/Basic/Custom.', en: 'Admin/StoreManager/StoreAgent/Chat/Basic/Custom.' } },
          { name: 'language', in: 'body', type: 'string', required: false, desc: { he: '???.', en: 'Language.' } },
        ],
        request: `{
  "email": "agent@example.com",
  "fullName": "???? ????",
  "phoneNumber": "972501234567",
  "securityRole": "StoreAgent"
}`,
        curl: curl('POST', '/users', `{ "email": "agent@example.com", "fullName": "Agent" }`),
        response: `{ "success": true, "message": "User created", "data": { "email": "agent@example.com" } }`,
      },
      {
        method: 'PATCH', path: '/users/{userId}', scope: 'users:write',
        summary: { he: '????? ????? — ?? ????? ??????. ???? ?? POST.', en: 'Update a user — only provided fields. POST also accepted.' },
        params: [
          { name: 'userId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'User id.' } },
          { name: 'securityRole', in: 'body', type: 'string', required: false, desc: { he: '????? ?????.', en: 'Security role.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active/inactive.', en: 'active/inactive.' } },
        ],
        request: `{ "securityRole": "StoreManager" }`,
        curl: curl('PATCH', '/users/USER_ID', `{ "securityRole": "StoreManager" }`),
        response: `{ "success": true, "message": "User updated" }`,
      },
      {
        method: 'POST', path: '/users/{userId}/disable', scope: 'users:write',
        summary: { he: '????? ????? (status=inactive).', en: 'Disable a user (status=inactive).' },
        params: [{ name: 'userId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'User id.' } }],
        request: null,
        curl: curl('POST', '/users/USER_ID/disable', null),
        response: `{ "success": true, "message": "User inactive" }`,
      },
      {
        method: 'POST', path: '/users/{userId}/enable', scope: 'users:write',
        summary: { he: '????? ????? (status=active).', en: 'Enable a user (status=active).' },
        params: [{ name: 'userId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'User id.' } }],
        request: null,
        curl: curl('POST', '/users/USER_ID/enable', null),
        response: `{ "success": true, "message": "User active" }`,
      },
      {
        method: 'DELETE', path: '/users/{userId}', scope: 'users:write',
        summary: { he: '????? ????? ??????? (????? + ??????).', en: 'Permanently delete a user (auth + profile).' },
        params: [{ name: 'userId', in: 'path', type: 'string', required: true, desc: { he: '???? ??????.', en: 'User id.' } }],
        request: null,
        curl: `curl -X DELETE "${API_BASE}/users/USER_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "message": "User deleted" }`,
      },
    ],
  },
  {
    id: 'bots',
    title: { he: '????? ??????????', en: 'Bots & Automations' },
    description: {
      he: '????? ?????? ?? ????? ?????????? ???? ("botomations") — ????? ??? ????? ?????? ????? (?? ?????? ????? runtime ???????? ???). ??? ????? ????? ???: <strong>????? ??????</strong> (keyword-reply, template-button-reply, menu) ???????? ?????? ?? ????? ?????? ??????, ?? <strong>POST ?? ??????? ???? ????</strong> (name, status, steps[]) ?????? ????. ??? ??? ????? Steps — ???? ?????? ??? ??????, ???? ??????. Placeholders ??? <code>{{Step_1_PhoneNumber}}</code> ?-<code>{{Step_1_Message}}</code> ??????? ?? ???? ?????? ????? ?????? ?? ????? ?????? ?????.',
      en: 'Create and manage WhatsApp bots & chat automations ("botomations") — exactly like the in-app Bot Builder (they save to the same runtime and behave identically). Two ways to create a bot: <strong>high-level builders</strong> (keyword-reply, template-button-reply, menu) that assemble the correct step schema for you, or <strong>POST the full bot object</strong> (name, status, steps[]) for full control. A bot is a list of Steps — step 1 is the trigger, the rest are actions. Placeholders like <code>{{Step_1_PhoneNumber}}</code> and <code>{{Step_1_Message}}</code> carry the triggering contact\'s phone number and message text into later steps.',
    },
    endpoints: [
      {
        method: 'GET', path: '/bots', scope: 'bots:read',
        summary: { he: '????? ?????/????????? (?? ????? ??? ???). ?botsOnly=true ????? ?? ????? ?????????.', en: 'List bots/automations (with a summary per bot). ?botsOnly=true returns only visual bots.' },
        params: [
          { name: 'botsOnly', in: 'query', type: 'bool', required: false, desc: { he: '?? ????? ????????? (isBot). ????? ???? false.', en: 'Only visual bots (isBot). Default false.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/bots?botsOnly=false" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "count": 1, "items": [ { "id": "abc123", "name": "Greeting bot", "status": "active", "isBot": false, "isPrimaryFlow": false, "stepCount": 2, "trigger": "IncomingMessage" } ] } }`,
      },
      {
        method: 'GET', path: '/bots/{botId}', scope: 'bots:read',
        summary: { he: '??? ???? ?? ????? ?????? ?????.', en: 'A single bot with its full step definition.' },
        params: [
          { name: 'botId', in: 'path', type: 'string', required: true, desc: { he: '???? ????.', en: 'Bot id.' } },
        ],
        request: null,
        curl: `curl "${API_BASE}/bots/BOT_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "id": "abc123", "name": "Greeting bot", "status": "active", "steps": [ { "StepId": "Step_1", "type": "trigger", "action": "IncomingMessage", "config": { "messageType": "regular" } } ] } }`,
      },
      {
        method: 'POST', path: '/bots/keyword-reply', scope: 'bots:write',
        summary: { he: '???? ????: ???? ??????? ?????? ????? — ??? ???? ???? ??? ?? ????, ?? ??? ?????.', en: 'High-level builder: auto-reply to an incoming message — by one or more keywords, or to any message.' },
        params: [
          { name: 'name', in: 'body', type: 'string', required: true, desc: { he: '?? ????.', en: 'Bot name.' } },
          { name: 'keywords', in: 'body', type: 'string[]', required: false, desc: { he: '????? ???? ???????? ?? ???? (??????? ?-OR). ???? ??? ?? anyMessage=true.', en: 'Keywords that trigger the bot (OR-matched). Required unless anyMessage=true.' } },
          { name: 'matchType', in: 'body', type: 'string', required: false, desc: { he: 'equals|contains (????? ???? equals).', en: 'equals|contains (default equals).' } },
          { name: 'anyMessage', in: 'body', type: 'bool', required: false, desc: { he: '????? ??? ????? ????? ??????? ?????? ????.', en: 'Reply to ANY incoming message, ignoring keywords.' } },
          { name: 'replyTemplateName', in: 'body', type: 'string', required: false, desc: { he: '?? ????? ??????. ?? replyText.', en: 'Template name to reply with. Or replyText.' } },
          { name: 'replyText', in: 'body', type: 'string', required: false, desc: { he: '???? ????? ?????? (???? ???? ???? 24 ?????).', en: 'Free-text reply (works inside the 24h window).' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active|inactive (????? ???? active).', en: 'active|inactive (default active).' } },
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
        notes: { he: '???? replyTemplateName ?? replyText. ???? ????? 24 ????? ???? ????? ?????? ??????.', en: 'Provide replyTemplateName or replyText. Outside the 24h window you must reply with an approved template.' },
        examples: [
          { label: { he: '????? MCP', en: 'MCP tool call' }, code: `gambot_create_keyword_autoreply({\n  name: "Greeting bot",\n  keywords: ["hi", "hello"],\n  replyText: "Hi! How can we help?"\n})` },
        ],
      },
      {
        method: 'POST', path: '/bots/template-button-reply', scope: 'bots:write',
        summary: { he: '???? ????: ???? ??????? ???????? ?? ????? ?????? ??????. ?? ????? ????? ?????? ????.', en: 'High-level builder: auto-reply when a contact taps a button on a template you sent. Each button routes to its own reply.' },
        params: [
          { name: 'name', in: 'body', type: 'string', required: true, desc: { he: '?? ????.', en: 'Bot name.' } },
          { name: 'templateName', in: 'body', type: 'string', required: true, desc: { he: '?? ?????? ????????? ??? ??????? ?? ????.', en: 'Template whose buttons trigger the bot.' } },
          { name: 'buttons', in: 'body', type: 'object[]', required: true, desc: { he: '[{ button (????? ??????), replyTemplateName?, replyText? }]. ????? ??? ????? ???? ?? ?? ???? ????.', en: '[{ button (its title), replyTemplateName?, replyText? }]. A button with no reply is matched but sends nothing.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active|inactive (????? ???? active).', en: 'active|inactive (default active).' } },
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
        summary: { he: '???? ????: ??? ????? — ????? ????? ?? ??????? ??? ??? ???? ??????. ??? ?"??? ?????" ?? ???? ??????.', en: 'High-level builder: a menu bot — an opening template with buttons that each route to a reply. Same shape the Bot Builder deploys as the "main bot".' },
        params: [
          { name: 'name', in: 'body', type: 'string', required: true, desc: { he: '?? ????.', en: 'Bot name.' } },
          { name: 'openingTemplateName', in: 'body', type: 'string', required: true, desc: { he: '????? ?????? ?? ????????.', en: 'Opening template with the buttons.' } },
          { name: 'options', in: 'body', type: 'object[]', required: true, desc: { he: '[{ button, replyTemplateName?, replyText? }] — ?????? ??? ?????.', en: '[{ button, replyTemplateName?, replyText? }] — one option per button.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active|inactive (????? ???? active).', en: 'active|inactive (default active).' } },
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
          { label: { he: '????? MCP', en: 'MCP tool call' }, code: `gambot_create_menu_bot({\n  name: "Main menu",\n  openingTemplateName: "welcome_gambot_0926",\n  options: [\n    { button: "Prices", replyTemplateName: "price_list" },\n    { button: "Book", replyText: "Great! Reply with your preferred date." }\n  ]\n})` },
        ],
      },
      {
        method: 'POST', path: '/bots', scope: 'bots:write',
        summary: { he: '????? ??? ???????? botomation ??? (????? ????). ???? ?????? ?????? ??????? ??? ?? ???? ????? ???????.', en: 'Create a bot from a full botomation object (full control). Prefer the high-level builders unless you need custom steps.' },
        params: [
          { name: 'name', in: 'body', type: 'string', required: true, desc: { he: '?? ????.', en: 'Bot name.' } },
          { name: 'steps', in: 'body', type: 'object[]', required: true, desc: { he: '????? ?????. ??? 1 = ?????. ?? ???: { StepId, type: "trigger|action", action: "IncomingMessage|SendMessage|switchCase|…", config }.', en: 'Steps list. Step 1 = trigger. Each step: { StepId, type: "trigger|action", action: "IncomingMessage|SendMessage|switchCase|…", config }.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active|inactive (????? ???? active).', en: 'active|inactive (default active).' } },
          { name: 'isBot', in: 'body', type: 'bool', required: false, desc: { he: '???? true ???? ???????.', en: 'Set true for a visual bot.' } },
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
        notes: { he: 'name ?-steps[] ????. ???? ????? ?? ???????? ??? "bot" ?? "botomationData". ????? ??? StepId ?????? ????????.', en: 'name and steps[] are required. You may wrap the object under "bot" or "botomationData". Steps missing a StepId are auto-filled.' },
      },
      {
        method: 'POST', path: '/bots/{botId}/status', scope: 'bots:write',
        summary: { he: '?????/????? ?? ???.', en: 'Activate or deactivate a bot.' },
        params: [
          { name: 'botId', in: 'path', type: 'string', required: true, desc: { he: '???? ????.', en: 'Bot id.' } },
          { name: 'status', in: 'body', type: 'string', required: false, desc: { he: 'active|inactive. ??????? active:true|false.', en: 'active|inactive. Or active:true|false.' } },
        ],
        request: `{ "status": "inactive" }`,
        curl: curl('POST', '/bots/BOT_ID/status', `{ "status": "inactive" }`),
        response: `{ "success": true, "message": "Bot updated.", "data": { "botId": "abc123", "status": "inactive" } }`,
      },
      {
        method: 'PATCH', path: '/bots/{botId}', scope: 'bots:write',
        summary: { he: '????? ??? (???? ?? ??????? ???? ????). POST ????? ????? ???? ??.', en: 'Update a bot (send the full bot object). POST to the same path is also accepted.' },
        params: [
          { name: 'botId', in: 'path', type: 'string', required: true, desc: { he: '???? ????.', en: 'Bot id.' } },
        ],
        request: `{ "name": "Greeting bot (v2)", "status": "active", "steps": [ /* full steps[] */ ] }`,
        curl: `curl -X PATCH "${API_BASE}/bots/BOT_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "name": "Greeting bot (v2)", "status": "active", "steps": [] }'`,
        response: `{ "success": true, "message": "Bot updated.", "data": { "botId": "abc123" } }`,
      },
      {
        method: 'DELETE', path: '/bots/{botId}', scope: 'bots:write',
        summary: { he: '????? ???.', en: 'Delete a bot.' },
        params: [
          { name: 'botId', in: 'path', type: 'string', required: true, desc: { he: '???? ????.', en: 'Bot id.' } },
        ],
        request: null,
        curl: `curl -X DELETE "${API_BASE}/bots/BOT_ID" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "message": "Bot deleted.", "data": { "botId": "abc123" } }`,
      },
    ],
  },
  {
    id: 'onboarding',
    title: { he: '??????? (Onboarding)', en: 'Onboarding' },
    description: {
      he: '???? ????? ??? (????? + ????? ?????) — ?????? ?????? ???? ?? ??? ?????? ?? ????? ????. ???? ?????? ????? ????? ?? ???, ????? WhatsApp Business ???? (coexistence), ????? ????? (BYO), ?? ????? ????/SIM ?????? ??? ????? (Twilio). ??????: ????? ????? companyInfo.timezone (IANA) ?-companyInfo.country (ISO-3166) — ?? ?????? ????? (????????, ???????, ???? ??????) ???????????. ?? ??? ??? ?? ???? ????? ?????: timezone ???/?? ???? ???? ???????, ??? ??? — ????? ???? Asia/Jerusalem. ???? AI ??????? ????? ????? ???? ????? ????? ????? ??????. ???? ?????? ?? ??? ??? ??? ????? — ???? ????? ????? ????? ??-code ????? ?-API.',
      en: 'Provision a new account (organization + first user) — either a free trial or straight-to-paid with a card on file. Use a Meta test number, an existing WhatsApp Business number (coexistence), your own number (BYO), or buy a number/SIM from us by country (Twilio). Global: send companyInfo.timezone (IANA) and companyInfo.country (ISO-3166) — they drive scheduling (campaigns, reminders, business hours) and locale. Neither hard-fails onboarding: a missing/invalid timezone is derived from country, else defaults to Asia/Jerusalem. An AI agent holding the customer\'s card can add a payment method directly. The Meta popup is a browser step, so a hosted link is returned and the code is exchanged via the API.',
    },
    endpoints: [
      {
        method: 'POST', path: '/onboarding/check-organization', scope: 'onboarding:read',
        summary: { he: '????? ?? ??? ???? ????? ????? + ?.?/?.?, ???? ???? ?????? ??????? ??? ??????.', en: 'Check whether an org already exists for a company + tax id, and whether an incomplete onboarding can be resumed.' },
        params: [
          { name: 'companyName', in: 'body', type: 'string', required: true, desc: { he: '?? ?????.', en: 'Company name.' } },
          { name: 'companyIdNumber', in: 'body', type: 'string', required: true, desc: { he: '?.?/?.? (9 ?????).', en: 'Company/tax id (9 digits).' } },
        ],
        request: `{ "companyName": "??? ?????", "companyIdNumber": "514999999" }`,
        curl: curl('POST', '/onboarding/check-organization', { companyName: 'Cohen & Sons', companyIdNumber: '514999999' }),
        response: `{ "success": true, "data": { "sanitizedOrgName": "…", "nameExists": false, "countByCompanyId": 0, "existingIncomplete": false, "resumeUrl": null } }`,
      },
      {
        method: 'POST', path: '/onboarding/organization-name', scope: 'onboarding:read',
        summary: { he: '????? ?? ????? ?????? ???? + ?.?/?.? (????? ????? ?? ????).', en: 'Generate a unique organization name from the name + tax id (adds a suffix if taken).' },
        params: [
          { name: 'companyName', in: 'body', type: 'string', required: true, desc: { he: '?? ?????.', en: 'Company name.' } },
          { name: 'companyIdNumber', in: 'body', type: 'string', required: true, desc: { he: '?.?/?.?.', en: 'Company/tax id.' } },
        ],
        request: `{ "companyName": "??? ?????", "companyIdNumber": "514999999" }`,
        curl: curl('POST', '/onboarding/organization-name', { companyName: 'Cohen & Sons', companyIdNumber: '514999999' }),
        response: `{ "success": true, "data": { "organizationName": "cohen-sons-514999999" } }`,
      },
      {
        method: 'POST', path: '/onboarding/available-numbers', scope: 'onboarding:read',
        summary: { he: '????? ?????? ?????? ?????? ??? ????? (Twilio) — ???? ??? ????? ?-SIM ?? ??????.', en: 'List phone numbers available to buy for a country (Twilio) — pick one to purchase as the account SIM.' },
        params: [
          { name: 'countryCode', in: 'body', type: 'string', required: true, desc: { he: '??? ????? ISO-3166 alpha-2 (?????? US, GB, IL).', en: 'ISO-3166 alpha-2 country code (e.g. US, GB, IL).' } },
          { name: 'numberType', in: 'body', type: 'string', required: false, desc: { he: 'local/mobile/tollfree/national (????? ???? local).', en: 'local/mobile/tollfree/national (default local).' } },
        ],
        request: `{ "countryCode": "US", "numberType": "local" }`,
        curl: curl('POST', '/onboarding/available-numbers', { countryCode: 'US', numberType: 'local' }),
        response: `{ "success": true, "data": { "countryCode": "US", "numberType": "local", "count": 2, "numbers": [ { "phoneNumber": "+1201555....", "friendlyName": "(201) 555-....", "locality": "Jersey City", "region": "NJ", "capabilities": { "voice": true, "sms": true, "mms": true } } ] } }`,
        notes: { he: '?????? ?? phoneNumber ????? ?-create-trial/create-paid ?-simInfo.selectedSimNumber ?? simInfo.purchaseInTwilio=true.', en: 'Pass the chosen phoneNumber to create-trial/create-paid as simInfo.selectedSimNumber with simInfo.purchaseInTwilio=true.' },
      },
      {
        method: 'POST', path: '/onboarding/create-trial', scope: 'onboarding:write',
        summary: { he: '????? ????? ?????? ???? + ????? ????? (??? ?????). ???? ??????? ?????? ????? ?????????.', en: 'Create a FREE-TRIAL organization + first user (no card). Login credentials are emailed & WhatsApp\'d.' },
        params: [
          { name: 'useFreeNumber', in: 'body', type: 'bool', required: false, desc: { he: '???? ????? ????? ?? ??? (??????? ????).', en: 'Meta\'s free TEST number (testing only).' } },
          { name: 'useCoexisting', in: 'body', type: 'bool', required: false, desc: { he: '???? WhatsApp Business ???? (simInfo.simNumberEntered).', en: 'Existing WhatsApp Business number (simInfo.simNumberEntered).' } },
          { name: 'plan', in: 'body', type: 'string', required: false, desc: { he: 'Basic/Premium/Enterprise.', en: 'Basic/Premium/Enterprise.' } },
          { name: 'currency', in: 'body', type: 'string', required: false, desc: { he: 'ILS/USD/EUR/GBP.', en: 'ILS/USD/EUR/GBP.' } },
          { name: 'companyInfo', in: 'body', type: 'object', required: true, desc: { he: '{ organizationName (????), timezone (IANA, ?????; ???? ??????? ?? ???), country (ISO-3166), companyName, idNumber, companyUrl, companyPhoneNumber }.', en: '{ organizationName (required), timezone (IANA, recommended; derived from country if omitted), country (ISO-3166), companyName, idNumber, companyUrl, companyPhoneNumber }.' } },
          { name: 'contactInfo', in: 'body', type: 'object', required: false, desc: { he: '{ contactFullName, contactEmail, contactPhoneNumber }.', en: '{ contactFullName, contactEmail, contactPhoneNumber }.' } },
          { name: 'simInfo', in: 'body', type: 'object', required: false, desc: { he: '{ hasSim, simNumberEntered, selectedSimNumber, purchaseInTwilio }. ?????? ???? ??????: purchaseInTwilio=true + selectedSimNumber.', en: '{ hasSim, simNumberEntered, selectedSimNumber, purchaseInTwilio }. To buy a number from us: purchaseInTwilio=true + selectedSimNumber.' } },
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
        notes: { he: 'companyInfo.timezone (IANA) ????? — ?? ???/?? ???? ??? ???? ?-country, ????? ????? ???? Asia/Jerusalem (?? ???? ????? ?????). ???????? ????: useFreeNumber · useCoexisting · ???? ???? (simInfo.simNumberEntered) · ????? ?????? (purchaseInTwilio=true + selectedSimNumber ?-available-numbers).', en: 'companyInfo.timezone (IANA) is recommended — if missing/invalid it is derived from country, else defaults to Asia/Jerusalem (never hard-fails onboarding). Number options: useFreeNumber · useCoexisting · BYO (simInfo.simNumberEntered) · buy from us (purchaseInTwilio=true + selectedSimNumber from available-numbers).' },
      },
      {
        method: 'POST', path: '/onboarding/create-paid', scope: 'onboarding:write',
        summary: { he: '????? ????? ??? ?????? (??? ???? ??????). ????? ???? — ???? ???? ?????? ????? ???.', en: 'Create a straight-to-paid account (no trial month). A card is mandatory — its token is saved and billing starts immediately.' },
        params: [
          { name: 'card', in: 'body', type: 'object', required: true, desc: { he: '????. { cardNumber, expirationDate ("MM/YY"), cvv?, holderId? }. ?????? ???? ?? ????? ?-PCI ??? ????.', en: 'REQUIRED. { cardNumber, expirationDate ("MM/YY"), cvv?, holderId? }. The card is sent only to the PCI clearing provider and never stored.' } },
          { name: 'companyInfo', in: 'body', type: 'object', required: true, desc: { he: '{ organizationName (????), timezone (IANA, ?????; ???? ??????? ?? ???), country (ISO-3166), … }.', en: '{ organizationName (required), timezone (IANA, recommended; derived from country if omitted), country (ISO-3166), … }.' } },
          { name: 'plan', in: 'body', type: 'string', required: false, desc: { he: 'Basic/Premium/Enterprise.', en: 'Basic/Premium/Enterprise.' } },
          { name: 'simInfo', in: 'body', type: 'object', required: false, desc: { he: '??? ?-create-trial.', en: 'Same as create-trial.' } },
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
        notes: { he: '?? ?????? ?????? ?? ????? ?????? ????? — ?????? ????; ??? ??? ?? /onboarding/add-payment-method.', en: 'If the account is created but the card fails to save, retry with /onboarding/add-payment-method.' },
      },
      {
        method: 'POST', path: '/onboarding/add-payment-method', scope: 'billing:write',
        summary: { he: '????? ????? ??? ????? (Tranzila) ?????? ????? ?????? — ???? AI ?? ????? ????? ???? ????? ????? ??? ???? ?????.', en: 'Verify a card with the clearing provider (Tranzila) and save its token to the org — an AI agent with the customer\'s card adds a payment method without the hosted page.' },
        params: [
          { name: 'organizationName', in: 'body', type: 'string', required: true, desc: { he: '?? ??????.', en: 'Organization name.' } },
          { name: 'card', in: 'body', type: 'object', required: true, desc: { he: '????. { cardNumber, expirationDate ("MM/YY"), cvv?, holderId? }.', en: 'REQUIRED. { cardNumber, expirationDate ("MM/YY"), cvv?, holderId? }.' } },
          { name: 'plan', in: 'body', type: 'string', required: false, desc: { he: '?????? (???? ?????).', en: 'Plan (for the product code).' } },
        ],
        request: `{ "organizationName": "acme-inc-123", "plan": "Premium", "card": { "cardNumber": "4580000000000000", "expirationDate": "05/28", "cvv": "123" } }`,
        curl: curl('POST', '/onboarding/add-payment-method', { organizationName: 'acme-inc-123', plan: 'Premium', card: { cardNumber: '4580000000000000', expirationDate: '05/28', cvv: '123' } }),
        response: `{ "success": true, "message": "Payment method saved. The card token is on file for this organization.", "data": { "organizationName": "acme-inc-123" } }`,
        notes: { he: '?????? ???? ?? ????? ????-PCI; ????? ????? ???? ???? (4 ????? ??????? + ????). ?????? ?????? ?????? ?-/onboarding/payment-link.', en: 'The card is sent only to the PCI-compliant clearing provider; Gambot stores a token only (last 4 + expiry). For a hosted alternative use /onboarding/payment-link.' },
      },
      {
        method: 'POST', path: '/onboarding/payment-link', scope: 'onboarding:read',
        summary: { he: '????? ????? ????? ?????? (Tranzila) ?????? ????? ??????. ?-API ?? ???? ????? ??????.', en: 'Build a secure hosted payment link (Tranzila) to add a card for an organization. The API never handles card data.' },
        params: [
          { name: 'organizationName', in: 'body', type: 'string', required: true, desc: { he: '?? ??????.', en: 'Organization name.' } },
          { name: 'plan', in: 'body', type: 'string', required: false, desc: { he: '??????.', en: 'Plan.' } },
          { name: 'price', in: 'body', type: 'string', required: false, desc: { he: '????.', en: 'Price.' } },
          { name: 'paymentCycle', in: 'body', type: 'string', required: false, desc: { he: 'monthly/yearly.', en: 'monthly/yearly.' } },
          { name: 'currency', in: 'body', type: 'string', required: false, desc: { he: '????.', en: 'Currency.' } },
          { name: 'contactEmail', in: 'body', type: 'string', required: false, desc: { he: '???? ??? ???.', en: 'Contact email.' } },
        ],
        request: `{ "organizationName": "cohen-sons-514999999", "plan": "Basic", "price": "179", "paymentCycle": "monthly", "currency": "ILS", "contactEmail": "dana@example.com" }`,
        curl: curl('POST', '/onboarding/payment-link', { organizationName: 'cohen-sons-514999999', plan: 'Basic', price: '179', paymentCycle: 'monthly', currency: 'ILS' }),
        response: `{ "success": true, "message": "Secure hosted payment link.", "data": { "url": "https://gambot.co.il/addpayment?organizationName=cohen-sons-514999999&plan=Basic&price=179&paymentCycle=monthly&currency=ILS" } }`,
        notes: { he: '???? ?? ?????? ?? ????? ??? ????? ????? ????? ??????; ???? ?????? ???? ???????? ??????.', en: 'Share the link with the customer to enter a card on the secure page; the card token is saved automatically on success.' },
      },
      {
        method: 'GET', path: '/onboarding/waba/connect-link', scope: 'onboarding:read',
        summary: { he: '???? ????? ????? ?????? ?????? Meta Embedded Signup (????? WhatsApp).', en: 'Get the hosted page URL to complete Meta Embedded Signup (connect WhatsApp).' },
        params: [{ name: 'organization', in: 'query', type: 'string', required: true, desc: { he: '?? ??????.', en: 'Organization name.' } }],
        request: null,
        curl: `curl "${API_BASE}/onboarding/waba/connect-link?organization=cohen-sons-514999999" \\\n  -H "Authorization: Bearer gmbt_YOUR_TOKEN"`,
        response: `{ "success": true, "data": { "url": "https://gambot.co.il/complete-waba/cohen-sons-514999999" } }`,
      },
      {
        method: 'POST', path: '/onboarding/waba/exchange-token', scope: 'waba:write',
        summary: { he: '????? Meta Embedded Signup ?"? ????? ?-code ????? ??????? — ???? WABA, webhooks ?????.', en: 'Complete Meta Embedded Signup by exchanging the code from the Facebook popup — registers the WABA, webhooks and phone.' },
        params: [
          { name: 'code', in: 'body', type: 'string', required: true, desc: { he: '??? ?????? ????? Meta Embedded Signup.', en: 'Authorization code from the Meta Embedded Signup popup.' } },
          { name: 'organization', in: 'body', type: 'string', required: true, desc: { he: '?? ??????.', en: 'Organization name.' } },
          { name: 'isCoexisting', in: 'body', type: 'bool', required: false, desc: { he: '????? coexistence.', en: 'Coexistence connection.' } },
          { name: 'coexistingPhoneNumber', in: 'body', type: 'string', required: false, desc: { he: '???? ???? (coexistence).', en: 'Existing number (coexistence).' } },
        ],
        request: `{ "code": "AQD...", "organization": "cohen-sons-514999999", "isCoexisting": true, "coexistingPhoneNumber": "972501234567" }`,
        curl: curl('POST', '/onboarding/waba/exchange-token', { code: 'AQD...', organization: 'cohen-sons-514999999' }),
        response: `{ "success": true, "message": "WhatsApp (WABA) connected successfully.", "data": { "organization": "cohen-sons-514999999", "message": "Business token updated successfully for organization." } }`,
        notes: { he: '?? ?-code ?????? ????? Meta Embedded Signup (??? ?????, ???? ????? connect-link). ?-API ??? ??? ????? ???? ???.', en: 'The code is obtained from the Meta Embedded Signup popup (a browser step, e.g. on the connect-link page). The API cannot mint it on its own.' },
      },
    ],
  },
];

// Flat scope list for the "permissions" reference.
export const API_SCOPES = [
  { scope: 'messages:send', he: '????? ?????? ???????', en: 'Send messages and templates' },
  { scope: 'conversations:read', he: '????? ????? ???????', en: 'Read conversations and messages' },
  { scope: 'templates:read', he: '????? ??????', en: 'Read templates' },
  { scope: 'templates:write', he: '????? ??????', en: 'Create templates' },
  { scope: 'contacts:read', he: '????? ???? ???', en: 'Read contacts' },
  { scope: 'contacts:write', he: '?????/????? ???? ???', en: 'Create/update contacts' },
  { scope: 'leads:read', he: '????? ?????', en: 'Read leads' },
  { scope: 'leads:write', he: '?????/????? ?????', en: 'Create/update leads' },
  { scope: 'cases:read', he: '????? ?????', en: 'Read cases' },
  { scope: 'cases:write', he: '?????/????? ?????', en: 'Create/update cases' },
  { scope: 'tasks:read', he: '????? ??????', en: 'Read tasks' },
  { scope: 'tasks:write', he: '?????/????? ??????', en: 'Create/update tasks' },
  { scope: 'notes:read', he: '????? ?????', en: 'Read notes' },
  { scope: 'quotes:read', he: '????? ????? ????', en: 'Read quotes' },
  { scope: 'quotes:write', he: '?????/????? ????? ????', en: 'Create/update quotes' },
  { scope: 'invoices:read', he: '????? ????????', en: 'Read invoices' },
  { scope: 'invoices:write', he: '?????/?????/???? ????????', en: 'Create/update/issue invoices' },
  { scope: 'orders:read', he: '????? ??????', en: 'Read orders' },
  { scope: 'orders:write', he: '?????/????? ??????', en: 'Create/update orders' },
  { scope: 'signatures:read', he: '????? ????? ?????', en: 'Read signature documents' },
  { scope: 'forms:read', he: '????? ????? ???????', en: 'Read forms and submissions' },
  { scope: 'documents:read', he: '????? ?????? ?????? ???????', en: 'Read document templates and submissions' },
  { scope: 'users:read', he: '????? ???????', en: 'Read users' },
  { scope: 'users:write', he: '?????/?????/????? ???????', en: 'Create/update/delete users' },
  { scope: 'campaigns:read', he: '????? ???????? ???????', en: 'Read campaigns and results' },
  { scope: 'campaigns:write', he: '?????/?????/????? ????????', en: 'Create/update/delete campaigns' },
  { scope: 'campaigns:run', he: '???? ???????? (???? ?????)', en: 'Run campaigns (incl. test)' },
  { scope: 'bots:read', he: '????? ????? ??????????', en: 'Read bots and automations' },
  { scope: 'bots:write', he: '?????/?????/?????/????? ?? ?????', en: 'Create/update/delete/toggle bots' },
  { scope: 'onboarding:read', he: '????? ????? + ????? ?????? + ?????? ???????/?????', en: 'Check organization + search numbers + onboarding/payment links' },
  { scope: 'onboarding:write', he: '????? ????? (?????? ?? ??????)', en: 'Create an account (trial or paid)' },
  { scope: 'billing:write', he: '????? ????? ????? (????? ????)', en: 'Add a payment method (card on file)' },
  { scope: 'waba:write', he: '????? WhatsApp (Meta Embedded Signup)', en: 'Connect WhatsApp (Meta Embedded Signup)' },
];

// Inbound message forwarding (webhook-out) — configured in the Gambot UI, not via the API.
export const API_INBOUND = {
  title: { he: '????? ??????? (Webhook)', en: 'Event Forwarding (Webhook)' },
  intro: {
    he: '???? ?????? ?-Gambot ????? <strong>?? ????? ???? ?????</strong> (?????? ??????, ?????? ?????, ?????? ?????? ????) ?? ??? ?????. ????? <strong>??????</strong> ?? ????? ?-JSON ??? ?????? <code>type</code> ????? (??? ??????) ????? ?? ?-payload ?????? ?? ??? ??? <code>meta_obj</code> — ??? ??? ???? ??? ???? ???? ?? ??? ??? ????? ?????.',
    en: 'You can have Gambot forward <strong>every event Meta sends</strong> (incoming messages, message statuses, template updates and more) to your own server. We <strong>wrap</strong> the data in a small JSON envelope that adds a root <code>type</code> (the event kind) and keeps Meta\'s original payload under <code>meta_obj</code> — so your side instantly knows what happened without deep parsing.',
  },
  howTitle: { he: '?????', en: 'Enable it' },
  how: {
    he: '????? ??????: <strong>?????? ? ???? ? ????? ??????? (Webhook)</strong>. ?????? ?? ????????, ?????? ????? URL (????), ?????????? ????? <code>Authorization</code>, ??????? ???? ??????? ??????. <strong>?????? ???? ?? ???????? ??????.</strong>',
    en: 'In the admin panel: <strong>Settings ? General ? Event Forwarding (Webhook)</strong>. Tick the checkbox, enter a URL (required), optionally an <code>Authorization</code> header, and choose which events to forward. <strong>By default all events are ON.</strong>',
  },
  requestTitle: { he: '?? ?????', en: 'What you receive' },
  request: {
    he: '??? ????? ???? <code>POST</code> ?? ?-URL ???? ?? ?-Envelope (????? ?????? ?? ??? ??? <code>meta_obj</code>) ????????. ???? ???????? ?-<code>type</code>: <code>incoming_message</code> (????? ?????), <code>message_status</code> (?????/?????/?????/?????), <code>template_status_update</code> (?????/????? ?????), <code>template_category_update</code>, <code>template_quality_update</code>, ????.',
    en: 'For each event we send a <code>POST</code> to your URL with the envelope (Meta\'s original data under <code>meta_obj</code>) and the headers. The <code>type</code> values are: <code>incoming_message</code>, <code>message_status</code> (sent/delivered/read/failed), <code>template_status_update</code> (template change/approval), <code>template_category_update</code>, <code>template_quality_update</code>, and other.',
  },
  headers: [
    { key: 'Authorization', he: '???? ??????? (?? ??????).', en: 'The value you configured (if any).' },
    { key: 'X-Gambot-Organization', he: '?? ?????? ????.', en: 'Your organization name.' },
    { key: 'X-Gambot-Event', he: '??? ?????? (??? ?-type ?????), ???? incoming_message.', en: 'The event type (matches root type), e.g. incoming_message.' },
  ],
  payloadNote: { he: '????? ??? (Envelope ?? ?-payload ?? ??? ?????):', en: 'Sample body (envelope wrapping Meta\'s payload):' },
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
          "contacts": [{ "profile": { "name": "???" }, "wa_id": "972501234567" }],
          "messages": [{
            "from": "972501234567",
            "id": "wamid.HBg...",
            "timestamp": "1757600000",
            "type": "text",
            "text": { "body": "????, ???? ??????" }
          }]
        }
      }]
    }]
  }
}`,
  tip: {
    he: '???: ?????? <code>200 OK</code> ???. ?????? ????? ???? ????? ?????????. ?????? ??? fire-and-forget ??? ????? ?? ???? (no retry). ??? ???? ??? ????? ????? ???? ??? ??? webhook — ?? ???? ?????, ??? ???? ?? ?????.',
    en: 'Tip: return <code>200 OK</code> fast and process asynchronously. Forwarding is fire-and-forget (no retry). Meta usually sends one event type per webhook — if you turned that type off, it simply won\'t be forwarded.',
  },
};

// MCP (Model Context Protocol) server section — connect AI agents (Cursor, Claude…) to Gambot.
export const API_MCP = {
  title: { he: '??? MCP', en: 'MCP Server' },
  intro: {
    he: '??? ?-<strong>Gambot MCP</strong> ???? ?? ?? ?-API ????? (tools) ???? ????? AI ??? <strong>Cursor, Claude, ChatGPT ?-Gemini</strong> — ????? ??????, ????? ?????, ????????, ??????? ???? — ??? ??? ???? ?????. ??? ???? ?? ???? <code>api/v1</code> ?????? ?? ?-Gambot Token. ???? ???? ????? <a href="/whatsapp-mcp/">WhatsApp MCP</a>.',
    en: 'The <strong>Gambot MCP</strong> server exposes the entire API as tools for AI agents like <strong>Cursor, Claude, ChatGPT and Gemini</strong> — send messages, manage leads, invoices, users and more — all through natural language. It wraps the same <code>api/v1</code> and authenticates with your Gambot Token. Learn more on the <a href="/whatsapp-mcp/">WhatsApp MCP page</a>.',
  },
  installTitle: { he: '????? ?????? (Desktop — Cursor / Claude Desktop)', en: 'Local install (Desktop — Cursor / Claude Desktop)' },
  install: `# No install or build needed — your MCP client runs it on demand:
npx -y gambot-mcp`,
  configTitle: { he: '????? ?-Cursor / Claude Desktop', en: 'Connect to Cursor / Claude Desktop' },
  configNote: {
    he: '?????? ?-<code>.cursor/mcp.json</code> (?? <code>claude_desktop_config.json</code>) ??????? ????:',
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
  cursorButton: { he: '? ????? ?-Cursor ??????', en: '? Add to Cursor (one click)' },
  cursorButtonNote: {
    he: '???? ??????, ????? ?? ?-Gambot Token ???? ?????? ????.',
    en: 'After adding, paste your Gambot Token into the server\'s env.',
  },

  // -- Online / hosted MCP (Streamable HTTP) — one generic flow for every AI tool --
  remoteTitle: { he: '????? ??????? (MCP ?????) — ??? ??? AI', en: 'Online (hosted) MCP — for any AI tool' },
  remoteIntro: {
    he: '???? ??????-??? ??? ?????? ????? ????? ????? (<strong>ChatGPT, Claude, Gemini, Base44, Lovable, n8n, Make</strong> ????) ??????? ????? ??? MCP ??? <strong>????? URL ??????</strong> (Streamable HTTP) ????? <code>npx</code> — ?????? ?? <strong>97 ?????</strong>. ??????? ???? ??? ?????; ???? ?? ???? ??????? ?? ?-URL ???? ???????.',
    en: 'Cloud-based tools that can\'t run a local process (<strong>ChatGPT, Claude, Gemini, Base44, Lovable, n8n, Make</strong> and more) connect to the same MCP server through a <strong>hosted URL</strong> (Streamable HTTP) instead of <code>npx</code> — exposing all <strong>98 tools</strong>. The steps are identical everywhere; only where you paste the URL and how you authenticate changes.',
  },
  remoteUrlLabel: { he: '????? ???? (Server URL)', en: 'Server URL' },
  remoteUrl: MCP_REMOTE_URL,
  remoteAuthTitle: { he: '????? — ??? ????????', en: 'Authentication — two options' },
  remoteAuthNote: {
    he: '???? ???? ???? ???? ???????; ???? ??? ?? ????? ????:<br/>' +
        '<strong>1) OAuth 2.0 (??? ????)</strong> — ?????? ?? ?? ?-Server URL, ????? ???? ??? ??????? (OAuth · PKCE · ????? ???? ?????). ????? ?-ChatGPT/Claude connectors ???? ??? ????? ?"Add custom connector" ?? URL ???? — ??? ?????? ???? ?????.<br/>' +
        '<strong>2) Bearer Token</strong> — ????? HTTP <code>Authorization: Bearer gmbt_your_token_here</code> (?? ????? ?-Gambot Token ???? ?-API Key / Token). ??? ???? ?????? ????? ???????? ???? ?????.',
    en: 'The server supports two ways to connect; pick whichever your tool offers:<br/>' +
        '<strong>1) OAuth 2.0 (easiest)</strong> — paste only the Server URL and the tool launches a sign-in screen (OAuth · PKCE · Dynamic Client Registration). Ideal for ChatGPT/Claude connectors and any tool that offers "Add custom connector" with just a URL — no manual token copying.<br/>' +
        '<strong>2) Bearer Token</strong> — HTTP header <code>Authorization: Bearer gmbt_your_token_here</code> (or paste the Gambot Token into the API Key / Token field). Either way the organization is resolved automatically from your identity.',
  },
  remoteManifestNote: {
    he: '????? ??????? (Manifest): ???? ?????-OAuth ?????? ?? ????-???? ?-<code>/.well-known/oauth-protected-resource/mcp</code> ?-<code>/.well-known/oauth-authorization-server</code>. ?????? ????: <code>/health</code>.',
    en: 'Auto-discovery (Manifest): OAuth-capable tools read the metadata from <code>/.well-known/oauth-protected-resource/mcp</code> and <code>/.well-known/oauth-authorization-server</code>. Server health: <code>/health</code>.',
  },
  remoteStepsTitle: { he: '????? ????? (????? ??? ???)', en: 'Generic steps (work in every tool)' },
  remoteSteps: {
    he: [
      '?????? ???? ?? ????? ?????? ???/???? MCP (???? ???: Settings ? Connectors / Integrations / MCP Servers).',
      '?????? ??? ??? <strong>Remote / URL / HTTP</strong> (??? Local/Command).',
      '??????? ?? ?-Server URL ??????.',
      '???????: ?? ???? ???? <strong>OAuth / Sign in</strong> — ???? ??????? (??? ????). ???? ??????? ????? <code>Authorization: Bearer gmbt_...</code> ?? ??????? ?? ????? ???? ?-Token/API Key.',
      '?????? ????????. ???? ????? ???????? ?? ?? 97 ?????, ??????? ????? ?????? ????.',
    ],
    en: [
      'In your tool, open where MCP servers/connectors are added (usually: Settings ? Connectors / Integrations / MCP Servers).',
      'Choose a <strong>Remote / URL / HTTP</strong> server type (not Local/Command).',
      'Paste the Server URL above.',
      'Authenticate: if the tool offers <strong>OAuth / Sign in</strong> — just sign in (no token). Otherwise add an <code>Authorization: Bearer gmbt_...</code> header or paste the token into the Token/API Key field.',
      'Save and enable. The tool auto-discovers all 98 tools and the organization is resolved from your identity.',
    ],
  },
  remoteConfigTitle: { he: '????? ???????? ????? ?????? (JSON)', en: 'For tools that use a config file (JSON)' },
  remoteConfigNote: {
    he: '???? ??????? ???? MCP ????? ??? JSON (???? Cursor, VS Code, Windsurf) — ?????? ????? ???:',
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
    he: '???: ?? ??? ???? ?? "URL" ??? ?????? ???????, ???? ???? ?????? ?? ????? ?????? — <code>' + MCP_REMOTE_URL + '?token=gmbt_your_token_here</code>. ???? ???? ?????? ?????? <code>Authorization</code> ??????.',
    en: 'Tip: if a tool only asks for a "URL" with no headers option, you can usually append the token as a query param — <code>' + MCP_REMOTE_URL + '?token=gmbt_your_token_here</code>. Prefer the <code>Authorization</code> header whenever possible.',
  },

  toolsNote: {
    he: '???? ??????, ????? ???? ????? ????? ??? <code>gambot_send_text</code>, <code>gambot_create_lead</code>, <code>gambot_issue_invoice</code>, <code>gambot_create_user</code> ???? (97 ????). ?????? ?????? ?? ????, ??????? ?-Footer: <code>gambot_create_template</code> (???? ?????? <code>headerMediaUrl</code>) ?-<code>gambot_upload_template_media</code>. <strong>????? ????? ?????</strong>: <code>gambot_create_keyword_autoreply</code>, <code>gambot_create_template_button_autoreply</code>, <code>gambot_create_menu_bot</code>, ??? <code>gambot_create_bot</code>/<code>gambot_list_bots</code>/<code>gambot_get_bot</code>/<code>gambot_set_bot_status</code>/<code>gambot_delete_bot</code> — ??? ???? <a href="#bots">????? ??????????</a>.',
    en: 'Once connected, the agent can call tools like <code>gambot_send_text</code>, <code>gambot_create_lead</code>, <code>gambot_issue_invoice</code>, <code>gambot_create_user</code> and more (98 tools). For templates with media, buttons and footer: <code>gambot_create_template</code> (pass <code>headerMediaUrl</code>) and <code>gambot_upload_template_media</code>. <strong>Build bots by chatting</strong>: <code>gambot_create_keyword_autoreply</code>, <code>gambot_create_template_button_autoreply</code>, <code>gambot_create_menu_bot</code>, plus <code>gambot_create_bot</code>/<code>gambot_list_bots</code>/<code>gambot_get_bot</code>/<code>gambot_set_bot_status</code>/<code>gambot_delete_bot</code> — see the <a href="#bots">Bots &amp; Automations</a> section.',
  },
};

export const DEV_GUIDE_TX = {
  he: {
    badge: '?? ??????',
    title: '????? ????? — Gambot API',
    sub: '?-API ????? ?? Gambot ?????? ??????, ????? ??????, ???? ???, ????? ????.',
    onThisPage: '????? ???',
    baseUrlLabel: '????? ????',
    scopeLabel: '?????',
    requestBody: '??? ?????',
    exampleRequest: '????? ????',
    exampleResponse: '????? ?????',
    moreExamples: '??? ???????',
    params: '???????',
    name: '??',
    type: '???',
    required: '????',
    location: '?????',
    description: '?????',
    yes: '??',
    no: '??',
    copy: '????',
    copied: '?????!',
    scopesTitle: '?????? (Scopes)',
    scopesIntro: '????? ?????: ????? ????? ??? ???????. ???? ????? ?????? ???????.',
    ctaTitle: '?? ?????? ???????',
    ctaBody: '??? ?? ?-Gambot Token ???????? ????? ?? ????? ??????? ????.',
    ctaBtn: '???? ????? ?????',
  },
  en: {
    badge: '?? Developers',
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
    ctaTitle: '?? Ready to start?',
    ctaBody: 'Grab your Gambot Token from Settings and send your first request.',
    ctaBtn: 'Create a free account',
  },
};


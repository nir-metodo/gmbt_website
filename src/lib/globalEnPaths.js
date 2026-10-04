/**
 * First-path-segments of the English-authored GLOBAL developer / MCP / AI-agent pages.
 *
 * These pages are written in English (title, meta, schema, canonical are all English), so their
 * server-rendered HTML must be English too — otherwise crawlers that don't run JavaScript (AI
 * crawlers, most social/preview bots) see an English <title> over a Hebrew body.
 *
 * Deliberately a NARROW list: Israeli (Hebrew) pages and the bilingual /developers/ page are NOT
 * included, so their server-rendered output — and Israeli SEO — is unchanged.
 */
export const GLOBAL_EN_SSR_SEGMENTS = [
  'whatsapp-mcp',
  'whatsapp-mcp-vs-whatsapp-web',
  'whatsapp-api',
  'whatsapp-api-for-ai-agents',
  'whatsapp-api-for-developers',
  'whatsapp-api-vs-meta-cloud-api',
  'whatsapp-business-api',
  'whatsapp-cloud-api',
];

/** First path segment, e.g. "/whatsapp-mcp/claude/" -> "whatsapp-mcp". */
export function firstPathSegment(path) {
  try {
    return decodeURIComponent(path || '').replace(/^\/+/, '').split('/')[0] || '';
  } catch {
    return (path || '').replace(/^\/+/, '').split('/')[0] || '';
  }
}

export function isGlobalEnSsrPath(path) {
  return GLOBAL_EN_SSR_SEGMENTS.includes(firstPathSegment(path));
}

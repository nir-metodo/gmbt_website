/**
 * Lightweight, safe conversion-tracking helper for the global developer / MCP / AI-agent funnel.
 *
 * Wraps the site's existing analytics (GA4 `G-GFMXYNTV1N`, Google Ads `AW-18018385768`, Meta Pixel),
 * which are loaded globally in `src/app/layout.js`. This adds the developer/MCP funnel events the
 * business needs to answer: "How many registrations came from organic developer/MCP traffic?"
 *
 * Every call is best-effort and no-ops on the server or when analytics haven't loaded yet, so it is
 * safe to import from any client component. It never throws.
 *
 * Attribution: first-touch landing page + referrer + UTM params are captured once (first visit) in
 * localStorage and attached to every event, so the signup event can be tied back to the entry page.
 */

const ATTR_KEY = 'gmbt_first_touch';

/**
 * AI / developer-discovery channel of a visit, so the funnel can answer "which AI surface sent this
 * visitor?". Explicit `utm_source` / `ref` wins; otherwise the referrer host is used. Returns '' when the
 * visit is not from a recognised AI / developer-discovery surface (so ordinary organic traffic stays untagged).
 */
const SOURCE_ALIASES = [
  [/^(claude|claude[-_]?code|anthropic)$/, 'claude'],
  [/^(chatgpt|openai|gpt)$/, 'chatgpt'],
  [/^codex$/, 'codex'],
  [/^cursor$/, 'cursor'],
  [/^(gemini|gemini[-_]?cli|bard)$/, 'gemini'],
  [/^(copilot|vscode|vs[-_]?code)$/, 'copilot'],
  [/^(windsurf|codeium)$/, 'windsurf'],
  [/^(replit|lovable|base44)$/, null], // keep the platform name itself
  [/^perplexity$/, 'perplexity'],
  [/^github$/, 'github'],
  [/^npm$/, 'npm'],
  [/^(mcp[-_]?registry|mcp[-_]?directory|smithery|glama|pulsemcp|mcp[-_]?so)$/, 'mcp-directory'],
  [/^agent[-_]?skills?$/, 'agent-skill'],
  [/^mcp[-_]?oauth$/, 'mcp-oauth'],
];
const REFERRER_HOSTS = [
  [/(^|\.)claude\.ai$|(^|\.)anthropic\.com$/, 'claude'],
  [/(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$|(^|\.)openai\.com$/, 'chatgpt'],
  [/(^|\.)cursor\.com$|(^|\.)cursor\.sh$/, 'cursor'],
  [/(^|\.)gemini\.google\.com$|(^|\.)aistudio\.google\.com$/, 'gemini'],
  [/(^|\.)perplexity\.ai$/, 'perplexity'],
  [/(^|\.)copilot\.microsoft\.com$/, 'copilot'],
  [/(^|\.)github\.com$/, 'github'],
  [/(^|\.)npmjs\.com$/, 'npm'],
  [/(^|\.)registry\.modelcontextprotocol\.io$|(^|\.)smithery\.ai$|(^|\.)glama\.ai$|(^|\.)pulsemcp\.com$|(^|\.)mcp\.so$|(^|\.)cursor\.directory$/, 'mcp-directory'],
];

export function classifyAiChannel({ utm_source = '', ref = '', referrer = '' } = {}) {
  const explicit = String(utm_source || ref || '').trim().toLowerCase();
  if (explicit) {
    for (const [re, name] of SOURCE_ALIASES) if (re.test(explicit)) return name === null ? explicit : name;
  }
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    for (const [re, name] of REFERRER_HOSTS) if (re.test(host)) return name;
  } catch { /* no referrer / "(direct)" */ }
  return '';
}

/** Read (and lazily persist on first visit) the first-touch attribution context. */
export function getAttribution() {
  if (typeof window === 'undefined') return {};
  try {
    const existing = window.localStorage.getItem(ATTR_KEY);
    if (existing) return JSON.parse(existing);
    const params = new URLSearchParams(window.location.search);
    const attribution = {
      landing_page: window.location.pathname,
      referrer: document.referrer || '(direct)',
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || '',
      // Visitor locale/timezone: lets us tell international organic traffic from Israeli traffic even
      // when the landing page and referrer look identical (country itself comes from GA4 geo).
      locale: (navigator.language || '').slice(0, 12),
      timezone: (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; } })(),
      first_visit: new Date().toISOString(),
    };
    attribution.ai_channel = classifyAiChannel({
      utm_source: attribution.utm_source,
      ref: params.get('ref') || '',
      referrer: document.referrer || '',
    });
    window.localStorage.setItem(ATTR_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return {};
  }
}

/** Fire a GA4/Ads event with first-touch attribution attached. Safe/no-op if gtag is unavailable. */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, { ...getAttribution(), ...params });
    }
  } catch {
    /* analytics must never break the page */
  }
}

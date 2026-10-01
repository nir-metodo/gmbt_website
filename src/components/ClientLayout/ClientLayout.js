'use client';
import { useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { EN_SLUGS } from '@/lib/enPages';

// Best-effort, client-side guess of whether the visitor is physically in Israel — the SYNCHRONOUS
// fallback used for the very first paint and whenever the IP lookup below is blocked/offline.
// The site is a static export (no server / no request headers), so we can't read the request IP
// on the server. Timezone is the strongest signal available in the browser without an external
// API; we fall back to the browser's preferred languages when it's missing.
function isVisitorInIsrael() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz) return tz === 'Asia/Jerusalem' || tz === 'Asia/Tel_Aviv';
  } catch {
    /* Intl unavailable — fall through to language check */
  }
  try {
    const langs = (navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || '']
    ).join(',').toLowerCase();
    return /(^|,)(he|iw)(-|,|$)/.test(langs);
  } catch {
    return false;
  }
}

// ACTUAL physical-location check via IP geolocation — this is what "by location" really means:
// the visitor's IP country, not their browser timezone/locale (which VPNs, travelers and mis-set
// clocks get wrong). Returns true only when the IP resolves to Israel. Result is cached for the
// browser session, and any lookup failure falls back to the synchronous timezone/language guess.
async function detectIsraelByIpGeo(signal) {
  try {
    const cached = sessionStorage.getItem('gambot_geo_il');
    if (cached === '1') return true;
    if (cached === '0') return false;
  } catch { /* sessionStorage unavailable — just do the lookup */ }

  // Endpoints are tried in order; each returns a 2-letter ISO country code. Multiple providers so a
  // single one being down/rate-limited/ad-blocked doesn't break geo detection.
  const providers = [
    { url: 'https://ipapi.co/country/', parse: async (r) => (await r.text()).trim() },
    { url: 'https://api.country.is/', parse: async (r) => ((await r.json())?.country || '') },
    { url: 'https://ipwho.is/?fields=country_code', parse: async (r) => ((await r.json())?.country_code || '') },
  ];

  let isIL = null;
  for (const p of providers) {
    try {
      const res = await fetch(p.url, { cache: 'no-store', signal });
      if (!res.ok) continue;
      const cc = String(await p.parse(res)).trim().toUpperCase();
      if (/^[A-Z]{2}$/.test(cc)) { isIL = cc === 'IL'; break; }
    } catch {
      if (signal?.aborted) return isVisitorInIsrael();
      /* try next provider */
    }
  }

  if (isIL === null) isIL = isVisitorInIsrael(); // all providers failed → sync fallback
  try { sessionStorage.setItem('gambot_geo_il', isIL ? '1' : '0'); } catch { /* ignore */ }
  return isIL;
}

// The first path segment (decoded) — "/whatsapp-ai-bot/x" -> "whatsapp-ai-bot".
function firstSegment(path) {
  try {
    const decoded = decodeURIComponent(path || '');
    return decoded.replace(/^\/+/, '').split('/')[0] || '';
  } catch {
    return (path || '').replace(/^\/+/, '').split('/')[0] || '';
  }
}

// English-authored global pages (developer / MCP / API) — always English regardless of location.
const GLOBAL_EN = [
  'whatsapp-mcp', 'developers', 'whatsapp-api', 'whatsapp-api-for-ai-agents',
  'whatsapp-api-for-developers', 'whatsapp-mcp-vs-whatsapp-web', 'whatsapp-api-vs-meta-cloud-api',
  'whatsapp-api-pricing',
  // Marketing pages that render dedicated English components:
  'whatsapp-marketing', 'whatsapp-business-system', 'whatsapp-bot-campaign', 'whatsapp-bot-types',
  'crm-for-business', 'about',
];

// Every English URL (global pages + the English-alias registry) defaults to English so that
// crawlers and international visitors get English content on the English URL, while the Hebrew
// URLs keep serving Hebrew. This is the routing half of the hreflang pairs.
const EN_PATHS = new Set([...GLOBAL_EN, ...EN_SLUGS]);

function LangSync() {
  const { setCurrentLanguage } = useLanguage();

  useEffect(() => {
    // Language resolution priority:
    //   1. An explicit ?lang=en|he in the URL — always wins (used by links from the MCP/API
    //      onboarding flow, which targets a global/English audience). Not persisted, so it only
    //      forces the language for that link, never hijacks the visitor's saved choice afterwards.
    //   2. The visitor's explicit saved choice (navbar switcher).
    //   3. English-only global pages (MCP / developer / WhatsApp-API) — always English.
    //   4. Geo default: visitors located in Israel get Hebrew (RTL); everyone else gets English.
    const saved = localStorage.getItem('gambot_lang');
    const path = (typeof window !== 'undefined' ? window.location.pathname : '') || '';
    let qLang = '';
    try { qLang = (new URLSearchParams(window.location.search).get('lang') || '').toLowerCase(); } catch { /* no-op */ }

    const applyLang = (lang) => {
      setCurrentLanguage(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    };

    // Priorities 1–3 are explicit and final — no geo lookup needed.
    if (qLang === 'he' || qLang === 'en') { applyLang(qLang); return; }
    if (saved === 'he' || saved === 'en') { applyLang(saved); return; }
    if (EN_PATHS.has(firstSegment(path))) { applyLang('en'); return; }

    // Priority 4 — geo default. Paint immediately with the synchronous timezone/language guess so
    // there's no blank/flash, then refine with the ACTUAL IP-based location (Israel → Hebrew, rest
    // of the world → English). The refine step is skipped if the visitor has meanwhile made an
    // explicit choice (navbar switcher writes gambot_lang).
    applyLang(isVisitorInIsrael() ? 'he' : 'en');

    const controller = new AbortController();
    detectIsraelByIpGeo(controller.signal).then((isIL) => {
      if (controller.signal.aborted) return;
      if (localStorage.getItem('gambot_lang')) return; // user chose explicitly in the meantime
      applyLang(isIL ? 'he' : 'en');
    }).catch(() => { /* geo failed — keep the synchronous guess already applied */ });

    return () => controller.abort();
  }, [setCurrentLanguage]);

  return null;
}

export default function ClientLayout({ children }) {
  return (
    <LanguageProvider defaultLanguage="he">
      <LangSync />
      {children}
    </LanguageProvider>
  );
}

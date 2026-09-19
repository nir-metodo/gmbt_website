'use client';
import { useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { EN_SLUGS } from '@/lib/enPages';

// Best-effort, client-side guess of whether the visitor is physically in Israel.
// The site is a static export (no server / no request headers), so we can't read the
// request IP. Timezone is the strongest signal available in the browser without an
// external API; we fall back to the browser's preferred languages when it's missing.
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
    //   1. The visitor's explicit saved choice (navbar switcher) — always wins.
    //   2. English-only global pages (MCP / developer / WhatsApp-API) — always English.
    //   3. Geo default: Israeli visitors get Hebrew (RTL); everyone else gets English.
    const saved = localStorage.getItem('gambot_lang');
    const path = (typeof window !== 'undefined' ? window.location.pathname : '') || '';

    let lang;
    if (saved === 'he' || saved === 'en') {
      lang = saved;
    } else if (EN_PATHS.has(firstSegment(path))) {
      lang = 'en';
    } else {
      lang = isVisitorInIsrael() ? 'he' : 'en';
    }

    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
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

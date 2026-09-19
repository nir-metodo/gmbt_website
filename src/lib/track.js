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
      first_visit: new Date().toISOString(),
    };
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

/**
 * Duplicate-submission guard for public forms (each accepted submission becomes a lead).
 *
 * Why: a visitor can click "send" more than once (double-click, Enter + click, slow network, or an
 * "error" message shown even though the lead DID get through on the other channel and then a retry).
 * Without a guard every one of those creates another lead.
 *
 * Usage:
 *   const fp = fingerprint('contact-us', phone, email, message);
 *   if (wasRecentlySent(fp)) -> skip the network call and just show success
 *   markSent(fp) right before sending; unmarkSent(fp) if the send FAILED so a retry is allowed.
 */
const STORAGE_KEY = 'gb_recent_submits';
const WINDOW_MS = 10 * 60 * 1000; // identical submission within 10 minutes = same lead

const memory = new Map();

export const fingerprint = (...parts) =>
  parts.map((p) => String(p ?? '').trim().toLowerCase().replace(/\s+/g, ' ')).join('|');

const readStore = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch {
    return {};
  }
};

const writeStore = (store) => {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch { /* storage unavailable */ }
};

export const wasRecentlySent = (fp) => {
  const now = Date.now();
  const ts = Math.max(memory.get(fp) || 0, (typeof window !== 'undefined' ? readStore() : {})[fp] || 0);
  return !!ts && now - ts < WINDOW_MS;
};

export const markSent = (fp) => {
  const now = Date.now();
  memory.set(fp, now);
  if (typeof window === 'undefined') return;
  const store = readStore();
  Object.keys(store).forEach((k) => { if (now - store[k] > WINDOW_MS) delete store[k]; });
  store[fp] = now;
  writeStore(store);
};

export const unmarkSent = (fp) => {
  memory.delete(fp);
  if (typeof window === 'undefined') return;
  const store = readStore();
  delete store[fp];
  writeStore(store);
};

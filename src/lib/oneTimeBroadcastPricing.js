// Self-serve one-time broadcast ("דיוור חד פעמי — עשה זאת בעצמך") price list.
//
// ⚠️ Keep in sync with the backend source of truth:
//    Gambot-BE/Services/OneTimeBroadcastService.cs  →  Tiers / MinOrderBeforeVat / VatRate / MarketUsd / CodeMarket / MarketOf
// The wizard always shows the server's quote (GET api/OneTimeBroadcast/Pricing | Quote | Draft); this copy only
// powers the public price page and the live calculator before the order exists. The server never trusts it.
//
// GRADUATED pricing: every band is charged at its own per-message rate (no cliff where ordering more is cheaper).
// Prices in ₪ per message, before VAT; the WhatsApp/Meta marketing fee is included.
//
// DESTINATIONS: Meta bills by the recipient's country. The tiers are built on Israel; for a market whose floor
// (Meta USD × FX ÷ 0.23 — ≥ 75% margin) is above the graduated average, those messages are charged the floor.

export const OTB_API = 'https://gambot.azurewebsites.net/api/OneTimeBroadcast';

export const OTB_TIERS = [
  { from: 1, to: 500, price: 0.9 },
  { from: 501, to: 2000, price: 0.75 },
  { from: 2001, to: 5000, price: 0.65 },
  { from: 5001, to: 10000, price: 0.58 },
];

export const OTB_MIN_ORDER = 49; // ₪ before VAT
export const OTB_VAT = 0.18;
export const OTB_MAX_MESSAGES = 10000;
export const OTB_MIN_LEAD_HOURS = 24;

const PRICING_FX = 3.26;
const FLOOR_DIVISOR = 0.23;

// Meta marketing rate card (effective 1 Oct 2026), USD per delivered message, by market.
export const OTB_MARKETS = {
  AR: { label: 'ארגנטינה', usd: 0.0618 }, BD: { label: 'בנגלדש', usd: 0.0732 }, BR: { label: 'ברזיל', usd: 0.0625 },
  CL: { label: 'צ׳ילה', usd: 0.0889 }, CO: { label: 'קולומביה', usd: 0.0125 }, EG: { label: 'מצרים', usd: 0.0644 },
  FR: { label: 'צרפת', usd: 0.0859 }, DE: { label: 'גרמניה', usd: 0.1365 }, HK: { label: 'הונג קונג', usd: 0.0732 },
  HU: { label: 'הונגריה', usd: 0.086 }, IN: { label: 'הודו', usd: 0.0118 }, ID: { label: 'אינדונזיה', usd: 0.0411 },
  IQ: { label: 'עיראק', usd: 0.0341 }, IL: { label: 'ישראל', usd: 0.0353 }, IT: { label: 'איטליה', usd: 0.0795 },
  KZ: { label: 'קזחסטן', usd: 0.0604 }, KW: { label: 'כווית', usd: 0.0792 }, MY: { label: 'מלזיה', usd: 0.086 },
  MX: { label: 'מקסיקו', usd: 0.0397 }, MA: { label: 'מרוקו', usd: 0.0414 }, NL: { label: 'הולנד', usd: 0.1597 },
  NP: { label: 'נפאל', usd: 0.0732 }, NG: { label: 'ניגריה', usd: 0.0516 }, OM: { label: 'עומאן', usd: 0.0341 },
  PK: { label: 'פקיסטן', usd: 0.0473 }, PE: { label: 'פרו', usd: 0.0703 }, PL: { label: 'פולין', usd: 0.0366 },
  QA: { label: 'קטאר', usd: 0.0341 }, RO: { label: 'רומניה', usd: 0.086 }, RU: { label: 'רוסיה', usd: 0.0802 },
  SA: { label: 'סעודיה', usd: 0.0576 }, SG: { label: 'סינגפור', usd: 0.0732 }, ZA: { label: 'דרום אפריקה', usd: 0.0379 },
  ES: { label: 'ספרד', usd: 0.0707 }, LK: { label: 'סרי לנקה', usd: 0.0732 }, TR: { label: 'טורקיה', usd: 0.0109 },
  UA: { label: 'אוקראינה', usd: 0.086 }, AE: { label: 'איחוד האמירויות', usd: 0.0576 }, GB: { label: 'בריטניה', usd: 0.0635 },
  NA: { label: 'ארה״ב וקנדה', usd: 0.025 }, RAF: { label: 'שאר מדינות אפריקה', usd: 0.0225 },
  RAP: { label: 'שאר אסיה ואוקיאניה', usd: 0.0842 }, RCE: { label: 'שאר מזרח אירופה', usd: 0.086 },
  RLA: { label: 'שאר אמריקה הלטינית', usd: 0.074 }, RME: { label: 'שאר המזרח התיכון', usd: 0.0392 },
  RWE: { label: 'שאר מערב אירופה', usd: 0.0592 }, OTH: { label: 'שאר המדינות', usd: 0.0604 },
};

export const marketFloor = (key) => {
  const m = OTB_MARKETS[key] || OTB_MARKETS.OTH;
  return Math.ceil(((m.usd * PRICING_FX) / FLOOR_DIVISOR) * 100 - 1e-9) / 100;
};
export const marketLabel = (key) => (OTB_MARKETS[key] || OTB_MARKETS.OTH).label;

const CODE_MARKET = {};
const reg = (market, codes) => codes.split(' ').forEach((c) => { CODE_MARKET[c] = market; });
[
  ['AR', '54'], ['BR', '55'], ['CL', '56'], ['CO', '57'], ['EG', '20'], ['FR', '33'], ['DE', '49'], ['HK', '852'],
  ['HU', '36'], ['IN', '91'], ['ID', '62'], ['IL', '972'], ['IT', '39'], ['MY', '60'], ['MX', '52'], ['NL', '31'],
  ['NG', '234'], ['PK', '92'], ['PE', '51'], ['PL', '48'], ['QA', '974'], ['RO', '40'], ['SA', '966'], ['SG', '65'],
  ['ZA', '27'], ['ES', '34'], ['TR', '90'], ['AE', '971'], ['GB', '44'], ['BD', '880'], ['IQ', '964'], ['KW', '965'],
  ['MA', '212'], ['NP', '977'], ['OM', '968'], ['LK', '94'], ['UA', '380'],
  ['RAF', '213 244 229 267 226 257 237 235 242 291 251 241 220 233 245 225 254 266 231 218 261 265 223 222 258 264 227 250 221 232 252 211 249 268 255 228 216 256 260 263'],
  ['RAP', '93 61 855 86 81 856 976 64 675 63 886 992 66 993 998 84'],
  ['RCE', '355 374 994 375 359 385 420 995 30 371 370 373 389 381 421 386'],
  ['RWE', '43 32 45 358 353 47 351 46 41'],
  ['RLA', '591 506 593 503 502 509 504 505 507 595 598 58'],
  ['RME', '973 962 961 967'],
].forEach(([m, c]) => reg(m, c));

// Calling codes Meta cannot deliver to (sanctioned): Cuba, Iran, North Korea, Syria.
const BLOCKED_CODES = new Set(['53', '98', '850', '963']);
const AREA1_LATIN = new Set(['809', '829', '849', '787', '939', '658', '876']);
const AREA1_OTHER = new Set(['242', '246', '264', '268', '284', '340', '345', '441', '473', '649', '664', '670', '671', '684', '721', '758', '767', '784', '868', '869']);

// Pricing market for an E.164 number given as digits (no '+'), or null if the country can't be delivered to.
export function marketOf(digits) {
  const d = String(digits || '');
  if (!d) return null;
  if (d[0] === '1') {
    const area = d.slice(1, 4);
    if (AREA1_LATIN.has(area)) return 'RLA';
    if (AREA1_OTHER.has(area)) return 'OTH';
    return 'NA';
  }
  if (d[0] === '7') return d[1] === '6' || d[1] === '7' ? 'KZ' : 'RU';
  for (let len = 1; len <= 3 && len <= d.length; len += 1) {
    const c = d.slice(0, len);
    if (BLOCKED_CODES.has(c)) return null;
    if (CODE_MARKET[c]) return CODE_MARKET[c];
  }
  return 'OTH';
}

// byMarket: { IL: 480, FR: 20 } (recipients per pricing market). Omitted = everything in Israel.
export function calcQuote(messages, byMarket) {
  let tierTotal = 0;
  const lines = [];
  for (const t of OTB_TIERS) {
    if (messages < t.from) break;
    const to = Math.min(messages, t.to);
    const count = to - t.from + 1;
    tierTotal += count * t.price;
    lines.push({ from: t.from, to, count, price: t.price, amount: count * t.price });
  }
  const avg = messages > 0 ? tierTotal / messages : 0;
  let surcharge = 0;
  const surchargeLines = [];
  Object.keys(byMarket || {}).sort().forEach((k) => {
    const n = byMarket[k];
    const floor = marketFloor(k);
    if (!(n > 0) || floor <= avg) return;
    const amount = Math.round(n * (floor - avg) * 100) / 100;
    surcharge += amount;
    surchargeLines.push({ market: k, count: n, price: floor, amount });
  });
  let subtotal = Math.ceil(tierTotal + surcharge - 1e-9);
  const minApplied = subtotal < OTB_MIN_ORDER;
  if (minApplied) subtotal = OTB_MIN_ORDER;
  const vat = Math.round(subtotal * OTB_VAT * 100) / 100;
  return {
    messages,
    lines,
    surchargeLines,
    surcharge,
    minApplied,
    subtotal,
    vat,
    total: Math.round((subtotal + vat) * 100) / 100,
    avgPerMessage: messages > 0 ? subtotal / messages : 0,
  };
}

export const fmtILS = (n) =>
  '₪' + Number(n || 0).toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// Israeli MOBILE numbers only (fallback before libphonenumber is loaded; the server accepts any deliverable country).
export function normalizePhone(raw) {
  let d = String(raw ?? '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('9720')) d = '972' + d.slice(4);
  else if (d.startsWith('0')) d = '972' + d.slice(1);
  else if (d.length === 9 && d.startsWith('5')) d = '972' + d;
  return /^9725\d{8}$/.test(d) ? d : null;
}

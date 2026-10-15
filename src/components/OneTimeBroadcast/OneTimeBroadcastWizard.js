'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import TemplateEditor, { specIssues, headerModeOf, newButton } from './TemplateEditor';
import { LIB_DOMAINS, LIB_TEMPLATES, applyLibraryTemplate } from './templateLibrary';
import {
  OTB_API,
  OTB_TIERS,
  OTB_MIN_ORDER,
  OTB_MAX_MESSAGES,
  OTB_MIN_LEAD_HOURS,
  calcQuote,
  fmtILS,
  normalizePhone,
  marketOf,
  marketLabel,
  OTB_MARKETS,
} from '@/lib/oneTimeBroadcastPricing';
import './OneTimeBroadcast.css';
import './TemplateExtras.css';

const LS_KEY = 'gambot_otb_order';
const STEPS = [
  { title: 'אקסל', sub: 'העלאה ובדיקת מספרים' },
  { title: 'הודעה', sub: 'תבנית עם שדות אישיים' },
  { title: 'תשלום', sub: 'מאובטח, עם חשבונית' },
  { title: 'תזמון', sub: `לפחות ${OTB_MIN_LEAD_HOURS} שעות קדימה` },
];
const MAX_FILE_MB = 8;
const WA_CONTACT = 'https://wa.me/97233768997';
const EMPTY_SPEC = { headerType: 'NONE', header: '', headerMedia: null, body: '', buttons: [] };
const SENDER_FOOTNOTE =
  'ההודעות נשלחות מהמספר של Gambot ולא מהמספר העסקי שלכם — הנמענים יראו את Gambot כשולח, ותשובות לא מגיעות אליכם. הוסיפו כפתור אתר או טלפון כדי שיפנו אליכם ישירות.';

// Every country is supported (Meta bills per recipient country — see lib/oneTimeBroadcastPricing.js). Sanctioned destinations are excluded.
const BLOCKED_COUNTRIES = new Set(['CU', 'IR', 'KP', 'SY']);

const REASON_LABEL = {
  empty: 'תא ריק',
  format: 'פורמט לא תקין',
  needsCountry: 'מספר ללא קידומת מדינה — צריך לבחור מדינה',
  blocked: 'מדינה שאי אפשר לשלוח אליה',
  landline: 'מספר קווי (לא ניתן לשלוח בוואטסאפ)',
};

const regionName = (() => {
  let dn = null;
  try { dn = new Intl.DisplayNames(['he'], { type: 'region' }); } catch (_) { dn = null; }
  return (code) => { try { return (dn && dn.of(code)) || code; } catch (_) { return code; } };
})();

// Validates ONE cell with libphonenumber (loaded lazily with the Excel parser).
//  • "+972501234567" / "00972…" / "972501234567" → read as international, no country needed.
//  • "0501234567" (no country prefix) → needs the default country picked by the customer.
// Returns { ok: true, phone: '9725…', country: 'IL', market, usedDefault } or { ok: false, reason }.
function classifyPhone(raw, defaultCountry, lib) {
  const s = String(raw ?? '').trim();
  if (!s) return { ok: false, reason: 'empty' };
  if (!lib) {
    const p = normalizePhone(s);
    return p ? { ok: true, phone: p, country: 'IL', market: 'IL', usedDefault: false } : { ok: false, reason: 'format' };
  }
  const parse = (txt, region) => { try { return lib.parsePhoneNumberFromString(txt, region); } catch (_) { return null; } };
  const hasPrefix = s.startsWith('+') || s.startsWith('00');
  const digits = s.replace(/\D/g, '');
  let pn = null;
  let usedDefault = false;
  if (hasPrefix) {
    pn = parse(s.startsWith('00') ? `+${s.slice(2)}` : s);
  } else {
    if (defaultCountry) { pn = parse(s, defaultCountry); usedDefault = !!(pn && pn.isValid()); }
    if (!pn || !pn.isValid()) {
      // a full international number exported without the "+" (972501234567)
      const alt = digits.length >= 8 ? parse(`+${digits}`) : null;
      if (alt && alt.isValid()) { pn = alt; usedDefault = false; }
    }
    if ((!pn || !pn.isValid()) && !defaultCountry) return { ok: false, reason: 'needsCountry' };
  }
  if (!pn || !pn.isValid()) return { ok: false, reason: 'format' };
  if (pn.country && BLOCKED_COUNTRIES.has(pn.country)) return { ok: false, reason: 'blocked' };
  const type = pn.getType();
  if (type && type !== 'MOBILE' && type !== 'FIXED_LINE_OR_MOBILE') return { ok: false, reason: 'landline' };
  const phone = pn.number.replace('+', '');
  const market = marketOf(phone);
  if (!market) return { ok: false, reason: 'blocked' };
  return { ok: true, phone, country: pn.country || '', market, usedDefault };
}

async function api(path, opts) {
  const res = await fetch(`${OTB_API}/${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts && opts.headers) },
  });
  const data = await res.json().catch(() => ({}));
  if (!data || data.success === false) throw new Error((data && data.error) || 'שגיאת תקשורת');
  return data;
}

const post = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body) });

function uniqueHeaders(raw) {
  const seen = {};
  return raw.map((h, i) => {
    let name = String(h ?? '').replace(/[{}]/g, '').trim() || `עמודה ${i + 1}`;
    if (seen[name]) { seen[name] += 1; name = `${name} (${seen[name]})`; } else seen[name] = 1;
    return name;
  });
}

// "שלום {{שם}}" → "שלום {{1}}" with the ordered list of columns (a column used twice gets two numbers).
function toNumbered(body, headers) {
  const varColumns = [];
  const unknown = [];
  const out = body.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (m, name) => {
    if (!headers.includes(name)) { unknown.push(name); return m; }
    varColumns.push(name);
    return `{{${varColumns.length}}}`;
  });
  return { out, varColumns, unknown };
}

function validateTemplateLocal({ body, headers, fallbacks }) {
  const { out, varColumns, unknown } = toNumbered(body.replace(/\r\n/g, '\n').trim(), headers);
  if (unknown.length) return { error: `המשתנה {{${unknown[0]}}} לא תואם לאף עמודה באקסל — הוסיפו אותו מהרשימה` };
  const ph = out.match(/\[[^\]\n]{1,40}\]/);
  if (ph) return { error: `השלימו את הטקסט שבסוגריים בהודעה: ${ph[0]}` };
  if (out.length < 10) return { error: 'כתבו את נוסח ההודעה' };
  if (out.length > 1000) return { error: 'ההודעה ארוכה מדי (עד 1,000 תווים)' };
  if (varColumns.length > 8) return { error: 'ניתן להשתמש בעד 8 משתנים' };
  if (/\}\}\s*\{\{/.test(out)) return { error: 'שני משתנים לא יכולים להיות צמודים — הפרידו ביניהם במילה' };
  if (/^\s*\{\{\d+\}\}/.test(out) || /\{\{\d+\}\}\s*$/.test(out)) return { error: 'ההודעה לא יכולה להתחיל או להסתיים במשתנה (דרישה של Meta)' };
  const plain = out.replace(/\{\{\d+\}\}/g, '').replace(/\n/g, ' ').trim();
  if (plain.length < 20 + 12 * varColumns.length) return { error: 'ההודעה קצרה מדי ביחס למספר המשתנים — הוסיפו טקסט קבוע' };
  for (const c of new Set(varColumns)) {
    if (!String(fallbacks[c] || '').trim()) return { error: `הזינו ערך ברירת מחדל לעמודה "${c}" (נשלח כשהתא ריק)` };
  }
  return { out, varColumns };
}

export default function OneTimeBroadcastWizard() {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // step 1
  const [sheet, setSheet] = useState(null); // { fileName, headers, rows }
  const [phoneCol, setPhoneCol] = useState(0);
  const [country, setCountry] = useState('IL'); // country for numbers written without a prefix — Israel by default (Hebrew site); the picker only shows when the file has such numbers
  const [phoneLib, setPhoneLib] = useState(null);
  // step 2
  const [spec, setSpec] = useState(EMPTY_SPEC);
  const [fallbacks, setFallbacks] = useState({});
  const [libOpen, setLibOpen] = useState(false);
  const [libDomain, setLibDomain] = useState('all');
  const [libNote, setLibNote] = useState('');
  // step 3
  const [order, setOrder] = useState(null);
  const [contact, setContact] = useState({ name: '', company: '', phone: '', email: '' });
  const [consent, setConsent] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  // step 4
  const [runAt, setRunAt] = useState('');
  const [editBody, setEditBody] = useState(null);
  const [resuming, setResuming] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [footerHelp, setFooterHelp] = useState(false);

  const headers = sheet ? sheet.headers : [];

  // ── stats for the uploaded file ──
  const stats = useMemo(() => {
    if (!sheet) return null;
    const seen = new Set();
    let invalid = 0, dup = 0;
    const valid = [];
    const phones = [];
    const byReason = { empty: 0, format: 0, needsCountry: 0, blocked: 0, landline: 0 };
    const byMarket = {}; // recipients per Meta pricing market
    const byCountry = {}; // recipients per country (for the summary line)
    let noPrefix = 0; // numbers that depended on the "country of the numbers" choice
    const problems = []; // first few bad cells, to show the customer exactly what to fix
    sheet.rows.forEach((r, idx) => {
      const c = classifyPhone(r[phoneCol], country, phoneLib);
      if (!c.ok) {
        invalid += 1;
        byReason[c.reason] += 1;
        if (c.reason === 'needsCountry') noPrefix += 1;
        if (c.reason !== 'empty' && c.reason !== 'needsCountry' && problems.length < 8) problems.push({ row: idx + 2, value: r[phoneCol], reason: c.reason });
        return;
      }
      if (c.usedDefault) noPrefix += 1;
      if (seen.has(c.phone)) { dup += 1; return; }
      seen.add(c.phone);
      valid.push(idx);
      phones.push(c.phone);
      byMarket[c.market] = (byMarket[c.market] || 0) + 1;
      byCountry[c.country || '??'] = (byCountry[c.country || '??'] || 0) + 1;
    });
    const countries = Object.keys(byCountry).map((k) => ({ code: k, count: byCountry[k] })).sort((a, b) => b.count - a.count);
    return { total: sheet.rows.length, valid, phones, invalid, dup, byReason, problems, byMarket, countries, noPrefix };
  }, [sheet, phoneCol, country, phoneLib]);

  const pendingCountry = stats ? stats.byReason.needsCountry : 0;
  const invalidOther = stats ? stats.invalid - pendingCountry : 0;

  // every country, by Hebrew name (for the "country of the numbers" picker — shown only when the file needs it)
  const countryOptions = useMemo(() => {
    if (!phoneLib) return [];
    return phoneLib.getCountries()
      .filter((c) => !BLOCKED_COUNTRIES.has(c))
      .map((c) => ({ code: c, name: regionName(c), cc: phoneLib.getCountryCallingCode(c) }))
      .sort((a, b) => (a.code === 'IL' ? -1 : b.code === 'IL' ? 1 : a.name.localeCompare(b.name, 'he')));
  }, [phoneLib]);

  const liveQuote = useMemo(
    () => (stats && stats.valid.length ? calcQuote(Math.min(stats.valid.length, OTB_MAX_MESSAGES), stats.byMarket) : null),
    [stats],
  );

  // most common country among the numbers that were readable without a default — offered as a one-click suggestion
  const suggestedCountry = useMemo(() => {
    if (!stats || !stats.countries.length) return '';
    const top = stats.countries.find((c) => c.code && c.code !== '??');
    return top ? top.code : '';
  }, [stats]);

  // ── resume an order (after the Tranzila redirect or a page reload) ──
  useEffect(() => {
    (async () => {
      try {
        const id = typeof window !== 'undefined' ? window.localStorage.getItem(LS_KEY) : null;
        const qp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('payment') : null;
        if (id) {
          const o = await api(`Order?orderId=${encodeURIComponent(id)}`);
          setOrder(o);
          if (['paid', 'payment_unverified', 'scheduling'].includes(o.status)) setStep(4);
          else if (o.status === 'scheduled') setStep(5);
          else if (qp && (o.status === 'awaiting_payment' || o.status === 'draft')) {
            setStep(3);
            if (qp === 'failed') setError('התשלום לא הושלם. ניתן לנסות שוב.');
            if (qp === 'success') setVerifying(true);
          } else window.localStorage.removeItem(LS_KEY);
        }
      } catch (e) {
        try { window.localStorage.removeItem(LS_KEY); } catch (_) { /* ignore */ }
      } finally {
        setResuming(false);
      }
    })();
  }, []);

  // ── step 1: parse the Excel/CSV client-side ──
  const onFile = async (file) => {
    setError('');
    if (!file) return;
    if (file.size > MAX_FILE_MB * 1024 * 1024) { setError(`הקובץ גדול מדי (עד ${MAX_FILE_MB}MB)`); return; }
    setBusy(true);
    try {
      const [XLSX, lib] = await Promise.all([import('xlsx'), import('libphonenumber-js/mobile')]);
      setPhoneLib(lib);
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
      const nonEmpty = aoa.filter((r) => r.some((c) => String(c).trim() !== ''));
      if (nonEmpty.length < 2) throw new Error('הקובץ ריק — השורה הראשונה צריכה להכיל כותרות והשורות שאחריה את הנמענים');
      const hdr = uniqueHeaders(nonEmpty[0]);
      const rows = nonEmpty.slice(1).map((r) => hdr.map((_, i) => String(r[i] ?? '').trim()));
      // auto-detect the phone column
      let best = 0, bestCount = -1;
      hdr.forEach((h, ci) => {
        let c = rows.slice(0, 300).filter((r) => classifyPhone(r[ci], country || 'IL', lib).ok).length;
        if (/phone|mobile|tel|טלפון|נייד|סלולר|פלאפון/i.test(h)) c += 5;
        if (c > bestCount) { bestCount = c; best = ci; }
      });
      setSheet({ fileName: file.name, headers: hdr, rows });
      setPhoneCol(best);
      setOrder(null);
      setIframeUrl('');
      try { window.localStorage.removeItem(LS_KEY); } catch (_) { /* ignore */ }
    } catch (e) {
      setError(e.message || 'לא ניתן לקרוא את הקובץ');
    } finally {
      setBusy(false);
    }
  };

  // ── step 2 helpers ──
  // The template language is never asked: Hebrew letters in the text → Hebrew, otherwise English (the server applies the same rule).
  const templateLang = /[\u0590-\u05FF]/.test(`${headerModeOf(spec) === 'TEXT' ? spec.header || '' : ''} ${spec.body || ''}`) ? 'he' : 'en';
  // the columns that can become personal fields (everything except the phone column)
  const fieldColumns = useMemo(() => headers.filter((_, i) => i !== phoneCol), [headers, phoneCol]);

  const firstRow = stats && stats.valid.length ? sheet.rows[stats.valid[0]] : null;
  const previewText = useMemo(() => {
    if (!spec.body.trim()) return '';
    return spec.body.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (m, name) => {
      const ci = headers.indexOf(name);
      if (ci < 0) return m;
      const v = firstRow ? String(firstRow[ci] || '').trim() : '';
      return v || fallbacks[name] || `‹${name}›`;
    });
  }, [spec.body, headers, firstRow, fallbacks]);

  // ── step 2 → 3: validate locally then create the server-side draft ──
  // everything that stops the customer from continuing — shown next to the "continue" button, which stays disabled meanwhile
  const blockers = useMemo(() => {
    const list = [];
    const v = validateTemplateLocal({ body: spec.body, headers, fallbacks });
    if (v.error) list.push(v.error);
    list.push(...specIssues(spec).list);
    return list;
  }, [spec, headers, fallbacks]);

  const pickLibraryTemplate = (tpl) => {
    if (spec.body.trim() && typeof window !== 'undefined' && !window.confirm('להחליף את ההודעה הנוכחית בתבנית שנבחרה?')) return;
    const r = applyLibraryTemplate(tpl, fieldColumns, newButton);
    setSpec(r.spec);
    setFallbacks(r.fallbacks);
    setLibNote(r.placeholders.length ? `השלימו בהודעה את: ${r.placeholders.join(' · ')} (אין בקובץ עמודה מתאימה)` : '');
    setError('');
    setLibOpen(false);
  };

  const goPayment = async () => {
    setError('');
    const v = validateTemplateLocal({ body: spec.body, headers, fallbacks });
    if (v.error) { setError(v.error); return; }
    const si = specIssues(spec);
    if (si.list.length) { setError(si.list[0]); return; }
    const hMode = headerModeOf(spec);
    setBusy(true);
    try {
      const colIdx = v.varColumns.map((c) => headers.indexOf(c));
      const rows = stats.valid.map((ri, k) => {
        const r = sheet.rows[ri];
        return [`+${stats.phones[k]}`, ...colIdx.map((ci) => r[ci] || '')];
      });
      const draft = await post('Draft', {
        rows,
        template: {
          language: templateLang,
          body: v.out,
          varColumns: v.varColumns,
          fallbacks: v.varColumns.map((c) => fallbacks[c]),
          headerType: hMode === 'TEXT' ? 'TEXT' : hMode === 'MEDIA' ? spec.headerMedia.format : 'NONE',
          header: hMode === 'TEXT' ? spec.header : '',
          headerMedia: hMode === 'MEDIA' ? { url: spec.headerMedia.url, mime: spec.headerMedia.mime, name: spec.headerMedia.name, size: spec.headerMedia.size } : null,
          buttons: spec.buttons.map((b) => ({ type: b.type, text: b.text, url: b.url, phone: b.phone, autoReply: b.type === 'QUICK_REPLY' ? (b.autoReply || '').trim() : '' })),
        },
      });
      try { window.localStorage.setItem(LS_KEY, draft.orderId); } catch (_) { /* ignore */ }
      setOrder(await api(`Order?orderId=${draft.orderId}`));
      setIframeUrl('');
      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  // ── step 3: checkout ──
  const startPayment = async () => {
    setError('');
    setBusy(true);
    try {
      const r = await post('Checkout', { orderId: order.orderId, contact, consent });
      setIframeUrl(r.iframeUrl);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const applyCode = async (code) => {
    setError('');
    setBusy(true);
    try {
      setOrder(await post('ApplyCode', { orderId: order.orderId, code }));
      if (!code) setCodeInput('');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  // poll while the payment iframe is open
  useEffect(() => {
    if ((!iframeUrl && !verifying) || !order) return undefined;
    const t = setInterval(async () => {
      try {
        const o = await api(`Order?orderId=${order.orderId}`);
        setOrder(o);
        if (o.status === 'paid' || o.status === 'payment_unverified') { setIframeUrl(''); setVerifying(false); setStep(4); }
        else if (o.lastPaymentFailure) setError('התשלום נדחה: ' + o.lastPaymentFailure);
      } catch (_) { /* keep polling */ }
    }, 3000);
    return () => clearInterval(t);
  }, [iframeUrl, verifying, order && order.orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── step 4: schedule ──
  useEffect(() => {
    if (step === 4 && order && !runAt) {
      const d = order.minRunAtLocal || '';
      setRunAt(d);
    }
  }, [step, order, runAt]);

  const schedule = async () => {
    setError('');
    setBusy(true);
    try {
      const payload = { orderId: order.orderId, runAt };
      if (editBody !== null && order.template) payload.template = { ...order.template, body: editBody };
      const o = await post('Schedule', payload);
      setOrder(o);
      setStep(5);
    } catch (e) {
      setError(e.message);
      try { setOrder(await api(`Order?orderId=${order.orderId}`)); } catch (_) { /* ignore */ }
      if (editBody === null && order.template) setEditBody(order.template.body);
    } finally {
      setBusy(false);
    }
  };

  // template status poll on the final screen
  useEffect(() => {
    if (step !== 5 || !order) return undefined;
    const t = setInterval(async () => {
      try { setOrder(await api(`Order?orderId=${order.orderId}`)); } catch (_) { /* ignore */ }
    }, 20000);
    return () => clearInterval(t);
  }, [step, order && order.orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const startOver = () => {
    try { window.localStorage.removeItem(LS_KEY); } catch (_) { /* ignore */ }
    setSheet(null); setOrder(null); setIframeUrl(''); setSpec({ header: '', body: '', buttons: [] }); setCountry('IL');
    setFallbacks({}); setConsent(false); setRunAt(''); setEditBody(null); setError(''); setStep(1);
  };

  // The footer names who the message is really from: "Sent by Gambot on behalf of {business}" (Meta: footer ≤ 60 chars, no variables).
  // The business name comes from the contact form in step 3 (company, else the person's name); the server builds the same text.
  const footerFor = (lang, sender) => {
    const en = lang === 'en';
    const s = String(sender || '').replace(/[{}*_~`\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim();
    const prefix = en ? 'Sent by Gambot on behalf of ' : 'נשלח על ידי גמבוט עבור ';
    if (!s) return en ? 'Sent by Gambot' : 'נשלח על ידי גמבוט';
    return (prefix + s.slice(0, 60 - prefix.length)).trim();
  };
  const senderName = (contact.company || contact.name || '').trim();
  const footer = senderName ? footerFor(templateLang, senderName) : `${templateLang === 'en' ? 'Sent by Gambot on behalf of ' : 'נשלח על ידי גמבוט עבור '}‹${templateLang === 'en' ? 'your business name' : 'שם העסק שלכם'}›`;
  const senderMax = 60 - (templateLang === 'en' ? 'Sent by Gambot on behalf of '.length : 'נשלח על ידי גמבוט עבור '.length);
  const q = order && order.quote;

  // header = { type: 'TEXT', text } | { type: 'IMAGE' | 'VIDEO' | 'DOCUMENT', url, localUrl?, name } | null
  const renderHeader = (h) => {
    if (!h) return null;
    if (h.type === 'TEXT') return h.text ? <div className="otb-bubble-header">{h.text}</div> : null;
    const src = h.localUrl || h.url;
    if (h.type === 'IMAGE') return <div className="otb-bubble-media">{src ? <img src={src} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : null}</div>;
    if (h.type === 'VIDEO') return <div className="otb-bubble-media video">{src ? <video src={src} muted preload="metadata" /> : null}<span className="otb-bubble-play">▶</span></div>;
    return <div className="otb-bubble-doc">📄 <span dir="ltr">{h.name || 'document.pdf'}</span></div>;
  };

  const specHeader = (() => {
    const m = headerModeOf(spec);
    if (m === 'TEXT') return { type: 'TEXT', text: (spec.header || '').trim() };
    if (m === 'MEDIA' && spec.headerMedia) return { type: spec.headerMedia.format, url: spec.headerMedia.url, localUrl: spec.headerMedia.localUrl, name: spec.headerMedia.name };
    return null;
  })();

  const orderHeader = (() => {
    const t = order && order.template;
    if (!t) return null;
    if (t.headerType === 'TEXT' || (!t.headerType && t.header)) return { type: 'TEXT', text: t.header };
    if (t.headerMedia && ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(t.headerType)) {
      const same = spec.headerMedia && spec.headerMedia.url === t.headerMedia.url;
      return { type: t.headerType, url: t.headerMedia.url, localUrl: same ? spec.headerMedia.localUrl : undefined, name: t.headerMedia.name };
    }
    return null;
  })();

  const renderBubble = (text, btns, header) => (
    <div className="otb-phone">
      <div className="otb-bubble">
        {renderHeader(header)}
        <div className="otb-bubble-text">{text || 'כאן תופיע ההודעה…'}</div>
        <div className="otb-bubble-footer">
          <span>{footer}</span>
          <span className="otb-help">
            <button
              type="button"
              className="otb-help-btn"
              aria-label="מידע על הפוטר ועל אישור Meta"
              aria-expanded={footerHelp}
              onClick={() => setFooterHelp((v) => !v)}
              onBlur={() => setFooterHelp(false)}
            >?</button>
            <span role="tooltip" className={'otb-help-pop' + (footerHelp ? ' open' : '')}>
              🔒 בתחתית ההודעה מתווספת אוטומטית השורה <b>“{footer}”</b> (שם העסק נלקח מפרטי ההזמנה בשלב הבא).
              התבנית נשלחת לאישור Meta — לכן התזמון הוא לפחות {OTB_MIN_LEAD_HOURS} שעות קדימה.
            </span>
          </span>
        </div>
        {btns.map((b, i) => (<div key={i} className="otb-bubble-btn">{b}</div>))}
      </div>
    </div>
  );

  const BTN_ICON = { PHONE_NUMBER: '📞', URL: '🔗', QUICK_REPLY: '↩' };
  // order of the real template: call-to-action buttons first, quick replies after them
  const bubbleButtons = [...spec.buttons]
    .sort((a, b) => (a.type === 'QUICK_REPLY') - (b.type === 'QUICK_REPLY'))
    .filter((b) => b.text.trim())
    .map((b) => `${BTN_ICON[b.type]} ${b.text.trim()}`);

  // live checklist: payment approved? template sent to Meta? campaign created? (shown right after payment and on the final screen)
  const renderStatus = () => {
    if (!order) return null;
    const payOk = ['paid', 'scheduling', 'scheduled'].includes(order.status);
    const payWait = order.status === 'payment_unverified';
    const tplOk = !!order.templateName;
    const campOk = !!order.campaignId;
    const ts = String(order.templateStatus || '').toUpperCase();
    const tplText = !tplOk
      ? 'תיווצר ותישלח ל-Meta מיד כשתתזמנו'
      : ts === 'APPROVED' ? 'נשלחה ל-Meta ואושרה ✅'
        : ts === 'REJECTED' ? 'נשלחה ל-Meta ונדחתה — נחזור אליכם לתיקון'
          : 'נשלחה ל-Meta וממתינה לאישור (בדרך כלל עד 24 שעות)';
    const rows = [
      { ok: payOk, wait: payWait, title: 'העסקה', text: payOk ? `אושרה ✅${q ? ` — ${fmtILS(q.total)}` : ''}${order.paymentRef ? ` · אישור ${order.paymentRef}` : ''}` : payWait ? 'התקבלה ובאימות מול חברת הסליקה' : 'לא אושרה' },
      { ok: tplOk, wait: !tplOk && payOk, title: 'התבנית', text: tplText },
      { ok: campOk, wait: !campOk && payOk, title: 'הדיוור', text: campOk ? `נוצר ותוזמן ל-${String(order.runAtLocal || '').replace('T', ' ')} (שעון ישראל)` : 'ייווצר מיד כשתתזמנו' },
    ];
    return (
      <ul className="otb-status" aria-live="polite">
        {rows.map((r) => (
          <li key={r.title} className={r.ok ? 'ok' : r.wait ? 'wait' : 'bad'}>
            <span className="otb-status-ic">{r.ok ? '✓' : r.wait ? '…' : '✕'}</span>
            <span><b>{r.title}:</b> {r.text}</span>
          </li>
        ))}
        {order.lastError && !campOk && <li className="bad"><span className="otb-status-ic">✕</span><span>{order.lastError}</span></li>}
      </ul>
    );
  };

  if (resuming) return <div className="otb-page"><div className="otb-card otb-center">טוען…</div></div>;

  return (
    <div className="otb-page" dir="rtl">
      <header className="otb-hero">
        <span className="otb-badge">דיוור חד פעמי · עשה זאת בעצמך</span>
        <h1>שלחו דיוור וואטסאפ לרשימה שלכם — תוך דקות, בלי מנוי</h1>
        <p>
          מעלים אקסל, כותבים הודעה עם שדות אישיים מהקובץ, משלמים ומתזמנים. המחיר כולל את עלויות WhatsApp/Meta, וההודעות נשלחות מהמספר שלנו<sup><a href="#otb-footnote">*</a></sup>.
          {step === 1 && <>{' '}<a href="#otb-pricing" className="otb-link">למחשבון המחיר ↓</a></>}
        </p>
      </header>

      {step <= 4 && (
        <>
          <div className="otb-progress" aria-hidden="true"><div style={{ width: `${((step - 1) / 3) * 100}%` }} /></div>
          <ol className="otb-steps">
            {STEPS.map((s, i) => {
              const done = step > i + 1;
              const canGo = done && step <= 3 && !iframeUrl && !verifying && (i + 1 === 1 || i + 1 === 2) && !!sheet;
              return (
                <li key={s.title} className={step === i + 1 ? 'active' : done ? 'done' : ''}>
                  <button type="button" className="otb-step-btn" disabled={!canGo} onClick={() => { setError(''); setStep(i + 1); }}>
                    <span className="otb-step-n">{done ? '✓' : i + 1}</span>
                    <span className="otb-step-txt"><b>{s.title}</b><small>{s.sub}</small></span>
                  </button>
                </li>
              );
            })}
          </ol>
        </>
      )}

      {error && step !== 2 && <div className="otb-error" role="alert">{error}</div>}

      {/* ─────────────── STEP 1 ─────────────── */}
      {step === 1 && (
        <section className="otb-card">
          <div className="otb-step-label">שלב 1 מתוך 4</div>
          <h2>העלו קובץ אקסל עם הנמענים</h2>
          <p className="otb-muted">שורה ראשונה = כותרות עמודות. חייבת להיות עמודת טלפון. שאר העמודות (שם, עיר, סכום…) ישמשו כשדות אישיים בהודעה. עד {OTB_MAX_MESSAGES.toLocaleString('he-IL')} נמענים.</p>
          <div className="otb-note">
            <b>פורמט מספרי הטלפון:</b> הכי בטוח לכתוב כל מספר עם קידומת המדינה — <span dir="ltr">+972501234567</span> או <span dir="ltr">972501234567</span> (אפשר לשלב מדינות שונות באותו קובץ).
            מספר בלי קידומת (למשל <span dir="ltr">050-1234567</span>) נקרא כמספר ישראלי — אם יש כאלה בקובץ, תוכלו לשנות את המדינה שלהם אחרי ההעלאה.
            שולחים רק למספרי נייד; מספרים קוויים, לא תקינים וכפילויות לא יישלחו. המחיר תלוי במדינת הנמען (תעריף Meta) — מחושב אוטומטית.
          </div>
          <label className="otb-drop">
            <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => onFile(e.target.files[0])} disabled={busy} />
            <span>{busy ? 'קורא את הקובץ…' : sheet ? `📄 ${sheet.fileName} — לחצו להחלפה` : '📤 לחצו לבחירת קובץ (xlsx / xls / csv)'}</span>
          </label>

          {sheet && stats && (
            <>
              <div className="otb-row">
                <label className="otb-field">
                  <span>עמודת הטלפון</span>
                  <select value={phoneCol} onChange={(e) => setPhoneCol(Number(e.target.value))}>
                    {headers.map((h, i) => <option key={h} value={i}>{h}</option>)}
                  </select>
                </label>
                <div className="otb-stats">
                  <div><b>{stats.valid.length.toLocaleString('he-IL')}</b><small>נמענים תקינים</small></div>
                  <div className={invalidOther ? 'warn' : ''}><b>{invalidOther.toLocaleString('he-IL')}</b><small>מספרים לא תקינים (לא יישלחו)</small></div>
                  {pendingCountry > 0 && <div className="warn"><b>{pendingCountry.toLocaleString('he-IL')}</b><small>ממתינים להגדרת מדינה</small></div>}
                  <div className={stats.dup ? 'warn' : ''}><b>{stats.dup.toLocaleString('he-IL')}</b><small>כפילויות (יישלחו פעם אחת)</small></div>
                </div>
              </div>

              {stats.noPrefix > 0 && (
                <div className={`otb-note${pendingCountry > 0 ? ' warn' : ''}`}>
                  <label className="otb-field otb-country">
                    <span>
                      {pendingCountry > 0
                        ? `נמצאו ${pendingCountry.toLocaleString('he-IL')} מספרים בלי קידומת מדינה — בחרו לאיזו מדינה הם שייכים כדי להמשיך`
                        : `מדינת המספרים שנכתבו בלי קידומת (ברירת מחדל: ישראל — שנו אם הם ממדינה אחרת)`}
                    </span>
                    <select value={country} onChange={(e) => setCountry(e.target.value)}>
                      <option value="">בחרו מדינה…</option>
                      {countryOptions.map((c) => <option key={c.code} value={c.code}>{c.name} (+{c.cc})</option>)}
                    </select>
                  </label>
                  {suggestedCountry && suggestedCountry !== country && (
                    <button type="button" className="otb-link" onClick={() => setCountry(suggestedCountry)}>
                      רוב המספרים בקובץ הם מ{regionName(suggestedCountry)} — להשתמש בה?
                    </button>
                  )}
                  <small>רק מספרים בלי קידומת מושפעים מהבחירה. מספרים שכתובים עם + או עם קידומת מדינה נקראים לפי הקידומת שלהם.</small>
                </div>
              )}

              {stats.countries.length > 0 && (
                <div className="otb-muted small">
                  נמענים לפי מדינה: {stats.countries.slice(0, 8).map((c) => `${c.code === '??' ? 'אחר' : regionName(c.code)} ${c.count.toLocaleString('he-IL')}`).join(' · ')}
                  {stats.countries.length > 8 ? ` · ועוד ${stats.countries.length - 8} מדינות` : ''}
                </div>
              )}

              <div className="otb-table-wrap">
                <table className="otb-table">
                  <thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>{sheet.rows.slice(0, 4).map((r, i) => (<tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>))}</tbody>
                </table>
              </div>

              {invalidOther > 0 && (
                <div className="otb-note warn">
                  <b>בדיקת הפורמט מצאה {invalidOther.toLocaleString('he-IL')} שורות עם מספר שלא יישלח:</b>
                  <ul className="otb-reasons">
                    {Object.keys(REASON_LABEL).filter((k) => k !== 'needsCountry' && stats.byReason[k] > 0).map((k) => (
                      <li key={k}>{REASON_LABEL[k]}: {stats.byReason[k].toLocaleString('he-IL')}</li>
                    ))}
                  </ul>
                  {stats.problems.length > 0 && (
                    <div className="otb-table-wrap">
                      <table className="otb-table">
                        <thead><tr><th>שורה באקסל</th><th>הערך</th><th>הבעיה</th></tr></thead>
                        <tbody>
                          {stats.problems.map((p) => (
                            <tr key={p.row}><td>{p.row}</td><td dir="ltr">{p.value}</td><td>{REASON_LABEL[p.reason]}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <small>תקנו באקסל והעלו מחדש, או המשיכו — המספרים התקינים בלבד יישלחו ותשלמו רק עליהם.</small>
                </div>
              )}
              {stats.valid.length > OTB_MAX_MESSAGES && (
                <div className="otb-error">בהזמנה עצמאית ניתן לשלוח עד {OTB_MAX_MESSAGES.toLocaleString('he-IL')} הודעות. לכמות גדולה יותר — <a href={WA_CONTACT} target="_blank" rel="noopener noreferrer">דברו איתנו</a>.</div>
              )}
              {liveQuote && stats.valid.length <= OTB_MAX_MESSAGES && (
                <div className="otb-quote-strip">
                  מחיר משוער: <b>{fmtILS(liveQuote.total)}</b> כולל מע״מ ·{' '}
                  {liveQuote.minApplied
                    ? `מינימום הזמנה ${fmtILS(OTB_MIN_ORDER)} לפני מע״מ`
                    : `ממוצע ${fmtILS(liveQuote.avgPerMessage)} להודעה (לפני מע״מ)`}
                  {liveQuote.surchargeLines.length > 0 && (
                    <small className="otb-muted" style={{ display: 'block' }}>
                      כולל תוספת של {fmtILS(liveQuote.surcharge)} על יעדים שבהם תעריף Meta גבוה:{' '}
                      {liveQuote.surchargeLines.map((l) => `${marketLabel(l.market)} (${l.count.toLocaleString('he-IL')} × ${fmtILS(l.price)})`).join(' · ')}
                    </small>
                  )}
                </div>
              )}
              {pendingCountry > 0 && (
                <div className="otb-error">כדי להמשיך — בחרו למעלה את המדינה של המספרים שנכתבו בלי קידומת, או תקנו אותם באקסל והעלו מחדש.</div>
              )}
              <div className="otb-actions">
                <button
                  className="otb-btn primary"
                  disabled={!stats.valid.length || stats.valid.length > OTB_MAX_MESSAGES || pendingCountry > 0}
                  onClick={() => { setError(''); setStep(2); }}
                >המשך לכתיבת ההודעה ←</button>
              </div>
            </>
          )}
        </section>
      )}

      {/* ─────────────── STEP 2 ─────────────── */}
      {step === 2 && sheet && (
        <section className="otb-card otb-two-col">
          <div>
            <div className="otb-step-label">שלב 2 מתוך 4</div>
            <div className="otb-title-row">
              <h2>כתבו את ההודעה</h2>
              <button type="button" className="otb-btn otb-lib-btn" onClick={() => setLibOpen(true)}>📚 או בחרו מספריית תבניות</button>
            </div>
            <p className="otb-muted">לחצו ״הוסף שדה מהאקסל״ כדי לשלב עמודה כשדה אישי. כל נמען יקבל את הערכים מהשורה שלו.</p>
            {libNote && <div className="otb-note otb-lib-note">📚 {libNote}</div>}

            <TemplateEditor
              columns={fieldColumns}
              value={spec}
              onChange={setSpec}
              fallbacks={fallbacks}
              onFallbacksChange={setFallbacks}
              footer={footer}
            />

            {error && <div className="otb-error" role="alert">{error}</div>}
            {blockers.length > 0 && (
              <div className="otb-blockers" role="status">
                <b>לפני שממשיכים לתשלום:</b>
                <ul>{blockers.map((m) => <li key={m}>{m}</li>)}</ul>
              </div>
            )}
            <div className="otb-actions">
              <button className="otb-btn" onClick={() => setStep(1)}>→ חזרה</button>
              <button className="otb-btn primary" disabled={busy || blockers.length > 0} onClick={goPayment}>{busy ? 'מכין הזמנה…' : 'המשך לתשלום ←'}</button>
            </div>
          </div>
          <aside>
            <h4>תצוגה מקדימה (הנמען הראשון)</h4>
            {renderBubble(previewText, bubbleButtons, specHeader)}
          </aside>
        </section>
      )}

      {/* ─────────────── STEP 3 ─────────────── */}
      {step === 3 && order && (
        <section className="otb-card otb-two-col">
          <div>
            <div className="otb-step-label">שלב 3 מתוך 4</div>
            <h2>סיכום ותשלום</h2>
            {verifying ? (
              <p className="otb-ok">מאמתים את התשלום מול חברת הסליקה… (עד דקה)</p>
            ) : !iframeUrl ? (
              <>
                <div className="otb-summary">
                  <div className="otb-sum-head">{order.recipients.toLocaleString('he-IL')} הודעות וואטסאפ</div>
                  {q && q.lines.map((l) => (
                    <div key={l.from} className="otb-sum-line"><span>{l.count.toLocaleString('he-IL')} הודעות × {fmtILS(l.price)}</span><span>{fmtILS(l.amount)}</span></div>
                  ))}
                  {q && (q.surchargeLines || []).map((l) => (
                    <div key={l.market} className="otb-sum-line"><span>תוספת יעד — {marketLabel(l.market)} ({l.count.toLocaleString('he-IL')} הודעות, תעריף Meta גבוה)</span><span>{fmtILS(l.amount)}</span></div>
                  ))}
                  {q && q.minApplied && <div className="otb-sum-line"><span>השלמה למינימום הזמנה</span><span>{fmtILS(q.subtotal)}</span></div>}
                  {q && q.discountPct > 0 && (
                    <div className="otb-sum-line discount"><span>קוד הנחה “{order.discountCode}” ({q.discountPct}%)</span><span>−{fmtILS(q.discountAmount)}</span></div>
                  )}
                  {q && <div className="otb-sum-line"><span>סה״כ לפני מע״מ</span><span>{fmtILS(q.netSubtotal != null ? q.netSubtotal : q.subtotal)}</span></div>}
                  {q && <div className="otb-sum-line"><span>מע״מ 18%</span><span>{fmtILS(q.vat)}</span></div>}
                  {q && <div className="otb-sum-line total"><span>לתשלום</span><span>{fmtILS(q.total)}</span></div>}
                </div>

                <div className="otb-code">
                  <label className="otb-field">
                    <span>קוד הנחה</span>
                    <input
                      value={codeInput}
                      placeholder="יש לך קוד?"
                      onChange={(e) => setCodeInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') applyCode(codeInput); }}
                    />
                  </label>
                  <button type="button" className="otb-btn" disabled={busy || !codeInput.trim()} onClick={() => applyCode(codeInput)}>החל</button>
                  {order.discountCode && (
                    <button type="button" className="otb-btn" disabled={busy} onClick={() => { setCodeInput(''); applyCode(''); }}>הסר קוד</button>
                  )}
                </div>

                <div className="otb-row">
                  <label className="otb-field"><span>שם מלא *</span><input value={contact.name} onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))} /></label>
                  <label className="otb-field"><span>שם העסק (יופיע בתחתית ההודעה, עד {senderMax} תווים)</span><input value={contact.company} maxLength={senderMax} onChange={(e) => setContact((p) => ({ ...p, company: e.target.value }))} /></label>
                </div>
                <div className="otb-row">
                  <label className="otb-field"><span>טלפון *</span><input type="tel" value={contact.phone} onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))} /></label>
                  <label className="otb-field"><span>אימייל * (לאישור וחשבונית)</span><input type="email" value={contact.email} onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} /></label>
                </div>
                <div className="otb-note">
                  📅 מיד אחרי אישור התשלום תבחרו תאריך ושעה לשליחה (לפחות {OTB_MIN_LEAD_HOURS} שעות מעכשיו), ותראו מיד אם התבנית נשלחה לאישור והדיוור נוצר.
                </div>
                <label className="otb-check">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <div className="otb-consent-text">
                    <b>הצהרה ואישור (חובה)</b>
                    <ul>
                      <li>אני מצהיר/ה שלכל הנמענים ברשימה ניתנה <b>הסכמה מפורשת מראש</b> לקבל ממני הודעות שיווקיות (סעיף 30א לחוק התקשורת), ושההסכמה מתועדת ברשותי ואוכל להציגה לפי דרישה.</li>
                      <li>גמבוט היא <b>כלי טכנולוגי בלבד</b> — היא אינה בוחרת, בודקת או מאשרת את הרשימה או את תוכן ההודעה. <b>כל האחריות המשפטית, הפלילית והכספית היא עליי בלבד</b>: הרשימה, התוכן, ההסכמות והשליחה, וכל תביעה (לרבות תביעה ייצוגית), קנס, פיצוי סטטוטורי (עד 1,000 ₪ להודעה לפי סעיף 30א) או נזק שייגרמו לגמבוט או לצד שלישי בגינם.</li>
                      <li>אני מוותר/ת על כל טענה ותביעה כלפי גמבוט, מתחייב/ת <b>לשפות אותה במלואה</b> (כולל שכר טרחת עו״ד והוצאות) על כל דרישה של נמען, רשות או צד שלישי, וגמבוט רשאית להפסיק או לבטל את הדיוור בכל שלב אם יש חשש לאי-חוקיות — ללא החזר.</li>
                      <li>אני מבין/ה שמשלוח הודעות למי שלא הסכים לכך עלול להיות עבירה על החוק, ושהאחריות לכך חלה עליי ועל העסק שלי בלבד.</li>
                      <li>קראתי ואני מסכים/ה ל<Link href="/one-time-broadcast-terms/" target="_blank">תנאי השימוש בשירות הדיוור החד פעמי</Link>.</li>
                    </ul>
                  </div>
                </label>
                <div className="otb-actions">
                  <button className="otb-btn" onClick={() => setStep(sheet ? 2 : 1)}>→ חזרה</button>
                  <button className="otb-btn primary" disabled={busy || !consent} onClick={startPayment}>{busy ? 'פותח תשלום…' : `מעבר לתשלום ${q ? fmtILS(q.total) : ''}`}</button>
                </div>
              </>
            ) : (
              <>
                <iframe title="תשלום מאובטח" src={iframeUrl} className="otb-iframe" />
                <div className="otb-muted small">התשלום מתבצע באתר מאובטח של טרנזילה. לאחר האישור תועברו אוטומטית לשלב התזמון.</div>
                <div className="otb-actions"><button className="otb-btn" onClick={() => setIframeUrl('')}>→ חזרה לפרטים</button></div>
              </>
            )}
          </div>
          <aside>
            <h4>ההודעה שתישלח</h4>
            {order.template && (
              <div className="otb-phone"><div className="otb-bubble">
                {renderHeader(orderHeader)}
                <div className="otb-bubble-text">{sheet ? previewText : order.template.body}</div>
                <div className="otb-bubble-footer">{footerFor(order.template.language, senderName)}</div>
                {(order.template.buttons || []).map((b, i) => (
                  <div key={i} className="otb-bubble-btn">{BTN_ICON[b.type]} {b.text}</div>
                ))}
              </div></div>
            )}
          </aside>
        </section>
      )}

      {/* ─────────────── STEP 4 ─────────────── */}
      {step === 4 && order && (
        <section className="otb-card">
          {order.status === 'payment_unverified' ? (
            <>
              <h2>התשלום התקבל ובאימות</h2>
              <p>קיבלנו את התשלום ואנחנו מאמתים אותו מול חברת הסליקה. נחזור אליך במייל (ובוואטסאפ) בהקדם כדי להשלים את התזמון.</p>
              {renderStatus()}
            </>
          ) : (
            <>
              <div className="otb-step-label">שלב 4 מתוך 4</div>
              <h2>מתי לשלוח?</h2>
              <p className="otb-ok">✅ התשלום התקבל. נשאר לבחור מועד שליחה.</p>
              {renderStatus()}
              <label className="otb-field">
                <span>תאריך ושעה (שעון ישראל) — לפחות {OTB_MIN_LEAD_HOURS} שעות מעכשיו</span>
                <input type="datetime-local" min={order.minRunAtLocal} value={runAt} onChange={(e) => setRunAt(e.target.value)} />
              </label>
              <p className="otb-muted small">למה {OTB_MIN_LEAD_HOURS} שעות? כדי שיהיה זמן לאישור התבנית ע״י Meta. אם התבנית תידחה — נחזור אליכם לתיקון ללא עלות. כשהתבנית תאושר נעדכן אתכם במייל.</p>
              <p className="otb-muted small">📊 כ־24 שעות אחרי השליחה תקבלו למייל שהזנתם <b>דוח תוצאות</b> — כמה הודעות נשלחו, נמסרו ונקראו, כמה לחצו על הכפתורים והקישורים, ומה ענו.</p>

              {editBody !== null && (
                <div className="otb-fallbacks">
                  <h4>עריכת נוסח ההודעה (המשתנים {'{{1}}, {{2}}…'} נשארים כפי שהם)</h4>
                  <textarea className="otb-textarea" rows={6} value={editBody} onChange={(e) => setEditBody(e.target.value)} />
                </div>
              )}

              <div className="otb-actions">
                <button className="otb-btn primary" disabled={busy || !runAt} onClick={schedule}>{busy ? 'מתזמן ושולח לאישור Meta…' : 'תזמון הדיוור'}</button>
              </div>
            </>
          )}
        </section>
      )}

      {/* ─────────────── DONE ─────────────── */}
      {step === 5 && order && (
        <section className="otb-card otb-center">
          <div className="otb-done-icon">✓</div>
          <h2>הדיוור תוזמן בהצלחה</h2>
          <p>
            {order.recipients.toLocaleString('he-IL')} נמענים · שליחה ב־<b>{String(order.runAtLocal || '').replace('T', ' ')}</b> (שעון ישראל)
          </p>
          {renderStatus()}
          <p className="otb-muted small">אישור נשלח לאימייל שלך. חשבונית מס/קבלה תישלח בנפרד.</p>
          <p className="otb-muted small">נעדכן אותך במייל כשהתבנית תאושר, וכ־24 שעות אחרי השליחה תקבל/י <b>דוח תוצאות</b> (נשלחו, נמסרו, נקראו, לחיצות ותגובות) לאותו מייל.</p>
          <div className="otb-actions center"><button className="otb-btn" onClick={startOver}>הזמנה חדשה</button></div>
        </section>
      )}

      {libOpen && step === 2 && (
        <div className="otb-modal-back" onClick={() => setLibOpen(false)}>
          <div className="otb-modal" role="dialog" aria-modal="true" aria-label="ספריית תבניות" onClick={(e) => e.stopPropagation()}>
            <div className="otb-modal-head">
              <h3>📚 ספריית תבניות</h3>
              <button type="button" className="otb-modal-x" onClick={() => setLibOpen(false)} aria-label="סגירה">✕</button>
            </div>
            <p className="otb-muted small">בחרו תבנית מוכנה — השדות האישיים יותאמו לעמודות שבקובץ שלכם, ואפשר לערוך הכול אחר כך. כפתורי קישור וחיוג יש להשלים עם הכתובת/המספר שלכם.</p>
            <div className="otb-lib-domains">
              {[{ id: 'all', label: 'הכול', icon: '🗂️' }, ...LIB_DOMAINS].map((d) => (
                <button key={d.id} type="button" className={'otb-chip' + (libDomain === d.id ? ' on' : '')} onClick={() => setLibDomain(d.id)}>{d.icon} {d.label}</button>
              ))}
            </div>
            <div className="otb-lib-grid">
              {LIB_TEMPLATES.filter((t) => libDomain === 'all' || t.domain === libDomain).map((t) => {
                const dom = LIB_DOMAINS.find((d) => d.id === t.domain);
                const preview = applyLibraryTemplate(t, fieldColumns, newButton);
                return (
                  <div key={t.id} className="otb-lib-card">
                    <div className="otb-lib-card-top"><b>{t.title}</b><small>{dom ? `${dom.icon} ${dom.label}` : ''}</small></div>
                    <div className="otb-lib-card-body">
                      {t.header ? <div className="otb-lib-card-hdr">{t.header}</div> : null}
                      {preview.spec.body}
                    </div>
                    {t.buttons.length > 0 && <div className="otb-lib-card-btns">{t.buttons.map((b, i) => <span key={i}>{BTN_ICON[b.type]} {b.text}</span>)}</div>}
                    <button type="button" className="otb-btn primary" onClick={() => pickLibraryTemplate(t)}>השתמשו בתבנית</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* price list: open in step 1 (to compare with the file), collapsed at payment, hidden while writing / scheduling */}
      {(step === 1 || step === 3) && <PriceCalculator key={step} defaultOpen={step === 1} />}

      <p id="otb-footnote" className="otb-footnote">* {SENDER_FOOTNOTE}</p>
    </div>
  );
}

// The ONE place with the price list: tiers table + a live calculator (same graduated maths as the server's quote).
function PriceCalculator({ defaultOpen }) {
  const [count, setCount] = useState(1000);
  const n = Math.max(1, Math.min(OTB_MAX_MESSAGES, Number(count) || 0));
  const [dest, setDest] = useState('IL');
  const quote = useMemo(() => calcQuote(n, { [dest]: n }), [n, dest]);
  const destOptions = useMemo(
    () => Object.keys(OTB_MARKETS).sort((a, b) => (a === 'IL' ? -1 : b === 'IL' ? 1 : OTB_MARKETS[a].label.localeCompare(OTB_MARKETS[b].label, 'he'))),
    [],
  );
  return (
    <section id="otb-pricing" className="otb-card otb-pricing">
      <details open={defaultOpen} className="otb-pricing-details">
      <summary><h3>מחירון ומחשבון</h3><span className="otb-pricing-hint">{defaultOpen ? 'הצגה/הסתרה' : 'לחצו לפתיחה'}</span></summary>
      <div className="otb-calc">
        <div className="otb-calc-tiers">
          <table className="otb-table prices">
            <thead><tr><th>כמות הודעות</th><th>מחיר להודעה</th></tr></thead>
            <tbody>
              {OTB_TIERS.map((t) => {
                const active = n >= t.from && n <= t.to;
                return (
                  <tr key={t.from} className={active ? 'active' : ''}>
                    <td>{t.from.toLocaleString('he-IL')} – {t.to.toLocaleString('he-IL')}</td>
                    <td>{fmtILS(t.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="otb-muted small">
            התמחור מדורג: כל טווח מחויב במחירו. מינימום הזמנה {fmtILS(OTB_MIN_ORDER)}. לכמות של מעל {OTB_MAX_MESSAGES.toLocaleString('he-IL')} הודעות או לליווי מלא — <Link href="/PriceList/ManagedBroadcast/">שירות הדיוור המנוהל</Link>.
            המחירים לפני מע״מ וכוללים עלויות WhatsApp/Meta, והם לנמענים בישראל. Meta מחייבת לפי מדינת הנמען, ולכן ביעדים עם תעריף גבוה (למשל אירופה) המחיר להודעה גבוה יותר — בחרו יעד במחשבון.
          </p>
        </div>
        <div className="otb-calc-box">
          <label className="otb-field">
            <span>כמה נמענים?</span>
            <input type="number" min={1} max={OTB_MAX_MESSAGES} value={count} onChange={(e) => setCount(e.target.value)} />
          </label>
          <input
            type="range" min={1} max={OTB_MAX_MESSAGES} step={50} value={n}
            onChange={(e) => setCount(e.target.value)} aria-label="כמות נמענים"
          />
          <label className="otb-field">
            <span>מדינת הנמענים</span>
            <select value={dest} onChange={(e) => setDest(e.target.value)}>
              {destOptions.map((k) => <option key={k} value={k}>{marketLabel(k)}</option>)}
            </select>
          </label>
          <div className="otb-summary">
            {quote.lines.map((l) => (
              <div key={l.from} className="otb-sum-line"><span>{l.count.toLocaleString('he-IL')} × {fmtILS(l.price)}</span><span>{fmtILS(l.amount)}</span></div>
            ))}
            {quote.surchargeLines.map((l) => (
              <div key={l.market} className="otb-sum-line"><span>תוספת יעד — {marketLabel(l.market)} (מינימום {fmtILS(l.price)} להודעה)</span><span>{fmtILS(l.amount)}</span></div>
            ))}
            {quote.minApplied && <div className="otb-sum-line"><span>השלמה למינימום הזמנה</span><span>{fmtILS(quote.subtotal)}</span></div>}
            <div className="otb-sum-line"><span>לפני מע״מ</span><span>{fmtILS(quote.subtotal)}</span></div>
            <div className="otb-sum-line"><span>מע״מ 18%</span><span>{fmtILS(quote.vat)}</span></div>
            <div className="otb-sum-line total"><span>סה״כ לתשלום</span><span>{fmtILS(quote.total)}</span></div>
          </div>
          <div className="otb-muted small">ממוצע {fmtILS(quote.avgPerMessage)} להודעה (לפני מע״מ)</div>
        </div>
      </div>
      </details>
    </section>
  );
}

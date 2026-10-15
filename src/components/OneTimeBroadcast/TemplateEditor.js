'use client';

import React, { useMemo, useRef, useState } from 'react';
import { OTB_API } from '@/lib/oneTimeBroadcastPricing';

/*
 * WhatsApp template editor for the one-time broadcast wizard — the same layout as the message editor used when
 * planning bots in Gambot (header · body with formatting bar · variables · footer · buttons), with the Excel
 * columns as the variable list.
 *
 * value:  { header, body, buttons: [{ id, type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER', text, url, phone }] }
 * The body holds named tokens ({{ColumnName}}); the wizard converts them to {{1}}, {{2}}… on submit.
 */

const LIMITS = { body: 1000, header: 60, button: 25, buttons: 5, quick: 3, url: 2, phone: 1 };
const BTN_TYPES = [
  { value: 'QUICK_REPLY', label: 'תשובה מהירה', icon: '↩' },
  { value: 'URL', label: 'קישור', icon: '🔗' },
  { value: 'PHONE_NUMBER', label: 'חיוג', icon: '📞' },
];
const EMOJIS = ['😀', '😊', '😍', '🙏', '👍', '🎉', '🔥', '✨', '❤️', '💥', '🎁', '🛍️', '⭐', '📣', '📅', '⏰', '✅', '👋', '🤝', '💬', '📞', '📍', '💰', '🏷️'];

const uid = () => `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const newButton = (type, text = '', autoReply = '') => ({ id: uid(), type, text, url: '', phone: '', autoReply });

const MEDIA_ICON = { IMAGE: '🖼️', VIDEO: '🎬', DOCUMENT: '📄' };
const fmtSize = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)}MB` : `${Math.max(1, Math.round((n || 0) / 1024))}KB`);

/** 'NONE' | 'TEXT' | 'MEDIA' — what the header picker shows for a spec. */
export const headerModeOf = (spec) => {
  const t = spec.headerType;
  if (t === 'TEXT') return 'TEXT';
  if (t === 'IMAGE' || t === 'VIDEO' || t === 'DOCUMENT' || t === 'MEDIA') return 'MEDIA';
  if (!t && (spec.header || '').trim()) return 'TEXT';
  return 'NONE';
};

export const isValidUrl = (raw) => {
  const s = String(raw || '').trim();
  if (!s || /\s/.test(s) || s.includes('{{')) return false;
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
    return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname.includes('.') && !u.hostname.endsWith('.');
  } catch (_) { return false; }
};

// mirrors the server: Israeli numbers (03-…, 050-…, +972…) or an explicit foreign +<country code>…
export const isValidCallPhone = (raw) => {
  const s = String(raw || '').trim();
  let d = s.replace(/\D/g, '');
  if (s.startsWith('+') && !d.startsWith('972')) return d.length >= 8 && d.length <= 15 && d[0] !== '0';
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('9720')) d = `972${d.slice(4)}`;
  else if (d.startsWith('0')) d = `972${d.slice(1)}`;
  else if (!d.startsWith('972') && d.length >= 8 && d.length <= 9) d = `972${d}`;
  return /^972[1-9]\d{7,8}$/.test(d);
};

/**
 * Header + buttons problems for a spec: { header: msg|null, buttons: { [id]: { text?, url?, phone? } }, list: [messages…] }.
 * Used both for the inline errors in the editor and to block "continue to payment" until everything is filled in.
 */
export function specIssues(spec) {
  const out = { header: null, buttons: {}, list: [] };
  const mode = headerModeOf(spec);
  if (mode === 'TEXT' && !(spec.header || '').trim()) out.header = 'כתבו את טקסט הכותרת, או בחרו ״ללא כותרת״';
  if (mode === 'TEXT' && /[*_~`]/.test(spec.header || '')) out.header = 'הכותרת לא יכולה לכלול עיצוב (* _ ~)';
  if (mode === 'TEXT' && /\{\{/.test(spec.header || '')) out.header = 'הכותרת לא יכולה לכלול שדות אישיים';
  if (mode === 'MEDIA' && !spec.headerMedia) out.header = 'העלו קובץ לכותרת, או בחרו ״ללא כותרת״';
  if (out.header) out.list.push(out.header);
  (spec.buttons || []).forEach((b, i) => {
    const e = {};
    const n = i + 1;
    if (!(b.text || '').trim()) e.text = 'חובה למלא שם לכפתור';
    if (b.type === 'URL') {
      if (!(b.url || '').trim()) e.url = 'חובה למלא כתובת אתר';
      else if (!isValidUrl(b.url)) e.url = 'כתובת האתר אינה תקינה (למשל https://example.co.il)';
    }
    if (b.type === 'PHONE_NUMBER') {
      if (!(b.phone || '').trim()) e.phone = 'חובה למלא מספר טלפון';
      else if (!isValidCallPhone(b.phone)) e.phone = 'מספר הטלפון אינו תקין (למשל 03-1234567 או 050-1234567)';
    }
    if (b.type === 'QUICK_REPLY' && !(b.autoReply || '').trim()) e.reply = 'חובה לכתוב את התגובה האוטומטית שתישלח כשלוחצים על הכפתור';
    if (Object.keys(e).length) {
      out.buttons[b.id] = e;
      const what = b.type === 'URL' ? 'קישור' : b.type === 'PHONE_NUMBER' ? 'חיוג' : 'תשובה מהירה';
      out.list.push(`כפתור ${n} (${what}): ${e.text || e.url || e.phone || e.reply}`);
    }
  });
  return out;
}

export default function TemplateEditor({ columns, value, onChange, fallbacks, onFallbacksChange, footer }) {
  const taRef = useRef(null);
  const [varsOpen, setVarsOpen] = useState(false);
  const [varQuery, setVarQuery] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');

  const set = (patch) => onChange({ ...value, ...patch });
  const body = value.body || '';
  const buttons = value.buttons || [];
  const headerMode = headerModeOf(value);
  const issues = useMemo(() => specIssues(value), [value]);

  const setHeaderMode = (k) => {
    setUploadErr('');
    if (k === 'NONE') set({ headerType: 'NONE' });
    else if (k === 'TEXT') set({ headerType: 'TEXT' });
    else set({ headerType: value.headerMedia ? value.headerMedia.format : 'MEDIA' });
  };

  const uploadHeader = async (file) => {
    if (!file) return;
    setUploadErr('');
    if (file.size > 16 * 1048576) { setUploadErr('הקובץ גדול מדי (תמונה עד 5MB, וידאו עד 16MB, מסמך עד 10MB)'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('File', file);
      const res = await fetch(`${OTB_API}/UploadMedia`, { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!data || data.success === false) throw new Error((data && data.error) || 'העלאת הקובץ נכשלה');
      set({
        headerType: data.format,
        headerMedia: { url: data.url, mime: data.mime, name: data.name || file.name, size: data.size, format: data.format, localUrl: URL.createObjectURL(file) },
      });
    } catch (e) {
      setUploadErr(e.message || 'העלאת הקובץ נכשלה');
    } finally {
      setUploading(false);
    }
  };

  // ── body editing around the caret ──
  const editBody = (fn) => {
    const ta = taRef.current;
    const cur = body;
    const s = ta && typeof ta.selectionStart === 'number' ? ta.selectionStart : cur.length;
    const e = ta && typeof ta.selectionEnd === 'number' ? ta.selectionEnd : s;
    const r = fn(cur, s, e);
    set({ body: r.text });
    setTimeout(() => { if (ta) { ta.focus(); ta.setSelectionRange(r.a, r.b); } }, 0);
  };
  const insertAtCaret = (str) => editBody((t, s, e) => ({ text: t.slice(0, s) + str + t.slice(e), a: s + str.length, b: s + str.length }));
  // WhatsApp formatting: whitespace stays OUTSIDE the markers (`*word*`, not `* word *`)
  const wrapSel = (open, close) => editBody((t, s, e) => {
    const sel = t.slice(s, e);
    const lead = (sel.match(/^\s*/) || [''])[0];
    const trail = (sel.match(/\s*$/) || [''])[0];
    const core = sel.slice(lead.length, sel.length - trail.length);
    const wrapped = core ? lead + open + core + close + trail : open + close;
    const a = core ? s + lead.length + open.length : s + open.length;
    return { text: t.slice(0, s) + wrapped + t.slice(e), a, b: core ? a + core.length : a };
  });
  const insertColumn = (name) => { insertAtCaret(`{{${name}}}`); setVarsOpen(false); setVarQuery(''); };

  const bodyVars = useMemo(() => [...body.matchAll(/\{\{([^{}]+)\}\}/g)].map((m) => m[1].trim()), [body]);
  const usedColumns = useMemo(() => Array.from(new Set(bodyVars.filter((v) => columns.includes(v)))), [bodyVars, columns]);
  const removeBodyVar = (idx) => {
    let n = -1;
    set({ body: body.replace(/\{\{[^{}]+\}\}/g, (m) => { n += 1; return n === idx ? '' : m; }) });
  };
  const shownColumns = columns.filter((c) => !varQuery.trim() || c.toLowerCase().includes(varQuery.trim().toLowerCase()));

  const warns = (() => {
    const t = body.trim();
    const w = [];
    if (!t) return w;
    if (/^\{\{[^{}]*\}\}/.test(t)) w.push('Meta: ההודעה לא יכולה להתחיל בשדה אישי');
    if (/\{\{[^{}]*\}\}$/.test(t)) w.push('Meta: ההודעה לא יכולה להסתיים בשדה אישי');
    if (/\{\{[^{}]*\}\}\s*\{\{[^{}]*\}\}/.test(t)) w.push('Meta: אסור שני שדות אישיים רצופים בלי טקסט ביניהם');
    const unknown = bodyVars.filter((v) => !columns.includes(v));
    if (unknown.length) w.push(`השדה {{${unknown[0]}}} לא תואם לאף עמודה באקסל — הוסיפו אותו מהרשימה`);
    return w;
  })();

  // ── buttons ──
  const count = (type) => buttons.filter((b) => b.type === type).length;
  const full = buttons.length >= LIMITS.buttons;
  const addBtn = (type) => { if (!full) set({ buttons: [...buttons, newButton(type)] }); };
  const setBtn = (i, patch) => set({ buttons: buttons.map((b, bi) => (bi === i ? { ...b, ...patch } : b)) });
  const delBtn = (i) => set({ buttons: buttons.filter((_, bi) => bi !== i) });
  const canAdd = (type) => !full && count(type) < (type === 'QUICK_REPLY' ? LIMITS.quick : type === 'URL' ? LIMITS.url : LIMITS.phone);

  return (
    <div className="otb-ime">
      <div className="otb-ime-f">
        <span>כותרת (אופציונלי)</span>
        <div className="otb-ime-seg" role="tablist">
          {[['NONE', 'ללא כותרת'], ['TEXT', 'טקסט'], ['MEDIA', 'מדיה (תמונה / וידאו / מסמך)']].map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={headerMode === k} className={headerMode === k ? 'on' : ''} onClick={() => setHeaderMode(k)}>{label}</button>
          ))}
        </div>
        {headerMode === 'TEXT' && (
          <>
            <input
              className="otb-ime-input otb-ime-header"
              value={value.header || ''}
              maxLength={LIMITS.header}
              placeholder="טקסט הכותרת (ללא שדות אישיים)"
              onChange={(e) => set({ header: e.target.value })}
            />
            <em className="otb-ime-count-inline">{(value.header || '').length}/{LIMITS.header}</em>
          </>
        )}
        {headerMode === 'MEDIA' && (
          <div className="otb-ime-media">
            {value.headerMedia ? (
              <div className="otb-ime-file">
                <span className="otb-ime-file-ico">{MEDIA_ICON[value.headerMedia.format] || '📎'}</span>
                <span className="otb-ime-file-name" dir="ltr">{value.headerMedia.name}</span>
                <span className="otb-ime-file-size">{fmtSize(value.headerMedia.size)}</span>
                <button type="button" className="otb-ime-x" onClick={() => set({ headerMedia: null, headerType: 'MEDIA' })} title="הסר קובץ">✕</button>
              </div>
            ) : (
              <label className={'otb-ime-drop' + (uploading ? ' busy' : '')}>
                <input type="file" accept=".jpg,.jpeg,.png,.mp4,.pdf,image/jpeg,image/png,video/mp4,application/pdf" disabled={uploading} onChange={(e) => { uploadHeader(e.target.files[0]); e.target.value = ''; }} />
                {uploading ? 'מעלה…' : '⬆ בחרו קובץ: תמונה JPG/PNG (עד 5MB) · וידאו MP4 (עד 16MB) · מסמך PDF (עד 10MB)'}
              </label>
            )}
            {uploadErr && <div className="otb-ime-err">{uploadErr}</div>}
          </div>
        )}
        {issues.header && <div className="otb-ime-err">{issues.header}</div>}
      </div>

      <div className="otb-ime-f">
        <span>גוף ההודעה</span>
        <div className="otb-ime-bodybox">
          <textarea
            ref={taRef}
            className="otb-ime-body"
            value={body}
            rows={Math.min(10, Math.max(5, body.split('\n').length + Math.floor(body.length / 40)))}
            maxLength={LIMITS.body}
            placeholder={`שלום {{${columns[0] || 'שם'}}},\nרצינו לעדכן אתכם על…`}
            onChange={(e) => set({ body: e.target.value })}
          />
          <div className="otb-ime-bar">
            <button type="button" className={'otb-ime-varbtn' + (varsOpen ? ' on' : '')} onMouseDown={(e) => e.preventDefault()} onClick={() => setVarsOpen((v) => !v)}>
              {'{{ }}'} הוסף שדה מהאקסל
            </button>
            <div className="otb-ime-fmt">
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setEmojiOpen((v) => !v)} title="אימוג׳י">😀</button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => wrapSel('*', '*')} title="מודגש (*טקסט*)"><b>B</b></button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => wrapSel('_', '_')} title="נטוי (_טקסט_)"><i>I</i></button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => wrapSel('~', '~')} title="קו חוצה (~טקסט~)"><s>abc</s></button>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => wrapSel('```', '```')} title="Monospace"><code>{'{ }'}</code></button>
            </div>
            <span className={'otb-ime-count' + (body.length >= LIMITS.body ? ' full' : '')}>{LIMITS.body - body.length} תווים נותרו (עד {LIMITS.body})</span>
          </div>
          {emojiOpen && (
            <div className="otb-ime-emoji">
              {EMOJIS.map((em) => (
                <button key={em} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insertAtCaret(em)}>{em}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {varsOpen && (
        <div className="otb-ime-vars">
          <input className="otb-ime-input" autoFocus value={varQuery} placeholder="חפש עמודה…" onChange={(e) => setVarQuery(e.target.value)} />
          <div className="otb-ime-vars-list">
            {shownColumns.length === 0 && <div className="otb-ime-vars-empty">אין עמודות מתאימות</div>}
            {shownColumns.map((c) => (
              <div key={c} className="otb-ime-var" onClick={() => insertColumn(c)} title={`{{${c}}}`}>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {warns.length > 0 && <div className="otb-ime-warn">{warns.map((w) => <div key={w}>⚠️ {w}</div>)}</div>}

      {bodyVars.length > 0 && (
        <div className="otb-ime-chips">
          {bodyVars.map((v, i) => (
            <span key={`${i}-${v}`} className="otb-ime-chip" title={`{{${v}}}`}>
              <span className="otb-ime-chip-idx">{`{{${i + 1}}}`}</span>
              <span className="otb-ime-chip-name">{v}</span>
              <button type="button" className="otb-ime-chip-x" onMouseDown={(e) => e.preventDefault()} onClick={() => removeBodyVar(i)} title="הסר שדה" aria-label="הסר שדה">✕</button>
            </span>
          ))}
        </div>
      )}

      {usedColumns.length > 0 && (
        <div className="otb-ime-fallbacks">
          <span>ערך ברירת מחדל אם התא באקסל ריק</span>
          {usedColumns.map((c) => (
            <label key={c} className="otb-ime-fb">
              <b>{c}</b>
              <input
                className="otb-ime-input"
                type="text"
                maxLength={60}
                placeholder="למשל: לקוח/ה יקר/ה"
                value={fallbacks[c] || ''}
                onChange={(e) => onFallbacksChange({ ...fallbacks, [c]: e.target.value })}
              />
            </label>
          ))}
        </div>
      )}

      <label className="otb-ime-f">
        <span>פוטר <em>🔒 נקבע אוטומטית</em></span>
        <input className="otb-ime-input otb-ime-footer" value={footer} readOnly disabled />
      </label>

      <div className="otb-ime-f">
        <span>כפתורים (אופציונלי) <em>{buttons.length}/{LIMITS.buttons}</em></span>
        {buttons.map((b, i) => (
          <div className="otb-ime-btnbox" key={b.id}>
            <div className="otb-ime-row">
              <select className="otb-ime-input otb-ime-btntype" value={b.type} onChange={(e) => setBtn(i, { type: e.target.value })}>
                {BTN_TYPES.map((x) => (
                  <option key={x.value} value={x.value} disabled={x.value !== b.type && !canAdd(x.value)}>{x.icon} {x.label}</option>
                ))}
              </select>
              <input
                className={'otb-ime-input otb-ime-btn' + (issues.buttons[b.id] && issues.buttons[b.id].text ? ' bad' : '')}
                value={b.text}
                maxLength={LIMITS.button}
                placeholder={`טקסט הכפתור ${i + 1}`}
                onChange={(e) => setBtn(i, { text: e.target.value })}
              />
              <button type="button" className="otb-ime-x" onClick={() => delBtn(i)} title="הסר כפתור">✕</button>
            </div>
            {b.type === 'URL' && (
              <input className={'otb-ime-input' + (issues.buttons[b.id] && issues.buttons[b.id].url ? ' bad' : '')} dir="ltr" type="url" value={b.url} placeholder="https://example.co.il/offer" onChange={(e) => setBtn(i, { url: e.target.value })} />
            )}
            {b.type === 'PHONE_NUMBER' && (
              <input className={'otb-ime-input' + (issues.buttons[b.id] && issues.buttons[b.id].phone ? ' bad' : '')} dir="ltr" type="tel" value={b.phone} placeholder="03-1234567" onChange={(e) => setBtn(i, { phone: e.target.value })} />
            )}
            {issues.buttons[b.id] && (issues.buttons[b.id].text || issues.buttons[b.id].url || issues.buttons[b.id].phone) && (
              <div className="otb-ime-err">{issues.buttons[b.id].text || issues.buttons[b.id].url || issues.buttons[b.id].phone}</div>
            )}
            {b.type === 'QUICK_REPLY' && (
              <>
                <textarea
                  className={'otb-ime-input otb-ime-reply' + (issues.buttons[b.id] && issues.buttons[b.id].reply ? ' bad' : '')}
                  rows={2}
                  maxLength={1000}
                  value={b.autoReply || ''}
                  placeholder="תגובה אוטומטית שתישלח לנמען כשילחץ על הכפתור — למשל: תודה! נחזור אליך בהקדם 🙏"
                  onChange={(e) => setBtn(i, { autoReply: e.target.value })}
                />
                {issues.buttons[b.id] && issues.buttons[b.id].reply && <div className="otb-ime-err">{issues.buttons[b.id].reply}</div>}
                <div className="otb-ime-mini">↩ כשהנמען לוחץ — התגובה שכתבתם נשלחת אליו אוטומטית בוואטסאפ</div>
              </>
            )}
            {b.type !== 'QUICK_REPLY' && <div className="otb-ime-mini">{b.type === 'URL' ? '🔗 פותח את הקישור · הלחיצות נספרות אוטומטית ויופיעו בדוח' : '📞 מחייג למספר'}</div>}
          </div>
        ))}
        <div className="otb-ime-tools">
          <button type="button" onClick={() => addBtn('URL')} disabled={!canAdd('URL')}>＋ 🔗 קישור</button>
          <button type="button" onClick={() => addBtn('PHONE_NUMBER')} disabled={!canAdd('PHONE_NUMBER')}>＋ 📞 חיוג</button>
          <button type="button" onClick={() => addBtn('QUICK_REPLY')} disabled={!canAdd('QUICK_REPLY')}>＋ ↩ תשובה מהירה</button>
        </div>
      </div>
    </div>
  );
}

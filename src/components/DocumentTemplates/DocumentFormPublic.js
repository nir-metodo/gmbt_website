'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Public, no-auth STANDALONE FORM page for document templates sent as a fill-only link.
// Decoupled from e-signature: renders the ACTUAL document (PDF) with the recipient input fields
// positioned ON it (DocuSign-style), validates them, and submits the answers (no signature)
// via ESignature_SubmitForm.

const API_BASE = 'https://gambot.azurewebsites.net/api/Webhooks';
const gambotLogo = '/new_logo.png';

// pdfjs v5 uses an ES-module worker served SAME-ORIGIN from /public (copied from react-pdf's bundled
// pdfjs-dist) so the version can never drift and cross-origin module-worker loading can't fail.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Stable options reference — react-pdf reloads the document whenever this prop changes identity.
const PDF_OPTIONS = {
  cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

// Field types the recipient actively fills. `name`/`date`/`date_today` are shown too (auto/typed).
// Keep in sync with the editor's INPUT_FIELD_TYPES + the gmbt_frontend copy of this form, otherwise
// placed fields (e.g. multiline_text / address) silently vanish from the public link.
const INPUT_TYPES = ['text', 'multiline_text', 'address', 'id_number', 'email', 'phone', 'number', 'dropdown', 'radio_group', 'checkbox', 'name', 'date', 'date_today', 'signature', 'initials'];

const isValidIsraeliId = (rawId) => {
  const digits = String(rawId ?? '').trim();
  if (!/^\d{1,9}$/.test(digits)) return false;
  const id = digits.padStart(9, '0');
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let step = Number(id[i]) * ((i % 2) + 1);
    if (step > 9) step -= 9;
    sum += step;
  }
  return sum % 10 === 0;
};

const DocumentFormPublic = () => {
  // Parse /:organization/form/:documentId/:token from window.location (static Next.js export).
  const pathParts = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '').split('/') : [];
  const formIdx = pathParts.indexOf('form');
  const organization = formIdx > 0 ? pathParts[formIdx - 1] : null;
  const documentId = formIdx > 0 ? pathParts[formIdx + 1] : null;
  const token = formIdx > 0 ? pathParts[formIdx + 2] : null;
  const searchParams = useSearchParams();
  const urlLang = searchParams?.get('lang');
  const [lang, setLang] = useState(urlLang === 'en' ? 'en' : 'he');
  const isRTL = lang === 'he';
  const L = (he, en) => (lang === 'he' ? he : en);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doc, setDoc] = useState(null);
  // Live form settings from the SOURCE TEMPLATE (contact header visibility/required + submit label
  // are authored only there). Preferred over the document's cached copy so template edits apply.
  const [tplFormConfig, setTplFormConfig] = useState(null);
  const [orgInfo, setOrgInfo] = useState(null);
  const [values, setValues] = useState({}); // keyed by fieldId
  const [signerName, setSignerName] = useState('');
  const [signerPhone, setSignerPhone] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  // Values for the admin-defined custom questions shown at the top of the form (keyed by field id).
  const [customValues, setCustomValues] = useState({});
  const setCustomVal = (cid, v) => {
    setCustomValues(prev => ({ ...prev, [cid]: v }));
    setErrors(prev => (prev[`custom_${cid}`] ? { ...prev, [`custom_${cid}`]: undefined } : prev));
  };
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [errors, setErrors] = useState({}); // keyed by fieldId (or 'signerName'/'signerEmail')

  // PDF viewer state
  const [numPages, setNumPages] = useState(null);
  // baseWidth = fit-to-container width (computed below). zoom = user zoom multiplier. The ACTUAL
  // render width is baseWidth × zoom — this lets the reader enlarge the page to read comfortably and
  // pan freely, while overlay fields (which scale off pdfWidth) stay perfectly aligned.
  const [baseWidth, setBaseWidth] = useState(800);
  const [zoom, setZoom] = useState(1);
  const pdfWidth = Math.max(220, Math.round(baseWidth * zoom));
  // The PDF page's intrinsic (scale-1) width. Field coordinates were authored in the editor's
  // pixel space = intrinsicWidth × EDITOR_SCALE, so we must scale against THIS width — not a
  // hardcoded 612 (that assumption drifted fields on non-Letter pages like A4).
  const [pdfIntrinsicWidth, setPdfIntrinsicWidth] = useState(612);
  const [pdfError, setPdfError] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Signature capture (tap-to-sign) — the drawn signature is stored as a data-URL in values[fieldId]
  // and embedded into the filled PDF on submit.
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [activeSignatureFieldId, setActiveSignatureFieldId] = useState(null);
  const modalSigCanvas = useRef(null);

  // Render the page at its NATURAL (authored) width so the overlay fields keep the exact proportions
  // they were designed with. Fitting the whole page to a narrow phone shrank the field boxes while
  // their input text/padding stayed a fixed 14px/8px — so the fields looked oversized and cramped.
  // On screens narrower than the page the reader simply scrolls sideways (docViewer overflow-x:auto),
  // which is what's wanted here. Use the zoom buttons to enlarge/shrink for comfort.
  const docViewerRef = useRef(null);
  useEffect(() => {
    setBaseWidth(pdfIntrinsicWidth || 612);
  }, [pdfIntrinsicWidth]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/ESignature_GetDocumentByToken?token=${token}&organizationName=${organization}&documentId=${documentId}`);
        const data = res.data;
        if (data?.success || data?.Success) {
          const d = data.data || data.Data;
          setDoc(d);
          if (data?.organizationInfo) setOrgInfo(data.organizationInfo);
          if (d?.signerName) setSignerName(d.signerName);
          if (d?.signerEmail) setSignerEmail(d.signerEmail);
          if (d?.signerPhone) setSignerPhone(d.signerPhone);
          if (!urlLang && d?.language) setLang(d.language === 'en' ? 'en' : 'he');

          // Form settings (e.g. "show contact details on top") live on the source template. Fetch the
          // template's CURRENT formConfig so changes apply immediately, even for previously-sent links.
          const tplId = d?.sourceTemplateId || d?.SourceTemplateId;
          if (tplId && organization) {
            try {
              const tplRes = await axios.post(`${API_BASE}/DocTemplates_GetById`, { organization, templateId: tplId });
              const tplData = tplRes.data?.Data || tplRes.data?.data;
              if (tplData?.formConfig) setTplFormConfig(tplData.formConfig);
            } catch (tplErr) {
              console.warn('Could not load template formConfig (using document copy):', tplErr);
            }
          }
        } else if (data?.alreadySigned || data?.AlreadySigned) {
          setAlreadyDone(true);
        } else {
          setError(data?.message || data?.Message || L('הטופס לא נמצא או שהקישור אינו תקין', 'Form not found or link is invalid'));
        }
      } catch (e) {
        console.error('Failed to load form:', e);
        setError(L('טעינת הטופס נכשלה. ייתכן שהקישור אינו תקין או שפג תוקפו.', 'Failed to load form. The link may be invalid or expired.'));
      } finally {
        setLoading(false);
      }
    };
    if (organization && documentId && token) load();
    // eslint-disable-next-line
  }, [organization, documentId, token]);

  // Input fields the recipient fills (skip signature/initials/variable). Keep read-only auto fields
  // (date_today) so they still display + submit.
  // Field types that must ALWAYS render on the public link. Their backend `editable` flag defaults
  // to false (C# bool default — the editor never sets it for these), so gating on `editable !== false`
  // used to silently drop the name / signature / date fields. Only genuine text inputs explicitly
  // marked read-only should be hidden.
  const ALWAYS_SHOWN_TYPES = ['name', 'date', 'date_today', 'signature', 'initials'];
  const fields = useMemo(() => {
    const all = doc?.signatureFields || [];
    return all
      .filter(f => INPUT_TYPES.includes((f.fieldType || '').toLowerCase()))
      .filter(f => ALWAYS_SHOWN_TYPES.includes((f.fieldType || '').toLowerCase()) || f.editable !== false);
  }, [doc]);

  // Per-template form settings. Prefer the live template config; fall back to the doc's cached copy.
  // Defaults keep the previous behavior (contact header shown, full name required).
  const cfg = useMemo(() => {
    const c = tplFormConfig || doc?.formConfig || {};
    return {
      collectContact: c.collectContact !== false,
      requireName: c.requireName !== false,
      requirePhone: c.requirePhone === true,
      requireEmail: c.requireEmail === true,
      showName: c.showName !== false,
      showPhone: c.showPhone !== false,
      showEmail: c.showEmail !== false,
      // Keep ONLY well-formed question objects with a stable id. A null/undefined entry (or a stray
      // primitive left by a bad save) would blow up renderCustomField (`cf.id` on null) and take the
      // whole public form down with a client-side exception — so we defensively drop anything invalid.
      customFields: (Array.isArray(c.customFields) ? c.customFields : [])
        .filter(cf => cf && typeof cf === 'object' && (cf.id != null || cf.label != null || cf.labelEn != null)),
      submitLabel: c.submitLabel || '',
      submitLabelEn: c.submitLabelEn || '',
      successMessage: c.successMessage || '',
      successMessageEn: c.successMessageEn || '',
      successSubtitle: c.successSubtitle || '',
      successSubtitleEn: c.successSubtitleEn || '',
    };
  }, [doc, tplFormConfig]);

  const labelFor = (f) => f.label || f.placeholder || f.fieldName || f.fieldKey || L('שדה', 'Field');
  const todayStr = () => new Date().toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US');

  // Format hint shown as a placeholder so the user knows exactly what to type (e.g. email format).
  const phFor = (f) => {
    if (f.placeholder) return f.placeholder;
    switch ((f.fieldType || '').toLowerCase()) {
      case 'email': return 'name@example.com';
      case 'phone': return L('050-0000000', '050-0000000');
      case 'id_number': return L('9 ספרות', '9 digits');
      case 'number': return L('מספר', 'Number');
      case 'name': return L('שם מלא', 'Full name');
      case 'dropdown': return L('בחר...', 'Select...');
      case 'date': return L('בחר תאריך', 'Pick a date');
      default: return L('הקלד כאן...', 'Type here...');
    }
  };

  const getEffectiveValidation = (f) => {
    const v = (f?.validation || '').toLowerCase();
    if (v && v !== 'none') return v;
    const ft = (f?.fieldType || '').toLowerCase();
    if (['id_number', 'email', 'phone', 'number'].includes(ft)) return ft;
    return 'none';
  };

  const validate = (f, raw) => {
    const ft = (f.fieldType || '').toLowerCase();
    if (ft === 'date_today') return null; // auto-stamped
    const label = labelFor(f);
    const isCheckbox = ft === 'checkbox';
    const boolVal = raw === true || raw === 'true';
    const value = isCheckbox ? boolVal : String(raw ?? '').trim();
    const isEmpty = isCheckbox ? boolVal === false : value === '';
    if (f.required && isEmpty) return L(`נא למלא את השדה: ${label}`, `Please fill in: ${label}`);
    if (isEmpty) return null;
    switch (getEffectiveValidation(f)) {
      case 'id_number':
        if (!isValidIsraeliId(value)) return L(`תעודת זהות לא תקינה: ${label}`, `Invalid ID number: ${label}`);
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return L(`כתובת אימייל לא תקינה: ${label}`, `Invalid email: ${label}`);
        break;
      case 'phone':
        if (value.replace(/\D/g, '').length < 9) return L(`מספר טלפון לא תקין: ${label}`, `Invalid phone: ${label}`);
        break;
      case 'number':
        if (!/^-?\d+(\.\d+)?$/.test(value)) return L(`יש להזין מספר בשדה: ${label}`, `Must be a number: ${label}`);
        break;
      case 'regex':
        if (f.validationRegex) { try { if (!new RegExp(f.validationRegex).test(value)) return L(`ערך לא תקין: ${label}`, `Invalid value: ${label}`); } catch (_) {} }
        break;
      default: break;
    }
    return null;
  };

  const resolveValue = (f) => {
    const ft = (f.fieldType || '').toLowerCase();
    if (ft === 'name') return signerName;
    if (ft === 'date_today') return todayStr();
    if (ft === 'checkbox') return (values[f.fieldId] === true || values[f.fieldId] === 'true') ? 'true' : 'false';
    return values[f.fieldId] ?? (f.value || '');
  };

  // Position an overlay field on the PDF. Fields saved in canvas pixels at editor scale 1.8 over the
  // page's INTRINSIC width → scale to the current display width. (Identical to the signing page.)
  const getFieldStyle = (field) => {
    if (!pdfWidth) return {};
    const editorScale = 1.8;
    // Displayed width ÷ editor authoring width (intrinsic × editorScale).
    const scale = pdfWidth / (pdfIntrinsicWidth * editorScale);
    return {
      position: 'absolute',
      left: `${(field.x || 0) * scale}px`,
      top: `${(field.y || 0) * scale}px`,
      width: `${(field.width || 120) * scale}px`,
      height: `${(field.height || 32) * scale}px`,
      zIndex: 10,
    };
  };

  const setVal = (fieldId, v) => {
    setValues(prev => ({ ...prev, [fieldId]: v }));
    setErrors(prev => (prev[fieldId] ? { ...prev, [fieldId]: undefined } : prev));
  };

  const closeSignatureModal = () => { setShowSignatureModal(false); setActiveSignatureFieldId(null); };
  const clearSignaturePad = () => { modalSigCanvas.current?.clear(); };
  const saveSignature = () => {
    const pad = modalSigCanvas.current;
    if (!pad || pad.isEmpty()) {
      alert(L('נא לחתום בתיבה', 'Please sign in the box'));
      return;
    }
    // `getTrimmedCanvas()` throws in current react-signature-canvas builds (its trim-canvas dep can
    // raise on the backing store) — which made "save" silently do nothing. Try trimmed → raw canvas
    // → the pad's own toDataURL, so a signature is ALWAYS captured.
    let dataUrl = '';
    try {
      const canvas = typeof pad.getTrimmedCanvas === 'function' ? pad.getTrimmedCanvas() : pad.getCanvas();
      dataUrl = canvas.toDataURL('image/png');
    } catch (_) {
      try { dataUrl = pad.getCanvas().toDataURL('image/png'); }
      catch (_) { try { dataUrl = pad.toDataURL('image/png'); } catch (_) { dataUrl = ''; } }
    }
    if (!dataUrl) {
      alert(L('שמירת החתימה נכשלה. נסו שוב.', 'Failed to save signature. Please try again.'));
      return;
    }
    if (activeSignatureFieldId) setVal(activeSignatureFieldId, dataUrl);
    closeSignatureModal();
  };

  const blurValidate = (f) => {
    const ft = (f.fieldType || '').toLowerCase();
    const raw = ft === 'name' ? signerName : (ft === 'checkbox' ? (values[f.fieldId] === true || values[f.fieldId] === 'true') : values[f.fieldId]);
    const err = validate(f, raw);
    setErrors(prev => ({ ...prev, [f.fieldId]: err || undefined }));
  };

  // Render the fillable control positioned ON the document.
  const renderOverlayControl = (f) => {
    const ft = (f.fieldType || '').toLowerCase();
    const id = f.fieldId;
    const val = values[id];
    const hasErr = !!errors[id];
    const stop = (e) => e.stopPropagation();
    const borderColor = hasErr ? '#dc2626' : '#2e6155';
    const base = {
      width: '100%', height: '100%', boxSizing: 'border-box',
      border: `2px solid ${borderColor}`, borderRadius: '4px', background: '#fff',
      padding: '4px 8px', fontSize: '14px', color: '#111827', outline: 'none',
      boxShadow: hasErr ? '0 0 0 3px rgba(220,38,38,.12)' : 'none',
    };
    const readOnlyBox = { ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#475569', borderStyle: 'dashed' };
    const onBlur = () => blurValidate(f);

    if (ft === 'name') {
      return <input style={base} value={signerName} onClick={stop} onBlur={onBlur} onChange={(e) => { setSignerName(e.target.value); setErrors(prev => prev[id] ? { ...prev, [id]: undefined } : prev); }} placeholder={phFor(f)} />;
    }
    if (ft === 'date_today') {
      return <div style={readOnlyBox} title={labelFor(f)}>{todayStr()}</div>;
    }
    if (ft === 'signature' || ft === 'initials') {
      const openSig = (e) => { stop(e); setActiveSignatureFieldId(id); setShowSignatureModal(true); };
      if (val) {
        // Signed → show the captured signature; tap to re-sign.
        return (
          <div onClick={openSig} title={L('לחיצה לחתימה מחדש', 'Tap to re-sign')}
            style={{ ...base, padding: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <img src={val} alt="signature" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        );
      }
      return (
        <div onClick={openSig} title={labelFor(f)}
          style={{ ...base, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#f8fafc', borderStyle: 'dashed', color: '#2e6155', fontWeight: 600 }}>
          ✍️ {ft === 'initials' ? L('ראשי תיבות', 'Initials') : L('לחתום כאן', 'Sign here')}
        </div>
      );
    }
    if (ft === 'date') {
      return <input type="date" style={base} value={val ?? ''} onClick={stop} onBlur={onBlur} onChange={(e) => setVal(id, e.target.value)} />;
    }
    if (ft === 'dropdown') {
      const opts = Array.isArray(f.options) ? f.options : [];
      return (
        <select style={base} value={val ?? ''} onClick={stop} onBlur={onBlur} onChange={(e) => setVal(id, e.target.value)}>
          <option value="">{phFor(f)}</option>
          {opts.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
      );
    }
    if (ft === 'radio_group') {
      const opts = Array.isArray(f.options) ? f.options : [];
      // Two author-selectable display styles (field.displayStyle):
      //  • 'toggle'   → a compact segmented כן/לא bar that fills the field box.
      //  • 'checkbox' → (default) each option on its own row with a square check box.
      // Both are mutually-exclusive (single choice); the stored value is the chosen option text.
      // Default = 'checkbox' because the old inline-chip layout overflowed narrow fields into a
      // horizontal scrollbar (the "◄|►" the field looked broken as).
      const dstyle = f.displayStyle === 'toggle' ? 'toggle' : 'checkbox';
      if (dstyle === 'toggle') {
        // Compact segmented pill, centered in the field box (no full-box border/fill). The old version
        // stretched a heavy 14px green bar across the whole box, which looked oversized next to the
        // tiny pre-printed "כן / לא" text. Small font + tight padding keeps it unobtrusive.
        return (
          <div style={{ ...base, padding: 0, border: 'none', background: 'transparent', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }} onClick={stop}>
            <div style={{ display: 'inline-flex', border: `1.5px solid ${borderColor}`, borderRadius: 999, overflow: 'hidden', background: '#fff', maxWidth: '100%' }}>
              {opts.slice(0, 3).map((o, i) => {
                const selected = val === o;
                return (
                  <button type="button" key={i} title={o} onClick={() => setVal(id, o)} style={{
                    border: 'none', cursor: 'pointer', padding: '1px 8px', minWidth: 0,
                    background: selected ? '#2e6155' : 'transparent',
                    color: selected ? '#fff' : '#374151', fontWeight: selected ? 700 : 500,
                    fontSize: 11, lineHeight: 1.5, whiteSpace: 'nowrap',
                    borderInlineStart: i > 0 ? `1px solid ${borderColor}` : 'none',
                    transition: 'all .12s ease',
                  }}>{o}</button>
                );
              })}
            </div>
          </div>
        );
      }
      // 'checkbox' (stacked): square box + label per row, mutually exclusive. Hidden native radio
      // preserved for accessibility + keyboard navigation.
      return (
        <div style={{ ...base, padding: '4px 8px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', gap: 4, overflow: 'auto' }} onClick={stop}>
          {opts.map((o, i) => {
            const selected = val === o;
            return (
              <label key={i} title={o} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <input type="radio" name={id} value={o} checked={selected} onChange={() => setVal(id, o)} style={{ position: 'absolute', opacity: 0, width: 1, height: 1, margin: 0, pointerEvents: 'none' }} />
                <span style={{
                  width: 18, height: 18, minWidth: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${selected ? '#2e6155' : '#94a3b8'}`, borderRadius: 4,
                  background: selected ? '#2e6155' : '#fff', color: '#fff', fontSize: 13, fontWeight: 700, transition: 'all .12s ease',
                }}>{selected ? '✓' : ''}</span>
                <span style={{ fontSize: 14, fontWeight: selected ? 700 : 500, color: selected ? '#1d4ed8' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o}</span>
              </label>
            );
          })}
        </div>
      );
    }
    if (ft === 'checkbox') {
      const checked = val === true || val === 'true';
      return (
        <label style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={stop} title={labelFor(f)}>
          <input type="checkbox" checked={checked} onChange={(e) => setVal(id, e.target.checked)} style={{ width: 18, height: 18 }} />
        </label>
      );
    }
    if (ft === 'number') return <input type="number" inputMode="decimal" dir="ltr" style={base} value={val ?? ''} placeholder={phFor(f)} onClick={stop} onBlur={onBlur} onChange={(e) => setVal(id, e.target.value)} />;
    if (ft === 'email') return <input type="email" inputMode="email" dir="ltr" style={base} value={val ?? ''} placeholder={phFor(f)} onClick={stop} onBlur={onBlur} onChange={(e) => setVal(id, e.target.value)} />;
    if (ft === 'phone') return <input type="tel" inputMode="tel" dir="ltr" style={base} value={val ?? ''} placeholder={phFor(f)} onClick={stop} onBlur={onBlur} onChange={(e) => setVal(id, e.target.value)} />;
    if (ft === 'id_number') return <input inputMode="numeric" dir="ltr" maxLength={9} style={base} value={val ?? ''} placeholder={phFor(f)} onClick={stop} onBlur={onBlur} onChange={(e) => setVal(id, e.target.value.replace(/\D/g, ''))} />;
    if (ft === 'multiline_text') {
      // Multi-line text: Enter inserts a newline (don't advance to the next field like single-line inputs do).
      return <textarea onKeyDown={stop} style={{ ...base, resize: 'none', lineHeight: 1.3, textAlign: 'start', whiteSpace: 'pre-wrap', overflow: 'auto' }} value={val ?? ''} placeholder={phFor(f)} onClick={stop} onBlur={onBlur} onChange={(e) => setVal(id, e.target.value)} />;
    }
    return <input type="text" style={base} value={val ?? ''} placeholder={phFor(f)} onClick={stop} onBlur={onBlur} onChange={(e) => setVal(id, e.target.value)} />;
  };

  // Admin-defined custom question shown at the very top of the form (see template "Fill-form settings").
  const renderCustomField = (cf) => {
    const cid = cf.id;
    const label = (isRTL ? cf.label : cf.labelEn) || cf.label || cf.labelEn || '';
    const v = customValues[cid] ?? '';
    const errKey = `custom_${cid}`;
    const cls = `dfp-input${errors[errKey] ? ' dfp-input-err' : ''}`;
    // Corrupted legacy configs stored cf.type as [] (empty array) instead of a string. [] is truthy,
    // so `(cf.type || 'text')` yields [] and `.toLowerCase()` throws, crashing the whole public form.
    // Coerce anything non-string to a safe 'text' default.
    const type = (typeof cf.type === 'string' ? cf.type : 'text').toLowerCase();
    let control;
    if (type === 'textarea') {
      control = <textarea className={cls} rows={3} value={v} onChange={(e) => setCustomVal(cid, e.target.value)} placeholder={label} style={{ resize: 'vertical' }} />;
    } else if (type === 'dropdown') {
      const opts = Array.isArray(cf.options) ? cf.options : [];
      control = (
        <select className={cls} value={v} onChange={(e) => setCustomVal(cid, e.target.value)}>
          <option value="">{L('בחר...', 'Select...')}</option>
          {opts.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
      );
    } else {
      const inputType = type === 'number' ? 'number' : type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text';
      const dir = (type === 'email' || type === 'phone' || type === 'number') ? 'ltr' : undefined;
      control = <input className={cls} type={inputType} dir={dir} value={v} onChange={(e) => setCustomVal(cid, e.target.value)} placeholder={label} />;
    }
    return (
      <div key={cid} style={{ ...styles.field, flex: '1 1 100%' }}>
        <label style={styles.label}>{label} {cf.required && <span style={styles.req}>*</span>}</label>
        {control}
        {errors[errKey] && <span style={styles.inlineErr}>{errors[errKey]}</span>}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    // Collect ALL problems at once (per-field) so the user sees every fix needed, with red
    // borders on the offending fields — instead of a single blocking alert per error.
    const nextErrors = {};
    if (cfg.collectContact) {
      if (cfg.showName && cfg.requireName && !signerName.trim()) nextErrors.signerName = L('נא להזין שם מלא', 'Please enter your full name');
      if (cfg.showPhone && cfg.requirePhone && !signerPhone.trim()) nextErrors.signerPhone = L('נא להזין טלפון', 'Please enter your phone');
      if (cfg.showEmail && cfg.requireEmail && !signerEmail.trim()) nextErrors.signerEmail = L('נא להזין אימייל', 'Please enter your email');
      if (cfg.showEmail && signerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signerEmail.trim())) {
        nextErrors.signerEmail = L('כתובת אימייל לא תקינה', 'Invalid email address');
      }
    }
    // Validate the custom questions (required + email format).
    (cfg.customFields || []).forEach(cf => {
      const raw = customValues[cf.id];
      const empty = raw === undefined || raw === null || String(raw).trim() === '';
      if (cf.required && empty) nextErrors[`custom_${cf.id}`] = L('שדה חובה', 'Required field');
      else if ((typeof cf.type === 'string' ? cf.type : '').toLowerCase() === 'email' && !empty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(raw).trim())) {
        nextErrors[`custom_${cf.id}`] = L('כתובת אימייל לא תקינה', 'Invalid email address');
      }
    });
    for (const f of fields) {
      const ft = (f.fieldType || '').toLowerCase();
      const raw = ft === 'name' ? signerName : (ft === 'checkbox' ? (values[f.fieldId] === true || values[f.fieldId] === 'true') : values[f.fieldId]);
      const err = validate(f, raw);
      if (err) nextErrors[f.fieldId] = err;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    try {
      setSubmitting(true);
      const fieldValues = {}; // keyed by fieldId
      const fieldData = {};   // keyed by fieldKey
      fields.forEach(f => {
        fieldValues[f.fieldId] = resolveValue(f);
        if (f.fieldKey) fieldData[f.fieldKey] = resolveValue(f);
      });
      // Include the custom questions so they persist + appear in submissions / dynamic content.
      // Keyed by the field's label (readable) with the id as a fallback.
      (cfg.customFields || []).forEach(cf => {
        const key = (cf.label || cf.labelEn || cf.id || '').toString().trim() || cf.id;
        fieldData[key] = customValues[cf.id] ?? '';
      });
      const res = await axios.post(`${API_BASE}/ESignature_SubmitForm`, {
        token,
        signerName,
        signerEmail,
        signerPhone,
        fieldValues: JSON.stringify(fieldValues),
        fieldData: JSON.stringify(fieldData),
      });
      if (res.data?.success || res.data?.Success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(res.data?.error || res.data?.Error || L('שליחת הטופס נכשלה', 'Failed to submit form'));
      }
    } catch (err) {
      console.error('Submit failed:', err);
      alert(L('שליחת הטופס נכשלה. נסה שוב.', 'Failed to submit. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const shell = (children) => (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={styles.page}>
      <div style={styles.headerBar}>
        <div style={styles.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {orgInfo?.companyLogo
              ? <img src={orgInfo.companyLogo} alt={orgInfo?.companyName || 'Company'} style={{ height: 34, objectFit: 'contain' }} />
              : <img src={gambotLogo} alt="Gambot" style={{ height: 30, objectFit: 'contain' }} />}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 16 }}>{doc?.sourceTemplateName || doc?.documentName || L('טופס', 'Form')}</span>
              {orgInfo?.companyName && <span style={{ fontSize: 12, color: '#64748b' }}>{L('נשלח על ידי', 'Sent by')} {orgInfo.companyName}</span>}
            </div>
          </div>
          <span style={styles.secureBadge}>🔒 {L('חיבור מאובטח', 'Secure')}</span>
        </div>
      </div>
      {children}
      <div style={styles.footer}>
        <a href="https://gambot.co.il" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
          {L('מופעל על ידי', 'Powered by')} <strong>Gambot</strong>
        </a>
      </div>
    </div>
  );

  const centered = (node) => shell(<div style={styles.centerWrap}><div style={styles.centerCard}>{node}</div></div>);

  if (loading) return centered(<div style={styles.center}><FaSpinner className="dfp-spin" /> {L('טוען טופס...', 'Loading form...')}</div>);
  if (alreadyDone) return centered(<div style={styles.center}><FaCheckCircle size={56} color="#28a745" /><h2>{L('הטופס כבר מולא', 'Form already submitted')}</h2><p>{L('תודה!', 'Thank you!')}</p></div>);
  if (error) return centered(<div style={styles.center}><div style={{ fontSize: 40 }}>⚠️</div><h2>{L('הטופס אינו זמין', 'Form unavailable')}</h2><p>{error}</p></div>);
  if (submitted) {
    const successTitle = (isRTL ? cfg.successMessage : cfg.successMessageEn) || L('תודה!', 'Thank you!');
    const successSubtitle = (isRTL ? cfg.successSubtitle : cfg.successSubtitleEn) || L('הטופס נשלח בהצלחה.', 'Your form was submitted successfully.');
    return centered(<div style={styles.center}><FaCheckCircle size={56} color="#28a745" /><h2>{successTitle}</h2><p>{successSubtitle}</p><p style={{ color: '#64748b' }}>{L('ניתן לסגור את הדף.', 'You can close this page now.')}</p></div>);
  }

  const hasPdf = !!doc?.originalFileUrl;
  const errorCount = Object.values(errors).filter(Boolean).length;

  return shell(
    <form onSubmit={handleSubmit} style={styles.content}>
      <div style={styles.hint}>{L('מלא את השדות המסומנים על המסמך, ולאחר מכן שלח.', 'Fill in the highlighted fields on the document, then submit.')}</div>

      {errorCount > 0 && (
        <div style={styles.errorBanner}>
          <strong>⚠️ {L(`יש לתקן ${errorCount} שדות:`, `Please fix ${errorCount} field(s):`)}</strong>
          <ul style={styles.errorList}>
            {Object.values(errors).filter(Boolean).map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </div>
      )}

      {/* Contact details (needed to record who filled the form) — shown only when the template asks for it */}
      {cfg.collectContact && (cfg.showName || cfg.showPhone || cfg.showEmail) && (
      <div style={styles.contactCard}>
        {cfg.showName && (
        <div style={{ ...styles.field, flex: 2, minWidth: 200 }}>
          <label style={styles.label}>{L('שם מלא', 'Full name')} {cfg.requireName && <span style={styles.req}>*</span>}</label>
          <input className={`dfp-input${errors.signerName ? ' dfp-input-err' : ''}`} value={signerName}
            onChange={(e) => { setSignerName(e.target.value); setErrors(p => p.signerName ? { ...p, signerName: undefined } : p); }}
            onBlur={() => setErrors(p => ({ ...p, signerName: (cfg.requireName && !signerName.trim()) ? L('נא להזין שם מלא', 'Please enter your full name') : undefined }))}
            placeholder={L('שם מלא', 'Full name')} />
          {errors.signerName && <span style={styles.inlineErr}>{errors.signerName}</span>}
        </div>
        )}
        {cfg.showPhone && (
        <div style={{ ...styles.field, flex: 1, minWidth: 140 }}>
          <label style={styles.label}>{L('טלפון', 'Phone')} {cfg.requirePhone && <span style={styles.req}>*</span>}</label>
          <input className={`dfp-input${errors.signerPhone ? ' dfp-input-err' : ''}`} value={signerPhone}
            onChange={(e) => { setSignerPhone(e.target.value); setErrors(p => p.signerPhone ? { ...p, signerPhone: undefined } : p); }}
            onBlur={() => setErrors(p => ({ ...p, signerPhone: (cfg.requirePhone && !signerPhone.trim()) ? L('נא להזין טלפון', 'Please enter your phone') : undefined }))}
            dir="ltr" placeholder="050-0000000" />
          {errors.signerPhone && <span style={styles.inlineErr}>{errors.signerPhone}</span>}
        </div>
        )}
        {cfg.showEmail && (
        <div style={{ ...styles.field, flex: 1.5, minWidth: 180 }}>
          <label style={styles.label}>{L('אימייל', 'Email')} {cfg.requireEmail && <span style={styles.req}>*</span>}</label>
          <input className={`dfp-input${errors.signerEmail ? ' dfp-input-err' : ''}`} type="email" value={signerEmail}
            onChange={(e) => { setSignerEmail(e.target.value); setErrors(p => p.signerEmail ? { ...p, signerEmail: undefined } : p); }}
            onBlur={() => setErrors(p => ({ ...p, signerEmail: ((cfg.requireEmail && !signerEmail.trim()) ? L('נא להזין אימייל', 'Please enter your email') : (signerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signerEmail.trim())) ? L('כתובת אימייל לא תקינה', 'Invalid email address') : undefined) }))}
            dir="ltr" placeholder="name@example.com" />
          {errors.signerEmail && <span style={styles.inlineErr}>{errors.signerEmail}</span>}
        </div>
        )}
      </div>
      )}

      {cfg.customFields.length > 0 && (
        <div style={styles.contactCard}>
          {cfg.customFields.map(cf => renderCustomField(cf))}
        </div>
      )}

      {/* The document itself, with fillable fields overlaid on it */}
      {hasPdf && (
        <>
          <div style={styles.viewerToolbar}>
            <button type="button" onClick={() => setShowFullscreen(true)} style={styles.fullscreenBtn}>🖵 {L('צפה במסך מלא', 'View fullscreen')}</button>
            <div style={styles.zoomControls}>
              <button type="button" onClick={() => setZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)))} disabled={zoom <= 0.5} style={{ ...styles.zoomBtn, opacity: zoom <= 0.5 ? 0.4 : 1 }} title={L('הקטן', 'Zoom out')}>−</button>
              <span style={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom(z => Math.min(3, +(z + 0.25).toFixed(2)))} disabled={zoom >= 3} style={{ ...styles.zoomBtn, opacity: zoom >= 3 ? 0.4 : 1 }} title={L('הגדל', 'Zoom in')}>+</button>
              {zoom !== 1 && <button type="button" onClick={() => setZoom(1)} style={styles.zoomReset} title={L('התאם לרוחב', 'Fit width')}>⤢ {L('התאם', 'Fit')}</button>}
            </div>
          </div>
          <div ref={docViewerRef} style={styles.docViewer}>
            {pdfError ? (
              <div style={styles.center}>
                <div style={{ fontSize: 32 }}>📄</div>
                <p>{L('לא ניתן להציג את המסמך כאן.', 'Cannot display the document here.')}</p>
                <a href={doc.originalFileUrl} target="_blank" rel="noopener noreferrer" style={styles.linkBtn}>{L('פתח את המסמך', 'Open document')}</a>
              </div>
            ) : (
              // width:max-content + margin:0 auto centers the page when it fits, but when zoomed WIDER
              // than the box the auto-margins collapse to 0 so BOTH edges stay reachable by scrolling.
              // (The old flex `alignItems:center` kept re-centering the page, making the sides unreachable.)
              <div style={styles.docScrollInner}>
              <Document
                file={doc.originalFileUrl}
                options={PDF_OPTIONS}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(err) => { console.error('PDF load error:', err); setPdfError(true); }}
                loading={<div style={styles.center}><FaSpinner className="dfp-spin" /> {L('טוען מסמך...', 'Loading document...')}</div>}
              >
                {Array.from(new Array(numPages || 1), (el, index) => {
                  const pageNum = index + 1;
                  const pageFields = fields.filter(f => (f.page || 1) === pageNum);
                  return (
                    <div key={`page_${pageNum}`} style={{ position: 'relative', marginBottom: 16, boxShadow: '0 2px 12px rgba(2,6,23,.12)' }}>
                      <Page
                        pageNumber={pageNum}
                        width={pdfWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        onLoadSuccess={(page) => { if (pageNum === 1) setPdfIntrinsicWidth(page.originalWidth || page.width); }}
                      />
                      {pageFields.map((f) => (
                        <div key={f.fieldId} style={getFieldStyle(f)} title={labelFor(f)}>
                          {renderOverlayControl(f)}
                          {f.required && (
                            <span style={styles.reqDot}>*</span>
                          )}
                          {errors[f.fieldId] && <span style={styles.fieldErr}>{errors[f.fieldId]}</span>}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </Document>
              </div>
            )}
          </div>
        </>
      )}

      {/* Fallback: no PDF attached → render fields as a plain list so the form still works */}
      {!hasPdf && fields.length > 0 && (
        <div style={styles.contactCard}>
          {fields.map((f) => (
            <div key={f.fieldId} style={{ ...styles.field, flex: '1 1 100%' }}>
              {(f.fieldType || '').toLowerCase() !== 'checkbox' && (
                <label style={styles.label}>{labelFor(f)} {f.required && <span style={styles.req}>*</span>}</label>
              )}
              <div style={{ position: 'relative', minHeight: 44 }}>{renderOverlayControl(f)}</div>
              {errors[f.fieldId] && <span style={styles.inlineErr}>{errors[f.fieldId]}</span>}
            </div>
          ))}
        </div>
      )}

      <button type="submit" style={styles.submit} disabled={submitting}>
        {submitting ? <><FaSpinner className="dfp-spin" /> {L('שולח...', 'Submitting...')}</> : ((isRTL ? cfg.submitLabel : cfg.submitLabelEn) || L('שלח טופס', 'Submit form'))}
      </button>

      {/* Fullscreen document */}
      {showFullscreen && hasPdf && (
        <div style={styles.fsOverlay} onClick={() => setShowFullscreen(false)}>
          <div style={styles.fsContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.fsHeader}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{doc?.sourceTemplateName || doc?.documentName}</h3>
              <button type="button" onClick={() => setShowFullscreen(false)} style={styles.fsClose}>✕</button>
            </div>
            <div style={styles.fsBody}>
              <Document file={doc.originalFileUrl} options={PDF_OPTIONS} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                {Array.from(new Array(numPages || 1), (el, index) => {
                  const pageNum = index + 1;
                  const w = Math.min((typeof window !== 'undefined' ? window.innerWidth : 900) - 32, 900);
                  const pageFields = fields.filter(f => (f.page || 1) === pageNum);
                  const fsScale = w / (pdfIntrinsicWidth * 1.8);
                  return (
                    <div key={`fs_${pageNum}`} style={{ position: 'relative', marginBottom: 12 }}>
                      <Page pageNumber={pageNum} width={w} renderTextLayer={false} renderAnnotationLayer={false}
                        onLoadSuccess={(page) => { if (pageNum === 1) setPdfIntrinsicWidth(page.originalWidth || page.width); }} />
                      {pageFields.map((f) => (
                        <div key={f.fieldId} style={{
                          position: 'absolute',
                          left: `${(f.x || 0) * fsScale}px`,
                          top: `${(f.y || 0) * fsScale}px`,
                          width: `${(f.width || 120) * fsScale}px`,
                          height: `${(f.height || 32) * fsScale}px`,
                          zIndex: 10,
                        }} title={labelFor(f)}>
                          {renderOverlayControl(f)}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </Document>
            </div>
          </div>
        </div>
      )}

      {/* Signature capture modal */}
      {showSignatureModal && (
        <div style={styles.sigOverlay} onClick={closeSignatureModal}>
          <div style={styles.sigModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.sigHeader}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{L('חתימה', 'Signature')}</h3>
              <button type="button" onClick={closeSignatureModal} style={styles.fsClose}>✕</button>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: '#64748b' }}>
              {L('חתמו בתיבה למטה באמצעות העכבר או מסך המגע', 'Sign in the box below using your mouse or touchscreen')}
            </p>
            <div style={styles.sigCanvasWrap}>
              <SignatureCanvas
                ref={modalSigCanvas}
                penColor="#111827"
                backgroundColor="rgba(255,255,255,1)"
                canvasProps={{ style: { width: '100%', height: '220px', borderRadius: 10, touchAction: 'none' } }}
              />
            </div>
            <div style={styles.sigFooter}>
              <button type="button" onClick={clearSignaturePad} style={styles.sigClearBtn}>🗑️ {L('נקה', 'Clear')}</button>
              <button type="button" onClick={saveSignature} style={styles.sigSaveBtn}>✓ {L('שמור חתימה', 'Save signature')}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dfp-input { width: 100%; box-sizing: border-box; padding: 11px 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 15px; outline: none; transition: border-color .15s; background: #fff; }
        .dfp-input:focus { border-color: #2e6155; box-shadow: 0 0 0 3px rgba(46,97,85,.12); }
        .dfp-input-err { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220,38,38,.12) !important; }
        .dfp-spin { animation: dfpspin 1s linear infinite; }
        @keyframes dfpspin { to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg,#eef2ff,#f8fafc)', display: 'flex', flexDirection: 'column', alignItems: 'stretch' },
  headerBar: { background: '#fff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(2,6,23,.06)', position: 'sticky', top: 0, zIndex: 50 },
  headerInner: { maxWidth: 1000, margin: '0 auto', width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' },
  secureBadge: { fontSize: 12, color: '#0f766e', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 999, padding: '4px 10px', whiteSpace: 'nowrap' },
  content: { maxWidth: 1000, width: '100%', margin: '0 auto', padding: '18px 16px 40px', boxSizing: 'border-box' },
  hint: { textAlign: 'center', color: '#475569', fontSize: 14, marginBottom: 14 },
  contactCard: { background: '#fff', borderRadius: 14, boxShadow: '0 6px 24px rgba(2,6,23,.08)', padding: '16px', display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#334155' },
  req: { color: '#dc2626' },
  reqDot: { position: 'absolute', top: -8, insetInlineEnd: -6, color: '#dc2626', fontWeight: 800, fontSize: 16 },
  errorBanner: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 12, padding: '12px 16px', marginBottom: 14, fontSize: 13.5 },
  errorList: { margin: '6px 0 0', paddingInlineStart: 20 },
  inlineErr: { color: '#dc2626', fontSize: 12, marginTop: 4, fontWeight: 600 },
  fieldErr: { position: 'absolute', top: '100%', insetInlineStart: 0, marginTop: 2, background: '#dc2626', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', zIndex: 20, boxShadow: '0 2px 6px rgba(220,38,38,.35)' },
  // Block (not flex-center) + horizontal scroll so a zoomed-in page can be panned to both edges.
  docViewer: { display: 'block', background: '#e2e8f0', borderRadius: 14, padding: 16, overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' },
  docScrollInner: { width: 'max-content', margin: '0 auto' },
  viewerToolbar: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 },
  zoomControls: { display: 'flex', alignItems: 'center', gap: 6 },
  zoomBtn: { width: 36, height: 36, borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', fontSize: 20, lineHeight: 1, cursor: 'pointer', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  zoomLabel: { minWidth: 48, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#334155' },
  zoomReset: { height: 36, padding: '0 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#0f172a' },
  fullscreenBtn: { padding: '8px 14px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  linkBtn: { display: 'inline-block', marginTop: 8, padding: '10px 16px', background: '#2e6155', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600 },
  submit: { width: '100%', marginTop: 20, padding: '14px 16px', background: 'linear-gradient(135deg,#2e6155,#34d399)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  center: { textAlign: 'center', padding: '20px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  centerWrap: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  centerCard: { width: '100%', maxWidth: 520, background: '#fff', borderRadius: 18, boxShadow: '0 10px 40px rgba(2,6,23,.12)', padding: '28px 24px' },
  footer: { padding: '16px', textAlign: 'center', fontSize: 12, color: '#94a3b8' },
  footerLink: { color: '#64748b', textDecoration: 'none', fontWeight: 500 },
  fsOverlay: { position: 'fixed', inset: 0, background: 'rgba(2,6,23,.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 },
  fsContent: { background: '#f1f5f9', borderRadius: 12, width: '100%', maxWidth: 960, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  fsHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fff', borderBottom: '1px solid #e5e7eb' },
  fsClose: { background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: '#334155' },
  fsBody: { overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  sigOverlay: { position: 'fixed', inset: 0, background: 'rgba(2,6,23,.75)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  sigModal: { background: '#fff', borderRadius: 14, width: '100%', maxWidth: 520, padding: 18, boxShadow: '0 20px 60px rgba(2,6,23,.35)' },
  sigHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sigCanvasWrap: { border: '2px dashed #cbd5e1', borderRadius: 10, background: '#fff', overflow: 'hidden' },
  sigFooter: { display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 14 },
  sigClearBtn: { padding: '10px 16px', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  sigSaveBtn: { padding: '10px 18px', background: 'linear-gradient(135deg,#2e6155,#34d399)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
};

export default DocumentFormPublic;

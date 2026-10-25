'use client';

/**
 * Accessibility toolbar (Israeli Standard 5568 / WCAG 2.1 AA aid).
 * It supplements — never replaces — accessible markup: the site itself must be usable without it.
 * Preferences persist in localStorage (`gambot_a11y`, an essential/functional entry) and are applied as
 * classes on <html>; the matching CSS lives in globals.css.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Compliance.module.css';

const KEY = 'gambot_a11y';
const DEFAULTS = { fontStep: 0, contrast: false, gray: false, links: false, font: false, noAnim: false, cursor: false, spacing: false };
const MAX_STEP = 4;

const T = {
  he: {
    open: 'פתיחת תפריט נגישות', close: 'סגירת תפריט נגישות', title: 'נגישות',
    bigger: 'הגדלת טקסט', smaller: 'הקטנת טקסט', contrast: 'ניגודיות גבוהה', gray: 'גווני אפור',
    links: 'הדגשת קישורים', font: 'גופן קריא', noAnim: 'עצירת אנימציות', cursor: 'סמן גדול', spacing: 'ריווח טקסט',
    reset: 'איפוס הגדרות', statement: 'הצהרת נגישות', level: 'גודל טקסט',
  },
  en: {
    open: 'Open accessibility menu', close: 'Close accessibility menu', title: 'Accessibility',
    bigger: 'Increase text', smaller: 'Decrease text', contrast: 'High contrast', gray: 'Grayscale',
    links: 'Highlight links', font: 'Readable font', noAnim: 'Stop animations', cursor: 'Large cursor', spacing: 'Text spacing',
    reset: 'Reset settings', statement: 'Accessibility statement', level: 'Text size',
  },
};

function apply(p) {
  const el = document.documentElement;
  el.style.fontSize = p.fontStep ? `${100 + p.fontStep * 12.5}%` : '';
  el.classList.toggle('a11y-contrast', p.contrast);
  el.classList.toggle('a11y-gray', p.gray);
  el.classList.toggle('a11y-links', p.links);
  el.classList.toggle('a11y-font', p.font);
  el.classList.toggle('a11y-noanim', p.noAnim);
  el.classList.toggle('a11y-cursor', p.cursor);
  el.classList.toggle('a11y-spacing', p.spacing);
}

export default function AccessibilityToolbar() {
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage === 'en' ? 'en' : 'he';
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULTS);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved) { const merged = { ...DEFAULTS, ...saved }; setPrefs(merged); apply(merged); }
    } catch { /* ignore */ }
  }, []);

  const update = useCallback((patch) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      apply(next);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const reset = () => update(DEFAULTS);

  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector('button')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const toggles = [
    ['contrast', t.contrast], ['gray', t.gray], ['links', t.links], ['font', t.font],
    ['noAnim', t.noAnim], ['cursor', t.cursor], ['spacing', t.spacing],
  ];

  return (
    <>
      <button
        type="button"
        ref={btnRef}
        className={styles.a11yBtn}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        aria-controls="gb-a11y-panel"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a2 2 0 110 4 2 2 0 010-4zm8 6.5v2l-5.5 1v2.2l1.9 6.8-1.9.5L12.5 15h-1l-2 6-1.9-.5 1.9-6.8v-2.2L4 10.5v-2l6 1h4l6-1z" /></svg>
      </button>

      {open && (
        <div
          id="gb-a11y-panel"
          ref={panelRef}
          className={styles.a11yPanel}
          role="dialog"
          aria-modal="false"
          aria-labelledby="gb-a11y-title"
          dir={lang === 'he' ? 'rtl' : 'ltr'}
          lang={lang}
        >
          <div className={styles.a11yHead}>
            <h2 id="gb-a11y-title" className={styles.a11yTitle}>{t.title}</h2>
            <button type="button" className={styles.a11yClose} onClick={() => { setOpen(false); btnRef.current?.focus(); }} aria-label={t.close}>
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className={styles.a11yGrid}>
            <button type="button" className={styles.a11yOpt} onClick={() => update({ fontStep: Math.min(MAX_STEP, prefs.fontStep + 1) })} disabled={prefs.fontStep >= MAX_STEP}>
              A+ <span style={{ display: 'block', fontWeight: 400 }}>{t.bigger}</span>
            </button>
            <button type="button" className={styles.a11yOpt} onClick={() => update({ fontStep: Math.max(0, prefs.fontStep - 1) })} disabled={prefs.fontStep <= 0}>
              A- <span style={{ display: 'block', fontWeight: 400 }}>{t.smaller}</span>
            </button>
            {toggles.map(([key, label]) => (
              <button key={key} type="button" className={styles.a11yOpt} aria-pressed={!!prefs[key]} onClick={() => update({ [key]: !prefs[key] })}>
                {label}
              </button>
            ))}
          </div>

          <p role="status" className="gb-sr-only" aria-live="polite">{t.level}: {100 + prefs.fontStep * 12.5}%</p>

          <div className={styles.a11yFoot}>
            <Link href="/accessibility/" onClick={() => setOpen(false)}>{t.statement}</Link>
            <button type="button" className={styles.a11yReset} onClick={reset}>{t.reset}</button>
          </div>
        </div>
      )}
    </>
  );
}

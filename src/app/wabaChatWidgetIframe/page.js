'use client';

/**
 * Gambot WhatsApp chat widget (rendered inside an <iframe> on customer sites AND on gambot.co.il itself).
 *
 * Configured only through query-string params (see `cfg` below) so the embed snippet produced by the
 * Widget Generator stays a tiny static script. The page reports its real rendered size to the parent
 * via postMessage({ type: 'GAMBOT_WIDGET_SIZE', width, height }) so the iframe never covers page content.
 *
 * Accessibility (WCAG 2.1 AA oriented):
 *  - launcher is a real <button> with aria-label / aria-expanded / aria-controls
 *  - the panel is role="dialog" (non-modal), Escape closes it and focus returns to the launcher
 *  - "Open WhatsApp" is a real link (works without JS popups, shows the new-tab hint to screen readers)
 *  - text/background pairs are auto-corrected to >= 4.5:1 contrast
 *  - prefers-reduced-motion disables every animation
 *  - visible keyboard focus rings, 44px minimum touch targets
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const ANIMATIONS = {
  float: `
    @keyframes gb-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .gb-btn.anim-float { animation: gb-float 3s ease-in-out infinite; }
  `,
  pulse: `
    @keyframes gb-ring { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(var(--gb-ring, 1.5)); opacity: 0; } }
    .gb-btn.anim-pulse::before, .gb-btn.anim-pulse::after {
      content: ''; position: absolute; inset: 0; border-radius: 50%; background: inherit;
      animation: gb-ring 2.2s ease-out infinite; z-index: -1;
    }
    .gb-btn.anim-pulse::after { animation-delay: 1s; }
  `,
  bounce: `
    @keyframes gb-bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-14px); } 60% { transform: translateY(-7px); } }
    .gb-btn.anim-bounce { animation: gb-bounce 2.5s ease infinite; }
  `,
  shake: `
    @keyframes gb-shake { 0%, 100% { transform: rotate(0); } 10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); } 20%, 40%, 60%, 80% { transform: rotate(10deg); } }
    .gb-btn.anim-shake { animation: gb-shake 0.7s ease-in-out 3, none; }
  `,
  none: '',
};

const FONT_STACKS = {
  Arial: 'Arial, Helvetica, sans-serif',
  'Courier New': '"Courier New", Courier, monospace',
  Georgia: 'Georgia, serif',
  Tahoma: 'Tahoma, Geneva, sans-serif',
  Verdana: 'Verdana, Geneva, sans-serif',
  'Trebuchet MS': '"Trebuchet MS", Helvetica, sans-serif',
  'Comic Sans MS': '"Comic Sans MS", cursive, sans-serif',
  'Times New Roman': '"Times New Roman", Times, serif',
  'Lucida Console': '"Lucida Console", Monaco, monospace',
  'Segoe UI': '"Segoe UI", Tahoma, Arial, sans-serif',
  Outfit: 'Outfit, "Segoe UI", Arial, sans-serif',
  'Sour Gummy': '"Sour Gummy", "Segoe UI", Arial, sans-serif',
};
const fontStack = (name) => FONT_STACKS[name] || FONT_STACKS.Arial;

const STRINGS = {
  he: {
    title: 'צ׳אט ישיר בוואטסאפ',
    online: 'זמינים עכשיו',
    offline: 'לא זמינים כרגע — השאירו הודעה ונחזור אליכם',
    welcome: 'שלום! איך נוכל לעזור?',
    bubble: 'דברו איתנו',
    cta: 'פתח שיחה בוואטסאפ',
    open: 'פתיחת צ׳אט',
    close: 'סגירת צ׳אט',
    dismiss: 'הסתרת ההודעה',
    newTab: '(נפתח בחלון חדש)',
    quick: 'שאלות נפוצות',
    powered: 'מופעל על ידי',
  },
  en: {
    title: 'Chat on WhatsApp',
    online: 'Available now',
    offline: "We're offline — leave a message and we'll get back to you",
    welcome: 'Hi! How can we help?',
    bubble: 'Chat with us',
    cta: 'Start WhatsApp chat',
    open: 'Open chat',
    close: 'Close chat',
    dismiss: 'Dismiss message',
    newTab: '(opens in a new window)',
    quick: 'Quick questions',
    powered: 'Powered by',
  },
};

/* ── colour helpers (contrast guard) ─────────────────────────────── */
function parseHex(hex) {
  if (typeof hex !== 'string') return null;
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function luminance(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
/** Keep `fg` if it has >= 4.5:1 against `bg`, otherwise fall back to black/white (whichever reads better). */
function readable(fg, bg) {
  const f = parseHex(fg);
  const b = parseHex(bg);
  if (!b) return fg;
  if (f && contrast(f, b) >= 4.5) return fg;
  return contrast([255, 255, 255], b) >= contrast([0, 0, 0], b) ? '#ffffff' : '#111111';
}
const safeColor = (v, fallback) => (parseHex(v) ? (v.startsWith('#') ? v : `#${v}`) : fallback);

/* ── business hours ─────────────────────────────────────────────── */
function isWithinHours({ from, to, days, tz }) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz || 'Asia/Jerusalem', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    const hh = parseInt(get('hour'), 10) % 24;
    const mm = parseInt(get('minute'), 10);
    const nowMin = hh * 60 + mm;
    const toMin = (s) => { const [h, m] = String(s || '0:0').split(':'); return (parseInt(h, 10) || 0) * 60 + (parseInt(m, 10) || 0); };
    const allowedDays = String(days || '0,1,2,3,4').split(',').map((d) => parseInt(d, 10));
    if (!allowedDays.includes(dayIdx)) return false;
    const a = toMin(from || '09:00');
    const b = toMin(to || '18:00');
    return a <= b ? nowMin >= a && nowMin < b : nowMin >= a || nowMin < b;
  } catch {
    return true;
  }
}

const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';
const CHAT_PATH = 'M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm-3 11H7v-2h10v2zm0-3H7V8h10v2z';
const HEADSET_PATH = 'M12 1a9 9 0 00-9 9v7a3 3 0 003 3h3v-8H5v-2a7 7 0 0114 0v2h-4v8h4v1h-6v2h6a3 3 0 003-3V10a9 9 0 00-9-9z';
const ICONS = { whatsapp: WA_PATH, chatbubble: CHAT_PATH, headset: HEADSET_PATH, other: HEADSET_PATH, ci1: CHAT_PATH };

function WidgetApp() {
  const sp = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [visible, setVisible] = useState(false);
  const [pageInfo, setPageInfo] = useState({ title: '', url: '' });
  const [online, setOnline] = useState(true);
  const rootRef = useRef(null);
  const launcherRef = useRef(null);
  const ctaRef = useRef(null);
  const openedByUser = useRef(false);

  const cfg = useMemo(() => {
    const g = (k, d = '') => sp.get(k) || d;
    const browserLang = typeof navigator !== 'undefined' ? (navigator.language || '').toLowerCase() : 'en';
    const lang = ['he', 'en'].includes(g('lang')) ? g('lang') : (browserLang.startsWith('he') ? 'he' : 'en');
    const s = STRINGS[lang];
    const brandColor = safeColor(g('brandColor'), '#2e6155');
    const ctaBg = safeColor(g('openFormButtonColor'), '#128c7e');
    const panelBg = safeColor(g('openFormBodyBackgroundColor'), '#ffffff');
    return {
      lang,
      s,
      dir: lang === 'he' ? 'rtl' : 'ltr',
      brandColor,
      iconColor: readable(safeColor(g('iconColor'), '#ffffff'), brandColor),
      phoneNumber: g('phoneNumber').replace(/[^\d]/g, ''),
      welcomeText: g('welcomeText', s.welcome),
      chatBubbleText: sp.has('chatBubbleText') ? g('chatBubbleText') : s.bubble,
      headerTitle: g('headerTitle', g('brandName') && g('brandName') !== 'Your Brand' ? g('brandName') : s.title),
      headerSubtitle: g('headerSubtitle'),
      openFormButtonText: g('openFormButtonText', s.cta),
      ctaBg,
      ctaText: readable(safeColor(g('openFormButtonTextColor'), '#ffffff'), ctaBg),
      panelBg,
      borderColor: safeColor(g('openFormBodyBorderLineColor'), '#25d366'),
      bubbleTextColor: readable(safeColor(g('chatBubbleTextColor'), '#1a1a1a'), '#ffffff'),
      welcomeTextColor: readable(safeColor(g('welcomeTextColor'), '#1a1a1a'), '#f1f3f4'),
      prefilledMessage: g('prefilledMessage'),
      position: g('position', 'right') === 'left' ? 'left' : 'right',
      animationStyle: ANIMATIONS[g('animationStyle')] !== undefined ? g('animationStyle') : 'float',
      openWidgetByDefault: g('openWidgetByDefault') === 'true',
      chatButton: ICONS[g('chatButton')] ? g('chatButton') : 'whatsapp',
      size: ['sm', 'md', 'lg'].includes(g('size')) ? g('size') : 'md',
      showDelaySec: Math.max(0, Math.min(120, parseInt(g('showDelaySec', '0'), 10) || 0)),
      quickReplies: g('quickReplies').split('|').map((q) => q.trim()).filter(Boolean).slice(0, 4),
      hoursEnabled: g('hoursEnabled') === 'true',
      hoursFrom: g('hoursFrom', '09:00'),
      hoursTo: g('hoursTo', '18:00'),
      hoursDays: g('hoursDays', '0,1,2,3,4'),
      tz: g('tz', 'Asia/Jerusalem'),
      offlineText: g('offlineText', s.offline),
      showPoweredBy: true, // "Powered by Gambot" is always shown (cannot be turned off, also for older embeds)
      iconOnly: g('iconOnly') === 'true',
      preview: g('_preview') === '1',
      fontMain: fontStack(g('font')),
      fontBubble: fontStack(g('chatBubbleTextFont') || g('font')),
      fontWelcome: fontStack(g('welcomeTextFont') || g('font')),
      fontCta: fontStack(g('openFormButtonFont') || g('font')),
    };
  }, [sp]);

  const isRight = cfg.position === 'right';
  const btnSize = { sm: 52, md: 62, lg: 74 }[cfg.size];
  // The iframe is cropped to the widget box, so the pulse ring may only grow as far as the padding allows.
  const PAD = 24;
  const ringScale = ((btnSize / 2 + PAD - 2) / (btnSize / 2)).toFixed(2);

  /* business hours (re-evaluated every minute) */
  useEffect(() => {
    if (!cfg.hoursEnabled) { setOnline(true); return undefined; }
    const tick = () => setOnline(isWithinHours({ from: cfg.hoursFrom, to: cfg.hoursTo, days: cfg.hoursDays, tz: cfg.tz }));
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [cfg.hoursEnabled, cfg.hoursFrom, cfg.hoursTo, cfg.hoursDays, cfg.tz]);

  /* delayed appearance + default-open */
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      if (cfg.openWidgetByDefault) setIsOpen(true);
    }, cfg.showDelaySec * 1000);
    return () => clearTimeout(t);
  }, [cfg.showDelaySec, cfg.openWidgetByDefault]);

  /* page info from the host page */
  useEffect(() => {
    document.body.style.cssText = 'margin:0;padding:0;overflow:hidden;background:transparent;';
    document.documentElement.style.cssText = 'margin:0;padding:0;overflow:hidden;background:transparent;';
    const onMessage = (e) => {
      if (e.data?.type === 'PAGE_INFO') setPageInfo({ title: e.data.title || '', url: e.data.url || '' });
    };
    window.addEventListener('message', onMessage);
    try { window.parent.postMessage('REQUEST_PAGE_TITLE', '*'); } catch { /* standalone */ }
    return () => window.removeEventListener('message', onMessage);
  }, []);

  /* report real rendered size to the parent so the iframe hugs the widget */
  const reportSize = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = visible ? Math.ceil(r.width) : 0;
    const height = visible ? Math.ceil(r.height) : 0;
    try { window.parent.postMessage({ type: 'GAMBOT_WIDGET_SIZE', width: `${width}px`, height: `${height}px` }, '*'); } catch { /* standalone */ }
  }, [visible]);

  useEffect(() => {
    reportSize();
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(reportSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reportSize, isOpen, bubbleVisible, cfg]);

  /* move focus into the panel when the visitor opens it; Escape closes + restores focus */
  useEffect(() => {
    if (isOpen && openedByUser.current) ctaRef.current?.focus();
  }, [isOpen]);

  /* Tell the generator's live preview when the visitor opens/closes the panel, so the preview can keep that state
     across the reloads it does after every setting change. Only after a real interaction (not on first load). */
  const interacted = useRef(false);
  useEffect(() => {
    if (!cfg.preview || !interacted.current) return;
    try { window.parent.postMessage({ type: 'GAMBOT_WIDGET_STATE', open: isOpen }, '*'); } catch { /* standalone */ }
  }, [isOpen, cfg.preview]);

  const close = useCallback(() => {
    interacted.current = true;
    setIsOpen(false);
    launcherRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  const toggle = () => { openedByUser.current = true; interacted.current = true; setIsOpen((p) => !p); };

  const buildUrl = (message) => {
    let msg = message ?? cfg.prefilledMessage ?? '';
    msg = msg.replace(/\{\{page_link\}\}/g, pageInfo.url || '').replace(/\{\{page_title\}\}/g, pageInfo.title || '');
    return `https://wa.me/${cfg.phoneNumber}${msg ? `?text=${encodeURIComponent(msg.trim())}` : ''}`;
  };

  const showTeaser = !isOpen && bubbleVisible && !!cfg.chatBubbleText && !cfg.iconOnly;
  const statusText = online ? cfg.s.online : cfg.offlineText;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: transparent !important; overflow: hidden !important; }
        main { padding: 0 !important; margin: 0 !important; min-height: 0 !important; }
        button, a { font-family: inherit; }
        :focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; }

        .gb-root {
          position: fixed; bottom: 0; ${isRight ? 'right: 0;' : 'left: 0;'}
          display: inline-flex; flex-direction: column; gap: 12px; padding: ${PAD}px; /* room for the pulse rings + button shadow, so they are never cut by the iframe edge */
          align-items: ${isRight ? 'flex-end' : 'flex-start'};
          font-family: ${cfg.fontMain};
          visibility: ${visible ? 'visible' : 'hidden'};
        }

        /* ── Panel ── */
        .gb-popup {
          width: 288px; /* fixed (not vw-based) so the iframe can size itself from the content */
          border-radius: 20px; overflow: hidden;
          background: ${cfg.panelBg};
          border: 1px solid ${cfg.borderColor}66;
          box-shadow: 0 18px 50px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.08);
          transform-origin: bottom ${isRight ? 'right' : 'left'};
          animation: gb-pop .28s cubic-bezier(.2,.9,.3,1.2);
        }
        @keyframes gb-pop { from { opacity: 0; transform: translateY(12px) scale(.94); } to { opacity: 1; transform: none; } }
        .gb-head {
          background: linear-gradient(135deg, ${cfg.brandColor}, ${cfg.brandColor}d9);
          color: ${readable('#ffffff', cfg.brandColor)};
          padding: 16px; display: flex; align-items: center; gap: 12px;
        }
        .gb-avatar {
          width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
          background: rgba(255,255,255,.22); display: grid; place-items: center;
        }
        .gb-avatar svg { width: 26px; height: 26px; fill: currentColor; }
        .gb-head-text { flex: 1; min-width: 0; }
        .gb-title { font-size: 15px; font-weight: 700; line-height: 1.25; }
        .gb-sub { font-size: 12px; margin-top: 3px; display: flex; align-items: flex-start; gap: 6px; opacity: .95; line-height: 1.35; }
        .gb-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; background: ${online ? '#69f0ae' : '#ffd54f'}; }
        .gb-x {
          width: 44px; height: 44px; margin: -8px; border-radius: 50%; border: 0; flex-shrink: 0;
          background: transparent; color: inherit; font-size: 20px; line-height: 1; display: grid; place-items: center;
        }
        .gb-x:hover { background: rgba(255,255,255,.2); }
        .gb-head :focus-visible { outline-color: #fff; }

        .gb-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .gb-welcome {
          background: #f1f3f4; color: ${cfg.welcomeTextColor}; font-family: ${cfg.fontWelcome};
          border-radius: 14px ${isRight ? '14px 14px 4px' : '14px 4px 14px'}; padding: 11px 14px; font-size: 14px; line-height: 1.55;
        }
        .gb-quick-label { font-size: 12px; font-weight: 600; color: #4a5568; }
        .gb-quick { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; }
        .gb-quick a {
          display: inline-flex; align-items: center; min-height: 36px; padding: 6px 14px; border-radius: 999px;
          border: 1.5px solid ${cfg.ctaBg}; color: ${readable(cfg.ctaBg, cfg.panelBg)}; background: transparent;
          font-size: 13px; font-weight: 600; text-decoration: none; transition: background .15s, color .15s;
        }
        .gb-quick a:hover { background: ${cfg.ctaBg}; color: ${cfg.ctaText}; }
        .gb-cta {
          display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; padding: 12px 18px;
          border-radius: 999px; text-decoration: none; background: ${cfg.ctaBg}; color: ${cfg.ctaText};
          font-family: ${cfg.fontCta}; font-size: 15px; font-weight: 700;
          box-shadow: 0 6px 16px ${cfg.ctaBg}55; transition: transform .15s, box-shadow .15s;
        }
        .gb-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 22px ${cfg.ctaBg}77; }
        .gb-cta svg { width: 20px; height: 20px; fill: currentColor; flex-shrink: 0; }
        .gb-powered { text-align: center; font-size: 11px; color: #5f6368; }
        .gb-powered a { color: #1b5e50; font-weight: 700; text-decoration: underline; }

        /* ── Launcher row ── */
        .gb-row { display: flex; align-items: center; gap: 8px; flex-direction: ${isRight ? 'row' : 'row-reverse'}; }
        .gb-teaser {
          background: #fff; color: ${cfg.bubbleTextColor}; font-family: ${cfg.fontBubble};
          border: 2px solid ${cfg.borderColor}; border-radius: 14px; min-height: 44px; padding: 8px 16px;
          font-size: 14px; font-weight: 600; white-space: nowrap; cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,.12); animation: gb-fade .4s ease both;
        }
        .gb-teaser:hover { transform: scale(1.03); }
        @keyframes gb-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .gb-teaser-x {
          width: 44px; height: 44px; border: 0; border-radius: 50%; background: transparent; color: #444;
          font-size: 22px; line-height: 1; cursor: pointer; display: grid; place-items: center;
        }
        .gb-teaser-x:hover { background: rgba(0,0,0,.08); }
        .gb-btn {
          position: relative; width: ${btnSize}px; height: ${btnSize}px; border-radius: 50%; border: 0; flex-shrink: 0;
          background: ${cfg.brandColor}; color: ${cfg.iconColor}; cursor: pointer; display: grid; place-items: center;
          box-shadow: 0 6px 16px ${cfg.brandColor}77; transition: transform .2s, box-shadow .2s;
          --gb-ring: ${ringScale};
        }
        .gb-btn:hover { transform: scale(1.07) !important; animation: none !important; }
        /* While the panel is open the launcher (now the close button) must stay perfectly still. */
        .gb-btn.is-open, .gb-btn.is-open::before, .gb-btn.is-open::after { animation: none !important; }
        .gb-btn.is-open::before, .gb-btn.is-open::after { display: none; }
        .gb-btn svg { width: ${Math.round(btnSize * 0.52)}px; height: ${Math.round(btnSize * 0.52)}px; fill: currentColor; }

        ${ANIMATIONS[cfg.animationStyle]}

        ${cfg.preview ? '.gb-popup, .gb-teaser { animation: none !important; } /* editor preview reloads on every edit - no re-pop */' : ''}

        @media (prefers-reduced-motion: reduce) {
          .gb-btn, .gb-btn::before, .gb-btn::after, .gb-popup, .gb-teaser, .gb-cta, .gb-quick a { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Layout is always LTR so left/right are physical: with dir="rtl" on the root, flex-end meant LEFT and the
          launcher jumped sideways when the panel opened. The text direction is applied to the content below. */}
      <div className="gb-root" ref={rootRef} dir="ltr" lang={cfg.lang}>
        {isOpen && (
          <div className="gb-popup" dir={cfg.dir} role="dialog" aria-modal="false" aria-labelledby="gb-title" id="gb-panel">
            <div className="gb-head">
              <div className="gb-avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d={ICONS[cfg.chatButton]} /></svg>
              </div>
              <div className="gb-head-text">
                <div className="gb-title" id="gb-title">{cfg.headerTitle}</div>
                <div className="gb-sub" role="status">
                  <span className="gb-dot" aria-hidden="true" />
                  <span>{cfg.headerSubtitle && online ? `${cfg.headerSubtitle} · ${statusText}` : statusText}</span>
                </div>
              </div>
              <button type="button" className="gb-x" onClick={close} aria-label={cfg.s.close}>
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <div className="gb-body">
              <p className="gb-welcome">{cfg.welcomeText}</p>

              {cfg.quickReplies.length > 0 && (
                <div>
                  <p className="gb-quick-label" id="gb-quick-label">{cfg.s.quick}</p>
                  <ul className="gb-quick" aria-labelledby="gb-quick-label" style={{ marginTop: 8 }}>
                    {cfg.quickReplies.map((q) => (
                      <li key={q}>
                        <a href={buildUrl(q)} target="_blank" rel="noopener noreferrer">{q}<span className="sr" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}> {cfg.s.newTab}</span></a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a ref={ctaRef} className="gb-cta" href={buildUrl()} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={WA_PATH} /></svg>
                <span>{cfg.openFormButtonText}</span>
                <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{cfg.s.newTab}</span>
              </a>

              {cfg.showPoweredBy && (
                <p className="gb-powered">
                  {cfg.s.powered} <a href="https://gambot.co.il" target="_blank" rel="noopener noreferrer">Gambot</a>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="gb-row">
          {showTeaser && (
            <>
              <button type="button" className="gb-teaser" dir={cfg.dir} onClick={toggle}>{cfg.chatBubbleText}</button>
              <button type="button" className="gb-teaser-x" onClick={() => setBubbleVisible(false)} aria-label={cfg.s.dismiss}>
                <span aria-hidden="true">×</span>
              </button>
            </>
          )}
          <button
            type="button"
            ref={launcherRef}
            className={`gb-btn anim-${cfg.animationStyle}${isOpen ? ' is-open' : ''}`}
            onClick={toggle}
            aria-label={isOpen ? cfg.s.close : (cfg.chatBubbleText || cfg.s.open)}
            aria-expanded={isOpen}
            aria-controls="gb-panel"
            aria-haspopup="dialog"
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[cfg.chatButton]} /></svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WidgetApp />
    </Suspense>
  );
}

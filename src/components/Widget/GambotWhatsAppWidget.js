'use client';

/**
 * The "Gambot Demo" WhatsApp chat widget on gambot.co.il.
 *
 * This is the SAME widget our customers get from the Widget Generator (the /wabaChatWidgetIframe page),
 * mounted with the Gambot demo configuration — so the main site always dogfoods the real product.
 * It sets no cookies and loads no third-party trackers, so it needs no cookie consent.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

const GAMBOT_WA_NUMBER = '97233768997';

const COPY = {
  he: {
    title: 'גמבוט — צ׳אט בוואטסאפ',
    subtitle: 'צוות גמבוט',
    welcome: 'היי 👋 אני מצוות גמבוט. רוצים הדגמה, מחירים או עזרה בהקמת בוט? כתבו לנו בוואטסאפ ונחזור במהירות.',
    bubble: 'דברו איתנו בוואטסאפ',
    cta: 'פתח שיחה בוואטסאפ',
    prefilled: 'שלום, הגעתי מהאתר של גמבוט ({{page_title}}) ואשמח לשמוע פרטים.',
    quick: 'אשמח להדגמה|מחירים ותוכניות|עזרה בהקמת בוט',
    iframeTitle: 'צ׳אט וואטסאפ עם צוות גמבוט',
  },
  en: {
    title: 'Gambot — WhatsApp chat',
    subtitle: 'Gambot team',
    welcome: "Hi 👋 I'm from the Gambot team. Want a demo, pricing or help building a bot? Message us on WhatsApp and we'll reply fast.",
    bubble: 'Chat with us on WhatsApp',
    cta: 'Start WhatsApp chat',
    prefilled: "Hi, I'm coming from the Gambot website ({{page_title}}) and I'd like to know more.",
    quick: 'I want a demo|Pricing & plans|Help building a bot',
    iframeTitle: 'WhatsApp chat with the Gambot team',
  },
};

// Pages that must stay clean (signer-facing documents, the widget iframe itself, onboarding funnels).
const HIDE_ON = /(?:^|\/)(form|esig|esignature|wabaChatWidgetIframe|complete-waba|oauth-success|shared-token|wa-connect)(?:\/|$)/i;

export default function GambotWhatsAppWidget() {
  const pathname = usePathname() || '';
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage === 'en' ? 'en' : 'he';
  const c = COPY[lang];
  const iframeRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState({ width: '1px', height: '1px' });

  // Mount only after the page has loaded + the browser is idle, so the widget never hurts LCP/INP.
  useEffect(() => {
    let cancelled = false;
    const start = () => {
      const run = () => { if (!cancelled) setMounted(true); };
      if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 3000 });
      else setTimeout(run, 1500);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => { cancelled = true; window.removeEventListener('load', start); };
  }, []);

  const src = useMemo(() => {
    const p = new URLSearchParams({
      lang,
      phoneNumber: GAMBOT_WA_NUMBER,
      brandColor: '#075e54',
      openFormButtonColor: '#0b7261',
      openFormButtonTextColor: '#ffffff',
      openFormBodyBorderLineColor: '#0b7261',
      iconColor: '#ffffff',
      chatBubbleText: c.bubble,
      headerTitle: c.title,
      headerSubtitle: c.subtitle,
      welcomeText: c.welcome,
      openFormButtonText: c.cta,
      prefilledMessage: c.prefilled,
      quickReplies: c.quick,
      animationStyle: 'pulse',
      position: 'right',
      chatButton: 'whatsapp',
      showDelaySec: '3',
      size: 'md',
      font: 'Arial',
    });
    return `/wabaChatWidgetIframe?${p.toString()}`;
  }, [lang, c]);

  // The iframe reports its real size; answer its request for the host page title/url.
  useEffect(() => {
    if (!mounted) return undefined;
    const onMessage = (e) => {
      const frame = iframeRef.current;
      if (!frame || e.source !== frame.contentWindow || e.origin !== window.location.origin) return;
      if (e.data?.type === 'GAMBOT_WIDGET_SIZE') {
        setSize({ width: e.data.width || '1px', height: e.data.height || '1px' });
      } else if (e.data === 'REQUEST_PAGE_TITLE') {
        frame.contentWindow.postMessage({ type: 'PAGE_INFO', title: document.title, url: window.location.href }, window.location.origin);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [mounted]);

  if (!mounted || HIDE_ON.test(pathname)) return null;

  // Never display:none the iframe — a non-rendered frame can't measure itself. Collapse it to 1px instead.
  const hidden = parseInt(size.width, 10) <= 1 || parseInt(size.height, 10) <= 1;
  return (
    <iframe
      ref={iframeRef}
      key={lang}
      src={src}
      title={c.iframeTitle}
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: hidden ? '1px' : size.width,
        height: hidden ? '1px' : size.height,
        maxWidth: '100vw',
        maxHeight: '100vh',
        border: 0,
        background: 'transparent',
        colorScheme: 'light',
        zIndex: 9998,
        pointerEvents: hidden ? 'none' : 'auto',
        opacity: hidden ? 0 : 1,
      }}
    />
  );
}

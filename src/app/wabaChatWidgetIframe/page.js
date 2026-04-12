'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const ANIMATIONS = {
  float: `
    @keyframes gb-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .gb-btn.anim-float { animation: gb-float 3s ease-in-out infinite; }
  `,
  pulse: `
    @keyframes gb-ring {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    .gb-btn.anim-pulse::before,
    .gb-btn.anim-pulse::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: inherit;
      animation: gb-ring 2s ease-out infinite;
      z-index: -1;
    }
    .gb-btn.anim-pulse::after { animation-delay: 0.8s; }
  `,
  bounce: `
    @keyframes gb-bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-18px); }
      60% { transform: translateY(-9px); }
    }
    .gb-btn.anim-bounce { animation: gb-bounce 2.5s ease infinite; }
  `,
  shake: `
    @keyframes gb-shake {
      0%, 100% { transform: rotate(0deg); }
      10%, 30%, 50%, 70%, 90% { transform: rotate(-12deg); }
      20%, 40%, 60%, 80% { transform: rotate(12deg); }
    }
    @keyframes gb-shake-pause {
      0%, 15% { animation-timing-function: ease-in-out; }
      15% { transform: rotate(0); }
      100% { transform: rotate(0); }
    }
    .gb-btn.anim-shake { animation: gb-shake 0.6s ease-in-out 0s 3, gb-shake-pause 4s linear infinite; }
  `,
  none: '',
};

function WidgetApp() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [pageInfo, setPageInfo] = useState({ title: '', url: '' });

  const cfg = {
    brandColor: searchParams.get('brandColor') || '#2e6155',
    phoneNumber: searchParams.get('phoneNumber') || '',
    welcomeText: searchParams.get('welcomeText') || 'שלום! איך נוכל לעזור?',
    chatBubbleText: searchParams.get('chatBubbleText') || 'דברו איתנו',
    openFormButtonText: searchParams.get('openFormButtonText') || 'פתח שיחה',
    openFormButtonColor: searchParams.get('openFormButtonColor') || '#25d366',
    openFormButtonTextColor: searchParams.get('openFormButtonTextColor') || '#ffffff',
    openFormBodyBackgroundColor: searchParams.get('openFormBodyBackgroundColor') || '#ffffff',
    openFormBodyBorderLineColor: searchParams.get('openFormBodyBorderLineColor') || '#25d366',
    chatBubbleTextColor: searchParams.get('chatBubbleTextColor') || '#1a1a1a',
    welcomeTextColor: searchParams.get('welcomeTextColor') || '#1a1a1a',
    prefilledMessage: searchParams.get('prefilledMessage') || '',
    position: searchParams.get('position') || 'right',
    animationStyle: searchParams.get('animationStyle') || 'float',
    openWidgetByDefault: searchParams.get('openWidgetByDefault') === 'true',
  };

  const isRight = cfg.position !== 'left';
  const animCSS = ANIMATIONS[cfg.animationStyle] || '';

  // Notify parent of iframe size
  const notifySize = (open, bubbleVis) => {
    let height, width;
    if (open) {
      height = '400px'; width = '300px';
    } else if (!bubbleVis || !cfg.chatBubbleText) {
      height = '72px'; width = '72px';
    } else {
      height = '130px'; width = '310px';
    }
    window.parent.postMessage({ type: 'GAMBOT_WIDGET_SIZE', height, width }, '*');
  };

  useEffect(() => {
    // Hide layout elements injected by Next.js
    const hide = () => {
      document.querySelectorAll('nav, footer, header').forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
      const main = document.querySelector('main');
      if (main) {
        main.style.setProperty('padding', '0', 'important');
        main.style.setProperty('margin', '0', 'important');
        main.style.setProperty('min-height', '0', 'important');
      }
      document.body.style.cssText = 'margin:0;padding:0;overflow:hidden;background:transparent;';
      document.documentElement.style.cssText = 'margin:0;padding:0;overflow:hidden;background:transparent;';
    };
    hide();
    // Re-hide after hydration
    setTimeout(hide, 100);
    setTimeout(hide, 500);

    // Listen for page info from parent
    const onMessage = (e) => {
      if (e.data?.type === 'PAGE_INFO') {
        setPageInfo({ title: e.data.title, url: e.data.url });
      }
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage('REQUEST_PAGE_TITLE', '*');

    if (cfg.openWidgetByDefault) setIsOpen(true);

    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    notifySize(isOpen, bubbleVisible);
  }, [isOpen, bubbleVisible]);

  const buildWhatsAppUrl = () => {
    let msg = cfg.prefilledMessage || '';
    msg = msg.replace('{{page_link}}', pageInfo.url || '');
    msg = msg.replace('{{page_title}}', pageInfo.title || '');
    return `https://wa.me/${cfg.phoneNumber}?text=${encodeURIComponent(msg)}`;
  };

  const openWhatsApp = () => {
    window.open(buildWhatsAppUrl(), '_blank');
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: transparent !important; overflow: hidden !important; }
        nav, footer, header { display: none !important; }
        main { padding: 0 !important; margin: 0 !important; }

        .gb-root {
          position: fixed;
          bottom: 0;
          ${isRight ? 'right: 0;' : 'left: 0;'}
          display: flex;
          flex-direction: column;
          align-items: ${isRight ? 'flex-end' : 'flex-start'};
          gap: 10px;
          padding: 12px;
          pointer-events: none;
          z-index: 9999;
        }
        .gb-root > * { pointer-events: auto; }

        /* ── Popup ── */
        .gb-popup {
          width: 270px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          border: 2px solid ${cfg.openFormBodyBorderLineColor};
          background: ${cfg.openFormBodyBackgroundColor};
          transform-origin: bottom ${isRight ? 'right' : 'left'};
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.25s ease;
          transform: scale(${isOpen ? 1 : 0.5});
          opacity: ${isOpen ? 1 : 0};
          pointer-events: ${isOpen ? 'auto' : 'none'};
        }
        .gb-popup-header {
          background: linear-gradient(135deg, ${cfg.brandColor}, ${cfg.brandColor}cc);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .gb-avatar {
          width: 46px; height: 46px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .gb-popup-header-text { flex: 1; }
        .gb-popup-title {
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.2;
        }
        .gb-popup-subtitle {
          color: rgba(255,255,255,0.8);
          font-size: 12px;
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .gb-online-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #69f0ae;
          flex-shrink: 0;
        }
        .gb-close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: #fff;
          width: 28px; height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .gb-close-btn:hover { background: rgba(255,255,255,0.35); }

        .gb-popup-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .gb-welcome-bubble {
          background: #f0f0f0;
          border-radius: 12px 12px 12px 2px;
          padding: 10px 14px;
          font-size: 14px;
          line-height: 1.5;
          color: ${cfg.welcomeTextColor};
          position: relative;
        }
        .gb-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px 20px;
          border-radius: 50px;
          border: none;
          background: ${cfg.openFormButtonColor};
          color: ${cfg.openFormButtonTextColor};
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 12px ${cfg.openFormButtonColor}66;
        }
        .gb-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px ${cfg.openFormButtonColor}88;
        }
        .gb-cta-btn:active { transform: translateY(0); }
        .gb-cta-btn svg { width: 20px; height: 20px; fill: ${cfg.openFormButtonTextColor}; flex-shrink: 0; }

        .gb-powered {
          text-align: center;
          font-size: 11px;
          color: #aaa;
          padding-bottom: 4px;
        }
        .gb-powered a { color: #2e6155; text-decoration: none; font-weight: 600; }

        /* ── Bubble text ── */
        .gb-bubble-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-direction: ${isRight ? 'row-reverse' : 'row'};
        }
        .gb-bubble {
          background: #fff;
          border: 2px solid ${cfg.openFormBodyBorderLineColor};
          border-radius: 12px;
          padding: 9px 14px;
          font-size: 14px;
          font-weight: 600;
          color: ${cfg.chatBubbleTextColor};
          white-space: nowrap;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .gb-bubble:hover { transform: scale(1.03); }
        .gb-bubble-x {
          background: none; border: none; cursor: pointer;
          font-size: 20px; color: #999; line-height: 1;
          padding: 2px;
        }
        .gb-bubble-x:hover { color: #555; }

        /* ── Main button ── */
        .gb-btn {
          width: 62px; height: 62px;
          border-radius: 50%;
          background: ${cfg.brandColor};
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px ${cfg.brandColor}77;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          flex-shrink: 0;
        }
        .gb-btn:hover {
          transform: scale(1.08) !important;
          box-shadow: 0 6px 22px ${cfg.brandColor}aa;
          animation: none !important;
        }
        .gb-btn svg { width: 32px; height: 32px; fill: #fff; transition: transform 0.3s ease; }
        .gb-btn.open svg { transform: rotate(180deg); }

        ${animCSS}

        @keyframes gb-fadein {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .gb-bubble-wrap { animation: gb-fadein 0.4s ease; }
      `}</style>

      <div className="gb-root">
        {/* Popup panel */}
        <div className="gb-popup">
          <div className="gb-popup-header">
            <div className="gb-avatar">💬</div>
            <div className="gb-popup-header-text">
              <div className="gb-popup-title">צ&apos;אט ישיר</div>
              <div className="gb-popup-subtitle">
                <span className="gb-online-dot" />
                זמין עכשיו
              </div>
            </div>
            <button className="gb-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="gb-popup-body">
            <div className="gb-welcome-bubble">{cfg.welcomeText}</div>
            <button className="gb-cta-btn" onClick={openWhatsApp}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {cfg.openFormButtonText}
            </button>
            <div className="gb-powered">
              Powered by <a href="https://gambot.co.il" target="_blank" rel="noopener noreferrer">Gambot</a>
            </div>
          </div>
        </div>

        {/* Bubble text + button row */}
        <div className="gb-bubble-wrap">
          {!isOpen && bubbleVisible && cfg.chatBubbleText && (
            <>
              <div className="gb-bubble" onClick={() => setIsOpen(true)}>{cfg.chatBubbleText}</div>
              <button className="gb-bubble-x" onClick={() => setBubbleVisible(false)}>×</button>
            </>
          )}
          <button
            className={`gb-btn anim-${cfg.animationStyle} ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(prev => !prev)}
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24"><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
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

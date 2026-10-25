'use client';

/**
 * Cookie / tracking consent (Israeli Privacy Protection Law incl. Amendment 13, GDPR/ePrivacy, Google Consent Mode v2).
 *
 *  - Nothing but "essential" storage runs before the visitor chooses.
 *  - Analytics (Google Analytics) and Marketing (Google Ads + Meta Pixel) load ONLY after opt-in.
 *  - "Reject all" is exactly as prominent as "Accept all"; choices can be changed/withdrawn at any time via
 *    the footer "Cookie settings" link (event `gambot:open-cookie-settings`). Withdrawing deletes the cookies.
 *  - The decision (with timestamp + policy version) is kept in localStorage under `gambot_consent`.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Compliance.module.css';

const STORAGE_KEY = 'gambot_consent';
const POLICY_VERSION = 1;
const GA_ID = 'G-GFMXYNTV1N';
const ADS_ID = 'AW-18018385768';
const PIXEL_ID = '1009749608779359';

export const OPEN_SETTINGS_EVENT = 'gambot:open-cookie-settings';

const T = {
  he: {
    title: 'הפרטיות שלך חשובה לנו',
    text: 'אנו משתמשים בעוגיות חיוניות כדי שהאתר יעבוד, ובעוגיות סטטיסטיקה ושיווק (Google, Meta) רק אם תאשר/י. ניתן לשנות את הבחירה בכל עת.',
    policy: 'מדיניות פרטיות',
    acceptAll: 'אישור הכול',
    rejectAll: 'דחיית הכול',
    customize: 'התאמה אישית',
    save: 'שמירת הבחירה',
    back: 'חזרה',
    necessary: 'חיוניות',
    necessaryDesc: 'נדרשות לתפקוד האתר, אבטחה, שפה, נגישות ושמירת ההסכמה. תמיד פעילות.',
    analytics: 'סטטיסטיקה',
    analyticsDesc: 'Google Analytics — עוזרות לנו להבין כיצד משתמשים באתר ולשפר אותו.',
    marketing: 'שיווק',
    marketingDesc: 'Google Ads ו-Meta Pixel — מדידת המרות והצגת פרסומות רלוונטיות.',
    alwaysOn: 'תמיד פעיל',
    region: 'הגדרות עוגיות',
  },
  en: {
    title: 'Your privacy matters',
    text: 'We use essential cookies to make the site work, and analytics & marketing cookies (Google, Meta) only if you agree. You can change your choice at any time.',
    policy: 'Privacy Policy',
    acceptAll: 'Accept all',
    rejectAll: 'Reject all',
    customize: 'Customize',
    save: 'Save choices',
    back: 'Back',
    necessary: 'Essential',
    necessaryDesc: 'Needed for the site to work, security, language, accessibility and remembering your consent. Always on.',
    analytics: 'Analytics',
    analyticsDesc: 'Google Analytics — helps us understand how the site is used so we can improve it.',
    marketing: 'Marketing',
    marketingDesc: 'Google Ads and Meta Pixel — conversion measurement and relevant advertising.',
    alwaysOn: 'Always on',
    region: 'Cookie settings',
  },
};

function readStored() {
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (v && v.v === POLICY_VERSION && typeof v.analytics === 'boolean' && typeof v.marketing === 'boolean') return v;
  } catch { /* corrupted → ask again */ }
  return null;
}

function loadScript(src, id) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id; s.async = true; s.src = src;
  document.head.appendChild(s);
}

function clearTrackingCookies() {
  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (/^(_ga|_gid|_gat|_gcl_|_fbp|_fbc|IDE|test_cookie|_gac_)/.test(name)) {
      domains.forEach((d) => { document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`; });
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

/** Push the decision to Google Consent Mode and load the vendors the visitor allowed. */
function applyConsent({ analytics, marketing }) {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') window.gtag = function gtag() { window.dataLayer.push(arguments); }; // eslint-disable-line prefer-rest-params
  window.gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
  });

  if ((analytics || marketing) && !window.__gambotGtagLoaded) {
    window.__gambotGtagLoaded = true;
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${analytics ? GA_ID : ADS_ID}`, 'gambot-gtag');
    window.gtag('js', new Date());
  }
  if (analytics && !window.__gambotGaConfigured) { window.__gambotGaConfigured = true; window.gtag('config', GA_ID); }
  if (marketing && !window.__gambotAdsConfigured) { window.__gambotAdsConfigured = true; window.gtag('config', ADS_ID); }

  if (marketing && !window.fbq) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }
}

export default function CookieConsent() {
  const { currentLanguage } = useLanguage();
  const t = T[currentLanguage === 'en' ? 'en' : 'he'];
  const isRtl = currentLanguage !== 'en';
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const firstBtn = useRef(null);

  // First load: apply a stored decision, otherwise ask.
  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setAnalytics(stored.analytics); setMarketing(stored.marketing);
      applyConsent(stored);
    } else {
      setOpen(true);
    }
    const reopen = () => {
      const s = readStored();
      setAnalytics(!!s?.analytics); setMarketing(!!s?.marketing);
      setShowDetails(true); setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  // The first-visit banner does not steal focus (it is first in the tab order below the skip link);
  // when the visitor explicitly opens the settings panel we move focus into it. Escape goes back.
  useEffect(() => { if (open && showDetails) firstBtn.current?.focus(); }, [open, showDetails]);

  const save = useCallback((a, m) => {
    const prev = readStored();
    const decision = { v: POLICY_VERSION, ts: new Date().toISOString(), necessary: true, analytics: a, marketing: m };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(decision)); } catch { /* storage blocked: decision lasts this page only */ }
    const downgraded = !!prev && ((prev.analytics && !a) || (prev.marketing && !m));
    applyConsent(decision);
    setOpen(false); setShowDetails(false);
    if (downgraded) {
      // Already-loaded vendor scripts can't be unloaded → delete their cookies and reload without them.
      clearTrackingCookies();
      window.location.reload();
    }
  }, []);

  if (!open) return null;

  return (
    <div
      className={styles.consent}
      role="dialog"
      aria-modal="false"
      aria-labelledby="gb-consent-title"
      aria-describedby="gb-consent-text"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={isRtl ? 'he' : 'en'}
      onKeyDown={(e) => { if (e.key === 'Escape' && showDetails) setShowDetails(false); }}
    >
      <h2 id="gb-consent-title" className={styles.consentTitle}>{t.title}</h2>
      <p id="gb-consent-text" className={styles.consentText}>
        {t.text}{' '}
        <Link href={isRtl ? '/privacy/' : '/privacy/en/'}>{t.policy}</Link>
      </p>

      {showDetails && (
        <div className={styles.cats}>
          <div className={styles.cat}>
            <div>
              <strong>{t.necessary}</strong>
              <p>{t.necessaryDesc}</p>
            </div>
            <span className={styles.always}>{t.alwaysOn}</span>
          </div>
          <label className={styles.cat}>
            <div>
              <strong>{t.analytics}</strong>
              <p>{t.analyticsDesc}</p>
            </div>
            <input type="checkbox" role="switch" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          </label>
          <label className={styles.cat}>
            <div>
              <strong>{t.marketing}</strong>
              <p>{t.marketingDesc}</p>
            </div>
            <input type="checkbox" role="switch" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          </label>
        </div>
      )}

      <div className={styles.actions}>
        {showDetails ? (
          <>
            <button type="button" ref={firstBtn} className={styles.btnPrimary} onClick={() => save(analytics, marketing)}>{t.save}</button>
            <button type="button" className={styles.btnGhost} onClick={() => setShowDetails(false)}>{t.back}</button>
          </>
        ) : (
          <>
            <button type="button" ref={firstBtn} className={styles.btnPrimary} onClick={() => save(true, true)}>{t.acceptAll}</button>
            <button type="button" className={styles.btnPrimary} onClick={() => save(false, false)}>{t.rejectAll}</button>
            <button type="button" className={styles.btnGhost} onClick={() => setShowDetails(true)}>{t.customize}</button>
          </>
        )}
      </div>
    </div>
  );
}

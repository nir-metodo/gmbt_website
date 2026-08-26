'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './LandingPageContent.module.css';
import LeadForm from '@/components/LeadForm/LeadForm';
import { useLanguage } from '@/contexts/LanguageContext';
import axiosInstance from '@/components/OnBoard/axiosInstance';

// Loaded only in the browser — it's an interactive canvas, no SSR value.
const BotBuilderMiniDemo = dynamic(() => import('@/components/shared/BotBuilderMiniDemo'), { ssr: false });

// Accept a raw YouTube id OR any watch/short/embed URL (with or without &t=…) and return the id.
const ytId = (v) => {
  if (!v) return '';
  const s = String(v);
  const m = s.match(/[?&]v=([^&]+)/) || s.match(/youtu\.be\/([^?&/]+)/) || s.match(/embed\/([^?&/]+)/);
  return m ? m[1] : s;
};

// A single tutorial card. Supports a plain video (v.id) OR a "choice" card
// (v.choice) that lets the visitor pick a path — e.g. Coexistence vs. dedicated SIM —
// and swaps the embedded video accordingly, all inside one card.
function VideoCard({ v }) {
  const opts = v.choice && Array.isArray(v.choice.options) ? v.choice.options : null;
  const [sel, setSel] = useState(0);
  const activeId = opts ? ytId(opts[sel]?.id) : ytId(v.id);
  return (
    <div className={styles.videoCard}>
      <div className={styles.videoEmbed}>
        <iframe
          src={`https://www.youtube.com/embed/${activeId}`}
          title={opts ? opts[sel]?.label || v.title : v.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className={styles.videoMeta}>
        {v.step && <span className={styles.videoStepNum}>{v.step}</span>}
        <h3>{v.title}</h3>
        {v.desc && <p>{v.desc}</p>}
        {opts && (
          <div className={styles.videoChoice}>
            {v.choice.prompt && <p className={styles.videoChoicePrompt}>{v.choice.prompt}</p>}
            <div className={styles.videoChoiceOpts}>
              {opts.map((o, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.videoChoiceBtn} ${sel === idx ? styles.videoChoiceBtnActive : ''}`}
                  onClick={() => setSel(idx)}
                  aria-pressed={sel === idx}
                >
                  <span className={styles.videoChoiceLabel}>{o.label}</span>
                  {o.sub && <span className={styles.videoChoiceSub}>{o.sub}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LandingPageContent({ content }) {
  const [openFaq, setOpenFaq] = useState(null);
  const { currentLanguage } = useLanguage();
  const isEn = currentLanguage === 'en';

  // Track paid/campaign visitors who land on any campaign landing page into the root "CampaignLeads"
  // collection — attribution even before they fill a form. Fire-and-forget, once per browser session,
  // and ONLY when campaign markers are present (utm_* / fbclid / gclid) so organic traffic across the
  // many landing pages doesn't flood the collection.
  useEffect(() => {
    try {
      if (sessionStorage.getItem('gambot_landing_tracked')) return;
      const params = new URLSearchParams(window.location.search);
      const get = (k) => params.get(k) || '';
      const hasCampaign = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']
        .some((k) => get(k));
      if (!hasCampaign) return;
      const payload = {
        utm_source: get('utm_source'),
        utm_medium: get('utm_medium'),
        utm_campaign: get('utm_campaign'),
        utm_content: get('utm_content'),
        utm_term: get('utm_term'),
        fbclid: get('fbclid'),
        gclid: get('gclid'),
        landingPage: decodeURIComponent(window.location.pathname),
        fullUrl: window.location.href,
        referrer: (typeof document !== 'undefined' && document.referrer) || '',
        userAgent: (typeof navigator !== 'undefined' && navigator.userAgent) || '',
        language: (typeof navigator !== 'undefined' && navigator.language) || '',
      };
      sessionStorage.setItem('gambot_landing_tracked', '1');
      axiosInstance.post('/api/Webhooks/TrackLandingLead', payload).catch(() => { });
    } catch { }
  }, []);

  // Support bilingual content: { he: {...}, en: {...} } or legacy flat object
  const c = (content.he && content.en)
    ? (isEn ? content.en : content.he)
    : content;

  const dir = isEn ? 'ltr' : 'rtl';

  const handleCTA = () => {
    const msg = isEn
      ? 'Hi, I am interested in a Gambot demo 🚀'
      : 'היי, אני מעוניין/ת בהדגמה של Gambot 🚀';
    window.open('https://wa.me/97233768997?text=' + encodeURIComponent(msg), '_blank');
  };

  return (
    <div className={styles.page} style={{ paddingTop: '68px' }} dir={dir}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          {c.hero.badge && (
            <div className={styles.badge}>{c.hero.badge}</div>
          )}
          <h1 className={styles.heroTitle}>
            {typeof c.hero.title === 'string' ? c.hero.title : c.hero.titleText}
          </h1>
          <p className={styles.heroDesc}>{c.hero.desc}</p>
          <div className={styles.heroCta}>
            <Link href="/OnboardingProcess/" className={styles.btnPrimary}>
              {isEn ? '🚀 Start Free Trial — 1 Month' : '🚀 התחילו ניסיון חינם — חודש'}
            </Link>
            <button className={styles.btnSecondary} onClick={handleCTA}>
              {isEn ? '📞 Book a Personal Demo' : '📞 הזמינו הדגמה אישית'}
            </button>
          </div>
          {c.hero.stats && (
            <div className={styles.stats}>
              {c.hero.stats.map((s, i) => (
                <div key={i} className={styles.stat}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive drag-and-drop mini demo */}
      {c.demo === 'botBuilder' && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              {isEn ? '🧩 Try the Drag-and-Drop Bot Builder' : '🧩 נסו את בונה הבוטים — גרור ושחרר'}
            </h2>
            <p className={styles.sectionDesc}>
              {isEn
                ? 'A live mini demo — drag blocks onto the canvas and connect a flow, exactly like in Gambot.'
                : 'דמו חי מוקטן — גררו בלוקים אל הקנבס ובנו זרימה, בדיוק כמו בגמבוט.'}
            </p>
            <div className={styles.demoWrap}>
              <BotBuilderMiniDemo isEn={isEn} />
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {c.features && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              {isEn ? `🌟 What You Get with ${c.pageTitle}?` : `🌟 מה תקבלו עם ${c.pageTitle}?`}
            </h2>
            <div className={styles.grid}>
              {c.features.map((f, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.cardIcon}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works — Steps */}
      {c.steps && (
        <section className={`${styles.section} ${styles.bgLight}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              {isEn ? '⚡ How Does It Work?' : '⚡ איך זה עובד?'}
            </h2>
            <p className={styles.sectionDesc}>
              {isEn ? 'Simple start — immediate results' : 'התחלה פשוטה — תוצאות מיידיות'}
            </p>
            <div className={styles.stepsGrid}>
              {c.steps.map((s, i) => (
                <div key={i} className={styles.step}>
                  <div className={styles.stepNum}>{s.step}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  {i < c.steps.length - 1 && <div className={styles.stepArrow}>←</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video tutorials */}
      {c.videos && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              {isEn ? '🎬 Video Tutorials — Do It Yourself' : '🎬 סרטוני הדרכה — עשו זאת בעצמכם'}
            </h2>
            <p className={styles.sectionDesc}>
              {isEn
                ? 'Open an account and get going — step by step.'
                : 'פותחים חשבון ומתחילים לבד — שלב אחר שלב.'}
            </p>
            <div className={styles.videoGrid}>
              {c.videos.map((v, i) => (
                <VideoCard key={i} v={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Use Cases */}
      {c.useCases && (
        <section className={`${styles.section} ${c.steps ? '' : styles.bgLight}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              {isEn ? `🏢 Who Uses ${c.pageTitle}?` : `🏢 מי משתמש ב${c.pageTitle}?`}
            </h2>
            <div className={styles.gridSmall}>
              {c.useCases.map((uc, i) => (
                <div key={i} className={`${styles.card} ${styles.useCase}`}>
                  <span className={styles.ucIcon}>{uc.icon}</span>
                  <h3>{uc.title}</h3>
                  <p>{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mid-page CTA banner */}
      <section className={styles.midCtaBanner}>
        <div className={styles.container}>
          <div className={styles.midCtaInner}>
            <div>
              <h3>{isEn ? '💡 Want to See How It Works for You?' : '💡 רוצים לראות איך זה עובד עבורכם?'}</h3>
              <p>{isEn ? 'Free demo within 24 hours — no commitment' : 'הדגמה חינמית תוך 24 שעות — ללא התחייבות'}</p>
            </div>
            <button className={styles.btnPrimarySmall} onClick={handleCTA}>
              {isEn ? '📞 Get a Demo Now' : '📞 קבלו הדגמה עכשיו'}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {c.faq && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{isEn ? '❓ Frequently Asked Questions' : '❓ שאלות נפוצות'}</h2>
            <div className={styles.faqList}>
              {c.faq.map((item, i) => (
                <div
                  key={i}
                  className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className={styles.faqQ}>
                    <span>{item.q}</span>
                    <span className={styles.faqArrow}>{openFaq === i ? '▲' : '▼'}</span>
                  </div>
                  <p className={`${styles.faqA} ${openFaq !== i ? styles.faqHidden : ''}`}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Article — rich text content for SEO */}
      {c.article && (
        <section className={`${styles.section} ${styles.bgLight}`}>
          <div className={styles.container}>
            <article className={styles.article}>
              {c.article.map((block, i) =>
                block.type === 'h2' ? (
                  <h2 key={i} className={styles.articleH2}>{block.text}</h2>
                ) : block.type === 'h3' ? (
                  <h3 key={i} className={styles.articleH3}>{block.text}</h3>
                ) : (
                  <p key={i} className={styles.articleP}>{block.text}</p>
                )
              )}
            </article>
          </div>
        </section>
      )}

      {/* Related solutions — internal linking for SEO & discoverability */}
      {c.related && c.related.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{isEn ? '🔗 Related Solutions' : '🔗 פתרונות קשורים'}</h2>
            <div className={styles.relatedGrid}>
              {c.related.map((r, i) => (
                <Link key={i} href={r.href} className={styles.relatedCard}>
                  <span>{r.label}</span>
                  <span className={styles.relatedArrow}>{isEn ? '→' : '←'}</span>
                </Link>
              ))}
              <Link href="/OnboardingProcess/" className={`${styles.relatedCard} ${styles.relatedPrimary}`}>
                <span>{isEn ? '🚀 Create a Free Account' : '🚀 צרו חשבון חינם'}</span>
                <span className={styles.relatedArrow}>{isEn ? '→' : '←'}</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Lead Form + CTA */}
      <section className={`${styles.section} ${styles.bgGreen}`}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>{isEn ? '🚀 Ready to Get Started?' : '🚀 מוכנים להתחיל?'}</h2>
          <p className={styles.ctaDesc}>
            {isEn
              ? 'Free 1-month trial, no credit card required — set up in 5 minutes.'
              : 'ניסיון חינם חודש ללא כרטיס אשראי — יוצרים חשבון תוך 5 דקות.'}
          </p>
          <LeadForm source={c.pageTitle} />
        </div>
      </section>
    </div>
  );
}

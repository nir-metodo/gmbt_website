'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './LandingPageContent.module.css';
import LeadForm from '@/components/LeadForm/LeadForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LandingPageContent({ content }) {
  const [openFaq, setOpenFaq] = useState(null);
  const { currentLanguage } = useLanguage();
  const isEn = currentLanguage === 'en';

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

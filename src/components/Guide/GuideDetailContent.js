'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { getLocalizedGuides } from '@/lib/guideData';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './GuideDetailContent.module.css';

export default function GuideDetailContent({ guideId, slug }) {
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage || 'he';
  const dir = lang === 'he' ? 'rtl' : 'ltr';

  const guides = useMemo(() => getLocalizedGuides(lang), [lang]);
  const guide = guides.find(g => g.id === guideId || g.slug === slug);
  const allGuides = guides.map(g => ({ id: g.id, slug: g.slug, title: g.title, category: g.category }));

  const related = guide
    ? allGuides.filter(g => g.id !== guideId && g.category === guide.category).slice(0, 4)
    : [];

  const currentIndex = guide ? allGuides.findIndex(g => g.id === guide.id) : -1;
  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide = currentIndex >= 0 && currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;

  const tx = lang === 'en' ? {
    home: 'Home', guide: 'User Guide',
    ctaTitle: '🚀 Ready to start?', ctaBody: 'Open a Gambot account and apply what you learned',
    ctaBtn: 'Create free account', helpTitle: '💬 Need help?', helpBody: 'Our team is available for any question',
    helpBtn: 'WhatsApp us', relatedTitle: '📚 More guides',
    backLink: '← Back to all guides', noContent: 'Guide content is not available.',
    prevLabel: '← Previous guide', nextLabel: 'Next guide →',
  } : {
    home: 'דף בית', guide: 'מדריך למשתמש',
    ctaTitle: '🚀 מוכנים להתחיל?', ctaBody: 'פתחו חשבון גמבוט ויישמו את מה שלמדתם',
    ctaBtn: 'צרו חשבון בחינם', helpTitle: '💬 צריכים עזרה?', helpBody: 'הצוות שלנו זמין לעזור בכל שאלה',
    helpBtn: 'WhatsApp איתנו', relatedTitle: '📚 מדריכים נוספים',
    backLink: '← חזרה לכל המדריכים', noContent: 'תוכן המדריך אינו זמין.',
    prevLabel: '→ המדריך הקודם', nextLabel: '← המדריך הבא',
  };

  if (!guide) {
    return <div style={{ paddingTop: '68px', textAlign: 'center', padding: '80px' }}>{tx.noContent}</div>;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.description,
    inLanguage: lang,
    author: { '@type': 'Organization', name: 'גמבוט' },
  };

  return (
    <div style={{ paddingTop: '68px' }} dir={dir}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/">{tx.home}</Link> / <Link href="/guide/">{tx.guide}</Link> / <span>{guide.title}</span>
          </div>
          {guide.category && <div className={styles.badge}>{guide.category}</div>}
          <h1>{guide.title}</h1>
          <p>{guide.description}</p>
        </div>
      </section>

      <div className={styles.layout}>
        <main className={styles.main}>
          {/* Video */}
          {guide.videoUrl && (
            <div className={styles.videoWrap}>
              <iframe
                src={guide.videoUrl}
                title={guide.title}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}

          {/* Content */}
          {guide.content ? (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: guide.content }}
            />
          ) : (
            <p>{tx.noContent}</p>
          )}

          {/* Prev / Next navigation */}
          {(prevGuide || nextGuide) && (
            <nav className={styles.guideNav} aria-label="guide navigation">
              <div className={styles.guideNavInner}>
                {prevGuide ? (
                  <Link href={`/guide/${prevGuide.slug}/`} className={`${styles.guideNavBtn} ${styles.guideNavPrev}`}>
                    <span className={styles.guideNavArrow}>{lang === 'he' ? '→' : '←'}</span>
                    <span className={styles.guideNavText}>
                      <small>{tx.prevLabel}</small>
                      <strong>{prevGuide.title}</strong>
                    </span>
                  </Link>
                ) : <div />}
                {nextGuide ? (
                  <Link href={`/guide/${nextGuide.slug}/`} className={`${styles.guideNavBtn} ${styles.guideNavNext}`}>
                    <span className={styles.guideNavText}>
                      <small>{tx.nextLabel}</small>
                      <strong>{nextGuide.title}</strong>
                    </span>
                    <span className={styles.guideNavArrow}>{lang === 'he' ? '←' : '→'}</span>
                  </Link>
                ) : <div />}
              </div>
            </nav>
          )}

          {/* CTA */}
          <div className={styles.ctaBox}>
            <h3>{tx.ctaTitle}</h3>
            <p>{tx.ctaBody}</p>
            <a
              href="https://gambot.co.il/OnboardingProcess"
              className={styles.ctaBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx.ctaBtn}
            </a>
          </div>
        </main>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {related.length > 0 && (
            <div className={styles.sideCard}>
              <h3>{tx.relatedTitle}</h3>
              {related.map(g => (
                <Link key={g.id} href={`/guide/${g.slug}/`} className={styles.relatedLink}>
                  📖 {g.title}
                </Link>
              ))}
            </div>
          )}
          <div className={styles.sideCard}>
            <h3>{tx.helpTitle}</h3>
            <p>{tx.helpBody}</p>
            <a
              href="https://wa.me/97233768997"
              className={styles.waBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx.helpBtn}
            </a>
          </div>
          <div className={styles.sideCard}>
            <Link href="/guide/" className={styles.backLink}>
              {tx.backLink}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

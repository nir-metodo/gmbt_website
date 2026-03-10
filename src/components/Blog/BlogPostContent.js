'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './BlogPostContent.module.css';
import LeadForm from '@/components/LeadForm/LeadForm';
import posts, { getSeoUrl } from '@/lib/posts';
import { useLanguage } from '@/contexts/LanguageContext';


export default function BlogPostContent({ post }) {
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage || 'he';
  const dir = lang === 'he' ? 'rtl' : 'ltr';

  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setReadingProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loc = (val) => (val && typeof val === 'object' ? val[lang] || val.he || val.en || '' : val || '');

  const title = loc(post.title);
  const description = loc(post.description);
  const content = loc(post.content);
  const category = loc(post.category);
  const faq = post.faq
    ? (Array.isArray(post.faq) ? post.faq : (post.faq[lang] || post.faq.he || post.faq.en || []))
    : [];

  const related = posts
    .filter(p => p.id !== post.id && p.category === category)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      title: typeof p.title === 'object' ? (p.title[lang] || p.title.he) : p.title,
      slug: getSeoUrl(typeof p.title === 'object' ? (p.title[lang] || p.title.he) : p.title),
      readTime: p.readTime || 5,
    }));

  const currentIdx = posts.findIndex(p => p.id === post.id);
  const prevPost = currentIdx > 0 ? posts[currentIdx - 1] : null;
  const nextPost = currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null;
  const getNavPost = (p) => {
    const t = typeof p.title === 'object' ? (p.title[lang] || p.title.he) : p.title;
    return { id: p.id, title: t, slug: getSeoUrl(t) };
  };

  const slug = getSeoUrl(title);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: post.publishedDate,
    author: { '@type': 'Person', name: post.author || 'גמבוט' },
    publisher: {
      '@type': 'Organization',
      name: 'גמבוט',
      logo: { '@type': 'ImageObject', url: 'https://gambot.co.il/apple-touch-icon.png' },
    },
    url: `https://gambot.co.il/blog/${post.id}/${slug}/`,
    inLanguage: 'he',
          ...(faq.length > 0 ? {
      mainEntity: {
        '@type': 'FAQPage',
        mainEntity: faq.map(f => ({
          '@type': 'Question',
          name: loc(f.question),
          acceptedAnswer: { '@type': 'Answer', text: loc(f.answer) },
        })),
      }
    } : {}),
  };

  const breadcrumbHome = lang === 'en' ? 'Home' : 'דף בית';
  const breadcrumbBlog = lang === 'en' ? 'Blog' : 'בלוג';

  return (
    <div style={{ paddingTop: '68px' }} dir={dir}>
      {/* Reading progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '4px',
        background: 'rgba(0,0,0,0.08)', zIndex: 9999,
      }}>
        <div style={{
          height: '100%', background: 'linear-gradient(90deg,#25D366,#128C7E)',
          width: `${readingProgress}%`, transition: 'width 0.1s linear',
        }} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/">{breadcrumbHome}</Link> / <Link href="/blog/">{breadcrumbBlog}</Link> / <span>{category}</span>
          </div>
          {category && <div className={styles.badge}>{category}</div>}
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.meta}>
            {post.author && <span>✍️ {post.author}</span>}
            {post.publishedDate && <span>📅 {post.publishedDate}</span>}
            {post.readTime && <span>⏱️ {post.readTime} {lang === 'en' ? 'min read' : 'דקות קריאה'}</span>}
          </div>
          <p className={styles.desc}>{description}</p>
        </div>
      </section>

      {/* Content */}
      <div className={styles.layout}>
        <main className={styles.main}>
          {content ? (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p>{lang === 'en' ? 'Post content not available.' : 'תוכן הפוסט אינו זמין.'}</p>
          )}

          {/* FAQ Schema */}
          {faq.length > 0 && (
            <div className={styles.faqSection}>
              <h2>{lang === 'en' ? 'Frequently Asked Questions' : 'שאלות נפוצות'}</h2>
              {faq.map((f, i) => (
                <div key={i} className={styles.faqItem}>
                  <h3>{loc(f.question)}</h3>
                  <p>{loc(f.answer)}</p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className={styles.ctaBox}>
            <h3>{lang === 'en' ? '🚀 Ready to implement?' : '🚀 מוכנים ליישם?'}</h3>
            <p>{lang === 'en' ? 'Gambot helps businesses grow sales and improve service with WhatsApp API' : 'גמבוט עוזרת לעסקים להגדיל מכירות ולשפר שירות עם WhatsApp API'}</p>
            <a
              href="https://wa.me/97233768997?text=%D7%94%D7%99%D7%99%2C%20%D7%A7%D7%A8%D7%90%D7%AA%D7%99%20%D7%90%D7%AA%20%D7%94%D7%91%D7%9C%D7%95%D7%92%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%99%D7%95%D7%AA%D7%A8%20%F0%9F%9A%80"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              {lang === 'en' ? '💬 Talk to us now' : '💬 דברו איתנו עכשיו'}
            </a>
          </div>
        </main>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {related.length > 0 && (
            <div className={styles.sideCard}>
              <h3>{lang === 'en' ? '📌 Related Posts' : '📌 פוסטים קשורים'}</h3>
              {related.map(p => (
                <Link key={p.id} href={`/blog/${p.id}/${p.slug}/`} className={styles.relatedPost}>
                  <strong>{p.title}</strong>
                  <span>{p.readTime} {lang === 'en' ? 'min read' : 'דקות קריאה'}</span>
                </Link>
              ))}
            </div>
          )}
          <div className={styles.sideCard}>
            <h3>{lang === 'en' ? '🚀 Want to try?' : '🚀 רוצים לנסות?'}</h3>
            <p>{lang === 'en' ? 'Free trial — no credit card required' : 'ניסיון חינמי של חודש — ללא כרטיס אשראי'}</p>
            <a
              href="https://gambot.co.il/OnboardingProcess"
              className={styles.trialBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang === 'en' ? 'Start for free' : 'התחילו בחינם'}
            </a>
          </div>
        </aside>
      </div>

      {/* Next / Prev post navigation */}
      {(prevPost || nextPost) && (
        <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: prevPost && nextPost ? '1fr 1fr' : '1fr', gap: 16 }}>
          {prevPost && (
            <Link href={`/blog/${getNavPost(prevPost).id}/${getNavPost(prevPost).slug}/`}
              style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 6, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#25D366'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                {lang === 'en' ? '← Previous post' : 'פוסט קודם →'}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e', lineHeight: 1.4 }}>
                {getNavPost(prevPost).title}
              </span>
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${getNavPost(nextPost).id}/${getNavPost(nextPost).slug}/`}
              style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 6, textAlign: lang === 'en' ? 'right' : 'left', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#25D366'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                {lang === 'en' ? 'Next post →' : '← הפוסט הבא'}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e', lineHeight: 1.4 }}>
                {getNavPost(nextPost).title}
              </span>
            </Link>
          )}
        </nav>
      )}

      {/* Lead Form */}
      <section style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', padding: '60px 0' }}>
        <LeadForm source={`blog-${post.id}`} />
      </section>
    </div>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPosts, getSeoUrl } from '@/lib/posts';
import styles from '@/app/blog/Blog.module.css';

const POSTS_PER_PAGE = 9;

const POST_CARDS = {
  1:  { gradient: 'linear-gradient(135deg,#1565C0,#0288D1)', icon: '📡', labelHe: 'WhatsApp API', labelEn: 'WhatsApp API' },
  2:  { gradient: 'linear-gradient(135deg,#00695C,#26A69A)', icon: '⚙️', labelHe: 'שימושים מתקדמים', labelEn: 'Advanced Usage' },
  3:  { gradient: 'linear-gradient(135deg,#4527A0,#7B1FA2)', icon: '🤖', labelHe: 'AI Bot', labelEn: 'AI Bot' },
  4:  { gradient: 'linear-gradient(135deg,#01579B,#00838F)', icon: '📊', labelHe: 'השוואת ערוצים', labelEn: 'Channel Comparison' },
  5:  { gradient: 'linear-gradient(135deg,#1B5E20,#388E3C)', icon: '💬', labelHe: 'תקשורת עסקית', labelEn: 'Business Communication' },
  6:  { gradient: 'linear-gradient(135deg,#1A237E,#283593)', icon: '🎧', labelHe: 'שירות 24/7', labelEn: '24/7 Support' },
  7:  { gradient: 'linear-gradient(135deg,#E65100,#F57F17)', icon: '💰', labelHe: 'מכירות', labelEn: 'Sales' },
  8:  { gradient: 'linear-gradient(135deg,#880E4F,#C62828)', icon: '📣', labelHe: 'קמפיינים', labelEn: 'Campaigns' },
  9:  { gradient: 'linear-gradient(135deg,#6A1B9A,#4527A0)', icon: '🧠', labelHe: 'בינה מלאכותית', labelEn: 'Artificial Intelligence' },
  // 10: HIDDEN — כפילות פוסט 15
  // 15: HIDDEN — כפילות פוסט 10 (בחירת מספר טלפון)
  // 16: HIDDEN — תוכן כללי מדי, לא ממיר
  11: { gradient: 'linear-gradient(135deg,#0D47A1,#1976D2)', icon: '⚡', labelHe: 'API vs Business', labelEn: 'API vs Business' },
  12: { gradient: 'linear-gradient(135deg,#BF360C,#E64A19)', icon: '🚀', labelHe: 'אוטומציה שיווקית', labelEn: 'Marketing Automation' },
  13: { gradient: 'linear-gradient(135deg,#1A237E,#0288D1)', icon: '👥', labelHe: 'אנשי קשר', labelEn: 'Contacts' },
  14: { gradient: 'linear-gradient(135deg,#B71C1C,#C62828)', icon: '🛡️', labelHe: 'מגבלות WhatsApp', labelEn: 'WhatsApp Limits' },
  17: { gradient: 'linear-gradient(135deg,#0277BD,#01579B)', icon: '📢', labelHe: 'ניהול תקשורת', labelEn: 'Communication Management' },
  18: { gradient: 'linear-gradient(135deg,#4527A0,#7B1FA2)', icon: '🧠', labelHe: 'בוט AI', labelEn: 'AI Bot' },
  19: { gradient: 'linear-gradient(135deg,#25d366,#128c7e)', icon: '🤖', labelHe: 'Bot Builder', labelEn: 'Bot Builder' },
  20: { gradient: 'linear-gradient(135deg,#f97316,#dc2626)', icon: '📣', labelHe: 'שיווק בוואטסאפ', labelEn: 'WhatsApp Marketing' },
  21: { gradient: 'linear-gradient(135deg,#0f766e,#0369a1)', icon: '🎯', labelHe: 'ניהול לידים', labelEn: 'Lead Management' },
  22: { gradient: 'linear-gradient(135deg,#7c3aed,#4f46e5)', icon: '✍️', labelHe: 'חתימה דיגיטלית', labelEn: 'Digital Signature' },
  23: { gradient: 'linear-gradient(135deg,#0369a1,#0891b2)', icon: '📊', labelHe: 'CRM וואטסאפ', labelEn: 'WhatsApp CRM' },
  24: { gradient: 'linear-gradient(135deg,#b45309,#d97706)', icon: '💰', labelHe: 'הצעות מחיר', labelEn: 'Digital Quotes' },
  25: { gradient: 'linear-gradient(135deg,#0f766e,#059669)', icon: '👥', labelHe: 'Shared Inbox', labelEn: 'Shared Inbox' },
  26: { gradient: 'linear-gradient(135deg,#7c3aed,#a21caf)', icon: '📝', labelHe: 'תבניות הודעה', labelEn: 'Message Templates' },
  27: { gradient: 'linear-gradient(135deg,#0369a1,#1d4ed8)', icon: '🎧', labelHe: 'שירות לקוחות', labelEn: 'Customer Service' },
  28: { gradient: 'linear-gradient(135deg,#166534,#15803d)', icon: '🏠', labelHe: 'נדל"ן', labelEn: 'Real Estate' },
  29: { gradient: 'linear-gradient(135deg,#be123c,#e11d48)', icon: '🏥', labelHe: 'בריאות', labelEn: 'Healthcare' },
  33: { gradient: 'linear-gradient(135deg,#7c3aed,#4f46e5)', icon: '🧠', labelHe: 'Gambot AI', labelEn: 'Gambot AI' },
  34: { gradient: 'linear-gradient(135deg,#0f766e,#0369a1)', icon: '🎯', labelHe: 'בוט לידים AI', labelEn: 'AI Leads Bot' },
  35: { gradient: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', icon: '📊', labelHe: 'Meta CAPI & Google Ads', labelEn: 'Meta CAPI & Google Ads' },
  30: { gradient: 'linear-gradient(135deg,#b45309,#92400e)', icon: '🎉', labelHe: 'קמפיינים עונתיים', labelEn: 'Holiday Campaigns' },
  31: { gradient: 'linear-gradient(135deg,#0891b2,#0e7490)', icon: '🛍️', labelHe: 'קמעונאות', labelEn: 'Retail' },
  32: { gradient: 'linear-gradient(135deg,#374151,#111827)', icon: '⚖️', labelHe: 'API vs Business', labelEn: 'API vs Business' },
};
const FALLBACK_CARD = { gradient: 'linear-gradient(135deg,#1565C0,#0288D1)', icon: '💬', labelHe: 'WhatsApp', labelEn: 'WhatsApp' };

const TEXT = {
  he: {
    badge: '📚 בלוג גמבוט',
    heroTitle: 'מדריכים, טיפים ועדכונים',
    heroSub: 'כל מה שצריך לדעת על WhatsApp Business API, אוטומציה, שיווק ובוטים',
    readMore: 'קרא עוד',
    readTime: 'דק׳',
    prev: 'הקודם',
    next: 'הבא',
    page: 'עמוד',
    of: 'מתוך',
    showing: 'מציג',
    posts: 'פוסטים',
    outOf: 'מתוך',
  },
  en: {
    badge: '📚 Gambot Blog',
    heroTitle: 'Guides, Tips & Updates',
    heroSub: 'Everything you need to know about WhatsApp Business API, automation, marketing and bots',
    readMore: 'Read More',
    readTime: 'min',
    prev: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    showing: 'Showing',
    posts: 'posts',
    outOf: 'out of',
  },
};

export default function BlogContent() {
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage || 'he';
  const tx = TEXT[lang] || TEXT.he;
  const dir = lang === 'he' ? 'rtl' : 'ltr';
  const [currentPage, setCurrentPage] = useState(1);

  const allPosts = getLocalizedPosts(lang)
    .map(p => {
      const card = POST_CARDS[p.id] || FALLBACK_CARD;
      return {
        ...p,
        card: { ...card, label: lang === 'en' ? card.labelEn : card.labelHe },
      };
    })
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const localizedPosts = allPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ paddingTop: '68px' }} dir={dir}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>{tx.badge}</div>
          <h1>{tx.heroTitle}</h1>
          <p>{tx.heroSub}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {localizedPosts.map(post => (
              <article key={post.id} className={styles.card}>
                <Link href={`/blog/${post.id}/${post.seoUrl}/`} className={styles.cardImgLink}>
                  <div className={styles.cardImg}>
                    <div
                      className={styles.cardThumb}
                      style={{ background: post.card.gradient }}
                    >
                      <span className={styles.cardThumbIcon}>{post.card.icon}</span>
                      <span className={styles.cardThumbLabel}>{post.card.label}</span>
                    </div>
                    <span className={styles.cardCategory}>{post.category}</span>
                  </div>
                </Link>
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    {post.publishedDate && (
                      <span>📅 {new Date(post.publishedDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    )}
                    <span>⏱️ {post.readTime} {tx.readTime}</span>
                  </div>
                  <h2 className={styles.cardTitle}>
                    <Link href={`/blog/${post.id}/${post.seoUrl}/`}>{post.title}</Link>
                  </h2>
                  <p className={styles.cardDesc}>{post.description}</p>
                  <Link href={`/blog/${post.id}/${post.seoUrl}/`} className={styles.readMore}>
                    {tx.readMore} →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                {tx.showing} {startIdx + 1}–{Math.min(startIdx + POSTS_PER_PAGE, allPosts.length)} {tx.outOf} {allPosts.length} {tx.posts}
              </span>
              <div className={styles.paginationControls}>
                <button
                  className={styles.pageBtn}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {dir === 'rtl' ? '→' : '←'} {tx.prev}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className={styles.pageBtn}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {tx.next} {dir === 'rtl' ? '←' : '→'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

'use client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPosts, getSeoUrl } from '@/lib/posts';
import styles from '@/app/blog/Blog.module.css';

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
  10: { gradient: 'linear-gradient(135deg,#004D40,#00695C)', icon: '📱', labelHe: 'WhatsApp עסקי', labelEn: 'WhatsApp Business' },
  11: { gradient: 'linear-gradient(135deg,#0D47A1,#1976D2)', icon: '⚡', labelHe: 'API vs Business', labelEn: 'API vs Business' },
  12: { gradient: 'linear-gradient(135deg,#BF360C,#E64A19)', icon: '🚀', labelHe: 'אוטומציה שיווקית', labelEn: 'Marketing Automation' },
  13: { gradient: 'linear-gradient(135deg,#1A237E,#0288D1)', icon: '👥', labelHe: 'אנשי קשר', labelEn: 'Contacts' },
  14: { gradient: 'linear-gradient(135deg,#B71C1C,#C62828)', icon: '🛡️', labelHe: 'מגבלות WhatsApp', labelEn: 'WhatsApp Limits' },
  15: { gradient: 'linear-gradient(135deg,#1B5E20,#43A047)', icon: '📈', labelHe: 'שיווק דיגיטלי', labelEn: 'Digital Marketing' },
  16: { gradient: 'linear-gradient(135deg,#006064,#00838F)', icon: '💎', labelHe: 'שירות לקוחות', labelEn: 'Customer Service' },
  17: { gradient: 'linear-gradient(135deg,#0277BD,#01579B)', icon: '📢', labelHe: 'ניהול תקשורת', labelEn: 'Communication Management' },
  18: { gradient: 'linear-gradient(135deg,#4527A0,#7B1FA2)', icon: '🧠', labelHe: 'בוט AI', labelEn: 'AI Bot' },
};
const FALLBACK_CARD = { gradient: 'linear-gradient(135deg,#1565C0,#0288D1)', icon: '💬', labelHe: 'WhatsApp', labelEn: 'WhatsApp' };

const TEXT = {
  he: {
    badge: '📚 בלוג גמבוט',
    heroTitle: 'מדריכים, טיפים ועדכונים',
    heroSub: 'כל מה שצריך לדעת על WhatsApp Business API, אוטומציה, שיווק ובוטים',
    readMore: 'קרא עוד',
    readTime: 'דק׳',
  },
  en: {
    badge: '📚 Gambot Blog',
    heroTitle: 'Guides, Tips & Updates',
    heroSub: 'Everything you need to know about WhatsApp Business API, automation, marketing and bots',
    readMore: 'Read More',
    readTime: 'min',
  },
};

export default function BlogContent() {
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage || 'he';
  const tx = TEXT[lang] || TEXT.he;
  const dir = lang === 'he' ? 'rtl' : 'ltr';

  const localizedPosts = getLocalizedPosts(lang)
    .map(p => {
      const card = POST_CARDS[p.id] || FALLBACK_CARD;
      return {
        ...p,
        card: { ...card, label: lang === 'en' ? card.labelEn : card.labelHe },
      };
    })
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

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
        </div>
      </section>
    </div>
  );
}

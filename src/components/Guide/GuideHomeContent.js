'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getLocalizedGuides } from '@/lib/guideData';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './GuideHomeContent.module.css';

export default function GuideHomeContent() {
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage || 'he';
  const guides = useMemo(() => getLocalizedGuides(lang), [lang]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = [...new Set(guides.map(g => g.category || 'כללי'))];
    return ['all', ...cats];
  }, [guides]);

  const filtered = useMemo(() => {
    return guides.filter(g => {
      const matchesSearch = !searchQuery ||
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [guides, searchQuery, selectedCategory]);

  const ICON_MAP = {
    1: '👤', 2: '📇', 3: '📢', 4: '🤖', 5: '💬', 6: '📄', 7: '⚙️', 8: '✅', 9: '📝',
  };

  const dir = lang === 'he' ? 'rtl' : 'ltr';
  const tx = lang === 'en' ? {
    badge: '✨ Help Center',
    title: 'Gambot User Guide',
    sub: 'Everything you need to know to succeed with WhatsApp Business API',
    placeholder: 'Search guide...',
    all: 'All',
    readMore: 'Read More →',
    noResults: '🔍 No matching guides found',
    clearSearch: 'Clear search',
    devTitle: 'Are you a developer?',
    devSub: 'Full REST API reference — send messages & templates, manage contacts, leads, cases and campaigns.',
    devBtn: '⚙️ Developer Guide (API)',
  } : {
    badge: '✨ מרכז העזרה',
    title: 'המדריך למשתמש של גמבוט',
    sub: 'כל מה שצריך לדעת כדי להצליח עם WhatsApp Business API',
    placeholder: 'חפש מדריך...',
    all: 'הכל',
    readMore: 'קרא עוד ←',
    noResults: '🔍 לא נמצאו מדריכים תואמים',
    clearSearch: 'נקה חיפוש',
    devTitle: 'אתם מפתחים?',
    devSub: 'תיעוד API מלא — שליחת הודעות ותבניות, ניהול אנשי קשר, לידים, פניות וקמפיינים.',
    devBtn: '⚙️ מדריך למפתח (API)',
  };

  return (
    <div style={{ paddingTop: '68px' }} dir={dir}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>{tx.badge}</div>
          <h1>{tx.title}</h1>
          <p>{tx.sub}</p>
          <div className={styles.search}>
            <input
              type="text"
              placeholder={tx.placeholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <span>🔍</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <Link
            href="/developers/"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '16px', flexWrap: 'wrap',
              background: 'linear-gradient(135deg, #0a2540 0%, #1a1a5e 100%)',
              color: '#fff', borderRadius: '16px', padding: '22px 26px',
              marginBottom: '28px', textDecoration: 'none',
              boxShadow: '0 6px 24px rgba(10,37,64,0.18)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>{tx.devTitle}</div>
              <div style={{ opacity: 0.9, fontSize: '0.95rem', maxWidth: '620px' }}>{tx.devSub}</div>
            </div>
            <span style={{
              background: '#059669', color: '#fff', padding: '12px 22px',
              borderRadius: '10px', fontWeight: 700, whiteSpace: 'nowrap',
            }}>{tx.devBtn}</span>
          </Link>

          <div className={styles.categories}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.catBtn} ${selectedCategory === cat ? styles.active : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? tx.all : cat}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {filtered.map(guide => (
              <Link key={guide.id} href={`/guide/${guide.slug}/`} className={styles.card}>
                <div className={styles.cardIcon}>{ICON_MAP[guide.id] || '📖'}</div>
                <div className={styles.cardBody}>
                  {guide.category && <span className={styles.category}>{guide.category}</span>}
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <span className={styles.readMore}>{tx.readMore}</span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={styles.noResults}>
              <p>{tx.noResults}</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                {tx.clearSearch}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

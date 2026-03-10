'use client';
import { useState } from 'react';
import styles from './PricingContent.module.css';

const PLANS = [
  {
    name: 'Growth',
    price: 143,
    yearlyPrice: 115,
    description: 'חבילת הבסיס לעסקים מתחילים',
    features: [
      '1 בוט / תהליך אוטומציה',
      '500 שיחות חדשות בחודש',
      '120 תגובות AI',
      '25 הודעות Pro Active',
      '3 משתמשים',
      'תמיכה בסיסית',
    ],
  },
  {
    name: 'Pro',
    price: 287,
    yearlyPrice: 230,
    recommended: true,
    description: 'הפתרון המושלם לעסקים צומחים',
    features: [
      '2 בוטים / תהליכי אוטומציה',
      '1,000 שיחות חדשות בחודש',
      '300 תגובות AI',
      '50 הודעות Pro Active',
      '5 משתמשים',
      'תמיכה משופרת + SLA',
    ],
  },
  {
    name: 'Business',
    price: 865,
    yearlyPrice: 692,
    description: 'פתרון ארגוני גמיש ומותאם',
    features: [
      '3 בוטים / תהליכי אוטומציה',
      '2,000 שיחות חדשות בחודש',
      '600 תגובות AI',
      '100 הודעות Pro Active',
      '10 משתמשים',
      'תמיכה מועדפת + מנהל חשבון',
    ],
  },
];

const META_PRICING = [
  { category: 'שיווקית (Marketing)', price: 0.0442, desc: 'קמפיינים, מבצעים, ניוזלטר' },
  { category: 'שירות (Utility)', price: 0.0067, desc: 'עדכוני הזמנה, חשבוניות, תזכורות' },
  { category: 'אימות (Authentication)', price: 0.0067, desc: 'קודי OTP ואימות זהות' },
];

export default function PricingContent() {
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  const FAQ = [
    { q: 'האם יש ניסיון חינמי?', a: 'כן! ניסיון חינמי של 14 יום — ללא כרטיס אשראי.' },
    { q: 'מה כוללות שיחות חדשות?', a: 'שיחה חדשה היא שיחה עם איש קשר שלא הייתה בשבועיים האחרונים.' },
    { q: 'מה עלות הודעות Meta?', a: 'מחיר Meta לישראל: ≈₪0.044 להודעה שיווקית, ₪0.0067 לשירות/אימות. בנוסף לדמי המנוי.' },
    { q: 'האם ניתן לשדרג/לשנמך?', a: 'כן, ניתן לשנות תוכנית בכל עת. השינוי נכנס לתוקף בחידוש הבא.' },
    { q: 'מה הגדרת תמיכה?', a: 'Growth — אימייל. Pro — אימייל + צ׳אט עדיפות. Business — מנהל חשבון ייעודי.' },
  ];

  return (
    <div style={{ paddingTop: '68px' }}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>💰 מחירי גמבוט 2026</div>
          <h1>תוכניות ומחירים שקופים</h1>
          <p>החל מ-₪143/חודש | ניסיון חינם 14 יום | ללא כרטיס אשראי</p>

          {/* Billing Toggle */}
          <div className={styles.toggle}>
            <button
              className={`${styles.toggleBtn} ${billing === 'monthly' ? styles.active : ''}`}
              onClick={() => setBilling('monthly')}
            >
              חודשי
            </button>
            <button
              className={`${styles.toggleBtn} ${billing === 'yearly' ? styles.active : ''}`}
              onClick={() => setBilling('yearly')}
            >
              שנתי <span className={styles.discount}>20% הנחה</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.plansGrid}>
            {PLANS.map((plan, i) => (
              <div key={i} className={`${styles.planCard} ${plan.recommended ? styles.recommended : ''}`}>
                {plan.recommended && <div className={styles.recBadge}>⭐ הנבחר</div>}
                <h2 className={styles.planName}>{plan.name}</h2>
                <p className={styles.planDesc}>{plan.description}</p>
                <div className={styles.planPrice}>
                  <span className={styles.currency}>₪</span>
                  <span className={styles.amount}>{billing === 'monthly' ? plan.price : plan.yearlyPrice}</span>
                  <span className={styles.period}>/חודש</span>
                </div>
                {billing === 'yearly' && (
                  <p className={styles.yearNote}>₪{plan.yearlyPrice * 12}/שנה (חיסכון ₪{(plan.price - plan.yearlyPrice) * 12})</p>
                )}
                <ul className={styles.features}>
                  {plan.features.map((f, j) => (
                    <li key={j}><span className={styles.check}>✓</span>{f}</li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/97233768997?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%94%D7%AA%D7%97%D7%99%D7%9C%20%F0%9F%9A%80"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.planBtn} ${plan.recommended ? styles.planBtnRec : ''}`}
                >
                  התחילו ב-{plan.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meta Pricing */}
      <section className={`${styles.section} ${styles.bgLight}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>📊 תעריפי הודעות Meta לישראל</h2>
          <p className={styles.sectionDesc}>בנוסף לדמי המנוי, Meta גובה תשלום לפי סוג ההודעה. אלו התעריפים הרשמיים ל-2026:</p>
          <div className={styles.metaGrid}>
            {META_PRICING.map((m, i) => (
              <div key={i} className={styles.metaCard}>
                <h3>{m.category}</h3>
                <p className={styles.metaPrice}>${m.price.toFixed(4)} <span>לשיחה</span></p>
                <p className={styles.metaDesc}>{m.desc}</p>
              </div>
            ))}
          </div>
          <p className={styles.metaNote}>* תעריפי Meta מחושבים לפי שיחה (24 שעות), לא לפי הודעה. שיחת שירות שנפתחת על ידי לקוח היא חינמית.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>❓ שאלות על מחירים</h2>
          <div className={styles.faqList}>
            {FAQ.map((f, i) => (
              <div
                key={i}
                className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className={styles.faqQ}>
                  <span>{f.q}</span>
                  <span>{openFaq === i ? '▲' : '▼'}</span>
                </div>
                {openFaq === i && <p className={styles.faqA}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>🚀 מוכנים להתחיל?</h2>
          <p>ניסיון חינמי של 14 יום — ללא כרטיס אשראי. מתחילים תוך 30 דקות.</p>
          <div className={styles.ctaBtns}>
            <a href="https://gambot.co.il/OnboardingProcess" className={styles.ctaBtn} target="_blank" rel="noopener noreferrer">
              🚀 התחילו בחינם
            </a>
            <a href="https://wa.me/97233768997" className={styles.ctaBtnSec} target="_blank" rel="noopener noreferrer">
              💬 שאלו אותנו
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

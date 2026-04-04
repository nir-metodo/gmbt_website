'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './OnboardingPageContent.module.css';

const PLANS = [
  {
    id: 'growth',
    name: 'Growth',
    price: 179,
    yearlyPrice: 143,
    icon: '💡',
    description: 'לעסק שמתחיל',
    features: [
      '1 בוט / אוטומציה',
      '500 שיחות בחודש',
      '120 תגובות AI',
      '25 הודעות Pro Active',
      '3 משתמשים',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 359,
    yearlyPrice: 287,
    icon: '⭐',
    recommended: true,
    description: 'לעסק שצומח',
    features: [
      '2 בוטים / אוטומציות',
      '1,000 שיחות בחודש',
      '300 תגובות AI',
      '50 הודעות Pro Active',
      '5 משתמשים',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 645,
    yearlyPrice: 516,
    icon: '🚀',
    description: 'לארגון גדול',
    features: [
      '3 בוטים / אוטומציות',
      '2,000 שיחות בחודש',
      '1,250 תגובות AI',
      '150 הודעות Pro Active',
      '8 משתמשים',
    ],
  },
];

const STEPS = [
  { num: '01', title: 'בחר תוכנית', desc: 'מצא את התוכנית המתאימה לעסק שלך' },
  { num: '02', title: 'צור חשבון', desc: 'מלא פרטים בסיסיים — 2 דקות' },
  { num: '03', title: 'חבר מספר', desc: 'חבר את מספר הוואטסאפ שלך ל-Meta' },
  { num: '04', title: 'התחל לעבוד', desc: 'הגדר בוט ושלח הודעות ראשונות' },
];

export default function OnboardingPageContent() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billing, setBilling] = useState('monthly');

  const handleStart = () => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    window.location.href = `https://gambot.co.il/OnboardingProcess?plan=${selectedPlan}`;
  };

  return (
    <div className={styles.page} dir="rtl">

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>🚀 ניסיון חינם — חודש מלא</div>
        <h1 className={styles.heroTitle}>
          פתח חשבון גמבוט<br />
          <span className={styles.heroHighlight}>ב-30 דקות בלבד</span>
        </h1>
        <p className={styles.heroDesc}>
          ללא כרטיס אשראי · ללא התחייבות · עם ליווי מלא
        </p>
      </div>

      {/* Steps */}
      <div className={styles.stepsSection}>
        <div className={styles.stepsGrid}>
          {STEPS.map((s, i) => (
            <div key={i} className={styles.stepCard}>
              <div className={styles.stepNum}>{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plan selector */}
      <div className={styles.plansSection}>
        <h2 className={styles.plansTitle}>בחר את התוכנית שלך</h2>

        {/* Billing toggle */}
        <div className={styles.billingToggle}>
          <button
            className={billing === 'monthly' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setBilling('monthly')}
          >חודשי</button>
          <button
            className={billing === 'yearly' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setBilling('yearly')}
          >
            שנתי <span className={styles.saveBadge}>חסכון 20%</span>
          </button>
        </div>

        <div className={styles.plansGrid}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`${styles.planCard} ${plan.recommended ? styles.recommended : ''} ${selectedPlan === plan.id ? styles.selected : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.recommended && <div className={styles.recBadge}>הכי פופולרי</div>}
              <div className={styles.planIcon}>{plan.icon}</div>
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planDesc}>{plan.description}</p>
              <div className={styles.planPrice}>
                <span className={styles.currency}>₪</span>
                <span className={styles.amount}>
                  {billing === 'monthly' ? plan.price : plan.yearlyPrice}
                </span>
                <span className={styles.period}>/חודש</span>
              </div>
              {billing === 'yearly' && (
                <div className={styles.yearlyNote}>חיוב שנתי</div>
              )}
              <ul className={styles.planFeatures}>
                {plan.features.map((f, i) => (
                  <li key={i}><span className={styles.check}>✓</span>{f}</li>
                ))}
              </ul>
              <div className={`${styles.selectIndicator} ${selectedPlan === plan.id ? styles.selectIndicatorActive : ''}`}>
                {selectedPlan === plan.id ? '✓ נבחר' : 'בחר'}
              </div>
            </div>
          ))}
        </div>

        <button className={styles.startBtn} onClick={handleStart}>
          🚀 התחל ניסיון חינם — {PLANS.find(p => p.id === selectedPlan)?.name}
        </button>
        <p className={styles.startNote}>לחיצה תעביר אותך להשלמת תהליך ההרשמה</p>
      </div>

      {/* Trust indicators */}
      <div className={styles.trustSection}>
        <div className={styles.trustGrid}>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>🏆</div>
            <strong>שותף Meta רשמי</strong>
            <span>Business Solution Provider מורשה</span>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>🔒</div>
            <strong>מאובטח לחלוטין</strong>
            <span>הצפנה מלאה, עמידה בתנאי Meta</span>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>📞</div>
            <strong>תמיכה 24/7</strong>
            <span>צוות ישראלי זמין תמיד</span>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>⚡</div>
            <strong>חודש ניסיון חינם</strong>
            <span>ללא כרטיס אשראי, ללא התחייבות</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className={styles.questionsSection}>
        <p>יש שאלות לפני שמתחילים?</p>
        <div className={styles.questionsBtns}>
          <a href="https://wa.me/97233768997?text=היי, אני רוצה לפתוח חשבון גמבוט" className={styles.waBtn} target="_blank" rel="noopener noreferrer">
            💬 שלח הודעה בוואטסאפ
          </a>
          <Link href="/PriceList/" className={styles.priceBtn}>צפה במחירים המלאים</Link>
        </div>
      </div>
    </div>
  );
}

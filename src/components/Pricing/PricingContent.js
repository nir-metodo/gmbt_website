'use client';
import { useState } from 'react';
import styles from './PricingContent.module.css';

const QUIZ = [
  {
    q: 'כמה שיחות WhatsApp חדשות בחודש אתם מצפים?',
    hint: 'שיחה חדשה = איש קשר שלא דיברתם איתו בשבועיים האחרונים',
    answers: [
      { label: 'עד 300 שיחות', plan: 'Growth' },
      { label: '300 – 1,000 שיחות', plan: 'Pro' },
      { label: 'מעל 1,000 שיחות', plan: 'Business' },
    ],
  },
  {
    q: 'כמה נציגים/עובדים יצטרכו גישה למערכת?',
    hint: 'כולל מנהלים, נציגי שירות ומכירות',
    answers: [
      { label: '1–2 נציגים', plan: 'Growth' },
      { label: '3–5 נציגים', plan: 'Pro' },
      { label: '6 ומעלה', plan: 'Business' },
    ],
  },
  {
    q: 'האם תרצו עזרה בבניית אוטומציות ובוטים?',
    hint: 'בוטים שמטפלים בלידים, שולחים תזכורות, מנהלים שיחות אוטומטיות וכו\'',
    answers: [
      { label: 'לא — אני מגדיר הכל לבד', plan: 'Growth' },
      { label: 'כן — תמיכה בסיסית מספיקה לי', plan: 'Pro' },
      { label: 'כן — אני צריך ליווי וסיוע מלא', plan: 'Business' },
    ],
  },
  {
    q: 'מה הכי חשוב לכם בבחירת מערכת?',
    hint: '',
    answers: [
      { label: '💸 מחיר נמוך ככל האפשר', plan: 'Growth' },
      { label: '⚡ יחס מחיר-ערך טוב + תמיכה', plan: 'Pro' },
      { label: '🏆 פתרון מלא + ניהול חשבון אישי', plan: 'Business' },
    ],
  },
  {
    q: 'מה המטרה העיקרית שלכם עם WhatsApp עסקי?',
    hint: '',
    answers: [
      { label: 'לנסות ולראות אם זה מתאים לי', plan: 'Growth' },
      { label: 'לשפר שירות לקוחות ולסגור יותר מכירות', plan: 'Pro' },
      { label: 'אוטומציה מלאה + שיווק + ניהול לידים בקנה מידה', plan: 'Business' },
    ],
  },
];

const PLANS = [
  {
    name: 'Growth',
    price: 143,
    yearlyPrice: 115,
    description: 'למשתמשים טכנולוגיים בלבד — ללא סיוע אנושי',
    supportBadge: { label: '❌ ללא תמיכה', color: '#e53e3e', bg: '#fff5f5' },
    features: [
      '1 בוט / תהליך אוטומציה',
      '500 שיחות חדשות בחודש',
      '120 תגובות AI',
      '25 הודעות Pro Active',
      '3 משתמשים',
      '📚 מרכז ידע בלבד (סרטונים + מדריכים)',
      '❌ ללא מענה אנושי',
    ],
  },
  {
    name: 'Pro',
    price: 287,
    yearlyPrice: 230,
    recommended: true,
    description: 'הפתרון המושלם לעסקים צומחים',
    supportBadge: { label: '✅ תמיכה בסיסית', color: '#276749', bg: '#f0fff4' },
    features: [
      '2 בוטים / תהליכי אוטומציה',
      '1,000 שיחות חדשות בחודש',
      '300 תגובות AI',
      '50 הודעות Pro Active',
      '5 משתמשים',
      '✅ תמיכה בוואטסאפ — מענה עד 48 שעות',
      '❌ ללא הדרכות / בניית אוטומציות',
    ],
  },
  {
    name: 'Business',
    price: 865,
    yearlyPrice: 692,
    description: 'פתרון ארגוני גמיש ומותאם',
    supportBadge: { label: '⭐ תמיכה מועדפת', color: '#744210', bg: '#fffbeb' },
    features: [
      '3 בוטים / תהליכי אוטומציה',
      '2,000 שיחות חדשות בחודש',
      '600 תגובות AI',
      '100 הודעות Pro Active',
      '10 משתמשים',
      '⭐ תמיכה מועדפת — מענה עד 24 שעות',
      '🗓️ שיחת ייעוץ חודשית',
    ],
  },
];

const META_PRICING = [
  { category: 'שיווקית (Marketing)', price: 0.0442, desc: 'קמפיינים, מבצעים, ניוזלטר' },
  { category: 'שירות (Utility)', price: 0.0067, desc: 'עדכוני הזמנה, חשבוניות, תזכורות' },
  { category: 'אימות (Authentication)', price: 0.0067, desc: 'קודי OTP ואימות זהות' },
];

function calcQuizResult(answers) {
  const scores = { Growth: 0, Pro: 0, Business: 0 };
  answers.forEach(p => scores[p]++);
  if (scores.Business > scores.Pro && scores.Business > scores.Growth) return 'Business';
  if (scores.Growth > scores.Pro && scores.Growth > scores.Business) return 'Growth';
  return 'Pro';
}

export default function PricingContent() {
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const FAQ = [
    { q: 'האם יש ניסיון חינמי?', a: 'כן! ניסיון חינמי של 14 יום — ללא כרטיס אשראי.' },
    { q: 'מה כוללות שיחות חדשות?', a: 'שיחה חדשה היא שיחה עם איש קשר שלא הייתה בשבועיים האחרונים.' },
    { q: 'מה עלות הודעות Meta?', a: 'מחיר Meta לישראל: ≈₪0.044 להודעה שיווקית, ₪0.0067 לשירות/אימות. בנוסף לדמי המנוי.' },
    { q: 'האם ניתן לשדרג/לשנמך?', a: 'כן, ניתן לשנות תוכנית בכל עת. השינוי נכנס לתוקף בחידוש הבא.' },
    { q: 'מה הגדרת תמיכה?', a: 'Growth — מרכז ידע בלבד, ללא מענה אנושי. Pro — תמיכה בסיסית בוואטסאפ, מענה עד 48 שעות. Business — מענה עד 24 שעות + שיחה חודשית. Support Plus (₪650 לכל חבילה) — מענה עד 4 שעות + נציג ייעודי.' },
    { q: 'מה לא כלול בתמיכה?', a: 'בניית בוטים ואוטומציות, הקמת קמפיינים, הדרכות עובדים, ייעוץ עסקי וחיבור מערכות חיצוניות — כל אלה מתומחרים בנפרד החל מ-₪400/שעה + מע״מ.' },
    { q: 'כמה עולים שירותי פיתוח והדרכה?', a: 'פיתוח והתאמות: ₪400/שעה + מע״מ. הדרכת עובדים: החל מ-₪600. בניית בוטים ואוטומציות: לפי היקף הפרויקט.' },
  ];

  return (
    <div style={{ paddingTop: '68px' }}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>💰 מחירי גמבוט 2026</div>
          <h1>תוכניות ומחירים שקופים</h1>
          <p>החל מ-₪179/חודש | ניסיון חינם 30 יום | ללא כרטיס אשראי</p>

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

      {/* Quiz */}
      <section className={`${styles.section} ${styles.bgLight}`}>
        <div className={styles.container}>
          {!showQuiz ? (
            <div className={styles.quizTeaser}>
              <div className={styles.quizTeaserIcon}>🎯</div>
              <h2 className={styles.sectionTitle}>לא בטוחים איזו חבילה מתאימה לכם?</h2>
              <p className={styles.sectionDesc}>ענו על 5 שאלות קצרות וקבלו המלצה מותאמת אישית — תוך 60 שניות</p>
              <button className={styles.quizStartBtn} onClick={() => setShowQuiz(true)}>
                🔍 גלו את החבילה שלכם
              </button>
            </div>
          ) : !quizResult ? (
            <div className={styles.quizCard}>
              <div className={styles.quizProgress}>
                {QUIZ.map((_, i) => (
                  <div key={i} className={`${styles.quizDot} ${i < quizStep ? styles.quizDotDone : i === quizStep ? styles.quizDotActive : ''}`} />
                ))}
              </div>
              <p className={styles.quizStepLabel}>שאלה {quizStep + 1} מתוך {QUIZ.length}</p>
              <h3 className={styles.quizQuestion}>{QUIZ[quizStep].q}</h3>
              {QUIZ[quizStep].hint && <p className={styles.quizHint}>{QUIZ[quizStep].hint}</p>}
              <div className={styles.quizOptions}>
                {QUIZ[quizStep].answers.map((ans, i) => (
                  <button
                    key={i}
                    className={styles.quizOption}
                    onClick={() => {
                      const next = [...quizAnswers, ans.plan];
                      if (quizStep + 1 < QUIZ.length) {
                        setQuizAnswers(next);
                        setQuizStep(quizStep + 1);
                      } else {
                        setQuizResult(calcQuizResult(next));
                        setQuizAnswers(next);
                      }
                    }}
                  >
                    {ans.label}
                  </button>
                ))}
              </div>
              {quizStep > 0 && (
                <button className={styles.quizBack} onClick={() => { setQuizStep(quizStep - 1); setQuizAnswers(quizAnswers.slice(0, -1)); }}>
                  ← חזרה
                </button>
              )}
            </div>
          ) : (
            <div className={styles.quizCard}>
              <div className={styles.quizResultIcon}>
                {quizResult === 'Business' ? '🏆' : quizResult === 'Pro' ? '⚡' : '📚'}
              </div>
              <h3 className={styles.quizResultTitle}>
                החבילה המומלצת עבורכם:
                <span className={`${styles.quizResultPlan} ${quizResult === 'Business' ? styles.quizPlanBusiness : quizResult === 'Pro' ? styles.quizPlanPro : styles.quizPlanGrowth}`}>
                  {quizResult}
                </span>
              </h3>
              {quizResult === 'Business' && (
                <p className={styles.quizResultDesc}>הפרופיל שלכם מצביע על צרכים ארגוניים ברמה גבוהה — Business נותנת לכם מנהל חשבון ייעודי, תמיכה עודפת וגבולות שמתאימים לקנה המידה שלכם.</p>
              )}
              {quizResult === 'Pro' && (
                <p className={styles.quizResultDesc}>Pro היא הבחירה החכמה לרוב העסקים — תמיכה בסיסית, יחס מחיר-ערך מצוין, וכל הכלים שצריך כדי לצמוח.</p>
              )}
              {quizResult === 'Growth' && (
                <p className={styles.quizResultWarning}>
                  ⚠️ Growth מיועדת למשתמשים עצמאיים לחלוטין — ללא תמיכה אנושית, ללא עזרה בהגדרה. <strong>90% מהלקוחות שהתחילו ב-Growth עברו ל-Pro תוך חודש.</strong> שקלו Pro מהיום כדי לחסוך זמן.
                </p>
              )}
              <div className={styles.quizResultActions}>
                <a
                  href="https://wa.me/97233768997?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%94%D7%AA%D7%97%D7%99%D7%9C%20%F0%9F%9A%80"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.quizCta} ${quizResult === 'Business' ? styles.quizCtaBusiness : quizResult === 'Pro' ? styles.quizCtaPro : styles.quizCtaGrowth}`}
                >
                  התחילו ב-{quizResult} →
                </a>
                {quizResult === 'Growth' && (
                  <a
                    href="https://wa.me/97233768997?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%94%D7%AA%D7%97%D7%99%D7%9C%20%F0%9F%9A%80"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.quizCta} ${styles.quizCtaPro}`}
                  >
                    ⭐ נסו Pro במקום
                  </a>
                )}
              </div>
              <button className={styles.quizBack} onClick={() => { setQuizStep(0); setQuizAnswers([]); setQuizResult(null); }}>
                🔄 התחילו מחדש
              </button>
            </div>
          )}
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
                <p className={styles.vatNote}>(לא כולל מע״מ)</p>
                {billing === 'yearly' && (
                  <p className={styles.yearNote}>₪{plan.yearlyPrice * 12}/שנה (חיסכון ₪{(plan.price - plan.yearlyPrice) * 12})</p>
                )}
                {plan.supportBadge && (
                  <div className={styles.supportBadge} style={{ color: plan.supportBadge.color, background: plan.supportBadge.bg, borderColor: plan.supportBadge.color + '40' }}>
                    {plan.supportBadge.label}
                  </div>
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

      {/* Support Plus Add-on */}
      <section className={`${styles.section} ${styles.bgLight}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🛡️ תמיכה מתקדמת — Support Plus</h2>
          <p className={styles.sectionDesc}>תוספת לכל חבילה | ₪650/חודש</p>
          <div className={styles.supportPlusCard}>
            <div className={styles.supportPlusLeft}>
              <div className={styles.supportPlusPrice}>
                <span className={styles.currency}>₪</span>
                <span className={styles.supportPlusAmount}>650</span>
                <span className={styles.period}>/חודש</span>
              </div>
              <p className={styles.supportPlusSub}>תוספת לכל חבילה קיימת</p>
              <a
                href="https://wa.me/97233768997?text=%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%94%D7%95%D7%A1%D7%99%D7%A3%20Support%20Plus"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.supportPlusBtn}
              >
                💬 הוסיפו Support Plus
              </a>
            </div>
            <div className={styles.supportPlusRight}>
              <ul className={styles.supportPlusList}>
                <li>⚡ מענה עד 4 שעות בימי עסקים</li>
                <li>📱 וואטסאפ ישיר לנציג ייעודי</li>
                <li>🎯 עדיפות בתור הטיפול</li>
                <li>🗓️ שיחת ייעוץ חודשית (30 דק׳)</li>
                <li>🔧 ליווי בהגדרות ושאלות שימוש</li>
                <li>📊 מענה בשאלות שימוש מתקדמות</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Support Explanation */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>📋 מה כלול בתמיכה?</h2>
          <p className={styles.sectionDesc}>הגדרנו בשקיפות מלאה מה התמיכה כוללת — ומה לא</p>
          <div className={styles.supportGrid}>
            {/* Included */}
            <div className={styles.supportBox}>
              <div className={styles.supportBoxHeader} style={{ background: '#f0fff4', borderColor: '#9ae6b4' }}>
                <span style={{ fontSize: '1.5rem' }}>✅</span>
                <h3>כלול בתמיכה</h3>
              </div>
              <ul className={styles.supportList}>
                <li>מענה לשאלות על שימוש במערכת</li>
                <li>עזרה בהגדרות קיימות</li>
                <li>הסבר על פיצ׳רים</li>
                <li>פתרון תקלות טכניות במערכת</li>
                <li>הכוונה כללית לשימוש נכון</li>
              </ul>
            </div>
            {/* Not included */}
            <div className={styles.supportBox}>
              <div className={styles.supportBoxHeader} style={{ background: '#fff5f5', borderColor: '#fc8181' }}>
                <span style={{ fontSize: '1.5rem' }}>❌</span>
                <h3>לא כלול בתמיכה</h3>
              </div>
              <ul className={styles.supportList}>
                <li>בניית בוטים ואוטומציות חדשות</li>
                <li>שינויים ועיצוב תהליכים עסקיים</li>
                <li>הקמת קמפיינים</li>
                <li>חיבור מערכות חיצוניות</li>
                <li>הדרכת עובדים / onboarding</li>
                <li>ייעוץ שיווקי או עסקי</li>
              </ul>
            </div>
            {/* Extra services */}
            <div className={styles.supportBox}>
              <div className={styles.supportBoxHeader} style={{ background: '#fffbeb', borderColor: '#f6e05e' }}>
                <span style={{ fontSize: '1.5rem' }}>🔧</span>
                <h3>שירותים נוספים</h3>
              </div>
              <ul className={styles.supportList}>
                <li>פיתוח והתאמות — <strong>₪400/שעה + מע״מ</strong></li>
                <li>הדרכת עובדים — החל מ-₪600</li>
                <li>onboarding מקיף — הצעת מחיר</li>
                <li>שיחת ייעוץ חד-פעמית — ₪400 + מע״מ</li>
                <li>בניית בוטים / אוטומציות — לפי היקף</li>
              </ul>
              <p className={styles.supportNote}>* המנוי הוא על המערכת. שירותים נוספים מתומחרים תמיד בנפרד — ללא קשר לחבילה.</p>
            </div>
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

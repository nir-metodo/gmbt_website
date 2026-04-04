'use client';
import React, { useState, useCallback } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaCheck, FaCheckCircle, FaCrown, FaStar, FaLightbulb, FaMoneyBillWave, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaBolt, FaRocket } from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdTrendingUp, MdVerified } from "react-icons/md";
import './PriceList.css';

const sessionOptionsAI = [
  { value: 500, price: 50 },
  { value: 1000, price: 100 },
  { value: 1500, price: 150 },
  { value: 2000, price: 200 }
];

const proActiveOptions = [
  { value: 25, price: 15 },
  { value: 50, price: 25 },
  { value: 100, price: 50 },
  { value: 200, price: 90 }
];

const plans = [
  {
    name: "Growth",
    price: 179,
    yearlyPrice: 143 * 12,
    description: "למשתמשים טכנולוגיים בלבד — ללא סיוע אנושי",
    features: [
      "1 בוט / תהליך אוטומציה",
      "300 שיחות בחודש",
      "1,500 ריצות אוטומציה בחודש",
      "עד 3,000 אנשי קשר",
      "50 פעולות AI בחודש (כל 500 נוספות 50 ₪)",
      "25 הודעות Pro Active",
      "2 משתמשים (משתמש נוסף 30 ₪)",
      "❌ ללא תמיכה אנושית",
      "📚 מרכז ידע בלבד (סרטונים והדרכות)",
    ],
    moreFeatures: [
      "ניהול לידים בסיסי",
      "ניהול פניות בסיסי",
      "300 נמענים בקמפיינים לחודש",
      "יצוא CSV",
      "דוחות בסיסיים",
    ]
  },
  {
    name: "Pro",
    price: 359,
    yearlyPrice: 287 * 12,
    recommended: true,
    description: "הפתרון המושלם לעסקים צומחים",
    features: [
      "3 בוטים / תהליכי אוטומציה",
      "1,000 שיחות חדשות בחודש",
      "5,000 ריצות אוטומציה בחודש",
      "עד 10,000 אנשי קשר",
      "300 תגובות / פעולות AI (כל 500 נוספות 50 ₪)",
      "⚡ 75 הודעות Pro Active כלולות (כל 25 נוספות 15 ₪)",
      "5 משתמשים (כל משתמש נוסף 30 ₪)",
      "✅ תמיכה בסיסית בוואטסאפ — מענה עד 48 שעות",
    ],
    moreFeatures: [
      "ניהול לידים ו-CRM מלא",
      "ניהול משימות מתקדם",
      "ניהול פניות",
      "דוחות וניתוח נתונים",
      "אינטגרציות Google Sheets",
      "יצוא Excel / PDF",
    ]
  },
  {
    name: "Business",
    price: 645,
    yearlyPrice: 516 * 12,
    description: "פתרון ארגוני גמיש ומותאם",
    features: [
      "6 בוטים / תהליכי אוטומציה",
      "3,000 שיחות חדשות בחודש",
      "15,000 ריצות אוטומציה בחודש",
      "עד 35,000 אנשי קשר",
      "1,000 פעולות AI",
      "⚡ 200 הודעות Pro Active",
      "12 משתמשים",
      "⭐ תמיכה מועדפת — מענה עד 24 שעות",
      "🗓️ שיחת ייעוץ חודשית",
    ],
    moreFeatures: [
      "ניהול לידים ו-CRM מלא",
      "ניהול משימות מתקדם",
      "ניהול פניות",
      "דוחות מלאים + יומי אוטומטי",
      "API מותאם אישית",
      "יצוא Excel / PDF",
      "מנהל חשבון ייעודי",
    ]
  },
];

const allPlanFeatures = [
  "התכתבות בזמן אמת",
  "ניהול טמפלטים",
  "ניהול קמפיינים",
  "ניהול WhatsApp Flows",
  "ניהול אנשי קשר",
  "ניהול הגדרות חשבון",
  "ניהול קטלוג",
  "יצירת תהליכי אוטומציה",
  "ניהול פרופיל WABA",
  "לוח בקרה ודוחות",
  "אינטגרציה עם Google Sheets",
  "ניסיון חינם של חודש",
];

export default function PriceListContent() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [expandedCards, setExpandedCards] = useState({});
  const [selectedSessionsAI, setSelectedSessionsAI] = useState(sessionOptionsAI[0]);
  const [selectedProActive, setSelectedProActive] = useState(proActiveOptions[0]);
  const [showModal, setShowModal] = useState(false);
  const [showAiCalc, setShowAiCalc] = useState(false);
  const [calcServiceType, setCalcServiceType] = useState('support');
  const [calcConversations, setCalcConversations] = useState(300);
  const [calcAvgResponses, setCalcAvgResponses] = useState(3);
  const [calcPlan, setCalcPlan] = useState('pro');

  const servicePresets = {
    support:      { label: 'שירות לקוחות',    avg: 6, desc: 'שאלות ותמיכה — לרוב שיחות ארוכות יותר' },
    leads:        { label: 'ניהול לידים',      avg: 4, desc: 'הסמכת לידים, שאלות ממוקדות לפני העברה לנציג' },
    appointments: { label: 'תיאום פגישות',    avg: 3, desc: 'שיחות קצרות וממוקדות — AI מנחה לבחירת זמן' },
    custom:       { label: 'מותאם אישית',      avg: calcAvgResponses, desc: '' },
  };

  const planIncluded = { growth: 50, pro: 300, business: 1000 };
  const planPrice    = { growth: 179, pro: 359, business: 645 };
  const planLabel    = { growth: 'Growth', pro: 'Pro', business: 'Business' };

  const totalAiMonthly  = calcConversations * calcAvgResponses;
  const includedAi      = planIncluded[calcPlan] || 0;
  const extraAi         = Math.max(0, totalAiMonthly - includedAi);
  const extraCost       = Math.ceil(extraAi / 500) * 50;
  const totalMonthlyCost = planPrice[calcPlan] + extraCost;

  const toggleExpand = useCallback((planName) => {
    setExpandedCards(prev => ({ ...prev, [planName]: !prev[planName] }));
  }, []);

  return (
    <div className="price-list-container">

      {/* Hero */}
      <div className="pricing-hero-section">
        <div className="pricing-hero-background">
          <div className="hero-circle hero-circle-1" />
          <div className="hero-circle hero-circle-2" />
          <div className="hero-circle hero-circle-3" />
        </div>
        <div className="pricing-hero-content">
          <div className="pricing-header-badge-new">
            <HiOutlineSparkles className="sparkle-icon" />
            <span>פיצ׳רים מתקדמים</span>
          </div>
          <h1 className="pricing-hero-title">
            בחר את <span className="highlight-gradient">התוכנית המושלמת</span> לעסק שלך
          </h1>
          <p className="pricing-hero-subtitle">
            אוטומציות WhatsApp מתקדמות ויכולות AI עוצמתיות לעסקים בכל הגדלים
          </p>
          <div className="pricing-hero-features">
            <div className="hero-feature-item">
              <div className="hero-feature-icon"><MdVerified /></div>
              <div className="hero-feature-text">
                <strong>שותף רשמי</strong><span>Meta Business Partner</span>
              </div>
            </div>
            <div className="hero-feature-item">
              <div className="hero-feature-icon"><MdTrendingUp /></div>
              <div className="hero-feature-text">
                <strong>תמיכה 24/7</strong><span>תמיד כאן בשבילך</span>
              </div>
            </div>
            <div className="hero-feature-item">
              <div className="hero-feature-icon"><FaRocket /></div>
              <div className="hero-feature-text">
                <strong>ניסיון חינם חודש</strong><span>ללא כרטיס אשראי</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="billing-toggle-wrapper">
        <div className="billing-toggle-header">
          <h3>מחזור חיוב</h3>
          <p>חסכו עד 20% עם תשלום שנתי</p>
        </div>
        <div className="billing-toggle">
          <button className={billingCycle === "monthly" ? "active" : ""} onClick={() => setBillingCycle("monthly")}>
            <span className="toggle-label">חודשי</span>
            <span className="toggle-desc">גמישות מלאה</span>
          </button>
          <button className={billingCycle === "yearly" ? "active" : ""} onClick={() => setBillingCycle("yearly")}>
            <span className="toggle-label">שנתי</span>
            <span className="toggle-desc">חסכו עד 20%</span>
            <span className="discount-badge">מומלץ</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="plans-container">
        {plans.map((plan, index) => (
          <div key={index} className={`plan-card ${plan.recommended ? "recommended" : ""}`}>
            {plan.recommended && (
              <div className="recommended-badge">
                <FaCrown className="crown-icon" />
                <span>הכי מומלץ</span>
              </div>
            )}
            <div className="plan-header">
              <div className="plan-icon">
                {plan.name === "Growth" && <FaLightbulb />}
                {plan.name === "Pro" && <FaStar />}
                {plan.name === "Business" && <FaRocket />}
              </div>
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>
            </div>

            <div className="plan-pricing">
              <div className="plan-price">
                <span className="currency">₪</span>
                <span className="amount">
                  {billingCycle === "monthly" ? plan.price : Math.round(plan.yearlyPrice / 12)}
                </span>
                <span className="period">לחודש</span>
              </div>
              {billingCycle === "yearly" && (
                <div className="plan-yearly">
                  <span>חיוב שנתי: ₪{plan.yearlyPrice.toLocaleString()}</span>
                  <span className="savings">חסכון: ₪{((plan.price * 12) - plan.yearlyPrice).toLocaleString()}</span>
                </div>
              )}
            </div>

            <button onClick={() => setShowModal(true)} className={`plan-button ${plan.recommended ? 'primary' : 'secondary'}`}>
              בחר תוכנית
            </button>

            <div className="plan-features">
              <h4>כולל:</h4>
              <ul>
                {plan.features.map((f, i) => (
                  <li key={i}><FaCheck className="feature-check" /><span>{f}</span></li>
                ))}
              </ul>
              {plan.moreFeatures?.length > 0 && (
                <>
                  <button className="plan-expand-toggle" onClick={() => toggleExpand(plan.name)}>
                    {expandedCards[plan.name]
                      ? <><FaChevronUp /> הצג פחות</>
                      : <><FaChevronDown /> +{plan.moreFeatures.length} יכולות CRM</>}
                  </button>
                  {expandedCards[plan.name] && (
                    <ul className="plan-more-features">
                      {plan.moreFeatures.map((f, i) => (
                        <li key={i}><FaCheck className="feature-check" /><span>{f}</span></li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* All plan features */}
      <div className="pricing-features-container">
        <div className="features-header">
          <div className="features-badge">
            <MdVerified className="badge-icon" />
            <span>כלול בכל התוכניות</span>
          </div>
          <h2 className="pricing-features-title">כל התוכניות כוללות</h2>
        </div>
        <div className="pricing-features-grid">
          {allPlanFeatures.map((f, i) => (
            <div key={i} className="pricing-feature-item">
              <div className="feature-icon-wrapper"><FaCheckCircle className="feature-icon" /></div>
              <span className="feature-text">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Add-on */}
      <div className="addon-section">
        <div className="addon-container ai-addon">
          <div className="addon-header">
            <div className="addon-icon ai-icon"><FaRocket /></div>
            <h2 className="addon-title">תגובות AI נוספות</h2>
            <p className="addon-subtitle">הרחב את יכולות ה-AI שלך מעבר לכלול בחבילה</p>
          </div>
          <div className="addon-selector">
            <label htmlFor="ai-sessions-select">בחר כמות תגובות AI נוספות:</label>
            <div className="select-wrapper">
              <select
                id="ai-sessions-select"
                value={selectedSessionsAI.value}
                onChange={e => setSelectedSessionsAI(sessionOptionsAI.find(o => o.value === parseInt(e.target.value)))}
                className="addon-select ai-select"
              >
                {sessionOptionsAI.map(o => (
                  <option key={o.value} value={o.value}>{o.value.toLocaleString()} תגובות AI</option>
                ))}
              </select>
            </div>
          </div>
          <div className="addon-pricing">
            <span className="addon-price">₪{selectedSessionsAI.price}</span>
            <span className="addon-period">לחודש</span>
          </div>
          <button className="ai-calc-trigger-btn" onClick={() => setShowAiCalc(true)}>
            🧮 &nbsp;מחשבון תגובות AI — כמה תצטרכו בחודש?
          </button>
        </div>
      </div>

      {/* AI Responses Calculator Modal */}
      {showAiCalc && (
        <div className="ai-calc-overlay" onClick={() => setShowAiCalc(false)}>
          <div className="ai-calc-modal" dir="rtl" onClick={e => e.stopPropagation()}>
            <button className="ai-calc-close" onClick={() => setShowAiCalc(false)}>✕</button>
            <div className="ai-calc-header">
              <span className="ai-calc-header-icon">🧮</span>
              <h2>מחשבון תגובות AI</h2>
              <p>הבינו כמה תגובות AI תצטרכו בחודש ומה יהיה העלות הנוספת</p>
            </div>

            {/* Step 1 — Service type */}
            <div className="ai-calc-section">
              <label className="ai-calc-label">1. סוג השירות שלכם</label>
              <div className="ai-calc-service-grid">
                {Object.entries(servicePresets).filter(([k]) => k !== 'custom').map(([key, s]) => (
                  <button
                    key={key}
                    className={`ai-calc-service-btn${calcServiceType === key ? ' active' : ''}`}
                    onClick={() => {
                      setCalcServiceType(key);
                      setCalcAvgResponses(s.avg);
                    }}
                  >
                    <span className="ai-calc-service-icon">
                      {key === 'support' ? '🎧' : key === 'leads' ? '🎯' : '📅'}
                    </span>
                    <span className="ai-calc-service-label">{s.label}</span>
                    <span className="ai-calc-service-avg">~{s.avg} תגובות AI לשיחה</span>
                    <span className="ai-calc-service-desc">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Conversations per month */}
            <div className="ai-calc-section">
              <label className="ai-calc-label">
                2. כמה שיחות חדשות בחודש?
                <span className="ai-calc-value-badge">{calcConversations.toLocaleString()}</span>
              </label>
              <input
                type="range" min={50} max={5000} step={50}
                value={calcConversations}
                onChange={e => setCalcConversations(Number(e.target.value))}
                className="ai-calc-slider"
              />
              <div className="ai-calc-slider-labels">
                <span>50</span><span>1,000</span><span>2,500</span><span>5,000</span>
              </div>
            </div>

            {/* Step 3 — Avg AI responses */}
            <div className="ai-calc-section">
              <label className="ai-calc-label">
                3. ממוצע תגובות AI לשיחה
                <span className="ai-calc-value-badge">{calcAvgResponses}</span>
              </label>
              <input
                type="range" min={1} max={15} step={1}
                value={calcAvgResponses}
                onChange={e => setCalcAvgResponses(Number(e.target.value))}
                className="ai-calc-slider"
              />
              <div className="ai-calc-slider-labels">
                <span>1</span><span>5</span><span>10</span><span>15</span>
              </div>
              <div className="ai-calc-tip">
                💡 <strong>המלצת גמבוט:</strong> 2–3 תשובות AI ראשונות לשיחה — הבוט מכוון את הלקוח מההתחלה ו-AI קורא את ההיסטוריה כך שהתשובות הראשונות הן הכי אפקטיביות. שאר השיחה יכולה לעבור לבוט רגיל שמהיר יותר.
              </div>
              <div className="ai-calc-settings-note">
                ⚙️ <strong>טיפ:</strong> בהגדרות המערכת ניתן להגביל את מספר תגובות ה-AI המקסימלי לשיחה — כך תשלטו בצריכה ולא תגיעו להפתעות בחיוב.
              </div>
            </div>

            {/* Step 4 — Plan */}
            <div className="ai-calc-section">
              <label className="ai-calc-label">4. החבילה שלכם</label>
              <div className="ai-calc-plan-row">
                {Object.entries(planLabel).map(([key, label]) => (
                  <button
                    key={key}
                    className={`ai-calc-plan-btn${calcPlan === key ? ' active' : ''}`}
                    onClick={() => setCalcPlan(key)}
                  >
                    {label}
                    <span>{planIncluded[key].toLocaleString()} AI כלול</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            <div className={`ai-calc-result${extraCost === 0 ? ' result-ok' : extraCost > 200 ? ' result-high' : ''}`}>
              <div className="ai-calc-result-row">
                <span>סה"כ תגובות AI חודשיות</span>
                <strong>{totalAiMonthly.toLocaleString()}</strong>
              </div>
              <div className="ai-calc-result-row">
                <span>כלול בחבילת {planLabel[calcPlan]}</span>
                <strong>{includedAi.toLocaleString()}</strong>
              </div>
              <div className={`ai-calc-result-row${extraAi > 0 ? ' extra' : ''}`}>
                <span>תגובות נוספות נדרשות</span>
                <strong>{extraAi.toLocaleString()}</strong>
              </div>
              <div className="ai-calc-result-divider" />
              <div className="ai-calc-result-row total">
                <span>תוספת חודשית בגין AI</span>
                <strong className="ai-calc-cost">₪{extraCost}</strong>
              </div>
              <div className="ai-calc-result-row grand-total">
                <span>סה"כ עלות חודשית משוערת</span>
                <strong className="ai-calc-grand">₪{totalMonthlyCost.toLocaleString()}</strong>
              </div>
              {extraCost === 0 && (
                <div className="ai-calc-ok-msg">✅ הכמות הזו כלולה בחבילה שלכם — אין תוספת עלות!</div>
              )}
              {extraCost > 0 && (
                <div className="ai-calc-suggestion">
                  💡 שווה לשקול להוריד ל-{Math.min(calcAvgResponses - 1, 3)} תגובות AI לשיחה — תחסכו ₪{Math.ceil(Math.max(0, calcConversations * (calcAvgResponses - 1) - includedAi) / 500) * 50 < extraCost ? extraCost - Math.ceil(Math.max(0, calcConversations * (calcAvgResponses - 1) - includedAi) / 500) * 50 : 0} בחודש
                </div>
              )}
            </div>

            <a href="/PriceList/OnboardingServices" className="ai-calc-cta">לתחילת ניסיון חינם ←</a>
          </div>
        </div>
      )}

      {/* Pro Active Add-on */}
      <div className="addon-section">
        <div className="addon-container" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', borderColor: '#8b5cf6' }}>
          <div className="addon-header">
            <div className="addon-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}><FaBolt /></div>
            <h2 className="addon-title">⚡ הודעות Pro Active נוספות</h2>
            <p className="addon-subtitle">פולואפ חכם מבוסס AI שנשלח אוטומטית לאנשי הקשר שלך</p>
          </div>
          <div className="addon-selector">
            <label htmlFor="proactive-select">בחר הודעות Pro Active נוספות:</label>
            <div className="select-wrapper">
              <select
                id="proactive-select"
                value={selectedProActive.value}
                onChange={e => setSelectedProActive(proActiveOptions.find(o => o.value === parseInt(e.target.value)))}
                className="addon-select"
                style={{ borderColor: '#8b5cf6' }}
              >
                {proActiveOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.value.toLocaleString()} הודעות Pro Active</option>
                ))}
              </select>
            </div>
          </div>
          <div className="addon-pricing">
            <span className="addon-price" style={{ color: '#7c3aed' }}>₪{selectedProActive.price}</span>
            <span className="addon-period">לחודש</span>
          </div>
          <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(139,92,246,0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '12px', color: '#6d28d9' }}>
            👑 כלול בכל התוכניות • Growth = 25, Pro = 75, Business = 200 הודעות
          </div>
        </div>
      </div>

      {/* DIY vs Professional */}
      <div className="service-options-section">
        <div className="service-options-container">
          <div className="service-options-header">
            <h2 className="service-options-title">בחר את הדרך שלך</h2>
            <p className="service-options-subtitle">בין אם אתה מעדיף לעשות זאת בעצמך או לקבל עזרה מקצועית — אנחנו כאן בשבילך</p>
          </div>
          <div className="service-options-grid">
            <div className="service-option-card diy-card">
              <div className="service-option-icon"><FaLightbulb /></div>
              <h3 className="service-option-title">עשה זאת בעצמך (DIY)</h3>
              <p className="service-option-description">בחר חבילה, צור חשבון ועקוב אחר המדריך למשתמש שלנו</p>
              <ul className="service-option-features">
                <li><FaCheck className="check-icon" /> מחירי החבילות לעיל</li>
                <li><FaCheck className="check-icon" /> מדריך למשתמש מקיף</li>
                <li><FaCheck className="check-icon" /> שליטה מלאה</li>
                <li><FaCheck className="check-icon" /> תמיכה טכנית 24/7</li>
              </ul>
              <a href="https://gambot.co.il/OnboardingProcess" className="service-option-button primary">התחל עכשיו</a>
            </div>
            <div className="service-option-card professional-card">
              <div className="service-option-badge"><FaCrown /> מקצועי</div>
              <div className="service-option-icon"><FaRocket /></div>
              <h3 className="service-option-title">הטמעה ושירותים מקצועיים</h3>
              <p className="service-option-description">תן לצוות שלנו לטפל בהכל — מהקמה ועד אוטומציה</p>
              <ul className="service-option-features">
                <li><FaCheck className="check-icon" /> שירות הטמעה מלא (₪1,500 - ₪3,970 כולל CRM)</li>
                <li><FaCheck className="check-icon" /> בניית בוטים ואוטומציות</li>
                <li><FaCheck className="check-icon" /> שחזור היסטוריית וואטסאפ</li>
                <li><FaCheck className="check-icon" /> תמיכה ייעודית</li>
              </ul>
              <Link href="/PriceList/OnboardingServices/" className="service-option-button secondary">צפה בשירותים ומחירים</Link>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Message Pricing */}
      <div className="whatsapp-pricing-section">
        <div className="whatsapp-pricing-container">
          <div className="whatsapp-pricing-visual">
            <div className="pricing-icon-wrapper"><FaBolt className="highlight-icon" /></div>
          </div>
          <div className="whatsapp-pricing-content">
            <div className="pricing-badge">
              <MdTrendingUp className="badge-icon" />
              <span>תמחור חכם</span>
            </div>
            <h2 className="whatsapp-pricing-title">
              <span className="highlight">עלות הודעות</span> לפי תעריפי Meta
            </h2>
            <p className="whatsapp-pricing-description">
              בנוסף לחבילה החודשית, WhatsApp API גובה תשלום על הודעות לפי מדינה וסוג הודעה. התעריפים הם של Meta ישירות.
            </p>
            <div className="whatsapp-pricing-buttons">
              <Link href="/whatsapp-api-pricing/" className="whatsapp-pricing-button primary">
                <span>טבלת תמחור מלאה לפי מדינה</span>
              </Link>
              <Link href="/PriceList/WhatsAppMessagingPricingBlog/" className="whatsapp-pricing-button secondary">
                <FaMoneyBillWave className="button-icon" />
                <span>מדריך מחיר הודעות</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="success-icon"><FaCheck /></div>
              <h2 className="modal-title">בחירה מעולה!</h2>
              <p className="modal-subtitle">אתה קרוב להתחיל את המסע שלך איתנו</p>
            </div>
            <div className="modal-body">
              <div className="next-steps">
                <div className="step"><div className="step-number">1</div><span>יצירת חשבון מהיר וקל</span></div>
                <div className="step"><div className="step-number">2</div><span>הגדרת המערכת בליווי צמוד</span></div>
                <div className="step"><div className="step-number">3</div><span>התחלת שימוש ותמיכה מלאה</span></div>
              </div>
            </div>
            <div className="modal-actions">
              <a href="https://gambot.co.il/OnboardingProcess" className="primary-action-button">התחל עכשיו</a>
              <button className="secondary-action-button" onClick={() => setShowModal(false)}>אחר כך</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

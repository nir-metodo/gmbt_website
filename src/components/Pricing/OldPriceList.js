'use client';
import { useRouter } from 'next/navigation';

import { FaCheck, FaCheckCircle, FaCrown, FaStar, FaLightbulb, FaMoneyBillWave, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaBolt, FaRocket } from "react-icons/fa6"; 
import React, { useState, useCallback } from "react";
import "./OldPriceList.css";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdTrendingUp, MdVerified } from "react-icons/md";
import { useLanguage } from '@/contexts/LanguageContext';


const sessionOptions = [
  { value: 1000, price: 90 },
  { value: 2000, price: 180 },
  { value: 3000, price: 270 },
  { value: 5000, price: 450 },
  // { value: 7000, price: 525 },
  // { value: 10000, price: 525 }

];
// const sessionOptions = [
//   { value: 1000, price: 50 },
//   { value: 2000, price: 100 },
//   { value: 3000, price: 150 },
//   { value: 5000, price: 250 },
// ];

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

const plans = {
  monthly: [
     {
      name: "Growth",
      price: 179,
      yearlyPrice: 143 * 12,
      description: "למשתמשים טכנולוגיים בלבד — ללא סיוע אנושי",
      supportInfo: {
        color: '#718096', bg: '#f7fafc', border: '#e2e8f0',
        lines: ['❌ ללא תמיכה אישית', '📚 מרכז ידע / מדריכים בלבד'],
      },
      features: [
        "1 בוט / תהליך אוטומציה",
        "300 שיחות חדשות בחודש",
        "1,500 ריצות אוטומציה בחודש",
        "עד 3,000 אנשי קשר",
        "50 תגובות / פעולות AI (כל 500 נוספות 50 ש\"ח)",
        "⚡ 25 הודעות Pro Active (כל 25 נוספות 15 ש\"ח)",
        "2 משתמשים (כל משתמש נוסף 30 ש\"ח)",
        "❌ ללא תמיכה אנושית",
        "📚 מרכז ידע בלבד (סרטונים והדרכות)"
      ]
    },
      {
      name: "Pro",
      price: 359,
      yearlyPrice: 287 * 12,
      recommended: true,
      description: "הפתרון המושלם לעסקים צומחים",
      supportInfo: {
        color: '#128C7E', bg: '#f0fdf9', border: '#25D366',
        lines: ['✅ תמיכה בסיסית', '⏱️ מענה עד 48–72 שעות'],
      },
      features: [
        "3 בוטים / תהליכי אוטומציה",
        "1,000 שיחות חדשות בחודש",
        "5,000 ריצות אוטומציה בחודש",
        "עד 10,000 אנשי קשר",
        "300 תגובות / פעולות AI (כל 500 נוספות 50 ש\"ח)",
        "⚡ 75 הודעות Pro Active כלולות (כל 25 נוספות 15 ש\"ח)",
        "5 משתמשים (כל משתמש נוסף 30 ש\"ח)",
        "✅ תמיכה בסיסית בוואטסאפ — מענה עד 48 שעות"
      ]
    },
       {
      name: "Business",
      price: 645,
      yearlyPrice: 516 * 12,
      description: "פתרון ארגוני גמיש ומותאם",
      supportInfo: {
        color: '#128C7E', bg: '#f0fdf9', border: '#25D366',
        lines: ['⭐ תמיכה מועדפת', '⚡ מענה מהיר', '🎯 עדיפות בתור'],
      },
      features: [
        "6 בוטים / תהליכי אוטומציה",
        "3,000 שיחות חדשות בחודש",
        "15,000 ריצות אוטומציה בחודש",
        "עד 35,000 אנשי קשר",
        "1,000 תגובות / פעולות AI (כל 500 נוספות 50 ש\"ח)",
        "⚡ 200 הודעות Pro Active כלולות (כל 25 נוספות 15 ש\"ח)",
        "12 משתמשים (כל משתמש נוסף 30 ש\"ח)",
        "⭐ תמיכה מועדפת — מענה עד 24 שעות",
        "🗓️ שיחת ייעוץ חודשית"
      ]
    },
  ]
};

    const features  = [
      "התכתבות בזמן אמת",
      "ניהול טמפלטים",
      "ניהול קמפיינים",
      "ניהול WhatsApp Flows",
      "ניהול אנשי קשר",
      "ניהול הגדרות חשבון",
      "ניהול קטלוג",
      "יצירת תהליכי אוטומציה",
      "ניהול פרופיל WABA",
    ];

  const PriceList = () => {
  const [billingCycle, setBillingCycle] = useState("monthly"); 
  const router = useRouter();
  const { t, currentLanguage, translations } = useLanguage();
  
  // Currency conversion rate (shekel to dollar)
  const CONVERSION_RATE = 3.5;
  
  // Helper function to convert price and format currency
  const formatPrice = (price) => {
    if (currentLanguage === 'en') {
      return {
        currency: '$',
        amount: Math.round(price / CONVERSION_RATE)
      };
    }
    return {
      currency: '₪',
      amount: price
    };
  };
  
  // Get translated content
  
  // Get translated data with fallbacks
  const planFeatures = t('pricing.planFeatures');
  const planFeaturesArray = Array.isArray(planFeatures) ? planFeatures : [];
  
  const getplanFeatures = (planName) => {
    const features = t(`pricing.plans.${planName.toLowerCase()}.features`);
    return Array.isArray(features) ? features : [];
  };
  const getMoreFeatures = (planName) => {
    const features = t(`pricing.plans.${planName.toLowerCase()}.moreFeatures`);
    return Array.isArray(features) ? features : [];
  };
  const [expandedCards, setExpandedCards] = useState({});
  const toggleExpand = useCallback((planName) => {
    setExpandedCards(prev => ({ ...prev, [planName]: !prev[planName] }));
  }, []);
  const [selectedSessions, setSelectedSessions] = useState(sessionOptions[0]);
const [showModal, setShowModal] = useState(false);

  const handleSessionChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    const newSelection = sessionOptions.find((option) => option.value === selectedValue);
    setSelectedSessions(newSelection);
  };
  const handleNavigationPricingArticle = ()=>{
    router.push('/PriceList/WhatsAppMessagingPricingBlog');
  }
 
  const [selectedSessionsAI, setSelectedSessionsAI] = useState(sessionOptionsAI[0]);
  const [selectedProActive, setSelectedProActive] = useState(proActiveOptions[0]);
  const [showAiCalc, setShowAiCalc] = useState(false);
  const [calcServiceType, setCalcServiceType] = useState('support');
  const [calcConversations, setCalcConversations] = useState(300);
  const [calcAvgResponses, setCalcAvgResponses] = useState(3);
  const [calcPlan, setCalcPlan] = useState('pro');

  const servicePresets = {
    support:      { label: 'שירות לקוחות', avg: 6, desc: 'שאלות ותמיכה — לרוב שיחות ארוכות יותר' },
    leads:        { label: 'ניהול לידים', avg: 4, desc: 'הסמכת לידים, שאלות ממוקדות לפני העברה לנציג' },
    appointments: { label: 'תיאום פגישות', avg: 3, desc: 'שיחות קצרות וממוקדות — AI מנחה לבחירת זמן' },
  };
  const calcPlanIncluded = { growth: 50, pro: 300, business: 1000 };
  const calcPlanPrice    = { growth: 179, pro: 359, business: 645 };
  const calcPlanLabel    = { growth: 'Growth', pro: 'Pro', business: 'Business' };
  const totalAiMonthly   = calcConversations * calcAvgResponses;
  const includedAi       = calcPlanIncluded[calcPlan] || 0;
  const extraAi          = Math.max(0, totalAiMonthly - includedAi);
  const extraCost        = Math.ceil(extraAi / 500) * 50;
  const totalMonthlyCost = calcPlanPrice[calcPlan] + extraCost;

  const handleProActiveChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    const newSelection = proActiveOptions.find((option) => option.value === selectedValue);
    setSelectedProActive(newSelection);
  };

  const handleSessionChangeAI = (event) => {
    const selectedValueAI = parseInt(event.target.value, 10);
    const newSelectionAI = sessionOptionsAI.find((option) => option.value === selectedValueAI);
    setSelectedSessionsAI(newSelectionAI);
  };
  
  return (
    <div className="price-list-container">

      {/* ✨ Enhanced Hero Header with Visual Impact */}
      <div className="pricing-hero-section">
        <div className="pricing-hero-background">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>
        </div>
        
        <div className="pricing-hero-content">
          <div className="pricing-header-badge-new">
          <HiOutlineSparkles className="sparkle-icon" />
          <span>{t('pricing.ui.advancedFeatures')}</span>
        </div>
          
          <h1 className="pricing-hero-title">
            {currentLanguage === 'en' ? (
              <>Find Your <span className="highlight-gradient">Perfect Plan</span></>
            ) : (
              <>בחר את <span className="highlight-gradient">התוכנית המושלמת</span> לעסק שלך</>
            )}
          </h1>
          
          <p className="pricing-hero-subtitle">
            {currentLanguage === 'en' 
              ? 'Powerful WhatsApp automation and AI capabilities for businesses of all sizes'
              : 'אוטומציות WhatsApp מתקדמות ויכולות AI עוצמתיות לעסקים בכל הגדלים'}
          </p>
          
          {/* Value Propositions */}
          <div className="pricing-hero-features">
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <MdVerified />
              </div>
              <div className="hero-feature-text">
                <strong>{currentLanguage === 'en' ? 'Official Partner' : 'שותף רשמי'}</strong>
                <span>{currentLanguage === 'en' ? 'Meta Business Partner' : 'Meta Business Partner'}</span>
              </div>
            </div>
            
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <MdTrendingUp />
              </div>
              <div className="hero-feature-text">
                <strong>{currentLanguage === 'en' ? '24/7 Support' : 'תמיכה 24/7'}</strong>
                <span>{currentLanguage === 'en' ? 'Always here for you' : 'תמיד כאן בשבילך'}</span>
              </div>
            </div>
            
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <FaRocket />
              </div>
              <div className="hero-feature-text">
                <strong>{currentLanguage === 'en' ? 'Quick Setup' : 'התקנה מהירה'}</strong>
                <span>{currentLanguage === 'en' ? 'Get started in minutes' : 'תתחיל תוך דקות'}</span>
              </div>
          </div>
          </div>
        </div>
      </div>

      {/* Enhanced Billing Toggle */}
      <div className="billing-toggle-wrapper">
        <div className="billing-toggle-header">
          <h3>{t('pricing.billingCycle.title')}</h3>
          <p>{t('pricing.billingCycle.subtitle')}</p>
        </div>
        <div className="billing-toggle">
          <button
            className={billingCycle === "monthly" ? "active" : ""}
            onClick={() => setBillingCycle("monthly")}
          >
            <span className="toggle-label">{t('pricing.billingCycle.monthly')}</span>
            <span className="toggle-desc">{t('pricing.billingCycle.monthlyDesc')}</span>
          </button>
          <button
            className={billingCycle === "yearly" ? "active" : ""}
            onClick={() => setBillingCycle("yearly")}
          >
            <span className="toggle-label">{t('pricing.billingCycle.yearly')}</span>
            <span className="toggle-desc">{t('pricing.billingCycle.yearlyDesc')}</span>
            <span className="discount-badge">{t('pricing.billingCycle.recommended')}</span>
          </button>
        </div>
      </div>

      {/* Enhanced Pricing Cards */}
      <div className="plans-container">
        {plans.monthly.map((plan, index) => (
          <div key={index} className={`plan-card ${plan.recommended ? "recommended" : ""}`}>
            {plan.recommended && (
              <div className="recommended-badge">
                <FaCrown className="crown-icon" />
                <span>{t('pricing.ui.mostRecommended')}</span>
              </div>
            )}
            
            <div className="plan-header">
              <div className="plan-icon">
                {plan.name === "Growth" && <FaLightbulb />}
                {plan.name === "Pro" && <FaStar />}
                {plan.name === "Business" && <FaRocket />}
              </div>
              <h3 className="plan-name">{t(`pricing.plans.${plan.name.toLowerCase()}.name`)}</h3>
              <p className="plan-description">{t(`pricing.plans.${plan.name.toLowerCase()}.description`)}</p>
            </div>

            <div className="plan-pricing">
              <div className="plan-price">
                <span className="currency">{formatPrice(plan.price).currency}</span>
                <span className="amount">
                  {billingCycle === "monthly" 
                    ? formatPrice(plan.price).amount 
                    : formatPrice(plan.yearlyPrice / 12).amount
                  }
                </span>
                <span className="period">{t('pricing.ui.perMonth')}</span>
              </div>
              
              {billingCycle === "yearly" && (
                <div className="plan-yearly">
                  <span>{t('pricing.ui.yearlyBilling')}: {formatPrice(plan.yearlyPrice).currency}{formatPrice(plan.yearlyPrice).amount.toLocaleString()}</span>
                  <span className="savings">{t('pricing.ui.save')} {formatPrice((plan.price * 12) - plan.yearlyPrice).currency}{formatPrice((plan.price * 12) - plan.yearlyPrice).amount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className={`plan-button ${plan.recommended ? 'primary' : 'secondary'}`}
            >
              {t('pricing.ui.selectPlan')}
            </button>

            {/* Support row */}
            {plan.supportInfo && (
              <div style={{
                margin: '16px 0 4px',
                padding: '12px 14px',
                background: plan.supportInfo.bg,
                border: `1px solid ${plan.supportInfo.border}`,
                borderRadius: '10px',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: plan.supportInfo.color, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🛡️ תמיכה
                </div>
                {plan.supportInfo.lines.map((line, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: '#2d3748', fontWeight: 500, lineHeight: 1.6 }}>{line}</div>
                ))}
              </div>
            )}

            <div className="plan-features">
              <h4>{t('pricing.ui.includes')}</h4>
              <ul>
                {getplanFeatures(plan.name).map((feature, i) => (
                  <li key={i}>
                    <FaCheck className="feature-check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {getMoreFeatures(plan.name).length > 0 && (
                <>
                  <button
                    className="plan-expand-toggle"
                    onClick={() => toggleExpand(plan.name)}
                  >
                    {expandedCards[plan.name]
                      ? <><FaChevronUp /> {currentLanguage === 'en' ? 'Show less' : 'הצג פחות'}</>
                      : <><FaChevronDown /> {currentLanguage === 'en' ? `+${getMoreFeatures(plan.name).length} CRM features` : `+${getMoreFeatures(plan.name).length} יכולות CRM`}</>
                    }
                  </button>
                  {expandedCards[plan.name] && (
                    <ul className="plan-more-features">
                      {getMoreFeatures(plan.name).map((feature, i) => (
                        <li key={i}>
                          <FaCheck className="feature-check" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Enterprise Row ─── */}
      <div style={{ maxWidth: '960px', margin: '0 auto 12px', padding: '0 24px' }}>
        <a
          href="https://wa.me/97233768997?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%97%D7%91%D7%99%D7%9C%D7%AA%20Enterprise"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2d3748 100%)',
            borderRadius: '12px',
            padding: '14px 24px',
            textDecoration: 'none',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '0' }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🏢</span>
            <div>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>Enterprise</span>
              <span className="enterprise-desc" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', display: 'block', marginTop: '2px' }}>
                מעל 35,000 אנשי קשר? מעל 12 משתמשים? נבנה חבילה מותאמת אישית
              </span>
            </div>
          </div>
          <span style={{
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            color: 'white',
            padding: '7px 18px',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            💬 צרו איתנו קשר
          </span>
        </a>
      </div>

      {/* Invoice note */}
      <div style={{ maxWidth: '960px', margin: '-8px auto 24px', padding: '0 24px' }}>
        <p style={{ fontSize: '0.78rem', color: '#718096', textAlign: 'center' }}>
          * חשבוניות: המערכת תומכת כרגע בחשבוניות עד ₪10,000 לחשבונית בודדת
        </p>
      </div>

      {/* Enhanced Features Section */}
      <div className="pricing-features-container">
        <div className="features-header">
          <div className="features-badge">
            <MdVerified className="badge-icon" />
            <span>{t('pricing.ui.includedInAll')}</span>
          </div>
          <h2 className="pricing-features-title">{t('pricing.ui.allPlansInclude')}</h2>
          <p className="features-subtitle">{t('pricing.ui.advancedFeatures')}</p>
        </div>
        <div className="pricing-features-grid">
          {planFeaturesArray.map((feature, index) => (
            <div key={index} className="pricing-feature-item">
              <div className="feature-icon-wrapper">
                <FaCheckCircle className="feature-icon" />
              </div>
              <span className="feature-text">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* API Integration Notice - COMMENTED OUT FOR NOW */}
        {/* <div className="api-integration-notice">
          <div className="notice-icon">
            <FaBolt />
          </div>
          <div className="notice-content">
            <h3 className="notice-title">
              {currentLanguage === 'en' ? 'External API Integrations' : 'התממשקות API לחבילות חיצוניות'}
            </h3>
            <p className="notice-text">
              {currentLanguage === 'en' 
                ? 'All packages do not include external API integrations (such as Google Sheets, CRM systems, etc.). These integrations are available for an additional fee.'
                : 'כל החבילות לא כוללות התממשקות API לחבילות חיצוניות (כגון Google Sheets, מערכות CRM וכו\'). התממשקויות אלו זמינות בתשלום נוסף.'}
            </p>
          </div>
        </div> */}
      </div>



      {/* Enhanced Chatbot Add-on - COMMENTED OUT */}
      {/* <div className="addon-section">
        <div className="addon-container chatbot-addon">
          <div className="addon-header">
            <div className="addon-icon">
              <FaBolt />
            </div>
            <h2 className="addon-title">{t('pricing.addons.chatbotTitle')}</h2>
            <p className="addon-subtitle">{t('pricing.addons.chatbotSubtitle')}</p>
          </div>
          
          <div className="addon-selector">
            <label htmlFor="sessions-select">{t('pricing.addons.selectSessions')}</label>
            <div className="select-wrapper">
              <select 
                id="sessions-select"
                value={selectedSessions.value} 
                onChange={handleSessionChange}
                className="addon-select"
              >
                {sessionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value.toLocaleString()} {t('pricing.addons.sessions')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="addon-pricing">
            <span className="addon-price">{formatPrice(selectedSessions.price).currency}{formatPrice(selectedSessions.price).amount}</span>
            <span className="addon-period">{t('pricing.ui.perMonth')}</span>
          </div>
        </div>
      </div> */}



      {/* Enhanced AI Add-on */}
      <div className="addon-section">
        <div className="addon-container ai-addon">
          <div className="addon-header">
            <div className="addon-icon ai-icon">
              <FaRocket />
            </div>
            <h2 className="addon-title">{t('pricing.addons.aiTitle')}</h2>
            <p className="addon-subtitle">{t('pricing.addons.aiSubtitle')}</p>
          </div>
          
          <div className="addon-selector">
            <label htmlFor="ai-sessions-select">{t('pricing.addons.selectAISessions')}</label>
            <div className="select-wrapper">
              <select 
                id="ai-sessions-select"
                value={selectedSessionsAI.value} 
                onChange={handleSessionChangeAI}
                className="addon-select ai-select"
              >
                {sessionOptionsAI.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value.toLocaleString()} {t('pricing.addons.aiSessions')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="addon-pricing">
            <span className="addon-price">{formatPrice(selectedSessionsAI.price).currency}{formatPrice(selectedSessionsAI.price).amount}</span>
            <span className="addon-period">{t('pricing.ui.perMonth')}</span>
          </div>
          <button className="ai-calc-trigger-btn" onClick={() => setShowAiCalc(true)}>
            🧮 &nbsp;מחשבון תגובות AI — כמה תצטרכו בחודש?
          </button>
        </div>
      </div>

      {/* AI Calculator Modal */}
      {showAiCalc && (
        <div className="ai-calc-overlay" onClick={() => setShowAiCalc(false)}>
          <div className="ai-calc-modal" dir="rtl" onClick={e => e.stopPropagation()}>
            <button className="ai-calc-close" onClick={() => setShowAiCalc(false)}>✕</button>
            <div className="ai-calc-header">
              <span className="ai-calc-header-icon">🧮</span>
              <h2>מחשבון תגובות AI</h2>
              <p>הבינו כמה תגובות AI תצטרכו בחודש ומה יהיה העלות הנוספת</p>
            </div>

            <div className="ai-calc-section">
              <label className="ai-calc-label">1. סוג השירות שלכם</label>
              <div className="ai-calc-service-grid">
                {Object.entries(servicePresets).map(([key, s]) => (
                  <button key={key}
                    className={`ai-calc-service-btn${calcServiceType === key ? ' active' : ''}`}
                    onClick={() => { setCalcServiceType(key); setCalcAvgResponses(s.avg); }}>
                    <span className="ai-calc-service-icon">{key === 'support' ? '🎧' : key === 'leads' ? '🎯' : '📅'}</span>
                    <span className="ai-calc-service-label">{s.label}</span>
                    <span className="ai-calc-service-avg">~{s.avg} תגובות AI לשיחה</span>
                    <span className="ai-calc-service-desc">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ai-calc-section">
              <label className="ai-calc-label">
                2. כמה שיחות חדשות בחודש?
                <span className="ai-calc-value-badge">{calcConversations.toLocaleString()}</span>
              </label>
              <input type="range" min={50} max={5000} step={50} value={calcConversations}
                onChange={e => setCalcConversations(Number(e.target.value))} className="ai-calc-slider" />
              <div className="ai-calc-slider-labels"><span>50</span><span>1,000</span><span>2,500</span><span>5,000</span></div>
            </div>

            <div className="ai-calc-section">
              <label className="ai-calc-label">
                3. ממוצע תגובות AI לשיחה
                <span className="ai-calc-value-badge">{calcAvgResponses}</span>
              </label>
              <input type="range" min={1} max={15} step={1} value={calcAvgResponses}
                onChange={e => setCalcAvgResponses(Number(e.target.value))} className="ai-calc-slider" />
              <div className="ai-calc-slider-labels"><span>1</span><span>5</span><span>10</span><span>15</span></div>
              <div className="ai-calc-tip">
                💡 <strong>המלצת גמבוט:</strong> 2–3 תשובות AI ראשונות לשיחה — הבוט מכוון את הלקוח מההתחלה ו-AI קורא את ההיסטוריה כך שהתשובות הראשונות הן הכי אפקטיביות.
              </div>
              <div className="ai-calc-settings-note">
                ⚙️ <strong>טיפ:</strong> בהגדרות המערכת ניתן להגביל את מספר תגובות ה-AI המקסימלי לשיחה — כך תשלטו בצריכה ולא תגיעו להפתעות בחיוב.
              </div>
            </div>

            <div className="ai-calc-section">
              <label className="ai-calc-label">4. החבילה שלכם</label>
              <div className="ai-calc-plan-row">
                {Object.entries(calcPlanLabel).map(([key, label]) => (
                  <button key={key}
                    className={`ai-calc-plan-btn${calcPlan === key ? ' active' : ''}`}
                    onClick={() => setCalcPlan(key)}>
                    {label}
                    <span>{calcPlanIncluded[key].toLocaleString()} AI כלול</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`ai-calc-result${extraCost === 0 ? ' result-ok' : extraCost > 200 ? ' result-high' : ''}`}>
              <div className="ai-calc-result-row"><span>סה&quot;כ תגובות AI חודשיות</span><strong>{totalAiMonthly.toLocaleString()}</strong></div>
              <div className="ai-calc-result-row"><span>כלול בחבילת {calcPlanLabel[calcPlan]}</span><strong>{includedAi.toLocaleString()}</strong></div>
              <div className={`ai-calc-result-row${extraAi > 0 ? ' extra' : ''}`}><span>תגובות נוספות נדרשות</span><strong>{extraAi.toLocaleString()}</strong></div>
              <div className="ai-calc-result-divider" />
              <div className="ai-calc-result-row total"><span>תוספת חודשית בגין AI</span><strong className="ai-calc-cost">₪{extraCost}</strong></div>
              <div className="ai-calc-result-row grand-total"><span>סה&quot;כ עלות חודשית משוערת</span><strong className="ai-calc-grand">₪{totalMonthlyCost.toLocaleString()}</strong></div>
              {extraCost === 0 && <div className="ai-calc-ok-msg">✅ הכמות הזו כלולה בחבילה שלכם — אין תוספת עלות!</div>}
            </div>

            <a href="/PriceList/OnboardingServices" className="ai-calc-cta">לתחילת ניסיון חינם ←</a>
          </div>
        </div>
      )}

      {/* ⚡ Pro Active Add-on */}
      <div className="addon-section">
        <div className="addon-container" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', borderColor: '#8b5cf6' }}>
          <div className="addon-header">
            <div className="addon-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
              <FaBolt />
            </div>
            <h2 className="addon-title">
              {currentLanguage === 'en' ? '⚡ Pro Active Messages' : '⚡ הודעות Pro Active'}
            </h2>
            <p className="addon-subtitle">
              {currentLanguage === 'en' 
                ? 'AI-powered smart follow-ups sent automatically to your contacts'
                : 'פולואפ חכם מבוסס AI שנשלח אוטומטית לאנשי הקשר שלך'}
            </p>
          </div>
          
          <div className="addon-selector">
            <label htmlFor="proactive-select">
              {currentLanguage === 'en' ? 'Select Pro Active messages:' : 'בחר הודעות Pro Active נוספות:'}
            </label>
            <div className="select-wrapper">
              <select 
                id="proactive-select"
                value={selectedProActive.value} 
                onChange={handleProActiveChange}
                className="addon-select"
                style={{ borderColor: '#8b5cf6' }}
              >
                {proActiveOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value.toLocaleString()} {currentLanguage === 'en' ? 'Pro Active messages' : 'הודעות Pro Active'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="addon-pricing">
            <span className="addon-price" style={{ color: '#7c3aed' }}>{formatPrice(selectedProActive.price).currency}{formatPrice(selectedProActive.price).amount}</span>
            <span className="addon-period">{t('pricing.ui.perMonth')}</span>
          </div>

          <div style={{ 
            marginTop: '12px', padding: '10px 14px', background: 'rgba(139, 92, 246, 0.1)', 
            borderRadius: '8px', textAlign: 'center', fontSize: '12px', color: '#6d28d9' 
          }}>
            {currentLanguage === 'en' 
              ? '👑 Included in all plans • Growth = 25, Pro = 75, Business = 200 messages'
              : '👑 כלול בכל התוכניות • Growth = 25, Pro = 75, Business = 200 הודעות'}
          </div>
        </div>
      </div>

      {/* ─── Support Plus Add-on ─── */}
      <div className="addon-section">
        <div className="addon-container" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d3748 100%)', borderColor: '#25D366', padding: 0, overflow: 'hidden' }}>
          <div className="support-plus-grid">
            {/* Left — price */}
            <div className="support-plus-price-col">
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Support Plus</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#25D366', marginBottom: '6px' }}>₪</span>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: '#25D366', lineHeight: 1 }}>650</span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>/חודש</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>תוספת לכל חבילה קיימת</div>
              <a
                href="https://wa.me/97233768997?text=%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%94%D7%95%D7%A1%D7%99%D7%A3%20Support%20Plus"
                target="_blank" rel="noopener noreferrer"
                style={{ marginTop: '8px', background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', padding: '9px 18px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                💬 הוסיפו עכשיו
              </a>
            </div>
            {/* Right — features */}
            <div className="support-plus-features-col">
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>🛡️ מה כלול ב-Support Plus</div>
              <ul className="support-plus-features-list">
                {['⚡ מענה עד 4 שעות בימי עסקים', '📱 וואטסאפ ישיר לנציג ייעודי', '🎯 עדיפות בתור הטיפול', '🗓️ שיחת ייעוץ חודשית (30 דק׳)', '🔧 ליווי בהגדרות ושאלות שימוש'].map((f, i) => (
                  <li key={i} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Support Explanation ─── */}
      <div style={{ padding: '48px 16px', background: '#f8fafc', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>📋 מה כלול בתמיכה?</h2>
          <p style={{ textAlign: 'center', color: '#718096', marginBottom: '32px', fontSize: '0.95rem' }}>הגדרנו בשקיפות מלאה מה התמיכה כוללת — ומה לא</p>
          <div className="support-explain-grid">
            {[
              {
                icon: '✅', title: 'כלול בתמיכה', bg: '#f0fdf9', border: '#25D366', color: '#128C7E',
                items: ['מענה לשאלות על שימוש במערכת', 'עזרה בהגדרות קיימות', 'הסבר על פיצ׳רים', 'פתרון תקלות טכניות', 'הכוונה כללית לשימוש נכון']
              },
              {
                icon: '❌', title: 'לא כלול בתמיכה', bg: '#fafafa', border: '#e2e8f0', color: '#4a5568',
                items: ['בניית בוטים ואוטומציות חדשות', 'עיצוב תהליכים עסקיים', 'הקמת קמפיינים', 'חיבור מערכות חיצוניות', 'הדרכת עובדים / onboarding', 'ייעוץ שיווקי או עסקי']
              },
              {
                icon: '🔧', title: 'שירותים נוספים', bg: '#f8fafc', border: '#cbd5e0', color: '#2d3748',
                items: ['פיתוח והתאמות — ₪400/שעה + מע״מ', 'הדרכת עובדים — החל מ-₪600', 'שיחת ייעוץ חד-פעמית — ₪400 + מע״מ', 'בניית בוטים / אוטומציות — לפי היקף'],
                note: '* המנוי הוא על המערכת. שירותים נוספים תמיד בתשלום נפרד.'
              }
            ].map((box, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', background: box.bg, borderBottom: `1px solid ${box.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{box.icon}</span>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e' }}>{box.title}</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: '16px 18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {box.items.map((item, j) => (
                    <li key={j} style={{ fontSize: '0.85rem', color: '#4a5568', paddingRight: '12px', position: 'relative', lineHeight: 1.5 }}>
                      <span style={{ position: 'absolute', right: 0, color: '#a0aec0' }}>•</span>{item}
                    </li>
                  ))}
                </ul>
                {box.note && <p style={{ padding: '0 18px 14px', margin: 0, fontSize: '0.75rem', color: '#718096', fontStyle: 'italic' }}>{box.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✨ DIY vs Professional Services Section - Enhanced */}
      <div className="service-options-section">
        <div className="service-options-container">
          <div className="service-options-header">
            <h2 className="service-options-title">
              {currentLanguage === 'en' ? 'Choose Your Path' : 'בחר את הדרך שלך'}
            </h2>
            <p className="service-options-subtitle">
              {currentLanguage === 'en' 
                ? 'Whether you prefer to do it yourself or get professional help - we\'ve got you covered'
                : 'בין אם אתה מעדיף לעשות זאת בעצמך או לקבל עזרה מקצועית - אנחנו כאן בשבילך'}
            </p>
          </div>

          <div className="service-options-grid">
            <div className="service-option-card diy-card">
              <div className="service-option-icon">
                <FaLightbulb />
              </div>
              <h3 className="service-option-title">
                {currentLanguage === 'en' ? 'Do It Yourself (DIY)' : 'עשה זאת בעצמך (DIY)'}
              </h3>
              <p className="service-option-description">
                {currentLanguage === 'en'
                  ? 'Choose a package, create an account, and follow our user guide to set everything up yourself'
                  : 'בחר חבילה, צור חשבון ועקוב אחר המדריך למשתמש שלנו כדי להגדיר הכל בעצמך'}
              </p>
              <ul className="service-option-features">
                <li><FaCheck className="check-icon" /> {currentLanguage === 'en' ? 'Package pricing above' : 'מחירי החבילות לעיל'}</li>
                <li><FaCheck className="check-icon" /> {currentLanguage === 'en' ? 'Comprehensive user guide' : 'מדריך למשתמש מקיף'}</li>
                <li><FaCheck className="check-icon" /> {currentLanguage === 'en' ? 'Full control' : 'שליטה מלאה'}</li>
                <li><FaCheck className="check-icon" /> {currentLanguage === 'en' ? '24/7 technical support' : 'תמיכה טכנית 24/7'}</li>
              </ul>
              <button 
                onClick={() => router.push('/OnboardingProcess')}
                className="service-option-button primary"
              >
                {currentLanguage === 'en' ? 'Start Now' : 'התחל עכשיו'}
              </button>
            </div>

            <div className="service-option-card professional-card">
              <div className="service-option-badge">
                <FaCrown /> {currentLanguage === 'en' ? 'Professional' : 'מקצועי'}
              </div>
              <div className="service-option-icon">
                <FaRocket />
              </div>
              <h3 className="service-option-title">
                {currentLanguage === 'en' ? 'Professional Setup & Services' : 'הטמעה ושירותים מקצועיים'}
              </h3>
              <p className="service-option-description">
                {currentLanguage === 'en'
                  ? 'Let our team handle everything - from setup to automation, we\'ll get you up and running'
                  : 'תן לצוות שלנו לטפל בהכל - מהקמה ועד אוטומציה, נקים אותך ונפעיל'}
              </p>
              <ul className="service-option-features">
                <li><FaCheck className="check-icon" /> {currentLanguage === 'en' ? 'Full onboarding service' : 'שירות הטמעה מלא'}</li>
                <li><FaCheck className="check-icon" /> {currentLanguage === 'en' ? 'Bot & automation building' : 'בניית בוטים ואוטומציות'}</li>
                <li><FaCheck className="check-icon" /> {currentLanguage === 'en' ? 'WhatsApp history recovery' : 'שחזור היסטוריית וואטסאפ'}</li>
                <li><FaCheck className="check-icon" /> {currentLanguage === 'en' ? 'Dedicated support' : 'תמיכה ייעודית'}</li>
              </ul>
              <button 
                onClick={() => router.push('/PriceList/OnboardingServices')}
                className="service-option-button secondary"
              >
                {currentLanguage === 'en' ? 'View Services & Pricing' : 'צפה בשירותים ומחירים'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced WhatsApp Pricing Section */}
      <div className="whatsapp-pricing-section">
        <div className="whatsapp-pricing-container">
          <div className="whatsapp-pricing-visual">
            <div className="pricing-icon-wrapper">
              <FaBolt className="highlight-icon" />
            </div>
            <div className="pricing-graphic">
              <div className="message-flow">
                <div className="message-bubble">{t('pricing.whatsappPricing.messageBubble')}</div>
                <div className="arrow">→</div>
                <div className="price-bubble">{t('pricing.whatsappPricing.paymentBubble')}</div>
              </div>
            </div>
          </div>
          
          <div className="whatsapp-pricing-content">
            <div className="pricing-badge">
              <MdTrendingUp className="badge-icon" />
              <span>{t('pricing.whatsappPricing.smartPricingBadge')}</span>
            </div>
            <h2 className="whatsapp-pricing-title">
              <span className="highlight">{t('pricing.whatsappPricing.title')}</span>{t('pricing.whatsappPricing.titleSuffix')}
            </h2>
            <p className="whatsapp-pricing-description">
              {t('pricing.whatsappPricing.description')}
            </p>
            <div className="whatsapp-pricing-buttons">
              <button 
                onClick={handleNavigationPricingArticle} 
                className="whatsapp-pricing-button primary"
              >
                <span>{t('pricing.whatsappPricing.learnMoreButton')}</span>
              </button>
              <button 
                onClick={() => router.push('/PriceList/MetaPricing')} 
                className="whatsapp-pricing-button secondary"
              >
                <FaMoneyBillWave className="button-icon" />
                <span>{t('pricing.whatsappPricing.viewPricingTable')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="success-icon">
                <FaCheck />
              </div>
              <h2 className="modal-title">{t('pricing.modal.title')}</h2>
              <p className="modal-subtitle">{t('pricing.modal.subtitle')}</p>
            </div>
            
            <div className="modal-body">
              <div className="next-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <span>{t('pricing.modal.step1')}</span>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <span>{t('pricing.modal.step2')}</span>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <span>{t('pricing.modal.step3')}</span>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                className="primary-action-button"
                onClick={() => {
                  setShowModal(false);
                  router.push("/OnboardingProcess");
                }}
              >
                <span>{t('pricing.modal.startNow')}</span>
              </button>
              <button
                className="secondary-action-button"
                onClick={() => setShowModal(false)}
              >
                {t('pricing.modal.later')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceList;

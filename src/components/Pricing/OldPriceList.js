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
      price: 143,
      yearlyPrice: 115 * 12, 
      description: "חבילת הבסיס לעסק שלכם",
      features: [
        "1 בוט / תהליך אוטומציה",
        "500 שיחות חדשות בחודש",
        "120 תגובות / פעולות AI (כל 500 נוספות 50 ש\"ח)",
        "⚡ 25 הודעות Pro Active כלולות (כל 25 נוספות 15 ש\"ח)",
        "3 משתמשים (כל משתמש נוסף 30 ש\"ח)",
        "תמיכה בסיסית"
      ]
    },
      {
      name: "Pro",
      price: 287,
      yearlyPrice: 230 * 12, 
      recommended: true,
      description: "חבילת הפרימיום לעסק שלכם",
      features: [
        "2 בוטים / תהליכי אוטומציה",
        "1000 שיחות חדשות בחודש",
        "300 תגובות / פעולות AI (כל 500 נוספות 50 ש\"ח)",
        "⚡ 50 הודעות Pro Active כלולות (כל 25 נוספות 15 ש\"ח)",
        "5 משתמשים (כל משתמש נוסף 30 ש\"ח)",
        "תמיכה משופרת"
      ]
    },
       {
      name: "Business",
      price: 865,
      yearlyPrice: 692 * 12, 
      description: "חבילה מותאמת לארגון גדול",
      features: [
        "3 בוטים / תהליכי אוטומציה",
        "2000 שיחות חדשות בחודש",
        "1250 תגובות / פעולות AI (כל 500 נוספות 50 ש\"ח)",
        "⚡ 150 הודעות Pro Active כלולות (כל 25 נוספות 15 ש\"ח)",
        "8 משתמשים (כל משתמש נוסף 30 ש\"ח)",
        "תמיכה עדיפה"
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
        </div>
      </div>

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
              ? '👑 Included in all plans • Growth = 25, Pro = 50, Business = 150 messages'
              : '👑 כלול בכל התוכניות • Growth = 25, Pro = 50, Business = 150 הודעות'}
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

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

// 🔌 API / MCP metered plans — for developers & AI agents that call Gambot programmatically.
// Billed by traffic (credits): each call to Gambot and back consumes credits by type.
const apiMcpPlans = [
  { name: 'API Starter', credits: 2500, price: 250 },
  { name: 'API Growth', credits: 10000, price: 1000, recommended: true },
  { name: 'API Scale', credits: 40000, price: 4000 },
  { name: 'API Enterprise', credits: 150000, price: 15000 },
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
        "💾 2 GB אחסון קבצים (כל GB נוסף 5 ש\"ח)",
        "50 תגובות AI (כל 500 נוספות 50 ש\"ח)",
        "🔮 25 טוקנים כלליים AI (כל 100 נוספים 49 ש\"ח)",
        "📱 1 מספר טלפון וואטסאפ כלול (כל מספר נוסף 119 ש\"ח)",
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
        "💾 10 GB אחסון קבצים (כל GB נוסף 5 ש\"ח)",
        "300 תגובות AI (כל 500 נוספות 50 ש\"ח)",
        "🔮 100 טוקנים כלליים AI (כל 100 נוספים 49 ש\"ח)",
        "📱 1 מספר טלפון וואטסאפ כלול (כל מספר נוסף 119 ש\"ח)",
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
        "💾 50 GB אחסון קבצים (כל GB נוסף 5 ש\"ח)",
        "1,000 תגובות AI (כל 500 נוספות 50 ש\"ח)",
        "🔮 300 טוקנים כלליים AI (כל 100 נוספים 49 ש\"ח)",
        "📱 1 מספר טלפון וואטסאפ כלול (כל מספר נוסף 119 ש\"ח)",
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
              {/* VAT is Israel-specific — only shown on the Hebrew (ILS) view, not the international USD view. */}
              {currentLanguage !== 'en' && (
                <div className="vat-note">* המחירים אינם כוללים מע״מ</div>
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
                {getplanFeatures(plan.name).map((feature, i) => {
                  const isConversations = /שיחות[\s\S]*בחודש/.test(feature) || /conversations per month/i.test(feature);
                  const isBroadcast = /הודעות דיוור/.test(feature) || /broadcast messages/i.test(feature);
                  const isAiResponses = /תגובות\s*AI/i.test(feature) || /AI responses/i.test(feature);
                  const isGeneralTokens = /טוקנים\s*כלליים/i.test(feature) || /general (ai )?tokens/i.test(feature);
                  const isCredits = /קרדיט/i.test(feature) || /\bcredits?\b/i.test(feature);
                  const convTooltip = currentLanguage === 'en'
                    ? '1 conversation = all messaging with a single person within a 24-hour window. From the moment someone reaches out, the entire exchange with them during those 24 hours counts as a single conversation.'
                    : 'שיחה 1 נחשבת התקשרות עם אדם אחד למשך 24 שעות. כלומר, מהרגע שמישהו פונה — כל ההתכתבות איתו במסגרת אותן 24 שעות נחשבת שיחה אחת.';
                  const broadcastTooltip = currentLanguage === 'en'
                    ? 'Broadcast messages = bulk mailing to many recipients. E.g. you upload an Excel and send one message to 100 people, then two weeks later to another 200 — that counts as 300 broadcast messages. The quota applies to each channel separately (WhatsApp and/or Email) — e.g. up to 5,000 on each channel.'
                    : 'הודעות דיוור = שליחה בתפוצה רחבה לנמענים רבים. לדוגמה: העליתם אקסל ושלחתם הודעה אחת ל-100 איש, וכעבור שבועיים עוד 200 — זה נחשב 300 הודעות דיוור. המכסה חלה על כל ערוץ בנפרד (וואטסאפ ו/או מייל) — למשל עד 5,000 בכל ערוץ.';
                  const aiResponsesTooltip = currentLanguage === 'en'
                    ? 'AI responses = replies your AI bot generates to customers. Each reply consumes credits by the model used and the amount of context/knowledge involved — heavier replies cost more.'
                    : 'תגובות AI = התשובות שהבוט מייצר ללקוחות. כל תשובה צורכת קרדיטים לפי המודל שנבחר וכמות ההקשר/הידע בשימוש — תשובות "כבדות" עולות יותר.';
                  const generalTokensTooltip = currentLanguage === 'en'
                    ? 'General AI tokens power advanced AI actions beyond replies — proactive messages, AI reports, data analysis and smart summaries. Each action consumes tokens by its size.'
                    : 'טוקנים כלליים AI מפעילים פעולות AI מתקדמות מעבר לתשובות — הודעות פרואקטיביות, בניית דוחות, ניתוח נתונים וסיכומים חכמים. כל פעולה צורכת טוקנים לפי גודלה.';
                  const creditsTooltip = currentLanguage === 'en'
                    ? 'AI credits are one unified pool for ALL AI usage — bot replies plus proactive messages, reports, analysis and summaries. Each action draws credits by the model used and its size; heavier/premium usage costs more. Extra: ₪39 per 500 credits.'
                    : 'קרדיטים AI הם מאגר אחד מאוחד לכל שימושי ה‑AI — תשובות הבוט וגם הודעות פרואקטיביות, דוחות, ניתוח וסיכומים. כל פעולה צורכת קרדיטים לפי המודל והגודל; שימוש כבד/מודל יקר עולה יותר. תוספת: ₪39 לכל 500 קרדיטים.';
                  const tooltip = isConversations ? convTooltip : (isBroadcast ? broadcastTooltip : (isCredits ? creditsTooltip : (isAiResponses ? aiResponsesTooltip : (isGeneralTokens ? generalTokensTooltip : null))));
                  // AI/credit lines link to the full "Gambot Tokens (Credits)" guide (posts.js id 44).
                  const tooltipHasLink = isCredits || isAiResponses || isGeneralTokens;
                  const creditsBlogUrl = currentLanguage === 'en'
                    ? '/blog/44/gambot-tokens-credits-how-to-calculate-and-estimate-your-ai-usage/'
                    : '/blog/44/טוקני-גמבוט-קרדיטים-איך-מחשבים-ומעריכים-כמה-ai-תצרכו/';
                  return (
                    <li key={i}>
                      <FaCheck className="feature-check" />
                      <span className="feature-text">
                        {feature}
                        {tooltip && (
                          <span
                            className="feature-info"
                            tabIndex={0}
                            role="button"
                            aria-label={tooltip}
                          >
                            ?
                            <span
                              className={`feature-tooltip${tooltipHasLink ? ' has-link' : ''}`}
                              role="tooltip"
                              dir={currentLanguage === 'en' ? 'ltr' : 'rtl'}
                            >
                              {tooltip}
                              {tooltipHasLink && (
                                <>
                                  {' '}
                                  <a className="feature-tooltip-link" href={creditsBlogUrl}>
                                    {currentLanguage === 'en' ? 'Learn more →' : 'להרחבה — מדריך הטוקנים ←'}
                                  </a>
                                </>
                              )}
                            </span>
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
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

      {/* 🔌 API / MCP metered plans — quantity (credits) per package */}
      <div style={{ maxWidth: '960px', margin: '0 auto 32px', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '1px solid #6366f1', borderRadius: '16px', padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#312e81', margin: 0 }}>
              {currentLanguage === 'en' ? '🔌 API / MCP Plans' : '🔌 מסלולי API / MCP'}
              <span
                title={currentLanguage === 'en'
                  ? 'API/MCP is billed by traffic (credits): every call to Gambot and back consumes credits by type — a regular API call ×1, an MCP call ×2, an AI action ×12, a bulk/export ×4 (₪0.10 per credit). Pick a monthly credit bundle; usage beyond it is billed per credit +~30%.'
                  : 'חיוב API/MCP לפי תעבורה (קרדיטים): כל קריאה ל-Gambot וחזרה צורכת קרדיטים לפי הסוג — קריאת API רגילה ×1, קריאת MCP ×2, פעולת AI ×12, פעולת Bulk/ייצוא ×4 (₪0.10 לקרדיט). בוחרים חבילת קרדיטים חודשית; חריגה מעבר לחבילה מחויבת לפי מחיר קרדיט + ~30%.'}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: '#6366f1', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'help' }}
              >?</span>
            </h2>
            <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#4338ca' }}>
              {currentLanguage === 'en'
                ? 'For developers & AI agents that call Gambot programmatically — billed by traffic (credits).'
                : 'למפתחים וסוכני AI שקוראים ל-Gambot בצורה תוכנתית — חיוב לפי תעבורה (קרדיטים).'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {apiMcpPlans.map((p) => (
              <div
                key={p.name}
                style={{
                  position: 'relative', background: '#fff', borderRadius: '12px', padding: '18px 14px',
                  textAlign: 'center', border: p.recommended ? '2px solid #6366f1' : '1px solid #e2e8f0',
                }}
              >
                {p.recommended && (
                  <div style={{
                    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                    background: '#6366f1', color: '#fff', fontSize: '11px', fontWeight: 700,
                    padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
                  }}>
                    {currentLanguage === 'en' ? 'Recommended' : 'מומלץ'}
                  </div>
                )}
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{p.name}</div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#64748b' }}>
                  {p.credits.toLocaleString()} {currentLanguage === 'en' ? 'credits / mo' : 'קרדיטים / חודש'}
                </div>
                <div style={{ marginTop: '12px', fontWeight: 900, fontSize: '24px', color: '#0f172a' }}>
                  {formatPrice(p.price).currency}{formatPrice(p.price).amount.toLocaleString()}
                  <span style={{ fontSize: '12px', fontWeight: 400, color: '#94a3b8' }}>{currentLanguage === 'en' ? '/mo' : '/חודש'}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '14px', fontSize: '12.5px', color: '#475569', textAlign: 'center', lineHeight: 1.6 }}>
            {currentLanguage === 'en'
              ? 'Credit weight per call: API ×1 · MCP ×2 · AI action ×12 · Bulk/Export ×4 (₪0.10/credit). Overage beyond your bundle is billed per credit +~30%.'
              : 'משקל קרדיטים לקריאה: API ×1 · MCP ×2 · פעולת AI ×12 · Bulk/ייצוא ×4 (₪0.10 לקרדיט). חריגה מעבר לחבילה מחויבת לפי מחיר קרדיט + ~30%.'}
          </div>
        </div>
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
                items: ['פיתוח והתאמות — ₪555/שעה + מע״מ', 'הדרכת עובדים — החל מ-₪600', 'שיחת ייעוץ חד-פעמית — ₪400 + מע״מ', 'בניית בוטים / אוטומציות — לפי היקף'],
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

import React, { useState, useRef } from "react";
import "./PlanSelection.css";
import TutorialVideoButton from './TutorialVideoButton';
import { FaCheck, FaCrown, FaStar, FaRocket, FaLightbulb, FaCheckCircle, FaArrowRight, FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useLanguage } from '@/contexts/LanguageContext';

// 🔌 API / MCP metered plans — for developers & AI agents that call Gambot programmatically.
// Billed by traffic (credits): each call to Gambot and back consumes credits by type.
const apiMcpPlans = [
  { name: 'API Starter', credits: 2500, price: 250 },
  { name: 'API Growth', credits: 10000, price: 1000, recommended: true },
  { name: 'API Scale', credits: 40000, price: 4000 },
  { name: 'API Enterprise', credits: 150000, price: 15000 },
];

const PlanSelection = ({ plan, setPlan, paymentCycle, setPaymentCycle, nextStep }) => {
  const { t, currentLanguage, isRTL } = useLanguage();
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const termsRef = useRef(null);
  
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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handlePlanSelection = (selectedPlan) => {
    setPlan(selectedPlan);
    setSelectedPlan(selectedPlan); // Store selected plan
  };

  // Enhanced plan data with icons and features
  const plans = {
    monthly: [
      {
        name: t('planSelection.plans.basic.name'),
        price: 179,
        yearlyPrice: 143 * 12, 
        description: t('planSelection.plans.basic.description'),
        icon: FaLightbulb,
        color: "#3b82f6",
        features: Array.isArray(t('planSelection.plans.basic.features')) 
          ? t('planSelection.plans.basic.features')
          : [t('planSelection.plans.basic.features')],
        moreFeatures: Array.isArray(t('planSelection.plans.basic.moreFeatures'))
          ? t('planSelection.plans.basic.moreFeatures')
          : []
      },
      {
        name: t('planSelection.plans.premium.name'),
        price: 359,
        yearlyPrice: 287 * 12, 
        recommended: true,
        description: t('planSelection.plans.premium.description'),
        icon: FaStar,
        color: "#10b981",
        features: Array.isArray(t('planSelection.plans.premium.features')) 
          ? t('planSelection.plans.premium.features')
          : [t('planSelection.plans.premium.features')],
        moreFeatures: Array.isArray(t('planSelection.plans.premium.moreFeatures'))
          ? t('planSelection.plans.premium.moreFeatures')
          : []
      },
      {
        name: t('planSelection.plans.enterprise.name'),
        price: 645,
        yearlyPrice: 516 * 12, 
        description: t('planSelection.plans.enterprise.description'),
        icon: FaRocket,
        color: "#8b5cf6",
        features: Array.isArray(t('planSelection.plans.enterprise.features')) 
          ? t('planSelection.plans.enterprise.features')
          : [t('planSelection.plans.enterprise.features')],
        moreFeatures: Array.isArray(t('planSelection.plans.enterprise.moreFeatures'))
          ? t('planSelection.plans.enterprise.moreFeatures')
          : []
      },
    ],
  };

  // Handle payment cycle change
  const handlePaymentCycleChange = (cycle) => {
    setPaymentCycle(cycle); // Set payment cycle (monthly or yearly)
  };

  return (
    <div className={`plan-selection-wrapper ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="plan-selection-container" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Enhanced Header */}
        <div className="selection-header">
          <div className="header-badge">
            <HiOutlineSparkles className="sparkle-icon" />
            <span>{t('planSelection.header.badge')}</span>
          </div>
          <h2 className="selection-title">{t('planSelection.header.title')}</h2>
          <p className="selection-subtitle">{t('planSelection.header.subtitle')}</p>
          <TutorialVideoButton step={1} />
        </div>

        {/* Enhanced Billing Toggle */}
        <div className="billing-toggle-wrapper">
          <h3 className="toggle-title">{t('planSelection.billing.title')}</h3>
          <div className="billing-toggle">
                    <button
          className={paymentCycle === "monthly" ? "active" : ""}
          onClick={() => handlePaymentCycleChange("monthly")}
          aria-pressed={paymentCycle === "monthly"}
          aria-label={`${t('planSelection.billing.monthly.label')} - ${t('planSelection.billing.monthly.description')}`}
        >
          <span className="toggle-label">{t('planSelection.billing.monthly.label')}</span>
          <span className="toggle-desc">{t('planSelection.billing.monthly.description')}</span>
        </button>
        <button
          className={paymentCycle === "yearly" ? "active" : ""}
          onClick={() => handlePaymentCycleChange("yearly")}
          aria-pressed={paymentCycle === "yearly"}
          aria-label={`${t('planSelection.billing.yearly.label')} - ${t('planSelection.billing.yearly.description')}`}
        >
          <span className="toggle-label">{t('planSelection.billing.yearly.label')}</span>
          <span className="toggle-desc">{t('planSelection.billing.yearly.description')}</span>
          <span className="discount-badge">{t('planSelection.billing.yearly.badge')}</span>
        </button>
          </div>
        </div>

        {/* Enhanced Plans Grid */}
        <div className="plans-container-selection">
          {plans.monthly.map((planItem, index) => {
            const IconComponent = planItem.icon;
            const isSelected = selectedPlan === planItem.name;
            
            return (
              <div
                key={index}
                className={`plan-card-selection ${isSelected ? "selected" : ""} ${planItem.recommended ? "recommended" : ""}`}
                style={{cursor: 'pointer', '--plan-color': planItem.color}}
                role="option"
                aria-selected={isSelected}
                aria-label={`${t('planSelection.ui.plan')} ${planItem.name} - ${planItem.description}${planItem.recommended ? ` (${t('planSelection.plans.premium.recommended')})` : ''}`}
                onClick={() => {
                  handlePlanSelection(planItem.name);
                  setSelectedPlan(planItem.name);

                  // Scroll to terms checkbox after short delay
                  setTimeout(() => {
                    if (termsRef.current) {
                      const offsetTop = termsRef.current.getBoundingClientRect().top + window.pageYOffset - 150;
                      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    }
                  }, 200);
                }}
              >
                {planItem.recommended && (
                  <div className="recommended-badge-selection">
                    <FaCrown className="crown-icon" />
                    <span>{t('planSelection.plans.premium.recommended')}</span>
                  </div>
                )}

                <div className="plan-header">
                  <div className="plan-icon" style={{backgroundColor: planItem.color}}>
                    <IconComponent />
                  </div>
                  <h3 className="plan-name-selection">{planItem.name}</h3>
                  <p className="plan-description-selection">{planItem.description}</p>
                </div>

                <div className="plan-pricing">
                  <div className="plan-price-selection">
                    <span className="currency">{formatPrice(planItem.price).currency}</span>
                    <span className="amount">
                      {paymentCycle === "monthly" 
                        ? formatPrice(planItem.price).amount 
                        : formatPrice(planItem.yearlyPrice / 12).amount
                      }
                    </span>
                    <span className="period">{t('planSelection.ui.perMonth')}</span>
                  </div>

                  {paymentCycle === "yearly" && (
                    <div className="plan-yearly-selection">
                      <span className="yearly-price">{t('planSelection.ui.yearlyBilling')}: {formatPrice(planItem.yearlyPrice).currency}{formatPrice(planItem.yearlyPrice).amount.toLocaleString()}</span>
                      <span className="savings">{t('planSelection.ui.save')} {formatPrice((planItem.price * 12) - planItem.yearlyPrice).currency}{formatPrice((planItem.price * 12) - planItem.yearlyPrice).amount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="plan-features">
                  <h4>{t('planSelection.ui.includes')}</h4>
                  <ul>
                    {planItem.features.map((feature, i) => {
                      const isBroadcast = /הודעות דיוור/.test(feature) || /broadcast messages/i.test(feature);
                      const isAiResponses = /תגובות\s*AI/i.test(feature) || /AI responses/i.test(feature);
                      const isGeneralTokens = /טוקנים\s*כלליים/i.test(feature) || /general (ai )?tokens/i.test(feature);
                      const isCredits = /קרדיט/i.test(feature) || /\bcredits?\b/i.test(feature);
                      const broadcastTooltip = currentLanguage === 'en'
                        ? 'Broadcast messages = bulk mailing to many recipients. E.g. you upload an Excel and send one message to 100 people, then two weeks later to another 200 — that counts as 300 broadcast messages. The quota applies to each channel separately (WhatsApp and/or Email) — e.g. up to 5,000 on each channel.'
                        : 'הודעות דיוור = שליחה בתפוצה רחבה לנמענים רבים. לדוגמה: העליתם אקסל ושלחתם הודעה אחת ל-100 איש, וכעבור שבועיים עוד 200 — זה נחשב 300 הודעות דיוור. המכסה חלה על כל ערוץ בנפרד (וואטסאפ ו/או מייל) — למשל עד 5,000 בכל ערוץ.';
                      const aiResponsesTooltip = currentLanguage === 'en'
                        ? 'AI responses = replies your AI bot generates to customers. Each reply consumes credits by the model used and the amount of context/knowledge involved. Click to read the full credits guide.'
                        : 'תגובות AI = התשובות שהבוט מייצר ללקוחות. כל תשובה צורכת קרדיטים לפי המודל שנבחר וכמות ההקשר/הידע בשימוש. לחצו למדריך הטוקנים המלא.';
                      const generalTokensTooltip = currentLanguage === 'en'
                        ? 'General AI tokens power advanced AI actions beyond replies — proactive messages, AI reports, analysis and summaries. Click to read the full credits guide.'
                        : 'טוקנים כלליים AI מפעילים פעולות AI מתקדמות מעבר לתשובות — הודעות פרואקטיביות, דוחות, ניתוח וסיכומים. לחצו למדריך הטוקנים המלא.';
                      const creditsTooltip = currentLanguage === 'en'
                        ? 'AI credits are one unified pool for ALL AI usage — bot replies plus proactive messages, reports, analysis and summaries. Heavier/premium usage costs more. Extra: ₪39 per 500 credits. Click for the full guide.'
                        : 'קרדיטים AI הם מאגר אחד מאוחד לכל שימושי ה‑AI — תשובות הבוט וגם הודעות פרואקטיביות, דוחות, ניתוח וסיכומים. שימוש כבד/מודל יקר עולה יותר. תוספת: ₪39 לכל 500 קרדיטים. לחצו למדריך המלא.';
                      const isCreditLine = isCredits || isAiResponses || isGeneralTokens;
                      const creditsBlogUrl = currentLanguage === 'en'
                        ? '/blog/44/gambot-tokens-credits-how-to-calculate-and-estimate-your-ai-usage/'
                        : '/blog/44/טוקני-גמבוט-קרדיטים-איך-מחשבים-ומעריכים-כמה-ai-תצרכו/';
                      const infoTooltip = isBroadcast ? broadcastTooltip : (isCredits ? creditsTooltip : (isAiResponses ? aiResponsesTooltip : (isGeneralTokens ? generalTokensTooltip : null)));
                      const infoStyle = {
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 16, height: 16, marginInlineStart: 6, borderRadius: '50%',
                        background: '#2e6155', color: '#fff', fontSize: 11, fontWeight: 700,
                        cursor: isCreditLine ? 'pointer' : 'help', flexShrink: 0, verticalAlign: 'middle',
                        textDecoration: 'none',
                      };
                      return (
                        <li key={i}>
                          <FaCheck className="feature-check" />
                          <span className="feature-text-inline">
                            {feature}
                            {infoTooltip && (
                              isCreditLine ? (
                                <a
                                  href={creditsBlogUrl}
                                  aria-label={infoTooltip}
                                  title={infoTooltip}
                                  onClick={(e) => e.stopPropagation()}
                                  style={infoStyle}
                                >?</a>
                              ) : (
                                <span
                                  tabIndex={0}
                                  role="button"
                                  aria-label={infoTooltip}
                                  title={infoTooltip}
                                  style={infoStyle}
                                >?</span>
                              )
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {planItem.moreFeatures.length > 0 && (
                    <>
                      <button
                        className="plan-expand-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCards(prev => ({ ...prev, [planItem.name]: !prev[planItem.name] }));
                        }}
                      >
                        {expandedCards[planItem.name]
                          ? <><FaChevronUp /> {currentLanguage === 'en' ? 'Show less' : 'הצג פחות'}</>
                          : <><FaChevronDown /> {currentLanguage === 'en' ? `+${planItem.moreFeatures.length} CRM features` : `+${planItem.moreFeatures.length} יכולות CRM`}</>
                        }
                      </button>
                      {expandedCards[planItem.name] && (
                        <ul className="plan-more-features">
                          {planItem.moreFeatures.map((feature, i) => (
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

                <button
                  className={`plan-button ${isSelected ? "selected" : ""} ${planItem.recommended && !isSelected ? "recommended-btn" : ""} ${!isSelected && !planItem.recommended ? "secondary" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelection(planItem.name);
                    setSelectedPlan(planItem.name);

                    setTimeout(() => {
                      if (termsRef.current) {
                        const offsetTop = termsRef.current.getBoundingClientRect().top + window.pageYOffset - 150;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                      }
                    }, 200);
                  }}
                  aria-label={`${t('planSelection.ui.selectPlan')} ${planItem.name} ${paymentCycle === "monthly" ? planItem.price : Math.floor(planItem.yearlyPrice / 12)} ${t('planSelection.ui.currency')} ${t('planSelection.ui.perMonth')}`}
                >
                  {isSelected ? (
                    <>
                      <FaCheckCircle className="button-icon" />
                      <span>{t('planSelection.ui.selectedPlan')}</span>
                    </>
                  ) : planItem.recommended ? (
                    <>
                      <FaCrown className="button-icon" />
                      <span>{t('planSelection.ui.selectPlan')} — {t('planSelection.plans.premium.recommended')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('planSelection.ui.selectPlan')}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* 🔌 API / MCP metered plans — quantity (credits) per package */}
        <div style={{ maxWidth: '960px', margin: '8px auto 28px', padding: '0 8px' }}>
          <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '1px solid #6366f1', borderRadius: '16px', padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, color: '#312e81', margin: 0 }}>
                {currentLanguage === 'en' ? '🔌 API / MCP Plans' : '🔌 מסלולי API / MCP'}
                <span
                  title={currentLanguage === 'en'
                    ? 'API/MCP is billed by traffic (credits): every call to Gambot and back consumes credits by type — a regular API call ×1, an MCP call ×2, an AI action ×12, a bulk/export ×4 (₪0.10 per credit). Pick a monthly credit bundle; usage beyond it is billed per credit +~30%.'
                    : 'חיוב API/MCP לפי תעבורה (קרדיטים): כל קריאה ל-Gambot וחזרה צורכת קרדיטים לפי הסוג — קריאת API רגילה ×1, קריאת MCP ×2, פעולת AI ×12, פעולת Bulk/ייצוא ×4 (₪0.10 לקרדיט). בוחרים חבילת קרדיטים חודשית; חריגה מעבר לחבילה מחויבת לפי מחיר קרדיט + ~30%.'}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: '#6366f1', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'help' }}
                >?</span>
              </h3>
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

        {/* Enhanced Terms Section */}
        <div ref={termsRef} className="terms-section">
          <div className="terms-container">
            <div className="terms-checkbox-wrapper">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="terms-checkbox"
              />
              <label htmlFor="terms-checkbox" className="terms-label">
                <span className="terms-checkmark"></span>
                <span className="terms-text">
                  {t('planSelection.terms.checkbox')}
                  <a
                    href="/TermOfUse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terms-link"
                  >
                    {t('planSelection.terms.link')}
                  </a>
                </span>
              </label>
            </div>
          </div>
        </div>

        {plan && (
          <div className="selection-confirmation">
            <div className="confirmation-content">
              <FaCheckCircle className="confirmation-icon" />
              <div className="confirmation-text">
                <h3>{t('planSelection.confirmation.title')}</h3>
                <p>{t('planSelection.confirmation.description', { planName: plan })}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Next Button */}
        <div className="navigation-section">
                  <button
          className={`next-button ${(!plan || !isChecked) ? "disabled" : ""}`}
          onClick={nextStep}
          disabled={!plan || !isChecked}
          aria-label={`${t('planSelection.navigation.nextStep')}${(!plan || !isChecked) ? ` - ${t('planSelection.navigation.nextStepDisabled')}` : ''}`}
        >
            <span>{t('planSelection.navigation.nextStep')}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default PlanSelection;

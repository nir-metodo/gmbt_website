import React, { useState, useRef } from "react";
import "./PlanSelection.css";
import TutorialVideoButton from './TutorialVideoButton';
import { FaCheck, FaCrown, FaStar, FaRocket, FaLightbulb, FaCheckCircle, FaArrowRight, FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useLanguage } from '@/contexts/LanguageContext';

const PlanSelection = ({ plan, setPlan, paymentCycle, setPaymentCycle, nextStep }) => {
  const { t, currentLanguage, isRTL } = useLanguage();
  // Coming back from a later step: the plan is already chosen, so the terms were already accepted.
  const [isChecked, setIsChecked] = useState(!!plan);
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

  const handlePlanSelection = (planName) => {
    setPlan(planName);
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

  // Cards show the first VISIBLE_FEATURES bullets; the rest (incl. CRM extras) opens on demand.
  const VISIBLE_FEATURES = 5;
  const selectedPlanItem = plans.monthly.find((p) => p.name === plan);
  const selectedPrice = selectedPlanItem
    ? formatPrice(paymentCycle === 'monthly' ? selectedPlanItem.price : selectedPlanItem.yearlyPrice / 12)
    : null;
  const canContinue = !!plan && isChecked;

  return (
    <div className={`plan-selection-wrapper ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="plan-selection-container" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Title row: heading on one side, billing cycle switch on the other */}
        <div className="selection-header">
          <div className="selection-heading">
            <h2 className="selection-title">{t('planSelection.header.title')}</h2>
            <p className="selection-subtitle">{t('planSelection.header.subtitle')}</p>
          </div>

          <div className="billing-toggle-wrapper">
            <div className="billing-toggle" role="group" aria-label={t('planSelection.billing.title')}>
              <button
                type="button"
                className={paymentCycle === "monthly" ? "active" : ""}
                onClick={() => handlePaymentCycleChange("monthly")}
                aria-pressed={paymentCycle === "monthly"}
              >
                <span className="toggle-label">{t('planSelection.billing.monthly.label')}</span>
              </button>
              <button
                type="button"
                className={paymentCycle === "yearly" ? "active" : ""}
                onClick={() => handlePaymentCycleChange("yearly")}
                aria-pressed={paymentCycle === "yearly"}
              >
                <span className="toggle-label">{t('planSelection.billing.yearly.label')}</span>
                <span className="discount-badge">{t('planSelection.billing.yearly.badge')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="plans-container-selection" role="listbox" aria-label={t('planSelection.header.title')}>
          {plans.monthly.map((planItem, index) => {
            const IconComponent = planItem.icon;
            const isSelected = plan === planItem.name;
            const allFeatures = [...planItem.features, ...planItem.moreFeatures];
            const hiddenCount = Math.max(allFeatures.length - VISIBLE_FEATURES, 0);
            const isExpanded = !!expandedCards[planItem.name];
            const shownFeatures = isExpanded ? allFeatures : allFeatures.slice(0, VISIBLE_FEATURES);
            const price = formatPrice(paymentCycle === "monthly" ? planItem.price : planItem.yearlyPrice / 12);

            return (
              <div
                key={index}
                className={`plan-card-selection ${isSelected ? "selected" : ""} ${planItem.recommended ? "recommended" : ""}`}
                style={{ cursor: 'pointer', '--plan-color': planItem.color }}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlanSelection(planItem.name); } }}
                onClick={() => handlePlanSelection(planItem.name)}
              >
                {planItem.recommended && (
                  <div className="recommended-badge-selection">
                    <FaCrown className="crown-icon" />
                    <span>{t('planSelection.plans.premium.recommended')}</span>
                  </div>
                )}

                <div className="plan-header">
                  <div className="plan-icon" style={{ backgroundColor: planItem.color }}>
                    <IconComponent />
                  </div>
                  <div className="plan-header-text">
                    <h3 className="plan-name-selection">{planItem.name}</h3>
                    <p className="plan-description-selection">{planItem.description}</p>
                  </div>
                </div>

                <div className="plan-pricing">
                  <div className="plan-price-selection">
                    <span className="currency">{price.currency}</span>
                    <span className="amount">{price.amount}</span>
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
                  <ul>
                    {shownFeatures.map((feature, i) => {
                      const isBroadcast = /הודעות דיוור/.test(feature) || /broadcast messages/i.test(feature);
                      const isAiResponses = /תגובות\s*AI/i.test(feature) || /AI responses/i.test(feature);
                      const isGeneralTokens = /טוקנים\s*כלליים/i.test(feature) || /general (ai )?tokens/i.test(feature);
                      // API/MCP credits are a SEPARATE pool from AI credits — detect before isCredits.
                      const isApiMcp = /API\s*\/\s*MCP/i.test(feature) || /קרדיטים\s*API/.test(feature);
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
                      const apiMcpTooltip = currentLanguage === 'en'
                        ? 'API/MCP credits are a separate pool for external-interface usage: a plain API call = 1 credit, an MCP action = 2, a bulk send/export = 4, an AI action via the interface = 12. Quota is included; overage ₪0.10/credit. Click for the full guide.'
                        : 'קרדיטים API/MCP הם מאגר נפרד לשימוש בממשק החיצוני: קריאת API רגילה = 1 קרדיט, פעולת MCP = 2, דיוור/ייצוא = 4, ופעולת AI דרך הממשק = 12. המכסה כלולה; חריגה ₪0.10 לקרדיט. לחצו למדריך המלא.';
                      const isCreditLine = isApiMcp || isCredits || isAiResponses || isGeneralTokens;
                      const creditsBlogUrl = isApiMcp
                        ? (currentLanguage === 'en'
                            ? '/blog/46/api-mcp-credits-how-gambot-counts-interface-usage-and-what-it-costs/'
                            : '/blog/46/קרדיטים-api-ו-mcp-איך-נספרת-צריכת-הממשק-בגמבוט-וכמה-זה-עולה/')
                        : (currentLanguage === 'en'
                            ? '/blog/44/gambot-tokens-credits-how-to-calculate-and-estimate-your-ai-usage/'
                            : '/blog/44/טוקני-גמבוט-קרדיטים-איך-מחשבים-ומעריכים-כמה-ai-תצרכו/');
                      const infoTooltip = isBroadcast ? broadcastTooltip : (isApiMcp ? apiMcpTooltip : (isCredits ? creditsTooltip : (isAiResponses ? aiResponsesTooltip : (isGeneralTokens ? generalTokensTooltip : null))));
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
                  {hiddenCount > 0 && (
                    <button
                      type="button"
                      className="plan-expand-toggle"
                      aria-expanded={isExpanded}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCards(prev => ({ ...prev, [planItem.name]: !prev[planItem.name] }));
                      }}
                    >
                      {isExpanded
                        ? <><FaChevronUp /> {currentLanguage === 'en' ? 'Show less' : 'הצג פחות'}</>
                        : <><FaChevronDown /> {currentLanguage === 'en' ? `Show all features (+${hiddenCount})` : `הצג את כל היכולות (+${hiddenCount})`}</>
                      }
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className={`plan-button ${isSelected ? "selected" : ""} ${planItem.recommended && !isSelected ? "recommended-btn" : ""} ${!isSelected && !planItem.recommended ? "secondary" : ""}`}
                  onClick={(e) => { e.stopPropagation(); handlePlanSelection(planItem.name); }}
                >
                  {isSelected ? (
                    <>
                      <FaCheckCircle className="button-icon" />
                      <span>{t('planSelection.ui.selectedPlan')}</span>
                    </>
                  ) : (
                    <span>{t('planSelection.ui.selectPlan')}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Sticky action bar: what you picked + terms + continue */}
        <div className="navigation-section wz-actionbar">
          <div className="wz-actionbar-info">
            <div className="wz-selection-summary" aria-live="polite">
              {selectedPlanItem ? (
                <>
                  <FaCheckCircle className="wz-selection-icon" />
                  <span className="wz-selection-name">{selectedPlanItem.name}</span>
                  <span className="wz-selection-price">{selectedPrice.currency}{selectedPrice.amount} {t('planSelection.ui.perMonth')}</span>
                </>
              ) : (
                <span className="wz-selection-hint">{currentLanguage === 'en' ? 'Pick a plan to continue' : 'בחרו מסלול כדי להמשיך'}</span>
              )}
            </div>

            <div ref={termsRef} className="terms-checkbox-wrapper">
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

          <button
            type="button"
            className={`next-button ${!canContinue ? "disabled" : ""}`}
            onClick={nextStep}
            disabled={!canContinue}
          >
            <span>{t('planSelection.navigation.nextStep')}</span>
            {isRTL ? <FaArrowLeft className="nav-icon" /> : <FaArrowRight className="nav-icon" />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default PlanSelection;

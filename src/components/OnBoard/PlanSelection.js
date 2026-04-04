import React, { useState, useRef } from "react";
import "./PlanSelection.css";
import TutorialVideoButton from './TutorialVideoButton';
import { FaCheck, FaCrown, FaStar, FaRocket, FaLightbulb, FaCheckCircle, FaArrowRight, FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useLanguage } from '@/contexts/LanguageContext';

const PlanSelection = ({ plan, setPlan, paymentCycle, setPaymentCycle, nextStep }) => {
  const { t, currentLanguage, isRTL } = useLanguage();
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(t('planSelection.plans.premium.name'));
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
                    {planItem.features.map((feature, i) => (
                      <li key={i}>
                        <FaCheck className="feature-check" />
                        <span>{feature}</span>
                      </li>
                    ))}
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
                  className={`plan-button ${isSelected ? "selected" : ""} ${planItem.recommended ? "primary" : "secondary"}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent double-click from card
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
                  aria-label={`${t('planSelection.ui.selectPlan')} ${planItem.name} ${paymentCycle === "monthly" ? planItem.price : Math.floor(planItem.yearlyPrice / 12)} ${t('planSelection.ui.currency')} ${t('planSelection.ui.perMonth')}`}
                >
                  {isSelected ? (
                    <>
                      <FaCheckCircle className="button-icon" />
                      <span>{t('planSelection.ui.selectedPlan')}</span>
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

      {/* Tutorial Video Button */}
      <TutorialVideoButton step={1} />
    </div>
  );
};

export default PlanSelection;

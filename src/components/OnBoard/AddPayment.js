'use client';

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import CreditCardInfo from "./CreditCardInfo"; // Credit card info component
import "./AddPayment.css";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import LoadingOverlay from './LoadingOverlay'; // Adjust the path if needed
import { useSearchParams } from "next/navigation";
import { useLanguage } from '@/contexts/LanguageContext'; // Import language context

const AddPaymentInner = () => {
  // ✅ Fix malformed URLs where WhatsApp strips '?' from template button variables
  // WhatsApp converts "addpayment?org=..." to "addpaymentorg=..." (strips '?')
  // Firebase rewrite serves this page for "/addpayment**", so we detect and fix it here
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname; // e.g. "/addpaymentorganizationName=..."
    if (pathname.startsWith('/addpayment') && pathname.length > '/addpayment'.length && !pathname.startsWith('/addpayment/')) {
      // Params are baked into the path — extract and redirect to proper URL
      const rawParams = pathname.replace('/addpayment', ''); // "organizationName=...&plan=..."
      const existingSearch = window.location.search.replace(/^[?&]/, '&'); // preserve any real query params
      window.location.replace('/addpayment?' + rawParams + existingSearch);
    }
  }, []);

  const searchParams = useSearchParams();
  const queryParams = searchParams;

  // Extract values from query parameters
  const organizationName = queryParams.get("organizationName");
  const plan = queryParams.get("plan");
  const price = queryParams.get("price");
  const paymentCycle = queryParams.get("paymentCycle");
  const simNumber = queryParams.get("simNumber");
  const hasSim = queryParams.get("hasSim")?.toLowerCase() === "true"; // Backend sends "True"/"False" (C#), support both
  const companyName = queryParams.get("companyName");
  const contactEmail = queryParams.get("contactEmail");
  const contactPhoneNumber = queryParams.get("contactPhoneNumber");
  const contactFullName = queryParams.get("contactFullName");
  const discountByPercentage = parseFloat(queryParams.get("discount_by_percentage")) || 0;
  const discountByPercentageSim = parseFloat(queryParams.get("discount_by_percentage_sim")) || 0;
  const urlCurrency = queryParams.get("currency") || "ILS"; // Get currency from URL (default to ILS for backward compatibility)
  const nextChargeDate = queryParams.get("nextChargeDate"); // Next charge date from reminder URL
  
  // Get language context and currency helpers
  const { language, setCurrentLanguage } = useLanguage();
  
  // Set initial language based on currency (run only once on mount)
  // Note: User can still manually change language via header toggle after mount
  useEffect(() => {
    const targetLanguage = urlCurrency === "ILS" ? "he" : "en";
    if (setCurrentLanguage) setCurrentLanguage(targetLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCurrency]); // Only re-run if URL currency changes
  
  // ✅ Get currency symbol based on URL currency (not language - currency is fixed by URL)
  const currencySymbol = urlCurrency === "ILS" ? "₪" : "$";
  
  // Get currency-aware pricing based on URL currency (not on context language which may lag)
  const getPlanPricesByUrlCurrency = () => {
    if (urlCurrency === "ILS") {
      // ILS base prices (monthly vs yearly per month)
      return {
        monthly: {
          Basic: 179,
          Premium: 359,
          Enterprise: 645
        },
        yearly: {
          Basic: 179 * 0.8,      // 143.2 (20% yearly discount)
          Premium: 359 * 0.8,    // 287.2
          Enterprise: 645 * 0.8  // 516
        },
        sim: 35
      };
    } else {
      // USD base prices (ILS / 3.5)
      return {
        monthly: {
          Basic: Math.round(179 / 3.5),      // 51
          Premium: Math.round(359 / 3.5),    // 103
          Enterprise: Math.round(645 / 3.5)  // 184
        },
        yearly: {
          Basic: (179 * 0.8) / 3.5,              // 40.9
          Premium: (359 * 0.8) / 3.5,            // 82.1
          Enterprise: (645 * 0.8) / 3.5          // 147.4
        },
        sim: 10
      };
    }
  };
  
  const planPricesData = getPlanPricesByUrlCurrency();
  const simPriceData = planPricesData.sim;

  // Translation based on currency
  const translations = {
    ILS: {
      header: "סיכום מסלול",
      selectedPlan: "התכנית הנבחרת:",
      planCost: "עלות התכנית:",
      simCost: "עלות סים:",
      totalPayment: "סה\"כ לתשלום:",
      perYear: "לשנה",
      perMonth: "לחודש",
      discount: "הנחה",
      vatDisclaimer: "המחירים המוצגים לא כוללים מע\"מ*",
      enterPaymentDetails: "הזנת פרטי תשלום",
      termsCheckbox: "אני מאשר/ת את",
      termsOfUse: "תנאי השימוש",
      termsOfPayment: "תנאי התשלום",
      termsRequired: "יש לאשר את תנאי השימוש והתשלום כדי להמשיך",
      thankYou: "תודה!",
      paymentSaved: "פרטי התשלום נשמרו בהצלחה.",
      redirecting: "מעביר אותך לדף ההתחברות...",
      paymentInfoNotice: "אנו אוספים כעת את פרטי התשלום שלך"
    },
    USD: {
      header: "Plan Summary",
      selectedPlan: "Selected Plan:",
      planCost: "Plan Cost:",
      simCost: "SIM Cost:",
      totalPayment: "Total Payment:",
      perYear: "per year",
      perMonth: "per month",
      discount: "discount",
      vatDisclaimer: "", // No VAT for USD
      enterPaymentDetails: "Enter Payment Details",
      termsCheckbox: "I agree to the",
      termsOfUse: "Terms of Use",
      termsOfPayment: "Payment Terms",
      termsRequired: "You must agree to the terms to continue",
      thankYou: "Thank You!",
      paymentSaved: "Payment details saved successfully.",
      redirecting: "Redirecting to login page...",
      paymentInfoNotice: "We are now collecting your payment details"
    }
  };

  // ✅ Use language context for translations if set, otherwise fallback to URL currency
  // This allows: 1) URL currency sets default, 2) User can manually toggle language
  const effectiveLanguage = language || (urlCurrency === "ILS" ? "he" : "en");
  const t = effectiveLanguage === 'he' ? translations.ILS : translations.USD;

  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentError, setPaymentError] = useState("");
  
  // ✅ Tranzila iframe state
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  
  // ✅ Terms of payment acceptance state
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  /* ❌ OLD state (not used with Tranzila iframe):
  const [showModal, setShowModal] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [onboardData, setOnboardData] = useState({});
  */

  // Calculate Total Price Correctly (using currency-aware pricing)
  useEffect(() => {
    // ✅ Get correct base price based on payment cycle
    // If yearly → use yearly base price (e.g., 115₪ for Basic)
    // If monthly → use monthly base price (e.g., 143₪ for Basic)
    const priceFromUrl = parseFloat(price);
    
    let baseMonthlyPrice;
    if (priceFromUrl && paymentCycle === "monthly") {
      // URL sends MONTHLY base price - use it for monthly payments
      baseMonthlyPrice = priceFromUrl;
    } else if (paymentCycle === "yearly") {
      // For yearly payments, use the yearly base price (with 20% discount built-in)
      baseMonthlyPrice = planPricesData.yearly[plan] || planPricesData.monthly[plan] || 0;
    } else {
      // Fallback to monthly base price
      baseMonthlyPrice = planPricesData.monthly[plan] || 0;
    }

    // Calculate SIM charge (always based on currency-aware monthly base: 35 ILS / 10 USD)
    let simCharge = 0;
    if (!hasSim) {
      simCharge = paymentCycle === "monthly" ? simPriceData : simPriceData * 12;
    }

    // Apply discount to plan price
    let discountedMonthlyPrice = baseMonthlyPrice;
    if (discountByPercentage > 0) {
      discountedMonthlyPrice = baseMonthlyPrice * (1 - discountByPercentage / 100);
    }

    // Apply discount to SIM price
    let discountedSimCharge = simCharge;
    if (discountByPercentageSim > 0 && !hasSim) {
      discountedSimCharge = simCharge * (1 - discountByPercentageSim / 100);
    }

    // Calculate final amount based on payment cycle
    if (paymentCycle === "yearly") {
      // ✅ baseMonthlyPrice already uses yearly rate (e.g., 115₪ for Basic)
      // ✅ discountedMonthlyPrice already has custom discount applied (if any)
      // Just multiply by 12 to get yearly total
      let yearlyPlanPrice = discountedMonthlyPrice * 12;
      
      setTotalAmount(yearlyPlanPrice + discountedSimCharge); // SIM charge is already yearly
    } else {
      setTotalAmount(discountedMonthlyPrice + discountedSimCharge); // Monthly price
    }
  }, [plan, price, paymentCycle, hasSim, discountByPercentage, discountByPercentageSim, planPricesData, simPriceData]); // Add dependencies

  /* ❌ OLD: onboardData construction (not used with Tranzila iframe)
  useEffect(() => {
    if (plan && price && paymentCycle) {
      const priceFromUrl = parseFloat(price);
      const monthlyBasePlanPrice = priceFromUrl || planPricesData[plan] || 0;

      const data = {
        plan: plan,
        totalAmount,
        payEach: paymentCycle,
        planPrice: monthlyBasePlanPrice,
        currency: urlCurrency,
        customerEmail: contactEmail,
        companyInfo: {
          companyName: companyName,
          organizationName: organizationName,
        },
        simInfo: {
          hasSim: hasSim,
          selectedSimNumber: simNumber || "",
          simNumberEntered: simNumber || "",
          sendSmsOnFailure: false,
        },
      };
      setOnboardData(data);
    }
  }, [plan, price, paymentCycle, totalAmount, organizationName, hasSim, simNumber, discountByPercentage, discountByPercentageSim, planPricesData, urlCurrency]);
  */

  /* ❌ OLD: Modal handlers (not used with Tranzila iframe)
  const handleModalClose = () => setShowModal(false);
  const handleModalOpen = () => setShowModal(true);
  */
  
  // ✅ Build Tranzila iframe URL
  const buildTranzilaIframeUrl = () => {
    const terminalName = "gambot1"; // Your Tranzila terminal name
    //const terminalName = "fxpgambot"; // OLD terminal 
    const baseUrl = `https://direct.tranzila.com/${terminalName}/iframenew.php`;
    
    // Build query parameters
    const params = new URLSearchParams({
      supplier: terminalName,
      sum: "1", // 1 ILS for verification (will be hidden)
      currency: urlCurrency === "ILS" ? "1" : "2", // 1=ILS, 2=USD
      tranmode: "VK", // VK = Verification with token creation (allows hidesum)
      cred_type: "1", // 1 = Credit card
      hidesum: "1", // ✅ Hide payment sum to avoid customer confusion
      company: companyName || organizationName,
      contact: contactFullName || "",
      email: contactEmail || "",
      phone: contactPhoneNumber || "",
      address: "",
      city: "",
      remarks: `Plan: ${plan}, Cycle: ${paymentCycle}`,
      // ✅ Pass organization in remarks instead of myid to avoid showing in form
      organization: organizationName, // Backend will use this
      pdesc: `${plan} Plan - ${paymentCycle}`,
      buttonLabel: effectiveLanguage === "he" ? "אימות כרטיס" : "Verify Card",
      // ✅ Tranzila webhook URLs
      notify_url_address: `https://gambot.azurewebsites.net/api/Webhooks/TranzilaWebhookCallback`,
      success_url_address: `${window.location.origin}/payment-success-redirect.html`,
      fail_url_address: `${window.location.origin}/payment-failure-redirect.html`
    });

    return `${baseUrl}?${params.toString()}`;
  };

  // ✅ NEW: Handle opening iframe
  const handleShowIframe = () => {
    const url = buildTranzilaIframeUrl();
    setIframeUrl(url);
    setShowIframe(true);
  };

  // ℹ️ NOTE: Tranzila iframe redirects user to success_url_address or fail_url_address
  // after payment completion. We don't need to listen for postMessage events.
  // The webhook (notify_url_address) is called separately by Tranzila to save the token.

  /* ❌ OLD: Direct payment submission (NOT USED - keeping for reference)
  const handleSubmit = async (cardDetails, onboardData) => {
    if (!cardDetails) {
      setPaymentError("Please enter your credit card details");
      return;
    }

    setIsLoading(true);
    setPaymentError("");

    const dataToSubmit = {
      plan: plan,
      planPrice: price,
      totalAmount: totalAmount,
      payEach: paymentCycle,
      hasSim: hasSim,
      companyInfo: {
        companyName: companyName,
        organizationName: organizationName,
      },
      organization : organizationName,
      simNumber: simNumber,
      contactInfo: {
        contactEmail: contactEmail,
        contactFullName: contactFullName,
        contactPhoneNumber: contactPhoneNumber,
      },
      cardDetails: cardDetails,
    };

    try {
      const response = await axios.post(
        `https://gambot.azurewebsites.net/api/Webhooks/AddPaymentData`,
        dataToSubmit
      );

      if (response.data.Success === true) {
        // Success - redirect handled by Tranzila
        setShowModal(false);
        setTimeout(() => {
          navigate('/Login');
        }, 3000);
      } else {
        setPaymentError("Payment verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setPaymentError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  */

  return (
    <div className="addpayment-container">
      <LoadingOverlay loading={isLoading}></LoadingOverlay>
      <h2 className="addpayment-container-header">{t.header}</h2>

      <p className="addpayment-container-plan-info">
        <IoIosCheckmarkCircleOutline className="checkmark-icon" />
        <strong>{t.selectedPlan}</strong> <u>{plan}</u>
      </p>
      <p className="addpayment-container-plan-info">
        <IoIosCheckmarkCircleOutline className="checkmark-icon" />
        <strong>{t.planCost}</strong>
        <span className="plan-price-info" style={discountByPercentage > 0 ? { textDecoration: "line-through", color: "#999" } : {}}>
          {/* ✅ Show original price (crossed out if discount) */}
          {paymentCycle === "yearly" ? (
            <>
              {(() => {
                const basePrice = planPricesData.yearly[plan] || planPricesData.monthly[plan];
                const yearlyTotal = basePrice * 12;
                return `${yearlyTotal.toFixed(2)}${currencySymbol} ${t.perYear}`;
              })()}
              <span style={{ fontSize: "0.9em", color: "#666", marginRight: "5px" }}>
                {(() => {
                  const basePrice = planPricesData.yearly[plan] || planPricesData.monthly[plan];
                  return ` (${basePrice.toFixed(2)}${currencySymbol} ${t.perMonth})`;
                })()}
              </span>
            </>
          ) : (
            <>
              {(() => {
                const priceFromUrl = parseFloat(price);
                const basePrice = priceFromUrl || planPricesData.monthly[plan];
                return basePrice.toFixed(2);
              })()}
              {currencySymbol} {t.perMonth}
            </>
          )}
        </span>
      </p>
      {/* ✅ Discounted price on separate row in GREEN */}
      {discountByPercentage > 0 && (
        <p className="addpayment-container-plan-info" style={{ paddingRight: "50px", marginTop: "-10px" }}>
          <span style={{ color: "#28a745", fontWeight: "bold" }}>
            {paymentCycle === "yearly" ? (
              <>
                {(() => {
                  const basePrice = planPricesData.yearly[plan] || planPricesData.monthly[plan];
                  const discountedMonthly = basePrice * (1 - discountByPercentage / 100);
                  const discountedYearly = discountedMonthly * 12;
                  return `${discountedYearly.toFixed(2)}${currencySymbol} ${t.perYear}`;
                })()}
                <span style={{ fontSize: "0.9em" }}>
                  {(() => {
                    const basePrice = planPricesData.yearly[plan] || planPricesData.monthly[plan];
                    const discountedMonthly = basePrice * (1 - discountByPercentage / 100);
                    return ` (${discountedMonthly.toFixed(2)}${currencySymbol} ${t.perMonth})`;
                  })()}
                </span>
                {" "}
                <span style={{ fontSize: "0.9em" }}>
                  ({discountByPercentage}% {t.discount})
                </span>
              </>
            ) : (
              <>
                {(() => {
                  const priceFromUrl = parseFloat(price);
                  const basePrice = priceFromUrl || planPricesData.monthly[plan];
                  const discountedPrice = basePrice * (1 - discountByPercentage / 100);
                  return `${discountedPrice.toFixed(2)}${currencySymbol} ${t.perMonth}`;
                })()}
                {" "}
                <span style={{ fontSize: "0.9em" }}>
                  ({discountByPercentage}% {t.discount})
                </span>
              </>
            )}
          </span>
        </p>
      )}

      {/* If user doesn't have SIM, display SIM price */}
      {!hasSim && (
        <>
          <p className="addpayment-container-sim-price">
            <IoIosCheckmarkCircleOutline className="checkmark-icon" />
            <strong>{t.simCost}</strong>{" "}
            <span style={discountByPercentageSim > 0 ? { textDecoration: "line-through", color: "#999" } : {}}>
              {/* ✅ Show original price (crossed out if discount) */}
              {paymentCycle === "yearly" ? (
                <>
                  {(() => {
                    const yearlyTotal = simPriceData * 12;
                    return `${yearlyTotal.toFixed(2)}${currencySymbol} ${t.perYear}`;
                  })()}
                  <span style={{ fontSize: "0.9em", color: "#666", marginRight: "5px" }}>
                    {` (${simPriceData.toFixed(2)}${currencySymbol} ${t.perMonth})`}
                  </span>
                </>
              ) : (
                <>
                  {simPriceData.toFixed(2)}{currencySymbol} {t.perMonth}
                </>
              )}
            </span>
          </p>
          {/* ✅ Discounted SIM price on separate row in GREEN */}
          {discountByPercentageSim > 0 && (
            <p className="addpayment-container-sim-price" style={{ paddingRight: "50px", marginTop: "-10px" }}>
              <span style={{ color: "#28a745", fontWeight: "bold" }}>
                {paymentCycle === "yearly" ? (
                  <>
                    {(() => {
                      const discountedMonthly = simPriceData * (1 - discountByPercentageSim / 100);
                      const discountedYearly = discountedMonthly * 12;
                      return `${discountedYearly.toFixed(2)}${currencySymbol} ${t.perYear}`;
                    })()}
                    <span style={{ fontSize: "0.9em" }}>
                      {(() => {
                        const discountedMonthly = simPriceData * (1 - discountByPercentageSim / 100);
                        return ` (${discountedMonthly.toFixed(2)}${currencySymbol} ${t.perMonth})`;
                      })()}
                    </span>
                    {" "}
                    <span style={{ fontSize: "0.9em" }}>
                      ({discountByPercentageSim}% {t.discount})
                    </span>
                  </>
                ) : (
                  <>
                    {(() => {
                      const discountedPrice = simPriceData * (1 - discountByPercentageSim / 100);
                      return `${discountedPrice.toFixed(2)}${currencySymbol} ${t.perMonth}`;
                    })()}
                    {" "}
                    <span style={{ fontSize: "0.9em" }}>
                      ({discountByPercentageSim}% {t.discount})
                    </span>
                  </>
                )}
              </span>
            </p>
          )}
        </>
      )}

      <p className="addpayment-container-total-amount">
        <IoIosCheckmarkCircleOutline className="checkmark-icon" />
        <strong>
          {" "}
          <u>{t.totalPayment}</u>
        </strong>{" "}
        {paymentCycle === "yearly" ? (
          <>
            {totalAmount.toFixed(2)}{currencySymbol} {t.perYear}
            <span style={{ fontSize: "0.9em", color: "#666", marginRight: "5px" }}>
              {" "}({(totalAmount / 12).toFixed(2)}{currencySymbol} {t.perMonth})
            </span>
          </>
        ) : (
          <>{totalAmount.toFixed(2)}{currencySymbol} {t.perMonth}</>
        )}
      </p>

      {/* VAT disclaimer - only show for ILS */}
      {urlCurrency === "ILS" && t.vatDisclaimer && (
        <p className="addpayment-vat-disclaimer">{t.vatDisclaimer}</p>
      )}

      {/* Payment info notice */}
      <div className="payment-info-notice">
        <span className="info-icon">ℹ️</span>
        <p>{t.paymentInfoNotice}</p>
      </div>

      {/* Next charge date - if provided */}
      {nextChargeDate && (
        <div className="next-charge-notice">
          <span className="calendar-icon">📅</span>
          <p>
            <strong>
              {paymentCycle === 'monthly' 
                ? (effectiveLanguage === 'he' ? 'חיוב חודשי החל מה-' : 'Monthly billing starting ')
                : (effectiveLanguage === 'he' ? 'חיוב שנתי החל מה-' : 'Annual billing starting ')
              }
            </strong>
            <span className="charge-date">
              {(() => {
                const d = new Date(nextChargeDate);
                if (isNaN(d.getTime())) return nextChargeDate;
                return d.toLocaleDateString(effectiveLanguage === 'he' ? 'he-IL' : 'en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                });
              })()}
            </span>
          </p>
        </div>
      )}

      {paymentError && <p className="addpayment-error-message">{paymentError}</p>}

      {/* ❌ OLD: Direct credit card form (NOT PCI compliant) - COMMENTED OUT
      <button className="addpayment-container-purchase-btn" onClick={handleModalOpen}>
        <span>{t.enterPaymentDetails}</span>
        <MdOutlinePayment className="payment-icon" />
      </button>

      {showModal && (
        <CreditCardInfo
          handleClose={handleModalClose}
          handleSubmit={handleSubmit}
          onboardData={onboardData}
        />
      )}
      */}

      {/* ✅ Terms of Payment Acceptance Checkbox */}
      {!showIframe && (
        <div className="addpayment-terms-acceptance-container">
          <label className="addpayment-terms-checkbox-label">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="addpayment-terms-checkbox"
            />
            <span className="addpayment-terms-text">
              {t.termsCheckbox}{' '}
              <a 
                href="/TermOfUse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="addpayment-terms-link"
              >
                {t.termsOfUse}
              </a>
              {' '}ו{' '}
              <a 
                href="/TermOfPayments" 
                target="_blank" 
                rel="noopener noreferrer"
                className="addpayment-terms-link"
              >
                {t.termsOfPayment}
              </a>
            </span>
          </label>
          {!termsAccepted && (
            <p className="addpayment-terms-required-message">{t.termsRequired}</p>
          )}
        </div>
      )}

      {/* ✅ NEW: Tranzila iframe (PCI Compliant) */}
      {!showIframe && (
        <button 
          className="addpayment-container-purchase-btn" 
          onClick={handleShowIframe}
          disabled={!termsAccepted}
        >
          <span>{t.enterPaymentDetails}</span>
          <MdOutlinePayment className="payment-icon" />
        </button>
      )}

      {/* Tranzila iframe */}
      {showIframe && (
        <div className="tranzila-iframe-wrapper">
          <div className="tranzila-iframe-header">
            <div className="security-badge">
              <span className="security-icon">🔒</span>
              <span className="security-text">
                {effectiveLanguage === "he" ? "תשלום מאובטח" : "Secure Payment"}
              </span>
            </div>
            <p className="iframe-instruction">
              {effectiveLanguage === "he" 
                ? "מלא את פרטי הכרטיס באזור המאובטח למטה" 
                : "Fill in your card details in the secure area below"}
            </p>
          </div>
          <div className="tranzila-iframe-container">
            <iframe
              src={iframeUrl}
              title="Tranzila Payment"
              className="tranzila-iframe"
              frameBorder="0"
              scrolling="yes"
            />
          </div>
        </div>
      )}

      {/* ℹ️ Success/Failure handled by Tranzila redirect to /payment-success or /payment-failure */}
    </div>
  );
};

const AddPayment = () => (
  <Suspense fallback={<div />}>
    <AddPaymentInner />
  </Suspense>
);

export default AddPayment;

  


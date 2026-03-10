import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './Verification.css';
import LoadingOverlay from './LoadingOverlay';
import TutorialVideoButton from './TutorialVideoButton';
import { FaWhatsapp, FaEnvelope, FaClock, FaArrowRight, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaSync } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdSecurity, MdVerified } from "react-icons/md";
import { useLanguage } from '@/contexts/LanguageContext';
import Swal from 'sweetalert2';
const Verification = ({
    companyInfo,
    nextStep,
    prevStep,
    name,
    hasSim,
    useFreeNumber,
    useCoexisting,
    organizationPhoneNumber,
    plan,
    paymentCyctle,
    forwardingPhoneNumber,
  }) => {
    const { t, currentLanguage, isRTL, getCurrency, getCurrencySymbol, getPlanPrices } = useLanguage();
    const [enteredCode, setEnteredCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(true); // ⬅️ Start with true
    const [codeExpiresAt, setCodeExpiresAt] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    // 🔍 DEBUG: Log organizationName when Verification component mounts
    useEffect(() => {
        console.log('═══════════════════════════════════════════════════');
        console.log('📧 [Verification - Step 4] Component Mounted');
        console.log('🏢 [Verification] Organization Name:', companyInfo?.organizationName);
        console.log('📋 [Verification] Full Company Info:', companyInfo);
        console.log('📱 [Verification] Contact Phone:', companyInfo?.contactPhoneNumber);
        console.log('📧 [Verification] Contact Email:', companyInfo?.contactEmail);
        console.log('═══════════════════════════════════════════════════');
    }, []); // Run once on mount

    // Fallback function for Verification translations
    const getVerificationText = (key) => {
        const translation = t(key);
        if (translation === key) {
            // Translation key returned unchanged, use fallback
            const fallbacks = {
                'verification.header.badge': currentLanguage === 'he' ? 'שלב 4' : 'Step 4',
                'verification.header.title': currentLanguage === 'he' ? 'אימות זהות' : 'Identity Verification',
                'verification.header.subtitle': currentLanguage === 'he' ? 'אנא הזן את קוד האימות שנשלח אליך לסיום התהליך' : 'Please enter the verification code sent to you to complete the process',
                'verification.security.title': currentLanguage === 'he' ? 'אימות בטוח ומאובטח' : 'Secure and Safe Verification',
                'verification.security.description': currentLanguage === 'he' ? 'קוד האימות נשלח אל המספר והאימייל שהזנת לצורך אימות זהותך' : 'The verification code was sent to the phone number and email you entered to verify your identity',
                'verification.channels.whatsapp': 'WhatsApp',
                'verification.channels.email': currentLanguage === 'he' ? 'אימייל' : 'Email',
                'verification.channels.sentTo': currentLanguage === 'he' ? 'נשלח ל-' : 'Sent to',
                'verification.codeInput.label': currentLanguage === 'he' ? 'קוד אימות' : 'Verification Code',
                'verification.codeInput.placeholder': currentLanguage === 'he' ? 'הזן קוד אימות' : 'Enter verification code',
                'verification.timer.validFor': currentLanguage === 'he' ? 'הקוד בתוקף לעוד' : 'Code is valid for',
                'verification.timer.expired': currentLanguage === 'he' ? 'פג תוקף הקוד' : 'Code has expired',
                'verification.resend.question': currentLanguage === 'he' ? 'לא קיבלת קוד?' : 'Didn\'t receive the code?',
                'verification.resend.button': currentLanguage === 'he' ? 'שלח קוד שוב' : 'Send code again',
                'verification.navigation.back': currentLanguage === 'he' ? 'חזרה' : 'Back',
                'verification.navigation.verify': currentLanguage === 'he' ? 'אמת והמשך' : 'Verify and Continue',
                'verification.alerts.codeExpired': currentLanguage === 'he' ? 'הקוד פג תוקף. שלח קוד חדש.' : 'The code has expired. Send a new code.',
                'verification.alerts.codeIncorrect': currentLanguage === 'he' ? 'הקוד שהזנת שגוי' : 'The code you entered is incorrect',
                'verification.alerts.subscriptionError': currentLanguage === 'he' ? 'אירעה שגיאה בעת יצירת המנוי' : 'An error occurred while creating the subscription'
            };
            return fallbacks[key] || key;
        }
        return translation;
    };
  
    // Get currency-aware pricing from LanguageContext
    const currency = getCurrency(); // 'ILS' or 'USD'
    const currencySymbol = getCurrencySymbol(); // '₪' or '$'
    const planPricesData = getPlanPrices(); // { Basic: 143/41, Premium: 287/82, Enterprise: 865/247, sim: 35/10 }
  
    const sendVerificationCode = React.useCallback(async () => {
      try {
        setIsLoading(true);

        const newPlan = translatePlanName(plan) + '_' + paymentCyctle;
        
        // ✅ NEW: Check localStorage for existing organization name (ALWAYS use company ID as key)
        const storageKey = `gambot_org_${companyInfo?.idNumber}`;
        const cachedOrgName = companyInfo?.idNumber ? localStorage.getItem(storageKey) : null;
        
        // 🔍 DEBUG: Log organization name before sending verification code
        console.log('📤 [Verification] Sending verification code to backend...');
        console.log('📦 [Verification] Storage key:', storageKey);
        console.log('📦 [Verification] Company ID:', companyInfo?.idNumber);
        console.log('📦 [Verification] Cached org name from localStorage:', cachedOrgName);
        console.log('🏢 [Verification] Organization Name being sent:', cachedOrgName || companyInfo?.organizationName);
        console.log('📧 [Verification] Email:', companyInfo.contactEmail);
        console.log('📱 [Verification] Phone:', companyInfo.contactPhoneNumber);
        
        const response = await axiosInstance.post('/api/Webhooks/SendVerificationCode', {
          phoneNumber: companyInfo.contactPhoneNumber,
          email: companyInfo.contactEmail,
          name,
          companyName: companyInfo?.companyName,
          organizationName: cachedOrgName || companyInfo?.organizationName, // ✅ Use cached org name if exists
          companyIdNumber: companyInfo?.idNumber,
          hasSim,
          url: companyInfo?.companyUrl,
          simNumber: organizationPhoneNumber,
          plan,
          paymentCyctle,
          productKey: newPlan,
        });
  
        // ✅ Extract BOTH verificationCode AND organizationName from backend response
        const responseData = response.data?.Data;
        
        if (responseData?.verificationCode && responseData?.organizationName) {
          // ✅ New response format: { verificationCode, organizationName }
          setVerificationCode(responseData.verificationCode?.toString() || '');
          
          // ✅ CRITICAL: Update companyInfo with backend-generated organization name
          companyInfo.organizationName = responseData.organizationName;
          console.log('✅ [Verification] Backend generated organization name:', responseData.organizationName);
          console.log('📝 [Verification] Updated companyInfo with new organization name');
          
          // ✅ NEW: Save organization name to localStorage for future "resend" clicks (ALWAYS use company ID as key)
          if (companyInfo?.idNumber) {
            const storageKey = `gambot_org_${companyInfo.idNumber}`;
            localStorage.setItem(storageKey, responseData.organizationName);
            console.log('💾 [Verification] Saved org name to localStorage with key:', storageKey, '→', responseData.organizationName);
          } else {
            console.warn('⚠️ [Verification] Cannot save to localStorage - missing company ID');
          }
        } else if (typeof responseData === 'string' || typeof responseData === 'number') {
          // ✅ Fallback for old response format (just verification code)
          setVerificationCode(responseData?.toString() || '');
          console.warn('⚠️ [Verification] Backend returned old response format (no organization name)');
        }
        
        setCodeExpiresAt(new Date(Date.now() + 3 * 60 * 1000));
        setEnteredCode('');
      } catch (error) {
        console.error('❌ [Verification] Error sending verification code:', error);
        console.error('❌ [Verification] Error details:', error.response?.data || error.message);
        
        // Show error to user
        showAlert(
          currentLanguage === 'he' ? 'שגיאה' : 'Error',
          currentLanguage === 'he' ? 'אירעה שגיאה בשליחת קוד האימות. נסה שוב מאוחר יותר.' : 'An error occurred while sending the verification code. Please try again later.',
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }, [companyInfo?.contactPhoneNumber, companyInfo?.contactEmail, name, companyInfo?.companyName, companyInfo?.organizationName, companyInfo?.idNumber, hasSim, useFreeNumber, useCoexisting, companyInfo?.companyUrl, organizationPhoneNumber, plan, paymentCyctle, companyInfo]);

    // useEffect hooks placed after sendVerificationCode definition
    useEffect(() => {
      sendVerificationCode();
    }, [sendVerificationCode]);
  
    useEffect(() => {
      if (!codeExpiresAt) return;
      const interval = setInterval(() => {
        const diff = Math.floor((codeExpiresAt - new Date()) / 1000);
        setTimeLeft(Math.max(diff, 0));
      }, 1000);
      return () => clearInterval(interval);
    }, [codeExpiresAt]);
  
    const translatePlanName = (planName) => {
      switch (planName) {
        case 'בסיס': return 'Basic';
        case 'פרימיום': return 'Premium';
        case 'ארגונים': return 'Enterprise';
        default: return planName;
      }
    };
  
    const formatTime = (seconds) => {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };
  
    const showAlert = (title, text, icon = "warning") => {
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonText: t('basicInfo.alerts.confirm') || (currentLanguage === 'he' ? 'אישור' : 'Confirm'),
            customClass: {
                popup: isRTL ? "rtl-popup" : "ltr-popup",
                confirmButton: "swal2-confirm"
            }
        });
    };

    const handleVerification = () => {
      // ✅ Prevent multiple clicks
      if (isLoading) {
        return;
      }
      
      if (timeLeft <= 0) {
        showAlert(
            getVerificationText('verification.alerts.codeExpired'),
            '',
            "error"
        );
        return;
      }
  
      if (enteredCode.trim() === verificationCode.trim()) {
        handleNextStep(); // ⬅️ Will set isLoading=true inside
    } else {
        showAlert(
            getVerificationText('verification.alerts.codeIncorrect'),
            '',
            "error"
        );
      }
    };
  
    const handleNextStep = async () => {
      try {
        setIsLoading(true);
        
        // 🔍 DEBUG: Log organization name before creating subscription
        console.log('✅ [Verification] Code verified successfully!');
        console.log('🚀 [Verification] Creating subscription with organization:', companyInfo?.organizationName);
        
        // Get monthly base price (no discounts) - ALWAYS send this to backend
        const monthlyBasePlanPrice = planPricesData[translatePlanName(plan)] || 0;
        
        // ✅ Calculate totalAmount (what customer will actually pay in their currency)
        const simPrice = planPricesData.sim; // Currency-aware SIM price (35 ILS / 10 USD)
        
        // ✅ ONLY charge for SIM if:
        // - User doesn't have a Gambot SIM (!hasSim)
        // - AND Meta is not providing a free number (!useFreeNumber)
        // - AND User is NOT using Coexistence (!useCoexisting)
        const shouldChargeSim = !hasSim && !useFreeNumber && !useCoexisting;
        
        // 🔍 DEBUG: Log SIM charge decision
        console.log('💰 [Verification] SIM Charge Decision:');
        console.log('   - hasSim:', hasSim);
        console.log('   - useFreeNumber:', useFreeNumber);
        console.log('   - useCoexisting:', useCoexisting);
        console.log('   - shouldChargeSim:', shouldChargeSim);
        console.log('   - simPrice:', simPrice);
        
        let totalAmount = 0;
        
        if (paymentCyctle === 'yearly') {
          // Yearly: Apply 20% discount to plan, multiply by 12, add SIM yearly (only if purchasing)
          const yearlyPlanPrice = monthlyBasePlanPrice * 0.8 * 12;
          const yearlySimPrice = shouldChargeSim ? simPrice * 12 : 0;
          totalAmount = yearlyPlanPrice + yearlySimPrice;
          console.log('📊 [Verification] Yearly Calculation:', { yearlyPlanPrice, yearlySimPrice, totalAmount });
        } else {
          // Monthly: No discount on plan, just add SIM if purchasing
          const monthlySimPrice = shouldChargeSim ? simPrice : 0;
          totalAmount = monthlyBasePlanPrice + monthlySimPrice;
          console.log('📊 [Verification] Monthly Calculation:', { monthlyBasePlanPrice, monthlySimPrice, totalAmount });
        }
  
        const data = {
          plan: translatePlanName(plan),
          forwardingPhoneNumber,
          totalAmount: Math.round(totalAmount), // Round to avoid decimals
          payEach: paymentCyctle,
          planPrice: monthlyBasePlanPrice, // ALWAYS send monthly base price (199 ILS / 57 USD)
          currency: currency, // Add currency field ('ILS' or 'USD')
          customerEmail: companyInfo.contactEmail,
          hasSim: hasSim, // ✅ Add hasSim at root level to match backend model
          companyInfo: {
            companyName: companyInfo.companyName,
            organizationName: companyInfo.organizationName, // ✅ Backend-generated org name
            companyUrl: companyInfo.companyUrl,
            companyPhoneNumber: companyInfo.contactPhoneNumber,
            companyId: companyInfo.idNumber, // ✅ ח.פ/ת.ז - used as unique key
            idNumber: companyInfo.idNumber, // ✅ Also send as idNumber (backend uses both names)
            timezone: companyInfo.timezone?.value || companyInfo.timezone, // ✅ Extract string value from timezone object
          },
          timezone: companyInfo.timezone, // ✅ Full timezone object at ROOT level (TimezoneInfo)
          contactInfo: {
            contactFullName: companyInfo.contactFullName,
            contactEmail: companyInfo.contactEmail,
            contactPhoneNumber: companyInfo.contactPhoneNumber,
          },
          contactEmail: companyInfo.contactEmail, // ✅ Also at root level (matches working local payload)
          contactFullName: companyInfo.contactFullName, // ✅ Also at root level
          contactPhoneNumber: companyInfo.contactPhoneNumber, // ✅ Also at root level
          // ✅ ALL SIM-related data in simInfo object (clean, no duplicates)
          simInfo: {
            hasSim,
            useFreeNumber,
            useCoexisting,
            purchaseInTwilio: shouldChargeSim,
            // ✅ selectedSimNumber: ONLY for Purchase Twilio scenario
            selectedSimNumber: (!hasSim && !useFreeNumber && !useCoexisting) 
              ? organizationPhoneNumber.replace('+', '') 
              : '',
            // ✅ simNumberEntered: For Coexistence OR BYO SIM scenarios
            simNumberEntered: (useCoexisting || hasSim) 
              ? organizationPhoneNumber.replace('+', '') 
              : '',
            sendSmsOnFailure: false,
          },
          // ✅ Keep ONLY these at root for backwards compatibility
          useFreeNumber,
          useCoexisting,
        };

        // 🔍 DEBUG: Log the exact payload being sent
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📤 [createNewTrialSubscription] PAYLOAD BEING SENT:');
        console.log('💰 PRICING SUMMARY:');
        console.log('   - Plan:', translatePlanName(plan));
        console.log('   - Payment Cycle:', paymentCyctle);
        console.log('   - Total Amount:', totalAmount, currency);
        console.log('   - Should Charge SIM?', shouldChargeSim);
        console.log('📋 ROOT Level (minimal for backwards compatibility):');
        console.log('   - hasSim:', data.hasSim);
        console.log('   - useFreeNumber:', data.useFreeNumber);
        console.log('   - useCoexisting:', data.useCoexisting);
        console.log('📋 simInfo Object (all SIM data here):');
        console.log('   - hasSim:', data.simInfo.hasSim);
        console.log('   - useFreeNumber:', data.simInfo.useFreeNumber);
        console.log('   - useCoexisting:', data.simInfo.useCoexisting);
        console.log('   - purchaseInTwilio:', data.simInfo.purchaseInTwilio, '← should match shouldChargeSim');
        console.log('   - selectedSimNumber:', `'${data.simInfo.selectedSimNumber}'`, data.simInfo.selectedSimNumber ? '✅ HAS VALUE' : '⚪ EMPTY');
        console.log('   - simNumberEntered:', `'${data.simInfo.simNumberEntered}'`, data.simInfo.simNumberEntered ? '✅ HAS VALUE' : '⚪ EMPTY');
        console.log('📦 FULL PAYLOAD:');
        console.log(JSON.stringify(data, null, 2));
        console.log('═══════════════════════════════════════════════════════════');
  
        const response = await axiosInstance.post(
          '/api/Webhooks/createNewTrialSubscription',
          data
        );
  
        if (response.status === 200) {
          nextStep();
        } else {
          showAlert(
            getVerificationText('verification.alerts.subscriptionError'),
            '',
            "error"
          );
        }
      } catch (error) {
        showAlert(
            getVerificationText('verification.alerts.subscriptionError'),
            error.message || '',
            "error"
        );
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <>
        <LoadingOverlay loading={isLoading} />
        <div className={`verification-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Enhanced Header */}
          <div className="verification-header">
            <div className="header-badge">
              <HiOutlineSparkles className="sparkle-icon" />
              <span>{getVerificationText('verification.header.badge')}</span>
            </div>
            <h2 className="verification-title">{getVerificationText('verification.header.title')}</h2>
            <p className="verification-subtitle">{getVerificationText('verification.header.subtitle')}</p>
          </div>

          {/* Security Info */}
          <div className="security-info">
            <div className="security-icon">
              <MdSecurity />
            </div>
            <div className="security-content">
              <h3>{getVerificationText('verification.security.title')}</h3>
              <p>{getVerificationText('verification.security.description')}</p>
            </div>
          </div>

          {/* Verification Channels */}
          <div className="verification-channels">
            <div className="channel whatsapp-channel">
              <div className="channel-icon">
                <FaWhatsapp />
              </div>
              <div className="channel-content">
                <h4>{getVerificationText('verification.channels.whatsapp')}</h4>
                <p>{getVerificationText('verification.channels.sentTo')}{companyInfo.contactPhoneNumber}</p>
              </div>
              <MdVerified className="channel-status" />
            </div>
            <div className="channel email-channel">
              <div className="channel-icon">
                <FaEnvelope />
              </div>
              <div className="channel-content">
                <h4>{getVerificationText('verification.channels.email')}</h4>
                <p>{companyInfo.contactEmail}</p>
              </div>
              <MdVerified className="channel-status" />
            </div>
          </div>

          {/* Code Input Section */}
          <div className="code-input-section">
            <label className="code-label">{getVerificationText('verification.codeInput.label')}</label>
            <div className="code-input-wrapper">
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                placeholder={getVerificationText('verification.codeInput.placeholder')}
                className={`verification-code-input ${enteredCode ? 'filled' : ''}`}
                maxLength="6"
                dir="ltr"
                disabled={isLoading}
              />
              {enteredCode && enteredCode.length >= 4 && (
                <FaCheckCircle className="input-success-icon" />
              )}
            </div>
          </div>

          {/* Timer Section */}
          <div className="timer-section">
            <div className="timer-icon">
              <FaClock />
            </div>
            <div className="timer-content">
              {timeLeft > 0 ? (
                <>
                  <span className="timer-label">{getVerificationText('verification.timer.validFor')}</span>
                  <span className="timer-value">{formatTime(timeLeft)}</span>
                </>
              ) : (
                <>
                  <FaExclamationTriangle className="timer-expired-icon" />
                  <span className="timer-expired">{getVerificationText('verification.timer.expired')}</span>
                </>
              )}
            </div>
          </div>

          {/* Resend Section */}
          <div className="resend-section">
            <p className="resend-text">{getVerificationText('verification.resend.question')}</p>
            <button 
              onClick={sendVerificationCode} 
              className={`resend-button ${isLoading ? 'disabled' : ''}`}
              disabled={isLoading}
            >
              <FaSync className={`resend-icon ${isLoading ? 'spinning' : ''}`} />
              <span>{getVerificationText('verification.resend.button')}</span>
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className={`navigation-buttons ${isRTL ? 'rtl' : 'ltr'}`}>
            <button 
              className="nav-button prev-button" 
              onClick={prevStep}
              disabled={isLoading}
            >
              {isRTL ? <FaArrowRight className="nav-icon" /> : <FaArrowLeft className="nav-icon" />}
              <span>{getVerificationText('verification.navigation.back')}</span>
            </button>
            <button 
              className={`nav-button next-button ${isLoading ? 'loading' : ''} ${(!enteredCode || timeLeft <= 0) ? 'disabled' : ''}`}
              onClick={handleVerification} 
              disabled={isLoading || timeLeft <= 0 || !enteredCode}
            >
              {isLoading ? (
                <>
                  <FaSync className="nav-icon spinning" />
                  <span>{currentLanguage === 'he' ? 'מאמת ויוצר מנוי...' : 'Verifying and creating subscription...'}</span>
                </>
              ) : (
                <>
                  <span>{getVerificationText('verification.navigation.verify')}</span>
                  {isRTL ? <FaArrowLeft className="nav-icon" /> : <FaArrowRight className="nav-icon" />}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tutorial Video Button */}
        <TutorialVideoButton step={4} />
      </>
    );
  };
  
  export default Verification;
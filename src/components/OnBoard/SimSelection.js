import React, { useState, useRef, useEffect } from 'react';
import './SimSelection.css';
import PhoneNumbersList from './PhoneNumbersList';
import PhoneInputWithModal from './PhoneInputWithModal';
import { cleanIsraeliPhoneNumber } from '@/utils/phoneUtils';
import FreeNumberWarningModal from './FreeNumberWarningModal';
import ExistingSimWarningModal from './ExistingSimWarningModal';
import TutorialVideoButton from './TutorialVideoButton';
import { FaMobileAlt, FaPhoneAlt, FaArrowRight, FaArrowLeft, FaShoppingCart, FaSync, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdVerified, MdCallReceived } from "react-icons/md";
import { useLanguage } from '@/contexts/LanguageContext';

const SimSelection = ({
    hasSim, setHasSim, useFreeNumber, setUseFreeNumber, organizationPhoneNumber, setOrganizationPhoneNumber,
    isPhoneNumberSelected, setIsPhoneNumberSelected, nextStep, prevStep,
    setForwardingPhoneNumber, forwardingPhoneNumber, useCoexisting, setUseCoexisting
}) => {
    const { t, currentLanguage, isRTL } = useLanguage();
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
    const [isValidForwardingNumber, setIsValidForwardingNumber] = useState(false); // ✅ Validation for forwarding number
    const [callForwarding, setCallForwarding] = useState(false);
    const [showPhoneNumbersList, setShowPhoneNumbersList] = useState(false);
    const [showSimSelectionButtons, setShowSimSelectionButtons] = useState(true);
    const [showFreeNumberWarning, setShowFreeNumberWarning] = useState(false);
    const [showExistingSimWarning, setShowExistingSimWarning] = useState(false);
    const [showHistoryTooltip, setShowHistoryTooltip] = useState(false);
    const [showAccountTypeGuide, setShowAccountTypeGuide] = useState(false);
    const [showFeatureComparisonModal, setShowFeatureComparisonModal] = useState(false); // ✅ NEW: Modal for feature comparison table
    const [showContactsInfoModal, setShowContactsInfoModal] = useState(false); // ✅ NEW: Modal for contacts sync explanation
    const forwardingSectionRef = useRef(null);

    // ✅ Block body scroll when modal is open
    useEffect(() => {
        if (showAccountTypeGuide || showFeatureComparisonModal || showContactsInfoModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showAccountTypeGuide, showFeatureComparisonModal, showContactsInfoModal]);

    const handleCloseAccountTypeGuide = () => {
        setShowAccountTypeGuide(false);
        document.body.style.overflow = 'unset';
    };

    const handlePhoneNumberChange = (phone) => {
        // Just update the value as user types
        setOrganizationPhoneNumber(phone);
    };

    const handlePhoneNumberBlur = () => {
        // ✅ Clean Israeli phone number when user leaves the field (remove leading 0 after country code)
        if (organizationPhoneNumber) {
            const cleanedPhone = cleanIsraeliPhoneNumber(organizationPhoneNumber);
            setOrganizationPhoneNumber(cleanedPhone);
            // בדיקה: המספר חייב להכיל לפחות 10 ספרות (בלי סימנים כמו +, -, רווחים)
            const digitsOnly = cleanedPhone ? cleanedPhone.replace(/\D/g, '') : '';
            setIsValidPhoneNumber(digitsOnly.length >= 10);
        }
    };

    const handleForwardingNumberChange = (phone) => {
        // Just update the value as user types
        setForwardingPhoneNumber(phone);
        // ✅ Real-time validation for forwarding number
        const digitsOnly = phone ? phone.replace(/\D/g, '') : '';
        setIsValidForwardingNumber(digitsOnly.length >= 10);
    };

    const handleForwardingNumberBlur = () => {
        // ✅ Clean Israeli phone number when user leaves the field (remove leading 0 after country code)
        if (forwardingPhoneNumber) {
            const cleanedPhone = cleanIsraeliPhoneNumber(forwardingPhoneNumber);
            setForwardingPhoneNumber(cleanedPhone);
            // ✅ Validate: must have at least 10 digits
            const digitsOnly = cleanedPhone ? cleanedPhone.replace(/\D/g, '') : '';
            setIsValidForwardingNumber(digitsOnly.length >= 10);
        } else {
            setIsValidForwardingNumber(false);
        }
    };

    const handleCallForwardingChange = (event) => {
        setCallForwarding(event.target.value === 'yes');
    };

    const handlePhoneNumberPurchase = (number) => {
        // ✅ Clean Israeli phone number (remove leading 0 after country code)
        const cleanedNumber = cleanIsraeliPhoneNumber(number);
        setOrganizationPhoneNumber(cleanedNumber);
        setIsPhoneNumberSelected(true);
        setTimeout(() => setShowPhoneNumbersList(false), 200);
    };

    const handleResetPhoneNumber = () => {
        setIsPhoneNumberSelected(false);
        setOrganizationPhoneNumber("");
        setShowPhoneNumbersList(true);
    };

    const handleExistingSimConfirm = () => {
        setShowExistingSimWarning(false);
        setHasSim(true);
        setUseFreeNumber(false);
        setShowPhoneNumbersList(false);
        setShowSimSelectionButtons(false);
    };

    const handleNextClick = () => {
        if (
            (hasSim && isValidPhoneNumber && organizationPhoneNumber) ||
            (useFreeNumber) ||
            (useCoexisting && isValidPhoneNumber && organizationPhoneNumber) ||
            // ✅ SIM purchase requires valid forwarding phone number (mandatory for verification codes)
            (isPhoneNumberSelected && forwardingPhoneNumber && isValidForwardingNumber)
        ) {
            nextStep();
        }
    };

    return (
        <div className={`sim-selection-wrapper ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="sim-selection-container" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Enhanced Header */}
                <div className="sim-header">
                    <div className="header-badge">
                        <HiOutlineSparkles className="sparkle-icon" />
                        <span>{t('simSelection.header.badge')}</span>
                    </div>
                    <h2 className="sim-title">{t('simSelection.header.title')}</h2>
                    <p className="sim-subtitle">{t('simSelection.header.subtitle')}</p>
                    
                    {/* ✅ איך לבחור סוג חשבון - Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <button 
                            type="button"
                            className="account-type-guide-button"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowAccountTypeGuide(true);
                            }}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#FFD700',
                                color: '#333',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            }}
                        >
                            <FaInfoCircle />
                            {currentLanguage === 'he' ? 'איך לבחור סוג חשבון?' : 'How to choose account type?'}
                        </button>
                    </div>
                </div>

            {showSimSelectionButtons && (
                <div className="sim-selection-options">
                    <div className="option-cards">
                        {/* 🏆 RECOMMENDED: Co-existing WABA Option - TOP PRIORITY */}
                        <div 
                            className="option-card coexisting-waba recommended" 
                            onClick={() => {
                                setHasSim(false);
                                setUseFreeNumber(false);
                                setUseCoexisting(true);
                                setShowPhoneNumbersList(false);
                                setShowSimSelectionButtons(false);
                                setIsPhoneNumberSelected(false);
                                // Scroll to phone input instead of moving to next step
                                setTimeout(() => {
                                    const phoneInputSection = document.querySelector('.coexisting-phone-input');
                                    if (phoneInputSection) {
                                        phoneInputSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                }, 300);
                            }}
                        >
                            <div className="recommended-badge">
                                <MdVerified className="verified-icon" />
                                <span>{currentLanguage === 'he' ? 'מומלץ ביותר' : 'Highly Recommended'}</span>
                            </div>
                            <div className="option-icon coexisting">
                                <FaSync />
                            </div>
                            <h3>
                                {currentLanguage === 'he' 
                                    ? 'חיבור חשבון WhatsApp Business קיים (Coexistence)' 
                                    : 'Connect Existing WhatsApp Business Account (Coexistence)'}
                            </h3>
                            <p>
                                {currentLanguage === 'he'
                                    ? 'כבר יש לך חשבון WhatsApp Business פעיל? חבר אותו למערכת ושמור על כל ההיסטוריה'
                                    : 'Already have an active WhatsApp Business account? Connect it to the system and preserve all history'}
                            </p>
                            <div className="option-features">
                                <div className="feature" style={{ position: 'relative' }}>
                                    <FaCheckCircle className="feature-icon" />
                                    <span>
                                        {currentLanguage === 'he' ? 'סנכרון כל ההיסטוריה (6 חודשים טקסט, מדיה 14 ימים אחורה)' : 'Sync all history (6 months text, media 14 days back)'}
                                    </span>
                                    <FaInfoCircle 
                                        className="info-icon"
                                        onMouseEnter={() => setShowHistoryTooltip(true)}
                                        onMouseLeave={() => setShowHistoryTooltip(false)}
                                        style={{ 
                                            marginRight: '8px', 
                                            cursor: 'pointer',
                                            color: '#25D366',
                                            fontSize: '16px'
                                        }}
                                    />
                                    {showHistoryTooltip && (
                                        <div 
                                            className="history-tooltip"
                                            onMouseEnter={() => setShowHistoryTooltip(true)}
                                            onMouseLeave={() => setShowHistoryTooltip(false)}
                                            style={{
                                            position: 'absolute',
                                            top: '28px',
                                            right: isRTL ? '-10px' : 'auto',
                                            left: isRTL ? 'auto' : '-10px',
                                                backgroundColor: '#fff',
                                                border: '2px solid #25D366',
                                                borderRadius: '8px',
                                                padding: '12px 16px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                zIndex: 1000,
                                                minWidth: '280px',
                                                maxWidth: '320px',
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                color: '#333',
                                                textAlign: isRTL ? 'right' : 'left',
                                                maxHeight: '400px',
                                                overflowY: 'auto'
                                            }}>
                                            {currentLanguage === 'he' ? (
                                                <>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        <strong>⏱️ טעינת הנתונים לוקחת עד 24 שעות</strong>
                                                    </div>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        💬 <strong>היסטוריה רק של צ'אטים 1:1</strong> (לא קבוצות)
                                                    </div>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        ניתן לטעון נתונים נוספים בתוספת תשלום -{' '}
                                                        <a href="https://gambot.co.il/PriceList/OnboardingServices" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'underline', fontWeight: 'bold' }}>
                                                            למידע נוסף
                                                        </a>
                                                    </div>
                                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setShowFeatureComparisonModal(true);
                                                            }}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                                fontSize: '13px',
                                                                fontWeight: 'bold',
                                                                width: '100%',
                                                                transition: 'transform 0.2s',
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                        >
                                                            📋 למידע נוסף על השינוי לחץ כאן
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        <strong>⏱️ Data loading takes up to 24 hours</strong>
                                                    </div>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        💬 <strong>History for 1:1 chats only</strong> (not groups)
                                                    </div>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        Additional data loading available for extra fee -{' '}
                                                        <a href="https://gambot.co.il/PriceList/OnboardingServices" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'underline', fontWeight: 'bold' }}>
                                                            More info
                                                        </a>
                                                    </div>
                                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setShowFeatureComparisonModal(true);
                                                            }}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                                fontSize: '13px',
                                                                fontWeight: 'bold',
                                                                width: '100%',
                                                                transition: 'transform 0.2s',
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                        >
                                                            📋 Click here for feature comparison
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="feature">
                                    <FaCheckCircle className="feature-icon" />
                                    <span>
                                        {currentLanguage === 'he' ? 'סנכרון אוטומטי של שיחות בזמן אמת' : 'Automatic real-time chat sync'}
                                    </span>
                                </div>
                                <div className="feature">
                                    <FaCheckCircle className="feature-icon" />
                                    <span>
                                        {currentLanguage === 'he' ? 'עבודה מהאפליקציה והמערכת במקביל' : 'Work from app and system in parallel'}
                                    </span>
                                </div>
                            </div>
                            <button className="option-button coexisting-btn primary">
                                <span>
                                    {currentLanguage === 'he' ? 'חבר חשבון קיים' : 'Connect Existing Account'}
                                </span>
                            </button>
                        </div>

                        {/* Purchase SIM - Second Option */}
                        <div 
                            className="option-card purchase-sim" 
                            onClick={() => {
                                setHasSim(false);
                                setUseFreeNumber(false);
                                setShowPhoneNumbersList(true);
                                setShowSimSelectionButtons(false);
                            }}
                        >
                            <div className="option-icon">
                                <FaShoppingCart />
                            </div>
                            <h3>{t('simSelection.options.purchase.title')}</h3>
                            <p>{t('simSelection.options.purchase.description')}</p>
                            <div className="option-features">
                                {t('simSelection.options.purchase.features').map((feature, index) => (
                                    <div key={index} className="feature">
                                        <FaCheckCircle className="feature-icon" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="option-button">
                                <span>{t('simSelection.options.purchase.button')}</span>
                            </button>
                        </div>

                        {/* Existing SIM - Third Option */}
                        <div 
                            className="option-card existing-sim" 
                            onClick={() => setShowExistingSimWarning(true)}
                        >
                            <div className="option-icon">
                                <FaMobileAlt />
                            </div>
                            <h3>{t('simSelection.options.existing.title')}</h3>
                            <p>{t('simSelection.options.existing.description')}</p>
                            <div className="option-features">
                                {t('simSelection.options.existing.features').map((feature, index) => (
                                    <div key={index} className="feature">
                                        <FaCheckCircle className="feature-icon" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="option-button">
                                <span>{t('simSelection.options.existing.button')}</span>
                            </button>
                        </div>

                        {/* Free Number - Fourth Option */}
                        <div 
                            className="option-card free-number" 
                            onClick={() => {
                                // Show warning modal first
                                setShowFreeNumberWarning(true);
                            }}
                        >
                            <div className="option-icon">
                                <FaPhoneAlt />
                            </div>
                            <h3>{t('simSelection.options.freeNumber.title')}</h3>
                            <p>{t('simSelection.options.freeNumber.description')}</p>
                            <div className="option-features">
                                {t('simSelection.options.freeNumber.features').map((feature, index) => (
                                    <div key={index} className="feature">
                                        <FaCheckCircle className="feature-icon" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="option-button">
                                <span>{t('simSelection.options.freeNumber.button')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {(hasSim !== null || useFreeNumber || useCoexisting) && (
                <div className="sim-selection-content">
                    {/* Change Selection Button */}
                    <button 
                        className="change-selection-button"
                        onClick={() => {
                            setShowSimSelectionButtons(true);
                            setHasSim(null);
                            setUseFreeNumber(false);
                            setUseCoexisting(false);
                            setIsPhoneNumberSelected(false);
                            setOrganizationPhoneNumber("");
                            setShowPhoneNumbersList(false);
                        }}
                    >
                        <FaSync className="change-icon" />
                        <span>{currentLanguage === 'he' ? 'שינוי סוג חשבון' : 'Change Account Type'}</span>
                    </button>

                    {useCoexisting ? (
                        <div className="coexisting-confirmation-section">
                            <div className="coexisting-header">
                                <FaSync className="coexisting-icon" />
                                <h3>
                                    {currentLanguage === 'he' 
                                        ? 'חיבור חשבון WhatsApp Business קיים' 
                                        : 'Connect Existing WhatsApp Business Account'}
                                </h3>
                                <p>
                                    {currentLanguage === 'he'
                                        ? 'הזן את מספר WhatsApp Business שלך (המספר שמשתמש באפליקציית WhatsApp Business)'
                                        : 'Enter your WhatsApp Business number (the number used in WhatsApp Business app)'}
                                </p>
                            </div>

                            {/* Phone Number Input for Co-existing */}
                            <div className="phone-input-section coexisting-phone-input">
                                <div className="input-header">
                                    <FaPhoneAlt className="input-icon" />
                                    <h3>
                                        {currentLanguage === 'he' 
                                            ? 'מספר WhatsApp Business הקיים שלך' 
                                            : 'Your Existing WhatsApp Business Number'}
                                    </h3>
                                    <div className="coexisting-explanation">
                                        <div className="explanation-badge">
                                            <FaCheckCircle className="badge-icon" />
                                            <span>{currentLanguage === 'he' ? 'חשוב לדעת' : 'Important'}</span>
                                        </div>
                                        <p>
                                            {currentLanguage === 'he'
                                                ? 'זהו מספר WhatsApp Business שכבר עובד אצלך באפליקציה. נחבר את המספר הזה ל-API של Gambot כך שתוכל לעבוד גם מהאפליקציה וגם מהמערכת במקביל, עם שמירה על כל ההיסטוריה.'
                                                : 'This is your WhatsApp Business number that is already active in the app. We will connect this number to Gambot API so you can work from both the app and the system in parallel, while preserving all history.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="phone-input-wrapper">
                                    <PhoneInputWithModal
                                        country={'il'}
                                        value={organizationPhoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        onBlur={handlePhoneNumberBlur}
                                        inputProps={{
                                            name: 'coexistingPhoneNumber',
                                            required: true,
                                            placeholder: currentLanguage === 'he' ? 'הזן את מספר WhatsApp Business שלך' : 'Enter your WhatsApp Business number',
                                        }}
                                        enableSearch
                                        disableDropdown={false}
                                        containerClass="enhanced-phone-input-container"
                                        inputClass="enhanced-phone-input-field"
                                    />
                                </div>
                                {organizationPhoneNumber && !isValidPhoneNumber && (
                                    <div className="error-message">
                                        <span className="error-icon">⚠️</span>
                                        <span>{currentLanguage === 'he' ? 'מספר הטלפון חייב להכיל לפחות 10 ספרות' : 'Phone number must contain at least 10 digits'}</span>
                                    </div>
                                )}
                                {!organizationPhoneNumber && (
                                    <div className="error-message">
                                        <span className="error-icon">⚠️</span>
                                        <span>{currentLanguage === 'he' ? 'יש להזין מספר טלפון' : 'Phone number is required'}</span>
                                    </div>
                                )}
                            </div>

                            <div className="coexisting-details">
                                <div className="detail-item" style={{ position: 'relative' }}>
                                    <FaCheckCircle className="detail-icon" />
                                    <span>
                                        {currentLanguage === 'he' ? 'סנכרון כל ההיסטוריה (6 חודשים טקסט, מדיה 14 ימים אחורה)' : 'Sync all history (6 months text, media 14 days back)'}
                                    </span>
                                    <FaInfoCircle 
                                        className="info-icon"
                                        onMouseEnter={() => setShowHistoryTooltip(true)}
                                        onMouseLeave={() => setShowHistoryTooltip(false)}
                                        style={{ 
                                            marginRight: '8px', 
                                            cursor: 'pointer',
                                            color: '#25D366',
                                            fontSize: '16px'
                                        }}
                                    />
                                    {showHistoryTooltip && (
                                        <div 
                                            className="history-tooltip"
                                            onMouseEnter={() => setShowHistoryTooltip(true)}
                                            onMouseLeave={() => setShowHistoryTooltip(false)}
                                            style={{
                                            position: 'absolute',
                                            top: '28px',
                                            right: isRTL ? '-10px' : 'auto',
                                            left: isRTL ? 'auto' : '-10px',
                                                backgroundColor: '#fff',
                                                border: '2px solid #25D366',
                                                borderRadius: '8px',
                                                padding: '12px 16px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                zIndex: 1000,
                                                minWidth: '280px',
                                                maxWidth: '320px',
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                color: '#333',
                                                textAlign: isRTL ? 'right' : 'left',
                                                maxHeight: '400px',
                                                overflowY: 'auto'
                                            }}>
                                            {currentLanguage === 'he' ? (
                                                <>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        <strong>⏱️ טעינת הנתונים לוקחת עד 24 שעות</strong>
                                                    </div>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        💬 <strong>היסטוריה רק של צ'אטים 1:1</strong> (לא קבוצות)
                                                    </div>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        ניתן לטעון נתונים נוספים בתוספת תשלום -{' '}
                                                        <a href="https://gambot.co.il/PriceList/OnboardingServices" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'underline', fontWeight: 'bold' }}>
                                                            למידע נוסף
                                                        </a>
                                                    </div>
                                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setShowFeatureComparisonModal(true);
                                                            }}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                                fontSize: '13px',
                                                                fontWeight: 'bold',
                                                                width: '100%',
                                                                transition: 'transform 0.2s',
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                        >
                                                            📋 למידע נוסף על השינוי לחץ כאן
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        <strong>⏱️ Data loading takes up to 24 hours</strong>
                                                    </div>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        💬 <strong>History for 1:1 chats only</strong> (not groups)
                                                    </div>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        Additional data loading available for extra fee -{' '}
                                                        <a href="https://gambot.co.il/PriceList/OnboardingServices" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'underline', fontWeight: 'bold' }}>
                                                            More info
                                                        </a>
                                                    </div>
                                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setShowFeatureComparisonModal(true);
                                                            }}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                                fontSize: '13px',
                                                                fontWeight: 'bold',
                                                                width: '100%',
                                                                transition: 'transform 0.2s',
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                        >
                                                            📋 Click here for feature comparison
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="detail-item">
                                    <FaCheckCircle className="detail-icon" />
                                    <span>
                                        {currentLanguage === 'he' ? 'סנכרון אוטומטי של שיחות בזמן אמת' : 'Real-time automatic chat synchronization'}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <FaCheckCircle className="detail-icon" />
                                    <span>
                                        {currentLanguage === 'he' ? 'עבודה במקביל מהאפליקציה והמערכת' : 'Parallel work from app and system'}
                                    </span>
                                </div>
                                
                                {/* ⚠️ Contacts Warning */}
                                <div className="detail-item warning" style={{
                                    backgroundColor: '#FFF3CD',
                                    border: '2px solid #FFC107',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginTop: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FaInfoCircle style={{ color: '#FF9800', fontSize: '24px', flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ color: '#E65100', fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                                                {currentLanguage === 'he' ? '⚠️ חשוב לדעת: שמות אנשי קשר לא יטענו' : '⚠️ Important: Contact names will not load'}
                                            </strong>
                                            <span style={{ color: '#666', fontSize: '14px' }}>
                                                {currentLanguage === 'he' 
                                                    ? 'תראה רק מספרי טלפון בשיחות. זו מגבלה טכנית של Meta מסיבות פרטיות.'
                                                    : 'You will only see phone numbers in chats. This is a Meta technical limitation for privacy reasons.'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowContactsInfoModal(true);
                                        }}
                                        style={{
                                            background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '10px 16px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        <FaInfoCircle />
                                        {currentLanguage === 'he' ? 'למה זה קורה? (הסבר מפורט)' : 'Why does this happen? (Detailed explanation)'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : useFreeNumber ? (
                        <div className="free-number-confirmation-section">
                            <div className="free-number-header">
                                <FaPhoneAlt className="free-number-icon" />
                                <h3>{t('simSelection.freeNumber.confirmation.title')}</h3>
                                <p>{t('simSelection.freeNumber.confirmation.description')}</p>
                            </div>
                            <div className="free-number-details">
                                <div className="detail-item">
                                    <FaCheckCircle className="detail-icon" />
                                    <span>{t('simSelection.freeNumber.confirmation.autoVerified')}</span>
                                </div>
                                <div className="detail-item">
                                    <FaCheckCircle className="detail-icon" />
                                    <span>{t('simSelection.freeNumber.confirmation.format')}</span>
                                </div>
                                <div className="detail-item warning">
                                    <FaCheckCircle className="detail-icon" />
                                    <span>{t('simSelection.freeNumber.confirmation.limitation')}</span>
                                </div>
                            </div>
                        </div>
                    ) : hasSim ? (
                        <div className="phone-input-section">
                            <div className="input-header">
                                <FaPhoneAlt className="input-icon" />
                                <h3>{t('simSelection.phoneInput.title')}</h3>
                                <p>{t('simSelection.phoneInput.description')}</p>
                            </div>
                            <div className="phone-input-wrapper">
                                <PhoneInputWithModal
                                    country={'il'}
                                    value={organizationPhoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    onBlur={handlePhoneNumberBlur}
                                    inputProps={{
                                        name: 'phoneNumber',
                                        required: true,
                                        placeholder: t('simSelection.phoneInput.placeholder'),
                                    }}
                                    enableSearch
                                    disableDropdown={false}
                                    containerClass="enhanced-phone-input-container"
                                    inputClass="enhanced-phone-input-field"
                                />
                            </div>
                            {organizationPhoneNumber && !isValidPhoneNumber && (
                                <div className="error-message">
                                    <span className="error-icon">⚠️</span>
                                    <span>{t('simSelection.phoneInput.validation.minLength')}</span>
                                </div>
                            )}
                            {!organizationPhoneNumber && hasSim && (
                                <div className="error-message">
                                    <span className="error-icon">⚠️</span>
                                    <span>{t('simSelection.phoneInput.validation.required')}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {showPhoneNumbersList && !isPhoneNumberSelected && (
                                <div className="sim-selection-phone-number-list">
                                    <PhoneNumbersList onPhoneNumberSelect={handlePhoneNumberPurchase} />
                                </div>
                            )}

                            {isPhoneNumberSelected && (
                                <div className="selected-phone-section">
                                    <div className="selection-confirmation">
                                        <FaCheckCircle className="confirmation-icon" />
                                        <div className="confirmation-content">
                                            <h3>{t('simSelection.confirmation.selected')}</h3>
                                            <div className="selected-number">
                                                <span className="phone-prefix">{organizationPhoneNumber.slice(0, 4)}</span>
                                                <span className="phone-number">{organizationPhoneNumber.slice(4)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="reset-button" onClick={handleResetPhoneNumber}>
                                        <FaSync className="reset-icon" />
                                        <span>{t('simSelection.confirmation.change')}</span>
                                    </button>
                                </div>
                            )}

                            {isPhoneNumberSelected && (
                                <div ref={forwardingSectionRef} className="forwarding-section">
                                    <div className="forwarding-header">
                                        <MdCallReceived className="forwarding-icon" />
                                        <h3>{t('simSelection.callForwarding.title')}</h3>
                                        <p>{t('simSelection.callForwarding.description')}</p>
                                        {/* ✅ Mandatory notice for verification codes */}
                                        <p style={{ color: '#e74c3c', fontWeight: '500', marginTop: '8px', fontSize: '14px' }}>
                                            * שדה חובה - קודי אימות יועברו למספר זה בתהליך ההצטרפות
                                        </p>
                                    </div>
                                    {/* ✅ Always show phone input - mandatory for SIM purchase */}
                                    <div className="forwarding-input-section">
                                        <div className="input-header">
                                            <FaPhoneAlt className="input-icon" />
                                            <h4>{t('simSelection.callForwarding.forwardingNumber.title')}</h4>
                                            <p>{t('simSelection.callForwarding.forwardingNumber.description')}</p>
                                        </div>
                                        <div className="phone-input-wrapper">
                                            <PhoneInputWithModal
                                                country={'il'}
                                                value={forwardingPhoneNumber}
                                                onChange={handleForwardingNumberChange}
                                                onBlur={handleForwardingNumberBlur}
                                                inputProps={{
                                                    name: 'forwardingPhoneNumber',
                                                    required: true,
                                                    placeholder: t('simSelection.callForwarding.forwardingNumber.placeholder'),
                                                }}
                                                containerClass="enhanced-phone-input-container"
                                                inputClass="enhanced-phone-input-field"
                                                enableSearch
                                                disableDropdown={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </>
                    )}

                    <div className="navigation-buttons">
                        <button 
                            className="nav-button prev-button" 
                            onClick={() => {
                                prevStep();
                                setShowSimSelectionButtons(true);
                                setHasSim(null);
                                setUseFreeNumber(false);
                                setUseCoexisting(false);
                                setIsPhoneNumberSelected(false);
                                setOrganizationPhoneNumber("");
                                setShowPhoneNumbersList(false);
                            }}
                        >
                            <span>{t('simSelection.navigation.back')}</span>
                        </button>
                        <button 
                            className={`nav-button next-button ${
                                useFreeNumber ? '' : 
                                useCoexisting ? (!isValidPhoneNumber || !organizationPhoneNumber ? 'disabled' : '') :
                                // ✅ SIM purchase requires valid forwarding phone number (mandatory for verification codes)
                                (hasSim ? (!isValidPhoneNumber || !organizationPhoneNumber) : (!isPhoneNumberSelected || !forwardingPhoneNumber || !isValidForwardingNumber)) ? 'disabled' : ''
                            }`}
                            onClick={handleNextClick}
                            disabled={
                                useFreeNumber ? false : 
                                useCoexisting ? (!isValidPhoneNumber || !organizationPhoneNumber) :
                                // ✅ SIM purchase requires valid forwarding phone number (mandatory for verification codes)
                                hasSim ? (!isValidPhoneNumber || !organizationPhoneNumber) : (!isPhoneNumberSelected || !forwardingPhoneNumber || !isValidForwardingNumber)
                            }
                        >
                            <span>{t('simSelection.navigation.next')}</span>
                        </button>
                    </div>
                </div>
            )}
            </div>

            {/* Existing SIM Warning Modal */}
            <ExistingSimWarningModal 
                isOpen={showExistingSimWarning}
                onClose={() => setShowExistingSimWarning(false)}
                onConfirm={handleExistingSimConfirm}
            />

            {/* Free Number Warning Modal */}
            <FreeNumberWarningModal 
                isOpen={showFreeNumberWarning}
                onClose={() => setShowFreeNumberWarning(false)}
                onConfirm={() => {
                    // User confirmed they understand - proceed with free number
                    setHasSim(false);
                    setUseFreeNumber(true);
                    setShowPhoneNumbersList(false);
                    setShowSimSelectionButtons(false);
                    setIsPhoneNumberSelected(true);
                    setOrganizationPhoneNumber(''); // Will be fetched from Meta after WABA connection
                    setShowFreeNumberWarning(false);
                    // Skip the confirmation screen and go directly to next step (BasicInfo)
                    setTimeout(() => {
                        nextStep();
                    }, 100);
                }}
            />

            {/* Account Type Guide Modal */}
            {showAccountTypeGuide && (
                <div className="account-type-guide-modal-overlay" onClick={handleCloseAccountTypeGuide} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '40px 20px',
                    overflowY: 'auto'
                }}>
                    <div className="account-type-guide-modal-content" onClick={(e) => e.stopPropagation()} style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        padding: '32px',
                        position: 'relative',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        direction: isRTL ? 'rtl' : 'ltr'
                    }}>
                        {/* Close Button */}
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleCloseAccountTypeGuide();
                            }}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: isRTL ? 'auto' : '16px',
                                left: isRTL ? '16px' : 'auto',
                                background: 'none',
                                border: 'none',
                                fontSize: '28px',
                                cursor: 'pointer',
                                color: '#999',
                                lineHeight: 1,
                                padding: '4px'
                            }}
                        >
                            ✕
                        </button>

                        {/* Modal Header */}
                        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                            <h2 style={{ 
                                fontSize: '28px', 
                                fontWeight: 'bold', 
                                color: '#333',
                                marginBottom: '12px'
                            }}>
                                {currentLanguage === 'he' ? 'איך לבחור את סוג החשבון המתאים?' : 'How to choose the right account type?'}
                            </h2>
                            <p style={{ fontSize: '16px', color: '#666' }}>
                                {currentLanguage === 'he' ? 'בחר את האופציה המתאימה לצרכים העסקיים שלך' : 'Choose the option that fits your business needs'}
                            </p>
                        </div>

                        {/* Account Type Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Option 1: Pure API */}
                            <div style={{
                                border: '2px solid #e0e0e0',
                                borderRadius: '12px',
                                padding: '24px',
                                backgroundColor: '#f8f9fa'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: '#4285F4',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px'
                                    }}>
                                        🏢
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>
                                            {currentLanguage === 'he' ? 'Pure API - לארגונים גדולים' : 'Pure API - For Large Organizations'}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
                                            {currentLanguage === 'he' ? 'מוקדי שירות ומכירות' : 'Service and sales centers'}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ paddingRight: isRTL ? '60px' : 0, paddingLeft: isRTL ? 0 : '60px' }}>
                                    <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6', marginBottom: '12px' }}>
                                        {currentLanguage === 'he' 
                                            ? 'מתאים לעסקים שאין להם חשיבות לשמירה על גישה לאפליקציית WhatsApp Business'
                                            : 'Suitable for businesses that don\'t need to maintain access to WhatsApp Business app'}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'לרכוש SIM מאיתנו' : 'Purchase SIM from us'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'להביא SIM משלכם' : 'Bring your own SIM'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'שליטה מלאה דרך API בלבד' : 'Full control via API only'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'מתאים לעבודה אינטנסיבית במערכת - התכתבות בריבוי נציגים באופן שוטף' : 'Suitable for intensive system work - multi-agent communication'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'סינון לידים, אוטומציות ותהליכים מתקדמים' : 'Lead filtering, automation, and advanced processes'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Option 2: Coexistence */}
                            <div style={{
                                border: '2px solid #25D366',
                                borderRadius: '12px',
                                padding: '24px',
                                backgroundColor: '#f0fdf4',
                                position: 'relative'
                            }}>
                                {/* Recommended Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    right: isRTL ? '24px' : 'auto',
                                    left: isRTL ? 'auto' : '24px',
                                    backgroundColor: '#FFD700',
                                    color: '#333',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    ⭐ {currentLanguage === 'he' ? 'מומלץ' : 'Recommended'}
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', marginTop: '8px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: '#25D366',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px'
                                    }}>
                                        🔄
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>
                                            {currentLanguage === 'he' ? 'חיבור חשבון WhatsApp - Coexistence' : 'Connect WhatsApp Account - Coexistence'}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
                                            {currentLanguage === 'he' ? 'SMB - עבודה במקביל' : 'SMB - Parallel work'}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ paddingRight: isRTL ? '60px' : 0, paddingLeft: isRTL ? 0 : '60px' }}>
                                    <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6', marginBottom: '12px' }}>
                                        {currentLanguage === 'he' 
                                            ? 'מתאים לעסקים שרוצים לשמור על הגישה לאפליקציית WhatsApp Business ולעבוד במקביל'
                                            : 'Suitable for businesses that want to keep access to WhatsApp Business app and work in parallel'}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'עבודה מהאפליקציה והמערכת במקביל' : 'Work from app and system in parallel'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'סנכרון היסטוריה (6 חודשים טקסט)' : 'History sync (6 months text)'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'שמירת המספר והחשבון הקיים' : 'Keep existing number and account'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'בוט AI לסינון לידים ועבודה במקביל לנציג אנושי' : 'AI bot for lead filtering working alongside human agents'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'מתאים לעסקים שעושים קמפיינים מדי פעם' : 'Suitable for businesses running campaigns occasionally'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaCheckCircle style={{ color: '#25D366', flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {currentLanguage === 'he' ? 'עבודה מדי פעם במערכת עם ריבוי נציגים' : 'Occasional system work with multiple agents'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Close Button at Bottom */}
                        <div style={{ marginTop: '32px', textAlign: 'center' }}>
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCloseAccountTypeGuide();
                                }}
                                style={{
                                    padding: '12px 32px',
                                    backgroundColor: '#25D366',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#20BD5A'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#25D366'}
                            >
                                {currentLanguage === 'he' ? 'הבנתי, תודה!' : 'Got it, thanks!'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Feature Comparison Modal */}
            {showFeatureComparisonModal && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10000,
                        padding: '20px',
                        overflow: 'auto'
                    }}
                    onClick={() => setShowFeatureComparisonModal(false)}
                >
                    <div 
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            maxWidth: '1200px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            padding: '32px',
                            position: 'relative',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                            direction: isRTL ? 'rtl' : 'ltr'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowFeatureComparisonModal(false);
                            }}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: isRTL ? 'auto' : '16px',
                                left: isRTL ? '16px' : 'auto',
                                background: '#ff4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                fontSize: '20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
                                fontWeight: 'bold'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            ×
                        </button>

                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <h2 style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '8px'
                            }}>
                                {currentLanguage === 'he' ? 'השוואת פיצ\'רים' : 'Feature Comparison'}
                            </h2>
                            <p style={{ color: '#666', fontSize: '16px' }}>
                                {currentLanguage === 'he' 
                                    ? 'השינויים באפליקציית WhatsApp Business לאחר חיבור למערכת' 
                                    : 'Changes to WhatsApp Business app after connecting to the system'}
                            </p>
                        </div>

                        {/* Table Container */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '14px',
                                textAlign: isRTL ? 'right' : 'left'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f0f9f4', borderBottom: '3px solid #25D366' }}>
                                        <th style={{ padding: '16px', fontWeight: 'bold', color: '#128C7E', minWidth: '200px' }}>
                                            {currentLanguage === 'he' ? 'פיצ\'ר קיים באפליקציית WhatsApp Business' : 'Existing feature on WhatsApp Business App'}
                                        </th>
                                        <th style={{ padding: '16px', fontWeight: 'bold', color: '#128C7E', minWidth: '250px' }}>
                                            {currentLanguage === 'he' ? 'שינויים לאחר חיבור ל-Cloud API' : 'Changes AFTER onboarding to Cloud API'}
                                        </th>
                                        <th style={{ padding: '16px', fontWeight: 'bold', color: '#128C7E', minWidth: '200px' }}>
                                            {currentLanguage === 'he' ? 'מה תקבל ב-Gambot' : 'What you get in Gambot'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentLanguage === 'he' ? (
                                        <>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>💬 שיחות אישיות (1:1)</td>
                                                <td style={{ padding: '16px' }}>אין שינוי</td>
                                                <td style={{ padding: '16px' }}>
                                                    ✅ <strong>נתמך.</strong> כל ההודעות מ-6 החודשים האחרונים יסונכרנו. הודעות נשלחות ומתקבלות ישוקפו בין ה-Cloud API לאפליקציית WhatsApp Business
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '8px', 
                                                        backgroundColor: '#FFF9C4', 
                                                        borderRadius: '6px',
                                                        borderRight: '3px solid #FBC02D'
                                                    }}>
                                                        ⚠️ <strong style={{ color: '#F57F17' }}>חשוב:</strong> קבצי מדיה (תמונות, וידאו, קבצים) מסתנכרנים רק <strong>14 יום אחורה</strong>. טקסט ההודעות מסתנכרן 6 חודשים.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>👥 אנשי קשר</td>
                                                <td style={{ padding: '16px' }}>אין שינוי</td>
                                                <td style={{ padding: '16px' }}>
                                                    ⚠️ <strong>נתמך חלקית.</strong> רק אנשי קשר שנשמרו <strong>בתוך WhatsApp</strong> יסונכרנו (לא אלה שבטלפון)
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '8px', 
                                                        backgroundColor: '#FFF3CD', 
                                                        borderRadius: '6px',
                                                        borderRight: '3px solid #FFC107'
                                                    }}>
                                                        ⚠️ <strong style={{ color: '#E65100' }}>חשוב!</strong> שמות אנשי קשר <strong>לא יסתנכרנו</strong> - תראה רק מספרים. רק אנשי קשר ששמרת <strong>בתוך אפליקציית WhatsApp</strong> יסתנכרנו (לא אלה שבאנשי קשר של הטלפון).
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setShowContactsInfoModal(true);
                                                            }}
                                                            style={{
                                                                marginTop: '8px',
                                                                background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                padding: '6px 12px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            📖 הסבר מפורט + פתרונות
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>👨‍👩‍👧‍👦 שיחות קבוצתיות</td>
                                                <td style={{ padding: '16px' }}>אין שינוי</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>לא נתמך.</strong> שיחות קבוצה לא יסונכרנו</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>
                                                    ⏱️ הודעות נעלמות
                                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                        (הודעות שנמחקות אוטומטית אחרי 24 שעות/7 ימים/90 ימים)
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px' }}>הודעות נעלמות יכובו לכל השיחות האישיות (1:1)</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>לא נתמך</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>👁️ צפה פעם אחת</td>
                                                <td style={{ padding: '16px' }}>הודעות "צפה פעם אחת" יושבתו לכל השיחות האישיות (1:1)</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>לא נתמך</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>📍 מיקום חי</td>
                                                <td style={{ padding: '16px' }}>הודעות מיקום חי יושבתו לכל השיחות האישיות (1:1)</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>לא נתמך</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>📢 רשימות שידור</td>
                                                <td style={{ padding: '16px' }}>רשימות שידור יושבתו. לא ניתן ליצור רשימות חדשות. רשימות קיימות יהיו לקריאה בלבד</td>
                                                <td style={{ padding: '16px' }}>
                                                    ❌ <strong>לא נתמך</strong>
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '8px', 
                                                        backgroundColor: '#e8f5e9', 
                                                        borderRadius: '6px',
                                                        borderRight: '3px solid #25D366'
                                                    }}>
                                                        ✅ <strong style={{ color: '#25D366' }}>חשוב!</strong> קמפיינים של Gambot <strong>כן עובדים</strong> (ואפילו טוב יותר!) - שליחה להרבה אנשי קשר עם פילטרים מתקדמים, מעקב ודיווח 📊
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>📞 שיחות קוליות ווידאו</td>
                                                <td style={{ padding: '16px' }}>אין שינוי</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>לא נתמך</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>🛍️ כלים עסקיים (קטלוג, הזמנות, סטטוס)</td>
                                                <td style={{ padding: '16px' }}>אין שינוי</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>לא נתמך</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>💬 כלי הודעות (הודעות שיווק, ברכה, היעדרות)</td>
                                                <td style={{ padding: '16px' }}>אין שינוי</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>לא נתמך</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>🏢 פרופיל עסקי (שם, כתובת, אתר)</td>
                                                <td style={{ padding: '16px' }}>אין שינוי</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>לא נתמך</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>📺 ערוצים</td>
                                                <td style={{ padding: '16px' }}>אין שינוי</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>לא נתמך</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>🔗 מכשירים מקושרים</td>
                                                <td style={{ padding: '16px' }}>ניתן לקשר עד 4 מכשירים. כל המכשירים הקיימים ינותקו בעת חיבור ל-Cloud API ויהיה צורך לחבר מחדש</td>
                                                <td style={{ padding: '16px' }}>
                                                    ✅ <strong>נתמך מלא!</strong> אפשר לקשר עד 4 מכשירים
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '8px', 
                                                        backgroundColor: '#E8F5E9', 
                                                        borderRadius: '6px',
                                                        borderRight: '3px solid #25D366'
                                                    }}>
                                                        ✅ WhatsApp Desktop (Windows/Mac) - עובד מצוין!<br/>
                                                        ✅ WhatsApp Web בדפדפן - עובד מצוין!<br/>
                                                        ✅ מכשירים נוספים - עובד מצוין!
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    ) : (
                                        <>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>💬 Individual (1:1) chats</td>
                                                <td style={{ padding: '16px' }}>Message Edit/Revoke is no longer supported</td>
                                                <td style={{ padding: '16px' }}>
                                                    ✅ <strong>Supported.</strong> All chat messages in the most recent 6 months can be synchronized. Messages sent and received are mirrored between Cloud API and WhatsApp Business app
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '8px', 
                                                        backgroundColor: '#FFF9C4', 
                                                        borderRadius: '6px',
                                                        borderLeft: '3px solid #FBC02D'
                                                    }}>
                                                        ⚠️ <strong style={{ color: '#F57F17' }}>Important:</strong> Media files (images, videos, files) sync only <strong>14 days back</strong>. Message text syncs 6 months.
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>👥 Contacts</td>
                                                <td style={{ padding: '16px' }}>No change</td>
                                                <td style={{ padding: '16px' }}>
                                                    ⚠️ <strong>Partially supported.</strong> Only contacts saved <strong>within WhatsApp</strong> will sync (not those in phone)
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '8px', 
                                                        backgroundColor: '#FFF3CD', 
                                                        borderRadius: '6px',
                                                        borderLeft: '3px solid #FFC107'
                                                    }}>
                                                        ⚠️ <strong style={{ color: '#E65100' }}>Important!</strong> Contact names <strong>will not sync</strong> - you will only see numbers. Only contacts saved <strong>within WhatsApp app</strong> will sync (not those in phone contacts).
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setShowContactsInfoModal(true);
                                                            }}
                                                            style={{
                                                                marginTop: '8px',
                                                                background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                padding: '6px 12px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            📖 Detailed explanation + solutions
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>👨‍👩‍👧‍👦 Group chats</td>
                                                <td style={{ padding: '16px' }}>No change</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>Not supported.</strong> Group chats will not be synchronized</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>
                                                    ⏱️ Disappearing messages
                                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                        (messages that auto-delete after 24h/7d/90d)
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px' }}>Disappearing messages will be turned off for all individual (1:1) chats</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>Not supported</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>👁️ View once message</td>
                                                <td style={{ padding: '16px' }}>View once messages will be disabled for all individual (1:1) chats</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>Not supported</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>📍 Live location message</td>
                                                <td style={{ padding: '16px' }}>Live location messages will be disabled for all individual (1:1) chats</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>Not supported</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>📢 Broadcast lists</td>
                                                <td style={{ padding: '16px' }}>Broadcast list will be disabled. Business will not be able to create new Broadcast Lists. Existing Broadcast Lists will become read-only</td>
                                                <td style={{ padding: '16px' }}>
                                                    ❌ <strong>Not supported</strong>
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '8px', 
                                                        backgroundColor: '#e8f5e9', 
                                                        borderRadius: '6px',
                                                        borderLeft: '3px solid #25D366'
                                                    }}>
                                                        ✅ <strong style={{ color: '#25D366' }}>Important!</strong> Gambot Campaigns <strong>work great</strong> (even better!) - send to many contacts with advanced filters, tracking & reporting 📊
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>📞 Voice and video calls</td>
                                                <td style={{ padding: '16px' }}>No change</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>Not supported</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>🛍️ Business tools (catalog, orders, status)</td>
                                                <td style={{ padding: '16px' }}>No change</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>Not supported</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>💬 Messaging tools (marketing, greeting, away message)</td>
                                                <td style={{ padding: '16px' }}>No change</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>Not supported</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>🏢 Business profile (name, address, website)</td>
                                                <td style={{ padding: '16px' }}>No change</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>Not supported</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>📺 Channels</td>
                                                <td style={{ padding: '16px' }}>No change</td>
                                                <td style={{ padding: '16px' }}>❌ <strong>Not supported</strong></td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>🔗 Linked devices</td>
                                                <td style={{ padding: '16px' }}>Businesses can link up to 4 companion clients. All companion clients will be unlinked after onboarding and need to be re-linked</td>
                                                <td style={{ padding: '16px' }}>
                                                    ✅ <strong>Fully supported!</strong> Link up to 4 devices
                                                    <div style={{ 
                                                        marginTop: '8px', 
                                                        padding: '8px', 
                                                        backgroundColor: '#E8F5E9', 
                                                        borderRadius: '6px',
                                                        borderLeft: '3px solid #25D366'
                                                    }}>
                                                        ✅ WhatsApp Desktop (Windows/Mac) - works great!<br/>
                                                        ✅ WhatsApp Web in browser - works great!<br/>
                                                        ✅ Additional devices - works great!
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Link to comprehensive blog post */}
                        <div style={{ 
                            marginTop: '24px', 
                            padding: '20px', 
                            backgroundColor: '#E8F5E9', 
                            borderRadius: '12px',
                            border: '2px solid #25D366',
                            textAlign: 'center'
                        }}>
                            <div style={{ 
                                fontSize: '18px', 
                                fontWeight: 'bold', 
                                color: '#128C7E', 
                                marginBottom: '12px' 
                            }}>
                                {currentLanguage === 'he' ? '📚 רוצים הסבר מפורט יותר?' : '📚 Want a more detailed explanation?'}
                            </div>
                            <p style={{ 
                                color: '#555', 
                                fontSize: '14px', 
                                marginBottom: '16px',
                                lineHeight: '1.6'
                            }}>
                                {currentLanguage === 'he' 
                                    ? 'קראו את המאמר המלא שלנו עם הסברים מפורטים, הטבלה המלאה, וסרטון הסבר מקיף על כל מה שחשוב לדעת לפני המעבר ל-Cloud API'
                                    : 'Read our comprehensive article with detailed explanations, the full comparison table, and an explanatory video about everything you need to know before switching to Cloud API'}
                            </p>
            <a 
                href="https://gambot.co.il/blog/coexistence-של-whatsapp-מה-זה-ומה-חשוב-לדעת-לפני-שבוחרים"
                target="_blank"
                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
                                }}
                            >
                                {currentLanguage === 'he' ? '📖 למאמר המלא + סרטון הסבר 🎥' : '📖 Read Full Article + Watch Video 🎥'}
                            </a>
                        </div>

                        {/* Close Button at Bottom */}
                        <div style={{ marginTop: '32px', textAlign: 'center' }}>
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowFeatureComparisonModal(false);
                                }}
                                style={{
                                    padding: '12px 32px',
                                    backgroundColor: '#25D366',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#20BD5A'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#25D366'}
                            >
                                {currentLanguage === 'he' ? 'הבנתי, תודה!' : 'Got it, thanks!'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ⚠️ Contacts Info Modal - Why contact names won't load */}
            {showContactsInfoModal && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10001,
                        padding: '20px',
                        overflow: 'auto'
                    }}
                    onClick={() => setShowContactsInfoModal(false)}
                >
                    <div 
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            maxWidth: '800px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            padding: '32px',
                            position: 'relative',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                            direction: isRTL ? 'rtl' : 'ltr'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowContactsInfoModal(false);
                            }}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: isRTL ? 'auto' : '16px',
                                left: isRTL ? '16px' : 'auto',
                                background: '#ff4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                fontSize: '20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
                                fontWeight: 'bold'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            ×
                        </button>

                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{
                                fontSize: '48px',
                                marginBottom: '16px'
                            }}>
                                ⚠️
                            </div>
                            <h2 style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: '#E65100',
                                marginBottom: '8px'
                            }}>
                                {currentLanguage === 'he' ? 'למה שמות אנשי קשר לא יטענו?' : 'Why won\'t contact names load?'}
                            </h2>
                            <p style={{ color: '#666', fontSize: '16px' }}>
                                {currentLanguage === 'he' 
                                    ? 'הסבר טכני על מגבלות סנכרון אנשי קשר' 
                                    : 'Technical explanation of contacts sync limitations'}
                            </p>
                        </div>

                        {/* Content */}
                        <div style={{ 
                            textAlign: isRTL ? 'right' : 'left',
                            fontSize: '16px',
                            lineHeight: '1.8',
                            color: '#333'
                        }}>
                            {currentLanguage === 'he' ? (
                                <>
                                    {/* Hebrew Content */}
                                    <div style={{ 
                                        backgroundColor: '#FFF3CD', 
                                        border: '2px solid #FFC107',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        marginBottom: '24px'
                                    }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#E65100', marginBottom: '12px' }}>
                                            🔍 מה קורה בפועל?
                                        </h3>
                                        <p style={{ marginBottom: '12px' }}>
                                            כשתחבר את חשבון WhatsApp Business הקיים למערכת, תקבל:
                                        </p>
                                        <ul style={{ marginRight: '20px', marginBottom: '12px' }}>
                                            <li style={{ marginBottom: '8px' }}>✅ <strong>היסטורית שיחות</strong> - כל ההודעות מ-6 חודשים אחורה</li>
                                            <li style={{ marginBottom: '8px' }}>❌ <strong>שמות אנשי קשר</strong> - רק מספרי טלפון (ללא שמות)</li>
                                        </ul>
                                        <p style={{ 
                                            backgroundColor: '#fff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderRight: '4px solid #FF9800'
                                        }}>
                                            <strong>תראה בשיחות:</strong> 972501234567 במקום "ניר כהן" 📱
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#128C7E', marginBottom: '12px' }}>
                                            🤔 למה זה קורה?
                                        </h3>
                                        <p style={{ marginBottom: '16px' }}>
                                            <strong>Meta לא יכולה לגשת לאנשי הקשר שמורים במכשיר שלך!</strong>
                                        </p>
                                        <div style={{ 
                                            backgroundColor: '#f5f5f5',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            marginBottom: '16px'
                                        }}>
                                            <p style={{ marginBottom: '12px' }}>
                                                <strong>📱 Phone Contacts</strong> (ספר טלפונים של המכשיר):
                                            </p>
                                            <ul style={{ marginRight: '20px' }}>
                                                <li style={{ marginBottom: '8px' }}>✅ WhatsApp Business app רואה אותם (קריאה מקומית מהמכשיר)</li>
                                                <li style={{ marginBottom: '8px' }}>✅ מציג שמות בשיחות באפליקציה</li>
                                                <li style={{ marginBottom: '8px' }}>❌ Meta Cloud API לא יכולה לגשת אליהם (מגבלות פרטיות ואבטחה)</li>
                                                <li style={{ marginBottom: '8px' }}>❌ לא נשלח webhook לסנכרון</li>
                                            </ul>
                                        </div>
                                        <div style={{ 
                                            backgroundColor: '#E8F5E9',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            border: '2px solid #25D366'
                                        }}>
                                            <p style={{ marginBottom: '12px' }}>
                                                <strong>☁️ WhatsApp Contacts</strong> (נשמרים בתוך WhatsApp):
                                            </p>
                                            <ul style={{ marginRight: '20px' }}>
                                                <li style={{ marginBottom: '8px' }}>✅ נשמרים בשרתי WhatsApp (לא במכשיר)</li>
                                                <li style={{ marginBottom: '8px' }}>✅ Meta יכולה לסנכרן אותם דרך API</li>
                                                <li style={{ marginBottom: '8px' }}>✅ נשלח webhook בזמן אמת כשמוסיפים/משנים איש קשר</li>
                                                <li style={{ marginBottom: '8px' }}>✅ <strong>Gambot מסנכרן אוטומטית!</strong> כל איש קשר חדש או מעודכן מסתנכרן למערכת</li>
                                                <li style={{ marginBottom: '8px' }}>❌ <strong>אבל:</strong> WhatsApp Business app לא תומך בפיצ'ר הזה! (רק WhatsApp רגיל)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#128C7E', marginBottom: '12px' }}>
                                            ✅ מה הפתרון?
                                        </h3>
                                        <div style={{ 
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            <div style={{
                                                backgroundColor: '#E8F5E9',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                border: '2px solid #25D366'
                                            }}>
                                                <strong style={{ color: '#128C7E' }}>✨ עדכון אוטומטי חכם:</strong>
                                                <p style={{ marginTop: '8px', color: '#555' }}>
                                                    <strong>Gambot מעדכנת שמות אוטומטית!</strong> כשמגיעה הודעה מאיש קשר שנוצר מהסנכרון הראשוני (עם רק מספר), המערכת תעדכן אוטומטית את השם שלו לשם הפרופיל מהודעה הנכנסת. 🎉
                                                </p>
                                            </div>
                                            <div style={{
                                                backgroundColor: '#E3F2FD',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                borderRight: '4px solid #2196F3'
                                            }}>
                                                <strong style={{ color: '#1565C0' }}>🔄 הוספה אוטומטית:</strong>
                                                <p style={{ marginTop: '8px', color: '#555' }}>
                                                    כשמגיעות הודעות מספרים חדשים, הם נוספים אוטומטית ל-CRM של Gambot. תוכל להוסיף שמות ידנית או לייבא CSV.
                                                </p>
                                            </div>
                                            <div style={{
                                                backgroundColor: '#F3E5F5',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                borderRight: '4px solid #9C27B0'
                                            }}>
                                                <strong style={{ color: '#6A1B9A' }}>📤 ייבוא CSV:</strong>
                                                <p style={{ marginTop: '8px', color: '#555' }}>
                                                    ייצא את אנשי הקשר מהמכשיר והעלה ל-Gambot. המערכת תתאם אוטומטית לפי מספרי טלפון.
                                                </p>
                                            </div>
                                            <div style={{
                                                backgroundColor: '#FFF9C4',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                borderRight: '4px solid #FBC02D'
                                            }}>
                                                <strong style={{ color: '#F57F17' }}>✏️ עדכון ידני:</strong>
                                                <p style={{ marginTop: '8px', color: '#555' }}>
                                                    בצ'אט של Gambot, תוכל לערוך כל איש קשר ולהוסיף שם. השם יישמר ב-CRM שלנו.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        backgroundColor: '#E8F5E9',
                                        border: '2px solid #25D366',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        textAlign: 'center'
                                    }}>
                                        <strong style={{ fontSize: '18px', color: '#128C7E', display: 'block', marginBottom: '8px' }}>
                                            💡 זכור: זו מגבלה של Meta, לא באג!
                                        </strong>
                                        <p style={{ color: '#555', fontSize: '14px' }}>
                                            Meta מגבילה גישה לPhone Contacts מסיבות פרטיות ואבטחה. זו מדיניות בינלאומית שחלה על כל הפלטפורמות.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* English Content */}
                                    <div style={{ 
                                        backgroundColor: '#FFF3CD', 
                                        border: '2px solid #FFC107',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        marginBottom: '24px'
                                    }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#E65100', marginBottom: '12px' }}>
                                            🔍 What actually happens?
                                        </h3>
                                        <p style={{ marginBottom: '12px' }}>
                                            When you connect your existing WhatsApp Business account to the system, you will receive:
                                        </p>
                                        <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
                                            <li style={{ marginBottom: '8px' }}>✅ <strong>Chat history</strong> - All messages from the last 6 months</li>
                                            <li style={{ marginBottom: '8px' }}>❌ <strong>Contact names</strong> - Only phone numbers (no names)</li>
                                        </ul>
                                        <p style={{ 
                                            backgroundColor: '#fff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #FF9800'
                                        }}>
                                            <strong>You will see in chats:</strong> 972501234567 instead of "John Doe" 📱
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#128C7E', marginBottom: '12px' }}>
                                            🤔 Why does this happen?
                                        </h3>
                                        <p style={{ marginBottom: '16px' }}>
                                            <strong>Meta cannot access contacts saved on your device!</strong>
                                        </p>
                                        <div style={{ 
                                            backgroundColor: '#f5f5f5',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            marginBottom: '16px'
                                        }}>
                                            <p style={{ marginBottom: '12px' }}>
                                                <strong>📱 Phone Contacts</strong> (Device contact book):
                                            </p>
                                            <ul style={{ marginLeft: '20px' }}>
                                                <li style={{ marginBottom: '8px' }}>✅ WhatsApp Business app can read them (local device access)</li>
                                                <li style={{ marginBottom: '8px' }}>✅ Displays names in app chats</li>
                                                <li style={{ marginBottom: '8px' }}>❌ Meta Cloud API cannot access them (privacy & security restrictions)</li>
                                                <li style={{ marginBottom: '8px' }}>❌ No webhook sent for sync</li>
                                            </ul>
                                        </div>
                                        <div style={{ 
                                            backgroundColor: '#E8F5E9',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            border: '2px solid #25D366'
                                        }}>
                                            <p style={{ marginBottom: '12px' }}>
                                                <strong>☁️ WhatsApp Contacts</strong> (Saved inside WhatsApp):
                                            </p>
                                            <ul style={{ marginLeft: '20px' }}>
                                                <li style={{ marginBottom: '8px' }}>✅ Saved on WhatsApp servers (not on device)</li>
                                                <li style={{ marginBottom: '8px' }}>✅ Meta can sync them via API</li>
                                                <li style={{ marginBottom: '8px' }}>✅ Real-time webhook sent when adding/updating contacts</li>
                                                <li style={{ marginBottom: '8px' }}>✅ <strong>Gambot syncs automatically!</strong> Every new or updated contact syncs to the system</li>
                                                <li style={{ marginBottom: '8px' }}>❌ <strong>But:</strong> WhatsApp Business app doesn't support this feature! (only regular WhatsApp)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#128C7E', marginBottom: '12px' }}>
                                            ✅ What's the solution?
                                        </h3>
                                        <div style={{ 
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            <div style={{
                                                backgroundColor: '#E8F5E9',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                border: '2px solid #25D366'
                                            }}>
                                                <strong style={{ color: '#128C7E' }}>✨ Smart Auto-Update:</strong>
                                                <p style={{ marginTop: '8px', color: '#555' }}>
                                                    <strong>Gambot updates names automatically!</strong> When a message arrives from a contact created during initial sync (with only a number), the system will automatically update their name to the profile name from the incoming message. 🎉
                                                </p>
                                            </div>
                                            <div style={{
                                                backgroundColor: '#E3F2FD',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                borderLeft: '4px solid #2196F3'
                                            }}>
                                                <strong style={{ color: '#1565C0' }}>🔄 Auto-Add:</strong>
                                                <p style={{ marginTop: '8px', color: '#555' }}>
                                                    When messages arrive from new numbers, they are automatically added to Gambot CRM. You can add names manually or import CSV.
                                                </p>
                                            </div>
                                            <div style={{
                                                backgroundColor: '#F3E5F5',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                borderLeft: '4px solid #9C27B0'
                                            }}>
                                                <strong style={{ color: '#6A1B9A' }}>📤 CSV Import:</strong>
                                                <p style={{ marginTop: '8px', color: '#555' }}>
                                                    Export contacts from your device and upload to Gambot. The system will automatically match by phone numbers.
                                                </p>
                                            </div>
                                            <div style={{
                                                backgroundColor: '#FFF9C4',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                borderLeft: '4px solid #FBC02D'
                                            }}>
                                                <strong style={{ color: '#F57F17' }}>✏️ Manual Update:</strong>
                                                <p style={{ marginTop: '8px', color: '#555' }}>
                                                    In Gambot chat, you can edit each contact and add a name. The name will be saved in our CRM.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        backgroundColor: '#E8F5E9',
                                        border: '2px solid #25D366',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        textAlign: 'center'
                                    }}>
                                        <strong style={{ fontSize: '18px', color: '#128C7E', display: 'block', marginBottom: '8px' }}>
                                            💡 Remember: This is a Meta limitation, not a bug!
                                        </strong>
                                        <p style={{ color: '#555', fontSize: '14px' }}>
                                            Meta restricts access to Phone Contacts for privacy and security reasons. This is an international policy that applies to all platforms.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Close Button at Bottom */}
                        <div style={{ marginTop: '32px', textAlign: 'center' }}>
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowContactsInfoModal(false);
                                }}
                                style={{
                                    padding: '12px 32px',
                                    backgroundColor: '#25D366',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#20BD5A'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#25D366'}
                            >
                                {currentLanguage === 'he' ? 'הבנתי, תודה!' : 'Got it, thanks!'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tutorial Video Button */}
            <TutorialVideoButton step={2} />
        </div>
    );
};

export default SimSelection;

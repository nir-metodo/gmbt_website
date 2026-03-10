import React, { useState, useEffect } from 'react';
import FacebookLogin from './FacebookLogin';
import TutorialVideoButton from './TutorialVideoButton';
import './WabaOnboarding.css';
import { FaWhatsapp, FaFacebookF, FaPlay, FaCopy, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaArrowRight, FaShieldAlt, FaCreditCard, FaPhoneAlt } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdVerified, MdSecurity, MdBusinessCenter } from "react-icons/md";
import { useLanguage } from '@/contexts/LanguageContext';

const WabaOnboarding = ({ videoUrl, onPrevStep, organization, email, hasSim, useFreeNumber, useCoexisting, simPhoneNumber, contactPhoneNumber, organizationName }) => {
    const { t, currentLanguage, isRTL } = useLanguage();
    const [phoneNumberCopied, setPhoneNumberCopied] = useState(false);
    // No need for wabaMode state - we get useCoexisting from props

    // 🔍 DEBUG: Log organizationName when WabaOnboarding component mounts
    useEffect(() => {
        console.log('═══════════════════════════════════════════════════');
        console.log('🚀 [WabaOnboarding - Step 5] Component Mounted');
        console.log('🏢 [WabaOnboarding] Organization Name (DB Key):', organization);
        console.log('🏪 [WabaOnboarding] Company Name (Display):', organizationName);
        console.log('📧 [WabaOnboarding] Email:', email);
        console.log('📱 [WabaOnboarding] SIM Phone Number:', simPhoneNumber);
        console.log('☎️  [WabaOnboarding] Contact Phone Number:', contactPhoneNumber);
        console.log('🔑 [WabaOnboarding] Has SIM:', hasSim);
        console.log('✅ [WabaOnboarding] This organization will be created in Firestore!');
        console.log('═══════════════════════════════════════════════════');
    }, [organization, organizationName, email, simPhoneNumber, contactPhoneNumber, hasSim]);

    // Fallback function for WabaOnboarding translations
    const getWabaText = (key) => {
        const translation = t(key);
        if (translation === key) {
            const fallbacks = {
                'wabaOnboarding.header.badge': currentLanguage === 'he' ? 'שלב אחרון' : 'Final Step',
                'wabaOnboarding.header.title': currentLanguage === 'he' ? 'חיבור לחשבון WhatsApp Business' : 'Connect to WhatsApp Business Account',
                'wabaOnboarding.header.subtitle': currentLanguage === 'he' ? 'כמה צעדים אחרונים כדי להשלים את ההגדרה שלך' : 'A few final steps to complete your setup',
                'wabaOnboarding.video.title': currentLanguage === 'he' ? 'סרטון הדרכה' : 'Tutorial Video',
                'wabaOnboarding.video.description': currentLanguage === 'he' ? 'צפה בסרטון קצר שמסביר איך להתחבר' : 'Watch a short video explaining how to connect',
                'wabaOnboarding.video.notSupported': currentLanguage === 'he' ? 'הדפדפן שלך לא תומך בסרטון.' : 'Your browser does not support the video.',
                'wabaOnboarding.facebookLogin.title': currentLanguage === 'he' ? 'התחבר עם Facebook' : 'Connect with Facebook',
                'wabaOnboarding.facebookLogin.description': currentLanguage === 'he' ? 'כדי להתחבר לחשבון WhatsApp Business שלך' : 'To connect to your WhatsApp Business account',
                'wabaOnboarding.facebookLogin.button': currentLanguage === 'he' ? 'התחבר עם Facebook' : 'Connect with Facebook',
                'wabaOnboarding.facebookLogin.requirement': currentLanguage === 'he' ? 'נדרש חשבון Facebook עסקי' : 'Business Facebook account required',
                'wabaOnboarding.phoneNumber.title': currentLanguage === 'he' ? 'מספר הטלפון שלך' : 'Your Phone Number',
                'wabaOnboarding.phoneNumber.description': currentLanguage === 'he' ? 'המספר שיחובר לחשבון WhatsApp Business' : 'The number that will be connected to WhatsApp Business account',
                'wabaOnboarding.phoneNumber.copy': currentLanguage === 'he' ? 'העתק מספר' : 'Copy Number',
                'wabaOnboarding.phoneNumber.copied': currentLanguage === 'he' ? 'הועתק!' : 'Copied!',
                'wabaOnboarding.phoneNumber.note': currentLanguage === 'he' ? 'שמור מספר זה - תצטרך אותו בתהליך ההרשמה' : 'Save this number - you will need it during the registration process',
                'wabaOnboarding.security.title': currentLanguage === 'he' ? 'חיבור מאובטח' : 'Secure Connection',
                'wabaOnboarding.security.description': currentLanguage === 'he' ? 'ההתחברות מתבצעת באופן מאובטח דרך Facebook' : 'The connection is made securely through Facebook',
                'wabaOnboarding.businessInfo.title': currentLanguage === 'he' ? 'פרטי עסק' : 'Business Details',
                'wabaOnboarding.businessInfo.organization': currentLanguage === 'he' ? 'ארגון' : 'Organization',
                'wabaOnboarding.businessInfo.email': currentLanguage === 'he' ? 'אימייל' : 'Email',
                'wabaOnboarding.businessInfo.phone': currentLanguage === 'he' ? 'טלפון' : 'Phone',
                'wabaOnboarding.navigation.back': currentLanguage === 'he' ? 'חזרה' : 'Back',
                'wabaOnboarding.requirements.title': currentLanguage === 'he' ? 'דרישות לחיבור WhatsApp Business' : 'WhatsApp Business Connection Requirements',
                'wabaOnboarding.requirements.description': currentLanguage === 'he' ? 'וודא שאתה עומד בדרישות הבאות לפני החיבור' : 'Make sure you meet the following requirements before connecting',
                'wabaOnboarding.requirements.businessAccount.title': currentLanguage === 'he' ? 'חשבון עסקי מאומת' : 'Verified Business Account',
                'wabaOnboarding.requirements.businessAccount.description': currentLanguage === 'he' ? 'עליך להתחבר לחשבון פייסבוק עסקי מאומת. רק חשבונות עסקיים יכולים להתחבר ל-WhatsApp Business API.' : 'You must connect to a verified Facebook business account. Only business accounts can connect to WhatsApp Business API.',
                'wabaOnboarding.requirements.paymentMethod.title': currentLanguage === 'he' ? 'אמצעי תשלום פעיל' : 'Active Payment Method',
                'wabaOnboarding.requirements.paymentMethod.description': currentLanguage === 'he' ? 'חשבון הפייסבוק העסקי חייב לכלול אמצעי תשלום פעיל ומאומת.' : 'The Facebook business account must include an active and verified payment method.',
                'wabaOnboarding.requirements.phoneNumber.title': currentLanguage === 'he' ? 'מספר טלפון ייעודי' : 'Dedicated Phone Number',
                'wabaOnboarding.requirements.phoneNumber.yourNumber': currentLanguage === 'he' ? 'מספר הטלפון שנרכש עבורך:' : 'The phone number purchased for you:',
                'wabaOnboarding.requirements.phoneNumber.contactNumber': currentLanguage === 'he' ? 'המספר שלך:' : 'Your number:',
                'wabaOnboarding.requirements.phoneNumber.note': currentLanguage === 'he' ? 'קוד אימות ייקח בדרך כלל -ל 97254801010 יישלח אמצעותנו. com' : 'Verification code will usually be sent to 97254801010 through our service. com',
                'wabaOnboarding.requirements.phoneNumber.verificationSent': currentLanguage === 'he' ? 'קוד אימות יישלח ל-{phone} ול-{email}' : 'Verification code will be sent to {phone} and {email}',
                'wabaOnboarding.requirements.phoneNumber.warning': currentLanguage === 'he' ? 'ודא שיש לך גישה למספר הטלפון שבחרת. לא מומלץ להשתמש במספר אישי פעיל כדי למנוע אובדן מידע.' : 'Make sure you have access to the phone number you selected. It is not recommended to use an active personal number to prevent data loss.',
                'wabaOnboarding.requirements.secureConnection.title': currentLanguage === 'he' ? 'חיבור מאובטח' : 'Secure Connection',
                'wabaOnboarding.requirements.secureConnection.description': currentLanguage === 'he' ? 'תחבור את החשבון באופן מאובטח, כדי שנוכל לקבל בקרות WhatsApp API את עבור את הצוות.' : 'Connect your account securely so we can get WhatsApp API controls for your team.',
                'wabaOnboarding.requirements.readySection.title': currentLanguage === 'he' ? 'מוכן להמשיך?' : 'Ready to Continue?',
                'wabaOnboarding.requirements.readySection.description': currentLanguage === 'he' ? 'אם אתה עומד בכל הדרישות לעיל, לחץ על "התחבר עם פייסבוק" להשלמת התהליך.' : 'If you meet all the requirements above, click "Connect with Facebook" to complete the process.'
            };
            return fallbacks[key] || key;
        }
        return translation;
    };

    const handleCopyPhoneNumber = () => {
        navigator.clipboard.writeText(simPhoneNumber);
        setPhoneNumberCopied(true);
        setTimeout(() => setPhoneNumberCopied(false), 2000);
    };

    return (
        <div className={`waba-onboarding-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Enhanced Header */}
            <div className="waba-header">
                <div className="header-badge">
                    <HiOutlineSparkles className="sparkle-icon" />
                    <span>{getWabaText('wabaOnboarding.header.badge')}</span>
                </div>
                <h1 className="waba-title">{getWabaText('wabaOnboarding.header.title')}</h1>
                <p className="waba-subtitle">{getWabaText('wabaOnboarding.header.subtitle')}</p>
            </div>

            {/* ✅ Mode selection was removed - user already selected in Step 2 (SimSelection) */}
            
            {/* Show content */}
            <div className="waba-content">
                {/* Video Section */}
                <div className="video-section">
                    <div className="video-header">
                        <div className="video-icon">
                            <FaPlay />
                        </div>
                        <h2>{getWabaText('wabaOnboarding.video.title')}</h2>
                        <p>{getWabaText('wabaOnboarding.video.description')}</p>
                    </div>
                    <div className="video-wrapper">
                        <video className="tutorial-video" controls poster="/video-poster.jpg">
                            <source src={videoUrl} type="video/mp4" />
                            {getWabaText('wabaOnboarding.video.notSupported')}
                        </video>
                    </div>

                    {/* Facebook Login Card */}
                    <div className="facebook-login-card">
                        <div className="login-header">
                            <div className="login-icon">
                                <FaFacebookF />
                            </div>
                            <h3>{getWabaText('wabaOnboarding.facebookLogin.title')}</h3>
                            <p>{getWabaText('wabaOnboarding.facebookLogin.description')}</p>
                        </div>
                        
                        {/* ✅ Important Note: Guide user on what to select in Facebook modal */}
                        {useCoexisting && (
                            <div className="facebook-mode-reminder coexisting-mode" style={{
                                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                                border: '2px solid #10b981',
                                borderRadius: '12px',
                                padding: '16px',
                                margin: '16px 0',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px'
                            }}>
                                <FaCheckCircle style={{ color: '#10b981', fontSize: '24px', flexShrink: 0, marginTop: '2px' }} />
                                <div style={{ flex: 1 }}>
                                    <strong style={{ color: '#065f46', fontSize: '15px', display: 'block', marginBottom: '6px' }}>
                                        ⚠️ חשוב! בחרת במסלול Co-existing
                                    </strong>
                                    <p style={{ color: '#047857', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                                        בחלון של Facebook שייפתח, בחר באופציה:<br />
                                        <strong>"Use an existing WhatsApp Business Account"</strong>
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {!useCoexisting && !hasSim && !useFreeNumber && (
                            <div className="facebook-mode-reminder new-mode" style={{
                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                border: '2px solid #3b82f6',
                                borderRadius: '12px',
                                padding: '16px',
                                margin: '16px 0',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px'
                            }}>
                                <FaCheckCircle style={{ color: '#3b82f6', fontSize: '24px', flexShrink: 0, marginTop: '2px' }} />
                                <div style={{ flex: 1 }}>
                                    <strong style={{ color: '#1e40af', fontSize: '15px', display: 'block', marginBottom: '6px' }}>
                                        ⚠️ חשוב! בחרת במסלול חשבון חדש
                                    </strong>
                                    <p style={{ color: '#1e3a8a', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                                        בחלון של Facebook שייפתח, בחר באופציה:<br />
                                        <strong>"Create a new WhatsApp Business Account"</strong>
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <FacebookLogin 
                            organization={organization} 
                            buisnessEmail={email}
                            organizationName={organizationName}
                            isCoexisting={useCoexisting}
                            coexistingPhoneNumber={simPhoneNumber}
                        />
                    </div>
                </div>


                {/* Requirements Section */}
                <div className="requirements-section">
                    <div className="requirements-header">
                        <div className="requirements-icon">
                            <FaWhatsapp />
                        </div>
                        <h2>{getWabaText('wabaOnboarding.requirements.title')}</h2>
                        <p>{getWabaText('wabaOnboarding.requirements.description')}</p>
                    </div>

                    <div className="requirements-list">
                        {/* Facebook Account Requirement */}
                        <div className="requirement-card business-account">
                            <div className="requirement-icon">
                                <MdBusinessCenter />
                            </div>
                            <div className="requirement-content">
                                <h3>{getWabaText('wabaOnboarding.requirements.businessAccount.title')}</h3>
                                <p>{getWabaText('wabaOnboarding.requirements.businessAccount.description')}</p>
                            </div>
                            <MdVerified className="requirement-status" />
                        </div>

                        {/* Payment Method Requirement */}
                        <div className="requirement-card payment-method">
                            <div className="requirement-icon">
                                <FaCreditCard />
                            </div>
                            <div className="requirement-content">
                                <h3>{getWabaText('wabaOnboarding.requirements.paymentMethod.title')}</h3>
                                <p>{getWabaText('wabaOnboarding.requirements.paymentMethod.description')}</p>
                            </div>
                            <MdVerified className="requirement-status" />
                        </div>

                        {/* Phone Number Requirement */}
                        <div className="requirement-card phone-number">
                            <div className="requirement-icon">
                                <FaPhoneAlt />
                            </div>
                            <div className="requirement-content">
                                <h3>{getWabaText('wabaOnboarding.requirements.phoneNumber.title')}</h3>
                                {!hasSim ? (
                                    <div className="phone-details">
                                        <p>{getWabaText('wabaOnboarding.requirements.phoneNumber.yourNumber')}</p>
                                        <div className="phone-number-display">
                                            <span className="phone-number">{simPhoneNumber}</span>
                                            <button
                                                onClick={handleCopyPhoneNumber}
                                                className={`copy-button ${phoneNumberCopied ? 'copied' : ''}`}
                                            >
                                                {phoneNumberCopied ? (
                                                    <>
                                                        <FaCheckCircle />
                                                        <span>{getWabaText('wabaOnboarding.phoneNumber.copied')}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCopy />
                                                        <span>{getWabaText('wabaOnboarding.phoneNumber.copy')}</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="verification-info">
                                            <FaShieldAlt className="verification-icon" />
                                            <p>{getWabaText('wabaOnboarding.requirements.phoneNumber.verificationSent').replace('{phone}', contactPhoneNumber).replace('{email}', email)}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="phone-warning">
                                        <FaExclamationTriangle className="warning-icon" />
                                        <p>{getWabaText('wabaOnboarding.requirements.phoneNumber.warning')}</p>
                                    </div>
                                )}
                            </div>
                            <MdVerified className="requirement-status" />
                        </div>

                        {/* Security Requirement */}
                        <div className="requirement-card security">
                            <div className="requirement-icon">
                                <MdSecurity />
                            </div>
                            <div className="requirement-content">
                                <h3>{getWabaText('wabaOnboarding.requirements.secureConnection.title')}</h3>
                                <p>{getWabaText('wabaOnboarding.requirements.secureConnection.description')}</p>
                            </div>
                            <MdVerified className="requirement-status" />
                        </div>
                    </div>

                    <div className="ready-section">
                        <div className="ready-icon">
                            <FaCheckCircle />
                        </div>
                        <div className="ready-content">
                            <h3>{getWabaText('wabaOnboarding.requirements.readySection.title')}</h3>
                            <p>{getWabaText('wabaOnboarding.requirements.readySection.description')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className={`waba-footer ${isRTL ? 'rtl' : 'ltr'}`}>
                <button className="nav-button prev-button" onClick={onPrevStep}>
                    {isRTL ? <FaArrowRight className="nav-icon" /> : <FaArrowLeft className="nav-icon" />}
                    <span>{getWabaText('wabaOnboarding.navigation.back')}</span>
                </button>
            </div>

            {/* Tutorial Video Button - Shows setup video (step 5+) */}
            <TutorialVideoButton step={5} />
        </div>
    );
};

export default WabaOnboarding;

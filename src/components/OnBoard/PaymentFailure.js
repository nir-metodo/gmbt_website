import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import './PaymentFailure.css';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const isRTL = language === 'he';
  
  // Extract error message from URL if available
  const queryParams = new URLSearchParams(location.search);
  const errorCode = queryParams.get('code');
  const errorMessage = queryParams.get('error');

  const handleRetry = () => {
    // Go back to previous page (AddPayment)
    navigate(-1);
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:info@gambot.co.il?subject=Payment%20Issue';
  };

  return (
    <div className="payment-failure-overlay">
      <div className="payment-failure-container" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Logo */}
        <div className="payment-failure-logo">
          <img src="/logo192.png" alt="Gambot" />
        </div>

        {/* Error Icon */}
        <div className="payment-failure-icon-wrapper">
          <div className="payment-failure-icon">
            <svg className="error-cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="error-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="error-line error-line-1" fill="none" d="M16 16 L36 36"/>
              <path className="error-line error-line-2" fill="none" d="M36 16 L16 36"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="payment-failure-content">
          <h1 className="payment-failure-title">
            {isRTL ? 'אימות נכשל' : 'Verification Failed'}
          </h1>
          
          <p className="payment-failure-message">
            {isRTL 
              ? 'לצערנו, לא הצלחנו לאמת את פרטי הכרטיס' 
              : 'We were unable to verify your card details'}
          </p>

          {errorCode && (
            <div className="payment-failure-error-box">
              <div className="error-code">
                {isRTL ? 'קוד שגיאה' : 'Error Code'}: <strong>{errorCode}</strong>
              </div>
              {errorMessage && (
                <div className="error-description">
                  {errorMessage}
                </div>
              )}
            </div>
          )}

          <div className="payment-failure-reasons">
            <p className="reasons-title">
              {isRTL ? 'סיבות אפשריות:' : 'Possible reasons:'}
            </p>
            <ul>
              <li>{isRTL ? 'פרטי כרטיס שגויים' : 'Incorrect card details'}</li>
              <li>{isRTL ? 'יתרה לא מספקת' : 'Insufficient funds'}</li>
              <li>{isRTL ? 'הכרטיס חסום או לא פעיל' : 'Card blocked or inactive'}</li>
              <li>{isRTL ? 'בעיה בקשר' : 'Connection issue'}</li>
            </ul>
          </div>

          <div className="payment-failure-actions">
            <button className="btn-retry" onClick={handleRetry}>
              <span className="btn-icon">↻</span>
              {isRTL ? 'נסה שוב' : 'Try Again'}
            </button>
            <button className="btn-support" onClick={handleContactSupport}>
              <span className="btn-icon">✉</span>
              {isRTL ? 'צור קשר עם התמיכה' : 'Contact Support'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;


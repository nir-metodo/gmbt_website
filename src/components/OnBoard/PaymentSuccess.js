'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const [countdown, setCountdown] = useState(5);
  const isRTL = language === 'he';

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [router]);

  return (
    <div className="payment-success-overlay">
      <div className="payment-success-container" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Logo */}
        <div className="payment-success-logo">
          <img src="/GamBot_Logo.png" alt="Gambot" />
        </div>

        {/* Success Icon */}
        <div className="payment-success-icon-wrapper">
          <div className="payment-success-checkmark">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="payment-success-content">
          <h1 className="payment-success-title">
            {isRTL ? 'תודה רבה!' : 'Thank You!'}
          </h1>
          
          <p className="payment-success-message">
            {isRTL 
              ? 'פרטי התשלום נשמרו בהצלחה במערכת' 
              : 'Payment details saved successfully'}
          </p>

          <div className="payment-success-details">
            <div className="success-detail-item">
              <span className="detail-icon">✓</span>
              <span className="detail-text">
                {isRTL ? 'כרטיס אומת' : 'Card Verified'}
              </span>
            </div>
            <div className="success-detail-item">
              <span className="detail-icon">✓</span>
              <span className="detail-text">
                {isRTL ? 'טוקן נשמר בבטחה' : 'Token Saved Securely'}
              </span>
            </div>
            <div className="success-detail-item">
              <span className="detail-icon">✓</span>
              <span className="detail-text">
                {isRTL ? 'החשבון שלך מוכן' : 'Your Account is Ready'}
              </span>
            </div>
          </div>

          <div className="payment-success-redirect">
            <div className="redirect-spinner"></div>
            <p>
              {isRTL 
                ? `מעביר אותך לדף ההתחברות בעוד ${countdown} שניות...` 
                : `Redirecting to login in ${countdown} seconds...`}
            </p>
            <button 
              className="redirect-now-btn"
              onClick={() => router.push('/login')}
            >
              {isRTL ? 'עבור עכשיו' : 'Go Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;


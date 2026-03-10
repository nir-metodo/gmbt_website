'use client';
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaWhatsapp, FaCheckCircle, FaRocket, FaShieldAlt, FaClock, FaHeadset } from 'react-icons/fa';
import { MdVerified, MdSecurity } from 'react-icons/md';
import './WhatsAppApiPricing.css';

const WhatsAppApiPricing = () => {
  const { t, currentLanguage } = useLanguage();

  const seoTitle = 'מחיר WhatsApp API ישראל 2025 | שותף מטא רשמי | גמבוט';
  const seoDescription = '💰 מחיר WhatsApp API הטוב ביותר בישראל | שותף מטא רשמי | התקנה תוך 24 שעות | ניסיון חינם | תמיכה 24/7 | אוטומציה מתקדמת';
  const seoKeywords = 'מחיר WhatsApp API ישראל, עלות WhatsApp API, מחירון וואטסאפ עסקי, WhatsApp API pricing Israel, שותף מטא רשמי, מחיר וואטסאפ API, עלות וואטסאפ עסקי';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "WhatsApp Business API - Israel",
    "description": "WhatsApp Business API solution for Israeli businesses with official Meta partnership",
    "brand": {
      "@type": "Brand",
      "name": "Gambot"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Growth Plan",
        "price": "143",
        "priceCurrency": "ILS",
        "description": "WhatsApp API plan for small businesses getting started"
      },
      {
        "@type": "Offer", 
        "name": "Pro Plan",
        "price": "287",
        "priceCurrency": "ILS",
        "description": "Advanced WhatsApp API plan with AI automation and analytics"
      },
      {
        "@type": "Offer",
        "name": "Business Plan", 
        "price": "865",
        "priceCurrency": "ILS",
        "description": "Enterprise WhatsApp API solution for large organizations"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150"
    }
  };

  return (
    <div className="whatsapp-api-pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="pricing-hero-content">
          <div className="hero-badge">
            <MdVerified className="badge-icon" />
            <span>שותף מטא רשמי בישראל</span>
          </div>
          
          <h1 className="hero-title">
            מחיר <span className="highlight">WhatsApp API</span> בישראל
          </h1>
          
          <p className="hero-subtitle">
            המחירים הטובים ביותר בשוק | התקנה תוך 24 שעות | ניסיון חינם
          </p>

          <div className="hero-features">
            <div className="feature-item">
              <FaCheckCircle className="feature-icon" />
              <span>ללא עמלות נסתרות</span>
            </div>
            <div className="feature-item">
              <FaRocket className="feature-icon" />
              <span>התקנה מהירה</span>
            </div>
            <div className="feature-item">
              <FaHeadset className="feature-icon" />
              <span>תמיכה 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards-section">
        <div className="container">
          <h2 className="section-title">תוכניות מחיר WhatsApp API</h2>
          
          <div className="pricing-grid">
            {/* Growth Plan */}
            <div className="pricing-card">
              <div className="card-header">
                <h3 className="plan-name">Growth</h3>
                <div className="plan-price">
                  <span className="currency">₪</span>
                  <span className="amount">143</span>
                  <span className="period">/חודש</span>
                </div>
                <p className="plan-description">חבילת הבסיס לעסק שלכם</p>
              </div>
              
              <div className="card-features">
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>1 בוט / תהליך אוטומציה</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>500 שיחות חדשות בחודש</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>120 תגובות / פעולות AI (כל 500 נוספות 50 ש"ח)</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>3 משתמשים (כל משתמש נוסף 30 ש"ח)</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>תמיכה בסיסית</span>
                </div>
              </div>
              
              <button className="cta-button" onClick={() => window.open('https://wa.me/97233768997?text=' + encodeURIComponent(currentLanguage === 'he' ? 'היי, אני מעוניין/ת בהדגמה של Gambot 🚀' : 'Hi, I\'d like a demo of Gambot 🚀'), '_blank')}>התחל עכשיו</button>
            </div>

            {/* Pro Plan */}
            <div className="pricing-card featured">
              <div className="popular-badge">הכי פופולרי</div>
              <div className="card-header">
                <h3 className="plan-name">Pro</h3>
                <div className="plan-price">
                  <span className="currency">₪</span>
                  <span className="amount">287</span>
                  <span className="period">/חודש</span>
                </div>
                <p className="plan-description">חבילת הפרימיום לעסק שלכם</p>
              </div>
              
              <div className="card-features">
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>2 בוטים / תהליכי אוטומציה</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>1000 שיחות חדשות בחודש</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>300 תגובות / פעולות AI (כל 500 נוספות 50 ש"ח)</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>5 משתמשים (כל משתמש נוסף 30 ש"ח)</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>תמיכה משופרת</span>
                </div>
              </div>
              
              <button className="cta-button" onClick={() => window.open('https://wa.me/97233768997?text=' + encodeURIComponent(currentLanguage === 'he' ? 'היי, אני מעוניין/ת בהדגמה של Gambot 🚀' : 'Hi, I\'d like a demo of Gambot 🚀'), '_blank')}>התחל עכשיו</button>
            </div>

            {/* Business Plan */}
            <div className="pricing-card">
              <div className="card-header">
                <h3 className="plan-name">Business</h3>
                <div className="plan-price">
                  <span className="currency">₪</span>
                  <span className="amount">865</span>
                  <span className="period">/חודש</span>
                </div>
                <p className="plan-description">חבילה מותאמת לארגון גדול</p>
              </div>
              
              <div className="card-features">
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>3 בוטים / תהליכי אוטומציה</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>2000 שיחות חדשות בחודש</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>1250 תגובות / פעולות AI (כל 500 נוספות 50 ש"ח)</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>8 משתמשים (כל משתמש נוסף 30 ש"ח)</span>
                </div>
                <div className="feature">
                  <FaCheckCircle className="check-icon" />
                  <span>תמיכה עדיפה</span>
                </div>
              </div>
              
              <button className="cta-button" onClick={() => window.open('https://wa.me/97233768997?text=' + encodeURIComponent('היי, אני מעוניין לשמוע על מחירי WhatsApp API 🚀'), '_blank')}>צור קשר</button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="container">
          <h2 className="section-title">למה לבחור בגמבוט?</h2>
          
          <div className="benefits-grid">
            <div className="benefit-item">
              <MdVerified className="benefit-icon" />
              <h3>שותף מטא רשמי</h3>
              <p>שותף רשמי מאושר של מטא בישראל לWhatsApp Business API</p>
            </div>
            
            <div className="benefit-item">
              <FaClock className="benefit-icon" />
              <h3>התקנה מהירה</h3>
              <p>התקנה והפעלה תוך 24 שעות בלבד</p>
            </div>
            
            <div className="benefit-item">
              <FaShieldAlt className="benefit-icon" />
              <h3>אבטחה מקסימלית</h3>
              <p>הגנה מלאה על הנתונים שלך ותקשורת מוצפנת</p>
            </div>
            
            <div className="benefit-item">
              <FaHeadset className="benefit-icon" />
              <h3>תמיכה בעברית</h3>
              <p>תמיכה טכנית מלאה בעברית 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>מוכן להתחיל עם WhatsApp API?</h2>
            <p>קבל ניסיון חינם ל-30 יום וגלה איך WhatsApp API יכול לשדרג את העסק שלך</p>
            <div className="cta-buttons">
              <button className="primary-cta" onClick={() => window.open('https://wa.me/97233768997?text=' + encodeURIComponent(currentLanguage === 'he' ? 'היי, אני מעוניין/ת בהדגמה של Gambot 🚀' : 'Hi, I\'d like a demo of Gambot 🚀'), '_blank')}>התחל ניסיון חינם</button>
              <button className="secondary-cta" onClick={() => window.open('https://wa.me/97233768997?text=' + encodeURIComponent('היי, אני מעוניין בייעוץ לגבי WhatsApp API 🚀'), '_blank')}>צור קשר לייעוץ</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatsAppApiPricing;

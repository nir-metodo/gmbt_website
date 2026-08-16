'use client';
import React from 'react';
import Link from 'next/link';
import {
  FaKeyboard,
  FaRegClock,
  FaPaperPlane,
  FaChartBar,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaLightbulb,
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi2';
import './OnboardingServicesPage.css';

// Per-MESSAGE tiered pricing (NOT per contact — one contact can receive several messages).
// Price already includes WhatsApp/Meta sending costs. Prices are before VAT.
const tiers = [
  { range: 'עד 1,000 הודעות', price: '2.00' },
  { range: '1,001–2,500 הודעות', price: '1.50' },
  { range: '2,501–5,000 הודעות', price: '1.20' },
  { range: '5,001–10,000 הודעות', price: '1.00' },
  { range: '10,001–20,000 הודעות', price: '0.90' },
  { range: '20,001+ הודעות', price: null }, // הצעת מחיר
];

const steps = [
  {
    icon: <FaKeyboard />,
    title: 'שולחים לנו את התוכן',
    text: 'מעבירים אלינו את מלל ההודעה ואת רשימת הנמענים (אקסל / CSV).',
  },
  {
    icon: <FaRegClock />,
    title: 'בוחרים מתי לשלוח',
    text: 'אומרים לנו מתי הקמפיין צריך לצאת לדרך — ואנחנו נדאג לתזמון.',
  },
  {
    icon: <FaPaperPlane />,
    title: 'אנחנו שולחים מהמספר שלנו',
    text: 'הקמה, אישור טמפלט מול Meta, שליחה וניטור — הכל עלינו. אין צורך בחשבון API משלכם.',
  },
  {
    icon: <FaChartBar />,
    title: 'מקבלים דו״ח נתונים',
    text: 'כמה הודעות נשלחו, נמסרו ונכשלו — ומי קיבל. שקיפות מלאה על הקמפיין.',
  },
];

const included = [
  'המחיר כולל את עלויות השליחה של WhatsApp / Meta — לא תשלמו למטא בנפרד',
  'שליחה מהמספר שלנו — לא צריך חשבון WhatsApp API משלכם',
  'הקמה, אישור טמפלט מול Meta, שליחה וניטור — הכל בטיפול שלנו',
  'דו״ח מפורט לאחר הקמפיין: נשלח / נמסר / נכשל + מי קיבל',
];

const waLink =
  'https://wa.me/97233768997?text=' +
  encodeURIComponent('אני מעוניין בשירות דיוור חד־פעמי בוואטסאפ API');

export default function ManagedBroadcastContent() {
  return (
    <div className="onboarding-services-page" style={{ paddingTop: '68px' }}>

      {/* Header */}
      <div className="onboarding-header">
        <div className="onboarding-header-badge">
          <HiOutlineSparkles className="sparkle-icon" />
          <span>שירות מנוהל — דיוור חד־פעמי</span>
        </div>
        <h1 className="onboarding-title">דיוור חד־פעמי בוואטסאפ API</h1>
        <p className="onboarding-subtitle">
          <MdVerified className="subtitle-icon" />
          אתם שולחים לנו את ההודעה ומתי — אנחנו דואגים להכול, מהמספר שלנו
        </p>
      </div>

      {/* How it works */}
      <div className="onboarding-packages-container">
        <h2 className="section-title">איך זה עובד?</h2>
        <div className="packages-grid">
          {steps.map((step, i) => (
            <div key={i} className="package-card">
              <div className="package-header" style={{ marginBottom: 0 }}>
                <div className="package-icon">{step.icon}</div>
                <h3 className="package-name" style={{ fontSize: '1.4rem' }}>{step.title}</h3>
                <p className="package-description">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing + What's included */}
      <div className="retro-recovery-section">
        <div className="retro-header">
          <div className="retro-icon"><FaPaperPlane /></div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>מחירון דיוור</h2>
          <p className="retro-description">
            תמחור מדורג לפי כמות ההודעות. ככל שהכמות גדולה יותר — המחיר להודעה נמוך יותר.
          </p>
        </div>

        <div className="retro-content">
          {/* What's included */}
          <div className="retro-what-is-it">
            <h3>מה כלול בשירות?</h3>
            <ul>
              {included.map((item, i) => (
                <li key={i}><FaCheckCircle className="check-icon" /><span>{item}</span></li>
              ))}
            </ul>
            <p className="retro-suitable">
              מתאים לעסקים שרוצים לצאת בקמפיין דיוור בוואטסאפ בלי להתעסק בהקמה טכנית, חשבון API או אישורי טמפלט.
            </p>
          </div>

          {/* Pricing tiers */}
          <div className="retro-pricing-tiers">
            <h3>מחיר להודעה (מדורג)</h3>
            <div className="tiers-grid">
              {tiers.map((tier, i) => (
                <div key={i} className="tier-card">
                  <div className="tier-contacts">
                    <FaPaperPlane className="tier-icon" />
                    <span>{tier.range}</span>
                  </div>
                  <div className="tier-price">
                    {tier.price ? (
                      <><span className="currency">₪</span><span className="amount">{tier.price}</span></>
                    ) : (
                      <span className="custom-price">הצעת מחיר</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="retro-note">
              📌 מינימום הזמנה: 500 הודעות · המחיר כולל את עלויות השליחה של WhatsApp/Meta · כל המחירים לפני מע״מ
            </p>
          </div>
        </div>

        <a href={waLink} target="_blank" rel="noopener noreferrer" className="retro-button">
          דברו איתנו על קמפיין דיוור
        </a>
      </div>

      {/* Important: per message, not per record */}
      <div className="api-integration-notice">
        <div className="notice-icon"><FaExclamationTriangle /></div>
        <div className="notice-content">
          <h3 className="notice-title">התמחור הוא לפי הודעה — לא לפי איש קשר</h3>
          <p className="notice-text">
            איש קשר אחד יכול לקבל כמה הודעות בקמפיין, וכל הודעה נספרת בנפרד — כך גם עלות השליחה מול Meta גדלה בהתאם.
            <br />
            <strong>דוגמה:</strong> לקוח מביא 800 אנשי קשר, והקמפיין בנוי מ־3 הודעות לכל איש קשר → מדובר בעד 2,400 הודעות,
            ולכן המחיר לפי מדרגת 1,001–2,500 = ₪1.50 להודעה, כלומר כ־₪3,600 אם כולן נשלחות.
          </p>
        </div>
      </div>

      {/* Best practice tip */}
      <div
        className="api-integration-notice"
        style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          border: '2px solid #10b981',
          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)',
        }}
      >
        <div className="notice-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <FaLightbulb />
        </div>
        <div className="notice-content">
          <h3 className="notice-title" style={{ color: '#065f46' }}>
            <FaExternalLinkAlt style={{ fontSize: '0.9rem', marginInlineEnd: '6px' }} />
            Best Practice — הוסיפו הפניה
          </h3>
          <p className="notice-text" style={{ color: '#065f46' }}>
            כדי להפיק את המרב מהדיוור, מומלץ להוסיף להודעה הפניה — למספר הוואטסאפ שלכם, לאתר, לדף נחיתה או לכפתור פעולה.
            כך הנמענים יכולים לחזור אליכם בקלות, ואתם מגדילים המרות ופניות חוזרות.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="onboarding-cta-section">
        <div className="cta-content">
          <h2>רוצים לצאת בקמפיין דיוור?</h2>
          <p>שלחו לנו את מלל ההודעה ואת רשימת הנמענים — אנחנו דואגים לכל השאר</p>
          <div className="cta-buttons">
            <Link href="/ContactUs/" className="cta-button primary">צור קשר</Link>
            <Link href="/PriceList/" className="cta-button secondary">חזרה למחירון</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

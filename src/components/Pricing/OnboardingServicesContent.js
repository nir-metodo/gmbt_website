'use client';
import React from 'react';
import Link from 'next/link';
import { FaRocket, FaStar, FaCheckCircle, FaUsers, FaDatabase, FaClock, FaCheck } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi2';
import './OnboardingServicesPage.css';

const packages = [
  {
    id: 'basic',
    name: 'הטמעה בסיסית',
    price: 950,
    icon: <FaCheckCircle />,
    description: 'מיועד לעסקים שרוצים להתחיל בצורה מסודרת, עם ליווי ראשוני',
    features: [
      'יצירת חשבון Gambot',
      'חיבור ואימות WhatsApp Business API מול Meta',
      'הגדרת מספר וואטסאפ',
      'יצירת טמפלטים ראשונים (Templates)',
      'סיוע בטעינת אנשי קשר (טעינה מאקסל)',
      'הדרכה ראשונית על המערכת (שימוש יומיומי)',
    ],
    note: '🔹 לא כולל בניית אוטומציות / בוטים',
    suitable: "מתאים למי שעובד בעיקר בצ'אט ידני או בקמפיינים",
  },
  {
    id: 'professional',
    name: 'הטמעה מקצועית',
    price: 1700,
    icon: <FaStar />,
    description: 'כולל כל מה שבמסלול הבסיסי, ובנוסף',
    features: [
      'כל מה שבהטמעה הבסיסית',
      'בניית תהליך אוטומציה אחד / בוט אחד',
      'לדוגמה: סינון לידים, זימון תורים, שאלות ותשובות, מענה ראשוני ללידים',
      'התאמת התהליך לצרכים העסקיים',
      'בדיקות + מעבר לאוויר',
    ],
    note: '🔸 ללא אינטגרציות עם מערכות חיצוניות',
  },
  {
    id: 'advanced',
    name: 'הטמעה מתקדמת',
    price: 2500,
    icon: <FaRocket />,
    popular: true,
    description: 'כולל כל מה שבשני המסלולים הקודמים, ובנוסף',
    features: [
      'כל מה שבהטמעה המקצועית',
      'עד 3 תהליכי אוטומציה / בוטים',
      'שילוב בין תהליכים (לדוגמה: ליד → סינון → פגישה → פולואפ)',
      'חשיבה רחבה על תהליך המכירה / השירות',
      'התאמה לעסקים עם כמה מחלקות או כמה שימושים במקביל',
    ],
    suitable: 'מתאים לעסקים מתקדמים, סוכנויות, או ארגונים',
  },
];

const retroTiers = [
  { contacts: 'עד 2,000 אנשי קשר', price: 890 },
  { contacts: '2,001-5,000 אנשי קשר', price: 1290 },
  { contacts: '5,001-10,000 אנשי קשר', price: 1790 },
  { contacts: 'מעל 10,000 אנשי קשר', price: null },
];

export default function OnboardingServicesContent() {
  return (
    <div className="onboarding-services-page" style={{ paddingTop: '68px' }}>

      <div className="onboarding-header">
        <div className="onboarding-header-badge">
          <HiOutlineSparkles className="sparkle-icon" />
          <span>שירותים מקצועיים</span>
        </div>
        <h1 className="onboarding-title">הטמעה והקמת מערכת</h1>
        <p className="onboarding-subtitle">
          <MdVerified className="subtitle-icon" />
          תהליך חד־פעמי שמטרתו להביא את העסק למצב של מערכת עובדת מהיום הראשון
        </p>
      </div>

      {/* Packages */}
      <div className="onboarding-packages-container">
        <h2 className="section-title">3 מסלולי הטמעה</h2>
        <div className="packages-grid">
          {packages.map(pkg => (
            <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && (
                <div className="popular-badge">
                  <FaStar className="star-icon" />
                  <span>המומלץ ביותר</span>
                </div>
              )}
              <div className="package-header">
                <div className="package-icon">{pkg.icon}</div>
                <h3 className="package-name">{pkg.name}</h3>
                <p className="package-description">{pkg.description}</p>
              </div>
              <div className="package-pricing">
                <span className="currency">₪</span>
                <span className="amount">{pkg.price.toLocaleString()}</span>
                <span className="vat-note">(לא כולל מע״מ)</span>
              </div>
              <div className="package-features">
                <h4>כולל:</h4>
                <ul>
                  {pkg.features.map((f, i) => (
                    <li key={i}><FaCheckCircle className="check-icon" /><span>{f}</span></li>
                  ))}
                </ul>
              </div>
              {pkg.note && <div className="package-note">{pkg.note}</div>}
              {pkg.suitable && <div className="package-suitable">{pkg.suitable}</div>}
              <Link href="/ContactUs/" className={`package-button ${pkg.popular ? 'primary' : 'secondary'}`}>
                צור קשר
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Retro Recovery */}
      <div className="retro-recovery-section">
        <div className="retro-header">
          <div className="retro-icon"><FaDatabase /></div>
          <h2 className="section-title">שחזור רטרו (ייבוא היסטוריית וואטסאפ)</h2>
          <p className="retro-description">ייבוא היסטוריית שיחות קיימת מ-WhatsApp Business שעל הטלפון אל מערכת Gambot</p>
        </div>
        <div className="retro-content">
          <div className="retro-what-is-it">
            <h3>מה זה שחזור רטרו?</h3>
            <ul>
              {['ייבוא אנשי קשר', 'ייבוא שיחות והודעות', 'שמירה על רצף היסטורי', 'באמצעות קבצי: wa.db, msgstore.db'].map((item, i) => (
                <li key={i}><FaCheckCircle className="check-icon" /><span>{item}</span></li>
              ))}
            </ul>
            <p className="retro-suitable">מתאים למי שעובר מוואטסאפ על הטלפון ולא רוצה לאבד מידע היסטורי</p>
          </div>
          <div className="retro-pricing-tiers">
            <h3>תמחור לפי כמות אנשי קשר</h3>
            <div className="tiers-grid">
              {retroTiers.map((tier, i) => (
                <div key={i} className="tier-card">
                  <div className="tier-contacts"><FaUsers className="tier-icon" /><span>{tier.contacts}</span></div>
                  <div className="tier-price">
                    {tier.price ? (
                      <><span className="currency">₪</span><span className="amount">{tier.price.toLocaleString()}</span></>
                    ) : (
                      <span className="custom-price">תמחור מותאם אישית</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="retro-note">💡 ככל שכמות הנתונים גדלה – כך תהליך העיבוד, הבדיקות והטעינה מורכב וארוך יותר</p>
          </div>
        </div>
        <Link href="/ContactUs/" className="retro-button">בקש שחזור רטרו</Link>
      </div>

      {/* Additional Services */}
      <div className="additional-services-section">
        <div className="additional-header">
          <FaClock className="additional-icon" />
          <h2 className="section-title">שירותים נוספים</h2>
        </div>
        <div className="additional-content">
          <p className="additional-description">כל שירות נוסף בתעריף שעתי</p>
          <div className="hourly-rate">
            <span className="currency">₪</span>
            <span className="amount">400</span>
            <span className="period">/שעה</span>
          </div>
          <p className="vat-note">(כל המחירים לא כוללים מע״מ)</p>
        </div>
      </div>

      {/* CTA */}
      <div className="onboarding-cta-section">
        <div className="cta-content">
          <h2>מוכנים להתחיל?</h2>
          <p>הצוות שלנו ילווה אותך בתהליך ויבטיח הקמה חלקה</p>
          <div className="cta-buttons">
            <Link href="/ContactUs/" className="cta-button primary">צור קשר</Link>
            <Link href="/PriceList/" className="cta-button secondary">חזרה למחירון</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

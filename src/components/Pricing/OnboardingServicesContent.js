'use client';
import React from 'react';
import Link from 'next/link';
import { FaRocket, FaStar, FaCheck, FaUsers, FaDatabase, FaClock, FaWhatsapp, FaRegCircle, FaArrowLeft } from 'react-icons/fa';
import { FiCheckCircle, FiInfo } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import './OnboardingServices.css';

const packages = [
  {
    id: 'basic',
    name: 'הטמעה בסיסית',
    price: 1800,
    icon: <FiCheckCircle />,
    color: '#2e6155',
    description: 'מיועד לעסקים שרוצים להתחיל בצורה מסודרת, עם ליווי ראשוני',
    features: [
      'יצירת חשבון Gambot',
      'חיבור ואימות WhatsApp Business API מול Meta',
      'הגדרת מספר וואטסאפ',
      'יצירת טמפלטים ראשונים (Templates)',
      'סיוע בטעינת אנשי קשר (טעינה מאקסל)',
      'הדרכה ראשונית על המערכת (שימוש יומיומי)',
    ],
    note: 'לא כולל בניית אוטומציות / בוטים',
    suitable: "מתאים למי שעובד בעיקר בצ'אט ידני או בקמפיינים",
  },
  {
    id: 'professional',
    name: 'הטמעה מקצועית',
    price: 3500,
    icon: <FaStar />,
    color: '#7c3aed',
    description: 'כולל כל מה שבמסלול הבסיסי, ובנוסף',
    features: [
      'כל מה שבהטמעה הבסיסית',
      'בניית תהליך אוטומציה אחד / בוט אחד',
      'לדוגמה: סינון לידים, זימון תורים, שאלות ותשובות, מענה ראשוני ללידים',
      'התאמת התהליך לצרכים העסקיים',
      'בדיקות + מעבר לאוויר',
    ],
    note: 'ללא אינטגרציות עם מערכות חיצוניות',
  },
  {
    id: 'advanced',
    name: 'הטמעה מלאה — Bot + CRM',
    price: 4970,
    icon: <FaRocket />,
    color: '#10b981',
    popular: true,
    description: 'כולל כל מה שבשני המסלולים הקודמים, ובנוסף הקמת CRM מלא',
    features: [
      'כל מה שבהטמעה המקצועית',
      'הגדרת CRM מלא — לידים, פניות, הצעות מחיר, קטלוג',
      'חיבור מקורות לידים: Facebook Lead Ads / Google',
      'התאמת שדות מותאמים ללידים ולאנשי קשר',
      'הגדרת תהליך פניות (Cases) ותגובות מהירות',
      'הגדרת הצעות מחיר וקטלוג מוצרים / שירותים',
      'שילוב בין תהליכים (ליד ← סינון ← פגישה ← פולואפ)',
      'הדרכה ראשונית על כלל המערכת — WhatsApp + CRM',
    ],
    suitable: 'מתאים לעסקים שרוצים לנהל לקוחות, לידים ומכירות — הכל ממקום אחד',
  },
];

const retroTiers = [
  { contacts: 'עד 2,000 אנשי קשר', price: 890 },
  { contacts: '2,001-5,000 אנשי קשר', price: 1290 },
  { contacts: '5,001-10,000 אנשי קשר', price: 1790 },
  { contacts: 'מעל 10,000 אנשי קשר', price: null },
];

const retroIncludes = ['ייבוא אנשי קשר', 'ייבוא שיחות והודעות', 'שמירה על רצף היסטורי', 'באמצעות קבצי: wa.db, msgstore.db'];

const ENTERPRISE_WA = 'https://wa.me/97233768997?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%94%D7%98%D7%9E%D7%A2%D7%94%20Enterprise';

export default function OnboardingServicesContent() {
  return (
    <div className="os-page" dir="rtl">
      {/* Hero */}
      <header className="os-hero">
        <div className="os-hero-inner">
          <span className="os-eyebrow"><MdVerified /> שירותים מקצועיים</span>
          <h1 className="os-title">הטמעה והקמת <span className="os-title-accent">מערכת</span></h1>
          <p className="os-subtitle">תהליך חד־פעמי שמטרתו להביא את העסק למצב של מערכת עובדת מהיום הראשון</p>
        </div>
      </header>

      <main className="os-main">
        {/* Packages */}
        <section aria-labelledby="os-packages-title">
          <h2 id="os-packages-title" className="os-sr-only">מסלולי הטמעה</h2>
          <div className="os-plans">
            {packages.map((pkg) => (
              <article key={pkg.id} className={`os-plan ${pkg.popular ? 'is-recommended' : ''}`} style={{ '--plan-color': pkg.color }}>
                {pkg.popular && <span className="os-plan-badge"><FaStar /> המומלץ ביותר</span>}

                <div className="os-plan-head">
                  <span className="os-plan-icon">{pkg.icon}</span>
                  <div>
                    <h3 className="os-plan-name">{pkg.name}</h3>
                    <p className="os-plan-desc">{pkg.description}</p>
                  </div>
                </div>

                <div className="os-price">
                  <span className="os-price-currency">₪</span>
                  <span className="os-price-amount">{pkg.price.toLocaleString('en-US')}</span>
                </div>
                <p className="os-price-meta">תשלום חד־פעמי · לא כולל מע״מ</p>

                <Link href="/ContactUs/" className="os-cta">צור קשר</Link>

                <ul className="os-features">
                  {pkg.features.map((f, i) => (
                    <li key={i}><FaCheck className="os-check" /><span>{f}</span></li>
                  ))}
                </ul>

                {pkg.note && (
                  <p className="os-plan-note"><FaRegCircle /> {pkg.note}</p>
                )}
                {pkg.suitable && (
                  <p className="os-plan-suitable"><FiInfo /> {pkg.suitable}</p>
                )}
              </article>
            ))}
          </div>

          <a className="os-banner" href={ENTERPRISE_WA} target="_blank" rel="noopener noreferrer">
            <span className="os-banner-text">
              <strong>Enterprise</strong>
              <span>צרכים מורכבים? אינטגרציות? מספר סניפים? נבנה תהליך הטמעה מותאם אישית</span>
            </span>
            <span className="os-banner-btn"><FaWhatsapp /> צרו איתנו קשר</span>
          </a>
        </section>

        {/* Retro recovery */}
        <section className="os-section" aria-labelledby="os-retro-title">
          <div className="os-section-head">
            <span className="os-section-icon"><FaDatabase /></span>
            <h2 id="os-retro-title">שחזור רטרו</h2>
            <p>ייבוא היסטוריית שיחות קיימת מ-WhatsApp Business שעל הטלפון אל מערכת Gambot</p>
          </div>

          <div className="os-retro">
            <div className="os-retro-what">
              <h3>מה זה שחזור רטרו?</h3>
              <ul>
                {retroIncludes.map((item) => (
                  <li key={item}><FaCheck className="os-check" /><span dir={item.includes('wa.db') ? 'auto' : undefined}>{item}</span></li>
                ))}
              </ul>
              <p className="os-retro-suitable">מתאים למי שעובר מוואטסאפ על הטלפון ולא רוצה לאבד מידע היסטורי</p>
            </div>

            <div className="os-retro-pricing">
              <h3>תמחור לפי כמות אנשי קשר</h3>
              <ul className="os-tiers">
                {retroTiers.map((tier) => (
                  <li key={tier.contacts} className="os-tier">
                    <span className="os-tier-contacts"><FaUsers /> {tier.contacts}</span>
                    {tier.price ? (
                      <span className="os-tier-price"><small>₪</small>{tier.price.toLocaleString('en-US')}</span>
                    ) : (
                      <span className="os-tier-custom">תמחור מותאם אישית</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="os-retro-note"><FiInfo /> ככל שכמות הנתונים גדלה, כך תהליך העיבוד, הבדיקות והטעינה מורכב וארוך יותר</p>
              <Link href="/ContactUs/" className="os-btn">בקשת שחזור רטרו</Link>
            </div>
          </div>
        </section>

        {/* Additional services */}
        <section className="os-section" aria-labelledby="os-extra-title">
          <div className="os-hourly">
            <span className="os-section-icon"><FaClock /></span>
            <div className="os-hourly-text">
              <h2 id="os-extra-title">שירותים נוספים</h2>
              <p>כל שירות נוסף בתעריף שעתי</p>
            </div>
            <div className="os-hourly-rate">
              <span className="os-hourly-currency">₪</span>
              <span className="os-hourly-amount">555</span>
              <span className="os-hourly-period">/ לשעה</span>
            </div>
          </div>
          <p className="os-footnote">כל המחירים בעמוד אינם כוללים מע״מ</p>
        </section>

        {/* Final CTA */}
        <section className="os-final">
          <div>
            <h2>מוכנים להתחיל?</h2>
            <p>הצוות שלנו ילווה אותך בתהליך ויבטיח הקמה חלקה</p>
          </div>
          <div className="os-final-actions">
            <Link href="/ContactUs/" className="os-btn os-btn-green">צור קשר</Link>
            <Link href="/PriceList/" className="os-btn os-btn-ghost-light"><FaArrowLeft /> חזרה למחירון</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

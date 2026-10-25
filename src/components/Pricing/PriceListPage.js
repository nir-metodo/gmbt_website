'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheck, FaCrown, FaStar, FaLightbulb, FaChevronDown, FaChevronUp, FaArrowRight, FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';
import { FaRocket } from 'react-icons/fa6';
import { MdVerified, MdFlashOn } from 'react-icons/md';
import { useLanguage } from '@/contexts/LanguageContext';
import { getFeatureInfo } from '@/lib/planFeatureInfo';
import './PriceListPage.css';

// Same three plans (names, copy, prices) as the sign-up wizard — keep both in sync.
const PLANS = [
    { key: 'basic', price: 179, yearlyMonthly: 143, icon: FaLightbulb, color: '#3b82f6' },
    { key: 'premium', price: 359, yearlyMonthly: 287, icon: FaStar, color: '#10b981', recommended: true },
    { key: 'enterprise', price: 645, yearlyMonthly: 516, icon: FaRocket, color: '#8b5cf6' },
];

const CONVERSION_RATE = 3.5; // ILS → USD for the English (international) view
const WHATSAPP = 'https://wa.me/97233768997';

const asArray = (v) => (Array.isArray(v) ? v : []);

const PriceListPage = () => {
    const router = useRouter();
    const { t, currentLanguage, isRTL } = useLanguage();
    const en = currentLanguage === 'en';
    const L = (he, enText) => (en ? enText : he);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [expanded, setExpanded] = useState({});

    const money = (ils) => (en
        ? { currency: '$', amount: Math.round(ils / CONVERSION_RATE) }
        : { currency: '₪', amount: ils });

    const Arrow = isRTL ? FaArrowLeft : FaArrowRight;
    const startSignup = () => router.push('/OnboardingProcess');
    const waLink = (text) => `${WHATSAPP}?text=${encodeURIComponent(text)}`;

    const supportBoxes = [
        {
            icon: '✅', tone: 'ok',
            title: L('כלול בתמיכה', 'Included in support'),
            items: en
                ? ['Answers to questions about using the system', 'Help with existing settings', 'Feature explanations', 'Fixing technical issues', 'General guidance for correct use']
                : ['מענה לשאלות על שימוש במערכת', 'עזרה בהגדרות קיימות', 'הסבר על פיצ׳רים', 'פתרון תקלות טכניות', 'הכוונה כללית לשימוש נכון'],
        },
        {
            icon: '❌', tone: 'no',
            title: L('לא כלול בתמיכה', 'Not included in support'),
            items: en
                ? ['Building new bots and automations', 'Designing business processes', 'Setting up campaigns', 'Connecting external systems', 'Staff training / onboarding', 'Marketing or business consulting']
                : ['בניית בוטים ואוטומציות חדשות', 'עיצוב תהליכים עסקיים', 'הקמת קמפיינים', 'חיבור מערכות חיצוניות', 'הדרכת עובדים / onboarding', 'ייעוץ שיווקי או עסקי'],
        },
        {
            icon: '🔧', tone: 'extra',
            title: L('שירותים נוספים', 'Additional services'),
            items: en
                ? ['Development & customization — ₪555/hour + VAT', 'Staff training — from ₪600', 'One-time consulting call — ₪400 + VAT', 'Building bots / automations — by scope']
                : ['פיתוח והתאמות — ₪555/שעה + מע״מ', 'הדרכת עובדים — החל מ-₪600', 'שיחת ייעוץ חד-פעמית — ₪400 + מע״מ', 'בניית בוטים / אוטומציות — לפי היקף'],
            note: L('* המנוי הוא על המערכת. שירותים נוספים תמיד בתשלום נפרד.', '* The subscription covers the system. Additional services are always billed separately.'),
        },
    ];

    const supportPlusFeatures = en
        ? ['Response within 4 business hours', 'Direct WhatsApp line to a dedicated representative', 'Priority in the support queue', 'Monthly consultation call (30 min)', 'Guidance with setup and usage questions']
        : ['מענה עד 4 שעות בימי עסקים', 'וואטסאפ ישיר לנציג ייעודי', 'עדיפות בתור הטיפול', 'שיחת ייעוץ חודשית (30 דק׳)', 'ליווי בהגדרות ושאלות שימוש'];

    return (
        <div className={`pl-page ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* ── Hero ─────────────────────────────────────────────── */}
            <header className="pl-hero">
                <div className="pl-hero-inner">
                    <span className="pl-eyebrow"><MdVerified /> {L('שותף רשמי של Meta', 'Official Meta Business Partner')}</span>
                    <h1 className="pl-title">
                        {en
                            ? <>Find the <span className="pl-title-accent">right plan</span> for your business</>
                            : <>בחרו את <span className="pl-title-accent">התוכנית המתאימה</span> לעסק שלכם</>}
                    </h1>
                    <p className="pl-subtitle">
                        {L('אוטומציות WhatsApp מתקדמות ויכולות AI לעסקים בכל הגדלים', 'Powerful WhatsApp automation and AI for businesses of all sizes')}
                    </p>
                </div>
            </header>

            <main className="pl-main">
                {/* ── Billing switch ───────────────────────────────── */}
                <div className="pl-billing-row">
                    <p className="pl-billing-hint">{t('pricing.billingCycle.subtitle')}</p>
                    <div className="pl-billing" role="group" aria-label={t('pricing.billingCycle.title')}>
                        <button
                            type="button"
                            className={billingCycle === 'monthly' ? 'is-active' : ''}
                            aria-pressed={billingCycle === 'monthly'}
                            onClick={() => setBillingCycle('monthly')}
                        >
                            {t('planSelection.billing.monthly.label')}
                        </button>
                        <button
                            type="button"
                            className={billingCycle === 'yearly' ? 'is-active' : ''}
                            aria-pressed={billingCycle === 'yearly'}
                            onClick={() => setBillingCycle('yearly')}
                        >
                            {t('planSelection.billing.yearly.label')}
                            <span className="pl-billing-badge">{t('planSelection.billing.yearly.badge')}</span>
                        </button>
                    </div>
                </div>

                {/* ── Plans ────────────────────────────────────────── */}
                <section className="pl-plans" aria-label={L('תוכניות ומחירים', 'Plans and pricing')}>
                    {PLANS.map((plan) => {
                        const Icon = plan.icon;
                        const base = `planSelection.plans.${plan.key}`;
                        const features = asArray(t(`${base}.features`));
                        const more = asArray(t(`${base}.moreFeatures`));
                        const isOpen = !!expanded[plan.key];
                        const shown = money(billingCycle === 'monthly' ? plan.price : plan.yearlyMonthly);
                        const yearlyTotal = money(plan.yearlyMonthly * 12);
                        const saving = money(plan.price * 12 - plan.yearlyMonthly * 12);

                        return (
                            <article key={plan.key} className={`pl-plan${plan.recommended ? ' is-recommended' : ''}`} style={{ '--plan-color': plan.color }}>
                                {plan.recommended && (
                                    <span className="pl-plan-badge"><FaCrown /> {t(`${base}.recommended`)}</span>
                                )}

                                <div className="pl-plan-head">
                                    <span className="pl-plan-icon"><Icon /></span>
                                    <div>
                                        <h2 className="pl-plan-name">{t(`${base}.name`)}</h2>
                                        <p className="pl-plan-desc">{t(`${base}.description`)}</p>
                                    </div>
                                </div>

                                <div className="pl-price">
                                    <span className="pl-price-currency">{shown.currency}</span>
                                    <span className="pl-price-amount">{shown.amount}</span>
                                    <span className="pl-price-period">{t('pricing.ui.perMonth')}</span>
                                </div>
                                <div className="pl-price-meta">
                                    {billingCycle === 'yearly' ? (
                                        <>
                                            <span>{t('pricing.ui.yearlyBilling')}: {yearlyTotal.currency}{yearlyTotal.amount.toLocaleString()}</span>
                                            <span className="pl-saving">{t('pricing.ui.save')} {saving.currency}{saving.amount.toLocaleString()}</span>
                                        </>
                                    ) : (!en && <span>* המחירים אינם כוללים מע״מ</span>)}
                                </div>

                                <button type="button" className="pl-cta" onClick={startSignup}>
                                    {t('pricing.ui.selectPlan')} <Arrow aria-hidden="true" />
                                </button>

                                <ul className="pl-features">
                                    {features.map((feature, i) => {
                                        const info = getFeatureInfo(feature, currentLanguage);
                                        return (
                                            <li key={i}>
                                                <FaCheck className="pl-check" aria-hidden="true" />
                                                <span className="pl-feature-text">
                                                    {feature}
                                                    {info && (
                                                        <>
                                                            <span className="pl-info" tabIndex={0} role="button" aria-label={info.text}>?</span>
                                                            <span className="pl-tip" role="tooltip" dir={en ? 'ltr' : 'rtl'}>
                                                                <span className="pl-tip-box">
                                                                    {info.text}
                                                                    {info.href && <> <a href={info.href}>{info.linkLabel}</a></>}
                                                                </span>
                                                            </span>
                                                        </>
                                                    )}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {more.length > 0 && (
                                    <>
                                        <button
                                            type="button"
                                            className="pl-more-toggle"
                                            aria-expanded={isOpen}
                                            onClick={() => setExpanded((prev) => ({ ...prev, [plan.key]: !prev[plan.key] }))}
                                        >
                                            {isOpen
                                                ? <><FaChevronUp /> {L('הצג פחות', 'Show less')}</>
                                                : <><FaChevronDown /> {en ? `+${more.length} CRM features` : `+${more.length} יכולות CRM`}</>}
                                        </button>
                                        {isOpen && (
                                            <ul className="pl-features pl-features-more">
                                                {more.map((feature, i) => (
                                                    <li key={i}><FaCheck className="pl-check" aria-hidden="true" /><span className="pl-feature-text">{feature}</span></li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )}
                            </article>
                        );
                    })}
                </section>

                {/* ── Enterprise / notes ───────────────────────────── */}
                <a
                    className="pl-banner"
                    href={waLink(L('אני מעוניין בחבילת Enterprise', "I'm interested in a custom Enterprise plan"))}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="pl-banner-text">
                        <strong>{L('צריכים יותר?', 'Need more?')}</strong>
                        <span>{L('מעל 35,000 אנשי קשר? מעל 12 משתמשים? נבנה חבילה מותאמת אישית.', 'Over 35,000 contacts? More than 12 users? We will build a custom package.')}</span>
                    </span>
                    <span className="pl-banner-btn">{L('דברו איתנו בוואטסאפ', 'Talk to us on WhatsApp')} <Arrow aria-hidden="true" /></span>
                </a>
                <p className="pl-footnote">{L('* חשבוניות: המערכת תומכת כרגע בחשבוניות עד ₪10,000 לחשבונית בודדת', '* Invoices: the system currently supports invoices of up to ₪10,000 per invoice')}</p>

                {/* ── Included in all plans ────────────────────────── */}
                <section className="pl-section">
                    <div className="pl-section-head">
                        <h2>{t('pricing.ui.allPlansInclude')}</h2>
                        <p>{t('pricing.ui.advancedFeatures')}</p>
                    </div>
                    <ul className="pl-included">
                        {asArray(t('pricing.planFeatures')).map((feature, i) => (
                            <li key={i}><MdVerified aria-hidden="true" /> <span>{feature}</span></li>
                        ))}
                    </ul>
                </section>

                {/* ── Support Plus ─────────────────────────────────── */}
                <section className="pl-section">
                    <div className="pl-support-plus">
                        <div className="pl-sp-price">
                            <span className="pl-sp-label">Support Plus</span>
                            <div className="pl-sp-amount">
                                <span className="pl-sp-currency">{money(650).currency}</span>
                                <span className="pl-sp-number">{money(650).amount}</span>
                                <span className="pl-sp-period">{L('/חודש', '/month')}</span>
                            </div>
                            <span className="pl-sp-note">{L('תוספת לכל חבילה קיימת', 'Add-on for any plan')}</span>
                            <a className="pl-sp-btn" href={waLink(L('אני רוצה להוסיף Support Plus', 'I want to add Support Plus'))} target="_blank" rel="noopener noreferrer">
                                {L('הוסיפו עכשיו', 'Add it now')}
                            </a>
                        </div>
                        <div className="pl-sp-body">
                            <h3>{L('מה כלול ב-Support Plus', 'What is included in Support Plus')}</h3>
                            <ul>
                                {supportPlusFeatures.map((f, i) => (
                                    <li key={i}><FaCheck aria-hidden="true" /> {f}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── What support covers ──────────────────────────── */}
                <section className="pl-section">
                    <div className="pl-section-head">
                        <h2>{L('מה כלול בתמיכה?', 'What does support cover?')}</h2>
                        <p>{L('הגדרנו בשקיפות מלאה מה התמיכה כוללת — ומה לא', 'We spell out exactly what support includes — and what it does not')}</p>
                    </div>
                    <div className="pl-support-grid">
                        {supportBoxes.map((box) => (
                            <div key={box.tone} className={`pl-support-box is-${box.tone}`}>
                                <h3><span aria-hidden="true">{box.icon}</span> {box.title}</h3>
                                <ul>
                                    {box.items.map((item) => <li key={item}>{item}</li>)}
                                </ul>
                                {box.note && <p className="pl-support-note">{box.note}</p>}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── DIY vs professional ──────────────────────────── */}
                <section className="pl-section">
                    <div className="pl-section-head">
                        <h2>{L('בחרו את הדרך שלכם', 'Choose your path')}</h2>
                        <p>{L('לבד או עם ליווי מקצועי — אנחנו כאן בשביל זה', 'On your own or with professional help — we have you covered')}</p>
                    </div>
                    <div className="pl-paths">
                        <div className="pl-path">
                            <span className="pl-path-icon"><FaLightbulb /></span>
                            <h3>{L('עושים לבד (DIY)', 'Do it yourself (DIY)')}</h3>
                            <p>{L('בוחרים חבילה, יוצרים חשבון ומתקדמים לפי המדריך למשתמש.', 'Pick a plan, create an account and follow our user guide to set everything up yourself.')}</p>
                            <ul>
                                <li><FaCheck aria-hidden="true" /> {L('מחירי החבילות לעיל', 'Plan pricing above')}</li>
                                <li><FaCheck aria-hidden="true" /> {L('מדריך למשתמש מקיף', 'Comprehensive user guide')}</li>
                                <li><FaCheck aria-hidden="true" /> {L('שליטה מלאה', 'Full control')}</li>
                            </ul>
                            <button type="button" className="pl-path-btn is-primary" onClick={startSignup}>{L('מתחילים עכשיו', 'Start now')}</button>
                        </div>
                        <div className="pl-path is-pro">
                            <span className="pl-path-tag"><FaCrown /> {L('מקצועי', 'Professional')}</span>
                            <span className="pl-path-icon"><FaRocket /></span>
                            <h3>{L('הטמעה ושירותים מקצועיים', 'Professional setup & services')}</h3>
                            <p>{L('הצוות שלנו מטפל בהכול — מההקמה ועד האוטומציה.', 'Let our team handle everything — from setup to automation.')}</p>
                            <ul>
                                <li><FaCheck aria-hidden="true" /> {L('שירות הטמעה מלא', 'Full onboarding service')}</li>
                                <li><FaCheck aria-hidden="true" /> {L('בניית בוטים ואוטומציות', 'Bot & automation building')}</li>
                                <li><FaCheck aria-hidden="true" /> {L('שחזור היסטוריית וואטסאפ', 'WhatsApp history recovery')}</li>
                                <li><FaCheck aria-hidden="true" /> {L('תמיכה ייעודית', 'Dedicated support')}</li>
                            </ul>
                            <button type="button" className="pl-path-btn" onClick={() => router.push('/PriceList/OnboardingServices')}>
                                {L('לשירותים ומחירים', 'View services & pricing')}
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── WhatsApp message costs ───────────────────────── */}
                <section className="pl-section">
                    <div className="pl-costs">
                        <span className="pl-costs-icon"><MdFlashOn /></span>
                        <div className="pl-costs-body">
                            <span className="pl-costs-badge">{t('pricing.whatsappPricing.smartPricingBadge')}</span>
                            <h2>
                                <span className="pl-title-accent">{t('pricing.whatsappPricing.title')}</span>
                                {t('pricing.whatsappPricing.titleSuffix')}
                            </h2>
                            <p>{t('pricing.whatsappPricing.description')}</p>
                            <div className="pl-costs-actions">
                                <button type="button" className="pl-path-btn is-primary" onClick={() => router.push('/PriceList/WhatsAppMessagingPricingBlog')}>
                                    {t('pricing.whatsappPricing.learnMoreButton')}
                                </button>
                                <button type="button" className="pl-path-btn" onClick={() => router.push('/PriceList/MetaPricing')}>
                                    <FaMoneyBillWave aria-hidden="true" /> {t('pricing.whatsappPricing.viewPricingTable')}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PriceListPage;

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

const NAV_LINKS_HE = [
  { href: '/', label: 'דף בית' },
  {
    label: 'פתרונות',
    children: [
      { href: '/בוט-וואטסאפ/', label: '🤖 בוטים לוואטסאפ' },
      { href: '/בוט-ai-וואטסאפ/', label: '🧠 בוט AI לוואטסאפ' },
      { href: '/בוט-לידים-וואטסאפ/', label: '🎯 בוט לידים וואטסאפ' },
      { href: '/אוטומציה-בוואטסאפ/', label: '⚡ אוטומציות וואטסאפ' },
      { href: '/שיווק-בוואטסאפ/', label: '📢 שיווק וקמפיינים' },
      { href: '/מערכת-שיווק-בוואטסאפ/', label: '💬 מערכת התכתבות' },
      { href: '/וואטסאפ-crm/', label: '📋 WhatsApp CRM' },
      { href: '/חתימה-דיגיטלית/', label: '✍️ חתימה דיגיטלית' },
      { href: '/הצעות-מחיר/', label: '📄 הצעות מחיר' },
      { href: '/ניהול-מדיה/', label: '📊 דוחות שיווק' },
    ],
  },
  { href: '/PriceList/', label: 'מחירים' },
  { href: '/blog/', label: 'בלוג' },
  { href: '/guide/', label: 'מדריך' },
  { href: '/about/', label: 'אודות' },
  { href: '/ContactUs/', label: 'צור קשר' },
];

const NAV_LINKS_EN = [
  { href: '/', label: 'Home' },
  {
    label: 'Solutions',
    children: [
      { href: '/בוט-וואטסאפ/', label: '🤖 WhatsApp Bots' },
      { href: '/בוט-ai-וואטסאפ/', label: '🧠 WhatsApp AI Bot' },
      { href: '/בוט-לידים-וואטסאפ/', label: '🎯 WhatsApp Leads Bot' },
      { href: '/אוטומציה-בוואטסאפ/', label: '⚡ WhatsApp Automations' },
      { href: '/שיווק-בוואטסאפ/', label: '📢 Marketing & Campaigns' },
      { href: '/מערכת-שיווק-בוואטסאפ/', label: '💬 Messaging System' },
      { href: '/וואטסאפ-crm/', label: '📋 WhatsApp CRM' },
      { href: '/חתימה-דיגיטלית/', label: '✍️ Digital Signature' },
      { href: '/הצעות-מחיר/', label: '📄 Price Quotes' },
      { href: '/ניהול-מדיה/', label: '📊 Marketing Reports' },
    ],
  },
  { href: '/PriceList/', label: 'Pricing' },
  { href: '/blog/', label: 'Blog' },
  { href: '/guide/', label: 'Guide' },
  { href: '/about/', label: 'About' },
  { href: '/ContactUs/', label: 'Contact' },
];

const LANG_OPTIONS = [
  { code: 'he', flag: '🇮🇱', label: 'עברית' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const lang = currentLanguage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const EN_CAMPAIGN_PATHS = ['/whatsapp-bot-campaign', '/crm-for-business', '/whatsapp-business-system', '/whatsapp-marketing', '/whatsapp-bot-types'];
  const isEnCampaign = EN_CAMPAIGN_PATHS.some(p => pathname?.startsWith(p));
  if (pathname?.startsWith('/complete-waba') || pathname?.startsWith('/קמפיין-') || isEnCampaign) return null;

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
    setMobileSolutionsOpen(false);
    setLangDropOpen(false);
  }, [pathname]);

  const changeLang = (code) => {
    setCurrentLanguage(code);
    localStorage.setItem('gambot_lang', code);
    document.documentElement.dir = code === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    setLangDropOpen(false);
  };

  const NAV_LINKS = lang === 'he' ? NAV_LINKS_HE : NAV_LINKS_EN;
  const isRTL = lang === 'he';
  const currentLang = LANG_OPTIONS.find(l => l.code === lang);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={styles.container}>
        {/* Logo — in RTL (Hebrew) pushed to the LEFT (order 1), hamburger takes the RIGHT (order -1) */}
        <Link href="/" className={styles.logo} style={isRTL ? { order: 1 } : {}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gambot_logo_transparent.png"
            alt="גמבוט לוגו"
            width={130}
            height={44}
            style={{ display: 'block', width: '44px', height: '44px', objectFit: 'contain' }}
          />
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map((link, i) =>
            link.children ? (
              <li
                key={i}
                className={styles.dropdown}
                onMouseEnter={() => setOpenDropdown(i)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className={styles.dropBtn}>
                  {link.label} <span>▾</span>
                </button>
                <ul className={`${styles.dropMenu} ${openDropdown === i ? styles.dropOpen : ''}`}>
                  {link.children.map((child, j) => (
                    <li key={j}>
                      <Link href={child.href} className={styles.dropItem}>{child.label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={i}>
                <Link href={link.href} className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}>
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Desktop CTA + Lang */}
        <div className={styles.cta}>
          {/* Language dropdown */}
          <div className={styles.langWrapper}>
            <button
              className={styles.langBtn}
              onClick={() => setLangDropOpen(v => !v)}
              aria-label="שנה שפה"
            >
              <span>{currentLang?.flag}</span>
              <span className={styles.langLabel}>{currentLang?.code === 'he' ? 'עב' : 'EN'}</span>
              <span className={styles.langArrow}>▾</span>
            </button>
            {langDropOpen && (
              <div className={styles.langDrop}>
                {LANG_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    className={`${styles.langOption} ${lang === opt.code ? styles.langOptionActive : ''}`}
                    onClick={() => changeLang(opt.code)}
                  >
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link href="/OnboardingProcess/" className={styles.ctaBtn}>
            {lang === 'he' ? 'צור חשבון' : 'Sign Up'}
          </Link>
          <Link href="/login" className={styles.loginBtn}>
            {lang === 'he' ? 'כניסה' : 'Login'}
          </Link>
        </div>

        {/* Hamburger — in RTL: RIGHT side (order -1 = before logo); in LTR: RIGHT side (space-between end) */}
        <button
          className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="תפריט"
          style={isRTL ? { order: -1 } : {}}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className={styles.mobileMenu} dir={isRTL ? 'rtl' : 'ltr'}>
          {NAV_LINKS.map((link, i) =>
            link.children ? (
              <div key={i} className={styles.mobileAccordion}>
                <button
                  className={styles.mobileAccordionBtn}
                  onClick={() => setMobileSolutionsOpen(v => !v)}
                >
                  <span>{link.label}</span>
                  <span className={`${styles.mobileAccordionArrow} ${mobileSolutionsOpen ? styles.mobileAccordionArrowOpen : ''}`}>
                    ▾
                  </span>
                </button>
                {mobileSolutionsOpen && (
                  <div className={styles.mobileAccordionBody}>
                    {link.children.map((child, j) => (
                      <Link key={j} href={child.href} className={styles.mobileSolutionLink} onClick={() => setIsOpen(false)}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={i} href={link.href} className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ''}`} onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            )
          )}

          {/* Mobile bottom: CTA + lang */}
          <div className={styles.mobileCta}>
            <Link href="/OnboardingProcess/" className={styles.ctaBtn} onClick={() => setIsOpen(false)}>
              {lang === 'he' ? 'צור חשבון' : 'Sign Up'}
            </Link>
            <Link href="/login" className={styles.loginBtn} onClick={() => setIsOpen(false)}>
              {lang === 'he' ? 'כניסה' : 'Login'}
            </Link>
          </div>
          <div className={styles.mobileLangRow}>
            {LANG_OPTIONS.map(opt => (
              <button
                key={opt.code}
                className={`${styles.mobileLangOpt} ${lang === opt.code ? styles.mobileLangOptActive : ''}`}
                onClick={() => changeLang(opt.code)}
              >
                {opt.flag} {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

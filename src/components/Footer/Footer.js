'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import styles from './Footer.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentLanguage } = useLanguage();
  const isEn = currentLanguage === 'en';
  const pathname = usePathname();

  const EN_CAMPAIGN_PATHS = ['/whatsapp-bot-campaign', '/crm-for-business', '/whatsapp-business-system', '/whatsapp-marketing', '/whatsapp-bot-types'];
  const isEnCampaign = EN_CAMPAIGN_PATHS.some(p => pathname?.startsWith(p));
  if (pathname?.startsWith('/complete-waba') || pathname?.startsWith('/קמפיין-') || isEnCampaign) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone) { alert(isEn ? 'Please enter a phone number' : 'אנא הזן מספר טלפון'); return; }
    setIsSubmitting(true);
    try {
      await fetch('https://prod-00.northeurope.logic.azure.com:443/workflows/24826d9f1f30448cb12884561d7bcc2b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RMrmjA9SPjryV5VE5iP8elY_V6tFdxhMgjs-zQI8FPQ', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, ClientId: 'R9f6r4oe5PSCLr6CnYRQ' }),
      });
      alert(isEn ? 'Successfully subscribed!' : 'ההרשמה בוצעה בהצלחה!');
      setPhone('');
    } catch { alert(isEn ? 'An error occurred. Please try again.' : 'הייתה שגיאה בשליחת הבקשה.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <footer className={styles.footer} dir={isEn ? 'ltr' : 'rtl'}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <Image src="/apple-touch-icon.png" alt="Gambot" width={40} height={40} />
            <span className={styles.brandName}>Gambot</span>
          </div>
          <p className={styles.brandDesc}>
            {isEn
              ? 'Israel\'s leading WhatsApp Business API platform. Smart bots, automations and marketing — all in one place.'
              : 'פלטפורמת WhatsApp Business API המובילה בישראל. בוטים חכמים, אוטומציות ושיווק - הכל במקום אחד.'}
          </p>
          <div className={styles.metaBadge}>
            <FaWhatsapp /> <span>{isEn ? 'Official Meta Partner' : 'שותף מטא רשמי'}</span>
          </div>
        </div>

        <div className={styles.col}>
          <h3>{isEn ? 'Get Started' : 'צעדים ראשונים'}</h3>
          <ul>
            <li><a href="https://gambot.co.il/OnboardingProcess">{isEn ? 'Create Account' : 'צור חשבון'}</a></li>
            <li><Link href="/guide/">{isEn ? 'User Guide' : 'מדריך למשתמש'}</Link></li>
            <li><Link href="/PriceList/">{isEn ? 'Pricing' : 'מחירים'}</Link></li>
            <li><Link href="/blog/">{isEn ? 'Blog' : 'בלוג'}</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3>{isEn ? 'Solutions' : 'פתרונות'}</h3>
          <ul>
            <li><Link href="/בוט-וואטסאפ/">{isEn ? 'WhatsApp Bots' : 'בוטים לוואטסאפ'}</Link></li>
            <li><Link href="/בוט-לידים-וואטסאפ/">{isEn ? 'AI Bot for WhatsApp' : 'בוט AI לוואטסאפ'}</Link></li>
            <li><Link href="/אוטומציה-בוואטסאפ/">{isEn ? 'WhatsApp Automations' : 'אוטומציות וואטסאפ'}</Link></li>
            <li><Link href="/שיווק-בוואטסאפ/">{isEn ? 'Marketing & Campaigns' : 'שיווק וקמפיינים'}</Link></li>
            <li><Link href="/מערכת-שיווק-בוואטסאפ/">{isEn ? 'Messaging System' : 'מערכת התכתבות'}</Link></li>
            <li><Link href="/וואטסאפ-crm/">{isEn ? 'WhatsApp CRM' : 'WhatsApp CRM'}</Link></li>
            <li><Link href="/חתימה-דיגיטלית/">{isEn ? 'Digital Signature' : 'חתימה דיגיטלית'}</Link></li>
            <li><Link href="/הצעות-מחיר/">{isEn ? 'Price Quotes' : 'הצעות מחיר'}</Link></li>
            <li><Link href="/ניהול-מדיה/">{isEn ? 'Marketing Reports' : 'דוחות שיווק'}</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3>{isEn ? 'Legal' : 'תקנון'}</h3>
          <ul>
            <li><Link href="/TermOfPayments/">{isEn ? 'Payment Terms' : 'תנאי תשלום'}</Link></li>
            <li><Link href="/TermOfUse/">{isEn ? 'Terms of Use' : 'תנאי שימוש'}</Link></li>
            <li><Link href="/privacy/">{isEn ? 'Privacy Policy' : 'מדיניות פרטיות'}</Link></li>
          </ul>
          <h3 style={{ marginTop: '24px' }}>{isEn ? 'Contact Us' : 'צור קשר'}</h3>
          <ul>
            <li><Link href="/about/">{isEn ? 'About — Nir Segas' : 'אודות — ניר סגס'}</Link></li>
            <li><Link href="/ContactUs/">{isEn ? 'Contact Us' : 'צור קשר'}</Link></li>
            <li><a href="tel:0559859052">055-985-9052</a></li>
            <li><a href="https://wa.me/97233768997" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3>{isEn ? 'Subscribe to Newsletter' : 'הרשמו לניוזלטר'}</h3>
          <p className={styles.newsDesc}>
            {isEn
              ? 'Get updates, news and deals directly on WhatsApp'
              : 'קבלו עדכונים, חדשות ומבצעים ישירות לוואטסאפ'}
          </p>
          <form onSubmit={handleSubmit} className={styles.newsForm}>
            <input
              type="tel"
              placeholder={isEn ? 'Phone number' : 'מספר טלפון'}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '...' : (isEn ? 'Subscribe' : 'הרשמה')}
            </button>
          </form>
        </div>
      </div>

      {!isEn && (
        <div className={styles.seoLinks}>
          <div className={styles.seoLinksGroup}>
            <span className={styles.seoLinksTitle}>בוטים לוואטסאפ</span>
            <div className={styles.seoLinksRow}>
              <Link href="/בוט-וואטסאפ/">בוט וואטסאפ</Link>
              <Link href="/בוט-ai-וואטסאפ/">בוט AI לוואטסאפ</Link>
              <Link href="/בוט-לידים-וואטסאפ/">בוט לידים</Link>
              <Link href="/בוט-מכירות-וואטסאפ/">בוט מכירות</Link>
              <Link href="/בוט-שירות-לקוחות-וואטסאפ/">בוט שירות לקוחות</Link>
              <Link href="/צאטבוט-וואטסאפ/">צ׳אטבוט וואטסאפ</Link>
              <Link href="/סוגי-בוט-וואטסאפ/">סוגי בוטים</Link>
            </div>
          </div>
          <div className={styles.seoLinksGroup}>
            <span className={styles.seoLinksTitle}>שיווק וקמפיינים</span>
            <div className={styles.seoLinksRow}>
              <Link href="/שיווק-בוואטסאפ/">שיווק בוואטסאפ</Link>
              <Link href="/שיווק-בוואטסאפ-לעסקים/">שיווק לעסקים</Link>
              <Link href="/דיוור-בוואטסאפ/">דיוור בוואטסאפ</Link>
              <Link href="/קמפיינים-בוואטסאפ/">קמפיינים בוואטסאפ</Link>
              <Link href="/אוטומציה-בוואטסאפ/">אוטומציה בוואטסאפ</Link>
              <Link href="/זימון-תורים-וואטסאפ/">זימון תורים</Link>
            </div>
          </div>
          <div className={styles.seoLinksGroup}>
            <span className={styles.seoLinksTitle}>מערכת ו-CRM</span>
            <div className={styles.seoLinksRow}>
              <Link href="/וואטסאפ-crm/">WhatsApp CRM</Link>
              <Link href="/crm-לעסקים/">CRM לעסקים</Link>
              <Link href="/מערכת-וואטסאפ-לעסקים/">מערכת וואטסאפ לעסקים</Link>
              <Link href="/מערכת-שיווק-בוואטסאפ/">מערכת שיווק</Link>
              <Link href="/וואטסאפ-עסקי/">וואטסאפ עסקי</Link>
              <Link href="/הצעות-מחיר/">הצעות מחיר</Link>
              <Link href="/חתימה-דיגיטלית/">חתימה דיגיטלית</Link>
            </div>
          </div>
          <div className={styles.seoLinksGroup}>
            <span className={styles.seoLinksTitle}>מחירים ומידע</span>
            <div className={styles.seoLinksRow}>
              <Link href="/PriceList/">מחירון</Link>
              <Link href="/PriceList/OnboardingServices/">שירותי הטמעה</Link>
              <Link href="/whatsapp-api-pricing/">עלות הודעות WhatsApp</Link>
              <Link href="/blog/">בלוג</Link>
              <Link href="/guide/">מדריך למשתמש</Link>
            </div>
          </div>
          <div className={styles.seoLinksGroup}>
            <span className={styles.seoLinksTitle}>דפי קמפיין</span>
            <div className={styles.seoLinksRow}>
              <Link href="/קמפיין-בוט-וואטסאפ/">קמפיין בוט וואטסאפ</Link>
              <Link href="/קמפיין-בוט-ai-לעסקים/">קמפיין בוט AI</Link>
              <Link href="/crm-לעסקים/">CRM לעסקים</Link>
              <Link href="/מערכת-וואטסאפ-לעסקים/">מערכת וואטסאפ לעסקים</Link>
              <Link href="/שיווק-בוואטסאפ-לעסקים/">שיווק בוואטסאפ לעסקים</Link>
              <Link href="/סוגי-בוט-וואטסאפ/">סוגי בוטים לוואטסאפ</Link>
            </div>
          </div>
        </div>
      )}

      <div className={styles.bottom}>
        <div className={styles.social}>
          <a href="https://www.linkedin.com/company/gambot-platform" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61553659007668" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/gambot_il/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://www.youtube.com/channel/@Gambot-IL" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube />
          </a>
        </div>
        <p className={styles.copy}>
          {isEn
            ? <>2025 | Founded by: <Link href="/about/" style={{ color: 'inherit', textDecoration: 'underline' }}>Nir Segas</Link> | Developed by: Gambot Development Team | &copy; GamBot All Rights Reserved</>
            : <>2025 | הוקם על ידי: <Link href="/about/" style={{ color: 'inherit', textDecoration: 'underline' }}>ניר סגס</Link> | פותח ע&quot;י: צוות פיתוח גמבוט | &copy; GamBot כל הזכויות שמורות</>}
        </p>
      </div>
    </footer>
  );
}

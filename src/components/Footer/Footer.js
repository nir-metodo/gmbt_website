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

  if (pathname?.startsWith('/complete-waba')) return null;

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
            ? '2025 | Developed by: Gambot Development Team | © GamBot All Rights Reserved'
            : '2025 | פותח ע"י: צוות פיתוח גמבוט | © GamBot כל הזכויות שמורות'}
        </p>
      </div>
    </footer>
  );
}

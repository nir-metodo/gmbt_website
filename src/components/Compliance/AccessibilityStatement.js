'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Compliance.module.css';

// NOTE for the site owner: keep this page truthful. Update LAST_UPDATED after every accessibility
// review, and make sure the coordinator details below are the real, answered contact.
const LAST_UPDATED = '22.10.2026';
const COORDINATOR = { nameHe: 'ניר סגס', nameEn: 'Nir Segas', phone: '055-985-9052', email: 'info@gambot.co.il' };

export default function AccessibilityStatement() {
  const { currentLanguage } = useLanguage();
  const he = currentLanguage !== 'en';

  if (he) {
    return (
      <article className={styles.statement} dir="rtl" lang="he">
        <h1>הצהרת נגישות</h1>
        <p className={styles.updated}>עודכן לאחרונה: {LAST_UPDATED}</p>

        <p>
          גמבוט רואה חשיבות עליונה במתן שירות שוויוני ונגיש לכלל המשתמשים, לרבות אנשים עם מוגבלות, ופועלת להנגשת אתר האינטרנט
          gambot.co.il בהתאם לתקן הישראלי ת״י 5568 (המבוסס על WCAG 2.1 ברמה AA) ולתקנות שוויון זכויות לאנשים עם מוגבלות
          (התאמות נגישות לשירות), התשע״ג-2013.
        </p>

        <h2>התאמות שבוצעו באתר</h2>
        <ul>
          <li>קישור &quot;דלג לתוכן הראשי&quot; בראש כל עמוד, וניווט מלא במקלדת בלבד.</li>
          <li>מחוון פוקוס ברור לכל רכיב אינטראקטיבי.</li>
          <li>תפריט נגישות הכולל הגדלה והקטנת טקסט, ניגודיות גבוהה, גווני אפור, הדגשת קישורים, גופן קריא, ריווח טקסט, סמן גדול ועצירת אנימציות.</li>
          <li>התאמה להעדפת המשתמש להפחתת תנועה (prefers-reduced-motion).</li>
          <li>תמיכה בעברית (RTL) ובאנגלית, עם הגדרת שפה וכיוון לכל עמוד.</li>
          <li>תוויות נגישות (ARIA) לתפריטים, חלוניות, כפתורים וטפסים; הודעות שגיאה והצלחה מוקראות לקוראי מסך.</li>
          <li>ווידג׳ט הצ׳אט בוואטסאפ נגיש למקלדת ולקורא מסך, ומתאים אוטומטית את הניגודיות בין טקסט לרקע.</li>
        </ul>

        <h2>מגבלות ידועות</h2>
        <p>
          אנו ממשיכים לשפר את הנגישות. ייתכן שחלקים מהאתר — בעיקר תכנים ישנים בבלוג ובמדריכים, אזורי המערכת המקוונת (Gambot App),
          מסמכי PDF ותכנים של צדדים שלישיים (כגון סרטוני וידאו מוטמעים) — טרם הונגשו במלואם. אם נתקלת בקושי, נשמח לסייע ולהנגיש בהקדם.
        </p>

        <h2>פניות בנושא נגישות</h2>
        <p>
          נתקלת בבעיית נגישות או זקוק/ה לתוכן בפורמט נגיש? פנו אלינו ונטפל בפנייה בהקדם:
        </p>
        <ul>
          <li>רכז/ת נגישות: {COORDINATOR.nameHe}</li>
          <li>טלפון: <a href={`tel:${COORDINATOR.phone.replace(/-/g, '')}`}>{COORDINATOR.phone}</a></li>
          <li>דוא״ל: <a href={`mailto:${COORDINATOR.email}`}>{COORDINATOR.email}</a></li>
          <li>וואטסאפ: <a href="https://wa.me/97233768997" target="_blank" rel="noopener noreferrer">צ׳אט בוואטסאפ (נפתח בחלון חדש)</a></li>
        </ul>
        <p>בפנייה נבקש לציין את כתובת העמוד, תיאור הבעיה, והטכנולוגיה המסייעת בה נעשה שימוש (אם יש), כדי שנוכל לטפל בצורה יעילה.</p>
      </article>
    );
  }

  return (
    <article className={styles.statement} dir="ltr" lang="en">
      <h1>Accessibility Statement</h1>
      <p className={styles.updated}>Last updated: {LAST_UPDATED}</p>

      <p>
        Gambot is committed to providing an equal, accessible experience to everyone, including people with disabilities. We are working to make
        gambot.co.il conform to Israeli Standard 5568 (based on WCAG 2.1 Level AA) and the Israeli Equal Rights for Persons with Disabilities
        (Service Accessibility Adjustments) Regulations, 2013.
      </p>

      <h2>What we have done</h2>
      <ul>
        <li>A &quot;Skip to main content&quot; link on every page and full keyboard-only navigation.</li>
        <li>Clearly visible focus indicators on every interactive element.</li>
        <li>An accessibility menu: text size, high contrast, grayscale, link highlighting, readable font, text spacing, large cursor and stop-animations.</li>
        <li>Support for the visitor&apos;s reduced-motion preference.</li>
        <li>Hebrew (RTL) and English, with language and direction set on every page.</li>
        <li>ARIA labels for menus, dialogs, buttons and forms; form errors and confirmations are announced to screen readers.</li>
        <li>The WhatsApp chat widget is keyboard- and screen-reader-accessible and auto-corrects text/background contrast.</li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        We keep improving. Some parts of the site — mainly older blog and guide content, the online application (Gambot App), PDF documents and
        third-party content such as embedded videos — may not yet be fully accessible. If you hit a barrier, please tell us and we will fix it as soon as we can.
      </p>

      <h2>Contact our accessibility coordinator</h2>
      <ul>
        <li>Coordinator: {COORDINATOR.nameEn}</li>
        <li>Phone: <a href={`tel:${COORDINATOR.phone.replace(/-/g, '')}`}>{COORDINATOR.phone}</a></li>
        <li>Email: <a href={`mailto:${COORDINATOR.email}`}>{COORDINATOR.email}</a></li>
        <li>WhatsApp: <a href="https://wa.me/97233768997" target="_blank" rel="noopener noreferrer">Chat on WhatsApp (opens in a new window)</a></li>
      </ul>
      <p>Please include the page address, a description of the problem and the assistive technology you use, so we can respond efficiently.</p>
    </article>
  );
}

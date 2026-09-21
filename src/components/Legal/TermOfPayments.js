'use client';

import './TermOfPayments.css';
import { useLanguage } from '@/contexts/LanguageContext';

const CONTENT = {
    he: {
        title: 'תנאי תשלום',
        subscriptionHeading: 'תשלום עבור מסלול מנוי:',
        subscription: (
            <>
                הארגון המשתמש בגמבוט כמערכת לניהול וואטסאפ מתחייב לשלם עבור השימוש במערכת בהתאם למסלול המנוי שבחר בעת ההרשמה.
                התשלום יגבה באופן קבוע <strong>חודשי</strong> או <strong>שנתי</strong>, בהתאם לבחירת המשתמש.
                המשתמש יכול לשנות את המסלול בכל עת, בהתאם לזמינות ולתעריפים החלים.
                כל שינוי במסלול יתבצע על פי התנאים המעודכנים, והמשתמש יקבל עדכון בנוגע לתשלום או להטבות תחת המסלול החדש.
            </>
        ),
        addOnsHeading: 'תשלום עבור שירותים נוספים (Add-ons):',
        addOns: (
            <>
                המשתמש מסכים כי יחויב בתשלום אוטומטי עבור שירותים או שימושים נוספים מחוץ למסלול הנבחר,
                במידה והוא עבר את המגבלה הכלולה במסלול שבחר. לדוגמה, אם החבילה הבסיסית כוללת <strong>1000 שיחות</strong>,
                כל שימוש נוסף מעבר לכך יחויב בתוספת תשלום בהתאם לתעריף הנוכחי המוצג במערכת.
                המשתמש אחראי לעקוב ולוודא אם הוא עדיין במסגרת המסלול שבחר, ואם עבר את המגבלה, הוא יחויב אוטומטית על השירותים הנוספים.
                המשתמש יכול לבחור להוסיף שירותים נוספים כגון שיחות נוספות, העברת נתונים ושירותים ייחודיים נוספים,
                אשר יחויבו על פי התעריפים הקיימים.
            </>
        ),
        addOnsListLabel: 'התוספים הנפוצים ביותר:',
        addOnsList: ['שיחות נוספות', 'תשובות Gambot AI', 'משתמשים נוספים'],
        metaHeading: 'תשלום למטא עבור הודעות:',
        meta1: 'המשתמש מאשר שהוא מודע לכך שעבור הודעות / שיחות המבוצעות מסוג חשבון וואטסאפ זה, מטא / פייסבוק גובות תשלום נוסף. התשלום מבוצע ישירות לחשבון של מטא / פייסבוק דרך אמצעי התשלום המוגדר באיזור הניהול העסקי של המשתמש במטא / פייסבוק ובמטבע שנבחר. המשתמש מאשר שהוא מבין שאין לגמבוט קשר לתשלום אך על מנת שהדברים יעבדו כשורה בגמבוט חייב להיות אמצעי תשלום תקין באיזור הניהול העסקי של מטא / פייסבוק של הארגון אותו משייכים לגמבוט.',
        metaLinkPrefix: 'למידע נוסף על תעריפי ההודעות של מטא ופרטים נוספים אודות השירותים המוצעים, ניתן לעיין בהסבר של מטא',
        metaLinkText: 'WhatsApp Business API Pricing - Meta',
        clearingHeading: 'שירותי סליקה של צד שלישי:',
        clearing: (
            <>
                התשלומים מנוהלים דרך ספק סליקה חיצוני אשר אחראי על שמירת פרטי כרטיסי האשראי.
                <strong> אנו לא שומרים את פרטי כרטיסי האשראי</strong>. כל פרטי האשראי המתקבלים בעת ההרשמה או עדכון פרטי תשלום נשמרים רק אצל ספק הסליקה.
                אנו מעבירים את פרטי התשלום לספק לצורך עיבוד התשלומים החודשיים, כולל הצטרפות מנויים חדשים, עדכונים וביטולים.
                ספק הסליקה אחראי על כל היבטי החיוב החודשי, כולל טיפול בשגיאות חיוב ובעיות הקשורות לכרטיסי אשראי.
            </>
        ),
        invoicesHeading: 'חשבוניות:',
        invoices: 'חשבונית עבור כל חיוב תישלח אוטומטית אחת לחודש למייל שהוזן בעת ההרשמה או למייל המעודכן באזור הניהול. המשתמש מסכים לקבל את החשבונית באופן אלקטרוני ומוודא שכתובת המייל שלו נכונה ומעודכנת. בחשבונית זו יצויין מספר תיק ברשויות המסים בישראל של ניר סגס מפתח ובעל התוכנה',
        vatHeading: 'מע"מ:',
        vat: 'המחירים המוצגים באתר אינם כוללים מע"מ. המע"מ יתווסף למחיר בהתאם לשיעור המע"מ הנכון ביום החיוב בישראל.',
        cancelHeading: 'ביטול מנוי ותנאי ביטול:',
        cancelHowLabel: 'איך מבטלים מנוי:',
        cancelHow: (
            <>
                ניתן לבטל את המנוי בכל עת על ידי שליחת בקשת ביטול במייל לכתובת: <a href="mailto:info@gambot.co.il">info@gambot.co.il</a>
                <br />
                יש לציין במייל את שם הארגון ופרטי ההתקשרות.
            </>
        ),
        monthlyLabel: 'מנוי חודשי:',
        monthly: 'ביטול מנוי חודשי ייכנס לתוקף בתום תקופת החיוב הנוכחית. לאחר קבלת הודעת הביטול, המשתמש ימשיך ליהנות מהשירות עד תום החודש המשולם, ולאחר מכן החשבון יבוטל ולא יבוצע חיוב נוסף.',
        monthlyExample: 'לדוגמה: אם ביטלת ב-15 לחודש והחיוב הבא אמור להיות ב-1 לחודש הבא, תמשיך להשתמש במערכת עד ה-1 לחודש הבא וזה החיוב האחרון.',
        yearlyLabel: 'מנוי שנתי:',
        yearly: (
            <>
                ביטול מנוי שנתי ייכנס לתוקף בתום תקופת השנה המשולמת.
                <strong> לא יינתן החזר כספי</strong> עבור החודשים שטרם נוצלו במסגרת התקופה השנתית.
                המשתמש ימשיך ליהנות מהשירות עד תום התקופה ששולמה, ולאחר מכן החשבון יבוטל.
            </>
        ),
        yearlyExample: 'לדוגמה: אם שילמת לשנה ב-1.1.2025 וביטלת ב-1.6.2025, תמשיך להשתמש במערכת עד 1.1.2026 ללא חיובים נוספים.',
        afterCancelLabel: 'לאחר הביטול:',
        afterCancel: 'בתום תקופת המנוי המשולמת, תיחסם הגישה לחשבון ונתוני החשבון יישמרו למשך 30 יום נוספים. לאחר 30 יום, כל המידע והנתונים הקשורים לחשבון עלולים להימחק ולא יהיו נגישים יותר. מומלץ לגבות את הנתונים החשובים לפני סיום המנוי.',
        nonPaymentHeading: 'היעדר תשלום:',
        nonPayment: 'היה וחלפו 3 נסיונות תשלום כושלים - ניסיון אחד בכל חודש , ייחסם החשבון ונתוני הארגון ייאבדו ומאותו רגע אנו רואים בחשבון זה בטל ומבוטל זאת כנ"ל לגבי הסים במידה ונרכש מאיתנו. היה ומבסגרת ה-3 חודשים חיובים כושלים שלאחר מכן צלחו , יחוייב החשבון במעמד החיוב המצליח כמספר הפעמים שכשלו כולל החודש הנוכחי על מנת ליישר קו ולסגור את החשבון הפתוח',
    },
    en: {
        title: 'Terms of Payment',
        subscriptionHeading: 'Subscription Plan Payment:',
        subscription: (
            <>
                Organizations using Gambot as their WhatsApp management platform agree to pay for use of the system according to the subscription plan chosen at sign-up.
                Payment is charged on a recurring <strong>monthly</strong> or <strong>annual</strong> basis, based on the user&apos;s selection.
                You may change your plan at any time, subject to availability and the applicable rates.
                Any plan change takes effect under the updated terms, and you will be notified regarding the payment or benefits under the new plan.
            </>
        ),
        addOnsHeading: 'Payment for Additional Services (Add-ons):',
        addOns: (
            <>
                You agree to be automatically charged for services or usage beyond your selected plan whenever you exceed the limit included in that plan.
                For example, if the basic package includes <strong>1,000 conversations</strong>, any usage beyond that is charged at an additional fee according to the current rate shown in the system.
                You are responsible for monitoring whether you are still within your chosen plan; if you exceed the limit, you will be charged automatically for the additional services.
                You may also choose to add extra services such as additional conversations, data transfer, and other specialized services, which are charged at the prevailing rates.
            </>
        ),
        addOnsListLabel: 'The most common add-ons:',
        addOnsList: ['Additional conversations', 'Gambot AI responses', 'Additional users'],
        metaHeading: 'Payment to Meta for Messages:',
        meta1: 'You acknowledge that for messages / conversations sent from this type of WhatsApp account, Meta / Facebook charge an additional fee. This payment is made directly to your Meta / Facebook account via the payment method configured in your Meta / Facebook Business Manager, in the selected currency. You understand that Gambot is not involved in this payment; however, for everything to work correctly in Gambot, a valid payment method must be in place in the Meta / Facebook Business Manager of the organization linked to Gambot.',
        metaLinkPrefix: "For more information about Meta's messaging rates and further details about the services offered, see Meta's explanation:",
        metaLinkText: 'WhatsApp Business API Pricing - Meta',
        clearingHeading: 'Third-Party Payment Processing:',
        clearing: (
            <>
                Payments are handled through an external payment processor that is responsible for storing credit card details.
                <strong> We do not store credit card details</strong>. All credit card information provided at sign-up or when updating payment details is stored only with the payment processor.
                We transmit the payment details to the processor for the purpose of processing monthly payments, including new subscriptions, updates, and cancellations.
                The payment processor is responsible for all aspects of monthly billing, including handling billing errors and credit card-related issues.
            </>
        ),
        invoicesHeading: 'Invoices:',
        invoices: 'An invoice for each charge is sent automatically once a month to the email entered at sign-up or to the email updated in the management area. You agree to receive the invoice electronically and confirm that your email address is correct and up to date. This invoice will list the Israeli Tax Authority file number of Nir Segas, the developer and owner of the software.',
        vatHeading: 'VAT:',
        vat: 'Prices shown on the website do not include VAT. VAT will be added to the price according to the VAT rate in effect in Israel on the day of the charge.',
        cancelHeading: 'Subscription Cancellation & Cancellation Terms:',
        cancelHowLabel: 'How to cancel a subscription:',
        cancelHow: (
            <>
                You may cancel your subscription at any time by sending a cancellation request by email to: <a href="mailto:info@gambot.co.il">info@gambot.co.il</a>
                <br />
                Please include your organization name and contact details in the email.
            </>
        ),
        monthlyLabel: 'Monthly subscription:',
        monthly: 'Cancellation of a monthly subscription takes effect at the end of the current billing period. After we receive the cancellation notice, you will continue to enjoy the service until the end of the paid month, after which the account will be cancelled and no further charge will be made.',
        monthlyExample: 'Example: if you cancel on the 15th of the month and the next charge is due on the 1st of the following month, you will keep using the system until the 1st of the following month, and that will be the final charge.',
        yearlyLabel: 'Annual subscription:',
        yearly: (
            <>
                Cancellation of an annual subscription takes effect at the end of the paid year.
                <strong> No refund will be given</strong> for months not yet used within the annual period.
                You will continue to enjoy the service until the end of the paid period, after which the account will be cancelled.
            </>
        ),
        yearlyExample: 'Example: if you paid for a year on 1/1/2025 and cancelled on 1/6/2025, you will keep using the system until 1/1/2026 with no additional charges.',
        afterCancelLabel: 'After cancellation:',
        afterCancel: 'At the end of the paid subscription period, access to the account will be blocked and the account data will be retained for an additional 30 days. After 30 days, all information and data related to the account may be deleted and will no longer be accessible. We recommend backing up important data before your subscription ends.',
        nonPaymentHeading: 'Non-Payment:',
        nonPayment: 'If 3 payment attempts fail - one attempt per month - the account will be blocked and the organization\'s data will be lost, and from that point we consider the account null and void; the same applies to a SIM, if one was purchased from us. If, within those 3 months of failed charges, a later charge succeeds, the account will be charged at the moment of the successful charge for the number of times it failed, including the current month, in order to settle the balance and close the open account.',
    },
};

const TermOfPayments = () => {
    const { currentLanguage } = useLanguage();
    const isHe = currentLanguage !== 'en';
    const c = isHe ? CONTENT.he : CONTENT.en;

    return (
        <div className={`terms-of-payments${isHe ? '' : ' ltr'}`} dir={isHe ? 'rtl' : 'ltr'}>
            <h1>{c.title}</h1>

            <h2>{c.subscriptionHeading}</h2>
            <p>{c.subscription}</p>

            <h2>{c.addOnsHeading}</h2>
            <p>
                {c.addOns}

                {c.addOnsListLabel}
                <ul className="term-of-payment-add-on-rtl-list">
                    {c.addOnsList.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </p>

            <h2>{c.metaHeading}</h2>
            <p>{c.meta1}</p>
            <p>
                {c.metaLinkPrefix}{' '}
                <a href="https://business.whatsapp.com/products/platform-pricing" target="_blank" rel="noopener noreferrer" className="link-meta">
                    {c.metaLinkText}
                </a>
            </p>

            <h2>{c.clearingHeading}</h2>
            <p>{c.clearing}</p>

            <h2>{c.invoicesHeading}</h2>
            <p>{c.invoices}</p>

            <h2>{c.vatHeading}</h2>
            <p>{c.vat}</p>

            <h2>{c.cancelHeading}</h2>
            <p>
                <strong>{c.cancelHowLabel}</strong><br />
                {c.cancelHow}
            </p>

            <p>
                <strong>{c.monthlyLabel}</strong><br />
                {c.monthly}
                <br />
                <em>{c.monthlyExample}</em>
            </p>

            <p>
                <strong>{c.yearlyLabel}</strong><br />
                {c.yearly}
                <br />
                <em>{c.yearlyExample}</em>
            </p>

            <p>
                <strong>{c.afterCancelLabel}</strong><br />
                {c.afterCancel}
            </p>

            <h2>{c.nonPaymentHeading}</h2>
            <p>{c.nonPayment}</p>
        </div>
    );
}

export default TermOfPayments;

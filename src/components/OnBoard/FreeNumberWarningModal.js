import React from 'react';
import './FreeNumberWarningModal.css';
import { FaExclamationTriangle, FaTimes, FaBan, FaLock, FaChartLine, FaClock, FaGlobeAmericas } from 'react-icons/fa';
import { MdWarning } from 'react-icons/md';
import { useLanguage } from '@/contexts/LanguageContext';

const FreeNumberWarningModal = ({ isOpen, onClose, onConfirm }) => {
    const { t, currentLanguage, isRTL } = useLanguage();

    if (!isOpen) return null;

    const getText = (key, fallbackHe, fallbackEn) => {
        const translation = t(key);
        if (translation === key) {
            return currentLanguage === 'he' ? fallbackHe : fallbackEn;
        }
        return translation;
    };

    return (
        <div className="free-number-modal-overlay" onClick={onClose}>
            <div 
                className={`free-number-modal-content ${isRTL ? 'rtl' : 'ltr'}`}
                onClick={(e) => e.stopPropagation()}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Close Button */}
                <button className="free-number-modal-close" onClick={onClose}>
                    <FaTimes />
                </button>

                {/* Header */}
                <div className="free-number-modal-header">
                    <FaExclamationTriangle className="fnw-warning-icon-large" />
                    <h2>{getText('freeNumberModal.title', '⚠️ מספר בדיקות בלבד - לא לשימוש ארוך!', '⚠️ Test Number Only - Not for Long-Term Use!')}</h2>
                    <p className="fnw-modal-subtitle">
                        {getText('freeNumberModal.subtitle', 'מספר +1 555 חינם מ-Meta הוא לבדיקות בלבד ובעל מגבלות חמורות', 'Meta\'s free +1 555 number is for testing only with severe limitations')}
                    </p>
                </div>

                {/* Limitations */}
                <div className="free-number-modal-limitations">
                    <div className="fnw-limitation-item critical">
                        <FaBan className="fnw-limitation-icon" />
                        <div>
                            <h4>{getText('freeNumberModal.limitation1.title', '❌ ללא פרסום ב-Facebook/Instagram', '❌ No Facebook/Instagram Ads')}</h4>
                            <p>{getText('freeNumberModal.limitation1.description', 'לא ניתן להשתמש ב-Click-to-WhatsApp ads - אין אפשרות לשיווק דרך פרסומות', 'Cannot use Click-to-WhatsApp ads - No marketing via paid ads')}</p>
                        </div>
                    </div>

                    <div className="fnw-limitation-item critical">
                        <FaLock className="fnw-limitation-icon" />
                        <div>
                            <h4>{getText('freeNumberModal.limitation2.title', '❌ לא ניתן להעברה לעולם', '❌ Cannot Migrate EVER')}</h4>
                            <p>{getText('freeNumberModal.limitation2.description', 'נעול לצמיתות לחשבון - אי אפשר לעבור לספק אחר או לחשבון אחר', 'Permanently locked - Cannot switch providers or accounts')}</p>
                        </div>
                    </div>

                    <div className="fnw-limitation-item warning">
                        <FaClock className="fnw-limitation-icon" />
                        <div>
                            <h4>{getText('freeNumberModal.limitation3.title', '⚠️ אישור שם תצוגה עשוי להידחות', '⚠️ Display Name May Be Rejected')}</h4>
                            <p>{getText('freeNumberModal.limitation3.description', 'עסקים לא מאומתים עלולים לא לקבל אישור - לא ניתן לשלוח הודעות בלי זה', 'Unverified businesses may never get approved - Cannot send messages without it')}</p>
                        </div>
                    </div>

                    <div className="fnw-limitation-item warning">
                        <FaChartLine className="fnw-limitation-icon" />
                        <div>
                            <h4>{getText('freeNumberModal.limitation4.title', '⚠️ מגבלות הודעות חמורות', '⚠️ Severe Messaging Limits')}</h4>
                            <p>{getText('freeNumberModal.limitation4.description', 'לא מיועד לנפח גבוה או שימוש תפעולי', 'Not designed for high volume or production use')}</p>
                        </div>
                    </div>

                    <div className="fnw-limitation-item warning">
                        <FaGlobeAmericas className="fnw-limitation-icon" />
                        <div>
                            <h4>{getText('freeNumberModal.limitation5.title', '⚠️ מספר אמריקאי +1 555 בלבד', '⚠️ US +1 555 Number Only')}</h4>
                            <p>{getText('freeNumberModal.limitation5.description', 'לקוחות עלולים לחשוב שזה ספאם - לא מקצועי', 'Customers may think it\'s spam - Not professional')}</p>
                        </div>
                    </div>
                </div>

                {/* Scenario */}
                <div className="free-number-modal-scenario">
                    <MdWarning className="fnw-scenario-icon" />
                    <div className="fnw-scenario-content">
                        <h3>{getText('freeNumberModal.scenario.title', '🚨 תרחיש אמיתי', '🚨 Real-World Scenario')}</h3>
                        <p>{getText('freeNumberModal.scenario.description', 
                            'רוצה לפרסם ב-Facebook? ❌ לא אפשרי. רוצה להחליף ספק? ❌ לא אפשרי. צמחת ורוצה מספר מקומי? ❌ צריך להתחיל מאפס ולאבד את כל השיחות והלקוחות.',
                            'Want to advertise on Facebook? ❌ Not possible. Want to switch providers? ❌ Not possible. Grew and need local number? ❌ Must start over and lose all conversations and customers.'
                        )}</p>
                    </div>
                </div>

                {/* Recommendation */}
                <div className="free-number-modal-recommendation">
                    <h3>{getText('freeNumberModal.recommendation.title', '💡 מומלץ לשימוש תפעולי', '💡 Recommended for Production')}</h3>
                    <div className="fnw-recommendation-options">
                        <div className="fnw-recommendation-option">
                            <strong>{getText('freeNumberModal.recommendation.option1', '✅ SIM משלך', '✅ Own SIM')}</strong>
                            <span>{getText('freeNumberModal.recommendation.option1Description', 'מספר קיים, פונקציונליות מלאה', 'Existing number, full functionality')}</span>
                        </div>
                        <div className="fnw-recommendation-option">
                            <strong>{getText('freeNumberModal.recommendation.option2', '✅ רכישת מספר חדש', '✅ Purchase New Number')}</strong>
                            <span>{getText('freeNumberModal.recommendation.option2Description', 'ניהול על ידי Gambot, מספר ייעודי', 'Managed by Gambot, dedicated number')}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="free-number-modal-actions">
                    <button className="fnw-modal-btn-cancel" onClick={onClose}>
                        {getText('freeNumberModal.buttons.cancel', '❌ ביטול - בחר אפשרות אחרת', '❌ Cancel - Choose Another Option')}
                    </button>
                    <button className="fnw-modal-btn-confirm" onClick={onConfirm}>
                        {getText('freeNumberModal.buttons.confirm', '⚠️ הבנתי - המשך למספר בדיקות', '⚠️ I Understand - Continue with Test Number')}
                    </button>
                </div>

                {/* Footer Warning */}
                <div className="free-number-modal-footer">
                    <small>
                        {getText('freeNumberModal.footer', 
                            '⚠️ מספר זה לבדיקות בלבד ולא מומלץ לשימוש עם לקוחות אמיתיים',
                            '⚠️ This number is for testing only and not recommended for use with real customers'
                        )}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default FreeNumberWarningModal;

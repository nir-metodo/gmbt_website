import React from 'react';
import './ExistingSimWarningModal.css';
import { FaExclamationTriangle, FaTimes, FaWhatsapp, FaInfoCircle } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

const ExistingSimWarningModal = ({ isOpen, onClose, onConfirm }) => {
    const { t, currentLanguage } = useLanguage();

    if (!isOpen) return null;

    const getText = (key, fallbackHe, fallbackEn) => {
        const translation = t(key);
        if (translation === key) {
            return currentLanguage === 'he' ? fallbackHe : fallbackEn;
        }
        return translation;
    };

    return (
        <div className="existing-sim-modal-overlay" onClick={onClose}>
            <div 
                className={`existing-sim-modal-content ${currentLanguage === 'he' ? 'rtl' : 'ltr'}`}
                onClick={(e) => e.stopPropagation()}
                dir={currentLanguage === 'he' ? 'rtl' : 'ltr'}
            >
                <button className="existing-sim-modal-close" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="existing-sim-modal-header">
                    <FaExclamationTriangle className="esw-warning-icon" />
                    <h2>
                        {getText('existingSimWarning.title', 
                            'חשוב! לפני שממשיכים', 
                            'Important! Before You Continue')}
                    </h2>
                </div>

                <div className="existing-sim-modal-body">
                    <div className="esw-warning-section critical">
                        <h3>
                            <FaInfoCircle />
                            {getText('existingSimWarning.section1.title',
                                'דרישות למספר הטלפון:',
                                'Phone Number Requirements:')}
                        </h3>
                        <p>
                            {getText('existingSimWarning.section1.text',
                                'המספר טלפון חייב שלא יהיה לו חשבון וואטסאפ קיים!',
                                'The phone number must NOT have an existing WhatsApp account!')}
                        </p>
                    </div>

                    <div className="esw-warning-section">
                        <h3>
                            <FaInfoCircle />
                            {getText('existingSimWarning.section2.title',
                                'אם זה המספר הפרטי שלכם:',
                                'If This Is Your Personal Number:')}
                        </h3>
                        <p>
                            {getText('existingSimWarning.section2.text',
                                'אם זה מספר הוואטסאפ הפרטי שלכם - הוא כנראה לא מתאים לשימוש במערכת.',
                                'If this is your personal WhatsApp number - it is probably not suitable for use in the system.')}
                        </p>
                    </div>

                    <div className="esw-warning-section">
                        <h3>
                            <FaInfoCircle />
                            {getText('existingSimWarning.section3.title',
                                'אם יש לכם וואטסאפ עסקי קיים:',
                                'If You Have Existing WhatsApp Business:')}
                        </h3>
                        <p>
                            {getText('existingSimWarning.section3.text',
                                'אם זה מספר וואטסאפ עסקי שלכם כיום ואתם רוצים לשדרג לוואטסאפ API - צריך לנתק את החשבון הקיים קודם. רק אז אפשר יהיה לחבר למערכת.',
                                'If this is your current WhatsApp Business number and you want to upgrade to WhatsApp API - you need to disconnect the existing account first. Only then will you be able to connect to the system.')}
                        </p>
                    </div>

                    <div className="esw-warning-section info">
                        <h3>
                            <FaWhatsapp />
                            {getText('existingSimWarning.section4.title',
                                'מה עם ההיסטוריה (רטרו)?',
                                'What About History (Retro)?')}
                        </h3>
                        <p>
                            {getText('existingSimWarning.section4.text',
                                'יש לנו אפשרות לטעון את הנתונים מהחשבון הקודם, אך זה לא מובטח ב-100% ותלוי בסוג הטלפון.',
                                'We have the option to load data from your previous account, but it is not 100% guaranteed and depends on the phone type.')}
                        </p>
                        <div className="esw-contact-box">
                            <p>
                                {getText('existingSimWarning.section4.contact',
                                    'מוזמנים ליצור איתנו קשר בוואטסאפ ונבדוק יחד:',
                                    'Feel free to contact us on WhatsApp and we will check together:')}
                            </p>
                            <a 
                                href="https://wa.me/972033768997" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="esw-whatsapp-contact-btn"
                            >
                                <FaWhatsapp />
                                <span>03-376-8997</span>
                            </a>
                            <p className="esw-small-text">
                                {getText('existingSimWarning.section4.note',
                                    '* טעינת נתונים רטרו היא בתשלום נוסף',
                                    '* Retro data loading is for an additional fee')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="existing-sim-modal-footer">
                    <button className="esw-btn-secondary" onClick={onClose}>
                        {getText('existingSimWarning.buttons.back', 'חזור', 'Go Back')}
                    </button>
                    <button className="esw-btn-primary" onClick={onConfirm}>
                        {getText('existingSimWarning.buttons.understand', 
                            'הבנתי, אני ממשיך/ה', 
                            'I Understand, Continue')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExistingSimWarningModal;

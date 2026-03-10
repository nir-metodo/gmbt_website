import React, { useState, useEffect } from 'react';
import './TutorialVideoButton.css';
import { FaPlay, FaTimes, FaYoutube, FaWhatsapp, FaExchangeAlt } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

const TutorialVideoButton = ({ step }) => {
    const { t, currentLanguage, isRTL } = useLanguage();
    const [showModal, setShowModal] = useState(false);
    const [selectedVideoType, setSelectedVideoType] = useState(null); // 'api' | 'coexistence' | null

    // ✅ Scroll to top when modal opens (modal starts from top with padding)
    useEffect(() => {
        if (showModal) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [showModal]);

    // Video URLs
    const videos = {
        apiOnboarding: 'https://www.youtube.com/embed/6y8A61Z7Zv4',
        coexistenceOnboarding: 'https://www.youtube.com/embed/mBBmoxCRRmI',
        metaVerification: 'https://www.youtube.com/embed/bFRGFoelYjA?start=9'
    };

    const getText = (key, fallbackHe, fallbackEn) => {
        const translation = t(key);
        if (translation === key) {
            return currentLanguage === 'he' ? fallbackHe : fallbackEn;
        }
        return translation;
    };

    const getVideoTitle = () => {
        if (step > 4) {
            return getText('tutorial.setup.title', '📹 הדרכה: השלמת ההתקנה', '📹 Tutorial: Complete Setup');
        }
        if (selectedVideoType === 'api') {
            return getText('tutorial.onboarding.api.title', '📹 חלק 1: יצירת חשבון WhatsApp API', '📹 Part 1: Create WhatsApp API Account');
        }
        if (selectedVideoType === 'coexistence') {
            return getText('tutorial.onboarding.coex.title', '📹 חלק 1: יצירת חשבון Coexistence', '📹 Part 1: Create Coexistence Account');
        }
        return getText('tutorial.onboarding.title', '📹 הדרכה: תהליך ההרשמה', '📹 Tutorial: Onboarding Process');
    };

    const getVideoUrl = () => {
        if (step > 4) return videos.metaVerification;
        if (selectedVideoType === 'api') return videos.apiOnboarding;
        if (selectedVideoType === 'coexistence') return videos.coexistenceOnboarding;
        return videos.apiOnboarding;
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedVideoType(null);
    };

    const handleBackToSelection = () => {
        setSelectedVideoType(null);
    };

    // For step > 4, show the setup/meta verification video directly
    const showVideoSelection = step <= 4 && selectedVideoType === null;

    return (
        <>
            <button 
                type="button"
                className="tutorial-video-btn" 
                onClick={(e) => {
                    e.preventDefault();
                    setShowModal(true);
                }}
                title={getText('tutorial.button', 'צפה בהדרכה', 'Watch Tutorial')}
            >
                <FaYoutube className="tvb-tutorial-icon" />
                <span>{getText('tutorial.button', 'צפה בהדרכה', 'Watch Tutorial')}</span>
            </button>

            {showModal && (
                <div className="tutorial-video-modal-overlay" onClick={handleCloseModal}>
                    <div 
                        className={`tutorial-video-modal-content ${isRTL ? 'rtl' : 'ltr'}`}
                        onClick={(e) => e.stopPropagation()}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        <button 
                            type="button"
                            className="tvb-tutorial-modal-close" 
                            onClick={(e) => {
                                e.preventDefault();
                                handleCloseModal();
                            }}
                        >
                            <FaTimes />
                        </button>

                        {/* ===== VIDEO TYPE SELECTION (for step <= 4) ===== */}
                        {showVideoSelection ? (
                            <div className="tvb-video-selection">
                                <div className="tvb-tutorial-modal-header">
                                    <FaPlay className="tvb-play-icon" />
                                    <h3>{getText('tutorial.select.title', '📹 הדרכה: תהליך ההרשמה', '📹 Tutorial: Onboarding Process')}</h3>
                                </div>
                                
                                <p className="tvb-selection-subtitle">
                                    {getText('tutorial.select.subtitle', 
                                        'בחרו את סוג החשבון שאתם רוצים ליצור:',
                                        'Choose the type of account you want to create:')}
                                </p>

                                <div className="tvb-account-options">
                                    {/* API Account Option */}
                                    <button 
                                        type="button"
                                        className="tvb-account-option tvb-account-option--api"
                                        onClick={() => setSelectedVideoType('api')}
                                    >
                                        <div className="tvb-option-icon">
                                            <FaWhatsapp />
                                        </div>
                                        <div className="tvb-option-content">
                                            <h4>{getText('tutorial.option.api.title', 'חשבון WhatsApp API', 'WhatsApp API Account')}</h4>
                                            <p>{getText('tutorial.option.api.desc', 
                                                'חשבון API חדש - מספר חדש לעסק',
                                                'New API account - New business number')}</p>
                                        </div>
                                        <FaPlay className="tvb-option-play" />
                                    </button>

                                    {/* Coexistence Account Option */}
                                    <button 
                                        type="button"
                                        className="tvb-account-option tvb-account-option--coex"
                                        onClick={() => setSelectedVideoType('coexistence')}
                                    >
                                        <div className="tvb-option-icon tvb-option-icon--coex">
                                            <FaExchangeAlt />
                                        </div>
                                        <div className="tvb-option-content">
                                            <h4>{getText('tutorial.option.coex.title', 'חשבון Coexistence', 'Coexistence Account')}</h4>
                                            <p>{getText('tutorial.option.coex.desc', 
                                                'שילוב WhatsApp Business App עם API - אותו מספר',
                                                'Combine WhatsApp Business App with API - Same number')}</p>
                                            <span className="tvb-option-badge">{getText('tutorial.option.coex.badge', '🆕 חדש!', '🆕 New!')}</span>
                                        </div>
                                        <FaPlay className="tvb-option-play" />
                                    </button>
                                </div>

                                {/* Meta Verification Note */}
                                <div className="tvb-meta-note">
                                    <p>
                                        {getText('tutorial.meta.note', 
                                            '💡 לאחר יצירת החשבון, יש לבצע הזדהות מול מטא (רלוונטי לשני סוגי החשבונות)',
                                            '💡 After creating the account, you need to verify with Meta (relevant for both account types)')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* ===== VIDEO PLAYER ===== */}
                                <div className="tvb-tutorial-modal-header">
                                    {step <= 4 && (
                                        <button 
                                            type="button"
                                            className="tvb-back-btn"
                                            onClick={handleBackToSelection}
                                        >
                                            {isRTL ? '→' : '←'} {getText('tutorial.back', 'חזרה', 'Back')}
                                        </button>
                                    )}
                                    <FaPlay className="tvb-play-icon" />
                                    <h3>{getVideoTitle()}</h3>
                                </div>

                                <div className="tutorial-video-container">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={getVideoUrl()}
                                        title="Tutorial Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>

                                <div className="tvb-tutorial-modal-footer">
                                    <p>
                                        {step <= 4 
                                            ? getText('tutorial.onboarding.description', 
                                                'סרטון הדרכה המסביר את תהליך ההרשמה לגמבוט',
                                                'Tutorial video explaining the Gambot onboarding process')
                                            : getText('tutorial.setup.description',
                                                'סרטון הדרכה להשלמת ההתקנה וחיבור WhatsApp Business',
                                                'Tutorial video for completing setup and connecting WhatsApp Business')
                                        }
                                    </p>
                                    <div className="tvb-tutorial-videos-links">
                                        <div className="tvb-tutorial-info-section">
                                            <h4>
                                                {getText('tutorial.complete.title', 
                                                    '📚 להשלמת החשבון כמו שצריך:', 
                                                    '📚 To complete your account properly:')}
                                            </h4>
                                            <div className="tvb-tutorial-links-container">
                                                <a 
                                                    href="https://www.youtube.com/watch?v=bFRGFoelYjA&t=9s" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="tvb-tutorial-link"
                                                >
                                                    <FaYoutube />
                                                    <span>
                                                        {getText('tutorial.video2.title', 
                                                            'חלק 2: הזדהות מול מטא והגדרת פרופיל', 
                                                            'Part 2: Meta Verification & Profile Setup')}
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default TutorialVideoButton;

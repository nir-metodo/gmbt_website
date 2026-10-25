import React, { useState } from 'react';
import FacebookLogin from './FacebookLogin';
import TutorialVideoButton from './TutorialVideoButton';
import './WabaConnect.css';
import { FaFacebookF, FaUser, FaCreditCard, FaPhoneAlt, FaCopy, FaCheck, FaShieldAlt, FaChevronDown, FaPlay, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

// Final onboarding step. Used by BOTH the sign-up wizard (/OnboardingProcess, step 5) and the
// post-payment page (/complete-waba), so it must look right on its own — all styling is in
// WabaConnect.css under the .wc prefix and does not depend on the wizard container.
const WabaOnboarding = ({ onPrevStep, organization, email, hasSim, useFreeNumber, useCoexisting, simPhoneNumber, contactPhoneNumber, organizationName }) => {
    const { currentLanguage, isRTL } = useLanguage();
    const he = currentLanguage !== 'en';
    const L = (heText, enText) => (he ? heText : enText);
    const [copied, setCopied] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    const handleCopy = () => {
        if (!simPhoneNumber) return;
        const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
        navigator.clipboard.writeText(simPhoneNumber).then(done).catch(() => {});
    };

    // Which option the user must tap inside Meta's popup (it depends on the account type chosen in step 2).
    const metaChoice = useCoexisting
        ? 'Use an existing WhatsApp Business Account'
        : (!hasSim && !useFreeNumber ? 'Create a new WhatsApp Business Account' : null);

    const videoSrc = useCoexisting
        ? 'https://www.youtube.com/embed/mBBmoxCRRmI?start=330&rel=0&autoplay=1'
        : 'https://www.youtube.com/embed/6y8A61Z7Zv4?start=140&rel=0&autoplay=1';

    const verificationText = L(
        `קוד האימות יישלח ל-${contactPhoneNumber || ''} ול-${email || ''}`,
        `The verification code will be sent to ${contactPhoneNumber || ''} and ${email || ''}`
    );

    const copyButton = (
        <button type="button" className={`wc-copy${copied ? ' is-copied' : ''}`} onClick={handleCopy}>
            {copied ? <FaCheck aria-hidden="true" /> : <FaCopy aria-hidden="true" />}
            {copied ? L('הועתק', 'Copied') : L('העתקה', 'Copy')}
        </button>
    );

    const BackIcon = isRTL ? FaArrowRight : FaArrowLeft;

    return (
        <div className={`wc ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <header className="wc-header">
                <div className="wc-header-text">
                    <h1 className="wc-title">{L('חיבור WhatsApp דרך Facebook', 'Connect WhatsApp through Facebook')}</h1>
                    <p className="wc-subtitle">{L('הצעד האחרון: מחברים את מספר ה-WhatsApp העסקי שלכם למערכת.', 'Last step: connect your business WhatsApp number to Gambot.')}</p>
                </div>
                <TutorialVideoButton step={5} />
            </header>

            {/* ── The one action that matters ─────────────────────────── */}
            <section className="wc-action" aria-labelledby="wc-action-title">
                <div className="wc-action-head">
                    <span className="wc-fb-badge" aria-hidden="true"><FaFacebookF /></span>
                    <div>
                        <h2 id="wc-action-title">{L('התחברו עם Facebook כדי להשלים', 'Connect with Facebook to finish')}</h2>
                        <p>
                            {L(
                                'החיבור ל-WhatsApp Business מתבצע דרך Meta, ולכן חובה להתחבר עם חשבון Facebook. בלי זה החשבון לא יופעל.',
                                'WhatsApp Business is connected through Meta, so signing in with Facebook is required. Without it your account cannot be activated.'
                            )}
                        </p>
                    </div>
                </div>

                {metaChoice && (
                    <div className="wc-choice">
                        <span className="wc-choice-label">{L('בחלון של Facebook שייפתח, בחרו:', 'In the Facebook window that opens, choose:')}</span>
                        <strong className="wc-choice-value" dir="ltr">{metaChoice}</strong>
                    </div>
                )}

                <FacebookLogin
                    organization={organization}
                    buisnessEmail={email}
                    organizationName={organizationName}
                    isCoexisting={useCoexisting}
                    coexistingPhoneNumber={simPhoneNumber}
                />

                <p className="wc-secure">
                    <FaShieldAlt aria-hidden="true" />
                    {L('החיבור מאובטח דרך Facebook. בסיום תועברו למסך הכניסה של Gambot.', 'The connection is secured by Facebook. When you finish, you will be taken to the Gambot sign-in page.')}
                </p>
            </section>

            {/* ── What to have ready ─────────────────────────────────── */}
            <section className="wc-block" aria-labelledby="wc-ready-title">
                <h2 id="wc-ready-title" className="wc-block-title">{L('לפני שמתחילים — שלושה דברים שצריך', 'Before you start — three things you need')}</h2>
                <ul className="wc-ready">
                    <li>
                        <span className="wc-ready-icon"><FaUser /></span>
                        <div>
                            <h3>{L('חשבון Facebook אישי', 'A personal Facebook account')}</h3>
                            <p>{L(
                                'התחברו עם החשבון האישי שלכם, רצוי כזה שיש לו גישה לנכסי העסק. עדיין אין Business Portfolio ב-Meta? הוא ייווצר אוטומטית.',
                                'Sign in with your own account, ideally one with access to your business assets. No Business Portfolio on Meta yet? One is created automatically.'
                            )}</p>
                        </div>
                    </li>
                    <li>
                        <span className="wc-ready-icon"><FaCreditCard /></span>
                        <div>
                            <h3>{L('אמצעי תשלום פעיל', 'An active payment method')}</h3>
                            <p>{L(
                                'Meta דורשת אמצעי תשלום פעיל ומאומת בחשבון העסקי.',
                                'Meta requires an active, verified payment method on the business account.'
                            )}</p>
                        </div>
                    </li>
                    <li>
                        <span className="wc-ready-icon"><FaPhoneAlt /></span>
                        <div>
                            <h3>{L('גישה למספר הטלפון', 'Access to the phone number')}</h3>
                            {useCoexisting ? (
                                <>
                                    <p>{L('המספר שבחרתם:', 'The number you selected:')}</p>
                                    <div className="wc-number">
                                        <span dir="ltr">{simPhoneNumber}</span>
                                        {copyButton}
                                    </div>
                                    <p>{L('ודאו שיש לכם גישה אליו כדי לקבל קוד אימות מ-Meta.', 'Make sure you can access it to receive a verification code from Meta.')}</p>
                                </>
                            ) : !hasSim ? (
                                <>
                                    <p>{L('המספר שנרכש עבורכם:', 'The number purchased for you:')}</p>
                                    <div className="wc-number">
                                        <span dir="ltr">{simPhoneNumber}</span>
                                        {copyButton}
                                    </div>
                                    <p>{verificationText}</p>
                                </>
                            ) : (
                                <>
                                    {simPhoneNumber && (
                                        <div className="wc-number">
                                            <span dir="ltr">{simPhoneNumber}</span>
                                            {copyButton}
                                        </div>
                                    )}
                                    <p>{L(
                                        'ודאו שיש לכם גישה למספר שבחרתם. לא מומלץ להשתמש במספר אישי פעיל, כדי למנוע אובדן מידע.',
                                        'Make sure you have access to the number you selected. Using an active personal number is not recommended, to avoid losing data.'
                                    )}</p>
                                </>
                            )}
                        </div>
                    </li>
                </ul>
            </section>

            {/* ── What will happen ───────────────────────────────────── */}
            <section className="wc-block" aria-labelledby="wc-how-title">
                <h2 id="wc-how-title" className="wc-block-title">{L('איך זה עובד', 'How it works')}</h2>
                <ol className="wc-steps">
                    <li><span className="wc-step-num">1</span><span>{L('לוחצים על "התחברות עם Facebook".', 'Click "Connect with Facebook".')}</span></li>
                    <li><span className="wc-step-num">2</span><span>{L('בחלון של Meta מתחברים, מאשרים את פרטי העסק ומזינים את קוד האימות.', 'In the Meta window, sign in, confirm your business details and enter the verification code.')}</span></li>
                    <li><span className="wc-step-num">3</span><span>{L('זהו — מועברים למסך הכניסה ומתחילים לעבוד.', 'That is it — you are taken to sign-in and can start working.')}</span></li>
                </ol>

                {showVideo ? (
                    <div className="wc-video">
                        <iframe
                            src={videoSrc}
                            title={L('סרטון הדרכה', 'Tutorial video')}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <button type="button" className="wc-video-toggle" onClick={() => setShowVideo(true)}>
                        <FaPlay aria-hidden="true" /> {L('צפו בהדרכה קצרה לפני שמתחילים', 'Watch a short walkthrough first')} <FaChevronDown aria-hidden="true" />
                    </button>
                )}
            </section>

            <footer className="wc-footer">
                <button type="button" className="wc-back" onClick={onPrevStep}>
                    <BackIcon aria-hidden="true" /> {L('חזרה', 'Back')}
                </button>
            </footer>
        </div>
    );
};

export default WabaOnboarding;

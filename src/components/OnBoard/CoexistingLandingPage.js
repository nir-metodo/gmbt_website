import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoexistingLandingPage.css';
import { FaWhatsapp, FaRocket, FaMoneyBillWave, FaCheckCircle, FaPlay, FaArrowLeft, FaPhone } from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { MdVerified, MdTrendingUp, MdAccessTime } from 'react-icons/md';
import axios from 'axios';

const CoexistingLandingPage = () => {
    const navigate = useNavigate();
    const [showVideo, setShowVideo] = useState(false);
    const [leadForm, setLeadForm] = useState({
        fullName: '',
        companyName: '',
        phone: '',
        email: ''
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const videoUrl = "https://www.youtube.com/embed/YOUR_VIDEO_ID"; // ✅ תעדכן את זה עם הקישור שלך

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post('https://gambot.azurewebsites.net/api/external/webhooks/landing-page/submit', {
                lead_name: leadForm.fullName,
                lead_email: leadForm.email,
                lead_phone: leadForm.phone,
                url: window.location.href,
                page: 'coexistence-landing'
            });
            setFormSubmitted(true);
            
            setTimeout(() => {
                setFormSubmitted(false);
                setLeadForm({ fullName: '', companyName: '', phone: '', email: '' });
            }, 3000);
        } catch (error) {
            console.error('Error submitting lead:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onStartOnboarding = () => {
        navigate('/complete-waba-onboarding?coexisting=true');
    };

    const onBack = () => {
        navigate('/');
    };

    return (
        <div className="coexistence-landing">
            {/* Hero Section */}
            <section className="hero-section">
                <button onClick={onBack} className="back-button">
                    <FaArrowLeft /> חזרה
                </button>

                <div className="hero-content">
                    <div className="hero-badge">
                        <HiSparkles className="sparkle-icon" />
                        <span>חדש בישראל! 🇮🇱</span>
                    </div>

                    <h1 className="hero-title">
                        <span className="gradient-text">WhatsApp Co-existence</span>
                        <br />
                        המהפכה שחיכית לה! 🚀
                    </h1>

                    <p className="hero-subtitle">
                        <strong>סוף סוף!</strong> תוכל לעבוד עם מספר ה-WhatsApp Business הקיים שלך<br />
                        <span className="highlight">בוט AI מסנן לידים 24/7 + נציג אנושי בזמן שצריך = שירות מושלם!</span>
                    </p>

                    <div className="hero-features">
                        <div className="hero-feature">
                            <FaCheckCircle className="check-icon" />
                            <span>בוט AI + נציג אנושי</span>
                        </div>
                        <div className="hero-feature">
                            <FaCheckCircle className="check-icon" />
                            <span>סנכרון שיחות (6 חודשים)</span>
                        </div>
                        <div className="hero-feature">
                            <FaCheckCircle className="check-icon" />
                            <span>ללא העברת מספר</span>
                        </div>
                        <div className="hero-feature">
                            <FaCheckCircle className="check-icon" />
                            <span>מוכן תוך 5 דקות</span>
                        </div>
                    </div>

                    <div className="hero-cta">
                        <button onClick={onStartOnboarding} className="primary-cta">
                            <HiLightningBolt />
                            התחל עכשיו בחינם
                        </button>
                        <button onClick={() => setShowVideo(true)} className="secondary-cta">
                            <FaPlay />
                            צפה בסרטון הסבר
                        </button>
                    </div>

                    <p className="hero-trust">
                        <MdVerified className="verified-icon" />
                        טכנולוגיית Meta החדשה + בוט AI חכם = שירות 24/7 שחוסך זמן ומגדיל הכנסות
                    </p>
                </div>

                <div className="hero-image">
                    <div className="phone-mockup">
                        <FaWhatsapp className="whatsapp-icon pulsing" />
                        <div className="success-badge">
                            <MdTrendingUp />
                            <span>🤖 AI + 👨‍💼 נציג = 💰</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* למה חיכינו לזה */}
            <section className="why-waited-section">
                <div className="section-header">
                    <h2>למה חיכינו לזה כל כך הרבה זמן? ⏰</h2>
                    <p>כי Meta סוף סוף הבינה מה העסקים צריכים!</p>
                </div>

                <div className="waited-grid">
                    <div className="waited-card">
                        <div className="waited-icon frustrated">😤</div>
                        <h3>לפני Co-existence</h3>
                        <ul className="problem-list">
                            <li>❌ צריך להעביר מספר לGambot</li>
                            <li>❌ מאבדים את כל ההיסטוריה</li>
                            <li>❌ הצוות צריך להתרגל למערכת חדשה</li>
                            <li>❌ לא יכול לעבוד מהטלפון בשטח</li>
                            <li>❌ תהליך מסובך של 2-3 שבועות</li>
                        </ul>
                    </div>

                    <div className="waited-card success">
                        <div className="waited-icon happy">🎉</div>
                        <h3>עם Co-existence</h3>
                        <ul className="benefit-list">
                            <li>✅ שומר את המספר הקיים שלך</li>
                            <li>✅ כל השיחות נשמרות (6 חודשים טקסט, 14 ימים מדיה)!</li>
                            <li>✅ בוט AI מסנן לידים ונותן מענה ראשוני 24/7</li>
                            <li>✅ עובד גם מהאפליקציה וגם מהמחשב</li>
                            <li>✅ מוכן תוך 5 דקות!</li>
                            <li>✅ הצוות ממשיך לעבוד כרגיל + חוסך המון זמן</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* שובר שוק */}
            <section className="game-changer-section">
                <div className="section-header">
                    <h2>
                        <span className="gradient-text">שובר שוק!</span> 💥
                    </h2>
                    <p>בוט AI + נציג אנושי על אותו מספר = שירות מושלם שחוסך זמן וכסף ומגדיל הכנסות</p>
                </div>

                <div className="value-grid">
                    <div className="value-card">
                        <div className="value-icon money">
                            <FaMoneyBillWave />
                        </div>
                        <h3>חוסך כסף מטורף</h3>
                        <p className="value-amount">₪15,000-30,000</p>
                        <ul>
                            <li>ללא עלויות העברת מספר</li>
                            <li>ללא הפסד מכירות בזמן המעבר</li>
                            <li>ללא צורך בהדרכות מחדש</li>
                        </ul>
                    </div>

                    <div className="value-card">
                        <div className="value-icon time">
                            <MdAccessTime />
                        </div>
                        <h3>חוסך זמן אדיר</h3>
                        <p className="value-amount">2-3 שבועות</p>
                        <ul>
                            <li>מוכן תוך 5 דקות במקום חודש</li>
                            <li>אין זמן השבתה</li>
                            <li>מעבר חלק ללא הפרעות</li>
                        </ul>
                    </div>

                    <div className="value-card">
                        <div className="value-icon growth">
                            <MdTrendingUp />
                        </div>
                        <h3>מגדיל מכירות</h3>
                        <p className="value-amount">+300%</p>
                        <ul>
                            <li>בוט AI מסנן לידים ונותן מענה 24/7</li>
                            <li>מעבר חכם לנציג רק כשצריך</li>
                            <li>חוסך זמן לצוות + שירות מעולה ללקוח</li>
                        </ul>
                    </div>

                    <div className="value-card">
                        <div className="value-icon flexibility">
                            <FaRocket />
                        </div>
                        <h3>בוט AI + נציג אנושי</h3>
                        <p className="value-amount">Best of Both</p>
                        <ul>
                            <li>בוט AI למענה ראשוני וסינון לידים</li>
                            <li>מעבר חלק לנציג אנושי בצורך</li>
                            <li>חוסך זמן + שירות מעולה + מגדיל הכנסות</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* למי זה מתאים */}
            <section className="target-audience-section">
                <div className="section-header">
                    <h2>למי זה מתאים במיוחד? 🎯</h2>
                    <p>אם אתה מזדהה עם אחד מהמצבים האלה - זה בשבילך!</p>
                </div>

                <div className="audience-grid">
                    <div className="audience-card">
                        <div className="audience-emoji">👔</div>
                        <h3>בעל עסק SMB</h3>
                        <p>
                            כבר עובד עם WhatsApp Business, יש לך היסטוריה עם לקוחות,
                            ואתה לא רוצה לאבד את זה? <strong>זה בדיוק בשבילך!</strong>
                        </p>
                        <ul>
                            <li>🤖 בוט AI מטפל בשאלות חוזרות ומסנן לידים</li>
                            <li>👨‍💼 אתה וצוות עונים רק למה שחשוב</li>
                            <li>💰 חוסך זמן + מגדיל הכנסות</li>
                        </ul>
                    </div>

                    <div className="audience-card">
                        <div className="audience-emoji">🏢</div>
                        <h3>מנהל מכירות</h3>
                        <p>
                            צוות המכירות עובד עם WhatsApp והם לא רוצים לעבור למערכת אחרת?
                            <strong>עכשיו הם לא צריכים!</strong>
                        </p>
                        <ul>
                            <li>🤖 בוט AI עונה בלילה וסופ"ש - אף ליד לא נופל</li>
                            <li>👥 הצוות עובד כרגיל + מקבלים לידים מסוננים</li>
                            <li>📊 ניהול ומעקב אחרי כל שיחה</li>
                        </ul>
                    </div>

                    <div className="audience-card">
                        <div className="audience-emoji">💼</div>
                        <h3>עסק שירותים</h3>
                        <p>
                            נותן שירות לשטח? הטכנאים צריכים לענות מהטלפון והמשרד צריך לנהל?
                            <strong>זה הפתרון המושלם!</strong>
                        </p>
                        <ul>
                            <li>🤖 בוט AI קובע תורים + עונה לשאלות נפוצות</li>
                            <li>👨‍🔧 הטכנאים עונים מהטלפון רק למה שדחוף</li>
                            <li>💻 המשרד רואה ומנהל הכל ממקום אחד</li>
                        </ul>
                    </div>

                    <div className="audience-card">
                        <div className="audience-emoji">🛍️</div>
                        <h3>איש מכירות אונליין</h3>
                        <p>
                            מוכר דרך WhatsApp? יש לך מאות לקוחות והיסטוריה ארוכה?
                            <strong>שמור הכל ותשדרג!</strong>
                        </p>
                        <ul>
                            <li>🤖 בוט AI עונה על שאלות מוצר + מחירים 24/7</li>
                            <li>💬 אתה עונה רק לשאלות סופיות וסוגר עסקאות</li>
                            <li>📈 מגדיל המרות + חוסך המון זמן מענה</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* סרטון הסבר */}
            <section className="video-section">
                <div className="section-header">
                    <h2>איך זה עובד? (5 דקות בלבד!) ⏱️</h2>
                    <p>תראה בעצמך כמה זה פשוט להתחיל</p>
                </div>

                <div className="video-container">
                    {showVideo ? (
                        <div className="video-wrapper">
                            <iframe
                                src={videoUrl}
                                title="Gambot Co-existence Tutorial"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="video-placeholder" onClick={() => setShowVideo(true)}>
                            <FaPlay className="play-icon" />
                            <p>לחץ כדי לצפות בסרטון (2:30 דקות)</p>
                        </div>
                    )}
                </div>
            </section>

            {/* טופס ליד */}
            <section className="lead-form-section">
                <div className="form-container">
                    <div className="form-header">
                        <h2>מעוניין? נחזור אליך תוך 24 שעות! 📞</h2>
                        <p>גלה איך בוט AI + WhatsApp Business משדרג את השירות, חוסך זמן ומגדיל הכנסות 🚀</p>
                    </div>

                    {formSubmitted ? (
                        <div className="success-message">
                            <FaCheckCircle className="success-icon" />
                            <h3>תודה רבה!</h3>
                            <p>קיבלנו את הפרטים שלך ונחזור אליך בהקדם</p>
                        </div>
                    ) : (
                        <form onSubmit={handleLeadSubmit} className="lead-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>שם מלא *</label>
                                    <input
                                        type="text"
                                        required
                                        value={leadForm.fullName}
                                        onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                                        placeholder="איך קוראים לך?"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>שם החברה *</label>
                                    <input
                                        type="text"
                                        required
                                        value={leadForm.companyName}
                                        onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                                        placeholder="שם העסק שלך"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>טלפון *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={leadForm.phone}
                                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                                        placeholder="050-1234567"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>אימייל</label>
                                    <input
                                        type="email"
                                        value={leadForm.email}
                                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="submit-lead-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'שולח...' : 'שלח ונחזור אליך'}
                                <FaPhone />
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta-section">
                <div className="final-cta-content">
                    <h2>מוכן להתחיל? 🚀</h2>
                    <p className="final-cta-subtitle">
                        הצטרף לעשרות עסקים שמשלבים בוט AI עם נציג אנושי - חוסכים זמן, משפרים שירות ומגדילים הכנסות!
                    </p>

                    <button onClick={onStartOnboarding} className="final-cta-button">
                        <HiLightningBolt />
                        התחל עכשיו - זה בחינם!
                    </button>

                    <p className="final-cta-note">
                        💳 ללא כרטיס אשראי | 🎁 ניסיון חינם 30 יום | ⚡ הקמה תוך 5 דקות
                    </p>
                </div>
            </section>
        </div>
    );
};

export default CoexistingLandingPage;

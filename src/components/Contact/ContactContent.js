'use client';
import { useState } from 'react';
import styles from './ContactContent.module.css';

export default function ContactContent() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('https://prod-00.northeurope.logic.azure.com:443/workflows/24826d9f1f30448cb12884561d7bcc2b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RMrmjA9SPjryV5VE5iP8elY_V6tFdxhMgjs-zQI8FPQ', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'contact-page', ClientId: 'R9f6r4oe5PSCLr6CnYRQ' }),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={{ paddingTop: '68px' }}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>צור קשר</h1>
          <p>שמחים לענות על כל שאלה. נציג שלנו יחזור אליכם תוך שעה בשעות העבודה</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.layout}>
          {/* Contact Info */}
          <div className={styles.info}>
            <h2>דרכי יצירת קשר</h2>
            <div className={styles.channels}>
              <a href="https://wa.me/97233768997" target="_blank" rel="noopener noreferrer" className={styles.channel}>
                <span className={styles.chIcon}>💬</span>
                <div>
                  <strong>WhatsApp ישיר</strong>
                  <p>קבלו מענה מיידי</p>
                </div>
              </a>
              <a href="tel:+97233768997" className={styles.channel}>
                <span className={styles.chIcon}>📞</span>
                <div>
                  <strong>03-376-8997</strong>
                  <p>א׳-ה׳ | 9:00-18:00</p>
                </div>
              </a>
              <a href="mailto:info@gambot.co.il" className={styles.channel}>
                <span className={styles.chIcon}>📧</span>
                <div>
                  <strong>info@gambot.co.il</strong>
                  <p>תגובה תוך 24 שעות</p>
                </div>
              </a>
              <div className={styles.channel}>
                <span className={styles.chIcon}>📍</span>
                <div>
                  <strong>תל אביב, ישראל</strong>
                  <p>שותף Meta רשמי</p>
                </div>
              </div>
            </div>

            <div className={styles.demoBox}>
              <h3>🚀 רוצים הדגמה?</h3>
              <p>ראו את גמבוט בפעולה — הדגמה חינמית ב-30 דקות</p>
              <a
                href="https://wa.me/97233768997?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%A7%D7%91%D7%95%D7%A2%20%D7%94%D7%93%D7%92%D7%9E%D7%94%20%F0%9F%9A%80"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.demoBtn}
              >
                הזמינו הדגמה עכשיו
              </a>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formWrap}>
            {status === 'success' ? (
              <div className={styles.success}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                <h3>תודה! נחזור אליכם בקרוב</h3>
                <p>נציג שלנו יצור קשר תוך שעה בשעות העבודה</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} dir="rtl">
                <h2>שלחו לנו הודעה</h2>
                <div className={styles.formGrid}>
                  <input type="text" placeholder="שם מלא *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className={styles.input} />
                  <input type="tel" placeholder="מספר טלפון *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required className={styles.input} dir="ltr" />
                  <input type="email" placeholder="אימייל *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className={styles.input} dir="ltr" style={{ gridColumn: '1 / -1' }} />
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className={styles.input} style={{ gridColumn: '1 / -1' }}>
                    <option value="">בחרו נושא פנייה</option>
                    <option value="demo">הדגמה חינמית</option>
                    <option value="pricing">שאלה על מחירים</option>
                    <option value="technical">תמיכה טכנית</option>
                    <option value="general">פנייה כללית</option>
                  </select>
                  <textarea placeholder="מה נוכל לעזור? *" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required className={`${styles.input} ${styles.textarea}`} style={{ gridColumn: '1 / -1' }} rows={4} />
                </div>
                <button type="submit" className={styles.submit} disabled={status === 'loading'}>
                  {status === 'loading' ? '⏳ שולח...' : '📨 שלחו הודעה'}
                </button>
                {status === 'error' && <p className={styles.error}>שגיאה בשליחה. <a href="https://wa.me/97233768997">נסו בוואטסאפ</a></p>}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './LeadForm.module.css';

export default function LeadForm({ source = 'website' }) {
  const { currentLanguage } = useLanguage();
  const isEn = currentLanguage === 'en';
  const [form, setForm] = useState({ name: '', phone: '', email: '', businessName: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone) return;
    setStatus('loading');
    try {
      await Promise.allSettled([
        fetch('https://prod-00.northeurope.logic.azure.com:443/workflows/24826d9f1f30448cb12884561d7bcc2b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RMrmjA9SPjryV5VE5iP8elY_V6tFdxhMgjs-zQI8FPQ', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source, ClientId: 'R9f6r4oe5PSCLr6CnYRQ' }),
        }),
        sendLeadWebhook({ name: form.name, email: form.email, phone: form.phone, businessName: form.businessName }),
        sendThankYouEmail({ name: form.name, email: form.email, source }),
      ]);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead', {
          event_category: 'lead_form',
          event_label: source,
        });
        window.gtag('event', 'conversion', {
          send_to: 'AW-18018385768/zoGcCMK4-IwcEOj-6o9D',
          value: 1.0,
          currency: 'ILS',
        });
      }
      window.location.href = isEn ? '/תודה?lang=en' : '/תודה';
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} dir={isEn ? 'ltr' : 'rtl'}>
      <h3 className={styles.title}>
        {isEn ? "Leave your details — we'll get back to you shortly" : 'השאירו פרטים — נחזור אליכם בהקדם'}
      </h3>
      <div className={styles.grid}>
        <input
          type="text"
          placeholder={isEn ? 'Full name *' : 'שם מלא *'}
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className={styles.input}
        />
        <input
          type="tel"
          placeholder={isEn ? 'Phone number *' : 'מספר טלפון *'}
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          required
          className={styles.input}
          dir="ltr"
        />
        <input
          type="email"
          placeholder={isEn ? 'Email' : 'אימייל'}
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className={styles.input}
          dir="ltr"
        />
        <input
          type="text"
          placeholder={isEn ? 'Business name' : 'שם העסק'}
          value={form.businessName}
          onChange={e => setForm({ ...form, businessName: e.target.value })}
          className={styles.input}
        />
      </div>
      <button
        type="submit"
        className={styles.submit}
        disabled={status === 'loading'}
      >
        {status === 'loading'
          ? (isEn ? '⏳ Sending...' : '⏳ שולח...')
          : (isEn ? '🚀 Get a free demo' : '🚀 קבלו הדגמה חינמית')}
      </button>
      {status === 'error' && (
        <p className={styles.error}>
          {isEn ? (
            <>Something went wrong, please try again or <a href="https://wa.me/97233768997">contact us on WhatsApp</a></>
          ) : (
            <>שגיאה בשליחה, נסו שוב או <a href="https://wa.me/97233768997">צרו קשר בוואטסאפ</a></>
          )}
        </p>
      )}
    </form>
  );
}

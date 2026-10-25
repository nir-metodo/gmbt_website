'use client';
import { useId, useState } from 'react';
import Link from 'next/link';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import { sendThankYouEmail } from '@/utils/sendThankYouEmail';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './LeadForm.module.css';

export default function LeadForm({ source = 'website' }) {
  const { currentLanguage } = useLanguage();
  const isEn = currentLanguage === 'en';
  const uid = useId();
  const [form, setForm] = useState({ name: '', phone: '', email: '', businessName: '' });
  // Marketing follow-up needs explicit opt-in (Communications Law s.30A). Replying to THIS request does not.
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone) return;
    setStatus('loading');
    try {
      const consentText = isEn
        ? 'I agree to receive marketing messages from Gambot (WhatsApp / SMS / email). I can unsubscribe at any time.'
        : 'אני מסכים/ה לקבל מגמבוט הודעות שיווקיות (וואטסאפ / SMS / דוא"ל). ניתן להסיר את ההרשמה בכל עת.';
      const consentMeta = {
        marketingConsent,
        consentText: marketingConsent ? consentText : '',
        consentTimestamp: marketingConsent ? new Date().toISOString() : '',
        consentPage: typeof window !== 'undefined' ? window.location.href : '',
      };
      await Promise.allSettled([
        fetch('https://prod-00.northeurope.logic.azure.com:443/workflows/24826d9f1f30448cb12884561d7bcc2b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RMrmjA9SPjryV5VE5iP8elY_V6tFdxhMgjs-zQI8FPQ', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source, ClientId: 'R9f6r4oe5PSCLr6CnYRQ', ...consentMeta }),
        }),
        sendLeadWebhook({ name: form.name, email: form.email, phone: form.phone, businessName: form.businessName, ...consentMeta }),
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

  const field = (key, { type = 'text', label, required = false, autoComplete, ltr = false }) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={`${uid}-${key}`}>{label}{required ? ' *' : ''}</label>
      <input
        id={`${uid}-${key}`}
        name={key}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-required={required || undefined}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        className={styles.input}
        dir={ltr ? 'ltr' : undefined}
      />
    </div>
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit} dir={isEn ? 'ltr' : 'rtl'} aria-labelledby={`${uid}-title`}>
      <h3 className={styles.title} id={`${uid}-title`}>
        {isEn ? "Leave your details — we'll get back to you shortly" : 'השאירו פרטים — נחזור אליכם בהקדם'}
      </h3>
      <div className={styles.grid}>
        {field('name', { label: isEn ? 'Full name' : 'שם מלא', autoComplete: 'name' })}
        {field('phone', { type: 'tel', label: isEn ? 'Phone number' : 'מספר טלפון', required: true, autoComplete: 'tel', ltr: true })}
        {field('email', { type: 'email', label: isEn ? 'Email' : 'אימייל', autoComplete: 'email', ltr: true })}
        {field('businessName', { label: isEn ? 'Business name' : 'שם העסק', autoComplete: 'organization' })}
      </div>

      <label className={styles.consentRow}>
        <input type="checkbox" checked={marketingConsent} onChange={e => setMarketingConsent(e.target.checked)} />
        <span>
          {isEn
            ? 'I agree to also receive updates and marketing messages from Gambot (WhatsApp / SMS / email). Optional — you can unsubscribe at any time.'
            : 'אני מסכים/ה לקבל מגמבוט גם עדכונים והודעות שיווקיות (וואטסאפ / SMS / דוא"ל). רשות — ניתן להסיר בכל עת.'}
        </span>
      </label>

      <button
        type="submit"
        className={styles.submit}
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
      >
        {status === 'loading'
          ? (isEn ? '⏳ Sending...' : '⏳ שולח...')
          : (isEn ? '🚀 Get a free demo' : '🚀 קבלו הדגמה חינמית')}
      </button>

      <div role="alert" aria-live="assertive">
        {status === 'error' && (
          <p className={styles.error}>
            {isEn ? (
              <>Something went wrong, please try again or <a href="https://wa.me/97233768997">contact us on WhatsApp</a></>
            ) : (
              <>שגיאה בשליחה, נסו שוב או <a href="https://wa.me/97233768997">צרו קשר בוואטסאפ</a></>
            )}
          </p>
        )}
      </div>

      <p className={styles.privacyNote}>
        {isEn
          ? 'Your details are used only to respond to your request. '
          : 'הפרטים ישמשו אותנו לצורך מענה לפנייתך בלבד. '}
        <Link href={isEn ? '/privacy/en/' : '/privacy/'}>{isEn ? 'Privacy Policy' : 'מדיניות פרטיות'}</Link>
      </p>
    </form>
  );
}

'use client';
import { useState } from 'react';
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import styles from './LeadForm.module.css';

export default function LeadForm({ source = 'website' }) {
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
      ]);
      window.location.href = '/תודה';
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} dir="rtl">
      <h3 className={styles.title}>השאירו פרטים — נחזור אליכם בהקדם</h3>
      <div className={styles.grid}>
        <input
          type="text"
          placeholder="שם מלא *"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className={styles.input}
        />
        <input
          type="tel"
          placeholder="מספר טלפון *"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          required
          className={styles.input}
          dir="ltr"
        />
        <input
          type="email"
          placeholder="אימייל"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className={styles.input}
          dir="ltr"
        />
        <input
          type="text"
          placeholder="שם העסק"
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
        {status === 'loading' ? '⏳ שולח...' : '🚀 קבלו הדגמה חינמית'}
      </button>
      {status === 'error' && (
        <p className={styles.error}>שגיאה בשליחה, נסו שוב או <a href="https://wa.me/97233768997">צרו קשר בוואטסאפ</a></p>
      )}
    </form>
  );
}

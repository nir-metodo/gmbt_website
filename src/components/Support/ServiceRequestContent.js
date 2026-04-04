'use client';
import { useState } from 'react';
import { sendServiceRequestWebhook } from '@/utils/sendServiceRequestWebhook';
import styles from './ServiceRequestContent.module.css';

const REQUEST_TYPES = [
  { value: '', label: 'בחר סוג פנייה...' },
  { value: 'תקלה טכנית', label: '🔴 תקלה טכנית' },
  { value: 'שאלה על שימוש', label: '💬 שאלה על שימוש במערכת' },
  { value: 'בקשת הגדרה', label: '⚙️ בקשת עזרה בהגדרות' },
  { value: 'הסבר על פיצ\'ר', label: '📖 הסבר על פיצ\'ר' },
  { value: 'בקשת פיתוח', label: '🔧 בקשת פיתוח / שינוי (בתשלום)' },
  { value: 'אחר', label: '📋 אחר' },
];

const INITIAL = {
  businessName: '',
  businessId: '',
  contactName: '',
  phone: '',
  requestType: '',
  description: '',
};

export default function ServiceRequestContent() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const valid =
    form.businessName.trim() &&
    form.contactName.trim() &&
    form.phone.trim().length >= 9 &&
    form.requestType &&
    form.description.trim().length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setStatus('loading');
    try {
      await sendServiceRequestWebhook(form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1>פתיחת בקשת שירות</h1>
        <p>מלאו את הטופס ונחזור אליכם בהתאם לחבילה שלכם</p>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          {/* Notice */}
          <div className={styles.notice}>
            ⏱️ <strong>זמני מענה:</strong> Growth עד 48 שעות · Pro עד 24 שעות · Support Plus עד 4 שעות בימי עסקים.
            בחבילת Starter — טיפול לפי זמינות, ללא התחייבות לזמן מענה.
          </div>

          <div className={styles.card}>
            {status === 'success' ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>✅</div>
                <h3>הבקשה התקבלה בהצלחה!</h3>
                <p>
                  נחזור אליכם בהתאם לחבילה שלכם.
                  <br />
                  לבקשות דחופות ניתן לפנות גם בוואטסאפ.
                </p>
              </div>
            ) : (
              <>
                <h2>📋 פרטי הפנייה</h2>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  {/* Row 1 — business */}
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>
                        שם העסק <span>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="שם החברה / העסק"
                        value={form.businessName}
                        onChange={set('businessName')}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label>ח.פ / ע.מ</label>
                      <input
                        type="text"
                        placeholder="123456789"
                        value={form.businessId}
                        onChange={set('businessId')}
                      />
                    </div>
                  </div>

                  {/* Row 2 — contact */}
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>
                        שם איש קשר <span>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="שם מלא"
                        value={form.contactName}
                        onChange={set('contactName')}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label>
                        טלפון <span>*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="05X-XXXXXXX"
                        value={form.phone}
                        onChange={set('phone')}
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Request type */}
                  <div className={styles.field}>
                    <label>
                      סוג הפנייה <span>*</span>
                    </label>
                    <select value={form.requestType} onChange={set('requestType')} required>
                      {REQUEST_TYPES.map((t) => (
                        <option key={t.value} value={t.value} disabled={t.value === ''}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className={styles.field}>
                    <label>
                      תיאור הפנייה <span>*</span>
                    </label>
                    <textarea
                      placeholder="תארו את הבעיה / הבקשה בפירוט. ככל שיהיה יותר מפורט — כך נוכל לטפל מהר יותר."
                      value={form.description}
                      onChange={set('description')}
                      required
                    />
                  </div>

                  {status === 'error' && (
                    <div className={styles.errorMsg}>
                      אירעה שגיאה בשליחת הבקשה. נסו שוב או פנו אלינו ישירות בוואטסאפ.
                    </div>
                  )}

                  <button type="submit" className={styles.submitBtn} disabled={!valid || status === 'loading'}>
                    {status === 'loading' ? 'שולח...' : '📨 שלח בקשת שירות'}
                  </button>
                </form>

                <p className={styles.disclaimer}>
                  * אנו לא מתחייבים לזמני מענה בחבילת Starter.
                  <br />
                  בקשות פיתוח ושינויים יתומחרו בנפרד — לא כלולות במנוי.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

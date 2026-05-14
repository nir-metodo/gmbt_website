'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SharedTokenInner() {
  const searchParams = useSearchParams();
  const shareId = searchParams.get('id');

  const [status, setStatus] = useState('loading'); // loading | success | expired | error
  const [token, setToken] = useState('');
  const [organization, setOrganization] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!shareId) {
      setStatus('error');
      return;
    }

    const fetchToken = async () => {
      try {
        const res = await fetch('https://gambot.azurewebsites.net/api/Webhooks/GetSharedToken', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shareId })
        });
        const data = await res.json();
        if (data.success) {
          setToken(data.token);
          setOrganization(data.organization);
          setStatus('success');
          setTimeLeft(data.hasExpiry !== false ? 120 : null);
        } else {
          setStatus(data.message === 'expired' ? 'expired' : 'error');
        }
      } catch (err) {
        console.error('Error fetching shared token:', err);
        setStatus('error');
      }
    };

    fetchToken();
  }, [shareId]);

  useEffect(() => {
    if (status !== 'success' || timeLeft === null) return;
    if (timeLeft <= 0) {
      setToken('');
      setStatus('expired');
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, timeLeft]);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img src="https://app.gambot.co.il/gambot_logo.png" alt="Gambot" style={{ height: 40 }} />
        </div>

        {status === 'loading' && (
          <div style={styles.center}>
            <div style={styles.spinner} />
            <p style={styles.text}>טוען...</p>
          </div>
        )}

        {status === 'success' && (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>🔑 טוקן API זמני</h1>
              <p style={styles.subtitle}>הטוקן הזה זמין לצפייה חד-פעמית בלבד</p>
            </div>

            {organization && (
              <div style={styles.orgBadge}>
                ארגון: <strong>{organization}</strong>
              </div>
            )}

            <div style={styles.tokenBox}>
              <code style={styles.tokenText}>{token}</code>
            </div>

            <button onClick={handleCopy} style={styles.copyBtn}>
              {copied ? '✅ הועתק!' : '📋 העתק טוקן'}
            </button>

            {timeLeft !== null && (
              <div style={styles.timer}>
                ⏱️ הדף יתרוקן בעוד <strong>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</strong>
              </div>
            )}

            <div style={styles.warning}>
              {timeLeft !== null
                ? '⚠️ לאחר סגירת הדף או תום הזמן, הטוקן לא יהיה זמין יותר דרך קישור זה.'
                : '⚠️ קישור זה חד-פעמי. לאחר סגירת הדף הטוקן לא יהיה זמין יותר.'}
            </div>
          </>
        )}

        {status === 'expired' && (
          <div style={styles.center}>
            <div style={styles.expiredIcon}>⏰</div>
            <h2 style={styles.expiredTitle}>הקישור פג תוקף</h2>
            <p style={styles.text}>הקישור כבר נצפה או שעבר זמן התוקף שלו.</p>
            <p style={styles.textSmall}>בקש מבעל החשבון ליצור קישור חדש.</p>
          </div>
        )}

        {status === 'error' && (
          <div style={styles.center}>
            <div style={styles.expiredIcon}>❌</div>
            <h2 style={styles.expiredTitle}>שגיאה</h2>
            <p style={styles.text}>הקישור לא תקין או שהייתה בעיה בשרת.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SharedTokenPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><p>טוען...</p></div>}>
      <SharedTokenInner />
    </Suspense>
  );
}

const styles = {
  container: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: 'Varela Round, sans-serif',
    direction: 'rtl',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    padding: '40px 36px',
    maxWidth: 520,
    width: '100%',
  },
  logo: {
    textAlign: 'center',
    marginBottom: 24,
  },
  center: {
    textAlign: 'center',
    padding: '20px 0',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1a1a2e',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    margin: 0,
  },
  orgBadge: {
    background: '#f0fdf4',
    border: '1px solid #a7f3d0',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    color: '#2e6155',
    textAlign: 'center',
    marginBottom: 16,
  },
  tokenBox: {
    background: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    padding: '16px 18px',
    overflowX: 'auto',
    marginBottom: 16,
    direction: 'ltr',
  },
  tokenText: {
    fontSize: 13,
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    color: '#1e293b',
    lineHeight: 1.6,
  },
  copyBtn: {
    display: 'block',
    width: '100%',
    padding: '12px',
    background: '#2e6155',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 16,
    transition: 'background 0.2s',
    fontFamily: 'Varela Round, sans-serif',
  },
  timer: {
    textAlign: 'center',
    fontSize: 13,
    color: '#b45309',
    background: '#fffbeb',
    border: '1px solid #fbbf24',
    borderRadius: 8,
    padding: '8px 12px',
    marginBottom: 12,
  },
  warning: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  expiredIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  expiredTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a1a2e',
    margin: '0 0 8px',
  },
  text: {
    fontSize: 14,
    color: '#64748b',
    margin: '4px 0',
  },
  textSmall: {
    fontSize: 12,
    color: '#94a3b8',
    margin: '8px 0 0',
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid #e2e8f0',
    borderTopColor: '#2e6155',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 12px',
  },
};

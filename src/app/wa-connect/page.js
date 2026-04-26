'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import FacebookLogin from '@/components/OnBoard/FacebookLogin';

const API_URL = 'https://gambot.azurewebsites.net';

function WaConnectInner() {
  const searchParams = useSearchParams();
  const organization = searchParams.get('organization') || '';
  const email = searchParams.get('email') || '';
  const orgName = searchParams.get('orgName') || organization;
  const isCoexisting = searchParams.get('isCoexisting') === 'true';
  const coexistingPhone = searchParams.get('coexistingPhone') || '';
  const token = searchParams.get('token') || '';

  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !organization) {
      setError('קישור לא תקין. אנא חזור להגדרות ונסה שוב.');
      setVerifying(false);
      return;
    }
    fetch(`${API_URL}/api/Webhooks/VerifyWaConnectToken?token=${encodeURIComponent(token)}&organization=${encodeURIComponent(organization)}`)
      .then(r => r.json())
      .then(data => {
        if (data?.Valid) {
          setVerified(true);
        } else {
          setError('הקישור פג תוקף או לא תקין. אנא חזור להגדרות ונסה שוב.');
        }
      })
      .catch(() => setError('שגיאה באימות הקישור.'))
      .finally(() => setVerifying(false));
  }, [token, organization]);

  const handleCodeReceived = async (code) => {
    if (window.opener) {
      window.opener.postMessage(
        { type: 'gambot-wa-connect-code', code },
        'https://app.gambot.co.il'
      );
      document.getElementById('wa-connect-status').textContent = 'החיבור הושלם בהצלחה! ניתן לסגור חלון זה.';
      setTimeout(() => window.close(), 2000);
    }
  };

  if (verifying) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#666' }}>מאמת הרשאות...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
          <h2 style={{ margin: '0 0 8px', color: '#dc2626', fontSize: '20px' }}>גישה נדחתה</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
        <h2 style={{ margin: '0 0 8px', color: '#1a1a1a', fontSize: '22px' }}>
          חיבור מספר WhatsApp נוסף
        </h2>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 24px' }}>
          לחץ על הכפתור למטה כדי להתחבר דרך Facebook
        </p>

        {isCoexisting && (
          <div style={{
            background: '#d1fae5',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            textAlign: 'start',
            fontSize: '13px',
            color: '#065f46',
          }}>
            <strong>⚠️ חשוב! מסלול Coexistence</strong><br />
            בחלון של Facebook שייפתח, בחר: <strong>&quot;Use an existing WhatsApp Business Account&quot;</strong>
          </div>
        )}

        {verified && (
          <FacebookLogin
            organization={organization}
            buisnessEmail={email}
            organizationName={orgName}
            isCoexisting={isCoexisting}
            coexistingPhoneNumber={coexistingPhone}
            onCodeReceived={handleCodeReceived}
          />
        )}

        <p id="wa-connect-status" style={{ marginTop: '16px', color: '#2e6155', fontWeight: '600', minHeight: '24px' }}></p>
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #1a73e8 0%, #2e6155 100%)',
  padding: '40px 20px',
  direction: 'rtl',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const cardStyle = {
  background: 'white',
  borderRadius: '20px',
  padding: '40px',
  maxWidth: '440px',
  width: '100%',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  textAlign: 'center',
};

export default function WaConnectPage() {
  return (
    <Suspense fallback={
      <div style={containerStyle}>
        <div style={{ color: 'white', fontSize: '18px' }}>טוען...</div>
      </div>
    }>
      <WaConnectInner />
    </Suspense>
  );
}

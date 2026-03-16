export const metadata = {
  title: 'תודה שפנית | Gambot',
  description: 'קיבלנו את פרטייך ונחזור אליך בהקדם.',
  robots: 'noindex, nofollow',
};

export default function ThankYouPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Heebo', 'Inter', sans-serif",
      padding: '20px',
      direction: 'rtl',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '520px',
        width: '100%',
      }}>


        {/* Success icon */}
        <div style={{
          width: '88px',
          height: '88px',
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: '0 0 40px rgba(37,211,102,0.35)',
          fontSize: '40px',
        }}>
          ✓
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(26px, 5vw, 36px)',
          fontWeight: '800',
          color: '#ffffff',
          margin: '0 0 12px',
          lineHeight: 1.2,
        }}>
          קיבלנו את הפרטים שלך!
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#94a3b8',
          margin: '0 0 36px',
          lineHeight: 1.6,
        }}>
          נחזור אליך בהקדם עם כל הפרטים.
        </p>

        {/* Info card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '32px',
          textAlign: 'right',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: '🤖', text: 'בוט AI שעונה ללקוחות 24/7 בוואטסאפ' },
              { icon: '📈', text: 'קמפיינים, אוטומציות ו-CRM במקום אחד' },
              { icon: '🆓', text: 'ניסיון חינם — ללא כרטיס אשראי' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '15px',
                color: '#cbd5e1',
              }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/97233768997?text=היי%2C%20שלחתי%20פרטים%20דרך%20האתר%20ורוצה%20לשמוע%20עוד"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            borderRadius: '50px',
            color: 'white',
            fontWeight: '700',
            fontSize: '16px',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(37,211,102,0.3)',
            marginBottom: '16px',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          דברו איתנו ישירות בוואטסאפ
        </a>

        <div style={{ marginTop: '8px' }}>
          <a
            href="https://www.gambot.co.il"
            style={{
              color: '#64748b',
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            חזרה לאתר ←
          </a>
        </div>

      </div>
    </div>
  );
}

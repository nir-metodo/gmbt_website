import Link from 'next/link';

export const metadata = {
  title: '404 — דף לא נמצא | גמבוט',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div style={{
      paddingTop: '68px',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '80px 24px',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🤖</div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '12px' }}>404 — הדף לא נמצא</h1>
      <p style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '36px', maxWidth: '500px' }}>
        הדף שחיפשתם לא קיים. אולי ניתן למצוא את מה שחיפשתם כאן:
      </p>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          color: 'white',
          padding: '12px 28px',
          borderRadius: '50px',
          fontWeight: 700,
          textDecoration: 'none',
        }}>
          🏠 דף הבית
        </Link>
        <Link href="/בוט-וואטסאפ" style={{
          background: 'white',
          color: '#25D366',
          padding: '11px 28px',
          borderRadius: '50px',
          fontWeight: 700,
          textDecoration: 'none',
          border: '2px solid #25D366',
        }}>
          🤖 בוט לוואטסאפ
        </Link>
        <Link href="/ContactUs" style={{
          background: 'white',
          color: '#4a5568',
          padding: '11px 28px',
          borderRadius: '50px',
          fontWeight: 600,
          textDecoration: 'none',
          border: '1px solid #e2e8f0',
        }}>
          📞 צור קשר
        </Link>
      </div>
    </div>
  );
}

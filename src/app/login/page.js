'use client';
import { useEffect } from 'react';

export default function LoginRedirect() {
  useEffect(() => {
    window.location.replace('/login');
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      direction: 'rtl'
    }}>
      <p style={{ color: '#2e6155', fontSize: 18 }}>מעביר לדף הכניסה...</p>
    </div>
  );
}

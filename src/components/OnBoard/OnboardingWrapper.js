'use client';
import dynamic from 'next/dynamic';
import './OnboardingProcess.css';

const OnboardingProcess = dynamic(() => import('./OnboardingProcess'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#25D366', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#718096', fontSize: '0.95rem' }}>טוען...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function OnboardingWrapper() {
  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh', background: '#f8fafc' }}>
      <OnboardingProcess />
    </div>
  );
}

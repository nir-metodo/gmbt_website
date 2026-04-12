'use client';

import dynamic from 'next/dynamic';

const PublicQuotePage = dynamic(
  () => import('@/components/Quote/PublicQuotePage'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px'
      }}>
        <img src="/new_logo.png" alt="Gambot" style={{ height: '60px', objectFit: 'contain' }} />
        <div style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #2d6a4f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#666', fontSize: '16px' }}>טוען הצעת מחיר...</p>
      </div>
    )
  }
);

export default function QuotePage() {
  return <PublicQuotePage />;
}

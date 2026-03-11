'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const WabaOnboardingWrapperNext = dynamic(
  () => import('@/components/OnBoard/WabaOnboardingWrapperNext'),
  { ssr: false, loading: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>טוען...</div> }
);

export default function CompleteWabaPage() {
  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        direction: 'rtl'
      }}>
        <Image src="/apple-touch-icon.png" alt="Gambot" width={36} height={36} style={{ marginInlineEnd: '10px', borderRadius: '8px' }} />
        <span style={{ fontFamily: '"Varela Round", sans-serif', fontWeight: 700, fontSize: '20px', color: '#1e293b' }}>Gambot</span>
      </div>
      <div style={{ paddingTop: '61px' }}>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>טוען...</div>}>
          <WabaOnboardingWrapperNext />
        </Suspense>
      </div>
    </>
  );
}

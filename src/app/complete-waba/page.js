'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const WabaOnboardingWrapperNext = dynamic(
  () => import('@/components/OnBoard/WabaOnboardingWrapperNext'),
  { ssr: false, loading: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>טוען...</div> }
);

export default function CompleteWabaPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>טוען...</div>}>
      <WabaOnboardingWrapperNext />
    </Suspense>
  );
}

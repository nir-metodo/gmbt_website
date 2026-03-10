'use client';
import dynamic from 'next/dynamic';

const Demo = dynamic(
  () => import('@/components/Demo/Demo'),
  {
    ssr: false,
    loading: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>
        טוען...
      </div>
    )
  }
);

export default function DemoPage() {
  return (
    <div style={{ paddingTop: '68px' }}>
      <Demo />
    </div>
  );
}

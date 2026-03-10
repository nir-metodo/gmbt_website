'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WabaOnboarding from './WabaOnboarding';

const WabaOnboardingWrapperNext = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract org name from path: /complete-waba/312832835 → "312832835"
  const getOrgNameFromPath = () => {
    if (typeof window === 'undefined') return null;
    const parts = window.location.pathname.replace(/\/$/, '').split('/');
    const idx = parts.indexOf('complete-waba');
    return idx >= 0 && parts[idx + 1] ? decodeURIComponent(parts[idx + 1]) : null;
  };

  const orgNameFromUrl = getOrgNameFromPath();

  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        // Priority 1: Dynamic route parameter (/complete-waba/:organizationName)
        if (orgNameFromUrl) {
          const apiUrl = `https://gambot.azurewebsites.net/api/Webhooks/GetOnboardingData/${encodeURIComponent(orgNameFromUrl)}`;
          try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data?.success && data?.data) {
              const d = data.data;
              setOrgData({
                organization: d.organization,
                organizationName: d.organizationName,
                email: d.email,
                hasSim: d.hasSim,
                useFreeNumber: d.useFreeNumber,
                useCoexisting: d.useCoexisting,
                simPhoneNumber: d.simPhoneNumber,
                contactPhoneNumber: d.contactPhoneNumber
              });
              setLoading(false);
              return;
            } else {
              setError(`Organization '${orgNameFromUrl}' not found`);
              setLoading(false);
              return;
            }
          } catch (apiError) {
            setError(`Failed to load organization data: ${apiError.message}`);
            setLoading(false);
            return;
          }
        }

        // Priority 2: Query parameters (/complete-waba?organization=X&email=Y)
        const organization = searchParams.get('organization');
        const email = searchParams.get('email');

        if (!organization || !email) {
          router.replace('/login');
          return;
        }

        try {
          const response = await fetch(`https://gambot.azurewebsites.net/api/Webhooks/GetOnboardingData/${encodeURIComponent(organization)}`);
          const data = await response.json();

          if (data?.success && data?.data) {
            const d = data.data;
            setOrgData({
              organization: d.organization,
              organizationName: d.organizationName,
              email: d.email || email,
              hasSim: d.hasSim,
              useFreeNumber: d.useFreeNumber,
              useCoexisting: d.useCoexisting,
              simPhoneNumber: d.simPhoneNumber,
              contactPhoneNumber: d.contactPhoneNumber
            });
            setLoading(false);
            return;
          }
        } catch {
          // fallback below
        }

        // Fallback: Use query params only
        setOrgData({
          organization,
          email,
          organizationName: organization.charAt(0).toUpperCase() + organization.slice(1),
          hasSim: false,
          simPhoneNumber: '',
          contactPhoneNumber: ''
        });
        setLoading(false);
      } catch (err) {
        setError('Error loading organization data');
        setLoading(false);
      }
    };

    loadOnboardingData();
  }, [orgNameFromUrl, searchParams, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '18px', color: '#6b7280' }}>
        טוען נתוני ארגון...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '18px', color: '#ef4444', gap: '16px' }}>
        <div>❌ {error}</div>
        <button onClick={() => router.push('/login')} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          חזור להתחברות
        </button>
      </div>
    );
  }

  if (!orgData) return null;

  return (
    <WabaOnboarding
      videoUrl="https://storage.googleapis.com/gambot_src/onboarding-vid.mp4"
      organization={orgData.organization}
      email={orgData.email}
      hasSim={orgData.hasSim}
      useFreeNumber={orgData.useFreeNumber}
      useCoexisting={orgData.useCoexisting}
      simPhoneNumber={orgData.simPhoneNumber}
      contactPhoneNumber={orgData.contactPhoneNumber}
      organizationName={orgData.organizationName}
      onPrevStep={() => router.push('/login')}
    />
  );
};

export default WabaOnboardingWrapperNext;

'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import WabaOnboarding from './WabaOnboarding';

const WabaOnboardingWrapperNext = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentLanguage, isRTL } = useLanguage();
  const he = currentLanguage !== 'en';

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
    const API = 'https://gambot.azurewebsites.net/api/Webhooks';

    // Fetch onboarding data for a SPECIFIC org id. Returns the data object, or null when the
    // org doesn't exist (GetOnboardingData returns success=false / 404). We rely on this null
    // to REFUSE onboarding a non-existent / "ghost" org.
    const fetchOnboardingData = async (org) => {
      if (!org) return null;
      try {
        const response = await fetch(`${API}/GetOnboardingData/${encodeURIComponent(org)}`);
        const data = await response.json();
        if (data?.success && data?.data) return data.data;
      } catch (e) {
        console.log(`[WabaOnboardingWrapperNext] GetOnboardingData('${org}') failed:`, e?.message);
      }
      return null;
    };

    // Resolve the REAL organization ids (ת.ז / ח.פ) that this email actually belongs to.
    // This is the anti-"ghost-org" guard: the /complete-waba query link historically carried
    // the email PREFIX as ?organization=, and blindly onboarding with it created a bogus org
    // during the Meta token exchange. The backend lookup scans each org's Users collection, so
    // ghost orgs (which have no Users doc) can NEVER be returned here.
    const resolveOrgsByEmail = async (email) => {
      if (!email || !email.includes('@')) return [];
      try {
        const response = await fetch(`${API}/GetOrganizationsByEmail`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        return (data?.organizations || [])
          .map(o => (o?.organization || '').toString().trim())
          .filter(Boolean);
      } catch (e) {
        console.log('[WabaOnboardingWrapperNext] GetOrganizationsByEmail failed:', e?.message);
        return [];
      }
    };

    const applyData = (d, fallbackEmail) => {
      setOrgData({
        organization: d.organization,
        organizationName: d.organizationName,
        email: d.email || fallbackEmail || '',
        hasSim: d.hasSim,
        useFreeNumber: d.useFreeNumber,
        useCoexisting: d.useCoexisting,
        simPhoneNumber: d.simPhoneNumber,
        contactPhoneNumber: d.contactPhoneNumber
      });
      setLoading(false);
    };

    const loadOnboardingData = async () => {
      try {
        const emailFromQuery = (searchParams.get('email') || '').trim();

        // Priority 1: Dynamic route parameter (/complete-waba/:organizationName)
        // This path form always carries the REAL org id (built by the backend / fixed
        // LoginErrorModal), so trust it — but if it somehow doesn't resolve, recover the real
        // org from the email instead of erroring out.
        if (orgNameFromUrl) {
          let d = await fetchOnboardingData(orgNameFromUrl);
          if (!d) {
            const realOrgs = await resolveOrgsByEmail(emailFromQuery);
            if (realOrgs.length >= 1) {
              console.log(`[WabaOnboardingWrapperNext] Path org '${orgNameFromUrl}' not found — recovered real org '${realOrgs[0]}' from email`);
              d = await fetchOnboardingData(realOrgs[0]);
            }
          }
          if (d) { applyData(d, emailFromQuery); return; }
          setError(`Organization '${orgNameFromUrl}' not found`);
          setLoading(false);
          return;
        }

        // Priority 2: Query parameters (/complete-waba?organization=X&email=Y)
        // ⚠️ 'organization' here is UNTRUSTED — old links passed the email prefix, which is
        // exactly what spawned ghost orgs. We therefore resolve the real org from the EMAIL
        // and only ever onboard an org the backend actually knows.
        const queryOrg = (searchParams.get('organization') || '').trim();
        const email = emailFromQuery;

        if (!email && !queryOrg) {
          router.replace('/login');
          return;
        }

        const realOrgs = await resolveOrgsByEmail(email);

        // Pick the org to onboard:
        //  1) if the query 'organization' is itself one of this email's real orgs → trust it
        //  2) otherwise the (first) real org resolved from the email
        let chosenOrg = null;
        if (queryOrg && realOrgs.some(o => o.toLowerCase() === queryOrg.toLowerCase())) {
          chosenOrg = queryOrg;
        } else if (realOrgs.length >= 1) {
          if (queryOrg) {
            console.warn(`[WabaOnboardingWrapperNext] Ignoring untrusted query organization '${queryOrg}' (likely an email prefix). Using real org '${realOrgs[0]}' from email.`);
          }
          chosenOrg = realOrgs[0];
        }

        let d = chosenOrg ? await fetchOnboardingData(chosenOrg) : null;

        // Last resort: the query org might be a real org not linked to the user via Users
        // (rare). Only use it if the backend CONFIRMS it exists — never onboard a ghost org.
        if (!d && queryOrg) {
          d = await fetchOnboardingData(queryOrg);
        }

        if (d) { applyData(d, email); return; }

        // Could not resolve a REAL organization. NEVER fall back to the raw query
        // 'organization' (email prefix) — that is precisely what created ghost orgs during the
        // token exchange. Send the user back to login with a clear message instead.
        console.error(`[WabaOnboardingWrapperNext] Could not resolve a real org (queryOrg='${queryOrg}', email='${email}', realOrgs=${JSON.stringify(realOrgs)})`);
        setError(he
          ? 'לא הצלחנו לאתר את הארגון שלך להשלמת החיבור. אנא התחבר/י מחדש למערכת (או פנה/י לתמיכה) והשלם/י את החיבור משם.'
          : "We couldn't locate your organization to complete the connection. Please sign in again (or contact support) and finish the connection from there.");
        setLoading(false);
      } catch (err) {
        setError(he ? 'שגיאה בטעינת נתוני הארגון' : 'Error loading organization data');
        setLoading(false);
      }
    };

    loadOnboardingData();
  }, [orgNameFromUrl, searchParams, router]);

  if (loading) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '18px', color: '#6b7280' }}>
        {he ? 'טוען נתוני ארגון...' : 'Loading organization data…'}
      </div>
    );
  }

  if (error) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '18px', color: '#ef4444', gap: '16px' }}>
        <div>❌ {error}</div>
        <button onClick={() => router.push('/login')} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          {he ? 'חזור להתחברות' : 'Back to sign in'}
        </button>
      </div>
    );
  }

  if (!orgData) return null;

  return (
    <WabaOnboarding
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

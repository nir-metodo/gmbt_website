import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import WabaOnboarding from './WabaOnboarding';

const WabaOnboardingWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { organizationName: orgNameFromUrl } = useParams(); // 🆕 Support dynamic route /complete-waba/:organizationName
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        // 🆕 Priority 1: Dynamic route parameter (/complete-waba/:organizationName)
        if (orgNameFromUrl) {
          console.log(`[WabaOnboardingWrapper] Loading data for organization: ${orgNameFromUrl}`);
          const apiUrl = `https://gambot.azurewebsites.net/api/Webhooks/GetOnboardingData/${encodeURIComponent(orgNameFromUrl)}`;
          console.log(`[WabaOnboardingWrapper] API URL: ${apiUrl}`);
          
          try {
            const response = await axios.get(apiUrl);
            console.log(`[WabaOnboardingWrapper] API Response:`, response.data);
            
            if (response.data?.success && response.data?.data) {
              const data = response.data.data;
              setOrgData({
                organization: data.organization,
                organizationName: data.organizationName,
                email: data.email,
                hasSim: data.hasSim,
                useFreeNumber: data.useFreeNumber,
                useCoexisting: data.useCoexisting,
                simPhoneNumber: data.simPhoneNumber,
                contactPhoneNumber: data.contactPhoneNumber
              });
              setLoading(false);
              return;
            } else {
              console.error(`[WabaOnboardingWrapper] API returned success=false or no data:`, response.data);
              setError(`Organization '${orgNameFromUrl}' not found`);
              setLoading(false);
              return;
            }
          } catch (apiError) {
            console.error(`[WabaOnboardingWrapper] API call failed:`, apiError);
            console.error(`[WabaOnboardingWrapper] Error details:`, apiError.response?.data || apiError.message);
            setError(`Failed to load organization data: ${apiError.message}`);
            setLoading(false);
            return;
          }
        }

        // Priority 2: Query parameters (/complete-waba?organization=X&email=Y)
        const params = new URLSearchParams(location.search);
        const organization = params.get('organization');
        const email = params.get('email');

        if (!organization || !email) {
          // Missing required parameters, redirect to login
          console.error('Missing required parameters for onboarding');
          navigate('/Login');
          return;
        }

        // Try to load full data from backend
        try {
          const response = await axios.get(`https://gambot.azurewebsites.net/api/Webhooks/GetOnboardingData/${encodeURIComponent(organization)}`);
          
          if (response.data?.success && response.data?.data) {
            const data = response.data.data;
            setOrgData({
              organization: data.organization,
              organizationName: data.organizationName,
              email: data.email || email, // Use email from URL as fallback
              hasSim: data.hasSim,
              useFreeNumber: data.useFreeNumber,
              useCoexisting: data.useCoexisting,
              simPhoneNumber: data.simPhoneNumber,
              contactPhoneNumber: data.contactPhoneNumber
            });
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.log('[WabaOnboardingWrapper] API call failed, using fallback data');
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
        console.error('[WabaOnboardingWrapper] Error loading data:', err);
        setError('Error loading organization data');
        setLoading(false);
      }
    };

    loadOnboardingData();
  }, [location.search, navigate, orgNameFromUrl]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        טוען נתוני ארגון...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#ef4444',
        gap: '16px'
      }}>
        <div>❌ {error}</div>
        <button
          onClick={() => navigate('/Login')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          חזור להתחברות
        </button>
      </div>
    );
  }

  if (!orgData) {
    return null;
  }

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
      onPrevStep={() => navigate('/Login')}
    />
  );
};

export default WabaOnboardingWrapper;

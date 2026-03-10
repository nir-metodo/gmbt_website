'use client';
  import React, { useEffect, useState } from 'react';
  import './FacebookLogin.css';
  import { useRouter } from 'next/navigation';
  import { FaFacebookF } from 'react-icons/fa';

  const FacebookLogin = ({organization , buisnessEmail , organizationName, isCoexisting = false, coexistingPhoneNumber}) => {
      const router = useRouter();
      const [isLoading, setIsLoading] = useState(false);
      const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    
    useEffect(() => {
      // Load the Facebook SDK
      const loadFbSdk = () => {
        window.fbAsyncInit = function () {
          window.FB.init({
            appId: '655177883181597',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v22.0',
          });
          setIsSDKLoaded(true);
        };

        // Load the SDK asynchronously
        (function (d, s, id) {
          var js,
            fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {
            return;
          }
          js = d.createElement(s);
          js.id = id;
          js.src = 'https://connect.facebook.net/en_US/sdk.js';
          fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
      };

      loadFbSdk();
    }, []);
    const exchangeTokenForBusinessToken = async (code, organization, fbResponse) => {
      try {
        const response = await fetch('https://gambot.azurewebsites.net/api/Webhooks/exchangeTokenForBusinessToken', {              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                  code,               // Pass the code received from Facebook
                  organization,       // Pass the organization received as prop
                  isCoexisting,       // Pass whether this is a co-existing setup
                  wabaId: fbResponse?.setup_info?.waba_id,  // WABA ID for co-existing
                  phoneNumberId: fbResponse?.setup_info?.phone_number_id,  // Phone number ID
                  coexistingPhoneNumber: coexistingPhoneNumber  // The WhatsApp Business phone number
              })
          });

          const data = await response.json();
          if (data?.message?.includes('successfully')) {
              console.log('Business token received:', data.businessToken);
              router.push('/login');
              // You can now use the business token to interact with the WhatsApp Business API
          } else {
              console.log('Error exchanging token');
          }
      } catch (error) {
          console.error('Error:', error);
      } finally {
          setIsLoading(false);
      }
  };

    const launchWhatsAppSignup = (event) => {
      // Prevent any event bubbling or default behavior
      event.preventDefault();
      event.stopPropagation();
      
      // Check if SDK is loaded and not already loading
      if (!isSDKLoaded || isLoading || !window.FB) {
        console.log('Facebook SDK not ready or already processing');
        return;
      }

      setIsLoading(true);
      
      window.FB.login(
        function (response) {
          if (response.authResponse) {
            const accessToken = response.authResponse.accessToken;
            console.log('✅ [Facebook Login] Access Token:', accessToken);
            console.log('✅ [Facebook Login] Full Response:', response);
            
            // ✅ Check if user selected co-existing or new WABA
            if (response.setup_info) {
              console.log('📱 [WABA Setup Info]:', response.setup_info);
              console.log('🆔 [WABA ID]:', response.setup_info?.waba_id);
              console.log('📞 [Phone Number ID]:', response.setup_info?.phone_number_id);
              console.log('🔄 [Mode]:', response.setup_info?.shared ? 'CO-EXISTING' : 'NEW');
            }
            console.log('🎯 [isCoexisting Prop]:', isCoexisting);
            
            exchangeTokenForBusinessToken(response.authResponse.code, organization, response);

            // Use this token to call the debug_token API and get the shared WABA's ID
          } else {
            console.log('User cancelled login or did not fully authorize.');
            setIsLoading(false);
          }
        },
        {
          ///config_id: '432095546293940', // configuration ID obtained in the previous step goes here
          ///config_id: '805398158064492', // configuration ID obtained in the previous step goes here
          config_id: '588741093999991', // configuration ID goes here
          response_type: 'code', // must be set to 'code' for System User access token
          override_default_response_type: true, // when true, any response types passed in the "response_type" will take precedence over the default types
          extras: {
            setup: {
              business: {
                email: buisnessEmail,
              },
              phone: {
                description: "חשבון וואטסאפ עסקי זה מופעל על ידי גמבוט עבור " + organizationName,
                ...(isCoexisting && coexistingPhoneNumber && { number: coexistingPhoneNumber.replace(/[^0-9]/g, '') }) // ✅ Pre-fill phone number for co-existing
              },
            },
            featureType: 'whatsapp_business_app_onboarding',
            sessionInfoVersion: '3',
            
            // ✅ Force specific mode based on Step 2 selection
            ...(isCoexisting 
              ? { allow_existing: true }  // ✅ Force CO-EXISTING only (hide NEW option)
              : { allow_existing: false } // ✅ Force NEW only (hide CO-EXISTING option)
            )
          },
        }
      );
    };

    return (
      <button 
        className={`fb-login-button ${isLoading ? 'loading' : ''}`}
        onClick={launchWhatsAppSignup}
        disabled={!isSDKLoaded || isLoading}
        type="button"
      >
        {isLoading ? (
          <>
            <div className="loading-spinner"></div>
            <span>מתחבר לפייסבוק...</span>
          </>
        ) : (
          <>
            <FaFacebookF className="fb-icon" />
            <span>התחבר דרך Facebook</span>
          </>
        )}
      </button>
    );
  };

  export default FacebookLogin;

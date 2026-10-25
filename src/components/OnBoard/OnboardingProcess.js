import React, { useState, useEffect } from 'react';
import PlanSelection from './PlanSelection';
import SimSelection from './SimSelection';
import BasicInfo from './BasicInfo';
import ProgressBar from './ProgressBar';
import WabaOnboarding from './WabaOnboarding';
import Verification from './Verification';
import './OnboardingProcess.css';
import { useLanguage } from '@/contexts/LanguageContext';
import axiosInstance from './axiosInstance';

const STORAGE_KEY = 'gambot_onboarding_state';

const OnboardingProcess = () => {
    const { isRTL } = useLanguage();

    // Restore saved state from localStorage (survives page refresh)
    const saved = (() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    })();

    const [step, setStep] = useState(saved?.step || 1);
    const [plan, setPlan] = useState(saved?.plan || null);
    const [hasSim, setHasSim] = useState(saved?.hasSim || false);
    const [useFreeNumber, setUseFreeNumber] = useState(saved?.useFreeNumber || false);
    const [useCoexisting, setUseCoexisting] = useState(saved?.useCoexisting || false);
    const [organizationPhoneNumber, setOrganizationPhoneNumber] = useState(saved?.organizationPhoneNumber || '');
    const [isPhoneNumberSelected, setIsPhoneNumberSelected] = useState(saved?.isPhoneNumberSelected || false);
    const [forwardingPhoneNumber, setForwardingPhoneNumber] = useState(saved?.forwardingPhoneNumber || '');
    const [paymentCycle, setPaymentCycle] = useState(saved?.paymentCycle || 'monthly');
    const [verificationCode, setVerificationCode] = useState('');

    const [companyInfo, setCompanyInfo] = useState(saved?.companyInfo || {
        companyName: '',
        organizationName: '',
        companyUrl: '',
        contactFullName: '',
        contactEmail: '',
        timezone: '',
        contactPhoneNumber: '',
    });

    const videoUrl = 'https://storage.googleapis.com/gambot_src/onboarding-vid.mp4';

    // Persist onboarding state to localStorage on every change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                step, plan, hasSim, useFreeNumber, useCoexisting,
                organizationPhoneNumber, isPhoneNumberSelected,
                forwardingPhoneNumber, paymentCycle, companyInfo
            }));
        } catch { }
    }, [step, plan, hasSim, useFreeNumber, useCoexisting, organizationPhoneNumber, isPhoneNumberSelected, forwardingPhoneNumber, paymentCycle, companyInfo]);

    // Every step change starts at the top of the wizard (the sticky stepper stays in view).
    // Skipped on first render so a restored step doesn't jump the page.
    const isFirstRender = React.useRef(true);
    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    // Track EVERY visitor who lands on the onboarding page (especially paid traffic carrying UTM
    // params) into the root "CampaignLeads" collection - attribution even before they sign up.
    // Fire-and-forget, once per browser session so a refresh / step change doesn't duplicate it.
    useEffect(() => {
        try {
            if (sessionStorage.getItem('gambot_landing_tracked')) return;
            const params = new URLSearchParams(window.location.search);
            const get = (k) => params.get(k) || '';
            const payload = {
                utm_source: get('utm_source'),
                utm_medium: get('utm_medium'),
                utm_campaign: get('utm_campaign'),
                utm_content: get('utm_content'),
                utm_term: get('utm_term'),
                fbclid: get('fbclid'),
                gclid: get('gclid'),
                landingPage: window.location.pathname,
                fullUrl: window.location.href,
                referrer: (typeof document !== 'undefined' && document.referrer) || '',
                userAgent: (typeof navigator !== 'undefined' && navigator.userAgent) || '',
                language: (typeof navigator !== 'undefined' && navigator.language) || '',
            };
            sessionStorage.setItem('gambot_landing_tracked', '1');
            axiosInstance.post('/api/Webhooks/TrackLandingLead', payload).catch(() => { });
        } catch { }
    }, []);

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    return (
        <div className={`onboarding-process-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Sticky stepper — sits right under the site navbar (which already has language + login) */}
            <header className="wz-header">
                <ProgressBar step={step} />
            </header>

            <main className="onboarding-step-wrapper">
                <div className="onboarding-step-content" key={step}>
                    {step === 1 && (
                        <PlanSelection
                            plan={plan}
                            setPlan={setPlan}
                            nextStep={nextStep}
                            paymentCycle={paymentCycle}
                            setPaymentCycle={setPaymentCycle}
                        />
                    )}
                    {step === 2 && (
                        <SimSelection
                            hasSim={hasSim}
                            setHasSim={setHasSim}
                            useFreeNumber={useFreeNumber}
                            setUseFreeNumber={setUseFreeNumber}
                            useCoexisting={useCoexisting}
                            setUseCoexisting={setUseCoexisting}
                            organizationPhoneNumber={organizationPhoneNumber}
                            setOrganizationPhoneNumber={setOrganizationPhoneNumber}
                            isPhoneNumberSelected={isPhoneNumberSelected}
                            setForwardingPhoneNumber={setForwardingPhoneNumber}
                            forwardingPhoneNumber={forwardingPhoneNumber}
                            setIsPhoneNumberSelected={setIsPhoneNumberSelected}
                            nextStep={nextStep}
                            prevStep={prevStep}
                        />
                    )}
                    {step === 3 && (
                        <BasicInfo
                            companyInfo={companyInfo}
                            setCompanyInfo={setCompanyInfo}
                            nextStep={nextStep}
                            prevStep={prevStep}
                        />
                    )}
                    {step === 4 && (
                        <Verification
                            companyInfo={companyInfo}
                            name={companyInfo?.contactFullName}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            hasSim={hasSim}
                            useFreeNumber={useFreeNumber}
                            useCoexisting={useCoexisting}
                            plan={plan}
                            paymentCyctle={paymentCycle}
                            organizationPhoneNumber={organizationPhoneNumber}
                            forwardingPhoneNumber={forwardingPhoneNumber}
                            verificationCode={verificationCode}
                            setVerificationCode={setVerificationCode}
                        />
                    )}
                    {step === 5 && (
                        <WabaOnboarding
                            videoUrl={videoUrl}
                            onPrevStep={prevStep}
                            organization={companyInfo?.organizationName}
                            email={companyInfo?.contactEmail}
                            hasSim={hasSim}
                            useFreeNumber={useFreeNumber}
                            useCoexisting={useCoexisting}
                            contactPhoneNumber={companyInfo?.contactPhoneNumber}
                            simPhoneNumber={organizationPhoneNumber}
                            organizationName={companyInfo?.companyName}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default OnboardingProcess;

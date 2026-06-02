    import React, { useState, useEffect } from 'react';
import PlanSelection from './PlanSelection';
import SimSelection from './SimSelection';
import BasicInfo from './BasicInfo';
import Payment from './Payment';
import ProgressBar from './ProgressBar';
import WabaOnboarding from './WabaOnboarding';
import './OnboardingProcess.css';
import Verification from './Verification';
import { FaUserPlus, FaRocket, FaCheckCircle } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { MdSecurity, MdSpeed } from 'react-icons/md';
import { useLanguage } from '@/contexts/LanguageContext';

    const STORAGE_KEY = 'gambot_onboarding_state';

    const OnboardingProcess = () => {
        const { t, isRTL } = useLanguage();
        
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

        // 🔍 DEBUG: Log organizationName whenever companyInfo changes
        useEffect(() => {
            if (companyInfo.organizationName) {
                console.log('🏢 [OnboardingProcess] Organization Name:', companyInfo.organizationName);
                console.log('📋 [OnboardingProcess] Full Company Info:', companyInfo);
                console.log('📍 [OnboardingProcess] Current Step:', step);
            }
        }, [companyInfo, step]);

        // Scroll to top on each step change
        useEffect(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, [step]);

        const nextStep = () => {
            setStep(step + 1);
        };

        const prevStep = () => {
            setStep(step - 1);
        };

        return (
            <div className={`onboarding-process-container ${isRTL ? 'rtl' : 'ltr'}`}>
                {/* Enhanced Header */}
                <div className="onboarding-header">
                    <div className="header-badge">
                        <HiOutlineSparkles className="sparkle-icon" />
                        <span>{t('onboarding.header.badge')}</span>
                    </div>
                    <h1 className="onboarding-title">
                        <FaUserPlus className="title-icon" />
                        {t('onboarding.header.title')}
                    </h1>
                    <p className="onboarding-subtitle">
                        {t('onboarding.header.subtitle')}
                    </p>
                    <div className="onboarding-features">
                        <div className="feature-item">
                            <MdSpeed className="feature-icon" />
                            <span>{t('onboarding.header.features.fast')}</span>
                        </div>
                        <div className="feature-item">
                            <MdSecurity className="feature-icon" />
                            <span>{t('onboarding.header.features.secure')}</span>
                        </div>
                        <div className="feature-item">
                            <FaRocket className="feature-icon" />
                            <span>{t('onboarding.header.features.ready')}</span>
                        </div>
                    </div>
                </div>

                <ProgressBar step={step} />
                
                <div className="onboarding-step-wrapper">
                    <div className="onboarding-step-content">
                    {step === 1 && (
                        <PlanSelection 
                            plan={plan}
                            setPlan={setPlan}
                            nextStep={nextStep}
                            paymentCycle={paymentCycle}  // Pass paymentCycle state to PlanSelection
                            setPaymentCycle={setPaymentCycle}  // Pass setPaymentCycle to update paymentCycle
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
                            name = {companyInfo?.contactFullName}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            hasSim={hasSim}
                            useFreeNumber={useFreeNumber}
                            useCoexisting={useCoexisting}
                            plan={plan}
                            paymentCyctle={paymentCycle}
                            organizationPhoneNumber={organizationPhoneNumber}
                            forwardingPhoneNumber={forwardingPhoneNumber}
                            verificationCode={verificationCode}  // Pass verificationCode as a prop
                            setVerificationCode={setVerificationCode}  // Pass the setVerificationCode function as a prop
                        />
                    )}
                    {/* {step === 4 && (
                        <Payment 
                            plan={plan}
                            hasSim={hasSim}
                            organizationPhoneNumber={organizationPhoneNumber}
                            companyInfo={companyInfo} 
                            forwardingPhoneNumber={forwardingPhoneNumber}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            paymentCycle={paymentCycle}  // Pass paymentCycle to Payment
                        />
                    )} */}
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
                </div>
            </div>
        );
    };

    export default OnboardingProcess;

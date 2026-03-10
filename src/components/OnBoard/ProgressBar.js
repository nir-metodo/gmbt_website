import React from 'react';
import './ProgressBar.css';
import { FaCreditCard, FaMobileAlt, FaUser, FaShieldAlt, FaWhatsapp, FaCheck } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

const ProgressBar = ({ step }) => {
    const { t, isRTL } = useLanguage();
    
    const steps = [
        { label: t('onboarding.progressBar.steps.planSelection'), icon: FaCreditCard },
        { label: t('onboarding.progressBar.steps.simSelection'), icon: FaMobileAlt },
        { label: t('onboarding.progressBar.steps.personalInfo'), icon: FaUser },
        { label: t('onboarding.progressBar.steps.verification'), icon: FaShieldAlt },
        { label: t('onboarding.progressBar.steps.whatsappAccount'), icon: FaWhatsapp }
    ];

    return (
        <div className={`progress-container ${isRTL ? 'rtl' : 'ltr'}`}>
            <div 
                className={`progress-wrapper step-${step}`}
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={steps.length}
                aria-valuenow={step}
                aria-label={t('onboarding.progressBar.accessibility.progressLabel', { current: step, total: steps.length })}
            >
                <div className={`progress-line step-${step}`}></div>
                {steps.map((stepItem, index) => {
                    const isActive = index + 1 <= step;
                    const isCompleted = index + 1 < step;
                    const IconComponent = stepItem.icon;
                    
                    return (
                        <div 
                            className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`} 
                            key={index}
                            role="listitem"
                            aria-current={isActive && !isCompleted ? 'step' : undefined}
                            aria-label={t('onboarding.progressBar.accessibility.stepLabel', { number: index + 1, label: stepItem.label })}
                        >
                            <div 
                                className="step-circle"
                                aria-hidden="true"
                            >
                                {isCompleted ? (
                                    <FaCheck className="check-icon" aria-label={t('onboarding.progressBar.accessibility.completed')} />
                                ) : isActive ? (
                                    <IconComponent className="step-icon" />
                                ) : (
                                    <span className="progress-step-number">{index + 1}</span>
                                )}
                            </div>
                            <div className="step-label">{stepItem.label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;

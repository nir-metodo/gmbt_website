import React from 'react';
import './ProgressBar.css';
import { FaCreditCard, FaMobileAlt, FaUser, FaShieldAlt, FaWhatsapp, FaCheck } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

// Wizard stepper. Desktop: numbered circles with labels joined by a progress line.
// Mobile: the circles shrink and only the active step keeps its label ("Step 2 of 5" summary above).
const ProgressBar = ({ step }) => {
    const { t, isRTL, currentLanguage } = useLanguage();

    const steps = [
        { label: t('onboarding.progressBar.steps.planSelection'), icon: FaCreditCard },
        { label: t('onboarding.progressBar.steps.simSelection'), icon: FaMobileAlt },
        { label: t('onboarding.progressBar.steps.personalInfo'), icon: FaUser },
        { label: t('onboarding.progressBar.steps.verification'), icon: FaShieldAlt },
        { label: t('onboarding.progressBar.steps.whatsappAccount'), icon: FaWhatsapp }
    ];

    const percent = steps.length > 1 ? ((step - 1) / (steps.length - 1)) * 100 : 0;
    const stepWord = currentLanguage === 'he' ? 'שלב' : 'Step';
    const ofWord = currentLanguage === 'he' ? 'מתוך' : 'of';

    return (
        <div className={`progress-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="progress-summary" aria-hidden="true">
                <span className="progress-summary-step">{stepWord} {step} {ofWord} {steps.length}</span>
                <span className="progress-summary-label">{steps[step - 1]?.label}</span>
            </div>
            <ol
                className={`progress-wrapper step-${step}`}
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={steps.length}
                aria-valuenow={step}
                aria-label={t('onboarding.progressBar.accessibility.progressLabel', { current: step, total: steps.length })}
            >
                <li className="progress-track" aria-hidden="true">
                    <span className="progress-line" style={{ width: `${percent}%` }} />
                </li>
                {steps.map((stepItem, index) => {
                    const number = index + 1;
                    const isCurrent = number === step;
                    const isCompleted = number < step;
                    const IconComponent = stepItem.icon;

                    return (
                        <li
                            className={`progress-step ${isCurrent ? 'active current' : ''} ${isCompleted ? 'completed' : ''}`}
                            key={index}
                            aria-current={isCurrent ? 'step' : undefined}
                            aria-label={t('onboarding.progressBar.accessibility.stepLabel', { number, label: stepItem.label })}
                        >
                            <span className="step-circle" aria-hidden="true">
                                {isCompleted ? (
                                    <FaCheck className="check-icon" />
                                ) : isCurrent ? (
                                    <IconComponent className="step-icon" />
                                ) : (
                                    <span className="progress-step-number">{number}</span>
                                )}
                            </span>
                            <span className="step-label">{stepItem.label}</span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default ProgressBar;

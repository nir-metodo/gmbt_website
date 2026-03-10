'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaExclamationTriangle, FaCreditCard, FaRocket, FaWhatsapp, FaTimes } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import './LoginErrorModal.css';

const LoginErrorModal = ({ isOpen, onClose, errorType, organizationName, email }) => {
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  // Error configurations
  const errorConfigs = {
    invalid_credentials: {
      icon: <MdError />,
      iconColor: '#ef4444',
      title: t('loginError.invalidCredentials.title'),
      message: t('loginError.invalidCredentials.message'),
      actions: []
    },
    trial_expired: {
      icon: <FaExclamationTriangle />,
      iconColor: '#f59e0b',
      title: t('loginError.trialExpired.title'),
      message: t('loginError.trialExpired.message'),
      actions: [
        {
          label: t('loginError.trialExpired.completePaymentButton'),
          icon: <FaCreditCard />,
          color: 'primary',
          link: `/AddPayment?organization=${organizationName}&email=${email}`
        }
      ]
    },
    suspended: {
      icon: <FaExclamationTriangle />,
      iconColor: '#dc2626',
      title: t('loginError.suspended.title'),
      message: t('loginError.suspended.message'),
      actions: []
    },
    waiting_onboarding: {
      icon: <FaRocket />,
      iconColor: '#3b82f6',
      title: t('loginError.waitingOnboarding.title'),
      message: t('loginError.waitingOnboarding.message'),
      actions: [
        {
          label: t('loginError.waitingOnboarding.completeOnboardingButton'),
          icon: <FaRocket />,
          color: 'primary',
          link: `/complete-waba?organization=${organizationName}&email=${email}`
        }
      ]
    },
    payment_failed: {
      icon: <FaCreditCard />,
      iconColor: '#dc2626',
      title: t('loginError.paymentFailed.title'),
      message: t('loginError.paymentFailed.message'),
      actions: [
        {
          label: t('loginError.paymentFailed.updatePaymentButton'),
          icon: <FaCreditCard />,
          color: 'primary',
          link: `/AddPayment?organization=${organizationName}&email=${email}`
        }
      ]
    },
    general_error: {
      icon: <MdError />,
      iconColor: '#6b7280',
      title: t('loginError.generalError.title'),
      message: t('loginError.generalError.message'),
      actions: []
    }
  };

  const config = errorConfigs[errorType] || errorConfigs.general_error;
  const whatsappNumber = '+972 3-376-8997';
  const whatsappLink = `https://wa.me/972337368997`;

  return (
    <div className="login-error-modal-overlay" onClick={onClose}>
      <div 
        className={`login-error-modal ${isRTL ? 'rtl' : 'ltr'}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="login-error-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Icon */}
        <div className="login-error-modal-icon" style={{ color: config.iconColor }}>
          {config.icon}
        </div>

        {/* Title */}
        <h2 className="login-error-modal-title">{config.title}</h2>

        {/* Message */}
        <p className="login-error-modal-message">{config.message}</p>

        {/* Action Buttons */}
        {config.actions.length > 0 && (
          <div className="login-error-modal-actions">
            {config.actions.map((action, index) => (
              <a
                key={index}
                href={action.link}
                className={`login-error-modal-btn login-error-modal-btn-${action.color}`}
              >
                {action.icon}
                <span>{action.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* WhatsApp Support */}
        <div className="login-error-modal-support">
          <p className="login-error-modal-support-text">{t('loginError.needHelp')}</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="login-error-modal-whatsapp"
          >
            <FaWhatsapp />
            <span>{t('loginError.contactSupport')}</span>
          </a>
        </div>

        {/* Close Button (Bottom) */}
        <button className="login-error-modal-btn-secondary" onClick={onClose}>
          {t('common.close')}
        </button>
      </div>
    </div>
  );
};

export default LoginErrorModal;

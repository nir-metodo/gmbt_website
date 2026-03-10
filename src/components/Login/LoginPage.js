'use client';
import { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaUser, FaBuilding, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { useLanguage } from '@/contexts/LanguageContext';
import LoginErrorModal from './LoginErrorModal';
import './Login.css';

const APP_URL = 'https://app.gambot.co.il';
const API_URL = 'https://gambot.azurewebsites.net';

export default function LoginPage() {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorType, setModalErrorType] = useState('general_error');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const resetFormStates = () => {
    setEmail(''); setPassword(''); setResetEmail('');
    setEmailError(''); setPasswordError(''); setResetMessage('');
  };

  const handleShowForgotPassword = () => { resetFormStates(); setShowForgotPassword(true); };
  const handleShowLoginForm = () => { resetFormStates(); setShowForgotPassword(false); };

  const signInWithEmailAndPassword = async () => {
    setEmailError(''); setPasswordError('');

    if (!isValidEmail(email)) { setEmailError(t('login.invalidEmail')); return; }
    if (!password) { setPasswordError(t('login.passwordRequired')); return; }
    if (email === 'info@gambot.co.il' && !organization) {
      setEmailError(t('login.organizationRequired')); return;
    }

    setIsLoading(true);

    try {
      const endpoint = email === 'info@gambot.co.il'
        ? '/api/Webhooks/authenticateInfoByOrg'
        : '/api/Webhooks/authenticate';

      const payload = email === 'info@gambot.co.il'
        ? { username: email, password, organization }
        : { username: email, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data?.Success) throw Object.assign(new Error(data?.Message || 'Login failed'), { response: { data, status: res.status } });

      const user = data.userData;
      const token = data?.userCredential?.Credential?.IdToken;
      const refreshToken = data?.userCredential?.Credential?.RefreshToken;

      const rawLanguage = user?.Language || user?.language || 'hebrew';
      const normalizedLang = rawLanguage.toLowerCase();
      const userLanguage = (normalizedLang === 'english' || normalizedLang === 'en') ? 'en' : 'he';

      const newUser = {
        fullname: user.UserName || user.userName || email,
        email: user.UserEmail || user.userEmail || email,
        photoURL: data.userCredential?.photoURL || null,
        userId: data.userCredential?.Uid || user.uID,
        organization: email === 'info@gambot.co.il' ? organization : (user.Organization || user.organization),
        wabaNumber: user.wabaNumber || null,
        timeZone: user?.timeZone || null,
        phoneNumber: user?.PhoneNumber || user?.phoneNumber || null,
        uID: user?.uID || null,
        Email: user?.Email || user?.email || email,
        PhoneNumber: user?.PhoneNumber || user?.phoneNumber || null,
        authToken: token,
        refreshToken: refreshToken || null,
        SecurityRole: user?.SecurityRole || user?.securityRole || 'Admin',
        Permissions: user?.Permissions || user?.permissions || null,
        hasItsOwnSim: user?.hasItsOwnSim || false,
        planName: user?.PlanName || user?.planName || null,
        language: userLanguage,
        Language: userLanguage,
      };

      // Encode user data for cross-domain handoff
      const encodedUser = btoa(encodeURIComponent(JSON.stringify(newUser)));

      // Redirect to app.gambot.co.il/auth with token and user data
      window.location.href = `${APP_URL}/auth?user=${encodedUser}&token=${encodeURIComponent(token || '')}`;

    } catch (error) {
      console.error('Login Error:', error);
      let errorType = 'general_error';

      if (error.response?.data?.ErrorCode) {
        errorType = error.response.data.ErrorCode;
      } else {
        const msg = error.response?.data?.Message || error.message || '';
        if (error.response?.status === 401) errorType = 'invalid_credentials';
        else if (msg.includes('trial period has ended') || msg.includes('Trial period has expired')) errorType = 'trial_expired';
        else if (msg.includes('suspended')) errorType = 'suspended';
        else if (msg.includes('account setup is incomplete') || msg.includes('complete the onboarding process')) errorType = 'waiting_onboarding';
        else if (msg.includes('payment')) errorType = 'payment_failed';
        else if (error.response?.data?.error?.message) {
          const fb = error.response.data.error.message;
          if (fb.includes('INVALID_LOGIN_CREDENTIALS') || fb.includes('INVALID_PASSWORD')) errorType = 'invalid_credentials';
        }
      }

      setModalErrorType(errorType);
      setShowErrorModal(true);
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setResetMessage(''); setEmailError('');
    if (!isValidEmail(resetEmail)) { setEmailError(t('login.invalidEmail')); return; }

    setIsRecoveryLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/Webhooks/forgotPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      setResetMessage(data?.Success ? t('login.recoveryEmailSent') : t('login.emailNotFound'));
      setResetEmail('');
    } catch (error) {
      console.error('Forgot Password Error:', error);
      setResetMessage(error.response?.status === 404 ? t('login.userNotFound') : t('login.recoveryError'));
      setResetEmail('');
    } finally {
      setIsRecoveryLoading(false);
    }
  };

  return (
    <div className={`login-page ${isRTL ? 'rtl' : 'ltr'}`} style={{ minHeight: '100vh', paddingTop: '68px' }}>
      <div className="login-container">
        <div className="login-header">
          <div className="login-badge">
            <HiOutlineSparkles className="sparkle-icon" />
            <span>{t('login.secureArea')}</span>
          </div>
          <h1 className="login-title">
            {showForgotPassword ? t('login.passwordRecovery') : t('login.title')}
          </h1>
          <div className="security-indicator">
            <FaShieldAlt className="security-icon" />
            <span>{t('login.sslSecure')}</span>
          </div>
        </div>

        {!showForgotPassword ? (
          <div className="login-form">
            <div className="form-fields">
              <div className="input-group">
                <div className="input-wrapper">
                  <MdEmail className="login-input-icon" />
                  <input type="email" placeholder={t('login.emailPlaceholder')} value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`form-input ${emailError ? 'error' : ''}`} disabled={isLoading} />
                </div>
                {emailError && <p className="error-message">{emailError}</p>}
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  {password ? (
                    <button type="button" className="login-input-icon login-password-toggle-icon"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  ) : (
                    <FaLock className="login-input-icon" />
                  )}
                  <input type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.passwordPlaceholder')} value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`form-input ${passwordError ? 'error' : ''}`} disabled={isLoading} />
                </div>
                {passwordError && <p className="error-message">{passwordError}</p>}
              </div>

              {email === 'info@gambot.co.il' && (
                <div className="input-group">
                  <div className="input-wrapper">
                    <FaBuilding className="login-input-icon" />
                    <input type="text" placeholder={t('login.organizationPlaceholder')} value={organization}
                      onChange={e => setOrganization(e.target.value)}
                      className="form-input" disabled={isLoading} />
                  </div>
                </div>
              )}

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)} disabled={isLoading} />
                  <span className="login-checkmark"></span>
                  {t('login.rememberMe')}
                </label>
                <button type="button" className="forgot-link" onClick={handleShowForgotPassword} disabled={isLoading}>
                  {t('login.forgotPassword')}
                </button>
              </div>
            </div>

            <button className={`login-btn ${isLoading ? 'loading' : ''}`}
              onClick={signInWithEmailAndPassword} disabled={isLoading}>
              {isLoading ? (
                <><span className="loading-spinner"></span><span>{t('login.loggingIn')}</span></>
              ) : (
                <><FaUser className="btn-icon" /><span>{t('login.loginButton')}</span></>
              )}
            </button>
          </div>
        ) : (
          <div className="recovery-form">
            <div className="recovery-info"><p>{t('login.recoveryInfo')}</p></div>
            <div className="form-fields">
              <div className="input-group">
                <div className="input-wrapper">
                  <MdEmail className="login-input-icon" />
                  <input type="email" placeholder={t('login.emailPlaceholder')} value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className={`form-input ${emailError ? 'error' : ''}`} disabled={isRecoveryLoading} />
                </div>
                {emailError && <p className="error-message">{emailError}</p>}
              </div>
            </div>

            <button className={`recovery-btn ${isRecoveryLoading ? 'loading' : ''}`}
              onClick={handleForgotPassword} disabled={isRecoveryLoading}>
              {isRecoveryLoading ? (
                <><span className="loading-spinner"></span><span>{t('login.sending')}</span></>
              ) : (
                <><MdEmail className="btn-icon" /><span>{t('login.sendRecoveryLink')}</span></>
              )}
            </button>

            {resetMessage && (
              <div className={`message-banner ${resetMessage.includes('נשלח') ? 'success' : 'error'}`}>
                <span>{resetMessage}</span>
              </div>
            )}

            <button className="back-link" onClick={handleShowLoginForm} disabled={isRecoveryLoading}>
              <FaArrowLeft className="back-icon" />
              <span>{t('login.backToLogin')}</span>
            </button>
          </div>
        )}
      </div>

      <LoginErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorType={modalErrorType}
        organizationName={organization || email.split('@')[0]}
        email={email}
      />
    </div>
  );
}

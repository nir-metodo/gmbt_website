'use client';
import { useState } from "react";
import { sendLeadWebhook } from '@/utils/sendLeadWebhook';
import "./ContactUs.css";
import { FaPhone, FaPaperPlane, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail, MdSend } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa6";
import { CiInstagram, CiFacebook, CiLinkedin, CiYoutube } from "react-icons/ci";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useLanguage } from '@/contexts/LanguageContext';

const GambotLogo = '/new_logo.png';




const ContactUs = () => {
    const { t, isRTL } = useLanguage();
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus(null);
  
      // Prepare data to send
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        ClientId: "R9f6r4oe5PSCLr6CnYRQ", // Example ClientId, replace with actual if needed
        source: "Gambot Website - Contact Us Page",
      };
  
      try {
        // Send request to the endpoint
        const [response] = await Promise.allSettled([
          fetch("https://prod-63.northeurope.logic.azure.com:443/workflows/ddf6cff7db1b4d438d460e8c4221e768/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ll3QhRKnU64AkU4nk7kF31ob5ZrQzdJElP_ubUtKM5o", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
          }),
          sendLeadWebhook({ name: formData.name, email: formData.email, phone: formData.phone, message: formData.message }),
        ]);
  
        // Check if the primary request was successful
        if (response.status === 'fulfilled' && response.value?.ok) {
          setSubmitStatus('success');
          setFormData({ name: "", email: "", phone: "", message: "" });
        } else {
          console.error('Request failed:', response);
          setSubmitStatus('error');
        }
      } catch (error) {
        console.error('Error during request:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    };
  
  
    return (
      <div className={`ContactUsContainer ${isRTL ? 'rtl' : 'ltr'}`} style={{ paddingTop: '68px' }}>
        {/* Enhanced Header */}
        <div className="contact-header">
          <div className="contact-header-badge">
            <HiOutlineSparkles className="sparkle-icon" />
            <span>{t('websiteContact.professionalSupport')}</span>
          </div>
          <h1 className="contact-title">{t('websiteContact.title')}</h1>
          <p className="contact-subtitle">
            <FaClock className="subtitle-icon" />
            {t('websiteContact.subtitle')}
          </p>
        </div>

        <div className="contact-container">
          {/* Enhanced Contact Form */}
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <h2>{t('websiteContact.formTitle')}</h2>
                <p>{t('websiteContact.formSubtitle')}</p>
              </div>

              <div className="form-fields">
                <div className="form-group">
                  <label htmlFor="name">{t('websiteContact.nameLabel')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('websiteContact.namePlaceholder')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
      
                <div className="form-group">
                  <label htmlFor="email">{t('websiteContact.emailLabel')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('websiteContact.emailPlaceholder')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
      
                <div className="form-group">
                  <label htmlFor="phone">{t('websiteContact.phoneLabel')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('websiteContact.phonePlaceholder')}
                    disabled={isSubmitting}
                  />
                </div>
      
                <div className="form-group message-group">
                  <label htmlFor="message">{t('websiteContact.messageLabel')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('websiteContact.messagePlaceholder')}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
      
              <div className="form-footer">
                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>{t('websiteContact.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <MdSend className="send-icon" />
                      <span>{t('websiteContact.submitButton')}</span>
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="status-message success">
                    <FaCheckDouble className="status-icon" />
                    <span>{t('websiteContact.successMessage')}</span>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="status-message error">
                    <span>{t('websiteContact.errorMessage')}</span>
                  </div>
                )}
              </div>
            </form>
          </div>


          {/* Enhanced Additional Info */}
          <div className="contact-info-wrapper">
            <div className="contact-info">
              <div className="info-header">
                <img src={GambotLogo} alt="Gambot Logo" className="info-logo"/>
                <div className="info-header-text">
                  <h2>{t('websiteContact.contactInfo')}</h2>
                  <p>{t('websiteContact.contactInfoSubtitle')}</p>
                </div>
              </div>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon email-icon">
                    <MdEmail />
                  </div>
                  <div className="method-content">
                    <h3>{t('websiteContact.emailContact')}</h3>
                    <p>info@GamBot.co.il</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon phone-icon">
                    <FaPhone />
                  </div>
                  <div className="method-content">
                    <h3>{t('websiteContact.phoneContact')}</h3>
                    <p>055-985-9052</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon location-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="method-content">
                    <h3>{t('websiteContact.locationContact')}</h3>
                    <p>{t('websiteContact.location')}</p>
                  </div>
                </div>
              </div>

              <div className="whatsapp-notice">
                <div className="notice-content">
                  <FaPaperPlane className="notice-icon" />
                  <p>{t('websiteContact.whatsappNotice')}</p>
                </div>
              </div>

              <div className="social-links">
                <h3>{t('websiteContact.followUs')}</h3>
                <div className="social-icons">
                  <a href="https://www.instagram.com/gambot_il" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                    <CiInstagram />
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61553659007668" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                    <CiFacebook />
                  </a>
                  <a href="https://www.linkedin.com/company/gambot-platform" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                    <CiLinkedin />
                  </a>
                  <a href="https://www.youtube.com/@Gambot-IL" target="_blank" rel="noopener noreferrer" className="social-link youtube">
                    <CiYoutube />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    );
  };
  
  export default ContactUs;
  
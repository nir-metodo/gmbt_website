'use client';
import './TermOfUse.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { HebrewContent, EnglishContent } from './PrivacyPolicyContent';

const PrivacyPolicy = () => {
  const { currentLanguage } = useLanguage();
  const isHebrew = currentLanguage === 'he';
  
  return (
    <div className="TermOfUse-container" dir={isHebrew ? 'rtl' : 'ltr'}>
      <h1 className="TermOfUse-header">
        {isHebrew ? 'מדיניות פרטיות' : 'Privacy Policy'}
      </h1>
      
      <div style={{ textAlign: 'center', marginBottom: '30px', color: '#666', fontSize: '14px' }}>
        <p style={{ margin: '5px 0' }}>
          {isHebrew 
            ? `תאריך עדכון אחרון: ${new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}`
            : `Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
          }
        </p>
      </div>

      {isHebrew ? <HebrewContent /> : <EnglishContent />}
    </div>
  );
};

export default PrivacyPolicy;

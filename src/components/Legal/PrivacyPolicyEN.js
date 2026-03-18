'use client';
import './TermOfUse.css';
import { EnglishContent } from './PrivacyPolicyContent';

const PrivacyPolicyEN = () => {
  return (
    <div className="TermOfUse-container" dir="ltr">
      <h1 className="TermOfUse-header">Privacy Policy</h1>

      <div style={{ textAlign: 'center', marginBottom: '30px', color: '#666', fontSize: '14px' }}>
        <p style={{ margin: '5px 0' }}>
          {`Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
        </p>
      </div>

      <EnglishContent />
    </div>
  );
};

export default PrivacyPolicyEN;

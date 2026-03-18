'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';
import { FaFileSignature, FaCheckCircle } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './PublicSigningPage.css';

const gambotLogo = '/new_logo.png';

const PublicSigningPage = () => {
  // Parse /:organization/esignature/:documentId/sign/:token from window.location.pathname
  const pathParts = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '').split('/') : [];
  // Expected: ['', ':org', 'esignature', ':docId', 'sign', ':token']
  const signIdx = pathParts.indexOf('sign');
  const esigIdx = pathParts.indexOf('esignature');
  const organization = esigIdx > 0 ? pathParts[esigIdx - 1] : null;
  const documentId = esigIdx > 0 ? pathParts[esigIdx + 1] : null;
  const token = signIdx > 0 ? pathParts[signIdx + 1] : null;
  const searchParams = useSearchParams();
  
  // Get language from URL query params first
  const urlLang = searchParams?.get('lang');
  const [language, setLanguage] = useState(urlLang || 'en'); // Default to URL lang or English
  const [isPageReady, setIsPageReady] = useState(false);
  const sigCanvas = useRef(null);
  const [esigDocument, setEsigDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signerPhone, setSignerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySigned, setAlreadySigned] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  
  // ✅ Multi-step wizard state
  const [currentStep, setCurrentStep] = useState(1); // 1: Info + PDF Preview, 2: Sign (checkout), 3: Final Review, 4: Success
  const [validationErrors, setValidationErrors] = useState({});
  
  // ✅ PDF viewer state
  const pdfContainerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfWidth, setPdfWidth] = useState(800); // Default width
  
  // Allow editing name in Step 3
  const [editableName, setEditableName] = useState('');
  
  // ✅ Sequential signing state
  const [waitingForOtherSigner, setWaitingForOtherSigner] = useState(false);
  const [nextSignerInfo, setNextSignerInfo] = useState(null);
  const [signedPdfUrl, setSignedPdfUrl] = useState(null); // URL of PDF with embedded signature
  
  // ✅ Multi-signature state - each signature field gets its own signature
  const [fieldSignatures, setFieldSignatures] = useState({}); // { fieldId: signatureDataUrl }
  const [fieldValues, setFieldValues] = useState({}); // { fieldId: value } for name/date fields
  const [editingNameOnPdf, setEditingNameOnPdf] = useState(false); // Track if editing name on PDF
  const [editingNameFieldId, setEditingNameFieldId] = useState(null); // Track which name field is being edited
  const [activeSignatureFieldId, setActiveSignatureFieldId] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const modalSigCanvas = useRef(null);
  
  // ✅ Organization info (company name and logo)
  const [organizationInfo, setOrganizationInfo] = useState(null);

  // ✅ PDF Fullscreen modal state
  const [showPdfFullscreen, setShowPdfFullscreen] = useState(false);

  // Set up PDF.js worker using CDN (avoids bundling issues in Next.js static export)
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []);

  // PDF loading handlers
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log(`📄 PDF loaded: ${numPages} pages`);
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
  };

  // Calculate field position and size for overlay
  const getFieldStyle = (field) => {
    if (!pdfWidth) return {};
    
    // Fields saved in canvas pixels at scale 1.8
    const editorScale = 1.8;
    const standardPdfWidth = 612 * editorScale; // 1101.6px
    
    // Scale to current display width
    const scale = pdfWidth / standardPdfWidth;
    
    return {
      position: 'absolute',
      left: `${field.x * scale}px`,
      top: `${field.y * scale}px`,
      width: `${field.width * scale}px`,
      height: `${field.height * scale}px`,
      border: '2px dashed #3b82f6',
      background: 'rgba(59, 130, 246, 0.1)',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${12 * scale}px`,
      fontWeight: 'bold',
      color: '#1e40af',
      zIndex: 10
    };
  };

  // Update field values dynamically based on signerName
  useEffect(() => {
    if (!signerName) return; // Don't populate until we have a name
    
    const fields = esigDocument?.signatureFields || [];
    const updatedValues = {};
    
    fields.forEach(field => {
      const fieldType = field.fieldType?.toLowerCase();
      if (fieldType === 'name') {
        updatedValues[field.fieldId] = signerName;
      } else if (fieldType === 'date') {
        updatedValues[field.fieldId] = new Date().toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US');
      }
    });
    
    console.log('📝 [PublicSigningPage] Setting fieldValues:', updatedValues);
    setFieldValues(updatedValues);
  }, [esigDocument, signerName, language]);

  // Check if all fields are complete (all signatures signed, names filled, dates set)
  const areAllFieldsComplete = useCallback(() => {
    const fields = esigDocument?.signatureFields || [];
    
    for (const field of fields) {
      const fieldType = field.fieldType?.toLowerCase();
      if (fieldType === 'signature' && !fieldSignatures[field.fieldId]) {
        return false; // Signature field not signed
      }
      if (fieldType === 'name' && !fieldValues[field.fieldId]) {
        return false; // Name field empty
      }
      if (fieldType === 'date' && !fieldValues[field.fieldId]) {
        return false; // Date field empty
      }
    }
    
    return true;
  }, [esigDocument, fieldSignatures, fieldValues]);

  // Ensure page is ready before rendering
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined' && window.document.documentElement) {
      setIsPageReady(true);
    }
  }, []);

  useEffect(() => {
    // Only fetch document and set language after page is ready
    if (!isPageReady) return;
    
    fetchDocument();
    
    // Language priority: 1. URL param, 2. Document language (set after fetch), 3. Browser
    if (urlLang) {
      // URL has language - use it
      setLanguage(urlLang);
      if (typeof window !== 'undefined' && window.document?.documentElement) {
        window.document.documentElement.dir = urlLang === 'he' ? 'rtl' : 'ltr';
      }
    } else if (typeof window !== 'undefined' && window.document?.documentElement) {
      // Fallback to browser language
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith('he')) {
        setLanguage('he');
        window.document.documentElement.dir = 'rtl';
      } else {
        setLanguage('en');
        window.document.documentElement.dir = 'ltr';
      }
    }
  }, [token, documentId, organization, isPageReady, urlLang]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      // ✅ Send organization name AND documentId for direct query (SUPER FAST & SECURE!)
      const response = await axios.get(`https://gambot.azurewebsites.net/api/Webhooks/ESignature_GetDocumentByToken?token=${token}&organizationName=${organization}&documentId=${documentId}`);
      const data = response.data;

      if (data?.success || data?.Success) {
        const docData = data.data || data.Data;
        setEsigDocument(docData);
        
        // ✅ Set organization info (company name and logo)
        if (data?.organizationInfo) {
          setOrganizationInfo(data.organizationInfo);
        }
        
        // Log PDF URL for debugging
        console.log('📄 PDF URL:', docData?.originalFileUrl);
        console.log('🏢 Organization Info:', data?.organizationInfo);
        
        // Pre-fill if provided
        if (docData?.signerName) setSignerName(docData.signerName);
        if (docData?.signerEmail) setSignerEmail(docData.signerEmail);
        if (docData?.signerPhone) setSignerPhone(docData.signerPhone);
        
        // Use document language if no URL language was provided
        if (!urlLang && docData?.language) {
          const docLang = docData.language === 'he' || docData.language === 'hebrew' ? 'he' : 'en';
          setLanguage(docLang);
          if (typeof window !== 'undefined' && window.document?.documentElement) {
            window.document.documentElement.dir = docLang === 'he' ? 'rtl' : 'ltr';
          }
        }
      } else if (data?.waitingForOther) {
        // ✅ Sequential signing - not this signer's turn yet
        setWaitingForOtherSigner(true);
        setNextSignerInfo(data.nextSigner);
        setError(data?.message || data?.Message || 'Please wait for previous signer to complete.');
      } else if (data?.alreadySigned || data?.AlreadySigned) {
        setAlreadySigned(true);
        setError(data?.message || data?.Message || 'This document has already been signed.');
      } else {
        setError(data?.message || data?.Message || 'Document not found');
      }
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSignature = () => {
    sigCanvas.current?.clear();
  };

  // ✅ PDF document handlers
  useEffect(() => {
    if (signerName && !editableName) {
      setEditableName(signerName);
    }
  }, [signerName, editableName]);

  // ✅ Validate Step 1 (Signer Information)
  const validateStep1 = () => {
    const errors = {};
    
    if (!signerName.trim()) {
      errors.signerName = language === 'he' ? 'נא להזין שם מלא' : 'Please enter your full name';
    }
    
    if (!signerEmail.trim()) {
      errors.signerEmail = language === 'he' ? 'נא להזין אימייל' : 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signerEmail)) {
      errors.signerEmail = language === 'he' ? 'אימייל לא תקין' : 'Invalid email address';
    }
    
    if (!signerPhone.trim()) {
      errors.signerPhone = language === 'he' ? 'נא להזין מספר טלפון' : 'Please enter your phone number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Navigate to next step
  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ Navigate to previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const t = (key, fallback) => {
    const translations = {
      en: {
        loading: 'Loading document...',
        alreadySigned: 'Already Signed',
        documentUnavailable: 'Document Unavailable',
        alreadySignedMsg: 'This document has already been signed.',
        alreadySignedHint: 'If you need to sign again, please contact the document sender.',
        thankYou: 'Thank You!',
        signatureSubmitted: 'Your signature has been successfully submitted.',
        closePageHint: 'You can close this page now.',
        brandName: 'Gambot E-Signature',
        signDocument: 'Sign Document',
        sentBy: 'Sent by',
        documentPreview: 'Document Preview',
        viewFullDocument: 'View Full Document',
        yourInformation: 'Your Information',
        fullName: 'Full Name',
        enterFullName: 'Enter your full name',
        email: 'Email',
        enterEmail: 'Enter your email',
        phone: 'Phone',
        enterPhone: 'Enter your phone number',
        yourSignature: 'Your Signature',
        signatureHint: 'Sign in the box below using your mouse or touchscreen',
        clearSignature: 'Clear Signature',
        submitSignature: 'Submit Signature',
        submitting: 'Submitting...',
        legalText: 'By signing this document, you agree that your electronic signature is legally binding and equivalent to your handwritten signature.',
        poweredBy: 'Powered by',
        secureESignature: 'Secure E-Signature Solution',
        pleaseEnterName: 'Please enter your name',
        pleaseProvideSignature: 'Please provide your signature',
        failedToSubmit: 'Failed to submit signature. Please try again.',
        step: 'Step',
        of: 'of',
        next: 'Next',
        back: 'Back',
        reviewDocument: 'Review Document',
        step1Title: 'Your Information',
        step1Subtitle: 'Please provide your details to continue',
        step2Title: 'Review Document',
        step2Subtitle: 'Please review the document before signing',
        step3Title: 'Sign Document',
        step3Subtitle: 'Please provide your signature below',
        step4Title: 'Complete!',
        step4Subtitle: 'Your signature has been submitted successfully',
        continueToSign: 'Continue to Sign',
        continueToReview: 'Continue to Review',
        downloadDocument: 'Download Document',
        scrollToReview: 'Scroll to review the entire document',
        viewFullscreen: 'View Fullscreen',
        closeFullscreen: 'Close Fullscreen',
        waitingForSigner: 'Waiting for Previous Signer',
        pleaseWait: 'Please Wait',
        signingOrder: 'Signing Order',
        mustSignFirst: 'must sign first before you can proceed',
        checkBackLater: 'Please check back later or contact the document sender.',
        refreshPage: 'Refresh Page',
        fieldsToFill: 'Details to be added after signing',
        signature: 'Signature',
        name: 'Name',
        date: 'Date',
        text: 'Text',
        page: 'Page',
        fieldsNote: 'These details will be added to the document after you sign',
        detailsOnDocument: 'Details to appear on document',
        secureConnection: 'Secure Connection',
        documentName: 'Document',
        signerNameLabel: 'Signed by',
        prevPage: 'Previous',
        nextPage: 'Next',
        loadingPdf: 'Loading PDF...',
        fieldsMarked: 'Fields marked on the document show where your details will be placed',
        clickFieldsToSign: 'Click on each signature field on the document to sign',
        signaturesCompleted: 'Signatures completed',
        clickToSign: 'Click to sign here',
        signed: 'Signed ✓',
        pleaseSignAllFields: 'Please sign all signature fields',
        saveSignature: 'Save Signature',
        documentLoaded: 'Document loaded',
        signBelowMessage: 'Please sign below to complete'
      },
      he: {
        prevPage: 'הקודם',
        nextPage: 'הבא',
        loadingPdf: 'טוען PDF...',
        fieldsMarked: 'השדות המסומנים על המסמך מציגים היכן הפרטים שלך יוצבו',
        loading: 'טוען מסמך...',
        alreadySigned: 'כבר נחתם',
        documentUnavailable: 'המסמך לא זמין',
        alreadySignedMsg: 'מסמך זה כבר נחתם.',
        alreadySignedHint: 'אם אתה צריך לחתום שוב, אנא צור קשר עם שולח המסמך.',
        thankYou: 'תודה!',
        signatureSubmitted: 'החתימה שלך נשלחה בהצלחה.',
        closePageHint: 'אתה יכול לסגור דף זה עכשיו.',
        brandName: 'חתימה דיגיטלית - Gambot',
        signDocument: 'חתום על המסמך',
        sentBy: 'נשלח על ידי',
        documentPreview: 'תצוגה מקדימה של המסמך',
        viewFullDocument: 'צפה במסמך המלא',
        yourInformation: 'הפרטים שלך',
        fullName: 'שם מלא',
        enterFullName: 'הזן את שמך המלא',
        email: 'אימייל',
        enterEmail: 'הזן את כתובת האימייל שלך',
        phone: 'טלפון',
        enterPhone: 'הזן את מספר הטלפון שלך',
        yourSignature: 'החתימה שלך',
        signatureHint: 'חתום בתיבה למטה באמצעות העכבר או מסך המגע',
        clearSignature: 'נקה חתימה',
        submitSignature: 'שלח חתימה',
        submitting: 'שולח...',
        legalText: 'בחתימה על מסמך זה, אתה מסכים שהחתימה האלקטרונית שלך מחייבת משפטית ושווה ערך לחתימה בכתב יד שלך.',
        poweredBy: 'מופעל על ידי',
        secureESignature: 'פתרון חתימה דיגיטלית מאובטח',
        pleaseEnterName: 'אנא הזן את שמך',
        pleaseProvideSignature: 'אנא ספק חתימה',
        failedToSubmit: 'שליחת החתימה נכשלה. אנא נסה שוב.',
        step: 'שלב',
        of: 'מתוך',
        next: 'הבא',
        back: 'חזור',
        reviewDocument: 'סקירת מסמך',
        step1Title: 'הפרטים שלך',
        step1Subtitle: 'נא למלא את הפרטים שלך כדי להמשיך',
        step2Title: 'סקירת המסמך',
        step2Subtitle: 'נא לעיין במסמך לפני החתימה',
        step3Title: 'חתימה על המסמך',
        step3Subtitle: 'נא לספק את החתימה שלך למטה',
        step4Title: 'הושלם!',
        step4Subtitle: 'החתימה שלך נשלחה בהצלחה',
        continueToSign: 'המשך לחתימה',
        continueToReview: 'המשך לסקירה',
        downloadDocument: 'הורד מסמך',
        scrollToReview: 'גלול כדי לסקור את המסמך בשלמותו',
        viewFullscreen: 'צפה במסך מלא',
        closeFullscreen: 'סגור מסך מלא',
        waitingForSigner: 'ממתין לחותם הקודם',
        pleaseWait: 'נא להמתין',
        signingOrder: 'סדר חתימה',
        mustSignFirst: 'חייב לחתום קודם לפני שתוכל להמשיך',
        checkBackLater: 'נא לבדוק שוב מאוחר יותר או ליצור קשר עם שולח המסמך.',
        refreshPage: 'רענן דף',
        fieldsToFill: 'פרטים שיתווספו לאחר החתימה',
        signature: 'חתימה',
        name: 'שם',
        date: 'תאריך',
        text: 'טקסט',
        page: 'עמוד',
        fieldsNote: 'פרטים אלו יתווספו למסמך לאחר החתימה שלך',
        detailsOnDocument: 'פרטים שיופיעו על המסמך',
        secureConnection: 'חיבור מאובטח',
        documentName: 'מסמך',
        signerNameLabel: 'נחתם על ידי',
        clickFieldsToSign: 'לחץ על כל שדה חתימה במסמך כדי לחתום',
        signaturesCompleted: 'חתימות הושלמו',
        clickToSign: 'לחץ לחתימה כאן',
        signed: 'נחתם ✓',
        pleaseSignAllFields: 'נא לחתום בכל שדות החתימה',
        saveSignature: 'שמור חתימה',
        documentLoaded: 'המסמך נטען',
        signBelowMessage: 'נא לחתום למטה כדי להשלים'
      }
    };
    return translations[language]?.[key] || fallback;
  };

  // ✅ Get signature fields that need to be signed
  const getSignatureFields = () => {
    if (!esigDocument?.signatureFields) return [];
    return esigDocument.signatureFields.filter(f => 
      (f.fieldType?.toLowerCase() || 'signature') === 'signature'
    );
  };

  // ✅ Check if all signature fields are signed
  const areAllSignatureFieldsSigned = () => {
    const sigFields = getSignatureFields();
    if (sigFields.length === 0) {
      return sigCanvas.current && !sigCanvas.current.isEmpty();
    }
    return sigFields.every(field => fieldSignatures[field.fieldId]);
  };

  // ✅ Open signature modal for a specific field
  const openSignatureModal = (fieldId) => {
    setActiveSignatureFieldId(fieldId);
    setShowSignatureModal(true);
  };

  // ✅ Save signature from modal to the specific field
  const handleSaveFieldSignature = () => {
    if (!modalSigCanvas.current || modalSigCanvas.current.isEmpty()) {
      alert(t('pleaseProvideSignature', 'Please provide your signature'));
      return;
    }
    
    const signatureDataUrl = modalSigCanvas.current.toDataURL();
    setFieldSignatures(prev => ({
      ...prev,
      [activeSignatureFieldId]: signatureDataUrl
    }));
    
    setShowSignatureModal(false);
    setActiveSignatureFieldId(null);
    modalSigCanvas.current?.clear();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!signerName.trim()) {
      alert(t('pleaseEnterName', 'Please enter your name'));
      return;
    }

    const sigFields = getSignatureFields();
    let signatureImageBase64;
    let fieldSignaturesData = null;

    if (sigFields.length > 0) {
      if (!areAllSignatureFieldsSigned()) {
        alert(t('pleaseSignAllFields', 'Please sign all signature fields'));
        return;
      }
      signatureImageBase64 = Object.values(fieldSignatures)[0];
      fieldSignaturesData = fieldSignatures;
    } else {
      if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
        alert(t('pleaseProvideSignature', 'Please provide your signature'));
        return;
      }
      signatureImageBase64 = sigCanvas.current.toDataURL();
    }

    try {
      setSubmitting(true);

      const currentFieldValues = {};
      const fields = esigDocument?.signatureFields || [];
      fields.forEach(field => {
        const fieldType = field.fieldType?.toLowerCase();
        if (fieldType === 'name') {
          currentFieldValues[field.fieldId] = signerName;
        } else if (fieldType === 'date') {
          currentFieldValues[field.fieldId] = new Date().toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US');
        }
      });

      console.log('📤 [E-Signature] Submitting with fieldValues:', currentFieldValues);

      const response = await axios.post('https://gambot.azurewebsites.net/api/Webhooks/ESignature_SubmitSignature', {
        token,
        signerName,
        signerEmail,
        signerPhone,
        signatureImageBase64,
        fieldSignatures: fieldSignaturesData ? JSON.stringify(fieldSignaturesData) : null,
        fieldValues: JSON.stringify(currentFieldValues)
      });
      const data = response.data;

      if (data?.success || data?.Success) {
        setSubmitted(true);
        setCurrentStep(4);
        
        if (data?.signedFileUrl || data?.SignedFileUrl) {
          const pdfUrl = data.signedFileUrl || data.SignedFileUrl;
          setSignedPdfUrl(pdfUrl);
          console.log('📄 Signed PDF URL:', pdfUrl);
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data?.message || data?.Message || t('failedToSubmit', 'Failed to submit signature'));
      }
    } catch (error) {
      console.error('Error submitting signature:', error);
      alert(t('failedToSubmit', 'Failed to submit signature. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignatureSubmit = handleSubmit;

  // Wait for page to be ready
  const containerStyle = { position: 'fixed', inset: 0, zIndex: 99999, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', overflowY: 'auto', padding: '20px' };

  if (!isPageReady) {
    return (
      <div className="public-signing-container" style={containerStyle}>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="public-signing-container" style={containerStyle}>
        <div className="esig-public-loading-branded">
          <img 
            src={gambotLogo} 
            alt="Gambot" 
            className="esig-public-loading-logo"
          />
          <div className="spinner"></div>
          <p>{t('loading', 'Loading document...')}</p>
        </div>
      </div>
    );
  }

  // ✅ Waiting for other signer (sequential signing)
  if (waitingForOtherSigner) {
    return (
      <div className="public-signing-container" style={containerStyle}>
        <div className="error-state esig-public-waiting-state">
          <div className="esig-public-waiting-icon">⏳</div>
          <h2>{t('waitingForSigner', 'Waiting for Previous Signer')}</h2>
          <p className="esig-public-waiting-message">{error}</p>
          
          {nextSignerInfo && (
            <div className="esig-public-waiting-details">
              <p>
                <strong>{nextSignerInfo.name}</strong> ({t('signingOrder', 'Signing Order')}: {nextSignerInfo.order})
                <br />
                {t('mustSignFirst', 'must sign first before you can proceed')}
              </p>
            </div>
          )}
          
          <p className="hint">{t('checkBackLater', 'Please check back later or contact the document sender.')}</p>
          
          <button 
            onClick={() => window.location.reload()} 
            className="esig-public-btn-primary"
            style={{ marginTop: '20px', maxWidth: '250px' }}
          >
            🔄 {t('refreshPage', 'Refresh Page')}
          </button>
        </div>
      </div>
    );
  }

  // ✅ Render header with company info
  const renderHeader = () => (
    <div className="esig-public-header">
      <div className="esig-public-logo-area">
        {organizationInfo?.companyLogo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '20px' }}>
            <img 
              src={organizationInfo.companyLogo} 
              alt={organizationInfo.companyName || 'Company'} 
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
            />
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
              {language === 'he' ? 'נשלח על ידי' : 'Sent by'} {organizationInfo.companyName}
            </div>
          </div>
        )}
        {!organizationInfo?.companyLogo && organizationInfo?.companyName && (
          <div style={{ marginRight: '20px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
            {language === 'he' ? 'נשלח על ידי' : 'Sent by'} {organizationInfo.companyName}
          </div>
        )}
        
        <img 
          src={gambotLogo} 
          alt="Gambot" 
          className="esig-public-logo"
        />
        <div className="esig-public-brand-text">
          <span className="esig-public-brand-name">Gambot</span>
          <span className="esig-public-brand-tagline">{t('eSignature', 'E-Signature')}</span>
        </div>
      </div>
      <div className="esig-public-secure-badge">
        🔒 {t('secureConnection', 'Secure Connection')}
      </div>
    </div>
  );

  if (error || alreadySigned) {
    return (
      <div className="public-signing-container" style={containerStyle}>
        {renderHeader()}
        
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>{alreadySigned ? t('alreadySigned', 'Already Signed') : t('documentUnavailable', 'Document Unavailable')}</h2>
          <p>{error}</p>
          {alreadySigned && <p className="hint">{t('alreadySignedHint', 'If you need to sign again, please contact the document sender.')}</p>}
        </div>

        <div className="esig-public-footer">
          <div className="esig-public-footer-content">
            <a href="https://gambot.co.il" target="_blank" rel="noopener noreferrer" className="esig-public-footer-brand">
              <img src={gambotLogo} alt="Gambot" className="esig-public-footer-logo" />
              <span className="esig-public-footer-text">
                {t('poweredBy', 'Powered by')} <strong>Gambot</strong>
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="public-signing-container" style={containerStyle}>
        <div className="success-state">
          <div className="success-icon">
            <FaCheckCircle size={64} color="#28a745" />
          </div>
          <h2>{t('thankYou', 'Thank You!')}</h2>
          <p>{t('signatureSubmitted', 'Your signature has been successfully submitted.')}</p>
          <p className="hint">{t('closePageHint', 'You can close this page now.')}</p>
        </div>
      </div>
    );
  }

  // ✅ Render stepper UI
  const renderStepper = () => {
    const steps = [
      { number: 1, label: t('step1Title', 'Your Information') },
      { number: 2, label: t('step3Title', 'Sign Document') },
    ];

    return (
      <div className="esig-public-stepper">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`esig-public-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
              <div className="esig-public-step-circle">
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <div className="esig-public-step-label">{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`esig-public-step-line ${currentStep > step.number ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="public-signing-container" dir={language === 'he' ? 'rtl' : 'ltr'} style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', overflowY: 'auto', padding: '20px' }}>
      {renderHeader()}

      {currentStep < 4 && currentStep <= 2 && (
        <div className="esig-public-stepper-container">
          {renderStepper()}
          <div className="esig-public-step-progress">
            {t('step', 'Step')} {currentStep} {t('of', 'of')} 2
          </div>
        </div>
      )}

      <div className="signing-content">
        {/* STEP 1: Signer Information ONLY */}
        {currentStep === 1 && (
          <div className="esig-public-step-content">
            <div className="esig-public-step-header">
              <h1>{t('step1Title', 'Your Information')}</h1>
              <p className="esig-public-step-subtitle">{t('step1Subtitle', 'Please provide your details to continue')}</p>
            </div>

            <div className="esig-public-form-card">
              <div className="esig-public-form-group">
                <label>{t('fullName', 'Full Name')} *</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => {
                    setSignerName(e.target.value);
                    if (validationErrors.signerName) {
                      setValidationErrors({...validationErrors, signerName: ''});
                    }
                  }}
                  placeholder={t('enterFullName', 'Enter your full name')}
                  className={validationErrors.signerName ? 'error' : ''}
                />
                {validationErrors.signerName && (
                  <span className="esig-public-error-text">{validationErrors.signerName}</span>
                )}
              </div>

              <div className="esig-public-form-group">
                <label>{t('email', 'Email')} *</label>
                <input
                  type="email"
                  value={signerEmail}
                  onChange={(e) => {
                    setSignerEmail(e.target.value);
                    if (validationErrors.signerEmail) {
                      setValidationErrors({...validationErrors, signerEmail: ''});
                    }
                  }}
                  placeholder={t('enterEmail', 'Enter your email')}
                  className={validationErrors.signerEmail ? 'error' : ''}
                />
                {validationErrors.signerEmail && (
                  <span className="esig-public-error-text">{validationErrors.signerEmail}</span>
                )}
              </div>

              <div className="esig-public-form-group">
                <label>{t('phone', 'Phone')} *</label>
                <input
                  type="tel"
                  value={signerPhone}
                  onChange={(e) => {
                    setSignerPhone(e.target.value);
                    if (validationErrors.signerPhone) {
                      setValidationErrors({...validationErrors, signerPhone: ''});
                    }
                  }}
                  placeholder={t('enterPhone', 'Enter your phone number')}
                  className={validationErrors.signerPhone ? 'error' : ''}
                />
                {validationErrors.signerPhone && (
                  <span className="esig-public-error-text">{validationErrors.signerPhone}</span>
                )}
              </div>

              <div className="esig-public-document-preview-mini">
                <div className="esig-public-document-icon">📄</div>
                <div className="esig-public-document-details">
                  <div className="esig-public-document-name">{esigDocument?.documentName}</div>
                  {esigDocument?.uploadedByName && esigDocument.uploadedByName !== 'undefined' && (
                    <div className="esig-public-document-meta">{t('sentBy', 'Sent by')}: {esigDocument.uploadedByName}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="esig-public-step-actions">
              <button
                type="button"
                onClick={handleNextStep}
                className="esig-public-btn-primary"
              >
                {t('continueToSign', 'המשך לחתימה')}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Signature - Interactive PDF Checkout Style */}
        {currentStep === 2 && (
          <div className="esig-public-step-content">
            <div className="esig-public-step-header">
              <h1>{t('step3Title', 'Sign Document')}</h1>
              <p className="esig-public-step-subtitle">
                {getSignatureFields().length > 0 
                  ? t('clickFieldsToSign', 'Click on each signature field to sign')
                  : t('step3Subtitle', 'Please provide your signature below')
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="esig-public-signature-form">
              {/* Editable Name and Date - Clear Cards */}
              <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ 
                  padding: '20px', 
                  background: '#f0f9ff', 
                  border: '2px solid #3b82f6', 
                  borderRadius: '12px',
                  minWidth: '300px',
                  flex: '1'
                }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#1e40af' }}>
                    👤 {t('name', 'שם')}
                  </label>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #93c5fd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                    placeholder={language === 'he' ? 'הזן שם' : 'Enter name'}
                  />
                </div>

                <div style={{ 
                  padding: '20px', 
                  background: '#fef3c7', 
                  border: '2px solid #f59e0b', 
                  borderRadius: '12px',
                  minWidth: '250px',
                  flex: '1'
                }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#92400e' }}>
                    📅 {t('date', 'תאריך')}
                  </label>
                  <div style={{
                    padding: '12px',
                    background: 'white',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#92400e',
                    textAlign: 'center'
                  }}>
                    {new Date().toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                  </div>
                </div>
              </div>

              {/* Show PDF with clickable signature fields if fields are defined */}
              {getSignatureFields().length > 0 ? (
                <>
                  <div className="esig-public-signature-progress">
                    <p>
                      ✍️ {t('signaturesCompleted', 'Signatures completed')}: {' '}
                      <strong>{Object.keys(fieldSignatures).length}</strong> / {getSignatureFields().length}
                    </p>
                  </div>

                  <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                    <button
                      onClick={() => setShowPdfFullscreen(true)}
                      className="esig-public-btn-fullscreen"
                      type="button"
                    >
                      🖵 {t('viewFullscreen', 'View Fullscreen')}
                    </button>
                  </div>
                  
                  <div className="esig-public-document-viewer" ref={pdfContainerRef}>
                    {esigDocument?.originalFileUrl && (
                      <div className="esig-public-pdf-container" style={{ position: 'relative' }}>
                        <Document
                          file={esigDocument.originalFileUrl}
                          onLoadSuccess={onDocumentLoadSuccess}
                          onLoadError={onDocumentLoadError}
                          options={{
                            cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
                            cMapPacked: true,
                          }}
                        >
                          {Array.from(new Array(numPages || 1), (el, index) => {
                            const pageNum = index + 1;
                            const pageFields = (esigDocument?.signatureFields || []).filter(f => (f.page || 1) === pageNum);
                            
                            return (
                              <div key={`page_${pageNum}`} style={{ position: 'relative', marginBottom: '20px' }}>
                                <Page
                                  pageNumber={pageNum}
                                  width={pdfWidth}
                                  onLoadSuccess={(page) => {
                                    if (pageNum === 1) {
                                      setPdfWidth(page.width);
                                    }
                                  }}
                                />
                                
                                {pageFields.map((field) => {
                                  const fieldType = field.fieldType?.toLowerCase() || 'signature';
                                  const isSigned = fieldType === 'signature' && fieldSignatures[field.fieldId];
                                  
                                  return (
                                    <div
                                      key={field.fieldId}
                                      style={getFieldStyle(field)}
                                      onClick={() => {
                                        if (fieldType === 'signature' && !isSigned) {
                                          openSignatureModal(field.fieldId);
                                        }
                                      }}
                                    >
                                      {fieldType === 'signature' && !isSigned && (
                                        <span>✍️ {t('clickToSign', 'Sign Here')}</span>
                                      )}
                                      {fieldType === 'signature' && isSigned && (
                                        <img 
                                          src={fieldSignatures[field.fieldId]} 
                                          alt="Signature"
                                          style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'white', border: 'none' }}
                                        />
                                      )}
                                      
                                      {fieldType === 'name' && (
                                        editingNameFieldId === field.fieldId ? (
                                          <input
                                            type="text"
                                            value={signerName}
                                            onChange={(e) => setSignerName(e.target.value)}
                                            onBlur={() => setEditingNameFieldId(null)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') setEditingNameFieldId(null); }}
                                            autoFocus
                                            style={{ background: 'white', padding: '8px 12px', borderRadius: '4px', width: '100%', height: '100%', fontSize: '16px', fontWeight: '600', color: '#1e40af', border: '2px solid #3b82f6', outline: 'none' }}
                                          />
                                        ) : (
                                          <div 
                                            style={{ background: 'white', padding: '8px 12px', borderRadius: '4px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600', color: '#1e40af', border: '2px solid #3b82f6', cursor: 'pointer' }}
                                            onClick={(e) => { e.stopPropagation(); setEditingNameFieldId(field.fieldId); }}
                                          >
                                            {signerName} ✏️
                                          </div>
                                        )
                                      )}
                                      
                                      {fieldType === 'date' && (
                                        <div style={{ background: 'white', padding: '8px 12px', borderRadius: '4px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600', color: '#92400e', border: '2px solid #f59e0b' }}>
                                          {new Date().toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </Document>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="esig-public-signature-section">
                  <label className="esig-public-signature-label">{t('yourSignature', 'Your Signature')} *</label>
                  <p className="esig-public-signature-hint">{t('signatureHint', 'Sign in the box below using your mouse or touchscreen')}</p>
                  <div className="esig-public-signature-canvas-wrapper">
                    <SignatureCanvas
                      ref={sigCanvas}
                      backgroundColor="white"
                      canvasProps={{ className: 'esig-public-signature-canvas' }}
                    />
                  </div>
                  <button type="button" onClick={handleClearSignature} className="esig-public-btn-clear">
                    🗑️ {t('clearSignature', 'Clear Signature')}
                  </button>
                </div>
              )}

              <div className="esig-public-legal-notice">
                <p>{t('legalText', 'By signing this document, you agree that your electronic signature is legally binding and equivalent to your handwritten signature.')}</p>
              </div>

              <div className="esig-public-step-actions">
                <button type="button" onClick={handlePrevStep} className="esig-public-btn-secondary" disabled={submitting}>
                  {t('back', 'Back')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (areAllFieldsComplete()) {
                      handleSubmit();
                    } else {
                      const fields = esigDocument?.signatureFields || [];
                      const firstUnsignedSig = fields.find(f => 
                        f.fieldType?.toLowerCase() === 'signature' && !fieldSignatures[f.fieldId]
                      );
                      if (firstUnsignedSig) {
                        openSignatureModal(firstUnsignedSig.fieldId);
                      }
                    }
                  }}
                  className="esig-public-btn-primary"
                  disabled={submitting}
                >
                  {submitting 
                    ? t('submitting', 'Submitting...')
                    : areAllFieldsComplete() 
                      ? (language === 'he' ? 'שלח חתימה' : 'Submit Signature')
                      : t('continueToSign', 'המשך לחתימה')
                  }
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Final Review & Confirm */}
        {currentStep === 3 && (
          <div className="esig-public-step-content">
            <div className="esig-public-step-header">
              <h1>{language === 'he' ? 'סקירה אחרונה ואישור' : 'Final Review & Confirm'}</h1>
              <p className="esig-public-step-subtitle">
                {language === 'he' ? 'נא לאשר שכל הפרטים נכונים לפני השליחה' : 'Please confirm all details are correct before submitting'}
              </p>
            </div>

            <div className="esig-public-document-viewer" ref={pdfContainerRef}>
              {esigDocument?.originalFileUrl && (
                <div className="esig-public-pdf-container" style={{ position: 'relative' }}>
                  <Document
                    file={esigDocument.originalFileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    options={{ cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/', cMapPacked: true }}
                  >
                    {Array.from(new Array(numPages || 1), (el, index) => {
                      const pageNum = index + 1;
                      const pageFields = (esigDocument.signatureFields || []).filter(f => (f.page || 1) === pageNum);
                      
                      return (
                        <div key={`page_${pageNum}`} style={{ position: 'relative', marginBottom: '20px' }}>
                          <Page pageNumber={pageNum} width={pdfWidth} onLoadSuccess={(page) => { if (pageNum === 1) setPdfWidth(page.width); }} />
                          
                          {pageFields.map((field) => {
                            const fieldType = field.fieldType?.toLowerCase() || 'signature';
                            return (
                              <div key={field.fieldId} style={{ ...getFieldStyle(field), cursor: 'default', pointerEvents: 'none', border: '2px solid #10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                                {fieldType === 'signature' && fieldSignatures[field.fieldId] && (
                                  <img src={fieldSignatures[field.fieldId]} alt="Signature" style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'white' }} />
                                )}
                                {fieldType === 'name' && (
                                  <div style={{ background: 'white', padding: '8px 12px', borderRadius: '4px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600', color: '#1e40af', border: '2px solid #10b981' }}>
                                    {signerName}
                                  </div>
                                )}
                                {fieldType === 'date' && (
                                  <div style={{ background: 'white', padding: '8px 12px', borderRadius: '4px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600', color: '#92400e', border: '2px solid #10b981' }}>
                                    {new Date().toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </Document>
                </div>
              )}
            </div>

            <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px', margin: '20px 0', border: '1px solid #3b82f6' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={confirmationChecked} onChange={(e) => setConfirmationChecked(e.target.checked)} style={{ marginTop: '3px' }} />
                <span style={{ fontSize: '14px' }}>
                  {language === 'he' 
                    ? 'אני מאשר/ת שהפרטים נכונים ומסכים/ה לחתום על מסמך זה באופן אלקטרוני'
                    : 'I confirm that the details are correct and agree to sign this document electronically'
                  }
                </span>
              </label>
            </div>

            <div className="esig-public-step-actions">
              <button type="button" onClick={() => { setCurrentStep(2); setConfirmationChecked(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="esig-public-btn-secondary">
                {t('back', 'Back')}
              </button>
              <button type="button" onClick={handleSignatureSubmit} disabled={submitting || !confirmationChecked} className="esig-public-btn-primary">
                {submitting ? t('submitting', 'Submitting...') : (language === 'he' ? 'שלח חתימה' : 'Submit Signature')}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success */}
        {currentStep === 4 && submitted && (
          <div className="esig-public-step-content esig-public-success-page">
            <div className="esig-public-success-icon">
              <FaCheckCircle size={80} color="#28a745" />
            </div>
            <h1>{t('step4Title', 'Complete!')}</h1>
            <p className="esig-public-success-message">{t('step4Subtitle', 'Your signature has been submitted successfully')}</p>
            
            <div className="esig-public-success-details">
              <div className="esig-public-success-row">
                <span className="esig-public-label">{t('documentName', 'Document')}:</span>
                <span className="esig-public-value">{esigDocument?.documentName}</span>
              </div>
              <div className="esig-public-success-row">
                <span className="esig-public-label">{t('signerName', 'Signed by')}:</span>
                <span className="esig-public-value">{signerName}</span>
              </div>
              <div className="esig-public-success-row">
                <span className="esig-public-label">{t('signerEmail', 'Email')}:</span>
                <span className="esig-public-value">{signerEmail}</span>
              </div>
            </div>

            {signedPdfUrl && (
              <a href={signedPdfUrl} download={`${esigDocument?.documentName || 'Signed_Document'}.pdf`} className="esig-public-btn-download" target="_blank" rel="noopener noreferrer">
                📄 {t('downloadDocument', 'Download Signed Document')}
              </a>
            )}

            <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
              <a href="https://gambot.co.il" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#64748b', fontSize: '14px' }}>
                <span>{language === 'he' ? 'מופעל על ידי' : 'Powered by'}</span>
                <img src={gambotLogo} alt="Gambot" style={{ height: '24px' }} />
                <span style={{ fontWeight: '600', color: '#1e40af' }}>Gambot</span>
              </a>
            </div>

            <p className="esig-public-close-hint">{t('closePageHint', 'You can close this page now.')}</p>
          </div>
        )}
      </div>

      {/* ✅ Signature Modal - for signing individual fields */}
      {showSignatureModal && (
        <div className="esig-public-modal-overlay" onClick={() => setShowSignatureModal(false)}>
          <div className="esig-public-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="esig-public-modal-header">
              <h2>✍️ {t('yourSignature', 'Your Signature')}</h2>
              <button className="esig-public-modal-close" onClick={() => setShowSignatureModal(false)}>×</button>
            </div>
            <div className="esig-public-modal-body">
              <p className="esig-public-signature-hint">{t('signatureHint', 'Sign in the box below using your mouse or touchscreen')}</p>
              <div className="esig-public-signature-canvas-wrapper esig-public-modal-canvas">
                <SignatureCanvas
                  ref={modalSigCanvas}
                  backgroundColor="white"
                  canvasProps={{ className: 'esig-public-signature-canvas', width: 500, height: 200 }}
                />
              </div>
            </div>
            <div className="esig-public-modal-footer">
              <button type="button" onClick={() => modalSigCanvas.current?.clear()} className="esig-public-btn-clear">
                🗑️ {t('clearSignature', 'Clear')}
              </button>
              <button type="button" onClick={handleSaveFieldSignature} className="esig-public-btn-primary">
                ✓ {t('saveSignature', 'Save Signature')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Fullscreen PDF Modal */}
      {showPdfFullscreen && (
        <div className="esig-public-fullscreen-modal" onClick={() => setShowPdfFullscreen(false)}>
          <div className="esig-public-fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <div className="esig-public-fullscreen-header">
              <h3>{esigDocument?.documentName || t('documentPreview', 'Document Preview')}</h3>
              <button onClick={() => setShowPdfFullscreen(false)} className="esig-public-btn-close-fullscreen" type="button">
                ✕ {t('closeFullscreen', 'Close')}
              </button>
            </div>
            <div className="esig-public-fullscreen-body">
              {esigDocument?.originalFileUrl && (
                <Document
                  file={esigDocument.originalFileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={{ cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/', cMapPacked: true }}
                >
                  {Array.from(new Array(numPages || 1), (el, index) => (
                    <div key={`fullscreen-page-${index + 1}`} style={{ marginBottom: '8px' }}>
                      <Page
                        pageNumber={index + 1}
                        width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 900) : 900}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  ))}
                </Document>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="esig-public-footer">
        <div className="esig-public-footer-content">
          <a href="https://gambot.co.il" target="_blank" rel="noopener noreferrer" className="esig-public-footer-brand">
            <img src={gambotLogo} alt="Gambot" className="esig-public-footer-logo" />
            <span className="esig-public-footer-text">
              {t('poweredBy', 'Powered by')} <strong>Gambot</strong>
            </span>
          </a>
          <div className="esig-public-footer-links">
            <span className="esig-public-footer-tagline">{t('secureESignature', 'Secure E-Signature Solution')}</span>
            <span className="esig-public-footer-separator">•</span>
            <a href="https://gambot.co.il" target="_blank" rel="noopener noreferrer">gambot.co.il</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicSigningPage;

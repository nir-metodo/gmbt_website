
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import PhoneInputWithModal from './PhoneInputWithModal';
import TutorialVideoButton from './TutorialVideoButton';
import './BasicInfo.css';
import Swal from 'sweetalert2';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { FaUser, FaBuilding, FaGlobe, FaPhone, FaEnvelope, FaIdCard, FaClock, FaArrowRight, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdBusiness } from "react-icons/md";
import { useLanguage } from '@/contexts/LanguageContext';
import axios from 'axios';
import { cleanIsraeliPhoneNumber } from '@/utils/phoneUtils';
import LoadingOverlay from './LoadingOverlay'; // ✅ Add loading overlay

const BasicInfo = ({ companyInfo, setCompanyInfo, nextStep, prevStep }) => {
    const { t, currentLanguage, isRTL } = useLanguage();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // ✅ Add loading state
    
    // Default timezone for Hebrew language
    const israelTimezone = { value: 'Asia/Jerusalem', label: 'Israel - Jerusalem (GMT+2:00)' };
    
    // Auto-set timezone to Israel when language is Hebrew
    useEffect(() => {
        if (currentLanguage === 'he' && !companyInfo?.timezone) {
            setCompanyInfo(prev => ({ ...prev, timezone: israelTimezone }));
        }
    }, [currentLanguage]); // eslint-disable-line react-hooks/exhaustive-deps
    
    // Create comprehensive timezone options for better search
    const timezoneOptions = [
        { value: 'Asia/Jerusalem', label: 'Israel - Jerusalem (GMT+2:00)' },
        { value: 'America/New_York', label: 'USA - New York (GMT-5:00)' },
        { value: 'America/Los_Angeles', label: 'USA - Los Angeles (GMT-8:00)' },
        { value: 'America/Chicago', label: 'USA - Chicago (GMT-6:00)' },
        { value: 'America/Denver', label: 'USA - Denver (GMT-7:00)' },
        { value: 'America/Phoenix', label: 'USA - Phoenix (GMT-7:00)' },
        { value: 'America/Anchorage', label: 'USA - Anchorage (GMT-9:00)' },
        { value: 'Pacific/Honolulu', label: 'USA - Honolulu (GMT-10:00)' },
        { value: 'Europe/London', label: 'UK - London (GMT+0:00)' },
        { value: 'Europe/Paris', label: 'France - Paris (GMT+1:00)' },
        { value: 'Europe/Berlin', label: 'Germany - Berlin (GMT+1:00)' },
        { value: 'Asia/Tokyo', label: 'Japan - Tokyo (GMT+9:00)' },
        { value: 'Asia/Shanghai', label: 'China - Shanghai (GMT+8:00)' },
        { value: 'Asia/Kolkata', label: 'India - Kolkata (GMT+5:30)' },
        { value: 'Australia/Sydney', label: 'Australia - Sydney (GMT+10:00)' },
        { value: 'Australia/Melbourne', label: 'Australia - Melbourne (GMT+10:00)' },
        { value: 'America/Toronto', label: 'Canada - Toronto (GMT-5:00)' },
        { value: 'America/Vancouver', label: 'Canada - Vancouver (GMT-8:00)' },
        { value: 'America/Sao_Paulo', label: 'Brazil - São Paulo (GMT-3:00)' },
        { value: 'Europe/Moscow', label: 'Russia - Moscow (GMT+3:00)' },
        { value: 'America/Mexico_City', label: 'Mexico - Mexico City (GMT-6:00)' },
        { value: 'America/Argentina/Buenos_Aires', label: 'Argentina - Buenos Aires (GMT-3:00)' },
        { value: 'Africa/Cairo', label: 'Egypt - Cairo (GMT+2:00)' },
        { value: 'Africa/Johannesburg', label: 'South Africa - Johannesburg (GMT+2:00)' },
        { value: 'Europe/Istanbul', label: 'Turkey - Istanbul (GMT+3:00)' },
        { value: 'Asia/Bangkok', label: 'Thailand - Bangkok (GMT+7:00)' },
        { value: 'Asia/Singapore', label: 'Singapore - Singapore (GMT+8:00)' },
        { value: 'Asia/Dubai', label: 'UAE - Dubai (GMT+4:00)' },
        { value: 'Europe/Rome', label: 'Italy - Rome (GMT+1:00)' },
        { value: 'Europe/Madrid', label: 'Spain - Madrid (GMT+1:00)' },
        { value: 'Asia/Seoul', label: 'South Korea - Seoul (GMT+9:00)' },
        { value: 'Pacific/Auckland', label: 'New Zealand - Auckland (GMT+12:00)' },
        { value: 'Asia/Hong_Kong', label: 'Hong Kong - Hong Kong (GMT+8:00)' },
        { value: 'Europe/Amsterdam', label: 'Netherlands - Amsterdam (GMT+1:00)' },
        { value: 'Europe/Zurich', label: 'Switzerland - Zurich (GMT+1:00)' },
        { value: 'America/Bogota', label: 'Colombia - Bogotá (GMT-5:00)' },
        { value: 'America/Lima', label: 'Peru - Lima (GMT-5:00)' },
        { value: 'Africa/Lagos', label: 'Nigeria - Lagos (GMT+1:00)' },
        { value: 'Asia/Karachi', label: 'Pakistan - Karachi (GMT+5:00)' },
        { value: 'Asia/Jakarta', label: 'Indonesia - Jakarta (GMT+7:00)' }
    ];
    
    // Fallback function for BasicInfo translations
    const getBasicInfoText = (key) => {
        const translation = t(key);
        if (translation === key) {
            // Translation key returned unchanged, use fallback
            const fallbacks = {
                'basicInfo.header.badge': currentLanguage === 'he' ? 'שלב 3' : 'Step 3',
                'basicInfo.header.title': currentLanguage === 'he' ? 'פרטי החברה' : 'Company Information',
                'basicInfo.header.subtitle': currentLanguage === 'he' ? 'מלא את פרטי החברה שלך כדי להמשיך בתהליך ההרשמה' : 'Fill in your company details to continue with the registration process',
                'basicInfo.fields.companyName.label': currentLanguage === 'he' ? 'שם החברה / עוסק לחשבונית' : 'Company Name / Business for Invoice',
                'basicInfo.fields.companyName.placeholder': currentLanguage === 'he' ? 'הזן את שם החברה' : 'Enter company name',
                'basicInfo.fields.companyName.description': currentLanguage === 'he' ? 'שם החברה כפי שיופיע בחשבונית' : 'Company name as it will appear on the invoice',
                'basicInfo.fields.companyName.required': currentLanguage === 'he' ? 'שם החברה הוא שדה חובה.' : 'Company name is required.',
                'basicInfo.fields.idNumber.label': currentLanguage === 'he' ? 'מספר ח.פ או תעודת זהות' : 'Company Number or ID Number',
                'basicInfo.fields.idNumber.placeholder': currentLanguage === 'he' ? '9 ספרות' : '9 digits',
                'basicInfo.fields.idNumber.description': currentLanguage === 'he' ? 'מספר החברה הרשמי או תעודת זהות של עוסק מורשה' : 'Official company number or authorized business ID',
                'basicInfo.fields.idNumber.invalid': currentLanguage === 'he' ? 'אנא הזן מספר ח.פ או תעודת זהות תקינים (9 ספרות).' : 'Please enter a valid company number or ID (9 digits).',
                'basicInfo.fields.organizationName.label': currentLanguage === 'he' ? 'שם ארגון (באנגלית ללא רווחים)' : 'Organization Name (English, no spaces)',
                'basicInfo.fields.organizationName.placeholder': currentLanguage === 'he' ? 'לדוגמה: MyCompany' : 'Example: MyCompany',
                'basicInfo.fields.organizationName.description': currentLanguage === 'he' ? 'שם ייחודי באנגלית לזיהוי הארגון במערכת' : 'Unique English name for organization identification in the system',
                'basicInfo.fields.organizationName.invalid': currentLanguage === 'he' ? 'שם הארגון חייב להיות באנגלית וללא רווחים.' : 'Organization name must be in English with no spaces.',
                'basicInfo.fields.companyUrl.label': currentLanguage === 'he' ? 'כתובת אתר החברה' : 'Company Website',
                'basicInfo.fields.companyUrl.placeholder': currentLanguage === 'he' ? 'לדוגמה: https://example.com' : 'Example: https://example.com',
                'basicInfo.fields.companyUrl.description': currentLanguage === 'he' ? 'כתובת האתר הרשמי של החברה' : 'Official company website address',
                'basicInfo.fields.companyUrl.invalid': currentLanguage === 'he' ? 'אנא הזן כתובת אתר תקינה.' : 'Please enter a valid website address.',
                'basicInfo.fields.contactFullName.label': currentLanguage === 'he' ? 'שם מלא של איש קשר ראשי' : 'Primary Contact Full Name',
                'basicInfo.fields.contactFullName.placeholder': currentLanguage === 'he' ? 'לדוגמה: ישראל ישראלי' : 'Example: John Doe',
                'basicInfo.fields.contactFullName.description': currentLanguage === 'he' ? 'איש הקשר הראשי מטעם החברה' : 'Primary contact person for the company',
                'basicInfo.fields.contactFullName.required': currentLanguage === 'he' ? 'שם מלא של איש קשר הוא שדה חובה.' : 'Contact full name is required.',
                'basicInfo.fields.contactEmail.label': currentLanguage === 'he' ? 'אימייל של איש קשר ראשי' : 'Primary Contact Email',
                'basicInfo.fields.contactEmail.placeholder': currentLanguage === 'he' ? 'לדוגמה: example@email.com' : 'Example: example@email.com',
                'basicInfo.fields.contactEmail.description': currentLanguage === 'he' ? 'כתובת אימייל לתקשורת ועדכונים' : 'Email address for communication and updates',
                'basicInfo.fields.contactEmail.note': currentLanguage === 'he' ? 'יווצר לך משתמש עם המייל הזה' : 'A user will be created with this email',
                'basicInfo.fields.contactEmail.invalid': currentLanguage === 'he' ? 'אנא הזן כתובת אימייל תקינה.' : 'Please enter a valid email address.',
                'basicInfo.fields.contactPhoneNumber.label': currentLanguage === 'he' ? 'מספר טלפון של איש קשר ראשי' : 'Primary Contact Phone Number',
                'basicInfo.fields.contactPhoneNumber.searchPlaceholder': currentLanguage === 'he' ? 'חיפוש מדינה...' : 'Search country...',
                'basicInfo.fields.contactPhoneNumber.description': currentLanguage === 'he' ? 'מספר טלפון לתקשורת ועדכונים' : 'Phone number for communication and updates',
                'basicInfo.fields.contactPhoneNumber.note': currentLanguage === 'he' ? 'מספר טלפון של איש קשר - לא המספר איתו תשתמשו במערכת' : 'Contact person phone number - not the number you will use in the system',
                'basicInfo.fields.contactPhoneNumber.invalid': currentLanguage === 'he' ? 'מספר הטלפון אינו תקין' : 'Invalid phone number',
                'basicInfo.fields.contactPhoneNumber.required': currentLanguage === 'he' ? 'מספר הטלפון אינו תקין לפי המדינה שנבחרה.' : 'Phone number is invalid for the selected country.',
                'basicInfo.fields.timezone.label': currentLanguage === 'he' ? 'אזור זמן' : 'Timezone',
                'basicInfo.fields.timezone.placeholder': currentLanguage === 'he' ? 'בחר אזור זמן...' : 'Select timezone...',
                'basicInfo.fields.timezone.description': currentLanguage === 'he' ? 'בחר את אזור הזמן של החברה' : 'Select the company timezone',
                'basicInfo.fields.timezone.required': currentLanguage === 'he' ? 'אנא בחר אזור זמן.' : 'Please select a timezone.',
                'basicInfo.navigation.back': currentLanguage === 'he' ? 'חזרה' : 'Back',
                'basicInfo.navigation.next': currentLanguage === 'he' ? 'המשך' : 'Continue',
                'basicInfo.validation.formError': currentLanguage === 'he' ? 'אנא תקן את השגיאות בטופס לפני המעבר לשלב הבא.' : 'Please fix the errors in the form before proceeding to the next step.',
                'basicInfo.validation.errorTitle': currentLanguage === 'he' ? 'שגיאה' : 'Error',
                'basicInfo.alerts.confirm': currentLanguage === 'he' ? 'אישור' : 'Confirm'
            };
            return fallbacks[key] || key;
        }
        return translation;
    };

    const orgNameRegex = /^[a-zA-Z0-9]+$/; 
    const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}(\/.*)?$/;
    const idRegex = /^[0-9]{9}$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    const showAlert = (title, text, icon = "warning") => {
        return Swal.fire({
            title,
            text,
            icon,
            confirmButtonText: getBasicInfoText('basicInfo.alerts.confirm'),
            customClass: {
                popup: isRTL ? "rtl-popup" : "ltr-popup",
                confirmButton: "swal2-confirm"
            }
        });
    };

    const validatePhoneNumber = (phoneNumber) => {
        const parsedNumber = parsePhoneNumberFromString(phoneNumber);
        return parsedNumber ? parsedNumber.isValid() : false;
    };

    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyInfo({ ...companyInfo, [name]: value });

        // בדיקה רק לאחר שהמשתמש עובר לשדה הבא
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const handlePhoneNumberChange = (phone) => {
        // Just update the value as user types
        setCompanyInfo({ ...companyInfo, contactPhoneNumber: phone });
    };

    const handlePhoneNumberBlur = () => {
        // ✅ Clean Israeli phone number when user leaves the field (remove leading 0 after country code)
        if (companyInfo?.contactPhoneNumber) {
            const cleanedPhone = cleanIsraeliPhoneNumber(companyInfo.contactPhoneNumber);
            setCompanyInfo({ ...companyInfo, contactPhoneNumber: cleanedPhone });
            setErrors({ ...errors, contactPhoneNumber: validatePhoneNumber(`+${cleanedPhone}`) ? '' : getBasicInfoText('basicInfo.fields.contactPhoneNumber.invalid') });
        }
    };

    const handleTimezoneChange = (selectedOption) => {
        const timezone = selectedOption ? selectedOption : null;
        setCompanyInfo({ ...companyInfo, timezone: timezone });
        setErrors({ ...errors, timezone: timezone ? '' : getBasicInfoText('basicInfo.fields.timezone.required') });
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'companyName':
                return value ? '' : getBasicInfoText('basicInfo.fields.companyName.required');
            case 'idNumber':
                return idRegex.test(value) ? '' : getBasicInfoText('basicInfo.fields.idNumber.invalid');
            // ❌ organizationName validation removed - auto-generated now
            case 'companyUrl':
                return urlRegex.test(value) ? '' : getBasicInfoText('basicInfo.fields.companyUrl.invalid');
            case 'contactFullName':
                return value ? '' : getBasicInfoText('basicInfo.fields.contactFullName.required');
            case 'contactEmail':
                return emailRegex.test(value) ? '' : getBasicInfoText('basicInfo.fields.contactEmail.invalid');
            default:
                return '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(companyInfo).forEach((key) => {
            newErrors[key] = validateField(key, companyInfo[key]);
        });

        if (!companyInfo.contactPhoneNumber || !validatePhoneNumber(`+${companyInfo.contactPhoneNumber}`)) {
            newErrors.contactPhoneNumber = getBasicInfoText('basicInfo.fields.contactPhoneNumber.required');
        }
        // Timezone validation - not required for Hebrew (auto-set to Israel)
        if (currentLanguage !== 'he' && !companyInfo.timezone) {
            newErrors.timezone = getBasicInfoText('basicInfo.fields.timezone.required');
        }

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error);
        if (hasErrors) {
            showAlert(getBasicInfoText('basicInfo.validation.errorTitle'), getBasicInfoText('basicInfo.validation.formError'), "error");
            return false;
        }
        return true;
    };
    const getDirection = (value) => {
        if (/^[0-9]+$/.test(value)) return 'ltr';
        if (/^[\u0590-\u05FF]/.test(value)) return 'rtl';
        return 'ltr';
    };

    // Check if organization exists and show appropriate modals
    const checkOrganizationExists = async () => {
        try {
            console.log('🔍 [BasicInfo] Checking if organization exists...');
            
            const response = await axios.post(
                'https://gambot.azurewebsites.net/api/webhooks/CheckOrganizationExists',
                {
                    companyName: companyInfo.companyName,
                    companyIdNumber: companyInfo.idNumber
                },
                {
                    headers: { 'Content-Type': 'application/json; charset=utf-8' }
                }
            );
            
            console.log('📥 [BasicInfo] Check result:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ [BasicInfo] Error checking organization:', error);
            // On error, allow to proceed (fail-open)
            return { success: true, nameExists: false, countByCompanyId: 0 };
        }
    };

    // Show warning modal when organization name already exists
    const showWarningModal = async (sanitizedOrgName) => {
        const result = await Swal.fire({
            title: currentLanguage === 'he' ? 'שם ארגון קיים' : 'Organization Name Exists',
            html: `
                <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};">
                    <p style="margin-bottom: 12px; color: #374151;">
                        ${currentLanguage === 'he' 
                            ? `ארגון עם השם <strong style="color: #059669;">${sanitizedOrgName}</strong> כבר קיים במערכת.`
                            : `An organization with the name <strong style="color: #059669;">${sanitizedOrgName}</strong> already exists.`}
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        ${currentLanguage === 'he'
                            ? 'אם תמשיך, ייווצר ארגון חדש עם שם ייחודי (יתווסף תאריך ושעה).'
                            : 'If you continue, a new organization will be created with a unique name (timestamp will be added).'}
                    </p>
                </div>
            `,
            icon: 'warning',
            iconColor: '#f59e0b',
            showCancelButton: true,
            confirmButtonText: currentLanguage === 'he' ? 'המשך בכל זאת' : 'Continue Anyway',
            cancelButtonText: currentLanguage === 'he' ? 'ביטול' : 'Cancel',
            confirmButtonColor: '#059669',
            cancelButtonColor: '#6b7280',
            customClass: {
                popup: `${isRTL ? 'rtl-popup' : 'ltr-popup'} gambot-modal`,
                confirmButton: 'gambot-confirm-btn',
                cancelButton: 'gambot-cancel-btn'
            },
            background: '#ffffff',
            backdrop: 'rgba(0, 0, 0, 0.5)'
        });
        
        return result.isConfirmed;
    };

    // Show block modal when company ID exists twice (contact support)
    const showBlockModal = (countByCompanyId) => {
        return Swal.fire({
            title: currentLanguage === 'he' ? 'ארגון קיים במערכת' : 'Organization Already Exists',
            html: `
                <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};">
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid #f59e0b;">
                        <p style="margin: 0; color: #92400e; font-weight: 500;">
                            ${currentLanguage === 'he'
                                ? `נמצאו ${countByCompanyId} ארגונים עם מספר ח.פ/ת.ז זה.`
                                : `Found ${countByCompanyId} organizations with this company ID.`}
                        </p>
                    </div>
                    <p style="color: #374151; margin-bottom: 16px;">
                        ${currentLanguage === 'he'
                            ? 'לא ניתן ליצור ארגון נוסף עם אותו מספר ח.פ/ת.ז.'
                            : 'Cannot create another organization with the same company ID.'}
                    </p>
                    <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 16px; border: 1px solid #059669;">
                        <p style="margin: 0 0 8px 0; color: #065f46; font-weight: 600;">
                            ${currentLanguage === 'he' ? 'צור קשר עם השירות:' : 'Contact Support:'}
                        </p>
                        <p style="margin: 0; color: #047857;">
                            <strong>WhatsApp:</strong> +972-52-595-8080<br/>
                            <strong>Email:</strong> support@gambot.co.il
                        </p>
                    </div>
                </div>
            `,
            icon: 'error',
            iconColor: '#dc2626',
            confirmButtonText: currentLanguage === 'he' ? 'הבנתי' : 'Got it',
            confirmButtonColor: '#059669',
            customClass: {
                popup: `${isRTL ? 'rtl-popup' : 'ltr-popup'} gambot-modal`,
                confirmButton: 'gambot-confirm-btn'
            },
            background: '#ffffff',
            backdrop: 'rgba(0, 0, 0, 0.5)'
        });
    };

    // Generate organization name from backend
    const generateOrganizationName = async (forceCreate = false) => {
        try {
            // Check localStorage cache first (prevents duplicates on multiple clicks)
            const storageKey = `gambot_org_${companyInfo.idNumber}`;
            const cachedOrgName = companyInfo?.idNumber ? localStorage.getItem(storageKey) : null;
            
            if (cachedOrgName && !forceCreate) {
                console.log('💾 [BasicInfo] Using cached org name:', cachedOrgName);
                return cachedOrgName;
            }
            
            console.log('📤 [BasicInfo] Calling API to generate org name...');
            
            const response = await axios.post(
                'https://gambot.azurewebsites.net/api/webhooks/GenerateOrganizationName',
                {
                    companyName: companyInfo.companyName,
                    companyIdNumber: companyInfo.idNumber,
                    forceCreate: forceCreate
                },
                {
                    headers: { 'Content-Type': 'application/json; charset=utf-8' }
                }
            );
            
            if (response.data?.success) {
                const orgName = response.data.organizationName;
                console.log('✅ [BasicInfo] Generated org name:', orgName);
                
                // Save to localStorage
                if (companyInfo?.idNumber) {
                    localStorage.setItem(storageKey, orgName);
                }
                
                return orgName;
            } else {
                throw new Error(response.data?.message || 'Failed to generate organization name');
            }
        } catch (error) {
            console.error('❌ [BasicInfo] Error generating organization name:', error);
            
            // Fallback: sanitize locally
            let fallbackName = companyInfo.companyName
                .replace(/\s+/g, '_')
                .replace(/[^\u0590-\u05FFa-zA-Z0-9_-]/g, '');
            fallbackName = `${fallbackName}_${companyInfo.idNumber}`;
            
            console.log('⚠️ [BasicInfo] Using fallback org name:', fallbackName);
            return fallbackName;
        }
    };

    const handleNextStep = async () => {
        if (validateForm()) {
            // Prevent double-clicks
            if (isLoading) return;
            
            try {
                setIsLoading(true);
                
                // Step 1: Check if organization exists
                console.log('🔍 [BasicInfo] Step 1: Checking organization existence...');
                const checkResult = await checkOrganizationExists();
                
                // Step 2: Handle blocked case (company ID exists 2+ times)
                if (checkResult.showBlockModal || checkResult.countByCompanyId >= 2) {
                    console.log('🚫 [BasicInfo] Blocked - company ID exists multiple times');
                    setIsLoading(false);
                    await showBlockModal(checkResult.countByCompanyId);
                    return; // Stop here
                }
                
                // Step 3: Handle warning case (name exists, but can continue)
                let forceCreate = false;
                if (checkResult.showWarningModal || checkResult.nameExists) {
                    console.log('⚠️ [BasicInfo] Warning - name exists, showing modal');
                    setIsLoading(false);
                    const userConfirmed = await showWarningModal(checkResult.sanitizedOrgName);
                    
                    if (!userConfirmed) {
                        console.log('❌ [BasicInfo] User cancelled');
                        return; // User clicked cancel
                    }
                    
                    forceCreate = true; // User confirmed, create with timestamp
                    setIsLoading(true);
                }
                
                // Step 4: Generate organization name
                console.log('🚀 [BasicInfo] Step 4: Generating organization name...');
                const finalOrganizationName = await generateOrganizationName(forceCreate);
                
                // Update state
                const updatedCompanyInfo = { 
                    ...companyInfo, 
                    organizationName: finalOrganizationName 
                };
                setCompanyInfo(updatedCompanyInfo);
                
                console.log('✅ [BasicInfo] Organization name:', finalOrganizationName);
                
                // Step 5: Proceed to next step
                if (companyInfo.idNumber === '203317111') {
                    nextStep(3); // Skip verification for test user
                } else {
                    nextStep();
                }
            } catch (error) {
                console.error('❌ [BasicInfo] Error in handleNextStep:', error);
                showAlert(
                    getBasicInfoText('basicInfo.validation.errorTitle'),
                    currentLanguage === 'he' 
                        ? 'אירעה שגיאה בעת יצירת שם הארגון. נסה שוב.'
                        : 'An error occurred while creating the organization name. Please try again.',
                    "error"
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Constants
    const MAX_COMPANY_NAME_LENGTH = 30;

    // Enhanced field configuration with icons
    const formFields = [
        { 
            label: getBasicInfoText('basicInfo.fields.companyName.label'), 
            name: "companyName", 
            type: "text", 
            placeholder: getBasicInfoText('basicInfo.fields.companyName.placeholder'), 
            icon: FaBuilding,
            description: getBasicInfoText('basicInfo.fields.companyName.description'),
            maxLength: MAX_COMPANY_NAME_LENGTH,
            showCharCount: true
        },
        { 
            label: getBasicInfoText('basicInfo.fields.idNumber.label'), 
            name: "idNumber", 
            type: "text", 
            placeholder: getBasicInfoText('basicInfo.fields.idNumber.placeholder'), 
            maxLength: 9,
            icon: FaIdCard,
            description: getBasicInfoText('basicInfo.fields.idNumber.description')
        },
        // ❌ organizationName removed - auto-generated now
        { 
            label: getBasicInfoText('basicInfo.fields.companyUrl.label'), 
            name: "companyUrl", 
            type: "url", 
            placeholder: getBasicInfoText('basicInfo.fields.companyUrl.placeholder'),
            icon: FaGlobe,
            description: getBasicInfoText('basicInfo.fields.companyUrl.description')
        },
        { 
            label: getBasicInfoText('basicInfo.fields.contactFullName.label'), 
            name: "contactFullName", 
            type: "text", 
            placeholder: getBasicInfoText('basicInfo.fields.contactFullName.placeholder'),
            icon: FaUser,
            description: getBasicInfoText('basicInfo.fields.contactFullName.description')
        },
        { 
            label: getBasicInfoText('basicInfo.fields.contactEmail.label'), 
            name: "contactEmail", 
            type: "email", 
            placeholder: getBasicInfoText('basicInfo.fields.contactEmail.placeholder'),
            icon: FaEnvelope,
            description: getBasicInfoText('basicInfo.fields.contactEmail.description'),
            note: getBasicInfoText('basicInfo.fields.contactEmail.note')
        }
    ];

    return (
        <>
            <LoadingOverlay loading={isLoading} />
            <div className={`basic-info-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Enhanced Header */}
            <div className="basic-info-header">
                <div className="header-badge">
                    <HiOutlineSparkles className="sparkle-icon" />
                    <span>{getBasicInfoText('basicInfo.header.badge')}</span>
                </div>
                <h2 className="basic-info-title">{getBasicInfoText('basicInfo.header.title')}</h2>
                <p className="basic-info-subtitle">{getBasicInfoText('basicInfo.header.subtitle')}</p>
            </div>

            <div className="basic-info-form">
                {formFields.map(({ label, name, type, placeholder, maxLength, icon: IconComponent, description, note, showCharCount }) => {
                    const currentLength = (companyInfo[name] || '').length;
                    const isAtLimit = maxLength && currentLength >= maxLength;
                    
                    return (
                        <div key={name} className="form-field">
                            <div className="field-header">
                                <div className="field-icon">
                                    <IconComponent />
                                </div>
                                <div className="field-labels">
                                    <label className="field-label">{label}</label>
                                    <p className="field-description">{description}</p>
                                    {note && <p className="field-note">{note}</p>}
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type={type}
                                    name={name}
                                    value={companyInfo[name] || ''}
                                    onChange={handleCompanyChange}
                                    onBlur={handleCompanyChange}
                                    placeholder={placeholder}
                                    maxLength={maxLength}
                                    required
                                    className={`form-input ${errors[name] ? 'error' : ''} ${companyInfo[name] ? 'filled' : ''} ${isAtLimit ? 'at-limit' : ''}`}
                                    style={{ 
                                        direction: getDirection(companyInfo[name] || ''), 
                                        textAlign: getDirection(companyInfo[name] || '') === 'rtl' ? 'right' : 'left' 
                                    }}
                                />
                            </div>
                            {/* Character counter for fields with maxLength and showCharCount */}
                            {showCharCount && maxLength && (
                                <div className={`char-counter ${isAtLimit ? 'at-limit' : ''}`}>
                                    <span>{currentLength}/{maxLength}</span>
                                    {isAtLimit && (
                                        <span className="limit-warning">
                                            {currentLanguage === 'he' ? 'הגעת למקסימום תווים' : 'Maximum characters reached'}
                                        </span>
                                    )}
                                </div>
                            )}
                            {companyInfo[name] && !errors[name] && (
                                <FaCheckCircle className="input-success-icon" />
                            )}
                            {errors[name] && (
                                <FaExclamationTriangle className="input-error-icon" />
                            )}
                            {errors[name] && (
                                <div className="error-message">
                                    <FaExclamationTriangle className="error-icon" />
                                    <span>{errors[name]}</span>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Enhanced Phone Input */}
                <div className="form-field">
                    <div className="field-header">
                        <div className="field-icon">
                            <FaPhone />
                        </div>
                        <div className="field-labels">
                            <label className="field-label">{getBasicInfoText('basicInfo.fields.contactPhoneNumber.label')}</label>
                            <p className="field-description">{getBasicInfoText('basicInfo.fields.contactPhoneNumber.description')}</p>
                            <p className="field-note">{getBasicInfoText('basicInfo.fields.contactPhoneNumber.note')}</p>
                        </div>
                    </div>
                    <div className="input-wrapper phone-input-wrapper">
                        <PhoneInputWithModal
                            country="il"
                            value={companyInfo?.contactPhoneNumber || ''}
                            onChange={handlePhoneNumberChange}
                            onBlur={handlePhoneNumberBlur}
                            searchStyle={{
                                textAlign: 'left',
                                direction: 'ltr',
                                paddingLeft: '2rem',
                                backgroundPosition: 'left center',
                                backgroundRepeat: 'no-repeat',
                            }}
                            containerClass="enhanced-phone-container"
                            inputClass={`enhanced-phone-input ${errors.contactPhoneNumber ? 'error' : ''} ${companyInfo?.contactPhoneNumber ? 'filled' : ''}`}
                            dropdownStyle={{ direction: 'ltr', textAlign: 'left' }}
                            required
                        />
                        {companyInfo?.contactPhoneNumber && !errors.contactPhoneNumber && (
                            <FaCheckCircle className="input-success-icon" />
                        )}
                        {errors.contactPhoneNumber && (
                            <FaExclamationTriangle className="input-error-icon" />
                        )}
                    </div>
                    {errors.contactPhoneNumber && (
                        <div className="error-message">
                            <FaExclamationTriangle className="error-icon" />
                            <span>{errors.contactPhoneNumber}</span>
                        </div>
                    )}
                </div>

                {/* Enhanced Timezone Input - Hidden for Hebrew (defaults to Israel) */}
                {currentLanguage !== 'he' && (
                    <div className="form-field">
                        <div className="field-header">
                            <div className="field-icon">
                                <FaClock />
                            </div>
                            <div className="field-labels">
                                <label className="field-label">{getBasicInfoText('basicInfo.fields.timezone.label')}</label>
                                <p className="field-description">{getBasicInfoText('basicInfo.fields.timezone.description')}</p>
                            </div>
                        </div>
                        <div className="input-wrapper timezone-wrapper">
                            <Select 
                                value={companyInfo?.timezone} 
                                onChange={handleTimezoneChange} 
                                options={timezoneOptions}
                                className={`enhanced-timezone-select ${errors.timezone ? 'error' : ''} ${companyInfo?.timezone ? 'filled' : ''}`}
                                classNamePrefix="timezone-select"
                                placeholder={getBasicInfoText('basicInfo.fields.timezone.placeholder')}
                                isSearchable={true}
                                isClearable={true}
                            />
                        </div>
                        {companyInfo?.timezone && !errors.timezone && (
                            <FaCheckCircle className="input-success-icon" />
                        )}
                        {errors.timezone && (
                            <FaExclamationTriangle className="input-error-icon" />
                        )}
                        {errors.timezone && (
                            <div className="error-message">
                                <FaExclamationTriangle className="error-icon" />
                                <span>{errors.timezone}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Enhanced Navigation Buttons */}
            <div className={`navigation-buttons ${isRTL ? 'rtl' : 'ltr'}`}>
                <button 
                    className="nav-button prev-button" 
                    onClick={prevStep}
                    disabled={isLoading}
                >
                    {isRTL ? <FaArrowRight className="nav-icon" /> : <FaArrowLeft className="nav-icon" />}
                    <span>{getBasicInfoText('basicInfo.navigation.back')}</span>
                </button>
                <button 
                    className="nav-button next-button"
                    onClick={handleNextStep}
                    disabled={isLoading}
                >
                    <span>{getBasicInfoText('basicInfo.navigation.next')}</span>
                    {isRTL ? <FaArrowLeft className="nav-icon" /> : <FaArrowRight className="nav-icon" />}
                </button>
            </div>

            {/* Tutorial Video Button */}
            <TutorialVideoButton step={3} />
        </div>
        </>
    );
};

export default BasicInfo;


import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from './axiosInstance';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaArrowRight, FaArrowLeft, FaLock, FaShoppingCart } from 'react-icons/fa';

// Step 4 gate for customers who BUY a number from Gambot: the SIM is paid up front (35 ILS / 10 USD + VAT) while the
// account itself stays a free trial. The card is entered in Tranzila's hosted iframe (we never see card data). Tranzila
// notifies our server, which parks the verified card under `simPaymentRef`; the server then charges the SIM with it
// inside createNewTrialSubscription. Here we only create the reference, show the notice and wait for "verified".

const newRef = () => {
    try {
        if (window.crypto?.randomUUID) return window.crypto.randomUUID().replace(/-/g, '') + window.crypto.randomUUID().replace(/-/g, '').slice(0, 8);
        const a = new Uint8Array(20);
        window.crypto.getRandomValues(a);
        return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
        return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
    }
};

const SimPayment = ({ companyInfo, simPaymentRef, setSimPaymentRef, onPaid, prevStep }) => {
    const { currentLanguage, isRTL, getCurrency, getCurrencySymbol, getPlanPrices } = useLanguage();
    const he = currentLanguage === 'he';
    const currency = getCurrency();
    const simLabel = `${getCurrencySymbol()}${getPlanPrices().sim}`;

    const [accepted, setAccepted] = useState(false);
    const [iframeUrl, setIframeUrl] = useState('');
    const [error, setError] = useState('');
    const doneRef = useRef(false);

    const checkStatus = useCallback(async (ref) => {
        if (!ref || doneRef.current) return false;
        try {
            const res = await axiosInstance.post('/api/Webhooks/GetSimCardStatus', { simRef: ref });
            if (res.data?.verified) {
                doneRef.current = true;
                onPaid(ref);
                return true;
            }
        } catch { /* keep polling */ }
        return false;
    }, [onPaid]);

    // Returning with an old reference (refresh): if its card is already verified, skip straight on.
    useEffect(() => {
        if (simPaymentRef && !iframeUrl) checkStatus(simPaymentRef);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // While the iframe is open: poll the server and listen for the return page's postMessage.
    useEffect(() => {
        if (!iframeUrl || !simPaymentRef) return undefined;
        const timer = setInterval(() => checkStatus(simPaymentRef), 2000);
        const onMessage = (e) => {
            if (e.origin !== window.location.origin || e.data?.type !== 'gambot-sim-card') return;
            if (e.data.status === 'success') checkStatus(simPaymentRef);
            else setError(he ? 'אימות הכרטיס נכשל. נסה שוב או השתמש בכרטיס אחר.' : 'Card verification failed. Try again or use another card.');
        };
        window.addEventListener('message', onMessage);
        return () => { clearInterval(timer); window.removeEventListener('message', onMessage); };
    }, [iframeUrl, simPaymentRef, checkStatus, he]);

    const startPayment = () => {
        const ref = newRef();
        setSimPaymentRef(ref);
        setError('');
        const terminalName = 'gambot1';
        const params = new URLSearchParams({
            supplier: terminalName,
            sum: '1',
            currency: currency === 'ILS' ? '1' : '2',
            tranmode: 'VK', // card verification + token; the SIM itself is debited by our server
            cred_type: '1',
            hidesum: '1',
            company: companyInfo?.companyName || companyInfo?.organizationName || '',
            contact: companyInfo?.contactFullName || '',
            email: companyInfo?.contactEmail || '',
            phone: companyInfo?.contactPhoneNumber || '',
            remarks: 'SIM purchase at signup',
            simref: ref,
            pdesc: 'SIM',
            buttonLabel: he ? 'אימות כרטיס' : 'Verify Card',
            notify_url_address: 'https://gambot.azurewebsites.net/api/Webhooks/TranzilaWebhookCallback',
            success_url_address: `${window.location.origin}/sim-payment-success.html`,
            fail_url_address: `${window.location.origin}/sim-payment-failure.html`,
        });
        setIframeUrl(`https://direct.tranzila.com/${terminalName}/iframenew.php?${params.toString()}`);
    };

    const Arrow = isRTL ? FaArrowRight : FaArrowLeft;

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'} style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 8 }}>
                <FaShoppingCart style={{ marginInlineEnd: 8 }} />
                {he ? 'תשלום על כרטיס ה-SIM' : 'Payment for your SIM'}
            </h2>

            <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: 12, padding: 16, margin: '16px 0', lineHeight: 1.6 }}>
                <strong>{he ? 'שים לב לפני שממשיכים:' : 'Please note before continuing:'}</strong>
                <p style={{ margin: '8px 0 0' }}>
                    {he
                        ? `רכישת מספר מאיתנו מחויבת מיידית בסך ${simLabel} + מע״מ (חודש ראשון של ה-SIM). זה נעשה כי אנחנו משלמים על המספר מיד עם הקצאתו.`
                        : `Buying a number from us is charged immediately: ${simLabel} + VAT (the first month of the SIM). We pay for the number as soon as it is assigned to you.`}
                </p>
                <p style={{ margin: '8px 0 0' }}>
                    {he
                        ? 'החשבון עצמו נשאר בתקופת ניסיון חינם — החיוב היחיד עכשיו הוא על ה-SIM.'
                        : 'Your account itself stays on the free trial — the SIM is the only charge now.'}
                </p>
                <p style={{ margin: '8px 0 0', fontSize: '0.9em', opacity: 0.85 }}>
                    {he
                        ? 'הכרטיס יישמר לחיובים הבאים (SIM חודשי ומנוי בסיום הניסיון).'
                        : 'The card is kept on file for the following charges (monthly SIM and the subscription once the trial ends).'}
                </p>
            </div>

            {!iframeUrl && (
                <>
                    <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', cursor: 'pointer', margin: '12px 0' }}>
                        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} style={{ marginTop: 4 }} />
                        <span>
                            {he
                                ? `אני מאשר/ת חיוב מיידי של ${simLabel} + מע״מ עבור ה-SIM`
                                : `I approve an immediate charge of ${simLabel} + VAT for the SIM`}
                        </span>
                    </label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 16 }}>
                        <button type="button" className="nav-button prev-button" onClick={prevStep}>
                            <Arrow className="nav-icon" />
                            <span>{he ? 'חזרה' : 'Back'}</span>
                        </button>
                        <button type="button" className="nav-button next-button" onClick={startPayment} disabled={!accepted}>
                            <FaLock className="nav-icon" />
                            <span>{he ? `המשך לתשלום (${simLabel})` : `Continue to payment (${simLabel})`}</span>
                        </button>
                    </div>
                </>
            )}

            {iframeUrl && (
                <div>
                    <p style={{ textAlign: 'center', margin: '8px 0' }}>
                        <FaLock /> {he ? 'תשלום מאובטח — מלא את פרטי הכרטיס למטה' : 'Secure payment — fill in your card details below'}
                    </p>
                    <iframe
                        src={iframeUrl}
                        title="Tranzila SIM payment"
                        frameBorder="0"
                        style={{ width: '100%', height: 520, border: '1px solid #e5e7eb', borderRadius: 12 }}
                    />
                    <p style={{ textAlign: 'center', fontSize: '0.9em', opacity: 0.8 }}>
                        {he ? 'ממתין לאישור הכרטיס…' : 'Waiting for card confirmation…'}
                    </p>
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                        <button type="button" className="nav-button prev-button" onClick={() => { setIframeUrl(''); setError(''); }}>
                            <Arrow className="nav-icon" />
                            <span>{he ? 'חזרה' : 'Back'}</span>
                        </button>
                    </div>
                </div>
            )}

            {error && <p style={{ color: '#b91c1c', textAlign: 'center', marginTop: 12 }}>{error}</p>}
        </div>
    );
};

export default SimPayment;

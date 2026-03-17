'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OAuthSuccessInner() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const microsoftConnected = searchParams.get('microsoft_connected');
        const googleConnected    = searchParams.get('google_connected');
        const facebookConnected  = searchParams.get('facebook_connected');
        const connectionId       = searchParams.get('connection_id');
        const error              = searchParams.get('error');
        const errorMessage       = searchParams.get('message');

        let provider = null;
        if (microsoftConnected) provider = 'microsoft';
        if (googleConnected)    provider = 'google';
        if (facebookConnected)  provider = 'facebook';

        const broadcast = (data, channelName) => {
            try {
                const ch = new BroadcastChannel(channelName);
                ch.postMessage(data);
                ch.close();
            } catch (_) {}

            try { localStorage.setItem(`oauth_${error ? 'error' : 'success'}_${provider || 'unknown'}`, JSON.stringify(data)); } catch (_) {}

            if (window.opener && !window.opener.closed) {
                window.opener.postMessage(data, '*');
            }
        };

        if (error) {
            broadcast({
                type: 'oauth_error',
                provider: provider || 'unknown',
                error: errorMessage || error,
                timestamp: Date.now()
            }, `oauth_${provider || 'unknown'}`);
        } else if (provider) {
            broadcast({
                type: `${provider.toUpperCase()}_OAUTH_SUCCESS`,
                provider,
                connectionId: connectionId || `${provider}_success`,
                timestamp: Date.now()
            }, `oauth_${provider}`);
        }

        setTimeout(() => {
            window.close();
            if (!window.closed && window.opener && !window.opener.closed) {
                window.opener.postMessage({ type: 'CLOSE_POPUP' }, '*');
            }
        }, 800);
    }, [searchParams]);

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: '#f0fdf4', fontFamily: 'Arial, sans-serif',
            direction: 'rtl'
        }}>
            <div style={{
                background: 'white', borderRadius: 16, padding: '40px 48px',
                boxShadow: '0 4px 24px rgba(0,0,0,.1)', textAlign: 'center', maxWidth: 360
            }}>
                <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: '#22c55e', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 20px'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h2 style={{ margin: '0 0 8px', color: '#166534', fontSize: 22 }}>הצלחה!</h2>
                <p style={{ margin: '0 0 4px', color: '#4b5563' }}>החיבור הושלם בהצלחה</p>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: 13 }}>חלון זה ייסגר אוטומטית...</p>
            </div>
        </div>
    );
}

export default function OAuthSuccessPage() {
    return (
        <Suspense fallback={null}>
            <OAuthSuccessInner />
        </Suspense>
    );
}

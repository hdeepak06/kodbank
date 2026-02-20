import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Using v2 key to force show for testing
        const consent = localStorage.getItem('kodbank_cookie_pref_v2');
        console.log('Checking Cookie Consent (v2):', consent);

        if (!consent) {
            const timer = setTimeout(() => {
                console.log('Showing Cookie Modal now...');
                setIsVisible(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('kodbank_cookie_pref_v2', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        style={{
                            width: '440px',
                            background: 'var(--surface)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '28px',
                            padding: '40px',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.9)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            borderTop: '4px solid var(--primary)'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
                            <div style={{
                                background: 'var(--primary-glow)',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 30px var(--primary-glow)'
                            }}>
                                <Cookie size={40} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px', color: '#fff', letterSpacing: '-1px' }}>Institutional Cookie Protocol</h3>
                                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    We use encrypted security cookies to monitor your session and prevent unauthorized access. By clicking accept, you authorize our security protocols.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="btn btn-outline"
                                style={{ flex: 1, padding: '14px', fontSize: '0.95rem', borderRadius: '16px', fontWeight: 600 }}
                            >
                                Decline
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAccept}
                                className="btn btn-primary"
                                style={{ flex: 2, padding: '14px', fontSize: '0.95rem', borderRadius: '16px', fontWeight: 700 }}
                            >
                                Accept & Proceed
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transferMoney } from '../api';
import { Send, User, IndianRupee, ArrowRight, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Transfer = () => {
    const [formData, setFormData] = useState({ recipientEmail: '', amount: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const { data } = await transferMoney(formData);
            setStatus({ type: 'success', message: data.message });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Transfer failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-center animate-fade-in">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ maxWidth: '520px', background: 'var(--surface)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        background: 'var(--primary-glow)',
                        width: '72px',
                        height: '72px',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}>
                        <Send size={32} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px' }}>Move Assets</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
                        Instant peer-to-peer asset transfer to any recipient.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                background: status.type === 'error' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: status.type === 'error' ? 'var(--error)' : 'var(--success)',
                                padding: '16px',
                                borderRadius: '14px',
                                marginBottom: '24px',
                                fontSize: '0.95rem',
                                textAlign: 'center',
                                fontWeight: '600',
                                border: `1px solid ${status.type === 'error' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                            }}
                        >
                            {status.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Recipient Institutional Email</label>
                        <div style={{ position: 'relative' }}>
                            <User size={20} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)', opacity: 0.6 }} />
                            <input
                                type="email"
                                placeholder="institutional@kodbank.com"
                                style={{ paddingLeft: '52px' }}
                                required
                                value={formData.recipientEmail}
                                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Asset Amount (INR)</label>
                        <div style={{ position: 'relative' }}>
                            <IndianRupee size={20} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)', opacity: 0.6 }} />
                            <input
                                type="number"
                                placeholder="0.00"
                                min="1"
                                step="0.01"
                                style={{ paddingLeft: '52px' }}
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '18px', marginBottom: '32px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            <span>Network Fee (0%)</span>
                            <span style={{ color: 'var(--success)', fontWeight: '600' }}>WAIVED</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                            <span>Total Settlement</span>
                            <span style={{ color: 'var(--primary)' }}>₹{formData.amount || '0.00'}</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing Transaction...' : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                Execute Transfer
                                <History size={18} />
                            </div>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Transfer;

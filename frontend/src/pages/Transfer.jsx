import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transferMoney, withdrawMoney } from '../api';
import { Send, User, IndianRupee, ArrowRight, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Transfer = () => {
    const [mode, setMode] = useState('transfer'); // 'transfer' or 'withdraw'
    const [formData, setFormData] = useState({ recipientEmail: '', amount: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const { data } = mode === 'transfer'
                ? await transferMoney(formData)
                : await withdrawMoney({ amount: formData.amount });

            setStatus({ type: 'success', message: data.message });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || `${mode === 'transfer' ? 'Transfer' : 'Withdrawal'} failed` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass card"
                style={{ maxWidth: '500px' }}
            >
                {/* Toggle Mode */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '32px' }}>
                    <button
                        onClick={() => setMode('transfer')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            background: mode === 'transfer' ? 'var(--primary)' : 'transparent',
                            color: mode === 'transfer' ? 'white' : 'var(--text-muted)',
                            fontWeight: 600,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Transfer
                    </button>
                    <button
                        onClick={() => setMode('withdraw')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            background: mode === 'withdraw' ? 'var(--primary)' : 'transparent',
                            color: mode === 'withdraw' ? 'white' : 'var(--text-muted)',
                            fontWeight: 600,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Withdraw
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ background: mode === 'transfer' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(236, 72, 153, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        {mode === 'transfer' ? <Send size={32} color="#6366f1" /> : <Wallet size={32} color="#ec4899" />}
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{mode === 'transfer' ? 'Transfer Money' : 'Withdraw Funds'}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {mode === 'transfer' ? 'Send funds instantly to any KodBank account' : 'Withdraw money from your secure digital wallet'}
                    </p>
                </div>

                {status.message && (
                    <div style={{
                        background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: status.type === 'error' ? 'var(--error)' : 'var(--success)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {mode === 'transfer' && (
                            <motion.div
                                key="transfer-fields"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="input-group"
                            >
                                <label>Recipient's Email</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                                    <input
                                        type="email"
                                        placeholder="recipient@example.com"
                                        style={{ paddingLeft: '40px' }}
                                        required
                                        value={formData.recipientEmail}
                                        onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="input-group">
                        <label>Amount (INR)</label>
                        <div style={{ position: 'relative' }}>
                            <IndianRupee size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                            <input
                                type="number"
                                placeholder="0.00"
                                min="1"
                                step="0.01"
                                style={{ paddingLeft: '40px' }}
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px dashed var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            <span>Transaction Fee</span>
                            <span>₹0.00</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                            <span>Total Deducted</span>
                            <span>₹{formData.amount || '0.00'}</span>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', background: mode === 'withdraw' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : undefined }} disabled={loading}>
                        {loading ? 'Processing...' : (
                            <>
                                {mode === 'transfer' ? 'Send Money' : 'Withdraw Now'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Transfer;

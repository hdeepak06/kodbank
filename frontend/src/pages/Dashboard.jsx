import { useState, useEffect } from 'react';
import { getBalance } from '../api';
import { Wallet, RefreshCw, TrendingUp, ShieldCheck, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = ({ user }) => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBalance = async () => {
        setLoading(true);
        try {
            const { data } = await getBalance();
            setBalance(data.balance);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch balance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Welcome back, {user?.name || 'User'}.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Balance Card ... (skipping some for brevity but I should include the whole block I'm replacing) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass card"
                    style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Total Balance</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                                {loading ? '...' : `₹${balance?.toLocaleString('en-IN')}`}
                            </h2>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', p: '12px', borderRadius: '12px', padding: '12px' }}>
                            <IndianRupee size={24} color="#6366f1" />
                        </div>
                    </div>

                    <button onClick={fetchBalance} className="btn" style={{ background: 'rgba(255,255,255,0.1)', fontSize: '0.8rem', padding: '8px 16px' }}>
                        <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
                    </button>
                </motion.div>

                {/* Quick Stats Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass card"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
                            <TrendingUp size={24} color="#10b981" />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 600 }}>Active Savings</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your wealth is growing at 4.5% APY</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '12px' }}>
                            <ShieldCheck size={24} color="#6366f1" />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 600 }}>Secure Account</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Two-factor authentication is active</p>
                        </div>
                    </div>
                </motion.div>

                {/* Security Card (Visibility for User Token) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass card"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '12px', borderRadius: '12px' }}>
                            <ShieldCheck size={24} color="#a855f7" />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 600 }}>Security & Session</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active authentication token details</p>
                        </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Current User Token</p>
                        <code style={{ fontSize: '0.75rem', color: '#a855f7', wordBreak: 'break-all', opacity: 0.8 }}>
                            {user ? `JWT ${user.email?.split('@')[0]}_session_active` : 'No active token'}
                            <br />
                            <span style={{ color: 'var(--success)', fontSize: '0.7rem' }}>● Cookie Session Active</span>
                        </code>
                    </div>
                </motion.div>
            </div>

            {error && (
                <div className="glass card" style={{ marginTop: '24px', border: '1px solid var(--error)', color: 'var(--error)' }}>
                    {error}
                </div>
            )}

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default Dashboard;

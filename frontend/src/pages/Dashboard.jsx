import { useState, useEffect } from 'react';
import { getBalance } from '../api';
import { RefreshCw, TrendingUp, ShieldCheck, IndianRupee, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
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

    const stats = [
        { label: 'Weekly Income', value: '+₹24,500', color: '#10b981', icon: ArrowDownLeft },
        { label: 'Weekly Spent', value: '-₹12,400', color: '#f43f5e', icon: ArrowUpRight },
        { label: 'Saving Goal', value: '85%', color: 'var(--primary)', icon: TrendingUp },
    ];

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
            {/* Header */}
            <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '8px' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user?.name || 'Partner'}</span>. Here's your status.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchBalance}
                    className="btn btn-outline"
                    style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                    <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    Sync Account
                </motion.button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

                {/* Main Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                    style={{
                        gridColumn: 'span 1',
                        background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}>
                        <IndianRupee size={200} />
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: '12px' }}>
                                <Wallet size={20} color="var(--primary)" />
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Balance</span>
                        </div>

                        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px', marginBottom: '16px' }}>
                            {loading ? <span style={{ opacity: 0.3 }}>••••••</span> : `₹${balance?.toLocaleString('en-IN')}`}
                        </h2>

                        <div style={{ display: 'flex', gap: '8px', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 600 }}>
                            <TrendingUp size={18} />
                            <span>+2.4% this month</span>
                        </div>
                    </div>
                </motion.div>

                {/* Account Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card"
                    style={{ background: 'var(--surface-alt)' }}
                >
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>Market Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {stats.map((stat, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i < 2 ? '1px solid var(--glass-border)' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: `${stat.color}15`, padding: '8px', borderRadius: '10px' }}>
                                        <stat.icon size={18} color={stat.color} />
                                    </div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</span>
                                </div>
                                <span style={{ fontWeight: 700, color: stat.color }}>{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Security Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                    style={{ border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.02)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '14px' }}>
                            <ShieldCheck size={24} color="var(--success)" />
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>BankKod Guard</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your account is fully protected.</p>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700 }}>● SECURE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last Sync</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ marginTop: '24px', border: '1px solid var(--error)', color: 'var(--error)', padding: '20px' }}>
                    {error}
                </motion.div>
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

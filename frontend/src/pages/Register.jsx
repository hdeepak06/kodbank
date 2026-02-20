import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { UserPlus, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await register(formData);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try a different email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-center animate-fade-in">
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="card"
                style={{ maxWidth: '440px', background: 'var(--surface)', border: '1px solid var(--glass-border)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        background: 'var(--primary-glow)',
                        width: '72px',
                        height: '72px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                    }}>
                        <UserPlus size={36} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-1px' }}>Join KodBank</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Open your institutional wealth account.</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--error)', padding: '14px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.9rem', border: '1px solid rgba(244, 63, 94, 0.2)', fontWeight: '500' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Legal Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={20} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)', opacity: 0.7 }} />
                            <input
                                type="text"
                                placeholder="E.g. Deepak Kumar"
                                style={{ paddingLeft: '48px' }}
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)', opacity: 0.7 }} />
                            <input
                                type="email"
                                placeholder="name@domain.com"
                                style={{ paddingLeft: '48px' }}
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Security Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)', opacity: 0.7 }} />
                            <input
                                type="password"
                                placeholder="Min. 8 characters"
                                style={{ paddingLeft: '48px' }}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '8px', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing Application...' : 'Apply for Account'}
                    </motion.button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Already an institutional member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid currentColor' }}>Sign In Securely</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

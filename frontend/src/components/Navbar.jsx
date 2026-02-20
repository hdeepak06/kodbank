import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Landmark, LogOut, LayoutDashboard, Send, User } from 'lucide-react';
import { logout } from '../api';
import { motion } from 'framer-motion';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            localStorage.removeItem('user');
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const NavLink = ({ to, icon: Icon, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} style={{ textDecoration: 'none' }}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: isActive ? 'var(--primary)' : 'var(--text)',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.95rem',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        background: isActive ? 'var(--primary-glow)' : 'transparent',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {children}
                </motion.div>
            </Link>
        );
    };

    return (
        <nav className="glass" style={{ margin: '24px 24px 0', borderRadius: '24px', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '24px', zIndex: 100 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white' }}>
                <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Landmark size={24} color="var(--bg)" />
                </div>
                <span className="brand-font" style={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-1px' }}>KodBank</span>
            </Link>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                        <NavLink to="/transfer" icon={Send}>Transfers</NavLink>

                        <div style={{ borderLeft: '1px solid var(--glass-border)', height: '24px', margin: '0 16px' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '8px' }}>
                            <div style={{ background: 'var(--surface-alt)', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--glass-border)' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                                    {user.name?.[0].toUpperCase()}
                                </div>
                                <span style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600, paddingRight: '8px' }}>{user.name}</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(244, 63, 94, 0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            style={{
                                color: 'var(--error)',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                fontWeight: 600
                            }}
                        >
                            <LogOut size={20} /> Logout
                        </motion.button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline" style={{ border: 'none', fontWeight: 700 }}>Login</Link>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '14px' }}>Open Account</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

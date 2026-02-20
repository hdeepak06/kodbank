import { Link, useNavigate } from 'react-router-dom';
import { Landmark, LogOut, LayoutDashboard, Send } from 'lucide-react';
import { logout } from '../api';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

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

    return (
        <nav className="glass" style={{ margin: '20px', borderRadius: '16px', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>
                <Landmark size={32} color="#6366f1" />
                KodBank
            </Link>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/dashboard" className="btn" style={{ color: 'white' }}>
                            <LayoutDashboard size={20} /> Dashboard
                        </Link>
                        <Link to="/transfer" className="btn" style={{ color: 'white' }}>
                            <Send size={20} /> Transfer
                        </Link>
                        <div style={{ borderLeft: '1px solid var(--glass-border)', height: '24px', margin: '0 10px' }} />
                        <span style={{ color: 'var(--text-muted)' }}>Hello, <b>{user.name}</b></span>
                        <button onClick={handleLogout} className="btn" style={{ color: 'var(--error)', background: 'transparent' }}>
                            <LogOut size={20} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn" style={{ color: 'white' }}>Login</Link>
                        <Link to="/register" className="btn btn-primary">Open Account</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

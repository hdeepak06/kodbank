import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import ChatBot from './components/ChatBot';
import CookieConsent from './components/CookieConsent';
import { getMe } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await getMe();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (err) {
        console.log('No active session foundation');
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return (
    <div className="page-center" style={{ flexDirection: 'column', gap: '20px' }}>
      <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
      <span style={{ color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px' }}>ESTABLISHING SECURE CONNECTION</span>
    </div>
  );

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <main className="animate-fade-in">
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/transfer" element={user ? <Transfer /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      {user && <CookieConsent />}
      <ChatBot />
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Router>
  );
}

export default App;

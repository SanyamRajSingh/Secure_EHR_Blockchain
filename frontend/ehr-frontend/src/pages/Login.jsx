import React, { useState, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../landing.css';
import { API_BASE } from '../api';
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    // Unstyled flash natively resolvent
    const style = document.getElementById('page-transition-style');
    if (style) style.remove();

    const ctx = gsap.context(() => {
      // Background explicitly loaded
      gsap.fromTo('.ehr-bg',
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out', force3D: true }
      );

      gsap.fromTo('.auth-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', force3D: true }
      );

      // Button hovers safely mapped
      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'power1.out' }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power1.in' }));
        btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.97, duration: 0.1 }));
        btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1.05, duration: 0.1 }));
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Username and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Store Auth Session safely matching logic 
      localStorage.setItem('ehr-role', data.data.role);
      localStorage.setItem('ehr-username', data.data.username);
      
      navigate('/dashboard', { replace: true });

    } catch (err) {
      setErrorMsg(err.message || 'Network error. Backend not running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="page-wrapper auth-page flex-col" id="login-page">
      <nav className="ehr-nav" style={{position:'absolute', top:0, left:0, padding:'20px', background: 'transparent', border: 'none', backdropFilter: 'none'}}>
        <ThemeToggle />
      </nav>

      <div className="ehr-bg">
        <div className="ehr-bg__gradient"></div>
        <div className="ehr-bg__grid"></div>
      </div>
      <div className="auth-card">
        <div className="auth-card__logo">
          <Link to="/" className="logo-icon" style={{textDecoration:'none'}}>⬡</Link>
          <span className="logo-text">EHR Chain</span>
        </div>
        <h2 className="auth-card__title">Welcome Back</h2>
        <p className="auth-card__subtitle">Secure access to your records</p>

        {errorMsg && <div className="alert-error" id="login-error">{errorMsg}</div>}

        <form className="auth-form login-form" id="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <input 
               type="text" id="login-username" placeholder="Enter username" 
               value={username} onChange={e => setUsername(e.target.value)} 
               disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input 
               type="password" id="login-password" placeholder="Enter password" 
               value={password} onChange={e => setPassword(e.target.value)} 
               disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn btn--primary" id="login-submit" disabled={loading} style={{width: '100%'}}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
          <p className="auth-switch">Need an account? <Link to="/signup">Sign Up</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Login;

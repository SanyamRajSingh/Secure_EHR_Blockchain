import React, { useState, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../landing.css';
import { API_BASE } from '../api';
import ThemeToggle from "../components/ThemeToggle";

function Signup() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const style = document.getElementById('page-transition-style');
    if (style) style.remove();

    const ctx = gsap.context(() => {
      gsap.fromTo('.ehr-bg',
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out', force3D: true }
      );

      gsap.fromTo('.auth-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', force3D: true }
      );

      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'power1.out' }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power1.in' }));
        btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.97, duration: 0.1 }));
        btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1.05, duration: 0.1 }));
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || password.length < 6 || !role) {
      setErrorMsg('All fields are required. Password minimum 6 chars.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Signup failed.');
      }

      setSuccessMsg('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
      
    } catch (err) {
      setErrorMsg(err.message || 'Network error. Backend not running?');
    } finally {
      if(!successMsg) setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="page-wrapper auth-page flex-col" id="signup-page">
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
        <h2 className="auth-card__title">Create Account</h2>
        <p className="auth-card__subtitle">Join the secure health network</p>

        {errorMsg && <div className="alert-error" id="signup-error">{errorMsg}</div>}
        {successMsg && <div className="alert-success" id="signup-success">{successMsg}</div>}

        <form className="auth-form" id="signup-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="signup-username">Username</label>
            <input 
               type="text" id="signup-username" placeholder="Choose a username" 
               value={username} onChange={e => setUsername(e.target.value)} autoComplete="off" 
               disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input 
               type="password" id="signup-password" placeholder="Minimum 6 characters" 
               value={password} onChange={e => setPassword(e.target.value)} 
               disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-role">Role</label>
            <select id="signup-role" value={role} onChange={e => setRole(e.target.value)} disabled={loading}>
              <option value="">Select your role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <button type="submit" className="btn btn--primary" id="signup-submit" disabled={loading} style={{width: '100%'}}>
            {loading ? (successMsg ? 'Created' : 'Creating...') : 'Create Account'}
          </button>
          <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;

import React, { useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../landing.css';
import ThemeToggle from "../components/ThemeToggle";

gsap.registerPlugin(ScrollTrigger);

function Landing() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    // Check Auth - if logged in, bounce to dashboard avoiding animation overlaps.
    const role = localStorage.getItem('ehr-role') || sessionStorage.getItem('ehr-role');
    if (role) {
      navigate('/dashboard', { replace: true });
      return;
    }

    // Resolve unstyled flash natively globally.
    const style = document.getElementById('page-transition-style');
    if (style) style.remove();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Ensure elements fade IN cleanly
      tl.fromTo('.ehr-bg',
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out', force3D: true }
      );

      tl.fromTo('.ehr-nav',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', force3D: true },
        '-=0.6'
      );

      tl.fromTo('.ehr-hero__eyebrow',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', force3D: true },
        '-=0.2'
      );

      tl.fromTo('.title-line--1, .title-line--2',
        { opacity: 0, y: 100, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, stagger: 0.15, ease: 'power4.out', force3D: true },
        '-=0.1'
      );

      tl.fromTo('.ehr-hero__tagline',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', force3D: true },
        '-=0.4'
      );

      tl.fromTo('.ehr-hero__subtext',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', force3D: true },
        '-=0.5'
      );

      tl.fromTo('.ehr-hero__actions .btn',
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.4)', force3D: true },
        '-=0.3'
      );

      tl.fromTo('.ehr-hero__badge',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', force3D: true },
        '-=0.2'
      );

      // Continuous floating shapes
      gsap.to('.shape--1', { y: -30, x: 15, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.shape--2', { y: 25, x: -20, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
      gsap.to('.shape--3', { y: -20, rotation: 15, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
      gsap.to('.badge-dot', { scale: 1.5, opacity: 0.4, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      // ScrollTrigger Sequences
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, stagger: 0.15, ease: 'power3.out', force3D: true,
          scrollTrigger: {
            trigger: '.ehr-features',
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );

      gsap.fromTo('.sec-badge',
        { opacity: 0, scale: 0.7, rotation: -10 },
        {
          opacity: 1, scale: 1, rotation: 0,
          duration: 0.6, stagger: 0.2, ease: 'back.out(1.7)', force3D: true,
          scrollTrigger: {
            trigger: '.ehr-security',
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );

      gsap.fromTo('.section-title',
        { opacity: 0, y: 40 },
        {
           opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', force3D: true,
           scrollTrigger: { trigger: '.section-title', start: 'top 85%', once: true }
        }
      );
      
      gsap.fromTo('.ehr-security__text',
        { opacity: 0, x: 60 },
        {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', force3D: true,
            scrollTrigger: { trigger: '.ehr-security', start: 'top 75%', once: true }
        }
      );

      gsap.fromTo('.ehr-footer',
        { opacity: 0, y: 20 },
        {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', force3D: true,
            scrollTrigger: { trigger: '.ehr-footer', start: 'top 95%', once: true }
        }
      );

      // Button hovers bound natively referencing purely local nodes
      document.querySelectorAll('.btn, button').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'power1.out' }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power1.in' }));
        btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.97, duration: 0.1 }));
        btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1.05, duration: 0.1 }));
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [navigate]);

  return (
    <div ref={containerRef} className="ehr-landing">
      {/* Background Layer */}
      <div className="ehr-bg">
        <div className="ehr-bg__gradient"></div>
        <div className="ehr-bg__grid"></div>
        <div className="ehr-floating-shapes">
          <div className="shape shape--circle shape--1"></div>
          <div className="shape shape--circle shape--2"></div>
          <div className="shape shape--blob shape--3"></div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="ehr-nav">
        <div className="ehr-nav__logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">EHR Chain</span>
        </div>
        <div className="ehr-nav__links">
          <a href="#features" className="nav-link" data-router-link="true">Features</a>
          <a href="#security" className="nav-link" data-router-link="true">Security</a>
          <ThemeToggle />
          <Link to="/login" className="nav-link nav-link--cta">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="ehr-hero" id="hero">
        <div className="ehr-hero__eyebrow">Next-Generation Healthcare</div>
        <h1 className="ehr-hero__title">
          <span className="title-line title-line--1">SECURE EHR</span>
          <span className="title-line title-line--2">SYSTEM</span>
        </h1>
        <p className="ehr-hero__tagline">Powered by Blockchain. Built for Trust.</p>
        <p className="ehr-hero__subtext">
          Tamper-proof medical records, real-time blockchain verification,<br />
          and end-to-end security for patients and physicians alike.
        </p>
        <div className="ehr-hero__actions">
          <Link to="/login" className="btn btn--primary ehr-btn-login">Login</Link>
          <Link to="/signup" className="btn btn--secondary ehr-btn-signup">Sign Up</Link>
        </div>
        <div className="ehr-hero__badge">
          <span className="badge-dot"></span>
          <span className="badge-text">Live on Blockchain</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="ehr-features" id="features">
        <h2 className="section-title">Why EHR Chain?</h2>
        <div className="ehr-features__grid">
          <div className="feature-card" data-animate="card">
            <div className="feature-card__icon">🔒</div>
            <h3 className="feature-card__title">Immutable Records</h3>
            <p className="feature-card__desc">Every medical record is cryptographically hashed and stored on-chain. No tampering. No loss.</p>
          </div>
          <div className="feature-card" data-animate="card">
            <div className="feature-card__icon">⚡</div>
            <h3 className="feature-card__title">Instant Access</h3>
            <p className="feature-card__desc">Authorized doctors retrieve patient records in real time, anywhere, with full audit trails.</p>
          </div>
          <div className="feature-card" data-animate="card">
            <div className="feature-card__icon">🧬</div>
            <h3 className="feature-card__title">Patient-Centric</h3>
            <p className="feature-card__desc">Patients own their health data. Complete visibility into who accessed their records and when.</p>
          </div>
          <div className="feature-card" data-animate="card">
            <div className="feature-card__icon">🔗</div>
            <h3 className="feature-card__title">Blockchain-Verified</h3>
            <p className="feature-card__desc">Each transaction generates a SHA-256 hash stored in an append-only blockchain ledger.</p>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="ehr-security" id="security">
        <div className="ehr-security__content">
          <div className="security-badge-stack">
            <div className="sec-badge sec-badge--1" data-animate="badge">SHA-256</div>
            <div className="sec-badge sec-badge--2" data-animate="badge">Encrypted</div>
            <div className="sec-badge sec-badge--3" data-animate="badge">Verified</div>
          </div>
          <div className="ehr-security__text">
            <h2 className="section-title">Security You Can Trust</h2>
            <p>Every record insert triggers an automatic blockchain entry. Your data is protected by cryptographic proof — not promises.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ehr-footer">
        <p>© 2026 EHR Chain. Secured by Blockchain.</p>
      </footer>
    </div>
  );
}

export default Landing;

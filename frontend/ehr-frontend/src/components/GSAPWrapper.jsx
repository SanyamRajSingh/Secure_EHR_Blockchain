import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export default function GSAPWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // Auth Guard: redirect to login if no role stored
    const role = localStorage.getItem('ehr-role') || sessionStorage.getItem('ehr-role');
    if (!role) {
      navigate('/login', { replace: true });
      return;
    }

    // Safe GSAP context — only targets elements guaranteed to exist at mount
    const ctx = gsap.context(() => {
      // Page entrance: fade in the whole wrapper
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out', force3D: true }
      );

      // Button hover effects — only bind to buttons actually present at mount
      const buttons = gsap.utils.toArray('button', containerRef.current);
      buttons.forEach(btn => {
        if (!btn.dataset.hoverBound) {
          btn.dataset.hoverBound = 'true';
          btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'power1.out' }));
          btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1,    duration: 0.2, ease: 'power1.in'  }));
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [location.pathname, navigate]);

  return (
    <div ref={containerRef} style={{ width: '100%', opacity: 0 }}>
      {children}
    </div>
  );
}

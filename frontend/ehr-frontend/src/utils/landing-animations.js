import gsap from 'gsap';
import { buttonHover } from './animations.js';

export function initLandingAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.ehr-bg', { opacity: 0, duration: 1.2 });
  tl.from('.ehr-nav', { opacity: 0, y: -30, duration: 0.6 }, '-=0.6');
  tl.from('.ehr-hero__eyebrow', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2');
  tl.from('.title-line--1', { opacity: 0, y: 100, duration: 1, skewY: 3 }, '-=0.1');
  tl.from('.title-line--2', { opacity: 0, y: 100, duration: 1, skewY: 3 }, '-=0.75');
  tl.from('.ehr-hero__tagline', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4');
  tl.from('.ehr-hero__subtext', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5');
  tl.from('.ehr-hero__actions .btn', { opacity: 0, scale: 0.8, y: 20, duration: 0.6, stagger: 0.15 }, '-=0.3');
  tl.from('.ehr-hero__badge', { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');

  gsap.to('.shape--1', { y: -30, x: 15, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.shape--2', { y: 25, x: -20, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
  // Reduced shapes to prevent lag. Original prompt suggested reducing shape 3 and 4 if lag occurs. We'll add 3 but not 4.
  gsap.to('.shape--3', { y: -20, rotation: 15, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
  
  gsap.to('.badge-dot', { scale: 1.5, opacity: 0.4, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  document.querySelectorAll('.btn').forEach(btn => buttonHover(btn));
}

export function initScrollAnimations() {
  gsap.from('.feature-card', {
    scrollTrigger: { trigger: '.ehr-features', start: 'top 75%', toggleActions: 'play none none none' },
    opacity: 0, y: 60, scale: 0.95, duration: 0.7, stagger: 0.15, ease: 'power3.out', clearProps: 'all'
  });

  gsap.from('.section-title', {
    scrollTrigger: { trigger: '.section-title', start: 'top 85%', toggleActions: 'play none none none' },
    opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', clearProps: 'all'
  });

  gsap.from('.sec-badge', {
    scrollTrigger: { trigger: '.ehr-security', start: 'top 80%', toggleActions: 'play none none none' },
    opacity: 0, scale: 0.7, rotation: -10, duration: 0.6, stagger: 0.2, ease: 'back.out(1.7)', clearProps: 'all'
  });

  gsap.from('.ehr-security__text', {
    scrollTrigger: { trigger: '.ehr-security', start: 'top 75%', toggleActions: 'play none none none' },
    opacity: 0, x: 60, duration: 0.8, ease: 'power3.out', clearProps: 'all'
  });

  gsap.from('.ehr-footer', {
    scrollTrigger: { trigger: '.ehr-footer', start: 'top 95%', toggleActions: 'play none none none' },
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', clearProps: 'all'
  });
}

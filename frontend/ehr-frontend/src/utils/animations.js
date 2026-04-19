import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function fadeIn(target, options = {}) {
  const { duration = 0.8, delay = 0, y = 0 } = options;
  return gsap.from(target, {
    opacity: 0,
    y,
    duration,
    delay,
    ease: 'power3.out',
    clearProps: 'all'
  });
}

export function slideUp(target, options = {}) {
  const { duration = 0.9, delay = 0, distance = 60 } = options;
  return gsap.from(target, {
    opacity: 0,
    y: distance,
    duration,
    delay,
    ease: 'power4.out',
    clearProps: 'all'
  });
}

export function staggerReveal(targets, options = {}) {
  const { duration = 0.7, stagger = 0.15, y = 40, delay = 0 } = options;
  return gsap.from(targets, {
    opacity: 0,
    y,
    duration,
    stagger,
    delay,
    ease: 'power3.out',
    clearProps: 'all'
  });
}

export function pageTransitionOut(wrapper, callback) {
  gsap.to(wrapper, {
    opacity: 0,
    y: -20,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: callback
  });
}

export function pageTransitionIn(wrapper) {
  gsap.from(wrapper, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power3.out',
    clearProps: 'all'
  });
}

export function buttonHover(btn) {
  btn.addEventListener('mouseenter', () => {
    gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'power1.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power1.in' });
  });
  btn.addEventListener('mousedown', () => {
    gsap.to(btn, { scale: 0.97, duration: 0.1 });
  });
  btn.addEventListener('mouseup', () => {
    gsap.to(btn, { scale: 1.05, duration: 0.1 });
  });
}

export function scrollFadeIn(trigger, targets) {
  gsap.from(targets, {
    scrollTrigger: {
      trigger,
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    clearProps: 'all'
  });
}

export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach(t => t.kill());
  gsap.killTweensOf('*');
}

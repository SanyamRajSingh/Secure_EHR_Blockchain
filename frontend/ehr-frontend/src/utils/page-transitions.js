import { pageTransitionOut, pageTransitionIn } from './animations.js';

export function initPageTransitions() {
  const wrapper = document.querySelector('.page-wrapper') || document.body;
  pageTransitionIn(wrapper);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto')) {
      link.addEventListener('click', (e) => {
        // Only intercept standard internal links, ignore Link targets handled by React Router internally
        // In React, this is mostly handled by passing location changing hooks instead. 
        // We attach this generically for non-Router anchor tags natively.
        if(!link.hasAttribute('data-router-link')) {
             e.preventDefault();
             pageTransitionOut(wrapper, () => {
               window.location.href = href;
             });
        }
      });
    }
  });
}

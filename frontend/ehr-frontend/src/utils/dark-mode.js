import gsap from 'gsap';

export function initDarkMode() {
  const toggle = document.getElementById('theme-toggle');
  if(!toggle) return; // fail safe
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('ehr-theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  updateToggleIcon(savedTheme);

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: ${next === 'dark' ? '#0d1117' : '#ffffff'};
      opacity: 0; pointer-events: none;
    `;
    document.body.appendChild(overlay);

    gsap.timeline()
      .to(overlay, { opacity: 0.4, duration: 0.25, ease: 'power2.in' })
      .call(() => {
        root.setAttribute('data-theme', next);
        localStorage.setItem('ehr-theme', next);
        updateToggleIcon(next);
      })
      .to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.out' })
      .call(() => overlay.remove());
  });
}

function updateToggleIcon(theme) {
  const lightIcon = document.querySelector('.theme-toggle__icon--light');
  const darkIcon = document.querySelector('.theme-toggle__icon--dark');
  if (!lightIcon || !darkIcon) return;

  if (theme === 'dark') {
    lightIcon.style.display = 'none';
    darkIcon.style.display = 'inline';
  } else {
    lightIcon.style.display = 'inline';
    darkIcon.style.display = 'none';
  }
}

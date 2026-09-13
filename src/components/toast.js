// toast — notifikasi singkat di bawah layar

import { icon, iconHTML } from './icons.js';

export function toast(message, type = 'info') {
  const root = document.getElementById('toast-root');
  if (!root) return;

  // Batasi maksimal 3 toast aktif agar tidak menumpuk di layar
  while (root.children.length >= 3) {
    root.firstChild.remove();
  }

  const el = document.createElement('div');
  el.className = `toast${type === 'success' ? ' is-success' : ''}${
    type === 'danger' ? ' is-danger' : ''
  }`;
  el.style.cursor = 'pointer';
  el.title = 'Klik untuk menutup';

  const dot = document.createElement('span');
  dot.className = 'toast__dot';
  const text = document.createElement('span');
  text.textContent = message;

  el.append(dot, text);
  root.append(el);

  let timer = setTimeout(() => {
    el.style.transition = 'opacity .25s ease, transform .25s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 250);
  }, 2600);

  el.addEventListener('click', () => {
    clearTimeout(timer);
    el.remove();
  });
}
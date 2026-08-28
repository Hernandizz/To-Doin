// toast — notifikasi singkat di bawah layar

import { icon, iconHTML } from './icons.js';

export function toast(message, type = 'info') {
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = `toast${type === 'success' ? ' is-success' : ''}${
    type === 'danger' ? ' is-danger' : ''
  }`;
  el.innerHTML = `<span class="toast__dot"></span><span>${message}</span>`;
  root.append(el);
  setTimeout(() => {
    el.style.transition = 'opacity .3s ease, transform .3s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 300);
  }, 2600);
}
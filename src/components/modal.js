// modal — helper buka/tutup overlay dan dialog

import { icon } from './icons.js';

export function openModal(el, { onClose } = {}) {
  const root = document.getElementById('modal-root');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.append(el);

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    onClose?.();
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      const overlays = root ? root.querySelectorAll('.overlay, .drawer-overlay') : [];
      if (overlays.length > 0 && overlays[overlays.length - 1] === overlay) {
        close();
      }
    }
  }

  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', onKey);

  // ikat tombol penutup apa pun yang bertanda data-close
  overlay.querySelectorAll('[data-close]').forEach((b) =>
    b.addEventListener('click', close)
  );

  root.append(overlay);
  return { close, overlay };
}

export function modalFrame(title, body, footer) {
  const head = document.createElement('div');
  head.className = 'modal__head';
  const titleEl = document.createElement('h2');
  titleEl.className = 'modal__title';
  titleEl.textContent = title;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'icon-btn';
  closeBtn.dataset.close = '1';
  closeBtn.setAttribute('aria-label', 'Tutup');
  closeBtn.title = 'Tutup';
  closeBtn.append(icon('x'));
  head.append(titleEl, closeBtn);

  const bodyEl = document.createElement('div');
  bodyEl.className = 'modal__body';
  bodyEl.append(body);

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.append(head, bodyEl);
  if (footer) {
    const footEl = document.createElement('div');
    footEl.className = 'modal__foot';
    footEl.append(footer);
    modal.append(footEl);
  }
  return { modal, closeBtn };
}

export function confirmDialog({
  title = 'Yakin?',
  message = '',
  confirmText = 'Hapus',
  danger = true,
  onConfirm,
}) {
  const body = document.createElement('div');
  const p = document.createElement('p');
  p.className = 'form-note';
  p.textContent = message;
  body.append(p);

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn--ghost';
  cancelBtn.textContent = 'Batal';

  const okBtn = document.createElement('button');
  okBtn.className = `btn ${danger ? 'btn--danger' : 'btn--primary'}`;
  okBtn.textContent = confirmText;

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.gap = '10px';
  footer.style.width = '100%';
  footer.style.justifyContent = 'flex-end';
  footer.append(cancelBtn, okBtn);

  const { modal } = modalFrame(title, body, footer);
  let api;
  cancelBtn.addEventListener('click', () => api.close());
  okBtn.addEventListener('click', () => {
    onConfirm();
    api.close();
  });
  api = openModal(modal);
  return api;
}
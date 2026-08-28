// appDrawer — panel detail lamaran (geser dari kanan), reaktif ke store

import { h, fmtDate, relTime } from '../lib/util.js';
import { getApp, STAGES, TERMINAL, setStage, moveStage, addLog, deleteApp, subscribe, stageMeta } from '../lib/store.js';
import { icon } from './icons.js';
import { toast } from './toast.js';
import { confirmDialog } from './modal.js';
import { openAppForm } from './appForm.js';

let current = null;

export function closeDrawer() {
  if (!current) return;
  current.overlay.remove();
  document.removeEventListener('keydown', current.onKey);
  current.handlers.forEach((u) => u());
  current = null;
}

export function openDrawer(id) {
  closeDrawer();

  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  const handlers = [];

  function onKey(e) {
    if (e.key === 'Escape') closeDrawer();
  }
  overlay.addEventListener('mousedown', (e) => e.target === overlay && closeDrawer());
  document.addEventListener('keydown', onKey);
  handlers.push(subscribe(render));

  current = { overlay, onKey, handlers };

  function render() {
    const app = getApp(id);
    if (!app) {
      closeDrawer();
      return;
    }
    const activeIdx = STAGES.findIndex((s) => s.key === app.stage);
    const next = activeIdx + 1 < STAGES.length ? STAGES[activeIdx + 1] : null;
    const isTerminal = TERMINAL.includes(app.stage);
    const logs = (app.logs || []).slice().reverse();

    // -- header
    const head = h('div', { class: 'drawer__head' },
      h('div', {},
        h('div', { class: 'drawer__company' }, app.company),
        h('div', { class: 'drawer__role' }, app.role),
      ),
      h('button', { class: 'icon-btn', 'aria-label': 'Tutup', onclick: closeDrawer }, icon('x')));

    // -- rel tahap vertical (tangga karier)
    const rail = h('div', { class: 'stage-rail' },
      STAGES.map((s, idx) => {
        let cls = 'stage-node';
        if (idx < activeIdx) cls += ' is-done';
        if (idx === activeIdx) cls += ' is-now';
        return h('div', { class: cls, style: `--node-color:${s.color}; --node-glow:${s.color}44;` },
          h('div', { class: 'stage-node__stem' }, h('span', { class: 'stage-node__dot' })),
          h('div', { class: 'stage-node__label' },
            h('span', {}, s.label),
            idx === activeIdx && !isTerminal ? h('span', { class: 'chip' }, 'Saat ini') : null));
      }));

    // -- aksi tahap
    const actions = h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;' },
      !isTerminal && next
        ? h('button', { class: 'btn btn--primary', onclick: () => { setStage(id, next.key); toast(`Naik ke tahap "${next.label}".`); } },
            icon('arrowUp', 14), `Naik ke ${next.label}`)
        : null,
      !isTerminal && activeIdx > 0
        ? h('button', { class: 'btn btn--ghost', onclick: () => { moveStage(id, -1); toast('Tahap diturunkan.'); } },
            icon('arrowDown', 14), 'Mundur')
        : null,
      !isTerminal
        ? h('button', { class: 'btn btn--ghost', style: 'color:var(--danger);border-color:var(--danger);',
            onclick: () => confirmDialog({
              title: 'Tandai ditolak?',
              message: `Lamaran "${app.company}" akan ditandai sebagai ditolak.`,
              confirmText: 'Tandai ditolak',
              onConfirm: () => { setStage(id, 'rejected'); toast('Ditandai ditolak.', 'success'); },
            }) },
            'Tandai ditolak')
        : null);

    // -- meta
    const metaList = h('dl', { class: 'meta-list' },
      h('div', { class: 'meta-list__row' }, h('dt', {}, 'Tipe'), h('dd', {}, app.workType === 'remote' ? 'Remote' : app.workType === 'hybrid' ? 'Hybrid' : 'Onsite')),
      h('div', { class: 'meta-list__row' }, h('dt', {}, 'Status'), h('dd', {}, fmtStageChip(app.stage))),
      h('div', { class: 'meta-list__row' }, h('dt', {}, 'Submit'), h('dd', {}, fmtDate(app.appliedAt))),
      app.location ? h('div', { class: 'meta-list__row' }, h('dt', {}, 'Lokasi'), h('dd', {}, app.location)) : null,
      app.salary ? h('div', { class: 'meta-list__row' }, h('dt', {}, 'Gaji'), h('dd', {}, app.salary)) : null,
      app.link
        ? h('div', { class: 'meta-list__row' }, h('dt', {}, 'Tautan'),
            h('dd', {}, h('a', { href: app.link, target: '_blank', rel: 'noopener' }, 'Buka lowongan')))
        : null);

    // -- aktivitas
    const logInput = h('textarea', { class: 'input', placeholder: 'Catat aktivitas…' });
    const logBtn = h('button', { class: 'btn btn--primary btn--sm', onclick: () => {
      const text = logInput.value.trim();
      if (!text) return;
      addLog(id, text);
      logInput.value = '';
      toast('Aktivitas dicatat.');
    } }, 'Catat');

    const quickTags = ['Interview dijadwalkan', 'Follow-up terkirim', 'Tes teknis', 'Offer datang'].map((t) =>
      h('button', { class: 'btn btn--quiet btn--sm', onclick: () => { addLog(id, t); toast('Aktivitas dicatat.'); } }, t));

    const logBlock = h('div', { class: 'detail-section' },
      h('h3', {}, 'Aktivitas'),
      h('div', { style: 'display:flex;flex-direction:column;gap:10px;' },
        h('div', { style: 'display:flex;gap:8px;' }, logInput, logBtn),
        h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;' }, ...quickTags)),
      h('div', { class: 'log-list', style: 'margin-top:18px;' },
        logs.length === 0
          ? h('p', { class: 'form-note' }, 'Belum ada aktivitas tercatat.')
          : logs.map((l) => h('div', { class: 'log-item' },
              h('div', { class: 'log-item__rail' }, h('span', { class: 'log-item__dot' })),
              h('div', {},
                h('div', { class: 'log-item__title' }, l.text),
                h('div', { class: 'log-item__time' }, relTime(l.at)))))));

    // -- footer
    const foot = h('div', { style: 'border-top:1px solid var(--border);padding:16px 24px 20px;display:flex;gap:10px;' },
      h('button', { class: 'btn btn--ghost', style: 'flex:1;', onclick: () => { closeDrawer(); openAppForm(app); } }, icon('edit', 14), 'Ubah'),
      h('button', { class: 'btn btn--danger', style: 'flex:1;', onclick: () =>
        confirmDialog({
          title: 'Hapus lamaran?',
          message: `Seluruh data lamaran "${app.company}" akan dihapus permanen.`,
          confirmText: 'Hapus',
          onConfirm: () => { deleteApp(id); toast('Lamaran dihapus.', 'danger'); },
        }) },
        icon('trash', 14), 'Hapus'));

    const body = h('div', { class: 'drawer__body' },
      rail, actions,
      h('div', { class: 'detail-section' }, h('h3', {}, 'Detail'), metaList),
      app.notes ? h('div', { class: 'detail-section' }, h('h3', {}, 'Catatan'), h('p', { style: 'color:var(--text-soft);white-space:pre-wrap;' }, app.notes)) : null,
      logBlock);

    drawer.replaceChildren(head, body, foot);
  }

  overlay.append(drawer);
  document.getElementById('modal-root').append(overlay);
  render();
}

function fmtStageChip(key) {
  const meta = stageMeta(key);
  return h('span', { class: 'chip meta-chip', style: `border-color:${meta.color}55; color:${meta.color};` }, meta.label);
}
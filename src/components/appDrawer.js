// appDrawer — panel detail lamaran (geser dari kanan), reaktif ke store

import { h, fmtDate, relTime, fmtDateTime, daysUntil } from '../lib/util.js';
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
    if (e.key === 'Escape') {
      const root = document.getElementById('modal-root');
      const overlays = root ? root.querySelectorAll('.overlay, .drawer-overlay') : [];
      if (overlays.length > 0 && overlays[overlays.length - 1] === overlay) {
        closeDrawer();
      }
    }
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

    // -- Header
    const head = h('div', { class: 'drawer__head' },
      h('div', { class: 'min-w-0' },
        h('div', { class: 'drawer__company' }, app.company),
        h('div', { class: 'drawer__role' }, app.role),
      ),
      h('button', { class: 'icon-btn', 'aria-label': 'Tutup panel', onclick: closeDrawer }, icon('x', 16)));

    // -- Stepper Tahap Vertikal
    const rail = h('div', { class: 'stage-rail' },
      STAGES.map((s, idx) => {
        let cls = 'stage-node';
        if (idx < activeIdx) cls += ' is-done';
        if (idx === activeIdx) cls += ' is-now';
        return h('div', { class: cls, style: `--node-color:${s.color};` },
          h('div', { class: 'stage-node__stem' }, h('span', { class: 'stage-node__dot' })),
          h('div', { class: 'stage-node__label' },
            h('span', {}, s.label),
            idx === activeIdx && !isTerminal
              ? h('span', { class: 'chip', style: `border-color:${s.color}44; color:${s.color}; font-size:11px;` }, 'Tahap Aktif')
              : null));
      }));

    // -- Tombol Aksi Tahap
    const actions = h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;' },
      !isTerminal && next
        ? h('button', { class: 'btn btn--primary', onclick: () => { setStage(id, next.key); toast(`Naik ke tahap "${next.label}".`, 'success'); } },
            icon('arrowUp', 14), `Lanjut ke ${next.label}`)
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
              confirmText: 'Tandai Ditolak',
              onConfirm: () => { setStage(id, 'rejected'); toast('Ditandai ditolak.', 'danger'); },
            }) },
            'Tandai Ditolak')
        : null);

    // -- Interview Schedule Banner (jika ada jadwal)
    let interviewBanner = null;
    if (app.interviewDate) {
      const dDiff = daysUntil(app.interviewDate);
      let timeNote = '';
      if (dDiff != null) {
        if (dDiff < 0) timeNote = ' (Sudah Lewat)';
        else if (dDiff === 0) timeNote = ' ⚡ (Hari ini!)';
        else if (dDiff === 1) timeNote = ' 📅 (Besok)';
        else timeNote = ` ⏳ (${dDiff} hari lagi)`;
      }

      interviewBanner = h('div', {
        class: 'drawer-interview-banner',
        style: 'background:rgba(139, 92, 246, 0.12); border:1px solid rgba(139, 92, 246, 0.35); border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:16px; display:flex; align-items:center; gap:10px;'
      },
        h('span', { style: 'color:var(--stage-interview); display:flex; flex-shrink:0;' }, icon('calendar', 20)),
        h('div', { style: 'flex:1; min-width:0;' },
          h('div', { style: 'font-weight:600; font-size:0.875rem; color:var(--text);' }, 'Jadwal Interview Mendatang'),
          h('div', { style: 'font-size:0.8125rem; color:var(--text-secondary); margin-top:2px;' },
            `${fmtDateTime(app.interviewDate)}${timeNote}`
          )
        ),
        h('button', {
          class: 'btn btn--quiet btn--sm',
          style: 'font-size:11px; padding:3px 8px;',
          onclick: () => {
            closeDrawer();
            openAppForm(app);
          }
        }, 'Ubah')
      );
    }

    // -- Data Informasi Utama
    const metaList = h('dl', { class: 'meta-list' },
      h('div', { class: 'meta-list__row' }, h('dt', {}, 'Tipe Kerja'), h('dd', {}, app.workType === 'remote' ? 'Remote' : app.workType === 'hybrid' ? 'Hybrid' : 'Onsite')),
      h('div', { class: 'meta-list__row' }, h('dt', {}, 'Status'), h('dd', {}, fmtStageChip(app.stage))),
      h('div', { class: 'meta-list__row' }, h('dt', {}, 'Submit'), h('dd', {}, fmtDate(app.appliedAt))),
      app.interviewDate ? h('div', { class: 'meta-list__row' }, h('dt', {}, 'Jadwal Interview'), h('dd', {}, fmtDateTime(app.interviewDate))) : null,
      app.location ? h('div', { class: 'meta-list__row' }, h('dt', {}, 'Lokasi'), h('dd', {}, app.location)) : null,
      app.salary ? h('div', { class: 'meta-list__row' }, h('dt', {}, 'Gaji'), h('dd', {}, app.salary)) : null,
      app.link
        ? h('div', { class: 'meta-list__row' }, h('dt', {}, 'Tautan'),
            h('dd', {}, h('a', { href: app.link, target: '_blank', rel: 'noopener noreferrer' }, 'Buka Lowongan ↗')))
        : null);

    // -- Log Aktivitas
    const logInput = h('textarea', { class: 'input', placeholder: 'Tulis catatan aktivitas atau hasil komunikasi… (Ctrl+Enter untuk simpan cepat)', style: 'min-height:70px;' });
    const saveLog = () => {
      const text = logInput.value.trim();
      if (!text) return;
      addLog(id, text);
      logInput.value = '';
      toast('Aktivitas berhasil dicatat.');
    };
    logInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        saveLog();
      }
    });
    const logBtn = h('button', { class: 'btn btn--primary btn--sm', onclick: saveLog }, 'Simpan');

    const quickTags = [
      'Interview dijadwalkan',
      'Kirim email follow-up status',
      'Tes teknis / live coding selesai',
      'Interview HR / User selesai',
      'Offer letter diterima 🎉',
      'Follow-up via LinkedIn recruiter',
    ].map((t) =>
      h('button', { class: 'btn btn--ghost btn--sm', onclick: () => { addLog(id, t); toast('Aktivitas dicatat.'); } }, t));

    const logBlock = h('div', { class: 'detail-section' },
      h('h3', {}, 'Catatan Aktivitas & Logbook'),
      h('div', { style: 'display:flex;flex-direction:column;gap:10px;' },
        h('div', { style: 'display:flex;flex-direction:column;gap:8px;' }, logInput,
          h('div', { style: 'display:flex;justify-content:flex-end;' }, logBtn)),
        h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;' }, ...quickTags)),
      h('div', { class: 'log-list' },
        logs.length === 0
          ? h('p', { class: 'form-note', style: 'padding:8px 0;' }, 'Belum ada aktivitas tercatat.')
          : logs.map((l) => h('div', { class: 'log-item' },
              h('div', { class: 'log-item__rail' }, h('span', { class: 'log-item__dot' })),
              h('div', {},
                h('div', { class: 'log-item__title' }, l.text),
                h('div', { class: 'log-item__time' }, relTime(l.at)))))));

    // -- Footer
    const foot = h('div', { style: 'border-top:1px solid var(--border);padding:14px 24px;display:flex;gap:10px;background:var(--surface);' },
      h('button', { class: 'btn btn--ghost', style: 'flex:1;', onclick: () => { closeDrawer(); openAppForm(app); } }, icon('edit', 14), 'Ubah Data'),
      h('button', { class: 'btn btn--danger', style: 'flex:1;', onclick: () =>
        confirmDialog({
          title: 'Hapus lamaran?',
          message: `Seluruh data lamaran "${app.company}" akan dihapus permanen.`,
          confirmText: 'Hapus',
          onConfirm: () => { deleteApp(id); toast('Lamaran berhasil dihapus.', 'danger'); },
        }) },
        icon('trash', 14), 'Hapus'));

    const body = h('div', { class: 'drawer__body' },
      rail, actions,
      interviewBanner,
      h('div', { class: 'detail-section' }, h('h3', {}, 'Informasi Lowongan'), metaList),
      app.notes ? h('div', { class: 'detail-section' }, h('h3', {}, 'Catatan Pribadi'), h('p', { style: 'color:var(--text-soft);white-space:pre-wrap;font-size:0.875rem;' }, app.notes)) : null,
      logBlock);

    drawer.replaceChildren(head, body, foot);
  }

  overlay.append(drawer);
  document.getElementById('modal-root').append(overlay);
  render();
}

function fmtStageChip(key) {
  const meta = stageMeta(key);
  return h('span', { class: 'chip meta-chip', style: `border-color:${meta.color}44; color:${meta.color};` }, meta.label);
}
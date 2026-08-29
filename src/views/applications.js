// view: Semua lamaran (tabel)

import { h, fmtDate, debounce } from '../lib/util.js';
import { iconEl } from '../components/icons.js';
import { getState, STAGES, stageMeta } from '../lib/store.js';

let state = { query: '', stage: '' };

export function renderApplications(onOpen) {
  const apps = getState().apps;

  const searchBox = h('input', {
    class: 'input',
    placeholder: 'Cari perusahaan atau posisi jabatan…',
    value: state.query,
  });

  const stageSelect = h('select', { class: 'select' },
    h('option', { value: '' }, 'Semua Tahap'),
    STAGES.map((s) => h('option', { value: s.key, selected: state.stage === s.key }, s.label)),
  );

  const body = h('tbody');
  const countLabel = h('div', { class: 'form-note', style: 'margin-top:4px; font-weight:500;' });

  function applyFilter() {
    const q = state.query.trim().toLowerCase();
    const list = apps.filter((a) => {
      const matchQ =
        !q || a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
      const matchStage = !state.stage || a.stage === state.stage;
      return matchQ && matchStage;
    });

    countLabel.textContent = `Menampilkan ${list.length} dari ${apps.length} lamaran`;

    body.replaceChildren(
      ...(list.length === 0
        ? [h('tr', {},
            h('td', { colspan: '7', style: 'text-align:center;color:var(--text-muted);padding:48px 20px;' },
              'Tidak ada lamaran yang cocok dengan kriteria pencarian.'))]
        : list.map((a) => {
            const meta = stageMeta(a.stage);
            return h('tr', { onclick: () => onOpen(a.id) },
              h('td', {},
                h('div', { class: 'row-company' }, a.company),
                h('div', { class: 'row-role' }, a.role)),
              h('td', { class: 'table-brain' }, h('span', { style: 'color:var(--text-secondary);font-size:0.8125rem;display:inline-flex;gap:6px;align-items:center;' },
                iconEl('mapPin', 12), a.location || '—')),
              h('td', {},
                h('span', { class: 'chip meta-chip', style: `border-color:${meta.color}44; color:${meta.color};` }, meta.label)),
              h('td', { class: 'table-brain' },
                h('span', { style: 'font-size:0.8125rem;color:var(--text-secondary);' },
                  a.workType === 'remote' ? 'Remote' : a.workType === 'hybrid' ? 'Hybrid' : 'Onsite')),
              h('td', {}, h('span', { class: 'tabular', style: 'font-size:0.85rem;color:var(--text-soft);' }, fmtDate(a.appliedAt))),
              h('td', { class: 'table-brain' }, h('span', { style: 'font-size:0.8125rem;color:var(--text-secondary);' }, a.salary || '—')),
              h('td', { style: 'text-align:right;color:var(--brand);font-size:0.8125rem;font-weight:500;' },
                h('span', { style: 'display:inline-flex;gap:4px;align-items:center;white-space:nowrap;' },
                  a.stage === 'hired' ? '✓ Diterima' :
                  a.stage === 'rejected' ? '✕ Ditutup' :
                  'Detail →')));
          })));
  }

  searchBox.addEventListener('input', debounce(() => {
    state.query = searchBox.value;
    applyFilter();
  }, 140));
  stageSelect.addEventListener('change', () => {
    state.stage = stageSelect.value;
    applyFilter();
  });

  const table = h('table', { class: 'table' },
    h('thead', {},
      h('tr', {},
        h('th', {}, 'Perusahaan / Posisi'),
        h('th', { class: 'table-brain' }, 'Lokasi'),
        h('th', {}, 'Tahap'),
        h('th', { class: 'table-brain' }, 'Tipe'),
        h('th', {}, 'Tanggal Submit'),
        h('th', { class: 'table-brain' }, 'Kisaran Gaji'),
        h('th', {}, ''))),
    body);

  applyFilter();

  return h('div', { style: 'display:flex;flex-direction:column;gap:16px;' },
    h('div', { class: 'toolbar' }, searchBox, stageSelect),
    h('div', { class: 'table-wrap' }, table),
    countLabel);
}
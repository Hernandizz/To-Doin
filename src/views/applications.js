// view: Semua lamaran (tabel)

import { h, fmtDate, debounce } from '../lib/util.js';
import { iconEl } from '../components/icons.js';
import { getApps, STAGES, stageMeta, resetDemo } from '../lib/store.js';
import { openAppForm } from '../components/appForm.js';
import { toast } from '../components/toast.js';

let state = { query: '', stage: '' };

const searchIndexCache = new WeakMap();
function getSearchIndex(app) {
  let idx = searchIndexCache.get(app);
  if (!idx) {
    idx = `${app.company || ''} ${app.role || ''} ${app.location || ''}`.toLowerCase();
    searchIndexCache.set(app, idx);
  }
  return idx;
}

export function renderApplications(onOpen) {
  const apps = getApps();

  if (apps.length === 0) {
    return h('div', { class: 'empty', style: 'padding:56px 24px; max-width:640px; margin:20px auto; background:var(--surface);' },
      iconEl('list', 36),
      h('h3', {}, 'Belum Ada Lamaran yang Tersimpan'),
      h('p', {},
        'Halaman ini akan memuat seluruh daftar lowongan yang kamu daftarkan secara rapi, lengkap dengan fitur pencarian cepat, penyaringan per tahap, dan ringkasan lokasi.'
      ),
      h('div', { style: 'display:flex; gap:10px; margin-top:12px; flex-wrap:wrap; justify-content:center;' },
        h('button', {
          class: 'btn btn--primary',
          onclick: () => openAppForm()
        }, iconEl('plus', 15), 'Tambah Lamaran Baru'),
        h('button', {
          class: 'btn btn--ghost',
          onclick: () => {
            resetDemo();
            toast('Data contoh berhasil dimuat!', 'success');
          }
        }, iconEl('sparkles', 15), 'Muat Data Contoh')
      )
    );
  }

  const searchBox = h('input', {
    class: 'input',
    placeholder: 'Cari perusahaan atau posisi (Tekan "/" untuk fokus)…',
    value: state.query,
  });

  const stageSelect = h('select', { class: 'select' },
    h('option', { value: '' }, 'Semua Tahap'),
    STAGES.map((s) => h('option', { value: s.key, selected: state.stage === s.key }, s.label)),
  );

  const resetFilterBtn = h('button', {
    class: 'btn btn--ghost btn--sm',
    style: 'display:none;',
    onclick: () => {
      state.query = '';
      state.stage = '';
      searchBox.value = '';
      stageSelect.value = '';
      applyFilter();
    }
  }, 'Reset Filter');

  const body = h('tbody');
  const countLabel = h('div', { class: 'form-note', style: 'margin-top:4px; font-weight:500;' });

  function applyFilter() {
    const q = state.query.trim().toLowerCase();
    const list = apps.filter((a) => {
      if (state.stage && a.stage !== state.stage) return false;
      if (!q) return true;
      return getSearchIndex(a).includes(q);
    });

    const isFiltered = Boolean(state.query.trim() || state.stage);
    resetFilterBtn.style.display = isFiltered ? 'inline-flex' : 'none';

    countLabel.textContent = isFiltered
      ? `Menampilkan ${list.length} dari total ${apps.length} lamaran (terfilter)`
      : `Menampilkan seluruh ${apps.length} lamaran`;

    if (list.length === 0) {
      body.replaceChildren(
        h('tr', {},
          h('td', { colspan: '7', style: 'text-align:center;color:var(--text-muted);padding:48px 20px;' },
            h('div', { style: 'display:flex; flex-direction:column; align-items:center; gap:8px;' },
              h('span', {}, 'Tidak ada lamaran yang cocok dengan kriteria pencarian.'),
              h('button', {
                class: 'btn btn--ghost btn--sm',
                onclick: () => {
                  state.query = '';
                  state.stage = '';
                  searchBox.value = '';
                  stageSelect.value = '';
                  applyFilter();
                }
              }, 'Hapus Filter & Tampilkan Semua')
            )))
      );
      return;
    }

    const frag = document.createDocumentFragment();
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      const meta = stageMeta(a.stage);
      const row = h('tr', { onclick: () => onOpen(a.id) },
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
            'Buka Detail →')));
      frag.append(row);
    }

    body.replaceChildren(frag);
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

  const tipBar = h('div', { class: 'table-tip' },
    iconEl('info', 13),
    'Klik pada baris lamaran mana saja untuk membuka panel riwayat lengkap, jadwal wawancara, dan logbook.'
  );

  return h('div', { style: 'display:flex;flex-direction:column;gap:14px;' },
    tipBar,
    h('div', { class: 'toolbar' }, searchBox, stageSelect, resetFilterBtn),
    h('div', { class: 'table-wrap' }, table),
    countLabel);
}
// view: Semua lamaran (tabel)

import { h, fmtDate, fmtDateTime, daysSince, daysUntil, debounce, download, exportToCSV, generateTextSummary } from '../lib/util.js';
import { iconEl } from '../components/icons.js';
import { getApps, STAGES, stageMeta, resetDemo, WORK_TYPE, isStaleApp } from '../lib/store.js';
import { openAppForm } from '../components/appForm.js';
import { toast } from '../components/toast.js';

let state = {
  query: '',
  stage: '',
  workType: '',
  sort: 'date_desc',
};

const searchIndexCache = new WeakMap();
function getSearchIndex(app) {
  let idx = searchIndexCache.get(app);
  if (!idx) {
    idx = `${app.company || ''} ${app.role || ''} ${app.location || ''} ${app.notes || ''}`.toLowerCase();
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
    style: 'flex:1; min-width:220px;',
    placeholder: 'Cari perusahaan, posisi, atau catatan (Tekan "/" untuk fokus)…',
    value: state.query,
  });

  const stageSelect = h('select', { class: 'select' },
    h('option', { value: '' }, 'Semua Tahap'),
    STAGES.map((s) => h('option', { value: s.key, selected: state.stage === s.key }, s.label)),
  );

  const workTypeSelect = h('select', { class: 'select' },
    h('option', { value: '' }, 'Semua Tipe'),
    WORK_TYPE.map((w) => h('option', { value: w.key, selected: state.workType === w.key }, w.label))
  );

  const sortSelect = h('select', { class: 'select' },
    h('option', { value: 'date_desc', selected: state.sort === 'date_desc' }, 'Submit: Terbaru'),
    h('option', { value: 'date_asc', selected: state.sort === 'date_asc' }, 'Submit: Terlama'),
    h('option', { value: 'company_asc', selected: state.sort === 'company_asc' }, 'Perusahaan: A → Z'),
    h('option', { value: 'company_desc', selected: state.sort === 'company_desc' }, 'Perusahaan: Z → A'),
    h('option', { value: 'updated_desc', selected: state.sort === 'updated_desc' }, 'Paling Baru Aktif'),
  );

  const resetFilterBtn = h('button', {
    class: 'btn btn--ghost btn--sm',
    style: 'display:none;',
    onclick: () => {
      state.query = '';
      state.stage = '';
      state.workType = '';
      state.sort = 'date_desc';
      searchBox.value = '';
      stageSelect.value = '';
      workTypeSelect.value = '';
      sortSelect.value = 'date_desc';
      applyFilter();
    }
  }, 'Reset Filter');

  const exportCsvBtn = h('button', {
    class: 'btn btn--ghost btn--sm',
    title: 'Unduh seluruh data format CSV',
    onclick: () => {
      const csv = exportToCSV(apps);
      download(`tangga-lamaran-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8;');
      toast('Spreadsheet CSV berhasil diunduh.', 'success');
    }
  }, iconEl('fileSpreadsheet', 14), 'Unduh CSV');

  const copySummaryBtn = h('button', {
    class: 'btn btn--ghost btn--sm',
    title: 'Salin ringkasan ke clipboard',
    onclick: () => {
      try {
        navigator.clipboard.writeText(generateTextSummary(apps));
        toast('Ringkasan lamaran disalin ke clipboard.', 'success');
      } catch (e) {
        toast('Gagal menyalin ringkasan.', 'danger');
      }
    }
  }, iconEl('copy', 14), 'Salin Ringkasan');

  const body = h('tbody');
  const countLabel = h('div', { class: 'form-note', style: 'margin-top:4px; font-weight:500;' });

  function applyFilter() {
    const q = state.query.trim().toLowerCase();
    let list = apps.filter((a) => {
      if (state.stage && a.stage !== state.stage) return false;
      if (state.workType && a.workType !== state.workType) return false;
      if (!q) return true;
      return getSearchIndex(a).includes(q);
    });

    // Sorting
    if (state.sort === 'date_desc') {
      list.sort((a, b) => new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0));
    } else if (state.sort === 'date_asc') {
      list.sort((a, b) => new Date(a.appliedAt || 0) - new Date(b.appliedAt || 0));
    } else if (state.sort === 'company_asc') {
      list.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
    } else if (state.sort === 'company_desc') {
      list.sort((a, b) => (b.company || '').localeCompare(a.company || ''));
    } else if (state.sort === 'updated_desc') {
      list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }

    const isFiltered = Boolean(state.query.trim() || state.stage || state.workType);
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
                  state.workType = '';
                  searchBox.value = '';
                  stageSelect.value = '';
                  workTypeSelect.value = '';
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
      const isDormant = isStaleApp(a, 14);

      let interviewTag = null;
      if (a.interviewDate) {
        const dDiff = daysUntil(a.interviewDate);
        let tagText = 'Interview';
        if (dDiff === 0) tagText = 'Interview Hari ini!';
        else if (dDiff === 1) tagText = 'Interview Besok';
        else if (dDiff > 1) tagText = `Interview H-${dDiff}`;
        interviewTag = h('span', {
          class: 'chip',
          style: 'font-size:10px; margin-left:6px; border-color:var(--stage-interview)66; color:var(--stage-interview); background:rgba(139, 92, 246, 0.1);'
        }, tagText);
      }

      const row = h('tr', { onclick: () => onOpen(a.id) },
        h('td', {},
          h('div', { class: 'row-company', style: 'display:flex; align-items:center; gap:4px;' },
            a.company,
            interviewTag
          ),
          h('div', { class: 'row-role' }, a.role),
          isDormant
            ? h('div', { style: 'font-size:10px; color:var(--warning); display:flex; align-items:center; gap:4px; margin-top:2px;' },
                iconEl('alertTriangle', 10), 'Perlu Follow-up (> 14 hari)')
            : null
        ),
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

  workTypeSelect.addEventListener('change', () => {
    state.workType = workTypeSelect.value;
    applyFilter();
  });

  sortSelect.addEventListener('change', () => {
    state.sort = sortSelect.value;
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

  const tipBar = h('div', { class: 'table-tip', style: 'display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;' },
    h('div', { style: 'display:flex; align-items:center; gap:6px;' },
      iconEl('info', 13),
      'Klik baris lamaran untuk membuka logbook, timeline, & status.'
    ),
    h('div', { style: 'display:flex; align-items:center; gap:8px;' },
      copySummaryBtn,
      exportCsvBtn
    )
  );

  return h('div', { style: 'display:flex;flex-direction:column;gap:14px;' },
    tipBar,
    h('div', { class: 'toolbar', style: 'flex-wrap:wrap; gap:8px;' },
      searchBox,
      stageSelect,
      workTypeSelect,
      sortSelect,
      resetFilterBtn
    ),
    h('div', { class: 'table-wrap' }, table),
    countLabel);
}
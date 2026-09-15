// view: Papan tahap (kanban)

import { h, debounce } from '../lib/util.js';
import { STAGES, TERMINAL, getApps, getApp, setStage, moveStage, resetDemo, WORK_TYPE } from '../lib/store.js';
import { renderCard } from '../components/appCard.js';
import { toast } from '../components/toast.js';
import { confirmDialog } from '../components/modal.js';
import { openAppForm } from '../components/appForm.js';
import { openUserGuide } from '../components/userGuide.js';
import { iconEl } from '../components/icons.js';

const STAGE_SUBTITLES = {
  draft: 'Siapkan berkas & resume',
  applied: 'Terkirim ke perusahaan',
  screening: 'Review berkas oleh HR',
  interview: 'Wawancara & tes teknis',
  offer: 'Tawaran gaji & review',
  hired: 'Diterima bekerja 🎉',
  rejected: 'Tidak lanjut / evaluasi',
};

const STAGE_EMPTY_TIPS = {
  draft: 'Simpan lowongan incaran sebelum dikirim',
  applied: 'Belum ada lamaran terkirim',
  screening: 'Lamaran lolos review berkas masuk ke sini',
  interview: 'Jadwal tes & wawancara akan tampil di sini',
  offer: 'Lamaran yang lolos offering letter',
  hired: 'Tawaran diterima akan tercatat di sini',
  rejected: 'Lamaran tidak lanjut untuk bahan evaluasi',
};

let boardFilter = { query: '', workType: '' };

export function renderBoard(onOpen) {
  const allApps = getApps();

  const container = h('div', { style: 'display:flex; flex-direction:column; gap:12px;' });

  if (allApps.length === 0) {
    const emptyHero = h('div', { class: 'board-empty-hero' },
      h('div', { class: 'board-empty-hero__text' },
        h('h3', {}, 'Papan Tahap Lamaran Kosong'),
        h('p', {},
          'Di papan ini, setiap lamaran kerjamu bergerak maju dari kiri ke kanan. Gunakan tombol panah pada kartu atau seret (drag & drop) kartu antar kolom.'
        )
      ),
      h('div', { class: 'board-empty-hero__actions' },
        h('button', {
          class: 'btn btn--primary btn--sm',
          onclick: () => {
            resetDemo();
            toast('Data contoh berhasil dimuat! Papan sekarang aktif.', 'success');
          }
        }, iconEl('sparkles', 14), 'Muat Data Contoh'),
        h('button', {
          class: 'btn btn--ghost btn--sm',
          onclick: () => openAppForm()
        }, iconEl('plus', 14), 'Tambah Lamaran Baru'),
        h('button', {
          class: 'btn btn--ghost btn--sm',
          onclick: openUserGuide
        }, iconEl('help', 14), 'Pelajari Alur')
      )
    );
    container.append(emptyHero);
    return container;
  }

  // Search input & filter controls
  const searchInput = h('input', {
    class: 'input',
    style: 'max-width:320px; font-size:13px; height:36px;',
    placeholder: 'Cari kartu di papan...',
    value: boardFilter.query,
  });

  const workTypeSelect = h('select', {
    class: 'select',
    style: 'max-width:160px; font-size:13px; height:36px;'
  },
    h('option', { value: '' }, 'Semua Tipe Kerja'),
    WORK_TYPE.map((w) => h('option', { value: w.key, selected: boardFilter.workType === w.key }, w.label))
  );

  const resetBtn = h('button', {
    class: 'btn btn--ghost btn--sm',
    style: 'display:none;',
    onclick: () => {
      boardFilter.query = '';
      boardFilter.workType = '';
      searchInput.value = '';
      workTypeSelect.value = '';
      renderColumns();
    }
  }, 'Reset Filter');

  const boardBackdrop = h('div', { class: 'board-backdrop' });

  function renderColumns() {
    const q = boardFilter.query.trim().toLowerCase();
    const wt = boardFilter.workType;

    const filteredApps = allApps.filter((a) => {
      if (wt && a.workType !== wt) return false;
      if (q) {
        const text = `${a.company} ${a.role} ${a.location || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });

    const isFiltered = Boolean(q || wt);
    resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';

    // Kelompokkan lamaran per tahap
    const stageLists = {};
    for (let i = 0; i < STAGES.length; i++) stageLists[STAGES[i].key] = [];
    for (let i = 0; i < filteredApps.length; i++) {
      const a = filteredApps[i];
      if (stageLists[a.stage]) stageLists[a.stage].push(a);
      else if (stageLists.draft) stageLists.draft.push(a);
    }

    const columns = STAGES.map((stage, idx) => {
      const list = stageLists[stage.key] || [];

      const drop = h('div', {
        class: 'column__drop',
        ondragover: (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          drop.classList.add('is-drag-over');
        },
        ondragleave: (e) => {
          if (!drop.contains(e.relatedTarget)) {
            drop.classList.remove('is-drag-over');
          }
        },
        ondrop: (e) => {
          e.preventDefault();
          drop.classList.remove('is-drag-over');
          const id = e.dataTransfer.getData('text/plain');
          if (!id) return;
          const app = getApp(id);
          if (app && app.stage !== stage.key) {
            setStage(id, stage.key);
            toast(`"${app.company}" dipindahkan ke ${stage.label}.`, 'success');
          }
        }
      });

      if (list.length === 0) {
        drop.append(
          h('p', {
            style: 'font-size:0.75rem;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:6px;padding:24px 10px;text-align:center;background:var(--bg);line-height:1.4;'
          },
          isFiltered ? 'Tidak ada hasil' : (STAGE_EMPTY_TIPS[stage.key] || 'Kosong'))
        );
      } else {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < list.length; i++) {
          const app = list[i];
          frag.append(
            renderCard(app, {
              onOpen,
              onAdvance: (a) => { moveStage(a.id, +1); toast(`"${a.company}" naik ke tahap berikutnya.`, 'success'); },
              onBack: (a) => { moveStage(a.id, -1); toast('Tahap diturunkan.'); },
              onDecline: (a) => confirmDialog({
                title: 'Tandai ditolak?',
                message: `Lamaran "${a.company}" akan ditandai sebagai ditolak.`,
                confirmText: 'Tandai ditolak',
                onConfirm: () => { setStage(a.id, 'rejected'); toast('Ditandai ditolak.', 'danger'); },
              }),
            })
          );
        }
        drop.append(frag);
      }

      return h('section', { class: 'column' },
        h('header', { class: 'column__head' },
          h('span', {
            class: 'column__step',
            style: `color:${stage.color}; border-color:${stage.color}44;`
          },
            String(idx + 1).padStart(2, '0')
          ),
          h('div', { style: 'display:flex; flex-direction:column; min-width:0;' },
            h('span', { class: 'column__name' }, stage.label),
            h('span', { class: 'column__desc', style: 'margin-top:2px; margin-bottom:0;' }, STAGE_SUBTITLES[stage.key] || '')
          ),
          h('span', { class: 'column__count tabular' }, list.length)
        ),
        drop
      );
    });

    const boardNode = h('div', { class: 'board' }, ...columns);
    boardBackdrop.replaceChildren(boardNode);
  }

  searchInput.addEventListener('input', debounce(() => {
    boardFilter.query = searchInput.value;
    renderColumns();
  }, 120));

  workTypeSelect.addEventListener('change', () => {
    boardFilter.workType = workTypeSelect.value;
    renderColumns();
  });

  const tipBar = h('div', {
    style: 'display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:var(--fs-tiny); color:var(--text-secondary); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px;'
  },
    h('div', { style: 'display:flex; align-items:center; gap:8px; flex-wrap:wrap;' },
      searchInput,
      workTypeSelect,
      resetBtn
    ),
    h('div', { style: 'display:flex; align-items:center; gap:10px;' },
      h('span', { style: 'display:flex; align-items:center; gap:5px; font-size:11px;' },
        iconEl('info', 12),
        'Drag-and-drop antar kolom'
      ),
      h('button', {
        class: 'btn btn--quiet btn--sm',
        onclick: openUserGuide,
        style: 'padding:2px 8px; font-size:11px;'
      }, 'Panduan Alur →')
    )
  );

  renderColumns();

  container.append(tipBar, boardBackdrop);
  return container;
}
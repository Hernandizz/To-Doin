// view: Papan tahap (kanban)

import { h } from '../lib/util.js';
import { STAGES, TERMINAL, getState, setStage, moveStage, resetDemo } from '../lib/store.js';
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

export function renderBoard(onOpen) {
  const apps = getState().apps;

  const emptyHero = apps.length === 0
    ? h('div', { class: 'board-empty-hero' },
        h('div', { class: 'board-empty-hero__text' },
          h('h3', {}, 'Papan Tahap Lamaran Kosong'),
          h('p', {},
            'Di papan ini, setiap lamaran kerjamu bergerak maju dari kiri ke kanan. Gunakan tombol panah pada kartu atau klik kartu untuk mencatat catatan wawancara.'
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
      )
    : h('div', {
        style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:var(--fs-tiny); color:var(--text-secondary); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:8px 14px;'
      },
        h('span', { style: 'display:flex; align-items:center; gap:6px;' },
          iconEl('info', 13),
          'Petunjuk: Gunakan panah atas (▲) pada kartu untuk menaikkan tahap. Klik kartu untuk mencatat logbook atau ubah detail.'
        ),
        h('button', {
          class: 'btn btn--quiet btn--sm',
          onclick: openUserGuide,
          style: 'padding:2px 6px; font-size:11px;'
        }, 'Panduan Alur →')
      );

  const columns = STAGES.map((stage, idx) => {
    const list = apps.filter((a) => a.stage === stage.key);
    const isTerminal = TERMINAL.includes(stage.key);

    const drop = h('div', { class: 'column__drop' },
      list.length === 0
        ? h('p', {
            style: 'font-size:0.75rem;color:var(--text-muted);border:1px dashed var(--border-strong);border-radius:6px;padding:24px 10px;text-align:center;background:var(--bg);line-height:1.4;'
          },
          STAGE_EMPTY_TIPS[stage.key] || 'Kosong'
        )
        : list.map((app) =>
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
          )
    );

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

  return h('div', { style: 'display:flex; flex-direction:column;' },
    emptyHero,
    h('div', { class: 'board-backdrop' },
      h('div', { class: 'board' }, ...columns)
    )
  );
}
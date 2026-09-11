// userGuide — modal panduan interaktif cara kerja Tangga

import { h } from '../lib/util.js';
import { iconEl } from './icons.js';
import { modalFrame, openModal } from './modal.js';
import { STAGES, resetDemo, getState } from '../lib/store.js';
import { toast } from './toast.js';

export function openUserGuide() {
  const body = h('div', { class: 'guide-content' });

  // Tab Header or Sections
  const intro = h('div', { class: 'guide-hero' },
    h('div', { class: 'guide-hero__icon' }, iconEl('bookOpen', 24)),
    h('div', {},
      h('h3', { class: 'guide-hero__title' }, 'Selamat Datang di Tangga!'),
      h('p', { class: 'guide-hero__desc' },
        'Tangga dirancang untuk membantumu melacak setiap lamaran kerja layaknya menaiki anak tangga secara teratur hingga meraih tawaran kerja impian.')
    )
  );

  // Section 1: Alur 7 Tahap
  const stagesSection = h('section', { class: 'guide-section' },
    h('div', { class: 'guide-section__head' },
      iconEl('target', 16),
      h('h4', {}, '1. Alur 7 Tahap Lamaran')
    ),
    h('p', { class: 'guide-section__text' },
      'Setiap lamaran yang kamu daftarkan akan bergerak melalui tahapan terstruktur berikut:'
    ),
    h('div', { class: 'guide-stages-list' },
      STAGES.map((s, idx) => {
        const desc = [
          'Lamaran sedang disiapkan (CV/Portofolio), belum dikirim.',
          'Berkas sudah dikirim ke portal lowongan atau email perusahaan.',
          'Tahap screening CV & profil oleh recruiter / tim HR.',
          'Wawancara HR, tes teknis, live coding, atau interview user.',
          'Offering letter diterima! Tahap evaluasi & negosiasi gaji.',
          'Tawaran resmi diterima! Selamat memulai karier baru 🎉',
          'Tidak lolos atau posisi ditutup. Jadikan bahan evaluasi & bangkit lagi.'
        ][idx];

        return h('div', { class: 'guide-stage-item' },
          h('span', {
            class: 'guide-stage-step',
            style: `color:${s.color}; border-color:${s.color}44; background: ${s.color}14;`
          }, String(idx + 1)),
          h('div', { style: 'flex:1; min-width:0;' },
            h('div', { class: 'guide-stage-name' },
              h('span', { class: 'dot', style: `background-color:${s.color};` }),
              h('strong', {}, s.label)
            ),
            h('p', { class: 'guide-stage-desc' }, desc)
          )
        );
      })
    )
  );

  // Section 2: Papan Kanban & Aksi Cepat
  const kanbanSection = h('section', { class: 'guide-section' },
    h('div', { class: 'guide-section__head' },
      iconEl('board', 16),
      h('h4', {}, '2. Navigasi Papan Tahap (Kanban)')
    ),
    h('div', { class: 'guide-features-grid' },
      h('div', { class: 'guide-feature-box' },
        h('div', { class: 'guide-feature-icon', style: 'color:var(--brand);' }, iconEl('arrowUp', 16)),
        h('strong', {}, 'Tombol Naik Tahap (▲)'),
        h('p', {}, 'Klik tombol panah atas pada kartu untuk langsung menaikkan status lamaran ke kolom berikutnya.')
      ),
      h('div', { class: 'guide-feature-box' },
        h('div', { class: 'guide-feature-icon', style: 'color:var(--text-secondary);' }, iconEl('arrowDown', 16)),
        h('strong', {}, 'Tombol Mundur Tahap (▼)'),
        h('p', {}, 'Gunakan jika kamu ingin mengoreksi atau mengembalikan lamaran ke tahap sebelumnya.')
      ),
      h('div', { class: 'guide-feature-box' },
        h('div', { class: 'guide-feature-icon', style: 'color:var(--danger);' }, iconEl('x', 16)),
        h('strong', {}, 'Tandai Ditolak (✕)'),
        h('p', {}, 'Pindahkan langsung ke kolom "Ditolak" dengan aman tanpa menghilangkan riwayat yang sudah dicatat.')
      ),
      h('div', { class: 'guide-feature-box' },
        h('div', { class: 'guide-feature-icon', style: 'color:var(--stage-screening);' }, iconEl('note', 16)),
        h('strong', {}, 'Klik Kartu untuk Detail'),
        h('p', {}, 'Klik kartu mana saja untuk membuka panel samping: catat hasil interview, gaji, tautan, dan logbook harian.')
      )
    )
  );

  // Section 3: Keamanan & Offline Local Data
  const dataSection = h('section', { class: 'guide-section' },
    h('div', { class: 'guide-section__head' },
      iconEl('sparkles', 16),
      h('h4', {}, '3. Privasi & Penyimpanan Data')
    ),
    h('div', { class: 'guide-notice' },
      h('strong', {}, '100% Privat & Tersimpan di Browser'),
      h('p', {},
        'Seluruh data lamaran kamu disimpan di penyimpanan lokal browser (localStorage). Tidak ada akun, kata sandi, ataupun server luar yang dapat melihat datamu. ' +
        'Kamu bisa mengunduh file cadangan JSON kapan saja melalui menu Pengaturan.')
    )
  );

  body.append(intro, stagesSection, kanbanSection, dataSection);

  // Footer Buttons
  const hasNoApps = getState().apps.length === 0;
  const demoBtn = hasNoApps
    ? h('button', {
        class: 'btn btn--ghost btn--sm',
        onclick: () => {
          resetDemo();
          toast('Data contoh berhasil dimuat! Sekarang kamu bisa menjelajah.', 'success');
          api.close();
        }
      }, iconEl('sparkles', 14), 'Muat Data Contoh')
    : null;

  const closeBtn = h('button', {
    class: 'btn btn--primary btn--sm',
    onclick: () => api.close()
  }, 'Paham, Tutup Panduan');

  const footer = h('div', { class: 'guide-modal__footer' },
    demoBtn ? h('div', { style: 'margin-right:auto;' }, demoBtn) : null,
    closeBtn
  );

  const { modal } = modalFrame('Panduan Menggunakan Tangga', body, footer);
  modal.classList.add('modal--wide');
  const api = openModal(modal);
  return api;
}

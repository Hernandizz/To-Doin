// view: Pengaturan — data, cadangan, reset

import { h, download, generateTextSummary } from '../lib/util.js';
import { iconEl } from '../components/icons.js';
import { exportJSON, exportCSV, importJSON, resetDemo, clearAll, getState, getStorageStats } from '../lib/store.js';
import { toast } from '../components/toast.js';
import { confirmDialog } from '../components/modal.js';

export function renderSettings() {
  const apps = getState().apps;
  const stats = getStorageStats();

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('tangga.theme', theme);
  }

  function handleImport(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importJSON(reader.result);
        toast('Data berhasil digabung. Cek "Semua lamaran".', 'success');
      } catch (e) {
        toast('Gagal impor: ' + e.message, 'danger');
      }
    };
    reader.readAsText(file);
  }

  const fileInput = h('input', { type: 'file', accept: '.json,application/json', style: 'display:none;' });
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleImport(fileInput.files[0]);
    fileInput.value = '';
  });

  const settingRow = (title, desc, buttons) =>
    h('div', { class: 'setting-row' },
      h('div', {},
        h('h4', {}, title),
        h('p', {}, desc)),
      h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;' }, ...buttons));

  const group = h('div', { class: 'settings-group' },
    settingRow('Tema Tampilan',
      'Pilih tampilan Dark mode atau Light mode untuk kenyamanan visual kamu.',
      [
        h('button', { class: 'btn btn--ghost btn--sm', onclick: () => { setTheme('dark'); toast('Tema gelap aktif.'); } }, iconEl('moon', 14), 'Dark'),
        h('button', { class: 'btn btn--ghost btn--sm', onclick: () => { setTheme('light'); toast('Tema terang aktif.'); } }, iconEl('sun', 14), 'Light'),
      ]),

    settingRow('Ekspor Spreadsheet CSV (Excel)',
      'Unduh seluruh daftar lamaran kerja dalam format CSV yang kompatibel dengan Microsoft Excel & Google Sheets.',
      [h('button', { class: 'btn btn--primary btn--sm', onclick: () => {
        download(`tangga-lamaran-${new Date().toISOString().slice(0,10)}.csv`, exportCSV(), 'text/csv;charset=utf-8;');
        toast('Spreadsheet CSV berhasil diunduh.', 'success');
      } }, iconEl('fileSpreadsheet', 14), 'Unduh CSV')]),

    settingRow('Ekspor Cadangan Data (JSON)',
      'Unduh seluruh database lengkap dan riwayat logbook ke file JSON untuk dicadangkan.',
      [h('button', { class: 'btn btn--ghost btn--sm', onclick: () => {
        download(`tangga-cadangan-${new Date().toISOString().slice(0,10)}.json`, exportJSON());
        toast('Cadangan JSON berhasil diunduh.', 'success');
      } }, iconEl('download', 14), 'Unduh JSON')]),

    settingRow('Impor Cadangan Data (JSON)',
      'Gabungkan data lamaran dari file cadangan JSON ke dalam aplikasi lokal.',
      [h('button', { class: 'btn btn--ghost btn--sm', onclick: () => fileInput.click() },
        iconEl('upload', 14), 'Pilih File JSON')],
    ),

    settingRow('Salin Ringkasan Progres Karier',
      'Salin teks ringkasan status lamaran terformat untuk dikirim via chat / catatan.',
      [h('button', { class: 'btn btn--ghost btn--sm', onclick: () => {
        try {
          navigator.clipboard.writeText(generateTextSummary(apps));
          toast('Ringkasan berhasil disalin ke clipboard!', 'success');
        } catch (e) {
          toast('Gagal menyalin ringkasan.', 'danger');
        }
      } }, iconEl('copy', 14), 'Salin Teks Ringkasan')]),

    settingRow('Muat Data Contoh (Demo)',
      'Isi aplikasi dengan kumpulan data contoh pelacak lamaran untuk demonstrasi alur.',
      [h('button', { class: 'btn btn--ghost btn--sm', onclick: () =>
        confirmDialog({
          title: 'Muat data contoh?',
          message: 'Data contoh akan menggantikan data lamaran saat ini. Lanjutkan?',
          confirmText: 'Muat Contoh',
          danger: false,
          onConfirm: () => { resetDemo(); toast('Data contoh berhasil dimuat.', 'success'); },
        }) },
        iconEl('sparkles', 14), 'Muat Contoh')]),

    settingRow('Hapus Seluruh Data',
      `Menghapus seluruh ${apps.length} data lamaran yang tersimpan di browser ini secara permanen.`,
      [h('button', { class: 'btn btn--danger btn--sm', onclick: () =>
        confirmDialog({
          title: 'Kosongkan seluruh data?',
          message: 'Semua lamaran akan dihapus permanen dari browser. Pastikan sudah membuat cadangan.',
          confirmText: 'Hapus Semua',
          onConfirm: () => { clearAll(); toast('Semua data lamaran telah dihapus.', 'danger'); },
        }) },
        iconEl('trash', 14), 'Hapus Semua')]),
  );

  // Storage Stats Health Panel
  const statsHealth = h('div', { class: 'panel', style: 'margin-top:16px;' },
    h('h2', {}, 'Kesehatan & Ukuran Penyimpanan Lokal'),
    h('div', { class: 'panel__sub' }, 'Status memori peramban (localStorage) yang digunakan Tangga'),
    h('div', { style: 'display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-top:8px;' },
      h('div', { class: 'storage-stat-card', style: 'background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px;' },
        h('div', { style: 'font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:600;' }, 'Total Lamaran'),
        h('div', { style: 'font-size:1.25rem; font-weight:700; color:var(--text); margin-top:2px;' }, `${stats.appCount} data`)
      ),
      h('div', { class: 'storage-stat-card', style: 'background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px;' },
        h('div', { style: 'font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:600;' }, 'Total Riwayat Log'),
        h('div', { style: 'font-size:1.25rem; font-weight:700; color:var(--stage-interview); margin-top:2px;' }, `${stats.logCount} catatan`)
      ),
      h('div', { class: 'storage-stat-card', style: 'background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px;' },
        h('div', { style: 'font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:600;' }, 'Ukuran Database'),
        h('div', { style: 'font-size:1.25rem; font-weight:700; color:var(--brand); margin-top:2px;' }, `${stats.kb} KB`)
      )
    )
  );

  const info = h('div', { class: 'panel', style: 'margin-top:16px;' },
    h('h2', {}, 'Tentang Tangga'),
    h('p', { class: 'form-note', style: 'color:var(--text-secondary); line-height: 1.6;' },
      'Tangga adalah aplikasi pelacak lamaran kerja profesional yang dirancang sangat cepat, bersih, dan berkinerja tinggi. ' +
      'Setiap tahap perjalanan kariermu dikelola secara visual tanpa lag. ' +
      'Seluruh data tersimpan aman secara lokal di peramban kamu tanpa pelacak pihak ketiga.'));

  return h('div', { style: 'display:flex;flex-direction:column;gap:16px;' },
    group,
    statsHealth,
    info,
    fileInput);
}
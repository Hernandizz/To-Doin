// view: Pengaturan — data, cadangan, reset

import { h, download } from '../lib/util.js';
import { iconEl } from '../components/icons.js';
import { exportJSON, importJSON, resetDemo, clearAll, getState } from '../lib/store.js';
import { toast } from '../components/toast.js';
import { confirmDialog } from '../components/modal.js';

export function renderSettings() {
  const apps = getState().apps;

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('tangga.theme', theme);
  }

  function handleImport(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = importJSON(reader.result);
        toast('Data berhasil digabung. Cek "Semua lamaran".');
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

    settingRow('Ekspor Cadangan Data',
      'Unduh seluruh data lamaran ke file format JSON sebagai cadangan lokal aman.',
      [h('button', { class: 'btn btn--primary btn--sm', onclick: () => {
        download(`tangga-cadangan-${new Date().toISOString().slice(0,10)}.json`, exportJSON());
        toast('Cadangan JSON berhasil diunduh.', 'success');
      } }, iconEl('download', 14), 'Unduh JSON')]),

    settingRow('Impor Cadangan Data',
      'Gabungkan data lamaran dari file cadangan JSON ke dalam aplikasi.',
      [h('button', { class: 'btn btn--ghost btn--sm', onclick: () => fileInput.click() },
        iconEl('upload', 14), 'Pilih File JSON')],
    ),

    settingRow('Muat Data Contoh (Demo)',
      'Isi aplikasi dengan kumpulan data contoh pelacak lamaran untuk demonstrasi.',
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
      `Menghapus seluruh ${apps.length} data lamaran yang tersimpan di browser ini.`,
      [h('button', { class: 'btn btn--danger btn--sm', onclick: () =>
        confirmDialog({
          title: 'Kosongkan seluruh data?',
          message: 'Semua lamaran akan dihapus permanen dari browser. Pastikan sudah membuat cadangan.',
          confirmText: 'Hapus Semua',
          onConfirm: () => { clearAll(); toast('Semua data lamaran telah dihapus.', 'danger'); },
        }) },
        iconEl('trash', 14), 'Hapus Semua')]),
  );

  const info = h('div', { class: 'panel', style: 'margin-top:16px;' },
    h('h2', {}, 'Tentang Tangga'),
    h('p', { class: 'form-note', style: 'color:var(--text-secondary); line-height: 1.6;' },
      'Tangga adalah aplikasi pelacak lamaran kerja profesional. Setiap tahap perjalanan kariermu dikelola ' +
      'secara terstruktur: Draf → Dikirim → Seleksi → Interview → Tawaran → Diterima/Ditolak. ' +
      'Seluruh data tersimpan aman secara lokal di browser kamu tanpa memerlukan server eksternal.'));

  return h('div', { style: 'display:flex;flex-direction:column;gap:16px;' },
    group,
    info,
    h('div', {},
      h('p', { class: 'form-note', style: 'margin-bottom:8px;' },
        `Saat ini ada ${apps.length} data lamaran tersimpan di peramban.`),
      fileInput));
}
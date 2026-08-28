// view: Pengaturan — data, cadangan, reset

import { h, download } from '../lib/util.js';
import { iconEl } from '../components/icons.js';
import { exportJSON, importJSON, resetDemo, clearAll, getState } from '../lib/store.js';
import { toast } from '../components/toast.js';
import { confirmDialog } from '../components/modal.js';

export function renderSettings() {
  const apps = getState().apps;

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
    settingRow('Ekspor cadangan',
      'Simpan seluruh data lamaran ke file JSON. Simpan file ini di tempat aman.',
      [h('button', { class: 'btn btn--primary btn--sm', onclick: () => {
        download(`tangga-cadangan-${new Date().toISOString().slice(0,10)}.json`, exportJSON());
        toast('Cadangan diunduh.', 'success');
      } }, iconEl('download', 14), 'Unduh JSON')]),

    settingRow('Impor / gabungkan',
      'Gabungkan data dari file cadangan. Lamaran dengan ID sama tidak akan diduplikat.',
      [h('button', { class: 'btn btn--ghost btn--sm', onclick: () => fileInput.click() },
        iconEl('upload', 14), 'Pilih file JSON')],
    ),

    settingRow('Muat data contoh',
      'Isi papan dengan beberapa lamaran contoh untuk belajar memakai Tangga.',
      [h('button', { class: 'btn btn--ghost btn--sm', onclick: () =>
        confirmDialog({
          title: 'Muat data contoh?',
          message: 'Data contoh akan menggantikan data kamu saat ini. Yakin lanjut?',
          confirmText: 'Muat contoh',
          danger: false,
          onConfirm: () => { resetDemo(); toast('Data contoh dimuat.', 'success'); },
        }) },
        iconEl('sparkles', 14), 'Muat contoh')]),

    settingRow('Kosongkan semua',
      `Menghapus seluruh ${apps.length} lamaran dari aplikasi ini.`,
      [h('button', { class: 'btn btn--danger btn--sm', onclick: () =>
        confirmDialog({
          title: 'Kosongkan semua data?',
          message: 'Semua lamaran akan dihapus permanen. Pastikan sudah membuat cadangan.',
          confirmText: 'Kosongkan semua',
          onConfirm: () => { clearAll(); toast('Semua lamaran dihapus.', 'danger'); },
        }) },
        iconEl('trash', 14), 'Kosongkan')]),
  );

  const info = h('div', { class: 'panel', style: 'margin-top:16px;' },
    h('h2', {}, 'Tentang Tangga'),
    h('p', { class: 'form-note', style: 'color:var(--text-soft);' },
      'Tangga membantumu mengelola lamaran kerja dari submit hingga hasil akhir — ' +
      'setiap tahap adalah satu anak tangga: Draf → Dikirim → Seleksi → Interview → Tawaran → Diterima/Ditolak. ' +
      'Semua data disimpan lokal di browser kamu, tanpa server.'));

  return h('div', { style: 'display:flex;flex-direction:column;gap:16px;' },
    group,
    h('div', {},
      h('p', { class: 'form-note', style: 'margin-bottom:8px;' },
        `${apps.length} lamaran tersimpan di peramban ini.`),
      fileInput));
}
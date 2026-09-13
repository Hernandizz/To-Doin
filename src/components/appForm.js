// formModal — tambah / ubah lamaran

import { modalFrame, openModal } from './modal.js';
import { toast } from './toast.js';
import { addApp, updateApp, STAGES, WORK_TYPE } from '../lib/store.js';
import { todayISO } from '../lib/util.js';

export function openAppForm(app) {
  const isEdit = Boolean(app);

  const f = {
    company: app?.company || '',
    role: app?.role || '',
    location: app?.location || '',
    workType: app?.workType || 'onsite',
    stage: app?.stage || 'applied',
    appliedAt: app?.appliedAt || todayISO(),
    link: app?.link || '',
    salary: app?.salary || '',
    notes: app?.notes || '',
  };

  const field = (label, el) => {
    const wrap = document.createElement('label');
    wrap.className = 'field';
    const lab = document.createElement('span');
    lab.textContent = label;
    wrap.append(lab, el);
    return wrap;
  };

  const input = (name, value, placeholder = '') => {
    const el = document.createElement('input');
    el.className = 'input';
    el.name = name;
    el.value = value || '';
    el.placeholder = placeholder;
    const update = () => (f[name] = el.value);
    el.addEventListener('input', update);
    el.addEventListener('change', update);
    return el;
  };

  const select = (name, value, options, labels) => {
    const el = document.createElement('select');
    el.className = 'select';
    el.name = name;
    options.forEach((opt, i) => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = labels[i];
      o.selected = opt === value;
      el.append(o);
    });
    el.addEventListener('change', () => (f[name] = el.value));
    return el;
  };

  const body = document.createElement('div');

  const row1 = document.createElement('div');
  row1.className = 'grid-2';
  row1.append(field('Perusahaan *', input('company', f.company, 'PT Contoh Nusantara')));
  row1.append(field('Posisi *', input('role', f.role, 'Frontend Developer')));

  const row2 = document.createElement('div');
  row2.className = 'grid-2';
  row2.append(field('Lokasi', input('location', f.location, 'Jakarta / Remote')));
  row2.append(
    field(
      'Tipe kerja',
      select(
        'workType',
        f.workType,
        WORK_TYPE.map((w) => w.key),
        WORK_TYPE.map((w) => w.label)
      )
    )
  );

  const row3 = document.createElement('div');
  row3.className = 'grid-2';
  row3.append(
    field(
      'Tahap',
      select(
        'stage',
        f.stage,
        STAGES.map((s) => s.key),
        STAGES.map((s) => s.label)
      )
    )
  );

  const dateEl = input('appliedAt', f.appliedAt, '');
  dateEl.type = 'date';
  row3.append(field('Tanggal submit', dateEl));

  const row4 = document.createElement('div');
  row4.className = 'grid-2';
  row4.append(field('Tautan lowongan', input('link', f.link, 'https://...')));
  row4.append(field('Kisaran gaji', input('salary', f.salary, 'Rp 10–15 jt')));

  const notesField = field(
    'Catatan',
    (() => {
      const el = document.createElement('textarea');
      el.className = 'input';
      el.name = 'notes';
      el.value = f.notes || '';
      el.placeholder = 'Persiapan interview, nama kontak recruiter, catatan penting…';
      el.addEventListener('input', () => (f.notes = el.value));
      return el;
    })()
  );

  body.append(row1, row2, row3, row4, notesField);

  body.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      saveBtn.click();
    }
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn--ghost';
  cancelBtn.textContent = 'Batal';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn--primary';
  saveBtn.textContent = isEdit ? 'Simpan perubahan' : 'Tambahkan lamaran';

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.gap = '10px';
  footer.style.width = '100%';
  footer.style.justifyContent = 'flex-end';
  footer.append(cancelBtn, saveBtn);

  const { modal, closeBtn } = modalFrame(isEdit ? 'Ubah lamaran' : 'Lamaran baru', body, footer);
  let api;
  cancelBtn.addEventListener('click', () => api.close());

  saveBtn.addEventListener('click', () => {
    if (!f.company.trim() || !f.role.trim()) {
      toast('Perusahaan dan posisi wajib diisi.', 'danger');
      return;
    }
    if (isEdit) {
      updateApp(app.id, {
        company: f.company.trim(),
        role: f.role.trim(),
        location: f.location.trim(),
        workType: f.workType,
        stage: f.stage,
        appliedAt: f.appliedAt,
        link: f.link.trim(),
        salary: f.salary.trim(),
        notes: f.notes.trim(),
      });
      toast('Perubahan disimpan.');
    } else {
      const wasEmpty = getState().apps.length === 0;
      addApp({
        company: f.company.trim(),
        role: f.role.trim(),
        location: f.location.trim(),
        workType: f.workType,
        stage: f.stage,
        appliedAt: f.appliedAt,
        link: f.link.trim(),
        salary: f.salary.trim(),
        notes: f.notes.trim(),
      });
      if (wasEmpty) {
        toast('Hebat! Lamaran pertamamu tersimpan. Cek di Papan Tahap.', 'success');
      } else {
        toast('Lamaran baru berhasil ditambahkan.', 'success');
      }
    }
    api.close();
  });

  api = openModal(modal);
  setTimeout(() => body.querySelector('input[name="company"]')?.focus(), 50);

  return api;
}
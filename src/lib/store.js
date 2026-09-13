// store — state, persistensi localStorage, dan seluruh operasi CRUD

import { uid, todayISO, toMs } from './util.js';

const KEY = 'tangga.data.v1';

// Definisi tahap lamaran — satu "anak tangga" karier
export const STAGES = [
  { key: 'draft',     label: 'Draf',      name: 'Draf',        color: 'var(--stage-draft)' },
  { key: 'applied',   label: 'Dikirim',   name: 'Dikirim',     color: 'var(--stage-applied)' },
  { key: 'screening', label: 'Seleksi',   name: 'Seleksi',     color: 'var(--stage-screening)' },
  { key: 'interview', label: 'Interview', name: 'Interview',   color: 'var(--stage-interview)' },
  { key: 'offer',     label: 'Tawaran',   name: 'Tawaran',     color: 'var(--stage-offer)' },
  { key: 'hired',     label: 'Diterima',  name: 'Diterima',    color: 'var(--stage-hired)' },
  { key: 'rejected',  label: 'Ditolak',   name: 'Ditolak',     color: 'var(--stage-rejected)' },
];

export const TERMINAL = ['hired', 'rejected'];

export const WORK_TYPE = [
  { key: 'onsite', label: 'Onsite' },
  { key: 'remote', label: 'Remote' },
  { key: 'hybrid', label: 'Hybrid' },
];

export const stageMeta = (key) => STAGES.find((s) => s.key === key) || STAGES[1];

const defaultApp = () => ({
  id: uid(),
  company: '',
  role: '',
  location: '',
  workType: 'onsite',
  stage: 'draft',
  appliedAt: todayISO(),
  link: '',
  salary: '',
  notes: '',
  logs: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

let state = load();

// Index pencarian cepat O(1) berdasarkan ID
let appMap = new Map();
function rebuildAppIndex() {
  appMap.clear();
  for (let i = 0; i < state.apps.length; i++) {
    const a = state.apps[i];
    appMap.set(a.id, a);
  }
}
rebuildAppIndex();

// Cache daftar lamaran terurut
let sortedAppsCache = null;

const listeners = new Set();
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Batch notification menggunakan microtask agar tidak terjadi re-render berlebihan
let notifyScheduled = false;
function notify() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    for (const fn of listeners) {
      try {
        fn();
      } catch (e) {
        console.error('Error in store listener:', e);
      }
    }
  });
}

// Asynchronous Batched Persistence: cegah blocking main thread oleh disk I/O
let persistTimer = null;
let isPendingPersist = false;

export function flushPersist() {
  if (!isPendingPersist) return;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(KEY, JSON.stringify(state));
    }
  } catch (e) {
    console.error('Gagal menyimpan ke localStorage:', e);
  }
  isPendingPersist = false;
  if (persistTimer) {
    if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
      cancelIdleCallback(persistTimer);
    } else {
      clearTimeout(persistTimer);
    }
    persistTimer = null;
  }
}

function persist() {
  isPendingPersist = true;
  sortedAppsCache = null;
  rebuildAppIndex();
  if (!persistTimer) {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      persistTimer = requestIdleCallback(() => flushPersist(), { timeout: 350 });
    } else {
      persistTimer = setTimeout(() => flushPersist(), 80);
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushPersist);
  window.addEventListener('pagehide', flushPersist);
}

function load() {
  try {
    if (typeof localStorage === 'undefined') return { apps: [] };
    const raw = localStorage.getItem(KEY);
    if (!raw) return { apps: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.apps)) return { apps: [] };
    return parsed;
  } catch {
    return { apps: [] };
  }
}

export function getState() {
  return state;
}

export function getApps(stage) {
  if (!sortedAppsCache) {
    sortedAppsCache = state.apps.slice().sort((a, b) => toMs(b.updatedAt) - toMs(a.updatedAt));
  }
  if (!stage) return sortedAppsCache;
  return sortedAppsCache.filter((a) => a.stage === stage);
}

export function getApp(id) {
  return appMap.get(id);
}

export function addApp(data) {
  const app = { ...defaultApp(), ...data, id: uid() };
  app.stage = app.stage || 'draft';
  app.appliedAt = app.appliedAt || todayISO();
  state.apps.push(app);
  persist();
  notify();
  return app;
}

export function updateApp(id, patch) {
  const app = getApp(id);
  if (!app) return;
  Object.assign(app, patch, { updatedAt: Date.now() });
  persist();
  notify();
  return app;
}

export function deleteApp(id) {
  state.apps = state.apps.filter((a) => a.id !== id);
  appMap.delete(id);
  persist();
  notify();
}

// Tambah log aktivitas ke timeline lamaran
export function addLog(id, text) {
  const app = getApp(id);
  if (!app) return;
  app.logs = app.logs || [];
  app.logs.push({ id: uid(), text, at: new Date().toISOString() });
  app.updatedAt = Date.now();
  persist();
  notify();
  return app;
}

export function setStage(id, stageKey) {
  const app = getApp(id);
  if (!app) return;
  const from = stageMeta(app.stage).label;
  app.stage = stageKey;
  app.updatedAt = Date.now();
  app.logs = app.logs || [];
  app.logs.push({
    id: uid(),
    text: `Tahap berubah: ${from} → ${stageMeta(stageKey).label}`,
    at: new Date().toISOString(),
  });
  persist();
  notify();
  return app;
}

// Pindahkan satu anak tangga maju/mundur
export function moveStage(id, dir) {
  const app = getApp(id);
  if (!app) return;
  if (TERMINAL.includes(app.stage)) return;
  const idx = STAGES.findIndex((s) => s.key === app.stage);
  const next = idx + dir;
  if (next < 0 || next >= STAGES.length) return;
  if (STAGES[next].key === 'rejected') return;
  setStage(id, STAGES[next].key);
}

export function resetDemo() {
  state = { apps: demoApps() };
  persist();
  notify();
}

export function clearAll() {
  state = { apps: [] };
  persist();
  notify();
}

export function importJSON(text) {
  const data = JSON.parse(text);
  if (!Array.isArray(data.apps)) throw new Error('Format salah: butuh { apps: [...] }');
  const existingIds = new Set(state.apps.map((a) => a.id));
  const newApps = [];
  for (let i = 0; i < data.apps.length; i++) {
    const item = data.apps[i];
    if (item && item.id && !existingIds.has(item.id)) {
      existingIds.add(item.id);
      newApps.push(item);
    }
  }
  state = { apps: state.apps.concat(newApps) };
  persist();
  notify();
}

export function exportJSON() {
  flushPersist();
  return JSON.stringify(state, null, 2);
}

// ---------- data contoh (seed) ----------

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function demoApps() {
  const t = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };
  return [
    {
      id: uid(),
      company: 'PT Nusantara Digital',
      role: 'Frontend Developer',
      location: 'Jakarta',
      workType: 'hybrid',
      stage: 'interview',
      appliedAt: daysAgo(26),
      link: '',
      salary: 'Rp 12–18 jt',
      notes: 'Mereka pakai stack React + TypeScript. Fokus tes soal component & state.',
      logs: [
        { id: uid(), text: 'Lamaran dikirim via website karier.', at: t(26) },
        { id: uid(), text: 'HR menghubungi, jadwal tes teknis.', at: t(19) },
        { id: uid(), text: 'Tes teknis online selesai, hasil menunggu.', at: t(12) },
        { id: uid(), text: 'Interview user & fitur dijadwalkan minggu depan.', at: t(3) },
      ],
      createdAt: t(26),
      updatedAt: t(3),
    },
    {
      id: uid(),
      company: 'Garuda Karya Solusi',
      role: 'Product Manager',
      location: 'Bandung',
      workType: 'onsite',
      stage: 'screening',
      appliedAt: daysAgo(14),
      link: 'https://career.garudakarya.example/',
      salary: 'Rp 15–22 jt',
      notes: '',
      logs: [
        { id: uid(), text: 'Submit aplikasi bersama cover letter.', at: t(14) },
        { id: uid(), text: 'Dibaca recruiter, masuk pipeline seleksi.', at: t(8) },
      ],
      createdAt: t(14),
      updatedAt: t(8),
    },
    {
      id: uid(),
      company: 'Laut Biru Teknologi',
      role: 'Backend Engineer (Go)',
      location: 'Remote',
      workType: 'remote',
      stage: 'offer',
      appliedAt: daysAgo(45),
      link: '',
      salary: 'Rp 18–25 jt',
      notes: 'Tim kecil, product sudah bertahan 3 tahun. Chemistry interview sangat nyambung.',
      logs: [
        { id: uid(), text: 'Lamaran dikirim.', at: t(45) },
        { id: uid(), text: 'Technical interview dengan lead.', at: t(38) },
        { id: uid(), text: 'Live coding 90 menit.', at: t(30) },
        { id: uid(), text: 'Final interview dengan co-founder.', at: t(15) },
        { id: uid(), text: 'Offer datang! Menunggu keputusan.', at: t(4) },
      ],
      createdAt: t(45),
      updatedAt: t(4),
    },
    {
      id: uid(),
      company: 'Kopi Hutan Studio',
      role: 'UI/UX Designer',
      location: 'Yogyakarta',
      workType: 'onsite',
      stage: 'applied',
      appliedAt: daysAgo(6),
      link: '',
      salary: 'Rp 8–12 jt',
      notes: '',
      logs: [{ id: uid(), text: 'Kirim portofolio via email.', at: t(6) }],
      createdAt: t(6),
      updatedAt: t(6),
    },
    {
      id: uid(),
      company: 'Bank Sampah Digital',
      role: 'Data Analyst',
      location: 'Surabaya',
      workType: 'hybrid',
      stage: 'draft',
      appliedAt: daysAgo(2),
      link: '',
      salary: '',
      notes: 'Masih menyusun resume versi terakhir. Requirement: SQL + Tableau.',
      logs: [],
      createdAt: t(2),
      updatedAt: t(2),
    },
    {
      id: uid(),
      company: 'PT Angkasa Logistik',
      role: 'Supply Chain Analyst',
      location: 'Jakarta',
      workType: 'onsite',
      stage: 'rejected',
      appliedAt: daysAgo(60),
      link: '',
      salary: '',
      notes: 'Feedback HR: posisi diisi kandidat internal.',
      logs: [
        { id: uid(), text: 'Lamaran dikirim.', at: t(60) },
        { id: uid(), text: 'Tes online.', at: t(52) },
        { id: uid(), text: 'Interview HR.', at: t(45) },
        { id: uid(), text: 'Notification: posisi ditutup.', at: t(22) },
      ],
      createdAt: t(60),
      updatedAt: t(22),
    },
    {
      id: uid(),
      company: 'Studio Cahaya Animasi',
      role: 'Motion Designer',
      location: 'Remote',
      workType: 'remote',
      stage: 'hired',
      appliedAt: daysAgo(80),
      link: '',
      salary: 'Rp 10–14 jt',
      notes: 'Kontrak 12 bulan, mulai bulan depan.',
      logs: [
        { id: uid(), text: 'Lamaran + showreel dikirim.', at: t(80) },
        { id: uid(), text: 'Tes desain 5 hari.', at: t(70) },
        { id: uid(), text: 'Interview tim kreatif.', at: t(62) },
        { id: uid(), text: 'Offer diterima! 🎉', at: t(40) },
      ],
      createdAt: t(80),
      updatedAt: t(40),
    },
    {
      id: uid(),
      company: 'Revolusi Retail',
      role: 'Digital Marketing Executive',
      location: 'Jakarta',
      workType: 'hybrid',
      stage: 'interview',
      appliedAt: daysAgo(33),
      link: '',
      salary: 'Rp 9–13 jt',
      notes: '',
      logs: [
        { id: uid(), text: 'Lamaran dikirim.', at: t(33) },
        { id: uid(), text: 'Interview HRD.', at: t(25) },
        { id: uid(), text: 'Interview user (tim marketing).', at: t(9) },
      ],
      createdAt: t(33),
      updatedAt: t(9),
    },
  ];
}
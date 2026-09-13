// util — helper kecil & format tanggal Indonesia

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const BULAN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function toMs(val) {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const t = Date.parse(val);
  return isNaN(t) ? 0 : t;
}

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + (typeof iso === 'string' && iso.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtDateShort(iso) {
  if (!iso) return '—';
  const d = new Date(iso + (typeof iso === 'string' && iso.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${BULAN[d.getMonth()]}`;
}

export function fmtDay(iso) {
  if (!iso) return '—';
  const d = new Date(typeof iso === 'string' && iso.length === 10 ? iso + 'T00:00:00' : iso);
  if (isNaN(d.getTime())) return '—';
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]}`;
}

export function daysSince(val) {
  if (!val) return 0;
  const d = typeof val === 'number'
    ? new Date(val)
    : new Date(val.length === 10 ? val + 'T00:00:00' : val);
  if (isNaN(d.getTime())) return 0;
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  return Math.max(0, diff);
}

export function relTime(iso) {
  if (!iso) return '—';
  const diff = daysSince(iso);
  if (diff <= 0) return 'hari ini';
  if (diff === 1) return 'kemarin';
  if (diff < 7) return `${diff} hari lalu`;
  if (diff < 30) return `${Math.floor(diff / 7)} minggu lalu`;
  if (diff < 365) return `${Math.floor(diff / 30)} bulan lalu`;
  return fmtDate(iso);
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export function monthKey(iso) {
  return iso ? String(iso).slice(0, 7) : ''; // yyyy-mm
}

// el — tiny hypescript-ish DOM builder yang efisien
export function h(tag, attrs = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2), v);
    } else if (k === 'value') node.value = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  const flat = kids.flat(Infinity);
  for (let i = 0; i < flat.length; i++) {
    const kid = flat[i];
    if (kid != null && kid !== false) {
      node.append(kid);
    }
  }
  return node;
}

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function download(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function debounce(fn, ms = 180) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
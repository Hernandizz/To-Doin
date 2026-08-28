// util — helper kecil & format tanggal Indonesia

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const BULAN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(d)) return '—';
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtDateShort(iso) {
  if (!iso) return '—';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(d)) return '—';
  return `${d.getDate()} ${BULAN[d.getMonth()]}`;
}

export function fmtDay(iso) {
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]}`;
}

export function daysSince(iso) {
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  return diff;
}

export function relTime(iso) {
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
  return iso.slice(0, 7); // yyyy-mm
}

// el — tiny hypescript-ish DOM builder
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
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    node.append(kid.nodeType ? kid : document.createTextNode(kid));
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
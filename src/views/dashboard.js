// view: Ringkasan (dashboard)

import { h, daysSince } from '../lib/util.js';
import { getState, STAGES, stageMeta, TERMINAL } from '../lib/store.js';

function kpiPerStage(apps) {
  const counts = {};
  for (const s of STAGES) counts[s.key] = 0;
  for (const a of apps) counts[a.stage] = (counts[a.stage] || 0) + 1;
  return counts;
}

function barsData(apps) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.getMonth()];
    months.push({ key, label, count: 0, thisMonth: i === 0 });
  }
  for (const a of apps) {
    const key = (a.appliedAt || '').slice(0, 7);
    const m = months.find((x) => x.key === key);
    if (m) m.count++;
  }
  return months;
}

// skala sumbu-Y rapi (kelipatan 1/2/5/10) agar gridline mudah dibaca
function niceTicks(max) {
  const steps = 4;
  if (max <= 0) return { ticks: [], top: 1 };
  const rough = max / steps;
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / pow;
  let step;
  if (norm <= 1) step = 1;
  else if (norm <= 2) step = 2;
  else if (norm <= 5) step = 5;
  else step = 10;
  step *= pow;
  const top = step * steps;
  const ticks = [];
  for (let i = 1; i <= steps; i++) ticks.push(step * i);
  return { ticks, top };
}

export function renderDashboard(onOpen) {
  const apps = getState().apps;
  const counts = kpiPerStage(apps);
  const active = apps.filter((a) => !TERMINAL.includes(a.stage)).length;
  const interviews = apps.filter((a) => a.stage === 'interview').length;
  const offers = counts.offer + counts.hired;
  const max = Math.max(...Object.values(counts), 1);

  // produk menunggu keputusan
  const pending = apps
    .filter((a) => a.stage === 'interview' || a.stage === 'offer' || a.stage === 'screening')
    .slice(0, 5);

  const avgWait = apps.length
    ? Math.round(apps.reduce((sum, a) => sum + daysSince(a.appliedAt), 0) / apps.length)
    : 0;

  const monthBars = barsData(apps);
  const totalRecent = monthBars.slice().reduce((s, m) => s + m.count, 0);

  // ---- KPI ----
  const kpis = [
    { label: 'Total lamaran', value: apps.length, accent: 'var(--accent)', note: `${totalRecent} dalam 6 bulan terakhir` },
    { label: 'Masih berjalan', value: active, accent: 'var(--stage-screening)', note: `${interviews} di tahap interview` },
    { label: 'Tawaran', value: offers, accent: 'var(--stage-offer)', note: `${counts.hired} sudah diterima` },
    { label: 'Ditolak', value: counts.rejected, accent: 'var(--stage-rejected)', note: 'feedback adalah data' },
  ];

  const kpiGrid = h('div', { class: 'kpi-grid' },
    kpis.map((k, i) =>
      h('div', { class: 'kpi', style: `--kpi-accent:${k.accent}; animation-delay:${i * 60}ms;` },
        h('div', { class: 'kpi__label' }, k.label),
        h('div', { class: 'kpi__value' }, k.value.toString()),
        h('div', { class: 'kpi__note' }, k.note || ''))));

  // ---- Distribusi tahap ----
  const funnel = h('div', { class: 'panel' },
    h('h2', {}, 'Sebaran tahap'),
    h('div', { class: 'panel__sub' }, `${apps.length} total lamaran · skala sampai ${max}`),
    h('div', { class: 'stage-chart', role: 'img', 'aria-label': 'Distribusi lamaran berdasarkan tahap' },
      h('div', { class: 'stage-chart__scale', 'aria-hidden': 'true' },
        h('span', {}, '0'),
        h('span', {}, Math.ceil(max / 2)),
        h('span', {}, max)),
      STAGES.map((s) => {
        const value = counts[s.key];
        const percentage = apps.length ? Math.round((value / apps.length) * 100) : 0;
        return h('div', { class: 'stage-row', style: 'animation:rise .3s ease both;' },
          h('span', { class: 'stage-row__name' },
            h('span', { class: 'dot', style: `background:${s.color};` }),
            s.label),
          h('span', { class: 'stage-row__track' },
            h('span', {
              class: 'stage-row__bar',
              style: `--stage-color:${s.color}; width:${value ? (value / max) * 100 : 0}%;`,
            })),
          h('span', { class: 'stage-row__value tabular' }, `${value} · ${percentage}%`));
      }))); 

  // ---- 6 bulan terakhir (bar chart) ----
  const chartTotal = monthBars.reduce((s, m) => s + m.count, 0);
  const avgPerMonth = chartTotal / 6;
  const { ticks, top } = niceTicks(
    Math.max(...monthBars.map((m) => m.count), Math.ceil(avgPerMonth), 1)
  );
  const avgPct = (avgPerMonth / top) * 100;

  const grid = h('div', { class: 'chart__grid' },
    ticks.map((t) =>
      h('span', { class: 'chart__gl', style: `bottom:${(t / top) * 100}%;` },
        h('span', { class: 'chart__gl-lbl' }, t))));

  const chart = h('div', { class: 'panel', style: 'flex:1;' },
    h('div', { class: 'chart__head' },
      h('div', {},
        h('h2', {}, 'Lamaran per bulan'),
        h('div', { class: 'panel__sub' }, 'Jumlah lamaran yang kamu kirim tiap bulan')),
      apps.length === 0
        ? null
        : h('div', { class: 'chart__meta' },
            h('span', { class: 'sw', style: 'background:var(--surface-3);' }), ' bulan lalu',
            h('span', { class: 'sw', style: 'background:var(--accent);' }), ' bulan ini',
            h('span', { class: 'chart__meta-d' }, `${chartTotal} total · rata-rata ${avgPerMonth.toFixed(1)}/bulan`))),
    apps.length === 0
      ? h('p', { class: 'form-note', style: 'padding:24px 0;text-align:center;' }, 'Belum ada data untuk ditampilkan.')
      : h('div', { class: 'chart' },
          h('div', { class: 'chart__plot' },
            grid,
            avgPerMonth > 0
              ? h('div', { class: 'chart__avgline', style: `bottom:${avgPct}%;` },
                  h('span', { class: 'chart__avgline-lbl' }, `rata-rata ${avgPerMonth.toFixed(1)}`))
              : null,
            h('div', { class: 'chart__bars' },
              monthBars.map((m, i) => {
                const pct = m.count ? (m.count / top) * 100 : 0;
                return h('div', {
                  class: `cbar${m.thisMonth ? ' is-now' : ''}${m.count ? ' has-data' : ' is-zero'}`,
                  style: `height:${m.count ? `max(${pct}%, 8px)` : '4px'}; --del:${i * 55}ms;`,
                  'aria-label': `${m.label} · ${m.count} lamaran`,
                },
                m.count ? h('span', { class: 'cbar__val' }, m.count) : null,
                h('span', { class: 'cbar__tip' }, `${m.label} · ${m.count} lamaran`));
              }))),
          h('div', { class: 'chart__months' },
            monthBars.map((m) =>
              h('span', { class: `chart__month${m.thisMonth ? ' is-now' : ''}` }, m.label)))));

  // ---- Perlu tindakan ----
  const attention = h('div', { class: 'panel' },
    h('h2', {}, 'Perlu tindakan'),
    h('div', { class: 'panel__sub' }, 'Lamaran yang menunggu keputusan atau kemajuan'),
    pending.length === 0
      ? h('p', { class: 'form-note' }, 'Tidak ada lamaran yang menunggu. Saatnya apply lagi?')
      : h('div', { class: 'attention-list', style: 'display:flex;flex-direction:column;' },
          pending.map((a) => {
            const meta = stageMeta(a.stage);
            return h('button', {
              class: 'attention-row',
              style: `display:flex;align-items:center;gap:10px;padding:10px 8px;border:none;background:transparent;border-bottom:1px solid var(--border);cursor:pointer;text-align:left;border-radius:6px;width:100%;`,
              onclick: () => onOpen(a.id),
            },
            h('span', { class: 'dot', style: `background:${meta.color};` }),
            h('span', { style: 'flex:1;min-width:0;' },
              h('span', { style: 'display:block;color:var(--text);font-weight:500;font-size:.9rem;' }, a.company),
              h('span', { style: 'display:block;color:var(--text-muted);font-size:.78rem;' }, `${a.role} • ${meta.label}`)),
            h('span', { style: 'font-size:.72rem;color:var(--text-faint);' },
              daysSince(a.updatedAt) === 0 ? 'hari ini' : `${daysSince(a.updatedAt)}h lalu`));
          })));

  const chartsRow = h('div', { class: 'grid-2col' }, chart, funnel);
  const bottomRow = h('div', { class: 'grid-2col' }, attention,
    h('div', { class: 'panel' },
      h('h2', {}, 'Ritme pencarian'),
      h('div', { class: 'panel__sub' }, 'Seberapa konsisten kamu melamar'),
      apps.length === 0
        ? h('p', { class: 'form-note' }, 'Belum ada ritme. Mulai dari satu lamaran.')
        : h('div', { style: 'display:flex;flex-direction:column;gap:16px;' },
            statRow('Lamaran/minggu', (apps.length / Math.max(avgWait, 1)).toFixed(1)),
            statRow('Rata-rata menunggu', `${avgWait} hari`),
            statRow('Tingkat respons', `${Math.round(((apps.length - (counts.draft + counts.applied)) / Math.max(apps.length,1)) * 100)}%`),
          )));

  return h('div', { style: 'display:flex;flex-direction:column;gap:16px;' },
    kpiGrid,
    chartsRow,
    bottomRow);
}

function statRow(label, value) {
  return h('div', { style: 'display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px dashed var(--border);' },
    h('span', { style: 'color:var(--text-muted);font-size:.85rem;' }, label),
    h('span', { style: 'font-family:var(--font-display);font-weight:600;font-variant-numeric:tabular-nums;' }, value));
}
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

// Helper untuk membuat Full Solid Pie Chart SVG sesuai referensi pengguna
function renderStagePieChart(apps, counts) {
  const total = apps.length;
  const cx = 110;
  const cy = 110;
  const r = 96;

  // SVG Container
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 220 220');
  svg.setAttribute('class', 'pie-chart-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Diagram lingkaran sebaran tahap lamaran');

  if (total === 0) {
    // Empty state placeholder circle
    const emptyCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    emptyCircle.setAttribute('cx', String(cx));
    emptyCircle.setAttribute('cy', String(cy));
    emptyCircle.setAttribute('r', String(r));
    emptyCircle.setAttribute('fill', 'var(--surface-2)');
    emptyCircle.setAttribute('stroke', 'var(--border)');
    emptyCircle.setAttribute('stroke-dasharray', '4 4');
    svg.append(emptyCircle);

    const emptyText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    emptyText.setAttribute('x', String(cx));
    emptyText.setAttribute('y', String(cy));
    emptyText.setAttribute('text-anchor', 'middle');
    emptyText.setAttribute('dominant-baseline', 'central');
    emptyText.setAttribute('fill', 'var(--text-muted)');
    emptyText.setAttribute('font-size', '13px');
    emptyText.textContent = 'Belum ada data';
    svg.append(emptyText);
  } else {
    const activeStages = STAGES.filter((s) => counts[s.key] > 0);

    if (activeStages.length === 1) {
      // Hanya ada 1 tahap (100%)
      const s = activeStages[0];
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(cx));
      circle.setAttribute('cy', String(cy));
      circle.setAttribute('r', String(r));
      circle.setAttribute('fill', s.color);
      circle.setAttribute('stroke', 'var(--surface)');
      circle.setAttribute('stroke-width', '1.5');
      circle.setAttribute('class', `pie-wedge pie-wedge-${s.key}`);
      circle.setAttribute('data-stage', s.key);
      svg.append(circle);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', String(cx));
      label.setAttribute('y', String(cy));
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'central');
      label.setAttribute('fill', '#ffffff');
      label.setAttribute('font-size', '15px');
      label.setAttribute('font-weight', '700');
      label.setAttribute('class', 'pie-slice-label');
      label.textContent = '100%';
      svg.append(label);
    } else {
      let currentAngle = -Math.PI / 2; // Mulai dari atas (-90 deg)

      activeStages.forEach((s) => {
        const val = counts[s.key];
        const fraction = val / total;
        const angleSpan = fraction * 2 * Math.PI;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angleSpan;
        currentAngle = endAngle;

        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);

        const largeArc = angleSpan > Math.PI ? 1 : 0;

        // Path SVG wedge
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
        path.setAttribute('d', d);
        path.setAttribute('fill', s.color);
        path.setAttribute('stroke', 'var(--surface)');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('class', `pie-wedge pie-wedge-${s.key}`);
        path.setAttribute('data-stage', s.key);

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${s.label}: ${val} (${Math.round(fraction * 100)}%)`;
        path.append(title);

        svg.append(path);

        // Label persentase di dalam irisan
        if (fraction >= 0.05) {
          const midAngle = startAngle + angleSpan / 2;
          const labelRadius = r * 0.65;
          const lx = cx + labelRadius * Math.cos(midAngle);
          const ly = cy + labelRadius * Math.sin(midAngle);

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', lx.toFixed(1));
          text.setAttribute('y', ly.toFixed(1));
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'central');
          text.setAttribute('fill', '#ffffff');
          text.setAttribute('font-size', '12px');
          text.setAttribute('font-weight', '700');
          text.setAttribute('class', 'pie-slice-label');
          text.textContent = `${Math.round(fraction * 100)}%`;
          svg.append(text);
        }
      });
    }
  }

  const graphicWrap = h('div', { class: 'pie-chart-graphic' }, svg);

  // Legend list di samping grafik
  const legend = h('div', { class: 'pie-legend' },
    STAGES.map((s) => {
      const val = counts[s.key];
      const pct = total ? Math.round((val / total) * 100) : 0;
      const item = h('div', {
        class: `pie-legend__item${val === 0 ? ' is-empty' : ''}`,
        'data-stage': s.key,
        onmouseenter: () => {
          svg.querySelectorAll('.pie-wedge').forEach((el) => {
            if (el.dataset.stage === s.key) el.classList.add('is-active');
            else el.style.opacity = '0.35';
          });
        },
        onmouseleave: () => {
          svg.querySelectorAll('.pie-wedge').forEach((el) => {
            el.classList.remove('is-active');
            el.style.opacity = '1';
          });
        }
      },
        h('div', { class: 'pie-legend__left' },
          h('span', { class: 'dot', style: `background-color:${s.color};` }),
          h('span', {}, s.label)),
        h('span', { class: 'pie-legend__val tabular' },
          val > 0 ? `${val} (${pct}%)` : '0')
      );
      return item;
    })
  );

  return h('div', { class: 'pie-chart-wrap' }, graphicWrap, legend);
}

export function renderDashboard(onOpen) {
  const apps = getState().apps;
  const counts = kpiPerStage(apps);
  const active = apps.filter((a) => !TERMINAL.includes(a.stage)).length;
  const interviews = apps.filter((a) => a.stage === 'interview').length;
  const offers = counts.offer + counts.hired;

  // lamaran menunggu keputusan
  const pending = apps
    .filter((a) => a.stage === 'interview' || a.stage === 'offer' || a.stage === 'screening')
    .slice(0, 5);

  const avgWait = apps.length
    ? Math.round(apps.reduce((sum, a) => sum + daysSince(a.appliedAt), 0) / apps.length)
    : 0;

  const monthBars = barsData(apps);
  const totalRecent = monthBars.slice().reduce((s, m) => s + m.count, 0);

  // ---- KPI Metric Cards with intentional line accents ----
  const kpis = [
    { label: 'Total Lamaran', value: apps.length, accent: 'var(--brand)', note: `${totalRecent} dalam 6 bulan terakhir` },
    { label: 'Proses Berjalan', value: active, accent: 'var(--stage-screening)', note: `${interviews} di tahap interview` },
    { label: 'Tawaran / Diterima', value: offers, accent: 'var(--stage-offer)', note: `${counts.hired} tawaran diterima` },
    { label: 'Ditolak / Selesai', value: counts.rejected, accent: 'var(--stage-rejected)', note: 'Evaluasi & tingkatkan strategi' },
  ];

  const kpiGrid = h('div', { class: 'kpi-grid' },
    kpis.map((k, i) =>
      h('div', { class: 'kpi', style: `--kpi-accent:${k.accent}; animation-delay:${i * 40}ms;` },
        h('div', { class: 'kpi__label' }, k.label),
        h('div', { class: 'kpi__value' }, k.value.toString()),
        h('div', { class: 'kpi__note' }, k.note || ''))));

  // ---- Sebaran Tahap (Full Solid Pie Chart) ----
  const stagePie = h('div', { class: 'panel', style: 'flex:1;' },
    h('h2', {}, 'Sebaran Tahap Lamaran'),
    h('div', { class: 'panel__sub' }, `${apps.length} total lamaran terdaftar`),
    renderStagePieChart(apps, counts)
  );

  // ---- 6 Bulan Terakhir (Bar Chart with solid linings) ----
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
        h('h2', {}, 'Aktivitas Lamaran per Bulan'),
        h('div', { class: 'panel__sub' }, 'Jumlah lamaran yang dikirim dalam 6 bulan terakhir')),
      apps.length === 0
        ? null
        : h('div', { class: 'chart__meta' },
            h('span', { class: 'sw', style: 'background:var(--surface-3);border:1px solid var(--border-strong);' }), ' Riwayat',
            h('span', { class: 'sw', style: 'background:var(--brand);' }), ' Bulan Ini',
            h('span', { class: 'chart__meta-d' }, `Rata-rata: ${avgPerMonth.toFixed(1)}/bln`))),
    apps.length === 0
      ? h('p', { class: 'form-note', style: 'padding:32px 0;text-align:center;' }, 'Belum ada data untuk ditampilkan.')
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
                  style: `height:${m.count ? `max(${pct}%, 8px)` : '2px'};`,
                  'aria-label': `${m.label} · ${m.count} lamaran`,
                },
                m.count ? h('span', { class: 'cbar__val' }, m.count) : null,
                h('span', { class: 'cbar__tip' }, `${m.label}: ${m.count} lamaran`));
              }))),
          h('div', { class: 'chart__months' },
            monthBars.map((m) =>
              h('span', { class: `chart__month${m.thisMonth ? ' is-now' : ''}` }, m.label)))));

  // ---- Perlu Tindakan ----
  const attention = h('div', { class: 'panel' },
    h('h2', {}, 'Perlu Tindakan & Follow-up'),
    h('div', { class: 'panel__sub' }, 'Lamaran aktif yang sedang menunggu keputusan'),
    pending.length === 0
      ? h('p', { class: 'form-note', style: 'padding:16px 0;' }, 'Semua lamaran terkini sudah terkelola.')
      : h('div', { class: 'attention-list' },
          pending.map((a) => {
            const meta = stageMeta(a.stage);
            return h('button', {
              class: 'attention-row',
              onclick: () => onOpen(a.id),
            },
            h('span', { class: 'dot', style: `background-color:${meta.color};` }),
            h('span', { style: 'flex:1;min-width:0;' },
              h('span', { style: 'display:block;color:var(--text);font-weight:600;font-size:0.875rem;' }, a.company),
              h('span', { style: 'display:block;color:var(--text-secondary);font-size:0.78rem;' }, `${a.role} · ${meta.label}`)),
            h('span', { class: 'chip', style: `border-color:${meta.color}44; color:${meta.color}; font-size:11px;` },
              daysSince(a.updatedAt) === 0 ? 'Hari ini' : `${daysSince(a.updatedAt)}h lalu`));
          })));

  // ---- Ritme & Statistik Efektivitas ----
  const bottomRow = h('div', { class: 'grid-2col' }, attention,
    h('div', { class: 'panel' },
      h('h2', {}, 'Ritme & Statistik'),
      h('div', { class: 'panel__sub' }, 'Konsistensi pengiriman dan tingkat respons lamaran'),
      apps.length === 0
        ? h('p', { class: 'form-note', style: 'padding:16px 0;' }, 'Belum ada data. Mulai tambahkan lamaran baru.')
        : h('div', { style: 'display:flex;flex-direction:column;gap:12px;margin-top:4px;' },
            statRow('Rata-rata lamaran per minggu', (apps.length / Math.max(avgWait, 1)).toFixed(1)),
            statRow('Rata-rata waktu tunggu', `${avgWait} hari`),
            statRow('Tingkat konversi respons', `${Math.round(((apps.length - (counts.draft + counts.applied)) / Math.max(apps.length,1)) * 100)}%`),
          )));

  const chartsRow = h('div', { class: 'grid-2col' }, chart, stagePie);

  return h('div', { style: 'display:flex;flex-direction:column;gap:16px;' },
    kpiGrid,
    chartsRow,
    bottomRow);
}

function statRow(label, value) {
  return h('div', { style: 'display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);' },
    h('span', { style: 'color:var(--text-secondary);font-size:0.85rem;' }, label),
    h('span', { style: 'font-weight:600;font-variant-numeric:tabular-nums;color:var(--text);font-size:0.92rem;' }, value));
}
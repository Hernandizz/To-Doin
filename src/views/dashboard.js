// view: Ringkasan (dashboard)

import { h, daysSince } from '../lib/util.js';
import { getApps, STAGES, stageMeta, TERMINAL, resetDemo } from '../lib/store.js';
import { openAppForm } from '../components/appForm.js';
import { openUserGuide } from '../components/userGuide.js';
import { iconEl } from '../components/icons.js';
import { toast } from '../components/toast.js';

// Perhitungan metrik gabungan dalam 1 pass loop (O(N)) yang sangat efisien
function computeDashboardMetrics(apps) {
  const counts = {
    draft: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    hired: 0,
    rejected: 0,
  };

  const now = new Date();
  const months = [];
  const monthMap = new Map();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.getMonth()];
    const entry = { key, label, count: 0, thisMonth: i === 0 };
    months.push(entry);
    monthMap.set(key, entry);
  }

  let totalWaitDays = 0;
  let active = 0;
  const pending = [];

  for (let i = 0; i < apps.length; i++) {
    const a = apps[i];
    const stage = a.stage;
    counts[stage] = (counts[stage] || 0) + 1;

    if (stage !== 'hired' && stage !== 'rejected') {
      active++;
    }

    if (stage === 'interview' || stage === 'offer' || stage === 'screening') {
      if (pending.length < 5) {
        pending.push(a);
      }
    }

    if (a.appliedAt) {
      totalWaitDays += daysSince(a.appliedAt);
      const mKey = a.appliedAt.slice(0, 7);
      const mEntry = monthMap.get(mKey);
      if (mEntry) mEntry.count++;
    }
  }

  const avgWait = apps.length ? Math.round(totalWaitDays / apps.length) : 0;
  const interviews = counts.interview || 0;
  const offers = (counts.offer || 0) + (counts.hired || 0);

  let chartTotal = 0;
  for (let i = 0; i < months.length; i++) {
    chartTotal += months[i].count;
  }

  return {
    counts,
    active,
    interviews,
    offers,
    pending,
    avgWait,
    monthBars: months,
    chartTotal,
  };
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
  const pieWrap = h('div', { class: 'pie-chart-wrap' }, graphicWrap);

  // Legend list di samping grafik - menggunakan CSS-driven hover tanpa DOM query overhead
  const legend = h('div', { class: 'pie-legend' },
    STAGES.map((s) => {
      const val = counts[s.key];
      const pct = total ? Math.round((val / total) * 100) : 0;
      const item = h('div', {
        class: `pie-legend__item${val === 0 ? ' is-empty' : ''}`,
        'data-stage': s.key,
        onmouseenter: () => {
          pieWrap.dataset.hoverStage = s.key;
        },
        onmouseleave: () => {
          delete pieWrap.dataset.hoverStage;
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

  pieWrap.append(legend);
  return pieWrap;
}

function renderOnboardingHero() {
  const hero = h('div', { class: 'onboarding-hero' },
    h('div', { class: 'onboarding-hero__head' },
      h('div', {},
        h('span', { class: 'onboarding-hero__tag' },
          iconEl('sparkles', 12), 'Mulai Cepat — Pengenalan Tangga'
        ),
        h('h2', { class: 'onboarding-hero__title' }, 'Selamat Datang! Kelola Lamaran Kerjamu dengan Rapi'),
        h('p', { class: 'onboarding-hero__sub' },
          'Tangga menyusun perjalanan kariermu ke dalam 7 tahap terstruktur. Pilih salah satu langkah di bawah untuk mulai menjelajah tanpa rasa bingung.'
        )
      ),
      h('button', {
        class: 'btn btn--ghost btn--sm',
        onclick: openUserGuide,
        title: 'Buka Buku Panduan'
      },
        iconEl('bookOpen', 14), 'Buku Panduan'
      )
    ),

    // 3 Langkah Cepat
    h('div', { class: 'onboarding-steps' },
      // Step 1: Demo
      h('div', { class: 'onboarding-step' },
        h('div', { class: 'onboarding-step__top' },
          h('span', { class: 'onboarding-step__num' }, '1'),
          h('span', { class: 'onboarding-step__title' }, 'Jelajah Data Contoh')
        ),
        h('p', { class: 'onboarding-step__desc' },
          'Isi aplikasi dengan kumpulan data contoh nyata untuk langsung melihat grafik, papan kanban, dan logbook beraksi.'
        ),
        h('div', { class: 'onboarding-step__action' },
          h('button', {
            class: 'btn btn--primary btn--sm',
            style: 'width: 100%;',
            onclick: () => {
              resetDemo();
              toast('Data contoh berhasil dimuat! Jelajahi Ringkasan & Papan Tahap.', 'success');
            }
          },
            iconEl('sparkles', 14), 'Muat Data Contoh'
          )
        )
      ),

      // Step 2: Tambah Lamaran Asli
      h('div', { class: 'onboarding-step' },
        h('div', { class: 'onboarding-step__top' },
          h('span', { class: 'onboarding-step__num' }, '2'),
          h('span', { class: 'onboarding-step__title' }, 'Catat Lamaran Asli')
        ),
        h('p', { class: 'onboarding-step__desc' },
          'Punya lowongan yang sedang diincar atau baru saja dikirim? Masukkan nama perusahaan dan posisinya sekarang.'
        ),
        h('div', { class: 'onboarding-step__action' },
          h('button', {
            class: 'btn btn--ghost btn--sm',
            style: 'width: 100%;',
            onclick: () => openAppForm()
          },
            iconEl('plus', 14), 'Tambah Lamaran'
          )
        )
      ),

      // Step 3: Pahami Alur
      h('div', { class: 'onboarding-step' },
        h('div', { class: 'onboarding-step__top' },
          h('span', { class: 'onboarding-step__num' }, '3'),
          h('span', { class: 'onboarding-step__title' }, 'Pahami 7 Tahap')
        ),
        h('p', { class: 'onboarding-step__desc' },
          'Pelajari arti setiap tahapan tangga karier, tips follow-up, dan cara mengelola pergerakan status di papan kanban.'
        ),
        h('div', { class: 'onboarding-step__action' },
          h('button', {
            class: 'btn btn--ghost btn--sm',
            style: 'width: 100%;',
            onclick: openUserGuide
          },
            iconEl('help', 14), 'Buka Tutorial'
          )
        )
      )
    ),

    // Pipeline preview bar
    h('div', { class: 'onboarding-pipeline' },
      STAGES.map((s, idx) =>
        h('div', { style: 'display:flex; align-items:center; gap:6px;' },
          h('div', { class: 'onboarding-pipeline__item' },
            h('span', { class: 'dot', style: `background-color:${s.color};` }),
            s.label
          ),
          idx < STAGES.length - 1 ? h('span', { class: 'onboarding-pipeline__sep' }, '→') : null
        )
      )
    )
  );

  return hero;
}

export function renderDashboard(onOpen) {
  const apps = getApps();
  const {
    counts,
    active,
    interviews,
    offers,
    pending,
    avgWait,
    monthBars,
    chartTotal,
  } = computeDashboardMetrics(apps);
  const totalRecent = chartTotal;

  // ---- KPI Metric Cards with intentional line accents ----
  const kpis = apps.length === 0
    ? [
        { label: 'Total Lamaran', value: 0, accent: 'var(--brand)', note: 'Belum ada lamaran terdaftar' },
        { label: 'Proses Berjalan', value: 0, accent: 'var(--stage-screening)', note: 'Tahap aktif akan muncul di sini' },
        { label: 'Tawaran / Diterima', value: 0, accent: 'var(--stage-offer)', note: 'Pencapaian akhir kariermu' },
        { label: 'Ditolak / Selesai', value: 0, accent: 'var(--stage-rejected)', note: 'Tempat evaluasi strategi' },
      ]
    : [
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
    h('div', { style: 'display:flex; justify-content:space-between; align-items:flex-start;' },
      h('div', {},
        h('h2', {}, 'Sebaran Tahap Lamaran'),
        h('div', { class: 'panel__sub' }, `${apps.length} total lamaran terdaftar`)
      ),
      apps.length > 0
        ? h('button', {
            class: 'btn btn--quiet btn--sm',
            onclick: openUserGuide,
            title: 'Pelajari alur tahap'
          }, iconEl('help', 14), 'Alur')
        : null
    ),
    renderStagePieChart(apps, counts)
  );

  // ---- 6 Bulan Terakhir (Bar Chart with solid linings) ----
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
      ? h('div', { style: 'padding:32px 16px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px;' },
          h('p', { class: 'form-note' }, 'Grafik akan otomatis terisi saat kamu mencatat lamaran kerja.'),
          h('button', {
            class: 'btn btn--ghost btn--sm',
            onclick: () => {
              resetDemo();
              toast('Data contoh berhasil dimuat!', 'success');
            }
          }, iconEl('sparkles', 13), 'Muat contoh untuk lihat grafik'))
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
      ? h('div', { style: 'padding:16px 0; display:flex; flex-direction:column; gap:8px;' },
          h('p', { class: 'form-note' },
            apps.length === 0
              ? 'Lamaran di tahap Seleksi, Interview, dan Tawaran akan berkumpul di sini agar kamu mudah memantaunya.'
              : 'Semua lamaran terkini sudah terkelola dengan baik.'
          ),
          apps.length === 0
            ? h('div', {},
                h('button', {
                  class: 'btn btn--ghost btn--sm',
                  onclick: () => openAppForm()
                }, iconEl('plus', 13), 'Tambah lamaran'))
            : null
        )
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
        ? h('p', { class: 'form-note', style: 'padding:16px 0;' }, 'Setelah kamu mencatat beberapa lamaran, metrik waktu tunggu dan rasio respons akan otomatis dihitung.')
        : h('div', { style: 'display:flex;flex-direction:column;gap:12px;margin-top:4px;' },
            statRow('Rata-rata lamaran per minggu', (apps.length / Math.max(avgWait / 7, 1)).toFixed(1)),
            statRow('Rata-rata waktu tunggu', `${avgWait} hari`),
            statRow('Tingkat konversi respons', `${Math.round(((apps.length - (counts.draft + counts.applied)) / Math.max(apps.length,1)) * 100)}%`),
          )));

  const chartsRow = h('div', { class: 'grid-2col' }, chart, stagePie);

  return h('div', { style: 'display:flex;flex-direction:column;gap:16px;' },
    apps.length === 0 ? renderOnboardingHero() : null,
    kpiGrid,
    chartsRow,
    bottomRow);
}

function statRow(label, value) {
  return h('div', { style: 'display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);' },
    h('span', { style: 'color:var(--text-secondary);font-size:0.85rem;' }, label),
    h('span', { style: 'font-weight:600;font-variant-numeric:tabular-nums;color:var(--text);font-size:0.92rem;' }, value));
}
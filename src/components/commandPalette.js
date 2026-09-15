// commandPalette — Global Spotlight Search & Action Palette (Ctrl+K / Cmd+K)

import { h, debounce } from '../lib/util.js';
import { iconEl, iconHTML } from './icons.js';
import { getState, stageMeta, STAGES } from '../lib/store.js';

let paletteInstance = null;

export function openCommandPalette({ onOpenApp, onNavigate, onNewApp, onToggleTheme, onExportCSV, onExportJSON, onOpenGuide }) {
  if (paletteInstance) {
    paletteInstance.close();
  }

  const overlay = h('div', { class: 'cmd-overlay' });
  const modal = h('div', { class: 'cmd-palette' });

  let query = '';
  let selectedIndex = 0;
  let currentItems = [];

  const searchInput = h('input', {
    class: 'cmd-input',
    placeholder: 'Cari lowongan, perintah cepat, atau ketik kata kunci...',
    value: '',
    autofocus: 'true',
  });

  const listContainer = h('div', { class: 'cmd-list' });

  const footer = h('div', { class: 'cmd-footer' },
    h('div', { class: 'cmd-shortcuts' },
      h('span', { class: 'cmd-key' }, '↑↓'), 'Navigasi',
      h('span', { class: 'cmd-key' }, '↵'), 'Pilih',
      h('span', { class: 'cmd-key' }, 'ESC'), 'Tutup'
    ),
    h('div', { class: 'cmd-brand-tag' },
      h('span', { html: iconHTML('command', 12) }),
      'Tangga Command'
    )
  );

  function getStaticActions() {
    return [
      {
        type: 'action',
        id: 'new_app',
        title: 'Tambah Lamaran Baru',
        subtitle: 'Buka formulir untuk mencatat lowongan baru',
        icon: 'plus',
        color: 'var(--brand)',
        handler: () => onNewApp?.(),
      },
      {
        type: 'nav',
        id: 'nav_dashboard',
        title: 'Buka Ringkasan (Dashboard)',
        subtitle: 'Peta metrik, grafik aktivitas, dan jadwal interview',
        icon: 'gauge',
        color: 'var(--stage-applied)',
        handler: () => onNavigate?.('dashboard'),
      },
      {
        type: 'nav',
        id: 'nav_board',
        title: 'Buka Papan Tahap (Kanban)',
        subtitle: 'Kelola alur lamaran kerja secara visual',
        icon: 'board',
        color: 'var(--stage-interview)',
        handler: () => onNavigate?.('board'),
      },
      {
        type: 'nav',
        id: 'nav_applications',
        title: 'Buka Semua Lamaran (Tabel)',
        subtitle: 'Daftar tabel lengkap dengan filter dan sortir',
        icon: 'list',
        color: 'var(--stage-screening)',
        handler: () => onNavigate?.('applications'),
      },
      {
        type: 'action',
        id: 'export_csv',
        title: 'Ekspor Data ke CSV (Excel)',
        subtitle: 'Unduh seluruh spreadsheet lamaran format CSV',
        icon: 'fileSpreadsheet',
        color: 'var(--stage-hired)',
        handler: () => onExportCSV?.(),
      },
      {
        type: 'action',
        id: 'export_json',
        title: 'Cadangkan Data ke JSON',
        subtitle: 'Simpan backup cadangan seluruh data lokal',
        icon: 'download',
        color: 'var(--text-secondary)',
        handler: () => onExportJSON?.(),
      },
      {
        type: 'action',
        id: 'toggle_theme',
        title: 'Ganti Tema Tampilan (Dark / Light)',
        subtitle: 'Beralih antara tema gelap dan terang',
        icon: 'sun',
        color: 'var(--warning)',
        handler: () => onToggleTheme?.(),
      },
      {
        type: 'action',
        id: 'open_guide',
        title: 'Buka Buku Panduan Tangga',
        subtitle: 'Pelajari tips alur 7 tahap dan panduan mulai cepat',
        icon: 'bookOpen',
        color: 'var(--stage-screening)',
        handler: () => onOpenGuide?.(),
      },
    ];
  }

  function computeResults(q) {
    const rawQ = q.trim().toLowerCase();
    const apps = getState().apps;

    if (!rawQ) {
      // Tampilkan aksi cepat + 4 lamaran aktif terkini
      const recentApps = apps
        .slice(0, 4)
        .map((a) => ({
          type: 'app',
          id: a.id,
          title: a.company,
          subtitle: `${a.role} · ${a.location || 'Lokasi tidak disetel'}`,
          stage: a.stage,
          app: a,
          handler: () => onOpenApp?.(a.id),
        }));

      return [
        { section: 'Tindakan Cepat', items: getStaticActions().slice(0, 4) },
        recentApps.length > 0 ? { section: 'Lamaran Terkini', items: recentApps } : null,
        { section: 'Navigasi & Utilitas Lainnya', items: getStaticActions().slice(4) },
      ].filter(Boolean);
    }

    // Filter lamaran
    const matchedApps = apps
      .filter((a) => {
        const text = `${a.company} ${a.role} ${a.location || ''} ${a.notes || ''} ${stageMeta(a.stage).label}`.toLowerCase();
        return text.includes(rawQ);
      })
      .map((a) => ({
        type: 'app',
        id: a.id,
        title: a.company,
        subtitle: `${a.role} · ${a.location || 'Lokasi tidak disetel'}`,
        stage: a.stage,
        app: a,
        handler: () => onOpenApp?.(a.id),
      }));

    // Filter static actions
    const matchedActions = getStaticActions().filter((act) => {
      const text = `${act.title} ${act.subtitle}`.toLowerCase();
      return text.includes(rawQ);
    });

    const sections = [];
    if (matchedApps.length > 0) {
      sections.push({ section: `Hasil Lamaran (${matchedApps.length})`, items: matchedApps });
    }
    if (matchedActions.length > 0) {
      sections.push({ section: 'Perintah & Fitur', items: matchedActions });
    }

    return sections;
  }

  function renderList() {
    const sections = computeResults(query);
    currentItems = [];
    sections.forEach((sec) => sec.items.forEach((it) => currentItems.push(it)));

    if (currentItems.length === 0) {
      listContainer.replaceChildren(
        h('div', { class: 'cmd-empty' },
          h('span', { html: iconHTML('search', 28) }),
          h('p', {}, `Tidak ada lamaran atau perintah yang cocok dengan "${query}".`),
          h('span', { class: 'cmd-empty-hint' }, 'Coba cari nama perusahaan, posisi, atau tahap lamaran.')
        )
      );
      return;
    }

    if (selectedIndex >= currentItems.length) {
      selectedIndex = Math.max(0, currentItems.length - 1);
    }

    let flatIndex = 0;
    const fragment = document.createDocumentFragment();

    sections.forEach((sec) => {
      const header = h('div', { class: 'cmd-group-title' }, sec.section);
      fragment.append(header);

      sec.items.forEach((item) => {
        const thisIdx = flatIndex++;
        const isSelected = thisIdx === selectedIndex;

        let iconNode;
        if (item.type === 'app') {
          const meta = stageMeta(item.stage);
          iconNode = h('span', {
            class: 'cmd-item-badge',
            style: `background-color:${meta.color}22; color:${meta.color}; border:1px solid ${meta.color}55;`
          }, meta.label);
        } else {
          iconNode = h('span', {
            class: 'cmd-item-icon',
            style: `color:${item.color || 'var(--brand)'}; background:var(--surface-3);`
          }, h('span', { html: iconHTML(item.icon, 16) }));
        }

        const el = h('div', {
          class: `cmd-item${isSelected ? ' is-selected' : ''}`,
          onclick: () => {
            close();
            item.handler?.();
          },
          onmouseenter: () => {
            selectedIndex = thisIdx;
            updateSelection();
          }
        },
          iconNode,
          h('div', { class: 'cmd-item-info' },
            h('div', { class: 'cmd-item-title' }, item.title),
            h('div', { class: 'cmd-item-sub' }, item.subtitle)
          ),
          h('span', { class: 'cmd-item-arrow' }, '↵')
        );

        fragment.append(el);
      });
    });

    listContainer.replaceChildren(fragment);
    ensureVisible();
  }

  function updateSelection() {
    const items = listContainer.querySelectorAll('.cmd-item');
    items.forEach((node, i) => {
      if (i === selectedIndex) {
        node.classList.add('is-selected');
      } else {
        node.classList.remove('is-selected');
      }
    });
    ensureVisible();
  }

  function ensureVisible() {
    const active = listContainer.querySelector('.cmd-item.is-selected');
    if (active) {
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentItems.length > 0) {
        selectedIndex = (selectedIndex + 1) % currentItems.length;
        updateSelection();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentItems.length > 0) {
        selectedIndex = (selectedIndex - 1 + currentItems.length) % currentItems.length;
        updateSelection();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentItems[selectedIndex]) {
        const chosen = currentItems[selectedIndex];
        close();
        chosen.handler?.();
      }
    }
  }

  searchInput.addEventListener('input', debounce(() => {
    query = searchInput.value;
    selectedIndex = 0;
    renderList();
  }, 40));

  document.addEventListener('keydown', onKeyDown);
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });

  function close() {
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
    paletteInstance = null;
  }

  const head = h('div', { class: 'cmd-head' },
    h('span', { class: 'cmd-search-icon', html: iconHTML('search', 18) }),
    searchInput,
    h('button', {
      class: 'cmd-close-btn',
      'aria-label': 'Tutup pencarian',
      onclick: close
    }, h('span', { html: iconHTML('x', 14) }))
  );

  modal.append(head, listContainer, footer);
  overlay.append(modal);

  const root = document.getElementById('modal-root') || document.body;
  root.append(overlay);

  renderList();
  setTimeout(() => searchInput.focus(), 30);

  paletteInstance = { close };
  return paletteInstance;
}

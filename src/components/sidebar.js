// sidebar — navigasi kiri

import { h } from '../lib/util.js';
import { iconHTML } from './icons.js';
import { getState } from '../lib/store.js';
import { openUserGuide } from './userGuide.js';

let updateFn = null;

export function refreshSidebar() {
  if (updateFn) updateFn();
}

function activeFromHash() {
  const hash = location.hash.replace(/^#\//, '') || 'dashboard';
  return hash;
}

export function renderSidebar({ onNav }) {
  const items = [
    { key: 'dashboard', label: 'Ringkasan', icon: 'gauge' },
    { key: 'board', label: 'Papan tahap', icon: 'board' },
    { key: 'applications', label: 'Semua lamaran', icon: 'list' },
    { key: 'settings', label: 'Pengaturan', icon: 'cog' },
  ];

  const navItem = (it) => {
    const isActive = activeFromHash() === it.key;
    const count = it.key === 'board'
      ? getState().apps.filter((a) => !['hired', 'rejected'].includes(a.stage)).length
      : null;

    return h('a', {
      class: [
        'group flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition duration-150',
        isActive
          ? 'border-[var(--brand-border)] bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm'
          : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
      ].join(' '),
      href: `#/${it.key}`,
      onclick: (e) => { e.preventDefault(); onNav(it.key); },
    },
      h('span', {
        class: `inline-flex h-7 w-7 items-center justify-center rounded-md transition ${isActive ? 'text-[var(--brand)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'}`,
        html: iconHTML(it.icon, 16)
      }),
      h('span', { class: 'flex-1 text-left' }, it.label),
      count != null
        ? h('span', {
            class: `rounded-full px-2 py-0.5 text-[11px] font-semibold tabular ${isActive ? 'bg-[var(--brand)] text-white' : 'border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]'}`
          }, String(count))
        : null
    );
  };

  const nav = h('nav', { class: 'mt-5 flex flex-col gap-1' }, items.map(navItem));

  const sidebar = h('aside', { class: 'sidebar' },
    h('div', { class: 'flex items-center gap-3 px-2 pb-4 pt-1 border-b border-[var(--border)]' },
      h('span', {
        class: 'inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand)] text-white shadow-sm flex-shrink-0',
        'aria-hidden': 'true',
        html: iconHTML('target', 18)
      }),
      h('div', { class: 'min-w-0' },
        h('div', { class: 'text-base font-bold tracking-tight text-[var(--text)]' }, 'Tangga'),
        h('div', { class: 'text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]' }, 'Pelacak Lamaran')
      )
    ),
    h('div', { class: 'px-2 pb-1 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]' }, 'Menu'),
    nav,
    h('div', { class: 'mt-auto rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--text-muted)] flex flex-col gap-2' },
      h('div', { class: 'flex items-center justify-between' },
        h('span', { class: 'font-semibold text-[var(--text-secondary)]' }, 'Panduan Tangga'),
        h('span', { class: 'text-[var(--brand)]', html: iconHTML('bookOpen', 14) })
      ),
      h('span', {}, 'Pelajari alur 7 tahap lamaran dan cara kerja papan kanban.'),
      h('button', {
        class: 'btn btn--ghost btn--sm w-full justify-center',
        style: 'font-size: 11px; padding: 5px 8px; margin-top: 2px;',
        onclick: openUserGuide
      }, 'Buka Buku Panduan')
    )
  );

  updateFn = () => {
    const el = sidebar.querySelector('nav');
    if (el) el.replaceChildren(...items.map(navItem));
  };

  return sidebar;
}
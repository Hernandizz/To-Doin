// sidebar — navigasi kiri

import { h } from '../lib/util.js';
import { iconHTML } from './icons.js';
import { getState } from '../lib/store.js';

let updateFn = null;

export function refreshSidebar() {
  if (updateFn) updateFn();
}

function activeFromHash() {
  const hash = location.hash.replace(/^#\//, '') || 'dashboard';
  return hash;
}

export function renderSidebar({ onNav }) {
  const route = activeFromHash();

  const items = [
    { key: 'dashboard', label: 'Ringkasan', icon: 'gauge' },
    { key: 'board', label: 'Papan tahap', icon: 'board' },
    { key: 'applications', label: 'Semua lamaran', icon: 'list' },
    { key: 'settings', label: 'Pengaturan', icon: 'cog' },
  ];

  const navItem = (it) =>
    h('a', {
      class: `nav__item${activeFromHash() === it.key ? ' is-active' : ''}`,
      href: `#/${it.key}`,
      onclick: (e) => { e.preventDefault(); onNav(it.key); },
    },
    h('span', { html: iconHTML(it.icon, 17) }),
    h('span', {}, it.label),
    it.key === 'board'
      ? h('span', { class: 'nav__count' },
          getState().apps.filter((a) => !['hired', 'rejected'].includes(a.stage)).length)
      : null);

  const nav = h('nav', { class: 'nav' }, items.map(navItem));

  const sidebar = h('aside', { class: 'sidebar' },
    h('div', { class: 'brand' },
      h('span', { class: 'brand__mark', 'aria-hidden': 'true', html: iconHTML('target', 17) }),
      h('span', {},
        h('div', { class: 'brand__name' }, 'Tangga'),
        h('div', { class: 'brand__tag' }, 'pelacak lamaran')),
    ),
    h('div', { class: 'nav__label' }, 'Navigasi'),
    nav,
    h('div', { class: 'sidebar__foot' },
      'Setiap tahap lamaran adalah satu anak tangga. Naik satu per satu.'));

  updateFn = () => {
    const el = sidebar.querySelector('.nav');
    el.replaceChildren(...items.map(navItem));
  };

  return sidebar;
}
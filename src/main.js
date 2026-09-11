// main — bootstrap aplikasi, routing, layout shell

import { renderSidebar, refreshSidebar } from './components/sidebar.js';
import { renderDashboard } from './views/dashboard.js';
import { renderBoard } from './views/board.js';
import { renderApplications } from './views/applications.js';
import { renderSettings } from './views/settings.js';
import { openAppForm } from './components/appForm.js';
import { openDrawer } from './components/appDrawer.js';
import { openUserGuide } from './components/userGuide.js';
import { h, fmtDay } from './lib/util.js';
import { iconEl } from './components/icons.js';
import { subscribe, getState } from './lib/store.js';
import { toast } from './components/toast.js';

let route = 'dashboard';
let viewEl;

const THEME_KEY = 'tangga.theme';

const ROUTES = {
  dashboard: { title: 'Ringkasan', sub: 'Peta seluruh perjalanan lamaran kerja kamu' },
  board: { title: 'Papan Tahap', sub: 'Pantau dan kelola tahapan lamaran secara visual' },
  applications: { title: 'Semua Lamaran', sub: 'Daftar lengkap untuk menyaring, mencari, dan mengelola' },
  settings: { title: 'Pengaturan', sub: 'Kelola preferensi tema, cadangan data, dan contoh' },
};

function navigate(to) {
  route = to;
  history.replaceState(null, '', '#/' + to);
  refreshSidebar();
  render();
}

function openApp(app) {
  const id = typeof app === 'string' ? app : app.id;
  openDrawer(id);
}

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch {
    return 'dark';
  }
}

function applyTheme(theme = getStoredTheme()) {
  const next = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  return next;
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  render();
}

function render() {
  if (!viewEl) return;
  const meta = ROUTES[route] || ROUTES.dashboard;
  const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

  const header = h('header', { class: 'page-header' },
    h('div', { class: 'page-header__meta' },
      h('span', { class: 'page-header__date' }, fmtDay(new Date().toISOString().slice(0, 10))),
      h('h1', { class: 'page-header__title' }, meta.title),
      h('p', { class: 'page-header__sub' }, meta.sub)
    ),
    h('div', { class: 'page-header__actions' },
      h('button', {
        class: 'btn btn--ghost btn--sm',
        onclick: openUserGuide,
        title: 'Buka Buku Panduan Tangga',
        'aria-label': 'Panduan'
      },
        iconEl('bookOpen', 14), 'Panduan'
      ),
      h('button', {
        class: 'btn btn--ghost btn--sm',
        onclick: toggleTheme,
        'aria-label': 'Ganti tema'
      },
        iconEl(theme === 'dark' ? 'sun' : 'moon', 14),
        theme === 'dark' ? 'Light' : 'Dark'
      ),
      h('button', {
        class: 'btn btn--primary',
        onclick: () => openAppForm()
      },
        iconEl('plus', 15), 'Lamaran baru'
      )
    )
  );

  const contentContainer = h('div', { class: 'view-body' });

  switch (route) {
    case 'dashboard':
      contentContainer.append(renderDashboard(openApp));
      break;
    case 'board':
      contentContainer.append(renderBoard(openApp));
      break;
    case 'applications':
      contentContainer.append(renderApplications(openApp));
      break;
    case 'settings':
      contentContainer.append(renderSettings());
      break;
  }

  viewEl.replaceChildren(header, contentContainer);
}

function initRouter() {
  const hash = location.hash.replace(/^#\//, '') || 'dashboard';
  route = ROUTES[hash] ? hash : 'dashboard';
}

function init() {
  applyTheme(getStoredTheme());

  const app = document.getElementById('app');
  const shell = h('div', { class: 'app-shell' });
  app.append(shell);

  shell.append(renderSidebar({ route, onNav: navigate }));

  viewEl = h('main', { class: 'main-content' });
  shell.append(viewEl);

  initRouter();
  render();

  window.addEventListener('hashchange', () => {
    const hash = location.hash.replace(/^#\//, '') || 'dashboard';
    if (ROUTES[hash]) {
      route = hash;
      render();
    }
  });

  subscribe(() => {
    refreshSidebar();
    render();
  });

  const first = getState();
  if (first.apps.length === 0) {
    setTimeout(() => {
      toast('Selamat datang di Tangga! Ikuti panduan mulai cepat untuk menjelajah.');
    }, 400);
  }
}

init();
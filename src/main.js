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

let headerEl = null;
let contentEl = null;
let lastHeaderRoute = null;
let lastHeaderTheme = null;

function updateHeader() {
  const meta = ROUTES[route] || ROUTES.dashboard;
  const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

  if (!headerEl || !contentEl) {
    headerEl = h('header', { class: 'page-header' });
    contentEl = h('div', { class: 'view-body' });
    viewEl.replaceChildren(headerEl, contentEl);
  }

  if (lastHeaderRoute === route && lastHeaderTheme === theme) {
    return;
  }
  lastHeaderRoute = route;
  lastHeaderTheme = theme;

  const dateStr = fmtDay(new Date().toISOString().slice(0, 10));

  const metaBox = h('div', { class: 'page-header__meta' },
    h('span', { class: 'page-header__date' }, dateStr),
    h('h1', { class: 'page-header__title' }, meta.title),
    h('p', { class: 'page-header__sub' }, meta.sub)
  );

  const actions = h('div', { class: 'page-header__actions' },
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
  );

  headerEl.replaceChildren(metaBox, actions);
}

function render() {
  if (!viewEl) return;
  updateHeader();

  let viewNode;
  switch (route) {
    case 'dashboard':
      viewNode = renderDashboard(openApp);
      break;
    case 'board':
      viewNode = renderBoard(openApp);
      break;
    case 'applications':
      viewNode = renderApplications(openApp);
      break;
    case 'settings':
      viewNode = renderSettings();
      break;
  }

  if (viewNode && contentEl) {
    contentEl.replaceChildren(viewNode);
  }
}

let renderRafId = null;
function scheduleRender() {
  if (renderRafId) return;
  renderRafId = requestAnimationFrame(() => {
    renderRafId = null;
    render();
  });
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
    route = ROUTES[hash] ? hash : 'dashboard';
    refreshSidebar();
    render();
  });

  window.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot && modalRoot.children.length > 0) return;

    if (e.key === '/') {
      e.preventDefault();
      if (route !== 'applications') {
        navigate('applications');
      }
      setTimeout(() => {
        const input = document.querySelector('.toolbar input.input');
        if (input) {
          input.focus();
          input.select();
        }
      }, 40);
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      openAppForm();
    } else if (e.key === '?') {
      e.preventDefault();
      openUserGuide();
    }
  });

  subscribe(() => {
    refreshSidebar();
    scheduleRender();
  });

  const first = getState();
  if (first.apps.length === 0) {
    setTimeout(() => {
      toast('Selamat datang di Tangga! Ikuti panduan mulai cepat untuk menjelajah.');
    }, 400);
  }
}

init();
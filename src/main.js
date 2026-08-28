// main — bootstrap aplikasi, routing, layout shell

import { renderSidebar, refreshSidebar } from './components/sidebar.js';
import { renderDashboard } from './views/dashboard.js';
import { renderBoard } from './views/board.js';
import { renderApplications } from './views/applications.js';
import { renderSettings } from './views/settings.js';
import { openAppForm } from './components/appForm.js';
import { openDrawer } from './components/appDrawer.js';
import { h, fmtDay } from './lib/util.js';
import { iconHTML, iconEl } from './components/icons.js';
import { subscribe, getState, STAGES } from './lib/store.js';
import { toast } from './components/toast.js';

let route = 'dashboard';
let viewEl;

const ROUTES = {
  dashboard: { title: 'Ringkasan', sub: 'Peta seluruh perjalanan lamaranmu' },
  board: { title: 'Papan tahap', sub: 'Geser lamaran satu anak tangga demi satu' },
  applications: { title: 'Semua lamaran', sub: 'Tabel lengkap untuk menyaring dan mencari' },
  settings: { title: 'Pengaturan', sub: 'Kelola data, cadangan, dan contoh' },
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

function render() {
  if (!viewEl) return;
  const meta = ROUTES[route];
  const header = h('div', { class: 'topbar' },
    h('div', {},
      h('p', { style: 'font-size:.75rem;color:var(--text-muted);letter-spacing:.1em;text-transform:uppercase;font-weight:600;margin-bottom:4px;' },
        fmtDay(new Date().toISOString().slice(0, 10))),
      h('h1', {}, meta.title),
      h('div', { class: 'sub' }, meta.sub)),
    h('button', { class: 'btn btn--primary', onclick: () => openAppForm(), style: 'flex:none;' },
      iconEl('plus', 15), 'Lamaran baru'));

  const content = h('main', { class: 'main' }, header);
  viewEl.replaceChildren(content);
  content.append(h('div', { class: 'view-body' }));
  const bodyEl = content.querySelector('.view-body');

  switch (route) {
    case 'dashboard':
      bodyEl.append(renderDashboard(openApp));
      break;
    case 'board':
      bodyEl.append(renderBoard(openApp));
      break;
    case 'applications':
      bodyEl.append(renderApplications(openApp));
      break;
    case 'settings':
      bodyEl.append(renderSettings());
      break;
  }
}

function initRouter() {
  const hash = location.hash.replace(/^#\//, '') || 'dashboard';
  route = ROUTES[hash] ? hash : 'dashboard';
}

function init() {
  const app = document.getElementById('app');
  const shell = h('div', { class: 'shell' });
  app.append(shell);

  shell.append(renderSidebar({ route, onNav: navigate }));

  const mainWrap = h('div', { style: 'flex:1;min-width:0;display:flex;flex-direction:column;' });
  shell.append(mainWrap);

  viewEl = h('div', { style: 'flex:1;min-width:0;display:flex;flex-direction:column;' });
  mainWrap.append(viewEl);

  initRouter();
  render();

  // klik tengah sidebar tidak perlu; router via hash untuk konten saja
  window.addEventListener('hashchange', () => {
    const hash = location.hash.replace(/^#\//, '') || 'dashboard';
    if (ROUTES[hash]) {
      route = hash;
      render();
    }
  });

  // reaksi terhadap perubahan data
  subscribe(() => {
    refreshSidebar();
    // view yg sedang aktif di-render ulang agar selalu sinkron
    render();
  });

  const first = getState();
  if (first.apps.length === 0) {
    setTimeout(() => {
      toast('Mulai dengan menekan "Lamaran baru", atau muat data contoh di Pengaturan.');
    }, 400);
  }
}

init();
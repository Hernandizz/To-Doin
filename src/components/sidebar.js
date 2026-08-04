// To-Doin — Sidebar Navigation
import { getState, getInboxTasks, getTodayTasks } from '../store.js';
import { getCurrentPath } from '../router.js';

export function renderSidebar() {
  const { tasks, projects } = getState();
  const path = getCurrentPath();
  const inboxCount = getInboxTasks(tasks).length;
  const todayCount = getTodayTasks(tasks).filter(t => !t.completed).length;

  const projectItems = projects.map(p => `
    <a href="#/project/${p.id}" class="sidebar-link ${path === `/project/${p.id}` ? 'active' : ''}">
      <div class="flex items-center gap-sm">
        <span class="sidebar-project-dot" style="background-color:${p.color}"></span>
        <span class="truncate">${p.name}</span>
      </div>
    </a>
  `).join('');

  return `
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <aside class="sidebar" id="sidebar">
      <button class="btn btn-primary w-full" id="btn-add-task" style="gap:8px">
        <span class="material-symbols-outlined icon-sm">add</span>
        Tambah Tugas
      </button>

      <div class="flex-col" style="display:flex;gap:4px;margin-top:8px">
        <div class="sidebar-section-label">Navigasi Utama</div>
        <a href="#/inbox" class="sidebar-link ${path === '/inbox' ? 'active' : ''}">
          <div class="flex items-center gap-sm">
            <span class="material-symbols-outlined icon-sm ${path === '/inbox' ? 'icon-filled' : ''}" style="color:var(--secondary)">inbox</span>
            <span>Inbox</span>
          </div>
          ${inboxCount > 0 ? `<span class="sidebar-badge">${inboxCount}</span>` : ''}
        </a>
        <a href="#/today" class="sidebar-link ${path === '/today' ? 'active' : ''}">
          <div class="flex items-center gap-sm">
            <span class="material-symbols-outlined icon-sm">calendar_today</span>
            <span>Hari Ini</span>
          </div>
          ${todayCount > 0 ? `<span class="sidebar-badge">${todayCount}</span>` : ''}
        </a>
        <a href="#/upcoming" class="sidebar-link ${path === '/upcoming' ? 'active' : ''}">
          <div class="flex items-center gap-sm">
            <span class="material-symbols-outlined icon-sm">date_range</span>
            <span>Mendatang</span>
          </div>
        </a>
        <a href="#/calendar" class="sidebar-link ${path === '/calendar' ? 'active' : ''}">
          <div class="flex items-center gap-sm">
            <span class="material-symbols-outlined icon-sm">calendar_month</span>
            <span>Kalender</span>
          </div>
        </a>
      </div>

      <div class="flex-col" style="display:flex;gap:4px;margin-top:16px">
        <div class="flex items-center justify-between" style="padding:0 12px">
          <span class="sidebar-section-label" style="padding:0;margin:0">Proyek</span>
          <button class="btn-ghost" id="btn-add-project" style="padding:4px" title="Proyek baru">
            <span class="material-symbols-outlined" style="font-size:16px">add</span>
          </button>
        </div>
        ${projectItems}
      </div>
    </aside>
  `;
}

export function attachSidebarEvents(callbacks = {}) {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  const addTaskBtn = document.getElementById('btn-add-task');
  if (addTaskBtn && callbacks.onAddTask) {
    addTaskBtn.addEventListener('click', callbacks.onAddTask);
  }

  const addProjectBtn = document.getElementById('btn-add-project');
  if (addProjectBtn && callbacks.onAddProject) {
    addProjectBtn.addEventListener('click', callbacks.onAddProject);
  }
}

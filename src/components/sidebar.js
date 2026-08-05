// To-Doin — Sidebar Navigation
import { getState, getInboxTasks, getTodayTasks } from '../store.js';
import { getCurrentPath } from '../router.js';

export function renderSidebar() {
  const { tasks } = getState();
  const path = getCurrentPath();
  const inboxCount = getInboxTasks(tasks).length;

  return `
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    
    <!-- Far-Left Icon Navigation Rail -->
    <div class="icon-rail flex flex-col justify-between items-center">
      <div class="flex flex-col items-center gap-sm pt-xs">
        <div class="rail-logo-box" title="Stacks">
          <span class="material-symbols-outlined">layers</span>
        </div>
        <button class="rail-icon-btn active" title="Home"><span class="material-symbols-outlined">home</span></button>
        <button class="rail-icon-btn" title="Search"><span class="material-symbols-outlined">search</span></button>
        <button class="rail-icon-btn" title="Inbox"><span class="material-symbols-outlined">inbox</span></button>
        <button class="rail-icon-btn" title="Documents"><span class="material-symbols-outlined">folder</span></button>
        <button class="rail-icon-btn" title="Team"><span class="material-symbols-outlined">group</span></button>
      </div>

      <div class="flex flex-col items-center gap-sm pb-xs">
        <button class="rail-icon-btn" id="theme-toggle-rail" title="Theme"><span class="material-symbols-outlined">contrast</span></button>
        <button class="rail-icon-btn" title="Settings"><span class="material-symbols-outlined">settings</span></button>
        <div class="rail-user-avatar" title="Account">S</div>
      </div>
    </div>

    <!-- Main Sidebar Workspace Drawer -->
    <aside class="sidebar starline-sidebar" id="sidebar">
      <!-- Workspace Brand Header -->
      <div class="sidebar-brand flex items-center justify-between">
        <div class="flex items-center gap-xs">
          <div class="starline-logo flex items-center justify-center">✨</div>
          <span class="font-weight-700 font-size-14 text-dark">Starline™ AI</span>
          <span class="material-symbols-outlined icon-xs text-muted">unfold_more</span>
        </div>
        <button class="btn-icon btn-xs" id="btn-toggle-sidebar" title="Collapse sidebar">
          <span class="material-symbols-outlined icon-xs">left_panel_close</span>
        </button>
      </div>

      <!-- Quick Command Bar -->
      <div class="sidebar-command-bar flex items-center justify-between">
        <div class="flex items-center gap-xs text-muted text-xs">
          <span class="material-symbols-outlined icon-xs">search</span>
          <span>Command</span>
        </div>
        <span class="command-shortcut">/</span>
      </div>

      <!-- Main Navigation Menu -->
      <div class="sidebar-menu flex-col gap-2xs mt-xs">
        <a href="#/projects" class="sidebar-link ${path === '/projects' ? 'active' : ''}">
          <span class="material-symbols-outlined icon-xs">home</span>
          <span>Home</span>
        </a>

        <a href="#/inbox" class="sidebar-link ${path === '/inbox' ? 'active' : ''}">
          <span class="material-symbols-outlined icon-xs">circle_notifications</span>
          <span>Updates</span>
          <span class="sidebar-badge-gray">44</span>
        </a>

        <a href="#/inbox" class="sidebar-link">
          <span class="material-symbols-outlined icon-xs">inbox</span>
          <span>Inbox</span>
          <span class="sidebar-badge-gray">20</span>
        </a>

        <a href="#/my-tasks" class="sidebar-link flex items-center justify-between">
          <div class="flex items-center gap-xs">
            <span class="material-symbols-outlined icon-xs">check_box</span>
            <span>My tasks</span>
          </div>
          <span class="material-symbols-outlined icon-2xs text-muted">add</span>
        </a>

        <!-- WORKSPACE Section -->
        <div class="sidebar-section-container mt-sm">
          <div class="sidebar-section-title flex items-center justify-between">
            <div class="flex items-center gap-2xs">
              <span class="material-symbols-outlined icon-2xs">expand_more</span>
              <span>WORKSPACE</span>
            </div>
            <span class="material-symbols-outlined icon-2xs text-muted cursor-pointer">add</span>
          </div>

          <div class="sidebar-sub-menu flex-col gap-2xs">
            <a href="#/projects" class="sidebar-link">
              <span class="material-symbols-outlined icon-xs">folder</span>
              <span>Projects</span>
            </a>
            <a href="#/projects" class="sidebar-link active flex items-center justify-between">
              <div class="flex items-center gap-xs">
                <span class="material-symbols-outlined icon-xs">check_box</span>
                <span>Tasks</span>
              </div>
              <span class="material-symbols-outlined icon-2xs text-muted" id="btn-add-task-sidebar">add</span>
            </a>
            <a href="#/views" class="sidebar-link">
              <span class="material-symbols-outlined icon-xs">grid_view</span>
              <span>Views</span>
            </a>
            <a href="#/teams" class="sidebar-link flex items-center justify-between">
              <div class="flex items-center gap-xs">
                <span class="material-symbols-outlined icon-xs">group</span>
                <span>Teams</span>
              </div>
              <span class="sidebar-badge-gray">40</span>
            </a>
            <a href="#/reports" class="sidebar-link">
              <span class="material-symbols-outlined icon-xs">bar_chart</span>
              <span>Reports</span>
            </a>
          </div>
        </div>

        <!-- PROJECTS Section -->
        <div class="sidebar-section-container mt-xs">
          <div class="sidebar-section-title flex items-center justify-between">
            <div class="flex items-center gap-2xs">
              <span class="material-symbols-outlined icon-2xs">expand_more</span>
              <span>PROJECTS</span>
            </div>
            <span class="material-symbols-outlined icon-2xs text-muted cursor-pointer">add</span>
          </div>

          <div class="sidebar-sub-menu flex-col gap-2xs">
            <div class="sidebar-project-item">
              <div class="flex items-center justify-between font-size-13 py-2xs px-xs cursor-pointer">
                <div class="flex items-center gap-xs">
                  <span class="project-square-icon bg-blue"></span>
                  <span>Tuesday™</span>
                </div>
                <span class="material-symbols-outlined icon-2xs">expand_less</span>
              </div>
              <div class="project-months flex-col gap-3xs pl-md">
                <div class="month-link flex justify-between"><span>January</span> <span class="sidebar-badge-xs">12</span></div>
                <div class="month-link flex justify-between"><span>February</span> <span class="sidebar-badge-xs">23</span></div>
                <div class="month-link flex justify-between"><span>March</span> <span class="sidebar-badge-xs">23</span></div>
                <div class="month-link flex justify-between"><span>April</span> <span class="sidebar-badge-xs">99</span></div>
              </div>
            </div>

            <div class="sidebar-project-item flex items-center gap-xs py-2xs px-xs cursor-pointer font-size-13">
              <span class="project-square-icon bg-purple"></span>
              <span>Jammio™</span>
            </div>

            <div class="sidebar-project-item flex items-center gap-xs py-2xs px-xs cursor-pointer font-size-13">
              <span class="project-square-icon bg-green"></span>
              <span>Create™ AI</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Upgrade Card -->
      <div class="sidebar-pro-card mt-auto">
        <div class="pro-card-preview-thumb"></div>
        <button class="btn-pro-upgrade" id="btn-upgrade-pro">Upgrade Plan</button>
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

  const addTaskBtn = document.getElementById('btn-add-task-sidebar');
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const event = new CustomEvent('open-new-task-modal');
      window.dispatchEvent(event);
    });
  }

  const themeRailBtn = document.getElementById('theme-toggle-rail');
  if (themeRailBtn) {
    themeRailBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('todoin_theme', next);
      document.documentElement.setAttribute('data-theme', next);
    });
  }

  const upgradeBtn = document.getElementById('btn-upgrade-pro');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      alert('⚡ Upgrade Plan: Starline™ AI Unlimited Features Unlocked!');
    });
  }
}

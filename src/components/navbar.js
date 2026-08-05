export function renderNavbar(options = {}) {
  const { isLanding = false } = options;

  if (isLanding) {
    return `
      <nav class="nav-top" id="navbar">
        <div class="container flex items-center justify-between" style="height:100%">
          <div class="flex items-center gap-gutter">
            <a href="#/" class="font-headline" style="font-size:24px;font-weight:800;color:var(--primary);text-decoration:none;letter-spacing:-0.02em">
              Starline™ AI
            </a>
          </div>
          <div class="flex items-center gap-sm">
            <button class="btn btn-secondary hide-mobile" onclick="location.hash='#/login'">Login</button>
            <button class="btn btn-primary" onclick="location.hash='#/register'">Mulai Sekarang</button>
          </div>
        </div>
      </nav>
    `;
  }

  return `
    <nav class="nav-top starline-topbar" id="navbar">
      <div class="nav-content flex items-center justify-between">
        <!-- Left: Breadcrumb Navigation -->
        <div class="flex items-center gap-xs">
          <button class="btn-icon show-mobile" id="sidebar-toggle" aria-label="Menu">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <div class="breadcrumbs flex items-center gap-xs font-size-13">
            <span class="text-muted cursor-pointer" onclick="location.hash='#/projects'">Tasks</span>
            <span class="text-muted">/</span>
            <div class="flex items-center gap-2xs font-weight-600 text-dark">
              <span>📁</span>
              <span>Product Sprints</span>
              <span class="material-symbols-outlined icon-2xs text-muted">more_horiz</span>
            </div>
          </div>
        </div>

        <!-- Right: Actions Header -->
        <div class="flex items-center gap-xs">
          <div class="avatar-stack-gradient">
            <span class="gradient-avatar avatar-1"></span>
            <span class="gradient-avatar avatar-2"></span>
            <span class="gradient-avatar avatar-3"></span>
            <span class="gradient-avatar avatar-4"></span>
          </div>

          <button class="btn-topbar-icon" title="Grid Layout">
            <span class="material-symbols-outlined icon-xs">space_dashboard</span>
          </button>
          <button class="btn-topbar-icon" title="View Options">
            <span class="material-symbols-outlined icon-xs">tune</span>
          </button>

          <div class="topbar-search-btn flex items-center gap-2xs cursor-pointer">
            <span class="material-symbols-outlined icon-xs text-muted">search</span>
            <span class="font-size-13 text-muted">Search</span>
          </div>

          <button class="btn btn-black-pill flex items-center gap-2xs" id="btn-add-top">
            <span class="material-symbols-outlined icon-xs">add</span>
            <span>Add</span>
          </button>
        </div>
      </div>
    </nav>
  `;
}

export function attachNavbarEvents() {
  const addBtn = document.getElementById('btn-add-top');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const event = new CustomEvent('open-new-task-modal');
      window.dispatchEvent(event);
    });
  }

  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('open');
      document.querySelector('.sidebar-overlay')?.classList.toggle('open');
    });
  }
}

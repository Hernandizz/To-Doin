// To-Doin — Top Navigation Bar
import { getToken } from '../api.js';
import { navigate } from '../router.js';
import { getState } from '../store.js';

export function renderNavbar(options = {}) {
  const { isLanding = false } = options;
  const isLoggedIn = !!getToken();
  const user = getState().user;

  const initials = user ? (user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase() : '';

  return `
    <nav class="nav-top" id="navbar">
      <div class="container flex items-center justify-between" style="height:100%">
        <div class="flex items-center gap-gutter">
          <a href="#/" class="font-headline" style="font-size:24px;font-weight:800;color:var(--primary);text-decoration:none;letter-spacing:-0.02em">
            To-Doin
          </a>
          ${isLanding ? `
            <div class="flex items-center gap-gutter hide-mobile" style="margin-left:16px">
              <a href="#layanan" class="nav-link">Layanan</a>
              <a href="#fitur" class="nav-link">Fitur</a>
              <a href="#testimoni" class="nav-link">Testimoni</a>
              <a href="#tentang" class="nav-link">Tentang Kami</a>
            </div>
          ` : ''}
        </div>
        <div class="flex items-center gap-sm">
          ${isLoggedIn ? `
            <button class="btn-ghost show-mobile" id="sidebar-toggle" aria-label="Menu">
              <span class="material-symbols-outlined">menu</span>
            </button>
            <div class="hide-mobile flex items-center gap-sm">
              <button class="btn-ghost" id="theme-toggle-btn" title="Ganti tema" aria-label="Toggle theme">
                <span class="material-symbols-outlined" id="theme-icon">dark_mode</span>
              </button>
              <div class="avatar flex items-center justify-center" style="background:var(--primary);color:var(--on-primary);font-weight:600;font-size:14px;cursor:pointer" id="user-menu-btn">
                ${initials}
              </div>
            </div>
          ` : `
            <button class="btn btn-secondary hide-mobile" onclick="location.hash='#/login'">Login</button>
            <button class="btn btn-primary" onclick="location.hash='#/register'">Mulai Sekarang</button>
          `}
        </div>
      </div>
    </nav>
  `;
}

export function attachNavbarEvents() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('todoin_theme', next);
      document.documentElement.setAttribute('data-theme', next);
      const icon = document.getElementById('theme-icon');
      if (icon) icon.textContent = next === 'dark' ? 'light_mode' : 'dark_mode';
    });
    // Set initial icon
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }

  const userMenuBtn = document.getElementById('user-menu-btn');
  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', () => navigate('/settings'));
  }

  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('open');
      document.querySelector('.sidebar-overlay')?.classList.toggle('open');
    });
  }
}

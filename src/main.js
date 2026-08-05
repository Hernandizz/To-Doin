import { renderLanding } from './pages/landing.js';
import { renderAuth } from './pages/auth.js';
import { renderInbox } from './pages/inbox.js';
import { renderCalendar } from './pages/calendar.js';
import { renderProjects } from './pages/projects.js';
import { renderSettings } from './pages/settings.js';

import { startRouter, defineRoute, navigate } from './router.js';
import { applyTheme, setState, getState } from './store.js';
import { auth, tasks, projects, getToken, onUnauthorized } from './api.js';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';

const appEl = document.getElementById('app');

// Redirect to login if unauthorized api call happens
onUnauthorized(() => {
  navigate('/login');
});

// Helper to initialize app state
async function initAppState() {
  try {
    const [user, userTasks, userProjects] = await Promise.all([
      auth.me(),
      tasks.list(),
      projects.list()
    ]);
    setState({ user, tasks: userTasks, projects: userProjects });
    return true;
  } catch (err) {
    console.error('Failed to init state:', err);
    return false;
  }
}

// Global layout wrapper for app pages
function appLayout(contentHtml) {
  return `
    <div class="flex flex-col min-h-screen">
      ${renderNavbar()}
      <div class="app-layout">
        ${contentHtml}
      </div>
    </div>
  `;
}

// Routes Definition
defineRoute('/', (path) => {
  if (getToken()) {
    navigate('/projects');
  } else {
    appEl.innerHTML = renderNavbar({ isLanding: true }) + renderLanding();
    attachNavbarEvents();
  }
});

defineRoute('/login', () => {
  if (getToken()) return navigate('/projects');
  appEl.innerHTML = renderAuth(false);
});

defineRoute('/register', () => {
  if (getToken()) return navigate('/projects');
  appEl.innerHTML = renderAuth(true);
});

defineRoute('/inbox', async () => {
  if (!getToken()) return navigate('/login');
  if (!getState().user) await initAppState();
  
  renderProjects(appEl, appLayout);
});

defineRoute('/today', async () => {
  if (!getToken()) return navigate('/login');
  if (!getState().user) await initAppState();
  
  renderInbox(appEl, appLayout, { view: 'today' });
});

defineRoute('/upcoming', async () => {
  if (!getToken()) return navigate('/login');
  if (!getState().user) await initAppState();
  
  renderInbox(appEl, appLayout, { view: 'upcoming' });
});

defineRoute('/calendar', async () => {
  if (!getToken()) return navigate('/login');
  if (!getState().user) await initAppState();
  
  renderCalendar(appEl, appLayout);
});

defineRoute('/project/:id', async (path) => {
  if (!getToken()) return navigate('/login');
  if (!getState().user) await initAppState();
  
  const projectId = parseInt(path.split('/')[2]);
  renderInbox(appEl, appLayout, { view: 'project', projectId });
});

defineRoute('/projects', async () => {
  if (!getToken()) return navigate('/login');
  if (!getState().user) await initAppState();
  
  renderProjects(appEl, appLayout);
});

defineRoute('/settings', async () => {
  if (!getToken()) return navigate('/login');
  if (!getState().user) await initAppState();
  
  renderSettings(appEl, appLayout);
});

// App Startup
applyTheme();
startRouter();

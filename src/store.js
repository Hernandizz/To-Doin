// To-Doin — Client-side State Store
// Caches API data in memory and provides reactive-ish helpers.

let state = {
  user: null,
  tasks: [],
  projects: [],
  isLoading: false,
};

const listeners = new Set();

export function getState() {
  return state;
}

export function setState(partial) {
  state = { ...state, ...partial };
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// --- Derived helpers ---
export function getTasksByStatus(tasks) {
  const groups = { backlog: [], on_progress: [], in_review: [], done: [] };
  tasks.forEach((t) => {
    let status = t.status || (t.completed ? 'done' : 'backlog');
    if (!groups[status]) groups[status] = [];
    groups[status].push(t);
  });
  return groups;
}

export function getTasksByPriority(tasks) {
  const groups = { urgent: [], important: [], normal: [] };
  tasks.forEach((t) => {
    groups[t.priority] = groups[t.priority] || [];
    groups[t.priority].push(t);
  });
  return groups;
}

export function getTodayTasks(tasks) {
  const today = new Date().toISOString().split('T')[0];
  return tasks.filter((t) => t.dueDate === today);
}

export function getOverdueTasks(tasks) {
  const today = new Date().toISOString().split('T')[0];
  return tasks.filter((t) => t.dueDate && t.dueDate < today && !t.completed);
}

export function getUpcomingTasks(tasks) {
  const today = new Date().toISOString().split('T')[0];
  return tasks.filter((t) => t.dueDate && t.dueDate > today);
}

export function getInboxTasks(tasks) {
  return tasks.filter((t) => !t.completed);
}

export function getTasksForDate(tasks, dateStr) {
  return tasks.filter((t) => t.dueDate === dateStr);
}

export function getProjectById(id) {
  return state.projects.find((p) => p.id === parseInt(id));
}

// --- Theme ---
export function getTheme() {
  const saved = localStorage.getItem('todoin_theme') || 'system';
  if (saved === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return saved;
}

export function setTheme(theme) {
  localStorage.setItem('todoin_theme', theme);
  applyTheme();
}

export function applyTheme() {
  const resolved = getTheme();
  document.documentElement.setAttribute('data-theme', resolved);
}

// --- Toast ---
export function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  const iconMap = { success: 'check_circle', error: 'error', info: 'info' };
  toast.innerHTML = `<span class="material-symbols-outlined icon-sm">${iconMap[type] || 'info'}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

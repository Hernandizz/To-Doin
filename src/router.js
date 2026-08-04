// To-Doin — Lightweight Hash Router

const routes = {};
let currentPath = '';
let onNavigate = null;

export function defineRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentPath() {
  return currentPath;
}

export function onRouteChange(callback) {
  onNavigate = callback;
}

export function startRouter() {
  function handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    currentPath = hash;

    // Find matching route
    const handler = routes[hash] || routes['/404'] || routes['/'];
    if (handler) {
      handler(hash);
    }
    if (onNavigate) {
      onNavigate(hash);
    }
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Initial route
}

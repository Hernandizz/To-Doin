// To-Doin — API Client
// Thin wrapper over fetch with JWT auth header injection.

const BASE = '/api';

let authToken = localStorage.getItem('todoin_token');
let onAuthError = null;

export function setToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('todoin_token', token);
  } else {
    localStorage.removeItem('todoin_token');
  }
}

export function getToken() {
  return authToken;
}

export function onUnauthorized(callback) {
  onAuthError = callback;
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    setToken(null);
    if (onAuthError) onAuthError();
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  // Check if response is PDF (binary)
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/pdf')) {
    return res.blob();
  }

  return res.json();
}

// Auth
export const auth = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
};

// Tasks
export const tasks = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/tasks${qs ? '?' + qs : ''}`);
  },
  get: (id) => request(`/tasks/${id}`),
  create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggle: (id) => request(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};

// Projects
export const projects = {
  list: () => request('/projects'),
  create: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
};

// PDF
export const pdf = {
  export: (data) => request('/pdf/export', { method: 'POST', body: JSON.stringify(data) }),
};

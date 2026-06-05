const API_BASE = import.meta.env.VITE_API_URL || '';

function getHeaders(includeAuth = false) {
  const headers = {};
  if (includeAuth) {
    const token = localStorage.getItem('adminToken');
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = res.status;
    throw error;
  }
  return data;
}

export function imageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}

export async function verifyPassword(password) {
  const res = await fetch(`${API_BASE}/api/verify-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return handleResponse(res);
}

export async function fetchMemories() {
  const res = await fetch(`${API_BASE}/api/memories`);
  return handleResponse(res);
}

export async function fetchMessage() {
  const res = await fetch(`${API_BASE}/api/message`);
  return handleResponse(res);
}

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function createMemory(formData) {
  const res = await fetch(`${API_BASE}/api/admin/memory`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  return handleResponse(res);
}

export async function updateMemory(id, formData) {
  const res = await fetch(`${API_BASE}/api/admin/memory/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: formData,
  });
  return handleResponse(res);
}

export async function deleteMemory(id) {
  const res = await fetch(`${API_BASE}/api/admin/memory/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  return handleResponse(res);
}

export async function reorderMemories(items) {
  const res = await fetch(`${API_BASE}/api/admin/memory/reorder`, {
    method: 'PUT',
    headers: {
      ...getHeaders(true),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });
  return handleResponse(res);
}

export async function updateWebsitePassword(password) {
  const res = await fetch(`${API_BASE}/api/admin/password`, {
    method: 'PUT',
    headers: {
      ...getHeaders(true),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });
  return handleResponse(res);
}

export async function updateMessage({ heading, message, thanksMessage }) {
  const res = await fetch(`${API_BASE}/api/admin/message`, {
    method: 'PUT',
    headers: {
      ...getHeaders(true),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ heading, message, thanksMessage }),
  });
  return handleResponse(res);
}

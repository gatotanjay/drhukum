/**
 * Helper fetch untuk semua komunikasi dengan API admin panel.
 * Semua request pakai credentials:'include' supaya session cookie ikut terkirim.
 */

const API_BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || `Request gagal (${response.status})`);
  }
  return data;
}

export const adminApi = {
  checkSession: () => request('/admin/session.php'),

  login: (username, password) =>
    request('/admin/login.php', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () => request('/admin/logout.php', { method: 'POST' }),

  listPosts: () => request('/admin/posts.php'),

  getPost: (id) => request(`/admin/posts.php?id=${id}`),

  savePost: (payload) =>
    request('/admin/posts.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  deletePost: (id) =>
    request('/admin/posts.php', {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id }),
    }),

  uploadThumbnail: (file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    return request('/admin/upload-thumbnail.php', {
      method: 'POST',
      body: formData,
    });
  },
};

export const publicApi = {
  getPosts: (type, locale, featuredOnly = false) =>
    request(`/posts.php?type=${type}&locale=${locale}${featuredOnly ? '&featured=1' : ''}`),

  getPost: (id, locale) => request(`/posts.php?id=${id}&locale=${locale}`),
};

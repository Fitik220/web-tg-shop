const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

async function request(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  register: (payload) => request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  login: (payload) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getMe: () => request('/api/auth/me'),
  getProducts: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')),
    ).toString();
    return request(`/api/products${query ? `?${query}` : ''}`);
  },
  getProduct: (id) => request(`/api/products/${id}`),
  getCategories: () => request('/api/categories'),
  likeProduct: (id) => request(`/api/products/${id}/like`, { method: 'POST' }),
  unlikeProduct: (id) => request(`/api/products/${id}/like`, { method: 'DELETE' }),
  getLikedProducts: () => request('/api/users/me/likes'),
  createOrder: (payload) => request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getMyOrders: () => request('/api/orders/my'),
  getOrder: (id) => request(`/api/orders/${id}`),
  getAdminStats: () => request('/api/admin/stats'),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
};

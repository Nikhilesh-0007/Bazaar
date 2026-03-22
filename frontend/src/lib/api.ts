const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// Auth
export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request('/auth/me'),
    googleUrl: () => `${BASE}/auth/google`,
  },
  products: {
    list: (params: Record<string, string> = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/products${qs ? '?' + qs : ''}`);
    },
    get: (id: string) => request(`/products/${id}`),
    categories: () => request('/products/categories'),
    create: (body: any) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    remove: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),
  },
  orders: {
    create: (body: any) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
    mine: () => request('/orders/me'),
    get: (id: string) => request(`/orders/${id}`),
    all: (page = 1) => request(`/orders/admin?page=${page}`),
    updateStatus: (id: string, status: string) =>
      request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    analytics: () => request('/orders/analytics'),
  },
  payments: {
    createOrder: (amount: number) =>
      request('/payments/create-order', { method: 'POST', body: JSON.stringify({ amount }) }),
    verify: (body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
      request('/payments/verify', { method: 'POST', body: JSON.stringify(body) }),
  },
};

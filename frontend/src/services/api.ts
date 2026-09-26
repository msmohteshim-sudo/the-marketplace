const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('mp_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
};

export const api = {
  get: (path: string) =>
    fetch(`${API_BASE}${path}`, { headers: getHeaders() }).then(handleResponse),

  post: (path: string, data?: any) =>
    fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  put: (path: string, data?: any) =>
    fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  delete: (path: string) =>
    fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse)
};

// ─── Auth API ───
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  sendRegistrationOTP: (email: string, phone?: string, countryCode?: string) => api.post('/auth/send-registration-otp', { email, phone, countryCode }),
  verifyRegistrationOTP: (email: string, code: string) => api.post('/auth/verify-registration-otp', { email, code }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me'),
  switchMode: (mode: string, workType?: string) => api.post('/auth/switch-mode', { mode, workType }),
  updatePreferences: (data: any) => api.post('/auth/preferences', data),
  updateProfileDetails: (data: any) => api.post('/auth/profile-details', data)
};

// ─── Profile API ───
export const profileApi = {
  getMe: () => api.get('/profiles/me'),
  update: (data: any) => api.put('/profiles/me', data),
  sendPhoneOTP: (phone: string, countryCode?: string) => api.post('/profiles/phone/send-otp', { phone, countryCode }),
  verifyPhoneOTP: (phone: string, otp: string) => api.post('/profiles/phone/verify-otp', { phone, otp }),
  pincodeLookup: (pincode: string) => api.get(`/profiles/pincode-lookup?pincode=${encodeURIComponent(pincode)}`),
  uploadResume: (data: { resumeUrl?: string; resumeName: string; rawText?: string }) => api.post('/profiles/resume', data),
  deleteResume: () => api.delete('/profiles/resume'),
  parseResume: (text: string, fileName?: string) => api.post('/profiles/resume/parse', { text, fileName }),
  getPublic: (id: string) => api.get(`/profiles/${id}`)
};

// ─── Services API ───
export const servicesApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/services${qs}`);
  },
  getOne: (id: string) => api.get(`/services/${id}`),
  getMy: () => api.get('/services/my'),
  create: (data: any) => api.post('/services', data),
  update: (id: string, data: any) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`)
};

// ─── Jobs API ───
export const jobsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/jobs${qs}`);
  },
  getOne: (id: string) => api.get(`/jobs/${id}`),
  getMy: () => api.get('/jobs/my'),
  getMyApplications: () => api.get('/jobs/my-applications'),
  create: (data: any) => api.post('/jobs', data),
  update: (id: string, data: any) => api.put(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
  apply: (id: string, data: any) => api.post(`/jobs/${id}/apply`, data),
  getApplications: (id: string) => api.get(`/jobs/${id}/applications`)
};

// ─── Ideas API ───
export const ideasApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/ideas${qs}`);
  },
  getOne: (id: string) => api.get(`/ideas/${id}`),
  getMy: () => api.get('/ideas/my'),
  create: (data: any) => api.post('/ideas', data),
  update: (id: string, data: any) => api.put(`/ideas/${id}`, data),
  license: (id: string, data: any) => api.post(`/ideas/${id}/license`, data)
};

// ─── Courses API ───
export const coursesApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/courses${qs}`);
  },
  getOne: (id: string) => api.get(`/courses/${id}`),
  getMy: () => api.get('/courses/my'),
  create: (data: any) => api.post('/courses', data),
  enroll: (id: string) => api.post(`/courses/${id}/enroll`),
  updateProgress: (id: string, progress: number) => api.put(`/courses/${id}/progress`, { progress })
};

// ─── Notifications API ───
export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all')
};

// ─── Messages API ───
export const messagesApi = {
  getConversations: () => api.get('/messages'),
  getConversation: (partnerId: string) => api.get(`/messages/${partnerId}`),
  send: (data: any) => api.post('/messages', data)
};

// ─── Search API ───
export const searchApi = {
  search: (q: string, type?: string) => {
    const params: Record<string, string> = { q };
    if (type) params.type = type;
    const qs = '?' + new URLSearchParams(params).toString();
    return api.get(`/search${qs}`);
  }
};

// ─── Saved API ───
export const savedApi = {
  getAll: () => api.get('/saved'),
  save: (entityType: string, entityId: string) => api.post('/saved', { entityType, entityId }),
  unsave: (entityType: string, entityId: string) => api.delete(`/saved/${entityType}/${entityId}`)
};

// ─── Client Digital Dashboard API ───
export const clientDigitalApi = {
  getSummary: () => api.get('/client/digital/summary'),
  getQuickServices: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/client/digital/quick-services${qs}`);
  },
  getProjects: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/client/digital/projects${qs}`);
  },
  getIdeas: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/client/digital/ideas${qs}`);
  },
  getPurchasedIdeas: () => api.get('/client/digital/purchased-ideas'),
  getRecommendations: () => api.get('/client/digital/recommendations'),
  postDigitalJob: (data: any) => api.post('/client/digital/jobs', data)
};

// ─── Admin API ───
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  getReports: () => api.get('/admin/reports')
};

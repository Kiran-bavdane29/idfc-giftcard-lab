import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('idfc_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  // NOTE: admins can be spoofed by adding `x-admin: true` — see VULNERABILITIES.md #8
  return cfg;
});

export default api;

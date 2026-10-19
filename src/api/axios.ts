import axios from 'axios';

// in production this comes from the VITE_API_URL setting on Vercel
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// this is if the access token ran out, swap it using the refresh token and retry once
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const refresh = localStorage.getItem('refresh');
    const isAuthCall =
      original?.url?.includes('/auth/login/') || original?.url?.includes('/auth/refresh/');

    if (error.response?.status === 401 && refresh && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const res = await axios.post(`${API_URL}/auth/refresh/`, { refresh });
        localStorage.setItem('token', res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        //and if refresh token is dead too, so send them to log in again
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
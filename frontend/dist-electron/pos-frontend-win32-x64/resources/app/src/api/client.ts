import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { useSessionStore } from '../store/sessionStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface server messages in a consistent shape
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(error);
  },
);

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useSessionStore.getState().token;
  if (token) {
    // Ensure headers object exists and assign Authorization safely to satisfy
    // Axios types (AxiosHeaders introduced stricter typings in newer axios).
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;


import axios from 'axios';
import { API_BASE_URL } from './config.js';
import { secureStorage } from './secureStorage.js';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

let _onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  _onUnauthorized = fn;
}

httpClient.interceptors.request.use(async (config) => {
  const token = await secureStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await secureStorage.deleteToken();
      if (_onUnauthorized) _onUnauthorized();
    }
    return Promise.reject(error);
  }
);


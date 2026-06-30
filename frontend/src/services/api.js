import axios from 'axios';
import { handleMockRequest } from './mockDb.js';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const originalAdapter = api.defaults.adapter || axios.defaults.adapter;

api.defaults.adapter = async (config) => {
  const token = localStorage.getItem('token');
  const isDemoUser = token && token.startsWith('demo-token-');
  
  let isDemoLogin = false;
  if (config.url === '/auth/login' && config.data) {
    try {
      const parsedData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      isDemoLogin = parsedData.email === 'candidate@demo.com' ||
                    parsedData.email === 'company@demo.com' ||
                    parsedData.email === 'admin@main.com';
    } catch (e) {}
  }

  let isDemoRegister = false;
  if (config.url === '/auth/register' && config.data) {
    try {
      const parsedData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      isDemoRegister = parsedData.email?.includes('demo') || localStorage.getItem('use_mock_backend') === 'true';
    } catch (e) {}
  }
  
  if (isDemoUser || isDemoLogin || isDemoRegister || localStorage.getItem('use_mock_backend') === 'true') {
    try {
      const mockResult = await handleMockRequest(config);
      return {
        data: mockResult.data,
        status: mockResult.status || 200,
        statusText: mockResult.statusText || 'OK',
        headers: config.headers,
        config: config
      };
    } catch (err) {
      const axiosError = new Error(err.message || 'Mock Request Failed');
      axiosError.response = {
        data: { message: err.message || 'Mock request failed' },
        status: err.status || 400,
        statusText: 'Bad Request',
        headers: config.headers,
        config: config
      };
      throw axiosError;
    }
  }

  try {
    return await originalAdapter(config);
  } catch (error) {
    const isNetworkError = error.message?.includes('Network Error') || error.code === 'ERR_NETWORK' || !error.response;
    if (isNetworkError) {
      console.warn('[Network Error] Backend seems offline. Falling back to Mock local database!');
      localStorage.setItem('use_mock_backend', 'true');
      try {
        const mockResult = await handleMockRequest(config);
        return {
          data: mockResult.data,
          status: mockResult.status || 200,
          statusText: 'OK',
          headers: config.headers,
          config: config
        };
      } catch (err) {
        const axiosError = new Error(err.message || 'Mock Request Failed');
        axiosError.response = {
          data: { message: err.message || 'Mock request failed' },
          status: err.status || 400,
          statusText: 'Bad Request',
          headers: config.headers,
          config: config
        };
        throw axiosError;
      }
    }
    throw error;
  }
};


// Interceptor to add JWT token to every request header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to intercept 401s, attempt silent access token refresh, or log out if refresh token fails
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Attempt refresh
          const res = await axios.post('http://localhost:5000/api/auth/refresh', { token: refreshToken });
          if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            originalRequest.headers['Authorization'] = `Bearer ${res.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshErr) {
        console.error('Session expired, logging out...', refreshErr.message);
        localStorage.clear();
        // Redirect to login safely
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

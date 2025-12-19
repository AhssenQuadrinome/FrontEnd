import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const getApiBaseUrl = () => {
  // For local development (when accessing via localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080';
  }
  
  // For production (when accessing via ALB or any other domain)
  return 'http://ourbusway-alb-1436595524.us-east-1.elb.amazonaws.com';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle 401 Unauthorized - Token expired or invalid
      // But don't redirect if it's a login attempt
      if (error.response.status === 401) {
        const isLoginRequest = error.config?.url?.includes('/login');
        if (!isLoginRequest) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          window.location.href = '/login';
        }
      }

      // Handle 403 Forbidden - Insufficient permissions
      // Log for debugging but let the calling code handle the error
      if (error.response.status === 403) {
        const errorData: any = error.response.data;
        const message = errorData?.message || 'Access denied';
        console.error('Access denied:', message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

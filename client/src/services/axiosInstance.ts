import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Remove withCredentials since we're using Authorization header
});

// Request interceptor to add token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove it
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        // Optionally redirect to login
        if (window.location.pathname !== '/auth' && window.location.pathname !== '/') {
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

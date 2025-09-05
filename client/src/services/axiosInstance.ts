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
        // Only redirect on explicit auth failures, not during normal user fetching
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.startsWith('/auth') || currentPath === '/';
        
        // Don't redirect if we're already on an auth page or landing page
        if (!isAuthPage) {
          // Use router instead of window.location for smoother navigation
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

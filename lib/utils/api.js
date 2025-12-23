/**
 * API utility functions
 *
 * Centralized API client using axios for making HTTP requests to the backend.
 * Handles authentication tokens, error handling, and request/response interceptors.
 */

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "An error occurred";
      const status = error.response.status;

      // Handle 401 Unauthorized - clear token and redirect to login
      // Note: Using window.location only as fallback since we can't use Next.js router here
      // Components should handle 401 errors and redirect using router.push
      if (status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        // Only redirect if not already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      const apiError = new Error(message);
      apiError.status = status;
      apiError.data = error.response.data;
      throw apiError;
    } else if (error.request) {
      // Request made but no response received
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      throw new Error(error.message || "An error occurred");
    }
  }
);

export const api = {
  get: (endpoint, config = {}) => apiClient.get(endpoint, config),
  post: (endpoint, data, config = {}) => apiClient.post(endpoint, data, config),
  put: (endpoint, data, config = {}) => apiClient.put(endpoint, data, config),
  patch: (endpoint, data, config = {}) =>
    apiClient.patch(endpoint, data, config),
  delete: (endpoint, config = {}) => apiClient.delete(endpoint, config),
};

export default api;

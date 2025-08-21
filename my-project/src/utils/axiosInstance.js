// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,   // ✅ send cookies automatically
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // ❌ remove this localStorage token logic
    // because backend uses cookies not Authorization headers
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (optional: auto-logout on 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized, redirecting to login...");
      // don't clear localStorage since we're not using it anymore
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

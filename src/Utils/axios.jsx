import axios from "axios";
import { getAccessToken, clearSession } from "./auth-utils";

const instance = axios.create({
  baseURL: "https://csmbsckend.onrender.com/api",
  withCredentials: true, // IMPORTANT for session/cookies
  headers: {
    Accept: "application/json",
  },
});

// Attach token dynamically (AFTER login)
instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 Unauthenticated
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearSession();
      // Optionally redirect to login page if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;

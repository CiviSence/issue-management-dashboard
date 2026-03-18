import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setSession,
  clearSession,
} from "./auth-utils";

const instance = axios.create({
  baseURL: "https://csmbackend.onrender.com/api",
  withCredentials: true, // IMPORTANT for session/cookies
  headers: {
    Accept: "application/json",
  },
});

// Attach token dynamically (AFTER login) prevent logout
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

// Refresh token logic
// If we get a 401, try to refresh the token and retry the failed requests
// finaly fixed instant logut automatically
// Queues concurrent requests to prevent multiple refresh calls

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // List of endpoints that should NOT trigger a refresh
    const skipRefresh = [
      "/auth/login",
      "/auth/signup",
      "/auth/refresh",
      "/auth/verify-email",
      "/auth/logout",
      "/auth/logout-all",
    ];
    const isSkipRoute = skipRefresh.some((route) =>
      originalRequest.url.includes(route),
    );

    // Only attempt refresh on 401, and only once per request (_retry flag)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isSkipRoute
    ) {
      // If a refresh is already in flight, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearSession();
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await instance.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        // Persist the new tokens (user object is typically not returned here, use null or cached data)
        // Backend returns access_token and usually refresh_token if rotated
        setSession(
          data.access_token,
          data.user || null,
          data.refresh_token || refreshToken,
        );

        // Let all queued requests proceed with the new token
        processQueue(null, data.access_token);
        // Retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh failed — real logout
        processQueue(refreshError, null);
        clearSession();
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Trigger verification toast on 403 Forbidden for specific endpoints
    if (error.response?.status === 403) {
      const restrictedEndpoints = ["/issues/", "/comments/", "/votes/"];
      const isRestricted = restrictedEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint),
      );

      if (isRestricted) {
        console.warn("Identity Verification Required to participate.");
        // We'll use a custom event to trigger a toast in the main UI
        window.dispatchEvent(new CustomEvent("verification-required"));
      }
    }

    return Promise.reject(error);
  },
);

export default instance;

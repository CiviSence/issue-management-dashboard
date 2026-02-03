import axios from "axios";

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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default instance;

import axios from "axios";

// Creates the base instance configuration mapping to your Node/Express server
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================================================
// CRUCIAL FIX: ATTACH AUTHENTICATION TOKEN AUTOMATICALLY
// ========================================================
api.interceptors.request.use(
  (config) => {
    // Look up the unique signed JWT token inside your local storage cache
    const token = localStorage.getItem("token");

    // If a token is active, mount it directly onto the Authorization Bearer header structure
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

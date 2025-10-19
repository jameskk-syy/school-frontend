import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const api_key = parsed?.api_key;
        const scret_key = parsed?.api_secret;
        if (api_key && scret_key) {
          config.headers.Authorization = `token ${api_key}:${scret_key}`;
        }
      } catch (err) {
        console.error("Invalid userData in localStorage", err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


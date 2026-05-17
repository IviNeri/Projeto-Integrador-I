import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const AUTH_STORAGE_KEY = "estoque-facil-auth";
const AUTH_HEADER = "Authorization";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedAuth) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedAuth);
    return parsed?.token || null;
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers[AUTH_HEADER] = `Bearer ${token}`;
  } else if (config.headers?.[AUTH_HEADER]) {
    delete config.headers[AUTH_HEADER];
  }

  return config;
});

export default api;

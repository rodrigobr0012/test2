import axios from "axios";

const useMocks = (import.meta.env.VITE_USE_MOCKS ?? "true") === "true";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { api, useMocks };

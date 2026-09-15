import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// API HELPER SERVICES
// ==========================================

export const authService = {
  login: (email, password) => API.post("/auth/login", { email, password }),
  register: (data) => API.post("/auth/register", data),
  getMe: () => API.get("/auth/me"),
};

export const driverService = {
  getAll: () => API.get("/drivers"),
  getById: (id) => API.get(`/drivers/${id}`),
  create: (data) => API.post("/drivers", data),
  update: (id, data) => API.put(`/drivers/${id}`, data),
  delete: (id) => API.delete(`/drivers/${id}`),
};

export const deviceService = {
  getAll: () => API.get("/devices"),
  getById: (id) => API.get(`/devices/${id}`),
  register: (data) => API.post("/devices", data),
  delete: (id) => API.delete(`/devices/${id}`),
};

export const alertService = {
  getAll: (unacknowledgedOnly = false) =>
    API.get(`/alerts?unacknowledgedOnly=${unacknowledgedOnly}`),
  acknowledge: (id) => API.put(`/alerts/${id}/ack`),
  create: (data) => API.post("/alerts", data),
};

export const dashboardService = {
  getStats: () => API.get("/dashboard/stats"),
};

export const detectionService = {
  getAll: (limit = 50) => API.get(`/detections?limit=${limit}`),
  getLatest: () => API.get("/detections/latest"),
  create: (data) => API.post("/detections", data),
};

export default API;
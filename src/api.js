/**
 * SUVIDHA API Client
 * Centralised Axios instance + typed service wrappers
 */

import axios from "axios";

// ─── Base instance ─────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("suvidha_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.detail || err.message || "Request failed";
    return Promise.reject(new Error(msg));
  }
);


// ─── Auth ──────────────────────────────────────────────────────────────────

export const authAPI = {
  sendOtp:   (mobile)      => api.post("/auth/send-otp",   { mobile }),
  verifyOtp: (mobile, otp) => api.post("/auth/verify-otp", { mobile, otp }),
  logout:    ()            => api.post("/auth/logout"),
};


// ─── Electricity ───────────────────────────────────────────────────────────

export const electricityAPI = {
  getBill:         (consumerNo)  => api.get(`/electricity/bill/${consumerNo}`),
  payBill:         (payload)     => api.post("/electricity/bill/pay", payload),
  newConnection:   (payload)     => api.post("/electricity/new-connection", payload),
  lodgeComplaint:  (payload)     => api.post("/electricity/complaint", payload),
  submitMeterRead: (payload)     => api.post("/electricity/meter-reading", payload),
  reportOutage:    (payload)     => api.post("/electricity/outage-report", payload),
  checkStatus:     (referenceNo) => api.get(`/electricity/status/${referenceNo}`),
};


// ─── Gas ───────────────────────────────────────────────────────────────────

export const gasAPI = {
  getBill:        (consumerNo)  => api.get(`/gas/bill/${consumerNo}`),
  bookCylinder:   (payload)     => api.post("/gas/cylinder/book", payload),
  payBill:        (payload)     => api.post("/gas/bill/pay", payload),
  newConnection:  (payload)     => api.post("/gas/new-connection", payload),
  lodgeComplaint: (payload)     => api.post("/gas/complaint", payload),
  checkStatus:    (referenceNo) => api.get(`/gas/status/${referenceNo}`),
};


// ─── Water ─────────────────────────────────────────────────────────────────

export const waterAPI = {
  getBill:        (consumerNo)  => api.get(`/water/bill/${consumerNo}`),
  payBill:        (payload)     => api.post("/water/bill/pay", payload),
  newConnection:  (payload)     => api.post("/water/new-connection", payload),
  lodgeComplaint: (payload)     => api.post("/water/complaint", payload),
  tankerRequest:  (payload)     => api.post("/water/tanker-request", payload),
  sewageRequest:  (payload)     => api.post("/water/sewage-request", payload),
  checkStatus:    (referenceNo) => api.get(`/water/status/${referenceNo}`),
};


// ─── Municipal ─────────────────────────────────────────────────────────────

export const municipalAPI = {
  getPropertyTax:    (propertyNo)  => api.get(`/municipal/property-tax/${propertyNo}`),
  payPropertyTax:    (payload)     => api.post("/municipal/property-tax/pay", payload),
  requestCertificate:(payload)     => api.post("/municipal/certificate/request", payload),
  applyTradeLicense: (payload)     => api.post("/municipal/trade-license/apply", payload),
  lodgeComplaint:    (payload)     => api.post("/municipal/complaint", payload),
  checkStatus:       (referenceNo) => api.get(`/municipal/status/${referenceNo}`),
};


// ─── Admin ─────────────────────────────────────────────────────────────────

export const adminAPI = {
  getDashboard:   () => api.get("/admin/dashboard"),
  getActivityFeed:(limit = 20) => api.get(`/admin/activity-feed?limit=${limit}`),
  getKioskHealth: () => api.get("/admin/kiosk-health"),
  broadcast:      (message) => api.post(`/admin/broadcast?message=${encodeURIComponent(message)}`),
};


export default api;

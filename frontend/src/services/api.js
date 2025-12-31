import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error. response?.data || error.message);
    return Promise.reject(error);
  }
);

// Driver API
export const driverAPI = {
  getAll: (params) => api.get('/drivers', { params }),
  getById: (id) => api.get(`/drivers/${id}`),
  getAvailable: () => api.get('/drivers/available'),
  create: (data) => api.post('/drivers', data),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  delete: (id) => api.delete(`/drivers/${id}`),
};

// Shipment API
export const shipmentAPI = {
  getAll: (params) => api.get('/shipments', { params }),
  getById: (id) => api.get(`/shipments/${id}`),
  create: (data) => api.post('/shipments', data),
  update: (id, data) => api.put(`/shipments/${id}`, data),
  delete: (id) => api.delete(`/shipments/${id}`),
  updateStatus: (id, status) => api.patch(`/shipments/${id}/status`, { status }),
  assignDriver: (id, driverId) => api.patch(`/shipments/${id}/assign-driver`, { driverId }),
  getDashboardMetrics: () => api.get('/shipments/dashboard/metrics'),
};

export default api;
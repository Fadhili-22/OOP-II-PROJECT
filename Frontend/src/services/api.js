import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (formData) => api.post('/auth/login', formData),
};

// Tenant API
export const tenantAPI = {
  getAll: () => api.get('/tenants'),
  getById: (id) => api.get(`/tenants/${id}`),
  create: (tenant) => api.post('/tenants', tenant),
  update: (id, tenant) => api.put(`/tenants/${id}`, tenant),
  delete: (id) => api.delete(`/tenants/${id}`),
  getPayments: (id) => api.get(`/tenants/${id}/payments`),
  getUnpaid: () => api.get('/tenants/unpaid'),
};

// Landlord API
export const landlordAPI = {
  getAll: () => api.get('/landlords'),
  getById: (id) => api.get(`/landlords/${id}`),
  create: (landlord) => api.post('/landlords', landlord),
  update: (id, landlord) => api.put(`/landlords/${id}`, landlord),
  delete: (id) => api.delete(`/landlords/${id}`),
};

// Payment API
export const paymentAPI = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  getByTenant: (tenantId) => api.get(`/payments/tenant/${tenantId}`),
  getByLease: (leaseId) => api.get(`/payments/lease/${leaseId}`),
  getLeasePaymentSummary: (leaseId) => api.get(`/payments/lease/${leaseId}/summary`),
  create: (payment) => api.post('/payments', payment),
  createForLease: (payment) => api.post('/payments/lease', payment),
  delete: (id) => api.delete(`/payments/${id}`),
};

// Lease API
export const leaseAPI = {
  getAll: () => api.get('/leases'),
  getById: (id) => api.get(`/leases/${id}`),
  create: (lease) => api.post('/leases', lease),
  update: (id, lease) => api.put(`/leases/${id}`, lease),
  delete: (id) => api.delete(`/leases/${id}`),
  getLeaseAnalytics: () => api.get('/leases/analytics'),
  getPaymentAnalytics: () => api.get('/leases/payment-analytics'),
};

// Ticket API
export const ticketAPI = {
  getAll: () => api.get('/tickets'),
  getById: (id) => api.get(`/tickets/${id}`),
  getByTenant: (tenantId) => api.get(`/tickets/tenant/${tenantId}`),
  create: (ticket) => api.post('/tickets', ticket),
  delete: (id) => api.delete(`/tickets/${id}`),
  assignStaff: (id, staff) => api.put(`/tickets/${id}/assign?staff=${encodeURIComponent(staff)}`),
  updateStatus: (id, status) => api.put(`/tickets/${id}/status?status=${encodeURIComponent(status)}`),
  addResolution: (id, notes) => api.put(`/tickets/${id}/resolution?notes=${encodeURIComponent(notes)}`),
};

// Payment History API
export const paymentHistoryAPI = {
  getAll: () => api.get('/paymentHistories'),
  getByTenant: (tenantId) => api.get(`/paymentHistories/${tenantId}`),
  create: (paymentHistory) => api.post('/paymentHistories', paymentHistory),
  delete: (tenantId) => api.delete(`/paymentHistories/${tenantId}`),
};

export default api; 
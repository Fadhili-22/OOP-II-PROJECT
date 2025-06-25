import api from './api';

export const tenantService = {
  // Get all tenants
  getAllTenants: async () => {
    try {
      const response = await api.get('/tenants');
      return response.data;
    } catch (error) {
      console.error('Error fetching tenants:', error);
      throw error;
    }
  },

  // Get tenant by ID
  getTenantById: async (id) => {
    try {
      const response = await api.get(`/tenants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tenant:', error);
      throw error;
    }
  },

  // Create new tenant
  createTenant: async (tenantData) => {
    try {
      const response = await api.post('/tenants', tenantData);
      return response.data;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  },

  // Update tenant
  updateTenant: async (id, tenantData) => {
    try {
      const response = await api.put(`/tenants/${id}`, tenantData);
      return response.data;
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  },

  // Delete tenant
  deleteTenant: async (id) => {
    try {
      await api.delete(`/tenants/${id}`);
    } catch (error) {
      console.error('Error deleting tenant:', error);
      throw error;
    }
  },

  // Pay rent
  payRent: async (tenantId, amount) => {
    try {
      const response = await api.post(`/tenants/${tenantId}/pay?amount=${amount}`);
      return response.data;
    } catch (error) {
      console.error('Error paying rent:', error);
      throw error;
    }
  },

  // Get tenant payments
  getTenantPayments: async (tenantId) => {
    try {
      const response = await api.get(`/tenants/${tenantId}/payments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tenant payments:', error);
      throw error;
    }
  },

  // Update contact information
  updateContact: async (id, contactInfo) => {
    try {
      const response = await api.put(`/tenants/${id}/contact`, contactInfo);
      return response.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  // Get unpaid tenants
  getUnpaidTenants: async () => {
    try {
      const response = await api.get('/tenants/unpaid');
      return response.data;
    } catch (error) {
      console.error('Error fetching unpaid tenants:', error);
      throw error;
    }
  }
}; 
import api from './api';

export const ticketService = {
  // Get all tickets
  getAllTickets: async () => {
    try {
      const response = await api.get('/tickets');
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  // Get ticket by ID
  getTicketById: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  },

  // Create new ticket
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // Update existing ticket
  updateTicket: async (id, ticketData) => {
    try {
      const response = await api.put(`/tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  // Delete ticket
  deleteTicket: async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  },

  // Upload ticket with image
  uploadTicket: async (ticketData, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('description', ticketData.description);
      formData.append('urgency', ticketData.urgency || 'Medium');
      formData.append('category', ticketData.category || 'General');
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post('/tickets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading ticket:', error);
      throw error;
    }
  },

  // Assign staff to ticket
  assignStaff: async (ticketId, staffMember) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/assign?staff=${staffMember}`);
      return response.data;
    } catch (error) {
      console.error('Error assigning staff:', error);
      throw error;
    }
  },

  // Update ticket status
  updateStatus: async (ticketId, status) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  },

  // Add resolution notes to ticket
  addResolution: async (ticketId, notes) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/resolution?notes=${encodeURIComponent(notes)}`);
      return response.data;
    } catch (error) {
      console.error('Error adding resolution:', error);
      throw error;
    }
  },

  // Get tickets for specific tenant
  getTicketsByTenant: async (tenantId) => {
    try {
      const allTickets = await this.getAllTickets();
      // Filter tickets by tenant ID (assuming tickets have a tenantId field)
      return allTickets.filter(ticket => ticket.tenantId === tenantId);
    } catch (error) {
      console.error('Error fetching tenant tickets:', error);
      throw error;
    }
  }
}; 
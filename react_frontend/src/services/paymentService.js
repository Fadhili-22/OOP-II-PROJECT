import api from './api';

// Get payment history for tenant
const getPaymentHistory = async (tenantId) => {
  try {
    const response = await api.get(`/tenants/${tenantId}/payments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

export const paymentService = {
  // Get all payments
  getAllPayments: async () => {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  },

  // Create new payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Delete payment
  deletePayment: async (id) => {
    try {
      await api.delete(`/payments/${id}`);
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  },

  // Get payment history for tenant
  getPaymentHistory,

  // Calculate payment summary for tenant
  getPaymentSummary: async (tenantId) => {
    try {
      console.log(`Fetching payment summary for tenant: ${tenantId}`);
      
      // Get payments for this specific tenant using the separate function
      const payments = await getPaymentHistory(tenantId);
      console.log('Payments from API:', payments);
      
      const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalPayments = payments.length;
      
      // Mock calculation for amount due and next payment
      // In a real scenario, this would be calculated based on lease terms
      const monthlyRent = 1200; // This should come from lease data
      const currentDate = new Date();
      const amountDue = monthlyRent; // Simplified calculation
      
      const summary = {
        totalPaid,
        totalPayments,
        amountDue,
        nextPaymentDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
        monthlyRent,
        recentPayments: payments.slice(-5) // Last 5 payments
      };
      
      console.log('Payment summary calculated:', summary);
      return summary;
    } catch (error) {
      console.error('Error calculating payment summary:', error);
      throw error;
    }
  }
}; 
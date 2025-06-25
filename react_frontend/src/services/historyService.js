import { paymentService } from './paymentService';
import { ticketService } from './ticketService';

export const historyService = {
  // Get all activity history for a tenant
  getActivityHistory: async (tenantId) => {
    try {
      console.log(`Fetching activity history for tenant: ${tenantId}`);
      
      // Get payments and tickets in parallel
      const [payments, tickets] = await Promise.all([
        paymentService.getPaymentHistory(tenantId),
        ticketService.getAllTickets()
      ]);

      // Filter tickets by tenant (if tenantId is available)
      const tenantTickets = tickets.filter(ticket => ticket.tenantId === tenantId);

      // Combine and format the history
      const history = [];

      // Add payments to history
      payments.forEach(payment => {
        history.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          title: 'Rent Payment',
          description: `Payment of KES ${payment.amount.toLocaleString()}`,
          amount: payment.amount,
          date: new Date(payment.date),
          status: 'completed',
          icon: 'MonetizationOn'
        });
      });

      // Add tickets to history
      tenantTickets.forEach(ticket => {
        history.push({
          id: `ticket-${ticket.id}`,
          type: 'ticket',
          title: 'Support Ticket',
          description: ticket.title || ticket.description,
          date: new Date(ticket.date || Date.now()),
          status: ticket.status?.toLowerCase() || 'open',
          icon: 'SupportAgent',
          urgency: ticket.urgency
        });
      });

      // Sort by date (newest first)
      history.sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log('Activity history compiled:', history);
      return history;
    } catch (error) {
      console.error('Error fetching activity history:', error);
      throw error;
    }
  },

  // Get payment history only
  getPaymentHistory: async (tenantId) => {
    try {
      return await paymentService.getPaymentHistory(tenantId);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  // Get ticket history only
  getTicketHistory: async (tenantId) => {
    try {
      const tickets = await ticketService.getAllTickets();
      return tickets.filter(ticket => ticket.tenantId === tenantId);
    } catch (error) {
      console.error('Error fetching ticket history:', error);
      throw error;
    }
  }
}; 
package com.tms.TenantManagementSystem.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import com.tms.TenantManagementSystem.Models.Payment;
import com.tms.TenantManagementSystem.Models.Lease;
import com.tms.TenantManagementSystem.Repositories.PaymentRepository;
import com.tms.TenantManagementSystem.Services.LeaseService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private LeaseService leaseService;

    @PostConstruct
    public void initializePaymentIdCounter() {
        // Find the maximum existing payment ID and initialize counter
        List<Payment> allPayments = paymentRepository.findAll();
        int maxId = allPayments.stream()
            .mapToInt(Payment::getPaymentID)
            .max()
            .orElse(0);
        
        Payment.initializeCounter(maxId);
        System.out.println("Initialized Payment ID counter to start from: " + (maxId + 1));
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByTenantId(int tenantId) {
        return paymentRepository.findAll().stream()
            .filter(payment -> payment.getTenantId() == tenantId)
            .collect(Collectors.toList());
    }

    public List<Payment> getPaymentsByLeaseId(String leaseId) {
        return paymentRepository.findAll().stream()
            .filter(payment -> leaseId.equals(payment.getLeaseId()))
            .collect(Collectors.toList());
    }

    public Payment getPaymentById(int id) {
        return paymentRepository.findById(id).orElse(null);
    }

    public Payment createPayment(Payment payment) {
        // Save the payment first
        Payment savedPayment = paymentRepository.save(payment);
        
        // If payment is linked to a lease, update the lease's total paid amount
        if (payment.getLeaseId() != null) {
            updateLeaseBalance(payment.getLeaseId(), payment.getAmount());
        }
        
        return savedPayment;
    }

    public Payment createPaymentForLease(int tenantId, String leaseId, double amount, String description) {
        // Verify the lease exists and belongs to the tenant
        Lease lease = leaseService.getLeaseById(leaseId);
        if (lease == null) {
            throw new RuntimeException("Lease not found");
        }
        if (lease.getTenantId() != tenantId) {
            throw new RuntimeException("Lease does not belong to this tenant");
        }
        
        // Create payment linked to the lease
        Payment payment = new Payment(tenantId, leaseId, amount, description);
        return createPayment(payment);
    }

    private void updateLeaseBalance(String leaseId, double paymentAmount) {
        Lease lease = leaseService.getLeaseById(leaseId);
        if (lease != null) {
            lease.addPayment(paymentAmount);
            leaseService.updateLease(lease.getLeaseId(), lease);
        }
    }

    public void deletePayment(int id) {
        // Get payment before deleting to update lease balance
        Payment payment = getPaymentById(id);
        if (payment != null && payment.getLeaseId() != null) {
            // Subtract payment amount from lease
            Lease lease = leaseService.getLeaseById(payment.getLeaseId());
            if (lease != null) {
                lease.setTotalPaid(lease.getTotalPaid() - payment.getAmount());
                leaseService.updateLease(lease.getLeaseId(), lease);
            }
        }
        
        paymentRepository.deleteById(id);
    }

    // Get lease payment summary for a specific lease
    public LeasePaymentSummary getLeasePaymentSummary(String leaseId) {
        Lease lease = leaseService.getLeaseById(leaseId);
        if (lease == null) return null;
        
        List<Payment> payments = getPaymentsByLeaseId(leaseId);
        
        return new LeasePaymentSummary(
            lease.getLeaseId(),
            lease.getRentAmount(),
            lease.getTotalPaid(),
            lease.getBalance(),
            lease.getPaymentProgress(),
            lease.isFullyPaid(),
            lease.isOverdue(),
            payments
        );
    }

    // Inner class for lease payment summary
    public static class LeasePaymentSummary {
        private String leaseId;
        private double totalAmount;
        private double totalPaid;
        private double balance;
        private double paymentProgress;
        private boolean fullyPaid;
        private boolean overdue;
        private List<Payment> payments;

        public LeasePaymentSummary(String leaseId, double totalAmount, double totalPaid, 
                                 double balance, double paymentProgress, boolean fullyPaid, 
                                 boolean overdue, List<Payment> payments) {
            this.leaseId = leaseId;
            this.totalAmount = totalAmount;
            this.totalPaid = totalPaid;
            this.balance = balance;
            this.paymentProgress = paymentProgress;
            this.fullyPaid = fullyPaid;
            this.overdue = overdue;
            this.payments = payments;
        }

        // Getters
        public String getLeaseId() { return leaseId; }
        public double getTotalAmount() { return totalAmount; }
        public double getTotalPaid() { return totalPaid; }
        public double getBalance() { return balance; }
        public double getPaymentProgress() { return paymentProgress; }
        public boolean isFullyPaid() { return fullyPaid; }
        public boolean isOverdue() { return overdue; }
        public List<Payment> getPayments() { return payments; }
    }
}

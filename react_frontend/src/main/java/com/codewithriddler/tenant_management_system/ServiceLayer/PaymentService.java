package com.codewithriddler.tenant_management_system.ServiceLayer;

import com.codewithriddler.tenant_management_system.Entity.Payment;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByTenant(Long tenantId) {
        return paymentRepository.findByTenantId(tenantId);
    }

    public List<Payment> getPaymentsByProperty(Long propertyId) {
        return paymentRepository.findByTenantPropertyId(propertyId);
    }

    public List<Payment> getOverduePayments() {
        return paymentRepository.findByPaidFalseAndDueDateBefore(LocalDate.now());
    }

    public Payment markAsPaid(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setPaid(true);
        payment.setPaymentDate(LocalDate.now());
        return paymentRepository.save(payment);
    }

    public Map<String, Object> getPaymentSummary(Long tenantId) {
        List<Payment> payments = getPaymentsByTenant(tenantId);

        double totalPaid = payments.stream()
                .filter(Payment::isPaid)
                .mapToDouble(Payment::getAmount)
                .sum();

        double totalPending = payments.stream()
                .filter(p -> !p.isPaid())
                .mapToDouble(Payment::getAmount)
                .sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalPaid", totalPaid);
        summary.put("totalPending", totalPending);
        summary.put("totalPayments", payments.size());
        summary.put("overduePayments",
                payments.stream()
                        .filter(p -> !p.isPaid() && p.getDueDate().isBefore(LocalDate.now()))
                        .count());

        return summary;
    }
}
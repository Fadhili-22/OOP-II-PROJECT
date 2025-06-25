package com.codewithriddler.tenant_management_system.Controller;

import com.codewithriddler.tenant_management_system.Entity.Payment;
import com.codewithriddler.tenant_management_system.ServiceLayer.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.createPayment(payment);
    }

    @GetMapping("/tenant/{tenantId}")
    public List<Payment> getPaymentsByTenant(@PathVariable Long tenantId) {
        return paymentService.getPaymentsByTenant(tenantId);
    }

    @GetMapping("/property/{propertyId}")
    public List<Payment> getPaymentsByProperty(@PathVariable Long propertyId) {
        return paymentService.getPaymentsByProperty(propertyId);
    }

    @GetMapping("/overdue")
    public List<Payment> getOverduePayments() {
        return paymentService.getOverduePayments();
    }

    @PostMapping("/{id}/mark-paid")
    public Payment markAsPaid(@PathVariable Long id) {
        return paymentService.markAsPaid(id);
    }

    @GetMapping("/summary/{tenantId}")
    public Map<String, Object> getPaymentSummary(@PathVariable Long tenantId) {
        return paymentService.getPaymentSummary(tenantId);
    }
}
package com.tms.TenantManagementSystem.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tms.TenantManagementSystem.Models.Payment;
import com.tms.TenantManagementSystem.Services.PaymentService;
import com.tms.TenantManagementSystem.Services.PaymentService.LeasePaymentSummary;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/tenant/{tenantId}")
    public List<Payment> getPaymentsByTenant(@PathVariable int tenantId) {
        return paymentService.getPaymentsByTenantId(tenantId);
    }

    @GetMapping("/lease/{leaseId}")
    public List<Payment> getPaymentsByLease(@PathVariable String leaseId) {
        return paymentService.getPaymentsByLeaseId(leaseId);
    }

    @GetMapping("/lease/{leaseId}/summary")
    public LeasePaymentSummary getLeasePaymentSummary(@PathVariable String leaseId) {
        return paymentService.getLeasePaymentSummary(leaseId);
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable int id) {
        return paymentService.getPaymentById(id);
    }

    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.createPayment(payment);
    }

    @PostMapping("/lease")
    public Payment createPaymentForLease(@RequestBody Map<String, Object> paymentData) {
        int tenantId = (Integer) paymentData.get("tenantId");
        String leaseId = (String) paymentData.get("leaseId");
        double amount = ((Number) paymentData.get("amount")).doubleValue();
        String description = (String) paymentData.get("description");
        
        return paymentService.createPaymentForLease(tenantId, leaseId, amount, description);
    }

    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable int id) {
        paymentService.deletePayment(id);
    }
}

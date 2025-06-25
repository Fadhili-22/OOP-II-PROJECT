package com.tms.TenantManagementSystem.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tms.TenantManagementSystem.Models.Lease;
import com.tms.TenantManagementSystem.Models.Payment;
import com.tms.TenantManagementSystem.Models.Tenant;
import com.tms.TenantManagementSystem.Repositories.LeaseRepository;
import com.tms.TenantManagementSystem.Repositories.PaymentRepository;
import com.tms.TenantManagementSystem.Repositories.TenantRepository;
import com.tms.TenantManagementSystem.Services.LeaseService;

@RestController
@RequestMapping("/api/leases")
public class LeaseController {

    @Autowired
    private LeaseService leaseService;

    @Autowired
    private LeaseRepository leaseRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @GetMapping
    public List<Lease> getAllLeases() {
        return leaseService.getAllLeases();
    }

    @GetMapping("/{id}")
    public Lease getLeaseById(@PathVariable String id) {
        return leaseService.getLeaseById(id);
    }

    @PostMapping
    public Lease createLease(@RequestBody Lease lease) {
        return leaseService.createLease(lease);
    }

    @PutMapping("/{id}")
    public Lease updateLease(@PathVariable String id, @RequestBody Lease lease) {
        // Example: Replace currentUser with actual authentication logic as needed
        // if (!currentUser.getRole().equals("admin")) {
        //     throw new AccessDeniedException("Only admin can update lease/property info.");
        // }
        return leaseService.updateLease(id, lease);
        
    }

    @DeleteMapping("/{id}")
    public void deleteLease(@PathVariable String id) {
        leaseService.deleteLease(id);
    }

    @PostMapping("/{id}/renew")
    public Lease renewLease(@PathVariable String id) {
        return leaseService.renewLease(id);
    }

    @PostMapping("/screen")
    public String screenTenant(@RequestBody Map<String, String> data) {
        // Example: Approve if ID number is even, reject if odd
        int idNum = Integer.parseInt(data.get("idNumber"));
        if (idNum % 2 == 0) {
            return "Screening result: Approved";
        } else {
            return "Screening result: Rejected";
        }
    }

    @GetMapping("/analytics/leases")
    public Map<String, Object> leaseAnalytics() {
        long totalLeases = leaseRepository.count();
        long activeLeases = leaseRepository.findAll().stream()
            .filter(l -> "Active".equalsIgnoreCase(l.getStatus()))
            .count();
        return Map.of(
            "totalLeases", totalLeases,
            "activeLeases", activeLeases
        );
    }

    @GetMapping("/analytics/payments")
    public Map<String, Object> paymentAnalytics() {
        List<Payment> payments = paymentRepository.findAll();
        double totalRentCollected = payments.stream().mapToDouble(p -> p.getAmount()).sum();
        long unpaidTenants = tenantRepository.findAll().stream()
            .filter(t -> t.getPayments() == null || t.getPayments().isEmpty())
            .count();
        return Map.of(
            "totalRentCollected", totalRentCollected,
            "unpaidTenants", unpaidTenants
        );
    }
}
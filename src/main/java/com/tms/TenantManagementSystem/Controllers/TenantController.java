package com.tms.TenantManagementSystem.Controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tms.TenantManagementSystem.Models.Payment;
import com.tms.TenantManagementSystem.Models.Tenant;
import com.tms.TenantManagementSystem.Services.TenantService;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @GetMapping
    public List<Tenant> getAllTenants() {
        return tenantService.getAllTenants();
    }

    @GetMapping("/{id}")
    public Tenant getTenantById(@PathVariable int id) {
        return tenantService.getTenantById(id);
    }

    @PostMapping
    public Tenant createTenant(@RequestBody Tenant tenant) {
        if (!tenant.getEmail().endsWith("@gmail.com")) {
            throw new IllegalArgumentException("Only Gmail addresses allowed.");
        }
        tenant.setRole("tenant");
        return tenantService.createTenant(tenant);
    }

    @PutMapping("/{id}")
    public Tenant updateTenant(@PathVariable int id, @RequestBody Tenant tenant) {
        return tenantService.updateTenant(id, tenant);
    }

    @DeleteMapping("/{id}")
    public void deleteTenant(@PathVariable int id) {
        tenantService.deleteTenant(id);
    }

    @PostMapping("/{id}/pay")
    public void payRent(@PathVariable int id, @RequestParam double amount) {
        tenantService.payRent(id, amount);
    }

    @GetMapping("/{id}/payments")
    public List<Payment> getPayments(@PathVariable int id) {
        return tenantService.getPayments(id);
    }

    @PutMapping("/{id}/contact")
    public Tenant updateContact(@PathVariable int id, @RequestBody Map<String, String> contact) {
        Tenant tenant = tenantService.getTenantById(id);
        tenant.setPhoneNumber(contact.get("phoneNumber"));
        // ...other contact fields...
        return tenantService.createTenant(tenant);
    }

    @GetMapping("/unpaid")
    public List<Tenant> getUnpaidTenants() {
        return tenantService.getAllTenants().stream()
            .filter(t -> t.getPayments() == null || t.getPayments().isEmpty())
            .collect(Collectors.toList());
    }
}

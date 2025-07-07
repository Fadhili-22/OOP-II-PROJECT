package com.tms.TenantManagementSystem.Services;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import com.tms.TenantManagementSystem.Models.Payment;
import com.tms.TenantManagementSystem.Models.Tenant;
import com.tms.TenantManagementSystem.Models.User;
import com.tms.TenantManagementSystem.Repositories.TenantRepository;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PaymentService paymentService;

    @PostConstruct
    public void initializeIdCounter() {
        // Fix existing tenants with duplicate IDs and initialize counter
        fixDuplicateIds();
        
        // Find the maximum existing ID and initialize counter
        List<Tenant> allTenants = tenantRepository.findAll();
        int maxId = allTenants.stream()
            .mapToInt(Tenant::getId)
            .max()
            .orElse(0);
        
        User.initializeCounter(maxId);
        System.out.println("Initialized ID counter to start from: " + (maxId + 1));
    }

    private void fixDuplicateIds() {
        List<Tenant> allTenants = tenantRepository.findAll();
        int nextId = 1;
        
        for (Tenant tenant : allTenants) {
            if (tenant.getId() == 0) {
                tenant.setId(nextId++);
                tenantRepository.save(tenant);
                System.out.println("Fixed tenant ID: " + tenant.getName() + " -> ID: " + tenant.getId());
            }
        }
    }

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    public Tenant getTenantById(int id) {
        return tenantRepository.findById(id).orElse(null);
    }

    public Tenant createTenant(Tenant tenant) {
        // The ID will be auto-assigned in the constructor
        return tenantRepository.save(tenant);
    }

    public Tenant updateTenant(int id, Tenant tenant) {
        tenant.setId(id); // Use setter, not direct field access
        return tenantRepository.save(tenant);
    }

    public void deleteTenant(int id) {
        tenantRepository.deleteById(id);
    }

    // Use the standalone Payment service instead of embedded payments
    public List<Payment> getPayments(int tenantId) {
        return paymentService.getPaymentsByTenantId(tenantId);
    }

    public List<Tenant> getUnpaidTenants() {
        return tenantRepository.findAll().stream()
            .filter(tenant -> {
                List<Payment> payments = paymentService.getPaymentsByTenantId(tenant.getId());
                return payments == null || payments.isEmpty();
            })
            .collect(java.util.stream.Collectors.toList());
    }
}

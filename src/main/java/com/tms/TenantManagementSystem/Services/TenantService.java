package com.tms.TenantManagementSystem.Services;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tms.TenantManagementSystem.Models.Payment;
import com.tms.TenantManagementSystem.Models.Tenant;
import com.tms.TenantManagementSystem.Repositories.TenantRepository;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    public Tenant getTenantById(int id) {
        return tenantRepository.findById(id).orElse(null);
    }

    public Tenant createTenant(Tenant tenant) {
        return tenantRepository.save(tenant);
    }

    public Tenant updateTenant(int id, Tenant tenant) {
        tenant.setId(id); // Use setter, not direct field access
        return tenantRepository.save(tenant);
    }

    public void deleteTenant(int id) {
        tenantRepository.deleteById(id);
    }

    public void payRent(int id, double amount) {
        Tenant tenant = tenantRepository.findById(id).orElse(null);
        if (tenant != null) {
            tenant.payRent(amount);
            tenantRepository.save(tenant);
        }
    }

    public List<Payment> getPayments(int id) {
        Tenant tenant = tenantRepository.findById(id).orElse(null);
        if (tenant != null) {
            return tenant.getPayments();
        }
        return Collections.emptyList();
    }
}

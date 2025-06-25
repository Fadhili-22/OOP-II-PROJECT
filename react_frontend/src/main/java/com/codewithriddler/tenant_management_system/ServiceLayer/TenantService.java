package com.codewithriddler.tenant_management_system.ServiceLayer;

import com.codewithriddler.tenant_management_system.Entity.Tenant;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantService {
    private final TenantRepository tenantRepository;

    public Tenant createTenant(Tenant tenant) {
        return tenantRepository.save(tenant);
    }

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    public Tenant getTenantById(Long id) {
        return tenantRepository.findById(id).orElse(null);
    }

    public Tenant updateTenant(Long id, Tenant tenantDetails) {
        Tenant tenant = getTenantById(id);
        if (tenant != null) {
            tenant.setName(tenantDetails.getName());
            tenant.setEmail(tenantDetails.getEmail());
            tenant.setPhone(tenantDetails.getPhone());
            return tenantRepository.save(tenant);
        }
        return null;
    }

    public void deleteTenant(Long id) {
        tenantRepository.deleteById(id);
    }

    public List<Tenant> getTenantsByProperty(Long propertyId) {
        return tenantRepository.findByPropertyId(propertyId);
    }
}


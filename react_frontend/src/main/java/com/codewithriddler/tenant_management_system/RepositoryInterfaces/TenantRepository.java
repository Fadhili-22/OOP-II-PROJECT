package com.codewithriddler.tenant_management_system.RepositoryInterfaces;

import com.codewithriddler.tenant_management_system.Entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    List<Tenant> findByPropertyId(Long propertyId);
}
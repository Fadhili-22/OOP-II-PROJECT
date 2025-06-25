package com.codewithriddler.tenant_management_system.RepositoryInterfaces;

import com.codewithriddler.tenant_management_system.Entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByTenantId(Long tenantId);
    List<MaintenanceRequest> findByTenantPropertyId(Long propertyId);
    List<MaintenanceRequest> findByStatus(String status);
}
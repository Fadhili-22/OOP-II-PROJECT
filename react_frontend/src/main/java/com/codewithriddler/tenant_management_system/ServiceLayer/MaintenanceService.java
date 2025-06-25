package com.codewithriddler.tenant_management_system.ServiceLayer;

import com.codewithriddler.tenant_management_system.Entity.MaintenanceRequest;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.MaintenanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {
    private final MaintenanceRepository maintenanceRepository;

    public MaintenanceRequest createRequest(MaintenanceRequest request) {
        return maintenanceRepository.save(request);
    }

    public List<MaintenanceRequest> getRequestsByTenant(Long tenantId) {
        return maintenanceRepository.findByTenantId(tenantId);
    }

    public List<MaintenanceRequest> getRequestsByProperty(Long propertyId) {
        return maintenanceRepository.findByTenantPropertyId(propertyId);
    }

    public MaintenanceRequest updateStatus(Long id, String status) {
        MaintenanceRequest request = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return maintenanceRepository.save(request);
    }

    public List<MaintenanceRequest> getRequestsByStatus(String status) {
        return maintenanceRepository.findByStatus(status);
    }
}
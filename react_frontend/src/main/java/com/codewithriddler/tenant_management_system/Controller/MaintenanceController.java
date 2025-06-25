package com.codewithriddler.tenant_management_system.Controller;

import com.codewithriddler.tenant_management_system.Entity.MaintenanceRequest;
import com.codewithriddler.tenant_management_system.ServiceLayer.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {
    private final MaintenanceService maintenanceService;

    @PostMapping
    public MaintenanceRequest createRequest(@RequestBody MaintenanceRequest request) {
        return maintenanceService.createRequest(request);
    }

    @GetMapping("/tenant/{tenantId}")
    public List<MaintenanceRequest> getRequestsByTenant(@PathVariable Long tenantId) {
        return maintenanceService.getRequestsByTenant(tenantId);
    }

    @GetMapping("/property/{propertyId}")
    public List<MaintenanceRequest> getRequestsByProperty(@PathVariable Long propertyId) {
        return maintenanceService.getRequestsByProperty(propertyId);
    }

    @PutMapping("/{id}/status")
    public MaintenanceRequest updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return maintenanceService.updateStatus(id, status);
    }

    @GetMapping("/status/{status}")
    public List<MaintenanceRequest> getRequestsByStatus(@PathVariable String status) {
        return maintenanceService.getRequestsByStatus(status);
    }
}

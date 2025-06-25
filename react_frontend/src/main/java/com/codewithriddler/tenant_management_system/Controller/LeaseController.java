package com.codewithriddler.tenant_management_system.Controller;

import com.codewithriddler.tenant_management_system.Entity.Lease;
import com.codewithriddler.tenant_management_system.ServiceLayer.LeaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leases")
@RequiredArgsConstructor
public class LeaseController {
    private final LeaseService leaseService;

    @PostMapping
    public Lease createLease(@RequestBody Lease lease) {
        return leaseService.createLease(lease);
    }

    @GetMapping("/tenant/{tenantId}")
    public Lease getLeaseByTenant(@PathVariable Long tenantId) {
        return leaseService.getLeaseByTenant(tenantId);
    }

    @GetMapping("/property/{propertyId}")
    public List<Lease> getLeasesByProperty(@PathVariable Long propertyId) {
        return leaseService.getLeasesByProperty(propertyId);
    }

    @PutMapping("/{id}")
    public Lease updateLease(@PathVariable Long id, @RequestBody Lease lease) {
        return leaseService.updateLease(id, lease);
    }

    @DeleteMapping("/{id}")
    public void deleteLease(@PathVariable Long id) {
        leaseService.deleteLease(id);
    }

    @GetMapping("/expiring")
    public List<Lease> getExpiringLeases(@RequestParam int days) {
        return leaseService.getLeasesExpiringInDays(days);
    }
}

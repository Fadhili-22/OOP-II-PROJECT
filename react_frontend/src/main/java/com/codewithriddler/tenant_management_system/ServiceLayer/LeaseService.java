package com.codewithriddler.tenant_management_system.ServiceLayer;

import com.codewithriddler.tenant_management_system.Entity.Lease;
import com.codewithriddler.tenant_management_system.Entity.Tenant;
import com.codewithriddler.tenant_management_system.Exceptions.LeaseNotFoundException;
import com.codewithriddler.tenant_management_system.Exceptions.TenantAlreadyHasLeaseException;
import com.codewithriddler.tenant_management_system.Exceptions.TenantNotFoundException;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.LeaseRepository;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaseService {

    private final LeaseRepository leaseRepository;
    private final TenantRepository tenantRepository;

    @Transactional
    public Lease createLease(Lease lease) {
        // Check if tenant already has an active lease
        if (leaseRepository.existsByTenantIdAndEndDateAfter(
                lease.getTenant().getId(), LocalDate.now())) {
            throw new TenantAlreadyHasLeaseException(
                    "Tenant already has an active lease");
        }

        // Verify tenant exists
        Tenant tenant = tenantRepository.findById(lease.getTenant().getId())
                .orElseThrow(() -> new TenantNotFoundException(
                        "Tenant not found with id: " + lease.getTenant().getId()));

        lease.setTenant(tenant);
        return leaseRepository.save(lease);
    }

    public Lease getLeaseByTenant(Long tenantId) {
        return leaseRepository.findByTenantId(tenantId)
                .orElseThrow(() -> new LeaseNotFoundException(
                        "No lease found for tenant with id: " + tenantId));
    }

    public List<Lease> getLeasesByProperty(Long propertyId) {
        return leaseRepository.findByPropertyId(propertyId);
    }

    @Transactional
    public Lease updateLease(Long id, Lease leaseDetails) {
        Lease lease = leaseRepository.findById(id)
                .orElseThrow(() -> new LeaseNotFoundException(
                        "Lease not found with id: " + id));

        if (leaseDetails.getStartDate() != null) {
            lease.setStartDate(leaseDetails.getStartDate());
        }

        if (leaseDetails.getEndDate() != null) {
            lease.setEndDate(leaseDetails.getEndDate());
        }

        if (leaseDetails.getMonthlyRent() > 0) {
            lease.setMonthlyRent(leaseDetails.getMonthlyRent());
        }

        return leaseRepository.save(lease);
    }

    public void deleteLease(Long id) {
        if (!leaseRepository.existsById(id)) {
            throw new LeaseNotFoundException(
                    "Lease not found with id: " + id);
        }
        leaseRepository.deleteById(id);
    }

    public List<Lease> getLeasesExpiringInDays(int days) {
        LocalDate today = LocalDate.now();
        LocalDate targetDate = today.plusDays(days);
        return leaseRepository.findByEndDateBetween(today, targetDate);
    }

    public boolean isLeaseActive(Long tenantId) {
        return leaseRepository.existsByTenantIdAndEndDateAfter(
                tenantId, LocalDate.now());
    }

    public Lease renewLease(Long leaseId, int monthsToAdd) {
        Lease lease = leaseRepository.findById(leaseId)
                .orElseThrow(() -> new LeaseNotFoundException(
                        "Lease not found with id: " + leaseId));

        LocalDate newEndDate = lease.getEndDate().plusMonths(monthsToAdd);
        lease.setEndDate(newEndDate);

        return leaseRepository.save(lease);
    }
}
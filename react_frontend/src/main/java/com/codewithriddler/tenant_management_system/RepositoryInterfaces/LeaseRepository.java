package com.codewithriddler.tenant_management_system.RepositoryInterfaces;

import com.codewithriddler.tenant_management_system.Entity.Lease;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LeaseRepository extends JpaRepository<Lease, Long> {
    Optional<Lease> findByTenantId(Long tenantId);
    List<Lease> findByPropertyId(Long propertyId);
    List<Lease> findByEndDateBetween(LocalDate start, LocalDate end);
    boolean existsByTenantIdAndEndDateAfter(Long tenantId, LocalDate date);

}
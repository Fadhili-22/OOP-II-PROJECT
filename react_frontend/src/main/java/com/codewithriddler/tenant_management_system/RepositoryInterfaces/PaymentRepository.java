package com.codewithriddler.tenant_management_system.RepositoryInterfaces;

import com.codewithriddler.tenant_management_system.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTenantId(Long tenantId);
    List<Payment> findByTenantPropertyId(Long propertyId);
    List<Payment> findByPaidFalseAndDueDateBefore(LocalDate date);
}
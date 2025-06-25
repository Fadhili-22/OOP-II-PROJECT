package com.codewithriddler.tenant_management_system.ServiceLayer;

import com.codewithriddler.tenant_management_system.Entity.Payment;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RentPaymentService {

    private final PaymentRepository rentPaymentRepo;

    public RentPaymentService(PaymentRepository rentPaymentRepo) {
        this.rentPaymentRepo = rentPaymentRepo;
    }

    public List<Payment> getAllPayments() {
        return rentPaymentRepo.findAll();
    }

    public List<Payment> getPaymentsByTenant(Long tenantId) {
        return rentPaymentRepo.findByTenantId(tenantId);
    }

    public Payment savePayment(Payment payment) {
        return rentPaymentRepo.save(payment);
    }

    public void deletePayment(Long id) {
        rentPaymentRepo.deleteById(id);
    }
}
    



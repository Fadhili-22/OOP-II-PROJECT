package com.tms.TenantManagementSystem.Repositories;

import com.tms.TenantManagementSystem.Models.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRepository extends MongoRepository<Payment, Integer> {
}

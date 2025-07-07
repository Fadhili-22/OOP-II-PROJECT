package com.tms.TenantManagementSystem.Repositories;

import com.tms.TenantManagementSystem.Models.paymentHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentHistoryRepository extends MongoRepository<paymentHistory, Integer> {
}

package com.tms.TenantManagementSystem.Repositories;

import com.tms.TenantManagementSystem.Models.Landlord;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LandlordRepository extends MongoRepository<Landlord, Integer> {
}

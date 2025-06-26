package com.tms.TenantManagementSystem.Repositories;

import com.tms.TenantManagementSystem.Models.Tenant;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TenantRepository extends MongoRepository<Tenant, Integer> {
}

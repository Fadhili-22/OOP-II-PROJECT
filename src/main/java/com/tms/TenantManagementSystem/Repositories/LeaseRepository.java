package com.tms.TenantManagementSystem.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tms.TenantManagementSystem.Models.Lease;

public interface LeaseRepository extends MongoRepository<Lease, String> {
}
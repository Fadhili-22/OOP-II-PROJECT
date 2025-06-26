package com.tms.TenantManagementSystem.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tms.TenantManagementSystem.Models.Agent;

public interface AgentRepository extends MongoRepository<Agent, Integer> {
    // Additional query methods if needed
}

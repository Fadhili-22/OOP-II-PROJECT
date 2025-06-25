package com.tms.TenantManagementSystem.Repositories;

import com.tms.TenantManagementSystem.Models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, Integer> {
}

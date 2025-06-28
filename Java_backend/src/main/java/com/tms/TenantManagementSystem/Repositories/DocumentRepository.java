package com.tms.TenantManagementSystem.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.tms.TenantManagementSystem.Models.TenantDocument;
 
public interface DocumentRepository extends MongoRepository<TenantDocument, String> {
    // Additional query methods if needed
} 
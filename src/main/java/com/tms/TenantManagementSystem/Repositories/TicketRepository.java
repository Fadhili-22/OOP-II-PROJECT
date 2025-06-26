package com.tms.TenantManagementSystem.Repositories;

import com.tms.TenantManagementSystem.Models.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TicketRepository extends MongoRepository<Ticket, Integer> {
}

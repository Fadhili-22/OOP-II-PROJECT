package com.tms.TenantManagementSystem.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import com.tms.TenantManagementSystem.Models.Ticket;
import com.tms.TenantManagementSystem.Repositories.TicketRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @PostConstruct
    public void initializeTicketIdCounter() {
        // Find the maximum existing ticket ID and initialize counter
        List<Ticket> allTickets = ticketRepository.findAll();
        int maxId = allTickets.stream()
            .mapToInt(Ticket::getTicketID)
            .max()
            .orElse(0);
        
        Ticket.initializeCounter(maxId);
        System.out.println("Initialized Ticket ID counter to start from: " + (maxId + 1));
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByTenantId(int tenantId) {
        return ticketRepository.findAll().stream()
            .filter(ticket -> ticket.getTenantId() == tenantId)
            .collect(Collectors.toList());
    }

    public Ticket getTicketById(int id) {
        return ticketRepository.findById(id).orElse(null);
    }

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(int id) {
        ticketRepository.deleteById(id);
    }

    public Ticket assignStaff(int ticketId, String staff) {
        Ticket ticket = getTicketById(ticketId);
        if (ticket != null) {
            ticket.setAssignedStaff(staff);
            return updateTicket(ticket);
        }
        return null;
    }

    public Ticket updateStatus(int ticketId, String status) {
        Ticket ticket = getTicketById(ticketId);
        if (ticket != null) {
            ticket.setStatus(status);
            return updateTicket(ticket);
        }
        return null;
    }

    public Ticket addResolution(int ticketId, String notes) {
        Ticket ticket = getTicketById(ticketId);
        if (ticket != null) {
            ticket.setResolutionNotes(notes);
            return updateTicket(ticket);
        }
        return null;
    }
}

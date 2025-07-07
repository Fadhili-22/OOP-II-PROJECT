package com.tms.TenantManagementSystem.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tms.TenantManagementSystem.Models.Ticket;
import com.tms.TenantManagementSystem.Services.TicketService;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/tenant/{tenantId}")
    public List<Ticket> getTicketsByTenant(@PathVariable int tenantId) {
        return ticketService.getTicketsByTenantId(tenantId);
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable int id) {
        return ticketService.getTicketById(id);
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable int id) {
        ticketService.deleteTicket(id);
    }

    @PutMapping("/{id}/assign")
    public Ticket assignStaff(@PathVariable int id, @RequestParam String staff) {
        return ticketService.assignStaff(id, staff);
    }

    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable int id, @RequestParam String status) {
        return ticketService.updateStatus(id, status);
    }

    @PutMapping("/{id}/resolution")
    public Ticket addResolution(@PathVariable int id, @RequestParam String notes) {
        return ticketService.addResolution(id, notes);
    }
}

package com.tms.TenantManagementSystem.Controllers;

import java.io.IOException;
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
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/upload")
    public Ticket uploadTicket(
        @RequestParam("description") String description,
        @RequestParam("urgency") String urgency,
        @RequestParam("category") String category,
        @RequestParam("image") MultipartFile image
    ) throws IOException {
        String imageUrl = saveImage(image); // implement this
        Ticket ticket = new Ticket();
        ticket.setDescription(description);
        ticket.setUrgency(urgency);
        ticket.setCategory(category);
        ticket.setImageUrl(imageUrl);
        ticket.setStatus("Open");
        return ticketService.createTicket(ticket);
    }

    @PutMapping("/{id}/assign")
    public Ticket assignStaff(@PathVariable int id, @RequestParam String staff) {
        Ticket ticket = ticketService.getTicketById(id);
        ticket.setAssignedStaff(staff);
        return ticketService.createTicket(ticket);
    }

    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable int id, @RequestParam String status) {
        Ticket ticket = ticketService.getTicketById(id);
        ticket.setStatus(status);
        return ticketService.createTicket(ticket);
    }

    @PutMapping("/{id}/resolution")
    public Ticket addResolution(@PathVariable int id, @RequestParam String notes) {
        Ticket ticket = ticketService.getTicketById(id);
        ticket.setResolutionNotes(notes);
        return ticketService.createTicket(ticket);
    }

    // Helper method to save image and return its URL or path
    private String saveImage(MultipartFile image) throws IOException {
        // For demonstration, save to a local directory called "uploads"
        String uploadDir = "uploads/";
        java.io.File dir = new java.io.File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        String filePath = uploadDir + System.currentTimeMillis() + "_" + image.getOriginalFilename();
        java.io.File dest = new java.io.File(filePath);
        image.transferTo(dest);
        // Return the file path or a URL if serving statically
        return filePath;
    }
}

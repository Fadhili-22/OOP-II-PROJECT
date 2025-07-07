package com.tms.TenantManagementSystem.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.concurrent.atomic.AtomicInteger;

@Document(collection = "tickets")
public class Ticket {
    private static AtomicInteger ticketCounter = new AtomicInteger(1);
    
    @Id
    private int ticketID;
    private int tenantId; // Link to specific tenant
    private String description;
    private String status;
    private String urgency;
    private String category;
    private String assignedStaff;
    private String resolutionNotes;

    // Constructors
    public Ticket() {
        this.ticketID = ticketCounter.getAndIncrement();
        this.status = "Open"; // Default status
    }

    public Ticket(int ticketID, int tenantId, String description, String status, String urgency, String category,
                  String assignedStaff, String resolutionNotes) {
        this.ticketID = ticketID;
        this.tenantId = tenantId;
        this.description = description;
        this.status = status != null ? status : "Open";
        this.urgency = urgency;
        this.category = category;
        this.assignedStaff = assignedStaff;
        this.resolutionNotes = resolutionNotes;
    }
    
    public Ticket(String description) {
        this();
        this.description = description;
    }

    // Static method to initialize counter
    public static void initializeCounter(int maxExistingId) {
        ticketCounter.set(maxExistingId + 1);
    }
 
    public int getTicketID() { return ticketID; }
    public void setTicketID(int ticketID) { this.ticketID = ticketID; }

    public int getTenantId() { return tenantId; }
    public void setTenantId(int tenantId) { this.tenantId = tenantId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(String assignedStaff) { this.assignedStaff = assignedStaff; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}


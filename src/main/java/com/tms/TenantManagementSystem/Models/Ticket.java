package com.tms.TenantManagementSystem.Models;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tickets")
public class Ticket {
    private int ticketID;
    private String description;
    private String status;
    private String urgency;
    private String category;
    private String assignedStaff;
    private String resolutionNotes;
    private String imageUrl;

    // Constructors, getters, setters
    public Ticket() {
        // 
    }

    public Ticket(int ticketID, String description, String status, String urgency, String category,
                  String assignedStaff, String resolutionNotes, String imageUrl) {
        this.ticketID = ticketID;
        this.description = description;
        this.status = status;
        this.urgency = urgency;
        this.category = category;
        this.assignedStaff = assignedStaff;
        this.resolutionNotes = resolutionNotes;
        this.imageUrl = imageUrl;
    }
    
    public Ticket(String description) {
        this.description = description;
    }
 
    public int getTicketID() { return ticketID; }
    public void setTicketID(int ticketID) { this.ticketID = ticketID; }

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

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}


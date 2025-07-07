package com.tms.TenantManagementSystem.Models;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tenants")
public class Tenant extends User {
    private String phoneNumber;

    public Tenant() {
        super(); // Use default User constructor
        setRole("tenant"); // Set role for tenant
    }
    
    public Tenant(String name, int ID, String email, String password, String phoneNumber) {
        super(name, ID, email, password, "tenant"); // Pass "tenant" as role
        this.phoneNumber = phoneNumber;
    }

    // Public getter for name
    @Override
    public String getName() {
        return super.getName();
    }

    // Public setter for name
    @Override
    public void setName(String name) {
        super.setName(name);
    }

    // Public getter for phoneNumber
    public String getPhoneNumber() {
        return phoneNumber;
    }

    // Public setter for phoneNumber
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @Override
    public String getEmail() {
        return super.getEmail();
    }

    @Override
    public void setEmail(String email) {
        super.setEmail(email);
    }

    @Override
    public String getPassword() {
        return super.getPassword();
    }

    public void setPassword(String password) {
        super.setPassword(password);
    }

    @Override
    public boolean login(String email, String password) {
        System.out.println("Tenant login...");
        return super.login(email, password);
    }

    // Note: Payments and tickets are now handled as standalone entities
    // Use PaymentService.getPaymentsByTenantId(tenantId) to get payments
    // Use TicketService.getTicketsByTenantId(tenantId) to get tickets
}


package com.tms.TenantManagementSystem.Models;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "landlords")
public class Landlord extends User {

    public Landlord(String name, int ID, String email, String password) {
        super(name, ID, email, password, "landlord");
    }

    public Landlord() {
        super();
        setRole("landlord");
    }

    public void registerUsers(User user) {
        System.out.println("Registering a new user: " + user.getName());
    }

    @Override
    public boolean login(String email, String password) {
        System.out.println("Landlord login...");
        return super.login(email, password);
    }

    @Override
    public String getName() {
        return super.getName();
    }

    @Override
    public void setName(String name) {
        super.setName(name);
    }

    @Override
    public String getEmail() {
        return super.getEmail();
    }

    @Override
    public void setEmail(String email) {
        super.setEmail(email);
    }

    // Note: Payment tracking and ticket viewing are now handled by their respective services:
    // - Use PaymentService.getPaymentsByTenantId(tenantId) to track payments
    // - Use TicketService.getAllTickets() or getTicketsByTenantId(tenantId) to view tickets
}


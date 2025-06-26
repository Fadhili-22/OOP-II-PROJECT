package com.tms.TenantManagementSystem.Models;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tenants")
public class Tenant extends User {
    private List<Payment> payments = new ArrayList<>();
    private List<Ticket> tickets = new ArrayList<>();
    private String phoneNumber;
    //private String email;
    //private String password;

    public Tenant() {
        super("", 0, "", "", "");
    }
    
    public Tenant(String name, int ID, String email, String password, String phoneNumber) {
        super(name, ID, email, password, phoneNumber);
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

    public void viewPaymentHistory() {
        for (Payment p : payments) {
            System.out.println(p);
        }
    }

    public void raiseTickets(String description) {
        Ticket ticket = new Ticket(description);
        tickets.add(ticket);
        System.out.println("Ticket raised: " + description);
    }

    public void payRent(double amount) {
        Payment payment = new Payment(amount);
        payments.add(payment);
        System.out.println("Rent paid: " + amount);
    }

    public void uploadDocuments() {
        System.out.println("Uploading documents...");
    }

    @Override
    public boolean login(String email, String password) {
        System.out.println("Tenant login...");
        return super.login(email, password);
    }

    public List<Payment> getPayments() {
        return payments;
    }
}


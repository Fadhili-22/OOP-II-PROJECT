package com.tms.TenantManagementSystem.Models;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "landlords")
public class Landlord extends User {

    //private String email;
    //private String password;

    public Landlord(String name, int ID, String email, String password) {
        super(name, ID, email, password, "landlord");
    }

    public Landlord() {
        super();
        setRole("landlord");
    }

    public void trackPayment(Tenant tenant) {
        System.out.println("Tracking payments for Tenant ID: " + tenant.getId());
        tenant.viewPaymentHistory();
    }

    public void registerUsers(User user) {
        System.out.println("Registering a new user: " + user.getName());
    }

    public void viewTickets(List<Ticket> tickets) {
        for (Ticket t : tickets) {
            System.out.println(t);
        }
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
}


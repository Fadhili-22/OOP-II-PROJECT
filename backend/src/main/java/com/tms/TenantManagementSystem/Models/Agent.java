package com.tms.TenantManagementSystem.Models;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "agents")    
public class Agent extends User {
    private String phoneNumber;

    public Agent() {
        super();
        setRole("agent");
    }

    public Agent(String name, int ID, String email, String password, String phoneNumber) {
        super(name, ID, email, password, "agent");
        this.phoneNumber = phoneNumber;
    }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}

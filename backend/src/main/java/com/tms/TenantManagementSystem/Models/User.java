package com.tms.TenantManagementSystem.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.concurrent.atomic.AtomicInteger;

@Document(collection = "users")
public class User {
    private static AtomicInteger idCounter = new AtomicInteger(1); // Start from 1
    
    @Id
    private String mongoId; // MongoDB's auto-generated ID
    private int ID; // Custom integer ID for our application
    private String name;
    private String email;
    private String password;
    private String role;

    public User() {
        this.ID = idCounter.getAndIncrement(); // Auto-assign unique ID
    }

    public User(String name, int ID, String email, String password, String role) {
        this.name = name;
        this.ID = (ID == 0) ? idCounter.getAndIncrement() : ID; // Auto-assign if not provided
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Static method to initialize counter from existing data
    public static void initializeCounter(int maxExistingId) {
        idCounter.set(maxExistingId + 1);
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getId() { return ID; }
    public void setId(int id) { this.ID = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean login(String email, String password) {
        return this.email.equals(email) && this.password.equals(password);
    }
}


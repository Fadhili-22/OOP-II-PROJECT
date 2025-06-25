package com.tms.TenantManagementSystem.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "users")
public class User {
    @Id
    private int id;
    private String name;
    private String email;
    private String password;
    private String role;

    public User() {}

    public User(String name, int id, String email, String password, String role) {
        this.name = name;
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

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


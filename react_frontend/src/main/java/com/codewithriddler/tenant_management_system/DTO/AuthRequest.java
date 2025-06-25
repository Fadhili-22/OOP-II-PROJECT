package com.codewithriddler.tenant_management_system.DTO;

public class AuthRequest {
    private String username;
    private String password;

    // Getters and setters (or use Lombok @Data)
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

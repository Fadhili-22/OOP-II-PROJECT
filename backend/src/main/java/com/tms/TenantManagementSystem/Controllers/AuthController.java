package com.tms.TenantManagementSystem.Controllers;

import com.tms.TenantManagementSystem.Models.Tenant;
import com.tms.TenantManagementSystem.Models.Landlord;
import com.tms.TenantManagementSystem.Repositories.TenantRepository;
import com.tms.TenantManagementSystem.Repositories.LandlordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private LandlordRepository landlordRepository;

    @PostMapping("/login")
    public Object login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        String role = loginData.get("role");
        if ("tenant".equalsIgnoreCase(role)) {
            Tenant tenant = tenantRepository.findAll().stream()
                    .filter(t -> t.getEmail().equals(email) && t.getPassword().equals(password))
                    .findFirst()
                    .orElse(null);
            if (tenant != null) return tenant;
        } else if ("landlord".equalsIgnoreCase(role)) {
            Landlord landlord = landlordRepository.findAll().stream()
                    .filter(l -> l.getEmail().equals(email) && l.getPassword().equals(password))
                    .findFirst()
                    .orElse(null);
            if (landlord != null) return landlord;
        }
        return "Invalid credentials";
    }
}

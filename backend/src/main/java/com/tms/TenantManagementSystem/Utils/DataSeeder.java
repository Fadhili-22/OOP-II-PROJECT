package com.tms.TenantManagementSystem.Utils;

import com.tms.TenantManagementSystem.Models.Landlord;
import com.tms.TenantManagementSystem.Repositories.LandlordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private LandlordRepository landlordRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if landlord already exists
        if (landlordRepository.count() == 0) {
            seedLandlordUser();
        } else {
            System.out.println("Landlord user already exists. Skipping seeding.");
        }
    }

    private void seedLandlordUser() {
        try {
            // Create default landlord user
            Landlord landlord = new Landlord();
            landlord.setId(1);
            landlord.setName("Admin Landlord");
            landlord.setEmail("admin@gmail.com");
            landlord.setPassword("admin123");
            landlord.setRole("landlord");

            // Save to database
            landlordRepository.save(landlord);
            
            System.out.println("✅ Landlord user seeded successfully!");
            System.out.println("📧 Email: admin@gmail.com");
            System.out.println("🔒 Password: admin123");
            System.out.println("👤 Role: landlord");
            System.out.println("🆔 ID: 1");
            
        } catch (Exception e) {
            System.err.println("❌ Error seeding landlord user: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 
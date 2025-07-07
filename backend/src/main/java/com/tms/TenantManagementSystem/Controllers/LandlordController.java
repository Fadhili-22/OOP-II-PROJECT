package com.tms.TenantManagementSystem.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tms.TenantManagementSystem.Models.Landlord;
import com.tms.TenantManagementSystem.Services.LandlordService;

@RestController
@RequestMapping("/api/landlords")
public class LandlordController {

    @Autowired
    private LandlordService landlordService;

    @GetMapping
    public List<Landlord> getAllLandlords() {
        return landlordService.getAllLandlords();
    }

    @GetMapping("/{id}")
    public Landlord getLandlordById(@PathVariable int id) {
        return landlordService.getLandlordById(id);
    }

    @PostMapping
    public Landlord createLandlord(@RequestBody Landlord landlord) {
        if (!landlord.getEmail().endsWith("@gmail.com")) {
            throw new IllegalArgumentException("Only Gmail addresses allowed.");
        }
        return landlordService.createLandlord(landlord);
    }

    @PutMapping("/{id}")
    public Landlord updateLandlord(@PathVariable int id, @RequestBody Landlord landlord) {
        return landlordService.updateLandlord(id, landlord);
    }

    @DeleteMapping("/{id}")
    public void deleteLandlord(@PathVariable int id) {
        landlordService.deleteLandlord(id);
    }
}

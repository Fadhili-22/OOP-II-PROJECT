package com.tms.TenantManagementSystem.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tms.TenantManagementSystem.Models.Landlord;
import com.tms.TenantManagementSystem.Repositories.LandlordRepository;

@Service
public class LandlordService {

    @Autowired
    private LandlordRepository landlordRepository;

    public List<Landlord> getAllLandlords() {
        return landlordRepository.findAll();
    }

    public Landlord getLandlordById(int id) {
        return landlordRepository.findById(id).orElse(null);
    }

    public Landlord createLandlord(Landlord landlord) {
        return landlordRepository.save(landlord);
    }

    public Landlord updateLandlord(int id, Landlord landlord) {
        landlord.setId(id); // Use setter, not direct field access
        return landlordRepository.save(landlord);
    }

    public void deleteLandlord(int id) {
        landlordRepository.deleteById(id);
    }
}

package com.tms.TenantManagementSystem.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tms.TenantManagementSystem.Models.Lease;
import com.tms.TenantManagementSystem.Repositories.LeaseRepository;

import java.util.List;
import java.util.Optional;

@Service
public class LeaseService {

    @Autowired
    private LeaseRepository leaseRepository;

    public Lease createLease(Lease lease) {
        return leaseRepository.save(lease);
    }

    public Lease getLeaseById(String id) {
        return leaseRepository.findById(id).orElse(null);
    }

    public List<Lease> getAllLeases() {
        return leaseRepository.findAll();
    }

    public Lease updateLease(String id, Lease lease) {
        lease.setLeaseId(id);
        return leaseRepository.save(lease);
    }

    public void deleteLease(String id) {
        leaseRepository.deleteById(id);
    }

    public Lease renewLease(String id) {
        Optional<Lease> leaseOptional = leaseRepository.findById(id);
        if (leaseOptional.isPresent()) {
            Lease lease = leaseOptional.get();
            lease.setRenewed(true);
            return leaseRepository.save(lease);
        }
        return null;
    }

    public void someMethod() {
        int id = 123;
        Optional<Lease> lease = leaseRepository.findById(String.valueOf(id));
        // ... do something with the lease ...
    }
}
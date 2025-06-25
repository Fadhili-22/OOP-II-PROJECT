package com.codewithriddler.tenant_management_system.RepositoryInterfaces;

import com.codewithriddler.tenant_management_system.Entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByOwnerId(Long ownerId);

    List<Property> findByAddressContainingAndTypeAndRentAmountLessThanEqual(String address, String type, Double maxRent);

    List<Property> findByAddressContainingAndType(String address, String type);

    List<Property> findByAddressContainingAndRentAmountLessThanEqual(String address, Double maxRent);

    List<Property> findByTypeAndRentAmountLessThanEqual(String type, Double maxRent);

    List<Property> findByAddressContaining(String address);

    List<Property> findByType(String type);

    List<Property> findByRentAmountLessThanEqual(Double maxRent);


    long countByOwnerId(Long ownerId);
}
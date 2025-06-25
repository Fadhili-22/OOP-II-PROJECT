package com.codewithriddler.tenant_management_system.ServiceLayer;

import com.codewithriddler.tenant_management_system.Entity.Property;
import com.codewithriddler.tenant_management_system.Entity.User;
import com.codewithriddler.tenant_management_system.Exceptions.PropertyNotFoundException;
import com.codewithriddler.tenant_management_system.Exceptions.UserNotFoundException;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.PropertyRepository;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    @Transactional
    public Property createProperty(Property property) {
        // Verify owner exists if specified
        if (property.getOwner() != null && property.getOwner().getId() != null) {
            User owner = userRepository.findById(property.getOwner().getId())
                    .orElseThrow(() -> new UserNotFoundException(
                            "Owner not found with id: " + property.getOwner().getId()));
            property.setOwner(owner);
        }

        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException(
                        "Property not found with id: " + id));
    }

    @Transactional
    public Property updateProperty(Long id, Property propertyDetails) {
        Property property = getPropertyById(id);

        if (propertyDetails.getAddress() != null) {
            property.setAddress(propertyDetails.getAddress());
        }

        if (propertyDetails.getType() != null) {
            property.setType(propertyDetails.getType());
        }

        if (propertyDetails.getRentAmount() != null) {
            property.setRentAmount(propertyDetails.getRentAmount());
        }

        // Update owner if specified
        if (propertyDetails.getOwner() != null &&
                propertyDetails.getOwner().getId() != null) {
            User owner = userRepository.findById(propertyDetails.getOwner().getId())
                    .orElseThrow(() -> new UserNotFoundException(
                            "Owner not found with id: " + propertyDetails.getOwner().getId()));
            property.setOwner(owner);
        }

        return propertyRepository.save(property);
    }

    @Transactional
    public void deleteProperty(Long id) {
        Property property = getPropertyById(id);
        propertyRepository.delete(property);
    }

    public List<Property> getPropertiesByOwner(Long ownerId) {
        if (!userRepository.existsById(ownerId)) {
            throw new UserNotFoundException("Owner not found with id: " + ownerId);
        }
        return propertyRepository.findByOwnerId(ownerId);
    }

    public List<Property> searchProperties(String address, String type, Double maxRent) {
        if (address != null && type != null && maxRent != null) {
            return propertyRepository.findByAddressContainingAndTypeAndRentAmountLessThanEqual(
                    address, type, maxRent);
        } else if (address != null && type != null) {
            return propertyRepository.findByAddressContainingAndType(address, type);
        } else if (address != null && maxRent != null) {
            return propertyRepository.findByAddressContainingAndRentAmountLessThanEqual(
                    address, maxRent);
        } else if (type != null && maxRent != null) {
            return propertyRepository.findByTypeAndRentAmountLessThanEqual(type, maxRent);
        } else if (address != null) {
            return propertyRepository.findByAddressContaining(address);
        } else if (type != null) {
            return propertyRepository.findByType(type);
        } else if (maxRent != null) {
            return propertyRepository.findByRentAmountLessThanEqual(maxRent);
        } else {
            return propertyRepository.findAll();
        }
    }

    public long countPropertiesByOwner(Long ownerId) {
        if (!userRepository.existsById(ownerId)) {
            throw new UserNotFoundException("Owner not found with id: " + ownerId);
        }
        return propertyRepository.countByOwnerId(ownerId);
    }
}
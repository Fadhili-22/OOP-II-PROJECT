package com.codewithriddler.tenant_management_system.RepositoryInterfaces;

import com.codewithriddler.tenant_management_system.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by username (for login)
    Optional<User> findByUsername(String username);

    // Check if username exists (for registration)
    boolean existsByUsername(String username);

    // Find user by username with role eager loaded
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.role WHERE u.username = :username")
    Optional<User> findByUsernameWithRole(String username);

    // Update password
    @Modifying
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.username = :username")
    void updatePassword(String username, String newPassword);

    // Find by username or email (for password recovery)
    Optional<User> findByUsernameOrEmail(String username, String email);

    // Deactivate user account
    @Modifying
    @Query("UPDATE User u SET u.active = false WHERE u.id = :userId")
    void deactivateUser(Long userId);

    // Check if email exists (for registration)
    boolean existsByEmail(String email);
}
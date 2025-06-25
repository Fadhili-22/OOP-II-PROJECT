package com.codewithriddler.tenant_management_system.Security;

import com.codewithriddler.tenant_management_system.Entity.User;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)  // or email, whatever you're using
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())  // hashed password
                .roles(String.valueOf(user.getRole()))         // e.g., "ADMIN", "TENANT"
                .build();
    }
}
package com.codewithriddler.tenant_management_system.ServiceLayer;

import com.codewithriddler.tenant_management_system.DTO.LoginRequest;
import com.codewithriddler.tenant_management_system.DTO.LoginResponse;
import com.codewithriddler.tenant_management_system.Entity.User;
import com.codewithriddler.tenant_management_system.RepositoryInterfaces.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    public LoginResponse authenticate(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return new LoginResponse("Login successful", user);
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }
}

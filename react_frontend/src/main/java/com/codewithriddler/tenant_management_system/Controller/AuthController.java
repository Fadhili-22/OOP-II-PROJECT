package com.codewithriddler.tenant_management_system.Controller;

import com.codewithriddler.tenant_management_system.DTO.LoginRequest;
import com.codewithriddler.tenant_management_system.DTO.LoginResponse;
import com.codewithriddler.tenant_management_system.ServiceLayer.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController("authControllerBean")
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }
}
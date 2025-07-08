package com.codewithriddler.tenant_management_system.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// DTO used for login requests
public class LoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}

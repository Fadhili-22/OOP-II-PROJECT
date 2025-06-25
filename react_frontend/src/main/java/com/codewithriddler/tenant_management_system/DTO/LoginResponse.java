package com.codewithriddler.tenant_management_system.DTO;

import com.codewithriddler.tenant_management_system.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String message;
    private User user;
}

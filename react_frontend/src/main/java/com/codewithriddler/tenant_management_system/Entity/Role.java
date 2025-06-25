package com.codewithriddler.tenant_management_system.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true,nullable = false)
    private RoleName name;// Assuming you have RoleName enum

    public Object name() {
        return name;
    }

    // ... other fields/methods
}
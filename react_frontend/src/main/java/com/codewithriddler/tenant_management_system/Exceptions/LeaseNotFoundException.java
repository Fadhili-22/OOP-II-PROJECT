package com.codewithriddler.tenant_management_system.Exceptions;

public class LeaseNotFoundException extends RuntimeException {
    public LeaseNotFoundException(String message) {
        super(message);
    }
}
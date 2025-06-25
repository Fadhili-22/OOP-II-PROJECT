package com.codewithriddler.tenant_management_system.Exceptions;

public class TenantAlreadyHasLeaseException extends RuntimeException {
    public TenantAlreadyHasLeaseException(String message) {
        super(message);
    }
}
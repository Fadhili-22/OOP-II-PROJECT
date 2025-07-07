package com.tms.TenantManagementSystem.Utils;

import com.tms.TenantManagementSystem.Models.User;

public class SecurityUtil {
    public static boolean isAdmin(User user) {
        return user != null && "admin".equalsIgnoreCase(user.getRole());
    }
    public static boolean isLandlord(User user) {
        return user != null && "landlord".equalsIgnoreCase(user.getRole());
    }
    public static boolean isTenant(User user) {
        return user != null && "tenant".equalsIgnoreCase(user.getRole());
    }
    public static boolean isAgent(User user) {
        return user != null && "agent".equalsIgnoreCase(user.getRole());
    }
}

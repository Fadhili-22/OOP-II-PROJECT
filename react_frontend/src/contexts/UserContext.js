import React, { createContext, useContext, useState, useEffect } from 'react';
import { tenantService } from '../services/tenantService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        console.log(`Checking auth status for user ID: ${userId}`);
        // Try to fetch user data from backend
        const userData = await tenantService.getTenantById(userId);
        console.log('User data received:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log('No auth tokens found');
        // For development, auto-login with tenant ID 1
        await autoLogin();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear invalid tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    } finally {
      setLoading(false);
    }
  };

  const autoLogin = async () => {
    try {
      // Auto-login with tenant ID 1 for development
      const mockTenantId = 1;
      console.log(`Auto-logging in with tenant ID: ${mockTenantId}`);
      
      const userData = await tenantService.getTenantById(mockTenantId);
      console.log('Auto-login successful, user data:', userData);
      
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('userId', mockTenantId.toString());
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auto-login failed:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // This would typically call an auth service
      // For now, we'll simulate with a mock tenant ID
      const mockTenantId = 1; // In real app, this comes from login response
      
      const userData = await tenantService.getTenantById(mockTenantId);
      
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('userId', mockTenantId.toString());
      
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 
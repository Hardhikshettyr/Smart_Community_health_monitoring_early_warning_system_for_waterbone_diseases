import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      if (authService.isAuthenticated()) {
        try {
          const profile = await authService.getProfile();
          if (profile && profile.user) {
            setUser(profile.user);
            localStorage.setItem('aquaguard_user', JSON.stringify(profile.user));
          }
        } catch (err) {
          console.error('Session check failed:', err);
        }
      }
      setLoading(false);
    }
    verifySession();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (email, password, role) => {
    return await authService.register(email, password, role);
  };

  const verifyOtp = async (email, otp) => {
    return await authService.verifyOtp(email, otp);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyOtp,
    logout,
    isAuthenticated: !!user,
    isHealthWorkerOrAdmin: user?.role === 'asha_worker' || user?.role === 'admin',
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

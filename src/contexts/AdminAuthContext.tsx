"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, validateToken, clearAuthData } from '@/lib/auth';

interface AdminAuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  refreshAuth: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = () => {
    const validUser = validateToken();
    setUser(validUser);
    setIsLoading(false);
  };

  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

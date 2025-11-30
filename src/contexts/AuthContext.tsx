"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentSession, getUserData, isAuthenticated, clearAuthData } from '@/lib/auth/customAuth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      
      if (!isAuthenticated()) {
        setUser(null);
        return;
      }

      // Lấy user data từ localStorage trước
      const localUser = getUserData();
      if (localUser) {
        setUser(localUser);
      }

      // Verify session với server
      const session = await getCurrentSession();
      if (session?.success && session.user) {
        setUser(session.user);
      } else {
        // Session không hợp lệ, xóa data
        clearAuthData();
        setUser(null);
      }
    } catch (error) {
      console.error('Refresh session error:', error);
      clearAuthData();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

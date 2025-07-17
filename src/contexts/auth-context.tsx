'use client';

import type React from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import api from '@/services/api';
import type { User } from '@/interfaces/api';

interface AuthContextType {
  currentUser: User | null;
  isLogin: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCookie = (name: string) => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; secure; samesite=lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(() => {
    return Boolean(typeof window !== 'undefined' && getCookie('token'));
  });

  const logout = useCallback(() => {
    deleteCookie('token');
    deleteCookie('email');
    setCurrentUser(null);
    setIsLogin(false);
  }, []);

  const fetchUserData = useCallback(
    async (email: string) => {
      try {
        setIsLoading(true);
        const res = await api.getUserByEmail(email);
        setCurrentUser(res);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  const refreshUser = useCallback(async () => {
    const email = getCookie('email');
    if (email) await fetchUserData(email);
  }, [fetchUserData]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (isLogin) {
        const email = getCookie('email');
        if (email) {
          await fetchUserData(email);
        } else {
          logout();
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isLogin, fetchUserData, logout]);

  const login = useCallback((token: string, email: string) => {
    setCookie('token', token);
    setCookie('email', email);
    setIsLogin(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLogin,
        login,
        logout,
        refreshUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

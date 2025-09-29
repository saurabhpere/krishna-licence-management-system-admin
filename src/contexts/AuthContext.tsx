import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse, LoginRequest } from '../types';
import { apiClient } from '../lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthResponse | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Verify token by fetching profile
      apiClient.getProfile()
        .then((profile) => {
          if (profile.user.role === 'admin') {
            setUser(profile);
          } else {
            localStorage.removeItem('admin_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('admin_token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await apiClient.adminLogin(credentials);
      
      if (response.user.role !== 'admin') {
        throw new Error('Access denied. Admin role required.');
      }

      localStorage.setItem('admin_token', response.token);
      setUser(response);
      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

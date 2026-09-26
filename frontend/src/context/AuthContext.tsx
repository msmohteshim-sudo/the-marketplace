import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type UserMode = 'client' | 'freelancer' | 'both';
export type WorkType = 'digital' | 'physical' | 'both';

export interface User {
  id: string;
  email: string;
  phone?: string;
  phoneCountryCode?: string;
  secondaryPhone?: string;
  secondaryPhoneCountryCode?: string;
  secondaryPhoneVerified?: boolean;
  phoneVisibility?: string;
  fullName?: string;
  profilePhoto?: string;
  bio?: string;
  location?: string;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  area?: string;
  locality?: string;
  pincode?: string;
  serviceRadius?: number;
  activeMode: UserMode;
  capabilities: ('client' | 'freelancer')[];
  clientWorkPreference: WorkType;
  freelancerWorkPreference: WorkType;
  activeWorkType: WorkType;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  skillVerified: boolean;
  localWorkerVerified: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  profileComplete: number;
  profileVisibility?: string;
  resumeVisibility?: string;
  createdAt?: string;
  profile?: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
  switchMode: (mode: UserMode, newToken?: string) => void;
  switchWorkType: (type: WorkType, newToken?: string) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('mp_token');
    const storedUser = localStorage.getItem('mp_user');

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Ensure capabilities is an array
        if (!Array.isArray(parsed.capabilities)) {
          parsed.capabilities = parsed.capabilities === 'both' ? ['client', 'freelancer'] : [parsed.capabilities || 'client'];
        }
        if (parsed.clientWorkPreference === 'both' || !parsed.clientWorkPreference) {
          parsed.clientWorkPreference = parsed.activeWorkType || 'digital';
        }
        if (parsed.freelancerWorkPreference === 'both' || !parsed.freelancerWorkPreference) {
          parsed.freelancerWorkPreference = parsed.activeWorkType || 'digital';
        }
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('mp_token');
        localStorage.removeItem('mp_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (data: { token: string; user: User }) => {
    if (!Array.isArray(data.user.capabilities)) {
      data.user.capabilities = (data.user.capabilities as any) === 'both' ? ['client', 'freelancer'] : [data.user.capabilities || 'client'];
    }
    if (data.user.clientWorkPreference === 'both' || !data.user.clientWorkPreference) {
      data.user.clientWorkPreference = data.user.activeWorkType || 'digital';
    }
    if (data.user.freelancerWorkPreference === 'both' || !data.user.freelancerWorkPreference) {
      data.user.freelancerWorkPreference = data.user.activeWorkType || 'digital';
    }
    localStorage.setItem('mp_token', data.token);
    localStorage.setItem('mp_user', JSON.stringify(data.user));
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('mp_token');
    localStorage.removeItem('mp_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const switchMode = (mode: UserMode, newToken?: string) => {
    if (newToken) {
      localStorage.setItem('mp_token', newToken);
    }
    const updated = { ...user!, activeMode: mode };
    localStorage.setItem('mp_user', JSON.stringify(updated));
    setUser(updated);
  };

  const switchWorkType = (type: WorkType, newToken?: string) => {
    if (newToken) {
      localStorage.setItem('mp_token', newToken);
    }
    const updated = { ...user!, activeWorkType: type };
    localStorage.setItem('mp_user', JSON.stringify(updated));
    setUser(updated);
  };

  const updateUser = (updates: Partial<User>) => {
    const updated = { ...user!, ...updates };
    localStorage.setItem('mp_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, switchMode, switchWorkType, updateUser }}>
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

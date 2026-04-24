'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  setUser: (u: any) => void;
  loading: boolean;
  currency: string;
  setCurrency: (c: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('NGN');
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedCurrency = localStorage.getItem('currency');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    router.push('/dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSetCurrency = (c: string) => {
    setCurrency(c);
    localStorage.setItem('currency', c);
  };

  const handleSetUser = (u: any) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser: handleSetUser, loading, currency, setCurrency: handleSetCurrency }}>
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

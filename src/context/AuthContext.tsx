import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';
import type { AuthContextType, User } from '../types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // on page refresh, if a token is saved, find out who it belongs to
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    api
      .get<User>('/auth/me/')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.post<{ access: string; refresh: string }>('/auth/login/', {
      username,
      password,
    });
    localStorage.setItem('token', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);
    const me = await api.get<User>('/auth/me/');
    setUser(me.data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  };

  const register = async (username: string, email: string, password: string) => {
    await api.post('/auth/register/', { username, email, password });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin: user?.role === 'admin', login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
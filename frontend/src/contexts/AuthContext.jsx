import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tok = localStorage.getItem('od_token');
    if (!tok) { setLoading(false); return; }
    api.get('/auth/me').then((r) => setUser(r.data)).catch(() => {
      localStorage.removeItem('od_token');
    }).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password });
    localStorage.setItem('od_token', r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };

  const register = async (email, password, full_name) => {
    const r = await api.post('/auth/register', { email, password, full_name });
    localStorage.setItem('od_token', r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };

  const logout = () => {
    localStorage.removeItem('od_token');
    setUser(null);
  };

  const toggleFavorite = async (productId) => {
    if (!user) return;
    const r = await api.post(`/auth/favorites/${productId}`);
    setUser((u) => ({ ...u, favorites: r.data.favorites }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Base API configuration with intelligent fallback
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('netlify.app')
    ? 'https://techfest-2026-api-idrc.onrender.com'
    : 'http://localhost:5000');

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('techfest_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('techfest_token') || null;
  });
  const [loading, setLoading] = useState(false);

  // Set Authorization header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('techfest_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('techfest_token');
    }
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('techfest_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('techfest_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('techfest_user');
    localStorage.removeItem('techfest_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('scvpToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const register = async (email, password, organizationName) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, organizationName }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      localStorage.setItem('scvpToken', data.token);
      setToken(data.token);
      setUser(data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      localStorage.setItem('scvpToken', data.token);
      setToken(data.token);
      setUser({ ...data });

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('scvpToken');
    setToken(null);
    setUser(null);
  };

  // Check for token on load
  useEffect(() => {
    const storedToken = localStorage.getItem('scvpToken');
    if (storedToken) {
      setToken(storedToken);
      setUser({ loggedIn: true });
    }
    setLoading(false);
  }, []);

  return { token, user, loading, error, register, login, logout, clearError: () => setError(null) };
};
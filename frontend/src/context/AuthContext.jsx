import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Apply default Axios credentials heavily to guarantee cookie transmission
  api.defaults.withCredentials = true;

  const verifySession = async () => {
    try {
      setLoadingAuth(true);
      const res = await api.get('/api/auth/me');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  const loginContext = (userData) => {
    if (userData.token) localStorage.setItem('access_token', userData.token);
    setUser(userData);
  };

  const logoutContext = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error("Backend logout failed, forcing frontend clear", err);
    } finally {
      sessionStorage.clear(); // Complete persistent state wipe
      localStorage.removeItem('access_token');
      setUser(null);
      window.location.href = '/login';
    }
  };

  // Removed the global render block so unauthenticated pages (Landing) can load instantly

  return (
    <AuthContext.Provider value={{ user, loadingAuth, loginContext, logoutContext, verifySession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);




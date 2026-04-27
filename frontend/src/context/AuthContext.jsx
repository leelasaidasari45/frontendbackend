import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import api from '../api';

const AuthContext = createContext();

// Max time (ms) to wait for the backend before showing the app anyway.
// Render free-tier cold starts can take 30-60s, so we don't block the UI.
const AUTH_TIMEOUT_MS = 5000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const hasTimedOut = useRef(false);

  // Apply default Axios credentials heavily to guarantee cookie transmission
  api.defaults.withCredentials = true;

  const verifySession = async (silent = false) => {
    if (!silent) setLoadingAuth(true);
    hasTimedOut.current = false;

    // Race the auth check against a timeout so a cold-start backend never
    // freezes the app. If the backend eventually responds after the timeout,
    // we still update the user state silently.
    const timeoutId = setTimeout(() => {
      if (!silent) {
        hasTimedOut.current = true;
        setLoadingAuth(false); // Unblock the UI after timeout
      }
    }, AUTH_TIMEOUT_MS);

    try {
      const res = await api.get('/api/auth/me');
      clearTimeout(timeoutId);
      setUser(res.data);
    } catch (err) {
      clearTimeout(timeoutId);
      setUser(null);
    } finally {
      // Only mark loading done here if we haven't already timed out
      if (!hasTimedOut.current) {
        setLoadingAuth(false);
      }
    }
  };

  useEffect(() => {
    // If a token exists in localStorage we optimistically trust the user is
    // logged in to avoid showing a full-screen spinner. The network call will
    // validate and correct this if needed.
    const cachedToken = localStorage.getItem('access_token');
    if (cachedToken) {
      // Parse cached user profile if available, so the app renders immediately
      const cachedUser = localStorage.getItem('cached_user');
      if (cachedUser) {
        try { setUser(JSON.parse(cachedUser)); } catch (_) {}
      }
      setLoadingAuth(false);
      // Verify silently in the background (no spinner)
      verifySession(true);
    } else {
      verifySession(false);
    }
  }, []);

  const loginContext = (userData) => {
    if (userData.token) localStorage.setItem('access_token', userData.token);
    // Cache user profile for instant restore on next load
    localStorage.setItem('cached_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutContext = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error("Backend logout failed, forcing frontend clear", err);
    } finally {
      sessionStorage.clear();
      localStorage.removeItem('access_token');
      localStorage.removeItem('cached_user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loadingAuth, loginContext, logoutContext, verifySession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);




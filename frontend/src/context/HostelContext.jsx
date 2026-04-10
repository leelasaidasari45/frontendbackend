import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const HostelContext = createContext();

export const HostelProvider = ({ children }) => {
  const [hostels, setHostels] = useState([]);
  const [activeHostel, setActiveHostel] = useState(null);
  const [loadingHostels, setLoadingHostels] = useState(true);

  const { user } = useAuth();

  // Fetch all hostels for the Owner
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setLoadingHostels(true);
        if (user && user.role === 'owner') {
          const res = await api.get('/api/owner/hostels');
          
          setHostels(res.data);
          
          // Determine Active Hostel: Priority: 1. LocalStorage, 2. Fallback to first in list
          const savedLocalId = localStorage.getItem('lastActiveHostelId');
          
          if (res.data.length > 0) {
            const savedHostel = res.data.find(h => h._id === savedLocalId);
            const defaultHostel = savedHostel || res.data[0];
            setActiveHostel(defaultHostel);
          } else {
            setActiveHostel(null);
          }
        } else {
          // Logged out or tenant
          setHostels([]);
          setActiveHostel(null);
        }
      } catch (err) {
        console.error("Failed to load hostels context", err);
      } finally {
        setLoadingHostels(false);
      }
    };

    fetchHostels();
  }, [user]);

  // Expose an updater function
  const switchHostel = useCallback((hostelId) => {
    const selected = hostels.find(h => h._id === hostelId);
    if (selected) {
      setActiveHostel(selected);
      // Persist to localStorage for instant state recovery on refresh
      localStorage.setItem('lastActiveHostelId', selected._id);
      toast.success(`Switched to ${selected.name}`);
    }
  }, [hostels]);

  const contextValue = useMemo(() => ({
    hostels,
    activeHostel,
    switchHostel,
    loadingHostels
  }), [hostels, activeHostel, switchHostel, loadingHostels]);

  return (
    <HostelContext.Provider value={contextValue}>
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => useContext(HostelContext);




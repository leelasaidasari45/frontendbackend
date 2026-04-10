import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from './AuthContext';

const HostelContext = createContext();

export const HostelProvider = ({ children }) => {
  const [hostels, setHostels] = useState([]);
  const [activeHostel, setActiveHostel] = useState(null);
  const [loadingHostels, setLoadingHostels] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'owner') {
      fetchHostels();
    } else {
      setLoadingHostels(false);
    }
  }, [user]);

  const fetchHostels = async () => {
    try {
      setLoadingHostels(true);
      const res = await apiClient.get('/owner/hostels');
      setHostels(res.data);
      if (res.data.length > 0) {
        // Default to the first hostel if none selected
        setActiveHostel(res.data[0]);
      }
    } catch (err) {
      console.log('Error fetching hostels', err);
    } finally {
      setLoadingHostels(false);
    }
  };

  const switchHostel = (hostelId) => {
    const selected = hostels.find(h => h.id === hostelId || h._id === hostelId);
    if (selected) {
      setActiveHostel(selected);
    }
  };

  return (
    <HostelContext.Provider value={{ hostels, activeHostel, loadingHostels, switchHostel, refreshHostels: fetchHostels }}>
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => useContext(HostelContext);

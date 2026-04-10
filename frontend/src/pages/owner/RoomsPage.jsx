import React, { useState, useEffect } from 'react';
import { BuildingIcon, Users, CreditCard, LayoutDashboard, Loader2, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { useHostel } from '../../context/HostelContext';
import OwnerHeader from '../../components/owner/OwnerHeader';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import './OwnerDashboard.css';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeHostel, loadingHostels } = useHostel();

  useEffect(() => {
    const fetchRooms = async () => {
      if (loadingHostels) return;
      if (!activeHostel) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await api.get(`/api/owner/rooms?hostelId=${activeHostel._id}`);
        setRooms(res.data);
      } catch (err) {
        toast.error('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [activeHostel, loadingHostels]);

  if (loadingHostels) {
    return <div className="flex justify-center items-center h-screen"><Loader2 size={48} className="animate-spin text-accent" /></div>;
  }

  // Group rooms by floor
  const floors = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {});

  return (
    <div className="dashboard-layout">
      <OwnerSidebar />

      <main className="dashboard-content fade-in">
        <OwnerHeader 
          title="Rooms Overview" 
          subtitle="Visual Floor-wise occupancy tracking" 
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={48} className="animate-spin text-accent" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="glass-panel p-8 text-center text-muted">
            No rooms found. Ensure your property is initialized.
          </div>
        ) : (
          <div className="rooms-container">
            {Object.keys(floors).sort().map(floorNum => (
              <div key={floorNum} className="floor-section mb-8 slide-up">
                <h3 className="mb-4">Floor {floorNum}</h3>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                  {floors[floorNum].map(room => {
                    const isOccupied = room.occupants.length > 0;
                    const isFull = room.occupants.length >= room.capacity;
                    return (
                      <div key={room._id} className="room-card glass-panel p-4 text-center flex-col items-center">
                        <div
                          className="status-dot mb-2"
                          style={{
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: isFull ? 'var(--danger)' : isOccupied ? 'var(--warning)' : 'var(--success)',
                            boxShadow: `0 0 10px ${isFull ? 'var(--danger)' : isOccupied ? 'var(--warning)' : 'var(--success)'}`
                          }}
                        ></div>
                        <h4>{room.number}</h4>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {room.occupants.length}/{room.capacity} Beds
                        </span>
                        {room.occupants.length > 0 && (
                          <div className="mt-2 text-xs flex flex-col gap-1 text-left w-full border-t border-glass pt-2">
                            {room.occupants.map(occ => (
                              <span key={occ._id} className="truncate">{occ.user?.name || 'Tenant'}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RoomsPage;



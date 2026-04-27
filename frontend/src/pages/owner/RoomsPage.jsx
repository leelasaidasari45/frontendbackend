import React, { useState, useEffect } from 'react';
import { Loader2, Building2, BedDouble } from 'lucide-react';
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
      if (!activeHostel) { setLoading(false); return; }
      try {
        setLoading(true);
        const res = await api.get(`/api/owner/rooms?hostelId=${activeHostel._id}`);
        setRooms(res.data);
      } catch { toast.error('Failed to load rooms'); }
      finally { setLoading(false); }
    };
    fetchRooms();
  }, [activeHostel, loadingHostels]);

  if (loadingHostels) return <div className="flex justify-center items-center h-screen"><Loader2 size={40} className="animate-spin" style={{ color:'var(--aurora-1)' }} /></div>;

  const floors = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room); return acc;
  }, {});

  return (
    <div className="dashboard-layout">
      <OwnerSidebar />
      <main className="dashboard-content fade-in">
        <OwnerHeader title="Rooms Overview" subtitle="Occupancy tracking" />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={40} className="animate-spin" style={{ color:'var(--aurora-1)' }} />
          </div>
        ) : rooms.length === 0 ? (
          <div className="glass-panel p-8 text-center" style={{ maxWidth:400, margin:'4rem auto' }}>
            <Building2 size={48} style={{ color:'var(--text-dim)', margin:'0 auto 1rem', display:'block' }} />
            <p style={{ color:'var(--text-dim)' }}>No rooms found. Initialize your property first.</p>
          </div>
        ) : (
          <>
            {/* Legend */}
            <div style={{ display:'flex', gap:'1.25rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
              {[['var(--success)','Empty'],['var(--warning)','Partial'],['var(--danger)','Full']].map(([color, label]) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:'.5rem', fontSize:'.82rem', color:'var(--text-dim)' }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}` }} />
                  {label}
                </div>
              ))}
            </div>
            {Object.keys(floors).sort().map(floorNum => {
              const floorRooms = floors[floorNum];
              const occupied = floorRooms.filter(r => r.occupants.length > 0).length;
              return (
                <div key={floorNum} className="floor-section slide-up">
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
                    <h3 style={{ margin:0 }}>Floor {floorNum}</h3>
                    <span className="badge badge-aurora">{occupied}/{floorRooms.length} occupied</span>
                  </div>
                  <div className="rooms-grid">
                    {floorRooms.map(room => {
                      const isFull = room.occupants.length >= room.capacity;
                      const isOccupied = room.occupants.length > 0;
                      const statusColor = isFull ? 'var(--danger)' : isOccupied ? 'var(--warning)' : 'var(--success)';
                      return (
                        <div key={room._id} className={`room-card ${isFull?'occupied':isOccupied?'occupied':''}`}>
                          <div style={{ width:10, height:10, borderRadius:'50%', background:statusColor, boxShadow:`0 0 8px ${statusColor}`, marginBottom:'.5rem' }} />
                          <h4 style={{ fontSize:'.95rem', margin:0 }}>{room.number}</h4>
                          <div style={{ display:'flex', alignItems:'center', gap:'.3rem', marginTop:'.25rem' }}>
                            <BedDouble size={13} style={{ color:'var(--text-dim)' }} />
                            <span style={{ fontSize:'.75rem', color:'var(--text-dim)' }}>{room.occupants.length}/{room.capacity}</span>
                          </div>
                          {room.occupants.length > 0 && (
                            <div style={{ marginTop:'.5rem', width:'100%', borderTop:'1px solid var(--border-subtle)', paddingTop:'.5rem', display:'flex', flexDirection:'column', gap:'.2rem' }}>
                              {room.occupants.map(occ => (
                                <span key={occ._id} style={{ fontSize:'.72rem', color:'var(--text-dim)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                  {occ.user?.name || 'Tenant'}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
};

export default RoomsPage;

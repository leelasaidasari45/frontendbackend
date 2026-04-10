import React, { useState, useEffect } from 'react';
import { BuildingIcon, Users, LayoutDashboard, Loader2, MessageSquare, CheckCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { useHostel } from '../../context/HostelContext';
import OwnerHeader from '../../components/owner/OwnerHeader';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import './OwnerDashboard.css';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeHostel, loadingHostels } = useHostel();

  const fetchComplaints = async () => {
    if (loadingHostels) return;
    if (!activeHostel) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/api/owner/complaints?hostelId=${activeHostel._id}`);
      setComplaints(res.data);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [activeHostel, loadingHostels]);

  if (loadingHostels) {
    return <div className="flex justify-center items-center h-screen"><Loader2 size={48} className="animate-spin text-accent" /></div>;
  }

  const handleResolve = async (id) => {
    try {
      await api.put(`/api/owner/complaints/${id}/resolve`);
      toast.success("Complaint marked as resolved!");
      fetchComplaints(); // update local state naturally via refetch
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resolve complaint");
    }
  };

  return (
    <div className="dashboard-layout">
      <OwnerSidebar />

      <main className="dashboard-content fade-in">
        <OwnerHeader 
          title="Complaints Center" 
          subtitle="Track and resolve tenant issues" 
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={48} className="animate-spin text-accent" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="glass-panel p-8 text-center text-muted">
            No complaints found. Your property is running perfectly!
          </div>
        ) : (
          <div className="grid gap-4">
            {complaints.map(complaint => (
              <div key={complaint._id} className="glass-panel p-5" style={{ borderLeft: `4px solid ${complaint.status === 'resolved' ? 'var(--success)' : 'var(--warning)'}` }}>
                <div className="flex justify-between items-start gap-4" style={{ flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold" style={{
                        background: complaint.status === 'resolved' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                        color: complaint.status === 'resolved' ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {complaint.status === 'resolved' ? '✓ Resolved' : '● Open'}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(complaint.createdAt || complaint.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{complaint.description || complaint.issue || 'No description'}</p>
                    <div className="flex gap-4" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span>👤 <strong>{complaint.tenantName || 'Unknown'}</strong></span>
                      <span>🚪 Room <strong>{complaint.roomNumber || 'N/A'}</strong></span>
                    </div>
                  </div>
                  {complaint.status !== 'resolved' && (
                    <button
                      onClick={() => handleResolve(complaint._id)}
                      className="btn"
                      style={{ background: 'var(--success)', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', padding: '0.5rem 1.25rem' }}
                    >
                      <CheckCircle size={16} /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ComplaintsPage;



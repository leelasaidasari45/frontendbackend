import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, MessageSquare } from 'lucide-react';
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
    if (!activeHostel) { setLoading(false); return; }
    try {
      setLoading(true);
      const res = await api.get(`/api/owner/complaints?hostelId=${activeHostel._id}`);
      setComplaints(res.data);
    } catch { toast.error('Failed to load complaints'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, [activeHostel, loadingHostels]);

  const handleResolve = async (id) => {
    try {
      await api.put(`/api/owner/complaints/${id}/resolve`);
      toast.success('Marked as resolved!');
      fetchComplaints();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loadingHostels) return <div className="flex justify-center items-center h-screen"><Loader2 size={40} className="animate-spin" style={{ color:'var(--aurora-1)' }} /></div>;

  const open = complaints.filter(c => c.status !== 'resolved');
  const resolved = complaints.filter(c => c.status === 'resolved');

  return (
    <div className="dashboard-layout">
      <OwnerSidebar />
      <main className="dashboard-content fade-in">
        <OwnerHeader title="Complaints Center" subtitle="Issue tracking" />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={40} className="animate-spin" style={{ color:'var(--aurora-1)' }} />
          </div>
        ) : complaints.length === 0 ? (
          <div className="glass-panel p-8 text-center" style={{ maxWidth:440, margin:'4rem auto' }}>
            <MessageSquare size={48} style={{ color:'var(--success)', margin:'0 auto 1rem', display:'block' }} />
            <h3 style={{ marginBottom:'.5rem' }}>All Clear!</h3>
            <p style={{ color:'var(--text-dim)' }}>No complaints found. Your property is running perfectly!</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="stats-grid slide-up" style={{ marginBottom:'1.5rem' }}>
              <div className="stat-card">
                <p>Open Issues</p>
                <h3 style={{ color:'var(--warning)' }}>{open.length}</h3>
              </div>
              <div className="stat-card">
                <p>Resolved</p>
                <h3 style={{ color:'var(--success)' }}>{resolved.length}</h3>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
              {complaints.map(complaint => {
                const isResolved = complaint.status === 'resolved';
                return (
                  <div key={complaint._id} className="glass-panel p-5 fade-in"
                    style={{ borderLeft:`3px solid ${isResolved ? 'var(--success)' : 'var(--warning)'}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem', flexWrap:'wrap' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'.6rem' }}>
                          <span className={`badge ${isResolved ? 'badge-success' : 'badge-warning'}`}>
                            {isResolved ? '✓ Resolved' : '● Open'}
                          </span>
                          <span style={{ fontSize:'.78rem', color:'var(--text-dim)' }}>
                            {new Date(complaint.createdAt || complaint.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ fontWeight:600, marginBottom:'.5rem', lineHeight:1.5 }}>
                          {complaint.description || complaint.issue || 'No description'}
                        </p>
                        <div style={{ display:'flex', gap:'1rem', fontSize:'.83rem', color:'var(--text-dim)' }}>
                          <span>👤 <strong>{complaint.tenantName || 'Unknown'}</strong></span>
                          <span>🚪 Room <strong>{complaint.roomNumber || 'N/A'}</strong></span>
                        </div>
                      </div>
                      {!isResolved && (
                        <button className="btn btn-success btn-sm" onClick={() => handleResolve(complaint._id)}>
                          <CheckCircle size={15} /> Resolve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ComplaintsPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

const SelectRolePage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const { loginContext, user } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = async () => {
    if (!selectedRole) return toast.error('Please select a role to continue');

    setLoading(true);
    try {
      const res = await api.put('/api/auth/update-role', { role: selectedRole });
      
      // Update local context with new role
      loginContext({ ...user, role: res.data.role, token: res.data.token });
      
      toast.success(`Welcome aboard as a ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}!`);
      
      // Navigate to respective dashboard
      if (selectedRole === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/tenant/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container bg-[#0f172a] flex flex-col items-center justify-center" style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div className="max-w-md w-full mx-auto slide-up text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Choose Your Path</h1>
        <p className="text-slate-400 text-sm mb-8">How will you be using easyPG?</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Owner Selection */}
          <div 
            onClick={() => setSelectedRole('owner')}
            className={`selection-tile glass-panel p-5 cursor-pointer transition-all duration-300 transform flex flex-col items-center gap-3 ${
              selectedRole === 'owner' ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : 'hover:bg-white/5'
            }`}
          >
            <div className={`p-3 rounded-xl ${selectedRole === 'owner' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-indigo-400'}`}>
              <Building2 size={24} />
            </div>
            <span className="text-sm font-semibold text-white">Hostel Owner</span>
            {selectedRole === 'owner' && <CheckCircle2 className="text-indigo-500 absolute top-2 right-2" size={16} />}
          </div>

          {/* Tenant Selection */}
          <div 
            onClick={() => setSelectedRole('tenant')}
            className={`selection-tile glass-panel p-5 cursor-pointer transition-all duration-300 transform flex flex-col items-center gap-3 ${
              selectedRole === 'tenant' ? 'ring-2 ring-emerald-500 bg-emerald-500/10' : 'hover:bg-white/5'
            }`}
          >
            <div className={`p-3 rounded-xl ${selectedRole === 'tenant' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-emerald-400'}`}>
              <User size={24} />
            </div>
            <span className="text-sm font-semibold text-white">Resident</span>
            {selectedRole === 'tenant' && <CheckCircle2 className="text-emerald-500 absolute top-2 right-2" size={16} />}
          </div>
        </div>

        <button 
          onClick={handleRoleSelection}
          disabled={!selectedRole || loading}
          className={`btn btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
            !selectedRole ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={18} /></>}
        </button>
      </div>

      <style>{`
        .selection-tile {
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.25rem;
          position: relative;
        }
        .slide-up {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SelectRolePage;

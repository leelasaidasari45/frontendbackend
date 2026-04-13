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
    <div className="auth-container bg-[#0f172a] flex flex-col items-center justify-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="max-w-2xl w-full mx-auto slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Path</h1>
          <p className="text-slate-400">How will you be using easyPG?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Owner Card */}
          <div 
            onClick={() => setSelectedRole('owner')}
            className={`role-card glass-panel p-6 cursor-pointer transition-all duration-300 transform ${
              selectedRole === 'owner' ? 'ring-2 ring-indigo-500 scale-[1.02] bg-indigo-500/10' : 'hover:scale-[1.01] hover:bg-white/5'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${selectedRole === 'owner' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                <Building2 size={28} />
              </div>
              {selectedRole === 'owner' && <CheckCircle2 className="text-indigo-500" size={20} />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hostel Owner</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Manage rooms, automate rent, and track complaints.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full" /> QR-based onboarding</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full" /> Digital ledger</li>
            </ul>
          </div>

          {/* Tenant Card */}
          <div 
            onClick={() => setSelectedRole('tenant')}
            className={`role-card glass-panel p-6 cursor-pointer transition-all duration-300 transform ${
              selectedRole === 'tenant' ? 'ring-2 ring-emerald-500 scale-[1.02] bg-emerald-500/10' : 'hover:scale-[1.01] hover:bg-white/5'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${selectedRole === 'tenant' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-emerald-400'}`}>
                <User size={28} />
              </div>
              {selectedRole === 'tenant' && <CheckCircle2 className="text-emerald-500" size={20} />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Resident</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Pay rent easily and report maintenance issues.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Digital payments</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Issue reporting</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button 
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
            className={`btn btn-primary w-full max-w-sm py-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
              !selectedRole ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Continue Application <ArrowRight size={20} /></>}
          </button>
        </div>
      </div>

      <style>{`
        .role-card {
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.5rem;
          display: flex;
          flex-direction: column;
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

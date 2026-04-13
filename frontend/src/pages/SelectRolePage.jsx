import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

const SelectRolePage = () => {
  const [loading, setLoading] = useState(false);
  const { loginContext, user } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    setLoading(true);
    try {
      const res = await api.put('/api/auth/update-role', { role });
      
      // Update local context with new role
      loginContext({ ...user, role: res.data.role, token: res.data.token });
      
      toast.success(`Welcome aboard!`);
      
      // Navigate to respective dashboard
      if (role === 'owner') {
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
    <div className="role-selection-wrapper">
      <div className="mesh-background"></div>
      
      <div className="content-container slide-up">
        <div className="header-section">
          <h1 className="main-title">Welcome!</h1>
          <p className="sub-title">Tell us how you'll be using easyPG</p>
        </div>

        <div className="role-menu glass-effect">
          {/* Owner Option */}
          <button 
            onClick={() => handleRoleSelection('owner')}
            disabled={loading}
            className="role-item group"
          >
            <div className="icon-circle icon-owner shadow-indigo">
              <Building2 size={32} />
            </div>
            <div className="item-text">
              <h3 className="item-title">I am a Hostel Owner</h3>
              <p className="item-desc">I want to manage rooms and tenants</p>
            </div>
            <div className="arrow-wrapper">
              <ChevronRight size={24} className="group-hover:translate-x-1" />
            </div>
          </button>

          <div className="menu-divider"></div>

          {/* Tenant Option */}
          <button 
            onClick={() => handleRoleSelection('tenant')}
            disabled={loading}
            className="role-item group"
          >
            <div className="icon-circle icon-tenant shadow-emerald">
              <User size={32} />
            </div>
            <div className="item-text">
              <h3 className="item-title">I am a Resident</h3>
              <p className="item-desc">I am looking for or staying in a room</p>
            </div>
            <div className="arrow-wrapper">
              <ChevronRight size={24} className="group-hover:translate-x-1" />
            </div>
          </button>
        </div>

        {loading && (
          <div className="loading-overlay">
            <Loader2 className="animate-spin text-white" size={32} />
            <p>Setting up your dashboard...</p>
          </div>
        )}
      </div>

      <style>{`
        .role-selection-wrapper {
          min-height: 100vh;
          background-color: #020617;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }

        .mesh-background {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 20%, #1e1b4b 0%, transparent 40%),
                      radial-gradient(circle at 80% 80%, #064e3b 0%, transparent 40%);
          filter: blur(100px);
          opacity: 0.5;
        }

        .content-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          letter-spacing: -2px;
          background: linear-gradient(to bottom, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sub-title {
          color: #94a3b8;
          font-size: 1.1rem;
        }

        .role-menu {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 2.5rem;
          padding: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .role-item {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2rem;
          text-align: left;
        }

        .role-item:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.5rem;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .icon-owner {
          background: #4f46e5;
          color: white;
        }

        .shadow-indigo {
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.2);
        }

        .icon-tenant {
          background: #10b981;
          color: white;
        }

        .shadow-emerald {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }

        .role-item:hover .icon-circle {
          transform: scale(1.1);
          box-shadow: 0 0 30px currentColor;
        }

        .item-text {
          flex: 1;
        }

        .item-title {
          color: white;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .item-desc {
          color: #64748b;
          font-size: 0.9rem;
        }

        .arrow-wrapper {
          color: #334155;
          transition: all 0.3s ease;
        }

        .role-item:hover .arrow-wrapper {
          color: white;
        }

        .menu-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent);
          margin: 0.5rem 0;
        }

        .loading-overlay {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .slide-up {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .main-title { font-size: 2.5rem; }
          .icon-circle { width: 56px; height: 56px; }
          .role-item { padding: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default SelectRolePage;

import React, { useState } from 'react';
import { BuildingIcon, ArrowRight, Phone, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OwnerHeader from '../../components/owner/OwnerHeader';
import OwnerSidebar from '../../components/owner/OwnerSidebar';
import './OwnerDashboard.css';

const BasicHostelSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    capacity: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to session storage to use later after payment
    sessionStorage.setItem('pendingHostelSetup', JSON.stringify(formData));
    // Redirect to Payment Plan
    navigate('/owner/select-plan');
  };

  return (
    <div className="dashboard-layout">
      <OwnerSidebar />

      <main className="dashboard-content fade-in" style={{ padding: '2rem' }}>
        <OwnerHeader 
          title="Setup New Property" 
          subtitle="Step 1 of 3: Basic Details" 
        />

        <div className="glass-panel p-8" style={{ width: '100%', maxWidth: '600px', margin: '4rem auto 0' }}>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="icon-wrapper" style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)', width: '64px', height: '64px' }}>
              <BuildingIcon size={32} />
            </div>
            <h2 className="mt-4 mb-2">Property Basics</h2>
            <p className="text-muted">Enter the primary details for your new hostel before proceeding to the architecture and billing setup.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex-col gap-6">
            <div className="form-group">
              <label className="form-label">Hostel Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <BuildingIcon size={18} />
                </div>
                <input
                  type="text"
                  className="form-control pl-12"
                  placeholder="e.g. Prestige Boys Hostel"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  className="form-control pl-12"
                  placeholder="e.g. 9876543210"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-8">
              <label className="form-label">Total Capacity (Beds)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <Users size={18} />
                </div>
                <input
                  type="number"
                  className="form-control pl-12"
                  placeholder="e.g. 150"
                  min="1"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg flex justify-center items-center gap-2">
              Continue to Billing <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BasicHostelSetup;

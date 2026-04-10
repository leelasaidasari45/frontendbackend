import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BuildingIcon, MessageSquare, Plus } from 'lucide-react';

const OwnerSidebar = () => {
    const location = useLocation();
    
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar glass-panel slide-up">
            <Link to="/" className="logo flex items-center gap-2 mb-8" style={{ textDecoration: 'none' }}>
                <h2 className="text-gradient">easyPG</h2>
            </Link>

            <nav className="sidebar-nav flex-col gap-2">
                <Link to="/owner/dashboard" className={`nav-item ${isActive('/owner/dashboard') ? 'active' : ''}`}>
                    <LayoutDashboard size={20} /> Home
                </Link>
                <Link to="/owner/tenants" className={`nav-item ${isActive('/owner/tenants') ? 'active' : ''}`}>
                    <Users size={20} /> Tenants
                </Link>
                <Link to="/owner/rooms" className={`nav-item ${isActive('/owner/rooms') ? 'active' : ''}`}>
                    <BuildingIcon size={20} /> Rooms
                </Link>
                <Link to="/owner/complaints" className={`nav-item ${isActive('/owner/complaints') ? 'active' : ''}`}>
                    <MessageSquare size={20} /> Issues
                </Link>
                <Link to="/owner/past-tenants" className={`nav-item ${isActive('/owner/past-tenants') ? 'active' : ''}`}>
                    <Users size={20} /> Vacated
                </Link>
                
                {/* Special "Add" button with improved color and alignment-friendly class */}
                <Link 
                    to="/owner/create-hostel" 
                    className={`nav-item nav-item-create ${isActive('/owner/create-hostel') ? 'active' : ''}`}
                >
                    <Plus size={20} /> Add
                </Link>
            </nav>
        </aside>
    );
};

export default OwnerSidebar;

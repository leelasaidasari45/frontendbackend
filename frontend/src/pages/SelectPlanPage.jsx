import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, ShieldCheck, Loader2, LogOut, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const SelectPlanPage = () => {
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success
    const navigate = useNavigate();
    const { logoutContext } = useAuth();

    // Check if they came from the basic setup step
    useEffect(() => {
        const pendingSetup = sessionStorage.getItem('pendingHostelSetup');
        if (!pendingSetup) {
            // If they just logged in and haven't started setup, send them to dashboard
            navigate('/owner/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleLogout = async () => {
        await logoutContext();
    };

    const handleSimulatedPayment = () => {
        setLoading(true);
        setPaymentStatus('processing');

        // Simulate Paytm Gateway Processing (3 seconds)
        setTimeout(() => {
            setPaymentStatus('success');
            setLoading(false);
            toast.success('Payment & Auto-Pay Setup Successful!');
            
            // Wait 2 seconds for user to see success state, then redirect to architecture builder
            setTimeout(() => {
                navigate('/owner/create-hostel');
            }, 2000);

        }, 3000);
    };

    return (
        <div className="auth-container" style={{ padding: '2rem' }}>
            {paymentStatus === 'processing' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="glass-panel p-8 text-center flex-col items-center" style={{ width: '400px' }}>
                        <div className="mb-6 relative">
                            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                            <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" size={20} />
                        </div>
                        <h3 className="mb-2">Connecting to Bank...</h3>
                        <p className="text-muted text-sm">Please do not close or refresh this window.</p>
                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-emerald-400">
                            <ShieldCheck size={14} /> Secured by Paytm Gateway
                        </div>
                    </div>
                </div>
            )}

            {paymentStatus === 'success' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="glass-panel p-8 text-center flex-col items-center border-success" style={{ width: '400px', borderColor: 'var(--success)' }}>
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={32} />
                        </div>
                        <h2 className="mb-2 text-emerald-400">Payment Verified</h2>
                        <p className="text-muted text-sm">Mandate registered successfully. Redirecting you to property builder...</p>
                    </div>
                </div>
            )}

            <div className="auth-card glass-panel slide-up" style={{ maxWidth: '800px', width: '100%' }}>
                <div className="flex justify-between items-center mb-6">
                    <div className="text-xs text-muted">Step 2 of 3: Billing Setup</div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                        <LogOut size={16} /> Cancel Setup
                    </button>
                </div>
                
                <div className="text-center mb-8">
                    <div className="icon-wrapper mb-4" style={{ margin: '0 auto', background: 'var(--warning)', color: '#000' }}>
                        <Crown size={32} />
                    </div>
                    <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Complete <span className="text-gradient">Property Activation</span></h1>
                    <p className="text-muted mt-4">Set up your account to unlock the full architecture builder and management suite.</p>
                </div>

                <div className="grid gap-8 mt-10" style={{ gridTemplateColumns: 'minmax(300px, 1fr)' }}>
                    <div className="price-card glass-panel p-8 relative overflow-hidden" style={{ border: '2px solid var(--accent-primary)', position: 'relative' }}>
                        <div className="premium-badge" style={{ position: 'absolute', top: '1rem', right: '-2rem', background: 'var(--accent-primary)', color: '#fff', padding: '0.5rem 3rem', transform: 'rotate(45deg)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            FOUNDER TIER
                        </div>
                        
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>SaaS Licensing & Setup</h3>
                                <p className="text-muted">Includes deployment & software access</p>
                            </div>
                            <div className="text-right">
                                <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>₹20k</span>
                                <span className="text-muted block text-sm mt-1">+ ₹2,000/mo Auto-Pay</span>
                            </div>
                        </div>

                        <ul className="flex flex-col gap-4 mb-8 pt-6 border-t border-glass">
                            <li className="flex gap-3"><Check size={20} color="var(--accent-primary)" /> <span className="text-muted">One-time configuration fee:</span> <strong>₹20,000</strong></li>
                            <li className="flex gap-3"><Check size={20} color="var(--accent-primary)" /> <span className="text-muted">Monthly maintenance (Auto-deduct):</span> <strong>₹2,000</strong></li>
                        </ul>

                        <button 
                            onClick={handleSimulatedPayment} 
                            disabled={loading || paymentStatus !== 'idle'}
                            className="btn btn-primary w-full p-4 flex justify-center items-center gap-2" 
                            style={{ fontSize: '1.1rem', fontWeight: 'bold', height: 'auto' }}
                        >
                            Pay & Register Mandate with Paytm
                        </button>
                        
                        <p className="text-xs text-muted text-center mt-4 flex items-center justify-center gap-1">
                            <ShieldCheck size={14} /> End-to-end encrypted by Paytm Gateway.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectPlanPage;

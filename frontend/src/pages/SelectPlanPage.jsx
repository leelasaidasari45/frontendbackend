import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import OwnerSidebar from '../components/owner/OwnerSidebar';
import OwnerHeader from '../components/owner/OwnerHeader';
import './owner/OwnerDashboard.css';

const SelectPlanPage = () => {
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success
    const navigate = useNavigate();

    // Check if they came from the basic setup step
    useEffect(() => {
        const pendingSetup = sessionStorage.getItem('pendingHostelSetup');
        if (!pendingSetup) {
            navigate('/owner/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleSimulatedPayment = () => {
        setLoading(true);
        setPaymentStatus('processing');

        // Simulate Paytm Gateway Processing
        setTimeout(() => {
            setPaymentStatus('success');
            setLoading(false);
            toast.success('Payment & Auto-Pay Setup Successful!');
            
            setTimeout(() => {
                navigate('/owner/create-hostel');
            }, 2000);
        }, 3000);
    };

    return (
        <div className="dashboard-layout">
            <OwnerSidebar />

            <main className="dashboard-content fade-in" style={{ padding: '2rem' }}>
                <OwnerHeader 
                    title="Setup New Property" 
                    subtitle="Step 2 of 3: Billing & Activation" 
                />

                {/* Simulated Payment Modals */}
                {paymentStatus === 'processing' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="glass-panel p-8 text-center flex flex-col items-center slide-up" style={{ width: '400px' }}>
                            <div className="mb-6 relative">
                                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                                <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" size={20} />
                            </div>
                            <h3 className="mb-2">Connecting to Bank...</h3>
                            <p className="text-muted text-sm mb-6">Please do not close or refresh this window.</p>
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                                <ShieldCheck size={14} /> Secured by Paytm Gateway
                            </div>
                        </div>
                    </div>
                )}

                {paymentStatus === 'success' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="glass-panel p-8 text-center flex flex-col items-center slide-up" style={{ width: '400px', border: '1px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}>
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={32} />
                            </div>
                            <h2 className="mb-2 text-emerald-400">Payment Verified</h2>
                            <p className="text-muted text-sm">Mandate registered successfully. Redirecting you to property builder...</p>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex flex-col items-center" style={{ marginTop: '3rem' }}>
                    <button 
                        onClick={() => navigate('/owner/setup-basic')}
                        className="flex items-center gap-2 text-muted hover-text-primary transition-colors mb-6 self-start md:self-auto md:absolute md:left-12"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <ArrowLeft size={16} /> Back to Details
                    </button>

                    <div className="text-center mb-10">
                        <div className="icon-wrapper mb-4" style={{ margin: '0 auto', background: 'var(--warning)', color: '#000', width: '56px', height: '56px' }}>
                            <Crown size={28} />
                        </div>
                        <h1 className="hero-title mb-2">Complete <span className="text-gradient">Activation</span></h1>
                        <p className="text-muted">Secure your license and set up automated maintenance billing.</p>
                    </div>

                    <div className="glass-panel p-0 relative overflow-hidden slide-up" style={{ width: '100%', maxWidth: '500px', border: '1px solid var(--accent-primary)' }}>
                        <div className="absolute top-0 right-0 bg-accent-primary text-white text-xs font-bold px-4 py-1 rounded-bl-lg" style={{ background: 'var(--accent-primary)' }}>
                            FOUNDER TIER
                        </div>
                        
                        <div className="p-8 pb-6 border-b border-glass">
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>SaaS Licensing</h3>
                            <p className="text-muted text-sm mb-6">Unlimited architecture deployment & tenant management.</p>
                            
                            <div className="flex flex-col gap-1">
                                <div className="flex items-end gap-2">
                                    <span style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1' }}>₹20k</span>
                                    <span className="text-muted mb-1 text-sm">one-time setup</span>
                                </div>
                                <div className="text-accent-primary font-bold text-sm mt-2">
                                    + ₹2,000 / month Auto-Pay
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-6 bg-secondary" style={{ background: 'var(--bg-secondary)' }}>
                            <ul className="flex flex-col gap-4 mb-8">
                                <li className="flex gap-3 text-sm"><Check size={18} color="var(--accent-primary)" className="shrink-0" /> <span><strong>₹20,000</strong> platform configuration and license deployment fee.</span></li>
                                <li className="flex gap-3 text-sm"><Check size={18} color="var(--accent-primary)" className="shrink-0" /> <span><strong>₹2,000</strong> monthly automated maintenance and server charges.</span></li>
                            </ul>

                            <button 
                                onClick={handleSimulatedPayment} 
                                disabled={loading || paymentStatus !== 'idle'}
                                className="btn btn-primary w-full py-4 flex justify-center items-center gap-2" 
                                style={{ fontSize: '1rem', fontWeight: 'bold' }}
                            >
                                Pay & Register Mandate via Paytm
                            </button>
                            
                            <p className="text-xs text-muted text-center mt-5 flex items-center justify-center gap-1.5 opacity-70">
                                <ShieldCheck size={14} /> End-to-end encrypted by Paytm
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SelectPlanPage;

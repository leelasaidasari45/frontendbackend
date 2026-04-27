import React, { useState } from 'react';
import { Home, CreditCard, MessageSquare, ArrowRightCircle, IndianRupee, CheckCircle2, Loader2, ShieldCheck, LogOut, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import './TenantDashboard.css';

const tabs = [
  { id: 'dashboard', label: 'Home', icon: <Home size={16} /> },
  { id: 'rent', label: 'Rent', icon: <CreditCard size={16} /> },
  { id: 'complaints', label: 'Issues', icon: <MessageSquare size={16} /> },
  { id: 'vacate', label: 'Vacate', icon: <ArrowRightCircle size={16} /> },
];

const TenantDashboard = () => {
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [amount] = useState(5000);
  const month = 'April 2026';
  const [activeTab, _setActiveTab] = useState(() => sessionStorage.getItem('tenantActiveTab') || 'dashboard');
  const setActiveTab = (tab) => { _setActiveTab(tab); sessionStorage.setItem('tenantActiveTab', tab); };
  const [complaintText, setComplaintText] = useState('');
  const [complaintName, setComplaintName] = useState('');
  const [complaintRoom, setComplaintRoom] = useState('');
  const [vacateDate, setVacateDate] = useState('');
  const [vacateReason, setVacateReason] = useState('');
  const [loadingComplaint, setLoadingComplaint] = useState(false);
  const [loadingVacate, setLoadingVacate] = useState(false);
  const [dashData, setDashData] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const { logoutContext } = useAuth();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ps = params.get('payment');
    if (ps === 'success') { toast.success(`Payment successful! Txn: ${params.get('txn')}`); setPaymentSuccess(true); window.history.replaceState({}, '', '/tenant/dashboard'); }
    else if (ps === 'failed') { toast.error(params.get('msg') || 'Payment failed'); window.history.replaceState({}, '', '/tenant/dashboard'); }
    else if (ps === 'error') { toast.error('Payment error. Try again.'); window.history.replaceState({}, '', '/tenant/dashboard'); }
  }, []);

  React.useEffect(() => {
    const fetchDash = async () => {
      try {
        const res = await api.get('/api/tenant/dashboard');
        const st = res.data.tenant.status;
        if (st === 'pending' || st === 'new') { navigate('/tenant/join'); return; }
        if (st === 'vacated' || st === 'rejected') {
          toast(st === 'rejected' ? 'Application not approved.' : 'Stay ended. Join a new hostel.', { icon: st === 'rejected' ? '❌' : 'ℹ️' });
          navigate('/tenant/join'); return;
        }
        setDashData(res.data);
      } catch (err) { if (err.response?.status === 404) navigate('/tenant/join'); }
      finally { setLoadingConfig(false); }
    };
    fetchDash();
  }, [navigate]);

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const res = await api.post('/api/paytm/initiate', { amount, month });
      const { txnToken, orderId, mid } = res.data;
      const script = document.createElement('script');
      script.src = `https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/${mid}.js`;
      script.crossOrigin = 'anonymous'; script.type = 'application/javascript';
      script.onload = () => {
        const config = { root:'', data:{ orderId, token:txnToken, tokenType:'TXN_TOKEN', amount:String(amount) }, website:'WEBSTAGING', flow:'DEFAULT', merchant:{ mid, redirect:true }, handler:{ notifyMerchant:(n)=>{ if(n==='APP_CLOSED') setIsPaying(false); } } };
        if (window.Paytm?.CheckoutJS) window.Paytm.CheckoutJS.onLoad(() => window.Paytm.CheckoutJS.init(config).then(()=>window.Paytm.CheckoutJS.invoke()).catch(()=>{ toast.error('Checkout failed'); setIsPaying(false); }));
      };
      script.onerror = () => { toast.error('Failed to load gateway'); setIsPaying(false); };
      document.body.appendChild(script);
    } catch (err) { toast.error(err.response?.data?.error || 'Payment failed'); setIsPaying(false); }
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    setLoadingComplaint(true);
    try {
      await api.post('/api/tenant/complaints', { issue: complaintText, tenantName: complaintName || dashData?.tenant?.name, roomNumber: complaintRoom || dashData?.tenant?.roomNumber });
      toast.success('Complaint submitted!');
      setComplaintText(''); setComplaintName(''); setComplaintRoom('');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoadingComplaint(false); }
  };

  const submitVacate = async (e) => {
    e.preventDefault();
    setLoadingVacate(true);
    try {
      await api.post('/api/tenant/vacate', { vacateDate, vacateReason });
      toast.success('Vacate notice submitted.');
      const res = await api.get('/api/tenant/dashboard');
      setDashData(res.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoadingVacate(false); }
  };

  const titleMap = { dashboard: 'Overview', rent: 'Rent & Dues', complaints: 'Help & Support', vacate: 'Notice to Vacate' };

  return (
    <div className="dashboard-layout">
      {/* Sidebar (mobile = bottom nav) */}
      <aside className="sidebar">
        <Link to="/" style={{ textDecoration:'none' }}>
          <div className="logo-wrap" title="easyPG"><Building2 size={20} color="#fff" /></div>
        </Link>
        <div className="sidebar-divider" />
        <nav className="sidebar-nav">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`nav-item ${activeTab===t.id?'active':''}`} title={t.label}>
              {t.icon}
              <span className="nav-label">{t.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-content fade-in">
        {/* Header */}
        <header className="dashboard-header glass-panel">
          <div>
            <h1>{titleMap[activeTab]}</h1>
            {activeTab === 'dashboard' && dashData && (
              <p style={{ color:'var(--text-dim)', fontSize:'.88rem', marginTop:'.15rem' }}>
                Welcome to <strong style={{ color:'var(--aurora-1)' }}>{dashData.hostelName}</strong>
              </p>
            )}
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <button onClick={logoutContext} className="header-logout-btn"><LogOut size={16} /> <span className="btn-label">Logout</span></button>
          </div>
        </header>

        {loadingConfig ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={40} className="animate-spin" style={{ color:'var(--aurora-1)' }} />
          </div>
        ) : activeTab === 'dashboard' ? (
          <>
            {/* Welcome hero */}
            <div className="tenant-welcome slide-up">
              <div>
                <h2>Hey, {dashData?.tenant?.name?.split(' ')[0] || 'Tenant'} 👋</h2>
                <p>Room <strong>{dashData?.tenant?.roomNumber || 'N/A'}</strong> · {dashData?.hostelName}</p>
              </div>
              <div className="tenant-welcome-meta">
                <span className="badge badge-success">Active</span>
                <span style={{ fontSize:'.8rem', color:'var(--text-dim)' }}>Bed {dashData?.tenant?.bedNumber || 'N/A'}</span>
              </div>
            </div>

            <div className="tenant-grid">
              {/* Notices */}
              <div className="glass-panel p-6">
                <h3 style={{ marginBottom:'1rem' }}>📢 Notice Board</h3>
                {dashData?.notices?.length > 0 ? (
                  <ul style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
                    {dashData.notices.map(n => (
                      <li key={n._id} style={{ padding:'1rem', borderRadius:'var(--r-md)', background:'var(--bg-elevated)', borderLeft:'3px solid var(--aurora-1)' }}>
                        <h4 style={{ fontSize:'.92rem', color:'var(--aurora-1)', marginBottom:'.3rem' }}>{n.title}</h4>
                        <p style={{ fontSize:'.85rem', color:'var(--text-dim)', lineHeight:1.5 }}>{n.message}</p>
                      </li>
                    ))}
                  </ul>
                ) : <p style={{ color:'var(--text-dim)' }}>No active notices.</p>}
              </div>

              {/* Menu */}
              <div className="glass-panel p-6">
                <h3 style={{ marginBottom:'1rem' }}>🍽️ Today's Menu {dashData?.menu?.day ? `(${dashData.menu.day})` : ''}</h3>
                {dashData?.menu ? (
                  <div className="menu-grid">
                    {['breakfast','lunch','snacks','dinner'].map(m => (
                      <div key={m} className="menu-item">
                        <span className="menu-item-label">{m}</span>
                        <span className="menu-item-value">{dashData.menu[m] || '—'}</span>
                      </div>
                    ))}
                  </div>
                ) : <p style={{ color:'var(--text-dim)' }}>Menu not updated yet.</p>}
              </div>
            </div>

            {/* Rules */}
            <div className="glass-panel p-6 slide-up">
              <h3 style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'1.25rem' }}>
                <ShieldCheck size={20} style={{ color:'var(--aurora-1)' }} /> Hostel Rules
              </h3>
              <ul className="rules-list">
                {[
                  ['Rent Payment', 'Must be paid by the 5th of every month to avoid late fees.'],
                  ['Notice Period', 'Minimum 10-day notice required before vacating.'],
                  ['Cleanliness', 'Keep common areas tidy and dispose of waste properly.'],
                  ['Quiet Hours', 'Respect silence between 10:00 PM and 7:00 AM.'],
                  ['Power Saving', 'Turn off lights and fans when leaving your room.'],
                  ['Safety', 'Illegal substances and smoking are strictly prohibited.'],
                ].map(([title, text], i) => (
                  <li key={i} className="rule-item">
                    <span className="bullet">•</span>
                    <span className="text"><strong>{title}:</strong> {text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : activeTab === 'rent' ? (
          <div className="glass-panel p-8 payment-card slide-up">
            <div style={{ width:64, height:64, background:'rgba(124,58,237,0.12)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
              <IndianRupee size={28} style={{ color:'var(--aurora-1)' }} />
            </div>
            <h2 style={{ marginBottom:'.5rem' }}>Due Rent: {month}</h2>
            {paymentSuccess ? (
              <div className="slide-up" style={{ marginTop:'1rem' }}>
                <CheckCircle2 size={52} style={{ color:'var(--success)', margin:'0 auto 1rem', display:'block' }} />
                <h3 style={{ color:'var(--success)' }}>Payment Completed</h3>
                <p style={{ color:'var(--text-dim)', marginTop:'.5rem' }}>Receipt sent to your registered WhatsApp.</p>
              </div>
            ) : (
              <>
                <div className="payment-amount text-gradient">₹{amount.toLocaleString()}</div>
                <p style={{ color:'var(--text-dim)', marginBottom:'1.5rem' }}>Securely processed via <strong>Paytm</strong></p>
                <button className="btn btn-primary btn-lg w-full" onClick={handlePayment} disabled={isPaying}>
                  {isPaying ? <Loader2 size={18} className="animate-spin" /> : null}
                  {isPaying ? 'Processing...' : `Pay ₹${amount.toLocaleString()} Now`}
                </button>
              </>
            )}
          </div>
        ) : activeTab === 'complaints' ? (
          <div className="glass-panel p-8 slide-up" style={{ maxWidth:580 }}>
            <h3 style={{ marginBottom:'1.25rem' }}>🔧 Log an Issue</h3>
            <form onSubmit={submitComplaint}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'.5rem' }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Your Name</label>
                  <input className="form-control" placeholder={dashData?.tenant?.name || 'Full name'} value={complaintName} onChange={e => setComplaintName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Room Number</label>
                  <input className="form-control" placeholder={dashData?.tenant?.roomNumber || 'e.g. 101'} value={complaintRoom} onChange={e => setComplaintRoom(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Issue Description</label>
                <textarea className="form-control" rows="5" placeholder="Describe the issue in detail..." value={complaintText} onChange={e => setComplaintText(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="btn btn-danger w-full" disabled={loadingComplaint}>
                {loadingComplaint ? <Loader2 size={16} className="animate-spin" /> : null}
                {loadingComplaint ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-panel p-8 slide-up" style={{ maxWidth:560 }}>
            {dashData?.tenant?.status === 'vacating' ? (
              <div className="text-center" style={{ padding:'2rem 0' }}>
                <CheckCircle2 size={56} style={{ color:'var(--warning)', margin:'0 auto 1rem', display:'block' }} />
                <h2 style={{ color:'var(--warning)' }}>Vacate Notice Active</h2>
                <p style={{ color:'var(--text-dim)', marginTop:'.75rem' }}>
                  Scheduled to vacate on <strong>{new Date(dashData.tenant.vacateDate).toLocaleDateString()}</strong>
                </p>
                <p style={{ fontSize:'.85rem', color:'var(--text-ghost)', marginTop:'.75rem' }}>Reason: "{dashData.tenant.vacateReason}"</p>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom:'.75rem' }}>🚪 Initiate Move Out</h3>
                <div style={{ borderLeft:'3px solid var(--warning)', paddingLeft:'1rem', marginBottom:'1.5rem', background:'rgba(217,119,6,0.06)', borderRadius:'0 var(--r-sm) var(--r-sm) 0', padding:'.75rem 1rem' }}>
                  <p style={{ fontSize:'.85rem', color:'var(--text-dim)' }}>A minimum 10-day notice period is required. Contact the owner to modify after submission.</p>
                </div>
                <form onSubmit={submitVacate}>
                  <div className="form-group">
                    <label className="form-label">Expected Vacate Date</label>
                    <input type="date" className="form-control" value={vacateDate} onChange={e => setVacateDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reason for Leaving</label>
                    <textarea className="form-control" rows="3" placeholder="Relocating, graduated, etc." value={vacateReason} onChange={e => setVacateReason(e.target.value)} required></textarea>
                  </div>
                  <button type="submit" className="btn w-full" style={{ background:'var(--warning)', color:'#000', fontWeight:600 }} disabled={loadingVacate}>
                    {loadingVacate ? <Loader2 size={16} className="animate-spin" /> : null}
                    {loadingVacate ? 'Submitting...' : 'Submit Notice'}
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TenantDashboard;

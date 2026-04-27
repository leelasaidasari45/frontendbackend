import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { QrCode, FileText, CheckCircle2, Loader2, XCircle, Camera, Building2, ChevronRight, User, Phone, Home, Hash, Car, Calendar, Upload, ArrowLeft } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import './JoinHostel.css';

const JoinHostel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(null);
  const [hostelCode, setHostelCode] = useState('');
  const [hostelName, setHostelName] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const { user, logoutContext } = useAuth();

  const [formData, setFormData] = useState({
    tenantName: user?.name || '',
    fatherName: '',
    address: '',
    mobile: '',
    roomNumber: '',
    vehicleNumber: '',
    admissionDate: new Date().toISOString().split('T')[0],
    aadhaarFile: null,
  });

  // URL code auto-fill + status check
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) { setHostelCode(code.toUpperCase()); toast.success('Hostel Code Applied!'); }

    const check = async () => {
      try {
        const res = await api.get('/api/tenant/dashboard');
        if (res.data?.tenant) {
          const st = res.data.tenant.status;
          if (st === 'vacated' || st === 'new' || st === 'rejected') setStep(1);
          else if (st === 'pending') setStep(3);
          else { navigate('/tenant/dashboard'); return; }
        } else setStep(1);
      } catch { setStep(1); }
    };
    check();

    return () => { if (scannerRef.current) scannerRef.current.stop().catch(console.error); };
  }, [navigate, location.search]);

  // QR scanner lifecycle
  useEffect(() => {
    let html5QrCode = null;
    if (!isScanning) return;
    const timer = setTimeout(async () => {
      try {
        const el = document.getElementById('reader');
        if (!el) { setIsScanning(false); return; }
        html5QrCode = new Html5Qrcode('reader');
        scannerRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 15, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            let code = decoded;
            if (decoded.includes('code=')) {
              try { code = new URL(decoded).searchParams.get('code') || decoded; } catch {}
            }
            const upper = code.toUpperCase();
            setHostelCode(upper);
            stopScanner();
            handleVerifyCode(null, upper);
          },
          () => {}
        );
      } catch (err) {
        toast.error('Camera error. Check permissions.');
        setIsScanning(false);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      if (html5QrCode?.isScanning) html5QrCode.stop().catch(console.error);
    };
  }, [isScanning]);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); scannerRef.current = null; }
      catch {}
    }
    setIsScanning(false);
  };

  const handleVerifyCode = async (e, directCode = null) => {
    if (e) e.preventDefault();
    const code = directCode || hostelCode;
    if (!code || code.trim().length < 4) { if (!directCode) toast.error('Enter a valid hostel code'); return; }
    setLoadingCode(true);
    try {
      const res = await api.get(`/api/tenant/verify-hostel/${code}`);
      setHostelName(res.data.name);
      toast.success(`Found: ${res.data.name}`);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid hostel code');
    } finally { setLoadingCode(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries({ hostelCode, tenantName: formData.tenantName, fatherName: formData.fatherName, address: formData.address, mobile: formData.mobile, roomNumber: formData.roomNumber, vehicleNumber: formData.vehicleNumber, admissionDate: formData.admissionDate }).forEach(([k, v]) => data.append(k, v));
    if (formData.aadhaarFile) data.append('aadhaar', formData.aadhaarFile);
    setLoadingSubmit(true);
    try {
      const res = await api.post('/api/tenant/join', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(res.data.message);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally { setLoadingSubmit(false); }
  };

  // Full-screen spinner while checking
  if (step === null) return (
    <div className="join-page">
      <Loader2 size={36} className="animate-spin" style={{ color: 'var(--aurora-1)' }} />
    </div>
  );

  return (
    <div className="join-page">
      {/* Aurora orbs */}
      <div className="join-orb join-orb-1" />
      <div className="join-orb join-orb-2" />

      <div className="join-card">
        {/* Header */}
        <div className="join-header">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="easyPG" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          </Link>
          {step === 2 && (
            <button onClick={() => setStep(1)} className="join-back-btn">
              <ArrowLeft size={16} /> Back
            </button>
          )}
        </div>

        {/* Step indicators */}
        <div className="join-steps">
          {['Hostel Code', 'Your Details', 'Done'].map((label, i) => (
            <div key={i} className={`join-step ${step >= i + 1 ? 'active' : ''}`}>
              <div className="join-step-dot">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
          <div className="join-step-line" />
        </div>

        {/* ───── STEP 1: Enter Code ───── */}
        {step === 1 && (
          <div className="join-body slide-up">
            <div className="join-icon-wrap">
              <QrCode size={28} style={{ color: 'var(--aurora-1)' }} />
            </div>
            <h2>Join Your Hostel</h2>
            <p className="join-subtitle">Enter the code your owner shared, or scan the QR code posted in the hostel.</p>

            <form onSubmit={handleVerifyCode}>
              <div className="code-input-wrap">
                <input
                  type="text"
                  className="code-input"
                  placeholder="e.g.  HST-8821"
                  value={hostelCode}
                  onChange={(e) => setHostelCode(e.target.value.toUpperCase())}
                  maxLength={10}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loadingCode}>
                {loadingCode ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                {loadingCode ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            <div className="join-divider"><span>or</span></div>

            <button className="btn btn-secondary w-full" onClick={() => setIsScanning(true)}>
              <Camera size={18} /> Scan QR Code
            </button>
          </div>
        )}

        {/* ───── STEP 2: Application Form ───── */}
        {step === 2 && (
          <div className="join-body slide-up">
            <div className="hostel-found-banner">
              <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <span>Joining <strong>{hostelName}</strong></span>
            </div>

            <h2 style={{ marginBottom: '.3rem' }}>Your Details</h2>
            <p className="join-subtitle">This info is shared with your hostel owner for approval.</p>

            <form onSubmit={handleSubmit}>
              {[
                { icon: <User size={16} />, label: 'Full Name', key: 'tenantName', type: 'text', placeholder: 'John Doe', required: true },
                { icon: <Phone size={16} />, label: 'Phone Number', key: 'mobile', type: 'tel', placeholder: '+91 9876543210', required: true },
                { icon: <User size={16} />, label: "Father's Name", key: 'fatherName', type: 'text', placeholder: "Father's full name", required: true },
              ].map(({ icon, label, key, type, placeholder, required }) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{icon}&nbsp;{label}</label>
                  <input type={type} className="form-control" placeholder={placeholder}
                    value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} required={required} />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label"><Home size={16} />&nbsp;Permanent Address</label>
                <textarea className="form-control" rows="2" placeholder="Street, City, State"
                  value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label"><Hash size={16} />&nbsp;Room No.</label>
                  <input type="text" className="form-control" placeholder="e.g. 101"
                    value={formData.roomNumber} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label"><Car size={16} />&nbsp;Vehicle (opt.)</label>
                  <input type="text" className="form-control" placeholder="KA01AB1234"
                    value={formData.vehicleNumber} onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label"><Calendar size={16} />&nbsp;Expected Joining Date</label>
                <input type="date" className="form-control"
                  value={formData.admissionDate} onChange={e => setFormData({ ...formData, admissionDate: e.target.value })} required />
              </div>

              {/* File upload */}
              <div className="form-group">
                <label className="form-label"><Upload size={16} />&nbsp;Aadhaar Card (PDF / Image)</label>
                <label className="file-upload-zone">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFormData({ ...formData, aadhaarFile: e.target.files[0] })} required style={{ display: 'none' }} />
                  {formData.aadhaarFile ? (
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ {formData.aadhaarFile.name}</span>
                  ) : (
                    <>
                      <Upload size={22} style={{ color: 'var(--text-dim)', marginBottom: '.4rem' }} />
                      <span style={{ fontSize: '.85rem', color: 'var(--text-dim)' }}>Tap to upload Aadhaar</span>
                      <span style={{ fontSize: '.75rem', color: 'var(--text-ghost)' }}>PDF, JPG, PNG supported</span>
                    </>
                  )}
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loadingSubmit} style={{ marginTop: '.5rem' }}>
                {loadingSubmit ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                {loadingSubmit ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {/* ───── STEP 3: Pending ───── */}
        {step === 3 && (
          <div className="join-body text-center slide-up" style={{ paddingTop: '1rem' }}>
            <div className="pending-icon-wrap">
              <CheckCircle2 size={44} style={{ color: 'var(--success)' }} />
            </div>
            <h2 style={{ color: 'var(--success)', marginBottom: '.5rem' }}>Application Submitted!</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', fontSize: '.92rem', lineHeight: 1.6 }}>
              Your details have been sent to the owner.<br />
              You'll get access once they approve your application.
            </p>

            <div style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 'var(--r-lg)', padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
              <p style={{ fontSize: '.85rem', color: 'var(--text-dim)', marginBottom: '.5rem' }}>⏳ What happens next?</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                {['Owner reviews your application', 'You get notified on approval', 'Dashboard unlocks automatically'].map((t, i) => (
                  <li key={i} style={{ fontSize: '.85rem', color: 'var(--text-bright)', display: 'flex', gap: '.5rem' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button className="btn btn-primary flex-1" onClick={() => window.location.reload()}>
                <Loader2 size={15} /> Check Status
              </button>
              <button className="btn btn-ghost flex-1" onClick={logoutContext} style={{ color: 'var(--danger)', borderColor: 'rgba(220,38,38,0.25)', border: '1px solid' }}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ───── QR Scanner Modal ───── */}
      {isScanning && (
        <div className="modal-backdrop fade-in" onClick={stopScanner}>
          <div className="modal-card slide-up" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <button onClick={stopScanner} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
              <XCircle size={22} />
            </button>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.4rem' }}>
              <Camera size={20} style={{ color: 'var(--aurora-1)' }} /> Scan Hostel QR
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '.85rem', marginBottom: '1.25rem' }}>
              Point your camera at the hostel QR code.
            </p>
            <div id="reader" style={{ width: '100%', overflow: 'hidden', borderRadius: 'var(--r-md)', background: '#000', minHeight: 260 }} />
            <button className="btn btn-secondary w-full" style={{ marginTop: '1rem' }} onClick={stopScanner}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinHostel;

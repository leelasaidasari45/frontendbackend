import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Loader2, Mail, Lock, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import './AuthPage.css';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginContext, user: authUser } = useAuth();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    if (authUser) navigate(authUser.role === 'owner' ? '/owner/dashboard' : '/tenant/dashboard');
  }, [authUser, navigate]);

  useEffect(() => { setIsLogin(location.pathname !== '/register'); }, [location.pathname]);

  const handleToggle = (mode) => {
    setIsLogin(mode === 'login');
    navigate(mode === 'login' ? '/login' : '/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post('/api/auth/login', { email: formData.email, password: formData.password });
        loginContext(res.data);
        toast.success('Welcome back!');
        navigate(res.data.role === 'owner' ? '/owner/dashboard' : '/tenant/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords don't match");
        const res = await api.post('/api/auth/register', { name: formData.name, email: formData.email, password: formData.password });
        loginContext(res.data);
        toast.success('Account created!');
        navigate('/select-role');
      }
    } catch (err) {
      toast.error(err.response?.data?.details || err.response?.data?.error || err.message || 'Authentication failed');
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } });
      if (error) throw error;
    } catch (err) { toast.error(err.message || 'Google login failed'); }
  };

  return (
    <div className="auth-page fade-in">
      {/* Ambient orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="auth-card">
        {/* Left branding panel */}
        <div className="auth-branding">
          <div className="auth-brand-top">
            <div className="auth-logo-container">
              <img src="/logo.png" alt="easyPG" className="auth-logo-img" />
            </div>
          </div>
          <div className="auth-brand-body">
            <h2 className="auth-brand-headline">Your hostel,<br /><span className="text-gradient">reimagined.</span></h2>
            <p className="auth-brand-sub">The all-in-one platform for modern PG and hostel management.</p>
            <div className="auth-features">
              {['Multi-property dashboard', 'QR-based instant onboarding', 'Automated rent management', 'Real-time analytics'].map((f, i) => (
                <div key={i} className="auth-feature-item">
                  <CheckCircle size={16} color="#a78bfa" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          {/* Mobile-only logo */}
          <div className="auth-mobile-logo">
            <img src="/logo.png" alt="easyPG" />
          </div>

          {/* Tab switcher */}
          <div className="auth-tabs">
            <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => handleToggle('login')}>Sign in</button>
            <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => handleToggle('register')}>Create account</button>
          </div>

          <div className="auth-form-header">
            <h2>{isLogin ? 'Welcome back' : 'Get started'}</h2>
            <p>{isLogin ? 'Sign in to your workspace' : 'Create your free account'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label"><User size={14} style={{marginRight:6,verticalAlign:'middle'}} />Full Name</label>
                <input type="text" className="form-control" placeholder="John Doe"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required={!isLogin} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label"><Mail size={14} style={{marginRight:6,verticalAlign:'middle'}} />Email</label>
              <input type="email" className="form-control" placeholder="you@example.com"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            {isLogin ? (
              <div className="form-group">
                <label className="form-label" style={{display:'flex',justifyContent:'space-between'}}>
                  <span><Lock size={14} style={{marginRight:6,verticalAlign:'middle'}} />Password</span>
                  <Link to="/forgot-password" style={{ fontSize:'.8rem', color:'var(--aurora-1)', textDecoration:'none' }}>Forgot?</Link>
                </label>
                <input type="password" className="form-control" placeholder="••••••••"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="form-group">
                  <label className="form-label"><Lock size={14} style={{marginRight:6,verticalAlign:'middle'}} />Password</label>
                  <input type="password" className="form-control" placeholder="••••••••"
                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label"><Lock size={14} style={{marginRight:6,verticalAlign:'middle'}} />Confirm</label>
                  <input type="password" className="form-control" placeholder="••••••••"
                    value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required={!isLogin} />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full btn-lg" style={{marginTop:'.5rem'}} disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
              {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign in' : 'Create account')}
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>

          <button onClick={handleGoogleLogin} className="google-btn">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={20} />
            <span>Continue with Google</span>
          </button>

          <p className="auth-switch-text">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => handleToggle(isLogin ? 'register' : 'login')} className="auth-switch-btn">
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

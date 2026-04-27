import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!session) {
          navigate('/login');
          return;
        }

        // Sync with backend
        const res = await api.post('/api/auth/social-sync', {
          supabaseId: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
        });

        // Set our backend JWT
        loginContext(res.data);
        
        toast.success('Successfully logged in with Google!');
        
        // Redirect based on role
        if (res.data.role === 'unassigned') {
          navigate('/select-role');
        } else if (res.data.role === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/tenant/dashboard');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        toast.error('Failed to sync social login with account');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, loginContext]);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--bg-base)' }}>
      <div style={{ width:48, height:48, border:'3px solid var(--border-subtle)', borderTopColor:'var(--aurora-1)', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
      <p style={{ marginTop:'1.5rem', fontSize:'1rem', color:'var(--text-bright)', fontWeight:500, letterSpacing:'0.02em' }}>
        Finishing your secure login...
      </p>
    </div>
  );
};

export default AuthCallback;

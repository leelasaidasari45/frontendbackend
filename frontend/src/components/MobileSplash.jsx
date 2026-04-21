import React, { useState, useEffect } from 'react';

const MobileSplash = () => {
  const [status, setStatus] = useState("Initializing easyPG...");
  const messages = [
    "Waking up secure servers...",
    "Establishing encrypted link...",
    "Loading your local workspace...",
    "Optimizing performance...",
    "Welcome to easyPG!"
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setStatus(messages[i]);
        i++;
      }
    }, 450); // Fast enough to see actions, slow enough to read
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container} className="splash-container">
      <div style={styles.content}>
        <div style={styles.logoWrapper}>
          <img 
            src="https://i.pinimg.com/736x/1d/31/58/1d315807fbdbf074612825fcdaa7c9b8.jpg" 
            alt="easyPG Logo" 
            style={styles.logo}
          />
        </div>
        <p style={styles.subtitle}>Modern Hostel Management</p>
      </div>
      
      <div style={styles.footer}>
        <div style={styles.statusBox}>
          <div style={styles.loader}></div>
          <p style={styles.statusText}>{status}</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .splash-container {
          animation: fadeOut 0.4s ease-in-out 2.4s forwards;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0f172a',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    fontFamily: "'Outfit', sans-serif",
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  logoWrapper: {
    width: '100px',
    height: '100px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
  },
  logo: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '0.5rem',
    fontWeight: '400',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
    opacity: 0,
  },
  statusBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.75rem',
    fontWeight: '500',
    letterSpacing: '0.5px',
    margin: 0,
  },
  loader: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.05)',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }
};

export default MobileSplash;

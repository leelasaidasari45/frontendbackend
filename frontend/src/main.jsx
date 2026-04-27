import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Performance: Pre-warm the backend immediately to reduce cold-start delay
(async () => {
  try {
    // Fire and forget - just to wake up Render/Backend
    fetch('https://easy-pg-backend.onrender.com/api/auth/me').catch(() => {});
  } catch (e) {}
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



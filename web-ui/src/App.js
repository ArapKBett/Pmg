// web-ui/src/App.js
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Credentials from './pages/Credentials';
import OTPS from './pages/OTPS';
import Settings from './pages/Settings';
import useAuthStore from './stores/authStore';
import useSyncStore from './stores/syncStore';
import './App.css';

function App() {
  const { isAuthenticated, token, user } = useAuthStore();
  const { initWebSocket, syncAllData } = useSyncStore();
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    if (isAuthenticated && token) {
      const ws = initWebSocket(token);
      
      return () => {
        if (ws) ws.close();
      };
    }
  }, [isAuthenticated, token, initWebSocket]);

  // Auto-sync on authentication
  useEffect(() => {
    if (isAuthenticated) {
      syncAllData().catch(console.error);
    }
  }, [isAuthenticated, syncAllData]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && window.location.pathname !== '/') {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/credentials" element={<Credentials />} />
          <Route path="/otps" element={<OTPS />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

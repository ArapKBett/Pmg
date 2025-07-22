// web-ui/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Credentials from './pages/Credentials';
import OTPS from './pages/OTPS';
import Settings from './pages/Settings';
import useAuthStore from './stores/authStore';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Layout />}
        <div className="content-container">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login />} />
            <Route path="/credentials" element={<Credentials />} />
            <Route path="/otps" element={<OTPS />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;

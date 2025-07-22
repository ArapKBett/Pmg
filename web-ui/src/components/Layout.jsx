// web-ui/src/components/Layout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './Layout.css';

function Layout() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">Password Manager</Link>
        </div>
        <div className="navbar-links">
          <Link to="/credentials">Credentials</Link>
          <Link to="/otps">OTPs</Link>
          <Link to="/settings">Settings</Link>
        </div>
        <div className="navbar-user">
          <span>{user?.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Layout;

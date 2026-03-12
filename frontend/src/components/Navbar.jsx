import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Ticket, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/tickets" className="navbar-brand">
        <Ticket style={{ color: "var(--accent-color)" }} /> Smart Ticket AI
      </Link>
      <div className="nav-links">
        {user.role !== 'User' && (
          <Link to="/dashboard">Dashboard</Link>
        )}
        <Link to="/tickets">Tickets</Link>
        <span className="text-muted">|</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.name} ({user.role})</span>
        <button className="btn-secondary flex items-center gap-2" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

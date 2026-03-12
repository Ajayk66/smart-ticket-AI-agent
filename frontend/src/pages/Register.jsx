import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Ticket } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/tickets');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <Ticket size={48} style={{ color: "var(--accent-color)" }} className="mb-2" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Create Account</h2>
          <p className="text-muted">Sign up to get started</p>
        </div>
        {error && <div className="text-danger mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="User">User</option>
            <option value="Support Agent">Support Agent</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit" className="btn-primary mt-4 py-2 text-lg">
            Register
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="font-bold">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

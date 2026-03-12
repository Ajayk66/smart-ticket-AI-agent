import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Ticket } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/tickets');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <Ticket size={48} style={{ color: "var(--accent-color)" }} className="mb-2" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome Back</h2>
          <p className="text-muted">Log in to your account</p>
        </div>
        {error && <div className="text-danger mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col">
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
          <button type="submit" className="btn-primary mt-4 py-2 text-lg">
            Login
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register" className="font-bold">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/tickets/dashboard');
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="container">Loading dashboard...</div>;

  return (
    <div className="container animate-fade-in">
      <h1 className="mb-6 font-bold" style={{ fontSize: '2rem' }}>Analytics Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        
        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(88, 166, 255, 0.1)' }}>
            <Activity className="text-accent-color" size={24} />
          </div>
          <div>
            <p className="text-muted text-sm">Total Tickets</p>
            <h2 className="font-bold" style={{ fontSize: '1.5rem' }}>{stats.total}</h2>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(210, 153, 34, 0.1)' }}>
            <Clock className="text-warning" size={24} />
          </div>
          <div>
            <p className="text-muted text-sm">Open Tickets</p>
            <h2 className="font-bold" style={{ fontSize: '1.5rem' }}>{stats.open}</h2>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(35, 134, 54, 0.1)' }}>
            <CheckCircle className="text-success" size={24} />
          </div>
          <div>
            <p className="text-muted text-sm">Closed Tickets</p>
            <h2 className="font-bold" style={{ fontSize: '1.5rem' }}>{stats.closed}</h2>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(218, 54, 51, 0.1)' }}>
            <AlertTriangle className="text-danger" size={24} />
          </div>
          <div>
            <p className="text-muted text-sm">High Priority</p>
            <h2 className="font-bold" style={{ fontSize: '1.5rem' }}>{stats.highPriority}</h2>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

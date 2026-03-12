import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/tickets');
        setTickets(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTickets();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return <span className="badge badge-open">Open</span>;
      case 'In Progress': return <span className="badge badge-progress">In Progress</span>;
      case 'Closed': return <span className="badge badge-closed">Closed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'var(--danger)';
      case 'Medium': return 'var(--warning)';
      case 'Low': return 'var(--success)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold" style={{ fontSize: '2rem' }}>
          {user.role === 'User' ? 'My Tickets' : 'All Tickets'}
        </h1>
        {user.role === 'User' && (
          <Link to="/tickets/new" className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Create Ticket
          </Link>
        )}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {tickets.length === 0 ? (
          <div className="glass-panel text-center text-muted">No tickets found.</div>
        ) : (
          tickets.map(ticket => (
            <Link to={`/tickets/${ticket._id}`} key={ticket._id}>
              <div className="card flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-primary">{ticket.title}</h3>
                  {getStatusBadge(ticket.status)}
                </div>
                <p className="text-muted text-sm my-1">{ticket.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center text-xs text-muted">
                  <span>Category: {ticket.category}</span>
                  <span style={{ color: getPriorityColor(ticket.priority), fontWeight: 'bold' }}>
                    {ticket.priority} Priority
                  </span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;

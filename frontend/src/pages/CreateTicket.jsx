import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Send, ArrowLeft } from 'lucide-react';

const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tickets', { title, description });
      navigate('/tickets');
    } catch (error) {
      console.error(error);
      alert('Error creating ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <button className="btn-secondary flex items-center gap-2 mb-6" onClick={() => navigate('/tickets')}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="font-bold mb-6" style={{ fontSize: '2rem' }}>Create New Ticket</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-muted text-sm mb-2 block">Ticket Title</label>
            <input
              type="text"
              placeholder="E.g., Cannot access billing page"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="text-muted text-sm mb-2 block">Description</label>
            <textarea
              placeholder="Please describe your issue in detail..."
              className="input-field"
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 py-3 mt-2">
            <Send size={18} /> {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;

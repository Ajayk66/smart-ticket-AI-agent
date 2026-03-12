import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, User, Bot, MessageSquare } from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const { data } = await api.get(`/tickets/${id}`);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await api.put(`/tickets/${id}`, { status });
      fetchTicket();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tickets/${id}/comments`, { text: commentText, isInternal });
      setCommentText('');
      setIsInternal(false);
      fetchTicket();
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) return <div className="container">Loading ticket...</div>;

  const { ticket, comments } = data;
  const isAgent = user.role !== 'User';

  return (
    <div className="container animate-fade-in">
      <button className="btn-secondary flex items-center gap-2 mb-6" onClick={() => navigate('/tickets')}>
        <ArrowLeft size={16} /> Back to Tickets
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        
        {/* Left Column - Main Content */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel">
            <div className="flex justify-between items-start mb-4">
              <h1 className="font-bold text-primary" style={{ fontSize: '1.75rem' }}>{ticket.title}</h1>
              {isAgent && (
                <select 
                  className="input-field" 
                  style={{ width: 'auto', margin: 0 }} 
                  value={ticket.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              )}
              {!isAgent && <span className={`badge badge-${ticket.status.toLowerCase().replace(' ', '-')}`}>{ticket.status}</span>}
            </div>
            <div className="flex items-center gap-2 text-muted text-sm mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <User size={16} /> {ticket.user.name} • {new Date(ticket.createdAt).toLocaleString()}
            </div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
          </div>

          <div className="glass-panel">
            <h3 className="font-bold mb-4 flex items-center gap-2"><MessageSquare size={18} /> Activity</h3>
            
            <div className="flex flex-col gap-4 mb-6">
              {comments.length === 0 ? (
                <div className="text-muted text-center py-4">No comments yet.</div>
              ) : (
                comments.map(c => (
                  <div key={c._id} className="card" style={{ backgroundColor: c.isInternal ? 'rgba(210, 153, 34, 0.05)' : 'var(--bg-secondary)', border: c.isInternal ? '1px solid var(--warning)' : '' }}>
                    <div className="flex justify-between items-center text-xs text-muted mb-2">
                      <span className="font-bold text-primary">{c.user.name} ({c.user.role}) {c.isInternal && <span className="text-warning">[Internal Note]</span>}</span>
                      <span>{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{c.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <textarea
                placeholder="Type your reply..."
                className="input-field"
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <div>
                  {isAgent && (
                    <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                      <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
                      Internal Note
                    </label>
                  )}
                </div>
                <button type="submit" className="btn-primary">Post Reply</button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel">
            <h3 className="font-bold mb-4">Ticket Details</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-muted">Status</span>
                <span className="font-bold">{ticket.status}</span>
              </div>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-muted">Priority</span>
                <span className="font-bold" style={{
                  color: ticket.priority === 'High' ? 'var(--danger)' : ticket.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'
                }}>{ticket.priority}</span>
              </div>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-muted">Category</span>
                <span className="font-bold">{ticket.category}</span>
              </div>
              {ticket.assignedAgent && (
                <div className="flex justify-between">
                  <span className="text-muted">Assignee</span>
                  <span className="font-bold">{ticket.assignedAgent.name}</span>
                </div>
              )}
            </div>
          </div>

          {isAgent && ticket.aiAnalyzed && (
            <div className="glass-panel" style={{ border: '1px solid var(--accent-color)' }}>
              <h3 className="font-bold mb-4 flex items-center gap-2 text-accent-color">
                <Bot size={18} /> AI Analysis
              </h3>
              <div className="flex flex-col gap-4 text-sm">
                <div>
                  <span className="text-muted block mb-1">Suggested Department:</span>
                  <div className="font-bold p-2 rounded border" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border)' }}>{ticket.suggestedDepartment}</div>
                </div>
                <div>
                  <span className="text-muted block mb-1">Suggested Reply:</span>
                  <div className="p-3 rounded border text-muted" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border)', whiteSpace: 'pre-wrap' }}>
                    {ticket.suggestedReply}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TicketDetail;

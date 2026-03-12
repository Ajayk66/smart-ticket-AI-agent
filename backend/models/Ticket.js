import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  category: { type: String, enum: ['Billing', 'Technical', 'General', 'Bug', 'Uncategorized'], default: 'Uncategorized' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Unassigned'], default: 'Unassigned' },
  suggestedDepartment: { type: String },
  suggestedReply: { type: String },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aiAnalyzed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);

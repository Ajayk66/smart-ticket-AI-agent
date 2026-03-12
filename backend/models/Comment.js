import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isInternal: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);

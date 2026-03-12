import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { serve } from 'inngest/express';
import { inngest } from './inngest/client.js';
import { processTicketAiAnalysis, sendStatusUpdateEmail, sendTicketCreatedEmail } from './inngest/functions.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

app.use(
  '/api/inngest',
  serve({
    client: inngest,
    functions: [processTicketAiAnalysis, sendTicketCreatedEmail, sendStatusUpdateEmail],
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));

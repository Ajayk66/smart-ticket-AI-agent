import express from 'express';
import { createTicket, getTickets, getTicketById, updateTicket, addComment, getDashboardStats } from '../controllers/ticketController.js';
import { protect, agentOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTicket)
  .get(protect, getTickets);

router.get('/dashboard', protect, agentOrAdmin, getDashboardStats);

router.route('/:id')
  .get(protect, getTicketById)
  .put(protect, agentOrAdmin, updateTicket);

router.post('/:id/comments', protect, addComment);

export default router;

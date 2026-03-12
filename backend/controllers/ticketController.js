import Ticket from '../models/Ticket.js';
import Comment from '../models/Comment.js';
import { inngest } from '../inngest/client.js';

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const ticket = await Ticket.create({
      user: req.user.id,
      title,
      description,
    });

    // triggering Inngest functions
    await inngest.send([
      {
        name: 'ticket.created',
        data: { ticketId: ticket._id.toString(), title, description }
      },
      {
        name: 'ticket.createdEmail',
        data: { email: req.user.email, userName: req.user.name, ticketId: ticket._id.toString(), title }
      }
    ]);

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    let tickets;
    if (req.user.role === 'User') {
      tickets = await Ticket.find({ user: req.user.id }).populate('user', 'name email').sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    }
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedAgent', 'name email');
      
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'User' && ticket.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const query = { ticket: ticket._id };
    if (req.user.role === 'User') {
      query.isInternal = false;
    }
    const comments = await Comment.find(query).populate('user', 'name role').sort({ createdAt: 1 });

    res.json({ ticket, comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { status, assignedAgent, priority, category } = req.body;
    const ticket = await Ticket.findById(req.params.id).populate('user');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const previousStatus = ticket.status;

    if (status) ticket.status = status;
    if (assignedAgent) ticket.assignedAgent = assignedAgent;
    if (priority) ticket.priority = priority;
    if (category) ticket.category = category;

    const updatedTicket = await ticket.save();

    if (status && status !== previousStatus) {
      await inngest.send({
        name: 'ticket.statusUpdated',
        data: { email: ticket.user.email, userName: ticket.user.name, ticketId: ticket._id.toString(), status }
      });
    }

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text, isInternal } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'User' && ticket.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const comment = await Comment.create({
      ticket: req.params.id,
      user: req.user.id,
      text,
      isInternal: req.user.role === 'User' ? false : (isInternal || false)
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: 'Open' });
    const closed = await Ticket.countDocuments({ status: 'Closed' });
    const highPriority = await Ticket.countDocuments({ priority: 'High' });

    res.json({ total, open, closed, highPriority });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

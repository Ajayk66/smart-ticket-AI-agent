import { inngest } from './client.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import { analyzeTicketWithAI } from '../services/aiService.js';
import { sendEmail } from '../services/emailService.js';

export const processTicketAiAnalysis = inngest.createFunction(
  { id: 'process-ticket-ai-analysis' },
  { event: 'ticket.created' },
  async ({ event, step }) => {
    const { ticketId, title, description } = event.data;

    const aiResult = await step.run('analyze-ticket', async () => {
      return await analyzeTicketWithAI(title, description);
    });

    if (aiResult) {
      await step.run('update-ticket', async () => {
        await Ticket.findByIdAndUpdate(ticketId, {
          category: aiResult.category,
          priority: aiResult.priority,
          suggestedDepartment: aiResult.suggestedDepartment,
          suggestedReply: aiResult.suggestedReply,
          aiAnalyzed: true
        });
      });
    }

    return { aiResult };
  }
);

export const sendTicketCreatedEmail = inngest.createFunction(
  { id: 'send-ticket-created-email' },
  { event: 'ticket.createdEmail' },
  async ({ event, step }) => {
    const { email, userName, ticketId, title } = event.data;
    
    await step.run('send-email', async () => {
        const html = `
          <h3>Hello ${userName},</h3>
          <p>Your ticket "<b>${title}</b>" has been received.</p>
          <p>Ticket ID: ${ticketId}</p>
          <p>We will get back to you shortly.</p>
        `;
        await sendEmail(email, 'Ticket Received', html);
    });
  }
);

export const sendStatusUpdateEmail = inngest.createFunction(
    { id: 'send-status-update-email' },
    { event: 'ticket.statusUpdated' },
    async ({ event, step }) => {
        const { email, userName, ticketId, status } = event.data;

        await step.run('send-update-email', async () => {
            const html = `
              <h3>Hello ${userName},</h3>
              <p>Your ticket (${ticketId}) status has been updated to: <b>${status}</b>.</p>
            `;
            await sendEmail(email, 'Ticket Status Updated', html);
        });
    }
);

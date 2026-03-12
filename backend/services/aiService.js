import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeTicketWithAI = async (title, description) => {
  try {
    const prompt = `
Analyze the following support ticket and return a JSON object with these fields:
- category: one of ["Billing", "Technical", "General", "Bug"]
- priority: one of ["Low", "Medium", "High"]
- suggestedDepartment: e.g. "IT Support", "Billing Dept", "Customer Success"
- suggestedReply: A short, professional draft reply to the user.

Ticket Title: ${title}
Ticket Description: ${description}

Return ONLY valid JSON.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
};

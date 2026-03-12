# Smart Ticket AI Agent

A full-stack Smart AI Ticket Agent application.

## Tech Stack
- **Frontend**: React.js (Vite), Context API, CSS (Modern design)
- **Backend**: Node.js, Express.js, MongoDB
- **AI Integration**: OpenAI API
- **Background Jobs**: Inngest
- **Emails**: Nodemailer

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Run `npm install` to install dependencies.
3. Your `.env` file is already configured with the provided keys.
4. Start the backend development server: `npm run dev` (Runs on http://localhost:5000)

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory: `cd frontend`
2. Run `npm install`
3. Start the frontend development server: `npm run dev` (Runs on http://localhost:5173 typically)

### 3. Inngest Setup
1. To run background jobs locally, open another terminal (using the root or backend directory).
2. Run `npx inngest-cli@latest dev` 
3. This syncs with your Express server running at `http://localhost:5000/api/inngest` via the UI provided by Inngest.

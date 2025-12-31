# Phase III Task Manager with AI Chatbot

Production-ready full-stack task management application with AI-powered conversational interface, built with Next.js and FastAPI.

## 🚀 Features

- ✅ User authentication with JWT
- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ **AI-Powered Chatbot** - Manage tasks through natural language
- ✅ Conversational task management with OpenAI GPT-4
- ✅ MCP (Model Context Protocol) tools for task operations
- ✅ Pixel-perfect, responsive UI
- ✅ Real-time task management
- ✅ Secure user data isolation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **AI**: OpenAI GPT-4 (Phase III)

## 📁 Project Structure

```
ali-phase-2-ghouse/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── main.py      # Application entry point
│   │   ├── config.py    # Configuration
│   │   ├── database.py  # Database connection
│   │   ├── models.py    # Data models
│   │   ├── auth.py      # Authentication
│   │   └── routers/     # API endpoints
│   ├── requirements.txt
│   └── .env.example
├── frontend/            # Next.js application
│   ├── src/
│   │   ├── app/         # Pages (App Router)
│   │   ├── components/  # React components
│   │   ├── lib/         # Utilities
│   │   └── styles/      # Global styles
│   ├── package.json
│   └── .env.local.example
└── specs/               # Documentation
    ├── api-spec.md
    ├── data-models.md
    └── ui-spec.md
```

## 🚦 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL database (Neon account recommended)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file from example:
```bash
cp .env.example .env
```

5. Configure environment variables in `.env`:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key-here
```

> **Note**: Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

6. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Configure environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. Run development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📖 API Documentation

API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Specification: See `specs/api-spec.md`

## 🎨 Design System

The application uses a custom design system with:
- **Primary Colors**: Purple/Indigo gradient
- **Accent Colors**: Teal for success states
- **Typography**: Inter (body), Outfit (headings)
- **Icons**: lucide-react (Plus, Trash2, Pencil, CheckCircle, Circle, ListTodo)

See `specs/ui-spec.md` for complete design guidelines.

## 🤖 AI Chatbot Usage

The AI-powered chatbot allows you to manage tasks through natural conversation:

### Opening the Chat
- **Desktop**: Click the purple chat button in the bottom-right corner
- **Mobile**: Tap the chat icon in the navigation bar

### Example Commands

**Adding Tasks:**
- "Add a task to buy groceries"
- "Create a new task: Review pull requests"
- "I need to remember to call mom tomorrow"

**Viewing Tasks:**
- "Show my tasks"
- "What do I need to do today?"
- "List all pending tasks"

**Completing Tasks:**
- "Mark task 3 as done"
- "Complete the groceries task"
- "I finished task #5"

**Deleting Tasks:**
- "Delete task 2"
- "Remove the groceries task"

**Updating Tasks:**
- "Change task 1 title to 'New title'"
- "Update task #3 description"

### Quick Actions
Use the quick action buttons for common operations:
- **Add task**: Start creating a new task
- **Show pending**: View incomplete tasks
- **Show completed**: View finished tasks

For more details, see `specs/features/chatbot.md`.

## 🔒 Security

- JWT-based authentication
- Bcrypt password hashing
- User data isolation
- CORS protection
- Input validation with Pydantic

## 📝 License

This project is part of Phase II implementation for the hackathon.

## 🤝 Contributing

This is a hackathon project. For questions or issues, please contact the development team.
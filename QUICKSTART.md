# Quick Start Guide

Get the Phase II Task Manager running in minutes!

## Prerequisites

- Python 3.11+
- Node.js 18+
- Neon PostgreSQL account (free tier works)

## 1. Database Setup

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@host/db?sslmode=require`)

## 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux

# Edit .env and add your Neon connection string
# DATABASE_URL=postgresql://...
# JWT_SECRET_KEY=change-this-to-random-string

# Run server
uvicorn app.main:app --reload
```

Backend will be at: **http://localhost:8000**

## 3. Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local
copy .env.local.example .env.local  # Windows
# or
cp .env.local.example .env.local    # Mac/Linux

# Run development server
npm run dev
```

Frontend will be at: **http://localhost:3000**

## 4. Test the Application

1. Open browser to `http://localhost:3000`
2. Click "Sign up" to create an account
3. Fill in username, email, and password
4. You'll be redirected to the dashboard
5. Click "Add Task" to create your first task!

## Troubleshooting

**Backend won't start?**
- Check your DATABASE_URL is correct
- Make sure PostgreSQL is accessible
- Verify all dependencies installed

**Frontend won't start?**
- Run `npm install` again
- Check NEXT_PUBLIC_API_URL in .env.local
- Make sure backend is running first

**Can't login?**
- Check backend terminal for errors
- Verify database connection
- Try creating a new account

## API Documentation

Once backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Enjoy your new task manager! 🎉

# API Specification - Phase III Task Manager with AI Chatbot

RESTful API endpoints for task management with JWT authentication and AI-powered chatbot.

## Base URL

```
http://localhost:8000
```

---

## Authentication Endpoints

### POST /api/auth/signup

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "username": "johndoe"
}
```

**Error Responses:**
- `400 Bad Request` - Email already registered
- `422 Unprocessable Entity` - Invalid input data

---

### POST /api/auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "username": "johndoe"
}
```

**Error Responses:**
- `401 Unauthorized` - Incorrect email or password

---

## Task Endpoints

All task endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### GET /api/{user_id}/tasks

Retrieve all tasks for the authenticated user.

**Path Parameters:**
- `user_id` (integer) - User ID (must match authenticated user)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "completed": false,
    "created_at": "2025-12-30T10:30:00",
    "updated_at": "2025-12-30T10:30:00"
  },
  {
    "id": 2,
    "user_id": 1,
    "title": "Review pull requests",
    "description": null,
    "completed": true,
    "created_at": "2025-12-29T14:20:00",
    "updated_at": "2025-12-30T09:15:00"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing JWT token
- `403 Forbidden` - User ID mismatch

---

### POST /api/{user_id}/tasks

Create a new task.

**Path Parameters:**
- `user_id` (integer) - User ID (must match authenticated user)

**Request Body:**
```json
{
  "title": "New task title",
  "description": "Optional task description"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "user_id": 1,
  "title": "New task title",
  "description": "Optional task description",
  "completed": false,
  "created_at": "2025-12-30T12:00:00",
  "updated_at": "2025-12-30T12:00:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing JWT token
- `403 Forbidden` - User ID mismatch
- `422 Unprocessable Entity` - Invalid input data

---

### GET /api/{user_id}/tasks/{task_id}

Retrieve a specific task.

**Path Parameters:**
- `user_id` (integer) - User ID (must match authenticated user)
- `task_id` (integer) - Task ID

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "completed": false,
  "created_at": "2025-12-30T10:30:00",
  "updated_at": "2025-12-30T10:30:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing JWT token
- `403 Forbidden` - User ID mismatch
- `404 Not Found` - Task not found

---

### PUT /api/{user_id}/tasks/{task_id}

Update a task.

**Path Parameters:**
- `user_id` (integer) - User ID (must match authenticated user)
- `task_id` (integer) - Task ID

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

All fields are optional. Only provided fields will be updated.

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "created_at": "2025-12-30T10:30:00",
  "updated_at": "2025-12-30T13:45:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing JWT token
- `403 Forbidden` - User ID mismatch
- `404 Not Found` - Task not found

---

### DELETE /api/{user_id}/tasks/{task_id}

Delete a task.

**Path Parameters:**
- `user_id` (integer) - User ID (must match authenticated user)
- `task_id` (integer) - Task ID

**Response (204 No Content)**

**Error Responses:**
- `401 Unauthorized` - Invalid or missing JWT token
- `403 Forbidden` - User ID mismatch
- `404 Not Found` - Task not found

---

### PATCH /api/{user_id}/tasks/{task_id}/complete

Toggle task completion status.

**Path Parameters:**
- `user_id` (integer) - User ID (must match authenticated user)
- `task_id` (integer) - Task ID

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "completed": true,
  "created_at": "2025-12-30T10:30:00",
  "updated_at": "2025-12-30T14:00:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing JWT token
- `403 Forbidden` - User ID mismatch
- `404 Not Found` - Task not found

---

## Chat Endpoints (Phase III)

All chat endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### POST /api/{user_id}/chat

Send a message to the AI chatbot assistant.

**Path Parameters:**
- `user_id` (integer) - User ID (must match authenticated user)

**Request Body:**
```json
{
  "conversation_id": 1,
  "message": "Add a task to buy groceries tomorrow"
}
```

**Fields:**
- `conversation_id` (integer, optional) - Existing conversation ID, omit for new conversation
- `message` (string, required) - User's message to the chatbot

**Response (200 OK):**
```json
{
  "conversation_id": 1,
  "response": "✅ Task created: Buy groceries — due tomorrow",
  "tool_calls": [
    {
      "tool_name": "add_task",
      "inputs": {
        "title": "Buy groceries",
        "description": "Due tomorrow"
      },
      "output": {
        "success": true,
        "data": {
          "id": 5,
          "title": "Buy groceries",
          "description": "Due tomorrow",
          "completed": false,
          "created_at": "2025-12-31T12:00:00"
        },
        "message": "✅ Task created: Buy groceries"
      }
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing JWT token
- `403 Forbidden` - User ID mismatch
- `404 Not Found` - Conversation not found (if conversation_id provided)
- `500 Internal Server Error` - OpenAI API error or server error

**Example Conversations:**

1. **List Tasks:**
```json
Request: { "message": "Show my pending tasks" }
Response: {
  "conversation_id": 1,
  "response": "Here are your 3 pending tasks:\n1. Buy groceries\n2. Review pull requests\n3. Finish documentation",
  "tool_calls": [
    {
      "tool_name": "list_tasks",
      "inputs": { "completed": false },
      "output": { "success": true, "data": [...] }
    }
  ]
}
```

2. **Complete Task:**
```json
Request: { "message": "Mark task 1 as done" }
Response: {
  "conversation_id": 1,
  "response": "✅ Task completed: Buy groceries",
  "tool_calls": [
    {
      "tool_name": "complete_task",
      "inputs": { "task_id": 1 },
      "output": { "success": true, "data": {...} }
    }
  ]
}
```

---

## Authentication Flow

1. **Sign Up**: User registers via `/api/auth/signup`
2. **Receive Token**: Server returns JWT token and user info
3. **Store Token**: Client stores token in localStorage
4. **Authenticated Requests**: Client includes token in Authorization header
5. **Token Verification**: Server verifies token and extracts user_id
6. **User Isolation**: Server ensures user can only access their own resources

---

## Error Handling

All errors follow this format:

```json
{
  "detail": "Error message description"
}
```

Common HTTP status codes:
- `200 OK` - Successful GET/PUT/PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication failed
- `403 Forbidden` - Authorization failed
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

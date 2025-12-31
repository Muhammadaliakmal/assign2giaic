# Data Models - Phase II Task Manager

Database schema and data models for PostgreSQL with SQLModel.

---

## Database Tables

### users

User account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User email address |
| username | VARCHAR(100) | NOT NULL | User display name |
| hashed_password | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

---

### tasks

User tasks and to-do items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique task identifier |
| user_id | INTEGER | FOREIGN KEY (users.id), NOT NULL, INDEX | Owner user ID |
| title | VARCHAR(255) | NOT NULL | Task title |
| description | VARCHAR(1000) | NULLABLE | Optional task description |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

## Relationships

```
users (1) ──< (many) tasks
```

- One user can have many tasks
- Each task belongs to exactly one user
- Deleting a user cascades to delete all their tasks

---

## SQLModel Schemas

### User Model

```python
class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    username: str = Field(max_length=100)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    tasks: List["Task"] = Relationship(back_populates="user")
```

### Task Model

```python
class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: Optional[User] = Relationship(back_populates="tasks")
```

---

## Pydantic Request/Response Models

### Authentication

```python
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
```

### Tasks

```python
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
```

---

## Data Validation Rules

### User
- **email**: Valid email format, unique across all users
- **username**: 1-100 characters, required
- **password**: Minimum 6 characters (enforced at application level)

### Task
- **title**: 1-255 characters, required
- **description**: 0-1000 characters, optional
- **completed**: Boolean, defaults to `false`
- **user_id**: Must reference existing user

---

## Security Considerations

1. **Password Storage**: Passwords are hashed using bcrypt before storage
2. **User Isolation**: All task queries filter by `user_id` from JWT token
3. **Data Integrity**: Foreign key constraints ensure referential integrity
4. **Timestamps**: Automatic timestamp tracking for audit trail

---

## Sample Data Structure

```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "johndoe",
    "created_at": "2025-12-30T10:00:00"
  },
  "tasks": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Complete Phase II implementation",
      "description": "Build full-stack task manager",
      "completed": false,
      "created_at": "2025-12-30T10:30:00",
      "updated_at": "2025-12-30T10:30:00"
    }
  ]
}
```

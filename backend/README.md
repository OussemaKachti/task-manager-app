# Task Manager Backend - NestJS API

REST API for Task Manager application with authentication, projects, and tasks management.

## 🛠 Tech Stack

- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Runtime**: Node.js 18+

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d

# Application
PORT=3001
NODE_ENV=development
```

3. Start development server:
```bash
npm run start:dev
```

API will be available at `http://localhost:3001`

## 📡 API Endpoints

### Authentication
```
POST   /auth/register     # Register new user
POST   /auth/login        # Login user
GET    /auth/me           # Get current user profile
```

### Projects
```
GET    /projects          # Get all user projects
GET    /projects/:id      # Get project by ID
POST   /projects          # Create new project
PUT    /projects/:id      # Update project
DELETE /projects/:id      # Delete project
```

### Tasks
```
GET    /tasks?projectId=xxx           # Get all tasks for a project
GET    /tasks/:id                     # Get task by ID
POST   /tasks                         # Create new task
PUT    /tasks/:id                     # Update task
PATCH  /tasks/:id/status              # Update task status
POST   /tasks/reorder                 # Reorder multiple tasks
DELETE /tasks/:id                     # Delete task
```

## 🗄 Database Schema

### users
- id (uuid, primary key)
- email (varchar, unique)
- name (varchar)
- created_at (timestamp)

### projects
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (varchar)
- description (text)
- created_at (timestamp)
- updated_at (timestamp)

### tasks
- id (uuid, primary key)
- project_id (uuid, foreign key)
- title (varchar)
- description (text)
- status (enum: 'todo', 'in_progress', 'done')
- order_index (integer)
- created_at (timestamp)
- updated_at (timestamp)

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <user_id>
```

Currently using user_id as token (temporary). Will be replaced with proper JWT validation.

## 🧪 Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Build
```bash
npm run build
```

## 🚀 Deployment

The API can be deployed to:
- Railway
- Render
- Heroku
- AWS/GCP/Azure

Make sure to set environment variables in your hosting platform.

## 📄 License

MIT
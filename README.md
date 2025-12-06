# 📋 Task Manager - Kanban Board Application

**Modern task management with drag & drop Kanban boards, project organization, and real-time collaboration**

Built with Next.js 15 + NestJS + Supabase

---

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

</div>

---

## 🎯 Features

- ✅ **User Authentication** - Secure JWT-based authentication with Supabase
- 📁 **Project Management** - Create, edit, and organize projects
- 📊 **Kanban Board** - Visual task management with drag & drop
- 🔄 **Task Status** - Move tasks between To Do, In Progress, and Done
- 🎨 **Modern UI** - Clean interface built with Tailwind CSS and Shadcn/UI
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔒 **Data Security** - Row Level Security (RLS) with Supabase

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI
- **Drag & Drop**: @dnd-kit

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **ORM**: Supabase Client

### Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Hosting**: Vercel (Frontend) / Railway (Backend)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or pnpm
- Supabase account

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/OussemaKachti/task-manager-app.git
cd task-manager-app
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

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

Start backend:

```bash
npm run start:dev
```

Backend will run on `http://localhost:3001`

#### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Start frontend:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 📁 Project Structure

```
task-manager-app/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── projects/        # Projects CRUD
│   │   ├── tasks/           # Tasks management
│   │   ├── supabase/        # Supabase client
│   │   └── app.module.ts    # Main module
│   ├── .env                 # Environment variables
│   └── package.json
│
└── frontend/                 # Next.js application
    ├── app/
    │   ├── (auth)/          # Auth pages
    │   ├── projects/        # Projects list
    │   │   └── [id]/       # Kanban board
    │   └── api/            # API routes
    ├── components/
    │   ├── auth/           # Auth components
    │   ├── projects/       # Project components
    │   └── tasks/          # Task components
    └── lib/                # Utilities
```

---

## 🗄 Database Schema

### Tables

#### **users**
```sql
- id (uuid, primary key)
- email (varchar, unique)
- name (varchar)
- created_at (timestamp)
```

#### **projects**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (varchar)
- description (text)
- created_at (timestamp)
```

#### **tasks**
```sql
- id (uuid, primary key)
- project_id (uuid, foreign key)
- title (varchar)
- description (text)
- status (enum: 'todo', 'in_progress', 'done')
- order_index (integer)
- created_at (timestamp)
```

---

## 🔐 API Endpoints

### Authentication
```
POST   /auth/register     # Register new user
POST   /auth/login        # Login user
GET    /auth/me           # Get current user
```

### Projects
```
GET    /projects          # Get all projects
POST   /projects          # Create project
PUT    /projects/:id      # Update project
DELETE /projects/:id      # Delete project
```

### Tasks
```
GET    /projects/:id/tasks       # Get project tasks
POST   /projects/:id/tasks       # Create task
PUT    /tasks/:id                # Update task
PATCH  /tasks/:id/status         # Update task status
DELETE /tasks/:id                # Delete task
```

---

## 🎨 Screenshots

### Login Page
![Login](docs/screenshots/login.png)

### Projects Dashboard
![Projects](docs/screenshots/projects.png)

### Kanban Board
![Kanban](docs/screenshots/kanban.png)

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 🚀 Deployment

### Backend (Railway/Render)

1. Create new service
2. Connect GitHub repository
3. Add environment variables
4. Deploy

### Frontend (Vercel)

1. Import project from GitHub
2. Configure environment variables
3. Deploy

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Shadcn/UI](https://ui.shadcn.com/) - Beautifully designed components
- [dnd-kit](https://dndkit.com/) - Modern drag and drop toolkit

---

## 📧 Contact

**Oussema Kachti** - [@OussemaKachti](https://github.com/OussemaKachti)

Project Link: [https://github.com/OussemaKachti/task-manager-app](https://github.com/OussemaKachti/task-manager-app)

---

<div align="center">

**Made with ❤️ for productivity**

![Profile Views](https://komarev.com/ghpvc/?username=OussemaKachti&color=blueviolet&style=flat-square&label=Profile+Views)

[⬆ Back to Top](#-task-manager---kanban-board-application)

</div>
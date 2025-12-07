# Task Manager Frontend - Next.js Application

Modern task management interface with Kanban board, drag & drop functionality, and real-time notifications.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Lucide React Icons
- **Drag & Drop**: @dnd-kit
- **HTTP Client**: Axios

## ✨ Features

- 🔐 **Authentication** - Secure login and registration
- 📁 **Project Management** - Create, edit, and delete projects
- 📊 **Kanban Board** - Visual task management with 3 columns (To Do, In Progress, Done)
- 🎯 **Drag & Drop** - Intuitive task movement between columns
- ✏️ **Task CRUD** - Create, read, update, and delete tasks
- 🔔 **Toast Notifications** - Real-time feedback for user actions
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎨 **Modern UI** - Clean and professional design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Backend API running on port 3001

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Start development server:
```bash
npm run dev
```

Application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   └── page.tsx              # Login/Register page
│   ├── projects/
│   │   ├── page.tsx              # Projects list
│   │   └── [id]/
│   │       └── page.tsx          # Kanban board
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   └── Toast.tsx                 # Toast notification component
├── lib/
│   └── api.ts                    # API client configuration
└── public/                       # Static assets
```

## 🎨 Pages Overview

### 1. Authentication Page (`/`)
- User registration with name, email, and password
- User login with email and password
- Form validation and error handling
- Automatic redirect to projects page on success

### 2. Projects Page (`/projects`)
- Display all user projects in a grid layout
- Create new projects with name and description
- Edit existing projects
- Delete projects with confirmation
- Navigate to project's Kanban board
- Empty state when no projects exist

### 3. Kanban Board (`/projects/[id]`)
- Three columns: To Do, In Progress, Done
- Drag and drop tasks between columns
- Reorder tasks within the same column
- Create new tasks with title, description, and status
- Edit existing tasks
- Delete tasks with confirmation
- Task counter for each column
- Scrollable columns for better UX

## 🔔 Toast Notifications

The application includes a custom toast notification system:

- ✅ **Success** (Green): Project/Task created, updated, deleted, moved
- ❌ **Error** (Red): Failed operations with error messages
- ℹ️ **Info** (Blue): Logout confirmation

Features:
- Auto-dismiss after 3 seconds
- Manual close button
- Smooth slide-in animation
- Multiple toasts support
- Context-aware icons

## 🎯 API Integration

The frontend communicates with the backend through a centralized API client (`lib/api.ts`):

### Authentication
```typescript
auth.register(email, password, name)
auth.login(email, password)
```

### Projects
```typescript
projects.getAll()
projects.getOne(id)
projects.create(data)
projects.update(id, data)
projects.delete(id)
```

### Tasks
```typescript
tasks.getAll(projectId)
tasks.create(projectId, data)
tasks.update(id, data)
tasks.updateStatus(id, status, orderIndex)
tasks.delete(id)
tasks.reorder(tasks)
```

## 🔒 Authentication Flow

1. User registers or logs in
2. Token (user ID) is stored in `localStorage`
3. Token is automatically added to all API requests via Axios interceptor
4. Protected routes check for token and redirect if not authenticated

## 🎨 Styling

- **Tailwind CSS v4** for utility-first styling
- **Custom scrollbar** for Kanban columns
- **Hover effects** and transitions for better UX
- **Responsive grid** layouts
- **Loading states** for async operations

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "axios": "^1.6.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "lucide-react": "latest",
    "typescript": "^5.0.0"
  }
}
```

## 🚀 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🌐 Deployment

The frontend can be deployed to:
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm test

# Run linter
npm run lint
```

## 📝 Code Quality

- TypeScript for type safety
- ESLint for code linting
- Consistent naming conventions
- Component-based architecture
- Separation of concerns (API, Components, Pages)

## 🎯 Future Enhancements

- [ ] Add task due dates
- [ ] Task priority levels
- [ ] Task assignments to team members
- [ ] Search and filter functionality
- [ ] Dark mode support
- [ ] Real-time collaboration with WebSockets
- [ ] Task comments and attachments
- [ ] Activity log

## 📄 License

MIT

## 👨‍💻 Developer

**Oussema Kachti**

---

**Built with ❤️ using Next.js and TypeScript**
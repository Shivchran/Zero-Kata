# 🚀 SprintDesk

## Agile Project Management Dashboard

A modern, responsive project management dashboard built with React and TypeScript.

**Live Demo:** https://sprintdesk-plum.vercel.app  
**GitHub:** https://github.com/Shivchran/sprintdesk  
**YouTube Demo:** https://youtu.be/3xgJdI9mImA

> **CODE • BUILD • LEARN • GROW**

---

## 1. Project Overview

SprintDesk is a modern and responsive Agile Project Management Dashboard. It helps users manage sprints, organize tasks using a Kanban board, track project progress, view analytics, receive notifications, and manage tasks through an intuitive interface.

---

## 2. Features

| Feature | Description |
|---|---|
| **Authentication** | User login, protected routes, token-based authentication and logout. |
| **Dashboard** | Sprint selector, overview cards, task statistics and progress tracking. |
| **Kanban Board** | Backlog, In Progress, Review and Done with drag-and-drop task management. |
| **Task Management** | Add/delete tasks, details, priorities, assignees and comments. |
| **Search & Filters** | Search and filter tasks by priority, status and assignee. |
| **Notifications** | Notification bell, unread count, polling, read controls and toast notifications. |
| **Analytics** | Status, priority, sprint and completion-trend charts. |
| **Dark Mode** | Light and dark themes with a theme toggle. |
| **Responsive UI** | Designed for desktop, tablet and mobile screens. |

---

## 3. Tech Stack

| Technology | Purpose |
|---|---|
| **React** | UI development |
| **TypeScript** | Type-safe development |
| **Vite** | Development and build tooling |
| **Tailwind CSS** | Styling and responsive UI |
| **Zustand** | State management |
| **React Router** | Application routing |
| **dnd-kit** | Drag-and-drop interactions |
| **Recharts** | Data visualization |
| **REST API** | API integration |
| **Git / GitHub** | Version control and code hosting |
| **Vercel** | Deployment |

---

## 4. Project Structure

```text
sprintdesk/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── data/
│   │   └── mock-data.json
│   ├── hooks/
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── LoginPage.tsx
│   ├── services/
│   │   └── api/
│   ├── stores/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 5. Getting Started

### Clone the repository

```bash
git clone https://github.com/Shivchran/sprintdesk.git
```

### Navigate to the project

```bash
cd sprintdesk
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application will normally be available at:

**http://localhost:5173**

---

## 6. Production Build

### Build the application

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

---

## 7. Application Flow

```text
Login
  ↓
Authentication
  ↓
Dashboard
  ├── Sprint Selection
  ├── Task Board
  │    ├── Backlog
  │    ├── In Progress
  │    ├── Review
  │    └── Done
  ├── Task Management
  ├── Search & Filters
  ├── Notifications
  └── Analytics
```

---

## 8. Notification System

SprintDesk periodically requests notification data, checks for new notifications, stores them using Zustand, and exposes them through the notification bell, notification panel and toast notification UI.

---

## 9. Analytics

- **Task Status:** Distribution of tasks across workflow stages.
- **Priority Breakdown:** Tasks grouped by priority.
- **Tasks by Sprint:** Task distribution across sprints.
- **Completion Trend:** Task completion progress over time.
- **Summary:** Overall completion progress and task counts.

---

## 10. Security Considerations

For production applications, authentication and refresh tokens should be handled securely.

Recommended practices include:

- HTTPS
- Secure and HttpOnly cookies where appropriate
- Token expiration
- Refresh-token rotation
- Server-side validation
- Environment variables for secrets
- Never committing secrets to GitHub

---

## 11. Deployment

SprintDesk is deployed using **Vercel**.

The typical workflow is:

```text
Local Development → Git → GitHub → Vercel → Production
```

**Live application:**  
https://sprintdesk-plum.vercel.app

---

## 12. Project Objectives

- Build a modern React application.
- Practice TypeScript and reusable component architecture.
- Implement Zustand state management.
- Implement drag-and-drop task management.
- Work with REST APIs.
- Create data visualizations with Recharts.
- Build responsive interfaces with Tailwind CSS.
- Implement authentication and protected routes.
- Deploy a production-ready frontend application.

---

## 13. What I Learned

React component architecture, TypeScript, React Router, Zustand state management, REST API integration, drag-and-drop interfaces, Recharts, Tailwind CSS, responsive web design, authentication, protected routes, notification polling, Git/GitHub and Vercel deployment.

---

## 14. Future Improvements

- Real backend API
- PostgreSQL or MongoDB database
- Real-time notifications using WebSockets
- Team management
- Role-based access control
- User invitation system
- File attachments
- Advanced task editing
- Sprint and project creation
- Real-time collaboration
- Automated testing

---

## 15. Author

### Sachin Upamanyu

**Frontend Developer | Software Engineer**

> **CODE • BUILD • LEARN • GROW**

---

## 16. Project Links

### Live Demo

https://sprintdesk-plum.vercel.app

### GitHub Repository

https://github.com/Shivchran/sprintdesk

### YouTube Demo

https://youtu.be/3xgJdI9mImA

---

⭐ If you find this project useful or interesting, consider giving the repository a star on GitHub.

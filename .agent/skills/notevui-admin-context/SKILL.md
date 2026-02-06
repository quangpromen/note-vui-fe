---
name: notevui-admin-context
description: Project-specific context, architecture, and coding standards for the NoteVui Admin Portal (React/Vite). This skill unifies project rules with best practices.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# NoteVui Admin Portal Context

This skill defines the technical standards, architectural decisions, and design patterns specifically for the NoteVui Admin project. Use this context to guide all development tasks.

## 1. Technology Stack
- **Frontend Core**: React 18+ (Vite), JavaScript (ESModules).
- **Styling**: Tailwind CSS (v3/v4), heavily utilizing utility classes.
- **State Management**: React Context (Auth), Local State (Component-level).
- **Form Handling**: React Hook Form (validation, submission).
- **HTTP Client**: Axios (centralized instance with interceptors).
- **UI Components**: Lucide React (icons), React Hot Toast (notifications).

## 2. Project Structure & Organization
Ensure strict adherence to this directory structure:

```
src/
├── assets/         # Static assets (images, global fonts)
├── components/     # Reusable UI components
│   ├── ui/         # Generic atoms (Button, Input, Card) - HIGH REUSABILITY
│   └── admin/      # Domain-specific components (AdminStatsChart, UserTable)
├── context/        # Global Context Providers (AuthContext.jsx)
├── hooks/          # Custom Hooks (useAuth, useAxios)
├── layout/         # Layout wrappers
│   ├── AdminLayout.jsx  # Sidebar, Header, Protected Content
│   └── AuthLayout.jsx   # Centered layout for Login/Register
├── pages/          # Page components (routed)
├── services/       # API integration layers
│   ├── api.js           # Axios instance configuration
│   ├── authService.js   # Auth-specific calls
│   └── adminService.js  # Admin-specific calls
└── utils/          # Helper functions (date formatting, token decoder)
```

## 3. Architecture & Patterns

### Authentication Flow
1. **Login**: User submits credentials -> `authService.login()`.
2. **Token**: Receive `accessToken` -> Store in `localStorage`.
3. **Validation**: Decode token with `jwt-decode`. Verify `role === 'Admin'`.
4. **Session**: Update `AuthContext` state.
5. **Protection**: Wrap Admin routes in `<ProtectedRoute>`. Redirect non-admins or unauthenticated users.

### API Integration Pattern
- **Centralized Axios**: Create `src/services/api.js` with `baseURL` from environment variables.
- **Interceptors**: 
  - *Request*: Attach `Authorization: Bearer <token>` automatically.
  - *Response*: Handle 401 (Unauthorized) / 403 (Forbidden) centrally (e.g., auto-logout).

### Component Design Pattern
- **Composition**: Prefer small, composed components over monolithic ones.
- **Props**: Use destructuring for props. Define `propTypes` (if strictly required) or clear defaults.
- **Tailwind**: Use class grouping for readability.
  - *Bad*: `<div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">`
  - *Good*: Extract common styles to `index.css` layers component or keep cleaner lines.

## 4. Design & Aesthetics (Mandatory)
- **Visual Style**: "Rich Aesthetics" - Glassmorphism, deep gradients, subtle shadows.
- **Micro-interactions**: Hover states for all interactive elements `hover:scale-105 active:scale-95`.
- **Colors**: Define a semantic palette in `tailwind.config.js` (e.g., `primary`, `surface`, `danger`).

## 5. Related Skills
When performing tasks, reference these specific skills for implementation details:
- **`react-best-practices`**: For performance (Eliminating Waterfalls, Bundle Size).
- **`tailwind-patterns`**: For modern CSS patterns (v4 syntax, container queries).
- **`api-security-best-practices`**: For secure token handling and XSS prevention.

## 6. Development Workflow Rules
- **No Placeholders**: Build complete UI mockups.
- **Mock First**: If API is offline, Create a `mockService` to allow UI development to proceed.
- **Clean Code**: Remove `console.log` before "finishing". Use meaningful variable names.

# CSU IS Internship Platform - Frontend Source Code

## Quick Start Guide

### Installation
```bash
npm install
# or
pnpm install
```

### Run Development Server
```bash
npm run dev
# App runs on http://localhost:5173
```

### Build for Production
```bash
npm run build
# Output in /dist folder
```

---

## Core Application Files

### 1. `/src/app/App.tsx` - Main Entry Point
```typescript
import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}
```

### 2. `/src/app/routes.ts` - Routing Configuration
```typescript
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./pages/HomePage";
import { CompaniesPage } from "./pages/CompaniesPage";
import { CompanyDetailPage } from "./pages/CompanyDetailPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { SalariesPage } from "./pages/SalariesPage";
import { AlumniPage } from "./pages/AlumniPage";
import { AdminPage } from "./pages/AdminPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "companies", Component: CompaniesPage },
      { path: "companies/:id", Component: CompanyDetailPage },
      { path: "reviews", Component: ReviewsPage },
      { path: "salaries", Component: SalariesPage },
      { path: "alumni", Component: AlumniPage },
      { path: "admin", Component: AdminPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
```

---

## Data Layer

### `/src/app/data/mockData.ts` - Data Structure & Mock Data

**Full file location**: `/src/app/data/mockData.ts`

This file contains:
- All TypeScript interfaces
- Mock data for 22 companies
- 52+ user accounts
- 32 internship reviews
- 30 alumni profiles
- 20+ salary entries

**Key Interfaces**:
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  graduationYear?: number;
  major: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  size: string;
  description: string;
  website: string;
  internshipRoles: string[];
  avgRating: number;
  reviewCount: number;
  csuHires: number;
  preferredCertifications?: {
    required: string[];
    preferred: string[];
    helpful: string[];
  };
}

export interface Review {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  userRole: string;
  internshipRole: string;
  semester: string;
  year: number;
  rating: number;
  pros: string;
  cons: string;
  interview: string;
  recommendation: string;
  skills: string[];
  isApproved: boolean;
  createdAt: string;
}

export interface SalaryData {
  id: string;
  companyId: string;
  role: string;
  internshipType: 'summer' | 'co-op' | 'part-time';
  hourlyRate: number;
  year: number;
  userId: string;
  benefits: string[];
  isVerified: boolean;
}

export interface AlumniProfile {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  major: string;
  currentRole: string;
  currentCompany: string;
  companyId: string;
  location: string;
  bio: string;
  skills: string[];
  internshipHistory: string[];
  linkedIn: string;
  willingToMentor: boolean;
}
```

To view the full mock data, read the file at `/src/app/data/mockData.ts`.

---

## Key Page Components

### 1. AlumniPage (`/src/app/pages/AlumniPage.tsx`)

**Purpose**: Alumni network with search, filtering, and mentor connections

**Key Features**:
- Search by name, company, skills
- Filter by company and mentor availability
- Display alumni cards with contact buttons
- Email and LinkedIn integration

**File location**: `/src/app/pages/AlumniPage.tsx`

### 2. CompaniesPage (`/src/app/pages/CompaniesPage.tsx`)

**Purpose**: Browse all companies with search and filters

**Key Features**:
- Search companies, roles, keywords
- Filter by industry
- Sort by rating, reviews, CSU hires, name
- Display company cards with key stats

**File location**: `/src/app/pages/CompaniesPage.tsx`

### 3. CompanyDetailPage (`/src/app/pages/CompanyDetailPage.tsx`)

**Purpose**: Detailed company view with reviews and salaries

**Key Features**:
- Company overview and details
- Reviews filtered by company
- Salary data charts
- Internship roles list
- Preferred certifications

**File location**: `/src/app/pages/CompanyDetailPage.tsx`

### 4. SalariesPage (`/src/app/pages/SalariesPage.tsx`)

**Purpose**: Salary data visualization and submission

**Key Features**:
- Interactive Recharts (bar, line, pie)
- Filter by company, role, year
- Submit salary data form
- Average salary calculations

**File location**: `/src/app/pages/SalariesPage.tsx`

### 5. ReviewsPage (`/src/app/pages/ReviewsPage.tsx`)

**Purpose**: Browse all internship reviews

**Key Features**:
- Search by company, role, skills
- Filter by company, semester, year, rating
- Display with expandable details
- Submit review button

**File location**: `/src/app/pages/ReviewsPage.tsx`

### 6. HomePage (`/src/app/pages/HomePage.tsx`)

**Purpose**: Landing page with hero and overview

**Key Features**:
- Hero section with CTA buttons
- Platform statistics
- Top-rated companies
- Recent reviews
- Feature highlights

**File location**: `/src/app/pages/HomePage.tsx`

### 7. AdminPage (`/src/app/pages/AdminPage.tsx`)

**Purpose**: Content moderation for admins

**Key Features**:
- Review pending submissions
- Approve/reject reviews
- Verify salary data
- User management
- Platform statistics

**File location**: `/src/app/pages/AdminPage.tsx`

---

## Component Files

### Navigation (`/src/app/components/Navigation.tsx`)
- Main navigation bar
- Logo and menu items
- User authentication state
- Mobile responsive

### RootLayout (`/src/app/components/RootLayout.tsx`)
- Wrapper for all pages
- Navigation component
- User state management
- Outlet for child routes

### AuthModal (`/src/app/components/AuthModal.tsx`)
- Login/Signup modal
- Form validation
- Role selection (student/alumni)
- Mock authentication

### ReviewSubmitModal (`/src/app/components/ReviewSubmitModal.tsx`)
- Submit review form
- Company selection
- Rating, pros, cons, interview details
- Skills tagging

---

## Styling

### `/src/styles/tailwind.css`
Main Tailwind imports

### `/src/styles/theme.css`
CSU-specific color tokens and theme variables

### `/src/styles/index.css`
Global styles

### `/src/styles/fonts.css`
Custom font imports (if any)

---

## UI Components Library

All reusable UI components in `/src/app/components/ui/`:

- `accordion.tsx` - Collapsible sections
- `alert-dialog.tsx` - Confirmation dialogs
- `avatar.tsx` - User avatars
- `badge.tsx` - Labels and tags
- `button.tsx` - Button component
- `card.tsx` - Card container
- `chart.tsx` - Chart wrapper
- `checkbox.tsx` - Checkbox input
- `dialog.tsx` - Modal dialogs
- `dropdown-menu.tsx` - Dropdown menus
- `input.tsx` - Text input
- `label.tsx` - Form labels
- `select.tsx` - Dropdown select
- `separator.tsx` - Horizontal lines
- `table.tsx` - Data tables
- `tabs.tsx` - Tab navigation
- `textarea.tsx` - Multi-line input
- `tooltip.tsx` - Tooltips

All built with Radix UI primitives and styled with Tailwind CSS.

---

## Backend Integration Guide

### Step 1: Create API Client

Create `/src/app/api/client.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchCompanies() {
  const response = await fetch(`${API_BASE_URL}/companies`);
  if (!response.ok) throw new Error('Failed to fetch companies');
  return response.json();
}

export async function fetchReviews(companyId?: string) {
  const url = companyId 
    ? `${API_BASE_URL}/reviews?companyId=${companyId}`
    : `${API_BASE_URL}/reviews`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
}

export async function submitReview(reviewData: any) {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  if (!response.ok) throw new Error('Failed to submit review');
  return response.json();
}

// Add more API functions...
```

### Step 2: Replace Mock Data Imports

**Before**:
```typescript
import { mockCompanies } from "../data/mockData";
```

**After**:
```typescript
import { useState, useEffect } from "react";
import { fetchCompanies } from "../api/client";

const [companies, setCompanies] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchCompanies()
    .then(data => setCompanies(data))
    .catch(error => console.error(error))
    .finally(() => setLoading(false));
}, []);
```

### Step 3: Add Loading States

```typescript
if (loading) {
  return <div>Loading...</div>;
}
```

### Step 4: Add Error Handling

```typescript
const [error, setError] = useState(null);

useEffect(() => {
  fetchCompanies()
    .then(data => setCompanies(data))
    .catch(error => setError(error.message))
    .finally(() => setLoading(false));
}, []);

if (error) {
  return <div>Error: {error}</div>;
}
```

### Step 5: Authentication Context

Create `/src/app/context/AuthContext.tsx`:
```typescript
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch current user from API
      fetchCurrentUser(token).then(setUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## Environment Variables

Create `.env.local`:
```
VITE_API_URL=http://localhost:3000/api
```

---

## File Structure Summary

```
/src
├── /app
│   ├── App.tsx                  # Main app component
│   ├── routes.ts                # Route configuration
│   │
│   ├── /components
│   │   ├── Navigation.tsx       # Nav bar
│   │   ├── RootLayout.tsx       # Layout wrapper
│   │   ├── AuthModal.tsx        # Login/signup
│   │   ├── ReviewSubmitModal.tsx
│   │   └── /ui                  # Reusable components
│   │
│   ├── /pages
│   │   ├── HomePage.tsx
│   │   ├── CompaniesPage.tsx
│   │   ├── CompanyDetailPage.tsx
│   │   ├── ReviewsPage.tsx
│   │   ├── SalariesPage.tsx
│   │   ├── AlumniPage.tsx
│   │   ├── AdminPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   └── /data
│       └── mockData.ts          # Mock data & interfaces
│
└── /styles
    ├── tailwind.css
    ├── theme.css
    ├── index.css
    └── fonts.css
```

---

## Package.json Dependencies

```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router": "7.13.0",
    "lucide-react": "0.487.0",
    "recharts": "2.15.2",
    "@radix-ui/react-*": "Latest",
    "tailwindcss": "4.1.12",
    "clsx": "2.1.1",
    "tailwind-merge": "3.2.0"
  },
  "devDependencies": {
    "vite": "6.3.5",
    "@vitejs/plugin-react": "4.7.0",
    "@tailwindcss/vite": "4.1.12"
  }
}
```

---

## How to View Full Code

All source files are located in:
- `/src/app/pages/` - All page components
- `/src/app/components/` - Reusable components
- `/src/app/data/mockData.ts` - Data structures and mock data

You can read each file individually using your code editor or by navigating to the file paths shown above.

---

## Next Steps

1. **Read the data structures** in `/src/app/data/mockData.ts`
2. **Design your database schema** matching the TypeScript interfaces
3. **Build REST API endpoints** as outlined in `FRONTEND_CODE_REFERENCE.md`
4. **Replace mock data imports** with API calls
5. **Add authentication** using JWT or sessions
6. **Test integration** between frontend and backend

Your backend needs to return JSON data matching the TypeScript interface shapes defined in mockData.ts!

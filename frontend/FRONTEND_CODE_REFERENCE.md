# CSU IS Internship Platform - Frontend Code Reference

This document contains all the frontend code structure to help you build the backend API.

## Table of Contents
1. [Data Structures (TypeScript Interfaces)](#data-structures)
2. [Application Architecture](#application-architecture)
3. [Routing Structure](#routing-structure)
4. [API Endpoints Needed](#api-endpoints-needed)
5. [Page Components](#page-components)
6. [Key Files](#key-files)

---

## Data Structures

All TypeScript interfaces are defined in `/src/app/data/mockData.ts`:

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
  logo: string;  // Emoji currently, can be URL
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
  rating: number;  // 1-5
  pros: string;
  cons: string;
  interview: string;
  recommendation: string;
  skills: string[];
  isApproved: boolean;  // For admin moderation
  createdAt: string;  // ISO date string
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

---

## Application Architecture

### Tech Stack
- **Framework**: React 18.3.1 with TypeScript
- **Routing**: React Router 7.13.0 (Data mode)
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts 2.15.2
- **Icons**: Lucide React 0.487.0
- **Build Tool**: Vite 6.3.5

### Project Structure
```
/src/app/
├── App.tsx                    # Main app component
├── routes.ts                  # Route configuration
├── components/
│   ├── Navigation.tsx         # Main navigation bar
│   ├── RootLayout.tsx         # Layout wrapper
│   ├── AuthModal.tsx          # Login/signup modal
│   ├── ReviewSubmitModal.tsx  # Submit review modal
│   └── ui/                    # Reusable UI components
├── pages/
│   ├── HomePage.tsx           # Landing page
│   ├── CompaniesPage.tsx      # Browse companies
│   ├── CompanyDetailPage.tsx  # Individual company page
│   ├── ReviewsPage.tsx        # Browse reviews
│   ├── SalariesPage.tsx       # Salary data & charts
│   ├── AlumniPage.tsx         # Alumni network
│   ├── AdminPage.tsx          # Admin moderation
│   └── NotFoundPage.tsx       # 404 page
└── data/
    └── mockData.ts            # Mock data (replace with API calls)
```

---

## Routing Structure

Routes defined in `/src/app/routes.ts`:

```typescript
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

## API Endpoints Needed

Here are the REST API endpoints your backend should provide:

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Users
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
```

### Companies
```
GET    /api/companies              # List all companies
GET    /api/companies/:id          # Get single company
POST   /api/companies              # Admin only
PUT    /api/companies/:id          # Admin only
DELETE /api/companies/:id          # Admin only
```

### Reviews
```
GET    /api/reviews                # Query params: ?companyId, ?userId, ?isApproved
GET    /api/reviews/:id
POST   /api/reviews                # Authenticated users
PUT    /api/reviews/:id            # Own reviews only
DELETE /api/reviews/:id            # Own reviews or admin
PATCH  /api/reviews/:id/approve    # Admin only
```

### Salaries
```
GET    /api/salaries               # Query params: ?companyId, ?role, ?year
GET    /api/salaries/:id
POST   /api/salaries               # Authenticated users
PUT    /api/salaries/:id           # Own data only
DELETE /api/salaries/:id           # Own data or admin
PATCH  /api/salaries/:id/verify    # Admin only
```

### Alumni
```
GET    /api/alumni                 # Query params: ?companyId, ?willingToMentor
GET    /api/alumni/:id
POST   /api/alumni                 # Alumni users only
PUT    /api/alumni/:id             # Own profile only
```

### Statistics (for dashboard)
```
GET    /api/stats/overview         # Total counts
GET    /api/stats/companies/:id    # Company-specific stats
GET    /api/stats/salaries         # Salary aggregations for charts
```

---

## Page Components

### 1. HomePage (`/`)
**Purpose**: Landing page with hero section, stats, featured companies

**Data Needed**:
- Top 6 companies by rating
- Platform statistics (total companies, reviews, users)
- Recent reviews (3-4 latest)

### 2. CompaniesPage (`/companies`)
**Purpose**: Browse and filter all companies

**Features**:
- Search by company name
- Filter by industry, location, size
- Sort by rating, reviews, CSU hires
- Display as cards with logo, rating, location

**Data Needed**:
- All companies with filtering/sorting
- Company stats (avg rating, review count, CSU hires)

### 3. CompanyDetailPage (`/companies/:id`)
**Purpose**: Detailed company information

**Features**:
- Company overview
- Internship roles offered
- Reviews for this company
- Salary data for this company
- Preferred certifications
- Apply button

**Data Needed**:
- Company details by ID
- Reviews filtered by companyId
- Salary data filtered by companyId
- Related companies (same industry)

### 4. ReviewsPage (`/reviews`)
**Purpose**: Browse all internship reviews

**Features**:
- Search by company, role, skills
- Filter by company, semester, year, rating
- Sort by date, rating, helpful
- Display with user name, role, rating, pros/cons

**Data Needed**:
- All approved reviews with filtering
- Company information for each review
- User information

### 5. SalariesPage (`/salaries`)
**Purpose**: Salary data visualization and submission

**Features**:
- Interactive charts (by company, role, year)
- Filter by company, role, internship type
- Submit salary data form
- Average salary statistics

**Data Needed**:
- All salary data with filtering
- Aggregated data for charts:
  - Average by company
  - Average by role
  - Trends over years
  - Distribution by internship type

### 6. AlumniPage (`/alumni`)
**Purpose**: Connect with CSU alumni network

**Features**:
- Search by name, company, skills
- Filter by company, mentor availability
- Display alumni cards with contact info
- Email and LinkedIn links

**Data Needed**:
- All alumni profiles with filtering
- Company information for alumni

### 7. AdminPage (`/admin`)
**Purpose**: Moderate content (Admin only)

**Features**:
- Review pending reviews
- Approve/reject reviews
- Verify salary submissions
- View all users
- Platform statistics

**Data Needed**:
- Pending reviews (isApproved: false)
- Unverified salary data
- User list with roles
- Platform statistics

---

## Key Files to Reference

### 1. Mock Data (`/src/app/data/mockData.ts`)
Contains:
- 52+ mock users
- 22 Cleveland companies
- 32 reviews
- 30 alumni profiles
- 20+ salary entries

This shows you exactly what data structure the frontend expects.

### 2. Example Page: AlumniPage.tsx
Shows:
- How data is fetched from mockData
- Filtering and search logic
- UI component structure
- State management with useState

### 3. Navigation Component
Shows:
- Current user state management
- Route navigation
- Responsive design patterns

---

## Frontend State Management

Currently using **React useState** for local state. For your backend integration:

1. **Replace mock imports** with API calls:
```typescript
// Current
import { mockCompanies, mockReviews } from "../data/mockData";

// After backend
import { useState, useEffect } from "react";

const [companies, setCompanies] = useState([]);
useEffect(() => {
  fetch('/api/companies')
    .then(res => res.json())
    .then(data => setCompanies(data));
}, []);
```

2. **Authentication State**:
```typescript
const [currentUser, setCurrentUser] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

3. **Form Submissions**:
```typescript
const handleSubmitReview = async (reviewData) => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  // Handle response
};
```

---

## Authentication Flow

1. **Login/Signup**: Modal component (`AuthModal.tsx`)
2. **Protected Routes**: Admin page requires admin role
3. **User Actions**: Review submission, salary submission require authentication
4. **User Types**:
   - **Student**: Can submit reviews/salaries, view all content
   - **Alumni**: Same as student + can create alumni profile
   - **Admin**: Can approve/reject reviews, verify salaries

---

## Search & Filter Patterns

### Company Filtering
```typescript
const filteredCompanies = companies.filter(company => {
  const matchesSearch = company.name.toLowerCase().includes(searchQuery);
  const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
  const matchesLocation = selectedLocation === 'all' || company.location.includes(selectedLocation);
  return matchesSearch && matchesIndustry && matchesLocation;
});
```

### Sorting
```typescript
const sortedCompanies = [...filteredCompanies].sort((a, b) => {
  if (sortBy === 'rating') return b.avgRating - a.avgRating;
  if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
  return 0;
});
```

---

## Charts & Visualizations

Using **Recharts** library for salary data:

1. **Bar Chart**: Average salary by company
2. **Line Chart**: Salary trends over years
3. **Pie Chart**: Distribution by internship type

Example chart data format:
```typescript
const chartData = [
  { company: 'Progressive', avgSalary: 27.5 },
  { company: 'Cleveland Clinic', avgSalary: 23.5 },
  // ...
];
```

---

## Sample Data Counts

Current mock data includes:
- **52 Users** (students, alumni, admins)
- **22 Companies** (Cleveland-based)
- **32 Reviews** (detailed internship experiences)
- **30 Alumni Profiles** (with mentorship info)
- **20+ Salary Entries** ($19-30/hour range)

---

## CSU Branding

Colors used:
- **Primary Green**: `#006747` (CSU Viking Green - darker shade)
- **Accent Green**: `#10b981`, `#059669`
- **Gray Scale**: Standard Tailwind grays

Typography:
- Clean, professional sans-serif
- Headers use larger font sizes with green accents

---

## Next Steps for Backend Development

1. **Set up database schema** based on TypeScript interfaces
2. **Create REST API endpoints** as outlined above
3. **Implement authentication** with JWT or sessions
4. **Add role-based authorization** (student, alumni, admin)
5. **Create seed data** using mockData.ts as reference
6. **Set up CORS** for frontend connection
7. **Add validation** for data submissions
8. **Implement search/filter** logic on backend
9. **Add pagination** for large datasets
10. **Create aggregation queries** for statistics/charts

---

## Questions?

This frontend is fully functional with mock data. To integrate your backend:

1. Replace `mockData` imports with `fetch()` or axios calls
2. Add loading states and error handling
3. Implement authentication context/provider
4. Add form validation and submission logic
5. Handle API errors gracefully

The current structure is **backend-agnostic** - you can use any backend (Node.js, Python Django/Flask, Java Spring, etc.) as long as it returns JSON matching these interfaces.

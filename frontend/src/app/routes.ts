import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { RootLayout } from "./components/RootLayout";

// 1. Lazy load the pages (Mapping your named exports to default exports for lazy loading)
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage").then(m => ({ default: m.CompaniesPage })));
const CompanyDetailPage = lazy(() => import("./pages/CompanyDetailPage").then(m => ({ default: m.CompanyDetailPage })));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage").then(m => ({ default: m.ReviewsPage })));
const SalariesPage = lazy(() => import("./pages/SalariesPage").then(m => ({ default: m.SalariesPage })));
const AlumniPage = lazy(() => import("./pages/AlumniPage").then(m => ({ default: m.AlumniPage })));
const AdminPage = lazy(() => import("./pages/AdminPage").then(m => ({ default: m.AdminPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const JobsPage = lazy(() => import("./pages/JobsPage").then(m => ({ default: m.JobsPage })));

// 2. Create a Suspense Wrapper for the loading state
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
    </div>
  }>
    {children}
  </Suspense>
);

// 3. Apply the wrapper using the 'element' prop instead of 'Component'
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // RootLayout stays standard so the Navbar is always visible instantly
    children: [
      { index: true, element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
      { path: "companies", element: <SuspenseWrapper><CompaniesPage /></SuspenseWrapper> },
      { path: "companies/:id", element: <SuspenseWrapper><CompanyDetailPage /></SuspenseWrapper> },
      { path: "reviews", element: <SuspenseWrapper><ReviewsPage /></SuspenseWrapper> },
      { path: "salaries", element: <SuspenseWrapper><SalariesPage /></SuspenseWrapper> },
      { path: "alumni", element: <SuspenseWrapper><AlumniPage /></SuspenseWrapper> },
      { path: "admin", element: <SuspenseWrapper><AdminPage /></SuspenseWrapper> },
      { path: "jobs", element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> },
      { path: "*", element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
    ],
  },
]);

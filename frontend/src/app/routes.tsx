import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { RootLayout } from "./components/RootLayout";

// 1. Lazy Load the pages
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage").then(m => ({ default: m.CompaniesPage })));
const CompanyDetailPage = lazy(() => import("./pages/CompanyDetailPage").then(m => ({ default: m.CompanyDetailPage })));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage").then(m => ({ default: m.ReviewsPage })));
const SalariesPage = lazy(() => import("./pages/SalariesPage").then(m => ({ default: m.SalariesPage })));
const AlumniPage = lazy(() => import("./pages/AlumniPage").then(m => ({ default: m.AlumniPage })));
const AlumniDetailPage = lazy(() => import("./pages/AlumniDetailPage").then(m => ({ default: m.AlumniDetailPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then(m => ({ default: m.SettingsPage })));
const SavedJobsPage = lazy(() => import("./pages/SavedJobsPage").then(m => ({ default: m.SavedJobsPage })));
const ApplicationsPage = lazy(() => import("./pages/ApplicationsPage").then(m => ({ default: m.ApplicationsPage })));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage").then(m => ({ default: m.DocumentsPage })));
const AdminPage = lazy(() => import("./pages/AdminPage").then(m => ({ default: m.AdminPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const JobsPage = lazy(() => import("./pages/JobsPage").then(m => ({ default: m.JobsPage })));
const CertificationsPage = lazy(() => import("./pages/CertificationsPage").then(m => ({ default: m.CertificationsPage })));
const CertificationDetailPage = lazy(() => import("./pages/CertificationDetailPage").then(m => ({ default: m.CertificationDetailPage })));

// 2. The Suspense Wrapper
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d694f]"></div>
    </div>
  }>
    {children}
  </Suspense>
);

// 3. The Router definition
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
      { path: "companies", element: <SuspenseWrapper><CompaniesPage /></SuspenseWrapper> },
      { path: "companies/:id", element: <SuspenseWrapper><CompanyDetailPage /></SuspenseWrapper> },
      { path: "reviews", element: <SuspenseWrapper><ReviewsPage /></SuspenseWrapper> },
      { path: "salaries", element: <SuspenseWrapper><SalariesPage /></SuspenseWrapper> },
      { path: "alumni", element: <SuspenseWrapper><AlumniPage /></SuspenseWrapper> },
      { path: "alumni/:id", element: <SuspenseWrapper><AlumniDetailPage /></SuspenseWrapper> },
      { path: "settings", element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
      { path: "saved-jobs", element: <SuspenseWrapper><SavedJobsPage /></SuspenseWrapper> },
      { path: "applications", element: <SuspenseWrapper><ApplicationsPage /></SuspenseWrapper> },
      { path: "documents", element: <SuspenseWrapper><DocumentsPage /></SuspenseWrapper> },
      { path: "admin", element: <SuspenseWrapper><AdminPage /></SuspenseWrapper> },
      { path: "jobs", element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> },
      { path: "certifications", element: <SuspenseWrapper><CertificationsPage /></SuspenseWrapper> },
      { path: "certifications/:id", element: <SuspenseWrapper><CertificationDetailPage /></SuspenseWrapper> },
      { path: "*", element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
    ],
  },
]);

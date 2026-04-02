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
# 🎓 CSU IS Career Hub - Final Project Report & Retrospective

## 1. Executive Summary
The CSU IS Career Hub is a full-stack web application designed to connect Cleveland State University Information Systems students with local internship opportunities, salary data, and alumni reviews. Over the course of 12 weeks, our team successfully moved from initial wireframes to a fully deployed, production-ready application.

## 2. Production Status
* **Live Production URL:** `https://csu-is-career-hub.onrender.com`
* **Source Code:** `https://github.com/Reuvi571/csu-is-career-hub`
* **Deployment Architecture:** Automated GitHub Actions CI/CD pipeline deploying a Vite/React frontend and Django REST Framework backend to Render.

## 3. Retrospective (What Went Well & Lessons Learned)
* **What went well:** Implementing the CI/CD pipeline early in Sprint 3 allowed us to catch integration errors quickly. Using Shadcn UI and Tailwind CSS drastically reduced our frontend development time while ensuring an accessible (WCAG compliant) design.
* **Challenges faced:** Managing state and initial load times on the frontend. We resolved this by implementing React Lazy Loading (`Suspense`), which improved our Lighthouse performance score from 58 to 97.
* **Lessons Learned:** Security and accessibility cannot be afterthoughts. Integrating OWASP standards and WebAIM checklists during Sprint 4 ensured our final product was robust and screen-reader friendly without requiring massive rewrites at the end.

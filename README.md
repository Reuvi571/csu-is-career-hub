# 🚀 CSU IS Career Hub - Check-in #4: Integration & Security

## ⚔️ Project Overview
The **CSU IS Career Hub** is a centralized, major-specific platform designed for Cleveland State University Information Systems students. It allows "Vikings" to track local internship opportunities, share salary data, and read peer reviews of Cleveland-based employers in a secure, accessible environment.

**Current Status:** Sprint 4 (Week 8) - Frontend/Backend Integration Complete.

## 🛠️ Updated Tech Stack
We have modernized our architecture to a decoupled, professional-grade stack:
* **Frontend:** React 18, TypeScript, Tailwind CSS, Shadcn UI, Vite.
* **Backend:** Python 3.12, Django 6.0.3, Django REST Framework.
* **Database:** SQLite (Development) / PostgreSQL (Production).
* **Security:** Django-CORS-Headers, Security+ compliant risk mitigation.
* **Auditing:** Lighthouse (93+ Accessibility), Manual Threat Modeling.



## 🌟 Sprint 4 Key Deliverables
* **Live Integration:** The React frontend now successfully fetches and displays live data from the Django REST API.
* **Job Discovery:** Successfully seeded the database with **20+ Cleveland-based IS internships** (Progressive, Hyland, KeyBank, etc.).
* **Interactive UI:** Implemented a functional Job Details modal and a dynamic Company Sorting system.
* **Security Audit:** Verified SQL Injection and XSS protections via the Django ORM and React auto-escaping.
* **Accessibility:** Achieved a **93+ Lighthouse score** through semantic HTML and ARIA label implementation.

## 👥 Team Lipins (Spring 2026)
* **Team Lead:** Ruben Lipins (Reuvi)
* **Developers:** Ronnelle C. Drakeford, Allen Nozic, Harman S. Randhawa, William R. Jackson, Madhav Ashokbhai Bhalani

## 🚀 Quick Start
### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python manage.py runserver`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 🤖 AI Usage Declaration
Utilized Google Gemini for:
* Architectural troubleshooting and state management logic.
* Generating CSV/JSON seed data for 20+ internship listings.
* Drafting the Sprint 4 Security Threat Model and Risk Register.
* *All AI-generated logic is manually reviewed and verified by the student team.*

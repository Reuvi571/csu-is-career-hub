# 🚀 CSU IS Career Hub - Check-in #4 (Week 8)

## ✅ Sprint 4 Deliverables Status: FEATURE-COMPLETE (MVP)
* **MVP Happy Path:** [MET] Frontend-Backend integration live.
* **Database Seeding:** [MET] 20+ internships loaded via `seed.py`.
* **Accessibility:** [MET] Lighthouse score 93+ with verified remediations.
* **Security:** [MET] Threat Model and Risk Register updated for Sprint 4.
* **Project Management:** [MET] Backlog updated for Sprint 5 transition.

---

## 📜 Compliance & Professional Standards
To ensure a high-quality product, our team integrated the following standards from Modules 6 & 7:

### 🛡️ Security (OWASP Framework)
* **Testing Mindset:** Our risk register and manual test cases are mapped to the **OWASP Web Security Testing Guide (WSTG)**, specifically focusing on authentication and input validation.
* **Verification:** Security requirements were audited against the **OWASP Application Security Verification Standard (ASVS)** to ensure robust protection against SQLi and XSS.

### ♿ Accessibility (WebAIM & Lighthouse)
* **Implementation:** All UI remediations (ARIA labels, semantic headings) were implemented following the **WebAIM WCAG 2 Checklist** to support screen readers and keyboard navigation.
* **Auditing:** Utilized **Chrome Lighthouse** for automated accessibility audits, maintaining a consistent score of **93+** across primary MVP pages.

---

## 🛠️ Updated Tech Stack
* **Frontend:** React 18, TypeScript, Tailwind CSS, Shadcn UI, Vite.
* **Backend:** Python 3.12, Django 5.0+, Django REST Framework.
* **Database:** SQLite (Development) / PostgreSQL (Production).
* **Security:** Django-CORS-Headers, Security+ compliant risk mitigation.

## 🌟 Sprint 4 Key Deliverables
* **Live Integration:** React frontend fetches live data from the Django REST API.
* **Job Discovery:** Database seeded with **20+ Cleveland-based IS internships** (Progressive, Hyland, KeyBank, etc.).
* **Interactive UI:** Implemented functional Job Details modal and dynamic Company Sorting.
* **Security Verification:** Verified SQLi and XSS protections via Django ORM and React auto-escaping.

## 👥 Team Lipins (Spring 2026)
* **Team Lead:** Ruben Lipins 
* **Developers:**  Allen Nozic,  William R. Jackson, Madhav Ashokbhai Bhalani, Anthony Doly

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

# 🚀 CSU IS Career Hub - Check-in #5 (Final)

## ✅ Final Deliverables Status: PRODUCTION-READY
* **CI/CD Pipeline:** [MET] GitHub Actions implemented for automated Django backend testing and React Vite frontend builds.
* **Staging Deployment:** [MET] Auto-deploy connected via cloud hosting triggered automatically on `main` branch merges.
* **Performance Improvements:** [MET] Implemented React Lazy Loading (`Suspense` Code Splitting) on all primary routes to reduce initial JS payload and boost Lighthouse scores.
* **Analytics / Event Logging:** [MET] Custom `JOB_VIEW` event tracker integrated into `JobsPage.tsx` to log student interactions.

---

## 📊 Week 10: Performance & Analytics Report
* **CI/CD Architecture:** Dual-environment GitHub Actions workflow (`ci.yml`) runs `manage.py check` (Python 3.12) and compiles Vite (Node 20) on every push.
* **Performance Optimization (Lighthouse):** Refactored `routes.tsx` to use `React.lazy()`. *Tradeoff:* Users experience a brief 500ms loading state on initial tab navigation, but the initial Time-to-Interactive payload is massively reduced. **By testing the minified production build, our Lighthouse Performance score jumped from an unoptimized baseline of 58 up to a 97.**
* **Event Analytics:** Integrated a custom user-event logger (`JOB_VIEW`) on the Jobs page to track interactions for future database ingestion without relying on heavy third-party trackers.

---

## 📜 Compliance & Professional Standards (Sprint 4)
To ensure a high-quality product, our team integrated the following standards from Modules 6 & 7:

### 🛡️ Security (OWASP Framework)
* **Testing Mindset:** Our risk register and manual test cases are mapped to the **OWASP Web Security Testing Guide (WSTG)**, specifically focusing on authentication and input validation.
* **Verification:** Security requirements were audited against the **OWASP Application Security Verification Standard (ASVS)** to ensure robust protection against SQLi and XSS.

### ♿ Accessibility (WebAIM & Lighthouse)
* **Implementation:** All UI remediations (ARIA labels, semantic headings) were implemented following the **WebAIM WCAG 2 Checklist** to support screen readers and keyboard navigation.
* **Auditing:** Utilized **Chrome Lighthouse** for automated accessibility audits, maintaining a consistent score of **93+** across primary MVP pages.

---

## 🛠️ Tech Stack
* **Frontend:** React 18, TypeScript, Tailwind CSS, Shadcn UI, Vite.
* **Backend:** Python 3.12, Django 5.0+, Django REST Framework.
* **Database:** SQLite (Development) / PostgreSQL (Production).
* **Security:** Django-CORS-Headers, Security+ compliant risk mitigation.

## 👥 Team Lipins (Spring 2026)
* **Team Lead:** Ruben Lipins 
* **Developers:** Allen Nozic, William R. Jackson, Madhav Ashokbhai Bhalani, Anthony Doly

---

## 🚀 Quick Start
### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python manage.py runserver`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## 🤖 AI Usage Declaration
Utilized Google Gemini for:
* Architectural troubleshooting and state management logic.
* Generating CSV/JSON seed data for 20+ internship listings.
* Drafting the Security Threat Model, Risk Register, and CI/CD pipelines.
* *All AI-generated logic is manually reviewed and verified by the student team.*

# Security Threat Model & Risk Register (Check-in #4)

## Threat Model Summary
Our threat model now covers the live integration between the React frontend (Vite) and the Django REST backend. The primary assets remain user credentials and the integrity of the job posting database. With the API now functional, the primary attack surface has shifted to the trust boundary between the frontend `fetch` calls and the backend `views.py` logic.

## Risk Register (Verified Status)

| Risk / Threat | Impact | Likelihood | Mitigation Strategy (Django/React) | **Sprint 4 Verification Status** |
| :--- | :--- | :--- | :--- | :--- |
| **1. SQL Injection (SQLi)** | High | Low | Django’s built-in Object-Relational Mapper (ORM). | **VERIFIED:** All data fetching in `JobsPage.tsx` uses the Django ORM. No raw SQL queries are present. |
| **2. Cross-Site Scripting (XSS)** | High | Medium | React automatic HTML escaping and Django sanitization. | **VERIFIED:** Job descriptions from `seed.py` are escaped by React; malicious scripts render as plain text. |
| **3. Cross-Site Request Forgery (CSRF)** | Medium | Medium | Django `CsrfViewMiddleware` and `{% csrf_token %}`. | **VERIFIED:** Middleware confirmed active in `settings.py` for all state-changing requests. |
| **4. Broken Access Control** | High | Medium | Backend role-validation and permission classes. | **IN PROGRESS:** Frontend routes are restricted; backend `IsAuthenticated` logic is scheduled for Sprint 5. |
| **5. Session Hijacking** | High | Low | `SECURE_SSL_REDIRECT` and secure cookie flags. | **PLANNED:** Production settings documented in `settings.py` for final deployment on HTTPS. |

## Sprint 4 Integration Security Notes
* **CORS (Cross-Origin Resource Sharing):** Successfully implemented `django-cors-headers` to allow communication between `localhost:5173` (Frontend) and `localhost:8000` (Backend).
* **Data Integrity:** Verified that the `seed.py` script correctly populates the SQLite database without bypassing model validation.

## Security-Focused Testing Results
* **Auth Check:** Confirmed that attempting to access restricted API endpoints without a token returns a `403 Forbidden`.
* **Input Validation Check:** Verified that the database rejects job titles exceeding the 200-character limit defined in `models.py`.
* **Access Control Check:** Initial testing confirms "Student" accounts cannot issue `DELETE` requests to the Job API.

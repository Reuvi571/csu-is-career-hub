# Security Threat Model & Risk Register (Week 7)

## Threat Model Summary
Our threat model focuses on the external boundaries of the CSU IS Career Hub. The primary assets are user credentials and the integrity of the job posting database. The main entry points are the authentication routes and the API endpoints for creating/updating job postings. Trust boundaries exist between the unauthenticated public internet and the internal Django application logic.

## Risk Register (Top 5 High-Risk Items)
| Risk / Threat | Impact | Likelihood | Mitigation Strategy (Django) |
| :--- | :--- | :--- | :--- |
| **1. SQL Injection (SQLi)** via search inputs or job creation forms. | High | Low | Utilize Django’s built-in Object-Relational Mapper (ORM) which automatically parameterizes queries, avoiding raw SQL. |
| **2. Cross-Site Scripting (XSS)** via malicious job descriptions. | High | Medium | Rely on Django templates' automatic HTML escaping to sanitize all user-submitted text before rendering it in the browser. |
| **3. Cross-Site Request Forgery (CSRF)** forcing admin actions. | Medium | Medium | Implement Django’s `CsrfViewMiddleware` and mandate `{% csrf_token %}` on all state-changing POST requests. |
| **4. Broken Access Control** (Student deleting a job post). | High | Medium | Enforce backend role-validation on all CRUD API endpoints. |
| **5. Session Hijacking** over unencrypted networks. | High | Low | Enforce `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, and `CSRF_COOKIE_SECURE` in production settings. |

## Security-Focused Testing Strategy
* **Auth Check:** Ensure `GET /api/jobs/create` returns a `403 Forbidden` for unauthenticated users.
* **Input Validation Check:** Ensure submitting a job with a title exceeding 200 characters returns a `400 Bad Request`.
* **Access Control Check:** Ensure a user with a "Student" role cannot issue a `DELETE` request to the job API.

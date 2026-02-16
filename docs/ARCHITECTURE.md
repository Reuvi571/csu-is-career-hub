# System Architecture & Data Model

## 1. Technical Stack Strategy
* **Frontend**: HTML5 / CSS (Bootstrap 5) / JavaScript (HTMX).
* **Backend**: Python (Django 5.0).
* **Database**: PostgreSQL 16.
* **Hosting**: Render (PaaS).

## 2. Entity Relationship Diagram (ERD) Narrative
### A. Users Table (`CustomUser`)
* **PK**: `id` (UUID).
* **Fields**: `email`, `role` (Enum: STUDENT, EMPLOYER, ADMIN).

### B. Job Postings (`JobPosting`)
* **FK**: `posted_by` (Link to Employer).
* **Fields**: `title`, `description`, `status`.

### C. Applications (`JobApplication`)
* **FK**: `job_id`, `student_id`.
* **Fields**: `status` (PENDING, REVIEW, REJECTED).

# System Architecture & Data Model

## 1. Technical Stack Strategy
* **Frontend**: HTML5 / CSS (Bootstrap 5) / JavaScript (HTMX).
    * *Rationale*: Low overhead; allows for rapid prototyping of the Job Board UI without complex build steps.
* **Backend**: Python (Django 5.0).
    * *Rationale*: The built-in Admin Interface reduces development time by ~40%, allowing the team to focus on Student features rather than internal tools.
* **Database**: PostgreSQL 16.
    * *Rationale*: Required for structured relational data (Users <-> Applications <-> Jobs) and ensures data integrity.
* **Hosting**: Render (PaaS) with CI/CD pipelines connected to GitHub `main` branch.

## 2. Entity Relationship Diagram (ERD) Narrative

### A. Users Table (`CustomUser`)
* Extends Django's AbstractUser.
* **PK**: `id` (UUID).
* **Fields**: `email`, `role` (Enum: STUDENT, EMPLOYER, ADMIN), `is_verified`.

### B. Student Profile (`StudentProfile`)
* **FK**: `user_id` (One-to-One with Users).
* **Fields**: `major` (e.g., IST, CS), `expected_graduation` (Date), `resume_link` (S3 URL).

### C. Job Postings (`JobPosting`)
* **PK**: `id` (Auto-increment).
* **FK**: `posted_by` (Link to Employer User).
* **Fields**: 
    * `title` (VarChar 255)
    * `job_type` (Enum: INTERNSHIP, CO_OP, FULL_TIME)
    * `description` (TextField/HTML)
    * `status` (Enum: DRAFT, PUBLISHED, ARCHIVED)

### D. Applications (`JobApplication`)
* **PK**: `id`.
* **FK**: `job_id` (Link to Job), `student_id` (Link to User).
* **Fields**: `status` (Enum: PENDING, REVIEW, REJECTED), `applied_at` (Timestamp).

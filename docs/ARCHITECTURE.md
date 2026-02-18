# System Architecture & Data Model

## 1. Technical Stack Strategy
* **Frontend**: HTML5 / CSS (Bootstrap 5) / JavaScript (HTMX).
* **Backend**: Python (Django 5.0).
* **Database**: PostgreSQL 16.
* **Hosting**: Render (PaaS).

## 2. Data Model & Schema
### 2.1 Schema Narrative
* **Users (`CustomUser`)**: Handles authentication and roles (Student vs. Employer).
* **Job Postings (`JobPosting`)**: Stores internship details linked to specific Employers.
* **Applications (`JobApplication`)**: Connects a Student to a Job Posting with a status workflow.

### 2.2 Entity Relationship Diagram (ERD)
```mermaid
erDiagram
    User ||--o{ Application : submits
    Employer ||--o{ JobPosting : creates
    JobPosting ||--o{ Application : receives

    User {
        UUID id PK
        string email
        string role "Student | Employer | Admin"
    }

    JobPosting {
        UUID id PK
        string title
        string company
        string location "Cleveland, OH"
        string status "Open | Closed"
    }

    Application {
        UUID id PK
        date submitted_at
        string status "Pending | Reviewed"
    }

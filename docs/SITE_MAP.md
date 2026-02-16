# Website Map & Navigation Structure

## 1.0 Public Layer (Unauthenticated)
* **1.1 Landing Page (`/`)**
    * Hero Section (Value Prop)
    * "For Students" CTA
    * "For Employers" CTA
    * Partner Logos / Trust Signals
* **1.2 Authentication**
    * Login (`/login`)
    * Student Sign-Up (`/signup/student`)
    * Employer Interest Form (`/signup/employer`)
    * Password Reset (`/password-reset`)
* **1.3 System Pages**
    * 404 Not Found
    * 403 Unauthorized (Access Denied)
    * 500 Server Error

## 2.0 Student Portal (Authenticated: Student Role)
* **2.1 Student Dashboard (`/student/dashboard`)**
    * Recent Applications Status
    * Recommended Jobs Widget
    * Profile Completion Meter
* **2.2 Job Board (`/jobs`)**
    * Main Search Interface
    * Sidebar Filters (Type, Location, Remote)
    * Job List / Grid View
* **2.3 Job Detail View (`/jobs/{id}`)**
    * Full Job Description
    * Company Info
    * **"Apply Now" Action**
* **2.4 My Applications (`/applications`)**
    * List of Applied Jobs
    * Status Badges (Pending, Interview, Rejected)
* **2.5 Profile Settings (`/profile`)**
    * Resume Upload
    * Portfolio Link
    * Skills Tagging

## 3.0 Admin/Employer Portal (Authenticated: Admin Role)
* **3.1 Employer Dashboard (`/admin/dashboard`)**
    * Key Metrics (Total Views, Total Applications)
    * Recent Activity Log
* **3.2 Job Management (`/admin/jobs`)**
    * List of Posted Jobs (Active/Draft/Closed)
    * **Create New Job (`/admin/jobs/create`)**
    * Edit Job (`/admin/jobs/{id}/edit`)
* **3.3 Applicant Review (`/admin/jobs/{id}/applicants`)**
    * List of Candidates per Job
    * Applicant Resume View
    * Status Update Action (Move to Interview/Reject)

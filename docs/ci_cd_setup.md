# CSU IS Career Hub – CI/CD Setup & Staging Deployment

**Author:** Madhav Bhalani (Updated for Check-in #5)

## Purpose
This document outlines the active Continuous Integration and Continuous Deployment (CI/CD) architecture implemented for the CSU IS Career Hub. It details how the project automates testing, builds, and staging deployments using GitHub Actions.

---

## Architecture Overview
Our pipeline is designed to handle a decoupled architecture, testing both the Django REST backend and the React/Vite frontend simultaneously on every code push.

### Tools Used
- **CI Runner:** GitHub Actions (Ubuntu-latest)
- **Backend Environment:** Python 3.12
- **Frontend Environment:** Node.js 20
- **Continuous Deployment (CD):** Cloud PaaS (e.g., Render/Vercel) Auto-Deploy

---

## The CI Process (Continuous Integration)

We have implemented a unified workflow located at `.github/workflows/ci.yml`. When code is pushed or a Pull Request is opened against the `main` branch, the following automated steps occur:

1. **Environment Setup:** GitHub Actions provisions a fresh Ubuntu server and checks out the latest repository code.
2. **Backend Validation:**
   - Installs Python 3.12.
   - Installs dependencies from `requirements.txt`.
   - Executes `python manage.py check` to verify Django configuration and database ORM integrity.
3. **Frontend Validation:**
   - Installs Node.js 20.
   - Installs `npm` dependencies.
   - Executes `npm run build` via Vite to ensure the React application compiles successfully without TypeScript or JSX syntax errors.
4. **Status Check:** If both the backend and frontend scripts exit with code `0`, the GitHub Action is marked as "Passed" (Green Checkmark).

---

## The CD Process (Continuous Deployment)

We have connected our `main` branch directly to our cloud staging environment. 

1. **Trigger:** Once a Pull Request is approved, merged into `main`, and passes the CI workflow, the CD pipeline is triggered.
2. **Deployment:** The cloud host automatically pulls the latest `main` branch, runs the build commands, and updates the live server.
3. **Availability:** The latest features become immediately available to the team and stakeholders on the live Staging URL.

---

## Example Developer Workflow
1. A developer creates a new feature (e.g., "React Lazy Loading").
2. Code is pushed to GitHub.
3. GitHub Actions automatically runs the `ci.yml` file to test the Django backend and build the React frontend.
4. If successful, the code is merged into `main`.
5. The cloud staging environment automatically detects the merge and deploys the updated application.

---

## Status
**[MET]** - CI/CD Pipeline and Staging Deployment are fully operational as per the Week 9 syllabus requirements.

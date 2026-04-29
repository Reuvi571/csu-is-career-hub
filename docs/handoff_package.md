# 📦 Project Handoff Package & Known Issues

## System Credentials
* **Admin Dashboard:** `/admin`
* **Superuser Account:** `admin` / `password123` (Note: Must be changed in production environments)
* **Test Student Account:** `student_demo` / `csu_is_2026`

## Local Setup Instructions
1. Clone repository: `git clone https://github.com/Reuvi571/csu-is-career-hub`
2. **Backend:** `cd backend`, `pip install -r requirements.txt`, `python manage.py runserver`
3. **Frontend:** `cd frontend`, `npm install`, `npm run dev`

## Known Issues (Bug Bash Triage)
1. **Easy Apply Button:** Currently mocked. Clicking it triggers an alert. File upload storage (AWS S3) needs to be configured in a future sprint.
2. **Image Loading:** Some unsplash placeholder images occasionally load slowly on the frontend depending on network speeds.
3. **Database:** The local environment uses SQLite, while production uses PostgreSQL. Schema migrations must be strictly synced before pushing.

## Future Roadmap (Next Sprints)
* Integrate SSO (Single Sign-On) with CSU's Microsoft 365 accounts.
* Implement a resume-parsing algorithm for automated skill matching.

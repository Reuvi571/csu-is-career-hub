# API Contract Draft (v1)

## Endpoints Summary
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Authenticate user and return session. | No |
| `GET` | `/api/jobs` | List all available IS internships/jobs. | Yes |
| `POST` | `/api/jobs` | Create a new job posting (Admin only). | Yes |
| `POST` | `/api/apply/{id}` | Submit an application for job ID. | Yes |

## Example: Create Job Posting
* **Request**: `POST /api/jobs`
* **Payload**: `{"title": "IS Intern", "company": "GCP", "type": "Internship"}`
* **Success**: `201 Created`

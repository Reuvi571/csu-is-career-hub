# Product Backlog (Check-in #4 Update)

| ID | Priority | Role | Feature | Status | Acceptance Criteria (Given/When/Then) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 3 | **MVP** | Student | View Companies | **MET** | Given I am on the site, When I click Companies, Then I see live data from the Django backend. |
| 4 | **MVP** | Student | Search | **MET** | Given I am on the list, When I type a company name, Then the list filters in real-time. |
| 6 | **MVP** | Student | View Salaries | **MET** | Given I am on the dashboard, When I check the chart, Then I see the average pay data. |
| 8 | **MVP** | Admin | Add Company | **MET** | Given a new partner, When the seed script runs, Then the database is populated with 20+ roles. |
| 10 | **MVP** | Security | SQL Check | **MET** | Given malicious input, When submitted, Then the Django ORM parameterizes the query. |
| 12 | Should | Student | Sort Ratings | **MET** | Given I want best companies, When I sort, Then the highest-rated companies appear first. |
| 17 | Could | Student | Dark Mode | **MET** | Given the current design, the site utilizes a modern dark gradient theme as the default. |
| 1 | **MVP** | Student | Sign Up | *Sprint 5* | Given I am a new user, When I enter a valid CSU email, Then my account is created. |
| 2 | **MVP** | Student | Log In | *Sprint 5* | Given I have an account, When I enter credentials, Then I am redirected to the Dashboard. |
| 5 | **MVP** | Student | Submit Review | *Sprint 5* | Given I am on a profile, When I fill out the form, Then my review is saved. |
| 7 | **MVP** | Admin | Delete Review | *Sprint 5* | Given a review is bad, When I click Delete, Then it is removed. |
| 9 | **MVP** | Student | Edit Profile | *Sprint 5* | Given I changed grad year, When I save, Then my profile updates. |
| 11 | Should | Student | Filter Location | *Sprint 5* | Given I want downtown jobs, When I filter, Then only downtown shows. |
| 13 | Should | Student | Tag Tech | *Sprint 5* | Given I used Python, When I review, Then I can tag "Python". |
| 14 | Should | Student | View Tech | *Sprint 5* | Given I view a company, Then I see their common tech stack. |
| 15 | Should | Student | Export Data | *Sprint 5* | Given I view salaries, When I click Export, Then I get a CSV. |
| 16 | Should | Admin | Ban User | *Sprint 5* | Given a user spams, When I click Ban, Then they cannot login. |
| 18 | Could | Student | Reset Password | *Sprint 5* | Given I forgot password, When I request, Then I get an email. |
| 19 | Could | Student | Delete Account | *Sprint 5* | Given I graduated, When I click Delete, Then my data is wiped. |
| 20 | Could | Admin | Analytics | *Sprint 5* | Given I am admin, Then I see total daily logins. |

## Sprint 4 Summary
The core "Happy Path" for job discovery is now fully integrated. The focus for this sprint was establishing a secure, accessible communication line between the React frontend and the Django backend. Items labeled "Sprint 5" have been deferred to ensure the stability of the core data-fetching architecture.

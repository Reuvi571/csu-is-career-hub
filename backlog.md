# Product Backlog

| ID | Priority | Role | Feature | Acceptance Criteria (Given/When/Then) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **MVP** | Student | Sign Up | Given I am a new user, When I enter a valid CSU email, Then my account is created. |
| 2 | **MVP** | Student | Log In | Given I have an account, When I enter credentials, Then I am redirected to the Dashboard. |
| 3 | **MVP** | Student | View Companies | Given I am logged in, When I click Companies, Then I see a list of Cleveland employers. |
| 4 | **MVP** | Student | Search | Given I am on the list, When I type "KeyBank", Then only KeyBank appears. |
| 5 | **MVP** | Student | Submit Review | Given I am on a profile, When I fill out the form, Then my review is saved. |
| 6 | **MVP** | Student | View Salaries | Given I am on the dashboard, When I check the chart, Then I see avg intern pay. |
| 7 | **MVP** | Admin | Delete Review | Given a review is bad, When I click Delete, Then it is removed. |
| 8 | **MVP** | Admin | Add Company | Given a new partner, When I enter details, Then a new profile is made. |
| 9 | **MVP** | Student | Edit Profile | Given I changed grad year, When I save, Then my profile updates. |
| 10 | **MVP** | Security | SQL Check | Given malicious input, When submitted, Then the API sanitizes it. |
| 11 | Should | Student | Filter Location | Given I want downtown jobs, When I filter, Then only downtown shows. |
| 12 | Should | Student | Sort Ratings | Given I want best companies, When I sort, Then 5-star shows first. |
| 13 | Should | Student | Tag Tech | Given I used Python, When I review, Then I can tag "Python". |
| 14 | Should | Student | View Tech | Given I view a company, Then I see their common tech stack. |
| 15 | Should | Student | Export Data | Given I view salaries, When I click Export, Then I get a CSV. |
| 16 | Should | Admin | Ban User | Given a user spams, When I click Ban, Then they cannot login. |
| 17 | Could | Student | Dark Mode | Given I like dark mode, When I toggle, Then colors invert. |
| 18 | Could | Student | Reset Password | Given I forgot password, When I request, Then I get an email. |
| 19 | Could | Student | Delete Account | Given I graduated, When I click Delete, Then my data is wiped. |
| 20 | Could | Admin | Analytics | Given I am admin, Then I see total daily logins. |

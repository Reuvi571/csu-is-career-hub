# CSU IS Career Hub – CI/CD Setup

Author: Madhav Bhalani

## Purpose
This document explains the CI/CD (Continuous Integration / Continuous Deployment) setup for the project.

---

## What is CI/CD?

CI/CD helps automate:
- Code testing
- Code integration
- Deployment process

This ensures the project runs correctly after every update.

---

## CI Process (Continuous Integration)

When code is pushed to GitHub:
1. GitHub Actions runs automatically
2. Code is checked for errors
3. Tests are executed
4. If tests pass → code is valid

---

## CD Process (Continuous Deployment)

After successful checks:
- Code can be deployed to a staging environment
- Team can test the latest version of the application

---

## Tools Used

- GitHub Actions
- GitHub Repository (Pull Requests)
- Automated Testing (basic test cases)

---

## Example Workflow

1. Developer creates a feature
2. Opens a Pull Request
3. CI runs tests automatically
4. If successful → PR is merged
5. Updated version is deployed

---

## Benefits

- Reduces errors
- Improves code quality
- Speeds up development
- Ensures stable updates

---

## Next Steps

- Add automated test scripts
- Connect deployment to staging server
- Monitor CI logs in GitHub Actions

---

## Summary

CI/CD helps maintain code quality and ensures the project is stable and ready for deployment after every change.
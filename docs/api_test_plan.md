# CSU IS Career Hub – API Test Plan

Author: Madhav Bhalani  
Module: API Testing  
Feature: Job Posting API

## Purpose
This document defines initial API test cases for the Job Posting endpoints in the CSU IS Career Hub project.  
The goal is to verify that the backend CRUD functionality works correctly.

---

## API Endpoints Being Tested

1. GET /api/jobs  
2. POST /api/jobs/create

---

## Test Case 1 – Retrieve Job Listings

Endpoint:
GET /api/jobs

Goal:
Verify that the API successfully returns job listings.

Expected Result:
- Status code 200 OK
- Response contains a list of jobs
- Each job includes fields such as:
  - title
  - company
  - location

Pass Criteria:
The endpoint returns valid data and no errors.

---

## Test Case 2 – Create New Job Posting

Endpoint:
POST /api/jobs/create

Example Input:

{
"title": "Data Analyst Intern",
"company": "Progressive Insurance",
"location": "Cleveland, OH"
}

Expected Result:
- Status code 201 Created
- New job posting is stored in the database
- Job appears when GET /api/jobs is called

Pass Criteria:
The job is successfully created and retrievable.

---

## Test Case 3 – Missing Field Validation

Endpoint:
POST /api/jobs/create

Example Input:

{
"title": "Data Analyst Intern"
}

Expected Result:
- API returns validation error
- Job is NOT created
- Proper error message is returned

Pass Criteria:
Invalid requests are rejected correctly.

---

## Future Testing

Additional tests will be created for:

- Update job endpoint
- Delete job endpoint
- Frontend integration testing

---

## Summary

These tests represent the first step in validating the backend vertical slice for the CSU IS Career Hub application.

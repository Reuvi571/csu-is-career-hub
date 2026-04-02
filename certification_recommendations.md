# CSU IS Career Hub – Certification Recommendations

**Author:** Madhav Bhalani & Development Team
**Purpose:** This document maps required technical skills found in local job postings to industry-recognized certifications. This mapping will serve as the data dictionary for the Recommendation Engine in the CSU IS Career Hub.

---

## 🌐 Web Development & Design
| Required Skill / Keyword | Recommended Certification | Related Roles |
| :--- | :--- | :--- |
| HTML, CSS, Responsive Design | W3C Front End Web Developer | Front-End Intern, Web Designer |
| JavaScript, DOM Manipulation | Meta Front-End Developer | Web App Developer, Software Intern |
| React, State Management | IBM Front-End Development | React Developer Intern, UI Engineer |
| Wireframing, Prototyping, UX | Google UX Design Certificate | UX Intern, Product Design Intern |

## ☁️ Cloud Computing & Architecture
| Required Skill / Keyword | Recommended Certification | Related Roles |
| :--- | :--- | :--- |
| AWS, Cloud Basics, S3, EC2 | AWS Certified Cloud Practitioner | Cloud Support Intern, IT Analyst |
| Azure, Microsoft Cloud | Microsoft Certified: Azure Fundamentals | IT Support Analyst, Systems Analyst |
| Oracle, OCI, Infrastructure | Oracle Cloud Infrastructure Foundations | Cloud Operations Intern |

## 🛡️ Cybersecurity & Networking
| Required Skill / Keyword | Recommended Certification | Related Roles |
| :--- | :--- | :--- |
| Cybersecurity, Threat Analysis | CompTIA Security+ | InfoSec Intern, Security Analyst |
| Risk Management, Access Control | Google Cybersecurity Certificate | Junior Cybersecurity Analyst |
| TCP/IP, Routing, Switches | CompTIA Network+ / Cisco CCNA | Network Engineer Intern |

## 📊 Data & Database Management
| Required Skill / Keyword | Recommended Certification | Related Roles |
| :--- | :--- | :--- |
| SQL, Relational Databases | Oracle Database SQL Certified | Database Intern, Data Analyst |
| Data Visualization, Tableau | Google Data Analytics Certificate | Business Analyst Intern |

## 💻 Software Engineering & Version Control
| Required Skill / Keyword | Recommended Certification | Related Roles |
| :--- | :--- | :--- |
| Python, Scripting | PCEP (Entry-Level Python Programmer) | Software Developer Intern |
| C#, .NET Framework | Microsoft Certified: C# Certification | Backend Developer Intern |
| Git, GitHub, Version Control | GitHub Foundations | Developer Intern, DevOps Intern |

## 🛠️ IT Support & Project Management
| Required Skill / Keyword | Recommended Certification | Related Roles |
| :--- | :--- | :--- |
| Help Desk, Hardware, Windows | CompTIA A+ | Help Desk Support, IT Tech |
| Agile, Sprints, Scrum | Certified ScrumMaster (CSM) | Junior Scrum Master, PM Intern |
| Project Management, SDLC | CAPM (Associate in Project Management) | IT Project Coordinator Intern |

---

### ⚙️ Developer Note: Backend Data Structure
Use this dictionary structure for the recommendation logic in `views.py` when we build the engine next sprint.

```python
CERT_MAPPING = {
    "HTML": ["W3C Front End Web Developer"],
    "CSS": ["W3C Front End Web Developer"],
    "JavaScript": ["Meta Front-End Developer"],
    "React": ["IBM Front-End Development"],
    "AWS": ["AWS Certified Cloud Practitioner"],
    "Azure": ["Microsoft Certified: Azure Fundamentals"],
    "UX": ["Google UX Design Certificate"],
    "SQL": ["Oracle Database SQL Certified", "Google Data Analytics Certificate"],
    "Git": ["GitHub Foundations"],
    "Cybersecurity": ["CompTIA Security+", "Google Cybersecurity Certificate"],
    "Python": ["PCEP (Entry-Level Python Programmer)"],
    "Troubleshooting": ["CompTIA A+"]
}

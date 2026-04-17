import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from jobs.models import Company, Role, Certification, JobPosting, CompanyReview
from django.utils import timezone


def run():
    # reset
    JobPosting.objects.all().delete()
    CompanyReview.objects.all().delete()
    Company.objects.all().delete()
    Role.objects.all().delete()
    Certification.objects.all().delete()

    # -------------------
    # COMPANIES
    # -------------------
    companies = {
        "Hyland": Company.objects.create(name="Hyland", location="Westlake, OH"),
        "Progressive": Company.objects.create(name="Progressive Insurance", location="Cleveland, OH"),
        "KeyBank": Company.objects.create(name="KeyBank", location="Cleveland, OH"),
        "Cleveland Clinic": Company.objects.create(name="Cleveland Clinic", location="Cleveland, OH"),
        "MRI Software": Company.objects.create(name="MRI Software", location="Solon, OH"),
        "IBM": Company.objects.create(name="IBM", location="Hybrid / Ohio"),
        "Sherwin-Williams": Company.objects.create(name="Sherwin-Williams", location="Cleveland, OH"),
        "Eaton": Company.objects.create(name="Eaton", location="Beachwood, OH"),
        "Medical Mutual": Company.objects.create(name="Medical Mutual", location="Cleveland, OH"),
        "OnShift": Company.objects.create(name="OnShift", location="Cleveland, OH"),
        "CrossCountry": Company.objects.create(name="CrossCountry Mortgage", location="Cleveland, OH"),
        "MetroHealth": Company.objects.create(name="The MetroHealth System", location="Cleveland, OH"),
        "PNC": Company.objects.create(name="PNC Bank", location="Cleveland, OH"),
        "Flexjet": Company.objects.create(name="Flexjet", location="Richmond Heights, OH"),
        "Rocket": Company.objects.create(name="Rocket Software", location="Hybrid / Ohio"),
    }

    # -------------------
    # ROLES
    # -------------------
    roles = {
        "Frontend": Role.objects.create(name="Front-End Developer"),
        "Data": Role.objects.create(name="Data Analyst"),
        "Business": Role.objects.create(name="Business Analyst"),
        "IT": Role.objects.create(name="IT Support"),
        "UX": Role.objects.create(name="UI/UX Designer"),
        "Cloud": Role.objects.create(name="Cloud Operations"),
        "Software": Role.objects.create(name="Software Developer"),
        "Database": Role.objects.create(name="Database"),
        "Systems": Role.objects.create(name="Systems Analyst"),
        "Support": Role.objects.create(name="Product Support"),
    }

    # -------------------
    # CERTIFICATIONS
    # -------------------
    certs = {
        "SQL": Certification.objects.create(
            name="SQL Certificate",
            description="Master SQL fundamentals including queries, joins, aggregations, and database design. Essential for data professionals.",
            organization="Various providers (Microsoft, Oracle, etc.)"
        ),
        "PowerBI": Certification.objects.create(
            name="Power BI Certificate",
            description="Learn data visualization and business analytics using Microsoft Power BI. Create interactive dashboards and reports.",
            organization="Microsoft"
        ),
        "HTMLCSS": Certification.objects.create(
            name="HTML/CSS Certificate",
            description="Build strong foundation in web markup and styling. Essential for front-end development and web design.",
            organization="Various providers"
        ),
        "JS": Certification.objects.create(
            name="JavaScript Certificate",
            description="Master JavaScript programming language for client-side and server-side development. Core skill for web developers.",
            organization="Various providers"
        ),
        "React": Certification.objects.create(
            name="React Certificate",
            description="Learn React library for building dynamic user interfaces. Includes components, hooks, state management.",
            organization="Meta/Facebook"
        ),
        "AWS": Certification.objects.create(
            name="AWS Cloud Practitioner",
            description="Foundational cloud computing certification covering AWS services, architecture, and best practices.",
            organization="Amazon Web Services"
        ),
        "Azure": Certification.objects.create(
            name="Azure Fundamentals",
            description="Introduction to Microsoft Azure cloud services and cloud computing concepts.",
            organization="Microsoft"
        ),
        "UX": Certification.objects.create(
            name="UI/UX Design Certificate",
            description="Learn user interface and user experience design principles, tools like Figma, and design thinking methodologies.",
            organization="Various providers"
        ),
        "Git": Certification.objects.create(
            name="Git/GitHub Certificate",
            description="Master version control using Git and GitHub. Essential for collaborative software development.",
            organization="GitHub/Linux Foundation"
        ),
        "Tableau": Certification.objects.create(
            name="Tableau Desktop Specialist",
            description="Validate foundational Tableau skills for building dashboards, visual analysis, and communicating insights to stakeholders.",
            organization="Tableau"
        ),
        "Salesforce": Certification.objects.create(
            name="Salesforce Administrator",
            description="Learn CRM configuration, reports, automation, and security concepts used in many business systems roles.",
            organization="Salesforce"
        ),
        "SecurityPlus": Certification.objects.create(
            name="CompTIA Security+",
            description="Covers core cybersecurity principles including risk management, network security, identity, and incident response.",
            organization="CompTIA"
        ),
        "NetworkPlus": Certification.objects.create(
            name="CompTIA Network+",
            description="Build practical knowledge of networking fundamentals, troubleshooting, protocols, and infrastructure support.",
            organization="CompTIA"
        ),
        "Python": Certification.objects.create(
            name="Python Programming Certificate",
            description="Develop Python skills for automation, scripting, data processing, and back-end application development.",
            organization="Various providers"
        ),
        "Agile": Certification.objects.create(
            name="Certified ScrumMaster",
            description="Understand Agile delivery, Scrum ceremonies, team collaboration, and iterative product development workflows.",
            organization="Scrum Alliance"
        ),
    }

    # Assign roles to certifications
    certs["SQL"].roles.add(roles["Data"], roles["Database"], roles["Business"])
    certs["PowerBI"].roles.add(roles["Data"], roles["Business"])
    certs["HTMLCSS"].roles.add(roles["Frontend"], roles["UX"])
    certs["JS"].roles.add(roles["Frontend"], roles["Software"])
    certs["React"].roles.add(roles["Frontend"], roles["Software"])
    certs["AWS"].roles.add(roles["Cloud"], roles["Software"], roles["Systems"])
    certs["Azure"].roles.add(roles["Cloud"], roles["IT"], roles["Systems"])
    certs["UX"].roles.add(roles["UX"], roles["Frontend"])
    certs["Git"].roles.add(roles["Software"], roles["Frontend"], roles["Systems"])
    certs["Tableau"].roles.add(roles["Data"], roles["Business"])
    certs["Salesforce"].roles.add(roles["Business"], roles["Support"], roles["Systems"])
    certs["SecurityPlus"].roles.add(roles["IT"], roles["Cloud"], roles["Systems"])
    certs["NetworkPlus"].roles.add(roles["IT"], roles["Systems"], roles["Support"])
    certs["Python"].roles.add(roles["Data"], roles["Software"], roles["Database"])
    certs["Agile"].roles.add(roles["Business"], roles["Software"], roles["UX"], roles["Systems"])

    def create_job(
        title,
        company,
        location,
        description,
        experience_level,
        salary_range,
        skills,
        cert_list,
        role_list,
    ):
        job = JobPosting.objects.create(
            title=title,
            company=company,
            location=location,
            description=description,
            experience_level=experience_level,
            salary_range=salary_range,
        )
        for role in role_list:
            job.roles.add(role)
        for c in cert_list:
            job.certifications.add(c)

    # -------------------
    # JOBS
    # -------------------

    job_seed_data = [
        {
            "title": "Front-End Developer Intern",
            "company": companies["Hyland"],
            "location": "Westlake, OH",
            "description": "Support UI enhancements for internal product teams and help maintain reusable front-end components.",
            "experience_level": "Internship",
            "salary_range": "$21/hr - $24/hr",
            "skills": ["HTML", "CSS", "JavaScript", "React"],
            "certs": [certs["HTMLCSS"], certs["JS"], certs["React"]],
            "roles": [roles["Frontend"]],
        },
        {
            "title": "Data Analyst Intern",
            "company": companies["Progressive"],
            "location": "Cleveland, OH",
            "description": "Analyze operational data, build recurring reports, and present insights to analytics and business teams.",
            "experience_level": "Internship",
            "salary_range": "$23/hr - $27/hr",
            "skills": ["SQL", "Excel", "Power BI"],
            "certs": [certs["SQL"], certs["PowerBI"], certs["Tableau"]],
            "roles": [roles["Data"]],
        },
        {
            "title": "Business Analyst Intern",
            "company": companies["KeyBank"],
            "location": "Cleveland, OH",
            "description": "Document business requirements, prepare process maps, and help coordinate enhancements across banking systems.",
            "experience_level": "Internship",
            "salary_range": "$22/hr - $25/hr",
            "skills": ["Excel", "SQL", "Communication"],
            "certs": [certs["SQL"], certs["Azure"], certs["Agile"]],
            "roles": [roles["Business"]],
        },
        {
            "title": "IT Support Intern",
            "company": companies["Cleveland Clinic"],
            "location": "Cleveland, OH",
            "description": "Provide first-line technical support for clinical and administrative users across enterprise systems.",
            "experience_level": "Internship",
            "salary_range": "$19/hr - $22/hr",
            "skills": ["Troubleshooting", "Networking", "Customer Service"],
            "certs": [certs["AWS"], certs["Azure"], certs["NetworkPlus"]],
            "roles": [roles["IT"]],
        },
        {
            "title": "UI/UX Design Intern",
            "company": companies["MRI Software"],
            "location": "Solon, OH",
            "description": "Assist with wireframes, prototypes, and user testing artifacts for product design teams.",
            "experience_level": "Internship",
            "salary_range": "$20/hr - $24/hr",
            "skills": ["Figma", "Wireframing", "Prototyping"],
            "certs": [certs["UX"], certs["HTMLCSS"], certs["Agile"]],
            "roles": [roles["UX"]],
        },
        {
            "title": "Cloud Operations Intern",
            "company": companies["IBM"],
            "location": "Hybrid / Ohio",
            "description": "Help monitor cloud workloads, update automation scripts, and support infrastructure health checks.",
            "experience_level": "Internship",
            "salary_range": "$24/hr - $28/hr",
            "skills": ["Cloud Basics", "Scripting", "Monitoring"],
            "certs": [certs["AWS"], certs["Azure"], certs["SecurityPlus"]],
            "roles": [roles["Cloud"]],
        },
        {
            "title": "Software Developer Intern",
            "company": companies["Sherwin-Williams"],
            "location": "Cleveland, OH",
            "description": "Contribute to internal application features, test fixes, and collaborate in an Agile development workflow.",
            "experience_level": "Internship",
            "salary_range": "$23/hr - $27/hr",
            "skills": ["JavaScript", "GitHub", "Testing"],
            "certs": [certs["JS"], certs["Git"], certs["Agile"]],
            "roles": [roles["Software"]],
        },
        {
            "title": "Database Intern",
            "company": companies["Eaton"],
            "location": "Beachwood, OH",
            "description": "Support database maintenance, reporting queries, and data validation work for enterprise systems.",
            "experience_level": "Internship",
            "salary_range": "$22/hr - $26/hr",
            "skills": ["SQL", "Data Modeling", "Documentation"],
            "certs": [certs["SQL"], certs["Python"]],
            "roles": [roles["Database"]],
        },
        {
            "title": "Systems Analyst Intern",
            "company": companies["Medical Mutual"],
            "location": "Cleveland, OH",
            "description": "Assist with business systems analysis, issue triage, and documentation for platform improvements.",
            "experience_level": "Internship",
            "salary_range": "$21/hr - $24/hr",
            "skills": ["Documentation", "Excel", "Process Mapping"],
            "certs": [certs["Azure"], certs["Git"], certs["Agile"]],
            "roles": [roles["Systems"]],
        },
        {
            "title": "Product Support Intern",
            "company": companies["OnShift"],
            "location": "Cleveland, OH",
            "description": "Respond to product issues, document resolutions, and escalate technical problems to engineering partners.",
            "experience_level": "Internship",
            "salary_range": "$18/hr - $21/hr",
            "skills": ["Communication", "Troubleshooting", "Ticketing Systems"],
            "certs": [certs["HTMLCSS"], certs["UX"], certs["NetworkPlus"]],
            "roles": [roles["Support"]],
        },
        {
            "title": "React Developer Co-op",
            "company": companies["Hyland"],
            "location": "Westlake, OH",
            "description": "Build React-based features, improve accessibility, and help maintain component libraries used across teams.",
            "experience_level": "Co-op",
            "salary_range": "$24/hr - $29/hr",
            "skills": ["React", "TypeScript", "Accessibility"],
            "certs": [certs["React"], certs["JS"], certs["Git"]],
            "roles": [roles["Frontend"], roles["Software"]],
        },
        {
            "title": "Business Intelligence Intern",
            "company": companies["Progressive"],
            "location": "Cleveland, OH",
            "description": "Develop dashboards and performance reports for stakeholders using modern BI tooling and SQL-based datasets.",
            "experience_level": "Internship",
            "salary_range": "$23/hr - $26/hr",
            "skills": ["SQL", "Power BI", "Dashboarding"],
            "certs": [certs["PowerBI"], certs["Tableau"], certs["SQL"]],
            "roles": [roles["Data"], roles["Business"]],
        },
        {
            "title": "Risk Systems Analyst Intern",
            "company": companies["KeyBank"],
            "location": "Cleveland, OH",
            "description": "Support analyst teams with reporting, system documentation, and requirement gathering for risk platforms.",
            "experience_level": "Internship",
            "salary_range": "$22/hr - $26/hr",
            "skills": ["Excel", "SQL", "Requirements Gathering"],
            "certs": [certs["SQL"], certs["Salesforce"], certs["Agile"]],
            "roles": [roles["Business"], roles["Systems"]],
        },
        {
            "title": "Clinical Applications Support Intern",
            "company": companies["Cleveland Clinic"],
            "location": "Cleveland, OH",
            "description": "Assist with ticket resolution, system access requests, and support workflows tied to clinical applications.",
            "experience_level": "Internship",
            "salary_range": "$20/hr - $23/hr",
            "skills": ["Support", "Documentation", "Networking"],
            "certs": [certs["Azure"], certs["NetworkPlus"], certs["SecurityPlus"]],
            "roles": [roles["IT"], roles["Support"]],
        },
        {
            "title": "Product Design Co-op",
            "company": companies["MRI Software"],
            "location": "Solon, OH",
            "description": "Partner with designers and PMs to prototype workflows and refine interfaces based on user research.",
            "experience_level": "Co-op",
            "salary_range": "$21/hr - $25/hr",
            "skills": ["Figma", "User Research", "Design Systems"],
            "certs": [certs["UX"], certs["HTMLCSS"], certs["Agile"]],
            "roles": [roles["UX"], roles["Frontend"]],
        },
        {
            "title": "Cloud Platform Analyst Intern",
            "company": companies["IBM"],
            "location": "Hybrid / Ohio",
            "description": "Help track deployment health, audit cloud resources, and support infrastructure reporting for platform teams.",
            "experience_level": "Internship",
            "salary_range": "$24/hr - $30/hr",
            "skills": ["Cloud Monitoring", "Python", "Infrastructure"],
            "certs": [certs["AWS"], certs["Azure"], certs["Python"]],
            "roles": [roles["Cloud"], roles["Systems"]],
        },
        {
            "title": "Full Stack Developer Intern",
            "company": companies["Sherwin-Williams"],
            "location": "Cleveland, OH",
            "description": "Support APIs and front-end workflows for internal business applications used across enterprise teams.",
            "experience_level": "Internship",
            "salary_range": "$24/hr - $28/hr",
            "skills": ["JavaScript", "React", "APIs"],
            "certs": [certs["React"], certs["JS"], certs["Git"]],
            "roles": [roles["Software"], roles["Frontend"]],
        },
        {
            "title": "Reporting Database Co-op",
            "company": companies["Eaton"],
            "location": "Beachwood, OH",
            "description": "Create reporting extracts, validate datasets, and help improve data quality for operations reporting.",
            "experience_level": "Co-op",
            "salary_range": "$23/hr - $27/hr",
            "skills": ["SQL", "ETL", "Data Validation"],
            "certs": [certs["SQL"], certs["PowerBI"], certs["Python"]],
            "roles": [roles["Database"], roles["Data"]],
        },
        {
            "title": "Enterprise Systems Intern",
            "company": companies["Medical Mutual"],
            "location": "Cleveland, OH",
            "description": "Document business processes, help analyze issues, and support system enhancement planning for core platforms.",
            "experience_level": "Internship",
            "salary_range": "$21/hr - $25/hr",
            "skills": ["Analysis", "Documentation", "Communication"],
            "certs": [certs["Azure"], certs["Salesforce"], certs["Agile"]],
            "roles": [roles["Systems"], roles["Business"]],
        },
        {
            "title": "Customer Platform Support Co-op",
            "company": companies["OnShift"],
            "location": "Cleveland, OH",
            "description": "Work with implementation and support teams to troubleshoot customer platform issues and improve documentation.",
            "experience_level": "Co-op",
            "salary_range": "$19/hr - $22/hr",
            "skills": ["Customer Support", "Troubleshooting", "SaaS"],
            "certs": [certs["Salesforce"], certs["NetworkPlus"], certs["UX"]],
            "roles": [roles["Support"], roles["Systems"]],
        },
        {
            "title": "Mortgage Technology Analyst Intern",
            "company": companies["CrossCountry"],
            "location": "Cleveland, OH",
            "description": "Support mortgage platform reporting, user requests, and data cleanup for digital lending tools.",
            "experience_level": "Internship",
            "salary_range": "$21/hr - $24/hr",
            "skills": ["Excel", "SQL", "Reporting"],
            "certs": [certs["SQL"], certs["PowerBI"], certs["Salesforce"]],
            "roles": [roles["Business"], roles["Data"]],
        },
        {
            "title": "Healthcare Data Operations Intern",
            "company": companies["MetroHealth"],
            "location": "Cleveland, OH",
            "description": "Prepare operational datasets, validate reporting logic, and assist analytics teams serving healthcare operations.",
            "experience_level": "Internship",
            "salary_range": "$22/hr - $25/hr",
            "skills": ["SQL", "Data Quality", "Excel"],
            "certs": [certs["SQL"], certs["Tableau"], certs["PowerBI"]],
            "roles": [roles["Data"], roles["Database"]],
        },
        {
            "title": "Payments Technology Intern",
            "company": companies["PNC"],
            "location": "Cleveland, OH",
            "description": "Assist delivery teams supporting payment systems through testing, analysis, and requirements documentation.",
            "experience_level": "Internship",
            "salary_range": "$23/hr - $27/hr",
            "skills": ["Testing", "Requirements", "Documentation"],
            "certs": [certs["Agile"], certs["Azure"], certs["Git"]],
            "roles": [roles["Business"], roles["Systems"]],
        },
        {
            "title": "Flight Operations Systems Intern",
            "company": companies["Flexjet"],
            "location": "Richmond Heights, OH",
            "description": "Support operational systems used by scheduling and dispatch teams through analysis and issue follow-up.",
            "experience_level": "Internship",
            "salary_range": "$22/hr - $26/hr",
            "skills": ["Systems Analysis", "Excel", "Support"],
            "certs": [certs["NetworkPlus"], certs["Agile"], certs["Azure"]],
            "roles": [roles["Systems"], roles["Support"]],
        },
        {
            "title": "Application Security Intern",
            "company": companies["Rocket"],
            "location": "Hybrid / Ohio",
            "description": "Work with engineers on secure development practices, issue remediation tracking, and access reviews.",
            "experience_level": "Internship",
            "salary_range": "$25/hr - $30/hr",
            "skills": ["Security", "Scripting", "Code Review"],
            "certs": [certs["SecurityPlus"], certs["AWS"], certs["Git"]],
            "roles": [roles["Software"], roles["Cloud"]],
        },
        {
            "title": "Software QA Intern",
            "company": companies["Hyland"],
            "location": "Westlake, OH",
            "description": "Create test cases, log defects, and support release validation for enterprise product teams.",
            "experience_level": "Internship",
            "salary_range": "$20/hr - $23/hr",
            "skills": ["Testing", "Bug Tracking", "Communication"],
            "certs": [certs["Agile"], certs["Git"], certs["JS"]],
            "roles": [roles["Software"], roles["Support"]],
        },
        {
            "title": "Analytics Engineering Intern",
            "company": companies["Progressive"],
            "location": "Cleveland, OH",
            "description": "Help prepare transformed datasets, automate recurring reporting, and support analytics engineering projects.",
            "experience_level": "Internship",
            "salary_range": "$24/hr - $28/hr",
            "skills": ["SQL", "Python", "Data Pipelines"],
            "certs": [certs["Python"], certs["SQL"], certs["PowerBI"]],
            "roles": [roles["Data"], roles["Database"]],
        },
        {
            "title": "CRM Business Systems Intern",
            "company": companies["KeyBank"],
            "location": "Cleveland, OH",
            "description": "Assist teams that support CRM workflows, reporting, and user enablement across sales and service units.",
            "experience_level": "Internship",
            "salary_range": "$22/hr - $25/hr",
            "skills": ["CRM", "Requirements", "Reporting"],
            "certs": [certs["Salesforce"], certs["Agile"], certs["SQL"]],
            "roles": [roles["Business"], roles["Support"]],
        },
        {
            "title": "Endpoint Support Intern",
            "company": companies["Cleveland Clinic"],
            "location": "Cleveland, OH",
            "description": "Provide hardware and software support, resolve workstation issues, and assist with endpoint rollouts.",
            "experience_level": "Internship",
            "salary_range": "$18/hr - $21/hr",
            "skills": ["Windows Support", "Networking", "Customer Service"],
            "certs": [certs["NetworkPlus"], certs["SecurityPlus"], certs["Azure"]],
            "roles": [roles["IT"], roles["Support"]],
        },
        {
            "title": "Design Systems Intern",
            "company": companies["MRI Software"],
            "location": "Solon, OH",
            "description": "Help maintain UI patterns, update component guidance, and support consistency across product experiences.",
            "experience_level": "Internship",
            "salary_range": "$21/hr - $24/hr",
            "skills": ["Design Systems", "Figma", "Front-End Basics"],
            "certs": [certs["UX"], certs["HTMLCSS"], certs["React"]],
            "roles": [roles["UX"], roles["Frontend"]],
        },
        {
            "title": "DevOps Automation Intern",
            "company": companies["IBM"],
            "location": "Hybrid / Ohio",
            "description": "Support CI pipelines, automate routine tasks, and help teams improve cloud deployment reliability.",
            "experience_level": "Internship",
            "salary_range": "$25/hr - $29/hr",
            "skills": ["Python", "Automation", "Cloud"],
            "certs": [certs["AWS"], certs["Python"], certs["Git"]],
            "roles": [roles["Cloud"], roles["Software"]],
        },
        {
            "title": "ERP Support Intern",
            "company": companies["Sherwin-Williams"],
            "location": "Cleveland, OH",
            "description": "Assist with enterprise application support, issue tracking, and reporting tied to ERP operations.",
            "experience_level": "Internship",
            "salary_range": "$21/hr - $24/hr",
            "skills": ["ERP", "Documentation", "Support"],
            "certs": [certs["Azure"], certs["Salesforce"], certs["Agile"]],
            "roles": [roles["Systems"], roles["Support"]],
        },
        {
            "title": "Manufacturing Data Analyst Intern",
            "company": companies["Eaton"],
            "location": "Beachwood, OH",
            "description": "Analyze operational metrics, prepare visual dashboards, and support reporting for manufacturing teams.",
            "experience_level": "Internship",
            "salary_range": "$22/hr - $26/hr",
            "skills": ["SQL", "Tableau", "Excel"],
            "certs": [certs["SQL"], certs["Tableau"], certs["PowerBI"]],
            "roles": [roles["Data"], roles["Business"]],
        },
        {
            "title": "Information Security Operations Intern",
            "company": companies["Medical Mutual"],
            "location": "Cleveland, OH",
            "description": "Monitor security operations tasks, review tickets, and support control documentation and follow-up work.",
            "experience_level": "Internship",
            "salary_range": "$23/hr - $27/hr",
            "skills": ["Security Operations", "Documentation", "Risk"],
            "certs": [certs["SecurityPlus"], certs["NetworkPlus"], certs["Azure"]],
            "roles": [roles["IT"], roles["Systems"]],
        },
        {
            "title": "Implementation Support Analyst Intern",
            "company": companies["OnShift"],
            "location": "Cleveland, OH",
            "description": "Help onboarding teams configure client environments and troubleshoot setup questions during implementations.",
            "experience_level": "Internship",
            "salary_range": "$19/hr - $22/hr",
            "skills": ["Implementation", "Customer Support", "Documentation"],
            "certs": [certs["Salesforce"], certs["Agile"], certs["NetworkPlus"]],
            "roles": [roles["Support"], roles["Business"]],
        },
    ]

    for job_data in job_seed_data:
        create_job(
            job_data["title"],
            job_data["company"],
            job_data["location"],
            job_data["description"],
            job_data["experience_level"],
            job_data["salary_range"],
            job_data["skills"],
            job_data["certs"],
            job_data["roles"],
        )

    # -------------------
    # REVIEWS
    # -------------------

    CompanyReview.objects.create(
        company=companies["Hyland"],
        role="Front-End Intern",
        rating=4.6,
        pros="Modern stack",
        cons="Fast paced",
        interview_process="Frontend challenge",
        recommendation="Good experience",
        skills_used="React, JS"
    )

    CompanyReview.objects.create(
        company=companies["Progressive"],
        role="Data Analyst Intern",
        rating=4.3,
        pros="Great learning environment",
        cons="Slow processes",
        interview_process="SQL + behavioral",
        recommendation="Good for beginners",
        skills_used="SQL, Excel"
    )

    CompanyReview.objects.create(
        company=companies["IBM"],
        role="Cloud Intern",
        rating=4.7,
        pros="Strong cloud exposure",
        cons="Complex systems",
        interview_process="Cloud basics",
        recommendation="Great for cloud path",
        skills_used="AWS"
    )

    print("✅ FULL seed loaded )")


if __name__ == "__main__":
    run()

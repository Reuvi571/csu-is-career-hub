import os
import sys
import django
import re
from django.core.files.base import ContentFile

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from jobs.models import Company, Role, Certification, JobPosting, CompanyReview, SalaryReport, CareerUserProfile, Alumni, SavedJob, SavedCompany, SavedCertification, SavedAlumni, JobApplication, CertificationProgress
from django.utils import timezone

User = get_user_model()


def parse_hourly_range(salary_range):
    values = re.findall(r"\d+(?:\.\d+)?", salary_range or "")
    if len(values) < 2:
        return None, None

    return values[0], values[1]


def infer_position_type(title, experience_level):
    combined = f"{title} {experience_level}".lower()

    if "co-op" in combined or "co op" in combined or "coop" in combined:
        return "co_op"
    if "part-time" in combined or "part time" in combined:
        return "part_time"
    if "entry" in combined:
        return "entry_level"

    return "internship"


def slugify_for_url(value):
    cleaned = re.sub(r"[^a-z0-9]+", "-", (value or "").strip().lower())
    return cleaned.strip("-")


def build_apply_url(company, title):
    company_slug = slugify_for_url(company.name)
    title_slug = slugify_for_url(title)
    domain = company.website or "example.com"
    return f"https://{domain}/careers/{title_slug}?source=csu-is-career-hub"


def run():
    # reset
    CareerUserProfile.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete()
    SavedJob.objects.all().delete()
    SavedCompany.objects.all().delete()
    SavedCertification.objects.all().delete()
    SavedAlumni.objects.all().delete()
    CertificationProgress.objects.all().delete()
    JobApplication.objects.all().delete()
    Alumni.objects.all().delete()
    JobPosting.objects.all().delete()
    CompanyReview.objects.all().delete()
    SalaryReport.objects.all().delete()
    Company.objects.all().delete()
    Role.objects.all().delete()
    Certification.objects.all().delete()

    # -------------------
    # COMPANIES
    # -------------------
    companies = {
        "Hyland": Company.objects.create(name="Hyland", location="Westlake, OH", industry="Enterprise Software", size="3,000+ employees", website="hyland.com", description="Hyland develops enterprise content management and workflow products used by healthcare, public sector, and commercial teams."),
        "Progressive": Company.objects.create(name="Progressive Insurance", location="Cleveland, OH", industry="Insurance Technology", size="10,000+ employees", website="progressive.com", description="Progressive hires across analytics, product, and software teams supporting digital insurance operations and internal platforms."),
        "KeyBank": Company.objects.create(name="KeyBank", location="Cleveland, OH", industry="Financial Services", size="17,000+ employees", website="key.com", description="KeyBank supports banking, data, and enterprise systems roles tied to digital channels, reporting, and risk platforms."),
        "Cleveland Clinic": Company.objects.create(name="Cleveland Clinic", location="Cleveland, OH", industry="Healthcare", size="70,000+ employees", website="clevelandclinic.org", description="Cleveland Clinic maintains large-scale clinical and business systems with opportunities in support, applications, analytics, and operations."),
        "MRI Software": Company.objects.create(name="MRI Software", location="Solon, OH", industry="Real Estate Technology", size="4,000+ employees", website="mrisoftware.com", description="MRI Software builds property and real estate technology products with design, front-end, and product support opportunities."),
        "IBM": Company.objects.create(name="IBM", location="Hybrid / Ohio", industry="Cloud and Consulting", size="100,000+ employees", website="ibm.com", description="IBM offers cloud, platform, and software roles that expose students to enterprise-scale systems and automation workflows."),
        "Sherwin-Williams": Company.objects.create(name="Sherwin-Williams", location="Cleveland, OH", industry="Manufacturing", size="60,000+ employees", website="sherwin-williams.com", description="Sherwin-Williams hires for business systems, software, and reporting roles tied to supply chain, retail, and enterprise operations."),
        "Eaton": Company.objects.create(name="Eaton", location="Beachwood, OH", industry="Industrial Technology", size="90,000+ employees", website="eaton.com", description="Eaton supports data, reporting, and business technology roles connected to manufacturing and operations teams."),
        "Medical Mutual": Company.objects.create(name="Medical Mutual", location="Cleveland, OH", industry="Health Insurance", size="2,000+ employees", website="medmutual.com", description="Medical Mutual hires students for systems, security, and business operations roles supporting health insurance platforms."),
        "OnShift": Company.objects.create(name="OnShift", location="Cleveland, OH", industry="Workforce Software", size="1,000+ employees", website="onshift.com", description="OnShift offers product support and implementation-facing opportunities working with workforce management software."),
        "CrossCountry": Company.objects.create(name="CrossCountry Mortgage", location="Cleveland, OH", industry="Mortgage Technology", size="7,000+ employees", website="crosscountrymortgage.com", description="CrossCountry Mortgage supports analysts and operations roles tied to mortgage platforms, reporting, and customer workflows."),
        "MetroHealth": Company.objects.create(name="The MetroHealth System", location="Cleveland, OH", industry="Healthcare", size="8,000+ employees", website="metrohealth.org", description="MetroHealth maintains operational and clinical systems that create opportunities in reporting, analytics, and business systems support."),
        "PNC": Company.objects.create(name="PNC Bank", location="Cleveland, OH", industry="Financial Services", size="50,000+ employees", website="pnc.com", description="PNC hires across payments technology, infrastructure, and analyst roles supporting banking systems and customer-facing platforms."),
        "Flexjet": Company.objects.create(name="Flexjet", location="Richmond Heights, OH", industry="Aviation", size="3,000+ employees", website="flexjet.com", description="Flexjet supports operational systems roles tied to scheduling, dispatch, reporting, and internal aviation technology workflows."),
        "Rocket": Company.objects.create(name="Rocket Software", location="Hybrid / Ohio", industry="Software", size="2,500+ employees", website="rocketsoftware.com", description="Rocket offers software, security, and platform roles with a strong focus on product engineering and cloud-adjacent systems."),
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
            organization="Various providers (Microsoft, Oracle, etc.)",
            official_url="https://learn.microsoft.com/en-us/credentials/",
        ),
        "PowerBI": Certification.objects.create(
            name="Power BI Certificate",
            description="Learn data visualization and business analytics using Microsoft Power BI. Create interactive dashboards and reports.",
            organization="Microsoft",
            official_url="https://learn.microsoft.com/en-us/credentials/certifications/power-bi-data-analyst-associate/",
        ),
        "HTMLCSS": Certification.objects.create(
            name="HTML/CSS Certificate",
            description="Build strong foundation in web markup and styling. Essential for front-end development and web design.",
            organization="Various providers",
            official_url="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
        ),
        "JS": Certification.objects.create(
            name="JavaScript Certificate",
            description="Master JavaScript programming language for client-side and server-side development. Core skill for web developers.",
            organization="Various providers",
            official_url="https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        ),
        "React": Certification.objects.create(
            name="React Certificate",
            description="Learn React library for building dynamic user interfaces. Includes components, hooks, state management.",
            organization="Meta/Facebook",
            official_url="https://www.coursera.org/professional-certificates/meta-front-end-developer",
        ),
        "AWS": Certification.objects.create(
            name="AWS Cloud Practitioner",
            description="Foundational cloud computing certification covering AWS services, architecture, and best practices.",
            organization="Amazon Web Services",
            official_url="https://aws.amazon.com/certification/certified-cloud-practitioner/",
        ),
        "Azure": Certification.objects.create(
            name="Azure Fundamentals",
            description="Introduction to Microsoft Azure cloud services and cloud computing concepts.",
            organization="Microsoft",
            official_url="https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
        ),
        "UX": Certification.objects.create(
            name="UI/UX Design Certificate",
            description="Learn user interface and user experience design principles, tools like Figma, and design thinking methodologies.",
            organization="Various providers",
            official_url="https://www.coursera.org/professional-certificates/google-ux-design",
        ),
        "Git": Certification.objects.create(
            name="Git/GitHub Certificate",
            description="Master version control using Git and GitHub. Essential for collaborative software development.",
            organization="GitHub/Linux Foundation",
            official_url="https://skills.github.com/",
        ),
        "Tableau": Certification.objects.create(
            name="Tableau Desktop Specialist",
            description="Validate foundational Tableau skills for building dashboards, visual analysis, and communicating insights to stakeholders.",
            organization="Tableau",
            official_url="https://www.tableau.com/learn/certification/desktop-specialist",
        ),
        "Salesforce": Certification.objects.create(
            name="Salesforce Administrator",
            description="Learn CRM configuration, reports, automation, and security concepts used in many business systems roles.",
            organization="Salesforce",
            official_url="https://trailheadacademy.salesforce.com/credentials/administratoroverview/",
        ),
        "SecurityPlus": Certification.objects.create(
            name="CompTIA Security+",
            description="Covers core cybersecurity principles including risk management, network security, identity, and incident response.",
            organization="CompTIA",
            official_url="https://www.comptia.org/certifications/security",
        ),
        "NetworkPlus": Certification.objects.create(
            name="CompTIA Network+",
            description="Build practical knowledge of networking fundamentals, troubleshooting, protocols, and infrastructure support.",
            organization="CompTIA",
            official_url="https://www.comptia.org/certifications/network",
        ),
        "Python": Certification.objects.create(
            name="Python Programming Certificate",
            description="Develop Python skills for automation, scripting, data processing, and back-end application development.",
            organization="Various providers",
            official_url="https://www.python.org/about/gettingstarted/",
        ),
        "Agile": Certification.objects.create(
            name="Certified ScrumMaster",
            description="Understand Agile delivery, Scrum ceremonies, team collaboration, and iterative product development workflows.",
            organization="Scrum Alliance",
            official_url="https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster",
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

    users = {}
    user_seed_data = [
        {
            "key": "admin",
            "email": "admin@csu.edu",
            "first_name": "Admin",
            "last_name": "User",
            "role": "admin",
            "graduation_year": None,
            "major": "Information Systems",
            "is_staff": True,
        },
        {
            "key": "student",
            "email": "sarah.j@csu.edu",
            "first_name": "Sarah",
            "last_name": "Johnson",
            "role": "student",
            "graduation_year": 2026,
            "major": "Information Systems",
            "is_staff": False,
        },
        {
            "key": "alumni",
            "email": "michael.c@csu.edu",
            "first_name": "Michael",
            "last_name": "Chen",
            "role": "alumni",
            "graduation_year": 2024,
            "major": "Information Systems",
            "is_staff": False,
        },
    ]

    for user_data in user_seed_data:
        user = User.objects.create_user(
            username=user_data["email"],
            email=user_data["email"],
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            password="csu-demo-login",
        )
        user.is_staff = user_data["is_staff"]
        user.save(update_fields=["is_staff"])

        CareerUserProfile.objects.create(
            user=user,
            role=user_data["role"],
            graduation_year=user_data["graduation_year"],
            major=user_data["major"],
            target_roles="Data Analyst, Software Developer" if user_data["role"] == "student" else "",
            seeking_types="internship, entry_level" if user_data["role"] == "student" else "",
            preferred_location="Cleveland, OH" if user_data["role"] == "student" else "",
            bio="Interested in internships and early-career CSU IS opportunities." if user_data["role"] == "student" else "",
        )
        users[user_data["key"]] = user

    student_profile = users["student"].career_profile
    student_profile.default_resume.save(
        "sarah-johnson-resume.pdf",
        ContentFile(b"CSU IS Career Hub demo resume for Sarah Johnson."),
        save=True,
    )

    alumni_profile = users["alumni"].career_profile
    alumni_profile.default_resume.save(
        "michael-chen-resume.pdf",
        ContentFile(b"CSU IS Career Hub demo resume for Michael Chen."),
        save=True,
    )

    def create_job(
        title,
        company,
        location,
        description,
        experience_level,
        salary_range,
        cert_list,
        role_list,
        application_type="company_site",
    ):
        min_hourly_rate, max_hourly_rate = parse_hourly_range(salary_range)

        job = JobPosting.objects.create(
            title=title,
            company=company,
            location=location,
            description=description,
            experience_level=experience_level,
            position_type=infer_position_type(title, experience_level),
            application_type=application_type,
            apply_url=build_apply_url(company, title) if application_type == "company_site" else "",
            min_hourly_rate=min_hourly_rate,
            max_hourly_rate=max_hourly_rate,
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
            "application_type": "csu_internal",
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
            "application_type": "csu_internal",
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
            "application_type": "csu_internal",
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
            "application_type": "csu_internal",
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
            "application_type": "csu_internal",
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
            "application_type": "csu_internal",
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
            "application_type": "csu_internal",
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
            "application_type": "csu_internal",
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
            job_data["certs"],
            job_data["roles"],
            job_data.get("application_type", "company_site"),
        )

    # -------------------
    # REVIEWS
    # -------------------

    CompanyReview.objects.create(
        company=companies["Hyland"],
        user=users["student"],
        role="Front-End Intern",
        rating=4.6,
        pros="Modern stack",
        cons="Fast paced",
        interview_process="Frontend challenge",
        recommendation="Good experience",
        skills_used="React, JS",
        status="approved",
    )

    CompanyReview.objects.create(
        company=companies["Progressive"],
        user=users["alumni"],
        role="Data Analyst Intern",
        rating=4.3,
        pros="Great learning environment",
        cons="Slow processes",
        interview_process="SQL + behavioral",
        recommendation="Good for beginners",
        skills_used="SQL, Excel",
        status="approved",
    )

    CompanyReview.objects.create(
        company=companies["IBM"],
        user=users["student"],
        role="Cloud Intern",
        rating=4.7,
        pros="Strong cloud exposure",
        cons="Complex systems",
        interview_process="Cloud basics",
        recommendation="Great for cloud path",
        skills_used="AWS",
        status="approved",
    )

    CompanyReview.objects.create(
        company=companies["MRI Software"],
        user=users["student"],
        role="UI/UX Design Intern",
        rating=4.2,
        pros="Supportive product design team and strong feedback cycles.",
        cons="Some projects moved slowly because of multiple stakeholders.",
        interview_process="Portfolio review followed by a design walkthrough and behavioral interview.",
        recommendation="A strong fit for students who want product design exposure.",
        skills_used="Figma, Prototyping, Research",
        status="pending",
    )

    salary_seed_data = [
        {"year": 2023, "position_type": "internship", "avg_hourly_rate": 20.5, "min_hourly_rate": 18, "max_hourly_rate": 23, "posting_count": 26},
        {"year": 2024, "position_type": "internship", "avg_hourly_rate": 21.8, "min_hourly_rate": 19, "max_hourly_rate": 24, "posting_count": 28},
        {"year": 2025, "position_type": "internship", "avg_hourly_rate": 23.6, "min_hourly_rate": 20, "max_hourly_rate": 27, "posting_count": 31},
        {"year": 2026, "position_type": "internship", "avg_hourly_rate": 24.8, "min_hourly_rate": 21, "max_hourly_rate": 30, "posting_count": 35},
        {"year": 2023, "position_type": "co_op", "avg_hourly_rate": 21.2, "min_hourly_rate": 19, "max_hourly_rate": 24, "posting_count": 8},
        {"year": 2024, "position_type": "co_op", "avg_hourly_rate": 22.7, "min_hourly_rate": 20, "max_hourly_rate": 25, "posting_count": 9},
        {"year": 2025, "position_type": "co_op", "avg_hourly_rate": 24.4, "min_hourly_rate": 21, "max_hourly_rate": 28, "posting_count": 10},
        {"year": 2026, "position_type": "co_op", "avg_hourly_rate": 25.9, "min_hourly_rate": 22, "max_hourly_rate": 29, "posting_count": 12},
        {"year": 2023, "position_type": "part_time", "avg_hourly_rate": 17.6, "min_hourly_rate": 15, "max_hourly_rate": 20, "posting_count": 5},
        {"year": 2024, "position_type": "part_time", "avg_hourly_rate": 18.3, "min_hourly_rate": 16, "max_hourly_rate": 20, "posting_count": 6},
        {"year": 2025, "position_type": "part_time", "avg_hourly_rate": 19.4, "min_hourly_rate": 17, "max_hourly_rate": 21, "posting_count": 6},
        {"year": 2026, "position_type": "part_time", "avg_hourly_rate": 20.2, "min_hourly_rate": 18, "max_hourly_rate": 22, "posting_count": 7},
        {"year": 2023, "position_type": "entry_level", "avg_hourly_rate": 25.7, "min_hourly_rate": 22, "max_hourly_rate": 29, "posting_count": 10},
        {"year": 2024, "position_type": "entry_level", "avg_hourly_rate": 27.3, "min_hourly_rate": 24, "max_hourly_rate": 31, "posting_count": 11},
        {"year": 2025, "position_type": "entry_level", "avg_hourly_rate": 29.1, "min_hourly_rate": 25, "max_hourly_rate": 33, "posting_count": 12},
        {"year": 2026, "position_type": "entry_level", "avg_hourly_rate": 30.6, "min_hourly_rate": 27, "max_hourly_rate": 35, "posting_count": 13},
    ]

    for report in salary_seed_data:
        SalaryReport.objects.create(
            company=report.get("company"),
            role=report.get("role", ""),
            position_type=report["position_type"],
            year=report["year"],
            avg_hourly_rate=report["avg_hourly_rate"],
            min_hourly_rate=report["min_hourly_rate"],
            max_hourly_rate=report["max_hourly_rate"],
            posting_count=report["posting_count"],
        )

    alumni_seed_data = [
        {
            "name": "Michael Chen",
            "company": companies["Progressive"],
            "role": "Data Analyst",
            "headline": "CSU IS alum working on pricing and claims analytics.",
            "location": "Cleveland, OH",
            "bio": "Michael moved from a CSU analytics internship into a full-time analyst role and now works on reporting pipelines used by business stakeholders.",
            "how_they_got_there": "He started with a Progressive internship, built stronger SQL and dashboard samples during the semester, and stayed in touch with his internship manager before applying for the full-time opening.",
            "experience_highlights": "Worked on internal dashboards, stakeholder reporting, and translating business questions into clear datasets and visuals.",
            "advice_for_students": "Bring examples of how you cleaned up messy data and explain how your analysis influenced a decision. Employers respond well to that more than generic tool lists.",
            "internship_history": "Progressive Data Analyst Intern | CSU analytics capstone project",
            "skills": "SQL, Power BI, Tableau, Excel, Stakeholder Communication",
            "is_mentor": True,
            "open_to_questions": True,
            "open_to_referrals": False,
            "email": "michael.chen.alumni@csu.edu",
            "linkedin_url": "https://www.linkedin.com/in/michael-chen-csu",
            "graduation_year": 2024,
        },
        {
            "name": "Alyssa Brooks",
            "company": companies["Hyland"],
            "role": "Software Developer",
            "headline": "Former CSU front-end intern now building internal product tools.",
            "location": "Westlake, OH",
            "bio": "Alyssa interned in UI engineering and returned to Hyland full time after graduation, focusing on component work and product enhancements.",
            "how_they_got_there": "Her internship conversion came after she documented the impact of a design-system cleanup project and kept a polished GitHub portfolio ready for interviews.",
            "experience_highlights": "Converted internship work into a full-time offer and now mentors students interested in front-end and product engineering roles.",
            "advice_for_students": "Show code you can explain clearly. Even a small but polished project says more than a resume bullet full of buzzwords.",
            "internship_history": "Hyland Front-End Developer Intern | CSU web development project lead",
            "skills": "React, TypeScript, Design Systems, CSS, Git",
            "is_mentor": True,
            "open_to_questions": True,
            "open_to_referrals": True,
            "email": "alyssa.brooks.alumni@csu.edu",
            "linkedin_url": "https://www.linkedin.com/in/alyssa-brooks-csu",
            "graduation_year": 2023,
        },
        {
            "name": "David Patel",
            "company": companies["KeyBank"],
            "role": "Business Systems Analyst",
            "headline": "Business systems alum supporting enterprise banking workflows.",
            "location": "Cleveland, OH",
            "bio": "David works with operations and product teams to document requirements, improve internal workflows, and support enterprise releases.",
            "how_they_got_there": "He leveraged a CSU business analysis class project, a summer internship, and strong interview stories about process mapping and stakeholder communication.",
            "experience_highlights": "Supports system enhancements, testing coordination, and requirements gathering for banking teams.",
            "advice_for_students": "If you want analyst roles, practice explaining problems in business terms. Technical skill helps, but clarity wins interviews.",
            "internship_history": "KeyBank Business Analyst Intern | Campus IT student employee",
            "skills": "Requirements Gathering, Process Mapping, SQL, Testing, Communication",
            "is_mentor": True,
            "open_to_questions": True,
            "open_to_referrals": False,
            "email": "david.patel.alumni@csu.edu",
            "linkedin_url": "https://www.linkedin.com/in/david-patel-csu",
            "graduation_year": 2022,
        },
        {
            "name": "Jasmine Rivera",
            "company": companies["MRI Software"],
            "role": "Product Designer",
            "headline": "CSU alum focused on product design and user research.",
            "location": "Solon, OH",
            "bio": "Jasmine turned a CSU UX portfolio and internship experience into a design role where she supports research, prototyping, and workflow design.",
            "how_they_got_there": "She built a stronger portfolio after internship feedback, refined her case studies, and used alumni outreach to learn how product teams reviewed design candidates.",
            "experience_highlights": "Runs usability research, supports design critiques, and partners with developers on user-facing features.",
            "advice_for_students": "Your portfolio should explain the problem, the tradeoffs, and the outcome. That matters more than visual polish alone.",
            "internship_history": "MRI Software UI/UX Design Intern | CSU product design studio",
            "skills": "Figma, User Research, Prototyping, Design Systems, Facilitation",
            "is_mentor": True,
            "open_to_questions": True,
            "open_to_referrals": False,
            "email": "jasmine.rivera.alumni@csu.edu",
            "linkedin_url": "https://www.linkedin.com/in/jasmine-rivera-csu",
            "graduation_year": 2024,
        },
        {
            "name": "Ethan Walker",
            "company": companies["IBM"],
            "role": "Cloud Operations Engineer",
            "headline": "Cloud-focused alum who moved from internship support work into platform operations.",
            "location": "Hybrid / Ohio",
            "bio": "Ethan works with cloud environments, automation tasks, and support workflows that keep internal platforms stable and deployable.",
            "how_they_got_there": "He used a mix of AWS certification prep, scripting projects, and internship exposure to automation tasks to position himself for cloud operations work.",
            "experience_highlights": "Supports CI pipelines, automation tasks, and incident follow-up across cloud environments.",
            "advice_for_students": "Certifications help, but pair them with one or two projects that show you actually used the tools.",
            "internship_history": "IBM Cloud Operations Intern | Student IT support",
            "skills": "AWS, Azure, Python, Automation, Incident Response",
            "is_mentor": False,
            "open_to_questions": True,
            "open_to_referrals": True,
            "email": "ethan.walker.alumni@csu.edu",
            "linkedin_url": "https://www.linkedin.com/in/ethan-walker-csu",
            "graduation_year": 2023,
        },
        {
            "name": "Brianna Lopez",
            "company": companies["Cleveland Clinic"],
            "role": "Systems Support Analyst",
            "headline": "Healthcare systems alum supporting enterprise users and operational workflows.",
            "location": "Cleveland, OH",
            "bio": "Brianna supports enterprise users, triages issues, and helps clinical and business teams keep systems running smoothly.",
            "how_they_got_there": "She built momentum through campus tech support work and a healthcare internship where she learned to communicate calmly and document issues clearly.",
            "experience_highlights": "Supports ticket workflows, endpoint issues, and user communication for large enterprise systems.",
            "advice_for_students": "Support roles are not small roles. If you can show reliability, documentation skills, and calm communication, you stand out quickly.",
            "internship_history": "Cleveland Clinic IT Support Intern | Campus help desk",
            "skills": "Troubleshooting, Documentation, Customer Support, Networking, ServiceNow",
            "is_mentor": True,
            "open_to_questions": True,
            "open_to_referrals": False,
            "email": "brianna.lopez.alumni@csu.edu",
            "linkedin_url": "https://www.linkedin.com/in/brianna-lopez-csu",
            "graduation_year": 2021,
        },
        {
            "name": "Noah Bennett",
            "company": companies["Sherwin-Williams"],
            "role": "Systems Analyst",
            "headline": "Enterprise systems alum bridging operations and technology teams.",
            "location": "Cleveland, OH",
            "bio": "Noah works with reporting, testing, and systems coordination efforts tied to enterprise operations.",
            "how_they_got_there": "He used internship work plus a strong capstone presentation to show he could translate operational needs into technical follow-up items.",
            "experience_highlights": "Supports testing, reporting, and issue coordination in enterprise systems projects.",
            "advice_for_students": "Keep examples that show how you organized ambiguity. That is a real skill in analyst and systems roles.",
            "internship_history": "Sherwin-Williams ERP Support Intern | CSU systems analysis project",
            "skills": "Systems Analysis, SQL, Testing, Documentation, ERP",
            "is_mentor": False,
            "open_to_questions": True,
            "open_to_referrals": False,
            "email": "noah.bennett.alumni@csu.edu",
            "linkedin_url": "https://www.linkedin.com/in/noah-bennett-csu",
            "graduation_year": 2022,
        },
    ]

    for alumni in alumni_seed_data:
        Alumni.objects.create(**alumni)

    student_jobs = JobPosting.objects.order_by("-date_posted")[:2]
    for job in student_jobs:
        SavedJob.objects.create(user=users["student"], job=job)

    internal_job = JobPosting.objects.filter(application_type="csu_internal").first()
    if internal_job:
        application = JobApplication.objects.create(user=users["student"], job=internal_job, status="submitted")
        if users["student"].career_profile.default_resume:
            users["student"].career_profile.default_resume.open("rb")
            application.resume_file.save(
                "sarah-johnson-applied-resume.pdf",
                ContentFile(users["student"].career_profile.default_resume.read()),
                save=False,
            )
            users["student"].career_profile.default_resume.close()
        application.cover_letter_file.save(
            "sarah-johnson-cover-letter.pdf",
            ContentFile(b"Demo cover letter for a CSU-hosted application."),
            save=False,
        )
        application.save()

    SavedCompany.objects.create(user=users["student"], company=companies["Hyland"])
    SavedCertification.objects.create(user=users["student"], certification=certs["AWS"])
    SavedAlumni.objects.create(user=users["student"], alumni=Alumni.objects.get(name="Alyssa Brooks"))

    CertificationProgress.objects.create(
        user=users["student"],
        certification=certs["SQL"],
        status="in_progress",
        notes="Working through SQL practice and dashboard query exercises.",
    )
    CertificationProgress.objects.create(
        user=users["student"],
        certification=certs["PowerBI"],
        status="planned",
        notes="Next step after SQL to strengthen analytics readiness.",
    )
    CertificationProgress.objects.create(
        user=users["student"],
        certification=certs["AWS"],
        status="completed",
        notes="Completed foundational cloud coursework.",
    )

    print("✅ FULL seed loaded )")


if __name__ == "__main__":
    run()

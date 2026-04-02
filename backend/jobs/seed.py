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
        "SQL": Certification.objects.create(name="SQL Certificate"),
        "PowerBI": Certification.objects.create(name="Power BI Certificate"),
        "HTMLCSS": Certification.objects.create(name="HTML/CSS Certificate"),
        "JS": Certification.objects.create(name="JavaScript Certificate"),
        "React": Certification.objects.create(name="React Certificate"),
        "AWS": Certification.objects.create(name="AWS Cloud Practitioner"),
        "Azure": Certification.objects.create(name="Azure Fundamentals"),
        "UX": Certification.objects.create(name="UI/UX Design Certificate"),
        "Git": Certification.objects.create(name="Git/GitHub Certificate"),
    }

    def create_job(title, company, location, skills, cert_list, role):
        job = JobPosting.objects.create(
            title=title,
            company=company,
            location=location,
            skills_required=", ".join(skills),
            certs_recommended=", ".join([c.name for c in cert_list]),
            date_posted=timezone.now().date()
        )
        job.roles.add(role)
        for c in cert_list:
            job.certifications.add(c)

    # -------------------
    # JOBS
    # -------------------

    create_job("Front-End Developer Intern", companies["Hyland"], "Westlake, OH",
               ["HTML", "CSS", "JavaScript", "React"],
               [certs["HTMLCSS"], certs["JS"], certs["React"]], roles["Frontend"])

    create_job("Data Analyst Intern", companies["Progressive"], "Cleveland, OH",
               ["SQL", "Excel", "Power BI"],
               [certs["SQL"], certs["PowerBI"]], roles["Data"])

    create_job("Business Analyst Intern", companies["KeyBank"], "Cleveland, OH",
               ["Excel", "SQL", "Communication"],
               [certs["SQL"], certs["Azure"]], roles["Business"])

    create_job("IT Support Intern", companies["Cleveland Clinic"], "Cleveland, OH",
               ["Troubleshooting", "Networking"],
               [certs["AWS"], certs["Azure"]], roles["IT"])

    create_job("UI/UX Design Intern", companies["MRI Software"], "Solon, OH",
               ["Figma", "Wireframing", "Prototyping"],
               [certs["UX"]], roles["UX"])

    create_job("Cloud Operations Intern", companies["IBM"], "Hybrid / Ohio",
               ["Cloud Basics", "Scripting"],
               [certs["AWS"], certs["Azure"]], roles["Cloud"])

    create_job("Software Developer Intern", companies["Sherwin-Williams"], "Cleveland, OH",
               ["JavaScript", "GitHub"],
               [certs["JS"], certs["Git"]], roles["Software"])

    create_job("Database Intern", companies["Eaton"], "Beachwood, OH",
               ["SQL", "Data Modeling"],
               [certs["SQL"]], roles["Database"])

    create_job("Systems Analyst Intern", companies["Medical Mutual"], "Cleveland, OH",
               ["Documentation", "Excel"],
               [certs["Azure"], certs["Git"]], roles["Systems"])

    create_job("Product Support Intern", companies["OnShift"], "Cleveland, OH",
               ["Communication", "Troubleshooting"],
               [certs["HTMLCSS"], certs["UX"]], roles["Support"])

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
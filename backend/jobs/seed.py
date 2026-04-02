from jobs.models import Company, Role, Certification, JobPosting, CompanyReview, Alumni
from django.utils import timezone
from datetime import timedelta


def run():
    # Clear existing data (safe reset)
    Company.objects.all().delete()
    Role.objects.all().delete()
    Certification.objects.all().delete()
    JobPosting.objects.all().delete()
    CompanyReview.objects.all().delete()
    Alumni.objects.all().delete()

    # -------------------
    # Companies
    # -------------------
    progressive = Company.objects.create(name="Progressive Insurance")
    keybank = Company.objects.create(name="KeyBank")
    hyland = Company.objects.create(name="Hyland")
    clinic = Company.objects.create(name="Cleveland Clinic")

    # -------------------
    # Roles
    # -------------------
    data_role = Role.objects.create(name="Data Analyst")
    swe_role = Role.objects.create(name="Software Engineer")
    biz_role = Role.objects.create(name="Business Analyst")

    # -------------------
    # Certifications
    # -------------------
    sql_cert = Certification.objects.create(name="SQL Certificate")
    aws_cert = Certification.objects.create(name="AWS Cloud Practitioner")

    # -------------------
    # Jobs
    # -------------------
    job1 = JobPosting.objects.create(
        title="Data Analyst Intern",
        company=progressive,
        location="Cleveland, OH",
        skills_required="SQL, Excel",
        certs_recommended="SQL Certificate",
        date_posted=timezone.now().date()
    )
    job1.roles.add(data_role)
    job1.certifications.add(sql_cert)

    job2 = JobPosting.objects.create(
        title="Software Engineer Intern",
        company=hyland,
        location="Westlake, OH",
        skills_required="Python, React",
        certs_recommended="AWS",
        date_posted=timezone.now().date()
    )
    job2.roles.add(swe_role)
    job2.certifications.add(aws_cert)

    # -------------------
    # Reviews
    # -------------------
    CompanyReview.objects.create(
        company=progressive,
        role="Data Analyst Intern",
        rating=4.5,
        pros="Great learning environment",
        cons="Slow processes",
        interview_process="SQL + behavioral",
        recommendation="Good for beginners",
        skills_used="SQL, Excel"
    )

    CompanyReview.objects.create(
        company=hyland,
        role="Software Engineer Intern",
        rating=4.8,
        pros="Modern tech stack",
        cons="Fast-paced",
        interview_process="Coding + system design",
        recommendation="Great for devs",
        skills_used="Python, React"
    )

    # -------------------
    # Alumni
    # -------------------
    Alumni.objects.create(
        name="Michael Chen",
        company=progressive,
        role="Software Developer",
        location="Cleveland, OH",
        bio="Worked on cloud systems",
        skills="Java, AWS",
        is_mentor=True,
        graduation_year=2024
    )

    print("✅ Seed data loaded")
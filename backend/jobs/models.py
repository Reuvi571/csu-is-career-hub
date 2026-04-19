from django.db import models
from django.conf import settings
import uuid
from datetime import timedelta
from django.utils import timezone


# CORE ENTITIES

class Company(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, default="Cleveland, OH")
    industry = models.CharField(max_length=255, blank=True, default="")
    size = models.CharField(max_length=255, blank=True, default="")
    website = models.CharField(max_length=255, blank=True, default="")
    description = models.TextField(blank=True, default="")

    def __str__(self):
        return self.name


class CareerUserProfile(models.Model):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("alumni", "Alumni"),
        ("admin", "Admin"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="career_profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    graduation_year = models.IntegerField(blank=True, null=True)
    major = models.CharField(max_length=255, blank=True, default="Information Systems")
    target_roles = models.TextField(blank=True, default="")
    seeking_types = models.CharField(max_length=255, blank=True, default="")
    preferred_location = models.CharField(max_length=255, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    default_resume = models.FileField(upload_to="resumes/defaults/", blank=True, null=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.email} ({self.role})"


class Certification(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    organization = models.CharField(max_length=255, blank=True, null=True)
    official_url = models.URLField(blank=True, default="")
    roles = models.ManyToManyField('Role', blank=True, related_name='certifications')

    def __str__(self):
        return self.name


class Role(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


# JOB POSTINGS

class JobPosting(models.Model):
    POSITION_TYPE_CHOICES = [
        ("internship", "Internship"),
        ("co_op", "Co-op"),
        ("part_time", "Part-time"),
        ("entry_level", "Entry-level"),
    ]
    STATUS_CHOICES = [
        ("published", "Published"),
        ("rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    title = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    location = models.CharField(max_length=200, default="Cleveland, OH")

    description = models.TextField(blank=True, null=True)
    experience_level = models.CharField(max_length=50, default="Entry Level")
    position_type = models.CharField(
        max_length=50,
        choices=POSITION_TYPE_CHOICES,
        default="entry_level",
    )
    application_type = models.CharField(max_length=50, default="company_site")
    apply_url = models.URLField(blank=True, default="")
    min_hourly_rate = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        blank=True,
        null=True,
    )
    max_hourly_rate = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        blank=True,
        null=True,
    )

    # RELATIONAL FIELDS
    certifications = models.ManyToManyField(Certification, blank=True)
    roles = models.ManyToManyField(Role, blank=True)

    date_posted = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="published")
    rejection_note = models.TextField(blank=True, default="")
    rejected_at = models.DateTimeField(blank=True, null=True)
    rejected_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="rejected_job_postings",
        blank=True,
        null=True,
    )

    # EXPIRATION LOGIC
    def is_active(self):
        return self.status == "published" and self.date_posted >= (timezone.now().date() - timedelta(days=16))

    def salary_range_display(self):
        if self.min_hourly_rate is None and self.max_hourly_rate is None:
            return ""

        if self.min_hourly_rate == self.max_hourly_rate:
            return f"${self.min_hourly_rate:.0f}/hr"

        return f"${self.min_hourly_rate:.0f}/hr - ${self.max_hourly_rate:.0f}/hr"

    def __str__(self):
        return f"{self.title} at {self.company.name}"


# COMPANY REVIEWS

class CompanyReview(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="company_reviews",
        blank=True,
        null=True,
    )

    role = models.CharField(max_length=200)
    rating = models.FloatField()

    pros = models.TextField()
    cons = models.TextField()
    interview_process = models.TextField()
    recommendation = models.TextField()

    skills_used = models.CharField(max_length=255)

    date_posted = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="approved")
    moderated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="moderated_reviews",
        blank=True,
        null=True,
    )
    moderated_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.company.name} Review"


# SALARY REPORTS

class SalaryReport(models.Model):
    POSITION_TYPE_CHOICES = JobPosting.POSITION_TYPE_CHOICES

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="salary_reports",
        blank=True,
        null=True,
    )
    role = models.CharField(max_length=200, blank=True, default="")
    position_type = models.CharField(max_length=50, choices=POSITION_TYPE_CHOICES)
    year = models.PositiveIntegerField()
    avg_hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)
    min_hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)
    max_hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)
    posting_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        label = self.company.name if self.company else "All employers"
        return f"{self.year} {self.get_position_type_display()} - {label}"


# ALUMNI

class Alumni(models.Model):
    name = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="alumni")

    role = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    headline = models.CharField(max_length=255, blank=True, default="")
    bio = models.TextField()
    how_they_got_there = models.TextField(blank=True, default="")
    experience_highlights = models.TextField(blank=True, default="")
    advice_for_students = models.TextField(blank=True, default="")
    internship_history = models.TextField(blank=True, default="")

    skills = models.CharField(max_length=255)
    is_mentor = models.BooleanField(default=False)
    open_to_questions = models.BooleanField(default=True)
    open_to_referrals = models.BooleanField(default=False)
    email = models.EmailField(blank=True, default="")
    linkedin_url = models.URLField(blank=True, default="")

    graduation_year = models.IntegerField()

    def __str__(self):
        return f"{self.name} - {self.company.name}"


class SavedJob(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_jobs")
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name="saved_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "job"], name="unique_saved_job"),
        ]


class SavedCompany(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_companies")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="saved_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "company"], name="unique_saved_company"),
        ]


class SavedCertification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_certifications")
    certification = models.ForeignKey(Certification, on_delete=models.CASCADE, related_name="saved_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "certification"], name="unique_saved_certification"),
        ]


class SavedAlumni(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_alumni")
    alumni = models.ForeignKey(Alumni, on_delete=models.CASCADE, related_name="saved_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "alumni"], name="unique_saved_alumni"),
        ]


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("submitted", "Submitted"),
        ("reviewing", "Reviewing"),
        ("closed", "Closed"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="job_applications")
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name="applications")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="submitted")
    resume_file = models.FileField(upload_to="applications/resumes/", blank=True, null=True)
    cover_letter_file = models.FileField(upload_to="applications/cover_letters/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "job"], name="unique_job_application"),
        ]

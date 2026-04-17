from django.db import models
import uuid
from datetime import timedelta
from django.utils import timezone


# CORE ENTITIES

class Company(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, default="Cleveland, OH")

    def __str__(self):
        return self.name


class Certification(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    organization = models.CharField(max_length=255, blank=True, null=True)
    roles = models.ManyToManyField('Role', blank=True, related_name='certifications')

    def __str__(self):
        return self.name


class Role(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


# JOB POSTINGS

class JobPosting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    title = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    location = models.CharField(max_length=200, default="Cleveland, OH")

    description = models.TextField(blank=True, null=True)
    experience_level = models.CharField(max_length=50, default="Entry Level")
    salary_range = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="e.g., $20/hr - $30/hr"
    )

    # RELATIONAL FIELDS
    certifications = models.ManyToManyField(Certification, blank=True)
    roles = models.ManyToManyField(Role, blank=True)

    date_posted = models.DateField(auto_now_add=True)

    # EXPIRATION LOGIC
    def is_active(self):
        return self.date_posted >= (timezone.now().date() - timedelta(days=16))

    def __str__(self):
        return f"{self.title} at {self.company.name}"


# COMPANY REVIEWS

class CompanyReview(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='reviews')

    role = models.CharField(max_length=200)
    rating = models.FloatField()

    pros = models.TextField()
    cons = models.TextField()
    interview_process = models.TextField()
    recommendation = models.TextField()

    skills_used = models.CharField(max_length=255)

    date_posted = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.company.name} Review"


# ALUMNI

class Alumni(models.Model):
    name = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    role = models.CharField(max_length=200)
    location = models.CharField(max_length=200)

    bio = models.TextField()

    skills = models.CharField(max_length=255)
    is_mentor = models.BooleanField(default=False)

    graduation_year = models.IntegerField()

    def __str__(self):
        return f"{self.name} - {self.company.name}"

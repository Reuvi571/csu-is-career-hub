from django.db import models
import uuid

class JobPosting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, default="Cleveland, OH")
    
    # The Core Features from your list
    description = models.TextField(blank=True, null=True)
    experience_level = models.CharField(max_length=50, default="Entry Level")
    salary_range = models.CharField(max_length=100, blank=True, null=True, help_text="e.g., $60,000 - $75,000")
    
    # The "Connect Everything" Pipeline (Storing as strings for easy UI rendering)
    skills_required = models.CharField(max_length=255, help_text="e.g., JavaScript, React, SQL")
    certs_recommended = models.CharField(max_length=255, blank=True, null=True, help_text="e.g., Security+, AWS Cloud Practitioner")
    
    date_posted = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

class CompanyReview(models.Model):
    """Seed data model to satisfy the Reviews requirement without scraping Glassdoor."""
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='reviews')
    difficulty_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], help_text="1-5 Scale")
    hiring_experience = models.TextField()
    
    def __str__(self):
        return f"Review for {self.job.company}"

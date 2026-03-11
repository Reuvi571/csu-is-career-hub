from django.db import models
import uuid

class JobPosting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, default="Cleveland, OH")
    status = models.CharField(max_length=20, default="Open")

    def __str__(self):
        return f"{self.title} - {self.company}"
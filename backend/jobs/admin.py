from django.contrib import admin
from .models import JobPosting, CompanyReview, Certification, Role

admin.site.register(JobPosting)
admin.site.register(CompanyReview)
admin.site.register(Certification)
admin.site.register(Role)
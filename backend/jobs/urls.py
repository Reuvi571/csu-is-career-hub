from django.urls import path
from . import views

urlpatterns = [
    path("api/jobs", views.list_jobs),
    path("api/jobs/create", views.create_job),
    path("api/jobs/update/<uuid:job_id>", views.update_job),
    path("api/jobs/delete/<uuid:job_id>", views.delete_job),
]
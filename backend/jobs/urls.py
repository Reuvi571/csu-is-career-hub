from django.urls import path
from . import views

urlpatterns = [
    path("api/jobs", views.list_jobs),
    path("api/jobs/create", views.create_job),
]
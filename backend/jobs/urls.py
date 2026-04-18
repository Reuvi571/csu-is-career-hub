from django.urls import path
from . import views

urlpatterns = [
    # UI ROUTE
    path('', views.dashboard, name='dashboard'),

    # TEMP FEATURE
    path('api/mdn/<str:skill_name>/', views.mdn_popup, name='mdn_popup'),

    # REAL API
    path('api/auth/login/', views.login_api, name='login_api'),
    path('api/auth/register/', views.register_api, name='register_api'),
    path('api/auth/logout/', views.logout_api, name='logout_api'),
    path('api/auth/me/', views.current_user_api, name='current_user_api'),
    path('api/profile/', views.profile_api, name='profile_api'),
    path('api/profile/documents/', views.profile_documents_api, name='profile_documents_api'),
    path('api/saved/', views.saved_items_api, name='saved_items_api'),
    path('api/saved/toggle/', views.toggle_saved_item_api, name='toggle_saved_item_api'),
    path('api/applications/', views.applications_api, name='applications_api'),
    path('api/jobs/', views.get_jobs, name='get_jobs'),
    path('api/jobs/saved/', views.saved_jobs_api, name='saved_jobs_api'),
    path('api/jobs/<uuid:job_id>/apply/', views.apply_to_job_api, name='apply_to_job_api'),
    path('api/reviews/', views.reviews_api, name='reviews_api'),
    path('api/reviews/submit/', views.submit_review_api, name='submit_review_api'),
    path('api/admin/reviews/', views.admin_reviews_api, name='admin_reviews_api'),
    path('api/admin/reviews/<int:review_id>/moderate/', views.moderate_review_api, name='moderate_review_api'),
    path('api/admin/jobs/', views.admin_jobs_api, name='admin_jobs_api'),
    path('api/admin/jobs/<uuid:job_id>/moderate/', views.moderate_job_api, name='moderate_job_api'),
    path('api/salaries/', views.salaries_api, name='salaries_api'),
    path('api/companies/', views.companies_api, name='companies_api'),
    path('api/companies/<int:company_id>/', views.company_detail_api, name='company_detail_api'),
    path('api/alumni/', views.alumni_api, name='alumni_api'),
    path('api/alumni/<int:alumni_id>/', views.alumni_detail_api, name='alumni_detail_api'),
    path('api/certifications/', views.certifications_api, name='certifications_api'),
    path('api/certifications/<int:cert_id>/', views.certification_detail_api, name='certification_detail_api'),
]

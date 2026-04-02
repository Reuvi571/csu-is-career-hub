from django.urls import path
from . import views

urlpatterns = [
    # =========================
    # EXISTING (UI ROUTE)
    # =========================
    path('', views.dashboard, name='dashboard'),

    # =========================
    # EXISTING (TEMP FEATURE)
    # =========================
    path('api/mdn/<str:skill_name>/', views.mdn_popup, name='mdn_popup'),

    # =========================
    # NEW (REAL API)
    # =========================
    path('api/jobs/', views.get_jobs, name='get_jobs'),

    path('api/reviews/', views.reviews_api, name='reviews_api'),
    path('api/companies/', views.companies_api, name='companies_api'),
]
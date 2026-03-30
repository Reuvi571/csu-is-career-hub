from django.urls import path
from . import views

urlpatterns = [
    path('api/jobs/', views.dashboard, name='dashboard'),
    path('api/mdn/<str:skill_name>/', views.mdn_popup, name='mdn_popup'),
]

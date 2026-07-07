from django.urls import path
from . import views

urlpatterns = [
    # Dashboard API
    path('api/dashboard/', views.api_dashboard, name='api_dashboard'),
    
    # Jobs CRUD APIs
    path('api/jobs/', views.api_jobs, name='api_jobs'),
    path('api/jobs/<int:pk>/', views.api_job_detail, name='api_job_detail'),
    path('api/jobs/<int:pk>/upload/', views.api_upload_resumes, name='api_upload_resumes'),
    
    # Candidate Evaluation APIs
    path('api/resumes/<int:pk>/', views.api_candidate_detail, name='api_candidate_detail'),
    path('api/resumes/<int:pk>/shortlist/', views.api_shortlist_candidate, name='api_shortlist_candidate'),
    path('api/resumes/<int:pk>/reject/', views.api_reject_candidate, name='api_reject_candidate'),
    path('api/resumes/<int:pk>/download/', views.api_download_resume, name='api_download_resume'),
    
    # Analytics API
    path('api/analytics/', views.api_analytics, name='api_analytics'),
]

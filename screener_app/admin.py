from django.contrib import admin
from .models import JobDescription, Resume

@admin.register(JobDescription)
class JobDescriptionAdmin(admin.ModelAdmin):
    list_display = ('title', 'experience_required', 'posted_date')
    search_fields = ('title', 'skills_required', 'description')

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('candidate_name', 'job', 'email', 'phone', 'overall_score', 'status', 'uploaded_at')
    list_filter = ('status', 'job', 'uploaded_at')
    search_fields = ('candidate_name', 'email', 'extracted_skills', 'resume_text')

# Customize Django Admin Panel Branding
admin.site.site_header = "AI Resume Screener"
admin.site.site_title = "AI Resume Screener Admin"
admin.site.index_title = "System Administration"

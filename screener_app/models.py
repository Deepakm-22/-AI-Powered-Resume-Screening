from django.db import models
from django.utils import timezone

class JobDescription(models.Model):
    title = models.CharField(max_length=255)
    experience_required = models.CharField(max_length=100, help_text="e.g. 3-5 years")
    education_required = models.TextField(help_text="e.g. Bachelor's degree in CS")
    skills_required = models.TextField(help_text="Comma-separated skills list, e.g. python, django, react")
    description = models.TextField()
    posted_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    def get_skills_list(self):
        return [s.strip().lower() for s in self.skills_required.split(',') if s.strip()]

class Resume(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Shortlisted', 'Shortlisted'),
        ('Rejected', 'Rejected'),
    ]

    job = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name='resumes')
    file = models.FileField(upload_to='resumes/')
    candidate_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    extracted_skills = models.TextField(blank=True, null=True, help_text="Comma-separated skills extracted")
    experience_text = models.TextField(blank=True, null=True)
    education_text = models.TextField(blank=True, null=True)
    resume_text = models.TextField(blank=True, null=True)
    
    # Scores
    skills_match_score = models.FloatField(default=0.0)
    experience_match_score = models.FloatField(default=0.0)
    education_match_score = models.FloatField(default=0.0)
    overall_score = models.FloatField(default=0.0)
    
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    uploaded_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.candidate_name or f"Resume #{self.id}"

    def get_extracted_skills_list(self):
        if self.extracted_skills:
            return [s.strip() for s in self.extracted_skills.split(',') if s.strip()]
        return []

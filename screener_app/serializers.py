from rest_framework import serializers
from .models import JobDescription, Resume

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id', 'job', 'file', 'candidate_name', 'email', 'phone', 
            'extracted_skills', 'experience_text', 'education_text', 
            'resume_text', 'skills_match_score', 'experience_match_score', 
            'education_match_score', 'overall_score', 'status', 'uploaded_at'
        ]
        read_only_fields = [
            'candidate_name', 'email', 'phone', 'extracted_skills', 
            'experience_text', 'education_text', 'resume_text', 
            'skills_match_score', 'experience_match_score', 
            'education_match_score', 'overall_score', 'uploaded_at'
        ]

class JobDescriptionSerializer(serializers.ModelSerializer):
    resumes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = JobDescription
        fields = [
            'id', 'title', 'experience_required', 'education_required', 
            'skills_required', 'description', 'posted_date', 'resumes_count'
        ]
        
    def get_resumes_count(self, obj):
        return obj.resumes.count()

class JobDescriptionDetailSerializer(serializers.ModelSerializer):
    resumes = serializers.SerializerMethodField()
    
    class Meta:
        model = JobDescription
        fields = [
            'id', 'title', 'experience_required', 'education_required', 
            'skills_required', 'description', 'posted_date', 'resumes'
        ]
        
    def get_resumes(self, obj):
        # Sort resumes by score descending
        resumes = obj.resumes.all().order_by('-overall_score')
        return ResumeSerializer(resumes, many=True).data

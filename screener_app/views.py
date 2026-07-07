import os
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import JobDescription, Resume
from .serializers import JobDescriptionSerializer, JobDescriptionDetailSerializer, ResumeSerializer
from .utils.parser import parse_resume
from .utils.matcher import calculate_overall_match

@api_view(['GET'])
def api_dashboard(request):
    """API endpoint for dashboard stats and recent jobs."""
    jobs = JobDescription.objects.all().order_by('-posted_date')
    resumes = Resume.objects.all()
    
    total_jobs = jobs.count()
    total_resumes = resumes.count()
    shortlisted = resumes.filter(status='Shortlisted').count()
    
    avg_score = 0.0
    if total_resumes > 0:
        avg_score = sum(r.overall_score for r in resumes) / total_resumes
        
    recent_jobs_serializer = JobDescriptionSerializer(jobs[:5], many=True)
    
    return Response({
        'total_jobs': total_jobs,
        'total_resumes': total_resumes,
        'shortlisted': shortlisted,
        'avg_score': round(avg_score, 2),
        'recent_jobs': recent_jobs_serializer.data
    })

@api_view(['GET', 'POST'])
def api_jobs(request):
    """List all jobs or create a new job profile."""
    if request.method == 'GET':
        jobs = JobDescription.objects.all().order_by('-posted_date')
        serializer = JobDescriptionSerializer(jobs, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        serializer = JobDescriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def api_job_detail(request, pk):
    """Retrieve job details along with sorted resumes list."""
    job = get_object_or_404(JobDescription, pk=pk)
    serializer = JobDescriptionDetailSerializer(job)
    return Response(serializer.data)

@api_view(['POST'])
def api_upload_resumes(request, pk):
    """Upload one or multiple resumes, parse, score and return candidates list."""
    job = get_object_or_404(JobDescription, pk=pk)
    files = request.FILES.getlist('resumes')
    
    if not files:
        return Response({'error': 'No resume files provided'}, status=status.HTTP_400_BAD_REQUEST)
        
    uploaded_resumes = []
    for f in files:
        resume = Resume(job=job, file=f)
        resume.save()
        
        file_path = resume.file.path
        try:
            parsed_data = parse_resume(file_path)
            scores = calculate_overall_match(job, parsed_data)
            
            resume.candidate_name = parsed_data['name']
            resume.email = parsed_data['email']
            resume.phone = parsed_data['phone']
            resume.extracted_skills = ",".join(parsed_data['skills'])
            resume.experience_text = parsed_data['experience_text']
            resume.education_text = parsed_data['education_text']
            resume.resume_text = parsed_data['raw_text']
            
            resume.skills_match_score = scores['skills_score']
            resume.experience_match_score = scores['experience_score']
            resume.education_match_score = scores['education_score']
            resume.overall_score = scores['overall_score']
            resume.save()
            uploaded_resumes.append(resume)
        except Exception as e:
            print(f"Error parsing resume {f.name}: {e}")
            resume.candidate_name = f.name
            resume.resume_text = f"Parsing error occurred: {str(e)}"
            resume.save()
            uploaded_resumes.append(resume)
            
    serializer = ResumeSerializer(uploaded_resumes, many=True)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def api_candidate_detail(request, pk):
    """Retrieve candidate evaluation details and parsed text sections."""
    resume = get_object_or_404(Resume, pk=pk)
    job = resume.job
    
    # Calculate matched vs missing skills list
    jd_skills = set(s.strip().lower() for s in job.skills_required.split(',') if s.strip())
    candidate_skills = set(s.strip().lower() for s in resume.get_extracted_skills_list())
    
    matched_skills = jd_skills.intersection(candidate_skills)
    missing_skills = jd_skills.difference(candidate_skills)
    other_skills = candidate_skills.difference(jd_skills)
    
    resume_serializer = ResumeSerializer(resume)
    job_serializer = JobDescriptionSerializer(job)
    
    return Response({
        'candidate': resume_serializer.data,
        'job': job_serializer.data,
        'matched_skills': list(matched_skills),
        'missing_skills': list(missing_skills),
        'other_skills': list(other_skills)
    })

@api_view(['POST'])
def api_shortlist_candidate(request, pk):
    """Updates candidate status to Shortlisted."""
    resume = get_object_or_404(Resume, pk=pk)
    resume.status = 'Shortlisted'
    resume.save()
    return Response(ResumeSerializer(resume).data)

@api_view(['POST'])
def api_reject_candidate(request, pk):
    """Updates candidate status to Rejected."""
    resume = get_object_or_404(Resume, pk=pk)
    resume.status = 'Rejected'
    resume.save()
    return Response(ResumeSerializer(resume).data)

def api_download_resume(request, pk):
    """Direct file download endpoint (Standard Django HTTP response)."""
    resume = get_object_or_404(Resume, pk=pk)
    file_path = resume.file.path
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/octet-stream")
            response['Content-Disposition'] = f'inline; filename={os.path.basename(file_path)}'
            return response
    raise Http404("File does not exist")

@api_view(['GET'])
def api_analytics(request):
    """API endpoint for analytics distribution and job-wise scoring metrics."""
    resumes = Resume.objects.all()
    
    score_90_100 = resumes.filter(overall_score__gte=90.0).count()
    score_80_89 = resumes.filter(overall_score__gte=80.0, overall_score__lt=90.0).count()
    score_70_79 = resumes.filter(overall_score__gte=70.0, overall_score__lt=80.0).count()
    score_60_69 = resumes.filter(overall_score__gte=60.0, overall_score__lt=70.0).count()
    score_below_60 = resumes.filter(overall_score__lt=60.0).count()
    
    jobs = JobDescription.objects.all()
    job_stats = []
    
    for job in jobs:
        job_resumes = job.resumes.all()
        count = job_resumes.count()
        avg = 0.0
        if count > 0:
            avg = sum(r.overall_score for r in job_resumes) / count
            
        job_stats.append({
            'id': job.pk,
            'title': job.title,
            'experience_required': job.experience_required,
            'resumes_count': count,
            'avg_score': round(avg, 2)
        })
        
    return Response({
        'score_distribution': {
            'bracket_90_100': score_90_100,
            'bracket_80_89': score_80_89,
            'bracket_70_79': score_70_79,
            'bracket_60_69': score_60_69,
            'bracket_below_60': score_below_60,
        },
        'job_stats': job_stats
    })

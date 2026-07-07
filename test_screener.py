import os
import django

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "screener_project.settings")
django.setup()

from screener_app.models import JobDescription, Resume
from screener_app.utils.parser import parse_resume
from screener_app.utils.matcher import calculate_overall_match

def run_tests():
    print("=== STARTING AI RESUME SCREENER SYSTEM TESTS ===")
    
    # 0. Create Default Admin User
    print("\n0. Creating Default Admin User...")
    from django.contrib.auth.models import User
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser("admin", "admin@example.com", "admin123")
        print("  Superuser 'admin' created with password 'admin123'")
    else:
        print("  Superuser 'admin' already exists")
        
    # 1. Create Job Descriptions
    print("\n1. Creating Job Descriptions...")
    
    python_jd = JobDescription.objects.create(
        title="Python Developer",
        experience_required="3-5 years",
        education_required="Bachelor's degree in Computer Science, Software Engineering or equivalent",
        skills_required="python, django, machine learning, nlp, rest api, tensorflow, scikit-learn, nltk",
        description="We are seeking a skilled Python Developer to design, develop, and maintain backend APIs "
                    "using Django and Django REST Framework. The candidate will work closely with data scientists to "
                    "integrate machine learning and Natural Language Processing algorithms for resume screening systems."
    )
    print(f"Created Job: {python_jd.title} (ID: {python_jd.pk})")
    
    java_jd = JobDescription.objects.create(
        title="Java Developer",
        experience_required="0-3 years",
        education_required="Bachelor's degree in Computer Science or engineering discipline",
        skills_required="java, spring boot, hibernate, microservices, sql, rest api, git, maven",
        description="We are hiring a Java Developer to build high-performance microservices backend applications. "
                    "You will work with Spring Boot, Hibernate ORM, Maven, Git version control, and relational database systems "
                    "such as MySQL and PostgreSQL. Strong coding and team participation skills are required."
    )
    print(f"Created Job: {java_jd.title} (ID: {java_jd.pk})")
    
    # 2. Parse and Score Resumes
    print("\n2. Processing candidate resumes...")
    
    # Mock resume directory
    mock_dir = "mock_resumes"
    resumes_files = [
        ("Sattaru_Venkata_Abhilash.docx", java_jd),
        ("Ajay_Kumar.docx", python_jd),
        ("John_Doe.docx", python_jd)  # Unrelated profile uploaded for Python Developer
    ]
    
    for filename, jd in resumes_files:
        file_path = os.path.join(mock_dir, filename)
        if not os.path.exists(file_path):
            print(f"Error: {file_path} not found.")
            continue
            
        print(f"\nProcessing {filename} against Job: {jd.title}...")
        
        # Parse
        parsed_data = parse_resume(file_path)
        print(f"  Parsed Name: {parsed_data['name']}")
        print(f"  Parsed Email: {parsed_data['email']}")
        print(f"  Parsed Phone: {parsed_data['phone']}")
        print(f"  Extracted Skills count: {len(parsed_data['skills'])}")
        
        # Match/Score
        scores = calculate_overall_match(jd, parsed_data)
        print(f"  Skills Match: {scores['skills_score']}%")
        print(f"  Experience Match: {scores['experience_score']}%")
        print(f"  Education Match: {scores['education_score']}%")
        print(f"  Overall Match Score: {scores['overall_score']}%")
        
        # Save to DB
        resume = Resume.objects.create(
            job=jd,
            file=f"resumes/{filename}",  # Fake path to satisfy field
            candidate_name=parsed_data['name'],
            email=parsed_data['email'],
            phone=parsed_data['phone'],
            extracted_skills=",".join(parsed_data['skills']),
            experience_text=parsed_data['experience_text'],
            education_text=parsed_data['education_text'],
            resume_text=parsed_data['raw_text'],
            skills_match_score=scores['skills_score'],
            experience_match_score=scores['experience_score'],
            education_match_score=scores['education_score'],
            overall_score=scores['overall_score']
        )
        print(f"  Successfully saved Resume ID: {resume.pk} to DB.")
        
    print("\n=== SYSTEM VERIFICATION COMPLETED ===")

if __name__ == '__main__':
    run_tests()

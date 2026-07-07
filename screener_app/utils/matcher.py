import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_skills_match(jd_skills_list, resume_skills_list):
    """Calculates the percentage of required skills found in candidate's skills list."""
    if not jd_skills_list:
        return 100.0
    
    # Normalize skills
    jd_skills = set(s.strip().lower() for s in jd_skills_list if s.strip())
    resume_skills = set(s.strip().lower() for s in resume_skills_list if s.strip())
    
    if not jd_skills:
        return 100.0
        
    matched_skills = jd_skills.intersection(resume_skills)
    score = (len(matched_skills) / len(jd_skills)) * 100
    return round(score, 2)

def extract_years_of_experience(text):
    """Extracts total estimated years of experience from resume experience text using regex."""
    text_lower = text.lower()
    
    # Check for patterns like "5 years", "3+ years", "10 yrs", "2.5 years of experience"
    patterns = [
        r'(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:year|yr)s?\b',
        r'experience\s*(?:of)?\s*(\d+(?:\.\d+)?)\s*(?:year|yr)s?\b',
        r'(?:one|two|three|four|five|six|seven|eight|nine|ten)\s*years'
    ]
    
    words_to_num = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    }
    
    years = 0.0
    
    # Try finding numerical patterns
    found_years = []
    for pattern in patterns[:2]:
        matches = re.findall(pattern, text_lower)
        for m in matches:
            try:
                found_years.append(float(m))
            except ValueError:
                pass
                
    # Try word patterns
    word_matches = re.findall(patterns[2], text_lower)
    for m in word_matches:
        word = m.split()[0]
        if word in words_to_num:
            found_years.append(float(words_to_num[word]))
            
    if found_years:
        # We take the maximum experience duration found or sum them if it's separate jobs.
        # Often resumes list "duration: 2 years" and another "duration: 3 years".
        # As a heuristic, we'll take the maximum single mention, or sum them up if they look like separate segments.
        # Let's take the maximum value found to represent their highest bracket.
        years = max(found_years)
        
    # Alternate check: scan for dates like "2018 - 2021" or "2018 to Present"
    date_pattern = r'\b(19\d{2}|20\d{2})\s*[-–—to]+\s*(19\d{2}|20\d{2}|present|current|now)\b'
    date_matches = re.findall(date_pattern, text_lower)
    calculated_years = 0.0
    for start, end in date_matches:
        try:
            start_yr = int(start)
            if end in ['present', 'current', 'now']:
                end_yr = 2026  # Current project year context
            else:
                end_yr = int(end)
            diff = end_yr - start_yr
            if diff > 0 and diff < 40:
                calculated_years += diff
        except ValueError:
            pass
            
    if calculated_years > years:
        years = calculated_years
        
    return years

def calculate_experience_match(jd_experience_str, resume_experience_text):
    """Calculates experience match score by comparing required experience to resume experience."""
    # Extract minimum years required from JD
    # Match patterns like "3-5 years", "0-3 years", "5+ years", "3 years"
    min_required_years = 0.0
    matches = re.findall(r'(\d+)\s*(?:-|to|\+)?\s*\d*\s*(?:year|yr)s?', jd_experience_str.lower())
    if matches:
        try:
            min_required_years = float(matches[0])
        except ValueError:
            pass
            
    candidate_years = extract_years_of_experience(resume_experience_text)
    
    if min_required_years == 0.0:
        return 100.0
        
    if candidate_years >= min_required_years:
        return 100.0
    else:
        # Calculate ratio
        ratio = (candidate_years / min_required_years) * 100
        # If candidate has 0 years but some experience text is present, give a small baseline
        if ratio == 0.0 and len(resume_experience_text.strip()) > 50:
            return 30.0
        return round(ratio, 2)

def calculate_education_match(jd_education_str, resume_education_text):
    """Calculates education match score by checking degrees and subject keywords."""
    jd_edu_lower = jd_education_str.lower()
    res_edu_lower = resume_education_text.lower()
    
    # Predefined degrees list from highest to lowest
    degrees = {
        'phd': ['phd', 'ph.d', 'doctor of philosophy', 'doctorate'],
        'master': ['master', 'm.tech', 'mtech', 'm.s', 'ms', 'mca', 'postgraduate', 'post graduate'],
        'bachelor': ['bachelor', 'b.tech', 'btech', 'b.s', 'bs', 'bca', 'undergraduate', 'graduate', 'degree']
    }
    
    # Identify required degree level in JD
    required_level = None
    for level, keywords in degrees.items():
        if any(kw in jd_edu_lower for kw in keywords):
            required_level = level
            break
            
    # If no specific degree is required, check keyword similarity
    if not required_level:
        # Check if candidate has ANY degree
        any_degree = False
        for level, keywords in degrees.items():
            if any(kw in res_edu_lower for kw in keywords):
                any_degree = True
                break
        return 100.0 if any_degree else 40.0
        
    # Check what levels candidate possesses
    candidate_levels = []
    for level, keywords in degrees.items():
        if any(kw in res_edu_lower for kw in keywords):
            candidate_levels.append(level)
            
    # Score based on candidate level vs required level
    if required_level == 'phd':
        if 'phd' in candidate_levels:
            return 100.0
        elif 'master' in candidate_levels:
            return 70.0
        elif 'bachelor' in candidate_levels:
            return 40.0
    elif required_level == 'master':
        if 'phd' in candidate_levels or 'master' in candidate_levels:
            return 100.0
        elif 'bachelor' in candidate_levels:
            return 60.0
    elif required_level == 'bachelor':
        if any(l in candidate_levels for l in ['phd', 'master', 'bachelor']):
            return 100.0
            
    # Partial matches (check fields of study like Computer Science, CSE, IT, Engineering)
    fields = ['computer science', 'cse', 'it', 'information technology', 'engineering', 'software']
    field_match = any(f in res_edu_lower for f in fields)
    
    if field_match:
        return 50.0
        
    return 20.0

def calculate_cosine_similarity(jd_description, resume_text):
    """Calculates TF-IDF Cosine Similarity between Job Description text and Resume text."""
    if not jd_description or not resume_text:
        return 0.0
        
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf = vectorizer.fit_transform([jd_description, resume_text])
        sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return round(sim * 100, 2)
    except Exception as e:
        print(f"Error calculating cosine similarity: {e}")
        return 0.0

def calculate_overall_match(jd, resume_data):
    """Calculates semantic and logical scores, and returns a dict with all details."""
    # Convert JD skills list (comma-separated text)
    jd_skills = [s.strip() for s in jd.skills_required.split(',') if s.strip()]
    resume_skills = resume_data['skills']
    
    skills_score = calculate_skills_match(jd_skills, resume_skills)
    experience_score = calculate_experience_match(jd.experience_required, resume_data['experience_text'])
    education_score = calculate_education_match(jd.education_required, resume_data['education_text'])
    cosine_sim = calculate_cosine_similarity(jd.description, resume_data['raw_text'])
    
    # Calculate Overall Score using a composite formula
    # Skills (40%), Experience (30%), Education (30%)
    # Let's adjust slightly using Cosine Similarity to ensure semantic alignment acts as a modifier
    base_score = (skills_score * 0.4) + (experience_score * 0.3) + (education_score * 0.3)
    
    # We mix 80% base score with 20% Cosine Similarity to capture raw semantic matching
    overall_score = (base_score * 0.8) + (cosine_sim * 0.2)
    
    # Special cap: if skills match is zero and experience match is zero, cap overall score low
    if skills_score == 0.0 and experience_score == 0.0:
        overall_score = min(overall_score, 20.0)
        
    return {
        'skills_score': round(skills_score, 2),
        'experience_score': round(experience_score, 2),
        'education_score': round(education_score, 2),
        'cosine_sim': round(cosine_sim, 2),
        'overall_score': round(overall_score, 2)
    }

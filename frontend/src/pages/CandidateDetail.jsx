import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

function CandidateDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchCandidateDetails = () => {
    axios.get(`${API_BASE}/api/resumes/${id}/`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching candidate evaluation details:", err);
        setError("Failed to retrieve candidate profile details from Django backend API.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCandidateDetails();
  }, [id]);

  const handleStatusChange = (statusType) => {
    setUpdating(true);
    axios.post(`${API_BASE}/api/resumes/${id}/${statusType}/`)
      .then(response => {
        setUpdating(false);
        fetchCandidateDetails();
      })
      .catch(err => {
        console.error(`Error updating candidate status to ${statusType}:`, err);
        setError(`Failed to update candidate status to ${statusType}.`);
        setUpdating(false);
      });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Candidate Details...</span>
        </div>
      </div>
    );
  }

  const { candidate, job, matched_skills, missing_skills, other_skills } = data;
  
  // Calculate radial SVG circle progress offset
  // Radius is 60, perimeter = 2 * pi * 60 = 377
  const score = candidate.overall_score || 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div>
      {error && (
        <div className="alert alert-danger glass-card border-danger text-light mb-4">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> {error}
        </div>
      )}

      <div className="row g-4 animate-fade-in-up">
        {/* Left Panel: Profile Extracted Sections */}
        <div className="col-lg-8">
          <div className="glass-card p-4 mb-4">
            <h2 className="display-6 fw-bold text-white mb-3" id="candidate-name">{candidate.candidate_name || "Not Parsed"}</h2>
            
            <div className="row g-3 text-light fs-7 mb-4 pb-3 border-bottom border-secondary border-opacity-10">
              <div className="col-md-6 d-flex align-items-center">
                <i className="fa-solid fa-envelope text-primary me-2 fs-6"></i>
                <span><strong>Email:</strong> <a href={`mailto:${candidate.email}`} className="text-light text-decoration-none">{candidate.email || "Not Found"}</a></span>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <i className="fa-solid fa-calendar-day text-info me-2 fs-6"></i>
                <span><strong>Uploaded:</strong> {new Date(candidate.uploaded_at).toLocaleString(undefined, {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <i className="fa-solid fa-phone text-success me-2 fs-6"></i>
                <span><strong>Phone:</strong> {candidate.phone || "Not Found"}</span>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <i className="fa-solid fa-briefcase text-warning me-2 fs-6"></i>
                <span><strong>Job:</strong> <span className="text-white">{job.title}</span></span>
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="mb-4">
              <h5 className="text-white mb-3"><i className="fa-solid fa-gears text-primary me-2"></i>Extracted Skills</h5>
              <div className="d-flex flex-wrap">
                {matched_skills.map((skill, index) => (
                  <span key={`match-${index}`} className="badge-custom badge-skill badge-skill-match"><i className="fa-solid fa-circle-check me-1"></i> {skill}</span>
                ))}
                {other_skills.map((skill, index) => (
                  <span key={`other-${index}`} className="badge-custom badge-skill"><i className="fa-solid fa-circle-info me-1"></i> {skill}</span>
                ))}
                {missing_skills.map((skill, index) => (
                  <span key={`missing-${index}`} className="badge-custom badge-skill badge-skill-missing"><i className="fa-solid fa-circle-xmark me-1"></i> {skill}</span>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="mb-4">
              <h5 className="text-white mb-3"><i className="fa-solid fa-business-time text-info me-2"></i>Experience</h5>
              <div className="bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded p-3 text-light fs-7 lh-base whitespace-pre-wrap">
                {candidate.experience_text || "No experience information extracted."}
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-4">
              <h5 className="text-white mb-3"><i className="fa-solid fa-user-graduate text-warning me-2"></i>Education</h5>
              <div className="bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded p-3 text-light fs-7 lh-base whitespace-pre-wrap">
                {candidate.education_text || "No education information extracted."}
              </div>
            </div>

            {/* Raw Resume Text */}
            <div className="mb-0">
              <h5 className="text-white mb-3"><i className="fa-solid fa-file-lines text-muted me-2"></i>Resume Text</h5>
              <div className="bg-dark bg-opacity-30 border border-secondary border-opacity-15 rounded p-3 text-light fs-8 overflow-y-scroll" style={{ maxHeight: '250px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {candidate.resume_text}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Scoring circle & Actions */}
        <div className="col-lg-4">
          {/* Match Scores */}
          <div className="glass-card p-4 mb-4 text-center">
            <h4 className="text-white mb-4 text-start"><i className="fa-solid fa-chart-pie text-primary me-2"></i>Match Scores</h4>
            
            <div className="score-circle-container">
              <svg width="140" height="140">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="70" r="60" className="score-circle-bg" />
                <circle cx="70" cy="70" r="60" className="score-circle-bar" 
                        strokeDasharray="377" 
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                        id="progress-circle" />
              </svg>
              <div className="score-text" id="score-percentage">{candidate.overall_score}%</div>
            </div>

            <span 
              className="badge px-4 py-2 rounded-pill fw-bold fs-7 mb-4 d-inline-block" 
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}
            >
              Overall Match
            </span>

            {/* Sub score Progress bars */}
            <div className="text-start mt-3">
              <div className="d-flex justify-content-between text-light fs-8 mb-1">
                <span>Skills Match</span>
                <span className="text-white fw-semibold" id="score-skills">{candidate.skills_match_score}%</span>
              </div>
              <div className="custom-progress">
                <div className="custom-progress-bar progress-skills" style={{ width: `${candidate.skills_match_score}%` }}></div>
              </div>

              <div className="d-flex justify-content-between text-light fs-8 mb-1">
                <span>Experience Match</span>
                <span className="text-white fw-semibold" id="score-experience">{candidate.experience_match_score}%</span>
              </div>
              <div className="custom-progress">
                <div className="custom-progress-bar progress-experience" style={{ width: `${candidate.experience_match_score}%` }}></div>
              </div>

              <div className="d-flex justify-content-between text-light fs-8 mb-1">
                <span>Education Match</span>
                <span className="text-white fw-semibold" id="score-education">{candidate.education_match_score}%</span>
              </div>
              <div className="custom-progress">
                <div className="custom-progress-bar progress-education" style={{ width: `${candidate.education_match_score}%` }}></div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="glass-card p-4">
            <h4 class="text-white mb-4"><i class="fa-solid fa-sliders text-primary me-2"></i>Actions</h4>

            <div className="d-grid gap-3">
              {candidate.status !== 'Shortlisted' ? (
                <button 
                  onClick={() => handleStatusChange('shortlist')}
                  className="btn btn-outline-success py-2 fw-semibold d-flex align-items-center justify-content-center"
                  disabled={updating}
                  id="action-shortlist"
                >
                  <i className="fa-solid fa-circle-check me-2"></i> Shortlist Candidate
                </button>
              ) : (
                <button className="btn btn-success py-2 fw-semibold d-flex align-items-center justify-content-center" disabled>
                  <i className="fa-solid fa-circle-check me-2"></i> Candidate Shortlisted
                </button>
              )}

              {candidate.status !== 'Rejected' ? (
                <button 
                  onClick={() => handleStatusChange('reject')}
                  className="btn btn-outline-danger py-2 fw-semibold d-flex align-items-center justify-content-center"
                  disabled={updating}
                  id="action-reject"
                >
                  <i className="fa-solid fa-circle-xmark me-2"></i> Reject Candidate
                </button>
              ) : (
                <button className="btn btn-danger py-2 fw-semibold d-flex align-items-center justify-content-center" disabled>
                  <i className="fa-solid fa-circle-xmark me-2"></i> Candidate Rejected
                </button>
              )}

              <a 
                href={`${API_BASE}/api/resumes/${candidate.id}/download/`} 
                className="btn btn-outline-glass py-2 fw-semibold d-flex align-items-center justify-content-center"
                target="_blank"
                rel="noreferrer"
                id="action-download"
              >
                <i className="fa-solid fa-download me-2 text-primary"></i> Download Resume
              </a>

              <Link 
                to={`/job/${job.id}`} 
                className="btn btn-outline-glass py-2 fw-semibold d-flex align-items-center justify-content-center"
                id="action-back"
              >
                <i className="fa-solid fa-arrow-left me-2"></i> Back to Job
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetail;

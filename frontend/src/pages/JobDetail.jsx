import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const fetchJobDetails = () => {
    axios.get(`${API_BASE}/api/jobs/${id}/`)
      .then(response => {
        const data = response.data;
        setJob({
          id: data.id,
          title: data.title,
          experience_required: data.experience_required,
          education_required: data.education_required,
          skills_required: data.skills_required,
          description: data.description,
          posted_date: data.posted_date
        });
        setResumes(data.resumes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching job details:", err);
        setError("Failed to retrieve job details. Check connection to backend API.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('resumes', files[i]);
    }

    axios.post(`${API_BASE}/api/jobs/${id}/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setUploading(false);
        // Clear input file
        if (fileInputRef.current) fileInputRef.current.value = '';
        // Refresh details & list
        fetchJobDetails();
      })
      .catch(err => {
        console.error("Error uploading resumes:", err);
        setError("Error during file upload or parsing. Verify that PyPDF2/python-docx/spaCy are installed and files are valid.");
        setUploading(false);
      });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Job Details...</span>
        </div>
      </div>
    );
  }

  const skillsList = job.skills_required ? job.skills_required.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];

  return (
    <div>
      {error && (
        <div className="alert alert-danger glass-card border-danger text-light mb-4">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> {error}
        </div>
      )}

      {/* Details Card */}
      <div className="row g-4 mb-5 animate-fade-in-up">
        <div className="col-lg-12">
          <div className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap mb-4">
              <div>
                <h2 className="display-6 fw-bold text-white mb-2">{job.title}</h2>
                <div className="d-flex flex-wrap gap-3 text-light fs-7 opacity-75">
                  <span><i className="fa-solid fa-clock me-1 text-primary"></i> <strong>Experience:</strong> {job.experience_required}</span>
                  <span><i className="fa-solid fa-calendar me-1 text-info"></i> <strong>Posted:</strong> {new Date(job.posted_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                  <span><i className="fa-solid fa-graduation-cap me-1 text-warning"></i> <strong>Education:</strong> {job.education_required}</span>
                  <span><i className="fa-solid fa-file-pdf me-1 text-danger"></i> <strong>Total Resumes:</strong> {resumes.length}</span>
                </div>
              </div>
              <Link to="/jobs" className="btn btn-outline-glass btn-sm mt-2 mt-md-0"><i className="fa-solid fa-arrow-left me-1"></i> Back to Jobs</Link>
            </div>

            <div className="border-top border-secondary border-opacity-15 pt-4">
              <h5 className="text-white mb-3"><i className="fa-solid fa-gears me-2 text-primary"></i>Required Skills:</h5>
              <div className="d-flex flex-wrap mb-4">
                {skillsList.map((skill, index) => (
                  <span key={index} className="badge-custom badge-skill">{skill}</span>
                ))}
              </div>

              <h5 className="text-white mb-2"><i className="fa-solid fa-align-left me-2 text-info"></i>Description:</h5>
              <div className="bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded p-3 text-light fs-7 lh-base whitespace-pre-wrap">
                {job.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload resumes section */}
      <div className="row g-4 mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="col-lg-12">
          <div className="glass-card p-4">
            <h4 className="text-white mb-4"><i className="fa-solid fa-file-arrow-up text-primary me-2"></i>Upload Resumes</h4>

            <div className="row g-3 align-items-center">
              <div className="col-md-8">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="form-control bg-dark border-secondary text-white py-2 px-3" 
                  accept=".pdf,.docx,.doc" 
                  multiple 
                  disabled={uploading}
                  onChange={handleFileUpload}
                  id="resume-file-input"
                />
                <div className="form-text text-muted mt-2">Supported formats: PDF, DOC, DOCX. Select multiple resumes for batch uploading and automated grading.</div>
              </div>
              <div className="col-md-4 d-flex gap-2">
                <button 
                  type="button" 
                  className="btn btn-primary-glow w-100 py-2" 
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={uploading}
                  id="upload-analyze-btn"
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Parsing Resumes...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane me-1"></i> Upload & Analyze
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-glass w-100 py-2" 
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={uploading}
                >
                  <i className="fa-solid fa-layer-group me-1"></i> Bulk Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates List Section */}
      <div className="row g-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="col-lg-12">
          <div className="glass-card p-4">
            <h4 className="text-white mb-4"><i className="fa-solid fa-table-list text-primary me-2"></i>Screened Resumes</h4>

            <div className="table-responsive">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Email</th>
                    <th>Skills Match</th>
                    <th>Overall Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.map(resume => (
                    <tr key={resume.id}>
                      <td className="fw-bold text-white">{resume.candidate_name || "Not Parsed"}</td>
                      <td>{resume.email || "Not Parsed"}</td>
                      <td>
                        <span className="fw-semibold text-white">{resume.skills_match_score}%</span>
                      </td>
                      <td>
                        <span 
                          className="badge px-3 py-2 rounded fw-bold" 
                          style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}
                        >
                          {resume.overall_score}%
                        </span>
                      </td>
                      <td>
                        {resume.status === 'Pending' && <span className="badge-custom badge-pending">Pending</span>}
                        {resume.status === 'Shortlisted' && <span className="badge-custom badge-shortlisted">Shortlisted</span>}
                        {resume.status === 'Rejected' && <span className="badge-custom badge-rejected">Rejected</span>}
                      </td>
                      <td>
                        <Link to={`/resume/${resume.id}`} className="btn btn-primary-glow btn-sm py-1 px-3" id={`view-candidate-${resume.id}`}>
                          <i className="fa-solid fa-eye me-1"></i> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {resumes.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <i className="fa-solid fa-file-shield fs-2 mb-3 d-block text-secondary"></i>
                        No resumes uploaded for this job posting yet. Select files above to parse.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;

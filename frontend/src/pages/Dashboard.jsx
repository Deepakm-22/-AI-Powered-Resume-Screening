import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

function Dashboard() {
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_resumes: 0,
    shortlisted: 0,
    avg_score: 0,
    recent_jobs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/dashboard/`)
      .then(response => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to connect to the backend server. Please verify Django API is running on port 8000.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
        <p className="mt-3 text-muted">Retrieving recruitment metrics...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger glass-card border-danger text-light mb-4" role="alert">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> {error}
        </div>
      )}

      <div className="row mb-5 justify-content-center text-center animate-fade-in-up">
        <div className="col-md-10">
          <h1 className="display-4 fw-extrabold mb-3 text-white">AI-Powered Resume Screening System</h1>
          <p className="lead text-muted fs-5">Automate recruitment with intelligent resume analysis and matching</p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="row g-4 mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="col-6 col-lg-3">
          <div className="glass-card stat-card d-flex flex-column align-items-center text-center h-100">
            <div className="stat-icon text-primary">
              <i className="fa-solid fa-briefcase"></i>
            </div>
            <div className="stat-value" id="stat-total-jobs">{stats.total_jobs}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="glass-card stat-card d-flex flex-column align-items-center text-center h-100">
            <div className="stat-icon text-info">
              <i className="fa-solid fa-file-invoice"></i>
            </div>
            <div className="stat-value" id="stat-resumes">{stats.total_resumes}</div>
            <div className="stat-label">Resumes Screened</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="glass-card stat-card d-flex flex-column align-items-center text-center h-100">
            <div className="stat-icon text-warning">
              <i className="fa-solid fa-star"></i>
            </div>
            <div className="stat-value" id="stat-avg-score">{stats.avg_score}%</div>
            <div className="stat-label">Avg Match Score</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="glass-card stat-card d-flex flex-column align-items-center text-center h-100">
            <div className="stat-icon text-success">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="stat-value" id="stat-shortlisted">{stats.shortlisted}</div>
            <div className="stat-label">Shortlisted</div>
          </div>
        </div>
      </div>

      {/* Recent Job Postings */}
      <div className="row g-4 mb-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="col-lg-12">
          <div className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fs-4 mb-0 text-white"><i className="fa-solid fa-list-check me-2 text-primary"></i>Recent Job Postings</h3>
              <Link to="/jobs" className="btn btn-outline-glass btn-sm">View All Jobs</Link>
            </div>

            <div className="table-responsive">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Experience Required</th>
                    <th>Posted Date</th>
                    <th>Resumes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_jobs.map(job => (
                    <tr key={job.id}>
                      <td className="fw-bold text-white">{job.title}</td>
                      <td>{job.experience_required}</td>
                      <td>{new Date(job.posted_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                      <td>
                        <span className="badge bg-primary rounded-pill">{job.resumes_count}</span>
                      </td>
                      <td>
                        <Link to={`/job/${job.id}`} className="btn btn-primary-glow btn-sm py-1 px-3" id={`view-job-${job.id}`}>
                          <i className="fa-solid fa-eye me-1"></i> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {stats.recent_jobs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No job postings created yet. Start by creating a job description.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="row g-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="col-12">
          <div className="glass-card p-4 h-100">
            <h4 className="mb-4 text-white"><i className="fa-solid fa-bolt me-2 text-warning"></i>Key Features</h4>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <i className="fa-solid fa-circle-check text-success me-3 mt-1"></i>
                <div>
                  <strong className="text-white">NLP-based resume parsing</strong>
                  <p className="text-muted mb-0 fs-7">Automatically extracts contact info, skills, education, and experience from PDF/DOCX.</p>
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="fa-solid fa-circle-check text-success me-3 mt-1"></i>
                <div>
                  <strong className="text-white">TF-IDF & semantic matching</strong>
                  <p className="text-muted mb-0 fs-7">Matches resumes against job profiles using cosine similarity vectors.</p>
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="fa-solid fa-circle-check text-success me-3 mt-1"></i>
                <div>
                  <strong className="text-white">Explainable scoring criteria</strong>
                  <p className="text-muted mb-0 fs-7">Breaks down calculations into Skills, Experience, and Education alignments.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

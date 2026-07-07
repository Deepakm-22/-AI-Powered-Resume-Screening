import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/jobs/`)
      .then(response => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching jobs list:", err);
        setError("Could not retrieve jobs. Please make sure the Django API backend is running.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger glass-card border-danger text-light mb-4">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> {error}
        </div>
      )}

      <div className="row mb-4 justify-content-between align-items-center animate-fade-in-up">
        <div className="col-md-6">
          <h2 className="text-white"><i className="fa-solid fa-briefcase text-primary me-2"></i>Job Postings</h2>
          <p className="text-muted">Manage all active jobs and candidate screening lists</p>
        </div>
        <div className="col-md-auto">
          <Link to="/jobs/create" className="btn btn-primary-glow"><i class="fa-solid fa-plus me-1"></i> Post New Job</Link>
        </div>
      </div>

      <div className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="table-responsive">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Experience Required</th>
                <th>Required Education</th>
                <th>Resumes Screened</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td className="fw-bold text-white">{job.title}</td>
                  <td>{job.experience_required}</td>
                  <td>{job.education_required}</td>
                  <td>
                    <span className="badge bg-primary rounded-pill">{job.resumes_count} Resumes</span>
                  </td>
                  <td>
                    <Link to={`/job/${job.id}`} className="btn btn-primary-glow btn-sm py-1 px-3" id={`view-job-list-${job.id}`}>
                      <i className="fa-solid fa-magnifying-glass me-1"></i> Screen Resumes
                    </Link>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <i className="fa-regular fa-folder-open fs-2 mb-3 d-block text-secondary"></i>
                    No job postings found. Click "Post New Job" above to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default JobList;

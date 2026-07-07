import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

function Analytics() {
  const [data, setData] = useState({
    score_distribution: {
      bracket_90_100: 0,
      bracket_80_89: 0,
      bracket_70_79: 0,
      bracket_60_69: 0,
      bracket_below_60: 0,
    },
    job_stats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/analytics/`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching analytics data:", err);
        setError("Failed to retrieve statistics from backend api server.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  const { score_distribution, job_stats } = data;

  return (
    <div>
      {error && (
        <div className="alert alert-danger glass-card border-danger text-light mb-4">
          <i className="fa-solid fa-triangle-exclamation me-2"></i> {error}
        </div>
      )}

      <div className="row mb-5 justify-content-between align-items-center animate-fade-in-up">
        <div className="col-md-8">
          <h2 className="text-white"><i className="fa-solid fa-chart-line text-primary me-2"></i>Analytics Dashboard</h2>
          <p className="text-muted">Inspect resume evaluation statistics and job alignments</p>
        </div>
      </div>

      {/* Score Distribution Panel */}
      <div className="glass-card p-4 mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h4 className="text-white mb-4"><i className="fa-solid fa-chart-bar text-primary me-2"></i>Score Distribution</h4>
        
        <div className="row g-3 text-center">
          <div className="col">
            <div className="bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded p-3">
              <div className="display-6 fw-bold text-success mb-1" id="bracket-90">{score_distribution.bracket_90_100}</div>
              <div className="text-muted fs-8 text-uppercase fw-semibold">90-100%</div>
            </div>
          </div>
          <div className="col">
            <div className="bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded p-3">
              <div className="display-6 fw-bold text-info mb-1" id="bracket-80">{score_distribution.bracket_80_89}</div>
              <div className="text-muted fs-8 text-uppercase fw-semibold">80-89%</div>
            </div>
          </div>
          <div className="col">
            <div className="bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded p-3">
              <div className="display-6 fw-bold text-primary mb-1" id="bracket-70">{score_distribution.bracket_70_79}</div>
              <div className="text-muted fs-8 text-uppercase fw-semibold">70-79%</div>
            </div>
          </div>
          <div className="col">
            <div className="bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded p-3">
              <div className="display-6 fw-bold text-warning mb-1" id="bracket-60">{score_distribution.bracket_60_69}</div>
              <div className="text-muted fs-8 text-uppercase fw-semibold">60-69%</div>
            </div>
          </div>
          <div className="col">
            <div className="bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded p-3">
              <div className="display-6 fw-bold text-danger mb-1" id="bracket-below">{score_distribution.bracket_below_60}</div>
              <div className="text-muted fs-8 text-uppercase fw-semibold">Below 60%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Job-wise statistics table */}
      <div className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h4 className="text-white mb-4"><i className="fa-solid fa-list-check text-primary me-2"></i>Job-wise Statistics</h4>
        
        <div className="table-responsive">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Total Resumes</th>
                <th>Average Score</th>
                <th>Experience Required</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {job_stats.map(item => (
                <tr key={item.id}>
                  <td className="fw-bold text-white">{item.title}</td>
                  <td>
                    <span className="badge bg-primary rounded-pill">{item.resumes_count}</span>
                  </td>
                  <td>
                    {item.resumes_count > 0 ? (
                      <span 
                        className={`badge px-3 py-2 rounded ${
                          item.avg_score >= 80.0 ? 'bg-success' : 
                          item.avg_score >= 60.0 ? 'bg-warning text-dark' : 'bg-danger'
                        }`}
                      >
                        {item.avg_score}%
                      </span>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                  <td>{item.experience_required}</td>
                  <td>
                    <Link to={`/job/${item.id}`} className="btn btn-primary-glow btn-sm py-1 px-3" id={`view-analytics-job-${item.id}`}>
                      <i className="fa-solid fa-eye me-1"></i> View
                    </Link>
                  </td>
                </tr>
              ))}
              {job_stats.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No job postings created yet.
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

export default Analytics;

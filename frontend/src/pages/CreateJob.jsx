import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

function CreateJob() {
  const [formData, setFormData] = useState({
    title: '',
    experience_required: '',
    education_required: '',
    skills_required: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    axios.post(`${API_BASE}/api/jobs/`, formData)
      .then(response => {
        setLoading(false);
        navigate(`/job/${response.data.id}`);
      })
      .catch(err => {
        console.error("Error creating job posting:", err);
        setError("Failed to create the job description. Please ensure the backend is running and data is valid.");
        setLoading(false);
      });
  };

  return (
    <div className="row justify-content-center animate-fade-in-up">
      <div className="col-lg-8">
        <div className="glass-card p-4 p-md-5">
          <h2 className="mb-4 text-white"><i className="fa-solid fa-square-plus text-primary me-2"></i>Create New Job Posting</h2>
          <p className="text-muted mb-4">Provide details about the job requirements. Uploaded candidate resumes will be scored and ranked against these properties.</p>
          
          {error && (
            <div className="alert alert-danger glass-card border-danger text-light mb-4">
              <i className="fa-solid fa-circle-exclamation me-2"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} id="create-job-form">
            {/* Job Title */}
            <div className="mb-4">
              <label htmlFor="title" class="form-label fw-semibold text-white">Job Title</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white py-2 px-3" 
                id="title" 
                name="title" 
                placeholder="e.g. Python Developer" 
                value={formData.title}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="row mb-4">
              {/* Experience */}
              <div className="col-md-6">
                <label htmlFor="experience_required" class="form-label fw-semibold text-white">Experience Required</label>
                <input 
                  type="text" 
                  className="form-control bg-dark border-secondary text-white py-2 px-3" 
                  id="experience_required" 
                  name="experience_required" 
                  placeholder="e.g. 3-5 years" 
                  value={formData.experience_required}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              {/* Education */}
              <div className="col-md-6">
                <label htmlFor="education_required" class="form-label fw-semibold text-white">Education Required</label>
                <input 
                  type="text" 
                  className="form-control bg-dark border-secondary text-white py-2 px-3" 
                  id="education_required" 
                  name="education_required" 
                  placeholder="e.g. Bachelor's degree in CS" 
                  value={formData.education_required}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            {/* Skills Required */}
            <div className="mb-4">
              <label htmlFor="skills_required" class="form-label fw-semibold text-white">Required Skills (Comma-separated)</label>
              <textarea 
                className="form-control bg-dark border-secondary text-white py-2 px-3" 
                id="skills_required" 
                name="skills_required" 
                rows="2" 
                placeholder="e.g. python, django, rest api, docker, postgresql" 
                value={formData.skills_required}
                onChange={handleInputChange}
                required 
              />
              <div className="form-text text-muted mt-2">Separate each skill with a comma. The parsing engine will evaluate candidate alignment based on these exact values.</div>
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" class="form-label fw-semibold text-white">Detailed Job Description</label>
              <textarea 
                className="form-control bg-dark border-secondary text-white py-2 px-3" 
                id="description" 
                name="description" 
                rows="6" 
                placeholder="Describe the responsibilities, daily operations, and other requirements of the role..." 
                value={formData.description}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-10">
              <Link to="/" className="btn btn-outline-glass"><i className="fa-solid fa-arrow-left me-1"></i> Cancel</Link>
              <button 
                type="submit" 
                className="btn btn-primary-glow px-4" 
                disabled={loading}
                id="submit-job"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : "Create & Proceed"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;

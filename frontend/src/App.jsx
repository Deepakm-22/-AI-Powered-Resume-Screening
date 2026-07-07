import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import CreateJob from './pages/CreateJob';
import JobDetail from './pages/JobDetail';
import CandidateDetail from './pages/CandidateDetail';
import Analytics from './pages/Analytics';

// Navigation layout wrapper
function NavigationWrapper() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark glass-nav sticky-top py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" href="#" to="/" id="nav-logo">
            <i className="fa-solid fa-robot me-2 fs-4 text-primary"></i>
            <span className="fw-bold tracking-tight">AI Resume Screener</span>
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link 
                  className={`nav-link px-3 ${path === '/' ? 'active text-white' : ''}`} 
                  to="/" 
                  id="nav-home"
                >
                  <i className="fa-solid fa-house me-1"></i> Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link px-3 ${path === '/jobs' || path.startsWith('/job/') ? 'active text-white' : ''}`} 
                  to="/jobs" 
                  id="nav-jobs"
                >
                  <i className="fa-solid fa-briefcase me-1"></i> Jobs
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link px-3 ${path === '/jobs/create' ? 'active text-white' : ''}`} 
                  to="/jobs/create" 
                  id="nav-create"
                >
                  <i className="fa-solid fa-plus me-1"></i> Create Job
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link px-3 ${path === '/analytics' ? 'active text-white' : ''}`} 
                  to="/analytics" 
                  id="nav-analytics"
                >
                  <i className="fa-solid fa-chart-simple me-1"></i> Analytics
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-5">
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/resume/:id" element={<CandidateDetail />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-top border-secondary border-opacity-10 text-center text-muted mt-5">
        <div className="container">
          <p className="mb-0 fs-7">&copy; 2026 AI Resume Screener Project. Automated Recruiting powered by NLP & Machine Learning.</p>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <NavigationWrapper />
    </Router>
  );
}

export default App;

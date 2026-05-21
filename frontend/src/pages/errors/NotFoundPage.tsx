import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="text-center">
              {/* 404 Illustration */}
              <div className="mb-4 position-relative">
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: '150px',
                    height: '150px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '3px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <span 
                    className="display-1 fw-bold text-white"
                    style={{ 
                      textShadow: '2px 4px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    404
                  </span>
                </div>
                
                {/* Floating elements for visual interest */}
                <div 
                  className="position-absolute"
                  style={{ 
                    top: '20px', 
                    right: '30%',
                    width: '20px',
                    height: '20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    animation: 'float 3s ease-in-out infinite',
                  }}
                />
                <div 
                  className="position-absolute"
                  style={{ 
                    bottom: '30px', 
                    left: '25%',
                    width: '15px',
                    height: '15px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    animation: 'float 2.5s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Error Message Card */}
              <div 
                className="bg-white rounded-4 p-4 p-md-5 shadow-lg"
                style={{
                  animation: 'slideUp 0.6s ease-out',
                }}
              >
                <div className="mb-4">
                  <div className="mb-3">
                    <span className="display-6">🔍</span>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">
                    Page Not Found
                  </h2>
                  <p className="text-muted mb-1">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  <p className="text-muted small">
                    Error Code: 404 • Not Found
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                    style={{
                      borderRadius: '0.5rem',
                      padding: '0.6rem 1.5rem',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <ArrowLeft size={18} />
                    Go Back
                  </button>
                  
                  <Link
                    to="/login"
                    className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                    style={{
                      borderRadius: '0.5rem',
                      padding: '0.6rem 1.5rem',
                      transition: 'all 0.3s ease',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                    }}
                  >
                    <Home size={18} />
                    Go to Login
                  </Link>
                </div>

                {/* Quick Links */}
                <div className="mt-4 pt-4 border-top">
                  <p className="text-muted small mb-3">
                    Maybe you were looking for:
                  </p>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <Link 
                      to="/dashboard" 
                      className="btn btn-light btn-sm"
                      style={{ borderRadius: '2rem' }}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/patients" 
                      className="btn btn-light btn-sm"
                      style={{ borderRadius: '2rem' }}
                    >
                      Patients
                    </Link>
                    <Link 
                      to="/appointments" 
                      className="btn btn-light btn-sm"
                      style={{ borderRadius: '2rem' }}
                    >
                      Appointments
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <p className="text-white mt-4 opacity-75 small">
                © {new Date().getFullYear()} Hospital Management System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};


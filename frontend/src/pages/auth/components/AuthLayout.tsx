import React from 'react';


interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="row g-0 shadow-lg rounded-4 overflow-hidden">
              {/* Left Side - Brand/Info */}
              <div 
                className="col-md-5 d-none d-md-flex flex-column justify-content-center p-4 text-white"
                style={{
                  background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
                }}
              >
                <div className="text-center mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      fontSize: '2.5rem',
                    }}
                  >
                    🏥
                  </div>
                  <h3 className="fw-bold mb-2">MediCare Pro</h3>
                  <p className="opacity-75 small mb-4">
                    Complete Hospital Management System
                  </p>
                </div>
                
                <div className="mt-auto">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span>✓</span>
                    <small>Patient Records Management</small>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span>✓</span>
                    <small>Appointment Scheduling</small>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span>✓</span>
                    <small>Pharmacy & Billing</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span>✓</span>
                    <small>Advanced Reporting</small>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="col-md-7 bg-white">
                <div className="p-4 p-lg-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark mb-1">{title}</h2>
                    {subtitle && (
                      <p className="text-muted">{subtitle}</p>
                    )}
                  </div>
                  
                  {children}

                  <div className="text-center mt-4">
                    <small className="text-muted">
                      © {new Date().getFullYear()} MediCare Pro. All rights reserved.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
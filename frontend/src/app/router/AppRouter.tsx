import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

// Auth Pages
const LoginPage = lazy(() => 
  import('../../pages/auth/LoginPage').then(module => ({ 
    default: module.LoginPage 
  }))
);

// Dashboard
// const DashboardPage = lazy(() => import('../../pages/dashboard/DashboardPage'));

// Error Pages

const NotFoundPage = lazy(() => 
  import('../../pages/errors/NotFoundPage').then(module => ({ 
    default: module.NotFoundPage 
  }))
);

const PageLoader: React.FC = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">Loading page...</p>
    </div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes - Only accessible when NOT logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes - Only accessible when logged in */}
        <Route element={<PrivateRoute />}>
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        </Route>

        {/* Error Page - Accessible to everyone */}
        <Route path="/404" element={<NotFoundPage />} />

        {/* 
          Root Redirect - THIS IS THE KEY FIX
          When user visits "/", check if authenticated:
          - If yes → go to dashboard
          - If no → go to login (PublicRoute will handle this)
        */}
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />

        {/* Catch all unknown routes → 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};
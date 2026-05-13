import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

// ============================================
// Lazy Loaded Pages (Code Splitting)
// ============================================

// Auth Pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

// Dashboard
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));

// Patient Pages
const PatientListPage = lazy(() => import('@/pages/patients/PatientListPage'));
const PatientCreatePage = lazy(() => import('@/pages/patients/PatientCreatePage'));
const PatientDetailPage = lazy(() => import('@/pages/patients/PatientDetailPage'));

// Appointment Pages
const AppointmentListPage = lazy(() => import('@/pages/appointments/AppointmentListPage'));
const AppointmentCreatePage = lazy(() => import('@/pages/appointments/AppointmentCreatePage'));

// Error Pages (loaded eagerly as they're small and used frequently)
import NotFoundPage from '@/pages/errors/NotFoundPage';

// ============================================
// Loading Fallback
// ============================================
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

// ============================================
// Main Router Component
// ============================================
export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ==================== Public Routes ==================== */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.PUBLIC.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.PUBLIC.REGISTER} element={<RegisterPage />} />
        </Route>

        {/* ==================== Protected Routes ==================== */}
        <Route element={<PrivateRoute />}>
          {/* Dashboard */}
          <Route path={ROUTES.PROTECTED.DASHBOARD} element={<DashboardPage />} />

          {/* Patient Routes */}
          <Route path={ROUTES.PROTECTED.PATIENTS.LIST} element={<PatientListPage />} />
          <Route path={ROUTES.PROTECTED.PATIENTS.CREATE} element={<PatientCreatePage />} />
          <Route path={ROUTES.PROTECTED.PATIENTS.DETAIL} element={<PatientDetailPage />} />

          {/* Appointment Routes */}
          <Route path={ROUTES.PROTECTED.APPOINTMENTS.LIST} element={<AppointmentListPage />} />
          <Route path={ROUTES.PROTECTED.APPOINTMENTS.CREATE} element={<AppointmentCreatePage />} />
        </Route>

        {/* ==================== Error Routes ==================== */}
        <Route path={ROUTES.ERRORS.NOT_FOUND} element={<NotFoundPage />} />

        {/* ==================== Default Redirects ==================== */}
        <Route path="/" element={<Navigate to={ROUTES.PROTECTED.DASHBOARD} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.ERRORS.NOT_FOUND} replace />} />
      </Routes>
    </Suspense>
  );
};
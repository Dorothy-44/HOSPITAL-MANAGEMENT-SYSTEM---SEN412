/**
 * Centralized route constants
 * Using nested objects for better organization
 */
export const ROUTES = {
  // Public routes (no auth required)
  PUBLIC: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password/:token',
  },

  // Protected routes (auth required)
  PROTECTED: {
    // Dashboard
    DASHBOARD: '/dashboard',

    // Patient Management
    PATIENTS: {
      LIST: '/patients',
      CREATE: '/patients/new',
      DETAIL: '/patients/:id',
      EDIT: '/patients/:id/edit',
      MEDICAL_HISTORY: '/patients/:id/medical-history',
    },

    // Appointment Management
    APPOINTMENTS: {
      LIST: '/appointments',
      CALENDAR: '/appointments/calendar',
      CREATE: '/appointments/new',
      DETAIL: '/appointments/:id',
      EDIT: '/appointments/:id/edit',
    },

    // Doctor Management
    DOCTORS: {
      LIST: '/doctors',
      CREATE: '/doctors/new',
      DETAIL: '/doctors/:id',
      EDIT: '/doctors/:id/edit',
      SCHEDULE: '/doctors/:id/schedule',
    },

    // Pharmacy
    PHARMACY: {
      DASHBOARD: '/pharmacy',
      PRESCRIPTIONS: '/pharmacy/prescriptions',
      CREATE_PRESCRIPTION: '/pharmacy/prescriptions/new',
      INVENTORY: '/pharmacy/inventory',
    },

    // Billing
    BILLING: {
      DASHBOARD: '/billing',
      INVOICES: '/billing/invoices',
      CREATE_INVOICE: '/billing/invoices/new',
      DETAIL: '/billing/invoices/:id',
      PAYMENTS: '/billing/payments',
    },

    // Reports
    REPORTS: {
      DASHBOARD: '/reports',
      FINANCIAL: '/reports/financial',
      PATIENT_STATS: '/reports/patient-statistics',
      OPERATIONAL: '/reports/operational',
    },

    // Staff Management
    STAFF: {
      LIST: '/staff',
      CREATE: '/staff/new',
      DETAIL: '/staff/:id',
      ATTENDANCE: '/staff/attendance',
    },

    // Settings
    SETTINGS: {
      PROFILE: '/settings/profile',
      SYSTEM: '/settings/system',
      SECURITY: '/settings/security',
    },
  },

  // Error routes
  ERRORS: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/401',
    FORBIDDEN: '/403',
    SERVER_ERROR: '/500',
  },
} as const;

/**
 * Helper to build dynamic routes with parameters
 * @example buildRoute(ROUTES.PROTECTED.PATIENTS.DETAIL, { id: '123' })
 */
export const buildRoute = (
  route: string,
  params: Record<string, string | number>
): string => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, String(value));
  });
  return path;
};
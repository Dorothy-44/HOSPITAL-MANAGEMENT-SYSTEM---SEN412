import React from 'react';
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from './RouterProvider';
import { ThemeProvider } from './ThemeProvider';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/index.scss';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Root provider that wraps the entire application
 * Order matters: Outer providers are less likely to change
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <RouterProvider>
      <ThemeProvider>
        {children}
        
        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          limit={3}
        />
      </ThemeProvider>
    </RouterProvider>
  );
};
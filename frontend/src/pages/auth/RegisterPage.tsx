import React from 'react';
import { AuthLayout } from './components/AuthLayout';
import { RegisterForm } from './components/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join our healthcare team today"
    >
      <RegisterForm />
    </AuthLayout>
  );
};


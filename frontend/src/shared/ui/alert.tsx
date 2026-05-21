import React from 'react';
import { Alert as BsAlert } from 'react-bootstrap';

interface AlertProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'destructive';
  message?: string;
  onClose?: () => void;
  dismissible?: boolean;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'danger',
  message,
  onClose,
  dismissible = !!onClose,
  className = '',
}) => {
  const bsVariant = variant === 'destructive' ? 'danger' : variant;
  
  return (
    <BsAlert
      variant={bsVariant}
      dismissible={dismissible}
      onClose={onClose}
      className={className}
    >
      {message || children}
    </BsAlert>
  );
};
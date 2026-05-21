import React from 'react';
import { Button as BsButton, Spinner } from 'react-bootstrap';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info';
  isLoading?: boolean;
  loadingText?: string;
  size?: 'sm' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText = 'Loading...',
  size,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <BsButton
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      className={className}
      {...props as any}
    >
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
          {loadingText}
        </>
      ) : (
        children
      )}
    </BsButton>
  );
};
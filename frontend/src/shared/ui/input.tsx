import React from 'react';
import { Form } from 'react-bootstrap';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, size, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const { value, ...restProps } = props as any;

    return (
      <Form.Group className="mb-3">
        {label && <Form.Label htmlFor={inputId}>{label}</Form.Label>}
        <Form.Control
          ref={ref}
          id={inputId}
          className={`${className} ${error ? 'is-invalid' : ''}`}
          value={value}
          {...restProps}
        />
        {error && (
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }
);

Input.displayName = 'Input';
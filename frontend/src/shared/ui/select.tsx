import React from 'react';
import { Form } from 'react-bootstrap';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className = '', id, size, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <Form.Group className="mb-3">
        {label && <Form.Label htmlFor={selectId}>{label}</Form.Label>}
        <Form.Select
          ref={ref}
          id={selectId}
          className={`${className} ${error ? 'is-invalid' : ''}`}
          {...props}
        >
          {children || options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
        {error && (
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }
);

Select.displayName = 'Select';
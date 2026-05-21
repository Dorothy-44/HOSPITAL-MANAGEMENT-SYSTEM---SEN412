import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Building2, Briefcase, Mail, Lock, User } from "lucide-react";
import { Alert } from "@/shared/ui";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["doctor", "nurse", "admin", "receptionist"]).refine(
      (val) => val !== undefined,
      { message: "Please select a role" }
    ),
    department: z.string().min(1, "Please select a department"),
    employeeId: z.string().min(1, "Employee ID is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const departments = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Emergency",
  "Radiology",
  "Pharmacy",
  "Administration",
  "Oncology",
  "Surgery",
];

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      console.log("Register:", data);
      // TODO: Add your API call here
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-3" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Name Fields */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold text-secondary small">
            First Name
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <User size={16} className="text-muted" />
            </span>
            <input
              {...register("firstName")}
              type="text"
              className={`form-control border-start-0 ${errors.firstName ? 'is-invalid' : ''}`}
              placeholder="John"
            />
            {errors.firstName && (
              <div className="invalid-feedback">{errors.firstName.message}</div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold text-secondary small">
            Last Name
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <User size={16} className="text-muted" />
            </span>
            <input
              {...register("lastName")}
              type="text"
              className={`form-control border-start-0 ${errors.lastName ? 'is-invalid' : ''}`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName.message}</div>
            )}
          </div>
        </div>
      </div>

      {/* Email Field */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary small">
          Email Address
        </label>
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Mail size={16} className="text-muted" />
          </span>
          <input
            {...register("email")}
            type="email"
            className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
            placeholder="john.doe@hospital.com"
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>
      </div>

      {/* Employee ID & Role */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold text-secondary small">
            Employee ID
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Briefcase size={16} className="text-muted" />
            </span>
            <input
              {...register("employeeId")}
              type="text"
              className={`form-control border-start-0 ${errors.employeeId ? 'is-invalid' : ''}`}
              placeholder="EMP-12345"
            />
            {errors.employeeId && (
              <div className="invalid-feedback">{errors.employeeId.message}</div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold text-secondary small">
            Role
          </label>
          <select
            {...register("role")}
            className={`form-select ${errors.role ? 'is-invalid' : ''}`}
            defaultValue=""
          >
            <option value="" disabled>
              Select your role
            </option>
            <option value="doctor">👨‍⚕️ Doctor</option>
            <option value="nurse">👩‍⚕️ Nurse</option>
            <option value="admin">👨‍💼 Administrator</option>
            <option value="receptionist">👩‍💼 Receptionist</option>
          </select>
          {errors.role && (
            <div className="invalid-feedback">{errors.role.message}</div>
          )}
        </div>
      </div>

      {/* Department */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary small">
          Department
        </label>
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Building2 size={16} className="text-muted" />
          </span>
          <select
            {...register("department")}
            className={`form-select border-start-0 ${errors.department ? 'is-invalid' : ''}`}
            defaultValue=""
          >
            <option value="" disabled>
              Select your department
            </option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <div className="invalid-feedback">{errors.department.message}</div>
          )}
        </div>
      </div>

      {/* Password */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary small">
          Password
        </label>
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Lock size={16} className="text-muted" />
          </span>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            className={`form-control border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
          />
          <span
            className="input-group-text bg-white border-start-0 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            role="button"
          >
            {showPassword ? (
              <EyeOff size={16} className="text-muted" />
            ) : (
              <Eye size={16} className="text-muted" />
            )}
          </span>
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>
        {/* Password Requirements */}
        <div className="mt-2">
          <small className="text-muted">Password must contain:</small>
          <div className="d-flex gap-3 mt-1">
            <small className="text-muted">✓ 8+ characters</small>
            <small className="text-muted">✓ 1 uppercase</small>
            <small className="text-muted">✓ 1 number</small>
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <label className="form-label fw-semibold text-secondary small">
          Confirm Password
        </label>
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Lock size={16} className="text-muted" />
          </span>
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            className={`form-control border-start-0 border-end-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
            placeholder="Re-enter your password"
          />
          <span
            className="input-group-text bg-white border-start-0 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            role="button"
          >
            {showConfirmPassword ? (
              <EyeOff size={16} className="text-muted" />
            ) : (
              <Eye size={16} className="text-muted" />
            )}
          </span>
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword.message}</div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary btn-lg w-100 mb-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
        disabled={isSubmitting}
        style={{
          borderRadius: '0.5rem',
          padding: '0.75rem',
          transition: 'all 0.3s ease',
        }}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm" role="status" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <UserPlus size={20} />
            <span>Create Account</span>
          </>
        )}
      </button>

      {/* Terms & Login Link */}
      <p className="text-center text-muted small mb-0">
        By registering, you agree to our{' '}
        <a href="#" className="text-decoration-none" style={{ color: '#1a73e8' }}>
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-decoration-none" style={{ color: '#1a73e8' }}>
          Privacy Policy
        </a>
      </p>
      <p className="text-center text-muted mt-2">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-decoration-none fw-semibold"
          style={{ color: '#1a73e8' }}
        >
          Sign In
        </Link>
      </p>
    </form>
  );
};
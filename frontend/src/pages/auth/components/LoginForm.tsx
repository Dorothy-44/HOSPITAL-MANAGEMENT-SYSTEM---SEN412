import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import { useAuthStore } from "@/app/store";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Error Alert */}
      {error && (
        <div 
          className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4 animate__animated animate__shakeX"
          role="alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          <span>{error}</span>
          <button 
            type="button" 
            className="btn-close ms-auto" 
            onClick={() => setError(null)}
          />
        </div>
      )}

      {/* Email Field */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">
          Email Address
        </label>
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-white border-end-0">
            <Mail size={18} className="text-muted" />
          </span>
          <input
            {...register("email")}
            type="email"
            className={`form-control border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
            placeholder="doctor@hospital.com"
            style={{ 
              borderRadius: '0 0.5rem 0.5rem 0',
            }}
          />
          {errors.email && (
            <div className="invalid-feedback">
              {errors.email.message}
            </div>
          )}
        </div>
      </div>

      {/* Password Field */}
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">
          Password
        </label>
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-white border-end-0">
            <Lock size={18} className="text-muted" />
          </span>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            className={`form-control border-start-0 border-end-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
            placeholder="••••••••"
          />
          <span 
            className="input-group-text bg-white border-start-0 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            role="button"
            style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-muted" />
            ) : (
              <Eye size={18} className="text-muted" />
            )}
          </span>
          {errors.password && (
            <div className="invalid-feedback">
              {errors.password.message}
            </div>
          )}
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="form-check">
          <input
            {...register("rememberMe")}
            type="checkbox"
            className="form-check-input"
            id="rememberMe"
            style={{ cursor: 'pointer' }}
          />
          <label 
            className="form-check-label text-secondary" 
            htmlFor="rememberMe"
            style={{ cursor: 'pointer' }}
          >
            Remember me
          </label>
        </div>
        <Link
          to="/forgot-password"
          className="text-decoration-none small fw-semibold"
          style={{ color: '#1a73e8' }}
        >
          Forgot password?
        </Link>
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
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <LogIn size={20} />
            <span>Sign In</span>
          </>
        )}
      </button>

      {/* Register Link */}
      <p className="text-center text-muted mb-0">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-decoration-none fw-semibold"
          style={{ color: '#1a73e8' }}
        >
          Create Account
        </Link>
      </p>
    </form>
  );
};
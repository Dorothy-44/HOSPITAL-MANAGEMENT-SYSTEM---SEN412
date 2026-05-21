import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthLayout } from "./components/AuthLayout";
import { Button, Input } from "@/shared/ui";


const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // API call to send reset email
    console.log("Send reset email to:", data.email);
    setIsSubmitted(true);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="your@email.com"
  
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>

          <Link
            to="/auth/login"
            className="flex items-center justify-center text-sm text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </form>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Check Your Email
          </h3>
          <p className="text-gray-600 mb-6">
            We've sent password reset instructions to your email address.
          </p>
          <Link
            to="/auth/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Return to Login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

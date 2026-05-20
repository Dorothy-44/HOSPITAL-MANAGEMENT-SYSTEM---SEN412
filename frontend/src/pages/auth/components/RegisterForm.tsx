import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[0-9]/, "Must contain number"),
    confirmPassword: z.string(),
    role: z.enum(["doctor", "nurse", "admin", "receptionist"]),
    department: z.string().min(1, "Department is required"),
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
];

export const RegisterForm: React.FC = () => {
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
      // API call to register
      console.log("Register:", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            {...register("firstName")}
            placeholder="First Name"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <Input
            {...register("lastName")}
            placeholder="Last Name"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register("employeeId")}
          placeholder="Employee ID"
          className={errors.employeeId ? "border-red-500" : ""}
        />
      </div>

      <div>
        <Select
          {...register("role")}
          className={errors.role ? "border-red-500" : ""}
        >
          <option value="">Select Role</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="admin">Administrator</option>
          <option value="receptionist">Receptionist</option>
        </Select>
      </div>

      <div>
        <Select
          {...register("department")}
          className={errors.department ? "border-red-500" : ""}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <UserPlus className="w-5 h-5 mr-2" />
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};

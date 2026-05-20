import { AuthLayout } from "./components/AuthLayout";
import { LoginForm } from "./components/LoginForm";

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
};

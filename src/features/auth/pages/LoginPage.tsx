import { Link } from "react-router-dom";

import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <AuthCard
        title="Welcome back"
        description="Sign in to your task management workspace."
      >
        <LoginForm />

        <div className="mt-4 text-right">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>
    </main>
  );
}
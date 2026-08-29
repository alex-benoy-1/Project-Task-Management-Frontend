import { Link } from "react-router-dom";

import { AuthCard } from "../components/AuthCard";
import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <AuthCard
        title="Create your account"
        description="Get started with your task management workspace."
      >
        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </main>
  );
}
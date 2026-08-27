import { Link } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm.tsx";

export function RegisterPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-mid rounded-lg bg-white p-8 shadow">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">Create user account</h1>
                </div>

                <RegisterForm />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Login {" "}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </main>
    );
}
import { Link } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm.tsx";

export function RegisterPage() {
    return (
        <main>
            <div>
                <h1>Create user account</h1>

                <RegisterForm />

                <p>
                    Login {" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </main>
    );
}
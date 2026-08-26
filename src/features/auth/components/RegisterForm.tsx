import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {
    registerSchema,
    type RegisterFormData,
} from "../validation/authSchemas.ts";

import { registerUser } from "../api/authApi.ts";

export function RegisterForm() {
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);

        try {
            await registerUser({
                fName: data.fName,
                lName: data.lName,
                email: data.email,
                password: data.password,
            });

            console.log("Registration successful");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Status:", error.response?.status);
                console.error("Backend response:", error.response?.data);
                console.error("Headers:", error.response?.headers);

                setServerError(
                    error.response?.data?.message ?? "User registration failed"
                );
            } else {
                console.error("Unexpected error:", error);
                setServerError("Something went wrong");
            }
        }
    };

    return (
        <form onSubmit={ handleSubmit(onSubmit) }>
            <div>
                <label htmlFor="fName">First name</label>
                <input
                    id="fName"
                    type="text"
                    {...register("fName")}
                />
                { errors.fName && (
                    <p>{ errors.fName.message }</p>
                )}
            </div>

            <div>
                <label htmlFor="lName">Last name</label>
                <input
                    id="lName"
                    type="text"
                    {...register("lName")}
                />
                { errors.lName && (
                    <p>{ errors.lName.message }</p>
                )}
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                />
                { errors.email && (
                    <p>{ errors.email.message }</p>
                )}
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    {...register("password")}
                />
                { errors.password && (
                    <p>{ errors.password.message }</p>
                )}
            </div>

            <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                />
                { errors.confirmPassword && (
                    <p>{ errors.confirmPassword.message }</p>
                )}
            </div>

            { serverError && <p>{ serverError }</p>}

            <button type="submit" disabled={isSubmitting}>
                { isSubmitting ? "Creating account ..." : "Create account" }
            </button>
        </form>
    )
}
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
        <form onSubmit={ handleSubmit(onSubmit) } className="space-y-5">
            <div>
                <label htmlFor="fName" className="mb-1 block text-sm font-medium">First name</label>
                <input
                    id="fName"
                    type="text"
                    {...register("fName")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                />
                { errors.fName && (
                    <p className="mt-1 text-sm text-red-600">{ errors.fName.message }</p>
                )}
            </div>

            <div>
                <label htmlFor="lName" className="mb-1 block text-sm font-medium">Last name</label>
                <input
                    id="lName"
                    type="text"
                    {...register("lName")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                />
                { errors.lName && (
                    <p className="mt-1 text-sm text-red-600">{ errors.lName.message }</p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                />
                { errors.email && (
                    <p className="mt-1 text-sm text-red-600">{ errors.email.message }</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
                <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                />
                { errors.password && (
                    <p className="mt-1 text-sm text-red-600">{ errors.password.message }</p>
                )}
            </div>

            <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                />
                { errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{ errors.confirmPassword.message }</p>
                )}
            </div>

            { serverError && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{ serverError }</p>}

            <button type="submit" disabled={isSubmitting}
                className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                { isSubmitting ? "Creating account ..." : "Create account" }
            </button>
        </form>
    )
}
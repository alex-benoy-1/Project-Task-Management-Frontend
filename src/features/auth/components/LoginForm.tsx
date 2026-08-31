import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, FormField, Input } from "../../../components/ui";

import { loginUser } from "../api/authApi";

import {
  loginSchema,
  type LoginFormData,
} from "../validation/authSchemas";

export function LoginForm() {
  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    try {
      const response = await loginUser(data);

      console.log("User:", response.user);
      console.log("Token:", response.token);

      // Authentication handling will go here.
    } catch (error) {
      console.error(error);

      setServerError(
        "Invalid email or password.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <FormField
        label="Email"
        htmlFor="email"
        error={errors.email?.message}
        required
      >
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          {...register("email")}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
        required
      >
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
        />
      </FormField>

      {serverError && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">
            {serverError}
          </p>
        </div>
      )}

      <Button
        type="submit"
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Signing in..."
          : "Sign in"}
      </Button>
    </form>
  );
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input, FormField } from "../../../components/ui";

import {
  registerSchema,
  type RegisterFormData,
} from "../validation/authSchemas";

import { registerUser } from "../api/authApi";

export function RegisterForm() {
  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (
    data: RegisterFormData,
  ) => {
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
      console.error(error);

      setServerError(
        "Unable to create your account. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <FormField
        label="First Name"
        htmlFor="fName"
        error={errors.fName?.message}
        required
      >
        <Input
          id="fName"
          type="text"
          placeholder="John Doe"
          autoComplete="First name"
          {...register("fName")}
        />
      </FormField>

      <FormField
        label="Last Name"
        htmlFor="lName"
        error={errors.lName?.message}
        required
      >
        <Input
          id="lName"
          type="text"
          placeholder="John Doe"
          autoComplete="Last name"
          {...register("lName")}
        />
      </FormField>

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
          autoComplete="new-password"
          {...register("password")}
        />
      </FormField>

      <FormField
        label="Confirm password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
        required
      >
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("confirmPassword")}
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
          ? "Creating account..."
          : "Create account"}
      </Button>
    </form>
  );
}
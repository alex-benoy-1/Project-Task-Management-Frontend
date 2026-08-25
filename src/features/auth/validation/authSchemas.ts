import { strictObject, z } from "zod";

export const registerSchema = z.object ({
    fName: z
        .string()
        .min(2, "First name must be atleast two characters")
        .max(50, "First name can't be longer than 50 characters"),
    lName: z
        .string()
        .min(2, "Last name must be atleast two characters")
        .max(50, "Last name can't be longer than 50 characters"),
    email: z
        .email("Enter a valid email address"),

    password: z
        .string()
        .min(8, "Passsword must be at least 8 characters long")
        .regex(/[A-Z]/, "Must contain uppercase")
        .regex(/[a-z]/, "Must contain lowercase")
        .regex(/[0-9]/, "Must contain number"),
    confirmPassword: z
        .string()
        .min(8, "Passsword must be at least 8 characters long")
        .regex(/[A-Z]/, "Must contain uppercase")
        .regex(/[a-z]/, "Must contain lowercase")
        .regex(/[0-9]/, "Must contain number")
})
.refine((data) => data.password === data.confirmPassword,  {
    error: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
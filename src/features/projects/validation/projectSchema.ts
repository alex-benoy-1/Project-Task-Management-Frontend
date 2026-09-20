import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(
      100,
      "Project name must be 100 characters or less",
    ),

  description: z
    .string()
    .max(
      500,
      "Description must be 500 characters or less",
    ),
});

export type ProjectFormData =
  z.infer<typeof projectSchema>;
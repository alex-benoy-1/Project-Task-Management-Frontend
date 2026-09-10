import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  FormField,
  Input,
} from "../../../components/ui";

const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(
      100,
      "Project name must be less than 100 characters",
    ),

  description: z
    .string()
    .max(
      500,
      "Description must be less than 500 characters",
    ),
});

type ProjectFormData = z.infer<
  typeof createProjectSchema
>;

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ProjectForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(createProjectSchema),

    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <FormField
        label="Project name"
        htmlFor="project-name"
        required
        error={errors.name?.message}
      >
        <Input
          id="project-name"
          type="text"
          placeholder="Enter project name"
          {...register("name")}
          error={errors.name?.message}
          disabled={isSubmitting}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="project-description"
        error={errors.description?.message}
      >
        <textarea
          id="project-description"
          placeholder="Enter project description"
          {...register("description")}
          disabled={isSubmitting}
          rows={4}
          className={`
            w-full rounded-md border
            border-gray-300
            px-3 py-2
            text-sm
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
            disabled:cursor-not-allowed
            disabled:bg-gray-100
            ${
              errors.description
                ? "border-red-500"
                : ""
            }
          `}
        />
      </FormField>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating..."
            : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
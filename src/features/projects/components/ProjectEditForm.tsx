import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  FormField,
  Input,
} from "../../../components/ui";

import {
  projectSchema,
  type ProjectFormData,
} from "../validation/projectSchema";

interface ProjectEditFormProps {
  defaultValues: ProjectFormData;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProjectEditForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProjectEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormField
        label="Project name"
        htmlFor="name"
        error={errors.name?.message}
        required
      >
        <Input
          id="name"
          type="text"
          placeholder="Enter project name"
          disabled={isSubmitting}
          {...register("name")}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
      >
        <textarea
          id="description"
          rows={5}
          placeholder="Enter project description"
          disabled={isSubmitting}
          {...register("description")}
          className={`
            w-full
            rounded-md
            border
            border-gray-300
            px-3
            py-2
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
            ? "Saving..."
            : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  FormField,
  Input,
} from "../../../components/ui";

import { createOrganization } from "../api/organizationApi";

const MAX_NAME_LENGTH = 100;

export function CreateOrganizationPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Organization name is required.");
      return;
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      setError(
        `Organization name must be ${MAX_NAME_LENGTH} characters or fewer.`,
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await createOrganization({
        name: trimmedName,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to create organization:", error);

      setError(
        "Failed to create organization. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      navigate("/");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Back to organizations
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-xl px-6 py-12">
        <Card className="p-8">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Create organization
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Create a workspace to organize your projects,
              collaborate with members, and manage tasks.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <FormField
              label="Organization name"
              htmlFor="organization-name"
              required
              error={error ?? undefined}
            >
              <Input
                id="organization-name"
                name="name"
                type="text"
                value={name}
                onChange={(event) =>
                  handleNameChange(event.target.value)
                }
                placeholder="e.g. Acme Workspace"
                autoFocus
                autoComplete="organization"
                maxLength={MAX_NAME_LENGTH}
                disabled={isSubmitting}
                required
              />
            </FormField>

            <p className="-mt-4 text-right text-xs text-gray-500">
              {name.length}/{MAX_NAME_LENGTH} characters
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !name.trim()}
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create organization"}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </main>
  );
}
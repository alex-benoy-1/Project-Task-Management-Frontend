import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  Breadcrumbs,
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
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

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

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Failed to create organization:",
        error,
      );

      setError(
        "Failed to create organization. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) {
      return;
    }

    navigate("/");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
            className="text-xl font-bold text-gray-900 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Project Manager
          </button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              {
                label: "Home",
                href: "/",
              },
              {
                label: "Organizations",
                href: "/",
              },
              {
                label: "Create",
              },
            ]}
          />
        </div>

        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Workspace setup
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Create organization
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Create a workspace to organize your projects,
            collaborate with members, and manage tasks.
          </p>
        </div>

        {/* Form card */}
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Organization details
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Choose a clear name that your team will
              recognize.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <span className="text-xs font-bold text-red-600">
                    !
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-red-800">
                    Unable to create organization
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
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
                    handleNameChange(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Acme Workspace"
                  autoFocus
                  autoComplete="organization"
                  maxLength={MAX_NAME_LENGTH}
                  disabled={isSubmitting}
                  required
                />
              </FormField>

              {/* Character count */}
              <div className="mt-2 flex justify-end">
                <span className="text-xs text-gray-500">
                  {name.length}/{MAX_NAME_LENGTH}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
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
                disabled={
                  isSubmitting || !name.trim()
                }
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create organization"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Back link */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Back to organizations
          </button>
        </div>
      </section>
    </main>
  );
}
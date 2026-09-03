import { useState } from "react";
import type { FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import { createOrganization } from "../api/organizationApi";

export function CreateOrganizationPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Organization name is required.");
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
        error
      );

      setError(
        "Failed to create organization. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            ← Back to organizations
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-xl px-6 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Create organization
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create an organization to start managing your
              projects and tasks.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Organization name */}
            <div>
              <label
                htmlFor="organization-name"
                className="block text-sm font-medium text-gray-700"
              >
                Organization name
              </label>

              <input
                id="organization-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="New Company"
                autoFocus
                disabled={isSubmitting}
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !name.trim()
                }
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create organization"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
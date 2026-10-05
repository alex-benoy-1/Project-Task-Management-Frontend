import { useCallback, useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Breadcrumbs,
  Button,
  Card,
} from "../../../components/ui";

import {
  getProject,
  updateProject,
} from "../api/projectApi";

import { ProjectEditForm } from "../components/ProjectEditForm";

import type { Project } from "../types/project.types";
import type { ProjectFormData } from "../validation/projectSchema";

interface LocationState {
  organizationRole?: string;
  organizationName?: string;
}

export function ProjectEditPage() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const navigate = useNavigate();
  const location = useLocation();

  const locationState =
    location.state as LocationState | null;

  const [project, setProject] =
    useState<Project | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  /*
   * Logout
   */
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login", {
      replace: true,
    });
  };

  /*
   * Load project
   */
  const loadProject = useCallback(async () => {
    if (!projectId) {
      setError("Project ID is missing.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getProject(projectId);

      setProject(response);
    } catch (error) {
      console.error(
        "Failed to load project:",
        error,
      );

      setError(
        "Failed to load project. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  /*
   * Navigate back to projects
   *
   * We use the organization_id from the
   * project returned by the backend.
   */
  const navigateToProjects = useCallback(
    (organizationId: string) => {
      navigate(
        `/organizations/${organizationId}/projects`,
        {
          state: {
            organizationRole:
              locationState?.organizationRole,

            organizationName:
              locationState?.organizationName,
          },
        },
      );
    },
    [navigate, locationState],
  );

  /*
   * Update project
   */
  const handleSubmit = async (
    data: ProjectFormData,
  ) => {
    if (!projectId) {
      setSubmitError("Project ID is missing.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const updatedProject = await updateProject(
        projectId,
        {
          name: data.name.trim(),
          description: data.description.trim(),
        },
      );

      setProject(updatedProject);

      navigateToProjects(
        updatedProject.organization_id,
      );
    } catch (error) {
      console.error(
        "Failed to update project:",
        error,
      );

      setSubmitError(
        "Failed to update project. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * Cancel editing
   */
  const handleCancel = () => {
    if (isSubmitting) {
      return;
    }

    if (project) {
      navigateToProjects(
        project.organization_id,
      );

      return;
    }

    navigate(-1);
  };

  /*
   * Loading state
   */
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-xl font-bold text-gray-900 transition hover:text-gray-700"
            >
              Project Manager
            </button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-6 py-12">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                {
                  label: "Home",
                  href: "/",
                },
                {
                  label: "Projects",
                },
                {
                  label: "Edit",
                },
              ]}
            />
          </div>

          <Card>
            <div
              className="flex min-h-[280px] items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                <p className="text-sm font-medium text-gray-700">
                  Loading project...
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Please wait while we load the project details.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  /*
   * Error state
   */
  if (error || !project) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-xl font-bold text-gray-900 transition hover:text-gray-700"
            >
              Project Manager
            </button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </header>

        <section className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                {
                  label: "Home",
                  href: "/",
                },
                {
                  label: "Project",
                },
              ]}
            />
          </div>

          <Card>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span
                  className="text-xl font-bold text-red-600"
                  aria-hidden="true"
                >
                  !
                </span>
              </div>

              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Unable to load project
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
                {error ??
                  "The requested project could not be found."}
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={() => void loadProject()}
                >
                  Try again
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                >
                  Go back
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  /*
   * Main page
   */
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-xl font-bold text-gray-900 transition hover:text-gray-700"
          >
            Project Manager
          </button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleLogout}
            disabled={isSubmitting}
          >
            Logout
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
                label:
                  locationState?.organizationName ??
                  "Projects",
                href: `/organizations/${project.organization_id}/projects`,
              },
              {
                label: project.name,
              },
              {
                label: "Edit",
              },
            ]}
          />
        </div>

        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Project settings
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Edit project
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Update the name and description of your project.
          </p>
        </div>

        {/* Project context */}
        <Card className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Current project
              </p>

              <h2 className="mt-1 truncate text-lg font-semibold text-gray-900">
                {project.name}
              </h2>

              {project.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {project.description}
                </p>
              )}
            </div>

            <div className="shrink-0">
              <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                {project.role}
              </span>
            </div>
          </div>
        </Card>

        {/* Edit form */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Project details
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Make your changes below. Your updates will be
              saved when you submit the form.
            </p>
          </div>

          {/* Submission error */}
          {submitError && (
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
                    Unable to save changes
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {submitError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <ProjectEditForm
            defaultValues={{
              name: project.name,
              description:
                project.description ?? "",
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </Card>

        {/* Back to projects */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Back to projects
          </button>
        </div>
      </section>
    </main>
  );
}
import { useEffect, useState } from "react";
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
  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!projectId) {
        setError("Project ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await getProject(projectId);

        if (isMounted) {
          setProject(response);
        }
      } catch (error) {
        console.error(
          "Failed to load project:",
          error,
        );

        if (isMounted) {
          setError(
            "Failed to load project. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  /*
   * Navigate to projects
   */
  const navigateToProjects = (
    organizationId: string,
  ) => {
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
  };

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
    } else {
      navigate(-1);
    }
  };

  /*
   * Loading state
   */
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900">
              Project Manager
            </h1>

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
          <div
            className="flex min-h-[300px] items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-gray-500">
              Loading project...
            </p>
          </div>
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
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900">
              Project Manager
            </h1>

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

          <Card>
            <h2 className="text-xl font-semibold text-gray-900">
              Unable to load project
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error ?? "Project could not be found."}
            </p>

            <div className="mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Go back
              </Button>
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
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Project Manager
          </h1>

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

        {/* Edit Project Card */}
        <Card>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit project
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Update your project name and description.
            </p>
          </div>

          {/* Submission Error */}
          {submitError && (
            <div
              className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3"
              role="alert"
            >
              <p className="text-sm text-red-600">
                {submitError}
              </p>
            </div>
          )}

          {/* Form */}
          <ProjectEditForm
            defaultValues={{
              name: project.name,
              description: project.description ?? "",
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </Card>

        {/* Back to Projects */}
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
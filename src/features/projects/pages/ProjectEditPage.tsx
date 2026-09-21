import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Breadcrumbs,
  Card,
} from "../../../components/ui";

import {
  getProject,
  updateProject,
} from "../api/projectApi";

import { ProjectEditForm } from "../components/ProjectEditForm";

import type { Project } from "../types/project.types";

import type { ProjectFormData } from "../validation/projectSchema";

export function ProjectEditPage() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const navigate = useNavigate();

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

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setError("Project ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response =
          await getProject(projectId);

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
    };

    loadProject();
  }, [projectId]);

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

      const updatedProject =
        await updateProject(projectId, {
          name: data.name,
          description: data.description,
        });

      setProject(updatedProject);

      navigate(
        `/organizations/${updatedProject.organization_id}/projects`,
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

  const handleCancel = () => {
    if (project) {
      navigate(
        `/organizations/${project.organization_id}/projects`,
      );
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-gray-500">
              Loading project...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl">
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
            <h1 className="text-xl font-semibold text-gray-900">
              Unable to load project
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error ??
                "Project could not be found."}
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-5 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Go back
            </button>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: "Projects",
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

        <Card>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Project
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Update the project name and description.
            </p>
          </div>

          {submitError && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {submitError}
              </p>
            </div>
          )}

          <ProjectEditForm
            defaultValues={{
              name: project.name,
              description: project.description,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </Card>
      </div>
    </main>
  );
}
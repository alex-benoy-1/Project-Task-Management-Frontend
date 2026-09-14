import { useEffect, useState } from "react";
import {
  useLocation,
  useParams,
} from "react-router-dom";

import { Button, Modal } from "../../../components/ui";

import {
  createProject,
  getOrganizationProjects,
} from "../api/projectApi";

import type { Project } from "../types/project.types";

import { ProjectCard } from "../components/ProjectCard";
import { ProjectForm } from "../components/ProjectForm";

interface LocationState {
  organizationRole?: string;
}

export function ProjectsPage() {
  const { orgId } =
    useParams<{ orgId: string }>();

  const location = useLocation();

  const locationState =
    location.state as LocationState | null;

  const organizationRole =
    locationState?.organizationRole;

  const [projects, setProjects] = useState<
    Project[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [isCreating, setIsCreating] =
    useState(false);

  const [createError, setCreateError] =
    useState("");

  /*
   * Backend:
   *
   * requireRole("admin", "manager")
   *
   * Only admin and manager should see
   * the Create Project button.
   */
  const canCreateProject =
    organizationRole === "admin" ||
    organizationRole === "manager";

  /*
   * Fetch projects
   */
  useEffect(() => {
    const fetchProjects = async () => {
      if (!orgId) {
        setError(
          "Organization ID is missing.",
        );

        setIsLoading(false);

        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response =
          await getOrganizationProjects(orgId);

        setProjects(response.projects);
      } catch (error) {
        console.error(
          "Failed to fetch projects:",
          error,
        );

        setError(
          "Failed to load projects. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [orgId]);

  /*
   * Create project
   */
  const handleCreateProject = async (data: {
    name: string;
    description: string;
  }) => {
    if (!orgId) {
      setCreateError(
        "Organization ID is missing.",
      );

      return;
    }

    try {
      setIsCreating(true);
      setCreateError("");

      const response = await createProject(
        orgId,
        data,
      );

      /*
       * The current backend create response is:
       *
       * {
       *   project: {
       *     id,
       *     organizations,
       *     name,
       *     description,
       *     role
       *   }
       * }
       *
       * Convert it to the Project shape
       * used by ProjectCard.
       */
      const newProject: Project = {
        projectid: response.project.id,

        organization_id:
          response.project.organizations,

        name: response.project.name,

        description:
          response.project.description,

        created_at:
          new Date().toISOString(),

        updated_at:
          new Date().toISOString(),

        user_id: "",

        role: response.project.role,

        joined:
          new Date().toISOString(),
      };

      setProjects(
        (currentProjects) => [
          ...currentProjects,
          newProject,
        ],
      );

      setShowCreateModal(false);
    } catch (error) {
      console.error(
        "Failed to create project:",
        error,
      );

      setCreateError(
        "Failed to create project. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  /*
   * Remove deleted project from the page
   */
  const handleProjectDelete = (
    projectId: string,
  ) => {
    setProjects(
      (currentProjects) =>
        currentProjects.filter(
          (project) =>
            project.projectid !== projectId,
        ),
    );
  };

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* =========================
          Page Header
      ========================== */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Projects
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Manage your organization's projects.
          </p>
        </div>

        {canCreateProject && (
          <Button
            type="button"
            onClick={() => {
              setCreateError("");
              setShowCreateModal(true);
            }}
          >
            + Create Project
          </Button>
        )}
      </div>

      {/* =========================
          Projects
      ========================== */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No projects yet
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            There are no projects in this
            organization yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.projectid}
              project={project}
              onDelete={handleProjectDelete}
            />
          ))}
        </div>
      )}

      {/* =========================
          Create Project Modal
      ========================== */}
      {showCreateModal && (
        <Modal
          title="Create Project"
          onClose={() => {
            if (!isCreating) {
              setShowCreateModal(false);
            }
          }}
        >
          {createError && (
            <div className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
              {createError}
            </div>
          )}

          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => {
              if (!isCreating) {
                setShowCreateModal(false);
              }
            }}
            isSubmitting={isCreating}
          />
        </Modal>
      )}
    </div>
  );
}
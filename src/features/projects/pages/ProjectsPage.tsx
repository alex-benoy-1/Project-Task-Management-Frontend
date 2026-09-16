import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Breadcrumbs,
  Button,
  Modal,
} from "../../../components/ui";

import {
  createProject,
  getOrganizationProjects,
} from "../api/projectApi";

import type { Project } from "../types/project.types";

import { ProjectCard } from "../components/ProjectCard";
import { ProjectForm } from "../components/ProjectForm";

interface LocationState {
  organizationRole?: string;
  organizationName?: string;
}

export function ProjectsPage() {
  const { orgId } = useParams<{ orgId: string }>();

  const location = useLocation();
  const navigate = useNavigate();

  const locationState =
    location.state as LocationState | null;

  const organizationRole =
    locationState?.organizationRole;

  const organizationName =
    locationState?.organizationName ?? "Organization";

  const [projects, setProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [isCreating, setIsCreating] = useState(false);

  const [createError, setCreateError] = useState("");

  const canCreateProject =
    organizationRole === "admin" ||
    organizationRole === "manager";

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
   * Fetch projects
   */
  useEffect(() => {
    const fetchProjects = async () => {
      if (!orgId) {
        setError("Organization ID is missing.");
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
          error
        );

        setError(
          "Failed to load projects. Please try again."
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
      setCreateError("Organization ID is missing.");
      return;
    }

    try {
      setIsCreating(true);
      setCreateError("");

      const response = await createProject(
        orgId,
        data
      );

      const newProject: Project = {
        projectid: response.project.id,

        organization_id:
          response.project.organizations,

        name: response.project.name,

        description:
          response.project.description,

        created_at: new Date().toISOString(),

        updated_at: new Date().toISOString(),

        user_id: "",

        role: response.project.role,

        joined: new Date().toISOString(),
      };

      setProjects((currentProjects) => [
        ...currentProjects,
        newProject,
      ]);

      setShowCreateModal(false);
    } catch (error) {
      console.error(
        "Failed to create project:",
        error
      );

      setCreateError(
        "Failed to create project. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  /*
   * Remove deleted project from page
   */
  const handleProjectDelete = (projectId: string) => {
    setProjects((currentProjects) =>
      currentProjects.filter(
        (project) =>
          project.projectid !== projectId
      )
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Project Manager
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Page Heading */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Projects
            </h2>

            <p className="mt-1 text-gray-600">
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

        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              {
                label: "Home",
                href: "/",
              },
              {
                label: organizationName,
              },
            ]}
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Loading projects...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading &&
          !error &&
          projects.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="font-semibold text-gray-900">
                No projects yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                There are no projects in this
                organization yet.
              </p>

              {canCreateProject && (
                <button
                  type="button"
                  onClick={() => {
                    setCreateError("");
                    setShowCreateModal(true);
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <span className="text-lg leading-none">
                    +
                  </span>

                  Create your first project
                </button>
              )}
            </div>
          )}

        {/* Projects */}
        {!isLoading &&
          !error &&
          projects.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.projectid}
                  project={project}
                  onDelete={handleProjectDelete}
                />
              ))}
            </div>
          )}
      </section>

      {/* Create Project Modal */}
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
    </main>
  );
}
import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  Link,
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

type SortOption = "recent" | "alphabetical";

export function ProjectsPage() {
  const { orgId } = useParams<{
    orgId: string;
  }>();

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

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const canCreateProject =
    organizationRole === "owner" ||
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
  const fetchProjects = async () => {
    if (!orgId) {
      setError("Organization ID is missing.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await getOrganizationProjects(orgId);

      setProjects(response.projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);

      setError("Failed to load projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchProjects();
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

      const response = await createProject(orgId, data);

      const now = new Date().toISOString();

      const newProject: Project = {
        projectid: response.project.id,
        organization_id: response.project.organizations,
        name: response.project.name,
        description: response.project.description,
        created_at: now,
        updated_at: now,
        user_id: "",
        role: response.project.role,
        joined: now,
      };

      setProjects((currentProjects) => [
        ...currentProjects,
        newProject,
      ]);

      setShowCreateModal(false);
      setSearchQuery("");
      setSortBy("recent");
    } catch (error) {
      console.error("Failed to create project:", error);

      setCreateError("Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  /*
   * Remove deleted project from the page
   */
  const handleProjectDelete = (projectId: string) => {
    setProjects((currentProjects) =>
      currentProjects.filter(
        (project) => project.projectid !== projectId,
      ),
    );
  };

  /*
   * Search and sort projects
   */
  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(query) ||
        (project.description ?? "").toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }

      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    });
  }, [projects, searchQuery, sortBy]);

  /*
   * Back to organizations
   */
  const handleBackToOrganizations = () => {
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900"
          >
            Project Manager
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              {
                label: "Home",
                href: "/",
              },
              {
                label: organizationName,
              },
              {
                label: "Projects",
              },
            ]}
          />
        </div>

        {/* Welcome section */}
        <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-medium text-blue-600">
              {organizationName}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Projects
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              Organize your team's work, track project progress,
              and keep tasks in one place.
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
              + Create project
            </Button>
          )}
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Total projects
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {isLoading ? "—" : projects.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Projects in this organization
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Your projects
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {isLoading
                ? "—"
                : projects.filter(
                    (project) => project.role === "owner",
                  ).length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Projects where your role is owner
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Other project memberships
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {isLoading
                ? "—"
                : projects.filter(
                    (project) => project.role !== "owner",
                  ).length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Projects where your role isn't owner
            </p>
          </div>
        </div>

        {/* Project list heading */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              All projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Search and open a project to manage its tasks.
            </p>
          </div>

          {!isLoading && !error && (
            <p className="text-sm text-gray-500">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1
                ? "project"
                : "projects"}
            </p>
          )}
        </div>

        {/* Search and sort */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label
              htmlFor="project-search"
              className="sr-only"
            >
              Search projects
            </label>

            <input
              id="project-search"
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search by project name or description..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="sm:w-52">
            <label
              htmlFor="project-sort"
              className="sr-only"
            >
              Sort projects
            </label>

            <select
              id="project-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="recent">Recently created</option>
              <option value="alphabetical">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            className="rounded-xl border border-gray-200 bg-white p-6"
            role="status"
          >
            <p className="text-sm text-gray-500">
              Loading projects...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 p-5"
            role="alert"
          >
            <h3 className="font-semibold text-red-800">
              Couldn't load projects
            </h3>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void fetchProjects()}
              className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200 transition hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty organization */}
        {!isLoading &&
          !error &&
          projects.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                +
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                No projects yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Create a project to start organizing work and
                managing tasks in this organization.
              </p>

              {canCreateProject && (
                <Button
                  type="button"
                  onClick={() => {
                    setCreateError("");
                    setShowCreateModal(true);
                  }}
                  className="mt-6"
                >
                  Create your first project
                </Button>
              )}
            </div>
          )}

        {/* No search results */}
        {!isLoading &&
          !error &&
          projects.length > 0 &&
          filteredProjects.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
              <h3 className="font-semibold text-gray-900">
                No matching projects
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another search term or clear your search.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          )}

        {/* Project cards */}
        {!isLoading &&
          !error &&
          filteredProjects.length > 0 && (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.projectid}
                  project={project}
                  onDelete={handleProjectDelete}
                />
              ))}
            </div>
          )}

        {/* Back to organizations */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleBackToOrganizations}
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            ← Back to organizations
          </button>
        </div>
      </section>

      {/* Create project modal */}
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
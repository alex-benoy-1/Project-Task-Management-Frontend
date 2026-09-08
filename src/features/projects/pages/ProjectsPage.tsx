import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getOrganizationProjects } from "../api/projectApi";
import { ProjectCard } from "../components/ProjectCard";
import type { Project } from "../types/project.types";

export function ProjectsPage() {
  const { orgId } = useParams<{
    orgId: string;
  }>();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) {
      setError("Organization not found.");
      setLoading(false);
      return;
    }

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getOrganizationProjects(orgId);

        console.log(
          "Projects:",
          response.projects,
        );

        setProjects(response.projects);
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error,
        );

        setError("Unable to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [orgId]);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Organizations
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Projects
          </h1>

          <p className="mt-2 text-gray-600">
            Projects in this organization.
          </p>
        </div>

        {loading && (
          <p className="text-gray-500">
            Loading projects...
          </p>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h2 className="font-semibold text-gray-900">
                No projects yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                This organization doesn't have
                any projects yet.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.projectid}
                  project={project}
                />
              ))}
            </div>
          )}
      </section>
    </main>
  );
}
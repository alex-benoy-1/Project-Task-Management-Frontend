import type { Project } from "../types/project.types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {project.name}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {project.description}
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
          {project.role}
        </span>
      </div>

      <div className="mt-5 border-t pt-4">
        <p className="text-xs text-gray-500">
          Created:{" "}
          {new Date(
            project.created_at,
          ).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
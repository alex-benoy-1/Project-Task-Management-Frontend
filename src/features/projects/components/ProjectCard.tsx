import type { Project } from "../types/project.types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-900">
        {project.name}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {project.slug}
      </p>

      {project.description && (
        <p className="mt-4 text-sm text-gray-600">
          {project.description}
        </p>
      )}
    </div>
  );
}
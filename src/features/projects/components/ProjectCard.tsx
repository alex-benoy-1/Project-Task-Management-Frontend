import { useState } from "react";
import type { Project } from "../types/project.types";
import { deleteProject } from "../api/projectApi";

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({
  project,
  onDelete,
}: ProjectCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canShowOptions =
    project.role === "owner" ||
    project.role === "admin" ||
    project.role === "manager";

  const canDelete = project.role === "owner";

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteProject(project.projectid);

      onDelete(project.projectid);
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
      setShowOptions(false);
    }
  };

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {project.name}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {project.description}
          </p>
        </div>

        {canShowOptions && (
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowOptions((previous) => !previous)
              }
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Project options"
            >
              ⋮
            </button>

            {showOptions && (
              <div className="absolute right-0 z-10 mt-2 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                {canDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 border-t pt-4">
        <p className="text-xs text-gray-500">
          Created:{" "}
          {new Date(project.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
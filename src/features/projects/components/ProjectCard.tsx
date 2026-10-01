import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [showOptions, setShowOptions] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const canShowOptions =
    project.role === "owner" ||
    project.role === "admin" ||
    project.role === "manager";

  const canEdit =
    project.role === "owner";

  const canDelete =
    project.role === "owner";

  const handleEdit = () => {
    setShowOptions(false);

    navigate(
      `/projects/${project.projectid}/edit`,
    );
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteProject(
        project.projectid,
      );

      onDelete(project.projectid);
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error,
      );

      window.alert(
        "Failed to delete project. Please try again.",
      );
    } finally {
      setIsDeleting(false);
      setShowOptions(false);
    }
  };

  return (
    <div className="relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-gray-900">
            {project.name}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
            {project.description ||
              "No description provided."}
          </p>
        </div>

        {/* Options */}
        {canShowOptions && (
          <div className="relative shrink-0">

            <button
              type="button"
              onClick={() =>
                setShowOptions(
                  (previous) => !previous,
                )
              }
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Project options"
              aria-expanded={showOptions}
            >
              ⋮
            </button>

            {showOptions && (
              <div className="absolute right-0 z-10 mt-2 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">

                {canEdit && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                )}

                {canDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}

              </div>
            )}

          </div>
        )}

      </div>

      {/* Role */}
      <div className="mt-4">
        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
          {project.role}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6">

        <div className="border-t pt-4">

          <Link
            to={`/projects/${project.projectid}/tasks`}
            className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            View tasks
            <span className="ml-1">
              →
            </span>
          </Link>

          <p className="mt-3 text-xs text-gray-500">
            Created{" "}
            {new Date(
              project.created_at,
            ).toLocaleDateString()}
          </p>

        </div>

      </div>

    </div>
  );
}
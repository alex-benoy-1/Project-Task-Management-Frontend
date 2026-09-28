import { useState } from "react";
import type { Task } from "../types/task.types";

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({
  task,
  onDelete,
}: TaskCardProps) {
  const [showOptions, setShowOptions] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await onDelete(task.id);
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error,
      );
    } finally {
      setIsDeleting(false);
      setShowOptions(false);
    }
  };

  const priorityStyles = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  };

  const statusStyles = {
    todo: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  const priorityStyle =
    priorityStyles[task.priority];

  const statusStyle =
    statusStyles[task.status];

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {task.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm text-gray-600">
            {task.description ||
              "No description provided."}
          </p>
        </div>

        {/* Options */}
        {onDelete && (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() =>
                setShowOptions(
                  (previous) => !previous,
                )
              }
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Task options"
              aria-expanded={showOptions}
            >
              ⋮
            </button>

            {showOptions && (
              <div className="absolute right-0 z-10 mt-2 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
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
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status + Priority */}
      <div className="mt-5 flex items-center gap-3">

        {/* Status */}
        <span
          className={`
            inline-flex
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            capitalize
            ${statusStyle}
          `}
        >
          {task.status.replace(/_/g, " ")}
        </span>

        {/* Priority */}
        <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize text-gray-600">
          <span
            className={`
              h-2.5
              w-2.5
              rounded-full
              ${ 
                task.priority === "low"
                  ? "bg-green-500"
                  : task.priority === "medium"
                    ? "bg-yellow-500"
                    : task.priority === "high"
                      ? "bg-orange-500"
                      : "bg-red-500"
              }
            `}
          />

          {task.priority}
        </span>

      </div>

      {/* Due Date */}
      <div className="mt-5">
        <p className="text-xs text-gray-500">
          Due date
        </p>

        <p className="mt-1 text-sm font-medium text-gray-700">
          {new Date(
            task.due_date,
          ).toLocaleDateString()}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 border-t pt-4">
        <p className="text-xs text-gray-500">
          Created:{" "}
          {new Date(
            task.created_at,
          ).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
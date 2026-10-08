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

  /*
   * Mark complete - visual only
   */
  const handleMarkComplete = () => {
    setShowOptions(false);
  };

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

  /*
   * Status colours
   */
  const statusStyles = {
    todo: "bg-gray-100 text-gray-700",
    in_progress:
      "bg-blue-100 text-blue-700",
    completed:
      "bg-green-100 text-green-700",
  };

  /*
   * Priority dot colours
   */
  const priorityDotStyles = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };

  const statusStyle =
    statusStyles[task.status];

  const priorityDot =
    priorityDotStyles[task.priority];

  /*
   * Check whether the task is overdue.
   */
  const isOverdue =
    new Date(task.due_date) < new Date() &&
    task.status !== "completed";

  /*
   * Format due date.
   */
  const formattedDueDate =
    new Date(
      task.due_date,
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">

                {/* Mark complete */}
                {task.status !== "completed" && (
                  <button
                    type="button"
                    onClick={handleMarkComplete}
                    className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50"
                  >
                    ✓ Mark complete
                  </button>
                )}

                {/* Delete */}
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
          {task.status.replace(
            /_/g,
            " ",
          )}
        </span>

        {/* Priority */}
        <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize text-gray-600">

          <span
            className={`
              h-2.5
              w-2.5
              rounded-full
              ${priorityDot}
            `}
          />

          {task.priority}

        </span>

      </div>

      {/* Due Date */}
      <div className="mt-5 border-t pt-4">

        <div
          className={`
            flex
            items-center
            gap-2
            text-sm
            font-medium
            ${
              isOverdue
                ? "text-red-600"
                : "text-gray-600"
            }
          `}
        >

          {/* Calendar icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              ry="2"
            />

            <line
              x1="16"
              y1="2"
              x2="16"
              y2="6"
            />

            <line
              x1="8"
              y1="2"
              x2="8"
              y2="6"
            />

            <line
              x1="3"
              y1="10"
              x2="21"
              y2="10"
            />
          </svg>

          {isOverdue ? (
            <span>
              Overdue · {formattedDueDate}
            </span>
          ) : (
            <span>
              Due {formattedDueDate}
            </span>
          )}

        </div>

      </div>

    </div>
  );
}
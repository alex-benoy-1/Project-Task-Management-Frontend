import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Breadcrumbs,
  Button,
} from "../../../components/ui";

import { getProject } from "../../projects/api/projectApi";

import {
  deleteTask,
  getProjectTasks,
} from "../api/taskApi";

import type { Project } from "../../projects/types/project.types";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "../types/task.types";

import { TaskCard } from "../components/TaskCard";

type StatusFilter = "all" | TaskStatus;
type SortOption = "newest" | "dueDate" | "priority";

const priorityOrder: Record<TaskPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function TasksPage() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [sortBy, setSortBy] =
    useState<SortOption>("newest");

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
   * Load project and tasks
   */
  const fetchProjectAndTasks = async () => {
    if (!projectId) {
      setError("Project ID is missing.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const [projectResponse, tasksResponse] =
        await Promise.all([
          getProject(projectId),
          getProjectTasks(projectId),
        ]);

      setProject(projectResponse);
      setTasks(tasksResponse.tasks);
    } catch (error) {
      console.error("Failed to load project tasks:", error);

      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchProjectAndTasks();
  }, [projectId]);

  /*
   * Delete task from the backend and update the page
   */
  const handleTaskDelete = async (taskId: string) => {
    await deleteTask(taskId);

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  };

  /*
   * Filter and sort tasks
   */
  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        (task.description ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "priority") {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      if (sortBy === "dueDate") {
        const aDueDate = a.due_date
          ? new Date(a.due_date).getTime()
          : Number.POSITIVE_INFINITY;

        const bDueDate = b.due_date
          ? new Date(b.due_date).getTime()
          : Number.POSITIVE_INFINITY;

        return aDueDate - bDueDate;
      }

      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    });
  }, [tasks, searchQuery, statusFilter, sortBy]);

  /*
   * Task statistics
   */
  const completedCount = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "in_progress",
  ).length;

  const outstandingCount = tasks.filter(
    (task) => task.status !== "completed",
  ).length;

  /*
   * Back to projects
   */
  const handleBackToProjects = () => {
    if (!project) {
      navigate(-1);
      return;
    }

    navigate(
      `/organizations/${project.organization_id}/projects`,
    );
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
              { label: "Home", href: "/" },
              ...(project
                ? [
                    {
                      label: "Projects",
                      href: `/organizations/${project.organization_id}/projects`,
                    },
                    { label: project.name },
                  ]
                : [{ label: "Project" }]),
              { label: "Tasks" },
            ]}
          />
        </div>

        {/* Page heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              {project?.name ?? "Project workspace"}
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Tasks
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              {project
                ? `Organize and track the work for ${project.name}.`
                : "Organize and track your project work."}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => {
              // Connect your create-task modal here.
            }}
          >
            + Create task
          </Button>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total tasks</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {isLoading ? "—" : tasks.length}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Tasks in this project
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">In progress</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {isLoading ? "—" : inProgressCount}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Tasks currently being worked on
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Outstanding</p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {isLoading ? "—" : outstandingCount}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Tasks not yet completed
            </p>
          </div>
        </div>

        {/* Completion summary */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Project task completion
              </h2>

              <span className="text-sm font-medium text-gray-600">
                {Math.round((completedCount / tasks.length) * 100)}%
              </span>
            </div>

            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100"
              role="progressbar"
              aria-label="Task completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(
                (completedCount / tasks.length) * 100,
              )}
            >
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${(completedCount / tasks.length) * 100}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              {completedCount} of {tasks.length} tasks completed
            </p>
          </div>
        )}

        {/* Task list heading */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              All tasks
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Search, filter, and sort tasks in this project.
            </p>
          </div>

          {!isLoading && !error && (
            <p className="text-sm text-gray-500">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "task" : "tasks"}
            </p>
          )}
        </div>

        {/* Search, status filter, and sorting */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="task-search"
              className="sr-only"
            >
              Search tasks
            </label>

            <input
              id="task-search"
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search tasks..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="task-status"
              className="sr-only"
            >
              Filter by status
            </label>

            <select
              id="task-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All statuses</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="task-sort"
              className="sr-only"
            >
              Sort tasks
            </label>

            <select
              id="task-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="newest">Newest first</option>
              <option value="dueDate">Due date</option>
              <option value="priority">Highest priority</option>
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
              Loading tasks...
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
              Couldn't load tasks
            </h3>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void fetchProjectAndTasks()}
              className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200 transition hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty project */}
        {!isLoading && !error && tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
              +
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              No tasks yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Break your project into manageable tasks so you can
              track the work from start to completion.
            </p>

            <Button
              type="button"
              onClick={() => {
                // Connect your create-task modal here.
              }}
              className="mt-6"
            >
              Create your first task
            </Button>
          </div>
        )}

        {/* No matching tasks */}
        {!isLoading &&
          !error &&
          tasks.length > 0 &&
          filteredTasks.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
              <h3 className="font-semibold text-gray-900">
                No matching tasks
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            </div>
          )}

        {/* Task cards */}
        {!isLoading &&
          !error &&
          filteredTasks.length > 0 && (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleTaskDelete}
                />
              ))}
            </div>
          )}

        {/* Back to projects */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleBackToProjects}
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            ← Back to projects
          </button>
        </div>
      </section>
    </main>
  );
}
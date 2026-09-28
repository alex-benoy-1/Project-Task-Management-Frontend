import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Breadcrumbs,
  Button,
} from "../../../components/ui";

import {
  getProject,
} from "../../projects/api/projectApi";

import {
  getProjectTasks,
} from "../api/taskApi";

import type { Project } from "../../projects/types/project.types";
import type { Task } from "../types/task.types";

import { TaskCard } from "../components/TaskCard";

export function TasksPage() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const navigate = useNavigate();

  const [project, setProject] =
    useState<Project | null>(null);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

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
   * Fetch project and tasks
   */
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      if (!projectId) {
        setError("Project ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        /*
         * Get the project first.
         *
         * We need the project information
         * for:
         * - project name
         * - organization ID
         * - breadcrumb
         * - back button
         */
        const projectResponse =
          await getProject(projectId);

        setProject(projectResponse);

        /*
         * Get all tasks for this project.
         */
        const tasksResponse =
          await getProjectTasks(projectId);

        setTasks(tasksResponse.tasks);
      } catch (error) {
        console.error(
          "Failed to load project tasks:",
          error,
        );

        setError(
          "Failed to load tasks. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [projectId]);

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

  /*
   * Task delete handler
   *
   * This currently removes the task from
   * the UI after TaskCard calls it.
   *
   * Once the delete API is connected,
   * call deleteTask(taskId) here.
   */
  const handleTaskDelete = async (
    taskId: string,
  ) => {
    setTasks(
      (currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskId,
        ),
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
            type="button"
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
              Tasks
            </h2>

            <p className="mt-1 text-gray-600">
              {project
                ? `Manage tasks for ${project.name}.`
                : "Manage this project's tasks."}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => {
              // Create task modal will go here
            }}
          >
            + Create Task
          </Button>

        </div>

        {/* Breadcrumbs */}
        <div className="mb-8">

          {!isLoading && project ? (
            <Breadcrumbs
              items={[
                {
                  label: "Home",
                  href: "/",
                },
                {
                  label: "Projects",
                  href: `/organizations/${project.organization_id}/projects`,
                },
                {
                  label: project.name,
                },
                {
                  label: "Tasks",
                },
              ]}
            />
          ) : (
            <Breadcrumbs
              items={[
                {
                  label: "Home",
                  href: "/",
                },
                {
                  label: "Projects",
                },
                {
                  label: "Tasks",
                },
              ]}
            />
          )}

        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Loading tasks...
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
          tasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">

              <h3 className="font-semibold text-gray-900">
                No tasks yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                There are no tasks in this project yet.
              </p>

              <button
                type="button"
                onClick={() => {
                  // Create task modal will go here
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <span className="text-lg leading-none">
                  +
                </span>

                Create your first task
              </button>

            </div>
          )}

        {/* Tasks */}
        {!isLoading &&
          !error &&
          tasks.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleTaskDelete}
                />
              ))}

            </div>
          )}

        {/* Back to Projects */}
        {!isLoading && (
          <div className="mt-8">

            <button
              type="button"
              onClick={handleBackToProjects}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to projects
            </button>

          </div>
        )}

      </section>
    </main>
  );
}
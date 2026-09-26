import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs, Button, Card } from "../../../components/ui";

import { getProjectTasks } from "../api/taskApi";
import type { Task } from "../types/task.types";

export function TasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      if (!projectId) {
        setError("Project ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await getProjectTasks(projectId);
        setTasks(response.tasks);
      } catch (error) {
        console.error("Failed to load tasks:", error);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [projectId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-gray-50">
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

      <section className="mx-auto max-w-7xl px-6 py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/" },
            { label: "Tasks" },
          ]}
        />

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Project Tasks
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              View and manage tasks for this project.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => {
              // We'll connect this to the create-task form next.
            }}
          >
            + Create Task
          </Button>
        </div>

        {isLoading && (
          <Card>
            <p className="text-sm text-gray-500">
              Loading tasks...
            </p>
          </Card>
        )}

        {!isLoading && error && (
          <Card>
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        )}

        {!isLoading && !error && tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h3 className="font-semibold text-gray-900">
              No tasks yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              This project doesn't have any tasks yet.
            </p>
          </div>
        )}

        {!isLoading && !error && tasks.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Card key={task.id}>
                <h3 className="font-semibold text-gray-900">
                  {task.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {task.description}
                </p>

                <div className="mt-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                    {task.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to organizations
          </Link>
        </div>
      </section>
    </main>
  );
}
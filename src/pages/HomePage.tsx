import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // We'll implement real logout later.
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Task Manager
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to Task Manager! 🎉
          </h2>

          <p className="mt-3 text-gray-600">
            You have successfully reached the home page.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-5">
              <h3 className="font-semibold">
                Organizations
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your organizations
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-5">
              <h3 className="font-semibold">
                Projects
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your projects
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-5">
              <h3 className="font-semibold">
                Tasks
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your tasks
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
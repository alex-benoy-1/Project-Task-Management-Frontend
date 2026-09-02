import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyOrganizations } from "../features/organizations/api/organizationApi";
import { OrganizationCard } from "../features/organizations/components/OrganizationCard";
import type { Organization } from "../features/organizations/types/organization.types";

export function HomePage() {
  const navigate = useNavigate();

  const [organizations, setOrganizations] =
    useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login", {
      replace: true,
    });
  };

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoading(true);

        const response = await getMyOrganizations();

        console.log("Organizations:", response.organizations);
        console.log("Count:", response.count);

        setOrganizations(response.organizations);
      } catch (error) {
        console.error(
          "Failed to load organizations:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Organizations
          </h2>

          <p className="mt-1 text-gray-600">
            Select an organization to manage your projects and tasks.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <p className="text-gray-500">
            Loading organizations...
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading &&
          !error &&
          organizations.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="font-semibold text-gray-900">
                No organizations yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                You don't belong to any organizations yet.
              </p>
            </div>
          )}

        {/* Organizations */}
        {!isLoading &&
          !error &&
          organizations.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {organizations.map((organization) => (
                <OrganizationCard
                  key={organization.id}
                  organization={organization}
                />
              ))}
            </div>
          )}
      </section>
    </main>
  );
}
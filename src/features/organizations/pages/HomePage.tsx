import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getMyOrganizations } from "../api/organizationApi";
import { OrganizationCard } from "../components/OrganizationCard";
import type { Organization } from "../types/organization.types";

import { Breadcrumbs } from "../../../components/ui";

type SortOption = "recent" | "alphabetical";

export function HomePage() {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login", {
      replace: true,
    });
  };

  const handleOrganizationDelete = (organizationId: string) => {
    setOrganizations((currentOrganizations) =>
      currentOrganizations.filter(
        (organization) => organization.id !== organizationId,
      ),
    );
  };

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getMyOrganizations();

      setOrganizations(response.organizations);
    } catch (error) {
      console.error("Failed to load organizations:", error);

      setError("Failed to load your organizations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOrganizations();
  }, []);

  const adminCount = organizations.filter(
    (organization) => organization.role.toLowerCase() === "admin",
  ).length;

  const memberCount = organizations.filter(
    (organization) => organization.role.toLowerCase() !== "admin",
  ).length;

  const filteredOrganizations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = organizations.filter((organization) =>
      organization.name.toLowerCase().includes(query),
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }

      return (
        new Date(b.joined_at).getTime() -
        new Date(a.joined_at).getTime()
      );
    });
  }, [organizations, searchQuery, sortBy]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top navigation */}
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

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              {
                label: "Home",
              },
            ]}
          />
        </div>

        {/* Welcome section */}
        <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-medium text-blue-600">
              YOUR WORKSPACE
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Your organizations
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              Manage your workspaces, organize projects, and keep your
              team's tasks moving forward.
            </p>
          </div>

          <Link
            to="/organizations/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <span className="text-lg leading-none">+</span>
            Create organization
          </Link>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Total organizations
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {isLoading ? "—" : organizations.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Workspaces you belong to
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Admin roles
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {isLoading ? "—" : adminCount}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Organizations where your role is admin
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Other memberships
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {isLoading ? "—" : memberCount}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Organizations where your role isn't admin
            </p>
          </div>
        </div>

        {/* Organization list heading */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              All organizations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Find and open a workspace to view its projects.
            </p>
          </div>

          {!isLoading && !error && (
            <p className="text-sm text-gray-500">
              {filteredOrganizations.length}{" "}
              {filteredOrganizations.length === 1
                ? "organization"
                : "organizations"}
            </p>
          )}
        </div>

        {/* Search and sorting */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label
              htmlFor="organization-search"
              className="sr-only"
            >
              Search organizations
            </label>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              ⌕
            </span>

            <input
              id="organization-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search organizations..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="sm:w-52">
            <label
              htmlFor="organization-sort"
              className="sr-only"
            >
              Sort organizations
            </label>

            <select
              id="organization-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="recent">Recently joined</option>
              <option value="alphabetical">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className="rounded-xl border border-gray-200 bg-white p-8 text-center"
            role="status"
          >
            <p className="text-sm text-gray-500">
              Loading your organizations...
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 p-5"
            role="alert"
          >
            <h3 className="font-semibold text-red-800">
              Couldn't load organizations
            </h3>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadOrganizations()}
              className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200 transition hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* No organizations */}
        {!isLoading &&
          !error &&
          organizations.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                +
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Create your first workspace
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Organizations help you group projects and collaborate with
                other people. Create one to get started.
              </p>

              <Link
                to="/organizations/new"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Create organization
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}

        {/* No search results */}
        {!isLoading &&
          !error &&
          organizations.length > 0 &&
          filteredOrganizations.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
              <h3 className="font-semibold text-gray-900">
                No matching organizations
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another search term or clear your search.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          )}

        {/* Organization cards */}
        {!isLoading &&
          !error &&
          filteredOrganizations.length > 0 && (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredOrganizations.map((organization) => (
                <OrganizationCard
                  key={organization.id}
                  organization={organization}
                  onDelete={handleOrganizationDelete}
                />
              ))}
            </div>
          )}
      </section>
    </main>
  );
}

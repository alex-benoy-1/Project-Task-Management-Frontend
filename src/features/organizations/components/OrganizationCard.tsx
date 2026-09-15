import { useState } from "react";
import type { Organization } from "../types/organization.types";
import { Link } from "react-router-dom";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({
  organization,
}: OrganizationCardProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {organization.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
            {organization.role}
          </span>

          {/* Options */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOptions((prev) => !prev)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Organization options"
            >
              ⋮
            </button>

            {showOptions && (
              <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Link
        to={`/organizations/${organization.id}/projects`}
        state={{
          organizationRole: organization.role,
          organizationName: organization.name,
        }}
        className="block"
      >
        <p className="mt-5 text-sm font-medium text-blue-600">
          View projects →
        </p>
      </Link>
    </div>
  );
}
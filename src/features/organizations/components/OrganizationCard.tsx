import type { Organization } from "../types/organization.types";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({
  organization,
}: OrganizationCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {organization.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {organization.slug}
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
          {organization.role}
        </span>
      </div>
    </div>
  );
}
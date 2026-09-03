import { api } from "../../../lib/api/client.ts";

import type {
  CreateOrganizationRequest,
  GetOrganizationsResponse,
  Organization,
} from "../types/organization.types";

export const getMyOrganizations =
  async (): Promise<GetOrganizationsResponse> => {
    const response = await api.get<GetOrganizationsResponse>(
      "/organizations"
    );

    return response.data;
  };

export const createOrganization = async (
  data: CreateOrganizationRequest
): Promise<Organization> => {
  const response = await api.post<Organization>(
    "/organizations/",
    data
  );

  return response.data;
};
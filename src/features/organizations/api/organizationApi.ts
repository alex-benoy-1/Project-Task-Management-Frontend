import { api } from "../../../lib/api/client.ts";
import type {
  GetOrganizationsResponse,
} from "../types/organization.types";

export const getMyOrganizations =
  async (): Promise<GetOrganizationsResponse> => {
    const response = await api.get<GetOrganizationsResponse>(
      "/organizations"
    );

    return response.data;
  };
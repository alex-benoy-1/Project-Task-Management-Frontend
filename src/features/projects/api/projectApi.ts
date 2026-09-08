import { api } from "../../../lib/api/client";
import type { GetProjectsResponse } from "../types/project.types";

export const getOrganizationProjects = async (
  orgId: string,
): Promise<GetProjectsResponse> => {
  const response = await api.get<GetProjectsResponse>(
    `/projects/organization/${orgId}`,
  );

  console.log("Projects API response:", response.data);

  return response.data;
};
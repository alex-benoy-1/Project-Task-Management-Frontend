import { api } from "../../../lib/api/client";
import type { Project } from "../types/project.types";

export const getOrganizationProjects = async (
  organizationId: string,
): Promise<Project[]> => {
  const response = await api.get<Project[]>(
    `/projects/organization/${organizationId}`,
  );

  return response.data;
};
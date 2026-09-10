import { api } from "../../../lib/api/client";

import type {
  CreateProjectRequest,
  CreateProjectResponse,
  GetProjectsResponse,
} from "../types/project.types";

export const getOrganizationProjects = async (
  orgId: string,
): Promise<GetProjectsResponse> => {
  const response = await api.get<GetProjectsResponse>(
    `/projects/organization/${orgId}`,
  );

  return response.data;
};

export const createProject = async (
  orgId: string,
  data: CreateProjectRequest,
): Promise<CreateProjectResponse> => {
  const response = await api.post<CreateProjectResponse>(
    `/projects/organization/${orgId}`,
    data,
  );

  return response.data;
};

export const deleteProject = async (
  projectId: string,
) => {
  const response = await api.delete(
    `/projects/${projectId}`,
  );

  return response.data;
};
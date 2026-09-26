import { api } from "../../../lib/api/client";

import type {
  GetTasksResponse,
  CreateTaskRequest,
  Task,
} from "../types/task.types";

export const getProjectTasks = async (
  projectId: string,
): Promise<GetTasksResponse> => {
  const response = await api.get<GetTasksResponse>(
    `/projects/${projectId}/tasks`,
  );

  return response.data;
};

export const createTask = async (
  projectId: string,
  data: CreateTaskRequest,
): Promise<Task> => {
  const response = await api.post<Task>(
    `/projects/${projectId}/tasks`,
    data,
  );

  return response.data;
};
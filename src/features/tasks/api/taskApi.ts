import { api } from "../../../lib/api/client";

import type {
  GetTasksResponse,
  CreateTaskRequest,
  Task,
} from "../types/task.types";

/*
 * Get all tasks for a project
 */
export const getProjectTasks = async (
  projectId: string,
): Promise<GetTasksResponse> => {
  const response =
    await api.get<GetTasksResponse>(
      `/projects/${projectId}/tasks`,
    );

  return response.data;
};

/*
 * Create task
 */
export const createTask = async (
  projectId: string,
  data: CreateTaskRequest,
): Promise<Task> => {
  const response =
    await api.post<Task>(
      `/projects/${projectId}/tasks`,
      data,
    );

  return response.data;
};

/*
 * Delete task
 */
export const deleteTask = async (
  taskId: string,
): Promise<Task> => {
  const response = await api.delete<Task>(
    `/projects/tasks/${taskId}`,
  );

  return response.data;
};
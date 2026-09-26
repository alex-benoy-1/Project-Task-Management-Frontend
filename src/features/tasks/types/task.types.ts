export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetTasksResponse {
  tasks: Task[];
  count: number;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}
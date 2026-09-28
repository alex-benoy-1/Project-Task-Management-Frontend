export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "completed";

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_by: string;
  due_date: string;
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
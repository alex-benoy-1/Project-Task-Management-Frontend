export interface Project {
  projectid: string;
  organization_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  role: string;
  joined: string;
}

export interface GetProjectsResponse {
  projects: Project[];
  count: number;
}
export interface Organization {
  id: string;
  name: string;
  slug: string;
  joined_at: string;
  role: string;
}

export interface GetOrganizationsResponse {
  organizations: Organization[];
  count: number;
}
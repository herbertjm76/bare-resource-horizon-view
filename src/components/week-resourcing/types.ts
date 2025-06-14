
export interface Project {
  id: string;
  code: string;
  name: string;
  project_name?: string;
  isEmpty?: boolean;
}

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  office_location?: string;
  weekly_capacity?: number;
  avatar_url?: string;
}

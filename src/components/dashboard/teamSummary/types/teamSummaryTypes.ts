
export interface TeamMember {
  id?: string;
  isPending?: boolean;
  department?: string;
  location?: string;
  [key: string]: any;
}

export interface TeamStats {
  activeMembers: TeamMember[];
  preRegisteredMembers: TeamMember[];
  totalMembers: number;
}

export interface DepartmentColors {
  Architecture: string;
  Landscape: string;
  Unassigned: string;
}

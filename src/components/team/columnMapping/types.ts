
export interface ColumnMappingInterfaceProps {
  headers: string[];
  sampleData: any[][];
  onMappingComplete: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

export interface TeamMemberField {
  value: string;
  label: string;
  required: boolean;
}

export const TEAM_MEMBER_FIELDS: TeamMemberField[] = [
  { value: 'first_name', label: 'First Name', required: true },
  { value: 'last_name', label: 'Last Name', required: true },
  { value: 'email', label: 'Email', required: false },
  { value: 'job_title', label: 'Job Title', required: false },
  { value: 'department', label: 'Department', required: false },
  { value: 'practice_area', label: 'Practice Area', required: false },
  { value: 'location', label: 'Office Location', required: false },
  { value: 'weekly_capacity', label: 'Weekly Capacity (hours)', required: false },
  { value: 'role', label: 'Role', required: false }
];

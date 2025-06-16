
export interface ColumnMappingInterfaceProps {
  headers: string[];
  sampleData: any[][];
  onMappingComplete: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

export interface ProjectField {
  value: string;
  label: string;
  required: boolean;
}

export const PROJECT_FIELDS: ProjectField[] = [
  { value: 'code', label: 'Project Code', required: true },
  { value: 'name', label: 'Project Name', required: true },
  { value: 'status', label: 'Status', required: false },
  { value: 'country', label: 'Country', required: false },
  { value: 'target_profit_percentage', label: 'Target Profit %', required: false },
  { value: 'currency', label: 'Currency', required: false },
  { value: 'project_manager_name', label: 'Project Manager Name', required: false },
  { value: 'office_name', label: 'Office Name', required: false }
];

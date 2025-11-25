
export interface ExcelParseResult {
  headers: string[];
  data: any[][];
  rowCount: number;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface MappedTeamMember {
  first_name: string;
  last_name: string;
  email?: string;
  job_title?: string;
  department?: string;
  practice_area?: string;
  location?: string;
  weekly_capacity?: number;
  role?: string;
  company_id: string;
  invitation_type: 'pre_registered';
  status: 'pending';
  code: string;
}

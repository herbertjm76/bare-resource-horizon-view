
export interface ExcelParseResult {
  data: any[];
  headers: string[];
}

export interface ImportResult {
  success: boolean;
  successCount: number;
  errors: string[];
  warnings: string[];
}

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export interface MappedProject {
  company_id: string;
  created_at: string;
  updated_at: string;
  code?: string;
  name?: string;
  current_stage?: string;
  country?: string;
  target_profit_percentage?: number;
  status?: string;
  currency?: string;
  office_id?: string;
  project_manager_id?: string;
}

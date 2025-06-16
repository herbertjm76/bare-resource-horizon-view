
export interface ExcelParseResult {
  data: any[][];
  headers: string[];
}

export interface ImportResult {
  success: boolean;
  successCount: number;
  errors: string[];
  warnings?: string[];
  suggestions?: string[];
}

export interface ValidationResult {
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

export interface MappedProject {
  company_id: string;
  code?: string;
  name?: string;
  status?: string;
  country?: string;
  target_profit_percentage?: number;
  currency?: string;
  project_manager_id?: string;
  office_id?: string;
  current_stage?: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationContext {
  offices: Array<{ id: string; city: string; country: string }>;
  managers: Array<{ id: string; first_name: string; last_name: string }>;
  validStatuses: string[];
  validCurrencies: string[];
}

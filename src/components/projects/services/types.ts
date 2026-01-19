
export interface MappedProject {
  company_id: string;
  created_at: string;
  updated_at: string;
  code?: string;
  name?: string;
  abbreviation?: string;
  status?: string;
  current_stage?: string;
  target_profit_percentage?: number;
  currency?: string;
  country?: string;
  project_manager_id?: string;
  office_id?: string;
  temp_office_location_id?: string;
}

export interface ValidationResult {
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

export interface ValidationContext {
  offices: Array<{ id: string; city: string; country: string }>;
  managers: Array<{ id: string; first_name: string; last_name: string }>;
  validStatuses: string[];
  validCurrencies: string[];
}

export interface ImportResult {
  success: boolean;
  successCount: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ExcelParseResult {
  data: any[][];
  headers: string[];
  rowCount: number;
}

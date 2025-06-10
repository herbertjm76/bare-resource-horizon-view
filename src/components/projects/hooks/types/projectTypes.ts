
export interface StageFee {
  fee: string | number;
  billingMonth: string;
  status: string;
  invoiceDate: Date | null;
  hours: string | number;
  invoiceAge: number;
  currency: string;
}

export interface FormState {
  code: string;
  name: string;
  manager: string;
  country: string;
  profit: string | number;
  avgRate: string | number;
  currency: string;
  status: string;
  office: string;
  current_stage: string;
  stages: string[];
  stageFees: Record<string, StageFee>;
  stageApplicability: Record<string, boolean>;
  // New financial tracking fields
  budget_amount?: number;
  budget_hours?: number;
  blended_rate?: number;
  contract_start_date?: string;
  contract_end_date?: string;
  financial_status?: string;
}

export interface ProjectData {
  id: string;
  code: string;
  name: string;
  company_id: string;
  project_manager_id?: string;
  office_id: string;
  temp_office_location_id?: string;
  status: string;
  country?: string;
  current_stage: string;
  target_profit_percentage?: number;
  stages?: string[];
  currency?: string;
  average_rate?: number;
  // New financial fields
  budget_amount?: number;
  budget_hours?: number;
  blended_rate?: number;
  contract_start_date?: string;
  contract_end_date?: string;
  financial_status?: string;
  created_at: string;
  updated_at: string;
}

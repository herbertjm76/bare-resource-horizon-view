
export interface ProjectSubmitData {
  code: string;
  name: string;
  manager: string;
  country: string;
  profit: string;
  office: string;
  status: string;
  current_stage: string;
  stages: string[];
  stageFees: Record<string, {
    fee: string;
    billingMonth: string | Date | null;
    status: "Not Billed" | "Invoiced" | "Paid" | "";
    invoiceDate: Date | null;
    hours: string;
    invoiceAge: number;
    currency: string;
  }>;
  stageApplicability: Record<string, boolean>;
  officeStages?: Array<{ id: string; name: string; color?: string }>;
  company_id?: string;
}

export interface ProjectUpdateData {
  code: string;
  name: string;
  project_manager_id: string | null;
  office_id: string | null;
  status: string;
  country: string | null;
  current_stage: string | null;
  target_profit_percentage: number | null;
  stages: string[];
}

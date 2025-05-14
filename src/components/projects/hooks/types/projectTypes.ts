
// This file already exists with StageFee but it's being imported from the wrong location
export interface StageFee {
  fee: string;
  billingMonth: Date | string | null;
  status: "Not Billed" | "Invoiced" | "Paid" | "";
  invoiceDate: Date | null;
  hours: string;
  invoiceAge: string | number;
  currency: string;
}

export interface FormState {
  code: string;
  name: string;
  manager: string;
  country: string;
  profit: string;
  avgRate: string;
  currency: string;
  status: string;
  office: string;
  current_stage: string;
  stages: string[];
  stageFees: Record<string, StageFee>;
  stageApplicability: Record<string, boolean>;
  officeStages?: Array<{ id: string; name: string; color?: string }>;
}

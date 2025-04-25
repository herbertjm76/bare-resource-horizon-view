export interface StageFee {
  fee: string;
  billingMonth: string;
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
  status: string;
  office: string;
  current_stage: string;
  stages: string[];
  stageFees: Record<string, StageFee>;
  stageApplicability: Record<string, boolean>;
  currency: string;
}

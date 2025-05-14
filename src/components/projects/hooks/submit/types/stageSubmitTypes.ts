
import { StageFee } from "../../types/projectTypes";

export interface ExistingStage {
  id: string;
  stage_name: string;
}

export interface StageSubmitConfig {
  projectId: string;
  companyId: string;
  selectedStageNames: string[];
  existingStages: ExistingStage[] | null;
  stageFees: Record<string, StageFee>;
  stageApplicability: Record<string, boolean>;
  officeStages: Array<{ id: string; name: string }>;
}

export interface StageData {
  fee: number;
  isApplicable: boolean;
  billingMonth: string | null;
  invoiceDate: string | null;
  status: string;
  invoiceAge: number;
  currency: string;
}


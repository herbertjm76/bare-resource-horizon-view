
export interface OfficeStage {
  id: string;
  name: string;
  color?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  abbreviation?: string | null;
  status: string;
  country: string;
  target_profit_percentage: number;
  current_stage: string;
  project_manager?: {
    first_name?: string;
  };
}

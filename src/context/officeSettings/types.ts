export type Role = {
  id: string;
  name: string;
  code: string;
  company_id: string;
  created_at: string;
  updated_at: string;
};

export type Rate = {
  id: string;
  type: "role" | "location";
  reference_id: string;
  value: number;
  unit: "hour" | "day" | "week";
  company_id: string;
};

export type Location = {
  id: string;
  city: string;
  country: string;
  code: string;
  emoji?: string;
  company_id: string;
  color?: string;
};

export type Department = {
  id: string;
  name: string;
  company_id: string;
  icon?: string;
};

export type PracticeArea = {
  id: string;
  name: string;
  company_id: string;
  icon?: string;
};

export type ProjectStage = {
  id: string;
  name: string;
  order_index: number;
  company_id: string;
  color?: string;
};

export type ProjectStatus = {
  id: string;
  name: string;
  order_index: number;
  company_id: string;
  color?: string;
};

export type ProjectType = {
  id: string;
  name: string;
  order_index: number;
  company_id: string;
  icon?: string;
  color?: string;
};

export type OfficeSettingsContextType = {
  roles: Role[];
  locations: Location[];
  rates: Rate[];
  departments: Department[];
  practice_areas: PracticeArea[];
  office_stages: ProjectStage[];
  project_statuses: ProjectStatus[];
  project_types: ProjectType[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  setRates: React.Dispatch<React.SetStateAction<Rate[]>>;
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  setPracticeAreas: React.Dispatch<React.SetStateAction<PracticeArea[]>>;
  setOfficeStages: React.Dispatch<React.SetStateAction<ProjectStage[]>>;
  setProjectStatuses: React.Dispatch<React.SetStateAction<ProjectStatus[]>>;
  setProjectTypes: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  loading: boolean;
};

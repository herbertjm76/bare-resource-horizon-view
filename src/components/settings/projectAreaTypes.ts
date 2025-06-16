
export interface ProjectArea {
  id: string;
  code: string;
  country: string;
  region: string;
  city?: string;
  color?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectAreaFormValues {
  code: string;
  country: string;
  region: string;
  city: string;
  color: string;
}

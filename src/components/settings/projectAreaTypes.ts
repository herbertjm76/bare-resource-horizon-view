
export interface ProjectArea {
  id: string;
  code: string;
  country: string;
  region: string;
  city?: string;
  color?: string;
  company_id?: string;
}

export interface ProjectAreaFormValues {
  code: string;
  country: string;
  region: string;
  city: string;
  color: string;
}

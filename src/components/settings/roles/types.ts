
export interface Role {
  id: string;
  name: string;
  code: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface RoleFormData {
  name: string;
  code: string;
}

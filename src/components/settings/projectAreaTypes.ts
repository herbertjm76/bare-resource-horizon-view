
// Types that match the project_areas table in Supabase
export type ProjectAreaRow = {
  id: string;
  code: string;
  name: string;
  emoji: string | null;
  created_at: string;
  updated_at: string;
  company_id: string | null;
  city?: string;
  color?: string; // Added color field to match updated DB schema
};

// The ProjectArea shape as used in the app
export type ProjectArea = {
  id: string;
  code: string;
  region: string;
  country: string;
  company_id: string | null;
  city?: string;
  color?: string; // Added color field to match updated DB schema
};

export type ProjectAreaFormValues = {
  code: string;
  country: string;
  region: string;
  city?: string;
  color?: string; // Added color field for form values
};

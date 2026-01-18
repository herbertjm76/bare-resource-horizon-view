
import { Database } from '@/integrations/supabase/types';

// Define role type based on the Database enum to ensure consistency
export type AppRole = Database['public']['Enums']['app_role'];

export interface MemberFormData {
  first_name: string;
  last_name: string;
  email: string;
  role: AppRole;
  department?: string;
  location?: string;
  job_title?: string;
  weekly_capacity?: number | null; // null = use company default
  office_role_id?: string;
  start_date?: string | null;
  end_date?: string | null;
}


import { Database } from '@/integrations/supabase/types';

// Define role type based on the Database enum to ensure consistency
export type UserRole = Database['public']['Enums']['user_role'];

export interface MemberFormData {
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  department?: string;
  location?: string;
  job_title?: string;
  weekly_capacity?: number;
}

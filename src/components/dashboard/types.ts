
import { Database } from '@/integrations/supabase/types';

// Define the base Profile type from the database
type BaseProfile = Database['public']['Tables']['profiles']['Row'];

// Extended Profile type with additional fields that might not be in the database
export interface Profile extends BaseProfile {
  department?: string;
  location?: string;
  job_title?: string;
}

export type Invite = Database['public']['Tables']['invites']['Row'];

export interface PendingMember extends Omit<Invite, 'first_name' | 'last_name'> {
  isPending: true;
  fullName?: string;
  role?: string; // Role property which can come from the invite
  first_name?: string; // Adding first_name as optional explicitly
  last_name?: string; // Adding last_name as optional explicitly
}

export type InvitationType = 'email_invite' | 'pre_registered';

export type TeamMember = Profile | PendingMember;

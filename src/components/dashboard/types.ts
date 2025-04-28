
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

export interface PendingMember extends Invite {
  isPending: true;
  fullName?: string;
  role?: string; // Role property which can come from the invite
  first_name?: string; // Adding first_name property
  last_name?: string; // Adding last_name property
}

export type InvitationType = 'email_invite' | 'pre_registered';

export type TeamMember = Profile | PendingMember;

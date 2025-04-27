
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  department: string;
  location: string;
  job_title: string;
};

export type Invite = Database['public']['Tables']['invites']['Row'];

export interface PendingMember extends Invite {
  isPending: true;
  fullName?: string;
}

export type InvitationType = 'email_invite' | 'pre_registered';

export type TeamMember = Profile | PendingMember;

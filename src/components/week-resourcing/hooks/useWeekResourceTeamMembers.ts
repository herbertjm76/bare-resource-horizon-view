
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export const useWeekResourceTeamMembers = () => {
  const { company } = useCompany();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }
  });

  // Get active team members from profiles table
  const { data: activeMembers = [], isLoading: isLoadingActive, error: activeError } = useQuery({
    queryKey: ['active-team-members', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, location, weekly_capacity, role')
        .eq('company_id', company.id)
        .not('role', 'is', null); // Only get profiles with roles (actual team members)
        
      if (error) {
        console.error("Error fetching active team members:", error);
        return [];
      }
      
      console.log("Fetched active team members:", data?.length || 0);
      
      // Transform to match expected structure
      return data?.map(member => ({
        id: member.id,
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || '',
        location: member.location || null,
        weekly_capacity: member.weekly_capacity || 40,
        status: 'active'
      })) || [];
    },
    enabled: !!company?.id
  });

  // Get pre-registered team members
  const { data: preRegisteredMembers = [], isLoading: isLoadingPreRegistered, error: preRegisteredError } = useQuery({
    queryKey: ['pre-registered-members', session?.user?.id, company?.id],
    queryFn: async () => {
      if (!session?.user?.id || !company?.id) return [];
      
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, email, department, location, job_title, role, weekly_capacity')
        .eq('company_id', company.id)
        .eq('invitation_type', 'pre_registered')
        .eq('status', 'pending');
        
      if (error) {
        console.error("Error fetching pre-registered members:", error);
        return [];
      }
      
      console.log("Fetched pre-registered members:", data?.length || 0);
      
      // Transform the pre-registered members to match team member structure
      return data.map(member => ({
        id: member.id,
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || '',
        location: member.location || null,
        weekly_capacity: member.weekly_capacity || 40,
        status: 'pre_registered'
      }));
    },
    enabled: !!session?.user?.id && !!company?.id
  });

  // Combine both active and pre-registered members
  const members = [...activeMembers, ...preRegisteredMembers];

  const loadingMembers = isLoadingActive || isLoadingPreRegistered;
  const membersError = activeError || preRegisteredError;

  console.log('=== TEAM MEMBERS SUMMARY (FIXED) ===');
  console.log('Active members:', activeMembers.length);
  console.log('Pre-registered members:', preRegisteredMembers.length);
  console.log('Total members:', members.length);

  return {
    members,
    loadingMembers,
    membersError
  };
};

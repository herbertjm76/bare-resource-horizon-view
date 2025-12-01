
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWeekResourceTeamMembers = () => {

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }
  });

  // Get active team members from profiles table - FETCH ALL, filter client-side
  const { data: activeMembers = [], isLoading: isLoadingActive, error: activeError } = useQuery({
    queryKey: ['active-team-members'],
    queryFn: async () => {
      // Ensure user is authenticated; rely on RLS for company scoping
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, location, department, practice_area, weekly_capacity, avatar_url');
        
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
        department: member.department || null,
        practice_area: member.practice_area || null,
        weekly_capacity: member.weekly_capacity || 40,
        avatar_url: member.avatar_url || null,
        status: 'active'
      })) || [];
    },
    enabled: true,
    staleTime: 60_000,
  });

  // Get pre-registered team members - FETCH ALL, filter client-side
  const { data: preRegisteredMembers = [], isLoading: isLoadingPreRegistered, error: preRegisteredError } = useQuery({
    queryKey: ['pre-registered-members'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, email, department, location, practice_area, job_title, role, weekly_capacity')
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
        department: member.department || null,
        practice_area: member.practice_area || null,
        weekly_capacity: member.weekly_capacity || 40,
        avatar_url: null, // Pre-registered members don't have avatars yet
        status: 'pre_registered'
      }));
    },
    enabled: true,
    staleTime: 60_000,
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

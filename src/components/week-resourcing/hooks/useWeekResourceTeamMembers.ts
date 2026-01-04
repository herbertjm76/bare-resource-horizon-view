
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_PRE_REGISTERED, DEMO_TEAM_MEMBERS } from '@/data/demoData';

export const useWeekResourceTeamMembers = () => {
  const { isDemoMode } = useDemoAuth();

  // Keep session query for non-demo mode
  useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    enabled: !isDemoMode,
  });

  // Get active team members
  const { data: activeMembers = [], isLoading: isLoadingActive, error: activeError } = useQuery({
    queryKey: ['active-team-members', isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_TEAM_MEMBERS.map((m) => ({
          id: m.id,
          first_name: m.first_name || '',
          last_name: m.last_name || '',
          email: m.email || '',
          location: m.location || null,
          department: m.department || null,
          practice_area: (m as any).practice_area || null,
          weekly_capacity: m.weekly_capacity || 40,
          avatar_url: (m as any).avatar_url || null,
          status: 'active',
        }));
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, location, department, practice_area, weekly_capacity, avatar_url');

      if (error) return [];

      return (
        data?.map((member) => ({
          id: member.id,
          first_name: member.first_name || '',
          last_name: member.last_name || '',
          email: member.email || '',
          location: member.location || null,
          department: member.department || null,
          practice_area: member.practice_area || null,
          weekly_capacity: member.weekly_capacity || 40,
          avatar_url: member.avatar_url || null,
          status: 'active',
        })) || []
      );
    },
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes cache
    placeholderData: (previousData) => previousData,
  });

  // Get pre-registered team members
  const {
    data: preRegisteredMembers = [],
    isLoading: isLoadingPreRegistered,
    error: preRegisteredError,
  } = useQuery({
    queryKey: ['pre-registered-members', isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_PRE_REGISTERED.map((m) => ({
          id: m.id,
          first_name: m.first_name || '',
          last_name: m.last_name || '',
          email: m.email || '',
          location: m.location || null,
          department: m.department || null,
          practice_area: (m as any).practice_area || null,
          weekly_capacity: m.weekly_capacity || 40,
          avatar_url: (m as any).avatar_url || null,
          status: 'pre_registered',
        }));
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, email, department, location, practice_area, job_title, role, weekly_capacity, avatar_url')
        .eq('invitation_type', 'pre_registered')
        .eq('status', 'pending');

      if (error) return [];

      return data.map((member) => ({
        id: member.id,
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || '',
        location: member.location || null,
        department: member.department || null,
        practice_area: member.practice_area || null,
        weekly_capacity: member.weekly_capacity || 40,
        avatar_url: member.avatar_url || null,
        status: 'pre_registered',
      }));
    },
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes cache
    placeholderData: (previousData) => previousData,
  });

  const members = [...activeMembers, ...preRegisteredMembers].sort((a, b) => {
    const nameA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
    const nameB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const loadingMembers = isLoadingActive || isLoadingPreRegistered;
  const membersError = activeError || preRegisteredError;

  return {
    members,
    loadingMembers,
    membersError,
  };
};


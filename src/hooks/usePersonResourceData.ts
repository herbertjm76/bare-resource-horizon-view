import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';

export interface PersonProject {
  projectId: string;
  projectName: string;
  projectCode: string;
  allocations: Record<string, number>; // dayKey -> hours
}

export interface PersonResourceData {
  personId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  location?: string;
  jobTitle?: string;
  weeklyCapacity: number;
  resourceType: 'active' | 'pre_registered';
  projects: PersonProject[];
}

export const usePersonResourceData = (startDate: Date, periodToShow: number) => {
  const { company } = useCompany();
  const { workWeekHours } = useAppSettings();

  const { data: personData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['person-resource-data', company?.id, startDate.toISOString(), periodToShow],
    queryFn: async () => {
      if (!company) {
        console.log('No company available, cannot fetch person resource data');
        return [];
      }

      console.log('Fetching person resource data for company:', company.id);

      try {
        // Fetch all active team members (profiles)
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, location, job_title, weekly_capacity')
          .eq('company_id', company.id)
          .order('first_name', { ascending: true });

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast.error('Failed to load team members');
          throw profilesError;
        }

        // Fetch pre-registered members (pending invites)
        const { data: invites, error: invitesError } = await supabase
          .from('invites')
          .select('id, first_name, last_name, avatar_url, location, job_title, weekly_capacity')
          .eq('company_id', company.id)
          .eq('invitation_type', 'pre_registered')
          .eq('status', 'pending')
          .order('first_name', { ascending: true });

        if (invitesError) {
          console.error('Error fetching invites:', invitesError);
        }

        // Combine profiles and invites, marking their type
        const allMembers = [
          ...(profiles || []).map(p => ({ ...p, resourceType: 'active' as const })),
          ...(invites || []).map(i => ({ ...i, resourceType: 'pre_registered' as const }))
        ];

        if (allMembers.length === 0) {
          console.log('No team members found');
          return [];
        }

        // Calculate date range for allocations
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + (periodToShow * 7));

        // Fetch all allocations for this date range and company (both active and pre-registered)
        const { data: allocations, error: allocationsError } = await supabase
          .from('project_resource_allocations')
          .select(`
            resource_id,
            resource_type,
            project_id,
            allocation_date,
            hours,
            projects (
              id,
              name,
              code
            )
          `)
          .eq('company_id', company.id)
          .in('resource_type', ['active', 'pre_registered'])
          .gte('allocation_date', startDate.toISOString().split('T')[0])
          .lte('allocation_date', endDate.toISOString().split('T')[0]);

        if (allocationsError) {
          console.error('Error fetching allocations:', allocationsError);
          toast.error('Failed to load allocations');
          throw allocationsError;
        }

        console.log('Fetched allocations:', allocations?.length || 0);

        // Process data: group allocations by person, then by project
        const personMap = new Map<string, PersonResourceData>();

        // Initialize all members (both profiles and invites)
        allMembers.forEach(member => {
          personMap.set(member.id, {
            personId: member.id,
            firstName: member.first_name || '',
            lastName: member.last_name || '',
            avatarUrl: member.avatar_url || undefined,
            location: member.location || undefined,
            jobTitle: member.job_title || undefined,
            weeklyCapacity: member.weekly_capacity || workWeekHours,
            resourceType: member.resourceType,
            projects: []
          });
        });

        // Group allocations by person and project, aggregating daily hours into weekly totals
        allocations?.forEach((allocation: any) => {
          const personData = personMap.get(allocation.resource_id);
          if (!personData) return;

          // Find or create project entry for this person
          let projectEntry = personData.projects.find(p => p.projectId === allocation.project_id);
          
          if (!projectEntry) {
            projectEntry = {
              projectId: allocation.project_id,
              projectName: allocation.projects?.name || 'Unknown Project',
              projectCode: allocation.projects?.code || '',
              allocations: {}
            };
            personData.projects.push(projectEntry);
          }

          // Convert the date to the week start (Monday)
          const allocationDate = new Date(allocation.allocation_date + 'T00:00:00');
          const dayOfWeek = allocationDate.getDay();
          const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
          const monday = new Date(allocationDate);
          monday.setDate(allocationDate.getDate() + daysToMonday);
          const weekKey = monday.toISOString().split('T')[0];
          
          // Aggregate hours by week (sum up daily hours into weekly total)
          projectEntry.allocations[weekKey] = (projectEntry.allocations[weekKey] || 0) + allocation.hours;
        });

        const result = Array.from(personMap.values());
        console.log('Processed person resource data:', result.length, 'people');
        return result;

      } catch (err) {
        console.error('Exception in person resource data fetch:', err);
        throw err;
      }
    },
    enabled: !!company,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });

  return {
    personData,
    isLoading,
    error,
    refetch
  };
};

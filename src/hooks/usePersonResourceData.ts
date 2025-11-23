import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
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
  projects: PersonProject[];
}

export const usePersonResourceData = (startDate: Date, periodToShow: number) => {
  const { company } = useCompany();

  const { data: personData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['person-resource-data', company?.id, startDate.toISOString(), periodToShow],
    queryFn: async () => {
      if (!company) {
        console.log('No company available, cannot fetch person resource data');
        return [];
      }

      console.log('Fetching person resource data for company:', company.id);

      try {
        // Fetch all team members (profiles)
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

        if (!profiles || profiles.length === 0) {
          console.log('No profiles found');
          return [];
        }

        // Calculate date range for allocations
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + (periodToShow * 7));

        // Fetch all allocations for this date range and company
        const { data: allocations, error: allocationsError } = await supabase
          .from('project_resource_allocations')
          .select(`
            resource_id,
            project_id,
            week_start_date,
            hours,
            projects (
              id,
              name,
              code
            )
          `)
          .eq('company_id', company.id)
          .eq('resource_type', 'active')
          .gte('week_start_date', startDate.toISOString().split('T')[0])
          .lte('week_start_date', endDate.toISOString().split('T')[0]);

        if (allocationsError) {
          console.error('Error fetching allocations:', allocationsError);
          toast.error('Failed to load allocations');
          throw allocationsError;
        }

        console.log('Fetched allocations:', allocations?.length || 0);

        // Process data: group allocations by person, then by project
        const personMap = new Map<string, PersonResourceData>();

        // Initialize all profiles
        profiles.forEach(profile => {
          personMap.set(profile.id, {
            personId: profile.id,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            avatarUrl: profile.avatar_url || undefined,
            location: profile.location || undefined,
            jobTitle: profile.job_title || undefined,
            weeklyCapacity: profile.weekly_capacity || 40,
            projects: []
          });
        });

        // Group allocations by person and project
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

          // Add allocation hours for this week
          const dayKey = allocation.week_start_date;
          projectEntry.allocations[dayKey] = allocation.hours;
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

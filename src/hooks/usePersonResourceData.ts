import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { startOfWeek, format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import {
  DEMO_COMPANY_ID,
  DEMO_TEAM_MEMBERS,
  DEMO_PRE_REGISTERED,
  DEMO_PROJECTS,
  generateDemoAllocations,
} from '@/data/demoData';

export interface PersonProject {
  projectId: string;
  projectName: string;
  projectCode: string;
  allocations: Record<string, number>; // weekKey -> hours
}

export interface PersonResourceData {
  personId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  location?: string;
  jobTitle?: string;
  department?: string;
  practiceArea?: string;
  weeklyCapacity: number;
  resourceType: 'active' | 'pre_registered';
  projects: PersonProject[];
}

export const usePersonResourceData = (startDate: Date, periodToShow: number) => {
  const { company } = useCompany();
  const { workWeekHours, startOfWorkWeek } = useAppSettings();
  const { isDemoMode } = useDemoAuth();
  const queryClient = useQueryClient();

  const weekStartsOn = startOfWorkWeek === 'Sunday' ? 0 : startOfWorkWeek === 'Saturday' ? 6 : 1;

  const { data: personData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['person-resource-data', company?.id, startDate.toISOString(), periodToShow, isDemoMode],
    queryFn: async () => {
      // Demo mode: return demo data
      if (isDemoMode) {
        logger.debug('Demo mode: returning demo person resource data');

        // Build member list
        const allMembers = [
          ...DEMO_TEAM_MEMBERS.map((m) => ({ ...m, resourceType: 'active' as const })),
          ...DEMO_PRE_REGISTERED.map((m) => ({ ...m, resourceType: 'pre_registered' as const })),
        ];

        // Calculate date range
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + periodToShow * 7);

        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];

        // Filter demo allocations within date range
        const allAllocations = generateDemoAllocations();
        const rangeAllocations = allAllocations.filter(
          (a) => a.allocation_date >= startStr && a.allocation_date <= endStr
        );

        // Build a project lookup
        const projectLookup = new Map(DEMO_PROJECTS.map((p) => [p.id, p]));

        // Process data: group allocations by person, then by project
        const personMap = new Map<string, PersonResourceData>();

        allMembers.forEach((member) => {
          const avatarUrl = 'avatar_url' in member ? member.avatar_url : undefined;
          const practiceArea = 'practice_area' in member ? member.practice_area : undefined;

          personMap.set(member.id, {
            personId: member.id,
            firstName: member.first_name || '',
            lastName: member.last_name || '',
            avatarUrl: avatarUrl || undefined,
            location: member.location || undefined,
            jobTitle: member.job_title || undefined,
            department: member.department || undefined,
            practiceArea: practiceArea || undefined,
            weeklyCapacity: member.weekly_capacity || workWeekHours,
            resourceType: member.resourceType,
            projects: [],
          });
        });

        // Group allocations by person and project
        rangeAllocations.forEach((allocation) => {
          const person = personMap.get(allocation.resource_id);
          if (!person) return;

          let projectEntry = person.projects.find((p) => p.projectId === allocation.project_id);
          if (!projectEntry) {
            const proj = projectLookup.get(allocation.project_id);
            projectEntry = {
              projectId: allocation.project_id,
              projectName: proj?.name || 'Unknown Project',
              projectCode: proj?.code || '',
              allocations: {},
            };
            person.projects.push(projectEntry);
          }

          // Convert the date to the week start based on company settings
          const allocationDate = new Date(allocation.allocation_date + 'T00:00:00');
          const weekKey = format(startOfWeek(allocationDate, { weekStartsOn }), 'yyyy-MM-dd');
          // Aggregate hours by week
          projectEntry.allocations[weekKey] = (projectEntry.allocations[weekKey] || 0) + allocation.hours;
        });

        return Array.from(personMap.values());
      }

      // Real mode: fetch from Supabase
      if (!company) {
        logger.debug('No company available, cannot fetch person resource data');
        return [];
      }

      logger.debug('Fetching person resource data for company:', company.id);

      try {
        // Fetch all active team members (profiles)
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, location, job_title, weekly_capacity, department, practice_area')
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
          .select('id, first_name, last_name, avatar_url, location, job_title, weekly_capacity, department, practice_area')
          .eq('company_id', company.id)
          .eq('invitation_type', 'pre_registered')
          .eq('status', 'pending')
          .order('first_name', { ascending: true });

        if (invitesError) {
          console.error('Error fetching invites:', invitesError);
        }

        // Combine profiles and invites, marking their type
        const allMembers = [
          ...(profiles || []).map((p) => ({ ...p, resourceType: 'active' as const })),
          ...(invites || []).map((i) => ({ ...i, resourceType: 'pre_registered' as const })),
        ];

        if (allMembers.length === 0) {
          logger.debug('No team members found');
          return [];
        }

        // Calculate date range for allocations (must align with grid weeks).
        // The grid may render the first visible week starting BEFORE the selected month.
        const rangeStart = startOfWeek(startDate, { weekStartsOn });
        const endDate = new Date(rangeStart);
        endDate.setDate(endDate.getDate() + periodToShow * 7);

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
          .gte('allocation_date', format(rangeStart, 'yyyy-MM-dd'))
          .lte('allocation_date', format(endDate, 'yyyy-MM-dd'));

        if (allocationsError) {
          logger.error('Error fetching allocations:', allocationsError);
          toast.error('Failed to load allocations');
          throw allocationsError;
        }

        logger.debug('Fetched allocations:', allocations?.length || 0);

        // Process data: group allocations by person, then by project
        const personMap = new Map<string, PersonResourceData>();

        // Initialize all members (both profiles and invites)
        allMembers.forEach((member) => {
          personMap.set(member.id, {
            personId: member.id,
            firstName: member.first_name || '',
            lastName: member.last_name || '',
            avatarUrl: member.avatar_url || undefined,
            location: member.location || undefined,
            jobTitle: member.job_title || undefined,
            department: (member as any).department || undefined,
            practiceArea: (member as any).practice_area || undefined,
            weeklyCapacity: member.weekly_capacity || workWeekHours,
            resourceType: member.resourceType,
            projects: [],
          });
        });

        // Group allocations by person and project, aggregating daily hours into weekly totals
        allocations?.forEach((allocation: any) => {
          const personData = personMap.get(allocation.resource_id);
          if (!personData) return;

          // Find or create project entry for this person
          let projectEntry = personData.projects.find((p) => p.projectId === allocation.project_id);

          if (!projectEntry) {
            projectEntry = {
              projectId: allocation.project_id,
              projectName: allocation.projects?.name || 'Unknown Project',
              projectCode: allocation.projects?.code || '',
              allocations: {},
            };
            personData.projects.push(projectEntry);
          }

          // Convert the date to the week start based on company settings
          const allocationDate = new Date(allocation.allocation_date + 'T00:00:00');
          const weekKey = format(startOfWeek(allocationDate, { weekStartsOn }), 'yyyy-MM-dd');
          // Aggregate hours by week (sum up daily hours into weekly total)
          projectEntry.allocations[weekKey] = (projectEntry.allocations[weekKey] || 0) + allocation.hours;
        });

        const result = Array.from(personMap.values());
        logger.debug('Processed person resource data:', result.length, 'people');
        return result;
      } catch (err) {
        console.error('Exception in person resource data fetch:', err);
        throw err;
      }
    },
    enabled: isDemoMode || !!company,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isDemoMode) return;
    if (!company?.id) return;

    console.log('[realtime] subscribing to project_resource_allocations for company', company.id);

    const channel = supabase
      .channel(`person-resource-allocations:${company.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_resource_allocations',
          filter: `company_id=eq.${company.id}`,
        },
        (payload) => {
          console.log('[realtime] project_resource_allocations change', payload);
          // Invalidate so "By Person" refreshes immediately for all visible date ranges
          queryClient.invalidateQueries({ queryKey: ['person-resource-data'], exact: false });
        }
      )
      .subscribe((status) => {
        console.log('[realtime] subscription status (person-resource-allocations)', status);
      });

    return () => {
      console.log('[realtime] removing subscription (person-resource-allocations)');
      supabase.removeChannel(channel);
    };
  }, [company?.id, isDemoMode, queryClient]);

  return {
    personData,
    isLoading,
    error,
    refetch,
  };
};


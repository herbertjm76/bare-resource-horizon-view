import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { ResourceTableLoadingState } from '@/components/weekly-overview/components/ResourceTableLoadingState';
import { ResourceTableErrorState } from '@/components/weekly-overview/components/ResourceTableErrorState';
import { EmptyResourceState } from '@/components/weekly-overview/components/EmptyResourceState';
import { getWeekStartDate } from '@/hooks/allocations/utils/dateUtils';
import { ResourceTable } from '@/components/week-resourcing/ResourceTable';
import { WeekResourceSummary } from '@/components/week-resourcing/WeekResourceSummary';
import { addDays, format, startOfWeek } from 'date-fns';
import './week-resourcing.css';

interface WeekResourceViewProps {
  selectedWeek: Date;
  filters: {
    office: string;
    searchTerm?: string;
  };
}

export const WeekResourceView: React.FC<WeekResourceViewProps> = ({
  selectedWeek,
  filters
}) => {
  const { company } = useCompany();
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);
  const [membersError, setMembersError] = useState<Error | null>(null);
  
  // Format week start date for allocations - ensure it's Monday
  const monday = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekStartDate = format(monday, 'yyyy-MM-dd');
  console.log('Week start date for allocations:', weekStartDate);

  // Get projects for the company
  const { data: projects, isLoading: isLoadingProjects, error: projectsError } = useQuery({
    queryKey: ['week-resource-projects', company?.id, filters.office, filters.searchTerm],
    queryFn: async () => {
      if (!company?.id) return [];
      
      try {
        let query = supabase
          .from('projects')
          .select('id, name, code, office:offices(id, name, country)');
          
        // Add company filter
        query = query.eq('company_id', company.id);
        
        // Apply office filter if needed
        if (filters.office !== 'all') {
          // Need to match by office name from the joined offices table
          query = query.eq('office.name', filters.office);
        }
        
        // Apply search filter if provided
        if (filters.searchTerm) {
          query = query.or(`name.ilike.%${filters.searchTerm}%,code.ilike.%${filters.searchTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching projects:', error);
          throw new Error(`Error fetching projects: ${error.message}`);
        }
        
        console.log('Fetched projects:', data);
        return data || [];
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        throw err;
      }
    },
    enabled: !!company?.id
  });

  // Get team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!company?.id) return;
      
      setLoadingMembers(true);
      setMembersError(null);
      
      try {
        // Fetch active members
        const { data: activeMembers, error: activeError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, location, job_title, weekly_capacity')
          .eq('company_id', company.id);
          
        if (activeError) throw new Error(`Error fetching team members: ${activeError.message}`);
        
        // Fetch pre-registered members 
        const { data: preRegisteredMembers, error: pendingError } = await supabase
          .from('invites')
          .select('id, first_name, last_name, location, job_title, weekly_capacity')
          .eq('company_id', company.id)
          .eq('invitation_type', 'pre_registered')
          .eq('status', 'pending');
          
        if (pendingError) throw new Error(`Error fetching pre-registered members: ${pendingError.message}`);
        
        // Combine members
        const allMembers = [
          ...(activeMembers || []), 
          ...(preRegisteredMembers || [])
        ];
        
        console.log('Fetched members:', allMembers);
        setMembers(allMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembersError(error instanceof Error ? error : new Error('Unknown error fetching members'));
      } finally {
        setLoadingMembers(false);
      }
    };
    
    fetchTeamMembers();
  }, [company?.id]);

  // Get resource allocations for the selected week
  const { data: weekAllocations, isLoading: isLoadingAllocations } = useQuery({
    queryKey: ['week-resource-allocations', company?.id, weekStartDate],
    queryFn: async () => {
      if (!company?.id) return [];
      
      try {
        // Try to fetch with the exact date
        const { data, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            id,
            project_id,
            resource_id,
            resource_type,
            hours,
            week_start_date
          `)
          .eq('company_id', company.id)
          .eq('week_start_date', weekStartDate);
          
        if (error) {
          throw new Error(`Error fetching allocations: ${error.message}`);
        }
        
        console.log('Fetched allocations for week:', weekStartDate, data);
        return data || [];
      } catch (error) {
        console.error('Error in allocation query:', error);
        return [];
      }
    },
    enabled: !!company?.id
  });
  
  // Determine overall loading state
  const isLoading = isLoadingProjects || loadingMembers || isLoadingAllocations;
  
  // Handle errors
  const error = projectsError || membersError;
  
  // Render loading state
  if (isLoading) {
    return <ResourceTableLoadingState />;
  }
  
  // Render error state
  if (error) {
    return <ResourceTableErrorState error={error} />;
  }
  
  // Render empty state
  if (!projects || projects.length === 0) {
    return <EmptyResourceState />;
  }

  return (
    <>
      <WeekResourceSummary 
        projects={projects}
        members={members}
        allocations={weekAllocations || []}
        weekStartDate={weekStartDate}
      />
      
      <ResourceTable 
        projects={projects}
        members={members}
        allocations={weekAllocations || []}
        weekStartDate={weekStartDate}
      />
    </>
  );
};

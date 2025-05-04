
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { Table, TableBody } from "@/components/ui/table";
import { WeeklyResourceHeader } from './WeeklyResourceHeader';
import { useResourceAllocations } from './hooks/useResourceAllocations';
import { useCompany } from "@/context/CompanyContext";
import { ResourceTableLoadingState } from './components/ResourceTableLoadingState';
import { ResourceTableErrorState } from './components/ResourceTableErrorState';
import { EmptyResourceState } from './components/EmptyResourceState';
import { TeamMemberRows } from './components/TeamMemberRows';
import { useOfficeMembers } from './hooks/useOfficeMembers';
import { useOfficeDisplay } from './hooks/useOfficeDisplay';
import './weekly-overview.css';

interface WeeklyResourceTableProps {
  selectedWeek: Date;
  filters: {
    office: string;
  };
}

export const WeeklyResourceTable: React.FC<WeeklyResourceTableProps> = ({
  selectedWeek,
  filters
}) => {
  // Get company context
  const { company } = useCompany();
  
  // Get current user ID
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }
  });
  
  // Fetch all projects for the company
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['company-projects', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('id, code, name')
        .eq('company_id', company.id)
        .order('code');
      
      if (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!company?.id
  });
  
  // Get team members data using the hook - pass true to include inactive members
  const { teamMembers, isLoading: isLoadingMembers, error: teamMembersError } = useTeamMembersData(true);
  
  // Get pending team members (pre-registered)
  const { data: preRegisteredMembers = [], isLoading: isLoadingPending, error: pendingError } = useQuery({
    queryKey: ['preRegisteredMembers', session?.user?.id, company?.id],
    queryFn: async () => {
      if (!session?.user?.id || !company?.id) return [];
      
      // Get pre-registered members from invites table
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
      
      // Transform the pre-registered members to match team member structure
      return data.map(member => ({
        id: member.id,
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || '',
        location: member.location || null,
        weekly_capacity: member.weekly_capacity || 40
      }));
    },
    enabled: !!session?.user?.id && !!company?.id
  });

  // Get all members combined (active + pre-registered)
  const allMembers = React.useMemo(() => {
    return [...(teamMembers || []), ...(preRegisteredMembers || [])];
  }, [teamMembers, preRegisteredMembers]);

  // Get allocations from custom hook
  const { 
    getMemberAllocation, 
    handleInputChange, 
    isLoading: isLoadingAllocations,
    error: allocationsError 
  } = useResourceAllocations(allMembers, selectedWeek);
  
  // Get office display helper
  const { getOfficeDisplay } = useOfficeDisplay();
  
  // Get members organized by office
  const { membersByOffice, filteredOffices } = useOfficeMembers(allMembers, filters);

  // Determine overall loading state
  const isLoading = isLoadingSession || isLoadingMembers || isLoadingPending || 
                    isLoadingAllocations || isLoadingProjects;

  // Determine if there are any errors
  const error = teamMembersError || pendingError || allocationsError;

  if (isLoading) {
    return <ResourceTableLoadingState />;
  }

  if (error) {
    return <ResourceTableErrorState error={error} />;
  }

  if (!allMembers.length) {
    return <EmptyResourceState />;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="weekly-table-container">
        <Table className="min-w-full text-xs weekly-table">
          <WeeklyResourceHeader />
          <TableBody>
            <TeamMemberRows 
              filteredOffices={filteredOffices}
              membersByOffice={membersByOffice}
              getMemberAllocation={getMemberAllocation}
              getOfficeDisplay={getOfficeDisplay}
              handleInputChange={handleInputChange}
              projects={projects}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

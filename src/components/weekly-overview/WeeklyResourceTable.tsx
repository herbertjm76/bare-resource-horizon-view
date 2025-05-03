
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { Table, TableBody } from "@/components/ui/table";
import { WeeklyResourceHeader } from './WeeklyResourceHeader';
import { MemberTableRow } from './MemberTableRow';
import { useResourceAllocations } from './useResourceAllocations';
import { useCompany } from "@/context/CompanyContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  // Fetch office locations
  const { data: officeLocations = [], isLoading: isLoadingOffices, error: officesError } = useQuery({
    queryKey: ['officeLocations', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, code, city, country')
        .eq('company_id', company.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });

  // Determine overall loading state
  const isLoading = isLoadingSession || isLoadingMembers || isLoadingPending || isLoadingAllocations || isLoadingOffices;

  // Determine if there are any errors
  const error = teamMembersError || pendingError || allocationsError || officesError;

  // Group team members by office
  const membersByOffice = React.useMemo(() => {
    return allMembers.reduce((acc, member) => {
      const location = member.location || 'Unassigned';
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(member);
      return acc;
    }, {} as Record<string, typeof allMembers>);
  }, [allMembers]);

  // Filter by selected office if needed
  const filteredOffices = React.useMemo(() => {
    let offices = Object.keys(membersByOffice);
    
    if (filters.office !== 'all') {
      offices = offices.filter(office => office === filters.office);
    }
    
    // Sort offices alphabetically
    return offices.sort();
  }, [membersByOffice, filters.office]);

  // Helper function to get office code display name
  const getOfficeDisplay = React.useCallback((locationCode: string) => {
    const office = officeLocations.find(o => o.code === locationCode);
    return office ? `${office.code}` : locationCode;
  }, [officeLocations]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {typeof error === 'string' ? error : 'An error occurred while loading data. Please try again later.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!allMembers.length) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-2">No team members found. Add team members to see the weekly overview.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="weekly-table-container">
        <Table className="min-w-full text-xs weekly-table">
          <WeeklyResourceHeader />
          <TableBody>
            {filteredOffices.flatMap((office, officeIndex) => {
              const members = membersByOffice[office].sort((a, b) => {
                return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
              });

              return members.map((member, memberIndex) => {
                const allocation = getMemberAllocation(member.id);
                const isEven = memberIndex % 2 === 0;
                
                return (
                  <MemberTableRow
                    key={member.id}
                    member={member}
                    allocation={allocation}
                    isEven={isEven}
                    getOfficeDisplay={getOfficeDisplay}
                    onInputChange={handleInputChange}
                  />
                );
              });
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

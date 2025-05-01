
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { Table, TableBody } from "@/components/ui/table";
import { WeeklyResourceHeader } from './WeeklyResourceHeader';
import { MemberTableRow } from './MemberTableRow';
import { useResourceAllocations } from './useResourceAllocations';
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
  // Get current user ID
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }
  });
  
  // Get team members data using the hook
  const { teamMembers, isLoading } = useTeamMembersData(session?.user?.id || null);
  
  // Get pending team members (pre-registered)
  const { data: preRegisteredMembers = [], isLoading: isLoadingPending } = useQuery({
    queryKey: ['preRegisteredMembers', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // First get the company ID from the user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();
      
      if (!profile?.company_id) return [];
      
      // Get pre-registered members from invites table
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, email, department, location, job_title, role')
        .eq('company_id', profile.company_id)
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
        location: member.location || null
      }));
    },
    enabled: !!session?.user?.id
  });

  // Get allocations from custom hook - include both active and pre-registered members
  const allMembers = [...teamMembers, ...preRegisteredMembers];
  const { getMemberAllocation, handleInputChange, isLoading: isLoadingAllocations } = useResourceAllocations(allMembers, selectedWeek);

  // Fetch office locations
  const { data: officeLocations = [] } = useQuery({
    queryKey: ['officeLocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, code, city, country');
      
      if (error) throw error;
      return data;
    }
  });

  // Group team members by office
  const membersByOffice = allMembers.reduce((acc, member) => {
    const location = member.location || 'Unassigned';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(member);
    return acc;
  }, {} as Record<string, typeof allMembers>);

  // Filter by selected office if needed
  let filteredOffices = Object.keys(membersByOffice);
  if (filters.office !== 'all') {
    filteredOffices = filteredOffices.filter(office => office === filters.office);
  }

  // Sort offices alphabetically
  filteredOffices.sort();

  if (isLoading || isLoadingPending || isLoadingAllocations) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading resources...</p>
      </div>
    );
  }

  // Helper function to get office code display name
  const getOfficeDisplay = (locationCode: string) => {
    const office = officeLocations.find(o => o.code === locationCode);
    return office ? `${office.code}` : locationCode;
  };

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

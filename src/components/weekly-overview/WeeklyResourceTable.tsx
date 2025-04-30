
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

  // Get allocations from custom hook
  const { getMemberAllocation, handleInputChange } = useResourceAllocations(teamMembers);

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
  const membersByOffice = teamMembers.reduce((acc, member) => {
    const location = member.location || 'Unassigned';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(member);
    return acc;
  }, {} as Record<string, typeof teamMembers>);

  // Filter by selected office if needed
  let filteredOffices = Object.keys(membersByOffice);
  if (filters.office !== 'all') {
    filteredOffices = filteredOffices.filter(office => office === filters.office);
  }

  // Sort offices alphabetically
  filteredOffices.sort();

  if (isLoading) {
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
};
